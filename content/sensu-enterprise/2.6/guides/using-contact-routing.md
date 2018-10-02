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

In this guide we'll cover configuring and using Sensu Enterprise Contact Routing for routing events to different contacts and services.

- [Prerequisites](#prerequisites)
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

In this guide we'll be using [Slack][2] and [Email][3] handlers for our demostration

## Contact Routing Basics

In Sensu Enterprise Contact Routing, contacts are composed of a name and configuration overrides for one or more of Sensu Enterprise's built-in integrations or handler configurations. A contact in Sensu Enterprise is not too dissimilar from a contact on your phone, which usually have a name and one or more _identifiers_ for various communication **channels** (e.g. a **phone** _number_, **email** _address_, **Twitter** _username_, etc).

### Contact Configuration

Configuring a contact requires you to define the name of the contact and the services plus configuration override for that contact.

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

In the example above we have a contact named **support**. For **support** we have an override configuration for email and slack. In our usecase we're having this contact email _support@sensuapp.com_ instead of the email intergration's default **to** address. For Slack, we're defining the channel the event should post to, in this case _#support_.

### Check Configuration

Once a contact has been defined, we can now apply which contact to use in a check configuration. The use case for having it on a check could be that the client is owned by a particular team or group, the same can be done for specific checks. For instance 

### Client Configuration

# Example Implementaiton
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

