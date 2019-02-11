---
title: "Health API"
description: "Sensu Go health API reference documentation"
version: "5.2"
product: "Sensu Go"
menu:
  sensu-go-5.2:
    parent: api
---

## The `/health` API endpoint

### `/health` (GET)

The `/health` API endpoint provides HTTP GET access to [health][1] data for your Sensu instance.

#### EXAMPLE {#healths-get-example}

The following example demonstrates a request to the `/healths` API, resulting in
a JSON map containing Sensu [health data][1].

{{< highlight shell >}}
curl -s http://127.0.0.1:8080/api/core/v2/health -H "Authorization: Bearer TOKEN"
{
  "Alarms": null,
  "ClusterHealth": [
    {
      "MemberID": 9882886658148554927,
      "Name": "default",
      "Err": "",
      "Healthy": true
    }
  ]
}
{{< /highlight >}}

#### API Specification {#healths-get-specification}

/health (GET)  | 
---------------|------
description    | Returns health information about the Sensu instance
example url    | http://hostname:8080/api/core/v2/health
response type  | Map
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< highlight shell >}}
{
  "Alarms": null,
  "ClusterHealth": [
    {
      "MemberID": 9882886658148554927,
      "Name": "default",
      "Err": "",
      "Healthy": true
    }
  ]
}
{{< /highlight >}}
