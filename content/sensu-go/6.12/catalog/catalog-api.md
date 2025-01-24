---
title: "Catalog API"
description: "Use the Sensu Catalog API to generate static API content that the web UI can consume. Build your own private catalog of Sensu integrations."
product: "Sensu Go"
version: "6.12"
weight: 80
layout: "single"
toc: true
menu:
  sensu-go-6.12:
    parent: catalog
---

{{% notice commercial %}}
**COMMERCIAL FEATURE**: Access the Catalog API in the packaged Sensu Go distribution.
For more information, read [Get started with commercial features](../../commercial/).
{{% /notice %}}

{{% notice note %}}
**NOTE**: The Sensu Catalog is in public preview and is subject to change.
{{% /notice %}}

The Catalog API is a static API that the [catalog-api command line tool][1] generates from a repository of integrations, such as https://github.com/sensu/catalog.
The Sensu web UI uses the generated API files to determine which integrations to display in the Sensu Catalog.

## Get the latest catalog SHA-256 checksum

Retrieves the latest catalog content version's SHA-256 checksum.
The Sensu web UI uses the checksum information to determine the latest API subpath.

### Example

The following example queries the Sensu Catalog API for the latest content version:

{{< code shell >}}
curl -X GET \
/version.json
{{< /code >}}

The request returns the latest catalog content version's SHA-256 checksum and the time of the last update (in seconds since the Unix epoch):

{{< code text >}}
{
  "release_sha256": "af3c54b86b90fac8977f1bdc80d955002dd3f441bdbb4cc603c94abbb929dcf6",
  "last_updated": 1643664852
}
{{< /code >}}

### API Specification

/version.json (GET)  |     |
---------------------|------
description          | Retrieves the latest content version's SHA-256 checksum, which the Sensu web UI uses to determine the latest API subpath. Also returns the time of the last update in seconds since the Unix epoch.
endpoint             | /version.json
output               | {{< code text >}}
{
  "release_sha256": "af3c54b86b90fac8977f1bdc80d955002dd3f441bdbb4cc603c94abbb929dcf6",
  "last_updated": 1643664852
}
{{< /code >}}
response codes       | The Catalog API is statically generated, so response codes indicate an issue with the webserver that is serving the content.<br><ul><li>**Error**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Get all integration namespaces and names

Retrieves the list of integration namespaces and names for the catalog.

### Example

The following example queries the Sensu Catalog API for integration namespaces and names:

{{< code shell >}}
curl -X GET \
/af3c54b86b90fac8977f1bdc80d955002dd3f441bdbb4cc603c94abbb929dcf6/v1/catalog.json
{{< /code >}}

The request returns the list of integration namespaces and names:

{{< code text >}}
{
  "namespaced_integrations": {
    "nginx": [
      "nginx-monitoring"
    ],
    "system": [
      "host-monitoring"
    ]
  }
}
{{< /code >}}

### API Specification

/<release_sha256>/v1/catalog.json (GET)  |     |
---------------------|------
description          | Retrieves the list of integration namespaces and names for the catalog.
endpoint             | /<release_sha256>/v1/catalog.json
output               | {{< code text >}}
{
  "namespaced_integrations": {
    "nginx": [
      "nginx-monitoring"
    ],
    "system": [
      "host-monitoring"
    ]
  }
}
{{< /code >}}
response codes       | The Catalog API is statically generated, so response codes indicate an issue with the webserver that is serving the content.<br><ul><li>**Error**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Get the configuration and versions for an integration

For the specified integration, retrieves the configuration for the latest version and a list of
versions.

### Example

The following example queries the Sensu Catalog API for an integration's configuration and versions:

{{< code shell >}}
curl -X GET \
/af3c54b86b90fac8977f1bdc80d955002dd3f441bdbb4cc603c94abbb929dcf6/v1/nginx/nginx-monitoring.json
{{< /code >}}

The request returns the latest content version's SHA-256 checksum and the time of the last content update in seconds since the Unix epoch:

{{< code text >}}
{
  "metadata": {
    "name": "nginx-monitoring",
    "namespace": "nginx"
  },
  "display_name": "NGINX Monitoring",
  "class": "community",
  "contributors": [
    "@nixwiz",
    "@calebhailey"
  ],
  "provider": "agent/check",
  "short_description": "NGINX monitoring",
  "supported_platforms": [
    "darwin",
    "linux",
    "windows"
  ],
  "tags": [
    "http",
    "nginx",
    "webserver"
  ],
  "versions": [
    "20220125.0.0",
    "20220126.0.0"
  ]
}{{< /code >}}

### API Specification

