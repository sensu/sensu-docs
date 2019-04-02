---
title: "Tessen API"
description: "The Tessen API provides HTTP access to manage your Tessen configuration. Read on for the full reference."
version: "5.5"
product: "Sensu Go"
menu:
  sensu-go-5.5:
    parent: api
---

- [The `/tessen` API endpoints](#the-tessen-API-endpoints)
  - [`/tessen` (GET)](#tessen-get)
  - [`/tessen` (PUT)](#tessen-put)

## The `/tessen` API endpoints {#the-tessen-API-endpoints}

### `/tessen` (GET) {#tessen-get}

The `/tessen` API endpoint provides HTTP GET access to [Tessen](../../reference/tessen) configuration.

#### EXAMPLE {#tessen-get-example}

The following example demonstrates an HTTP GET request to the `/tessen` API.

{{< highlight shell >}}
curl -H "Authorization: Bearer $TOKEN" http://127.0.0.1:8080/api/core/v2/tessen
{{< /highlight >}}

The request returns a 200 (OK) HTTP response code and a JSON map containing the Tessen configuration.

{{< highlight shell >}}
HTTP/1.1 200 OK
{"opt_out": false}
{{< /highlight >}}

#### API Specification {#tessen-get-specification}

/tessen (GET)  | 
---------------|------
description    | Returns the active Tessen configuration.
example url    | http://hostname:8080/api/core/v2/tessen
response type  | Map
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
example output | {{< highlight shell >}}
{"opt_out": false}
{{< /highlight >}}

### `/tessen` (PUT) {#tessen-put}

#### EXAMPLE {#tessen-put-example}

In the following example, an HTTP PUT request is submitted to the `/tessen` API to update the Tessen configuration using the `opt_out` attribute.

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
description     | Updates Tessen configuration. [Licensed][4] Sensu instances cannot opt out of Tessen.
example url     | http://hostname:8080/api/core/v2/tessen
request parameters | `opt_out` (required): Set to `false` to enable Tessen; set to `true` to opt out of Tessen.
response codes   | <ul><li>**Success**: 200 (OK)</li><li> **Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

[4]: ../../reference/license
