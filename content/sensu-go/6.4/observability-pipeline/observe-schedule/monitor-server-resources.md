---
title: "Monitor server resources with checks"
linkTitle: "Monitor Server Resources"
guide_title: "Monitor server resources with checks"
type: "guide"
description: "Sensu lets you monitor server resources with checks. Read this guide to learn about Sensu checks and how to use checks to monitor servers."
weight: 40
version: "6.4"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-6.4:
    parent: observe-schedule
---

Sensu checks are commands (or scripts) the Sensu agent executes that output data and produce an exit code to indicate a state.
Sensu checks use the same specification as Nagios, so you can use Nagios check plugins with Sensu.

You can use checks to monitor server resources, services, and application health (for example, to check whether NGINX is running) and collect and analyze metrics (for example, to learn how much disk space you have left).
This guide includes two check examples to help you monitor server resources (specifically, CPU usage and NGINX status).

To use this guide, you'll need to install a Sensu backend and have at least one Sensu agent running.
Follow the RHEL/CentOS [install instructions][4] for the Sensu backend, the Sensu agent, and sensuctl.

## Register dynamic runtime assets

You can write shell scripts in the `command` field of your check definitions, but we recommend using existing check plugins instead.
Check plugins must be available on the host where the agent is running for the agent to execute the check.
This guide uses [dynamic runtime assets][2] to manage plugin installation.

The [Sensu CPU Checks][1] dynamic runtime asset includes the `check-cpu.rb` plugin, which your CPU check will rely on.
The Sensu assets packaged from Sensu CPU Checks are built against the Sensu Ruby runtime environment, so you also need to add the [Sensu Ruby Runtime][7] dynamic runtime asset.
Sensu Ruby Runtime delivers the Ruby executable and supporting libraries the check will need to run the `check-cpu.rb` plugin.

To register the Sensu CPU Checks dynamic runtime asset, `sensu-plugins/sensu-plugins-cpu-checks:4.1.0`, run:

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

You can also download dynamic runtime asset definitions from [Bonsai][14] and register the asset with `sensuctl create --file filename.yml`.

Then, use the following sensuctl command to register the Sensu Ruby Runtime dynamic runtime asset, `sensu/sensu-ruby-runtime:0.0.10`:

{{< code shell >}}
sensuctl asset add sensu/sensu-ruby-runtime:0.0.10 -r sensu-ruby-runtime
{{< /code >}}

And use this command to register the [nagiosfoundation check plugin collection][15], which you'll use later for your webserver check:

{{< code shell >}}
sensuctl asset add ncr-devops-platform/nagiosfoundation:0.5.2 -r nagiosfoundation
{{< /code >}}

To confirm that all three dynamic runtime assets are ready to use, run:

{{< code shell >}}
sensuctl asset list
{{< /code >}}

The response should list the `cpu-checks-plugins`, `sensu-ruby-runtime`, and `nagiosfoundation` dynamic runtime assets:

{{< code shell >}}
         Name                                                      URL                                                 Hash    
 ──────────────────── ────────────────────────────────────────────────────────────────────────────────────────────── ───────── 
  cpu-checks-plugins   //assets.bonsai.sensu.io/.../sensu-plugins-cpu-checks_4.1.0_centos7_linux_amd64.tar.gz         8a01862  
  nagiosfoundation     //assets.bonsai.sensu.io/.../nagiosfoundation-linux-amd64-0.5.2.tgz                            6b4f91b  
  sensu-ruby-runtime   //assets.bonsai.sensu.io/.../sensu-ruby-runtime_0.0.10_ruby-2.4.4_centos_linux_amd64.tar.gz    338b88b 
{{< /code >}}

Because plugins are published for multiple platforms, including Linux and Windows, the output will include multiple entries for each of the dynamic runtime assets.

