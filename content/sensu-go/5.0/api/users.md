---
title: "Users API"
description: "Sensu Go users API reference documentation"
version: "5.0"
product: "Sensu Go"
menu:
  sensu-go-5.0:
    parent: api
---

- [The `/users` API endpoint](#the-users-api-endpoint)
	- [`/users` (GET)](#users-get)
	- [`/users` (POST)](#users-post)
- [The `/users/:user` API endpoint](#the-usersuser-api-endpoint)
	- [`/users/:user` (GET)](#usersuser-get)
  - [`/users/:user` (PUT)](#usersuser-put)
  - [`/users/:user` (DELETE)](#usersuser-delete)

## The `/users` API endpoint

### `/users` (GET)

The `/users` API endpoint provides HTTP GET access to [user][1] data.

#### EXAMPLE {#users-get-example}

The following example demonstrates a request to the `/users` API, resulting in
a JSON Array containing [user definitions][1].

{{< highlight shell >}}
curl -s http://127.0.0.1:8080/api/core/v2/users -H "Authorization: Bearer TOKEN"
[
  {
    "username": "alice",
    "groups": [
      "ops"
    ],
    "password": "****",
    "disabled": false
  },
  {
    "username": "bob",
    "groups": [
      "dev"
    ],
    "password": "****",
    "disabled": false
  }
]
{{< /highlight >}}

#### API Specification {#users-get-specification}

/users (GET)  | 
---------------|------
description    | Returns the list of users.
example url    | http://hostname:8080/api/core/v2/users
response type  | Array
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< highlight shell >}}
[
  {
    "username": "alice",
    "groups": [
      "ops"
    ],
    "password": "****",
    "disabled": false
  },
  {
    "username": "bob",
    "groups": [
      "dev"
    ],
    "password": "****",
    "disabled": false
  }
]
{{< /highlight >}}

### `/users` (POST)

/users (POST) | 
----------------|------
description     | Create a Sensu user.
example URL     | http://hostname:8080/api/core/v2/users/default/users
payload         | {{< highlight shell >}}
{
  "username": "alice",
  "groups": [
    "ops"
  ],
  "password": "****",
  "disabled": false
}
{{< /highlight >}}
response codes  | <ul><li>**Success**: 200 (OK)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## The `/users/:user` API endpoint {#the-usersuser-api-endpoint}

### `/users/:user` (GET) {#usersuser-get}

The `/users/:user` API endpoint provides HTTP GET access to [user data][1] for specific `:user` definitions, by user `name`.

#### EXAMPLE {#usersuser-get-example}

In the following example, querying the `/users/:user` API returns a JSON Map
containing the requested [`:user` definition][1] (in this example: for the `:user` named
`alice`).

{{< highlight shell >}}
curl -s http://127.0.0.1:8080/api/core/v2/users/alice -H "Authorization: Bearer TOKEN"
{
  "username": "alice",
  "groups": [
    "ops"
  ],
  "password": "****",
  "disabled": false
}
{{< /highlight >}}

#### API Specification {#usersuser-get-specification}

/users/:user (GET) | 
---------------------|------
description          | Returns a user.
example url          | http://hostname:8080/api/core/v2/users/alice
response type        | Map
response codes       | <ul><li>**Success**: 200 (OK)</li><li> **Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output               | {{< highlight json >}}
{
  "username": "alice",
  "groups": [
    "ops"
  ],
  "password": "****",
  "disabled": false
}
{{< /highlight >}}

### `/users/:user` (PUT) {#usersuser-put}

#### API Specification {#usersuser-put-specification}

/users/:user (PUT) | 
----------------|------
description     | Create or update a Sensu user given the username.
example URL     | http://hostname:8080/api/core/v2/namespaces/default/users/alice
payload         | {{< highlight shell >}}
{
  "username": "alice",
  "groups": [
    "ops"
  ],
  "password": "****",
  "disabled": false
}
{{< /highlight >}}
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

### `/users/:user` (DELETE) {#usersuser-delete}

#### API Specification {#usersuser-delete-specification}

/users/:user (DELETE) | 
--------------------------|------
description               | Disables a user given the username.
example url               | http://hostname:8080/api/core/v2/namespaces/default/users/alice
response codes            | <ul><li>**Success**: 202 (Accepted)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

[1]: ../../reference/rbac

