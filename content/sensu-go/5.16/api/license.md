---
title: "License management API"
linkTitle: "License API"
description: "The Sensu license API provides HTTP access to the active commercial license configuration. This reference includes examples for returning the active commercial license configuration and activating or updating a commercial license. Read on for the full reference."
version: "5.16"
product: "Sensu Go"
menu:
  sensu-go-5.16:
    parent: api
---

- [The `/license` API endpoints](#the-license-api-endpoints)
  - [`/license` (GET)](#license-get)
  - [`/license` (PUT)](#license-put)
  - [`/license` (DELETE)](#license-delete)

## The `/license` API endpoints

For more information about commercial features designed for enterprises, see [Get started with commercial features][1].

### `/license` (GET)

The `/license` API endpoint provides HTTP GET access to the active license configuration.

#### API Specification {#license-get-specification}

/license (GET)  | 
---------------|------
description    | Returns the active commercial license configuration. To download your license, [log in to your Sensu account][2] or [contact the Sensu sales team for a free trial][3].
example url    | http://hostname:8080/api/enterprise/licensing/v2/license
response type  | Map
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

### `/license` (PUT)

The `/license` API endpoint provides HTTP PUT access to activate a commercial license.

#### API Specification {#license-put-specification}

/license (PUT)  | 
---------------|------
description    | Activates a commercial license or updates an existing license configuration. To download your license, [log in to your Sensu account][2] or [contact the Sensu sales team for a free trial][3].
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

[1]: ../../getting-started/enterprise/
[2]: https://account.sensu.io/
[3]: https://sensu.io/contact?subject=contact-sales