{{% notice note %}}
**NOTE**: Sensu does not download and install dynamic runtime asset builds onto the system until they are needed for command execution.
Read [the asset reference](../../../plugins/assets#dynamic-runtime-asset-builds) for more information about dynamic runtime asset builds.
{{% /notice %}}

## Configure entity subscriptions

Every Sensu agent has a defined set of [subscriptions][8] that determine which checks the agent will execute.
For an agent to execute a specific check, you must specify the same subscription in the agent configuration and the check definition.
To run the CPU and NGINX webserver checks, you'll need a Sensu agent with the subscriptions `system` and `webserver`.

{{% notice note %}}
**NOTE**: In production, your CPU and NGINX servers would be different entities, with the `system` subscription specified for the CPU entity and the `webserver` subscription specified for the NGINX entity.
To keep things streamlined, this guide uses one entity to represent both.
{{% /notice %}}

To add the `system` and `webserver` subscriptions to the entity the Sensu agent is observing, first find your agent entity name:

{{< code shell >}}
sensuctl entity list
{{< /code >}}

The `ID` is the name of your entity.

Replace `<entity_name>` with the name of your agent entity in the following [sensuctl][17] command.
Run:

{{< code shell >}}
sensuctl entity update <entity_name>
{{< /code >}}

- For `Entity Class`, press enter.
- For `Subscriptions`, type `system,webserver` and press enter.

## Create a check to monitor a server

Now that the dynamic runtime assets are registered, create a check named `check_cpu` that runs the command `check-cpu.rb -w 75 -c 90` with the `cpu-checks-plugins` and `sensu-ruby-runtime` dynamic runtime assets at an interval of 60 seconds for all entities subscribed to the `system` subscription.
This check generates a warning event (`-w`) when CPU usage reaches 75% and a critical alert (`-c`) at 90%.

{{< code shell >}}
sensuctl check create check_cpu \
--command 'check-cpu.rb -w 75 -c 90' \
--interval 60 \
--subscriptions system \
--runtime-assets cpu-checks-plugins,sensu-ruby-runtime
{{< /code >}}

You should see a confirmation message:

{{< code shell >}}
Created
{{< /code >}}

To view the complete resource definition for `check_cpu`, run:

{{< language-toggle >}}

{{< code shell "YML" >}}
sensuctl check info check_cpu --format yaml
{{< /code >}}

{{< code shell "JSON" >}}
sensuctl check info check_cpu --format wrapped-json
{{< /code >}}

{{< /language-toggle >}}

The sensuctl response will include the complete `check_cpu` resource definition in the specified format:

{{< language-toggle >}}

{{< code yml >}}
---
type: CheckConfig
api_version: core/v2
metadata:
  created_by: admin
  name: check_cpu
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
    "name": "check_cpu",
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

### Validate the CPU check

The Sensu agent uses websockets to communicate with the Sensu backend, sending event data as JSON messages.
As your checks run, the Sensu agent captures check standard output (`STDOUT`) or standard error (`STDERR`).
This data will be included in the JSON payload the agent sends to your Sensu backend as the event data.

It might take a few moments after you create the check for the check to be scheduled on the entity and the event to return to Sensu backend.
Use sensuctl to view the event data and confirm that Sensu is monitoring CPU usage:

{{< code shell >}}
sensuctl event list
{{< /code >}}

The response should list the `check_cpu` check, returning an OK status (`0`)

{{< code shell >}}
     Entity          Check                                                                        Output                                                                     Status   Silenced             Timestamp                             UUID                  
 ────────────── ─────────────── ─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────── ──────── ────────── ─────────────────────────────── ────────────────────────────────────── 
  sensu-centos   check_cpu       CheckCPU TOTAL OK: total=1.23 user=1.03 nice=0.0 system=0.21 idle=98.77 iowait=0.0 irq=0.0 softirq=0.0 steal=0.0 guest=0.0 guest_nice=0.0        0   false      2021-03-18 19:33:30 +0000 UTC   64e54ae9-117b-4867-c2d1-9b1682a474ab
{{< /code >}}

## Create a check to monitor a webserver

In this section, you'll create a check to monitor an NGINX webserver, similar to the CPU check you created in the previous section but using the `webserver` subscription rather than `system`.

### Install and configure NGINX

The webserver check requires a running NGINX service, so you'll need to install and configure NGINX.

{{% notice note %}}
**NOTE**: You may need to install and update the EPEL repository with `sudo yum install epel-release` and `sudo yum update` before you can install NGINX.
{{% /notice %}}

Install NGINX:

{{< code shell >}}
sudo yum install nginx
{{< /code >}}

Enable and start the NGINX service:

{{< code shell >}}
systemctl enable nginx && systemctl start nginx
{{< /code >}}

Verify that Nginx is serving webpages:

{{< code shell >}}
curl -sI http://localhost
{{< /code >}}

The response should include `HTTP/1.1 200 OK` to indicates that NGINX processed your request as expected:

{{< code shell >}}
HTTP/1.1 200 OK
Server: nginx/1.16.1
Date: Wed, 17 Mar 2021 20:51:53 GMT
Content-Type: text/html
Content-Length: 4833
Last-Modified: Fri, 16 May 2014 15:12:48 GMT
Connection: keep-alive
ETag: "73762nw0-12e1"
Accept-Ranges: bytes
{{< /code >}}

With your NGINX service running, you can configure the webserver check.

### Create the webserver check definition

Create a check that uses the [`check_service`][16] plugin from the nagiosfoundation collection.
The `nginx_service` check will run at an interval of 15 seconds and determine whether the `nginx` service is running for all entities subscribed to the `webserver` subscription.

Run the following sensuctl command to create the `nginx_service` check:

{{< code shell >}}
sensuctl check create nginx_service \
--command 'check_service --name nginx' \
--interval 15 \
--subscriptions webserver \
--runtime-assets nagiosfoundation
{{< /code >}}

You should see a confirmation message:

{{< code shell >}}
Created
{{< /code >}}

To view the complete resource definition for `nginx_service`, run:

{{< language-toggle >}}

{{< code shell "YML" >}}
sensuctl check info nginx_service --format yaml
{{< /code >}}

{{< code shell "JSON" >}}
sensuctl check info nginx_service --format wrapped-json
{{< /code >}}

{{< /language-toggle >}}

The sensuctl response will include the complete `nginx_service` resource definition in the specified format:

{{< language-toggle >}}

{{< code yml >}}
---
type: CheckConfig
api_version: core/v2
metadata:
  created_by: admin
  name: nginx_service
  namespace: default
spec:
  check_hooks: null
  command: check_service --name nginx
  env_vars: null
  handlers: []
  high_flap_threshold: 0
  interval: 15
  low_flap_threshold: 0
  output_metric_format: ""
  output_metric_handlers: null
  proxy_entity_name: ""
  publish: true
  round_robin: false
  runtime_assets:
  - nagiosfoundation
  secrets: null
  stdin: false
  subdue: null
  subscriptions:
  - webserver
  timeout: 0
  ttl: 0
{{< /code >}}

{{< code json >}}
{
  "type": "CheckConfig",
  "api_version": "core/v2",
  "metadata": {
    "created_by": "admin",
    "name": "nginx_service",
    "namespace": "default"
  },
  "spec": {
    "check_hooks": null,
    "command": "check_service --name nginx",
    "env_vars": null,
    "handlers": [],
    "high_flap_threshold": 0,
    "interval": 15,
    "low_flap_threshold": 0,
    "output_metric_format": "",
    "output_metric_handlers": null,
    "proxy_entity_name": "",
    "publish": true,
    "round_robin": false,
    "runtime_assets": [
      "nagiosfoundation"
    ],
    "secrets": null,
    "stdin": false,
    "subdue": null,
    "subscriptions": [
      "webserver"
    ],
    "timeout": 0,
    "ttl": 0
  }
}
{{< /code >}}

{{< /language-toggle >}}

As with the `check_cpu` check, you can share, reuse, and maintain this check [just like code][12].

### Validate the webserver check

It might take a few moments after you create the check for the check to be scheduled on the entity and the event to return to Sensu backend.
Use sensuctl to view event data and confirm that Sensu is monitoring the NGINX webserver status:

{{< code shell >}}
sensuctl event list
{{< /code >}}

The response should list the `nginx_service` check, returning an OK status (`0`):

{{< code shell >}}
     Entity          Check                                                                       Output                                                                   Status   Silenced             Timestamp                             UUID                  
 ────────────── ─────────────── ──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────── ──────── ────────── ─────────────────────────────── ────────────────────────────────────── 
  sensu-centos   nginx_service   CheckService OK - nginx in a running state                                                                                                    0   false      2021-03-18 19:38:04 +0000 UTC   ab605f6a-26e2-47c8-a843-765129e74f37
{{< /code >}}

### Simulate a critical event

To manually generate a critical event for your `nginx_service` check, stop the NGINX service.
Run:

{{< code shell >}}
systemctl stop nginx
{{< /code >}}

When you stop the service, the check will generate a critical event.
After a few moments, run:

{{< code shell >}}
sensuctl event list
{{< /code >}}

The response should list the `nginx_service` check, returning a CRITICAL status (`2`):

{{< code shell >}}
     Entity          Check                                                                        Output                                                                     Status   Silenced             Timestamp                             UUID                  
 ────────────── ─────────────── ─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────── ──────── ────────── ─────────────────────────────── ────────────────────────────────────── 
  sensu-centos   nginx_service   CheckService CRITICAL - nginx not in a running state (State: inactive)                                                                           2   false      2021-03-18 19:42:19 +0000 UTC   cb3et55a-1649-43b9-b559-ebu3aa9352b4
{{< /code >}}

Restart the NGINX service to clear the event:

{{< code shell >}}
systemctl start nginx
{{< /code >}}

After a moment, you can verify that the event cleared:

{{< code shell >}}
sensuctl event list
{{< /code >}}

The response should list the `nginx_service` check with an OK status (`0`).

## Next steps

Now that you know how to create checks to monitor CPU usage and NGINX webserver status, read the [checks reference][3] and [assets reference][2] for more detailed information.
Or, learn how to [monitor external resources with proxy checks and entities][5].

You can also create a [handler][10] to send alerts to [email][13], [PagerDuty][9], or [Slack][6] based on the status events your checks are generating.


[1]: https://bonsai.sensu.io/assets/sensu-plugins/sensu-plugins-cpu-checks
[2]: ../../../plugins/assets/
[3]: ../checks/
[4]: ../../../operations/deploy-sensu/install-sensu/
[5]: ../../observe-entities/monitor-external-resources/
[6]: ../../observe-process/send-slack-alerts/
[7]: https://bonsai.sensu.io/assets/sensu/sensu-ruby-runtime
[8]: ../subscriptions/
[9]: ../../observe-process/send-pagerduty-alerts/
[10]: ../../observe-process/handlers/
[11]: ../../../operations/monitoring-as-code/#build-as-you-go
[12]: ../../../operations/monitoring-as-code/
[13]: ../../observe-process/send-email-alerts/
[14]: https://bonsai.sensu.io/
[15]: https://bonsai.sensu.io/assets/ncr-devops-platform/nagiosfoundation
[16]: https://github.com/ncr-devops-platform/nagiosfoundation/blob/master/cmd/check_service/README.md
[17]: ../../../sensuctl/
