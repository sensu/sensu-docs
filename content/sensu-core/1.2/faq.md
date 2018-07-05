---
title: "FAQs"
description: "Sensu Frequently Asked Questions"
version: "1.2"
menu: "sensu-core-1.2"
product: "Sensu Core"
---

# Sensu Frequently Asked Questions

Please note the following frequently asked questions about Sensu Core, Sensu
Enterprise, Sensu Training, Professional Services for Sensu, and more. If you
need support for Sensu, please consider giving [Sensu
Enterprise](https://sensu.io/features/enterprise) a try.

> What platforms does Sensu support?

| Platform & Version | 64bit | 32bit | Comments                 |
|--------------------|-------|-------|--------------------------|
| Ubuntu 12.04       | ✅     | ✅     |                          |
| Ubuntu 14.04       | ✅     | ✅     |                          |
| Ubuntu 16.04       | ✅     | ❌     | No official 32bit images |
| Ubuntu 18.04       | ✅     | ❌     | No official 32bit images |
| Debian 7           | ✅     | ✅     |                          |
| Debian 8           | ✅     | ❌     | No official 32bit images |
| Debian 9           | ✅     | ❌     | No official 32bit images |
| CentOS 5           | ✅     | ✅     | 32 and 64bit images built with [sensu-omnibus-packer](https://github.com/sensu/sensu-omnibus-packer) |
| CentOS 6           | ✅     | ✅     | Using unofficial 32bit image |
| CentOS 7           | ✅     | ❌     | No official 32bit images |
| FreeBSD 10         | ✅     | ❌     | Official 32bit images are out of date |
| FreeBSD 11         | ✅     | ❌     | No official 32bit images |
| Windows 2012r2     | ✅     | ✅     | 32bit artifact built on 64bit platform |
| Mac OS X 10.10     | ✅     | ❌     | See [Mac platform notes][4] for instructions |
| Mac OS X 10.11     | ✅     | ❌     | See [Mac platform notes][4] for instructions |
| Mac OS X 10.12     | ✅     | ❌     | See [Mac platform notes][4] for instructions |

> Do I need RabbitMQ to be installed on every system I wish to monitor?

**No.** Sensu uses [RabbitMQ](../reference/rabbitmq/) as a
[Transport](../reference/transport/). Sensu services require access to a shared
instance of the defined Sensu Transport (e.g. a RabbitMQ cluster) to function.
Sensu check requests and check results are published as "messages" to the Sensu
Transport, and the corresponding Sensu services receive these messages by
subscribing to the appropriate subscription topics.

> Does Redis need to be installed on every system I wish to monitor?

**No.** Sensu uses [Redis](../reference/redis/) as a data store,
and the Sensu server services (i.e. `sensu-server` & `sensu-api` for
Sensu Core; `sensu-enterprise` for Sensu Enterprise) require access to
the same Redis instance (or cluster) to store and access the Sensu
client registry, check results, check execution history, and current
event data.

> Do check definitions need to exist on every system I wish to monitor?

**No.**  Check definitions can be written as publish/subscribe (pubsub) or standalone.
Pubsub checks, which specify a list of subscribers, need only be configured on
the Sensu server. Standalone checks, which are scheduled and executed by the
Sensu client, need only be configured on the client(s) where they should be run.

> Where should check plugin executables be installed?

Regardless of where checks are defined, the actual check executables need to
exist on the filesystem for the Sensu client to execute them. Check plugin
executables can be installed in `/etc/sensu/plugins` or
`/opt/sensu/embedded/bin`, the latter being the location where plugin
executables are installed via `sensu-install`.

> What is a standalone check?

A standalone check is a check definition that is installed on and executed by
the Sensu client without being scheduled by the Sensu server. Standalone checks
defer [Check execution scheduling
responsibilities](../overview/architecture#check-execution-scheduler/) to
Sensu clients, enabling decentralized management of monitoring checks and
distribution of scheduling responsibilities. Standalone checks may be used in
conjunction with pubsub checks, and are distinguished from pubsub checks by
inclusion of the `"standalone": true` configuration parameter.

> What happens if a single check is defined on both the Sensu server
<em>and</em> client?

When a check request is published for a check defined on the Sensu server, the
Sensu client will look for a local definition matching the check `name` prior to
executing the check. If a local definition exists, it is
[merged](../reference/configuration#configuration-merging/) with the
definition provided by the server, with any local definition attributes
overriding the definition provided by the Sensu server.

> What is Sensu Client safe_mode?

In `safe_mode` a client will not run a check published by a Sensu
server unless that check is also defined on the client. Safe mode must
be enabled on the Sensu Client via the `safe_mode` configuration
attribute.

> Can multiple Sensu servers be run concurrently, in a cluster?

**Yes.** Sensu is designed to be scaled horizontally (i.e. by
adding additional Sensu servers). It supports fully automated leader
election (ensuring that a single Sensu server acts as a centralized
[Check Execution Scheduler](../overview/architecture#check-execution-schedule/r)),
automated failover (automatically electing a new leader
if the previous leader is unexpectedly unavailable), and distributed
event processing (check results are distributed across all Sensu servers
in a round-robin fashion). Running more than one Sensu server is
highly recommended for performance and availability.

> How are new systems registered?

**Automatically.** Sensu clients register themselves when they
start up. The Sensu client process requires access to the [Sensu
Transport](../reference/transport/) (by default, this is
[RabbitMQ](../reference/rabbitmq/); see [Sensu
Configuration](../reference/configuration#top-level-configuration-scopes/)), and
some minimal client configuration (e.g. a `name`, `address`, and one or more
`subscriptions`) in order to start. When the Sensu client process starts, it
begins sending "keepalives" &ndash; a special type of check result containing
client configuration data &ndash; which the Sensu server uses to know that a
client is still connected. When a client keepalive is received for a client
`name` that is not currently registered with Sensu, the client is added to the
registry and a registration event is created automatically.

> Do system clocks need to be synchronized?

**Yes.** The Sensu services (i.e. sensu-client, sensu-server,
sensu-api, sensu-enterprise) use the local/system clock for generating
timestamps. When system clocks are out of sync between Sensu clients
(where data is collected) and the Sensu server (where data is
processed), Sensu may generate false positive client keepalive events,
among other potentially unexpected behaviors. Time synchronization can
be facilitated with [NTP](http://www.ntp.org/).

> Is Sensu Enterprise available as a hosted / SaaS solution?

**No.** Like Sensu Core, [Sensu Enterprise](../../../sensu-enterprise/latest) is
installed on your organization's infrastructure alongside other applications and
services. Sensu Enterprise packages are available for major Linux distributions
including RHEL, CentOS, Debian and Ubuntu.

> Is Sensu available for Microsoft Windows?

**Yes.** An MSI installer package is available on the
[Downloads] page. Please visit the Sensu documentation for
more information on [configuring Sensu on
Windows](../platforms/sensu-on-microsoft-windows/).

> How do I increase log verbosity?

You can toggle debug logging on and off by sending the Sensu process a
`TRAP` signal.

For example:

{{< highlight shell >}}
$ ps aux | grep [s]ensu-server
sensu     5992  1.7  0.3 177232 24352 ...
$ kill -TRAP 5992{{< /highlight >}}

> How can I print my Sensu configuration for troubleshooting?

Frequently, Sensu staff or community members may ask you to print your configuration. It's fairly easy to print the configuration for your Sensu deployment:

**Sensu Core**:
`/opt/sensu/bin/sensu-client --print_config | tee sensu-core-config.json`

**Sensu Enterprise**
`sudo -u sensu java -jar /usr/lib/sensu-enterprise/sensu-enterprise.jar -c /etc/sensu/config.json -d /etc/sensu/conf.d --print_config | tee se-config.json`

> RabbitMQ is giving me an error about `wrong credentials`, but everything seems correct. What do I do?

Due to [AMQP's][1] implementation in RabbitMQ, it's often difficult to distinguish a SSL handshake failure from a bad username/password combination. If you've ensured that the username/password combination in your configuration is correct, we encourage you to check your RabbitMQ/Erlang versions against [RabbitMQ's "Which Erlang" article][2] to see if your versions are able to reliably support TLS.

It's also worth noting that as of Sensu 0.27, our build processes changed and we [upgraded the version of OpenSSL][3], and upgrading your client (if < 0.27) may solve the issue.

> What Firewall Rules Does Sensu Require?

See the below table for a listing of services, ports, and protocols Sensu uses.

| Service                           | Protocol | Port |
|-----------------------------------|----------|------|
| Sensu API                         | TCP      | 4567 |
| Sensu API (SSL)                   | TCP      | 4568 |
| Redis                             | TCP      | 6379 |
| RabbitMQ (AMQP)                   | TCP      | 5672 |
| RabbitMQ (AMQPS)                  | TCP      | 5671 |
| Sensu Client Socket               | TCP      | 3030 |
| Uchiwa/Sensu Enterprise Dashboard | TCP      | 3000 |

[downloads]: https://sensuapp.org/downloads
[1]: https://www.amqp.org/
[2]: https://www.rabbitmq.com/which-erlang.html
[3]: ../installation/upgrading/#tls-ssl-changes
[4]: https://github.com/sensu/sensu-omnibus/blob/master/platform-docs/MAC_OS_X.md