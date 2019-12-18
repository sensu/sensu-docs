---
title: "Monitor server resources with checks"
linkTitle: "Monitor Server Resources"
description: "Sensu lets you monitor server resources with checks. Read this guide to learn about Sensu checks and how to use checks to monitor a service."
weight: 10
version: "5.16"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-5.16:
    parent: guides
---

- [Use checks to monitor a service](#use-checks-to-monitor-a-service)
- [Next steps](#next-steps)

Sensu checks are **commands** (or scripts) the Sensu agent executes that output data and produce an exit code to indicate a state.
Sensu checks use the same specification as **Nagios**, so you can use Nagios check plugins with Sensu.

You can use checks to monitor server resources, services, and application health (for example, to check whether Nginx is running) and collect and analyze metrics (for example, to learn how much disk space you have left).

## Use checks to monitor a service

This guide will help you monitor server resources (specifically, CPU usage) by configuring a check named `check-cpu` with a subscription named `system` to target all entities that are subscribed to the `system` subscription.
To use this guide, you'll need to install a Sensu backend and have at least one Sensu agent running on Linux.

### Register assets

To power the check, you'll use the [Sensu CPU Checks][1] asset and the [Sensu Ruby Runtime][7] asset.

Use the following sensuctl example to register the `sensu-plugins-cpu-checks` asset for CentOS or download the asset definition for Debian or Alpine from [Bonsai][1] and register the asset using `sensuctl create --file filename.yml`:

{{< highlight shell >}}
sensuctl asset create sensu-plugins-cpu-checks --url "https://assets.bonsai.sensu.io/68546e739d96fd695655b77b35b5aabfbabeb056/sensu-plugins-cpu-checks_4.0.0_centos_linux_amd64.tar.gz" --sha512 "518e7c17cf670393045bff4af318e1d35955bfde166e9ceec2b469109252f79043ed133241c4dc96501b6636a1ec5e008ea9ce055d1609865635d4f004d7187b"
{{< /highlight >}}

Then, use this sensuctl example to register the `sensu-ruby-runtime` asset for CentOS or download the asset definition for Debian or Alpine from [Bonsai][7] and register the asset using `sensuctl create --file filename.yml`:

{{< highlight shell >}}
sensuctl asset create sensu-ruby-runtime --url "https://assets.bonsai.sensu.io/03d08cdfc649500b7e8cd1708bb9bb93d91fea9e/sensu-ruby-runtime_0.0.8_ruby-2.4.4_centos_linux_amd64.tar.gz" --sha512 "7b254d305af512cc524a20a117c601bcfae0d51d6221bbfc60d8ade180cc1908081258a6eecfc9b196b932e774083537efe748c1534c83d294873dd3511e97a3"
{{< /highlight >}}

Use sensuctl to confirm that both the `sensu-plugins-cpu-checks` and `sensu-ruby-runtime` assets are ready to use:

{{< highlight shell >}}
sensuctl asset list
          Name                                                URL                                       Hash    
────────────────────────── ─────────────────────────────────────────────────────────────────────────── ───────── 
 sensu-plugins-cpu-checks   //assets.bonsai.sensu.io/.../sensu-plugins-cpu-checks_4.0.0_centos_linux_amd64.tar.gz          518e7c1  
 sensu-ruby-runtime         //assets.bonsai.sensu.io/.../sensu-ruby-runtime_0.0.10_ruby-2.4.4_centos_linux_amd64.tar.gz     338b88b 
{{< /highlight >}}

### Create a check

Now that the assets are registered, create a check named `check-cpu` that runs the command `check-cpu.rb -w 75 -c 90` with the `sensu-plugins-cpu-checks` and `sensu-ruby-runtime` assets at an interval of 60 seconds for all entities subscribed to the `system` subscription.
This check generates a warning event (`-w`) when CPU usage reaches 75% and a critical alert (`-c`) at 90%.

{{< highlight shell >}}
sensuctl check create check-cpu \
--command 'check-cpu.rb -w 75 -c 90' \
--interval 60 \
--subscriptions system \
--runtime-assets sensu-plugins-cpu-checks,sensu-ruby-runtime
{{< /highlight >}}

### Configure the subscription

To run the check, you'll need a Sensu agent with the subscription `system`.
After you [install an agent][4], open `/etc/sensu/agent.yml` and add the `system` subscription so the subscription configuration looks like this:

{{< highlight yml >}}
subscriptions:
  - system
{{< /highlight >}}

Then, restart the agent:

{{< highlight shell >}}
sudo service sensu-agent restart
{{< /highlight >}}

### Validate the check

Use sensuctl to confirm that Sensu is monitoring CPU usage using the `check-cpu`, returning an OK status (`0`).
It might take a few moments after you create the check for the check to be scheduled on the entity and the event to return to Sensu backend.

{{< highlight shell >}}
sensuctl event list
    Entity        Check                                                                    Output                                                                   Status   Silenced             Timestamp            
────────────── ─────────── ─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────── ──────── ────────── ─────────────────────────────── 
 sensu-centos   check-cpu   CheckCPU TOTAL OK: total=0.2 user=0.0 nice=0.0 system=0.2 idle=99.8 iowait=0.0 irq=0.0 softirq=0.0 steal=0.0 guest=0.0 guest_nice=0.0        0   false      2019-04-23 16:42:28 +0000 UTC  
{{< /highlight >}}

## Next steps

Now that you know how to run a check to monitor CPU usage, read these resources to learn more:

* [Checks reference][3]
* [Install plugins with assets][2]
* [Monitor external resources with proxy checks and entities][5]
* [Send Slack alerts with handlers][6]

[1]: https://bonsai.sensu.io/assets/sensu-plugins/sensu-plugins-cpu-checks
[2]: ../install-check-executables-with-assets/
[3]: ../../reference/checks/
[4]: ../../installation/install-sensu/#install-sensu-agents
[5]: ../monitor-external-resources/
[6]: ../send-slack-alerts/
[7]: https://bonsai.sensu.io/assets/sensu/sensu-ruby-runtime
[8]: ../../reference/agent/#restart-the-service
