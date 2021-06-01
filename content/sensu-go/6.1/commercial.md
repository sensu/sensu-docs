---
title: "Get started with commercial features"
linkTitle: "Commercial Features"
description: "Get started with commercial features in Sensu Go. Read this guide to learn about the latest commercial features. Contact our sales team for a free trial."
weight: -40
version: "6.1"
menu: "sensu-go-6.1"
product: "Sensu Go"
---

Sensu Go offers commercial features designed for monitoring at scale.
All commercial features are available in the official Sensu Go distribution, and you can use them for free [up to an entity limit of 100][7].

If you have more than 100 entities, [contact the Sensu sales team][1] for a free trial.

## Commercial features in Sensu Go

- **Integrate your Sensu observability pipeline with industry-standard tools** like ServiceNow and Jira with [supported integrations][24] and [enterprise-tier dynamic runtime assets][11].
- **Manage resources from your browser**: Use the Sensu [web UI][8] to manage events and entities and create, edit, and delete checks, handlers, mutators, silences, and event filters.
- **Control permissions with Sensu role-based access control (RBAC)**, with the option of using [Lightweight Directory Access Protocol (LDAP), Active Directory (AD), or OpenID Connect 1.0 protocol (OIDC)][9] for authentication.
- **Use mutual transport layer security (mTLS) authentication** to [provide two-way verification of your Sensu agents and backend connections][21].
- **Protect your sensitive information** with [secrets management][22].
Avoid exposing usernames, passwords, and access keys in your Sensu configuration by integrating with HashiCorp Vault or using Sensu's built-in environment variable secrets provider.
- **Manage your monitoring resources across multiple data centers, cloud regions, or providers** and mirror changes to follower clusters with [federation][20].
Federation affords visibility into the health of your infrastructure and services across multiple distinct Sensu instances within a single web UI.
- **Use powerful search capabilities** designed for large installations to search [Sensu API][4] responses, [sensuctl][5] outputs, and Sensu [web UI][6] views using custom labels and a wide range of resource attributes.
Build event filter expressions with [JavaScript execution functions][19].
- **Log observation data** [to a file][10] you can use as an input to your favorite data lake solution.
- **Achieve enterprise-scale event handling** for your Sensu instance with a [PostgreSQL event store][12].
Access the PostgreSQL event datastore with the same Sensu web UI, API, and sensuctl processes as etcd-stored events.
- **Get enterprise-class support**: Rest assured that with [Sensu support][13], help is available if you need it.
Our expert in-house team offers best-in-class support to get you up and running smoothly.

Review a [complete comparison of OSS and commercial features][3].

## Contact us for a free trial

Sensu's commercial features are [free for your first 100 entities][7].
If your Sensu installation includes more than 100 entities, [contact the Sensu sales team][1] for a free trial of commercial features at scale in Sensu Go.

Manage your Sensu account and contact support through [account.sensu.io][2].

## Get started with commercial features in Sensu Go

If you haven't already, [install the Sensu Go backend, agent, and sensuctl tool][15] and [configure sensuctl][16].

You will need a commercial license if your Sensu installation includes more than 100 entities.
To download your commercial license file:

1. Log in to your Sensu account at [account.sensu.io][2].
2. Click **Download license**.

{{% notice note %}}
**NOTE**: In some cases, you may need to click **Generate license** before you can download your license.
{{% /notice %}}

{{< figure src="/images/go-license-download.png" alt="Screenshot of Sensu account license download" link="/images/go-license-download.png" target="_blank" >}}

With the license file downloaded, you can use sensuctl to activate your commercial license:

{{< code shell >}}
sensuctl create --file sensu_license.json
{{< /code >}}

{{% notice note %}}
**NOTE**: For [clustered configurations](../operations/deploy-sensu/cluster-sensu), you only need to activate your license for one of the backends within the cluster.
{{% /notice %}}

Use sensuctl to view your license details at any time:

{{< code shell >}}
sensuctl license info
{{< /code >}}

These resources will help you get started with commercial features in Sensu Go:

- [Set up and manage authentication providers][9]
- [Use dynamic runtime assets to install plugins][17]
- [Manage your Sensu commercial license][18]
- [Log in to your Sensu account][2]
- [Contact Sensu support][14]


[1]: https://sensu.io/contact?subject=contact-sales/
[2]: https://account.sensu.io/
[3]: https://sensu.io/features/compare
[4]: ../api#response-filtering
[5]: ../sensuctl/filter-responses/
[6]: ../web-ui/search/
[7]: https://sensu.io/blog/one-year-of-sensu-go/
[8]: ../web-ui/
[9]: ../operations/control-access/
[10]: ../observability-pipeline/observe-schedule/backend#event-logging
[11]: https://bonsai.sensu.io/assets?tiers%5B%5D=4/
[12]: ../operations/deploy-sensu/datastore#scale-event-storage
[13]: https://sensu.io/support/
[14]: https://account.sensu.io/support/
[15]: ../operations/deploy-sensu/install-sensu/
[16]: ../sensuctl/#first-time-setup-and-authentication
[17]: ../plugins/use-assets-to-install-plugins/
[18]: ../operations/maintain-sensu/license/
[19]: ../observability-pipeline/observe-filter/filters#build-event-filter-expressions-with-javascript-execution-functions
[20]: ../operations/deploy-sensu/use-federation/	
[21]: ../operations/deploy-sensu/secure-sensu/#sensu-agent-mtls-authentication
[22]: ../operations/manage-secrets/secrets-management/
[24]: ../plugins/supported-integrations/
