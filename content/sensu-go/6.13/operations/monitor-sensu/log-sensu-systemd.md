---
title: "Log Sensu services with systemd"
linkTitle: "Log Sensu Services"
guide_title: "Log Sensu services with systemd"
type: "guide"
description: "Add Sensu log forwarding from journald to syslog, have rsyslog write logging data to disk, and set up log rotation of the newly created log files."
weight: 10
version: "6.13"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-6.13:
    parent: monitor-sensu
---

By default, systems where systemd is the service manager do not write logs to `/var/log/sensu/` for the `sensu-agent` and the `sensu-backend` services.
This guide explains how to add log forwarding from journald to syslog, have rsyslog write logging data to disk, and set up log rotation of the newly created log files.

## Requirements

To follow this guide, install the Sensu [backend][2] and make sure at least one Sensu [agent][3] is running.

## Configure journald

To configure journald to forward logging data to syslog, modify `/etc/systemd/journald.conf` to include the following line:

{{< code shell >}}
ForwardToSyslog=yes
{{< /code >}}

## Configure rsyslog

Set up rsyslog to write the logging data received from journald to `/var/log/sensu/servicename.log`.
In this example, the `sensu-backend` and `sensu-agent` logging data is sent to individual files named after the service.
The `sensu-backend` is not required if you're only setting up log forwarding for the `sensu-agent` service.

{{% notice note %}}
**NOTE**: Use a `conf` file name that will ensure the file is loaded before the default file in `/etc/rsyslog.d/`, which uses 50.
This example uses `40-sensu-backend.conf` and `40-sensu-agent.conf` for this reason.
{{% /notice %}}

1. For the sensu-backend service, in /etc/rsyslog.d/40-sensu-backend.conf, add:
{{< code shell >}}
if $programname == 'sensu-backend' then {
        /var/log/sensu/sensu-backend.log
        & stop
}
{{< /code >}}

2. For the sensu-agent service, in /etc/rsyslog.d/40-sensu-agent.conf, add:
{{< code shell >}}
if $programname == 'sensu-agent' then {
        /var/log/sensu/sensu-agent.log
        & stop
}
{{< /code >}}

3. **On Ubuntu systems**, run `chown -R syslog:adm /var/log/sensu` so syslog can write to that directory.

4. Restart journald:
{{< code shell >}}
systemctl restart systemd-journald
{{< /code >}}

5. Restart rsyslog to apply the new configuration:
{{< code shell >}}
systemctl restart rsyslog
{{< /code >}}

{{% notice note %}}
**NOTE**: Sensu log messages include the Sensu [log level](../../maintain-sensu/troubleshoot/#log-levels) as part of the log data.
Users with rsyslog expertise may be able to extract the log level from Sensu log messages and use rsyslog processing capabilities to separate the log messages into different files based on log level.
{{% /notice %}}

## Set up log rotation

Set up log rotation for newly created log files to ensure logging does not fill up your disk.

These examples rotate the log files `/var/log/sensu/sensu-agent.log` and `/var/log/sensu/sensu-backend.log` weekly, unless the size of 100M is reached first.
The last seven rotated logs are kept and compressed, with the exception of the most recent log.
After rotation, `rsyslog` is restarted to ensure logging is written to a new file and not the most recent rotated file.

1. In /etc/logrotate.d/sensu-agent.conf, add:
{{< code shell >}}
/var/log/sensu/sensu-agent.log {
    daily
    rotate 7
    size 100M
    compress
    delaycompress
    postrotate
      /bin/systemctl restart rsyslog
    endscript
}
{{< /code >}}

2. In /etc/logrotate.d/sensu-backend.conf, add:
{{< code shell >}}
/var/log/sensu/sensu-backend.log {
    daily
    rotate 7
    size 100M
    compress
    delaycompress
    postrotate
      /bin/systemctl restart rsyslog
    endscript
}
{{< /code >}}

Use the following command to find out what logrotate would do if it were executed now based on the above schedule and size threshold.
The `-d` flag will output details, but it will not take action on the logs or execute the postrotate script:

{{< code shell >}}
logrotate -d /etc/logrotate.d/sensu.conf
{{< /code >}}

## What's next

Sensu also offers observability event data logging to a separate JSON log file.
Read the [backend reference][1] for more information about event logging.


[1]: ../../../observability-pipeline/observe-schedule/backend/#event-logging
[2]: ../../deploy-sensu/install-sensu/#install-the-sensu-backend
[3]: ../../deploy-sensu/install-sensu/#install-sensu-agents
