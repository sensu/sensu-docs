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

This guide describes best practices and strategies for monitoring Sensu with Sensu.
It explains how to ensure your Sensu components are properly monitored, including your Sensu backend, agent, and API.

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

TODO: Postgres now is part of the health endpoint. Need to see what that looks like and what it looks like when it is not available.

[1]: https://bonsai.sensu.io/assets/sensu-plugins/sensu-plugins-cpu-checks
[2]: https://bonsai.sensu.io/assets/sensu-plugins/sensu-plugins-memory-checks
[3]: https://bonsai.sensu.io/assets/sensu-plugins/sensu-plugins-disk-checks
[4]: https://bonsai.sensu.io/assets/sensu-plugins/sensu-plugins-network-checks
[5]: https://bonsai.sensu.io/
[6]: ../../api/health/
[7]: https://bonsai.sensu.io/assets/sensu/monitoring-plugins
[8]: https://github.com/sensu-plugins/sensu-plugins-network-checks/blob/master/bin/check-ports.rb
[9]: https://github.com/sensu-plugins/sensu-plugins-process-checks/blob/master/bin/check-process.rb
[10]: ../../guides/install-check-executables-with-assets/
[11]: ../../reference/agent/#keepalive-monitoring
[12]: ../../api/metrics/
[13]: https://bonsai.sensu.io/assets/sensu/sensu-prometheus-collector
