---
title: "Namespaces API"
description: "Sensu Go namespaces API reference documentation"
version: "5.0"
product: "Sensu Go"
menu:
  sensu-go-5.0:
    parent: api
---

## The `/namespaces` API endpoint

### `/namespaces` (GET)

The `/namespaces` API endpoint provides HTTP GET access to [namespace][1] data.

#### EXAMPLE {#namespaces-get-example}

The following example demonstrates a request to the `/namespaces` API, resulting in
a JSON Array containing [namespace definitions][1].

{{< highlight shell >}}
curl -s http://127.0.0.1:8080/api/core/v2/namespaces -H "Authorization: Bearer TOKEN"
[
  {
    "name": "default"
  },
  {
    "name": "development"
  }
]
{{< /highlight >}}

#### API Specification {#namespaces-get-specification}

/namespaces (GET)  | 
---------------|------
description    | Returns the list of namespaces.
example url    | http://hostname:8080/api/core/v2/namespaces
response type  | Array
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< highlight shell >}}
[
  {
    "name": "default"
  },
  {
    "name": "development"
  }
]
{{< /highlight >}}

[1]: ../../reference/rbac

