---
title: "Monitor external resources with proxy entities"
linkTitle: "Monitor External Resources"
guide_title: "Monitor external resources with proxy entities"
type: "guide"
description: "Use Sensu's proxy entities to monitor external resources on systems and devices where you cannot install a Sensu agent, like a network switch or a website."
weight: 30
version: "6.9"
product: "Sensu Go"
platformContent: false
menu: 
  sensu-go-6.9:
    parent: observe-entities
---

Proxy entities allow Sensu to monitor external resources on systems and devices where a Sensu agent cannot be installed, like a network switch or a website.
You can create [proxy entities][1] with [sensuctl][8], the [Sensu API][9], and the [`proxy_entity_name` check attribute][2].
When executing checks that include a `proxy_entity_name` or `proxy_requests` attribute, Sensu agents report the resulting event under the proxy entity instead of the agent entity.

This guide explains how to use a proxy entity to monitor website status and includes two methods for configuring the required Sensu resources:

- Follow the [Sensu Catalog integration method][27] to configure the resources you need directly in Sensu web UI.
- Follow the [command line configuration method][28] to manually create the Sensu resources you need.

This guide also explains how to use [proxy checks to monitor a group of websites][29], with command line configuration instructions.

## Requirements

To follow this guide, install the Sensu [backend][19], make sure at least one Sensu [agent][31] is running, and configure [sensuctl][30] to connect to the backend as the [`admin` user][32].

## Use a proxy entity to monitor a website (Sensu Catalog configuration)

Follow the steps in this section to use a Sensu Catalog integration to configure status monitoring for https://sensu.io/.
You'll configure a check with a proxy entity name and Sensu will create an entity to represent https://sensu.io/ and report the status of the site under this entity.

The Sensu Catalog is part of the Sensu web UI, so you can complete all the necessary configuration directly from your browser.

### Configure a Sensu entity

To run the proxy entity check, you'll need a Sensu agent entity with the subscription `run_proxies`.
Here's how to add the subscription:

1. In the web UI, navigate to the Entities page.

2. Click the agent entity you want to use to run your check.

3. At the top right corner of the individual entity's page, click **EDIT** to open the Edit Entity dialog.

4. Under **Schedule**, type `run_proxies` in the Subscriptions and press **Return**.

5. Click **SUBMIT** to save your changes.

On the Entities page and the individual page for the entity, the listed subscriptions should now include `run_proxies`.

### Create the check with a Sensu Catalog integration

With your entity subscription configured, you can use the Sensu Catalog to create the check you need to monitor https://sensu.io/.

1. In the web UI, navigate to the Catalog page.

2. In the catalog menu on the left, click **Service monitoring** and click the **HTTP Endpoint Monitoring (Remote)** integration.

3. At the top right corner of the page, click **INSTALL...** to open the HTTP Endpoint Configuration dialog page.

4. In the HTTP Endpoint Configuration dialog page, update the values in the `HTTP Endpoint Host` and `Interval` fields:

    - HTTP Endpoint Host: type `sensu.io`
    - Interval: type `15`

    After you update the values, click **NEXT**.

5. In the Configure Sensu Subscriptions dialog page, type `run_proxies` in the Subscriptions field and press **Return**.
After you add the subscription, click **NEXT**.

8. The HTTP Endpoint Monitoring (Remote) integration in the Sensu Catalog includes a dialog page for adding pipelines to filter and handle your check's events.
If you already have a pipeline to use, you can add it now.
Otherwise, click **NEXT** to skip this step.

9. The Summary dialog page lists definitions for the resources that the integration will add.

    Installing the HTTP Endpoint Monitoring (Remote) integration will add the following resources to your Sensu instance:

    - The `sensu/http-checks` dynamic runtime asset
    - Two checks: one to produce endpoint status events and one to collect endpoint metrics
    
    Click the down-arrow next to any resource to view its complete definition in YAML or JSON format.

10. Click **APPLY** to save the asset and check definitions for the integration.

11. Click **FINISH** to return to the integration page.

### Validate the check

To make sure that the monitoring check is working properly, confirm that Sensu created an entity to represent sensu.io and the `http-endpoint-healthcheck` check is producing events.

1. In the web UI, navigate to the Entities page.

