---
title: "/auth/token"
description: "The Sensu authentication API provides HTTP access to test whether user credentials are valid and use these credentials to obtain access tokens. Read on for the full reference."
otherendpoints_title: "/auth/token"
type: "other_endpoints"
version: "6.5"
product: "Sensu Go"
menu:
  sensu-go-6.5:
    parent: endpoints
---

## Renew an access token {#authtoken-post}

The `/auth/token` API endpoint provides HTTP POST access to renew an access token.

### Example {#authtoken-post-example}

In the following example, an HTTP POST request is submitted to the `/auth/token` API endpoint to generate a valid access token.
The request includes the refresh token in the request body and returns a successful HTTP `200 OK` response along with the new access token.

The access and refresh tokens are [JSON Web Tokens (JWTs)][2] that Sensu issues to record the details of users' authenticated Sensu sessions.
The backend digitally signs these tokens, and the tokens can't be changed without invalidating the signature.

{{< code shell >}}
curl -X POST \
http://127.0.0.1:8080/auth/token \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
-H 'Content-Type: application/json' \
-d '{"refresh_token": "eyJhbGciOiJIUzI1NiIs..."}'

HTTP/1.1 200 OK
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "expires_at": 1544582187,
  "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
}
{{< /code >}}

### API Specification {#authtoken-post-specification}

/auth/token (POST)   |     |
---------------------|------
description          | Generates a new access token using a refresh token and an expired access token.
example url          | http://hostname:8080/auth/token
example payload | {{< code shell >}}
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
}
{{< /code >}}
output               | {{< code json >}}
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "expires_at": 1544582187,
  "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
}
{{< /code >}}
response codes  | <ul><li>**Success**: 200 (OK)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

[1]: ../../operations/control-access#use-built-in-basic-authentication
[2]: https://tools.ietf.org/html/rfc7519
