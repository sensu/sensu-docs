---
title: "Getting started with Sensu Enterprise"
linkTitle: "Sensu Enterprise"
description: "Sensu Go is the free and open source monitoring event pipeline, written in Go and designed for container-based and hybrid-cloud infrastructures. Sensu Enterprise offers enterprise-class support and access to features within Sensu Go designed for enterprises, like LDAP authentication and support for industry-standard tools."
version: "5.2"
weight: 1
product: "Sensu Go"
menu:
  sensu-go-5.2:
    parent: getting-started
---

Sensu Go offers license-activated features designed for enterprises, like LDAP authentication and enterprise-class support.
[Contact the Sensu sales team][1] for a personalized demo.

**Enterprise-only features in Sensu Go:**

- [LDAP authentication](../../installation/auth)
- Incident automation using the [Sensu ServiceNow handler](https://bonsai.sensu.io/assets/portertech/sensu-servicenow-handler)
- Issue automation using the [Sensu JIRA handler](https://bonsai.sensu.io/assets/portertech/sensu-jira-handler)
- [Enterprise-class support for Sensu Go](https://sensu.io/support/)

### Schedule a demo

For a personalized demo of Sensu Enterprise, [contact the Sensu sales team][1].
You can manage your Sensu Enterprise account and contact Sensu support through [account.sensu.io][2].

- [Contact the Sensu sales team](https://sensu.io/sales/)
- [Log in to the Sensu account portal][2]
- [Contact Sensu support](https://account.sensu.io/support)

### Get started with Sensu Enterprise

If you haven't already, [install the Sensu Go backend, agent, and sensuctl tool](../../installation/install-sensu) and [configure sensuctl](../../sensuctl/reference/#first-time-setup).

Log in to your Sensu account at [account.sensu.io](https://account.sensu.io/) and download your license file.
Then activate your license using sensuctl.

{{< highlight shell >}}
sensuctl license install --file license.json
{{< /highlight >}}

You can use sensuctl to view your license details at any time.

{{< highlight shell >}}
sensuctl license info
{{< /highlight >}}

See these resources to get started using enterprise-only features in Sensu Go.

- [Set up LDAP authentication](../../installation/auth)
- [Automate ServiceNow incidents with Sensu](../../guides/enterprise-assets)
- [Manage your Sensu Enterprise license](../../reference/enterprise)
- [Log in to your Sensu Enterprise account](https://account.sensu.io)
- [Contact Sensu support](https://account.sensu.io/support)

[1]: https://sensu.io/sales/
[2]: https://account.sensu.io/