---
title: "enterprise/web/v1"
description: "Read this API documentation for information about Sensu enterprise/web/v1 API endpoints, which provide HTTP access to the global Sensu web UI configuration."
enterprise_api_title: "enterprise/web/v1"
type: "enterprise_api"
version: "6.13"
product: "Sensu Go"
menu:
  sensu-go-6.13:
    parent: enterprise
---

{{% notice commercial %}}
**COMMERCIAL FEATURE**: Access web UI configuration in the packaged Sensu Go distribution.
For more information, read [Get started with commercial features](../../../commercial/).
{{% /notice %}}

{{% notice note %}}
**NOTE**: Requests to `enterprise/web/v1` API endpoints require you to authenticate with a Sensu [API key](../../#configure-an-environment-variable-for-api-key-authentication) or [access token](../../#authenticate-with-auth-api-endpoints).
The code examples in this document use the [environment variable](../../#configure-an-environment-variable-for-api-key-authentication) `$SENSU_API_KEY` to represent a valid API key in API requests.
{{% /notice %}}

## Get the web UI configuration

The `/config` API endpoint provides HTTP GET access to the global web UI configuration.

### Example {#config-get-example}

The following example demonstrates a GET request to the `/config` API endpoint:

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8080/api/enterprise/web/v1/config \
-H "Authorization: Key $SENSU_API_KEY" \
-H 'Content-Type: application/json'
{{< /code >}}

The request results in a successful `HTTP/1.1 200 OK` response and a JSON array that contains the [web UI configuration definitions][1]:

{{< code text >}}
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
        "poll_interval": 120000,
        "page_size": 500,
        "serialization_format": "YAML",
        "theme": "sensu"
      },
      "license_expiry_reminder": "1080h0m0s",
      "link_policy": {
        "allow_list": true,
        "urls": [
          "https://example.com",
          "steamapp://34234234",
          "//google.com",
          "//*.google.com",
          "//bob.local",
          "https://grafana-host/render/metrics?width=500&height=250#sensu.io.graphic"
        ]
      },
      "page_preferences": [
        {
          "order": "LASTSEEN",
          "page": "entities",
          "page_size": 50,
          "selector": "proxy in entity.subscriptions"
        },
        {
          "order": "NAME",
          "page": "checks",
          "page_size": 100
        }
      ],
      "signin_message": "with your **LDAP or system credentials**"
    }
  }
]
{{< /code >}}

### API Specification {#config-get-specification}

/web (GET)  | 
---------------|------
description    | Returns the list of global web UI configurations.
example url    | http://hostname:8080/api/enterprise/web/v1/config
response type  | Map
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< code text >}}
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
        "poll_interval": 120000,
        "page_size": 500,
        "serialization_format": "YAML",
        "theme": "sensu"
      },
      "license_expiry_reminder": "1080h0m0s",
      "link_policy": {
        "allow_list": true,
        "urls": [
          "https://example.com",
          "steamapp://34234234",
          "//google.com",
          "//*.google.com",
          "//bob.local",
          "https://grafana-host/render/metrics?width=500&height=250#sensu.io.graphic"
        ]
      },
      "page_preferences": [
        {
          "order": "LASTSEEN",
          "page": "entities",
          "page_size": 50,
          "selector": "proxy in entity.subscriptions"
        },
        {
          "order": "NAME",
          "page": "checks",
          "page_size": 100
        }
      ],
      "signin_message": "with your **LDAP or system credentials**"
    }
  }
]
{{< /code >}}

## Get a specific web UI configuration {#configglobalconfig-get}

The `/config/:globalconfig` API endpoint provides HTTP GET access to global web UI configuration data, specified by configuration name.

### Example {#configglobalconfig-get-example}

The following example queries the `/config/:globalconfig` API endpoint for the `:globalconfig` named `custom-web-ui`:

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8080/api/enterprise/web/v1/config/custom-web-ui \
-H "Authorization: Key $SENSU_API_KEY"
{{< /code >}}

The request will return a successful `HTTP/1.1 200 OK` response and a JSON map that contains the requested [`:globalconfig` definition][1] (in this example, `custom-web-ui`):

{{< code text >}}
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
      "poll_interval": 120000,
      "page_size": 500,
      "serialization_format": "YAML",
      "theme": "sensu"
    },
    "license_expiry_reminder": "1080h0m0s",
    "link_policy": {
      "allow_list": true,
      "urls": [
        "https://example.com",
        "steamapp://34234234",
        "//google.com",
        "//*.google.com",
        "//bob.local",
        "https://grafana-host/render/metrics?width=500&height=250#sensu.io.graphic"
      ]
    },
    "page_preferences": [
      {
        "order": "LASTSEEN",
        "page": "entities",
        "page_size": 50,
        "selector": "proxy in entity.subscriptions"
      },
      {
        "order": "NAME",
        "page": "checks",
        "page_size": 100
      }
    ],
    "signin_message": "with your **LDAP or system credentials**"
  }
}
{{< /code >}}

### API Specification {#configglobalconfig-get-specification}