/<release_sha256>/v1/\<namespace>/\<name>.json (GET)  |     |
---------------------|------
description          | Retrieves the specified integration's latest configuration and a list of versions.
endpoint             | /<release_sha256>/v1/\<namespace>/\<name>.json
output               | {{< code text >}}
{
  "metadata": {
    "name": "nginx-monitoring",
    "namespace": "nginx"
  },
  "display_name": "NGINX Monitoring",
  "class": "community",
  "contributors": [
    "@nixwiz",
    "@calebhailey"
  ],
  "provider": "agent/check",
  "short_description": "NGINX monitoring",
  "supported_platforms": [
    "darwin",
    "linux",
    "windows"
  ],
  "tags": [
    "http",
    "nginx",
    "webserver"
  ],
  "versions": [
    "20220125.0.0",
    "20220126.0.0"
  ]
}{{< /code >}}
response codes       | The Catalog API is statically generated, so response codes indicate an issue with the webserver that is serving the content.<br><ul><li>**Error**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Get all versions for an integration

Retrieves the list of available versions for the specified integration.

### Example

The following example queries the Sensu Catalog API for an integration's available versions:

{{< code shell >}}
curl -X GET \
/af3c54b86b90fac8977f1bdc80d955002dd3f441bdbb4cc603c94abbb929dcf6/v1/nginx/nginx-monitoring/versions.json
{{< /code >}}

The request returns the integration's available versions:

{{< code text >}}
[
  "20220125.0.0",
  "20220126.0.0"
]
{{< /code >}}

### API Specification

/<release_sha256>/v1/\<namespace>/\<name>/versions.json (GET)  |     |
---------------------|------
description          | Retrieves a list of the available versions for the specified integration.
endpoint             | /<release_sha256>/v1/\<namespace>/\<name>/versions.json
output               | {{< code text >}}
[
  "20220125.0.0",
  "20220126.0.0"
]
{{< /code >}}
response codes       | The Catalog API is statically generated, so response codes indicate an issue with the webserver that is serving the content.<br><ul><li>**Error**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Get the configuration for an integration version

Retrieves the configuration for the specified version of an integration.

### Example

The following example queries the Sensu Catalog API for the specified version of an integration:

{{< code shell >}}
curl -X GET \
/af3c54b86b90fac8977f1bdc80d955002dd3f441bdbb4cc603c94abbb929dcf6/v1/nginx/nginx-monitoring/20220125.0.0.json
{{< /code >}}

The request returns the configuration for the specified version of the integration:

{{< code text >}}
{
  "metadata": {
    "name": "nginx-monitoring",
    "namespace": "nginx"
  },
  "class": "community",
  "contributors": [
    "@nixwiz",
    "@calebhailey"
  ],
  "provider": "agent/check",
  "short_description": "NGINX monitoring",
  "supported_platforms": [
    "darwin",
    "linux",
    "windows"
  ],
  "tags": [
    "http",
    "nginx",
    "webserver"
  ],
  "version": "20220125.0.0"
}
{{< /code >}}

### API Specification

/<release_sha256>/v1/\<namespace>/\<name>/\<version>.json (GET)  |     |
---------------------|------
description          | Retrieves the latest content version's SHA-256 checksum, which the Sensu web UI uses to determine the latest API subpath.
endpoint             | /<release_sha256>/v1/\<namespace>/\<name>/\<version>.json
output               | {{< code text >}}
{
  "metadata": {
    "name": "nginx-monitoring",
    "namespace": "nginx"
  },
  "class": "community",
  "contributors": [
    "@nixwiz",
    "@calebhailey"
  ],
  "provider": "agent/check",
  "short_description": "NGINX monitoring",
  "supported_platforms": [
    "darwin",
    "linux",
    "windows"
  ],
  "tags": [
    "http",
    "nginx",
    "webserver"
  ],
  "version": "20220125.0.0"
}
{{< /code >}}
response codes       | The Catalog API is statically generated, so response codes indicate an issue with the webserver that is serving the content.<br><ul><li>**Error**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Get the Sensu resources for an integration

Retrieves the the Sensu resources for the specified integration version, in JSON format.

{{% notice note %}}
**NOTE**: The `/<release_sha256>/v1/<namespace>/<name>/<version>/sensu-resources.json` endpoint does not include assets in the retreived Sensu resources.
{{% /notice %}}

### Example

The following example queries the Sensu Catalog API for the Sensu resources for the specified integration version:

{{< code shell >}}
curl -X GET \
/af3c54b86b90fac8977f1bdc80d955002dd3f441bdbb4cc603c94abbb929dcf6/v1/nginx/nginx-monitoring/20220125.0.0/sensu-resources.json
{{< /code >}}

The request returns the Sensu resources for the requested integration version:

