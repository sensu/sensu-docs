---
title: "Events API"
description: "The Sensu events API provides HTTP access to event data. This reference includes examples for returning lists of events, creating Sensu events, and more. Read on for the full reference."
version: "5.18"
product: "Sensu Go"
menu:
  sensu-go-5.18:
    parent: api
---

- [The `/events` API endpoint](#the-events-api-endpoint)
	- [`/events` (GET)](#events-get)
	- [`/events` (POST)](#events-post)
- [The `/events/:entity` API endpoint](#the-eventsentity-api-endpoint)
	- [`/events/:entity` (GET)](#eventsentity-get)
- [The `/events/:entity/:check` API endpoint](#the-eventsentitycheck-api-endpoint)
	- [`/events/:entity/:check` (GET)](#eventsentitycheck-get)
  - [`/events/:entity/:check` (POST)](#eventsentitycheck-post)
  - [`/events/:entity/:check` (PUT)](#eventsentitycheck-put)
  - [`/events/:entity/:check` (DELETE)](#eventsentitycheck-delete)

## The `/events` API endpoint

### `/events` (GET)

The `/events` API endpoint provides HTTP GET access to [event][1] data.

#### EXAMPLE {#events-get-example}

The following example demonstrates a request to the `/events` API endpoint, resulting in a JSON array that contains [event definitions][1].

{{< highlight shell >}}
curl -X GET \
http://127.0.0.1:8080/api/core/v2/namespaces/default/events \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN"

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
pagination     | This endpoint supports [pagination][2] using the `limit` and `continue` query parameters.
response filtering | This endpoint supports [API response filtering][10].
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

In the following example, an HTTP POST request is submitted to the `/events` API endpoint to create an event.
The request includes information about the check and entity represented by the event and returns a successful HTTP `200 OK` response and the event definition.

{{< highlight shell >}}
curl -X POST \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN" \
-H 'Content-Type: application/json'
-d '{
  "entity": {
    "entity_class": "proxy",
    "metadata": {
      "name": "server1",
      "namespace": "default"
    }
  },
  "check": {
    "output": "Server error",
    "state": "failing",
    "status": 2,
    "handlers": ["slack"],
    "interval": 60,
    "metadata": {
      "name": "server-health"
    }
  }
}' \
http://127.0.0.1:8080/api/core/v2/namespaces/default/events

HTTP/1.1 200 OK
{"timestamp":1552582569,"entity":{"entity_class":"proxy","system":{"network":{"interfaces":null}},"subscriptions":null,"last_seen":0,"deregister":false,"deregistration":{},"metadata":{"name":"server1","namespace":"default"}},"check":{"handlers":["slack"],"high_flap_threshold":0,"interval":60,"low_flap_threshold":0,"publish":false,"runtime_assets":null,"subscriptions":[],"proxy_entity_name":"","check_hooks":null,"stdin":false,"subdue":null,"ttl":0,"timeout":0,"round_robin":false,"executed":0,"history":null,"issued":0,"output":"Server error","state":"failing","status":2,"total_state_change":0,"last_ok":0,"occurrences":0,"occurrences_watermark":0,"output_metric_format":"","output_metric_handlers":null,"env_vars":null,"metadata":{"name":"server-health"}},"metadata":{}}
{{< /highlight >}}

#### API Specification {#events-post-specification}

/events (POST) | 
----------------|------
description     | Creates a new Sensu event. To update an existing event, use the [`/events` PUT endpoint][11].<br><br>If you create a new event referencing an entity that does not already exist, the sensu-backend will automatically create a proxy entity when the event is published.
example URL     | http://hostname:8080/api/core/v2/namespaces/default/events
payload         | {{< highlight shell >}}
{
  "entity": {
    "entity_class": "proxy",
    "metadata": {
      "name": "server1",
      "namespace": "default"
    }
  },
  "check": {
    "output": "Server error",
    "state": "failing",
    "status": 2,
    "handlers": ["slack"],
    "interval": 60,
    "metadata": {
      "name": "server-health"
    }
  }
}
{{< /highlight >}}
response codes  | <ul><li>**Success**: 200 (OK)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## The `/events/:entity` API endpoint {#the-eventsentity-api-endpoint}

### `/events/:entity` (GET) {#eventsentity-get}

The `/events/:entity` API endpoint provides HTTP GET access to [event data][1] specific to an `:entity`, by entity `name`.

#### EXAMPLE {#eventsentity-get-example}

In the following example, querying the `/events/:entity` API endpoint returns a list of Sensu events for the `sensu-go-sandbox` entity and a successful HTTP `200 OK` response.

{{< highlight shell >}}
curl -X GET \
http://127.0.0.1:8080/api/core/v2/namespaces/default/events/sensu-go-sandbox \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN"

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
pagination           | This endpoint supports [pagination][2] using the `limit` and `continue` query parameters.
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

The `/events/:entity/:check` API endpoint provides HTTP GET access to [event][1] data for the specified entity and check.

#### EXAMPLE {#eventsentitycheck-get-example}

In the following example, an HTTP GET request is submitted to the `/events/:entity/:check` API endpoint to retrieve the event for the `server1` entity and the `server-health` check.

{{< highlight shell >}}
curl -X GET \
http://127.0.0.1:8080/api/core/v2/namespaces/default/events/server1/server-health \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN"

HTTP/1.1 200 OK

{
    "timestamp": 1577724113,
    "entity": {
        "entity_class": "proxy",
        "system": {
            "network": {
                "interfaces": null
            }
        },
        "subscriptions": null,
        "last_seen": 0,
        "deregister": false,
        "deregistration": {},
        "metadata": {
            "name": "server1",
            "namespace": "default"
        },
        "sensu_agent_version": ""
    },
    "check": {
        "handlers": [
            "slack"
        ],
        "high_flap_threshold": 0,
        "interval": 60,
        "low_flap_threshold": 0,
        "publish": false,
        "runtime_assets": null,
        "subscriptions": [],
        "proxy_entity_name": "",
        "check_hooks": null,
        "stdin": false,
        "subdue": null,
        "ttl": 0,
        "timeout": 0,
        "round_robin": false,
        "executed": 0,
        "history": [
            {
                "status": 1,
                "executed": 0
            },
            {
                "status": 2,
                "executed": 0
            },
            {
                "status": 1,
                "executed": 0
            }
        ],
        "issued": 0,
        "output": "Server error",
        "state": "failing",
        "status": 1,
        "total_state_change": 0,
        "last_ok": 0,
        "occurrences": 1,
        "occurrences_watermark": 1,
        "output_metric_format": "",
        "output_metric_handlers": null,
        "env_vars": null,
        "metadata": {
            "name": "server-health",
            "namespace": "default"
        }
    },
    "metadata": {}
}
{{< /highlight >}}

The request returns an HTTP `200 OK` response and the resulting event definition.

#### API Specification {#eventsentitycheck-get-specification}

/events/:entity/:check (GET) | 
---------------------|------
description          | Returns an event for the specified entity and check.
example url          | http://hostname:8080/api/core/v2/namespaces/default/events/server1/server-health
response type        | Map
response codes       | <ul><li>**Success**: 200 (OK)</li><li> **Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output               | {{< highlight json >}}
{
    "timestamp": 1577724113,
    "entity": {
        "entity_class": "proxy",
        "system": {
            "network": {
                "interfaces": null
            }
        },
        "subscriptions": null,
        "last_seen": 0,
        "deregister": false,
        "deregistration": {},
        "metadata": {
            "name": "server1",
            "namespace": "default"
        },
        "sensu_agent_version": ""
    },
    "check": {
        "handlers": [
            "slack"
        ],
        "high_flap_threshold": 0,
        "interval": 60,
        "low_flap_threshold": 0,
        "publish": false,
        "runtime_assets": null,
        "subscriptions": [],
        "proxy_entity_name": "",
        "check_hooks": null,
        "stdin": false,
        "subdue": null,
        "ttl": 0,
        "timeout": 0,
        "round_robin": false,
        "executed": 0,
        "history": [
            {
                "status": 1,
                "executed": 0
            },
            {
                "status": 2,
                "executed": 0
            },
            {
                "status": 1,
                "executed": 0
            }
        ],
        "issued": 0,
        "output": "Server error",
        "state": "failing",
        "status": 1,
        "total_state_change": 0,
        "last_ok": 0,
        "occurrences": 1,
        "occurrences_watermark": 1,
        "output_metric_format": "",
        "output_metric_handlers": null,
        "env_vars": null,
        "metadata": {
            "name": "server-health",
            "namespace": "default"
        }
    },
    "metadata": {}
}
{{< /highlight >}}

### `/events/:entity/:check` (POST) {#eventsentitycheck-post}

The `/events/:entity/:check` API endpoint provides HTTP POST access to create or update an event and send it to the Sensu pipeline.

#### EXAMPLE {#eventsentitycheck-post-example}

In the following example, an HTTP POST request is submitted to the `/events/:entity/:check` API endpoint to create an event for the `server1` entity and the `server-health` check and process it using the `slack` event handler.
The event includes a status code of `1`, indicating a warning, and an output message of `Server error`.

{{< highlight shell >}}
curl -X POST \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN" \
-H 'Content-Type: application/json'
-d '{
  "entity": {
    "entity_class": "proxy",
    "metadata": {
      "name": "server1",
      "namespace": "default"
    }
  },
  "check": {
    "output": "Server error",
    "status": 1,
    "handlers": ["slack"],
    "interval": 60,
    "metadata": {
      "name": "server-health"
    }
  }
}' \
http://127.0.0.1:8080/api/core/v2/namespaces/default/events/server1/server-health
{{< /highlight >}}

The request returns an HTTP `200 OK` response and the resulting event definition.

_**NOTE**: A namespace is not required to create the event. The event will use the namespace in the URL by default._

{{< highlight shell >}}
HTTP/1.1 200 OK
{"timestamp":1552582569,"entity":{"entity_class":"proxy","system":{"network":{"interfaces":null}},"subscriptions":null,"last_seen":0,"deregister":false,"deregistration":{},"metadata":{"name":"server1","namespace":"default"}},"check":{"handlers":["slack"],"high_flap_threshold":0,"interval":60,"low_flap_threshold":0,"publish":false,"runtime_assets":null,"subscriptions":[],"proxy_entity_name":"","check_hooks":null,"stdin":false,"subdue":null,"ttl":0,"timeout":0,"round_robin":false,"executed":0,"history":null,"issued":0,"output":"Server error","status":1,"total_state_change":0,"last_ok":0,"occurrences":0,"occurrences_watermark":0,"output_metric_format":"","output_metric_handlers":null,"env_vars":null,"metadata":{"name":"server-health"}},"metadata":{}}
{{< /highlight >}}

You can use sensuctl or the [Sensu dashboard][4] to see the event:

{{< highlight shell >}}
sensuctl event list
{{< /highlight >}}

You should see the event with the status and output specified in the request:

{{< highlight shell >}}
    Entity        Check                   Output                 Status   Silenced             Timestamp            
────────────── ───────────── ─────────────────────────────────── ──────── ────────── ─────────────────────────────── 
    server1    server-health   Server error                         1       false      2019-03-14 16:56:09 +0000 UTC 
{{< /highlight >}}

#### API Specification {#eventsentitycheck-post-specification}

/events/:entity/:check (POST) | 
----------------|------
description     | Creates an event for the specified entity and check.
example url     | http://hostname:8080/api/core/v2/namespaces/default/events/server1/server-health
payload         | {{< highlight shell >}}
{
  "entity": {
    "entity_class": "proxy",
    "metadata": {
      "name": "server1",
      "namespace": "default"
    }
  },
  "check": {
    "output": "Server error",
    "status": 1,
    "handlers": ["slack"],
    "interval": 60,
    "metadata": {
      "name": "server-health"
    }
  }
}
{{< /highlight >}}
response codes   | <ul><li>**Success**: 200 (OK)</li><li> **Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

### `/events/:entity/:check` (PUT) {#eventsentitycheck-put}

The `/events/:entity/:check` API endpoint provides HTTP PUT access to create or update an event and send it to the Sensu pipeline.

#### EXAMPLE {#eventsentitycheck-put-example}

In the following example, an HTTP PUT request is submitted to the `/events/:entity/:check` API endpoint to create an event for the `server1` entity and the `server-health` check and process it using the `slack` event handler.
The event includes a status code of `1`, indicating a warning, and an output message of `Server error`.

{{< highlight shell >}}
curl -X PUT \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN" \
-H 'Content-Type: application/json'
-d '{
  "entity": {
    "entity_class": "proxy",
    "metadata": {
      "name": "server1",
      "namespace": "default"
    }
  },
  "check": {
    "output": "Server error",
    "status": 1,
    "handlers": ["slack"],
    "interval": 60,
    "metadata": {
      "name": "server-health"
    }
  }
}' \
http://127.0.0.1:8080/api/core/v2/namespaces/default/events/server1/server-health
{{< /highlight >}}

The request returns an HTTP `200 OK` response and the resulting event definition.

_**NOTE**: A namespace is not required to create the event. The event will use the namespace in the URL by default._

{{< highlight shell >}}
HTTP/1.1 200 OK
{"timestamp":1552582569,"entity":{"entity_class":"proxy","system":{"network":{"interfaces":null}},"subscriptions":null,"last_seen":0,"deregister":false,"deregistration":{},"metadata":{"name":"server1","namespace":"default"}},"check":{"handlers":["slack"],"high_flap_threshold":0,"interval":60,"low_flap_threshold":0,"publish":false,"runtime_assets":null,"subscriptions":[],"proxy_entity_name":"","check_hooks":null,"stdin":false,"subdue":null,"ttl":0,"timeout":0,"round_robin":false,"executed":0,"history":null,"issued":0,"output":"Server error","status":1,"total_state_change":0,"last_ok":0,"occurrences":0,"occurrences_watermark":0,"output_metric_format":"","output_metric_handlers":null,"env_vars":null,"metadata":{"name":"server-health"}},"metadata":{}}
{{< /highlight >}}

You can use sensuctl or the [Sensu dashboard][4] to see the event:

{{< highlight shell >}}
sensuctl event list
{{< /highlight >}}

You should see the event with the status and output specified in the request:

{{< highlight shell >}}
    Entity        Check                   Output                 Status   Silenced             Timestamp            
────────────── ───────────── ─────────────────────────────────── ──────── ────────── ─────────────────────────────── 
    server1    server-health   Server error                         1       false      2019-03-14 16:56:09 +0000 UTC 
{{< /highlight >}}

#### API Specification {#eventsentitycheck-put-specification}

/events/:entity/:check (PUT) | 
----------------|------
description     | Creates an event for the specified entity and check.
example url     | http://hostname:8080/api/core/v2/namespaces/default/events/server1/server-health
payload         | {{< highlight shell >}}
{
  "entity": {
    "entity_class": "proxy",
    "metadata": {
      "name": "server1",
      "namespace": "default"
    }
  },
  "check": {
    "output": "Server error",
    "status": 1,
    "handlers": ["slack"],
    "interval": 60,
    "metadata": {
      "name": "server-health"
    }
  }
}
{{< /highlight >}}
payload parameters | See the [payload parameters][5] section below.
response codes   | <ul><li>**Success**: 200 (OK)</li><li> **Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

#### Payload parameters {#eventsentitycheck-put-parameters}

The `/events/:entity/:check` PUT endpoint requires a request payload that contains an `entity` scope and a `check` scope.

- The `entity` scope contains information about the component of your infrastructure represented by the event.
At minimum, Sensu requires the `entity` scope to contain the `entity_class` (`agent` or `proxy`) and the entity `name` and `namespace` within a `metadata` scope.
For more information about entity attributes, see the [entity specification][6].
- The `check` scope contains information about the event status and how the event was created.
At minimum, Sensu requires the `check` scope to contain a `name` within a `metadata` scope and either an `interval` or `cron` attribute.
For more information about check attributes, see the [check specification][7].

**Example request with minimum required event attributes**

{{< highlight shell >}}
curl -X PUT \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN" \
-H 'Content-Type: application/json'
-d '{
  "entity": {
    "entity_class": "proxy",
    "metadata": {
      "name": "server1"
    }
  },
  "check": {
    "interval": 60,
    "metadata": {
      "name": "server-health"
    }
  }
}' \
http://127.0.0.1:8080/api/core/v2/namespaces/default/events/server1/server-health
{{< /highlight >}}

The minimum required attributes let you create an event using the `/events/:entity/:check` PUT endpoint, but the request can include any attributes defined in the [event specification][8].
To create useful, actionable events, we recommend adding check attributes such as the event `status` (`0` for OK, `1` for warning, `2` for critical), an `output` message, and one or more event `handlers`.
For more information about these attributes and their available values, see the [event specification][8].

**Example request with minimum recommended event attributes**

{{< highlight shell >}}
curl -X PUT \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN" \
-H 'Content-Type: application/json'
-d '{
  "entity": {
    "entity_class": "proxy",
    "metadata": {
      "name": "server1",
      "namespace": "default"
    }
  },
  "check": {
    "output": "Server error",
    "status": 1,
    "handlers": ["slack"],
    "interval": 60,
    "metadata": {
      "name": "server-health"
    }
  }
}' \
http://127.0.0.1:8080/api/core/v2/namespaces/default/events/server1/server-health
{{< /highlight >}}

#### Create metrics events

In addition to the `entity` and `check` scopes, Sensu events can include a `metrics` scope that contains metrics in Sensu metric format.
See the [events reference][9] and for more information about Sensu metric format.

**Example request including metrics**

{{< highlight shell >}}
curl -X PUT \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN" \
-H 'Content-Type: application/json'
-d '{
  "entity": {
    "entity_class": "proxy",
    "metadata": {
      "name": "server1",
      "namespace": "default"
    }
  },
  "check": {
    "status": 0,
    "output_metric_handlers": ["influxdb"],
    "interval": 60,
    "metadata": {
      "name": "server-metrics"
    }
  },
  "metrics": {
    "handlers": [
      "influxdb"
    ],
    "points": [
      {
        "name": "server1.server-metrics.time_total",
        "tags": [],
        "timestamp": 1552506033,
        "value": 0.005
      },
      {
        "name": "server1.server-metrics.time_namelookup",
        "tags": [],
        "timestamp": 1552506033,
        "value": 0.004
      }
    ]
  }
}' \
http://127.0.0.1:8080/api/core/v2/namespaces/default/events/server1/server-metrics
{{< /highlight >}}

### `/events/:entity/:check` (DELETE) {#eventsentitycheck-delete}

#### EXAMPLE {#eventsentitycheck-delete-example}

The following example shows a request to the `/events/:entity/:check` API endpoint to delete the event produced by the `sensu-go-sandbox` entity and `check-cpu` check, resulting in a successful HTTP `204 No Content` response.

{{< highlight shell >}}
curl -X DELETE \
http://127.0.0.1:8080/api/core/v2/namespaces/default/events/sensu-go-sandbox/check-cpu \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN"

HTTP/1.1 204 No Content
{{< /highlight >}}

#### API Specification {#eventsentitycheck-delete-specification}

/events/:entity/:check (DELETE) | 
--------------------------|------
description               | Deletes the event created by the specified entity using the specified check.
example url               | http://hostname:8080/api/core/v2/namespaces/default/events/sensu-go-sandbox/check-cpu 
response codes            | <ul><li>**Success**: 204 (No Content)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

[1]: ../../reference/events/
[2]: ../overview#pagination
[3]: #eventsentitycheck-put
[4]: ../../dashboard/overview/
[5]: #eventsentitycheck-put-parameters
[6]: ../../reference/entities#entities-specification
[7]: ../../reference/checks#check-specification
[8]: ../../reference/events/
[9]: ../../reference/events#metrics
[10]: ../overview#response-filtering
[11]: #eventsentitycheck-put
