---
title: "License management"
linkTitle: "License Management"
description: "Sensu Go includes commercial features designed for monitoring at scale. Activate and manage your commercial license with sensuctl and your Sensu account. Read the reference documentation to learn more."
weight: 190
version: "5.17"
product: "Sensu Go"
menu:
  sensu-go-5.17:
    parent: reference
---

- [Activate your commercial license](#activate-your-commercial-license)
- [Entity limit](#entity-limit)
- [License expiration](#license-expiration)
- [Quick links](#quick-links)

## Activate your commercial license

If you haven't already, [install the backend, agent, and sensuctl][2] and [configure sensuctl][3].

Log in to your Sensu account at [account.sensu.io][1] and click **Download license** to download your license file.

{{< figure src="/images/go/commercial/license_download.png" alt="Screenshot of Sensu account license download" link="/images/go/commercial/license_download.png" target="_blank" >}}

With the license file downloaded, you can activate your license with sensuctl or the [license API][4].

To activate your license with sensuctl:

{{< highlight shell >}}
sensuctl create --file sensu_license.json
{{< /highlight >}}

Use sensuctl to view your license details at any time.

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

Your commercial license includes the entity limit tied to your Sensu licensing package.
An entity limit of `0` allows unlimited entities.
Both agent and proxy entities count toward the overall entity limit.
[Contact Sensu][8] to upgrade your commercial license.

To see your current entity count, use any `/api/core` or `/api/enterprise` [API request][9]. For example:

{{< highlight shell >}}
curl http://127.0.0.1:8080/api/core/v2/namespaces/default/entities -v -H "Authorization: Bearer $SENSU_ACCESS_TOKEN"
{{< /highlight >}}

Your current entity count and limit are listed as response headers:

{{< highlight shell >}}
HTTP/1.1 200 OK
Content-Type: application/json
Sensu-Entity-Count: 4
Sensu-Entity-Limit: 0
{{< /highlight >}}

## License expiration

To see your commercial license expiration date, [log in to your Sensu account][1].

If your license is within 30 days of expiration, Sensu issues regular warnings in the Sensu [backend logs][6].
If your license expires, you will still have access to [commercial features][5], but your entity limit will drop back down to the free limit of 100.

## Quick links

- [Log in to your Sensu account][1]
- [Configure authentication providers][10]
- [Use the license management API][4]
- [Discover enterprise assets][11]
- [Install plugins with assets][12]
- [Contact Sensu support][8]
- [Contact Sensu sales][7]

[1]: https://account.sensu.io/
[2]: ../../installation/install-sensu/
[3]: ../../sensuctl/reference/#first-time-setup
[4]: ../../api/license/
[5]: ../../commercial/
[6]: ../../guides/troubleshooting/
[7]: https://sensu.io/contact?subject=contact-sales
[8]: https://account.sensu.io/support
[9]: ../../api/
[10]: ../../installation/auth/
[11]: https://bonsai.sensu.io/assets?tiers%5B%5D=4
[12]: ../../guides/install-check-executables-with-assets/
