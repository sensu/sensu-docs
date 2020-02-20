---
title: "Users API"
description: "This reference describes the Sensu users API, including some handy examples for how to create users, access user data by username, and update users. Learn how the users API can help you customize Sensu Go to match your workflows."
version: "5.16"
product: "Sensu Go"
lastTested: 2018-12-11
menu:
  sensu-go-5.16:
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

_**NOTE**: The users API allows you to create and manage user credentials with Sensu's built-in [basic authentication provider][6]. To configure user credentials with an external provider like [Lightweight Directory Access Protocol (LDAP)][4] or [Active Directory (AD)][5], use Sensu's [authentication providers API][3]._

## The `/users` API endpoint

### `/users` (GET)

The `/users` API endpoint provides HTTP GET access to [user][1] data.

#### EXAMPLE {#users-get-example}

The following example demonstrates a request to the `/users` API, resulting in a JSON array that contains [user definitions][1].

{{< highlight shell >}}
curl -X GET \
http://127.0.0.1:8080/api/core/v2/users \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN"

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
pagination     | This endpoint supports [pagination][2] using the `limit` and `continue` query parameters.
response filtering | This endpoint supports [API response filtering][8].
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

The `/users` API endpoint provides HTTP POST access to create a [user][1] using Sensu's basic authentication provider.

#### EXAMPLE {#users-post-example}

The following example demonstrates a POST request to the `/users` API endpoint to create the user `alice`, resulting in an HTTP `201 Created` response and the created user definition.

{{< highlight shell >}}
curl -X POST \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN" \
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

HTTP/1.1 201 Created
{{< /highlight >}}

#### API Specification {#usersuser-post-specification}

/users (POST) | 
----------------|------
description     | Creates a Sensu user.
example URL     | http://hostname:8080/api/core/v2/users
payload parameters | Required: `username` (string), `groups` (array; sets of shared permissions that apply to this user), `password` (string; at least eight characters), and `disabled` (when set to `true`, invalidates user credentials and permissions).
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
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## The `/users/:user` API endpoint {#the-usersuser-api-endpoint}

### `/users/:user` (GET) {#usersuser-get}

The `/users/:user` API endpoint provides HTTP GET access to [user data][1] for a specific user by `username`.

#### EXAMPLE {#usersuser-get-example}

In the following example, querying the `/users/:user` API returns a JSON map that contains the requested [`:user` definition][1] (in this example, for the `alice` user).

{{< highlight shell >}}
curl -X GET \
http://127.0.0.1:8080/api/core/v2/users/alice \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN"

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
description          | Returns the specified user.
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

The `/users/:user` API endpoint provides HTTP PUT access to create or update [user data][1] for a specific user by `username`.

#### EXAMPLE {#users-put-example}

The following example demonstrates a PUT request to the `/users` API endpoint to update the user `alice` (in this case, to reset the user's password), resulting in an HTTP `201 Created` response and the updated user definition.

{{< highlight shell >}}
curl -X PUT \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN" \
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

HTTP/1.1 201 Created
{{< /highlight >}}

#### API Specification {#usersuser-put-specification}

/users/:user (PUT) | 
----------------|------
description     | Creates or updates user data for the specified Sensu user.
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
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

### `/users/:user` (DELETE) {#usersuser-delete}

The `/users/:user` API endpoint provides HTTP DELETE access to disable a specific user by `username`.

#### EXAMPLE {#usersuser-delete-example}

In the following example, an HTTP DELETE request is submitted to the `/users/:user` API endpoint to disable the user `alice`, resulting in a successful HTTP `204 No Content` response.

{{< highlight shell >}}
curl -X DELETE \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN" \
http://127.0.0.1:8080/api/core/v2/users/alice

HTTP/1.1 204 No Content
{{< /highlight >}}

_**NOTE**: This endpoint **disables** but does not delete the user. You can [reinstate][7] disabled users._

#### API Specification {#usersuser-delete-specification}

/users/:user (DELETE) | 
--------------------------|------
description               | Disables the specified user.
example url               | http://hostname:8080/api/core/v2/users/alice
response codes            | <ul><li>**Success**: 204 (No Content)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## The `/users/:user/password` API endpoint {#the-usersuserpassword-api-endpoint}

### `/users/:user/password` (PUT) {#usersuserpassword-put}

The `/users/:user/password` API endpoint provides HTTP PUT access to update a user's password.

#### EXAMPLE {#usersuserpassword-put-example}

In the following example, an HTTP PUT request is submitted to the `/users/:user/password` API endpoint to update the password for the user `alice`, resulting in an HTTP `201 Created` response.

{{< highlight shell >}}
curl -X PUT \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN" \
-H 'Content-Type: application/json' \
-d '{
  "username": "alice",
  "password": "newpassword"
}' \
http://127.0.0.1:8080/api/core/v2/users/alice/password

HTTP/1.1 201 Created
{{< /highlight >}}

