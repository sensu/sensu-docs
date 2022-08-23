---
title: "/ready"
description: "Read this API documentation for information about Sensu /ready API endpoints, including examples for learning whether the Sensu instance is ready to serve API requests."
other_api_title: "/ready"
type: "other_api"
version: "6.8"
product: "Sensu Go"
menu:
  sensu-go-6.8:
    parent: other
---

## Get API readiness data for your Sensu instance

The `/ready` API endpoint provides HTTP GET access to information about whether your Sensu instance is ready to serve API requests.

### Example

The following example demonstrates a GET request to the `/ready` API endpoint:

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8080/ready
{{< /code >}}

The request results in a successful `HTTP/1.1 200 OK` response and a text response body:

{{< code text >}}
ready
{{< /code >}}

If the backend configuration includes an [`api-serve-wait-time`][2] duration, the request will result in an `HTTP/1.1 503 Service Unavailable` response.
Until the `api-serve-wait-time` duration expires, the text response body will state that the API is unavailable:

{{< code text >}}
API unavailable during startup.
See api-serve-wait-time settings.
{{< /code >}}

{{% notice note %}}
**NOTE**: `503 Service Unavailable` responses include a `Retry-After` header that lists the specified `api-serve-wait-time` duration.
{{% /notice %}}

### API Specification

/ready (GET)    | 
-----------------|------
description      | Returns information about whether the Sensu instance is ready to serve API requests.
example url      | http://hostname:8080/ready
response type    | text
response codes   | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 503 (Service Unavailable)</li></ul>
output           | 200 (OK):<br><br>{{< code text >}}
ready
{{< /code >}}<br>503 (Service Unavailable):<br><br>{{< code text >}}
API unavailable during startup.
See api-serve-wait-time settings.
{{< /code >}}

## Get agent connection readiness data for your Sensu instance

The `/ready` agent transport API endpoint provides HTTP GET access to information about whether your Sensu agent transport is ready to accept agent WebSocket connections.

### Example

The following example demonstrates a GET request to the backend agent transport `/ready` endpoint using the default agent listener port 8081:

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8081/ready
{{< /code >}}

The request results in a successful `HTTP/1.1 200 OK` response and a text response body:

{{< code text >}}
ready
{{< /code >}}

If the backend configuration includes an [`agent-serve-wait-time`][2] duration, the request will result in an `HTTP/1.1 503 Service Unavailable` response.
Until the `agent-serve-wait-time` duration expires, the text response body will state that agentd is unavailable:

{{< code text >}}
agentd temporarily unavailable during startup
{{< /code >}}

{{% notice note %}}
**NOTE**: `503 Service Unavailable` responses include a `Retry-After` header that lists the specified `agent-serve-wait-time` duration.
{{% /notice %}}

### API Specification

/ready (GET)    | 
-----------------|------
description      | Returns information about whether the Sensu instance is ready to accept agent connections.
example url      | http://hostname:8081/ready
response type    | text
response codes   | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 503 (Service Unavailable)</li></ul>
output           | 200 (OK):<br><br>{{< code text >}}
ready
{{< /code >}}<br>503 (Service Unavailable):<br><br>{{< code text >}}
agentd temporarily unavailable during startup
{{< /code >}}


[1]: ../../../observability-pipeline/observe-schedule/backend/#api-serve-wait-time
[2]: ../../../observability-pipeline/observe-schedule/backend/#agent-serve-wait-time
