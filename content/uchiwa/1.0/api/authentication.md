---
title: Authentication
weight: 40
product: "Uchiwa"
version: "1.0"
menu:
  uchiwa-1.0:
    parent: api
---

In order to use the Uchiwa API when authentication is enabled, you must provide
an access token with every request.

Remember to keep your access tokens secret and use HTTPS wherever possible.

## Configuring an access token

1. Set the *accessToken* attribute in the appropriate role; see the
[documentation][1].
2. Restart Uchiwa to apply this change.

## Providing the access token
**In a header**

{{< highlight shell >}}
curl -H "Authorization: token TOKEN" https://localhost:3000/events{{< /highlight >}}

**As a parameter**

{{< highlight shell >}}
curl https://localhost:3000/events?token=TOKEN{{< /highlight >}}

[1]: ../../getting-started/configuration/#multiple-users