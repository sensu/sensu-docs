---
title: "Get started with commercial features"
linkTitle: "Commercial Features"
description: "Get started with commercial features in Sensu Go. Read this guide to learn about the latest commercial features. Contact our sales team for a free trial."
weight: -40
version: "6.7"
menu: "sensu-go-6.7"
product: "Sensu Go"
---

Sensu Go offers commercial features designed for monitoring and observability at scale.
All commercial features are available in the official Sensu Go distribution, and you can use them for free [up to an entity limit of 100][7].
If you have more than 100 entities, [contact the Sensu sales team][1] for a free trial.

In addition to the [summary][25] on this page, we describe commercial features in detail throughout the documentation.
Watch for this notice to identify commercial features:

{{% notice commercial %}}
**COMMERCIAL FEATURE**: Access <feature_name> in the packaged Sensu Go distribution.
For more information, read [Get started with commercial features](../commercial/).
{{% /notice %}}

## Commercial features in Sensu Go

- **Integrate your Sensu observability pipeline with industry-standard tools** like EC2, Jira, and ServiceNow, and Sumo Logic with [supported integrations][24] and [enterprise-tier dynamic runtime assets][11].
Use the built-in [Sensu Plus][30] integration to transmit your observability data to Sumo Logic via the [HTTP Logs and Metrics Source][29].
- **Manage resources from your browser**: Use the Sensu [web UI][8] to manage events and entities and create, edit, and delete checks, handlers, mutators, silences, and event filters.
Create customized [global default settings][26] for page size and theme, [page-specific settings][27] for page size, order, and selector, and [sign-in messages][28].
- **Control permissions with Sensu role-based access control (RBAC)**, with the option of using [Lightweight Directory Access Protocol (LDAP), Active Directory (AD), or OpenID Connect 1.0 protocol (OIDC)][9] for single sign-on (SSO) authentication.
- **Maintain high-level visibility into the current health of your business services**.
Use [business service monitoring (BSM)][23] to monitor your system with a top-down approach that produces meaningful alerts, prevents alert fatigue, and helps you focus on your core business services.
- **Use mutual transport layer security (mTLS) authentication** to [provide two-way verification of your Sensu agents and backend connections][21].
- **Protect your sensitive information** with [secrets management][22].
Avoid exposing usernames, passwords, and access keys in your Sensu configuration by integrating with HashiCorp Vault or using Sensu's `Env` secrets provider.
- **Manage your monitoring resources across multiple data centers, cloud regions, or providers** and mirror changes to follower clusters with [federation][20].
Federation affords visibility into the health of your infrastructure and services across multiple distinct Sensu instances within a single web UI.
- **Use powerful search capabilities** designed for large installations to search [Sensu API][4] responses, [sensuctl][5] outputs, and Sensu [web UI][6] views using custom labels and a wide range of resource attributes.
Build event filter expressions with [JavaScript execution functions][19].
- **Achieve enterprise-scale event handling** for your Sensu instance with a [PostgreSQL event store][12].
Access the PostgreSQL event datastore with the same Sensu web UI, API, and sensuctl processes as etcd-stored events.
Use [Sumo Logic metrics handlers][31] and [TCP stream handlers][32] to provide a persistent connection for transmitting Sensu observability metrics.
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

Users with permission to create or update licenses can also view license information in the Sensu [web UI][8] by pressing `CTRL .` to open the system information modal.

These resources will help you get started with commercial features in Sensu Go:

- [Set up and manage authentication providers][9]
- [Use dynamic runtime assets to install plugins][17]
- [Manage your Sensu commercial license][18]
- [Log in to your Sensu account][2]
- [Contact Sensu support][14]


[1]: https://sensu.io/contact?subject=contact-sales/
[2]: https://account.sensu.io/
[3]: https://sensu.io/features/compare
[4]: ../api/#response-filtering
[5]: ../sensuctl/filter-responses/
[6]: ../web-ui/search/
[7]: https://sensu.io/blog/one-year-of-sensu-go/
[8]: ../web-ui/
[9]: ../operations/control-access/sso/
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
[21]: ../operations/deploy-sensu/secure-sensu/#optional-configure-sensu-agent-mtls-authentication
[22]: ../operations/manage-secrets/secrets-management/
[23]: ../observability-pipeline/observe-schedule/business-service-monitoring/
[24]: ../plugins/supported-integrations/
[25]: #commercial-features-in-sensu-go
[26]: ../web-ui/webconfig-reference/#default-preferences-attributes
[27]: ../web-ui/webconfig-reference/#page-preferences-attributes
[28]: ../web-ui/webconfig-reference/#sign-in-message
[29]: https://help.sumologic.com/03Send-Data/Sources/02Sources-for-Hosted-Collectors/HTTP-Source
[30]: ../sensu-plus/
[31]: ../observability-pipeline/observe-process/sumo-logic-metrics-handlers/
[32]: ../observability-pipeline/observe-process/tcp-stream-handlers/
