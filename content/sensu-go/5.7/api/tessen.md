---
title: "Tessen API"
description: "The Tessen API provides HTTP access to manage Tessen configuration. Read on for the full reference."
version: "5.7"
product: "Sensu Go"
menu:
  sensu-go-5.7:
    parent: api
---

- [The `/tessen` API endpoints](#the-tessen-API-endpoints)
  - [`/tessen` (GET)](#tessen-get)
  - [`/tessen` (PUT)](#tessen-put)

## The `/tessen` API endpoints {#the-tessen-API-endpoints}

The Tessen API provides HTTP access to manage [Tessen](../../reference/tessen) configuration.
Access to the Tessen API is restricted to the default [`admin` user](../../reference/rbac#default-user).

### `/tessen` (GET) {#tessen-get}

The `/tessen` API endpoint provides HTTP GET access to Tessen configuration.

#### EXAMPLE {#tessen-get-example}

The following example demonstrates an HTTP GET request to the `/tessen` API.

{{< highlight shell >}}
curl -H "Authorization: Bearer $TOKEN" http://127.0.0.1:8080/api/core/v2/tessen
{{< /highlight >}}

The request returns a 200 (OK) HTTP response code and a JSON map containing Tessen configuration, indicating that Tessen is enabled.

{{< highlight shell >}}
HTTP/1.1 200 OK
{"opt_out": false}
{{< /highlight >}}

#### API Specification {#tessen-get-specification}

/tessen (GET)  | 
---------------|------
description    | Returns the active Tessen configuration. A response of `"opt_out": false` indicates that Tessen is enabled; a response of `"opt_out": true` indicates that Tessen is disabled.
example url    | http://hostname:8080/api/core/v2/tessen
response type  | Map
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
example output | {{< highlight shell >}}
{"opt_out": false}
{{< /highlight >}}

### `/tessen` (PUT) {#tessen-put}

The `/tessen` API endpoint provides HTTP PUT access to opt in to or opt out of Tessen.
Tessen is enabled by default on Sensu backends and required for [licensed][4] Sensu instances.

#### EXAMPLE {#tessen-put-example}

In the following example, an HTTP PUT request is submitted to the `/tessen` API to opt in to Tessen using the `opt_out` attribute.

{{< highlight shell >}}
curl -X PUT \
-H "Authorization: Bearer $TOKEN" \
-H 'Content-Type: application/json' \
-d '{"opt_out": false}' \
http://127.0.0.1:8080/api/core/v2/tessen
{{< /highlight >}}

The request returns a 200 (OK) HTTP response code and the resulting Tessen configuration.

{{< highlight shell >}}
HTTP/1.1 200 OK
{"opt_out": false}
{{< /highlight >}}

#### API Specification {#tessen-put-specification}

/tessen (PUT) | 
----------------|------
description     | Updates Tessen configuration. [Licensed][4] Sensu instances override the `opt_out` attribute to `false` at runtime.
example url     | http://hostname:8080/api/core/v2/tessen
request parameters | `opt_out` (required): Set to `false` to enable Tessen; set to `true` to opt out of Tessen.
response codes   | <ul><li>**Success**: 200 (OK)</li><li> **Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

[4]: ../../reference/license
