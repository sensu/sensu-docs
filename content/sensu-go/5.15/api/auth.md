---
title: "Authentication API"
description: "The Sensu authentication API provides HTTP access to test whether user credentials are valid and use these credentials to obtain access tokens. Read on for the full reference."
version: "5.15"
product: "Sensu Go"
menu:
  sensu-go-5.15:
    parent: api
---

- [The `/auth` API endpoint](#the-auth-api-endpoint)
  - [`/auth` (GET)](#auth-get)
- [The `/auth/test` API endpoint](#the-authtest-api-endpoint)
  - [`/auth/test` (GET)](#authtest-get)
- [The `/auth/token` API endpoint](#the-authtoken-api-endpoint)
  - [`/auth/token` (POST)](#authtoken-post)

## The `/auth` API endpoint {#the-auth-api-endpoint}

### `/auth` (GET) {#auth-get}

The `/auth` API endpoint provides HTTP GET access to generate an access token and a refresh token using Sensu's basic authentication.

#### EXAMPLE {#auth-get-example}

In the following example, querying the `/auth` API endpoint with a given username and password returns an HTTP `200 OK` response to indicate that the credentials are valid, along with an access token and a refresh token.

{{< highlight shell >}}
curl -X GET \
http://127.0.0.1:8080/auth \
-u myusername:mypassword

HTTP/1.1 200 OK
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "expires_at": 1544582187,
  "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
}
{{< /highlight >}}

#### API Specification {#auth-get-specification}

/auth (GET)          |     |
---------------------|------
description          | Generates an access and a refresh token used for accessing the API using Sensu's basic authentication. Access tokens last for approximately 15 minutes. When your token expires, you should see a `401 Unauthorized` response from the API. To generate a new access token, use the [`/auth/token` API endpoint](#authtoken-post).
example url          | http://hostname:8080/auth
output               | {{< highlight json >}}
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "expires_at": 1544582187,
  "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
}
{{< /highlight >}}
response codes       | <ul><li>**Valid credentials**: 200 (OK)</li><li> **Invalid credentials**: 401 (Unauthorized)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## The `/auth/test` API endpoint {#the-authtest-api-endpoint}

### `/auth/test` (GET) {#authtest-get}

The `/auth/test` API endpoint provides HTTP GET access to test basic authentication user credentials that were created with Sensu's built-in [basic authentication][1].

_**NOTE**: The `/auth/test` endpoint only tests user credentials created with Sensu's built-in [basic authentication provider][1]. It does not test user credentials defined via an authentication provider like [Lightweight Directory Access Protocol (LDAP)][2] or [Active Directory (AD)][3]._

#### EXAMPLE {#authtest-get-example}

In the following example, querying the `/auth/test` API endpoint with a given username and password returns an HTTP `200 OK` response, indicating that the credentials are valid.

{{< highlight shell >}}
curl -X GET \
http://127.0.0.1:8080/auth/test \
-u myusername:mypassword

HTTP/1.1 200 OK
{{< /highlight >}}

#### API Specification {#authtest-get-specification}

/auth/test (GET)     |     |
---------------------|------
description          | Tests basic authentication credentials (username and password) that were created with Sensu's [users API][1].
example url          | http://hostname:8080/auth/test
response codes       | <ul><li>**Valid credentials**: 200 (OK)</li><li> **Invalid credentials**: 401 (Unauthorized)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## The `/auth/token` API endpoint {#the-authtoken-api-endpoint}

### `/auth/token` (POST) {#authtoken-post}

The `/auth/token` API endpoint provides HTTP POST access to renew an access token.

#### EXAMPLE {#authtoken-post-example}

In the following example, an HTTP POST request is submitted to the `/auth/token` API endpoint to generate a valid access token.
The request includes the refresh token in the request body and returns a successful HTTP `200 OK` response along with the new access token.

{{< highlight shell >}}
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
{{< /highlight >}}

#### API Specification {#authtoken-post-specification}

/auth/token (POST)   |     |
---------------------|------
description          | Generates a new access token using a refresh token and an expired access token.
example url          | http://hostname:8080/auth/token
example payload | {{< highlight shell >}}
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
}
{{< /highlight >}}
output               | {{< highlight json >}}
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "expires_at": 1544582187,
  "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
}
{{< /highlight >}}
response codes  | <ul><li>**Success**: 200 (OK)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

[1]: ../../installation/auth#use-built-in-basic-authentication
[2]: ../../installation/auth#ldap-authentication
[3]: ../../installation/auth/#ad-authentication
