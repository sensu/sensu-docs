---
title: "Monitor Sensu with Sensu"
linkTitle: "Monitor Sensu with Sensu"
guide_title: "Monitor Sensu with Sensu"
type: "guide"
description: "Make sure your Sensu components are properly monitored. This guide describes best practices and strategies for monitoring Sensu."
weight: 20
version: "6.1"
product: "Sensu Go"
platformContent: false
menu: 
  sensu-go-6.1:
    parent: monitor-sensu
---

This guide describes best practices and strategies for monitoring the Sensu backend with another Sensu backend or cluster.

To completely monitor Sensu (a Sensu backend with internal etcd and an agent), you will need at least one independent Sensu instance in addition to the primary instance you want to monitor.
The second Sensu instance will ensure that you are notified when the primary is down and vice versa.

This guide requires Sensu plugins using dynamic runtime assets.
For more information about using Sensu plugins, see [Use dynamic runtime assets to install plugins][1].

{{% notice note %}}
**NOTE**: This guide describes approaches for monitoring a single backend.
These strategies are also useful for monitoring individual members of a backend cluster.

This guide does not describe Sensu agent [keepalive monitoring](../../../observability-pipeline/observe-schedule/agent/#keepalive-monitoring).
{{% /notice %}}

The following ports and endpoints are monitored as part of this guide:

| Port | Endpoint | Description |
|------|----------|-------------|
| 2379 | `/health`  | Etcd health endpoint. Provides health status for etcd nodes. |
| 8080 | `/health`  | Sensu Go health endpoint. Provides health status for Sensu backends, as well as for Postgres (when enabled). |

## Monitor your Sensu backend instances

Monitor the host running the `sensu-backend` *locally* by a `sensu-agent` process for operating system checks and metrics.

For Sensu components that must be running for Sensu to create events, you should also monitor the `sensu-backend` remotely from an independent Sensu instance.
This will allow you to monitor whether your Sensu event pipeline is working.

To do this, use the `check-http.rb` plugin from the [Sensu Plugins HTTP][3] dynamic runtime asset to query Sensu's [health API endpoint][2] with a check definition for your primary (Backend Alpha) and secondary (Backend Beta) backends:

{{< language-toggle >}}

{{< code yml "YML - Backend Alpha">}}
---
type: CheckConfig
api_version: core/v2
metadata:
  namespace: default
  name: check_beta_backend_health
spec:
  command: check-http.rb -u http://sensu-backend-beta:8080/health -n false
  subscriptions:
    - backend_alpha
  interval: 10
  publish: true
  timeout: 10
  runtime_assets:
    - sensu-ruby-runtime
    - sensu-plugins-http
{{< /code >}}

{{< code yml "YML - Backend Beta">}}
---
type: CheckConfig
api_version: core/v2
metadata:
  namespace: default
  name: check_alpha_backend_health
spec:
  command: check-http.rb -u http://sensu-backend-beta:8080/health -n false
  subscriptions:
    - backend_beta
  interval: 10
  publish: true
  timeout: 10
  runtime_assets:
    - sensu-ruby-runtime
    - sensu-plugins-http
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
    "command": "check-http.rb -u http://sensu-backend-beta:8080/health -n false",
    "subscriptions": [
      "backend_alpha"
    ],
    "interval": 10,
    "publish": true,
    "timeout": 10,
    "runtime_assets": [
      "sensu-ruby-runtime",
      "sensu-plugins-http"
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
    "command": "check-http.rb -u http://sensu-backend-beta:8080/health -n false",
    "subscriptions": [
      "backend_beta"
    ],
    "interval": 10,
    "publish": true,
    "timeout": 10,
    "runtime_assets": [
      "sensu-ruby-runtime",
      "sensu-plugins-http"
    ]
  }
}
{{< /code >}}

{{< /language-toggle >}}

