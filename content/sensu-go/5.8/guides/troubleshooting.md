---
title: "Troubleshooting"
description: "Need to troubleshoot Sensu Go? Here’s how to look into errors, including service logging and the log levels you need to know about. Logs produced by Sensu services – i.e., sensu-backend and sensu-agent – are often the best source of truth when troubleshooting issues, so we recommend you start there."
weight: 2000
version: "5.8"
product: "Sensu Go"
platformContent: true
platforms: ["Linux", "Windows"]
menu:
  sensu-go-5.8:
    parent: guides
---

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
| RHEL/Centos  | >= 7       | journald     | {{< highlight shell >}}journalctl --unit sensu-${service} --follow{{< /highlight >}}   |
| RHEL/Centos  | <= 6       | log file     | {{< highlight shell >}}tail --follow /var/log/sensu/sensu-${service}{{< /highlight >}} |
| Ubuntu       | >= 15.04   | journald     | {{< highlight shell >}}journalctl --unit sensu-${service} --follow{{< /highlight >}}   |
| Ubuntu       | <= 14.10   | log file     | {{< highlight shell >}}tail --follow /var/log/sensu/sensu-${service}{{< /highlight >}} |
| Debian       | >= 8       | journald     | {{< highlight shell >}}journalctl --unit sensu-${service} --follow{{< /highlight >}}   |
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

### Log messages

#### Permission issues

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

[structured]: https://dzone.com/articles/what-is-structured-logging
[journalctl]: https://www.digitalocean.com/community/tutorials/how-to-use-journalctl-to-view-and-manipulate-systemd-logs
[platforms]: ../../getting-started/platforms
[agent-ref]: ../../reference/agent/#restarting-the-service
[backend-ref]: ../../reference/backend/#restarting-the-service
[journald-syslog]: ../systemd-logs
[1]: ../../reference/agent#operation
[2]: ../../installation/verify
