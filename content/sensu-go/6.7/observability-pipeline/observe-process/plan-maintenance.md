---
title: "Plan maintenance windows with silencing"
linkTitle: "Plan Maintenance Windows"
guide_title: "Plan maintenance windows with silencing"
type: "guide"
description: "Use Sensu's silencing feature to suppress event handling during system maintenance so you can coordinate and perform maintenance without getting alerts."
weight: 140
version: "6.7"
product: "Sensu Go"
platformContent: false
menu: 
  sensu-go-6.7:
    parent: observe-process
---

As the Sensu backend processes check results, the server executes [handlers][1] to send alerts or otherwise relay observation events and metrics data to external services.
Sensu’s built-in [silencing][7] capability allows you to suppress event handler execution as needed.
This feature is useful when you're planning maintenance.

You can configure silences to prevent handlers from taking actions based on check name, entity subscription, entity name, or a combination of these factors.
In this guide, you'll create a silenced entry for a specific entity and its associated check to prevent alerts and create a time window for maintenance.

## Requirements

To follow this guide, install the Sensu [backend][10], make sure at least one Sensu [agent][21] is running, and configure [sensuctl][22] to connect to the backend as the [`admin` user][23].

{{% notice note %}}
**NOTE**: If you already have an entity and running check to use as the silencing target, skip ahead to [Create the silenced entry](#create-the-silenced-entry).
{{% /notice %}}

## Configure a Sensu entity

Before you create a check, you'll need a Sensu entity with the subscription `website` to run the check.
Use sensuctl to add the `website` subscription to an entity the Sensu agent is observing.

{{% notice note %}}
**NOTE**: To find your entity name, run `sensuctl entity list`.
The `ID` is the name of your entity.
{{% /notice %}}

Before you run the following code, replace `<ENTITY_NAME>` with the name of the entity on your system.

{{< code shell >}}
sensuctl entity update <ENTITY_NAME>
{{< /code >}}

- For `Entity Class`, press enter.
- For `Subscriptions`, type `website` and press enter.

Before you continue, confirm both Sensu services are running:

{{< code shell >}}
systemctl status sensu-backend && systemctl status sensu-agent
{{< /code >}}

The response should indicate `active (running)` for both the Sensu backend and agent.

## Register the http-checks dynamic runtime asset

To power the check in your silenced entry, you'll use the sensu/http-checks dynamic runtime asset.
This community-tier asset includes `http-check`, the http status check command that your check will rely on.

Register the sensu/http-checks dynamic runtime asset:

{{< code shell >}}
sensuctl asset add sensu/http-checks:0.5.0 -r http-checks
{{< /code >}}

This example uses the `-r` (rename) flag to specify a shorter name for the dynamic runtime asset: `http-checks`.
The response will indicate that the asset was added.

Use sensuctl to confirm that the dynamic runtime asset is ready to use:

{{< code shell >}}
sensuctl asset list
{{< /code >}}

The response should list the sensu/http-checks dynamic runtime asset (renamed to `http-checks`):

{{< code text >}}
     Name                                       URL                                    Hash    
────────────── ───────────────────────────────────────────────────────────────────── ──────────
  http-checks   //assets.bonsai.sensu.io/.../http-checks_0.5.0_windows_amd64.tar.gz   52ae075  
  http-checks   //assets.bonsai.sensu.io/.../http-checks_0.5.0_darwin_amd64.tar.gz    72d0f15  
  http-checks   //assets.bonsai.sensu.io/.../http-checks_0.5.0_linux_armv7.tar.gz     ef18587  
  http-checks   //assets.bonsai.sensu.io/.../http-checks_0.5.0_linux_arm64.tar.gz     3504ddf  
  http-checks   //assets.bonsai.sensu.io/.../http-checks_0.5.0_linux_386.tar.gz       60b8883  
  http-checks   //assets.bonsai.sensu.io/.../http-checks_0.5.0_linux_amd64.tar.gz     1db73a8 
{{< /code >}}

{{% notice note %}}
**NOTE**: Sensu does not download and install dynamic runtime asset builds onto the system until they are needed for command execution.
{{% /notice %}}

## Create the check

With the dynamic runtime asset registered, you can create a check named `check-website` to run the command `http-check --url https://sensu.io`, at an interval of 15 seconds, for all agents subscribed to the `website` subscription, using the `sensu-site` proxy entity name.

To add the check, run:

{{< language-toggle >}}

{{< code shell "YML" >}}
cat << EOF | sensuctl create
---
type: CheckConfig
api_version: core/v2
metadata:
  name: check-website
spec:
  command: http-check --url https://sensu.io
  interval: 15
  proxy_entity_name: sensu-site
  publish: true
  round_robin: true
  runtime_assets:
  - http-checks
  subscriptions:
  - website
EOF
{{< /code >}}

{{< code shell "JSON" >}}
cat << EOF | sensuctl create
{
  "type": "CheckConfig",
  "api_version": "core/v2",
  "metadata": {
    "name": "check-website"
  },
  "spec": {
    "command": "http-check --url https://sensu.io",
    "interval": 15,
    "proxy_entity_name": "sensu-site",
    "publish": true,
    "round_robin": true,
    "runtime_assets": [
      "http-checks"
    ],
    "subscriptions": [
      "website"
    ]
  }
}
EOF
{{< /code >}}

{{< /language-toggle >}}

Use sensuctl to confirm that Sensu added the check:

{{< code shell >}}
sensuctl check list
{{< /code >}}

The response should list `check-sensu-site`:

{{< code text >}}
      Name                     Command                Interval   Cron   Timeout   TTL   Subscriptions   Handlers     Assets      Hooks   Publish?   Stdin?   Metric Format   Metric Handlers  
──────────────── ─────────────────────────────────── ────────── ────── ───────── ───── ─────────────── ────────── ───────────── ─────── ────────── ──────── ─────────────── ──────────────────
  check-website   http-check --url https://sensu.io         15                0     0   website                    http-checks           true       false                                     
{{< /code >}}

## Create the silenced entry

The silenced entry will silence the check `check-http` on the entity `sensu-site` for a planned maintenance window that:
- Starts at **04:00** UTC on **March 14, 2022**
- Automatically ends **1 hour** later
- Adds your username as the **creator** of the silenced entry

To create the silenced entry, run:

{{< code shell >}}
sensuctl silenced create \
--subscription 'entity:sensu-site' \
--check 'check-http' \
--begin '2022-03-14 04:00:00 -00:00' \
--expire 3600 \
--reason 'Planned site maintenance'
{{< /code >}}

Use sensuctl to verify that the silenced entry against the entity `sensu-site` was created properly:

{{< language-toggle >}}

{{< code shell "YML" >}}
sensuctl silenced info 'entity:sensu-site:check-http' --format yaml
{{< /code >}}

{{< code shell "JSON" >}}
sensuctl silenced info 'entity:sensu-site:check-http' --format wrapped-json
{{< /code >}}

{{< /language-toggle >}}

The response will list the silenced resource definition, similar to the following:

{{< language-toggle >}}

{{< code yml >}}
type: Silenced
api_version: core/v2
metadata:
  name: entity:sensu-site:check-http
spec:
  begin: 1647230400
  check: check-http
  creator: admin
  expire: 3600
  expire_at: 1647234000
  expire_on_resolve: false
  reason: Planned site maintenance
  subscription: entity:sensu-site
{{< /code >}}

{{< code json >}}
{
  "type": "Silenced",
  "api_version": "core/v2",
  "metadata": {
    "name": "entity:sensu-site:check-http"
  },
  "spec": {
    "begin": 1647230400,
    "check": "check-http",
    "creator": "admin",
    "expire": 3600,
    "expire_at": 1647234000,
    "expire_on_resolve": false,
    "reason": "Planned site maintenance",
    "subscription": "entity:sensu-site"
  }
}
{{< /code >}}

{{< /language-toggle >}}

## What's next

When your silence goes into effect at the designated `begin` time, you will still see events for `check-http` on the `sensu-site` entity in the Sensu web UI.
This is because **silences do not stop events from being produced &mdash; they stop events from being handled**.

If you followed this guide to create the `check-http` check on the `sensu-site` entity, you might have noticed that the check does not include a [pipeline][14].
To observe the silenced entry's effect, add a pipeline to the `check-http` check definition (or recreate the [silenced entry][15] with your own entity and a check that includes a pipeline).
The pipeline must include a workflow with the built-in [`not_silenced`][13] event filter and a handler.

{{% notice warning %}}
**WARNING**: By default, silenced events will be handled unless the pipeline workflow includes the built-in [`not_silenced`](../../observe-filter/filters/#built-in-filter-not_silenced) event filter to discard silenced events.
{{% /notice %}}

Follow one of these guides to add a pipeline to your check:

- [Send email alerts with a pipeline][17]
- [Send PagerDuty alerts with Sensu][18]
- [Send Slack alerts with a pipeline][19]

Read the [silencing reference][7] for in-depth documentation about silenced entries and more examples for other silencing scenarios.

Learn more about the [sensu/http-checks][12] [dynamic runtime asset][24].

The example in this guide uses [RFC 3339 format][25] with space delimiters and numeric zone offset, but sensuctl supports several [time formats][26] for the `begin` flag.


[1]: ../handlers/
[2]: ../silencing/#silencing-examples
[3]: ../silencing/#silence-a-specific-check-on-a-specific-entity
[4]: ../silencing/#silence-all-checks-with-a-specific-subscription
[5]: ../silencing/#silence-a-specific-check-on-entities-with-a-specific-subscription
[6]: ../silencing/#silence-a-specific-check-on-every-entity
[7]: ../silencing/
[8]: ../../../sensuctl/create-manage-resources/#time-formats
[9]: ../silencing/#silence-all-checks-for-entities-with-a-specific-subscription
[10]: ../../../operations/deploy-sensu/install-sensu/#install-the-sensu-backend
[11]: #create-the-check
[12]: https://bonsai.sensu.io/assets/sensu/http-checks
[13]: ../../observe-filter/filters/#built-in-filter-not_silenced
[14]: ../pipelines/
[15]: #create-the-silenced-entry
[16]: ../send-data-sumo-logic/
[17]: ../send-email-alerts/
[18]: ../send-pagerduty-alerts/
[19]: ../send-slack-alerts/
[20]: https://www.ietf.org/rfc/rfc3339.txt
[21]: ../../../operations/deploy-sensu/install-sensu/#install-sensu-agents
[22]: ../../../operations/deploy-sensu/install-sensu/#install-sensuctl
[23]: ../../../operations/control-access/rbac/#default-users
[24]: ../../../plugins/assets/
[25]: https://www.ietf.org/rfc/rfc3339.txt
[26]: ../../../sensuctl/create-manage-resources/#time-formats
