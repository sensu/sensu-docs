---
title: "Events API"
description: "Sensu Go events API reference documentation"
version: "5.0"
product: "Sensu Go"
menu:
  sensu-go-5.0:
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

/events (POST) | 
----------------|------
description     | Create a Sensu event.
example URL     | http://hostname:8080/api/core/v2/namespaces/default/events
payload         | {{< highlight shell >}}
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
{{< /highlight >}}
response codes  | <ul><li>**Success**: 200 (OK)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

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

#### EXAMPLE {#eventsentitycheck-put-example}

In the following example, an HTTP PUT request is submitted to the `/events/:entity/:check` API to create an event for the `sensu-go-entity` entity and the `check-cpu` check, resulting in a 200 (OK) HTTP response code.

{{< highlight shell >}}
curl -X PUT \
-H "Authorization: Bearer TOKEN" \
-H 'Content-Type: application/json' \
-d '{
  "entity": {
    "entity_class": "agent",
    "metadata": {
      "name": "sensu-go-sandbox",
      "namespace": "default"
    }
  },
  "check": {
    "interval": 60,
    "metadata": {
      "name": "check-cpu",
      "namespace": "default"
    }
  }
}' \
http://127.0.0.1:8080/api/core/v2/namespaces/default/events/sensu-go-sandbox/check-cpu

HTTP/1.1 200 OK
{{< /highlight >}}


#### API Specification {#eventsentitycheck-put-specification}

/events/:entity/:check (PUT) | 
----------------|------
description     | Creates an event for a given entity and check.
example url     | http://hostname:8080/api/core/v2/namespaces/default/events/sensu-go-sandbox/check-cpu
payload         | {{< highlight shell >}}
{
  "entity": {
    "entity_class": "agent",
    "metadata": {
      "name": "sensu-go-sandbox",
      "namespace": "default"
    }
  },
  "check": {
    "interval": 60,
    "metadata": {
      "name": "check-cpu",
      "namespace": "default"
    }
  }
}
{{< /highlight >}}
payload parameters | <ul><li>`entity` scope containing the `entity_class` and a `metadata` scope containing `name` (string) and `namespace` (string)</li><li>`check` scope containing `interval` (integer) or `cron` (string), and a `metadata` scope containing `name` (string) and `namespace` (string)</li>
response codes   | <ul><li>**Success**: 200 (OK)</li><li> **Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

### `/events/:entity/:check` (DELETE) {#eventsentitycheck-delete}

### EXAMPLE
The following example shows a request to delete the event produced by the `sensu-go-sandbox` entity and `check-cpu` check, resulting in a successful HTTP 204 No Content response.

{{< highlight shell >}}
curl -X DELETE \
-H "TOKEN" \
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
