---
title: "Sensu frequently asked questions"
linkTitle: "FAQs"
description: "Questions about Sensu Go? Read our FAQ to get answers to questions like, What platforms does Sensu support? and What can I monitor with Sensu?"
version: "5.10"
weight: 100
product: "Sensu Go"
menu:
  sensu-go-5.10:
    parent: getting-started
---

Thank you for visiting the Sensu FAQ!
For a list of Sensu terms and definitions, see the [glossary][7].

> What platforms does Sensu support?

Sensu Go is available for Linux, Windows (agent and CLI only), macOS (CLI only), and Docker.
See the list of [supported platforms][1] and the [installation guide][2] for more information.

> Is Sensu available as a hosted solution?

No, Sensu is installed on your organization’s infrastructure alongside other applications and services.
See the list of [supported platforms][1] and the [installation guide][2] for more information.

> What are the hardware requirements for running a Sensu backed?

See the [hardware requirements guide][5] for minimum and recommended hardware to run a Sensu backend.

> Is there an enterprise version of Sensu Go?

[Yes!](https://blog.sensu.io/enterprise-features-in-sensu-go) Sensu Inc. offers support packages for Sensu Go as well as license-activated features designed for monitoring at scale.
[Contact the Sensu sales team][6] for a personalized demo, and see the [getting started guide][28] for more information.

 > What's the difference between the OSS tier, free tier, and licensed tier?
 
 See the [products page][30] for a complete comparison.

> What's the difference between the OSS tier, free tier, and licensed tier?

See the [products page][3] for a complete comparison.

> How can I contact the Sensu sales team?

We'd love to chat about solving your organization's monitoring challenges with Sensu.
Get in touch with us using [this form][6].

> What can I monitor with Sensu?

Sensu supports a wide range of plugins for monitoring everything from the server closet to the cloud.
[Install the Sensu agent][8] on the hosts you want to monitor, integrate with the [Sensu API][9], or take advantage of [proxy entities][10] to monitor anything on your network.
Check out the [200+ plugins shared by the Sensu community][11], including monitoring checks for [AWS][13], [Jenkins][14], [Puppet][15], [InfluxDB][16], and [SNMP][17].
You can also get started writing your own Sensu Plugins in any language using the [Sensu Plugins spec][12].

> Does Sensu include a time series database for long term storage?

No, Sensu does not store event data.
We recommend integrating Sensu with a time series database, like [InfluxDB][19], to store event data.
See the [guide to storing metrics with InfluxDB][18] to get started.

> Can I connect Sensu Go to clients and servers from earlier versions of Sensu Core and Sensu Enterprise?

No, Sensu Go agents and backends are not compatible with Sensu Core or Sensu Enterprise services.

> Can I upgrade my Sensu version 1.x deployment to Sensu Go?

Sensu Go is a complete redesign of the original Sensu; it uses separate packages, dependencies, and data models to bring you powerful new features.
(See the [Sensu Go release announcement][3] for more information.)
Due to these changes, [some features][4] of Sensu 1.x are no longer supported in Sensu Go, such as standalone checks.
To upgrade your Sensu 1.x deployment to Sensu Go, you'll need to translate your Sensu 1.x configuration to the format expected by Sensu Go and install the new Sensu Go services on your infrastructure.
The [Sensu Go upgrade guide][4] includes a detailed feature comparison between Sensu Go and Sensu 1.x as well as tools to help you get started.

> Which ports does Sensu use?

The [Sensu backend][25] uses:

- 2379 (HTTP/HTTPS) Sensu storage client: Required for Sensu backends using an external etcd instance
- 2380 (HTTP/HTTPS) Sensu storage peer: Required for other Sensu backends in a [cluster][27]
- 3000 (HTTP/HTTPS) [Sensu dashboard][24]: Required for all Sensu backends using a Sensu dashboard
- 8080 (HTTP/HTTPS) [Sensu API][9]: Required for all users accessing the Sensu API
- 8081 (WS/WSS) Agent API: Required for all Sensu agents connecting to a Sensu backend

The [Sensu agent][26] uses:

- 3030 (TCP/UDP) Sensu [agent socket][21]: Required for Sensu agents using the agent socket
- 3031 (HTTP) Sensu [agent API][22]: Required for all users accessing the agent API
- 8125 (UDP, TCP on Windows) [StatsD listener][23]: Required for all Sensu agents using the StatsD listener

For more information, see the [guide to securing Sensu][20].

> Can one Sensu backend monitor multiple sites?

Yes, as long as the port requirements described above are met, a single Sensu backend can monitor Sensu agents at multiple sites.

> Is it possible to use Uchiwa with Sensu Go?

Due to Sensu Go's implementation, it is not possible to use Uchiwa with Sensu Go. Sensu Go does have a [built-in dashboard][29] that you can use to visually interact with your Sensu Go deployment.

[1]: ../../installation/platforms
[2]: ../../installation/install-sensu
[3]: https://blog.sensu.io/sensu-go-is-here
[4]: ../../installation/upgrade/#upgrading-to-sensu-go-from-sensu-core-1-x
[5]: ../../installation/recommended-hardware/
[6]: https://sensu.io/sales/
[7]: ../glossary
[8]: ../../installation/install-sensu#install-the-sensu-agent
[9]: ../../api/overview
[10]: ../../reference/entities/#proxy-entities
[11]: https://github.com/sensu-plugins
[12]: /plugins/latest/reference/
[13]: https://github.com/sensu-plugins/sensu-plugins-aws
[14]: https://github.com/sensu-plugins/sensu-plugins-jenkins
[15]: https://github.com/sensu-plugins/sensu-plugins-puppet
[16]: https://github.com/sensu-plugins/sensu-plugins-influxdb
[17]: https://github.com/sensu-plugins/sensu-plugins-snmp
[18]: ../../guides/influx-db-metric-handler/
[19]: https://www.influxdata.com/
[20]: ../../guides/securing-sensu
[21]: ../../reference/agent#creating-monitoring-events-using-the-agent-socket
[22]: ../../reference/agent/#using-the-http-socket
[23]: ../../reference/agent/#creating-monitoring-events-using-the-statsd-listener
[24]: ../../dashboard/overview
[25]: ../../reference/backend
[26]: ../../reference/agent
[27]: ../../guides/clustering
[28]: ../enterprise
[29]: ../../dashboard/overview/
[30]: https://sensu.io/products/
