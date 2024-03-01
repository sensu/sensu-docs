---
title: "Ready reference"
linkTitle: "Ready Reference"
reference_title: "Ready"
type: "reference"
description: "Access readiness data for your Sensu instance. Read this page to learn about the readiness information you can retrieve."
weight: 35
version: "6.11"
product: "Sensu Go"
menu: 
  sensu-go-6.11:
    parent: monitor-sensu
---

Use Sensu's [/ready API endpoint][1] to confirm whether a Sensu instance is ready to serve API requests and accept agent connections.

A request to the /ready backend API endpoint retrieves a text response with information about whether your Sensu instance is ready to serve API requests.
Here's an example request to the /ready API endpoint:

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8080/ready
{{< /code >}}

A request to the /ready agent transport API endpoint via the backend WebSocket retrieves information about whether your Sensu instance is ready to accept agent connections.
Here's an example request to the /ready agent transport API endpoint using the default WebSocket port 8081:

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8081/ready
{{< /code >}}

## Ready response example

The following response means that the Sensu instance is ready to serve API requests or accept agent connections:

{{< code text >}}
ready
{{< /code >}}

## Not ready response examples

To help prevent instability during sensu-backend startup, use the [`api-serve-wait-time`][2] and [`agent-serve-wait-time`][3] backend configuration options.

Use `api-serve-wait-time` to configure a delay after startup before the backend API will serve traffic.
Until the specified duration expires, the text response body will state that the API is unavailable:

{{< code text >}}
API unavailable during startup.
See api-serve-wait-time settings.
{{< /code >}}

Use `agent-serve-wait-time` to configure a delay after startup before the agent listener will begin accepting agent connections.
Until the specified duration expires, the text response body will state that agentd is unavailable:

{{< code text >}}
agentd temporarily unavailable during startup
{{< /code >}}

Not-ready responses include a `Retry-After` header that lists the specified `api-serve-wait-time` or `agent-serve-wait-time` duration.


[1]: ../../../api/other/ready/
[2]: ../../../observability-pipeline/observe-schedule/backend/#api-serve-wait-time
[3]: ../../../observability-pipeline/observe-schedule/backend/#agent-serve-wait-time
