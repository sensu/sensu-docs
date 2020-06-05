---
title: "Web UI configuration API"
linkTitle: "Web UI Configuration API"
description: "The Sensu web configuration API provides HTTP access to the global web UI configuration. This reference includes examples for returning the global web UI configuration and adding or updating the web UI configuration. Read on for the full reference."
version: "5.21"
product: "Sensu Go"
menu:
  sensu-go-5.21:
    parent: api
---

- [The `/config` API endpoint](#the-config-api-endpoint)
  - [`/config` (GET)](#config-get)
- [The `/config/:globalconfig` API endpoint](#the-configglobalconfig-api-endpoint)
  - [`/config/:globalconfig` (GET)](#configglobalconfig-get)
  - [`/config/:globalconfig` (PUT)](#configglobalconfig-put)
  - [`/config/:globalconfig` (DELETE)](#configglobalconfig-delete)

**COMMERCIAL FEATURE**: Access web UI configuration in the packaged Sensu Go distribution.
For more information, see [Get started with commercial features][1].

## The `/config` API endpoint

### `/config` (GET)

The `/config` API endpoint provides HTTP GET access to the global web UI configuration.

#### EXAMPLE {#config-get-example}

The following example demonstrates a request to the `/config` API endpoint, resulting in a JSON array that contains the global web UI configuration.

{{< highlight shell >}}
curl -X GET \
http://127.0.0.1:8080/api/enterprise/web/v1/config \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN" \
-H 'Content-Type: application/json'

HTTP/1.1 200 OK
[
  {
    "type": "GlobalConfig",
    "api_version": "web/v1",
    "metadata": {
      "name": "custom-web-ui",
      "created_by": "admin"
    },
    "spec": {
      "always_show_local_cluster": false,
      "default_preferences": {
        "page_size": 50,
        "theme": "sensu"
      },
      "link_policy": {
        "allow_list": true,
        "urls": [
          "https://example.com",
          "steamapp://34234234",
          "//google.com",
          "//*.google.com",
          "//bob.local"
        ]
      }
    }
  }
]
{{< /highlight >}}

#### API Specification {#config-get-specification}

/web (GET)  | 
---------------|------
description    | Returns the list of global web UI configurations.
example url    | http://hostname:8080/api/enterprise/web/v1/config
response type  | Map
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< highlight shell >}}
[
  {
    "type": "GlobalConfig",
    "api_version": "web/v1",
    "metadata": {
      "name": "custom-web-ui",
      "created_by": "admin"
    },
    "spec": {
      "always_show_local_cluster": false,
      "default_preferences": {
        "page_size": 50,
        "theme": "sensu"
      },
      "link_policy": {
        "allow_list": true,
        "urls": [
          "https://example.com",
          "steamapp://34234234",
          "//google.com",
          "//*.google.com",
          "//bob.local"
        ]
      }
    }
  }
]
{{< /highlight >}}

## The `/config/:globalconfig` API endpoint {#the-configglobalconfig-api-endpoint}

### `/config/:globalconfig` (GET) {#configglobalconfig-get}

The `/config/:globalconfig` API endpoint provides HTTP GET access to global web UI configuration data, specified by configuration name.

#### EXAMPLE {#configglobalconfig-get-example}

In the following example, querying the `/config/:globalconfig` API endpoint returns a JSON map that contains the requested `:globalconfig` definition (in this example, for the `:globalconfig` named `custom-web-ui`).

{{< highlight shell >}}
curl -X GET \
http://127.0.0.1:8080/api/enterprise/web/v1/config/custom-web-ui \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN"

HTTP/1.1 200 OK
{
  "type": "GlobalConfig",
  "api_version": "web/v1",
  "metadata": {
    "name": "custom-web-ui",
    "created_by": "admin"
  },
  "spec": {
    "always_show_local_cluster": false,
    "default_preferences": {
      "page_size": 50,
      "theme": "sensu"
    },
    "link_policy": {
      "allow_list": true,
      "urls": [
        "https://example.com",
        "steamapp://34234234",
        "//google.com",
        "//*.google.com",
        "//bob.local"
      ]
    }
  }
}
{{< /highlight >}}

#### API Specification {#configglobalconfig-get-specification}

/config/:globalconfig (GET) | 
---------------------|------
description          | Returns the specified global web UI configuration.
example url          | http://hostname:8080/api/enterprise/web/v1/config/custom-web-ui
response type        | Map
response codes       | <ul><li>**Success**: 200 (OK)</li><li> **Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output               | {{< highlight json >}}
{
  "type": "GlobalConfig",
  "api_version": "web/v1",
  "metadata": {
    "name": "custom-web-ui",
    "created_by": "admin"
  },
  "spec": {
    "always_show_local_cluster": false,
    "default_preferences": {
      "page_size": 50,
      "theme": "sensu"
    },
    "link_policy": {
      "allow_list": true,
      "urls": [
        "https://example.com",
        "steamapp://34234234",
        "//google.com",
        "//*.google.com",
        "//bob.local"
      ]
    }
  }
}
{{< /highlight >}}

### `/config/:globalconfig` (PUT) {#configglobalconfig-put}

The `/config/:globalconfig` API endpoint provides HTTP PUT access to create and update global web UI configurations, specified by configuration name.

#### EXAMPLE {#configglobalconfighooks-put-example}

In the following example, an HTTP PUT request is submitted to the `/config/:globalconfig` API endpoint to update the `custom-web-ui` configuration, resulting in an HTTP `200 OK` response and the updated configuration definition.

{{< highlight shell >}}
curl -X PUT \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN" \
-H 'Content-Type: application/json' \
-d '{
  "type": "GlobalConfig",
  "api_version": "web/v1",
  "metadata": {
    "name": "custom-web-ui",
    "created_by": "admin"
  },
  "spec": {
    "always_show_local_cluster": false,
    "default_preferences": {
      "page_size": 50,
      "theme": "sensu"
    },
    "link_policy": {
      "allow_list": true,
      "urls": [
        "https://example.com",
        "steamapp://34234234",
        "//google.com",
        "//*.google.com",
        "//bob.local"
      ]
    }
  }
}' \
http://127.0.0.1:8080/api/enterprise/web/v1/config/custom-web-ui

HTTP/1.1 201 Created
{{< /highlight >}}

#### API Specification {#configglobalconfig-put-specification}

/config/:globalconfig (PUT) | 
----------------|------
description     | Creates or updates the specified global web UI configuration.
example URL     | http://hostname:8080/api/enterprise/web/v1/config/custom-web-ui
payload         | {{< highlight shell >}}
{
  "type": "GlobalConfig",
  "api_version": "web/v1",
  "metadata": {
    "name": "custom-web-ui",
    "created_by": "admin"
  },
  "spec": {
    "always_show_local_cluster": false,
    "default_preferences": {
      "page_size": 50,
      "theme": "sensu"
    },
    "link_policy": {
      "allow_list": true,
      "urls": [
        "https://example.com",
        "steamapp://34234234",
        "//google.com",
        "//*.google.com",
        "//bob.local"
      ]
    }
  }
}
{{< /highlight >}}
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

### `/config/:globalconfig` (DELETE) {#configglobalconfig-delete}

The `/config/:globalconfig` API endpoint provides HTTP DELETE access to delete a global web UI configuration from Sensu, specified by the configuration name.

#### EXAMPLE {#configglobalconfig-delete-example}

The following example shows a request to the `/config/:globalconfig` API endpoint to delete the global web UI configuration named `custom-web-ui`, resulting in a successful HTTP `204 No Content` response.

{{< highlight shell >}}
curl -X DELETE \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN" \
http://127.0.0.1:8080/api/enterprise/web/v1/config/custom-web-ui

HTTP/1.1 204 No Content
{{< /highlight >}}

#### API Specification {#configglobalconfig-delete-specification}

/config/:globalconfig (DELETE) | 
--------------------------|------
description               | Removes the specified global web UI configuration from Sensu.
example url               | http://hostname:8080/api/enterprise/web/v1/config/custom-web-ui
response codes            | <ul><li>**Success**: 204 (No Content)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>


[1]: ../../getting-started/enterprise/
