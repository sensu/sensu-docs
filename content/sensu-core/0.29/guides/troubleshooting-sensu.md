---
title: "Troubleshooting Sensu"
subtitle: "Common Problems and How to Solve Them"
product: "Sensu Core"
version: "0.29"
weight: 10
menu:
 sensu-core-0.29:
   parent: guides
---

In this guide, we'll cover some of the more common issues to run into when deploying Sensu. For each section, we'll start with the behavior that's most commonly observed, and then walk through some possible solutions to solve that issue. 

# Objectives

- Recognize common problems in Sensu
- Understand how to troubleshoot and resolve common problems in Sensu

## Prerequisites

- A working Sensu deployment including sensu-server/sensu-api (or sensu-enterprise), sensu-client, and transport/datastore components
- [Uchiwa][1], or [Sensu Enterprise Dashboard][2] installed and configured

If you don’t have Sensu spun up yet, we encourage you to go through our [5 minute install guide][3].

## SSL

### Behavior

SSL issues are one of the more difficult issues to troubleshoot inside of Sensu. What lends to this difficulty is the way that AMQP (the protocol used by RabbitMQ) handles SSL failures, primarily in that the failure seen something like an unsupported Erlang/RabbitMQ combination is indistinguishable from an actual authentication issue. 

#### Authentication Failures


#### Handshake Failures



## Renaming checks/clients


[1]: https://docs.uchiwa.io/
[2]: /sensu-core/latest/platforms/sensu-on-rhel-centos/#sensu-on-rhel-centos
[3]: /sensu-core/latest/quick-start/five-minute-install/
[4]: https://www.digitalocean.com/community/tutorials/an-introduction-to-snmp-simple-network-management-protocol
[5]: https://github.com/sensu-extensions/sensu-extensions-snmp-trap
[6]: /sensu-core/latest/reference/clients/#reference-documentation
[7]: https://github.com/sensu-plugins/sensu-plugins-snmp
[8]: https://slack.sensu.io
[9]: https://github.com/sensu/sensu-docs/issues/new

