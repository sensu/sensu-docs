---
title: "Monitor Sensu with Sensu"
linkTitle: "Monitor Sensu with Sensu"
description: "Make sure your Sensu components are properly monitored. This guide describes best practices and strategies for monitoring Sensu."
weight: 230
version: "5.21"
product: "Sensu Go"
platformContent: False
menu: 
  sensu-go-5.21:
    parent: guides
---

- [Monitor your Sensu backend instances](#monitor-your-sensu-backend-instances)
  - [Monitor your Embedded etcd](#monitor-your-embedded-etcd)
  - [Monitor your External etcd](#monitor-your-external-etcd)
- [Monitor Postgres](#postgres)

{{< code markdown "Sensu Backend">}}
| Port | Endpoint | Description                                                                                                                |
|------|----------|----------------------------------------------------------------------------------------------------------------------------|
| 8080 | /health  | Sensu Go health endpoint. Provides health status for Sensu backends. Also provides health status for Postgres when enabled |
| 2379 | /health  | Etcd health endpoint. Provides health status for etcd nodes.                                                               |
{{< /code >}}

This guide describes best practices and strategies for monitoring the Sensu backend with another Sensu backend or cluster.

To completely monitor Sensu (a Sensu backend with internal etcd and an agent), you will need at least one other independent Sensu instance.
The second Sensu instance will ensure that you are notified when the primary is down and vice versa.

This guide requires Sensu plugins using assets.
For more information about using Sensu plugins, see [Install plugins with assets][10].

_**NOTE**: This guide describes approaches for monitoring a single backend. The strategies in this guide are also useful for monitoring individual members of a backend cluster._

_**NOTE**: This guide does not go over Sensu agent monitoring. To learn more about monitoring agent state, visit the [keepalive][11] reference_

## Monitor your Sensu backend instances

Monitor the host running the `sensu-backend` in two ways:

* Locally by a `sensu-agent` process for operating system checks and metrics.
* Remotely from an independent Sensu instance for Sensu components that must be running for Sensu to create events.

### Monitor the Sensu backend remotely

Monitor the `sensu-backend` from an independent Sensu instance. This will allow you to know if the Sensu event pipeline or is not working.
To do this, use the `check_http` plugin from the [Monitoring plugins asset][7] to query Sensu's [health API endpoint][6] with a check definition like this one:

{{< language-toggle >}}
{{< code yaml "Backend Alpha">}}
---
type: CheckConfig
api_version: core/v2
metadata:
  namespace: default
  name: check_beta_backend_health
spec:
  command: check_http -H sensu-backend-beta -p 8080 -u /health
  subscriptions:
    - backend_alpha
  interval: 10
  publish: true
  timeout: 10
  runtime_assets:
    - monitoring-plugins
{{< /code >}}
{{< code yaml "Backend Beta">}}
---
type: CheckConfig
api_version: core/v2
metadata:
  namespace: default
  name: check_alpha_backend_health
spec:
  command: check_http -H sensu-backend-alpha -p 8080 -u /health
  subscriptions:
    - backend_beta
  interval: 10
  publish: true
  timeout: 10
  runtime_assets:
    - monitoring-plugins
{{< /code >}}
{{< /language-toggle >}}

## Monitoring external etcd

In the case where your Sensu Go deployment utilizes an external etcd cluster, you'll need to check the health of the respective etcd instances. See the examples below:

{{< language-toggle >}}
{{< code yaml "Backend Alpha">}}
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
{{< code yaml "Backend Beta">}}
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
{{< /language-toggle >}}

## Postgres

In larger Sensu deployments, [Postgres may be used as an alternative datastore][postgres] to enable larger amounts of events to be processed. When using Postgres, the connection to Postgres is exposed on Sensu's `/health` endpoint, and will look like the example below:

{{< code yaml >}}
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

To monitor Postgres' health from Sensu's perspective, we'll use check example below:

{{< language-toggle >}}

{{< code yaml >}}
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

A successful check result will look like:

![Screenshot of postgres health check in Sensu Go UI][sensu-postgres-health]

<!--LINKS-->
[6]: ../../api/health/
[7]: https://bonsai.sensu.io/assets/sensu/monitoring-plugins
[10]: ../../guides/install-check-executables-with-assets/
[11]: ../../reference/agent/#keepalive-monitoring
[12]: ../../api/metrics/
[13]: https://bonsai.sensu.io/assets/sensu/sensu-prometheus-collector
[postgres]: https://docs.sensu.io/sensu-go/latest/operations/deploy-sensu/scale-event-storage/
[sensu-postgres-health]: /images/sensu-postgres-health.png