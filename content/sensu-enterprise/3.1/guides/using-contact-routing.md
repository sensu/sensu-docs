---
title: "Contact Routing Guide"
linkTitle: "Contact Routing Guide"
description: "Set up a Sensu Enterprise Contact Routing."
product: "Sensu Enterprise"
version: "3.1"
weight: 7
menu:
 sensu-enterprise-3.1:
   parent: guides
---

- [Prerequisites](#prerequisites)
- [Overview](#overview)
  - [Contact Routing Basics](#contact-routing-basics)
    - [Contact Configuration](#contact-configuration)
    - [Check Configuration](#check-configuration)
    - [Client Configuration](#client-configuration)
- [Example Implementations](#example-implementations)
  - [Global Configuration](#global-configuration)
  - [Single Handler](#single-handler)
      - [Single Handler with a Single Matching Contact](#single-handler-with-a-single-matching-contact)
      - [Single Handler with a Single Non-Matching Contact](#single-handler-with-a-single-non-matching-contact)
      - [Single Handler with Multiple Matching Contacts](#single-handler-with-multiple-matching-contacts)
      - [Single Handler with Multiple Non-Matching Contacts](#single-handler-with-multiple-non-matching-contacts)
      - [Single Handler with Some Matching Contacts](#single-handler-with-some-matching-contacts)
  - [Multiple Handlers](#multiple-handlers)
      - [Multiple Handlers with a Matching Contact](#multiple-handlers-with-a-matching-contact)
      - [Multiple Handlers with a Single Matching Contact](#multiple-handlers-with-a-single-matching-contact)
      - [Multiple Handlers with a Single Non-Matching Contact](#multiple-handlers-with-a-single-non-matching-contact)
      - [Multiple Handlers with Multiple Matching Contacts](#multiple-handlers-with-multiple-matching-contacts)
      - [Multiple Handlers with Multiple Non-Matching Contacts](#multiple-handlers-with-multiple-non-matching-contacts)
      - [Multiple Handlers with Some Matching Contacts](#multiple-handlers-with-some-matching-contacts)
- [Wrapping Up](#wrapping-up)
  - [Contact Routing and Sensu Event Pipeline](#contact-routing-and-sensu-event-pipeline)
- [References](#references)
- [Additional Resources](#additional-resources)

# Prerequisites

Before diving into this guide, we recommend having the following components ready:

- A working Sensu Enterprise deployment
- Two or more [Sensu Enterprise integrations](../../integrations) configured

If you've not already signed up for Sensu Enterprise, you can do so via [this link][1].

In this guide we'll be using [Slack][2] and [Email][3] handlers for our demonstration.

# Overview

Every incident, outage or event has an ideal first responder. This can be either
a team or individual with the knowledge to triage and address the issue. Sensu
Enterprise contact routing makes it possible to assign checks to specific teams
and/or individuals, reducing mean time to response and recovery (MTTR). Contact
routing works with all of the Sensu Enterprise third-party notification and
metric integrations.

_NOTE: Sensu Enterprise supports contact routing for all integrations except
EC2, Puppet, Chef, Flapjack, and Event Stream._

In this guide we'll cover configuring and using Sensu Enterprise Contact Routing.

## Contact Routing Basics

In Sensu Enterprise Contact Routing, contacts are composed of a name and
configuration overrides for one or more of Sensu Enterprise's built-in
integrations or handler configurations. A contact in Sensu Enterprise is not too
dissimilar from a contact on your phone, in which they have a name and one or
more _identifiers_ for various communication `channels` (e.g. a `phone`
_number_, `email` _address_, `Twitter` _username_, etc). As an example your contact may have the following `email` _address_, `slack` _channel_, `pagerduty` _service\_key_, etc.

### Contact Configuration

Configuring a contact requires you to define the name of the contact and the
services plus configuration override(s) for that contact under the `contacts` scope.

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

In the example above we have a contact named `support`. For `support` we
have an override configuration for `email` and `slack`. In our example we're having
this contact email `support@sensuapp.com` instead of the email integration's
default `to` address. For Slack, we're defining the channel the event should
post to, in this case `#support`.

### Check Configuration

Once a contact has been defined, we can now specify which contact(s) to use in a
check configuration. The use case for having a contact defined on a check could 
be that the check is owned by a particular team or group. For instance:

{{< highlight json >}}
{
  "checks": {
    "example_check": {
      "command": "do_something.rb",
      "handlers": [
        "email"
      ],
      "contacts": [
        "support"
      ]
    }
  }
}
{{< /highlight >}}

### Client Configuration

A client definition may include a list of contacts. Providing a list of contacts in the client definition ensures that those contacts will receive notifications for check results which do not explicitly define a list of contacts.

_NOTE: Contacts specified in a check definition will override contacts specified in the client definition for any check results generated by that client/check pair._


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

In this section we will illustrate contact routing behaviors in a few example scenarios.

## Global Configuration

The following section describes different scenarios and illustrates how contact routing how contact routing affects notifications being sent in each. We'll be using Email, Slack and PagerDuty as our example integrations.

Below is the base configuration for the integrations we'll be working with in our examples:

{{< highlight json >}}
{
  "slack": {
    "webhook_url": "https://hooks.slack.com/services/foo/bar/foobar",
    "username": "sensu",
    "channel": "#alerts",
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
    "to": "default@example.com",
    "from": "noreply@example.com",
    "timeout": 10
  },
  "pagerduty": {
    "service_key": "someservicekey ",
    "timeout": 10
  }
}
{{< /highlight >}}

## Single Handler

### Single Handler with a Single Matching Contact

For our first configuration we have a single handler `email` and a contact `support` configured. The `support` contact has a configuration override for `email` that will change the default `to` email address from "default@example.com" to "support@sensuapp.com".

{{< highlight json >}}
{
  "checks": {
    "example_check": {
      "command": "do_something.rb",
      "handlers": [
        "email"
      ],
      "contacts": [
        "support"
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
    }
  }
}
{{< /highlight >}}

Because the `support` contact's configuration provides overrides matching the handler being used, any event generated for this check will use this contact's configuration.

![Single Handler with Single Matching Contact](/images/contact-routing/single-handler/single-matching-contact.png)

### Single Handler with a Single Non-Matching Contact

This configuration has a single handler `email` a contact `support` configured. The `support` contact does not have a configuration override for `email`.

{{< highlight json >}}
{
  "checks": {
    "example_check": {
      "command": "do_something.rb",
      "handlers": [
        "email"
      ],
      "contacts": [
        "support"
      ]
    }
  }
}
{{< /highlight >}}
{{< highlight json >}}
{
  "contacts": {
    "support": {
      "pagerduty": {
        "service_key": "foobarkey"
      }
    }
  }
}
{{< /highlight >}}

Although the contact `support` is defined under `contacts` and specified correctly in the check definition, the contact does not provide configuration the for `email` integration. This means no change will be made to the default `email` configuration. In this case, an email will be sent to "default@example.com".

![Single Handler with Single Non-Matching Contact](/images/contact-routing/single-handler/single-non-matching-contact.png)

### Single Handler with Multiple Matching Contacts

In this configuration we have a single handler, `email`, and multiple contacts, `support` and `dev`, configured. The support and dev contacts have a configuration override for `email` handler to send their emails to "support@sensuapp.io" and "dev@sensuapp.io" respectively.

{{< highlight json >}}
{
  "checks": {
    "example_check": {
      "command": "do_something.rb",
      "handlers": [
        "email"
      ],
      "contacts": [
        "support",
        "dev"
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
        "to": "support@sensuapp.io"
      }
    },
    "dev": {
      "email": {
        "to": "dev@sensuapp.io"
      }
    }
  }
}
{{< /highlight >}}

In this instance, although we are using only one handler `email`, the handler is ran multiple times to send an email one to "support@sensuapp.io" and one to "dev@sensuapp.io":

![Single Handler with Multiple Matching Contacts](/images/contact-routing/single-handler/multiple-matching-contacts.png)

### Single Handler with Multiple Non-Matching Contacts

For this configuration we have a single handler `email` and multiple contacts, `support` and `dev` configured. The "support" contact has an override configuration for `slack` and the `dev` contact has an override configuration for `pagerduty`, neither of which have an override configuration for `email`.

{{< highlight json >}}
{
  "checks": {
    "example_check": {
      "command": "do_something.rb",
      "handlers": [
        "email"
      ],
      "contacts": [
        "support",
        "dev"
      ]
    }
  }
}
{{< /highlight >}}
{{< highlight json >}}
{
  "contacts": {
    "support": {
      "slack": {
        "channel": "#support"
      }
    },
    "dev": {
      "pagerduty": {
        "service_key": "foobarkey"
      }
    }
  }
}
{{< /highlight >}}

In this instance, since the contacts defined do not have an override configuration for `email` the default configuration for `email` will be used, in our example an email will be sent to "default@example.com"

![Single Handler with Multiple Non-Matching Contacts](/images/contact-routing/single-handler/multiple-non-matching-contacts.png)

### Single Handler with Some Matching Contacts

In this configuration we have a single handler `email` and multiple contacts `support`, `dev` and `eng` configured. The `support` contact has an override configuration for `email`, the `dev` contact has an override configuration for `pagerduty` and the `eng` contact has an override configuration for `slack`.

{{< highlight json >}}
{
  "checks": {
    "example_check": {
      "command": "do_something.rb",
      "handlers": [
        "email"
      ],
      "contacts": [
        "support",
        "dev"
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
        "to": "support@sensuapp.io"
      }
    },
    "dev": {
      "pagerduty": {
        "service_key": "foobarkey"
      }
    },
    "eng": {
      "slack": {
        "channel": "#engineering"
      }
    }
  }
}
{{< /highlight >}}

For this instance two emails will be generated. The first email will be sent to `support` contact at "support@sensuapp.io". The second email will be sent to our global configuration email at "default@example.com".

The reason for this is that since we have one or more contacts that do not have a configuration override for `email`, we use the default configuration.

![Single Handler with Some Matching Contacts](/images/contact-routing/single-handler/some-matching-contacts.png)

## Multiple Handlers

### Multiple Handlers with a Matching Contact

In this configuration we have two handlers, `email` and `slack`,  and a contact `support` configured. The `support` contact has a configuration override for `email` that will change the default `to` email address from "default@example.com" to "support@sensuapp.io" and a configuration override for `slack` to change the `channel` from "#alerts" to "#support"

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
        "support"
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
      },
      "slack": {
        "channel": "#support"
      }
    }
  }
}
{{< /highlight >}}

Because the contact configuration matches both handlers being used, any event generated for this check will use this contact's configuration.

![Multiple Handlers with Matching Contact](/images/contact-routing/multiple-handlers/matching-contact.png)

### Multiple Handlers with a Single Matching Contact

In this configuration we have two handlers,`email` and `slack`, and a contact `support` configured. The `support` contact has a configuration override for only `email` that will change the default `to` email address from "default@example.com" to "support@sensuapp.com". The `support` contact does not have a handler override for the `slack` handler.

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
        "support"
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
    }
  }
}
{{< /highlight >}}

Because the contact configuration only has configuration override for the `email` handler, only the `email` handler will be override. The default configuration for `slack` will be used.

![Multiple Handlers with Single Matching Contact](/images/contact-routing/multiple-handlers/single-matching-contact.png)

### Multiple Handlers with a Single Non-Matching Contact

Similar to the previous configuration, we have two handlers, `email` and `slack`, and a contact `support` configured. The `support` contact has a configuration override for `pagerduty` that will change the default `service\_key`. The support contact does not have a handler override for the `slack` or `email` handler.

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
        "support"
      ]
    }
  }
}
{{< /highlight >}}
{{< highlight json >}}
{
  "contacts": {
    "support": {
      "pagerduty": {
        "service_key": "foobarkey"
      }
    }
  }
}
{{< /highlight >}}

Since the contact does not have a configuration override for `email` or `slack` the default configuration for those handlers are used instead.

![Multiple Handlers with Single Non-Matching Contact](/images/contact-routing/multiple-handlers/single-non-matching-contact.png)

### Multiple Handlers with Multiple Matching Contacts

In this example we have two handlers configured for our check, `email` and `slack`. We have two contacts being used, `support` and `dev`, and both contacts have configuration override for both `email` and `slack`.

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
        "dev"
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
        "to": "support@sensuapp.io"
      },
      "slack": {
        "channel": "#support"
      }
    },
    "dev": {
      "email": {
        "to": "dev@sensuapp.io"
      },
      "slack": {
        "channel": "#dev"
      }
    }
  }
}
{{< /highlight >}}

Since both contacts match and both contacts have configuration overrides for both handlers, four handler events are generated. Two emails will be sent, one for `support` contact `to` "support@sensuapp.io" and one to `dev` contact `to` "dev@sensuapp.io". The same is true for the `slack` handler with the `support` contact creating a message in "#support" slack `channel` and the `dev` contact creating a message in "#dev" slack `channel`.

![Multiple Handlers with Multiple Matching Contacts](/images/contact-routing/multiple-handlers/multiple-matching-contacts.png)

### Multiple Handlers with Multiple Non-Matching Contacts

In this example we have two handlers configured for our check, `email` and `slack`. We have two contacts being used, `support` and `dev`, and both contacts have configuration override for `pagerduty` and do not include any override for `slack` or `email`.

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
        "dev"
      ]
    }
  }
}
{{< /highlight >}}
{{< highlight json >}}
{
  "contacts": {
    "support": {
      "pagerduty": {
        "service_key": "supportfoobarkey"
      }
    },
    "dev": {
      "pagerduty": {
        "service_key": "devfoobarkey"
      }
    }
  }
}
{{< /highlight >}}

Since both contacts match and neither contact provides configuration overrides for either handler, two handler events are generated. The default configuration for both handlers will be used.

![Multiple Handlers with Multiple Non-Matching Contact](/images/contact-routing/multiple-handlers/multiple-non-matching-contacts.png)

### Multiple Handlers with Some Matching Contacts

In this example we have two handlers configured for our check, `email` and `slack`. We have three contacts being used, `support`, `dev` and `eng`. Support has a contact override for `email` and `dev` has a contact override for `slack`. `eng` has a contact override for `pagerduty` which is not a handler that the check is using.

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
        "dev",
        "eng"
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
        "to": "support@sensuapp.io"
      }
    },
    "dev": {
      "slack": {
        "channel": "#dev"
      }
    },
    "eng": {
      "pagerduty": {
        "service_key": "foobarkey"
      }
    }
  }
}
{{< /highlight >}}

With some contacts providing at least one applicable settings override, we expect that there will be four different handler events generated.

For `email` handler we will be sending an email to the `support` contact override of "support@sensuapp.io". Since `dev` and `eng` do not have a contact override for `email` a single email will be sent to our default email configured, which in our case is "default@example.com".

For `slack` handler, similar to our email handler, we'll be creating a message for our `dev` contact override to `#dev` channel. Because neither `support` or `eng` contacts provide an override for `slack`, a single notification will be sent to our default `slack` channel, in our case "#alerts".


![Multiple Handlers with Some Matching Contact](/images/contact-routing/multiple-handlers/some-matching-contacts.png)

# Wrapping Up

## Contact Routing and Sensu Event Pipeline

When a check is executed and an event is generated, Sensu sends a copy of
of the event to each defined handler, allowing the workflow for each handler to be managed
independently.

![Contact Routing and Monitoring Event Pipeline](/images/contact-routing/contact-routing-MEP.png)

Each handler evaluates the event to determine which contacts should be notified. For each contact defined in the event, the handler will generate a notification using either the contact's override configuration or the default handler configuration. For events which define multiple contacts without applicable overrides, only a single notification will be generated using the default handler configuration.

# References

For further reference please see our [Contact Routing][6] documentation.

# Additional Resources

Hopefully you've found this useful! If you find any issues or question, feel free to reach out in our [Community Slack][4], or [open an issue][5] on Github.

[1]: https://account.sensu.io/users/sign_up
[2]: /sensu-enterprise/latest/integrations/slack
[3]: /sensu-enterprise/latest/integrations/email
[4]: https://slack.sensu.io
[5]: https://github.com/sensu/sensu-docs/issues/new
[6]: /sensu-enterprise/latest/contact-routing/