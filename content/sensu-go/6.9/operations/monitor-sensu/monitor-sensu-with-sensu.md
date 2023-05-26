---
title: "Monitor Sensu with Sensu"
linkTitle: "Monitor Sensu with Sensu"
guide_title: "Monitor Sensu with Sensu"
type: "guide"
description: "Make sure your Sensu components are properly monitored. This guide describes best practices and strategies for monitoring Sensu."
weight: 20
version: "6.9"
product: "Sensu Go"
platformContent: false
menu: 
  sensu-go-6.9:
    parent: monitor-sensu
---

This guide describes best practices and strategies for monitoring the Sensu backend with another Sensu backend or cluster.

To completely monitor Sensu (a Sensu backend with internal etcd and an agent), you will need at least one independent Sensu instance in addition to the primary instance you want to monitor.
The second Sensu instance will ensure that you are notified when the primary is down and vice versa.

This guide requires Sensu plugins using dynamic runtime assets.
For more information about using Sensu plugins, read [Use dynamic runtime assets to install plugins][1].

{{% notice note %}}
**NOTE**: Although this guide describes approaches for monitoring a single backend, these strategies are also useful for monitoring individual members of a backend cluster.<br><br>
This guide does not describe Sensu agent [keepalive monitoring](../../../observability-pipeline/observe-schedule/agent/#keepalive-monitoring).
{{% /notice %}}

The checks in this guide monitor the following ports and endpoints:

| Port | Endpoint | Description |
|------|----------|-------------|
| 2379 | `/health`  | Etcd health endpoint. Provides health status for etcd nodes. |
| 8080 | `/health`  | Sensu Go health endpoint. Provides health status for Sensu backends, as well as for PostgreSQL (when enabled). |

## Requirements

To follow this guide, install the Sensu [backend][10], make sure at least one Sensu [agent][11] is running, and configure [sensuctl][12] to connect to the backend as the [`admin` user][13].

## Register dynamic runtime asset

To power the checks to monitor your Sensu backend, external etcd, and PostgreSQL instances, add the sensu/http-checks dynamic runtime asset.
This asset includes the `http-json` plugin, which your checks will rely on.

To register the sensu/http-checks dynamic runtime asset, run:

{{< code shell >}}
sensuctl asset add sensu/http-checks:0.5.0 -r http-checks
{{< /code >}}

The response will confirm that the asset was added:

{{< code text >}}
fetching bonsai asset: sensu/http-checks:0.5.0
added asset: sensu/http-checks:0.5.0

You have successfully added the Sensu asset resource, but the asset will not get downloaded until
it's invoked by another Sensu resource (ex. check). To add this runtime asset to the appropriate
resource, populate the "runtime_assets" field with ["http-checks"].
{{< /code >}}

This example uses the `-r` (rename) flag to specify a shorter name for the dynamic runtime asset: http-checks.

To confirm that the asset is ready to use, run:

{{< code shell >}}
sensuctl asset list
{{< /code >}}

The response should list the renamed http-checks dynamic runtime asset:

{{< code text >}}
     Name                                       URL                                    Hash    
────────────── ───────────────────────────────────────────────────────────────────── ──────────
  http-checks   //assets.bonsai.sensu.io/.../http-checks_0.5.0_linux_armv7.tar.gz     b28f8c3  
  http-checks   //assets.bonsai.sensu.io/.../http-checks_0.5.0_linux_arm64.tar.gz     7308f9c  
  http-checks   //assets.bonsai.sensu.io/.../http-checks_0.5.0_linux_386.tar.gz       6457583  
  http-checks   //assets.bonsai.sensu.io/.../http-checks_0.5.0_windows_amd64.tar.gz   b936ca0  
  http-checks   //assets.bonsai.sensu.io/.../http-checks_0.5.0_darwin_amd64.tar.gz    38e6cb8  
  http-checks   //assets.bonsai.sensu.io/.../http-checks_0.5.0_linux_amd64.tar.gz     bc5fc3b 
{{< /code >}}

Because plugins are published for multiple platforms, including Linux and Windows, the output will include multiple entries for each of the dynamic runtime assets.

{{% notice note %}}
**NOTE**: Sensu does not download and install dynamic runtime asset builds onto the system until they are needed for command execution.
{{% /notice %}}

## Monitor your Sensu backend instances

Monitor the host running the `sensu-backend` *locally* by a `sensu-agent` process for operating system checks and metrics.

For Sensu components that must be running for Sensu to create events, you should also monitor the `sensu-backend` remotely from an independent Sensu instance.
This will allow you to monitor whether your Sensu event pipeline is working.

To do this, add checks that use the `http-json` plugin from the sensu/http-checks dynamic runtime asset to query Sensu's /health API for your primary (Backend Alpha) and secondary (Backend Beta) backends.

{{% notice note %}}
**NOTE**: These examples use the sensu/http-checks dynamic runtime asset.
Follow the instructions above to [register sensu/http-checks](#register-dynamic-runtime-asset) if you have not previously registered it.
{{% /notice %}}

{{< language-toggle >}}

{{< code yml "YML - Backend Alpha">}}
cat << EOF | sensuctl create
---
type: CheckConfig
api_version: core/v2
metadata:
  name: check_beta_backend_health
spec:
  command: http-json --url http://sensu-backend-beta:8080/health --query ".ClusterHealth.[0].Healthy" --expression "== true"
  subscriptions:
    - backend_alpha
  interval: 10
  publish: true
  timeout: 10
  runtime_assets:
    - http-checks
EOF
{{< /code >}}

{{< code yml "YML - Backend Beta">}}
cat << EOF | sensuctl create
---
type: CheckConfig
api_version: core/v2
metadata:
  name: check_alpha_backend_health
spec:
  command: http-json --url http://sensu-backend-alpha:8080/health --query ".ClusterHealth.[0].Healthy" --expression "== true"
  subscriptions:
    - backend_beta
  interval: 10
  publish: true
  timeout: 10
  runtime_assets:
    - http-checks
EOF
{{< /code >}}

{{< code json "JSON - Backend Alpha">}}
cat << EOF | sensuctl create
{
  "type": "CheckConfig",
  "api_version": "core/v2",
  "metadata": {
    "name": "check_beta_backend_health"
  },
  "spec": {
    "command": "http-json --url http://sensu-backend-beta:8080/health --query \".ClusterHealth.[0].Healthy\" --expression \"== true\"",
    "subscriptions": [
      "backend_alpha"
    ],
    "interval": 10,
    "publish": true,
    "timeout": 10,
    "runtime_assets": [
      "http-checks"
    ]
  }
}
EOF
{{< /code >}}

{{< code json "JSON - Backend Beta">}}
cat << EOF | sensuctl create
{
  "type": "CheckConfig",
  "api_version": "core/v2",
  "metadata": {
    "name": "check_alpha_backend_health"
  },
  "spec": {
    "command": "http-json --url http://sensu-backend-alpha:8080/health --query \".ClusterHealth.[0].Healthy\" --expression \"== true\"",
    "subscriptions": [
      "backend_beta"
    ],
    "interval": 10,
    "publish": true,
    "timeout": 10,
    "runtime_assets": [
      "http-checks"
    ]
  }
}
EOF
{{< /code >}}

{{< /language-toggle >}}

A successful health check result will be similar to this example:

{{< code text >}}
http-json OK:  The value true found at .ClusterHealth.[0].Healthy matched with expression "== true" and returned true
{{< /code >}}

## Monitor external etcd

If your Sensu Go deployment uses an external etcd cluster, you'll need to check the health of the respective etcd instances for your primary (Backend Alpha) and secondary (Backend Beta) backends.

{{% notice note %}}
**NOTE**: These examples use the sensu/http-checks dynamic runtime asset.
Follow the instructions above to [register sensu/http-checks](#register-dynamic-runtime-asset) if you have not previously registered it.
{{% /notice %}}

{{< language-toggle >}}

{{< code yml "YML - Backend Alpha">}}
cat << EOF | sensuctl create
---
type: CheckConfig
api_version: core/v2
metadata:
  name: check_beta_etcd_health
spec:
  command: http-json --url http://sensu-etcd-beta:2379/health --query ".ClusterHealth.[0].Healthy" --expression "== true"
  subscriptions:
  - backend_alpha
  interval: 10
  publish: true
  timeout: 10
  runtime_assets:
  - http-checks
EOF
{{< /code >}}

{{< code yml "YML - Backend Beta">}}
cat << EOF | sensuctl create
---
type: CheckConfig
api_version: core/v2
metadata:
  name: check_alpha_etcd_health
spec:
  command: http-json --url http://sensu-etcd-alpha:2379/health --query ".ClusterHealth.[0].Healthy" --expression "== true"
  subscriptions:
  - backend_beta
  interval: 10
  publish: true
  timeout: 10
  runtime_assets:
  - http-checks
EOF
{{< /code >}}

{{< code json "JSON - Backend Alpha">}}
cat << EOF | sensuctl create
{
  "type": "CheckConfig",
  "api_version": "core/v2",
  "metadata": {
    "name": "check_beta_etcd_health"
  },
  "spec": {
    "command": "http-json --url http://sensu-etcd-beta:2379/health --query \".ClusterHealth.[0].Healthy\" --expression \"== true\"",
    "subscriptions": [
      "backend_alpha"
    ],
    "interval": 10,
    "publish": true,
    "timeout": 10,
    "runtime_assets": [
      "http-checks"
    ]
  }
}
EOF
{{< /code >}}

{{< code json "JSON - Backend Beta">}}
cat << EOF | sensuctl create
{
  "type": "CheckConfig",
  "api_version": "core/v2",
  "metadata": {
    "name": "check_alpha_etcd_health"
  },
  "spec": {
    "command": "http-json --url http://sensu-etcd-alpha:2379/health --query \".ClusterHealth.[0].Healthy\" --expression \"== true\"",
    "subscriptions": [
      "backend_beta"
    ],
    "interval": 10,
    "publish": true,
    "timeout": 10,
    "runtime_assets": [
      "http-checks"
    ]
  }
}
EOF
{{< /code >}}

{{< /language-toggle >}}

A successful health check result will be similar to this example:

{{< code text >}}
http-json OK:  The value true found at .ClusterHealth.[0].Healthy matched with expression "== true" and returned true
{{< /code >}}

## Monitor PostgreSQL

{{% notice commercial %}}
**COMMERCIAL FEATURE**: Access enterprise-scale PostgreSQL event storage in the packaged Sensu Go distribution.
For more information, read [Get started with commercial features](../../../commercial/).
{{% /notice %}}

If you're using PostgreSQL for event storage, we recommend monitoring your PostgreSQL event store's health.

The connection to PostgreSQL is exposed on Sensu's `/health` endpoint, which provides information about the event store's health.
PostgreSQL data from the `/health` endpoint will look like this example:

{{< code text >}}
{
  "Alarms": null,
  "ClusterHealth": [
    {
      "MemberID": 3470366781180380700,
      "MemberIDHex": "302938336092857e",
      "Name": "sensu00",
      "Err": "",
      "Healthy": true
    },
    {
      "MemberID": 15883454222313069000,
      "MemberIDHex": "dc6d5d7607261af7",
      "Name": "sensu01",
      "Err": "",
      "Healthy": true
    },
    {
      "MemberID": 11377294497886210000,
      "MemberIDHex": "9de44510fb838bbd",
      "Name": "sensu02",
      "Err": "",
      "Healthy": true
    }
  ],
  "Header": {
    "cluster_id": 13239446193995635000,
    "member_id": 3470366781180380700,
    "raft_term": 1549
  },
  "PostgresHealth": [
    {
      "Name": "sensu_postgres",
      "Active": true,
      "Healthy": true
    }
  ]
}
{{< /code >}}

To monitor PostgreSQL's health from Sensu, create checks that use the `http-json` plugin from the sensu/http-checks dynamic runtime asset.

{{% notice note %}}
**NOTE**: These examples use the sensu/http-checks dynamic runtime asset.
Follow the instructions above to [register sensu/http-checks](#register-dynamic-runtime-asset) if you have not previously registered it.
{{% /notice %}}

After you register the sensu/http-checks dynamic runtime asset, create two checks ("healthy" and "active") to monitor PostgreSQL's health from Sensu.
Make sure to update the `--url` value with your backend address before running the commands to create the checks.

Run the following command to add the "healthy" check:

{{< language-toggle >}}

{{< code shell "YML" >}}
cat << EOF | sensuctl create
---
type: CheckConfig
api_version: core/v2
metadata:
  name: postgres_healthy_http_check
spec:
  command: http-json --url https://sensu.example.com:8080/health --query ".PostgresHealth.[0].Healthy" --expression "== true"
  round_robin: true
  publish: true
  interval: 60
  subscriptions:
  - system
  runtime_assets:
  - http-checks
EOF
{{< /code >}}

{{< code shell "JSON" >}}
cat << EOF | sensuctl create
{
  "type": "CheckConfig",
  "api_version": "core/v2",
  "metadata": {
    "name": "postgres_healthy_http_check"
  },
  "spec": {
    "command": "http-json --url https://sensu.example.com:8080/health --query \".PostgresHealth.[0].Healthy\" --expression \"== true\"",
    "round_robin": true,
    "publish": true,
    "interval": 60,
    "subscriptions": [
      "system"
    ],
    "runtime_assets": [
      "http-checks"
    ]
  }
}
EOF
{{< /code >}}

{{< /language-toggle >}}

Run the following command to add the "active" check:

{{< language-toggle >}}

{{< code shell "YML" >}}
cat << EOF | sensuctl create
---
type: CheckConfig
api_version: core/v2
metadata:
  name: postgres_active_http_check
spec:
  command: http-json --url https://sensu.example.com:8080/health --query ".PostgresHealth.[0].Active" --expression "== true"
  round_robin: true
  publish: true
  interval: 60
  subscriptions:
  - system
  runtime_assets:
  - http-checks
EOF
{{< /code >}}

{{< code shell "JSON" >}}
cat << EOF | sensuctl create
{
  "type": "CheckConfig",
  "api_version": "core/v2",
  "metadata": {
    "name": "postgres_active_http_check"
  },
  "spec": {
    "command": "http-json --url https://sensu.example.com:8080/health --query \".PostgresHealth.[0].Active\" --expression \"== true\"",
    "round_robin": true,
    "publish": true,
    "interval": 60,
    "subscriptions": [
      "system"
    ],
    "runtime_assets": [
      "http-checks"
    ]
  }
}
EOF
{{< /code >}}

{{< /language-toggle >}}

Successful PostgreSQL health check results will be similar to this example:

{{< code text >}}
http-json OK:  The value true found at .PostgresHealth.[0].Healthy matched with expression "== true" and returned true
http-json OK:  The value true found at .PostgresHealth.[0].Active matched with expression "== true" and returned true
{{< /code >}}

In the Sensu web UI, you should see check results similar to these examples:

{{< figure src="/images/go/monitor_sensu_with_sensu/postgres_health_http_check.png" alt="Screenshot of Sensu Web UI shows a passing PostgreSQL health check" link="/images/go/monitor_sensu_with_sensu/postgres_health_http_check.png" target="_blank" >}}

{{< figure src="/images/go/monitor_sensu_with_sensu/postgres_active_http_check.png" alt="Screenshot of Sensu Web UI shows a passing PostgreSQL active check" link="/images/go/monitor_sensu_with_sensu/postgres_active_http_check.png" target="_blank" >}}

## What's next

To receive alerts based on your backend health checks, configure a [pipeline][6] with [event filters][3] and a [handler][7] and update your check definitions to reference the pipeline in the [pipelines attribute][8].

Follow any of these guides to learn how to configure event filters, handlers, and pipelines and start sending alerts based on event data:

* [Send email alerts with a pipeline][14]
* [Send PagerDuty alerts with Sensu][15]
* [Send Slack alerts with a pipeline][16]

Read more about the Sensu features you used in this guide:

- [Dynamic runtime assets][18] and [sensu/http-checks][5]
- [sensuctl][17]
- [/health API][2]
- [PostgreSQL enterprise datastore][4]
- [Web UI][9]


[1]: ../../../plugins/use-assets-to-install-plugins/
[2]: ../../../api/other/health/
[3]: ../../../observability-pipeline/observe-filter/filters/
[4]: ../../deploy-sensu/scale-event-storage/
[5]: https://bonsai.sensu.io/assets/sensu/http-checks
[6]: ../../../observability-pipeline/observe-process/pipelines/
[7]: ../../../observability-pipeline/observe-process/handlers/
[8]: ../../../observability-pipeline/observe-schedule/checks/#pipelines-attribute
[9]: ../../../web-ui/
[10]: ../../../operations/deploy-sensu/install-sensu/#install-the-sensu-backend
[11]: ../../../operations/deploy-sensu/install-sensu/#install-sensuctl
[12]: ../../../operations/deploy-sensu/install-sensu/#install-sensu-agents
[13]: ../../../operations/control-access/rbac/#default-users
[14]: ../../../observability-pipeline/observe-process/send-email-alerts/
[15]: ../../../observability-pipeline/observe-process/send-pagerduty-alerts/
[16]: ../../../observability-pipeline/observe-process/send-slack-alerts/
[17]: ../../../sensuctl/
[18]: ../../../plugins/assets/
