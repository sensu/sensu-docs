---
title: "Authentication API"
description: "The authentication API provides HTTP access to test user credentials. Here’s a reference for the authentication API in Sensu Go, including an example for how to query the authentication API to determine whether credentials are valid. Read on for the full reference."
version: "5.4"
product: "Sensu Go"
menu:
  sensu-go-5.4:
    parent: api
---

- [The `/auth/test` API endpoint](#the-authtest-api-endpoint)
  - [`/auth/test` (GET)](#authtest-get)

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
