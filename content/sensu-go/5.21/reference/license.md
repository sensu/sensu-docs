---
title: "License"
reference_title: "License"
type: "reference"
description: "Sensu Go includes commercial features designed for monitoring at scale. Activate and manage your commercial license with sensuctl and your Sensu account. Read this document to learn more."
weight: 125
version: "5.21"
product: "Sensu Go"
menu:
  sensu-go-5.21:
    parent: reference
---

## Activate your commercial license

If you haven't already, [install the backend, agent, and sensuctl][2] and [configure sensuctl][3].

Log in to your Sensu account at [account.sensu.io][1] and click **Download license** to download your license file.

{{< figure src="/images/go-license-download.png" alt="Screenshot of Sensu account license download" link="/images/go-license-download.png" target="_blank" >}}

With the license file downloaded, you can activate your license with sensuctl or the [license API][4].

{{% notice note %}}
**NOTE**: For [clustered configurations](../../operations/deploy-sensu/cluster-sensu), you only need to activate your license for one of the backends within the cluster.
{{% /notice %}}

To activate your license with sensuctl:

{{< code shell >}}
sensuctl create --file sensu_license.json
{{< /code >}}

Use sensuctl to view your license details at any time.

{{< code shell >}}
# Active license
sensuctl license info
=== You are currently using 10/100 total entities, 5/50 agent entities, and 5/50 proxy entities
Account Name: Training Team - Sensu
Account ID:   123
Plan:         managed
Version:      1
Features:     all
Issuer:       Sensu, Inc.
Issued:       2020-02-15 15:01:44 -0500 -0500
Valid:        true
Valid Until:  2021-02-15 00:00:00 -0800 -0800

# No license found
sensuctl license info
Error: not found
{{< /code >}}

## Entity limit

Your commercial license may include the entity limit and entity class limits tied to your Sensu licensing package.
[Contact Sensu][8] to upgrade your commercial license.

Your Sensu license may include two types of entity limits:

- Entity limit: the maximum number of entities of all classes your license includes.
Both agent and proxy entities count toward the overall entity limit.
- Entity class limits: the maximum number of a specific class of entities (for example, agent or proxy) that your license includes.

For example, if your license has an entity limit of 10,000 and an agent entity class limit of 3,000, you cannot run more than 10,000 entities (agent and proxy) total.
At the same time, you cannot run more than 3,000 agents.
If you use only 1,500 agent entities, you can have 8,500 proxy entities before you reach the overall entity limit of 10,000.

### View entity count and entity limit

Your current entity count and entity limit are included in the `sensuctl license info` response.

In tabular format, the entity count and limit are included in the response title:

{{< code shell >}}
sensuctl license info --format tabular
=== You are currently using 10/100 total entities, 5/50 agent entities, and 5/50 proxy entities
Account Name: Training Team - Sensu
Account ID:   123
Plan:         managed
Version:      1
Features:     all
Issuer:       Sensu, Inc.
Issued:       2020-02-15 15:01:44 -0500 -0500
Valid:        true
Valid Until:  2021-02-15 00:00:00 -0800 -0800
{{< /code >}}

If you have an unlimited entity count, the `sensuctl license info` response title will still include a current count for each type of entity you are using.
For example:

{{< code shell >}}
=== You are currently using 10/unlimited total entities, 5/unlimited agent entities, and 5/unlimited proxy entities
{{< /code >}}

In other formats (for example, YAML and JSON), the entity count and limit are included as labels:

{{< language-toggle >}}

{{< code shell "YML" >}}
sensuctl license info --format yaml

type: LicenseFile
api_version: licensing/v2
metadata:
  labels:
    sensu.io/entity-count: "10"
    sensu.io/entity-limit: "100"
spec:
  license:
    version: 1
    issue: Sensu, Inc.
    accountName: Training Team - Sensu
[...]
{{< /code >}}

{{< code shell "JSON" >}}
sensuctl license info --format json

{
  "type": "LicenseFile",
  "api_version": "licensing/v2",
  "metadata": {
    "labels": {
      "sensu.io/entity-count": "10",
      "sensu.io/entity-limit": "100"
    }
  },
  "spec": {
    "license": {
      "version": 1,
      "issue": "Sensu, Inc.",
      "accountName": "Training Team - Sensu"
    },
    "...": "..."
  }
}
{{< /code >}}

{{< /language-toggle >}}

You can also see your current entity count and limit in the response headers for any `/api/core` or `/api/enterprise` [API request][9].
For example:

{{< code shell >}}
curl http://127.0.0.1:8080/api/core/v2/namespaces/default/entities -v -H "Authorization: Bearer $SENSU_ACCESS_TOKEN"
{{< /code >}}

The response headers will include your current entity count and limit:

{{< code shell >}}
HTTP/1.1 200 OK
Content-Type: application/json
Sensu-Entity-Count: 10
Sensu-Entity-Limit: 100
{{< /code >}}

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
[2]: ../../operations/deploy-sensu/install-sensu/
[3]: ../../sensuctl/#first-time-setup-and-authentication
[4]: ../../api/license/
[5]: ../../commercial/
[6]: ../../operations/maintain-sensu/troubleshoot/
[7]: https://sensu.io/contact?subject=contact-sales
[8]: https://account.sensu.io/support
[9]: ../../api/
[10]: ../../operations/control-access/
[11]: https://bonsai.sensu.io/assets?tiers%5B%5D=4
[12]: ../../guides/install-check-executables-with-assets/
