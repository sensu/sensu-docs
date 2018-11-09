---
title: "Upgrading Sensu Enterprise"
product: "Sensu Enterprise"
version: "3.3"
menu: "sensu-enterprise-3.3"
weight: 3
---

In most cases, you can upgrade Sensu Enterprise by installing the
latest package. Certain versions of Sensu Enterprise may include
changes that are *not backwards compatible* and require additional
steps be taken when upgrading.

- [Upgrading the Sensu Enterprise package](#upgrading-the-sensu-enterprise-package)
- [Upgrading from Sensu Enterprise < 3.0](#upgrading-from-sensu-enterprise-3-0)
	- [Changes in OpsGenie integration](#changes-in-opsgenie-integration)
	- [Changes in Java package dependency](#changes-in-java-package-dependency)

## Upgrading the Sensu Enterprise package

The following instructions assume that you have already installed
Sensu Enterprise using the steps detailed in the [Sensu
Installation Guide][overview].

_NOTE: If your machines do not have direct access to the internet and
cannot reach the Sensu software repositories, you must mirror the
repositories and keep them up-to-date._

1. Download the latest package.<br><br>CentOS/RHEL:
{{< highlight shell >}}
sudo yum install sensu-enterprise{{< /highlight >}}
Ubuntu/Debian:
{{< highlight shell >}}
sudo apt-get update
sudo apt-get -y install sensu-enterprise{{< /highlight >}}

2. Restart Sensu Enterprise:
{{< highlight shell >}}
sudo systemctl restart sensu-enterprise{{< /highlight >}}
_NOTE: For Linux distributions using `sysvinit`, use `sudo service sensu-enterprise restart`._

3. Use the [Info API][info] to confirm that Sensu Enterprise has upgraded to the [latest version][change]:
{{< highlight shell >}}
curl -s http://127.0.0.1:4567/info | jq .{{< /highlight >}}

## Upgrading from Sensu Enterprise < 3.0

The following documentation provides steps necessary when upgrading
from a Sensu Enterprise version prior to 3.0.

### Changes in OpsGenie integration

As of June 30, 2018, OpsGenie has shut down their v1 API.
Sensu Enterprise 3.0 updates the OpsGenie integration to use
OpsGenie's new v2 Alert API, necessitating a breaking change to Sensu
Enterprise's OpsGenie configuration specification.

_WARNING: To continue using the Sensu Enterprise OpsGenie integration, you must upgrade to
Sensu Enterprise 3.0 or later and update your Sensu Enterprise OpsGenie configuration._

#### Update OpsGenie configuration for `responders`

The OpsGenie v2 Alert API replaces the `teams` and `recipients` attributes with
a new `responders` attribute. As a result you must upgrade your Sensu
Enterprise configuration for OpsGenie in order to correctly route
alerts using the new API.

Example OpsGenie configuration for Sensu Enterprise prior to 3.0:

{{< highlight json >}}
{
  "opsgenie": {
    "api_key": "eed02a0d-85a4-427b-851a-18dd8fd80d93",
    "teams": ["ops", "web"],
    "recipients": ["afterhours"]
  }
}
{{< /highlight >}}

Assuming `afterhours` is an escalation plan, the values supplied for
`teams` and `recipients` above can be translated to the new
`responders` attribute like so:

{{< highlight json >}}
{
  "opsgenie": {
    "api_key": "eed02a0d-85a4-427b-851a-18dd8fd80d93",
    "responders": [
      {
        "type": "team",
        "name": "ops"
      },
      {
        "type": "team",
        "name": "web"
      },
      {
        "type": "escalation",
        "name": "afterhours"
      }
    ]
  }
}
{{< /highlight >}}

As shown above, the `responders` attribute expects an array of hashes
specifying the `type` and `name` for each object. Depending on the
given type of a responder, the identifying attribute (e.g. `name`) may
vary. Please see [OpsGenie's Alert API Migration
Guide][opsgenie-api-migration] for more details.

#### Update OpsGenie configuration for `overwrites_quiet_hours`

Sensu Enterprise 3.0 updates the name of the `overwrites_quiet_hours` attribute
to `overwrite_quiet_hours`. The singular form of this attribute is required to
achieve the desired result of overriding alert filtering that would otherwise
prevent OpsGenie from notifying recipient(s) during their configured quiet hours.

Example OpsGenie configuration for Sensu Enterprise 3.0:

{{< highlight json >}}
{
  "opsgenie": {
    "api_key": "eed02a0d-85a4-427b-851a-18dd8fd80d93",
    "overwrite_quiet_hours": true
  }
}
{{< /highlight >}}

### Changes in Java package dependency

With the release of Sensu Enterprise 3.0 the `sensu-enterprise` package
dependency on the Java Virtual Machine will change from OpenJDK 1.7 to
OpenJDK 1.8. This dependency will typically be satisfied
automatically by your distribution's package management system,
such as `yum` or `apt`.

_NOTE: Users running Sensu Enterprise on RHEL/Centos 6 or similar
distributions will need to install the [Extra Packages for
Enterprise Linux (EPEL) repository][epel] to provide OpenJDK version
1.8 when upgrading to Sensu Enterprise 3.0._

The aim of this change is to help our customers stay up-to-date with
their chosen Linux distributions and remain in compliance with security
policies.

[overview]: ../installation/overview
[opsgenie-api-migration]: https://docs.opsgenie.com/docs/migration-guide-for-alert-rest-api
[epel]: https://www.fedoraproject.org/wiki/EPEL
[info]: /sensu-core/latest/api/health-and-info
[change]: ../changelog
