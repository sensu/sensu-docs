---
title: Health API
weight: 41
product: "Uchiwa"
version: "1.0"
menu:
  uchiwa-1.0:
    parent: api
---

## /health (GET)
Returns both Uchiwa and Sensu API status

### Response Example (Status 200)
{{< highlight json >}}
{
  "uchiwa": "ok",
  "sensu": {
    "us-east-1": {
      "output": "ok"
    },
    "us-west-1":{
      "output": "ok"
    }
  }
}
{{< /highlight >}}

### Response Codes
HTTP Status Code | Reason
-----------------|--------
200 | All the services are working
503 | One of the service is unavailable

## /health/{service}
Returns status of **Sensu API** or **Uchiwa** service.

### Response Example (Status 200)
{{< highlight json >}}
"us-east-1": {
  "output": "ok"
},
"us-west-1":{
  "output": "ok"
}{{< /highlight >}}

### Parameters
Parameter | Description
----------|-------------
service | name of the service; either `sensu` or `uchiwa`

### Response Codes
HTTP Status Code | Reason
-----------------|--------
200 | The service is working
503 | The service is unavailable