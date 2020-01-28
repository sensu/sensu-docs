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

This guide requires Sensu plugins.
For more information about using Sensu plugins, see [Install plugins with assets][10].

_**NOTE**: This guide assumes you are not using Sensu clustering, although the strategies in this guide are still useful for monitoring cluster members._

## Monitor your Sensu backend instances

Monitor the host running the `sensu-backend` in two ways:

* Locally by a `sensu-agent` process for operating system checks and metrics and Sensu services that are not part of the Sensu event system (like the dashboard)
* Remotely from an independent Sensu instance for Sensu components that must be running for Sensu to create events.

Here's an overview of the checks you might use depending on your backend setup:

|  | Check type | Recommended plugin |
---|------------|--------------------|
Single backend | Service checks | Plugin name |
Clustered backends | Port checks | Plugin name |
Distributed single backend instances | Prometheus collector check | Plugin name |
Distributed clustered backend instances | API queries as checks | Plugin name |
Distributed single backend instances (federated) | Service checks, port checks | Plugin name |
Distributed clustered backend instances (federated) | Prometheus collector check, API queries as checks | Plugin name |

### Monitor the Sensu backend locally

Monitor the host that the `sensu-backend` process runs on like any other node in your infrastructure.
This includes checks and metrics for [CPU][1], [memory][2], [disk][3], and [networking][4].
Find more plugins at [Bonsai, the Sensu asset index][5].

### Monitor the Sensu backend remotely

Monitor the `sensu-backend` server process from an independent Sensu instance.
To do this, call Sensu's [health API endpoint][6] and use the [check-http plugin][7] with the following check definition:

{{< highlight json >}}
{
  "type": "CheckConfig",
  "api_version": "core/v2",
  "metadata": {
    "namespace": "default",
    "name": "check_backend_health"
  },
  "spec": {
    "command": "check-http.rb -h remote-api-hostname -P 8080 -p /health --response-code 200 -w",
    "subscriptions": [
      "monitor_remote_sensu_api"
    ],
    "interval": 60,
    "publish": true,
    "timeout": 10
  }
}
{{< /highlight >}}

## Monitor your Sensu agent instances

You can use API port checks to monitor your Sensu agent.
Service checks are not effective for monitoring the Sensu agent because if the agent is down, a service check for it won't run.

The [keepalive][11] is a built-in monitor for whether the Sensu agent service is running and functional, although network issues can cause a non-OK keepalive event even if the agent is functional.

## Monitor your Sensu dashboard instances

To monitor your dashboard instances with a remote network port check, use the [check-port plugin][8] with the following check definition:

{{< highlight json >}}
{
  "type": "CheckConfig",
  "api_version": "core/v2",
  "metadata": {
    "namespace": "default",
    "name": "check_dashboard_port"
  },
  "spec": {
    "command": "check-ports.rb -H dashboard-remote-hostname -p 3000",
    "subscriptions": [
      "monitor_remote_dashboard_port"
    ],
    "interval": 60,
    "publish": true
  }
}
{{< /highlight >}}

## External etcd PLACEHOLDER

Note from Richie: We may want to eventually set up a section for the other possible setups (external etcd, postgres).

## PostgreSQL PLACEHOLDER

Note from Richie: We may want to eventually set up a section for the other possible setups (external etcd, postgres).

[1]: https://bonsai.sensu.io/assets/sensu-plugins/sensu-plugins-cpu-checks
[2]: https://bonsai.sensu.io/assets/sensu-plugins/sensu-plugins-memory-checks
[3]: https://bonsai.sensu.io/assets/sensu-plugins/sensu-plugins-disk-checks
[4]: https://bonsai.sensu.io/assets/sensu-plugins/sensu-plugins-network-checks
[5]: https://bonsai.sensu.io/
[6]: ../../api/health/
[7]: https://github.com/sensu-plugins/sensu-plugins-http/blob/master/bin/check-http.rb
[8]: https://github.com/sensu-plugins/sensu-plugins-network-checks/blob/master/bin/check-ports.rb
[9]: https://github.com/sensu-plugins/sensu-plugins-process-checks/blob/master/bin/check-process.rb
[10]: ../../guides/install-check-executables-with-assets/
[11]: ../../reference/agent/#keepalive-monitoring
