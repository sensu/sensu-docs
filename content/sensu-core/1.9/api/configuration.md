---
title: "API Configuration"
description: "Read this page for API documentation for the Sensu configuration API, including endpoints as well as request and response examples."
product: "Sensu Core"
version: "1.9"
weight: 10
menu:
  sensu-core-1.9:
    parent: api
---

## Reference documentation

- [API configuration](#api-configuration)
  - [Example API definition](#example-api-definition)
  - [API definition specification](#api-definition-specification)

## API configuration

### Example API definition

The following is an example API definition at `/etc/sensu/conf.d/api.json`.

{{< code json >}}
{
  "api": {
    "host": "57.43.53.22",
    "bind": "0.0.0.0",
    "port": 4567
  }
}
{{< /code >}}

### API definition specification

The API definition uses the `"api": {}` definition scope.

#### `api` attributes

host         | 
-------------|------
description  | The hostname or IP address that is used when querying the API._NOTE: this attribute does not configure the address that the API binds to (that's `bind`). This attribute is used by the Sensu server when querying the Sensu API._
required     | false
type         | String
default      | `127.0.0.1`
example      | {{< code shell >}}"host": "8.8.8.8"{{< /code >}}

bind         | 
-------------|------
description  | The address that the API will bind to (listen on).
required     | false
type         | String
default      | `0.0.0.0`
example      | {{< code shell >}}"bind": "127.0.0.1"{{< /code >}}

port         | 
-------------|------
description  | The port that the API will listen on for HTTP requests.
required     | false
type         | Integer
default      | `4567`
example      | {{< code shell >}}"port": 4242{{< /code >}}

user         | 
-------------|------
description  | The username required to connect to the API.
required     | false
depends      | `password`
type         | String
default      | none
example      | {{< code shell >}}"user": "sensu"{{< /code >}}

password     | 
-------------|------
description  | The password required to connect to the API.
required     | false
depends      | `user`
type         | String
default      | none
example      | {{< code shell >}}"password": "secret"{{< /code >}}
