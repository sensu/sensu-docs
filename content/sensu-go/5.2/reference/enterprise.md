---
title: "Sensu Enterprise"
linkTitle: "Enterprise"
description: "Sensu Enterprise reference documentation"
weight: 10
version: "5.2"
product: "Sensu Go"
menu:
  sensu-go-5.2:
    parent: reference
---

Thank you for being a Sensu Enterprise customer!
This page provides everything you need to know about managing your Sensu Enterprise license.

- [Activating your Sensu Enterprise license](#enterprise-features-in-sensu-go)
- [License expiration](#license-expiration)

### Quick links

- [Log in to your Sensu Enterprise account](https://account.sensu.io/)
- [Guide to using Enterprise assets](../../guides/enterprise-assets)
- [Contact Sensu support](https://account.sensu.io/support)
- [Contact Sensu sales](https://sensu.io/sales)

### Enterprise features in Sensu Go

- [LDAP authentication](../../installation/auth)
- [ServiceNow event handler](https://bonsai.sensu.io/assets/portertech/sensu-servicenow-handler)
- [JIRA event handler](https://bonsai.sensu.io/assets/portertech/sensu-jira-handler)
- [Enterprise-class support](https://sensu.io/support/)

## Activating your Sensu Enterprise license

If you haven't already, [install the backend, agent, and sensuctl](../../installation/install-sensu) and [configure sensuctl](../../sensuctl/reference/#first-time-setup).

Log in to your Sensu account at [account.sensu.io](https://account.sensu.io/) and download your license file.
Then apply your license using sensuctl.

{{< highlight shell >}}
sensuctl license install --file license.json
{{< /highlight >}}

You can view your license details at any time with:

{{< highlight shell >}}
sensuctl license info
{{< /highlight >}}

## License expiration

To see the expiration date for your Sensu Enterprise license, Log in to your Sensu account at [account.sensu.io](https://account.sensu.io/).

If your license is within 30 days of expiration, Sensu issues regular warnings in the Sensu backend logs.
If your license expires, you will no longer have access to [Sensu Enterprise features](#enterprise-features-in-sensu-go) within Sensu Go.

[1]: ../../sensuctl/reference