#### API Specification {#usersuserpassword-put-specification}

/users/:user/password (PUT) | 
----------------|------
description     | Updates the password for the specified Sensu user.
example URL     | http://hostname:8080/api/core/v2/users/alice/password
payload parameters | Required: `username` (string; the `username` for the Sensu user) and `password` (string; the user's new password).
payload         | {{< highlight shell >}}
{
  "username": "admin",
  "password": "newpassword"
}
{{< /highlight >}}
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## The `/users/:user/reinstate` API endpoint {#the-usersuserreinstate-api-endpoint}

### `/users/:user/reinstate` (PUT) {#usersuserreinstate-put}

The `/users/:user/reinstate` API endpoint provides HTTP PUT access to reinstate a disabled user.

#### EXAMPLE {#usersuserreinstate-put-example}

In the following example, an HTTP PUT request is submitted to the `/users/:user/reinstate` API endpoint to reinstate the disabled user `alice`, resulting in an HTTP `201 Created` response.

{{< highlight shell >}}
curl -X PUT \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN" \
-H 'Content-Type: application/json' \
http://127.0.0.1:8080/api/core/v2/users/alice/reinstate

HTTP/1.1 201 Created
{{< /highlight >}}

#### API Specification {#usersuserreinstate-put-specification}

/users/:user/reinstate (PUT) | 
----------------|------
description     | Reinstates a disabled user.
example URL     | http://hostname:8080/api/core/v2/users/alice/reinstate
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## The `/users/:user/groups` API endpoint {#the-usersusergroups-api-endpoint}

### `/users/:user/groups` (DELETE) {#usersusergroups-delete}

The `/users/:user/groups` API endpoint provides HTTP DELETE access to remove the specified user from all groups.

#### EXAMPLE {#usersusergroups-delete-example}

In the following example, an HTTP DELETE request is submitted to the `/users/:user/groups` API endpoint to remove the user `alice` from all groups within Sensu, resulting in a successful HTTP `204 No Content` response.

{{< highlight shell >}}
curl -X DELETE \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN" \
http://127.0.0.1:8080/api/core/v2/users/alice/groups

HTTP/1.1 204 No Content
{{< /highlight >}}

#### API Specification {#usersusergroups-delete-specification}

/users/:user/groups (DELETE) | 
--------------------------|------
description               | Removes the specified user from all groups.
example url               | http://hostname:8080/api/core/v2/users/alice/groups
response codes            | <ul><li>**Success**: 204 (No Content)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## The `/users/:user/groups/:group` API endpoints {#the-usersusergroupsgroup-api-endpoints}

### `/users/:user/groups/:group` (PUT) {#usersusergroupsgroup-put}

The `/users/:user/groups/:group` API endpoint provides HTTP PUT access to assign a user to a group.

#### EXAMPLE {#usersusergroupsgroup-put-example}

In the following example, an HTTP PUT request is submitted to the `/users/:user/groups/:group` API endpoint to add the user `alice` to the group `ops`, resulting in a successful HTTP `201 Created` response.

{{< highlight shell >}}
curl -X PUT \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN" \
http://127.0.0.1:8080/api/core/v2/users/alice/groups/ops

HTTP/1.1 201 Created
{{< /highlight >}}

#### API Specification {#usersusergroupsgroup-put-specification}

/users/:user/groups/:group (PUT) | 
----------------|------
description     | Adds the specified user to the specified group.
example URL     | http://hostname:8080/api/core/v2/users/alice/groups/ops
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

### `/users/:user/groups/:group` (DELETE) {#usersusergroupsgroup-delete}

The `/users/:user/groups/:group` API endpoint provides HTTP DELETE access to remove the specified user from a specific group.

#### EXAMPLE {#usersusergroupsgroup-delete-example}

In the following example, an HTTP DELETE request is submitted to the `/users/:user/groups/:group` API endpoint to remove the user `alice` from the group `ops`, resulting in a successful HTTP `204 No Content` response.

{{< highlight shell >}}
curl -X DELETE \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN" \
http://127.0.0.1:8080/api/core/v2/users/alice/groups/ops

HTTP/1.1 204 No Content
{{< /highlight >}}

#### API Specification {#usersusergroupsgroup-delete-specification}

/users/:user/groups/:group (DELETE) | 
--------------------------|------
description               | Removes the specified user from the specified group.
example url               | http://hostname:8080/api/core/v2/users/alice/groups/ops
response codes            | <ul><li>**Success**: 204 (No Content)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

[1]: ../../reference/rbac#user-specification
[2]: ../overview#pagination
[3]: ../authproviders/
[4]: ../../installation/auth#ldap-authentication
[5]: ../../installation/auth/#ad-authentication
[6]: ../../installation/auth#use-built-in-basic-authentication
[7]: #the-usersuserreinstate-api-endpoint
[8]: ../overview#response-filtering
