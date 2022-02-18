---
title: "core/v2/users"
description: "Read this API documentation for details about Sensu core/v2/users API endpoints, with examples for creating and managing Sensu user data to match your workflow."
core_api_title: "core/v2/users"
type: "core_api"
version: "6.6"
product: "Sensu Go"
menu:
  sensu-go-6.6:
    parent: core
---

{{% notice note %}}
**NOTE**: The `core/v2/users` API endpoints allow you to create and manage user credentials with Sensu's built-in [basic authentication provider](../../../operations/control-access#use-built-in-basic-authentication).
To configure user credentials with an external provider like [Lightweight Directory Access Protocol (LDAP)](../../../operations/control-access/ldap-auth/), [Active Directory (AD)](../../../operations/control-access/ad-auth/), or [OpenID Connect 1.0 protocol (OIDC)](../../../operations/control-access/oidc-auth/), use Sensu's [enterprise/authentication/v2 API endpoints](../../enterprise/authproviders/).<br><br>
Requests to `core/v2/users` API endpoints require you to authenticate with a Sensu [API key](../../#configure-an-environment-variable-for-api-key-authentication) or [access token](../../#authenticate-with-auth-api-endpoints).
The code examples in this document use the [environment variable](../../#configure-an-environment-variable-for-api-key-authentication) `$SENSU_API_KEY` to represent a valid API key in API requests.
{{% /notice %}}

## Get all users

The `/users` API endpoint provides HTTP GET access to [user][1] data.

### Example {#users-get-example}

The following example demonstrates a request to the `/users` API, resulting in a JSON array that contains [user definitions][1].

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8080/api/core/v2/users \
-H "Authorization: Key $SENSU_API_KEY"

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
{{< /code >}}

### API Specification {#users-get-specification}

/users (GET)  | 
---------------|------
description    | Returns the list of users.
example url    | http://hostname:8080/api/core/v2/users
pagination     | This endpoint supports [pagination][2] using the `limit` and `continue` query parameters.
response filtering | This endpoint supports [API response filtering][8].
response type  | Array
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< code shell >}}
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
{{< /code >}}

## Create a new user

The `/users` API endpoint provides HTTP POST access to create a [user][1] using Sensu's basic authentication provider.

### Example {#users-post-example}

The following example demonstrates a POST request to the `/users` API endpoint to create the user `alice`, resulting in an HTTP `201 Created` response and the created user definition.

{{< code shell >}}
curl -X POST \
-H "Authorization: Key $SENSU_API_KEY" \
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
{{< /code >}}

### API Specification {#usersuser-post-specification}

