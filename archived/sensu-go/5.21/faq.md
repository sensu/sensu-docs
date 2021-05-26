---
title: "Frequently asked questions about Sensu"
linkTitle: "FAQs"
description: "Questions about Sensu Go? Read this FAQ to get answers to questions about what platforms Sensu supports and what you can monitor with Sensu."
version: "5.21"
weight: 80
product: "Sensu Go"
---

Thank you for visiting the Sensu FAQ!
For a list of Sensu terms and definitions, see the [glossary][7].

## What platforms does Sensu support?

Sensu Go is available for Linux, Windows (agent and CLI only), macOS (CLI only), Solaris, and Docker.
See the list of [supported platforms][1] and the [installation guide][2] for more information.

## Is Sensu available as a hosted solution?

No, Sensu is installed on your organization’s infrastructure alongside other applications and services.
See the list of [supported platforms][1] and the [installation guide][2] for more information.

## What are the hardware requirements for running a Sensu backend?

See the [hardware requirements guide][5] for minimum and recommended hardware to run a Sensu backend.

## Is there an enterprise version of Sensu Go?

[Yes][31]! Sensu Inc. offers support packages for Sensu Go as well as commercial features designed for monitoring at scale.
[Contact the Sensu sales team][6] for a personalized demo.
See [Get started with commercial features][28] for more information.

## What's the difference between the OSS, free, and commercial versions?

See the [Enterprise page][30] for a complete comparison. 

All [commercial features][28] are available for free in the packaged Sensu Go distribution up to an entity limit of 100.
If your Sensu instance includes more than 100 entities, [contact us][36] to learn how to upgrade your installation and increase your limit.
See the [announcement on our blog][34] for more information about our usage policy.

## How can I contact the Sensu sales team?

We'd love to chat about solving your organization's monitoring challenges with Sensu.
Get in touch with us using [this form][6].

## What can I monitor with Sensu?

Sensu supports a wide range of plugins for monitoring everything from the server closet to the cloud.
[Install the Sensu agent][8] on the hosts you want to monitor, integrate with the [Sensu API][9], or take advantage of [proxy entities][10] to monitor anything on your network.

Sensuctl integrates with [Bonsai, the Sensu asset hub][32], where you’ll find plugins, libraries, and runtimes you need to automate your monitoring workflows.
If you want to add your own asset, read the [guide for sharing an asset on Bonsai][33].

You can also check out the 200+ plugins shared in the [Sensu plugins community][11], including monitoring checks for [AWS][13], [Jenkins][14], [Puppet][15], [InfluxDB][16], and [SNMP][17], or write your own Sensu plugins in any language using the [Sensu plugin specification][12].

## Does Sensu include a time-series database for long-term storage?

No, Sensu does not store event data.
We recommend integrating Sensu with a time-series database, like [InfluxDB][19], to store event data.
See the [guide to storing metrics with InfluxDB][18] to get started.

## Can I connect Sensu Go to clients and servers from Sensu Core and Sensu Enterprise?

No, Sensu Go agents and backends are not compatible with Sensu Core or Sensu Enterprise services.

## Can I upgrade my Sensu Core or Sensu Enterprise deployment to Sensu Go?

Sensu Go is a complete redesign of the original Sensu.
It uses separate packages, dependencies, and data models to bring you powerful new features.
See the [Sensu Go release announcement][3] for more information.
Due to these changes, [some Sensu Core features][4] are no longer supported in Sensu Go, such as standalone checks.
To upgrade your Sensu Core or Sensu Enterprise deployment to Sensu Go, you'll need to translate your Sensu Core or Enterprise configuration to the format Sensu Go expects and install the new Sensu Go services on your infrastructure.
[Migrate from Sensu Core and Sensu Enterprise to Sensu Go][4] includes a detailed feature comparison between Sensu Go and Sensu Core and Enterprise as well as tools to help you get started.

## Which ports does Sensu use? {#go-ports}

The [Sensu backend][25] uses:

- 2379 (HTTP/HTTPS) Sensu storage client: Required for Sensu backends using an external etcd instance
- 2380 (HTTP/HTTPS) Sensu storage peer: Required for other Sensu backends in a [cluster][27]
- 3000 (HTTP/HTTPS) [Sensu web UI][24]: Required for all Sensu backends using a Sensu web UI
- 8080 (HTTP/HTTPS) [Sensu API][9]: Required for all users accessing the Sensu API
- 8081 (WS/WSS) Agent API: Required for all Sensu agents connecting to a Sensu backend

The [Sensu agent][26] uses:

- 3030 (TCP/UDP) Sensu [agent socket][21]: Required for Sensu agents using the agent socket
- 3031 (HTTP) Sensu [agent API][21]: Required for all users accessing the agent API
- 8125 (UDP) [StatsD listener][23]: Required for all Sensu agents using the StatsD listener

The agent TCP and UDP sockets are deprecated in favor of the [agent API][21].

For more information, see the [Secure Sensu guide][20].

## Can one Sensu backend monitor multiple sites?

Yes, as long as you meet the [port requirements][37], a single Sensu backend can monitor Sensu agents at multiple sites.

## Can I use Uchiwa with Sensu Go?

Due to Sensu Go's implementation, it is not possible to use Uchiwa with Sensu Go.
Sensu Go does have a [built-in web UI][24] that you can use to visually interact with your Sensu Go deployment.


[1]: ../platforms/
[2]: ../operations/deploy-sensu/install-sensu/
[3]: https://sensu.io/blog/sensu-go-is-here/
[4]: ../operations/maintain-sensu/upgrade/
[5]: ../operations/deploy-sensu/hardware-requirements/
[6]: https://sensu.io/sales/
[7]: ../learn/glossary/
[8]: ../operations/deploy-sensu/install-sensu#install-sensu-agents
[9]: ../api/
[10]: ../reference/entities/#proxy-entities
[11]: https://github.com/sensu-plugins/
[12]: https://docs.sensu.io/plugins/1.0/reference/#the-sensu-plugin-specification
[13]: https://github.com/sensu-plugins/sensu-plugins-aws/
[14]: https://github.com/sensu-plugins/sensu-plugins-jenkins/
[15]: https://github.com/sensu-plugins/sensu-plugins-puppet/
[16]: https://github.com/sensu-plugins/sensu-plugins-influxdb/
[17]: https://github.com/sensu-plugins/sensu-plugins-snmp/
[18]: ../guides/influx-db-metric-handler/
[19]: https://www.influxdata.com/
[20]: ../operations/deploy-sensu/secure-sensu/
[21]: ../reference/agent#create-monitoring-events-using-the-agent-api
[22]: ../reference/agent/#using-the-http-socket
[23]: ../reference/agent/#create-monitoring-events-using-the-statsd-listener
[24]: ../web-ui/
[25]: ../reference/backend/
[26]: ../reference/agent/
[27]: ../operations/deploy-sensu/cluster-sensu/
[28]: ../commercial/
[30]: https://sensu.io/enterprise/
[31]: https://sensu.io/blog/enterprise-features-in-sensu-go/
[32]: https://bonsai.sensu.io/
[33]: ../reference/assets/#share-an-asset-on-bonsai
[34]: https://sensu.io/blog/one-year-of-sensu-go/
[36]: https://sensu.io/contact/
[37]: #go-ports
