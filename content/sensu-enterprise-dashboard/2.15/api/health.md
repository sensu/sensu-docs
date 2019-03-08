---
title: "Health API"
description: "Sensu Enterprise Console Health API reference documentation."
product: "Sensu Enterprise Dashboard"
version: "2.15"
menu:
  sensu-enterprise-dashboard-2.15:
    parent: api
---

## Reference documentation

- [The `/health` API endpoint](#the-health-endpoint)
  - [`/health` (GET)](#health-get)

## The `/health` API endpoint {#the-health-endpoint}

The `/health` API provides HTTP GET access to the health of a
Sensu Enterprise installation.

### `/health` (GET)

#### EXAMPLE {#health-get-example}

The following example demonstrates a request to the `/health` API, resulting in
a JSON Hash indicating the health of Sensu Enterprise.

{{< highlight shell >}}
$ curl -s http://127.0.0.1:3000/health | jq .
{
  "sensu": {
    "sensu-1": {
      "output": "ok",
      "status": 0
    }
  },
  "uchiwa": "ok"
}
{{< /highlight >}}

#### API Specification {#health-get-specification}

/health (GET) | 
----------------|------
description     | Returns Sensu Enterprise health information. The returned `status` follows the [Sensu status code specification][1].
example url     | http://hostname:3000/health
response type   | Hash
response codes  | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output          | {{< highlight json >}}{
  "sensu": {
    "sensu-1": {
      "output": "ok",
      "status": 0
    }
  },
  "uchiwa": "ok"
}
{{< /highlight >}}

[1]: /sensu-core/latest/reference/checks/#sensu-check-specification