2. Confirm that the Entities page lists a proxy entity named `sensu.io`.

    {{< figure src="/images/go/monitor_external_resources/confirm_proxy_entity_690.png" alt="Confirm the sensu.io proxy entity is listed on the Entities page" link="/images/go/monitor_external_resources/confirm_proxy_entity_690.png" target="_blank" >}}

3. Click the `sensu.io` entity to open the individual entity page.

4. Confirm that the individual entity page for `sensu.io` lists an event for the `sensu.io-https-endpoint-healthcheck` check.
Click the event for details and history.

    {{< figure src="/images/go/monitor_external_resources/confirm_event.png" alt="Confirm that the sensu.io-https-endpoint-healthcheck check is producing events" link="/images/go/monitor_external_resources/confirm_event.png" target="_blank" >}}

## Use a proxy entity to monitor a website (command line configuration)

In this section, you'll use sensuctl to configure a check with a **proxy entity name** to monitor the status of https://sensu.io/ so that Sensu creates an entity that represents the site and reports the status of the site under this entity.

### Configure a Sensu entity

To run the check, you'll need a Sensu agent entity with the subscription `run_proxies`.
Use sensuctl to add the `run_proxies` subscription to the entity the Sensu agent is observing.

{{% notice note %}}
**NOTE**: To find your entity name, run `sensuctl entity list`.
The `ID` is the name of your entity.
{{% /notice %}}

Before you run the following code, replace `<ENTITY_NAME>` with the name of the entity on your system.

{{< code shell >}}
sensuctl entity update <ENTITY_NAME>
{{< /code >}}

- For `Entity Class`, press enter.
- For `Subscriptions`, type `run_proxies` and press enter.

Before you continue, confirm both Sensu services are running:

{{< code shell >}}
systemctl status sensu-backend && systemctl status sensu-agent
{{< /code >}}

The response should indicate `active (running)` for both the Sensu backend and agent.

### Register dynamic runtime asset

To power the check for https://sensu.io/ status, you'll use the sensu/http-checks dynamic runtime asset.
This community-tier asset includes the http status command that your check will rely on.

Use `sensuctl asset add` to register the dynamic runtime asset:

{{< code shell >}}
sensuctl asset add sensu/http-checks:0.5.0 -r http-checks
{{< /code >}}

The response will indicate that the asset was added:

{{< code text >}}
fetching bonsai asset: sensu/http-checks:0.5.0
added asset: sensu/http-checks:0.5.0

You have successfully added the Sensu asset resource, but the asset will not get downloaded until
it's invoked by another Sensu resource (ex. check). To add this runtime asset to the appropriate
resource, populate the "runtime_assets" field with ["http-checks"].
{{< /code >}}

This example uses the `-r` (rename) flag to specify a shorter name for the dynamic runtime asset: `http-checks`.

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

### Create the check

Now that the dynamic runtime asset is registered, you can create a check named `check-sensu-site` to run the command `http-check --url https://sensu.io` with the sensu/http-checks dynamic runtime asset, at an interval of 15 seconds, for all agents subscribed to the `run_proxies` subscription, using the `sensu-site` proxy entity name.

The check includes the `round_robin` attribute set to `true` to distribute the check execution across all agents subscribed to the `run_proxies` subscription and avoid duplicate events.

To create the `check-sensu-site` check, run:

{{< language-toggle >}}

{{< code shell "YML" >}}
cat << EOF | sensuctl create
---
type: CheckConfig
api_version: core/v2
metadata:
  name: check-sensu-site
spec:
  command: http-check --url https://sensu.io
  interval: 15
  proxy_entity_name: sensu-site
  publish: true
  round_robin: true
  runtime_assets:
  - http-checks
  subscriptions:
  - run_proxies
EOF
{{< /code >}}

