---
title: "License management"
linkTitle: "License Management"
description: "Sensu Go includes license-activated features designed for enterprises. Activate and manage your enterprise license with sensuctl and your Sensu account. Read the reference documentation to learn more."
weight: 100
version: "5.4"
product: "Sensu Go"
menu:
  sensu-go-5.4:
    parent: reference
---

- [Activating your license](#activating-your-license)
- [Entity limit](#entity-limit)
- [License expiration](#license-expiration)
- [License management API](../../api/license)

### Quick links

- [Log in to your Sensu account](https://account.sensu.io/)
- [Configure authentication providers](../../installation/auth)
- [Discover enterprise assets](https://bonsai.sensu.io/assets?tiers%5B%5D=4)
- [Guide to using assets](../../guides/install-check-executables-with-assets)
- [Contact Sensu support](https://account.sensu.io/support)
- [Contact Sensu sales](https://sensu.io/sales)

## Activating your license

If you haven't already, [install the backend, agent, and sensuctl](../../installation/install-sensu) and [configure sensuctl](../../sensuctl/reference/#first-time-setup).

Log in to your Sensu account at [account.sensu.io](https://account.sensu.io/) and download your license file using the "Download license" link.

_Sensu account: Download Sensu license._

<img alt="Screenshot of Sensu account license download" src="/images/go-license-download.png" width="350px">

With the license file downloaded, you can activate your license using sensuctl or the [license API](../../api/license).

To activate your license using sensuctl:

{{< highlight shell >}}
sensuctl create --file sensu_license.json
{{< /highlight >}}

You can use sensuctl to view your license details at any time.

{{< highlight shell >}}
# Active license
sensuctl license info
=== Training Team - Sensu
Account Name: Training Team - Sensu
Account ID:   123
Plan:         managed
Version:      1
Features:     all
EntityLimit:  0
Issuer:       Sensu, Inc.
Issued:       2019-02-15 15:01:44 -0500 -0500
Valid:        true
Valid Until:  2019-03-15 00:00:00 -0800 -0800

# No license found
sensuctl license info
Error: not found
{{< /highlight >}}

## Entity limit

Your license includes the entity limit tied to your Sensu licensing package.
(An entity limit of `0` allows unlimited entities.)
Both agent and proxy entities count towards the overall entity limit.
[Contact us](https://account.sensu.io/support) to upgrade your license.

To see your current entity count, use any [API request](https://docs.sensu.io/sensu-go/5.7/api/) that requires an [authorization header](https://docs.sensu.io/sensu-go/5.7/api/overview/#access-control). For example:

{{< highlight shell >}}
curl http://127.0.0.1:8080/api/core/v2/namespaces/default/entities -v -H "Authorization: Bearer $SENSU_TOKEN"
{{< /highlight >}}

You should see the current entity count and limit as response headers.

{{< highlight shell >}}
HTTP/1.1 200 OK
Content-Type: application/json
Sensu-Entity-Count: 4
Sensu-Entity-Limit: 0
{{< /highlight >}}

## License expiration

To see your license expiration date, log in to your Sensu account at [account.sensu.io](https://account.sensu.io/).

If your license is within 30 days of expiration, Sensu issues regular warnings in the Sensu [backend logs](../../guides/troubleshooting).
If your license expires, you will no longer have access to [enterprise features](../../getting-started/enterprise) within Sensu Go.
