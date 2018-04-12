---
title: "API Configuration"
description: "Sensu API configuration reference documentation."
product: "Sensu Core"
version: "1.3"
weight: 10
menu:
  sensu-core-1.3:
    parent: api
---

## Reference documentation

- [API configuration](#api-configuration)
  - [Example API definition](#example-api-definition)
  - [API definition specification](#api-definition-specification)

## API configuration

### Example API definition

The following is an example API definition at `/etc/sensu/conf.d/api.json`.

{{< highlight json >}}
{
  "api": {
    "host": "57.43.53.22",
    "bind": "0.0.0.0",
    "port": 4567
  }
}
{{< /highlight >}}

### API definition specification

The API definition uses the `"api": {}` definition scope.

#### `api` attributes

host         | 
-------------|------
description  | The hostname or IP address that is used when querying the API._NOTE: this attribute does not configure the address that the API binds to (that's `bind`). This attribute is used by the Sensu server when querying the Sensu API._
required     | false
type         | String
default      | `127.0.0.1`
example      | {{< highlight shell >}}"host": "8.8.8.8"{{< /highlight >}}

bind         | 
-------------|------
description  | The address that the API will bind to (listen on).
required     | false
type         | String
default      | `0.0.0.0`
example      | {{< highlight shell >}}"bind": "127.0.0.1"{{< /highlight >}}

port         | 
-------------|------
description  | The port that the API will listen on for HTTP requests.
required     | false
type         | Integer
default      | `4567`
example      | {{< highlight shell >}}"port": 4242{{< /highlight >}}

user         | 
-------------|------
description  | The username required to connect to the API.
required     | false
depends      | `password`
type         | String
default      | none
example      | {{< highlight shell >}}"user": "sensu"{{< /highlight >}}

password     | 
-------------|------
description  | The password required to connect to the API.
required     | false
depends      | `user`
type         | String
default      | none
example      | {{< highlight shell >}}"password": "secret"{{< /highlight >}}
