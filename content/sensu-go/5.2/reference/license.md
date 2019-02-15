---
title: "License management"
linkTitle: "License Management"
description: "Activate and manage your enterprise license for Sensu Go."
weight: 100
version: "5.2"
product: "Sensu Go"
menu:
  sensu-go-5.2:
    parent: reference
---

- [Activating your license](#activating-your-sensu-enterprise-license)
- [License expiration](#license-expiration)
- [License management API](../../api/license)

### Quick links

- [Log in to your Sensu account](https://account.sensu.io/)
- [Configure LDAP authentication](../../installation/auth)
- [Guide to using assets](../../guides/install-check-executables-with-assets)
- [Contact Sensu support](https://account.sensu.io/support)
- [Contact Sensu sales](https://sensu.io/sales)

## Activating your Sensu Enterprise license

If you haven't already, [install the backend, agent, and sensuctl](../../installation/install-sensu) and [configure sensuctl](../../sensuctl/reference/#first-time-setup).

Log in to your Sensu account at [account.sensu.io](https://account.sensu.io/) and download your license file.
Then apply your license using sensuctl.

{{< highlight shell >}}
sensuctl create --file license.json
{{< /highlight >}}

You can view your license details at any time with:

{{< highlight shell >}}
sensuctl license info
{{< /highlight >}}

## License expiration

To see your license expiration date, log in to your Sensu account at [account.sensu.io](https://account.sensu.io/).

If your license is within 30 days of expiration, Sensu issues regular warnings in the Sensu [backend logs](../../guides/troubleshooting).
If your license expires, you will no longer have access to [enterprise features](../../getting-started/enterprise) within Sensu Go.
