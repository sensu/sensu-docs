---
title: "How to monitor server resources with checks"
linkTitle: "Monitoring Server Resources"
weight: 10
version: "5.1"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-5.1:
    parent: guides
---

## What are Sensu checks?

Sensu checks are **commands** (or scripts), executed by the Sensu agent, that
output data and produce an exit code to indicate a state. Sensu checks use the
same specification as **Nagios**, therefore, Nagios **check plugins** may be
used with Sensu.

## Why use a check?

Checks are commonly used to monitor server resources, services, and application
health (e.g. is Nginx running?) as well as collect & analyze metrics (e.g. how
much disk space do I have left?)

## Using checks to monitor a service

The purpose of this guide is to help you monitor server resources, more
specifically the CPU usage, by configuring a check named `check-cpu` with a
**subscription** named `linux`, in order to target all **entities** subscribed
to the `linux` subscription.
This guide requires a Sensu backend and at least one Sensu agent running on Linux.

### Installing a script

The `check-cpu.sh` script provided by the [Sensu CPU Checks Plugin][1] can
reliably detect the percentage of CPU usage. The following command will provide
the `check-cpu.sh` script and should be run on every Sensu agent that has an
entity subscribed to the `linux` subscription.

{{< highlight shell >}}
sudo curl https://raw.githubusercontent.com/sensu-plugins/sensu-plugins-cpu-checks/03a99bab0237c81121ce702b0c5a5a3b44908535/bin/check-cpu.sh \
-o /usr/local/bin/check-cpu.sh && \
sudo chmod +x /usr/local/bin/check-cpu.sh
{{< /highlight >}}

While this command is appropriate when running a few agents, you should consider
using a **configuration management** tool or use [Sensu assets][2] to provide
runtime dependencies to checks on bigger environments.

_NOTE: On RHEL/CentOS, the `check-cpu.sh` plugin requires [bc](https://www.gnu.org/software/bc/).
Run `sudo yum install bc` to install bc._

### Creating the check

Now that our script is installed, the second step is to create a check named
`check-cpu`, which runs the command `check-cpu.sh -w 75 -c 90`, at an
**interval** of 60 seconds, for all entities subscribed to the `linux`
subscription.

{{< highlight shell >}}
sensuctl check create check-cpu \
--command 'check-cpu.sh -w 75 -c 90' \
--interval 60 \
--subscriptions linux
{{< /highlight >}}

_NOTE: Sensu advises against requiring root privileges to execute check
commands or scripts. The Sensu user is not permitted to kill timed out processes
invoked by the root user, which could result in zombie processes. While Sensu
discourages the use of `sudo` in check commands, you are free to configure your
checks as you see fit, but please do so at your own risk._

### Validating the check

You can verify the proper behavior of this check against a specific entity by using `sensuctl`.
Replace `example-entity-name` in the following command with the name of a `linux`-subscribed entity.
It might take a few moments, once the check is created,
for the check to be scheduled on the entity and the result sent back to Sensu backend.

{{< highlight shell >}}
sensuctl event info example-entity-name check-cpu
{{< /highlight >}}

_NOTE: To create an entity to run the `check-cpu` check, [install the Sensu agent][install],
then add the `linux` subscription to `/etc/sensu/agent.yml` and restart the agent._

## Next steps

You now know how to run a simple check to verify the CPU usage. From this point,
here are some recommended resources:

* Read the [checks reference][3] for in-depth documentation on checks.
* Read our guide on [providing runtime dependencies to checks with assets][2].
* Read our guide on [monitoring external resources with proxy checks and entities][5].
* Read our guide on [sending alerts to Slack with handlers][6].

[1]: https://github.com/sensu-plugins/sensu-plugins-cpu-checks
[2]: ../install-check-executables-with-assets
[3]: ../../reference/checks
[4]: ../
[5]: ../monitor-external-resources
[6]: ../send-slack-alerts
[install]: ../../installation/install-sensu/#install-the-sensu-agent