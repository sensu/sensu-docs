---
title: "Using the Email Integration with G Suite"
linkTitle: "Email with Gsuite"
product: "Sensu Enterprise"
version: "3.2"
weight: 1
menu:
 sensu-enterprise-3.2:
   parent: guides
---

In this guide, we'll walk through how to configure the Sensu Enterprise email integration to use G Suite as the SMTP gateway for sending email alerts.

Before we configure Sensu to use the gateway, we'll have to first set up a user and app password in G Suite to use in our email integration configuration.

## Set Up User and App Password

The first step to using G Suite as our SMTP relay for Sensu is to set up a user and an app password. We generally recommend adding a Sensu user to be used specifically with our deployment. If this isn't possible, we can use any G Suite user account.

Once we have an account that will be used for sending email via Sensu, we'll then need to [create an app password][1]. When we generate the password, we need to ensure that we label it with "Sensu" so that we'll know what the app password is being used for.

After we have our user and app password created, we can then move on to configuring the integration.

## Email Integration Configuration

Now that we have the credentials we need to send email via G Suite, we'll need to review [G Suite's SMTP settings][2].

In the case of this guide, we'll use the following as our settings:

SMTP address: smtp-relay.gmail.com
Port: 587

Let's take a look at what the full configuration looks like:

{{< highlight text >}}
/etc/sensu/conf.d/handlers/email.json

{
  "email": {
    "smtp": {
      "address": "smtp-relay.gmail.com",
      "port": 587,
      "openssl_verify_mode": "none",
      "enable_starttls_auto": true,
      "authentication": "plain",
      "user_name": "sensu@mydomain.com",
      "password": "xxxxxxxxxxxxxxxx"
    },
    "to": "ops-team@mydomain.com",
    "from": "sensu@mydomain.com"
    }
  }
{{< /highlight >}}

Once we've written that configuration to disk, we'll need to reload the Sensu Enterprise process via `systemctl reload sensu-enterprise` to pick up the configuration.

Let's test our configuration quickly to ensure that it's working. We can use the local client socket to generate an ad-hoc check:

{{< highlight shell >}}echo '{"name": "testing_error", "status": 2, "output": "An error event should be created", "handlers": [ "email"]}' > /dev/tcp/localhost/3030
{{< /highlight >}}

We should then receive an email at the "ops-team" address specified in our example above. Congrats! You've set up Sensu to email using G Suite!

Hopefully you’ve found this useful! If you find any issues or have any questions, feel free to reach out in our [Community Slack][3], or [open an issue][4] on Github.

<!-- LINKS -->

[1]: https://support.google.com/accounts/answer/185833?hl=en
[2]: https://support.google.com/a/answer/176600?hl=en
[3]: https://slack.sensu.io
[4]: https://github.com/sensu/sensu-docs/issues/new
