---
title: "Contact Routing"
product: "Sensu Enterprise"
version: "3.3"
weight: 6
menu: "sensu-enterprise-3.3"
---

## Reference documentation

- [What is contact routing?](#what-is-contact-routing)
- [How does contact routing work?](#how-does-contact-routing-work)
- [Contact Routing configuration](#contact-routing-configuration)
  - [Example Contact Routing definition](#example-contact-routing-definition)
  - [Contact Routing definition specification](#contact-routing-definition-specification)
    - [`CONTACT` attributes](#contact-attributes)
    - [Severities](#severities)

## What is contact routing?

Every incident or outage has an ideal first responder, a team or individual with
the knowledge to triage and address the issue. Sensu Enterprise contact routing
makes it possible to assign checks to specific teams and/or individuals,
reducing mean time to response and recovery (MTTR). Contact routing works with
all of the Sensu Enterprise third-party notification and metric integrations.

_NOTE: Sensu Enterprise supports contact routing for all integrations except EC2, Puppet, Chef, Flapjack, and Event Stream._

## How does contact routing work?

Sensu Enterprise contacts are defined in JSON configuration files, which we
recommend to store in the `/etc/sensu/conf.d/contacts/` directory. A contact is
composed of a name and configuration overrides for one or more of Sensu
Enterprise's built-in integrations. A contact in Sensu Enterprise is not too
dissimilar from a contact on your phone, which usually have a name and one or
more _identifiers_ for various communication **channels** (e.g. a **phone**
_number_, **email** _address_, **Twitter** _username_, etc).

The following example contact definition provides overrides for the Sensu
Enterprise email and Slack integration default configuration settings.

{{< highlight json >}}
{
  "contacts": {
    "support": {
      "email": {
        "to": "support@sensuapp.com"
      },
      "slack": {
        "channel": "#support"
      }
    }
  }
}
{{< /highlight >}}

Once defined, Sensu Enterprise contacts are used the same way in which you use
contacts on your phone &ndash; by selecting a communication channel (e.g.
phone call, SMS, email, etc) &ndash; and then selecting the contact. With
Sensu Enterprise contact routing, the communication channels are [built-in
handlers (integrations)][1], and the selection of which channel to use is
managed by a check definition (or client definition).

The following example check definition will use the built-in Sensu Enterprise
email integration (event handler), notifying the `support` contact for any
corresponding events.

{{< highlight json >}}
{
  "checks": {
    "example_check": {
      "command": "do_something.rb",
      "interval": 30,
      "handler": "email",
      "contact": "support"
    }
  }
}
{{< /highlight >}}

## Contact routing configuration

### Example contact routing definition

The following is an example contact routing definition (i.e. a "contact"), a
JSON configuration file located at `/etc/sensu/conf.d/contacts/ops.json`.

{{< highlight json >}}
{
  "contacts": {
    "support": {
      "pagerduty": {
        "routing_key": "r3FPuDvNOTEDyQYCc7trBkymIFcy2NkE"
      },
      "slack": {
        "channel": "#support",
        "username": "sensu"
      }
    }
  }
}
{{< /highlight >}}

### Contact Routing definition specification

#### Contact names

Each contact routing definition has a unique contact name, used for the
definition key. All contacts must be defined within the `"contacts": {}`
[configuration scope][2], and comply with the following requirements:

- A unique string used to name/identify the check
- Cannot contain special characters or spaces
- Validated with [Ruby regex][3] `/^[\w\.-]+$/.match("check-name")`

#### `CONTACT` attributes

Contact routing attributes are configured within the `{ "contacts": { "CONTACT":
{} } }` configuration scope (where `CONTACT` is a valid [contact name][3]).
Contact definition attributes are configuration overrides for built-in
integrations (e.g. [Email][4], [Slack][5], [PagerDuty][6], [ServiceNow][7] etc;
see the [built-in handlers reference documentation][1] for a complete listing).

##### EXAMPLES {#contact-attributes-examples}

In most cases, contact definitions are used to provide partial integration
handler attribute overrides. The following example only provides a `"to"`
(recipient) attribute to override the default email integration configuration:

{{< highlight json >}}
{
  "contacts": {
    "support": {
      "email": {
        "to": "support@example.com"
      }
    }
  }
}
{{< /highlight >}}

However, contact definitions are not limited to providing a single attribute
&mdash; they can be used to provide multiple attributes or even complete
integration handler definitions (potentially overriding the entire default
definition). For example, a contact could be used to provide an email
integration definition to use an alternate SMTP server from the default
configuration:

{{< highlight json >}}
{
  "contacts": {
    "support": {
      "email": {
        "smtp": {
          "address": "smtp.support.example.com",
          "port": 587,
          "openssl_verify_mode": "none",
          "enable_starttls_auto": true,
          "authentication": "plain",
          "user_name": "postmaster@support.example.com",
          "password": "SECRET"
        },
        "to": "support@support.example.com",
        "from": "noreply@support.example.com"
      }
    }
  }
}
{{< /highlight >}}

##### Severities

You can use the `severities` attribute to configure the event severities that Sensu Enterprise will route to a contact.
However, unlike other contact attributes, the `severities` attribute doesn't override `severities` configured in the integration handler definition.
Sensu Enterprise processes contact-configured severities _after_ integration-configured severities, so contacts can only access severities allowed by the integration configuration.

For example, the following [PagerDuty integration][6] configuration sends alerts for only `warning` and `critical` severities.

{{< highlight json >}}

{
  "pagerduty": {
    "routing_key": "r3FPuDvNOTEDyQYCc7trBkymIFcy2NkE",
    "timeout": 10,
    "severities": ["warning", "critical"]
  }
}
{{< /highlight >}}

Therefore, contacts using the integration above only have access to `warning` and `critical` alerts.
The following example shows a contact configured to receive alerts through the PagerDuty integration shown above, but filtered for only `critical` alerts. As with integration-configured severities, event resolution bypasses this filtering.

{{< highlight json >}}
{
  "contacts": {
    "support": {
      "pagerduty": {
        "routing_key": "s2TZrJmMTTTHDfSMFe3woPqenBCxa7WtY",
        "severities": ["critical"]
      }
    }
  }
}
{{< /highlight >}}

severities     | 
---------------|------
description    | An array of check result severities that Sensu will route to the contact. _NOTE: Contact-configured severities must be included within the scope of an individual integration (like `pagerduty`), not under the scope of the contact name (like `support`)._
required       | false
type           | Array
allowed values | `ok`, `warning`, `critical`, `unknown`
example        | {{< highlight shell >}} "severities": ["critical", "unknown"]{{< /highlight >}}

[?]:  #
[1]:  ../built-in-handlers
[2]:  /sensu-core/1.2/reference/configuration#configuration-scopes
[3]:  #contact-names
[4]:  ../integrations/email
[5]:  ../integrations/slack
[6]:  ../integrations/pagerduty
[7]:  ../integrations/servicenow
