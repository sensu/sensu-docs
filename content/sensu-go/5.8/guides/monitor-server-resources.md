---
title: "How to monitor server resources with checks"
linkTitle: "Monitoring Server Resources"
description: "Here’s how to monitor server resources with checks. You’ll learn about Sensu checks, why you should use checks, and how to use them to monitor a service. Read the guide to learn more."
weight: 10
version: "5.8"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-5.8:
    parent: guides
---

## What are Sensu checks?

Sensu checks are **commands** (or scripts), executed by the Sensu agent, that
output data and produce an exit code to indicate a state. Sensu checks use the
same specification as **Nagios**, therefore, Nagios **check plugins** may be
used with Sensu.

## Why use a check?

You can use checks to monitor server resources, services, and application
health (for example: is Nginx running?) as well as collect and analyze metrics (for example: how much disk space do I have left?).

## Using checks to monitor a service

The purpose of this guide is to help you monitor server resources, more
specifically the CPU usage, by configuring a check named `check-cpu` with a
**subscription** named `system`, in order to target all **entities** subscribed
to the `system` subscription.
This guide requires a Sensu backend and at least one Sensu agent running on Linux.

### Registering assets

To power the check, we'll use the [Sensu CPU checks asset][1] and the [Sensu Ruby runtime asset][7].

Use the following sensuctl example to register the `sensu-plugins-cpu-checks` asset for CentOS, or download the asset definition for Debian or Alpine from [Bonsai][1] and register the asset using `sensuctl create --file filename.yml`.

{{< highlight shell >}}
sensuctl asset create sensu-plugins-cpu-checks --url "https://github.com/sensu-plugins/sensu-plugins-cpu-checks/releases/download/4.0.0/sensu-plugins-cpu-checks_4.0.0_centos_linux_amd64.tar.gz" --sha512 "518e7c17cf670393045bff4af318e1d35955bfde166e9ceec2b469109252f79043ed133241c4dc96501b6636a1ec5e008ea9ce055d1609865635d4f004d7187b"
{{< /highlight >}}

Then use the following sensuctl example to register the `sensu-ruby-runtime` asset for CentOS, or download the asset definition for Debian or Alpine from [Bonsai][7] and register the asset using `sensuctl create --file filename.yml`. 

{{< highlight shell >}}
sensuctl asset create sensu-ruby-runtime --url "https://github.com/sensu/sensu-ruby-runtime/releases/download/0.0.5/sensu-ruby-runtime_0.0.5_centos_linux_amd64.tar.gz" --sha512 "1c9f0aff8f7f7dfcf07eb75f48c3b7ad6709f2bd68f2287b4bd07979e6fe12c2ab69d1ecf5d4b9b9ed7b96cd4cda5e55c116ea76ce3d9db9ff74538f0ea2317a"
{{< /highlight >}}

You can use sensuctl to confirm that both the `sensu-plugins-cpu-checks` and `sensu-ruby-runtime` assets are ready to use.

{{< highlight shell >}}
sensuctl asset list
          Name                                                URL                                       Hash    
────────────────────────── ─────────────────────────────────────────────────────────────────────────── ───────── 
 sensu-plugins-cpu-checks   //github.com/.../sensu-plugins-cpu-checks_4.0.0_centos_linux_amd64.tar.gz   518e7c1  
 sensu-ruby-runtime         //github.com/.../sensu-ruby-runtime_0.0.5_centos_linux_amd64.tar.gz         1c9f0af 
{{< /highlight >}}

### Creating the check

Now that the assets are registered, we'll create a check named
`check-cpu`, which runs the command `check-cpu.rb -w 75 -c 90` using the `sensu-plugins-cpu-checks` and `sensu-ruby-runtime` assets, at an
**interval** of 60 seconds, for all entities subscribed to the `system`
subscription.
This checks generates a warning event (`-w`) when CPU usage reaches 75% and a critical alert (`-c`) at 90%.

{{< highlight shell >}}
sensuctl check create check-cpu \
--command 'check-cpu.rb -w 75 -c 90' \
--interval 60 \
--subscriptions system \
--runtime-assets sensu-plugins-cpu-checks,sensu-ruby-runtime
{{< /highlight >}}

### Configuring the subscription

To run the check, we'll need a Sensu agent with the subscription `system`.
After [installing an agent][install], open `/etc/sensu/agent.yml`
and add the `system` subscription so the subscription configuration looks like:

{{< highlight yml >}}
subscriptions:
  - system
{{< /highlight >}}

Then restart the agent.

{{< highlight shell >}}
sudo service sensu-agent restart
{{< /highlight >}}

### Validating the check

We can use sensuctl to see that Sensu is monitoring CPU usage using the `check-cpu`, returning an OK status (`0`).
It might take a few moments, once the check is created,
for the check to be scheduled on the entity and the event returned to Sensu backend.

{{< highlight shell >}}
sensuctl event list
    Entity        Check                                                                    Output                                                                   Status   Silenced             Timestamp            
────────────── ─────────── ─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────── ──────── ────────── ─────────────────────────────── 
 sensu-centos   check-cpu   CheckCPU TOTAL OK: total=0.2 user=0.0 nice=0.0 system=0.2 idle=99.8 iowait=0.0 irq=0.0 softirq=0.0 steal=0.0 guest=0.0 guest_nice=0.0        0   false      2019-04-23 16:42:28 +0000 UTC  
{{< /highlight >}}

## Next steps

You now know how to run a simple check to monitor CPU usage. From this point,
here are some recommended resources:

* Read the [checks reference][3] for in-depth documentation on checks.
* Read our guide on [providing runtime dependencies to checks with assets][2].
* Read our guide on [monitoring external resources with proxy checks and entities][5].
* Read our guide on [sending alerts to Slack with handlers][6].

[1]: https://bonsai.sensu.io/assets/sensu-plugins/sensu-plugins-cpu-checks
[2]: ../install-check-executables-with-assets
[3]: ../../reference/checks
[4]: ../
[5]: ../monitor-external-resources
[6]: ../send-slack-alerts
[install]: ../../installation/install-sensu/#install-the-sensu-agent
[start]: ../../reference/agent/#restarting-the-service
[7]: https://bonsai.sensu.io/assets/sensu/sensu-ruby-runtime
