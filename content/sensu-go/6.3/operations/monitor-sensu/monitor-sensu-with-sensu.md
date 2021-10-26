---
title: "Monitor Sensu with Sensu"
linkTitle: "Monitor Sensu with Sensu"
guide_title: "Monitor Sensu with Sensu"
type: "guide"
description: "Make sure your Sensu components are properly monitored. This guide describes best practices and strategies for monitoring Sensu."
weight: 20
version: "6.3"
product: "Sensu Go"
platformContent: false
menu: 
  sensu-go-6.3:
    parent: monitor-sensu
---

This guide describes best practices and strategies for monitoring the Sensu backend with another Sensu backend or cluster.

To completely monitor Sensu (a Sensu backend with internal etcd and an agent), you will need at least one independent Sensu instance in addition to the primary instance you want to monitor.
The second Sensu instance will ensure that you are notified when the primary is down and vice versa.

This guide requires Sensu plugins using dynamic runtime assets.
For more information about using Sensu plugins, read [Use dynamic runtime assets to install plugins][1].

{{% notice note %}}
**NOTE**: Although this guide describes approaches for monitoring a single backend, these strategies are also useful for monitoring individual members of a backend cluster.

This guide does not describe Sensu agent [keepalive monitoring](../../../observability-pipeline/observe-schedule/agent/#keepalive-monitoring).
{{% /notice %}}

The checks in this guide monitor the following ports and endpoints:

| Port | Endpoint | Description |
|------|----------|-------------|
| 2379 | `/health`  | Etcd health endpoint. Provides health status for etcd nodes. |
| 8080 | `/health`  | Sensu Go health endpoint. Provides health status for Sensu backends, as well as for PostgreSQL (when enabled). |

## Register dynamic runtime asset

To power the checks to monitor your Sensu backend, external etcd, and PostgreSQL instances, add the [http-checks][5] dynamic runtime asset.
This asset includes the `http-json` plugin, which your checks will rely on.

To register the http-checks dynamic runtime asset, `sensu/http-checks`, run:

{{< code shell >}}
sensuctl asset add sensu/http-checks:0.4.0 -r http-checks
{{< /code >}}

The response will confirm that the asset was added:

{{< code shell >}}
fetching bonsai asset: sensu/http-checks:0.4.0
added asset: sensu/http-checks:0.4.0

You have successfully added the Sensu asset resource, but the asset will not get downloaded until
it's invoked by another Sensu resource (ex. check). To add this runtime asset to the appropriate
resource, populate the "runtime_assets" field with ["http-checks"].
{{< /code >}}

This example uses the `-r` (rename) flag to specify a shorter name for the dynamic runtime asset: `http-checks`.

To confirm that the asset is ready to use, run:

{{< code shell >}}
sensuctl asset list
{{< /code >}}

The response should list the `http-checks` dynamic runtime asset:

{{< code shell >}}
     Name                                       URL                                    Hash    
────────────── ───────────────────────────────────────────────────────────────────── ──────────
  http-checks   //assets.bonsai.sensu.io/.../http-checks_0.4.0_windows_amd64.tar.gz   52ae075  
  http-checks   //assets.bonsai.sensu.io/.../http-checks_0.4.0_darwin_amd64.tar.gz    72d0f15  
  http-checks   //assets.bonsai.sensu.io/.../http-checks_0.4.0_linux_armv7.tar.gz     ef18587  
  http-checks   //assets.bonsai.sensu.io/.../http-checks_0.4.0_linux_arm64.tar.gz     3504ddf  
  http-checks   //assets.bonsai.sensu.io/.../http-checks_0.4.0_linux_386.tar.gz       60b8883  
  http-checks   //assets.bonsai.sensu.io/.../http-checks_0.4.0_linux_amd64.tar.gz     1db73a8 
{{< /code >}}

Because plugins are published for multiple platforms, including Linux and Windows, the output will include multiple entries for each of the dynamic runtime assets.

{{% notice note %}}
**NOTE**: Sensu does not download and install dynamic runtime asset builds onto the system until they are needed for command execution.
Read [the asset reference](../../../plugins/assets#dynamic-runtime-asset-builds) for more information about dynamic runtime asset builds.
{{% /notice %}}

## Monitor your Sensu backend instances

Monitor the host running the `sensu-backend` *locally* by a `sensu-agent` process for operating system checks and metrics.

For Sensu components that must be running for Sensu to create events, you should also monitor the `sensu-backend` remotely from an independent Sensu instance.
This will allow you to monitor whether your Sensu event pipeline is working.

To do this, add checks that use the `http-json` plugin from the [http-checks][5] dynamic runtime asset to query Sensu's [health API endpoint][2] for your primary (Backend Alpha) and secondary (Backend Beta) backends.

{{% notice note %}}
**NOTE**: These examples use the [http-checks](https://bonsai.sensu.io/assets/sensu/http-checks) dynamic runtime asset.
Follow [Register dynamic runtime asset](#register-dynamic-runtime-asset) if you did not previously add this asset.
{{% /notice %}}

{{< language-toggle >}}

{{< code yml "YML - Backend Alpha">}}
---
type: CheckConfig
api_version: core/v2
metadata:
  namespace: default
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
{{< /code >}}

{{< code yml "YML - Backend Beta">}}
---
type: CheckConfig
api_version: core/v2
metadata:
  namespace: default
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
{{< /code >}}

{{< code json "JSON - Backend Alpha">}}
{
  "type": "CheckConfig",
  "api_version": "core/v2",
  "metadata": {
    "namespace": "default",
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
{{< /code >}}

{{< code json "JSON - Backend Beta">}}
{
  "type": "CheckConfig",
  "api_version": "core/v2",
  "metadata": {
    "namespace": "default",
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
{{< /code >}}

{{< /language-toggle >}}

A successful health check result will be similar to this example:

{{< code shell >}}
http-json OK:  The value true found at .ClusterHealth.[0].Healthy matched with expression "== true" and returned true
{{< /code >}}

## Monitor external etcd

If your Sensu Go deployment uses an external etcd cluster, you'll need to check the health of the respective etcd instances for your primary (Backend Alpha) and secondary (Backend Beta) backends.

{{% notice note %}}
**NOTE**: These examples use the [http-checks](https://bonsai.sensu.io/assets/sensu/http-checks) dynamic runtime asset.
Follow [Register dynamic runtime asset](#register-dynamic-runtime-asset) if you did not previously add this asset.
{{% /notice %}}

{{< language-toggle >}}

{{< code yml "YML - Backend Alpha">}}
---
type: CheckConfig
api_version: core/v2
metadata:
  namespace: default
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
{{< /code >}}

{{< code yml "YML - Backend Beta">}}
---
type: CheckConfig
api_version: core/v2
metadata:
  namespace: default
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
{{< /code >}}

{{< code json "JSON - Backend Alpha">}}
{
  "type": "CheckConfig",
  "api_version": "core/v2",
  "metadata": {
    "namespace": "default",
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
{{< /code >}}

{{< code json "JSON - Backend Beta">}}
{
  "type": "CheckConfig",
  "api_version": "core/v2",
  "metadata": {
    "namespace": "default",
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
{{< /code >}}

{{< /language-toggle >}}

A successful health check result will be similar to this example:

{{< code shell >}}
http-json OK:  The value true found at .ClusterHealth.[0].Healthy matched with expression "== true" and returned true
{{< /code >}}

## Monitor PostgreSQL

{{% notice commercial %}}
**COMMERCIAL FEATURE**: Access enterprise-scale PostgreSQL event storage in the packaged Sensu Go distribution.
For more information, read [Get started with commercial features](../../../commercial/).
{{% /notice %}}

Larger Sensu deployments may use [PostgreSQL as an alternative datastore][4] to process larger numbers of events.
The connection to PostgreSQL is exposed on Sensu's `/health` endpoint and will look like this example:

{{< code json >}}
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

To monitor PostgreSQL's health from Sensu's perspective, use a check like this example, which uses the `http-json` plugin from the [http-checks][5] dynamic runtime asset.

{{% notice note %}}
**NOTE**: Follow [Register dynamic runtime asset](#register-dynamic-runtime-asset) if you did not previously add the http-checks dynamic runtime asset.
{{% /notice %}}

{{< language-toggle >}}

{{< code yml >}}
---
type: CheckConfig
api_version: core/v2
metadata:
  name: check-postgres-health
  namespace: default
spec:
  check_hooks: null
  command: http-json --url https://sensu.example.com:8080/health --query ".PostgresHealth[0].Healthy" --expression "== true"
  env_vars: null
  handlers: []
  high_flap_threshold: 0
  interval: 10
  low_flap_threshold: 0
  output_metric_format: ""
  output_metric_handlers: null
  output_metric_tags: null
  proxy_entity_name: ""
  publish: true
  round_robin: true
  runtime_assets:
  - http-checks
  secrets: null
  stdin: false
  subdue: null
  subscriptions:
  - backends
  timeout: 0
  ttl: 0
{{< /code >}}

{{< code json >}}
{
  "type": "CheckConfig",
  "api_version": "core/v2",
  "metadata": {
    "name": "check-postgres-health",
    "namespace": "default"
  },
  "spec": {
    "check_hooks": null,
    "command": "http-json --url https://sensu.example.com:8080/health --query \".PostgresHealth[0].Healthy\" --expression \"== true\"",
    "env_vars": null,
    "handlers": [],
    "high_flap_threshold": 0,
    "interval": 10,
    "low_flap_threshold": 0,
    "output_metric_format": "",
    "output_metric_handlers": null,
    "output_metric_tags": null,
    "proxy_entity_name": "",
    "publish": true,
    "round_robin": true,
    "runtime_assets": [
      "http-checks"
    ],
    "secrets": null,
    "stdin": false,
    "subdue": null,
    "subscriptions": [
      "backends"
    ],
    "timeout": 0,
    "ttl": 0
  }
}
{{< /code >}}

{{< /language-toggle >}}

A successful PostgreSQL health check result will be similar to this example:

{{< code shell >}}
http-json OK:  The value true found at .PostgresHealth.[0].Healthy matched with expression "== true" and returned true
{{< /code >}}


[1]: ../../../plugins/use-assets-to-install-plugins/
[2]: ../../../api/health/
[4]: ../../deploy-sensu/scale-event-storage/
[5]: https://bonsai.sensu.io/assets/sensu/http-checks