{{% notice note %}}
**NOTE**: This example uses the [Sensu Plugins HTTP](https://bonsai.sensu.io/assets/sensu-plugins/sensu-plugins-http) and [Sensu Ruby Runtime](https://bonsai.sensu.io/assets/sensu/sensu-ruby-runtime) dynamic runtime assets.
Read [Monitor server resources with checks](../../../observability-pipeline/observe-schedule/monitor-server-resources/#register-dynamic-runtime-assets) to learn how to add these assets.
{{% /notice %}}

## Monitor external etcd

If your Sensu Go deployment uses an external etcd cluster, you'll need to check the health of the respective etcd instances.

This example includes checks for your primary (Backend Alpha) and secondary (Backend Beta) backends:

{{< language-toggle >}}

{{< code yml "YML - Backend Alpha">}}
---
type: CheckConfig
api_version: core/v2
metadata:
  namespace: default
  name: check_beta_etcd_health
spec:
  command: check_http -H sensu-beta-etcd -p 2379 -u /health
  subscriptions:
    - backend_alpha
  interval: 10
  publish: true
  timeout: 10
  runtime_assets:
    - monitoring-plugins
{{< /code >}}

{{< code yml "YML - Backend Beta">}}
---
type: CheckConfig
api_version: core/v2
metadata:
  namespace: default
  name: check_alpha_etcd_health
spec:
  command: check_http -H sensu-alpha-etcd -p 2379 -u /health
  subscriptions:
    - backend_beta
  interval: 10
  publish: true
  timeout: 10
  runtime_assets:
    - monitoring-plugins
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
    "command": "check_http -H sensu-beta-etcd -p 2379 -u /health",
    "subscriptions": [
      "backend_alpha"
    ],
    "interval": 10,
    "publish": true,
    "timeout": 10,
    "runtime_assets": [
      "monitoring-plugins"
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
    "command": "check_http -H sensu-alpha-etcd -p 2379 -u /health",
    "subscriptions": [
      "backend_beta"
    ],
    "interval": 10,
    "publish": true,
    "timeout": 10,
    "runtime_assets": [
      "monitoring-plugins"
    ]
  }
}
{{< /code >}}

{{< /language-toggle >}}

## Monitor Postgres

{{% notice commercial %}}
**COMMERCIAL FEATURE**: Access enterprise-scale Postgres event storage in the packaged Sensu Go distribution.
For more information, see [Get started with commercial features](../../../commercial/).
{{% /notice %}}

Larger Sensu deployments may use [Postgres as an alternative datastore][4] to process larger numbers of events.
The connection to Postgres is exposed on Sensu's `/health` endpoint and will look like the example below:

{{< code json >}}
{
  "Alarms": null,
  "ClusterHealth": [{
    "MemberID": 3470366781180380542,
    "MemberIDHex": "302938336092857e",
    "Name": "sensu00",
    "Err": "",
    "Healthy": true
  }, {
    "MemberID": 15883454222313069303,
    "MemberIDHex": "dc6d5d7607261af7",
    "Name": "sensu01",
    "Err": "",
    "Healthy": true
  }, {
    "MemberID": 11377294497886211005,
    "MemberIDHex": "9de44510fb838bbd",
    "Name": "sensu02",
    "Err": "",
    "Healthy": true
  }],
  "Header": {
    "cluster_id": 13239446193995634903,
    "member_id": 3470366781180380542,
    "raft_term": 1549
  },
  "PostgresHealth": [{
    "Name": "sensu_postgres",
    "Active": true,
    "Healthy": true
  }]
}
{{< /code >}}

To monitor Postgres' health from Sensu's perspective, use a check like this example:

{{< language-toggle >}}

{{< code yml >}}
---
type: CheckConfig
api_version: core/v2
metadata:
  created_by: admin
  labels:
    sensu.io/managed_by: sensuctl
  name: check-postgres-health
  namespace: default
spec:
  check_hooks: null
  command: check-http-json.rb -u https://sensu.example.com:8080/health --key PostgresHealth[0].Healthy
    --value true
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
  - sensu-plugins/sensu-plugins-http
  - sensu/sensu-ruby-runtime
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
  "command": "check-http-json.rb -u https://sensu.example.com:8080/health --key PostgresHealth[0].Healthy --value true",
  "handlers": [],
  "high_flap_threshold": 0,
  "interval": 10,
  "low_flap_threshold": 0,
  "publish": true,
  "runtime_assets": [
    "sensu-plugins/sensu-plugins-http",
    "sensu/sensu-ruby-runtime"
  ],
  "subscriptions": [
    "backends"
  ],
  "proxy_entity_name": "",
  "check_hooks": null,
  "stdin": false,
  "subdue": null,
  "ttl": 0,
  "timeout": 0,
  "round_robin": true,
  "output_metric_format": "",
  "output_metric_handlers": null,
  "output_metric_tags": null,
  "env_vars": null,
  "metadata": {
    "name": "check-postgres-health",
    "namespace": "default",
    "labels": {
      "sensu.io/managed_by": "sensuctl"
    },
    "created_by": "admin"
  },
  "secrets": null
}
{{< /code >}}

{{< /language-toggle >}}

{{% notice note %}}
**NOTE**: This example uses the [Sensu Plugins HTTP](https://bonsai.sensu.io/assets/sensu-plugins/sensu-plugins-http) and [Sensu Ruby Runtime](https://bonsai.sensu.io/assets/sensu/sensu-ruby-runtime) dynamic runtime assets.
Read [Monitor server resources with checks](../../../observability-pipeline/observe-schedule/monitor-server-resources/#register-dynamic-runtime-assets) to learn how to add these assets.
{{% /notice %}}

A successful PostgreSQL health check result will look like this:

{{< figure src="/images/sensu-postgres-health.png" alt="Successful Postgres health check in Sensu Go web UI" link="/images/sensu-postgres-health.png" target="_blank" >}}


[1]: ../../../plugins/use-assets-to-install-plugins/
[2]: ../../../api/health/
[3]: https://bonsai.sensu.io/assets/sensu/monitoring-plugins
[4]: ../../deploy-sensu/scale-event-storage/