{{< code text >}}
{
  "api_version": "core/v2",
  "metadata": {
    "name": "nginx-healthcheck"
  },
  "spec": {
    "command": "check-nginx-status.rb --url {{ .annotations.check_nginx_status_url | default \"http://localhost:80/nginx_status\" }}",
    "interval": 30,
    "pipelines": [
      {
        "api_version": "core/v2",
        "name": "alerts",
        "type": "Pipeline"
      },
      {
        "api_version": "core/v2",
        "name": "incident-management",
        "type": "Pipeline"
      }
    ],
    "publish": true,
    "runtime_assets": [
      "sensu-plugins/sensu-plugins-nginx:3.1.2",
      "sensu/sensu-ruby-runtime:0.0.10"
    ],
    "subscriptions": [
      "nginx"
    ],
    "timeout": 10
  },
  "type": "CheckConfig"
}
{{< /code >}}

### API Specification

/<release_sha256>/v1/\<namespace>/\<name>/\<version>/sensu-resources.json (GET)  |     |
---------------------|------
description          | Retrieves the the Sensu resources (except assets) for the requested integration version, in JSON format.
endpoint             | /<release_sha256>/v1/\<namespace>/\<name>/\<version>/sensu-resources.json
output               | {{< code text >}}
{
  "api_version": "core/v2",
  "metadata": {
    "name": "nginx-healthcheck"
  },
  "spec": {
    "command": "check-nginx-status.rb --url {{ .annotations.check_nginx_status_url | default \"http://localhost:80/nginx_status\" }}",
    "interval": 30,
    "pipelines": [
      {
        "api_version": "core/v2",
        "name": "alerts",
        "type": "Pipeline"
      },
      {
        "api_version": "core/v2",
        "name": "incident-management",
        "type": "Pipeline"
      }
    ],
    "publish": true,
    "runtime_assets": [
      "sensu-plugins/sensu-plugins-nginx:3.1.2",
      "sensu/sensu-ruby-runtime:0.0.10"
    ],
    "subscriptions": [
      "nginx"
    ],
    "timeout": 10
  },
  "type": "CheckConfig"
}
{{< /code >}}
response codes       | The Catalog API is statically generated, so response codes indicate an issue with the webserver that is serving the content.<br><ul><li>**Error**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Get the integration README

Retrieves the README for the specified integration version in Markdown format.

### Example

The following example queries the Sensu Catalog API for the README for the specified integration version:

{{< code shell >}}
curl -X GET \
/af3c54b86b90fac8977f1bdc80d955002dd3f441bdbb4cc603c94abbb929dcf6/v1/nginx/nginx-monitoring/20220125.0.0/readme.md
{{< /code >}}

The request returns the README for the specified integration version in Markdown format.

### API Specification

/<release_sha256>/v1/\<namespace>/\<name>/\<version>/readme.md (GET)  |     |
---------------------|------
description          | Retrieves the README for the specified integration version in Markdown format.
endpoint             | /<release_sha256>/v1/\<namespace>/\<name>/\<version>/readme.md
output               | README in Markdown format
response codes       | The Catalog API is statically generated, so response codes indicate an issue with the webserver that is serving the content.<br><ul><li>**Error**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Get the integration changelog 

Retrieves the changelog for the specified integration version in Markdown format.

### Example

The following example queries the Sensu Catalog API for the changelog for the specified integration version:

{{< code shell >}}
curl -X GET \
/af3c54b86b90fac8977f1bdc80d955002dd3f441bdbb4cc603c94abbb929dcf6/v1/nginx/nginx-monitoring/20220125.0.0/changelog.md
{{< /code >}}

The request returns the changelog for the specified integration version in Markdown format.

### API Specification

/<release_sha256>/v1/\<namespace>/\<name>/\<version>/changelog.png (GET)  |     |
---------------------|------
description          | Retrieves the changelog for the specified integration version in Markdown format.
endpoint             | /<release_sha256>/v1/\<namespace>/\<name>/\<version>/changelog.md
output               | Changelog in Markdown format
response codes       | The Catalog API is statically generated, so response codes indicate an issue with the webserver that is serving the content.<br><ul><li>**Error**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Get the integration logo 

Retrieves the logo for the specified integration version in PNG format.

### Example

The following example queries the Sensu Catalog API for the logo for the specified integration version:

{{< code shell >}}
curl -X GET \
/af3c54b86b90fac8977f1bdc80d955002dd3f441bdbb4cc603c94abbb929dcf6/v1/nginx/nginx-monitoring/20220125.0.0/logo.md
{{< /code >}}

The request returns the logo for the specified integration version in PNG format.

### API Specification

/<release_sha256>/v1/\<namespace>/\<name>/\<version>/logo.png (GET)  |     |
---------------------|------
description          | Retrieves the logo for the specified integration version in PNG format.
endpoint             | /<release_sha256>/v1/\<namespace>/\<name>/\<version>/logo.md
output               | Logo in PNG format
response codes       | The Catalog API is statically generated, so response codes indicate an issue with the webserver that is serving the content.<br><ul><li>**Error**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>


[1]: ../catalog-reference/#catalog-api-command-line-interface-tool
