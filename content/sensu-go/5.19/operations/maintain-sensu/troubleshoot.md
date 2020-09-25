---
title: "Troubleshoot Sensu"
linkTitle: "Troubleshoot"
description: "Here’s how to troubleshoot Sensu, including how to look into errors, service logging, log levels. Sensu service logs produced by sensu-backend and sensu-agent are often the best source of truth when troubleshooting issues, so start there."
weight: 30
version: "5.19"
product: "Sensu Go"
platformContent: true
platforms: ["Linux", "Windows"]
menu:
  sensu-go-5.19:
    parent: maintain-sensu
---

## Service logging

Logs produced by Sensu services (sensu-backend and sensu-agent) are often the best place to start when troubleshooting a variety of issues.

### Log levels

Each log message is associated with a log level that indicates the relative severity of the event being logged:

| Log level          | Description |
|--------------------|--------------------------------------------------------------------------|
| panic              | Severe errors that cause the service to shut down in an unexpected state |
| fatal              | Fatal errors that cause the service to shut down (status 0)              |
| error              | Non-fatal service error messages                                         |
| warn               | Warning messages that indicate potential issues                          |
| info               | Information messages that represent service actions                      |
| debug              | Detailed service operation messages to help troubleshoot issues          |
| trace              | Confirmation messages about whether a rule authorized a request          |

You can configure these log levels by specifying the desired log level as the value of `log-level` in the service configuration file (`agent.yml` or `backend.yml`) or as an argument to the `--log-level` command line flag:

{{< code shell >}}
sensu-agent start --log-level debug
{{< /code >}}

You must restart the service after you change log levels via configuration files or command line arguments.
For help with restarting a service, see the [agent reference][5] or [backend reference][9].

### Log file locations

{{< platformBlock "Linux" >}}

#### Linux

Sensu services print [structured log messages][7] to standard output.
To capture these log messages to disk or another logging facility, Sensu services use capabilities provided by the underlying operating system's service management.
For example, logs are sent to the journald when systemd is the service manager, whereas log messages are redirected to `/var/log/sensu` when running under sysv init schemes.
If you are running systemd as your service manager and would rather have logs written to `/var/log/sensu/`, see [forwarding logs from journald to syslog][11].

The following table lists the common targets for logging and example commands for following those logs.
You may substitute the name of the desired service (e.g. `backend` or `agent`) for the `${service}` variable.

| Platform     | Version           | Target | Command to follow log |
|--------------|-------------------|--------------|-----------------------------------------------|
| RHEL/Centos  | >= 7       | journald     | {{< code shell >}}journalctl --follow --unit sensu-${service}{{< /code >}}   |
| RHEL/Centos  | <= 6       | log file     | {{< code shell >}}tail --follow /var/log/sensu/sensu-${service}{{< /code >}} |
| Ubuntu       | >= 15.04   | journald     | {{< code shell >}}journalctl --follow --unit sensu-${service}{{< /code >}}   |
| Ubuntu       | <= 14.10   | log file     | {{< code shell >}}tail --follow /var/log/sensu/sensu-${service}{{< /code >}} |
| Debian       | >= 8       | journald     | {{< code shell >}}journalctl --follow --unit sensu-${service}{{< /code >}}   |
| Debian       | <= 7       | log file     | {{< code shell >}}tail --follow /var/log/sensu/sensu-${service}{{< /code >}} |

{{% notice note %}}
**NOTE**: Platform versions are listed for reference only and do not supersede the documented [supported platforms](../../../platforms).
{{% /notice %}}

##### Narrow your search to a specific timeframe

Use the `journald` keyword `since` to refine the basic `journalctl` commands and narrow your search by timeframe.

Retrieve all the logs for sensu-backend since yesterday:

{{< code shell >}}
journalctl -u sensu-backend --since yesterday | tee sensu-backend-$(date +%Y-%m-%d).log
{{< /code >}}

Retrieve all the logs for sensu-agent since a specific time:

{{< code shell >}}
journalctl -u sensu-agent --since 09:00 --until "1 hour ago" | tee sensu-agent-$(date +%Y-%m-%d).log
{{< /code >}}

Retrieve all the logs for sensu-backend for a specific date range:

{{< code shell >}}
journalctl -u sensu-backend --since "2015-01-10" --until "2015-01-11 03:00" | tee sensu-backend-$(date +%Y-%m-%d).log
{{< /code >}}

{{< platformBlockClose >}}

{{< platformBlock "Windows" >}}

