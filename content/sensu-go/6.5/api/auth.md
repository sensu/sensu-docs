---
title: "/auth"
description: "The Sensu authentication API provides HTTP access to test whether user credentials are valid and use these credentials to obtain access tokens. Read on for the full reference."
otherendpoints_title: "/auth"
type: "other_endpoints"
version: "6.5"
product: "Sensu Go"
weight: 20
menu:
  sensu-go-6.5:
    parent: api
---

## Generate an access token and a refresh token {#auth-get}

The `/auth` API endpoint provides HTTP GET access to generate an access token and a refresh token using Sensu's basic authentication.

The access and refresh tokens are [JSON Web Tokens (JWTs)][2] that Sensu issues to record the details of users' authenticated Sensu sessions.
The backend digitally signs these tokens, and the tokens can't be changed without invalidating the signature.

### Example {#auth-get-example}

In the following example, querying the `/auth` API endpoint with a given username and password returns an HTTP `200 OK` response to indicate that the credentials are valid, along with an access token and a refresh token.

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8080/auth \
-u myusername:mypassword

HTTP/1.1 200 OK
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "expires_at": 1544582187,
  "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
}
{{< /code >}}

### API Specification {#auth-get-specification}

/auth (GET)          |     |
---------------------|------
description          | Generates an access and a refresh token used for accessing the API using Sensu's basic authentication. Access tokens last for approximately 15 minutes. When your token expires, you should see a `401 Unauthorized` response from the API. To generate a new access token, use the [`/auth/token` API endpoint](#authtoken-post).
example url          | http://hostname:8080/auth
output               | {{< code json >}}
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "expires_at": 1544582187,
  "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
}
{{< /code >}}
response codes       | <ul><li>**Valid credentials**: 200 (OK)</li><li> **Invalid credentials**: 401 (Unauthorized)</li><li>**Error**: 500 (Internal Server Error)</li></ul>


[1]: ../../operations/control-access#use-built-in-basic-authentication
[2]: https://tools.ietf.org/html/rfc7519
