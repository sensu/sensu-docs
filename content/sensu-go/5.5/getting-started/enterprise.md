---
title: "Getting started with enterprise features"
linkTitle: "Enterprise Features"
description: "Get started with enterprise features in Sensu Go. Read this guide to learn about the latest, enterprise-only features, and contact our sales team for a free trial."
version: "5.5"
weight: 2
product: "Sensu Go"
menu:
  sensu-go-5.5:
    parent: getting-started
---

Sensu Go offers license-activated features designed for enterprises.
[Contact the Sensu sales team][1] for a personalized demo and free trial.
Enterprise features are available for all Sensu Go packages and downloads.

**Enterprise-only features in Sensu Go:**

- [Authentication providers](../../installation/auth)
- [Enterprise assets](https://bonsai.sensu.io/assets?tiers%5B%5D=4)
- [Enterprise-class support](https://sensu.io/support/)

### Contact us for a free trial

For a personalized demo and free trial of enterprise features in Sensu Go, [contact the Sensu sales team][1].
You can manage your Sensu account and contact support through [account.sensu.io][2].

- [Contact the Sensu sales team](https://sensu.io/sales/)
- [Log in to your Sensu account][2]
- [Contact Sensu support](https://account.sensu.io/support)

### Get started with enterprise features in Sensu Go

If you haven't already, [install the Sensu Go backend, agent, and sensuctl tool](../../installation/install-sensu) and [configure sensuctl](../../sensuctl/reference/#first-time-setup).

Log in to your Sensu account at [account.sensu.io](https://account.sensu.io/)
and download your license file using the "Download license" link.

_Sensu account: Download Sensu license._

<img alt="Screenshot of Sensu account license download" src="/images/go-license-download.png" width="350px">

With the license file downloaded, you can activate your license using sensuctl.

{{< highlight shell >}}
sensuctl create --file sensu_license.json
{{< /highlight >}}

You can use sensuctl to view your license details at any time.

{{< highlight shell >}}
sensuctl license info
{{< /highlight >}}

See these resources to get started using enterprise-only features in Sensu Go.

- [Set up authentication providers](../../installation/auth)
- [Get started with assets](../../guides/install-check-executables-with-assets)
- [Manage your enterprise license](../../reference/license)
- [Log in to your Sensu account](https://account.sensu.io)
- [Contact Sensu support](https://account.sensu.io/support)

[1]: https://sensu.io/sales/
[2]: https://account.sensu.io/