##### Logging edge cases

If a Sensu service experiences a panic crash, the service may seem to start and stop without producing any output in journalctl.
This is due to a [bug in systemd][12].

In these cases, try using the `_COMM` variable instead of the `-u` flag to access additional log entries:

{{< code shell >}}
journalctl _COMM=sensu-backend.service --since yesterday
{{< /code >}}

#### Windows

The Sensu agent stores service logs to the location specified by the `log-file` configuration flag (default `%ALLUSERSPROFILE%\sensu\log\sensu-agent.log`, `C:\ProgramData\sensu\log\sensu-agent.log` on standard Windows installations).
For more information about managing the Sensu agent for Windows, see the [agent reference][1].
You can also view agent events using the Windows Event Viewer, under Windows Logs, as events with source SensuAgent.

If you're running a [binary-only distribution of the Sensu agent for Windows][2], you can follow the service log printed to standard output using this command:

{{< code text >}}
Get-Content -  Path "C:\scripts\test.txt" -Wait
{{< /code >}}

{{< platformBlockClose >}}

## Sensu backend startup errors

The following errors are expected when starting up a Sensu backend with the default configuration:

{{< code shell >}}
{"component":"etcd","level":"warning","msg":"simple token is not cryptographically signed","pkg":"auth","time":"2019-11-04T10:26:31-05:00"}
{"component":"etcd","level":"warning","msg":"set the initial cluster version to 3.3","pkg":"etcdserver/membership","time":"2019-11-04T10:26:31-05:00"}
{"component":"etcd","level":"warning","msg":"serving insecure client requests on 127.0.0.1:2379, this is strongly discouraged!","pkg":"embed","time":"2019-11-04T10:26:33-05:00"}
{{< /code >}}

The `serving insecure client requests` warning is an expected warning from the embedded etcd database.
[TLS configuration][3] is recommended but not required.
For more information, see [etcd security documentation][4].

## Permission issues

The Sensu user and group must own files and folders within `/var/cache/sensu/` and `/var/lib/sensu/`.
You will see a logged error like those listed here if there is a permission issue with either the sensu-backend or the sensu-agent:

{{< code shell >}}
{"component":"agent","error":"open /var/cache/sensu/sensu-agent/assets.db: permission denied","level":"fatal","msg":"error executing sensu-agent","time":"2019-02-21T22:01:04Z"}
{"component":"backend","level":"fatal","msg":"error starting etcd: mkdir /var/lib/sensu: permission denied","time":"2019-03-05T20:24:01Z"}
{{< /code >}}

Use a recursive `chown` to resolve permission issues with the sensu-backend:

{{< code shell >}}
sudo chown -R sensu:sensu /var/cache/sensu/sensu-backend
{{< /code >}}

or the sensu-agent:

{{< code shell >}}
sudo chown -R sensu:sensu /var/cache/sensu/sensu-agent
{{< /code >}}

## Handlers and event filters

Whether implementing new workflows or modifying existing workflows, you may need to troubleshoot various stages of the event pipeline.
In many cases, generating events using the [agent API][6] will save you time and effort over modifying existing check configurations.

Here's an example that uses cURL with the API of a local sensu-agent process to generate test-event check results:

{{< code shell >}}
curl -X POST \
-H 'Content-Type: application/json' \
-d '{
  "check": {
    "metadata": {
      "name": "test-event"
    },
    "status": 2,
    "output": "this is a test event targeting the email_ops handler",
    "handlers": [ "email_ops" ]
  }
}' \
http://127.0.0.1:3031/events
{{< /code >}}

It may also be helpful to see the complete event object being passed to your workflows.
We recommend using a debug handler like this one to write an event to disk as JSON data:

{{< language-toggle >}}

{{< code yml >}}
type: Handler
api_version: core/v2
metadata:
  name: debug
spec:
  type: pipe
  command: cat > /var/log/sensu/debug-event.json
  timeout: 2
{{< /code >}}

{{< code json >}}
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
{{< /code >}}

{{< /language-toggle >}}

With this handler definition installed in your Sensu backend, you can add the `debug` to the list of handlers in your test event:

{{< code shell >}}
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
{{< /code >}}

The event data should be written to `/var/log/sensu/debug-event.json` for inspection.
The contents of this file will be overwritten by every event sent to the `debug` handler.

{{% notice note %}}
**NOTE**: When multiple Sensu backends are configured in a cluster, event processing is distributed across all members.
You may need to check the filesystem of each Sensu backend to locate the debug output for your test event.
{{% /notice %}}

