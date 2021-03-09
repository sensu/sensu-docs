---
title: "Monitor server resources with checks"
linkTitle: "Monitor Server Resources"
guide_title: "Monitor server resources with checks"
type: "guide"
description: "Sensu lets you monitor server resources with checks. Read this guide to learn about Sensu checks and how to use checks to monitor a service."
weight: 40
version: "6.2"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-6.2:
    parent: observe-schedule
---

Sensu checks are **commands** (or scripts) the Sensu agent executes that output data and produce an exit code to indicate a state.
Sensu checks use the same specification as **Nagios**, so you can use Nagios check plugins with Sensu.

You can use checks to monitor server resources, services, and application health (for example, to check whether Nginx is running) and collect and analyze metrics (for example, to learn how much disk space you have left).

This guide will help you monitor server resources (specifically, CPU usage) by configuring a check named `check-cpu` with a subscription named `system` to target all entities that are subscribed to the `system` subscription.
To use this guide, you'll need to install a Sensu backend and have at least one Sensu agent running on Linux.

## Register dynamic runtime assets

To power the check, you'll use the [Sensu CPU Checks][1] dynamic runtime asset.
The Sensu CPU Checks asset includes the `check-cpu.rb` plugin, which [your check][10] will rely on.

The Sensu assets packaged from Sensu CPU Checks are built against the Sensu Ruby runtime environment, so you also need to add the [Sensu Ruby Runtime][7] dynamic runtime asset.
The Sensu Ruby Runtime asset delivers the Ruby executable and supporting libraries the check will need to run the `check-cpu.rb` plugin.

Use [`sensuctl asset add`][9] to register the Sensu CPU Checks dynamic runtime asset, `sensu-plugins/sensu-plugins-cpu-checks:4.1.0`:

{{< code shell >}}
sensuctl asset add sensu-plugins/sensu-plugins-cpu-checks:4.1.0 -r cpu-checks-plugins
{{< /code >}}

The response will confirm that the asset was added:

{{< code shell >}}
fetching bonsai asset: sensu-plugins/sensu-plugins-cpu-checks:4.1.0
added asset: sensu-plugins/sensu-plugins-cpu-checks:4.1.0

You have successfully added the Sensu asset resource, but the asset will not get downloaded until
it's invoked by another Sensu resource (ex. check). To add this runtime asset to the appropriate
resource, populate the "runtime_assets" field with ["cpu-checks-plugins"].
{{< /code >}}

This example uses the `-r` (rename) flag to specify a shorter name for the dynamic runtime asset: `cpu-checks-plugins`.

You can also download the dynamic runtime asset definition for Debian or Alpine from [Bonsai][1] and register the asset with `sensuctl create --file filename.yml`.

Then, use the following sensuctl example to register the Sensu Ruby Runtime dynamic runtime asset, `sensu/sensu-ruby-runtime:0.0.10`:

{{< code shell >}}
sensuctl asset add sensu/sensu-ruby-runtime:0.0.10 -r sensu-ruby-runtime
{{< /code >}}

The response will confirm that the asset was added:

{{< code shell >}}
fetching bonsai asset: sensu/sensu-ruby-runtime:0.0.10
added asset: sensu/sensu-ruby-runtime:0.0.10

You have successfully added the Sensu asset resource, but the asset will not get downloaded until
it's invoked by another Sensu resource (ex. check). To add this runtime asset to the appropriate
resource, populate the "runtime_assets" field with ["sensu-ruby-runtime"].
{{< /code >}}

You can also download the dynamic runtime asset definition from [Bonsai][7] and register the asset using `sensuctl create --file filename.yml`.

To confirm that both dynamic runtime assets are ready to use:

{{< code shell >}}
sensuctl asset list
{{< /code >}}

The response should list the `cpu-checks-plugins` and `sensu-ruby-runtime` dynamic runtime assets:

{{< code shell >}}
          Name                                                URL                                       Hash    
────────────────────────── ─────────────────────────────────────────────────────────────────────────── ───────── 
 cpu-checks-plugins   //assets.bonsai.sensu.io/.../sensu-plugins-cpu-checks_4.1.0_centos_linux_amd64.tar.gz          518e7c1  
 sensu-ruby-runtime         //assets.bonsai.sensu.io/.../sensu-ruby-runtime_0.0.10_ruby-2.4.4_centos_linux_amd64.tar.gz     338b88b 
{{< /code >}}

