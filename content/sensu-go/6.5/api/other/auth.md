---
title: "/auth"
description: "Read this API documentation for information about Sensu /auth API endpoints, with examples for retrieving authentication credentials and testing their validity."
other_api_title: "/auth"
type: "other_api"
version: "6.5"
product: "Sensu Go"
menu:
  sensu-go-6.5:
    parent: other
---

## Generate an access token and a refresh token {#auth-get}

The `/auth` API endpoint provides HTTP GET access to generate an access token and a refresh token using Sensu's basic authentication.

The access and refresh tokens are [JSON Web Tokens (JWTs)][2] that Sensu issues to record the details of users' authenticated Sensu sessions.
The backend digitally signs these tokens, and the tokens can't be changed without invalidating the signature.

### Example {#auth-get-example}

The following example queries the `/auth` API endpoint with a given username and password to determine whether the credentials are valid and retrieve an access token and a refresh token:

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8080/auth \
-u myusername:mypassword
{{< /code >}}

The request results in a successful `HTTP/1.1 200 OK` response to indicate that the credentials are valid, along with an access token and a refresh token:

{{< code text >}}
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "expires_at": 1544582187,
  "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
}
{{< /code >}}

### API Specification {#auth-get-specification}

/auth (GET)          |     |
---------------------|------
description          | Generates an access and a refresh token used for accessing the API using Sensu's basic authentication. Access tokens last for approximately 15 minutes. When your token expires, you should receive a `401 Unauthorized` response from the API. To generate a new access token, use the [`/auth/token` API endpoint](#authtoken-post).
example url          | http://hostname:8080/auth
output               | {{< code text >}}
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
**NOTE**: The `/auth/test` endpoint only tests user credentials created with Sensu's built-in [basic authentication](../../../operations/control-access#use-built-in-basic-authentication).
It does not test user credentials defined via an authentication provider like [Lightweight Directory Access Protocol (LDAP)](../../../operations/control-access/ldap-auth), [Active Directory (AD)](../../../operations/control-access/ad-auth/), or [OpenID Connect 1.0 protocol (OIDC)](../../../operations/control-access/oidc-auth/).
{{% /notice %}}
 
### Example {#authtest-get-example}

In the following example, querying the `/auth/test` API endpoint with a given username and password should return an `HTTP/1.1 200 OK` response, indicating that the credentials are valid:

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8080/auth/test \
-u myusername:mypassword
{{< /code >}}

### API Specification {#authtest-get-specification}

/auth/test (GET)     |     |
---------------------|------
description          | Tests basic authentication credentials (username and password) that were created with Sensu's [core/v2/users API][1].
example url          | http://hostname:8080/auth/test
response codes       | <ul><li>**Valid credentials**: 200 (OK)</li><li> **Invalid credentials**: 401 (Unauthorized)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Renew an access token {#authtoken-post}

The `/auth/token` API endpoint provides HTTP POST access to renew an access token.

### Example {#authtoken-post-example}

In the following example, an HTTP POST request is submitted to the `/auth/token` API endpoint to generate a valid access token.
The request includes the refresh token in the request body.

{{< code shell >}}
curl -X POST \
http://127.0.0.1:8080/auth/token \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
-H 'Content-Type: application/json' \
-d '{"refresh_token": "eyJhbGciOiJIUzI1NiIs..."}'
{{< /code >}}

The request results in a successful `HTTP/1.1 200 OK` response, along with the new access token:

{{< code text >}}
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "expires_at": 1544582187,
  "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
}
{{< /code >}}

The access and refresh tokens are [JSON Web Tokens (JWTs)][2] that Sensu issues to record the details of users' authenticated Sensu sessions.
The backend digitally signs these tokens, and the tokens can't be changed without invalidating the signature.

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
output               | {{< code text >}}
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "expires_at": 1544582187,
  "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
}
{{< /code >}}
response codes  | <ul><li>**Success**: 200 (OK)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>


[1]: ../../../operations/control-access#use-built-in-basic-authentication
[2]: https://tools.ietf.org/html/rfc7519