## Assets

Asset filters allow you to scope an asset to a particular operating system or architecture.
You can see an example in the [asset reference][10].
An improperly applied asset filter can prevent the asset from being downloaded by the desired entity and result in error messages both on the agent and the backend illustrating that the command was not found:

**Agent log entry**

{{< code json >}}
{
    "asset": "check-disk-space",
    "component": "asset-manager",
    "entity": "sensu-centos",
    "filters": [
        "true == false"
    ],
    "level": "debug",
    "msg": "entity not filtered, not installing asset",
    "time": "2019-09-12T18:28:05Z"
}
{{< /code >}}

**Backend event**

{{< code json >}}

 {
  "timestamp": 1568148292,
  "check": {
    "command": "check-disk-space",
    "handlers": [],
    "high_flap_threshold": 0,
    "interval": 10,
    "low_flap_threshold": 0,
    "publish": true,
    "runtime_assets": [
      "sensu-plugins-disk-checks"
    ],
    "subscriptions": [
      "caching_servers"
    ],
    "proxy_entity_name": "",
    "check_hooks": null,
    "stdin": false,
    "subdue": null,
    "ttl": 0,
    "timeout": 0,
    "round_robin": false,
    "duration": 0.001795508,
    "executed": 1568148292,
    "history": [
      {
        "status": 127,
        "executed": 1568148092
      }
    ],
    "issued": 1568148292,
    "output": "sh: check-disk-space: command not found\n",
    "state": "failing",
    "status": 127,
    "total_state_change": 0,
    "last_ok": 0,
    "occurrences": 645,
    "occurrences_watermark": 645,
    "output_metric_format": "",
    "output_metric_handlers": null,
    "env_vars": null,
    "metadata": {
      "name": "failing-disk-check",
      "namespace": "default"
    }
  },
  "metadata": {
    "namespace": "default"
  }
}
{{< /code >}}

If you see a message like this, review your asset definition &mdash; it means that the entity wasn't able to download the required asset due to asset filter restrictions.
You can review the filters for an asset by using the sensuctl `asset info` command with a `--format` flag:

{{< code shell >}}
sensuctl asset info sensu-plugins-disk-checks --format yaml
{{< /code >}}

or 

{{< code shell >}}
sensuctl asset info sensu-plugins-disk-checks --format json
{{< /code >}}

### Conflating operating systems with families

A common asset filter issue is conflating operating systems with the family they're a part of.
For example, although Ubuntu is part of the Debian family of Linux distributions, Ubuntu is not the same as Debian.
A practical example might be:

{{< code shell >}}
...
    - entity.system.platform == 'debian'
    - entity.system.arch == 'amd64'
{{< /code >}}

This would not allow an Ubuntu system to run the asset.

Instead, the asset filter should look like this:

{{< code shell >}}
...
    - entity.system.platform_family == 'debian'
    - entity.system.arch == 'amd64'
{{< /code >}}

or 

{{< code shell >}}
    - entity.system.platform == 'ubuntu'
    - entity.system.arch == 'amd64'
{{< /code >}}

This would allow the asset to be downloaded onto the target entity.

### Running the agent on an unsupported Linux platform

If you run the Sensu agent on an unsupported Linux platform, the agent might fail to correctly identify your version of Linux and could download the wrong version of an asset.

This issue affects Linux distributions that do not include the `lsb_release` package in their default installations.
In this case, `gopsutil` may try to open `/etc/lsb_release` or try to run `/usr/bin/lsb_release` to find system information, including Linux version.
Since the `lsb_release` package is not installed, the agent will not be able to discover the Linux version as expected.

To resolve this problem, install the [`lsb_release` package][8] for your Linux distribution.


[1]: ../../../reference/agent#operation
[2]: ../../../platforms/#windows
[3]: ../../deploy-sensu/secure-sensu/#sensu-agent-mtls-authentication
[4]: https://etcd.io/docs/v3.4.0/op-guide/security/
[5]: ../../../reference/agent/#restart-the-service
[6]: ../../../reference/agent#events-post
[7]: https://dzone.com/articles/what-is-structured-logging
[8]: https://pkgs.org/download/lsb
[9]: ../../../reference/backend/#restart-the-service
[10]: ../../../reference/assets/#asset-definition-multiple-builds
[11]: ../../monitor-sensu/log-sensu-systemd/
[12]: https://github.com/systemd/systemd/issues/2913
