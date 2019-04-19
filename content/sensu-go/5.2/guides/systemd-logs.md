---
title: "Sensu service logging with systemd"
description: "By default, systems where systemd is the service manager do not write logs to /var/log/sensu/. This guide walks you through how to add log forwarding from journald to syslog, have rsyslog write logging data to disk, and set up log rotation of the newly created log files."
version: "5.2"
product: "Sensu Go"
platformContent: false
weight: 1001
menu: 
  sensu-go-5.2:
    parent: guides
---


By default, systems where systemd is the service manager do not write logs to `/var/log/sensu/` for the `sensu-agent` and the `sensu-backend` services. This guide walks you through how to add log forwarding from journald to syslog, have rsyslog write logging data to disk, and set up log rotation of the newly created log files.

To configure journald to forward logging data to syslog, modify `/etc/systemd/journald.conf` to include the following line:

{{< highlight shell >}}
ForwardToSyslog=yes
{{< /highlight >}}

Next, set up rsyslog to write the logging data received from journald to `/var/log/sensu/servicename.log`. In this example, the `sensu-backend` and `sensu-agent` logging data is sent to individual files named after the service. The `sensu-backend` is not required if only setting up log forwarding for the `sensu-agent` service.

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

Restart rsyslog and journald to apply the new configuration:

{{< highlight shell>}}
systemctl restart systemd-journald
systemctl restart rsyslog
{{< /highlight>}}

Set up log rotation for newly created log files. This example rotates all log files in `/var/log/sensu/` weekly, unless the size of 100M is reached first. The last five rotated logs are kept and compressed, with the exception of the most recent one.

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
