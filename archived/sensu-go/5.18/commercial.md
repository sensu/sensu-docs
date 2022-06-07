---
title: "Get started with commercial features"
linkTitle: "Commercial Features"
description: "Get started with commercial features in Sensu Go. Read this guide to learn about the latest commercial features. Contact our sales team for a free trial."
weight: -40
version: "5.18"
menu: "sensu-go-5.18"
product: "Sensu Go"
---

Sensu Go offers commercial features designed for monitoring at scale.
[Contact the Sensu sales team][1] for a personalized demo and free trial.
All commercial features are available for free in the packaged Sensu Go distribution up to an entity limit of 100.
See the [announcement on our blog][7] for more information.

## Commercial features in Sensu Go

- **Manage resources from your browser**: Create, edit, and delete checks, handlers, mutators, and filters using the Sensu [web UI][8], and access the Sensu web UI homepage.
- **Authentication providers**: Scale Sensu role-based access control (RBAC) with [LDAP and Active Directory integrations][9].
- **Scalable resource filtering** designed for large installations: Use label and field selectors to filter [Sensu API][4] responses, [sensuctl][5] outputs, and Sensu [web UI][6] views using custom labels and a wider range of resource attributes.
- **Event logging**: Log event data to a file you can use as an input source for your favorite data lake solution.
The [event logging][10] functionality provides better performance and reliability than event handlers.
- **Enterprise-tier assets**: Connect your monitoring event pipelines to industry-standard tools like ServiceNow and Jira with [enterprise-tier assets][11].
- **Enterprise-scale event storage**: Scale your Sensu instance and handle high volumes of events with a [PostgreSQL event store][12].
- **Enterprise-class support**: Rest assured that with [Sensu support][13], help is available if you need it.
Our expert in-house team offers best-in-class support to get you up and running smoothly.

Review a [complete comparison of OSS and commercial features][3].

## Contact us for a free trial

For a personalized demo and free trial of commercial features at scale in Sensu Go, [contact the Sensu sales team][1].
Manage your Sensu account and contact support through [account.sensu.io][2].

- [Contact the Sensu sales team][1]
- [Log in to your Sensu account][2]
- [Contact Sensu support][14]

## Get started with commercial features in Sensu Go

If you haven't already, [install the Sensu Go backend, agent, and sensuctl tool][15] and [configure sensuctl][16].

Log in to your Sensu account at [account.sensu.io][2] and download your commercial license file.
Click **Download license**.

{{< figure src="/images/go/commercial/license_download.png" alt="Screenshot of Sensu account license download" link="/images/go/commercial/license_download.png" target="_blank" >}}

With the license file downloaded, you can use sensuctl to activate your commercial license:

{{< code shell >}}
sensuctl create --file sensu_license.json
{{< /code >}}

Use sensuctl to view your license details at any time:

{{< code shell >}}
sensuctl license info
{{< /code >}}

These resources will help you get started with commercial features in Sensu Go:

- [Set up and manage authentication providers][9]
- [Install plugins with assets][17]
- [Manage your Sensu commercial license][18]
- [Log in to your Sensu account][2]
- [Contact Sensu support][14]

[1]: https://sensu.io/contact?subject=contact-sales/
[2]: https://account.sensu.io/
[3]: https://sensu.io/features#free-vs-paid
[4]: ../api#response-filtering
[5]: ../sensuctl/filter-responses/
[6]: ../web-ui/filter/
[7]: https://blog.sensu.io/one-year-of-sensu-go/
[8]: ../web-ui/
[9]: ../operations/control-access/auth/
[10]: ../reference/backend#event-logging
[11]: https://bonsai.sensu.io/assets?tiers%5B%5D=4/
[12]: ../reference/datastore#scale-event-storage
[13]: https://sensu.io/support/
[14]: https://account.sensu.io/support/
[15]: ../operations/deploy-sensu/install-sensu/
[16]: ../sensuctl/#first-time-setup
[17]: ../guides/install-check-executables-with-assets/
[18]: ../reference/license/
