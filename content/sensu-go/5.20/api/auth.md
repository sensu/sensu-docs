---
title: "Authentication API"
description: "The Sensu authentication API provides HTTP access to test whether user credentials are valid and use these credentials to obtain access tokens. Read on for the full reference."
version: "5.20"
product: "Sensu Go"
menu:
  sensu-go-5.20:
    parent: api
---

## Generate an access token and a refresh token {#auth-get}

The `/auth` API endpoint provides HTTP GET access to generate an access token and a refresh token using Sensu's basic authentication.

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

## Test basic auth user credentials {#authtest-get}

The `/auth/test` API endpoint provides HTTP GET access to test basic authentication user credentials that were created with Sensu's built-in [basic authentication][1].

{{% notice note %}}
**NOTE**: The `/auth/test` endpoint only tests user credentials created with Sensu's built-in [basic authentication provider](../../operations/control-access#use-built-in-basic-authentication). It does not test user credentials defined via an authentication provider like [Lightweight Directory Access Protocol (LDAP)](../../operations/control-access/ldap-auth), [Active Directory (AD)](../../operations/control-access/ad-auth/), or [OpenID Connect 1.0 protocol (OIDC)](../../operations/control-access/oidc-auth/).
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

## Renew an access token {#authtoken-post}

The `/auth/token` API endpoint provides HTTP POST access to renew an access token.

### Example {#authtoken-post-example}

In the following example, an HTTP POST request is submitted to the `/auth/token` API endpoint to generate a valid access token.
The request includes the refresh token in the request body and returns a successful HTTP `200 OK` response along with the new access token.

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