/config/:globalconfig (GET) | 
---------------------|------
description          | Returns the specified global web UI configuration.
example url          | http://hostname:8080/api/enterprise/web/v1/config/custom-web-ui
response type        | Map
response codes       | <ul><li>**Success**: 200 (OK)</li><li> **Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output               | {{< code text >}}
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
      "poll_interval": 120000,
      "page_size": 500,
      "serialization_format": "YAML",
      "theme": "sensu"
    },
    "license_expiry_reminder": "1080h0m0s",
    "link_policy": {
      "allow_list": true,
      "urls": [
        "https://example.com",
        "steamapp://34234234",
        "//google.com",
        "//*.google.com",
        "//bob.local",
        "https://grafana-host/render/metrics?width=500&height=250#sensu.io.graphic"
      ]
    },
    "page_preferences": [
      {
        "order": "LASTSEEN",
        "page": "entities",
        "page_size": 50,
        "selector": "proxy in entity.subscriptions"
      },
      {
        "order": "NAME",
        "page": "checks",
        "page_size": 100
      }
    ],
    "signin_message": "with your **LDAP or system credentials**"
  }
}
{{< /code >}}

## Create and update a web UI configuration {#configglobalconfig-put}

The `/config/:globalconfig` API endpoint provides HTTP PUT access to create and update global web UI configurations, specified by configuration name.

### Example {#configglobalconfighooks-put-example}

In the following example, an HTTP PUT request is submitted to the `/config/:globalconfig` API endpoint to update the `custom-web-ui` configuration:

{{< code shell >}}
curl -X PUT \
-H "Authorization: Key $SENSU_API_KEY" \
-H 'Content-Type: application/json' \
-d '{
  "type": "GlobalConfig",
  "api_version": "web/v1",
  "metadata": {
    "name": "custom-web-ui"
  },
  "spec": {
    "always_show_local_cluster": false,
    "default_preferences": {
      "poll_interval": 120000,
      "page_size": 500,
      "serialization_format": "YAML",
      "theme": "sensu"
    },
    "license_expiry_reminder": "1080h0m0s",
    "link_policy": {
      "allow_list": true,
      "urls": [
        "https://example.com",
        "steamapp://34234234",
        "//google.com",
        "//*.google.com",
        "//bob.local",
        "https://grafana-host/render/metrics?width=500&height=250#sensu.io.graphic"
      ]
    },
    "page_preferences": [
      {
        "order": "LASTSEEN",
        "page": "entities",
        "page_size": 50,
        "selector": "proxy in entity.subscriptions"
      },
      {
        "order": "NAME",
        "page": "checks",
        "page_size": 100
      }
    ],
    "signin_message": "with your **LDAP or system credentials**"
  }
}' \
http://127.0.0.1:8080/api/enterprise/web/v1/config/custom-web-ui
{{< /code >}}

The request will return a successful `HTTP/1.1 201 Created` response.

### API Specification {#configglobalconfig-put-specification}

/config/:globalconfig (PUT) | 
----------------|------
description     | Creates or updates the specified global web UI configuration.
example URL     | http://hostname:8080/api/enterprise/web/v1/config/custom-web-ui
payload         | {{< code json >}}
{
  "type": "GlobalConfig",
  "api_version": "web/v1",
  "metadata": {
    "name": "custom-web-ui"
  },
  "spec": {
    "always_show_local_cluster": false,
    "default_preferences": {
      "poll_interval": 120000,
      "page_size": 500,
      "serialization_format": "YAML",
      "theme": "sensu"
    },
    "license_expiry_reminder": "1080h0m0s",
    "link_policy": {
      "allow_list": true,
      "urls": [
        "https://example.com",
        "steamapp://34234234",
        "//google.com",
        "//*.google.com",
        "//bob.local",
        "https://grafana-host/render/metrics?width=500&height=250#sensu.io.graphic"
      ]
    },
    "page_preferences": [
      {
        "order": "LASTSEEN",
        "page": "entities",
        "page_size": 50,
        "selector": "proxy in entity.subscriptions"
      },
      {
        "order": "NAME",
        "page": "checks",
        "page_size": 100
      }
    ],
    "signin_message": "with your **LDAP or system credentials**"
  }
}
{{< /code >}}
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Delete a web UI configuration {#configglobalconfig-delete}

The `/config/:globalconfig` API endpoint provides HTTP DELETE access to delete a global web UI configuration from Sensu, specified by the configuration name.

### Example {#configglobalconfig-delete-example}

The following example shows a request to the `/config/:globalconfig` API endpoint to delete the global web UI configuration named `custom-web-ui`, resulting in a successful `HTTP/1.1 204 No Content` response:

{{< code shell >}}
curl -X DELETE \
-H "Authorization: Key $SENSU_API_KEY" \
http://127.0.0.1:8080/api/enterprise/web/v1/config/custom-web-ui
{{< /code >}}

### API Specification {#configglobalconfig-delete-specification}

/config/:globalconfig (DELETE) | 
--------------------------|------
description               | Removes the specified global web UI configuration from Sensu.
example url               | http://hostname:8080/api/enterprise/web/v1/config/custom-web-ui
response codes            | <ul><li>**Success**: 204 (No Content)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>


[1]: ../../../web-ui/webconfig-reference/