/users (POST) | 
----------------|------
description     | Creates a Sensu user.
example URL     | http://hostname:8080/api/core/v2/users
payload parameters | Required: `username` (string), `groups` (array; sets of shared permissions that apply to this user), `password` (string; at least eight characters), and `disabled` (when set to `true`, invalidates user credentials and permissions).
payload         | {{< code shell >}}
{
  "username": "alice",
  "groups": [
    "ops"
  ],
  "password": "temporary",
  "disabled": false
}
{{< /code >}}
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Get a specific user {#usersuser-get}

The `/users/:user` API endpoint provides HTTP GET access to [user data][1] for a specific user by `username`.

### Example {#usersuser-get-example}

In the following example, querying the `/users/:user` API returns a JSON map that contains the requested [`:user` definition][1] (in this example, for the `alice` user).

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8080/api/core/v2/users/alice \
-H "Authorization: Key $SENSU_API_KEY"

HTTP/1.1 200 OK
{
  "username": "alice",
  "groups": [
    "ops"
  ],
  "disabled": false
}
{{< /code >}}

### API Specification {#usersuser-get-specification}

/users/:user (GET) | 
---------------------|------
description          | Returns the specified user.
example url          | http://hostname:8080/api/core/v2/users/alice
response type        | Map
response codes       | <ul><li>**Success**: 200 (OK)</li><li> **Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output               | {{< code json >}}
{
  "username": "alice",
  "groups": [
    "ops"
  ],
  "disabled": false
}
{{< /code >}}

## Create or update a user {#usersuser-put}

The `/users/:user` API endpoint provides HTTP PUT access to create or update [user data][1] for a specific user by `username`.

{{% notice note %}}
**NOTE**: Use the [`PUT /users/:user/reset_password`](#usersuserresetpassword-put) or [`PUT /users/:user/password`](#usersuserpassword-put) API endpoints to reset or change the user password, respectively.
{{% /notice %}}

### Example {#users-put-example}

The following example demonstrates a PUT request to the `/users` API endpoint to update the user `alice` (for example, to add the user to the `devel` group), resulting in an HTTP `201 Created` response.

{{< code shell >}}
curl -X PUT \
-H "Authorization: Key $SENSU_API_KEY" \
-H 'Content-Type: application/json' \
-d '{
  "username": "alice",
  "groups": [
    "ops",
    "devel"
  ],
  "password": "password",
  "disabled": false
}' \
http://127.0.0.1:8080/api/core/v2/users/alice

HTTP/1.1 201 Created
{{< /code >}}

### API Specification {#usersuser-put-specification}

/users/:user (PUT) | 
----------------|------
description     | Creates or updates user data for the specified Sensu user.
example URL     | http://hostname:8080/api/core/v2/users/alice
payload         | {{< code shell >}}
{
  "username": "alice",
  "groups": [
    "ops",
    "devel"
  ],
  "password": "password",
  "disabled": false
}
{{< /code >}}
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Delete a user {#usersuser-delete}

The `/users/:user` API endpoint provides HTTP DELETE access to disable a specific user by `username`.

### Example {#usersuser-delete-example}

In the following example, an HTTP DELETE request is submitted to the `/users/:user` API endpoint to disable the user `alice`, resulting in a successful HTTP `204 No Content` response.

{{< code shell >}}
curl -X DELETE \
-H "Authorization: Key $SENSU_API_KEY" \
http://127.0.0.1:8080/api/core/v2/users/alice

HTTP/1.1 204 No Content
{{< /code >}}

{{% notice note %}}
**NOTE**: This endpoint **disables** but does not delete the user.
You can [reinstate](#usersuserreinstate-put) disabled users.
{{% /notice %}}

### API Specification {#usersuser-delete-specification}

/users/:user (DELETE) | 
--------------------------|------
description               | Disables the specified user.
example url               | http://hostname:8080/api/core/v2/users/alice
response codes            | <ul><li>**Success**: 204 (No Content)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Reset a user's password {#usersuserresetpassword-put}

The `/users/:user/reset_password` API endpoint provides HTTP PUT access to reset a user's password.

{{% notice note %}}
**NOTE**: The `/users/:user/reset_password` API endpoint requires explicit [`users` permissions](../../../operations/control-access/rbac/#users).
With these permissions, you can use `/users/:user/reset_password` to reset a user's password.
This differs from the `/users/:user/password` API endpoint, which allows users to change their own passwords without explicit permissions.
{{% /notice %}}

### Example {#usersuserresetpassword-put-example}

In the following example, an HTTP PUT request is submitted to the `/users/:user/reset_password` API endpoint to reset the password for the user `alice`, resulting in an HTTP `201 Created` response.

The `password_hash` is the user's new password, hashed via [bcrypt][3].
Use `sensuctl user hash-password` to [generate the `password_hash`][4].

{{< code shell >}}
curl -X PUT \
-H "Authorization: Key $SENSU_API_KEY" \
-H 'Content-Type: application/json' \
-d '{
  "username": "alice",
  "password_hash": "$5f$14$.brXRviMZpbaleSq9kjoUuwm67V/s4IziOLGHjEqxJbzPsreQAyNm"
}' \
http://127.0.0.1:8080/api/core/v2/users/alice/reset_password

HTTP/1.1 201 Created
{{< /code >}}

### API Specification {#usersuserresetpassword-put-specification}

/users/:user/reset_password (PUT) | 
----------------|------
description     | Resets the password for the specified Sensu user.
example URL     | http://hostname:8080/api/core/v2/users/alice/reset_password
payload parameters | Required: <ul><li>`username`: string; the username for the Sensu user</li><li>`password_hash`: string; the new user password, hashed via [bcrypt][3]</li></ul> 
payload         | {{< code shell >}}
{
  "username": "alice",
  "password_hash": "$5f$14$.brXRviMZpbaleSq9kjoUuwm67V/s4IziOLGHjEqxJbzPsreQAyNm"
}
{{< /code >}}
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Change your password {#usersuserpassword-put}

The `/users/:user/password` API endpoint provides HTTP PUT access to change your Sensu user password.

{{% notice note %}}
**NOTE**: The `/users/:user/password` API endpoint allows a user to update their own password, without any permissions.
This differs from the `/users/:user/reset_password` API endpoint, which requires explicit [`users` permissions](../../../operations/control-access/rbac/#users) to change the user password.
{{% /notice %}}

### Example {#usersuserpassword-put-example}

In the following example, an HTTP PUT request is submitted to the `/users/:user/password` API endpoint to update the password for the user `alice`, resulting in an HTTP `201 Created` response.

The `password` is your current password in cleartext.
The `password_hash` is your new password hashed via [bcrypt][3].
Use `sensuctl user hash-password` to [generate the `password_hash`][4].

{{< code shell >}}
curl -X PUT \
-H "Authorization: Key $SENSU_API_KEY" \
-H 'Content-Type: application/json' \
-d '{
  "username": "alice",
  "password": "P@ssw0rd!",
  "password_hash": "$5f$14$.brXRviMZpbaleSq9kjoUuwm67V/s4IziOLGHjEqxJbzPsreQAyNm"
}' \
http://127.0.0.1:8080/api/core/v2/users/alice/password

HTTP/1.1 201 Created
{{< /code >}}

### API Specification {#usersuserpassword-put-specification}

/users/:user/password (PUT) | 
----------------|------
description     | Changes the password for the specified Sensu user.
example URL     | http://hostname:8080/api/core/v2/users/alice/password
payload parameters | Required: <ul><li>`username`: string; the username for the Sensu user</li><li>`password`: string; the user's current password in cleartext</li><li>`password_hash`: string; the user's hashed password via [bcrypt][3]</li></ul>
payload         | {{< code shell >}}
{
  "username": "alice",
  "password": "P@ssw0rd!",
  "password_hash": "$5f$14$.brXRviMZpbaleSq9kjoUuwm67V/s4IziOLGHjEqxJbzPsreQAyNm"
}
{{< /code >}}
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Reinstate a disabled user {#usersuserreinstate-put}

The `/users/:user/reinstate` API endpoint provides HTTP PUT access to reinstate a disabled user.

### Example {#usersuserreinstate-put-example}

In the following example, an HTTP PUT request is submitted to the `/users/:user/reinstate` API endpoint to reinstate the disabled user `alice`, resulting in an HTTP `201 Created` response.

{{< code shell >}}
curl -X PUT \
-H "Authorization: Key $SENSU_API_KEY" \
-H 'Content-Type: application/json' \
http://127.0.0.1:8080/api/core/v2/users/alice/reinstate

HTTP/1.1 201 Created
{{< /code >}}

### API Specification {#usersuserreinstate-put-specification}

/users/:user/reinstate (PUT) | 
----------------|------
description     | Reinstates a disabled user.
example URL     | http://hostname:8080/api/core/v2/users/alice/reinstate
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Remove a user from all groups {#usersusergroups-delete}

The `/users/:user/groups` API endpoint provides HTTP DELETE access to remove the specified user from all groups.

### Example {#usersusergroups-delete-example}

In the following example, an HTTP DELETE request is submitted to the `/users/:user/groups` API endpoint to remove the user `alice` from all groups within Sensu, resulting in a successful HTTP `204 No Content` response.

{{< code shell >}}
curl -X DELETE \
-H "Authorization: Key $SENSU_API_KEY" \
http://127.0.0.1:8080/api/core/v2/users/alice/groups

HTTP/1.1 204 No Content
{{< /code >}}

### API Specification {#usersusergroups-delete-specification}

/users/:user/groups (DELETE) | 
--------------------------|------
description               | Removes the specified user from all groups.
example url               | http://hostname:8080/api/core/v2/users/alice/groups
response codes            | <ul><li>**Success**: 204 (No Content)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Assign a user to a group {#usersusergroupsgroup-put}

The `/users/:user/groups/:group` API endpoint provides HTTP PUT access to assign a user to a group.

### Example {#usersusergroupsgroup-put-example}

In the following example, an HTTP PUT request is submitted to the `/users/:user/groups/:group` API endpoint to add the user `alice` to the group `ops`, resulting in a successful HTTP `201 Created` response.

{{< code shell >}}
curl -X PUT \
-H "Authorization: Key $SENSU_API_KEY" \
http://127.0.0.1:8080/api/core/v2/users/alice/groups/ops

HTTP/1.1 201 Created
{{< /code >}}

### API Specification {#usersusergroupsgroup-put-specification}

/users/:user/groups/:group (PUT) | 
----------------|------
description     | Adds the specified user to the specified group.
example URL     | http://hostname:8080/api/core/v2/users/alice/groups/ops
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Remove a user from a specific group {#usersusergroupsgroup-delete}

The `/users/:user/groups/:group` API endpoint provides HTTP DELETE access to remove the specified user from a specific group.

### Example {#usersusergroupsgroup-delete-example}

In the following example, an HTTP DELETE request is submitted to the `/users/:user/groups/:group` API endpoint to remove the user `alice` from the group `ops`, resulting in a successful HTTP `204 No Content` response.

{{< code shell >}}
curl -X DELETE \
-H "Authorization: Key $SENSU_API_KEY" \
http://127.0.0.1:8080/api/core/v2/users/alice/groups/ops

HTTP/1.1 204 No Content
{{< /code >}}

### API Specification {#usersusergroupsgroup-delete-specification}

/users/:user/groups/:group (DELETE) | 
--------------------------|------
description               | Removes the specified user from the specified group.
example url               | http://hostname:8080/api/core/v2/users/alice/groups/ops
response codes            | <ul><li>**Success**: 204 (No Content)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Get a subset of users with response filtering

The `/users` API endpoint supports [response filtering][3] for a subset of user data based on labels and the following fields:

- `user.username`
- `user.disabled`
- `user.groups`

### Example

The following example demonstrates a request to the `/users` API endpoint with [response filtering][3], resulting in a JSON array that contains only [user definitions][1] that are in the `default` namespace.

{{< code shell >}}
curl -H "Authorization: Key $SENSU_API_KEY" http://127.0.0.1:8080/api/core/v2/users -G \
--data-urlencode 'fieldSelector="dev" in user.groups'

HTTP/1.1 200 OK
[
  {
    "username": "alice",
    "groups": [
      "ops",
      "dev"
    ],
    "disabled": false
  },
  {
    "username": "balan",
    "groups": [
      "testing",
      "dev"
    ],
    "disabled": false
  }
]
{{< /code >}}

{{% notice note %}}
**NOTE**: Read [API response filtering](../../#response-filtering) for more filter statement examples that demonstrate how to filter responses using different operators with label and field selectors.
{{% /notice %}}

### API Specification

/users (GET) with response filters | 
---------------|------
description    | Returns the list of users that match the [response filters][8] applied in the API request.
example url    | http://hostname:8080/api/core/v2/users
pagination     | This endpoint supports [pagination][2] using the `limit` and `continue` query parameters.
response type  | Array
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< code shell >}}
[
  {
    "username": "alice",
    "groups": [
      "ops",
      "dev"
    ],
    "disabled": false
  },
  {
    "username": "balan",
    "groups": [
      "testing",
      "dev"
    ],
    "disabled": false
  }
]
{{< /code >}}


[1]: ../../../operations/control-access/rbac#users
[2]: ../../#pagination
[3]: https://en.wikipedia.org/wiki/Bcrypt
[4]: ../../../sensuctl/#generate-a-password-hash
[8]: ../../#response-filtering
