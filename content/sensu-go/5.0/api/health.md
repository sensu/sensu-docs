---
title: "Health API"
description: "Sensu Go health API reference documentation"
version: "5.0"
product: "Sensu Go"
menu:
  sensu-go-5.0:
    parent: api
---

## The `/health` API endpoint

### `/health` (GET)

The `/health` API endpoint provides HTTP GET access to health data for your Sensu instance.

#### EXAMPLE {#health-get-example}

The following example demonstrates a request to the `/health` API, resulting in
a JSON map containing Sensu health data.

{{< highlight shell >}}
curl http://127.0.0.1:8080/api/core/v2/health -H "Authorization: Bearer TOKEN"

HTTP/1.1 200 OK
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

#### API Specification {#health-get-specification}

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
