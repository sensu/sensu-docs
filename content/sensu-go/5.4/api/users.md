---
title: "Users API"
description: "Here’s all you need to know about the users API in Sensu Go, including some handy examples for creating users, accessing user data by username, and updating users. Learn how you can easily customize Sensu Go to match your workflows."
version: "5.4"
product: "Sensu Go"
lastTested: 2018-12-11
menu:
  sensu-go-5.4:
    parent: api
---

- [The `/users` API endpoint](#the-users-api-endpoint)
	- [`/users` (GET)](#users-get)
	- [`/users` (POST)](#users-post)
- [The `/users/:user` API endpoint](#the-usersuser-api-endpoint)
	- [`/users/:user` (GET)](#usersuser-get)
  - [`/users/:user` (PUT)](#usersuser-put)
  - [`/users/:user` (DELETE)](#usersuser-delete)
- [The `/users/:user/password` API endpoint](#the-usersuserpassword-api-endpoint)
  - [`/users/:user/password` (PUT)](#usersuserpassword-put)
- [The `/users/:user/reinstate` API endpoint](#the-usersuserreinstate-api-endpoint)
  - [`/users/:user/reinstate` (PUT)](#usersuserreinstate-put)
- [The `/users/:user/groups` API endpoint](#the-usersusergroups-api-endpoint)
  - [`/users/:user/groups` (DELETE)](#usersusergroups-delete)
- [The `/users/:user/groups/:group` API endpoints](#the-usersusergroupsgroup-api-endpoints)
  - [`/users/:user/groups/:group` (PUT)](#usersusergroupsgroup-put)
  - [`/users/:user/groups/:group` (DELETE)](#usersusergroupsgroup-delete)

## The `/users` API endpoint

### `/users` (GET)

The `/users` API endpoint provides HTTP GET access to [user][1] data.

#### EXAMPLE {#users-get-example}

The following example demonstrates a request to the `/users` API, resulting in
a JSON Array containing [user definitions][1].

{{< highlight shell >}}
curl -H "Authorization: Bearer TOKEN" \
http://127.0.0.1:8080/api/core/v2/users

HTTP/1.1 200 OK
[
  {
    "username": "admin",
    "groups": [
      "cluster-admins"
    ],
    "disabled": false
  },
  {
    "username": "agent",
    "groups": [
      "system:agents"
    ],
    "disabled": false
  }
]
{{< /highlight >}}

#### API Specification {#users-get-specification}

/users (GET)  | 
---------------|------
description    | Returns the list of users.
example url    | http://hostname:8080/api/core/v2/users
pagination     | This endpoint supports pagination using the `limit` and `continue` query parameters. See the [API overview](../overview#pagination) for details.
response type  | Array
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< highlight shell >}}
[
  {
    "username": "admin",
    "groups": [
      "cluster-admins"
    ],
    "disabled": false
  },
  {
    "username": "agent",
    "groups": [
      "system:agents"
    ],
    "disabled": false
  }
]
{{< /highlight >}}

### `/users` (POST)

The `/users` API endpoint provides HTTP POST access to create a [user][1].

#### EXAMPLE {#users-post-example}

The following example demonstrates a POST request to the `/users` API to create the user `alice`, resulting in an HTTP 200 response and the created user definition.

{{< highlight shell >}}
curl -X POST \
-H "Authorization: Bearer TOKEN" \
-H 'Content-Type: application/json' \
-d '{
  "username": "alice",
  "groups": [
    "ops"
  ],
  "password": "temporary",
  "disabled": false
}' \
http://127.0.0.1:8080/api/core/v2/users

HTTP/1.1 200 OK
{
  "username": "alice",
  "groups": [
    "ops"
  ],
  "disabled": false
}
{{< /highlight >}}

#### API Specification {#usersuser-post-specification}

/users (POST) | 
----------------|------
description     | Create a Sensu user.
example URL     | http://hostname:8080/api/core/v2/users
payload         | {{< highlight shell >}}
{
  "username": "alice",
  "groups": [
    "ops"
  ],
  "password": "temporary",
  "disabled": false
}
{{< /highlight >}}
payload parameters | <ul><li>`username` (string, required)</li><li>`password` (string, required): Must have at least eight characters</li><li>`groups` (array): Sets of shared permissions applicable to this user</li><li>`disabled`: When set to `true`, invalidates user credentials and permissions</li></ul>
response codes  | <ul><li>**Success**: 200 (OK)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## The `/users/:user` API endpoint {#the-usersuser-api-endpoint}

### `/users/:user` (GET) {#usersuser-get}

The `/users/:user` API endpoint provides HTTP GET access to [user data][1] for a specific user by `username`.

#### EXAMPLE {#usersuser-get-example}

In the following example, querying the `/users/:user` API returns a JSON Map
containing the requested [`:user` definition][1] (in this example: for the `alice` user).

{{< highlight shell >}}
curl -H "Authorization: Bearer TOKEN" \
http://127.0.0.1:8080/api/core/v2/users/alice

HTTP/1.1 200 OK
{
  "username": "alice",
  "groups": [
    "ops"
  ],
  "disabled": false
}
{{< /highlight >}}

#### API Specification {#usersuser-get-specification}

/users/:user (GET) | 
---------------------|------
description          | Returns a user given the username as a URL parameter.
example url          | http://hostname:8080/api/core/v2/users/alice
response type        | Map
response codes       | <ul><li>**Success**: 200 (OK)</li><li> **Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output               | {{< highlight json >}}
{
  "username": "alice",
  "groups": [
    "ops"
  ],
  "disabled": false
}
{{< /highlight >}}

### `/users/:user` (PUT) {#usersuser-put}

#### EXAMPLE {#users-put-example}

The following example demonstrates a PUT request to the `/users` API to update the user `alice`, in this case to reset their password, resulting in an HTTP 200 response and the updated user definition.

{{< highlight shell >}}
curl -X PUT \
-H "Authorization: Bearer TOKEN" \
-H 'Content-Type: application/json' \
-d '{
  "username": "alice",
  "groups": [
    "ops"
  ],
  "password": "reset-password",
  "disabled": false
}' \
http://127.0.0.1:8080/api/core/v2/users/alice

HTTP/1.1 200 OK
{
  "username": "alice",
  "groups": [
    "ops"
  ],
  "disabled": false
}
{{< /highlight >}}

#### API Specification {#usersuser-put-specification}

/users/:user (PUT) | 
----------------|------
description     | Create or update a Sensu user given the username.
example URL     | http://hostname:8080/api/core/v2/users/alice
payload         | {{< highlight shell >}}
{
  "username": "alice",
  "groups": [
    "ops"
  ],
  "password": "reset-password",
  "disabled": false
}
{{< /highlight >}}
response codes  | <ul><li>**Success**: 200 (OK)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

### `/users/:user` (DELETE) {#usersuser-delete}

#### EXAMPLE {#usersuser-delete-example}

In the following example, an HTTP DELETE request is submitted to the `/users/:user` API to disable the user `alice`, resulting in a successful 204 (No Content) HTTP response code.

{{< highlight shell >}}
curl -X DELETE \
-H "Authorization: Bearer TOKEN" \
http://127.0.0.1:8080/api/core/v2/users/alice

HTTP/1.1 204 No Content
{{< /highlight >}}

#### API Specification {#usersuser-delete-specification}

/users/:user (DELETE) | 
--------------------------|------
description               | Disables a user given the username as a URL parameter.
example url               | http://hostname:8080/api/core/v2/users/alice
response codes            | <ul><li>**Success**: 204 (No Content)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## The `/users/:user/password` API endpoint {#the-usersuserpassword-api-endpoint}

### `/users/:user/password` (PUT) {#usersuserpassword-put}

The `/users/:user/password` API endpoint provides HTTP PUT access to update a user's password.

#### EXAMPLE {#usersuserpassword-put-example}

In the following example, an HTTP PUT request is submitted to the `/users/:user/password` API to update the password for the user `alice`, resulting in a 200 (OK) HTTP response code.

{{< highlight shell >}}
curl -X PUT \
-H "Authorization: Bearer TOKEN" \
-H 'Content-Type: application/json' \
-d '{
  "username": "alice",
  "password": "newpassword"
}' \
http://127.0.0.1:8080/api/core/v2/users/alice/password

HTTP/1.1 200 OK
{{< /highlight >}}

#### API Specification {#usersuserpassword-put-specification}

/users/:user/password (PUT) | 
----------------|------
description     | Update the password for a Sensu user.
example URL     | http://hostname:8080/api/core/v2/users/alice/password
payload         | {{< highlight shell >}}
{
  "username": "admin",
  "password": "newpassword"
}
{{< /highlight >}}
payload parameters | <ul><li>`username` (string, required): the `username` for the Sensu user</li><li>`password` (string, required): the user's new password</li></ul>
response codes  | <ul><li>**Success**: 200 (OK)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## The `/users/:user/reinstate` API endpoint {#the-usersuserreinstate-api-endpoint}

### `/users/:user/reinstate` (PUT) {#usersuserreinstate-put}

The `/users/:user/reinstate` API endpoint provides HTTP PUT access to re-enable a disabled user.

#### EXAMPLE {#usersuserreinstate-put-example}

In the following example, an HTTP PUT request is submitted to the `/users/:user/reinstate` API to enable the disabled user `alice`, resulting in a 200 (OK) HTTP response code.

{{< highlight shell >}}
curl -X PUT \
-H "Authorization: Bearer TOKEN" \
-H 'Content-Type: application/json' \
http://127.0.0.1:8080/api/core/v2/users/alice/reinstate

HTTP/1.1 200 OK
{{< /highlight >}}

#### API Specification {#usersuserreinstate-put-specification}

/users/:user/reinstate (PUT) | 
----------------|------
description     | Reinstate a disabled user.
example URL     | http://hostname:8080/api/core/v2/users/alice/reinstate
response codes  | <ul><li>**Success**: 200 (OK)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## The `/users/:user/groups` API endpoint {#the-usersusergroups-api-endpoint}

### `/users/:user/groups` (DELETE) {#usersusergroups-delete}

The `/users/:user/groups` API endpoint provides HTTP DELETE access to remove a user from all groups.

#### EXAMPLE {#usersusergroups-delete-example}

In the following example, an HTTP DELETE request is submitted to the `/users/:user/groups` API to remove the user `alice` from all groups within Sensu, resulting in a successful 204 (No Content) HTTP response code.

{{< highlight shell >}}
curl -X DELETE \
-H "Authorization: Bearer TOKEN" \
http://127.0.0.1:8080/api/core/v2/users/alice/groups

HTTP/1.1 204 No Content
{{< /highlight >}}

#### API Specification {#usersusergroups-delete-specification}

/users/:user/groups (DELETE) | 
--------------------------|------
description               | Removes a user from all groups.
example url               | http://hostname:8080/api/core/v2/users/alice/groups
response codes            | <ul><li>**Success**: 204 (No Content)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## The `/users/:user/groups/:group` API endpoints {#the-usersusergroupsgroup-api-endpoints}

### `/users/:user/groups/:group` (PUT) {#usersusergroupsgroup-put}

The `/users/:user/groups/:group` API endpoint provides HTTP PUT access to assign a user to a group.

#### EXAMPLE {#usersusergroupsgroup-put-example}

In the following example, an HTTP PUT request is submitted to the `/users/:user/groups/:group` API to add the user `alice` to the group `ops`, resulting in a successful 204 (No Content) HTTP response code.

{{< highlight shell >}}
curl -X PUT \
-H "Authorization: Bearer TOKEN" \
http://127.0.0.1:8080/api/core/v2/users/alice/groups/ops

HTTP/1.1 204 No Content
{{< /highlight >}}

#### API Specification {#usersusergroupsgroup-put-specification}

/users/:user/groups/:group (PUT) | 
----------------|------
description     | Add a user to a group.
example URL     | http://hostname:8080/api/core/v2/users/alice/groups/ops
payload         | {{< highlight shell >}}

{{< /highlight >}}
response codes  | <ul><li>**Success**: 204 (No Content)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

### `/users/:user/groups/:group` (DELETE) {#usersusergroupsgroup-delete}

The `/users/:user/groups/:group` API endpoint provides HTTP DELETE access to remove a user from a group.

#### EXAMPLE {#usersusergroupsgroup-delete-example}

In the following example, an HTTP DELETE request is submitted to the `/users/:user/groups/:group` API to remove the user `alice` from the group `ops`, resulting in a successful 204 (No Content) HTTP response code.

{{< highlight shell >}}
curl -X DELETE \
-H "Authorization: Bearer TOKEN" \
http://127.0.0.1:8080/api/core/v2/users/alice/groups/ops

HTTP/1.1 204 No Content
{{< /highlight >}}

#### API Specification {#usersusergroupsgroup-delete-specification}

/users/:user/groups/:group (DELETE) | 
--------------------------|------
description               | Removes a user from a group.
example url               | http://hostname:8080/api/core/v2/users/alice/groups/ops
response codes            | <ul><li>**Success**: 204 (No Content)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

[1]: ../../reference/rbac#user-specification
