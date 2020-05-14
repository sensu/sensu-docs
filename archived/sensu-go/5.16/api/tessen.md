---
title: "Tessen API"
description: "The Sensu Tessen API provides HTTP access to manage Tessen configuration. Read on for the full reference."
version: "5.16"
product: "Sensu Go"
menu:
  sensu-go-5.16:
    parent: api
---

- [The `/tessen` API endpoints](#the-tessen-API-endpoints)
  - [`/tessen` (GET)](#tessen-get)
  - [`/tessen` (PUT)](#tessen-put)

## The `/tessen` API endpoints {#the-tessen-API-endpoints}

The Tessen API provides HTTP access to manage [Tessen][1] configuration.
Access to the Tessen API is restricted to the default [`admin` user][2].

### `/tessen` (GET) {#tessen-get}

The `/tessen` API endpoint provides HTTP GET access to the active Tessen configuration.

#### EXAMPLE {#tessen-get-example}

The following example demonstrates an HTTP GET request to the `/tessen` API endpoint.
The request returns an HTTP `200 OK` response and a JSON map that contains the active Tessen configuration, indicating whether Tessen is enabled.

{{< highlight shell >}}
curl -X GET \
http://127.0.0.1:8080/api/core/v2/tessen \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN"

HTTP/1.1 200 OK
{
  "opt_out": false
}
{{< /highlight >}}

#### API Specification {#tessen-get-specification}

/tessen (GET)  | 
---------------|------
description    | Returns the active Tessen configuration. An `"opt_out": false` response indicates that Tessen is enabled. An `"opt_out": true` response indicates that Tessen is disabled.
example url    | http://hostname:8080/api/core/v2/tessen
response type  | Map
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
example output | {{< highlight shell >}}
{
  "opt_out": false
}
{{< /highlight >}}

### `/tessen` (PUT) {#tessen-put}

The `/tessen` API endpoint provides HTTP PUT access to opt in to or opt out of Tessen.
Tessen is enabled by default on Sensu backends and required for [licensed][3] Sensu instances.

#### EXAMPLE {#tessen-put-example}

In the following example, an HTTP PUT request is submitted to the `/tessen` API endpoint to opt in to Tessen using the `opt_out` attribute.
The request returns an HTTP `200 OK` response and the resulting Tessen configuration.

{{< highlight shell >}}
curl -X PUT \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN" \
-H 'Content-Type: application/json' \
-d '{
  "opt_out": false
}' \
http://127.0.0.1:8080/api/core/v2/tessen

HTTP/1.1 200 OK
{
  "opt_out": false
}
{{< /highlight >}}

#### API Specification {#tessen-put-specification}

/tessen (PUT) | 
----------------|------
description     | Updates the active Tessen configuration. [Licensed][3] Sensu instances override the `opt_out` attribute to `false` at runtime.
example url     | http://hostname:8080/api/core/v2/tessen
request parameters | Required: `opt_out` (set to `false` to enable Tessen; set to `true` to opt out of Tessen).
response codes   | <ul><li>**Success**: 200 (OK)</li><li> **Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
example output | {{< highlight shell >}}
{
  "opt_out": false
}
{{< /highlight >}}

[1]: ../../reference/tessen/
[2]: ../../reference/rbac#default-users
[3]: ../../reference/license
