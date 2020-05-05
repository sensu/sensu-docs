---
title: "Monitor Sensu with Sensu"
linkTitle: "Monitor Sensu with Sensu"
description: "Make sure your Sensu components are properly monitored. This guide describes best practices and strategies for monitoring Sensu."
weight: 230
version: "5.16"
product: "Sensu Go"
platformContent: False
menu: 
  sensu-go-5.16:
    parent: guides
---

- [Monitor your Sensu backend instances](#monitor-your-sensu-backend-instances)
- [Monitor your Sensu agent instances](#monitor-your-sensu-agent-instances)
- [Monitor your Sensu dashboard instances](#monitor-your-sensu-dashboard-instances)
- [External etcd PLACEHOLDER](#external-etcd-placeholder)
- [PostgreSQL PLACEHOLDER](#postgresql-placeholder)

This guide describes best practices and strategies for monitoring Sensu with Sensu.
It explains how to ensure your Sensu components are properly monitored, including your Sensu backend, agent, API, and dashboard.

To completely monitor Sensu (a Sensu backend with internal etcd and an agent), you will need at least one other independent Sensu instance.
The second Sensu instance will ensure that you are notified when the primary is down and vice versa.

This guide requires Sensu plugins.
For more information about using Sensu plugins, see [Install plugins with assets][10].

_**NOTE**: This guide describes approaches for monitoring a single backend. The strategies in this guide are also useful for monitoring individual members of a backend cluster._

_**NOTE**: This guide does not go over Sensu agent monitoring. To learn more about monitoring agent state, visit the [keepalive][11] reference_

## Monitor your Sensu backend instances

Monitor the host running the `sensu-backend` in two ways:

* Locally by a `sensu-agent` process for operating system checks and metrics.
* Remotely from an independent Sensu instance for Sensu components that must be running for Sensu to create events.

### Monitor the Sensu backend locally

Monitor the host that runs `sensu-backend` like any other node in your infrastructure.
This includes checks and metrics for [CPU][1], [memory][2], [disk][3], and [networking][4].
Find more plugins at [Bonsai, the Sensu asset index][5].

### Monitor the Sensu backend remotely

Monitor the `sensu-backend` from an independent Sensu instance. This will allow you to know if the Sensu event pipeline, API or dashboard is not working.
To do this, use the `check_http` plugin from the [Monitoring plugins asset][7] to query Sensu's [health API endpoint][6] with a check definition like this one:

{{< highlight yaml >}}
---
type: CheckConfig
api_version: core/v2
metadata:
  namespace: default
  name: check_backend_health
spec:
  command: check_http -H sensu-backend-beta -p 8080 -u /health
  subscriptions:
    - monitor_remote_sensu_api_of_beta
  interval: 10
  publish: true
  timeout: 10
  runtime_assets:
    - monitoring-plugins
{{< /highlight >}}

## Monitor your Sensu dashboard instances

To monitor the dashboard portion of your sensu-backend remotely, use the check_tcp plugin from the [Monitoring plugins asset][7] with the following check definition:

{{< highlight yaml >}}
---
type: CheckConfig
api_version: core/v2
metadata:
  namespace: default
  name: check_dashboard_port
spec:
  command: check_tcp -H sensu-backend-beta -p 3000
  subscriptions:
    - monitor_remote_dashboard_port
  interval: 60
  publish: true
  runtime_assets:
    - monitoring-plugins
{{< /highlight >}}

## Monitor your Sensu API instances

To monitor the API portion of your sensu-backend remotely, use the [check-port plugin][8] with the following check definition:

{{< highlight json >}}
---
type: CheckConfig
api_version: core/v2
metadata:
  namespace: default
  name: check_api_port
spec:
  command: check-ports.rb -H dashboard-remote-hostname -p 8080
  subscriptions:
  - monitor_remote_dashboard_port
  interval: 60
  publish: true
{{< /highlight >}}

## External etcd PLACEHOLDER

TODO: See what makes sense here from a monitoring point of view, as since this is both external and a need for events to work for non-Postgres users, knowing the health of this will probably depend our secondary Sensu instance we talk about in this guide.

## PostgreSQL PLACEHOLDER

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
