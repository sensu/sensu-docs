---
title: "License management API"
linkTitle: "License API"
description: "The license API provides HTTP access to the active commercial license configuration. Here’s a reference for the license management API in Sensu Go, including examples for returning the active commercial license configuration and activating or updating a commercial license. Read on for the full reference."
version: "5.15"
product: "Sensu Go"
menu:
  sensu-go-5.15:
    parent: api
---

- [The `/license` API endpoints](#the-license-api-endpoints)
  - [`/license` (GET)](#license-get)
  - [`/license` (PUT)](#license-put)
  - [`/license` (DELETE)](#license-delete)

## The `/license` API endpoints

For more information about commercial features designed for enterprises, see the [getting started guide](../../getting-started/enterprise).

### `/license` (GET)

The `/license` API endpoint provides HTTP GET access to the active license configuration.

#### API Specification {#license-get-specification}

/license (GET)  | 
---------------|------
description    | Returns the active commercial license configuration. To download your license, [log in to your Sensu account](https://account.sensu.io) or [contact the Sensu sales team for a free trial](https://sensu.io/sales).
example url    | http://hostname:8080/api/enterprise/licensing/v2/license
response type  | Map
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

### `/license` (PUT)

The `/license` API endpoint provides HTTP PUT access to activate a commercial license.

#### API Specification {#license-put-specification}

/license (PUT)  | 
---------------|------
description    | Activates a commercial license, or updates an existing license configuration. To download your license, [log in to your Sensu account](https://account.sensu.io) or [contact the Sensu sales team for a free trial](https://sensu.io/sales).
example url    | http://hostname:8080/api/enterprise/licensing/v2/license
payload        | License definition
response codes | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

### `/license` (DELETE)

The `/license` API endpoint provides HTTP DELETE access to remove a commercial license.

#### API Specification {#license-delete-specification}

/license (DELETE)  | 
-------------------|------
description    | Removes the commercial license.
example url    | http://hostname:8080/api/enterprise/licensing/v2/license
response codes | <ul><li>**Success**: 204 (No Content)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output          | {{< highlight shell >}}
curl -X DELETE -H "Authorization: Bearer $SENSU_TOKEN"  http://localhost:8080/api/enterprise/licensing/v2/license

HTTP/1.1 204 No Content
{{< /highlight >}}

