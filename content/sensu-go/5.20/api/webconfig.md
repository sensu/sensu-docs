---
title: "Web configuration API"
linkTitle: "Web Configuration API"
description: "The Sensu web API provides HTTP access to the active web UI configuration. This reference includes examples for returning the active web configuration and adding or updating the web configuration. Read on for the full reference."
version: "5.20"
product: "Sensu Go"
menu:
  sensu-go-5.20:
    parent: api
---

- [The `/globals` API endpoint](#the-globals-api-endpoint)
  - [`/globals` (GET)](#globals-get)
- [The `/globals/:globalconfig` API endpoint](#the-globalsglobalconfig-api-endpoint)
  - [`/globals/:globalconfig` (GET)](#globalsglobalconfig-get)
  - [`/globals/:globalconfig` (PUT)](#globalsglobalconfig-put)
  - [`/globals/:globalconfig` (DELETE)](#globalsglobalconfig-delete)

## The `/globals` API endpoints

For more information about commercial features designed for enterprises, see [Get started with commercial features][1].

### `/globals` (GET)

The `/globals` API endpoint provides HTTP GET access to the global web UI configuration.

#### EXAMPLE {#globals-get-example}

The following example demonstrates a request to the `/web` API endpoint, resulting in a JSON array that contains the global web UI configuration.

{{< highlight shell >}}
curl -X GET \
http://127.0.0.1:8080/api/enterprise/web/v1/globals \
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
        "theme": "classic"
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
  },
  {
    "type": "GlobalConfig",
    "api_version": "web/v1",
    "metadata": {
      "name": "new-web-ui",
      "created_by": "admin"
    },
    "spec": {
      "always_show_local_cluster": true,
      "default_preferences": {
        "page_size": 20,
        "theme": "classic"
      },
      "link_policy": {
        "allow_list": true,
        "urls": [
          "https://example.com"
        ]
      }
    }
  }
]
{{< /highlight >}}

#### API Specification {#globals-get-specification}

/web (GET)  | 
---------------|------
description    | Returns the list of global web UI configurations.
example url    | http://hostname:8080/api/enterprise/web/v1/globals
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
        "theme": "classic"
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
  },
  {
    "type": "GlobalConfig",
    "api_version": "web/v1",
    "metadata": {
      "name": "new-web-ui",
      "created_by": "admin"
    },
    "spec": {
      "always_show_local_cluster": true,
      "default_preferences": {
        "page_size": 20,
        "theme": "classic"
      },
      "link_policy": {
        "allow_list": true,
        "urls": [
          "https://example.com"
        ]
      }
    }
  }
]
{{< /highlight >}}

## The `/globals/:globalconfig` API endpoint {#the-globalsglobalconfig-api-endpoint}

### `/globals/:globalconfig` (GET) {#globalsglobalconfig-get}

The `/globals/:globalconfig` API endpoint provides HTTP GET access to global web UI configuration data, specified by configuration name.

#### EXAMPLE {#globalsglobalconfig-get-example}

In the following example, querying the `/globals/:globalconfig` API endpoint returns a JSON map that contains the requested [`:globalconfig` definition][1] (in this example, for the `:globalconfig` named `custom-web-ui`).

{{< highlight shell >}}
curl -X GET \
http://127.0.0.1:8080/api/enterprise/web/v1/globals/custom-web-ui \
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
      "theme": "classic"
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

#### API Specification {#globalsglobalconfig-get-specification}

/globals/:globalconfig (GET) | 
---------------------|------
description          | Returns the specified global web UI configuration.
example url          | http://hostname:8080/api/enterprise/web/v1/globals/custom-web-ui
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
      "theme": "classic"
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

### `/globals/:globalconfig` (PUT) {#globalsglobalconfig-put}

The `/globals/:globalconfig` API endpoint provides HTTP PUT access to create and update global web UI configurations, specified by configuration name.

#### EXAMPLE {#globalsglobalconfighooks-put-example}

In the following example, an HTTP PUT request is submitted to the `/globals/:globalconfig` API endpoint to update the `custom-web-ui` configuration, resulting in an HTTP `200 OK` response and the updated configuration definition.

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
      "theme": "classic"
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
http://127.0.0.1:8080/api/enterprise/web/v1/globals/custom-web-ui

HTTP/1.1 201 Created
{{< /highlight >}}

#### API Specification {#globalsglobalconfig-put-specification}

/globals/:globalconfig (PUT) | 
----------------|------
description     | Creates or updates the specified global web UI configuration.
example URL     | http://hostname:8080/api/enterprise/web/v1/globals/custom-web-ui
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
      "theme": "classic"
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

### `/globals/:globalconfig` (DELETE) {#globalsglobalconfig-delete}

The `/globals/:globalconfig` API endpoint provides HTTP DELETE access to delete a global web UI configuration from Sensu, specified by the configuration name.

#### EXAMPLE {#globalsglobalconfig-delete-example}

The following example shows a request to the `/globals/:globalconfig` API endpoint to delete the global web UI configuration named `custom-web-ui`, resulting in a successful HTTP `204 No Content` response.

{{< highlight shell >}}
curl -X DELETE \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN" \
http://127.0.0.1:8080/api/enterprise/web/v1/globals/custom-web-ui

HTTP/1.1 204 No Content
{{< /highlight >}}

#### API Specification {#globalsglobalconfig-delete-specification}

/globals/:globalconfig (DELETE) | 
--------------------------|------
description               | Removes the specified global web UI configuration from Sensu.
example url               | http://hostname:8080/api/enterprise/web/v1/globals/custom-web-ui
response codes            | <ul><li>**Success**: 204 (No Content)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>


[1]: ../../getting-started/enterprise/
