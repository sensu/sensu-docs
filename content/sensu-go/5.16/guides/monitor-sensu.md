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
- [Monitor your Sensu API instances](#monitor-your-sensu-api-instances)
- [Monitor your Sensu dashboard instances](#monitor-your-sensu-dashboard-instances)

This guide describes best practices and strategies for monitoring Sensu with Sensu. 
It explains how to ensure your Sensu components are properly monitored, including your Sensu backend, agent, API, and dashboard instances.

To completely monitor a Sensu stack [Sensu backend, agent, external etcd cluster (if used)], you will need to have at least one other independent Sensu instance.
A single Sensu stack cannot monitor itself completely because if some components are down, Sensu cannot create events.

This guide requires Sensu plugins.
For more information about using Sensu plugins, see [Install plugins with assets][16].

_**NOTE**: This guide assumes you are not using Sensu clustering. The strategies in this guide are still useful for monitoring cluster members, but you should follow [Run a Sensu cluster][17] to effectively monitor clustered instances._

## Monitor your Sensu backend instances

The host running the `sensu-backend` should be monitored in two ways:

* Locally by a `sensu-agent` process for operating system checks/metrics and Sensu services that are not part of the Sensu event system (like the dashboard)
* Remotely from an entirely independent Sensu stack to monitor Sensu components that must be running for Sensu to create events. 

### Monitor the Sensu backend locally

Monitor the host that the `sensu-backend` process runs on like any other node in your infrastructure.
This includes checks and metrics for [CPU][1], [memory][2], [disk][3], and [networking][4].
Find more plugins at [Bonsai, the Sensu asset index][5].

### Monitor the Sensu backend remotely

Monitor the `sensu-backend` server process from an independent Sensu stack.
To do this, call Sensu's [health API endpoint][6] and use the [check-http plugin][7] with the following check definition:

{{< highlight json >}}
{
  "type": "CheckConfig",
  "api_version": "core/v2",
  "metadata": {
    "namespace": "default",
    "name": "check_sensu_server_port"
  },
  "spec": {
    "command": "check-http.rb -h remote-api-hostname -P 4567 -p /health?consumers=1 --response-code 204",
    "subscriptions": [
      "monitor_remote_sensu_api"
    ],
    "interval": 60,
    "publish": true
  }
}
{{< /highlight >}}

## Monitor your Sensu agent instances

**CONTENT NEEDED**

## Monitor your Sensu API instances

Monitor your Sensu API instances from an independent Sensu stack.
To do this, call the port that the API is listening on using the [check-port plugin][8] with the following check definition:

{{< highlight json >}}
{
  "type": "CheckConfig",
  "api_version": "core/v2",
  "metadata": {
    "namespace": "default",
    "name": "check_sensu_api_port"
  },
  "spec": {
    "command": "check-ports.rb -H remote-sensu-server-hostname -p 4567",
    "subscriptions": [
      "monitor_remote_sensu_api"
    ],
    "interval": 60,
    "publish": true
  }
}
{{< /highlight >}}

## Monitor your Sensu dashboard instances

You can monitor your dashboard instances with a process check or a remote network port check.
This section describes each of the two methods.

_**PRO TIP**: Use both methods to completely monitor your dashboard. This way, you can catch when the processes are not running and when a firewall port is not open._

**Method 1: Monitor dashboard with a process check**

To monitor the dashboard, you will need to check for two processes named `dashboard` using the [check-process plugin][9] with the following check definition:

{{< highlight json >}}
{
  "type": "CheckConfig",
  "api_version": "core/v2",
  "metadata": {
    "namespace": "default",
    "name": "check_dashboard_process"
  },
  "spec": {
    "command": "/opt/sensu/embedded/bin/check-process.rb -p /opt/dashboard/bin/dashboard -C 2",
    "subscriptions": [
      "monitor_local_dashboard_processes"
    ],
    "interval": 60,
    "publish": true
  }
}
{{< /highlight >}}

You need a check for two processes because the dashboard service has a parent and child process.

This check will return a result with status `2` if fewer than two processes are running with the string `/opt/dashboard/bin/dashboard`.

**Method 2: Monitor dashboard with a remote network port check**

You can also monitor the dashboard with a remote port check using the [check-port plugin][8] with the following check definition:

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

[1]: https://bonsai.sensu.io/assets/sensu-plugins/sensu-plugins-cpu-checks
[2]: https://bonsai.sensu.io/assets/sensu-plugins/sensu-plugins-memory-checks
[3]: https://bonsai.sensu.io/assets/sensu-plugins/sensu-plugins-disk-checks
[4]: https://bonsai.sensu.io/assets/sensu-plugins/sensu-plugins-network-checks
[5]: https://bonsai.sensu.io/
[6]: ../../api/health/
[7]: https://github.com/sensu-plugins/sensu-plugins-http/blob/master/bin/check-http.rb
[8]: https://github.com/sensu-plugins/sensu-plugins-network-checks/blob/master/bin/check-ports.rb
[9]: https://github.com/sensu-plugins/sensu-plugins-process-checks/blob/master/bin/check-process.rb
[16]: ../../guides/install-check-executables-with-assets/
[17]: ../../guides/clustering/
