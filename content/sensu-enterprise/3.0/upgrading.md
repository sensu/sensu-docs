---
title: "Upgrading Sensu Enterprise"
weight: 14
product: "Sensu Enterprise"
version: "3.0"
menu: "sensu-enterprise-3.0"
---

Upgrading Sensu Enterprise is usually a straightforward process. In most cases,
upgrading Sensu Enterprise only requires upgrading to the
latest package. Certain versions of Sensu Enterprise may include changes that
are *not backwards compatible* and require additional steps be taken when
upgrading.

## Upgrading from Sensu Enterprise < 3.0

The following documentation provides steps necessary when upgrading
from a Sensu Enterprise version prior to 3.0.

### Update OpsGenie integration configuration

OpsGenie has deprecated and will shut down their v1 API on
June 30th, 2018.

_NOTE: To continue using the Sensu Enterprise OpsGenie integration, you must
upgrade to Sensu Enterprise 3.0 before June 30, 2018._

Sensu Enterprise 3.0 updates the OpsGenie integration to use
OpsGenie's new v2 Alert, necessitating a breaking change to Sensu
Enterprise's OpsGenie configuration specification.

#### Configuring OpsGenie for `responders`

_NOTE: To continue routing events to specific OpsGenie teams and other
entities you must upgrade your Sensu Enterprise configuration when
upgrading Sensu Enterprise 3.0 or later_

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
{{</ highlight >}}

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
{{</ highlight >}}

As shown above, the `responders` attribute expects an array of hashes
specifying the `type` and `name` for each object. Depending on the
given type of a responder, the identifying attribute (e.g. `name`) may
vary. Please see [OpsGenie's Alert API Migration
Guide][opsgenie-api-migration] for more details.

### Changes in Java package dependency

With the release of Sensu Enterprise 3.0 the `sensu-enterprise` package
dependency on the Java Virtual Machine will change from OpenJDK 1.7 to
OpenJDK 1.8. This dependency will typically be satisfied
automatically by your distribution's package management system,
e.g. `yum` or `apt`.

_NOTE: Users running Sensu Enterprise on RHEL/Centos 6 or similar
distributions will need to install the [Extra Packages for
Enterprise Linux (EPEL) repository][epel] to provide OpenJDK version
1.8 when upgrading to Sensu Enterprise 3.0._

The aim of this change is to help our customers stay up-to-date with
their chosen Linux distributions and remain in compliance with security
policies which may require packages like OpenJDK 1.7 to be removed
once their end-of-support date is reached.

Until recently [Redhat’s OpenJDK Life
Cycle and Support Policy][rhel-openjdk-policy] reflected June 2018 as
the end-of-support date for OpenJDK 1.7. That date has since changed
to June 2020.

## Upgrading the Sensu Enterprise package

The following instructions assume that you have already installed
Sensu and/or Sensu Enterprise by using the steps detailed in the
[Sensu Installation Guide][overview].

_NOTE: If your machines do not have direct access to the internet and
cannot reach the Sensu software repositories, you must mirror the
repositories and keep them up-to-date._

### Sensu Enterprise

#### Ubuntu/Debian

{{< highlight shell >}}
sudo apt-get update
sudo apt-get -y install sensu-enterprise{{< /highlight >}}

#### CentOS/RHEL

{{< highlight shell >}}
sudo yum install sensu-enterprise{{< /highlight >}}

[overview]: /sensu-core/installation/overview
[opsgenie-api-migration]: https://docs.opsgenie.com/docs/migration-guide-for-alert-rest-api
[epel]: https://www.fedoraproject.org/wiki/EPEL
[rhel-openjdk-policy]: https://access.redhat.com/articles/1299013
