---
title: "Contact Routing Guide"
linkTitle: "Contact Routing Guide"
description: "Set up a Sensu Enterprise Contact Routing."
product: "Sensu Enterprise"
version: "2.6"
weight: 7
menu:
 sensu-Enterprise-2.6:
   parent: guides
---

- [Prerequisites](#prerequisites)
- [Overview](#overview)
  - [Contact Routing Basics](#contact-routing-basics)
    - [Contact Configuration](#contact-configuration)
    - [Check Configuration](#check-configuration)
    - [Client Configuration](#client-configuration)
- [Example Implementation](#example Implementation)
- [Wrapping Up](#wrapping-up)
- [References](#references)

# Prerequisites

Before diving into this guide, we recommend having the following components ready:

- A working Sensu Enterprise deployment
- Two or more handlers configured

If you've not already signed up for Sensu Enterprise, you can do so via [this link][1].

In this guide we'll be using [Slack][2] and [Email][3] handlers for our demostration.

# Overview

Every incident, outage or event has an ideal first responder. This can be either
a team or invdividual with the knowledge to tirage and address the issue. Sensu
Enterprise contact routing makes it possible to assign checks to specific teams
and/or individuals, reducing mean time to response and recovery (MTTR). Contact
routing works with all of the Sensu Enterprise third-party notification and
metric integrations.

_NOTE: Sensu Enterprise supports contact routing for all integrations except
EC2, Puppet, Chef, Flapjack, and Event Stream._

In this guide we'll cover configuring and using Sensu Enterprise Contact

## Contact Routing Basics

In Sensu Enterprise Contact Routing, contacts are composed of a name and
configuration overrides for one or more of Sensu Enterprise's built-in
integrations or handler configurations. A contact in Sensu Enterprise is not too
dissimilar from a contact on your phone, which usually have a name and one or
more _identifiers_ for various communication **channels** (e.g. a **phone**
_number_, **email** _address_, **Twitter** _username_, etc).

### Contact Routing and Sensu Event Pipeline
TODO

When a check is executed and an event is generated, Sensu splits handling
of the event for each handler defined. When multiple handlers are defined, each
handler is managed independently. This means that each handler is processed
independent of any other handler configured.

### Contact Configuration

Configuring a contact requires you to define the name of the contact and the
services plus configuration override for that contact.

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

In the example above we have a contact named **support**. For **support** we
have an override configuration for email and slack. In our example we're having
this contact email _support@sensuapp.com_ instead of the email intergration's
default **to** address. For Slack, we're defining the channel the event should
post to, in this case _#support_.

### Check Configuration

Once a contact has been defined, we can now apply which contact to use in a
check configuration. The use case for having it on a check could be that the
client is owned by a particular team or group, the same can be done for specific
checks. For instance 

{{< highlight json >}}
{
  "checks": {
    "example_check": {
      "command": "do_something.rb",
      "handler": "email",
      "contact": "support"
    }
  }
}
{{< /highlight >}}

### Client Configuration

A client configuration can include a contact to use.

{{< highlight json >}}
{
  "client": {
    "name": "ec2-west-id-12345",
    "address": "8.8.8.8",
    "subscriptions": [
      "production",
      "aws"
    ],
    "contact": "aws-team"
  }
}
{{< /highlight >}}

# Example Implementations

TODO: DEFAULT CONFIGURATION
For the examples we'll be working with we want to define what our default handlers will be.

In the following section we'll be going over different scenarios and showcase how contactrouting would be used and how contact routing affects notifications being sent.

Bellow is the default configuration for the handlers we'll be working with in our examples:

{{< highlight json >}}
{
  "handlers": {
    "slack": {
      "webhook_url": "https://hooks.slack.com/services/foo/bar/foobar",
      "username": "sensu",
      "channel": "#support",
      "timeout": 10
    },
    "email": {
      "smtp": {
        "address": "smtp.example.com",
        "port": 587,
        "openssl_verify_mode": "none",
        "enable_starttls_auto": true,
        "authentication": "plain",
        "user_name": "postmaster@example.com",
        "password": "SECRET"
      },
      "to": "support@example.com",
      "from": "noreply@example.com",
      "timeout": 10
    },
    "pagerduty": {
      "service_key": "someservicekey ",
      "timeout": 10
    }
  }
}
{{< /highlight >}}

## Multiple Handlers With Single Contact Examples
TODO: Check with email and slack handler, contact with only email

When having a check with multiple handlers define it is important to note that
Sensu does not skip a handler if a contact does not contain configuration for
said handler. Sensu will use the default configuration in these cases.

A typical scenario when using contacts is that you'll have a single service
configured for the contact and a check with multiple handlers.

{{< highlight json >}}
{
  "checks": {
    "example_check": {
      "command": "do_something.rb",
      "handlers": [
        "email",
        "slack"
      ],
      "contact": "support"
    }
  }
}
{{< /highlight >}}

{{< highlight json >}}
{
  "contacts": {
    "support": {
      "email": {
        "to": "support@sensuapp.com"
      }
    }
  }
}
{{< /highlight >}}

For an event generated by the above check, we sould receive an email at
"support@sensuapp.com" and a slack message in our default channel, #support.

TODO: Check with PagerDuty and slack handler, contact with only email

Similar to the above example here we have a check that has both a pagerduty and
slack handler configured. Our contact is configured with email and slack
configuration.

{{< highlight json >}}
{
  "checks": {
    "example_check": {
      "command": "do_something.rb",
      "handlers": [
        "pagerduty",
        "slack"
      ],
      "contact": "support"
    }
  }
}
{{< /highlight >}}

{{< highlight json >}}
{
  "contacts": {
    "support": {
      "email": {
        "to": "support@sensuapp.com"
      },
      "slack": {
        "channel": "#t1support"
      }
    }
  }
}
{{< /highlight >}}

With this example, any event generated by the check will have a pagerduty event
generated and a message posted to #t1support. There would not be an email sent
to support@sesuapp.com since the check does not have "email" defined as a
handler.

TODO: Check with email and slack handler, contact with email and slack

In this configuration we see that our contact and check both have a
configuration for email and slack.

{{< highlight json >}}
{
  "checks": {
    "example_check": {
      "command": "do_something.rb",
      "handlers": [
        "email",
        "slack"
      ],
      "contact": "support"
    }
  }
}
{{< /highlight >}}

{{< highlight json >}}
{
  "contacts": {
    "support": {
      "email": {
        "to": "support@sensuapp.com"
      },
      "slack": {
        "channel": "#t1support"
      }
    }
  }
}
{{< /highlight >}}

An event generated by this check would have an email sent to "support@sensuapp.com" and to the #t1support channel. 



## Single Handler Examples With Single Contact Examples

TODO: Check with PagerDuty handler, contact with email and slack
{{< highlight json >}}
{
  "checks": {
    "example_check": {
      "command": "do_something.rb",
      "handlers": [
        "pagerduty"
      ],
      "contact": "support"
    }
  }
}
{{< /highlight >}}

TODO: Check with email and slack handler, contact with pagerduty
{{< highlight json >}}
{
  "checks": {
    "example_check": {
      "command": "do_something.rb",
      "handlers": [
        "email",
        "slack"
      ],
      "contact": "support"
    }
  }
}
{{< /highlight >}}

## Multiple Handlers with Multipe Contacts Examples
TODO: Check with email and slack handler, contact with only email, contact with slack

With contact routing, each handler configured for each contact will be applied
and processed independent of eachother. This gives you the added benefit of
being able to have multiple contacts applied to a single check or client and
override the same values for the same handler.

In our example bellow we have two contacts, both of which are configured with
email values override.

{{< highlight json >}}
{
  "checks": {
    "example_check": {
      "command": "do_something.rb",
      "handlers": [
        "email",
        "slack"
      ],
      "contacts": [
        "support",
        "helpdesk"
      ]
    }
  }
}
{{< /highlight >}}

{{< highlight json >}}
{
  "contacts": {
    "support": {
      "email": {
        "to": "support@sensuapp.com"
      }
    },
    "helpdesk":{
      "email": {
        "to": "helpdesk@sensuapp.com"
      }
    }
  }
}
{{< /highlight >}}

When an event is generated for the above check, two emails will be sent. One to
support@ and one to helpdesk@. A single slack notification would be sent in this case.

In the bellow example we have 
{{< highlight json >}}
{
  "checks": {
    "example_check": {
      "command": "do_something.rb",
      "handlers": [
        "email",
        "slack"
      ],
      "contacts": [
        "support",
        "helpdesk"
      ]
    }
  }
}
{{< /highlight >}}

{{< highlight json >}}
{
  "contacts": {
    "support": {
      "email": {
        "to": "support@sensuapp.com"
      }
    },
    "helpdesk":{
      "email": {
        "to": "helpdesk@sensuapp.com"
      }
    }
  }
}
{{< /highlight >}}

TODO: Check with email and slack handler, contact with only pagerduty, contact with slack and email, contact with 

{{< highlight json >}}
{
  "checks": {
    "example_check": {
      "command": "do_something.rb",
      "handlers": [
        "email",
        "slack"
      ],
      "contact": "support"
    }
  }
}
{{< /highlight >}}


## Single Handler with Single Contact Example


# Wrapping Up
# References
# Additional Resources

Hopefully you've found this useful! If you find any issues or question, feel free to reach out in our [Community Slack][8], or [open an issue][9] on Github.

[1]: https://account.sensu.io/users/sign_up
[2]: /sensu-enterprise/latest/integrations/slack
[3]: /sensu-enterprise/latest/integrations/email
[4]: 
[5]: 
[6]: 
[7]: 
[8]: https://slack.sensu.io
[9]: https://github.com/sensu/sensu-docs/issues/new

