---
title: "License management API"
linkTitle: "License API"
description: "Sensu Go license management API reference documentation"
version: "5.2"
product: "Sensu Go"
menu:
  sensu-go-5.2:
    parent: api
---

- [The `/license` API endpoints](#the-license-api-endpoints)
  - [`/license` (GET)](#license-get)
  - [`/license` (PUT)](#license-put)

## The `/license` API endpoints

For more information about license-activated features designed for enterprises, see the [getting started guide](../../getting-started/enterprise).

### `/license` (GET)

The `/license` API endpoint provides HTTP GET access to the active license configuration.

#### API Specification {#license-get-specification}

/license (GET)  | 
---------------|------
description    | Returns the active enterprise license configuration. To download your license, [log in to your Sensu account](https://account.sensu.io) or [contact the Sensu sales team for a free trial](https://sensu.io/sales).
example url    | http://hostname:8080/api/enterprise/licensing/v2/license
response type  | Map
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

### `/license` (PUT)

The `/license` API endpoint provides HTTP PUT access to activate an enterprise license.

#### API Specification {#license-put-specification}

/license (PUT)  | 
---------------|------
description    | Activates an enterprise license, or updates an existing license configuration. To download your license, [log in to your Sensu account](https://account.sensu.io) or [contact the Sensu sales team for a free trial](https://sensu.io/sales).
example url    | http://hostname:8080/api/enterprise/licensing/v2/license
payload        | License definition
response codes | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
