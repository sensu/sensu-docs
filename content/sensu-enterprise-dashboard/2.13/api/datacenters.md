---
title: "Datacenters API"
description: "Sensu Datacenters API reference documentation."
product: "Sensu Enterprise Dashboard"
version: "2.13"
menu:
  sensu-enterprise-dashboard-2.13:
    parent: api
---

- [The `/datacenters` API endpoint](#the-datacenters-api-endpoint)
  - [`/datacenters` (GET)](#datacenters-get)
- [The `/datacenters/:datacenter` API endpoint](#the-datacentersdatacenter-api-endpoint)
  - [`/datacenters/:datacenter` (GET)](#datacentersdatacenter-get)

## The `/datacenters` API endpoint

The `/datacenters` API endpoint provides HTTP GET access to datacenter
information.

### `/datacenters` (GET)

#### EXAMPLE {#datacenters-get-example}

The following example demonstrates a request to the `/datacenters` API, resulting in
a JSON Array of JSON Hashes containing datacenter information.

{{< highlight shell >}}
$ curl -s http://127.0.0.1:3000/datacenters | jq .
[
  {
    "name": "us_west1",
    "info": {
      "...": "..."
    },
    "metrics": {
      "...": "..."
    }
  },
  {
    "name": "us_east1",
    "info": {
      "...": "..."
    },
    "metrics": {
      "...": "..."
    }
  }
]
{{< /highlight >}}

#### API Specification {#datacenters-get-specification}

/datacenters (GET)  | 
---------------|------
description    | Returns a list of datacenters. See the [`/datacenters/:datacenter` endpoint](#datacentersdatacenter-get) for a complete example of a datacenter response.
example url    | http://hostname:3000/datacenters
response type  | Array
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< highlight shell >}}[
  {
    "name": "us_west1",
    "info": {
      "...": "..."
    },
    "metrics": {
      "...": "..."
    }
  },
  {
    "name": "us_east1",
    "info": {
      "...": "..."
    },
    "metrics": {
      "...": "..."
    }
  }
]
{{< /highlight >}}

## The `/datacenters/:datacenter` API endpoint {#the-datacentersdatacenter-api-endpoint}

The `/datacenters/:datacenter` API endpoints provide HTTP GET access to
specific datacenter information, by datacenter name.

### `/datacenters/:datacenter` (GET) {#datacentersdatacenter-get}

#### EXAMPLE {#datacentersdatacenter-get-example}

In the following example, querying the `/datacenters/:datacenter` API returns a JSON Hash
containing information for the datacenter named `us_west1`.

{{< highlight shell >}}
$ curl -s http://127.0.0.1:3000/datacenters/us_west1 | jq .
{
  "name": "us_west1",
  "info": {
    "redis": {
      "connected": true
    },
    "sensu": {
      "enterprise_version": "3.1.0",
      "settings": {
        "hexdigest": "bffd97cec063b73a83c2fab60516cd72f4ef089df39f84aff3b671b5a8e1947e"
      },
      "version": "1.4.3"
    },
    "servers": [
      {
        "id": "2a1a6280-6d44-4097-a640-b73a3bca49d6",
        "hostname": "sensu-sandbox",
        "address": "10.0.2.15",
        "metrics": {
          "cpu": {
            "system": 27.49,
            "user": 231.55
          }
        },
        "sensu": {
          "enterprise_version": "3.1.0",
          "settings": {
            "hexdigest": "bffd97cec063b73a83c2fab60516cd72f4ef089df39f84aff3b671b5a8e1947e"
          },
          "version": "1.4.3"
        },
        "tasks": [
          "check_request_publisher",
          "metric_calculator",
          "client_monitor",
          "check_result_monitor",
          "metric_counter_pruner"
        ],
        "timestamp": 1538597542
      }
    ],
    "transport": {
      "connected": true,
      "keepalives": {
        "messages": 0,
        "consumers": 1
      },
      "results": {
        "messages": 0,
        "consumers": 1
      }
    }
  },
  "metrics": {
    "aggregates": 0,
    "checks": 3,
    "clients": 1,
    "events": 0,
    "silenced": 0,
    "stashes": 0
  }
}{{< /highlight >}}

The following example demonstrates a request for datacenter information for a non-existent
datacenter named `non_existent_datacenter`, which results in a [404 (Not Found) HTTP
response code][3].

{{< highlight shell >}}
$ curl -s -i http://127.0.0.1:3000/datacenters/non_existent_datacenter
HTTP/1.1 404 Not Found
Content-Type: application/json
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Credentials: true
Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization
Content-Length: 0
Connection: keep-alive
Server: thin
{{< /highlight >}}

#### API Specification {#datacentersdatacenter-get-specification}

/datacenters/:datacenter (GET) | 
---------------------|------
description          | Returns a datacenter.
example url          | http://hostname:3000/datacenters/us_west1
response type        | Hash
response codes       | <ul><li>**Success**: 200 (OK)</li><li> **Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output               | {{< highlight json >}}{
  "name": "us_west1",
  "info": {
    "redis": {
      "connected": true
    },
    "sensu": {
      "enterprise_version": "3.1.0",
      "settings": {
        "hexdigest": "bffd97cec063b73a83c2fab60516cd72f4ef089df39f84aff3b671b5a8e1947e"
      },
      "version": "1.4.3"
    },
    "servers": [
      {
        "id": "2a1a6280-6d44-4097-a640-b73a3bca49d6",
        "hostname": "sensu-sandbox",
        "address": "10.0.2.15",
        "metrics": {
          "cpu": {
            "system": 27.49,
            "user": 231.55
          }
        },
        "sensu": {
          "enterprise_version": "3.1.0",
          "settings": {
            "hexdigest": "bffd97cec063b73a83c2fab60516cd72f4ef089df39f84aff3b671b5a8e1947e"
          },
          "version": "1.4.3"
        },
        "tasks": [
          "check_request_publisher",
          "metric_calculator",
          "client_monitor",
          "check_result_monitor",
          "metric_counter_pruner"
        ],
        "timestamp": 1538597542
      }
    ],
    "transport": {
      "connected": true,
      "keepalives": {
        "messages": 0,
        "consumers": 1
      },
      "results": {
        "messages": 0,
        "consumers": 1
      }
    }
  },
  "metrics": {
    "aggregates": 0,
    "checks": 3,
    "clients": 1,
    "events": 0,
    "silenced": 0,
    "stashes": 0
  }
}
{{< /highlight >}}

[3]:  https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
