---
title: "Enterprise API"
product: "Sensu Enterprise"
version: "3.7"
weight: 7
menu: "sensu-enterprise-3.7"
---

## Reference documentation

- [What is the Sensu Enterprise API?](#what-is-the-sensu-enterprise-api)
- [Enterprise API Configuration](#enterprise-api-configuration)
  - [Example(s)](#examples)
  - [API specification](#api-specification)
    - [`api` attributes](#api-attributes)
    - [`ssl` attributes](#ssl-attributes)
- [Create an SSL keystore](#create-an-ssl-keystore)
- [Configure the Enterprise API for SSL](#configure-the-enterprise-api-for-ssl)
- [The `/metrics` API endpoints](#the-metrics-api-endpoints)
  - [`/metrics/check_requests` (GET)](#metricscheckrequests-get)
  - [`/metrics/clients` (GET)](#metricsclients-get)
  - [`/metrics/events` (GET)](#metricsevents-get)
  - [`/metrics/keepalives` (GET)](#metricskeepalives-get)
  - [`/metrics/results` (GET)](#metricsresults-get)

--------------------------------------------------------------------------------

## What is the Sensu Enterprise API?

Every instance of Sensu Enterprise provides the Sensu Enterprise API, built upon
the [Sensu Core API][1].

The Sensu Enterprise API has the functionality of the Core API with the addition
of several endpoints to provide access to data for generating reports,
visualizing internal metrics, and more. The Enterprise API also supports native
SSL, for end-to-end SSL, eliminating the need for a proxy to terminate SSL.

## Enterprise API Configuration

### Example(s) {#examples}

The following is an example API definition at `/etc/sensu/conf.d/api.json`.

{{< code json >}}
{
  "api": {
    "host": "57.43.53.22",
    "bind": "0.0.0.0",
    "port": 4567,
    "ssl": {
      "port": 4568,
      "keystore_file": "/etc/sensu/api.keystore",
      "keystore_password": "secret"
    }
  }
}
{{< /code >}}

### API specification

#### `api` attributes

The following attributes are configured within the `{"api": {} }` [configuration
scope][2].

host         | 
-------------|------
description  | The hostname or IP address that is used when querying the API. This attribute does not configure the address that the API binds to (that's `bind`). This attribute is used by Sensu tooling to know how to query the Sensu API.
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
description  | The API HTTP port.
required     | false
type         | Integer
default      | `4567`
example      | {{< code shell >}}"port": 4242{{< /code >}}

ssl          | 
-------------|------
description  | A set of attributes that configure SSL encryption for the API. The API SSL listener will be enabled if this attribute is configured.
required     | false
type         | Hash
example      | {{< code shell >}}"ssl": {}{{< /code >}}

#### `ssl` attributes

The following attributes are configured within the `{"api": { "ssl": {} } }`
[configuration scope][2].

##### EXAMPLE {#ssl-attributes-example}

{{< code json >}}
{
  "api": {
    "host": "57.43.53.22",
    "...": "...",
    "ssl": {
      "port": 4568,
      "keystore_file": "/etc/sensu/api.keystore",
      "keystore_password": "secret"
    }
  }
}
{{< /code >}}

##### ATTRIBUTES {#ssl-attributes-specification}

port         | 
-------------|------
description  | The API HTTPS (SSL) port.
required     | true
type         | Integer
example      | {{< code shell >}}"port": 4458{{< /code >}}

keystore_file | 
--------------|------
description   | The file path for the SSL certificate keystore. The documentation to create self-signed SSL certificates and a keystore can be found [here][3].
required      | true
type          | String
example       | {{< code shell >}}"keystore_file": "/etc/sensu/api.keystore"{{< /code >}}

keystore_password | 
------------------|------
description       | The SSL certificate keystore password.
required          | true
type              | String
example           | {{< code shell >}}"keystore_password": "secret"{{< /code >}}

## Create an SSL keystore

The following instructions will generate an OpenSSL certificate authority,
self-signed certificates, and a password protected keystore for the Sensu
Enterprise API. Alternatively, you may create a keystore with third-party issued
SSL certificates.

### Install OpenSSL

OpenSSL is required on the machine that will generate the SSL certificates.
Install OpenSSL on your platform:

#### Ubuntu/Debian

{{< code shell >}}
sudo apt-get update
sudo apt-get install openssl
openssl version
{{< /code >}}

#### CentOS/RHEL

{{< code shell >}}
sudo yum install openssl
openssl version
{{< /code >}}

### Generate SSL certificates and keystore

The generate an OpenSSL certificate authority, self-signed certificates, and a
password protected keystore for the Sensu Enterprise API, run the following
commands, providing information when prompted:

Create a password protected private key.

{{< code shell >}}
openssl genrsa -des3 -out api.key 2048
{{< /code >}}

Remove the password from the private key.

{{< code shell >}}
cp api.key api.orig.key
openssl rsa -in api.orig.key -out api.key
{{< /code >}}

Create a self-signed certificate.

{{< code shell >}}
openssl req -new -x509 -key api.key -out apix509.crt
{{< /code >}}

Combine the self-signed certificate and private key and export it in the pkcs12
format.

{{< code shell >}}
openssl pkcs12 -inkey api.key -in apix509.crt -export -out api.pkcs12
{{< /code >}}

Create the SSL keystore, importing `api.pkcs12`.

{{< code shell >}}
keytool -importkeystore -srckeystore api.pkcs12 -srcstoretype PKCS12 -destkeystore api.keystore
{{< /code >}}

The generated keystore should be moved to an appropriate directory to limit
access and allow Sensu Enterprise to load it. Move `api.keystore` to
`/etc/sensu` and correct the file ownership and permissions.

{{< code shell >}}
sudo mv api.keystore /etc/sensu/
sudo chown sensu:sensu /etc/sensu/api.keystore
sudo chmod 600 /etc/sensu/api.keystore
{{< /code >}}

## Configure the Enterprise API for SSL

Once you have successfully [created an SSL certificate keystore][3], Sensu
Enterprise can be configured to provide an SSL listener for the API (HTTPS). The
[keystore instructions][3] produced a password protected keystore at
`/etc/sensu/api.keystore`, the following API definition examples loads it.

The following is an example API definition at `/etc/sensu/conf.d/api.json`.

{{< code json >}}
{
  "api": {
    "host": "your_api_host_address",
    "bind": "0.0.0.0",
    "port": 4567,
    "ssl": {
      "port": 4568,
      "keystore_file": "/etc/sensu/api.keystore",
      "keystore_password": "your_keystore_password"
    }
  }
}
{{< /code >}}

Be sure to reload Sensu Enterprise to pick up the configuration changes.

_NOTE: The `service` command will not work on CentOS 5, the sysvinit
script must be used, e.g. `sudo /etc/init.d/sensu-enterprise start`_

{{< code shell >}}
sudo service sensu-enterprise reload
{{< /code >}}

## The `/metrics` API endpoints {#the-metrics-api-endpoints}

The `/metrics` API endpoints provides HTTP GET access to Sensu client and monitoring event data.

### `/metrics/check_requests` (GET) {#metricscheckrequests-get}

#### EXAMPLES {#metricscheckrequests-get-examples}

The following example demonstrates a `/metrics/check_requests` API query which results in a
JSON Hash containing the metric name and historical data points.

{{< code shell >}}
curl http://127.0.0.1:4567/metrics/check_requests

HTTP/1.1 200 OK
{
  "metric": "check_requests",
  "points": [
    [
      1547499950,
      85
    ],
    [
      1547499960,
      80
    ]
  ]
}
{{< /code >}}

#### API specification {#metricscheckrequests-get-specification}

/metrics/check_requests (GET) | 
------------------|------
description       | Returns the number of Sensu check requests over the past hour at 10 second intervals in the format `[timestamp, value]`.
example url       | http://hostname:4567/metrics/check_requests
response type     | Hash
response codes    | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output            | {{< code json >}}{
  "metric": "check_requests",
  "points": [
    [
      1547499950,
      85
    ],
    [
      1547499960,
      80
    ]
  ]
}{{< /code >}}

### `/metrics/clients` (GET) {#metricsclients-get}

#### EXAMPLES {#metricsclients-get-examples}

The following example demonstrates a `/metrics/clients` API query which results in a
JSON Hash containing the metric name and historical data points.

{{< code shell >}}
curl http://127.0.0.1:4567/metrics/clients

HTTP/1.1 200 OK
{
  "metric": "clients",
  "points": [
    [
      1547499950,
      12
    ],
    [
      1547499960,
      12
    ]
  ]
}
{{< /code >}}

#### API specification {#metricsclients-get-specification}

/metrics/clients (GET) | 
------------------|------
description       | Returns the number of Sensu clients over the past hour at 10 second intervals in the format `[timestamp, value]`.
example url       | http://hostname:4567/metrics/clients
response type     | Hash
response codes    | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output            | {{< code json >}}{
  "metric": "clients",
  "points": [
    [
      1547499950,
      12
    ],
    [
      1547499960,
      12
    ]
  ]
}{{< /code >}}

### `/metrics/events` (GET) {#metricsevents-get}

#### EXAMPLES {#metricsevents-get-examples}

The following example demonstrates a `/metrics/events` API query which results in a
JSON Hash containing the metric name and historical data points.

{{< code shell >}}
curl http://127.0.0.1:4567/metrics/events

HTTP/1.1 200 OK
{
  "metric": "events",
  "points": [
    [
      1547499950,
      15
    ],
    [
      1547499960,
      13
    ]
  ]
}
{{< /code >}}

#### API specification {#metricsevents-get-specification}

/metrics/events (GET) | 
------------------|------
description       | Returns the number of Sensu events over the past hour at 10 second intervals in the format `[timestamp, value]`.
example url       | http://hostname:4567/metrics/events
response type     | Hash
response codes    | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output            | {{< code json >}}{
  "metric": "events",
  "points": [
    [
      1547499950,
      15
    ],
    [
      1547499960,
      13
    ]
  ]
}{{< /code >}}

### `/metrics/keepalives` (GET) {#metricskeepalives-get}

#### EXAMPLES {#metricskeepalives-get-examples}

The following example demonstrates a `/metrics/keepalives` API query which results in a
JSON Hash containing the metric name and historical data points.

{{< code shell >}}
curl http://127.0.0.1:4567/metrics/keepalives

HTTP/1.1 200 OK
{
  "metric": "keepalives",
  "points": [
    [
      1547499950,
      64
    ],
    [
      1547499960,
      62
    ]
  ]
}
{{< /code >}}

#### API specification {#metricskeepalives-get-specification}

/metrics/keepalives (GET) | 
------------------|------
description       | Returns the number of Sensu keepalives over the past hour at 10 second intervals in the format `[timestamp, value]`.
example url       | http://hostname:4567/metrics/keepalives
response type     | Hash
response codes    | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output            | {{< code json >}}{
  "metric": "keepalives",
  "points": [
    [
      1547499950,
      64
    ],
    [
      1547499960,
      62
    ]
  ]
}{{< /code >}}

### `/metrics/results` (GET) {#metricsresults-get}

#### EXAMPLES {#metricsresults-get-examples}

The following example demonstrates a `/metrics/results` API query which results in a
JSON Hash containing the metric name and historical data points.

{{< code shell >}}
curl http://127.0.0.1:4567/metrics/results

HTTP/1.1 200 OK
{
  "metric": "results",
  "points": [
    [
      1547499950,
      54
    ],
    [
      1547499960,
      48
    ]
  ]
}
{{< /code >}}

#### API specification {#metricsresults-get-specification}

/metrics/results (GET) | 
------------------|------
description       | Returns the number of Sensu check results over the past hour at 10 second intervals in the format `[timestamp, value]`.
example url       | http://hostname:4567/metrics/results
response type     | Hash
response codes    | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output            | {{< code json >}}{
  "metric": "results",
  "points": [
    [
      1547499950,
      54
    ],
    [
      1547499960,
      48
    ]
  ]
}{{< /code >}}

[?]:  #
[1]:  /sensu-core/1.0/api/overview
[2]:  /sensu-core/1.2/reference/configuration#configuration-scopes
[3]:  #create-an-ssl-keystore
[4]:  ../dashboard
