---
title: "/auth/test"
description: "The Sensu authentication API provides HTTP access to test whether user credentials are valid and use these credentials to obtain access tokens. Read on for the full reference."
otherendpoints_title: "/auth/test"
type: "other_endpoints"
version: "6.5"
product: "Sensu Go"
weight: 30
menu:
  sensu-go-6.5:
    parent: api
---

## Test basic auth user credentials {#authtest-get}

The `/auth/test` API endpoint provides HTTP GET access to test basic authentication user credentials that were created with Sensu's built-in [basic authentication][1].

{{% notice note %}}
**NOTE**: The `/auth/test` endpoint only tests user credentials created with Sensu's built-in [basic authentication provider](../../operations/control-access#use-built-in-basic-authentication).
It does not test user credentials defined via an authentication provider like [Lightweight Directory Access Protocol (LDAP)](../../operations/control-access/ldap-auth), [Active Directory (AD)](../../operations/control-access/ad-auth/), or [OpenID Connect 1.0 protocol (OIDC)](../../operations/control-access/oidc-auth/).
{{% /notice %}}
 
### Example {#authtest-get-example}

In the following example, querying the `/auth/test` API endpoint with a given username and password returns an HTTP `200 OK` response, indicating that the credentials are valid.

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8080/auth/test \
-u myusername:mypassword

HTTP/1.1 200 OK
{{< /code >}}

### API Specification {#authtest-get-specification}

/auth/test (GET)     |     |
---------------------|------
description          | Tests basic authentication credentials (username and password) that were created with Sensu's [users API][1].
example url          | http://hostname:8080/auth/test
response codes       | <ul><li>**Valid credentials**: 200 (OK)</li><li> **Invalid credentials**: 401 (Unauthorized)</li><li>**Error**: 500 (Internal Server Error)</li></ul>


[1]: ../../operations/control-access#use-built-in-basic-authentication
[2]: https://tools.ietf.org/html/rfc7519
