---
title: "Health & Info APIs"
description: "Sensu Health & Info API reference documentation."
product: "Sensu Core"
version: "1.2"
weight: 8
menu:
  sensu-core-1.2:
    parent: api
---

## Reference documentation

- [How to obtain API status information](#how-to-obtain-api-status-information)
- [The `/health` API endpoint](#the-health-api-endpoint)
  - [`/health` (GET)](#health-get)
- [The `/info` API endpoint](#the-info-api-endpoint)
  - [`/info` (GET)](#info-get)

## How to obtain API status information

The Sensu API provides two distinct endpoints for obtaining API status
information: `/health` and `/info`. The Health API provides status information
about the health of the API's connections to the Sensu [data store][1] and
[transport][2]. The Info API provides a report on the status of the API,
including API version, the status of the API's connections to the Sensu data
store and transport, and the number of messages and consumers in various
transport queues.

## The `/health` API endpoint

### `/health` (GET)

The `/health` API provides HTTP GET access to test or verify the health of the
monitoring system. The Health API is provided for <abbr title="always monitor
your monitoring">monitoring Sensu</abbr> &mdash; it facilitates service checks
to ensure that a minimal number of [Sensu servers][3] are connected to the
transport (i.e. "transport consumers"), and/or to ensure that the transport
queue isn't growing (which would indicate that the Sensu servers aren't able to
keeping up with the volume of [keepalive messages][4] and [check results][5]
being produced).

_NOTE: the `/health` API obtains its information via the `/info` API._

_PRO TIP: the Health API [`messages` URL parameter][6] (e.g. `/health?messages=1000`)
can be used to monitor the number of messages queued on the [Sensu transport][2]
and then leveraged by other automation tools to trigger an "auto scaling" or
similar provisioning event, to automatically add one or more Sensu servers to a
Sensu installation._

#### EXAMPLE {#health-get-example}

In the following example, querying the `/health` API with the [`consumers`][6]
URL parameter will return an [HTTP response code][7] to indicate if the expected
number of consumers (i.e. [Sensu servers][3]) are processing check results. In
this example we are expecting at least two (2) consumers to be running at all
times (i.e. at least two Sensu servers processing check results). The [412
(Precondition Failed) HTTP response code][7] indicates that the requested number
of consumers are not registered.

{{< highlight shell >}}
curl -s -i http://127.0.0.1:4567/health?consumers=2
HTTP/1.1 412 Precondition Failed
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Credentials: true
Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization
Connection: close
{{< /highlight >}}

_NOTE: the ["412 (Precondition Failed)" HTTP response code][7] does **not** mean
that the API itself is unavailable, but rather, it is the equivalent of a
"false" response to the API query (i.e. if you want to know if there are "at
least two Sensu servers processing check results?", a 412 response code would
mean "no")._

_WARNING: transport "consumers" are a native concept in [pubsub technology][8]
(including **actual** message queues like [RabbitMQ][8]). Because the [Sensu
transport library][2] supports transports which are not actual message queues
(e.g. [Redis][10]), some transports do not support the Health API `consumers`
check, because they don't support the concept of "consumers"; i.e. this means
that `/health?consumers=1` will always fail (returning a 412 response code) for
Sensu installations using Redis as the transport, regardless of the number of
Sensu servers which may be registered and processing check results._

#### API Specification {#health-get-specification}

/health (GET)  | 
---------------|------
description    | Returns health information on transport & Redis connections.
example url    | http://hostname:4567/health
parameters     | <ul><li>`consumers`:<ul><li>**required**: true</li><li>**type**: Integer</li><li>**description**: The minimum number of transport consumers to be considered healthy</li><li>**notes**: not supported for Sensu installations using Redis as the transport</li></ul></li><li>`messages`:<ul><li>**required**: true</li><li>**type**: Integer</li><li>**description**: The maximum amount of transport queued messages to be considered healthy</li></ul></li></ul>
response type  | [HTTP-header][11] only (no content)
response codes | <ul><li>**Success**: 204 (No Content)</li><li>**Error**: 412 (Precondition Failed)</li></ul>
output         | {{< highlight shell >}}HTTP/1.1 412 Precondition Failed
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Credentials: true
Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization
Connection: close
{{< /highlight >}}

## The `/info` API endpoint

### `/info` (GET)

The `/info` API endpoint provides HTTP GET access to status
information about the Sensu installation, including the API version,
Sensu settings hexdigest, [data store][1] and [transport][2]
connectivity, and the running Sensu servers.

_PRO TIP: The Sensu settings `hexdigest` value is used when comparing configurations across Sensu server instances, and can be particularly useful in troubleshooting cases where there are unexpected results inside of your deployment. Note that when retrieving this value in a distributed configuration, the `hexdigest` value should be consistent across server instances. If the value is differing between Sensu server instances in the same environment, this indicates that the configuration between one or more servers differ from the rest of those in the environment._

#### EXAMPLE {#info-get-example}

{{< highlight shell >}}
$ curl -s http://127.0.0.1:4567/info | jq .
{
  "sensu": {
    "version": "1.0.0",
    "settings": {
      "hexdigest": "4041dcf9b87d3dc8523a79d944c68f99fe10f99b379989afd617201c91d75411"
    }
  },
  "redis": {
    "connected": true
  },
  "transport": {
    "name": "rabbitmq",
    "connected": true,
    "results": {
      "consumers": 0,
      "messages": 0
    },
    "keepalives": {
      "consumers": 0,
      "messages": 0
    }
  },
  "servers": [
    {
      "id": "ee193524-ef98-4477-817a-6a1c8d822c82",
      "hostname": "example",
      "address": "192.168.0.2",
      "tasks": [
        "check_request_publisher",
        "client_monitor",
        "check_result_monitor"
      ],
      "metrics": {
        "cpu": {
          "user": 45.52,
          "system": 0.95
        }
      },
      "sensu": {
        "version": "1.0.0",
        "settings": {
          "hexdigest": "4041dcf9b87d3dc8523a79d944c68f99fe10f99b379989afd617201c91d75411"
        }
      },
      "timestamp": 1488240896
    }
  ]
}
{{< /highlight >}}

#### API Specification {#info-get-specification}

/info (GET)  | 
---------------|------
description    | Returns information on the Sensu installation.
example url    | http://hostname:4567/info
response type  | Hash
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li><ul>
output         | {{< highlight json >}}{
  "sensu": {
    "version": "1.0.0",
    "settings": {
      "hexdigest": "4041dcf9b87d3dc8523a79d944c68f99fe10f99b379989afd617201c91d75411"
    }
  },
  "redis": {
    "connected": true
  },
  "transport": {
    "name": "rabbitmq",
    "connected": true,
    "results": {
      "consumers": 0,
      "messages": 0
    },
    "keepalives": {
      "consumers": 0,
      "messages": 0
    }
  },
  "servers": [
    {
      "id": "ee193524-ef98-4477-817a-6a1c8d822c82",
      "hostname": "example",
      "address": "192.168.0.2",
      "tasks": [
        "check_request_publisher",
        "client_monitor",
        "check_result_monitor"
      ],
      "metrics": {
        "cpu": {
          "user": 45.52,
          "system": 0.95
        }
      },
      "sensu": {
        "version": "1.0.0",
        "settings": {
          "hexdigest": "4041dcf9b87d3dc8523a79d944c68f99fe10f99b379989afd617201c91d75411"
        }
      },
      "timestamp": 1488240896
    }
  ]
}
{{< /highlight >}}

[1]:  ../../reference/data-store
[2]:  ../../reference/transport
[3]:  ../../reference/server
[4]:  ../../reference/clients#client-keepalives
[5]:  ../../reference/checks#check-results
[6]:  #health-get-specification
[7]:  https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
[8]:  https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern
[9]:  https://www.rabbitmq.com/
[10]: http://redis.io/
[11]: https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html
