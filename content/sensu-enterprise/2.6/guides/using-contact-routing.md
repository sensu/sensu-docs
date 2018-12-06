---
title: "Contact Routing Guide"
linkTitle: "Contact Routing Guide"
description: "Set up a Sensu Enterprise Contact Routing."
product: "Sensu Enterprise"
version: "2.6"
weight: 7
menu:
 sensu-enterprise-2.6:
   parent: guides
---

- [Prerequisites](#prerequisites)
- [Overview](#overview)
  - [Contact Routing Basics](#contact-routing-basics)
    - [Contact Configuration](#contact-configuration)
    - [Check Configuration](#check-configuration)
    - [Client Configuration](#client-configuration)
- [Example Implementation](#example-implementation)
  - [Default Configuration](#default-configuration)
  - [Single Handler](#single-handler)
      - [Single Handler with a Single Matching Contact](#single-handler-with-a-single-matching-contact)
      - [Single Handler with a Single Non-Matching Contact](#single-handler-a-single-non-matching-contact)
      - [Single Handler with Multiple Matching Contacts](#single-handler-with-multiple-matching-contacts)
      - [Single Handler with Multiple Non-Matching Contacts](#single-handler-with-multiple-non-matching-contacts)
      - [Single Handler with Some Matching Contacts](#single-handler-with-some-matching-contacts)
  - [Multiple Handlers](#multiple-handlers)
      - [Multiple Handlers with a Matching Contact](#multiple-handlers-with-a-matching-contact)
      - [Multiple Handlers with a Single Matching Contact](#multiple-handlers-with-a-single-matching-contact)
      - [Multiple Handlers with a Single Non-Matching Contact](#multiple-handlers-with-a-single-non-matching-contact)
      - [Multiple Handlers with Multiple Matching Contacts](#multiple-handlers-with-multiple-matching-contacts)
      - [Multiple Handlers with Multiple Non-Matching Contacts](#multiple-handlers-with-multiple-non-matching-contacts)
      - [Multiple Handlers With Some Matching Contacts](#multiple-handlers-some-matching-contacts)
- [Wrapping Up](#wrapping-up)
  - [Contact Routing and Sensu Event Pipeline](#contact-routing-and-sensu-event-pipeline)
- [References](#references)
- [Additional Resources](#additional-resources)

# Prerequisites

Before diving into this guide, we recommend having the following components ready:

- A working Sensu Enterprise deployment
- Two or more handlers configured

If you've not already signed up for Sensu Enterprise, you can do so via [this link][1].

In this guide we'll be using [Slack][2] and [Email][3] handlers for our demonstration.

# Overview

Every incident, outage or event has an ideal first responder. This can be either
a team or individual with the knowledge to tirage and address the issue. Sensu
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
have an override configuration for **email** and **slack**. In our example we're having
this contact email _support@sensuapp.com_ instead of the email integration's
default **to** address. For Slack, we're defining the channel the event should
post to, in this case _#support_.

### Check Configuration

Once a contact has been defined, we can now apply which contact(s) to use in a
check configuration. The use case for having it on a check could be that the
client is owned by a particular team or group, the same can be done for specific
checks. For instance:

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

A client configuration can include a contact to use. This is helpful for defining ownership of the client itself.

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

In this section we will be showcasing how contact routing interacts depending on the different possible configurations.

## Global Configuration

For the examples we'll be working with we want to define what our global handlers will be.

In the following section we'll be going over different scenarios and showcasing how contact routing would be used and how contact routing affects notifications being sent. We'll be using Email, Slack and PagerDuty as our example integrations/handlers.

Bellow is the default configuration for the integrations we'll be working with in our examples:

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

For our first configuration we have a single handler **email** and a contact **support** configured. The **support** contact has a configuration override for **email** that will change the default _to_ email address from "default@example.com" to "support@sensuapp.com".

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
  },
  "contacts": {
    "support": {
      "email": {
        "to": "support@sensuapp.com"
      }
    }
  }
}
{{< /highlight >}}

Because the contact configuration matches the handler being used, any event generated for this check will use this contact's configuration.

![Single Handler with Single Matching Contact](/images/contact-routing/single-handler/single-matching-contact.png)

### Single Handler with a Single Non-Matching Contact

This configuration has a single handler **email** a contact **support** configured. The **support** contact does not have a configuration override for **email**.

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
  },
  "contacts": {
    "support": {
      "pagerduty": {
        "service_key": "foobarkey"
      }
    }
  }
}
{{< /highlight >}}

Even though the contact **support** matches in both the **checks** and **contacts**, since there is no configuration under the **support** contact for **email**, no change to the default email configuration is made and the default configuration is used. In our example the email will be sent to "default@example.com".

![Single Handler with Single Non-Matching Contact](/images/contact-routing/single-handler/single-non-matching-contact.png)

### Single Handler with Multiple Matching Contacts

In this configuration we have a single handler, **email**, and multiple contacts, **support** and **dev**, configured. The support and dev contacts have a configuration override for **email** handler to send their emails to "support@sensuapp.io" and "dev@sensuapp.io" respectively.

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
  },
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

In this instance, although we are using only one handler **email**, the handler is ran multiple times to send an email one to "support@sensuapp.io" and one to "dev@sensuapp.io":

![Single Handler with Multiple Matching Contacts](/images/contact-routing/single-handler/multiple-matching-contacts.png)

### Single Handler with Multiple Non-Matching Contacts

For this configuration we have a single handler **email** and multiple contacts, **support** and **dev** configured. The "support" contact has an override configuration for **slack** and the **dev** contact has an override configuration for **pagerduty**, neither of which have an override configuration for **email**.

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
  },
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

In this instance, since the contacts defined do not have an override configuration for **email** the default configuration for **email** will be used, in our example an email will be sent to "default@example.com"

![Single Handler with Multiple Non-Matching Contacts](/images/contact-routing/single-handler/multiple-non-matching-contacts.png)

### Single Handler with Some Matching Contacts

In this configuration we have a single handler **email** and multiple contacts **support**, **dev** and **eng** configured. The **support** contact has an override configuration for **email**, the **dev** contact has an override configuration for **pagerduty** and the **eng** contact has an override configuration for **slack**.

Since two contacts 

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
  },
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

For this instance two emails will be generated. The first email will be sent to **support** contact at "support@sensuapp.io". The second email will be sent to our default email at "default@exmaple.com".

The reason for this is that since we have one or more contacts that do not have a configuration override for **email**, we use the default configuration.

![Single Handler with Some Matching Contacts](/images/contact-routing/single-handler/some-matching-contacts.png)

## Multiple Handlers

### Multiple Handlers with a Matching Contact

This configuration we have two handlers, **email** and **slack**, a contact **support** configured. The **support** contact has a configuration override for **email** that will change the default _to_ email address from "default@example.com" to "support@sensuapp.com" and a configuration override for **slack** to change the _channel_ from "#alerts" to "#support"

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
  },
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

This configuration we have two handlers **email** and **slack** a contact **support** configured. The **support** contact has a configuration override for only **email** that will change the default _to_ email address from "default@example.com" to "support@sensuapp.com". The **support** contact does not have a handler override for the **slack** handler.

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
  },
  "contacts": {
    "support": {
      "email": {
        "to": "support@sensuapp.com"
      }
    }
  }
}
{{< /highlight >}}

Because the contact configuration only has configuration override for the **email** handler, only the **email** handler will be override. The default configuration for **slack** will be used.

![Multiple Handlers with Single Matching Contact](/images/contact-routing/multiple-handlers/single-matching-contact.png)

### Multiple Handlers with a Single Non-Matching Contact

Similar to the previous configuration, we have two handlers, **email** and **slack**, and a contact **support** configured. The **support** contact has a configuration override for **pagerduty** that will change the default _service_key_. The support contact does not have a handler override for the **slack** or **email** handler.

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
  },
  "contacts": {
    "support": {
      "pagerduty": {
        "service_key": "foobarkey"
      }
    }
  }
}
{{< /highlight >}}

Since the contact does not have a configuration override for **email** or **slack** the default configuration for those handlers are used instead.

![Multiple Handlers with Single Non-Matching Contact](/images/contact-routing/multiple-handlers/single-non-matching-contact.png)

### Multiple Handlers with Multiple Matching Contacts

In this example we have two handlers configured for our check, **email** and **slack**. We have two contacts being used, **support** and **dev**, and both contacts have configuration override for both **email** and **slack**.

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
  },
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

Since both contacts match and both contacts have configuration overrides for both handlers, four handler events are generated. Two emails will be sent, one for **support** contact _to_ "support@sensuapp.io" and one to **dev** contact _to_ "dev@sensuapp.io". The same is true for the **slack** handler with the **support** contact creating a message in "#support" slack **channel** and the **dev** contact creating a message in "#dev" slack **channel**.

![Multiple Handlers with Multiple Matching Contacts](/images/contact-routing/multiple-handlers/multiple-matching-contacts.png)

### Multiple Handlers with Multiple Non-Matching Contacts

In this example we have two handlers configured for our check, **email** and **slack**. We have two contacts being used, **support** and **dev**, and both contacts have configuration override for **pagerduty** and do not include any override for **slack** or **email**.

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
  },
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

Since both contacts match and but both contacts do not have configuration overrides for both handlers, two handler events are generated. The default configuration for both handlers will be used

![Multiple Handlers with Multiple Non-Matching Contact](/images/contact-routing/multiple-handlers/multiple-non-matching-contacts.png)

### Multiple Handlers with Some Matching Contacts

In this example we have two handlers configured for our check, **email** and **slack**. We have three contacts being used, **support**, **dev** and **eng**. Support has a contact override for **email** and **dev** has a contact override for **slack**. **eng** has a contact override for **pagerduty** which is not a handler that the check is using.

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
  },
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

With some contacts having at least one single matching contact override we can expect that there will be four different handler events generated.

For **email** handler we will be sending an email to the **support** contact override of "support@sensuapp.io". Since **dev** and **eng** do not have a contact override for **email** a single email will be sent to our default email configured, which in our case is "default@example.com".

For **slack** handler, similar to our email handler, we'll be creating a message for our **dev** contact override to "#dev" _channel_. With **support** and **eng** both not having a contact override for **slack**, an message will be sent to our default **slack** _channel_ configured, in our case "#alerts".


![Multiple Handlers with Some Matching Contact](/images/contact-routing/multiple-handlers/some-matching-contacts.png)

# Wrapping Up

## Contact Routing and Sensu Event Pipeline

When a check is executed and an event is generated, Sensu splits handling
of the event for each handler defined. When multiple handlers are defined, each
handler is managed independently. This means that each handler is processed
independent of any other handler configured.

![Contact Routing and Monitoring Event Pipeline](/images/contact-routing/contact-routing-MEP.png)

Contacts are merged into the check handlers after filters are applied. After merging in the different valid contacts, a handler is executed for each valid contact. If a contact does not have a configuration for a handler, then the default configuration for that handler is used instead.

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