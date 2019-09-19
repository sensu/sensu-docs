---
title: "Troubleshooting"
description: "Need to troubleshoot Sensu Go? Here’s how to look into errors, including service logging and the log levels you need to know about. Logs produced by Sensu services – i.e., sensu-backend and sensu-agent – are often the best source of truth when troubleshooting issues, so we recommend you start there."
weight: 2000
version: "5.9"
product: "Sensu Go"
platformContent: true
platforms: ["Linux", "Windows"]
menu:
  sensu-go-5.9:
    parent: guides
---

- [Service logging](#service-logging)
	- [Log levels](#log-levels)
	- [Log file locations](#log-file-locations)
- [Permission issues](#permission-issues)
- [Handlers and filters](#troubleshooting-handlers-and-filters)

## Service logging

Logs produced by Sensu services -- i.e. sensu-backend and sensu-agent -- are
often the best place to start when troubleshooting a variety of issues.

### Log levels

Each log message is associated with a log level, indicative of the relative severity of the event being
logged:

| Log level          | Description |
|--------------------|-----------------------------------------------------------------------|
| panic              | Severe errors causing the service to shut down in an unexpected state |
| fatal              | Fatal errors causing the service to shut down (status 0)              |
| error              | Non-fatal service error messages                                      |
| warn               | Warning messages indicating potential issues                          |
| info               | Informational messages representing service actions                   |
| debug              | Detailed service operation messages to help troubleshoot issues       |

These log levels can be configured by specifying the desired log level as the
value of `log-level` in the service configuration file (e.g. `agent.yml` or
`backend.yml` configuration files), or as an argument to the `--log-level`
command line flag:

{{< highlight shell >}}
sensu-agent start --log-level debug
{{< /highlight >}}

Changes to log level via configuration file or command line arguments require
restarting the service. For guidance on restarting a service, please
consult the Operating section of the [agent][agent-ref] or
[backend][backend-ref] reference, respectively.

### Log file locations

{{< platformBlock "Linux" >}}

#### Linux

Sensu services print [structured log messages][structured] to standard output.
In order to capture these log messages to disk or another logging facility, Sensu services
make use of capabilities provided by the underlying operating system's service
management. For example, logs are sent to the journald when systemd is the service manager,
whereas log messages are redirected to `/var/log/sensu` when running under sysv
init schemes. If you are running systemd as your service manager and would rather have logs written to `/var/log/sensu/`, see the guide to [forwarding logs from journald to syslog][journald-syslog].

In the table below, the common targets for logging and example commands for
following those logs are described. The name of the desired service, e.g.
`backend` or `agent` may be substituted for `${service}` variable.

| Platform     | Version           | Target | Command to follow log |
|--------------|-------------------|--------------|-----------------------------------------------|
| RHEL/Centos  | >= 7       | journald     | {{< highlight shell >}}journalctl --follow --unit sensu-${service}{{< /highlight >}}   |
| RHEL/Centos  | <= 6       | log file     | {{< highlight shell >}}tail --follow /var/log/sensu/sensu-${service}{{< /highlight >}} |
| Ubuntu       | >= 15.04   | journald     | {{< highlight shell >}}journalctl --follow --unit sensu-${service}{{< /highlight >}}   |
| Ubuntu       | <= 14.10   | log file     | {{< highlight shell >}}tail --follow /var/log/sensu/sensu-${service}{{< /highlight >}} |
| Debian       | >= 8       | journald     | {{< highlight shell >}}journalctl --follow --unit sensu-${service}{{< /highlight >}}   |
| Debian       | <= 7       | log file     | {{< highlight shell >}}tail --follow /var/log/sensu/sensu-${service}{{< /highlight >}} |

_NOTE: Platform versions described above are for reference only and do not
supercede the documented [supported platforms][platforms]._

{{< platformBlockClose >}}

{{< platformBlock "Windows" >}}

#### Windows

The Sensu agent stores service logs to the location specified by the `log-file` configuration flag (default: `%ALLUSERSPROFILE%\sensu\log\sensu-agent.log`, `C:\ProgramData\sensu\log\sensu-agent.log` on standard Windows installations).
For more information about managing the Sensu agent for Windows, see the [agent reference][1].
You can also view agent events using the Windows Event Viewer, under Windows Logs, as events with source SensuAgent.

If you're running a [binary-only distribution of the Sensu agent for Windows][2], you can follow the service log printed to standard output using the following command.

{{< highlight text >}}
Get-Content -  Path "C:\scripts\test.txt" -Wait
{{< /highlight >}}

{{< platformBlockClose >}}

## Permission issues

Files and folders within `/var/cache/sensu/` and `/var/lib/sensu/` need to be owned by the sensu user and group. You will see a logged error similar to the following if there is a permission issue with either the sensu-backend or the sensu-agent:

{{< highlight shell >}}
{"component":"agent","error":"open /var/cache/sensu/sensu-agent/assets.db: permission denied","level":"fatal","msg":"error executing sensu-agent","time":"2019-02-21T22:01:04Z"}
{"component":"backend","level":"fatal","msg":"error starting etcd: mkdir /var/lib/sensu: permission denied","time":"2019-03-05T20:24:01Z"}
{{< /highlight >}}

You can use a recursive `chown` to resolve permission issues with the sensu-backend:

{{< highlight shell >}}
sudo chown -R sensu:sensu /var/cache/sensu/sensu-backend
{{< /highlight >}}

or the sensu-agent:

{{< highlight shell >}}
sudo chown -R sensu:sensu /var/cache/sensu/sensu-agent
{{< /highlight >}}

## Troubleshooting handlers and filters

Whether implementing new workflows or modifying existing ones, its sometimes necessary to troubleshoot various stages of the event pipeline. In many cases generating events using the [agent API][agent-api] will save you time and effort over modifying existing check configurations.

Here's an example using curl with the API of a local sensu-agent process to generate test-event check results:

{{< highlight shell >}}
curl -X POST \
-H 'Content-Type: application/json' \
-d '{
  "check": {
    "metadata": {
      "name": "test-event",
      "namespace": "default"
    },
    "status": 2,
    "output": "this is a test event targeting the email_ops handler",
    "handlers": [ "email_ops" ]
  }
}' \
http://127.0.0.1:3031/events
{{< /highlight >}}

Additionally, it's frequently helpful to see the full event object being passed to your workflows. We recommend using a debug handler like this one to write an event to disk as JSON data:

{{< language-toggle >}}

{{< highlight yml >}}
type: Handler
api_version: core/v2
metadata:
  name: debug
  namespace: default
spec:
  type: pipe
  command: cat > /var/log/sensu/debug-event.json
  timeout: 2
{{< /highlight >}}

{{< highlight json >}}
{
  "type": "Handler",
  "api_version": "core/v2",
  "metadata": {
    "name": "debug"
  },
  "spec": {
    "type": "pipe",
    "command": "cat > /var/log/sensu/debug-event.json",
    "timeout": 2
  }
}
{{< /highlight >}}

{{< /language-toggle >}}

With this handler definition installed in your Sensu backend, you can add the `debug` to the list of handlers in your test event:

{{< highlight shell >}}
curl -X POST \
-H 'Content-Type: application/json' \
-d '{
  "check": {
    "metadata": {
      "name": "test-event"
    },
    "status": 2,
    "output": "this is a test event targeting the email_ops handler",
    "handlers": [ "email_ops", "debug" ]
  }
}' \
http://127.0.0.1:3031/events
{{< /highlight >}}

The event data should be written to `/var/log/sensu/debug-event.json` for inspection. The contents of this file will be overwritten by every event sent to the `debug` handler.

_NOTE: When multiple Sensu backends are configured in a cluster, event processing is distributed across all members. You may need to check the filesystem of each Sensu backend to locate the debug output for your test event._

[agent-api]: ../../reference/agent#events-post
[structured]: https://dzone.com/articles/what-is-structured-logging
[journalctl]: https://www.digitalocean.com/community/tutorials/how-to-use-journalctl-to-view-and-manipulate-systemd-logs
[platforms]: ../../installation/platforms
[agent-ref]: ../../reference/agent/#restarting-the-service
[backend-ref]: ../../reference/backend/#restarting-the-service
[journald-syslog]: ../systemd-logs
[1]: ../../reference/agent#operation
[2]: ../../installation/verify
