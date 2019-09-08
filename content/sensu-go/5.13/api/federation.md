---
title: "Federation API"
description: "The federation API provides HTTP access to filter data. Here’s a reference for the federation API in Sensu Go, including examples for returning lists of federation, creating Sensu federation, and more. Read on for the full reference."
version: "5.13"
product: "Sensu Go"
menu:
  sensu-go-5.13:
    parent: api
---

- [The `/federation/v1/replicators` API endpoint](#the-federation-api-endpoint)
	- [`/federation/v1/replicators` (GET)](#federation-get)
	- [`/federation/v1/replicators` (POST)](#federation-post)
    - [`/federation/v1/replicators/{name}` (GET)](#federation-name-get)
    - [`/federation/v1/replicators/{name}` (PUT)](#federation-name-put)
    - [`/federation/v1/replicators/{name}` (DELETE)](#federation-name-delete)

## The `/federation/v1/replicators` API endpoints

### `//federation/v1/replicators` (GET)

The `/federation` API endpoint provides HTTP GET access to [filter][1] data.

#### EXAMPLE {#federation-get-example}

The following example demonstrates a request to the `/federation/v1/replicators` API, resulting in
a JSON Array containing a list of the replicators.

{{< highlight shell >}}
Coming Soon
{{< /highlight >}}

#### API Specification {#federation-get-specification}

/federation/v1/replicators (GET)  | 
---------------|------
description    | Returns the list of federation replicators.
example url    | http://hostname:8080/api/core/v2/namespaces/default/federation/v1/replicators
response type  | 
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< highlight shell >}}

{{< /highlight >}}

### `/federation/v1/replicators` (POST)

/federation/v1/replicators (POST) | 
----------------|------
description     | Create new replicator if not exists
example URL     | http://hostname:8080/api/core/v2/namespaces/default/federation/v1/replicators
payload         | {{< highlight shell >}}

{{< /highlight >}}
response codes  | <ul><li>**Success**: 200 (OK)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

### `/federation/v1/replicators/{name}` (GET)

/federation/v1/replicators/{name} (GET) | 
----------------|------
description     | Get a replicator by name
example URL     | http://hostname:8080/api/core/v2/namespaces/default/federation/v1/replicators/{name}
response codes  | <ul><li>**Success**: 200 (OK)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< highlight shell >}}

{{< /highlight >}}

### `/federation/v1/replicators/{name}` (PUT)

/federation/v1/replicators/{name} (PUT) | 
----------------|------
description     | Get a replicator by name
example URL     | http://hostname:8080/api/core/v2/namespaces/default/federation/v1/replicators/{name}
response codes  | <ul><li>**Success**: 200 (OK)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
payload         | {{< highlight shell >}}

{{< /highlight >}}
output         | {{< highlight shell >}}

{{< /highlight >}}


### `/federation/v1/replicators/{name}` (DELETE)

/federation/v1/replicators/{name} (DELTE) | 
----------------|------
description     | Delete a replicator by name
example URL     | http://hostname:8080/api/core/v2/namespaces/default/federation/v1/replicators/{name}
response codes  | <ul><li>**Success**: 200 (OK)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
payload         | {{< highlight shell >}}

{{< /highlight >}}
output         | {{< highlight shell >}}

{{< /highlight >}}