{{% notice note %}}
**NOTE**: Sensu does not download and install dynamic runtime asset builds onto the system until they are needed for command execution.
Read [the asset reference](../../../plugins/assets#dynamic-runtime-asset-builds) for more information about dynamic runtime asset builds.
{{% /notice %}}

## Create a check

Now that the dynamic runtime assets are registered, create a check named `check-cpu` that runs the command `check-cpu.rb -w 75 -c 90` with the `cpu-checks-plugins` and `sensu-ruby-runtime` dynamic runtime assets at an interval of 60 seconds for all entities subscribed to the `system` subscription.
This check generates a warning event (`-w`) when CPU usage reaches 75% and a critical alert (`-c`) at 90%.

{{< code shell >}}
sensuctl check create check-cpu \
--command 'check-cpu.rb -w 75 -c 90' \
--interval 60 \
--subscriptions system \
--runtime-assets cpu-checks-plugins,sensu-ruby-runtime
{{< /code >}}

You should see a confirmation message:

{{< code shell >}}
Created
{{< /code >}}

To view the complete resource definition for `check-cpu`, run:

{{< language-toggle >}}

{{< code shell "YML" >}}
sensuctl check info check-cpu --format yaml
{{< /code >}}

{{< code shell "JSON" >}}
sensuctl check info check-cpu --format json
{{< /code >}}

{{< /language-toggle >}}

The sensuctl response will include the complete `check-cpu` resource definition in the specified format:

{{< language-toggle >}}

{{< code yml >}}
---
type: CheckConfig
api_version: core/v2
metadata:
  created_by: admin
  name: check-cpu
  namespace: default
spec:
  check_hooks: null
  command: check-cpu.rb -w 75 -c 90
  env_vars: null
  handlers:
  - slack
  high_flap_threshold: 0
  interval: 60
  low_flap_threshold: 0
  output_metric_format: ""
  output_metric_handlers: null
  proxy_entity_name: ""
  publish: true
  round_robin: false
  runtime_assets:
  - cpu-checks-plugins
  - sensu-ruby-runtime
  secrets: null
  stdin: false
  subdue: null
  subscriptions:
  - system
  timeout: 0
  ttl: 0
{{< /code >}}

{{< code json >}}
{
  "type": "CheckConfig",
  "api_version": "core/v2",
  "metadata": {
    "created_by": "admin",
    "name": "check-cpu",
    "namespace": "default"
  },
  "spec": {
    "check_hooks": null,
    "command": "check-cpu.rb -w 75 -c 90",
    "env_vars": null,
    "handlers": [
      "slack"
    ],
    "high_flap_threshold": 0,
    "interval": 60,
    "low_flap_threshold": 0,
    "output_metric_format": "",
    "output_metric_handlers": null,
    "proxy_entity_name": "",
    "publish": true,
    "round_robin": false,
    "runtime_assets": [
      "cpu-checks-plugins",
      "sensu-ruby-runtime"
    ],
    "secrets": null,
    "stdin": false,
    "subdue": null,
    "subscriptions": [
      "system"
    ],
    "timeout": 0,
    "ttl": 0
  }
}
{{< /code >}}

{{< /language-toggle >}}

If you want to share, reuse, and maintain this check just like you would code, you can [save it to a file][11] and start building a [monitoring as code repository][12].

## Configure the subscription

To run the check, you'll need a Sensu agent with the subscription `system`.
After you [install an agent][4], open `/etc/sensu/agent.yml` and add the `system` subscription so the subscription configuration looks like this:

{{< code yml >}}
subscriptions:
  - system
{{< /code >}}

Then, restart the agent:

{{< code shell >}}
sudo service sensu-agent restart
{{< /code >}}

## Validate the check

Use sensuctl to confirm that Sensu is monitoring CPU usage.
It might take a few moments after you create the check for the check to be scheduled on the entity and the event to return to Sensu backend.

{{< code shell >}}
sensuctl event list
{{< /code >}}

The response should list the `check-cpu` check, returning an OK status (`0`)

{{< code shell >}}
    Entity        Check                                                                    Output                                                                   Status   Silenced             Timestamp            
────────────── ─────────── ─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────── ──────── ────────── ─────────────────────────────── 
 sensu-centos   check-cpu   CheckCPU TOTAL OK: total=0.2 user=0.0 nice=0.0 system=0.2 idle=99.8 iowait=0.0 irq=0.0 softirq=0.0 steal=0.0 guest=0.0 guest_nice=0.0        0   false      2019-04-23 16:42:28 +0000 UTC  
{{< /code >}}

## Next steps

Now that you know how to run a check to monitor CPU usage, read these resources to learn more:

* [Checks reference][3]
* [Use assets to install plugins][2]
* [Monitor external resources with proxy checks and entities][5]
* [Send Slack alerts with handlers][6]


[1]: https://bonsai.sensu.io/assets/sensu-plugins/sensu-plugins-cpu-checks
[2]: ../../../plugins/use-assets-to-install-plugins/
[3]: ../checks/
[4]: ../../../operations/deploy-sensu/install-sensu/#install-sensu-agents
[5]: ../../observe-entities/monitor-external-resources/
[6]: ../../observe-process/send-slack-alerts/
[7]: https://bonsai.sensu.io/assets/sensu/sensu-ruby-runtime
[8]: ../agent/#restart-the-service
[9]: ../../../sensuctl/sensuctl-bonsai/#install-dynamic-runtime-asset-definitions
[10]: #create-a-check
[11]: ../../../operations/monitoring-as-code/#build-as-you-go
[12]: ../../../operations/monitoring-as-code/
