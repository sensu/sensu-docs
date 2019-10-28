---
title: "Authentication API"
description: "The authentication API provides HTTP access to test user credentials. Here’s a reference for the authentication API in Sensu Go, including an example for how to query the authentication API to determine whether credentials are valid. Read on for the full reference."
version: "5.11"
product: "Sensu Go"
menu:
  sensu-go-5.11:
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

The `/auth` API endpoint provides HTTP GET access to create an access token using basic authentication.

#### EXAMPLE {#auth-get-example}

In the following example, querying the `/auth` API with a given username and password returns a 200 OK response, indicating that the credentials are valid, along with an access and a refresh token.

{{< highlight shell >}}
curl -u myusername:mypassword http://127.0.0.1:8080/auth

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
description          | Generates an access token to the API using basic authentication. Access tokens last for around 15 minutes. When your token expires, you should see a 401 Unauthorized response from the API. To generate a new access token, use the [`/auth/token` API endpoint](#authtoken-post).
example url          | http://hostname:8080/api/core/v2/auth
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

The `/auth/test` API endpoint provides HTTP GET access to test user credentials.

#### EXAMPLE {#authtest-get-example}

In the following example, querying the `/auth/test` API with a given username and password returns a 200 OK response, indicating that the credentials are valid.

{{< highlight shell >}}
curl -u myusername:mypassword http://127.0.0.1:8080/auth/test

HTTP/1.1 200 OK
{{< /highlight >}}

#### API Specification {#authtest-get-specification}

/auth/test (GET)     |     |
---------------------|------
description          | Tests a given username and password.
example url          | http://hostname:8080/api/core/v2/auth/test
response codes       | <ul><li>**Valid credentials**: 200 (OK)</li><li> **Invalid credentials**: 401 (Unauthorized)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## The `/auth/token` API endpoint {#the-authtoken-api-endpoint}

### `/auth/token` (POST) {#authtoken-post}

The `/auth/test` API endpoint provides HTTP POST access to renew an access token.

#### EXAMPLE {#authtoken-post-example}

In the following example, an HTTP POST request is submitted to the `/auth/token` API to generate a valid access token. The request includes the refresh token in the request body and returns a successful HTTP 200 OK response along with the new access token.

{{< highlight shell >}}
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
-H 'Content-Type: application/json' \
-d '{"refresh_token": "eyJhbGciOiJIUzI1NiIs..."}' \
http://127.0.0.1:8080/auth/token

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
description          | Generates a new access token using a refresh token and an expired access token
example url          | http://hostname:8080/api/core/v2/auth
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