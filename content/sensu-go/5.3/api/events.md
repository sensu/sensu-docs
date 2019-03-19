---
title: "Events API"
description: "The events API provides HTTP access to event data. Here’s a reference for the filters API in Sensu Go, including examples for returning lists of events, creating Sensu events, and more. Read on for the full reference."
version: "5.3"
product: "Sensu Go"
menu:
  sensu-go-5.3:
    parent: api
---

- [The `/events` API endpoint](#the-events-api-endpoint)
	- [`/events` (GET)](#events-get)
	- [`/events` (POST)](#events-post)
- [The `/events/:entity` API endpoint](#the-eventsentity-api-endpoint)
	- [`/events/:entity` (GET)](#eventsentity-get)
- [The `/events/:entity/:check` API endpoint](#the-eventsentitycheck-api-endpoint)
	- [`/events/:entity/:check` (GET)](#eventsentitycheck-get)
  - [`/events/:entity/:check` (PUT)](#eventsentitycheck-put)
  - [`/events/:entity/:check` (DELETE)](#eventsentitycheck-delete)

## The `/events` API endpoint

### `/events` (GET)

The `/events` API endpoint provides HTTP GET access to [event][1] data.

#### EXAMPLE {#events-get-example}

The following example demonstrates a request to the `/events` API, resulting in
a JSON Array containing [event definitions][1].

{{< highlight shell >}}
curl -H "Authorization: Bearer TOKEN" \
http://127.0.0.1:8080/api/core/v2/namespaces/default/events

HTTP/1.1 200 OK
[
  {
    "timestamp": 1542667666,
    "entity": {
      "entity_class": "agent",
      "system": {
        "hostname": "webserver01",
        "...": "...",
        "arch": "amd64"
      },
      "subscriptions": [
        "testing",
        "entity:webserver01"
      ],
      "metadata": {
        "name": "check-nginx",
        "namespace": "default",
        "labels": null,
        "annotations": null
      }
    },
    "check": {
      "check_hooks": null,
      "duration": 2.033888684,
      "command": "http_check.sh http://localhost:80",
      "handlers": [
        "slack"
      ],
      "high_flap_threshold": 0,
      "interval": 20,
      "low_flap_threshold": 0,
      "publish": true,
      "runtime_assets": [],
      "subscriptions": [
        "testing"
      ],
      "proxy_entity_name": "",
      "check_hooks": null,
      "stdin": false,
      "ttl": 0,
      "timeout": 0,
      "duration": 0.010849143,
      "output": "",
      "state": "failing",
      "status": 1,
      "total_state_change": 0,
      "last_ok": 0,
      "occurrences": 1,
      "occurrences_watermark": 1,
      "output_metric_format": "",
      "output_metric_handlers": [],
      "env_vars": null,
      "metadata": {
        "name": "check-nginx",
        "namespace": "default",
        "labels": null,
        "annotations": null
      }
    }
  }
]
{{< /highlight >}}

#### API Specification {#events-get-specification}

/events (GET)  | 
---------------|------
description    | Returns the list of events.
example url    | http://hostname:8080/api/core/v2/namespaces/default/events
response type  | Array
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< highlight shell >}}
[
  {
    "timestamp": 1542667666,
    "entity": {
      "entity_class": "agent",
      "system": {
        "hostname": "webserver01",
        "...": "...",
        "arch": "amd64"
      },
      "subscriptions": [
        "testing",
        "entity:webserver01"
      ],
      "metadata": {
        "name": "check-nginx",
        "namespace": "default",
        "labels": null,
        "annotations": null
      }
    },
    "check": {
      "check_hooks": null,
      "duration": 2.033888684,
      "command": "http_check.sh http://localhost:80",
      "handlers": [
        "slack"
      ],
      "high_flap_threshold": 0,
      "interval": 20,
      "low_flap_threshold": 0,
      "publish": true,
      "runtime_assets": [],
      "subscriptions": [
        "testing"
      ],
      "proxy_entity_name": "",
      "check_hooks": null,
      "stdin": false,
      "ttl": 0,
      "timeout": 0,
      "duration": 0.010849143,
      "output": "",
      "state": "failing",
      "status": 1,
      "total_state_change": 0,
      "last_ok": 0,
      "occurrences": 1,
      "occurrences_watermark": 1,
      "output_metric_format": "",
      "output_metric_handlers": [],
      "env_vars": null,
      "metadata": {
        "name": "check-nginx",
        "namespace": "default",
        "labels": null,
        "annotations": null
      }
    }
  }
]
{{< /highlight >}}

### `/events` (POST)

The `/events` API endpoint provides HTTP POST access to create an event and send it to the Sensu pipeline.

#### EXAMPLE {#events-post-example}

In the following example, an HTTP POST request is submitted to the `/events` API to create an event.
The request includes information about the check and entity represented by the event and returns a successful HTTP 200 OK response and the event definition.

{{< highlight shell >}}
curl -X POST \
-H "Authorization: Bearer TOKEN" \
-H 'Content-Type: application/json' \
-d '{
  "entity": {
    "entity_class": "proxy",
    "metadata": {
      "name": "my-app",
      "namespace": "default"
    }
  },
  "check": {
    "output": "Application error message",
    "state": "failing",
    "status": 2,
    "handlers": ["slack"],
    "interval": 60,
    "metadata": {
      "name": "app-check"
    }
  },
  "timestamp": 1552582569
}' \
http://127.0.0.1:8080/api/core/v2/namespaces/default/events

HTTP/1.1 200 OK
{"timestamp":1552582569,"entity":{"entity_class":"proxy","system":{"network":{"interfaces":null}},"subscriptions":null,"last_seen":0,"deregister":false,"deregistration":{},"metadata":{"name":"my-app","namespace":"default"}},"check":{"handlers":["slack"],"high_flap_threshold":0,"interval":60,"low_flap_threshold":0,"publish":false,"runtime_assets":null,"subscriptions":[],"proxy_entity_name":"","check_hooks":null,"stdin":false,"subdue":null,"ttl":0,"timeout":0,"round_robin":false,"executed":0,"history":null,"issued":0,"output":"Application error message","state":"failing","status":2,"total_state_change":0,"last_ok":0,"occurrences":0,"occurrences_watermark":0,"output_metric_format":"","output_metric_handlers":null,"env_vars":null,"metadata":{"name":"app-check"}},"metadata":{}}
{{< /highlight >}}

#### API Specification {#events-post-specification}

/events (POST) | 
----------------|------
description     | Create a Sensu event for a new entity and check combination. The [`/events/:entity/:check` PUT endpoint](#eventsentitycheck-put) offer the same functionality with the added ability to create events for existing checks and entities and to update existing events.
example URL     | http://hostname:8080/api/core/v2/namespaces/default/events
payload         | {{< highlight shell >}}
{
  "entity": {
    "entity_class": "proxy",
    "metadata": {
      "name": "my-app",
      "namespace": "default"
    }
  },
  "check": {
    "output": "Application error message",
    "state": "failing",
    "status": 2,
    "handlers": ["slack"],
    "interval": 60,
    "metadata": {
      "name": "app-check"
    }
  },
  "timestamp": 1552582569
}
{{< /highlight >}}
payload parameters | See the [payload parameters](#eventsentitycheck-put-parameters) section for the [`/events/:entity/:check` PUT endpoint](#eventsentitycheck-put).
response codes  | <ul><li>**Success**: 200 (OK)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Conflict**: 409 (Event already exists for the entity and check)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## The `/events/:entity` API endpoint {#the-eventsentity-api-endpoint}

### `/events/:entity` (GET) {#eventsentity-get}

The `/events/:entity` API endpoint provides HTTP GET access to [event data][1] specific to an `:entity`, by entity `name`.

#### EXAMPLE {#eventsentity-get-example}

In the following example, querying the `/events/:entity` API returns a list of Sensu events for the `sensu-go-sandbox` entity and a successful HTTP 200 OK response.

{{< highlight shell >}}
curl -H "Authorization: Bearer TOKEN" \
http://127.0.0.1:8080/api/core/v2/namespaces/default/events/sensu-go-sandbox

HTTP/1.1 200 OK
[
  {
    "timestamp": 1543871497,
    "entity": {
      "entity_class": "agent",
      "system": {
        "hostname": "webserver01",
        "...": "...",
        "arch": "amd64"
      },
      "subscriptions": [
        "linux",
        "entity:sensu-go-sandbox"
      ],
      "last_seen": 1543858763,
      "metadata": {
        "name": "sensu-go-sandbox",
        "namespace": "default"
      }
    },
    "check": {
      "command": "check-cpu.sh -w 75 -c 90",
      "duration": 1.054253257,
      "executed": 1543871496,
      "history": [
        {
          "status": 0,
          "executed": 1543870296
        }
      ],
      "issued": 1543871496,
      "output": "CPU OK - Usage:.50\n",
      "state": "passing",
      "status": 0,
      "total_state_change": 0,
      "last_ok": 1543871497,
      "occurrences": 1,
      "metadata": {
        "name": "check-cpu",
        "namespace": "default"
      }
    },
    "metadata": {
      "namespace": "default"
    }
  },
  {
    "timestamp": 1543871524,
    "entity": {
      "entity_class": "agent",
      "system": {
        "hostname": "webserver01",
        "...": "...",
        "arch": "amd64"
      },
      "subscriptions": [
        "linux",
        "entity:sensu-go-sandbox"
      ],
      "last_seen": 1543871523,
      "metadata": {
        "name": "sensu-go-sandbox",
        "namespace": "default"
      }
    },
    "check": {
      "handlers": [
        "keepalive"
      ],
      "executed": 1543871524,
      "history": [
        {
          "status": 0,
          "executed": 1543871124
        }
      ],
      "issued": 1543871524,
      "output": "",
      "state": "passing",
      "status": 0,
      "total_state_change": 0,
      "last_ok": 1543871524,
      "occurrences": 1,
      "metadata": {
        "name": "keepalive",
        "namespace": "default"
      }
    },
    "metadata": {}
  }
]
{{< /highlight >}}

#### API Specification {#eventsentity-get-specification}

/events/:entity (GET) | 
---------------------|------
description          | Returns a list of events for the specified entity.
example url          | http://hostname:8080/api/core/v2/namespaces/default/events/sensu-go-sandbox
response type        | Array
response codes       | <ul><li>**Success**: 200 (OK)</li><li> **Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output               | {{< highlight json >}}
[
  {
    "timestamp": 1543871524,
    "entity": {
      "entity_class": "agent",
      "system": {
        "hostname": "webserver01",
        "...": "...",
        "arch": "amd64"
      },
      "subscriptions": [
        "linux",
        "entity:sensu-go-sandbox"
      ],
      "last_seen": 1543871523,
      "metadata": {
        "name": "sensu-go-sandbox",
        "namespace": "default"
      }
    },
    "check": {
      "handlers": [
        "keepalive"
      ],
      "executed": 1543871524,
      "history": [
        {
          "status": 0,
          "executed": 1543871124
        }
      ],
      "issued": 1543871524,
      "output": "",
      "state": "passing",
      "status": 0,
      "total_state_change": 0,
      "last_ok": 1543871524,
      "occurrences": 1,
      "metadata": {
        "name": "keepalive",
        "namespace": "default"
      }
    },
    "metadata": {}
  }
]
{{< /highlight >}}

## The `/events/:entity/:check` API endpoint {#the-eventsentitycheck-api-endpoint}

### `/events/:entity/:check` (GET) {#eventsentitycheck-get}

#### API Specification {#eventsentitycheck-get-specification}

/events/:entity/:check (GET) | 
---------------------|------
description          | Returns an event for a given entity and check.
example url          | http://hostname:8080/api/core/v2/namespaces/default/events/sensu-go-sandbox/check-cpu
response type        | Map
response codes       | <ul><li>**Success**: 200 (OK)</li><li> **Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output               | {{< highlight json >}}
{
  "timestamp": 1543871524,
  "entity": {
    "entity_class": "agent",
    "system": {
      "hostname": "webserver01",
      "...": "...",
      "arch": "amd64"
    },
    "subscriptions": [
      "linux",
      "entity:sensu-go-sandbox"
    ],
    "last_seen": 1543871523,
    "metadata": {
      "name": "sensu-go-sandbox",
      "namespace": "default"
    }
  },
  "check": {
    "handlers": [
      "keepalive"
    ],
    "executed": 1543871524,
    "history": [
      {
        "status": 0,
        "executed": 1543871124
      }
    ],
    "issued": 1543871524,
    "output": "",
    "state": "passing",
    "status": 0,
    "total_state_change": 0,
    "last_ok": 1543871524,
    "occurrences": 1,
    "metadata": {
      "name": "keepalive",
      "namespace": "default"
    }
  },
  "metadata": {}
}
{{< /highlight >}}

### `/events/:entity/:check` (PUT) {#eventsentitycheck-put}

The `/events/:entity/:check` API endpoint provides HTTP PUT access to create or update an event and send it to the Sensu pipeline.

#### EXAMPLE {#eventsentitycheck-put-example}

In the following example, an HTTP PUT request is submitted to the `/events/:entity/:check` API to create an event for the `my-app` entity and the `app-check` check, resulting in a 200 (OK) HTTP response code and the event definition.

{{< highlight shell >}}
curl -X PUT \
-H "Authorization: Bearer TOKEN" \
-H 'Content-Type: application/json' \
-d '{
  "entity": {
    "entity_class": "proxy",
    "metadata": {
      "name": "my-app",
      "namespace": "default"
    }
  },
  "check": {
    "output": "Application error message",
    "state": "failing",
    "status": 2,
    "handlers": ["slack"],
    "interval": 60,
    "metadata": {
      "name": "app-check"
    }
  },
  "timestamp": 1552582569
}' \
http://127.0.0.1:8080/api/core/v2/namespaces/default/events/my-app/app-check

HTTP/1.1 200 OK
{"timestamp":1552582569,"entity":{"entity_class":"proxy","system":{"network":{"interfaces":null}},"subscriptions":null,"last_seen":0,"deregister":false,"deregistration":{},"metadata":{"name":"my-app","namespace":"default"}},"check":{"handlers":["slack"],"high_flap_threshold":0,"interval":60,"low_flap_threshold":0,"publish":false,"runtime_assets":null,"subscriptions":[],"proxy_entity_name":"","check_hooks":null,"stdin":false,"subdue":null,"ttl":0,"timeout":0,"round_robin":false,"executed":0,"history":null,"issued":0,"output":"Application error message","state":"failing","status":2,"total_state_change":0,"last_ok":0,"occurrences":0,"occurrences_watermark":0,"output_metric_format":"","output_metric_handlers":null,"env_vars":null,"metadata":{"name":"app-check"}},"metadata":{}}
{{< /highlight >}}

#### API Specification {#eventsentitycheck-put-specification}

/events/:entity/:check (PUT) | 
----------------|------
description     | Creates an event for a given entity and check.
example url     | http://hostname:8080/api/core/v2/namespaces/default/events/my-app/app-check
payload         | {{< highlight shell >}}
{
  "entity": {
    "entity_class": "proxy",
    "metadata": {
      "name": "my-app",
      "namespace": "default"
    }
  },
  "check": {
    "output": "Application error message",
    "state": "failing",
    "status": 2,
    "handlers": ["slack"],
    "interval": 60,
    "metadata": {
      "name": "app-check"
    }
  },
  "timestamp": 1552582569
}
{{< /highlight >}}
payload parameters | See the [payload parameters](#eventsentitycheck-put-parameters) section below.
response codes   | <ul><li>**Success**: 200 (OK)</li><li> **Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

#### Payload parameters {#eventsentitycheck-put-parameters}

The `/events/:entity/:check` PUT endpoint requires a request payload containing an `entity` scope and a `check` scope.
The `entity` scope contains information about the component represented by the event.
At a minimum, Sensu requires the `entity` scope to contain the `entity_class` (`agent` or `proxy`) and the entity `name` and `namespace` within a `metadata` scope.
For more information about entity attributes, see the [entity specification](../../reference/entities#specification).

The `check` scope should contain information about the event status and how the event was created.
At a minimum, Sensu requires the `check` scope to contain a `name` within a `metadata` scope and either an `interval` or `cron` attribute.
For more information about check attributes, see the [check specification](../../reference/checks#specification).

**Example event payload with minimum required attributes**

{{< highlight json >}}
{
  "entity": {
    "entity_class": "proxy",
    "metadata": {
      "name": "my-app",
      "namespace": "default"
    }
  },
  "check": {
    "interval": 60,
    "metadata": {
      "name": "app-check"
    }
  }
}
{{< /highlight >}}

The minimum required attributes shown above let you create an event using the `/events/:entity/:check` PUT endpoint, however the request can include any attributes defined in the [event specification](../../reference/events).
To create useful, actionable events, we recommend check attributes such as `status`, `output`, `state`, and `handlers`.
For more information about these attributes and their available values, see the [event specification](../../reference/events).

While a `timestamp` is not required to create an event, Sensu assigns a timestamp of `0` (January 1, 1970) to events without a specified timestamp, so we recommend adding a Unix timestamp when creating events.

**Example event payload with minimum recommended attributes**

{{< highlight json >}}
{
  "entity": {
    "entity_class": "proxy",
    "metadata": {
      "name": "my-app",
      "namespace": "default"
    }
  },
  "check": {
    "output": "Application error message",
    "state": "failing",
    "status": 2,
    "handlers": ["slack"],
    "interval": 60,
    "metadata": {
      "name": "app-check"
    }
  },
  "timestamp": 1552582569
}
{{< /highlight >}}

#### Creating metric events

Sensu events can contain metrics in Sensu metric format.
See the [events reference](../../events) and for more information about Sensu metric format.

**Example event payload including metrics**

{{< highlight json >}}
{
  "entity": {
    "entity_class": "proxy",
    "metadata": {
      "name": "my-app",
      "namespace": "default"
    }
  },
  "check": {
    "status": 0,
    "output_metric_handlers": ["influxdb"],
    "interval": 60,
    "metadata": {
      "name": "app-metrics"
    }
  },
  "metrics": {
    "handlers": [
      "influxdb"
    ],
    "points": [
      {
        "name": "my-app.app-metrics.time_total",
        "tags": [],
        "timestamp": 1552506033,
        "value": 0.005
      },
      {
        "name": "my-app.app-metrics.time_namelookup",
        "tags": [],
        "timestamp": 1552506033,
        "value": 0.004
      }
    ]
  },
  "timestamp": 1552582569
}
{{< /highlight >}}

### `/events/:entity/:check` (DELETE) {#eventsentitycheck-delete}

### EXAMPLE
The following example shows a request to delete the event produced by the `sensu-go-sandbox` entity and `check-cpu` check, resulting in a successful HTTP 204 No Content response.

{{< highlight shell >}}
curl -X DELETE \
-H "Authorization: Bearer TOKEN" \
http://127.0.0.1:8080/api/core/v2/namespaces/default/events/sensu-go-sandbox/check-cpu 

HTTP/1.1 204 No Content
{{< /highlight >}}

#### API Specification {#eventsentitycheck-delete-specification}

/events/:entity/:check (DELETE) | 
--------------------------|------
description               | Deletes the event created by the specified entity using the specified check
example url               | http://hostname:8080/api/core/v2/namespaces/default/events/sensu-go-sandbox/check-cpu 
response codes            | <ul><li>**Success**: 204 (No Content)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

[1]: ../../reference/events