{{< code shell "JSON" >}}
cat << EOF | sensuctl create
{
  "type": "CheckConfig",
  "api_version": "core/v2",
  "metadata": {
    "name": "check-sensu-site"
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
      "run_proxies"
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
        Name                      Command                Interval   Cron   Timeout   TTL   Subscriptions   Handlers     Assets      Hooks   Publish?   Stdin?   Metric Format   Metric Handlers  
─────────────────── ─────────────────────────────────── ────────── ────── ───────── ───── ─────────────── ────────── ───────────── ─────── ────────── ──────── ─────────────── ──────────────────
  check-sensu-site   http-check --url https://sensu.io         15                0     0   proxy                      http-checks           true       false                                      
{{< /code >}}

### Validate the check

Use sensuctl to confirm that Sensu created `sensu-site`.
It might take a few moments for Sensu to execute the check and create the proxy entity.

{{< code shell >}}
sensuctl entity list
{{< /code >}}

The response should list the `sensu-site` proxy entity:

{{< code text >}}
       ID        Class    OS           Subscriptions                   Last Seen            
─────────────── ─────── ─────── ─────────────────────────── ────────────────────────────────
  sensu-centos   agent   linux   proxy,entity:sensu-centos   2021-10-21 19:20:04 +0000 UTC  
  sensu-site     proxy           entity:sensu-site           N/A                          
{{< /code >}}

Then, use sensuctl to confirm that Sensu is monitoring `sensu-site` with the `check-sensu-site` check:

{{< code shell >}}
sensuctl event info sensu-site check-sensu-site
{{< /code >}}

The response should list `check-sensu-site` status and history data for the `sensu-site` proxy entity:

{{< code text >}}
=== sensu-site - check-sensu-site
Entity:    sensu-site
Check:     check-sensu-site
Output:    http-check OK: HTTP Status 200 for https://sensu.io
Status:    0
History:   0
Silenced:  false
Timestamp: 2021-10-21 19:20:06 +0000 UTC
UUID:      xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
{{< /code >}}

You can also view the new proxy entity in your Sensu web UI.

## Use proxy requests to monitor a group of websites (command line configuration)

Suppose that instead of monitoring just sensu.io, you want to monitor multiple sites, like docs.sensu.io, packagecloud.io, and github.com.
In this section, you'll use sensuctl to configure the `proxy_requests` check attribute, entity labels, and token substitution required to monitor three sites with the same check.

Before you start, use `sensuctl asset add` to register the sensu/http-checks dynamic runtime asset if you haven't already:

{{< code shell >}}
sensuctl asset add sensu/http-checks:0.5.0 -r http-checks
{{< /code >}}

Also, add the `run_proxies` subscription to a Sensu agent entity.
Replace `<ENTITY_NAME>` with the name of the entity on your system:

{{< code shell >}}
sensuctl entity update <ENTITY_NAME>
{{< /code >}}

- For `Entity Class`, press enter.
- For `Subscriptions`, type `run_proxies` and press enter.

### Create proxy entities

Instead of creating a proxy entity using the `proxy_entity_name` check attribute, use sensuctl to create proxy entities to represent the three sites you want to monitor.
Your proxy entities need the `entity_class` attribute set to `proxy` to mark them as proxy entities as well as a few custom `labels` to identify them as a group and pass in individual URLs.

To add the proxy entity definitions, run:

{{< language-toggle >}}

{{< code shell "YML" >}}
cat << EOF | sensuctl create
---
type: Entity
api_version: core/v2
metadata:
  name: sensu-docs
  labels:
    proxy_type: website
    url: https://docs.sensu.io
spec:
  entity_class: proxy
---
type: Entity
api_version: core/v2
metadata:
  name: packagecloud-site
  labels:
    proxy_type: website
    url: https://packagecloud.io
spec:
  entity_class: proxy
---
type: Entity
api_version: core/v2
metadata:
  name: github-site
  labels:
    proxy_type: website
    url: https://github.com
spec:
  entity_class: proxy
EOF
{{< /code >}}

{{< code shell "JSON" >}}
cat << EOF | sensuctl create
{
  "type": "Entity",
  "api_version": "core/v2",
  "metadata": {
    "name": "sensu-docs",
    "labels": {
      "proxy_type": "website",
      "url": "https://docs.sensu.io"
    }
  },
  "spec": {
    "entity_class": "proxy"
  }
}
{
  "type": "Entity",
  "api_version": "core/v2",
  "metadata": {
    "name": "packagecloud-site",
    "labels": {
      "proxy_type": "website",
      "url": "https://packagecloud.io"
    }
  },
  "spec": {
    "entity_class": "proxy"
  }
}
{
  "type": "Entity",
  "api_version": "core/v2",
  "metadata": {
    "name": "github-site",
    "labels": {
      "proxy_type": "website",
      "url": "https://github.com"
    }
  },
  "spec": {
    "entity_class": "proxy"
  }
}
EOF
{{< /code >}}

{{< /language-toggle >}}

{{% notice protip %}}
**PRO TIP**: When you create proxy entities, you can add any custom labels that make sense for your environment.
For example, when monitoring a group of routers, you may want to add `ip_address` labels.
{{% /notice %}}

Use sensuctl to confirm that the entities were added:

{{< code shell >}}
sensuctl entity list
{{< /code >}}

The response should list the new `sensu-docs`, `packagecloud-site`, and `github-site` proxy entities:

{{< code text >}}
         ID           Class    OS           Subscriptions                   Last Seen            
──────────────────── ─────── ─────── ─────────────────────────── ────────────────────────────────
  github-site         proxy                                       N/A                            
  packagecloud-site   proxy                                       N/A                            
  sensu-centos        agent   linux   proxy,entity:sensu-centos   2021-10-21 19:23:04 +0000 UTC  
  sensu-docs          proxy                                       N/A                            
  sensu-site          proxy           entity:sensu-site           N/A                             
{{< /code >}}

### Create a reusable HTTP check

Now that you have three proxy entities set up, each with a `proxy_type` and `url` label, you can use proxy requests and token substitution to create a single check that monitors all three sites.

The check includes the `round_robin` attribute set to `true` to distribute the check execution across all agents subscribed to the `run_proxies` subscription and avoid duplicate events.

To create the following check definition, run:

{{< language-toggle >}}

{{< code shell "YML" >}}
cat << EOF | sensuctl create
---
type: CheckConfig
api_version: core/v2
metadata:
  name: check-http
spec:
  command: 'http-check --url {{ .labels.url }}'
  interval: 15
  proxy_requests:
    entity_attributes:
      - entity.entity_class == 'proxy'
      - entity.labels.proxy_type == 'website'
  publish: true
  round_robin: true
  runtime_assets:
    - http-checks
  subscriptions:
    - run_proxies
EOF
{{< /code >}}

{{< code shell "JSON" >}}
cat << EOF | sensuctl create
{
  "type": "CheckConfig",
  "api_version": "core/v2",
  "metadata": {
    "name": "check-http"
  },
  "spec": {
    "command": "http-check --url {{ .labels.url }}",
    "interval": 15,
    "proxy_requests": {
      "entity_attributes": [
        "entity.entity_class == 'proxy'",
        "entity.labels.proxy_type == 'website'"
      ]
    },
    "publish": true,
    "runtime_assets": [
      "http-checks"
    ],
    "round_robin": true,
    "subscriptions": [
      "run_proxies"
    ]
  }
}
EOF
{{< /code >}}

{{< /language-toggle >}}

Your `check-http` check uses the `proxy_requests` attribute to specify the applicable entities.
In this case, you want to run the `check-http` check on all entities of entity class `proxy` and proxy type `website`.
Because you're using this check to monitor multiple sites, the check command uses token substitution to apply the correct `url`.

Use sensuctl to confirm that Sensu created the check:

{{< code shell >}}
sensuctl check list
{{< /code >}}

The response should include the `check-http` check:

{{< code text >}}
        Name                      Command                 Interval   Cron   Timeout   TTL   Subscriptions   Handlers     Assets      Hooks   Publish?   Stdin?   Metric Format   Metric Handlers  
─────────────────── ──────────────────────────────────── ────────── ────── ───────── ───── ─────────────── ────────── ───────────── ─────── ────────── ──────── ─────────────── ──────────────────
  check-http         http-check --url {{ .labels.url }}         15                0     0   proxy                      http-checks           true       false                                     
  check-sensu-site   http-check --url https://sensu.io          15                0     0   proxy                      http-checks           true       false                                      
{{< /code >}}

### Validate the check

Use sensuctl to confirm that Sensu is monitoring docs.sensu.io, packagecloud.io, and github.com with the `check-http` check, returning a status of `0` (OK):

{{< code shell >}}
sensuctl event list
{{< /code >}}

The response should list check status data for the `sensu-docs`, `packagecloud-site`, and `github-site` proxy entities:

{{< code text >}}
       Entity              Check                                         Output                                   Status   Silenced             Timestamp                             UUID                  
──────────────────── ────────────────── ──────────────────────────────────────────────────────────────────────── ──────── ────────── ─────────────────────────────── ───────────────────────────────────────
  github-site         check-http         http-check OK: HTTP Status 200 for https://github.com                         0   false      2021-10-21 19:27:04 +0000 UTC   xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx  
                                                                                                                                                                                                            
  packagecloud-site   check-http         http-check OK: HTTP Status 200 for https://packagecloud.io                    0   false      2021-10-21 19:27:04 +0000 UTC   xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx  
                                                                                                                                                                                                            
  sensu-centos        keepalive          Keepalive last sent from sensu-centos at 2021-10-21 19:27:44 +0000 UTC        0   false      2021-10-21 19:27:44 +0000 UTC   xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx  
  sensu-docs          check-http         http-check OK: HTTP Status 200 for https://docs.sensu.io                      0   false      2021-10-21 19:27:03 +0000 UTC   xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx  
                                                                                                                                                                                                            
  sensu-site          check-sensu-site   http-check OK: HTTP Status 200 for https://sensu.io                           0   false      2021-10-21 19:27:05 +0000 UTC   xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx  
{{< /code >}}

## What's next

Now that you know how to run proxy checks to verify website status, you can receive alerts based on the events your checks create.
Configure three more Sensu resources to start receiving alerts:

- [Event filters][17], which the Sensu backend will apply to the observation data in events. Sensu then sends any events the filters do not remove for processing.
- [Handlers][22], which process the events that filters do not remove.
- [Pipelines][23], which are Sensu resources composed of observation event processing workflows made up of filters, mutators, and handlers. When you list a pipeline in a check definition, all the observability events that the check produces will be processed according to the pipeline’s workflows.

Follow any of these guides to learn how to configure event filters, handlers, and pipelines and start sending alerts based on event data:

* [Send email alerts with a pipeline][5]
* [Send PagerDuty alerts with Sensu][6]
* [Send Slack alerts with a pipeline][7]

You can also send metrics and status data to [Sumo Logic][33].

Read more about the Sensu features you used in this guide:

- [Sensu Catalog][25]
- [Dynamic runtime assets][13] and [sensu/http-checks][16]
- [Proxy checks][3]
- [Round robin checks][18]
- [Token substitution][12]
- [Entity labels][11]
- [sensuctl][8]

The files you created with check and entity definitions can become part of your [monitoring as code][4] repository.
Storing your Sensu configurations the same way you would store code means they are portable and repeatable.
Monitoring as code makes it possible to move to a more robust deployment without losing what you’ve started here and reproduce one environment’s configuration in another.


[1]: ../../observe-entities/#proxy-entities
[2]: ../../observe-schedule/checks/#proxy-entity-name-attribute
[3]: ../../observe-schedule/checks/#proxy-checks
[4]: ../../../operations/monitoring-as-code/
[5]: ../../observe-process/send-email-alerts/
[6]: ../../observe-process/send-pagerduty-alerts/
[7]: ../../observe-process/send-slack-alerts/
[8]: ../../../sensuctl/
[9]: ../../../api/core/entities/
[10]: ../../../web-ui/
[11]: ../../observe-entities/entities#manage-entity-labels
[12]: ../../observe-schedule/tokens/
[13]: ../../../plugins/assets/
[14]: #configure-a-sensu-entity
[15]: #create-the-check
[16]: https://bonsai.sensu.io/assets/sensu/http-checks
[17]: ../../observe-filter/filters/
[18]: ../../observe-schedule/checks#round-robin-checks
[19]: ../../../operations/deploy-sensu/install-sensu/#install-the-sensu-backend
[20]: ../../observe-schedule/agent#restart-the-service
[21]: ../../../sensuctl/sensuctl-bonsai/#install-dynamic-runtime-asset-definitions
[22]: ../../observe-process/handlers/
[23]: ../../observe-process/pipelines/
[24]: https://sensu.io
[25]: ../../../catalog/sensu-catalog/
[26]: ../../../web-ui/view-manage-resources/#manage-entities
[27]: #use-a-proxy-entity-to-monitor-a-website-sensu-catalog-configuration
[28]: #use-a-proxy-entity-to-monitor-a-website-command-line-configuration
[29]: #use-proxy-requests-to-monitor-a-group-of-websites-command-line-configuration
[30]: ../../../operations/deploy-sensu/install-sensu/#install-sensuctl
[31]: ../../../operations/deploy-sensu/install-sensu/#install-sensu-agents
[32]: ../../../operations/control-access/rbac/#default-users
[33]: ../../observe-process/send-data-sumo-logic/
