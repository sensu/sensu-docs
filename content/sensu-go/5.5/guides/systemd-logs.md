---
title: "systemd log files"
description: "place holder"
weight: 2000
version: "5.5"
product: "Sensu Go"
platformContent: false
---

## Adding log to disk for systemd

By default, systems where `systemd` is the service manager, logs are not written to `/var/log/sensu/` for the `sensu-agent` and the `sensu-backend` services. The following will walk you how to add log forwarding from `journald` to `syslog`, have `rsyslog` write logging data to disk and setup log rotation of the newly created log files.

To configure `journald` to forward logging data to `syslog`, modify `/etc/systemd/journald.conf` to include the following line:

{{< highlight shell >}}
ForwardToSyslog=yes
{{< /highlight >}}

Next, setup `rsyslog` to write the logging data received from `journald` to `/var/log/sensu/servicename.log`. In this example, the `sensu-backend` and `sensu-agent` logging data is sent to individual files named after the sercice. The `sensu-backend` is not required if only setting up log forwarding for the `sensu-agent` service:

{{< highlight shell >}}
# For the sensu-backend service, inside /etc/rsyslog.d/99-sensu-backend.conf
if $programname == 'sensu-backend' then {
        /var/log/sensu/sensu-backend.log
        ~
}

# For the sensu-agent service, inside /etc/rsyslog.d/99-sensu-agent.conf
if $programname == 'sensu-agent' then {
        /var/log/sensu/sensu-agent.log
        ~
}
{{< /highlight >}}

Restart `rsyslog` to apply the new configuration:

{{< highlight shell>}}
systemctl restart rsyslog
{{< /highlight>}}

Setup log rotation for newly created log files. This example will rotate all log files in `/var/log/sensu/` weekly, unless the size of 100M is reached first. The last five rotated logs will be kept and they will be compressed, with the exception of the most recent one.

{{< highlight shell>}}
# Inside /etc/logrotate.d/sensu.conf
/var/log/sensu/* {
    weekly
    rotate 5
    size 100M
    compress
    delaycompress
}
{{< /highlight>}}

You can use the following command to see what logrotate would do if it were executed now based on the above schedule and size threshold.

{{< highlight shell>}}
logrotate -d /etc/logrotate.d/sensu.conf
{{< /highlight>}}
