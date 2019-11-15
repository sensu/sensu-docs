---
title: "Sensu backend"
linkTitle: "Sensu Backend"
description: "The Sensu backend manages check requests and event data. Every Sensu backend includes an event processing pipeline that applies filters, mutators, and handlers, the Sensu API, and the Sensu dashboard. Read the reference doc to get started running the backend."
weight: 1
version: "5.14"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-5.14:
    parent: reference
---

- [Installation][1]
- [Creating event pipelines](#event-pipeline)
- [Check scheduling](#check-scheduling)
- [Operation and service management](#operation)
  - [Starting and stopping the service](#starting-the-service)
  - [Clustering](#clustering)
  - [Time synchronization](#time-synchronization)
- [Configuration](#configuration)
  - [General configuration](#general-configuration-flags)
  - [Agent communication configuration](#agent-communication-configuration-flags)
  - [Security configuration](#security-configuration-flags)
  - [Dashboard configuration](#dashboard-configuration-flags)
  - [Datastore and cluster configuration](#datastore-and-cluster-configuration-flags)
  - [Advanced configuration options](#advanced-configuration-options)
  - [Event logging](#event-logging)
  - [Example](../../files/backend.yml) (download)

The Sensu backend is a service that manages check requests and event data.
Every Sensu backend includes an integrated transport for scheduling checks using subscriptions, an event processing pipeline that applies filters, mutators, and handlers, an embedded [etcd][2] datastore for storing configuration and state, a Sensu API, [Sensu dashboard][6], and `sensu-backend` command-line tool.
The Sensu backend is available for Ubuntu/Debian and RHEL/CentOS distributions of Linux.
See the [installation guide][1] to install the backend.

### Event pipeline

The backend processes event data and executes filters, mutators, and handlers.
These pipelines are powerful tools to automate your monitoring workflows.
To learn more about filters, mutators, and handlers, see:

- [Guide to sending Slack alerts with handlers][7]
- [Guide to reducing alerting fatigue with filters][8]
- [Filters reference documentation][9]
- [Mutators reference documentation][10]
- [Handlers reference documentation][11]

### Check scheduling

The backend is responsible for storing check definitions and scheduling check requests.
Check scheduling is subscription-based; the backend sends check requests to subscriptions where they're picked up by subscribing agents.

For information about creating and managing checks, see:

- [Guide to monitoring server resources with checks][3]
- [Guide to collecting metrics with checks][4]
- [Checks reference documentation][5]

## Operation and service management {#operation}

_NOTE: Commands in this section may require administrative privileges._

### Starting the service
Use the `sensu-backend` tool to start the backend and apply configuration flags.

To start the backend with [configuration flags][15]:

{{< highlight shell >}}
sensu-backend start --state-dir /var/lib/sensu/sensu-backend --log-level debug
{{< /highlight >}}

To see available configuration flags and defaults:

{{< highlight shell >}}
sensu-backend start --help
{{< /highlight >}}

If no configuration flags are provided, the backend loads configuration from `/etc/sensu/backend.yml` by default.

To start the backend using a service manager:

{{< highlight shell >}}
service sensu-backend start
{{< /highlight >}}

### Stopping the service

To stop the backend service using a service manager:

{{< highlight shell >}}
service sensu-backend stop
{{< /highlight >}}

### Restarting the service

You must restart the backend to implement any configuration updates.

To restart the backend using a service manager:

{{< highlight shell >}}
service sensu-backend restart
{{< /highlight >}}

### Enabling on boot

To enable the backend to start on system boot:

{{< highlight shell >}}
systemctl enable sensu-backend
{{< /highlight >}}

To disable the backend from starting on system boot:

{{< highlight shell >}}
systemctl disable sensu-backend
{{< /highlight >}}

_NOTE: On older distributions of Linux, use `sudo chkconfig sensu-server on` to enable the backend and `sudo chkconfig sensu-server off` to disable._

### Getting service status

To see the status of the backend service using a service manager:

{{< highlight shell >}}
service sensu-backend status
{{< /highlight >}}

### Getting service version

To get the current backend version using the `sensu-backend` tool:

{{< highlight shell >}}
sensu-backend version
{{< /highlight >}}

### Getting help

The `sensu-backend` tool provides general and command-specific help flags:

{{< highlight shell >}}
# Show sensu-backend commands
sensu-backend help

# Show options for the sensu-backend start subcommand
sensu-backend start --help
{{< /highlight >}}

### Clustering

You can run the backend as a standalone service, but running a cluster of backends makes Sensu more highly available, reliable, and durable.
Sensu backend clusters build on the clustering system used by [etcd][2].
Clustering lets you synchronize data between backends and get the benefits of a highly available configuration.
To configure a cluster, see:

- [Datastore configuration flags][12]
- [Guide to running a Sensu cluster][13]

### Time synchronization

System clocks between agents and the backend should be synchronized to a central NTP server. Out of sync system time may cause issues with keepalive, metric, and check alerts.

## Configuration

You can specify the backend configuration using a `/etc/sensu/backend.yml` file or using `sensu-backend start` [configuration flags][15].
The backend requires that the `state-dir` flag be set before starting; all other required flags have default values.
See the [example config file](../../files/backend.yml) for flags and defaults.
The backend loads configuration upon startup, so you must restart the backend for any configuration updates to take effect.

### Configuration summary

{{< highlight text >}}
$ sensu-backend start --help
start the sensu backend

Usage:
  sensu-backend start [flags]

General Flags:
      --agent-auth-cert-file string         TLS certificate in PEM format for agent certificate authentication
      --agent-auth-crl-urls strings         URLs of CRLs for agent certificate authentication
      --agent-auth-key-file string          TLS certificate key in PEM format for agent certificate authentication
      --agent-auth-trusted-ca-file string   TLS CA certificate bundle in PEM format for agent certificate authentication
      --agent-host string                   agent listener host (default "[::]")
      --agent-port int                      agent listener port (default 8081)
      --api-listen-address string           address to listen on for api traffic (default "[::]:8080")
      --api-url string                      url of the api to connect to (default "http://localhost:8080")
      --cache-dir string                    path to store cached data (default "/var/cache/sensu/sensu-backend")
      --cert-file string                    TLS certificate in PEM format
  -c, --config-file string                  path to sensu-backend config file
      --dashboard-cert-file string          dashboard TLS certificate in PEM format
      --dashboard-host string               dashboard listener host (default "[::]")
      --dashboard-key-file string           dashboard TLS certificate key in PEM format
      --dashboard-port int                  dashboard listener port (default 3000)
      --debug                               enable debugging and profiling features
      --deregistration-handler string       default deregistration handler
      --event-log-buffer-size int           buffer size of the event logger (default 100000)
      --event-log-file string               path to the event log file
      --eventd-buffer-size int              number of incoming events that can be buffered (default 100)
      --eventd-workers int                  number of workers spawned for processing incoming events (default 100)
  -h, --help                                help for start
      --insecure-skip-tls-verify            skip TLS verification (not recommended!)
      --keepalived-buffer-size int          number of incoming keepalives that can be buffered (default 100)
      --keepalived-workers int              number of workers spawned for processing incoming keepalives (default 100)
      --key-file string                     TLS certificate key in PEM format
      --log-level string                    logging level [panic, fatal, error, warn, info, debug] (default "warn")
      --pipelined-buffer-size int           number of events to handle that can be buffered (default 100)
      --pipelined-workers int               number of workers spawned for handling events through the event pipeline (default 100)
  -d, --state-dir string                    path to sensu state storage (default "/var/lib/sensu/sensu-backend")
      --trusted-ca-file string              TLS CA certificate bundle in PEM format used for etcd client (mutual TLS)

Store Flags:
      --etcd-advertise-client-urls strings         list of this member's client URLs to advertise to the rest of the cluster. (default [http://localhost:2379])
      --etcd-cert-file string                      path to the client server TLS cert file
      --etcd-cipher-suites strings                 list of ciphers to use for etcd TLS configuration
      --etcd-client-cert-auth                      enable client cert authentication
      --etcd-initial-advertise-peer-urls strings   list of this member's peer URLs to advertise to the rest of the cluster (default [http://127.0.0.1:2380])
      --etcd-initial-cluster string                initial cluster configuration for bootstrapping (default "default=http://127.0.0.1:2380")
      --etcd-initial-cluster-state string          initial cluster state ("new" or "existing") (default "new")
      --etcd-initial-cluster-token string          initial cluster token for the etcd cluster during bootstrap
      --etcd-key-file string                       path to the client server TLS key file
      --etcd-listen-client-urls strings            list of URLs to listen on for client traffic (default [http://127.0.0.1:2379])
      --etcd-listen-peer-urls strings              list of URLs to listen on for peer traffic (default [http://127.0.0.1:2380])
      --etcd-max-request-bytes uint                maximum etcd request size in bytes (use with caution) (default 1572864)
      --etcd-name string                           human-readable name for this member (default "default")
      --etcd-peer-cert-file string                 path to the peer server TLS cert file
      --etcd-peer-client-cert-auth                 enable peer client cert authentication
      --etcd-peer-key-file string                  path to the peer server TLS key file
      --etcd-peer-trusted-ca-file string           path to the peer server TLS trusted CA file
      --etcd-quota-backend-bytes int               maximum etcd database size in bytes (use with caution) (default 4294967296)
      --etcd-trusted-ca-file string                path to the client server TLS trusted CA cert file
      --etcd-heartbeat-interval                    interval at which the etcd leader notifies followers that it is still the leader
      --etcd-election-timeout                      time that a follower node will go without hearing a heartbeat before attempting to become leader itself
      --no-embed-etcd                              don't embed etcd, use external etcd instead
{{< /highlight >}}

### General configuration flags

| api-listen-address  |      |
-------------|------
description  | Address the API daemon will listen for requests on
type         | String
default      | `[::]:8080`
example      | {{< highlight shell >}}# Command line example
sensu-backend start --api-listen-address [::]:8080

# /etc/sensu/backend.yml example
api-listen-address: "[::]:8080"{{< /highlight >}}


| api-url  |      |
-------------|------
description  | URL used to connect to the API
type         | String
default      | `http://localhost:8080`
example      | {{< highlight shell >}}# Command line example
sensu-backend start --api-url http://localhost:8080

# /etc/sensu/backend.yml example
api-url: "http://localhost:8080"{{< /highlight >}}


| cache-dir   |      |
--------------|------
description   | Path to store cached data.
type          | String
default       | `/var/cache/sensu/sensu-backend`
example       | {{< highlight shell >}}# Command line example
sensu-backend start --cache-dir /cache/sensu-backend

# /etc/sensu/backend.yml example
cache-dir: "/cache/sensu-backend"{{< /highlight >}}


| config-file |      |
--------------|------
description   | Path to Sensu backend config file.
type          | String
default       | `/etc/sensu/backend.yml`
example       | {{< highlight shell >}}# Command line example
sensu-backend start --config-file /etc/sensu/backend.yml
sensu-backend start -c /etc/sensu/backend.yml

# /etc/sensu/backend.yml example
config-file: "/etc/sensu/backend.yml"{{< /highlight >}}


| debug     |      |
------------|------
description | Enable debugging and profiling features.
type        | Boolean
default     | `false`
example     | {{< highlight shell >}}# Command line example
sensu-backend start --debug

# /etc/sensu/backend.yml example
debug: true{{< /highlight >}}


| deregistration-handler |      |
-------------------------|------
description              | Default event handler to use when processing agent deregistration events.
type                     | String
default                  | `""`
example                  | {{< highlight shell >}}# Command line example
sensu-backend start --deregistration-handler /path/to/handler.sh

# /etc/sensu/backend.yml example
deregistration-handler: "/path/to/handler.sh"{{< /highlight >}}


| log-level  |      |
-------------|------
description  | Logging level: `panic`, `fatal`, `error`, `warn`, `info`, or `debug`.
type         | String
default      | `warn`
example      | {{< highlight shell >}}# Command line example
sensu-backend start --log-level debug

# /etc/sensu/backend.yml example
log-level: "debug"{{< /highlight >}}


| state-dir  |      |
-------------|------
description  | Path to Sensu state storage: `/var/lib/sensu/sensu-backend`.
type         | String
required     | true
example      | {{< highlight shell >}}# Command line example
sensu-backend start --state-dir /var/lib/sensu/sensu-backend
sensu-backend start -d /var/lib/sensu/sensu-backend

# /etc/sensu/backend.yml example
state-dir: "/var/lib/sensu/sensu-backend"{{< /highlight >}}


### Agent communication configuration flags

| agent-auth-cert-file |      |
-------------|------
description  | TLS certificate in PEM format for agent certificate authentication.
type         | String
default      | `""`
example      | {{< highlight shell >}}# Command line example
sensu-backend start --agent-auth-cert-file /path/to/ssl/cert.pem

# /etc/sensu/backend.yml example
agent-auth-cert-file: /path/to/ssl/cert.pem{{< /highlight >}}


| agent-auth-crl-urls |      |
-------------|------
description  | URLs of CRLs for agent certificate authentication.
type         | String
default      | `""`
example      | {{< highlight shell >}}# Command line example
sensu-backend start --agent-auth-crl-urls http://localhost/CARoot.crl

# /etc/sensu/backend.yml example
agent-auth-crl-urls: http://localhost/CARoot.crl{{< /highlight >}}


| agent-auth-key-file|      |
-------------|------
description  | TLS certificate key in PEM format for agent certificate authentication.
type         | String
default      | `""`
example      | {{< highlight shell >}}# Command line example
sensu-backend start --agent-auth-key-file /path/to/ssl/key.pem

# /etc/sensu/backend.yml example
agent-auth-key-file: /path/to/ssl/key.pem{{< /highlight >}}


| agent-auth-trusted-ca-file |      |
-------------|------
description  | TLS CA certificate bundle in PEM format for agent certificate authentication.
type         | String
default      | `""`
example      | {{< highlight shell >}}# Command line example
sensu-backend start --agent-auth-trusted-ca-file /path/to/ssl/ca.pem

# /etc/sensu/backend.yml example
agent-auth-trusted-ca-file: /path/to/ssl/ca.pem{{< /highlight >}}


| agent-host   |      |
---------------|------
description    | Agent listener host. Listens on all IPv4 and IPv6 addresses by default.
type           | String
default        | `[::]`
example        | {{< highlight shell >}}# Command line example
sensu-backend start --agent-host 127.0.0.1

# /etc/sensu/backend.yml example
agent-host: "127.0.0.1"{{< /highlight >}}


| agent-port |      |
-------------|------
description  | Agent listener port.
type         | Integer
default      | `8081`
example      | {{< highlight shell >}}# Command line example
sensu-backend start --agent-port 8081

# /etc/sensu/backend.yml example
agent-port: 8081{{< /highlight >}}


### Security configuration flags

| cert-file  |      |
-------------|------
description  | Path to the primary backend certificate file. Specifies a fallback SSL/TLS certificate if the flag `dashboard-cert-file` is not used. This certificate secures communications between the Sensu dashboard and end user web browsers, as well as communication between sensuctl and the Sensu API.
type         | String
default      | `""`
example      | {{< highlight shell >}}# Command line example
sensu-backend start --cert-file /path/to/ssl/cert.pem

# /etc/sensu/backend.yml example
cert-file: "/path/to/ssl/cert.pem"{{< /highlight >}}


| insecure-skip-tls-verify |      |
---------------------------|------
description                | Skip SSL verification. _WARNING: This configuration flag is intended for use in development systems only. Do not use this flag in production._
type                       | Boolean
default                    | `false`
example                    | {{< highlight shell >}}# Command line example
sensu-backend start --insecure-skip-tls-verify

# /etc/sensu/backend.yml example
insecure-skip-tls-verify: true{{< /highlight >}}

| key-file   |      |
-------------|------
description  | Path to the primary backend key file. Specifies a fallback SSL/TLS key if the flag `dashboard-key-file` is not used. This key secures communication between the Sensu dashboard and end user web browsers, as well as communication between sensuctl and the Sensu API.
type         | String
default      | `""`
example      | {{< highlight shell >}}# Command line example
sensu-backend start --key-file /path/to/ssl/key.pem

# /etc/sensu/backend.yml example
key-file: "/path/to/ssl/key.pem"{{< /highlight >}}


| trusted-ca-file |      |
------------------|------
description       | Path to the primary backend CA file. Specifies a fallback SSL/TLS certificate authority in PEM format used for etcd client (mutual TLS) communication if the `etcd-trusted-ca-file` is not used. This CA file is used in communication between the Sensu dashboard and end user web browsers, as well as communication between sensuctl and the Sensu API.

type              | String
default           | `""`
example           | {{< highlight shell >}}# Command line example
sensu-backend start --trusted-ca-file /path/to/trusted-certificate-authorities.pem

# /etc/sensu/backend.yml example
trusted-ca-file: "/path/to/trusted-certificate-authorities.pem"{{< /highlight >}}


### Dashboard configuration flags

| dashboard-cert-file | |
-------------|------
description  | Dashboard TLS certificate in PEM format. This certificate secures communication with the Sensu dashboard. If the `dashboard-cert-file` is not provided in the backend configuration, Sensu uses the certificate specified in the [`cert-file` flag](#security-configuration-flags) for the dashboard.
type         | String
default      | `""`
example      | {{< highlight shell >}}# Command line example
sensu-backend start --dashboard-cert-file /path/to/tls/cert.pem

# /etc/sensu/backend.yml example
dashboard-cert-file: "/path/to/tls/cert.pem"{{< /highlight >}}


| dashboard-host |      |
-----------------|------
description      | Dashboard listener host.
type             | String
default          | `[::]`
example          | {{< highlight shell >}}# Command line example
sensu-backend start --dashboard-host 127.0.0.1

# /etc/sensu/backend.yml example
dashboard-host: "127.0.0.1"{{< /highlight >}}


| dashboard-key-file | |
-------------|------
description  | Dashboard TLS certificate key in PEM format. This key secures communication with the Sensu dashboard. If the `dashboard-key-file` is not provided in the backend configuration, Sensu uses the key specified in the [`key-file` flag](#security-configuration-flags) for the dashboard.
type         | String
default      | `""`
example      | {{< highlight shell >}}# Command line example
sensu-backend start --dashboard-key-file /path/to/tls/key.pem

# /etc/sensu/backend.yml example
dashboard-key-file: "/path/to/tls/key.pem"{{< /highlight >}}


| dashboard-port |      |
-----------------|------
description      | Dashboard listener port.
type             | Integer
default          | `3000`
example          | {{< highlight shell >}}# Command line example
sensu-backend start --dashboard-port 4000

# /etc/sensu/backend.yml example
dashboard-port: 4000{{< /highlight >}}


### Datastore and cluster configuration flags

| etcd-advertise-client-urls |      |
--------------|------
description   | List of this member's client URLs to advertise to the rest of the cluster.
type          | List
default       | `http://localhost:2379`
example       | {{< highlight shell >}}# Command line examples
sensu-backend start --etcd-advertise-client-urls http://localhost:2378,http://localhost:2379
sensu-backend start --etcd-advertise-client-urls http://localhost:2378 --etcd-advertise-client-urls http://localhost:2379

# /etc/sensu/backend.yml example
etcd-advertise-client-urls:
  - http://localhost:2378
  - http://localhost:2379
{{< /highlight >}}


| etcd-cert-file |      |
-----------------|------
description      | Path to the etcd client API TLS cert file. Secures communication between the embedded etcd client API and any etcd clients.
type             | String
default          | `""`
example          | {{< highlight shell >}}# Command line example
sensu-backend start --etcd-cert-file ./client.pem

# /etc/sensu/backend.yml example
etcd-cert-file: "./client.pem"{{< /highlight >}}


<a name="etcd-cipher-suites"></a>

| etcd-cipher-suites    |      |
------------------------|------
description             | List of allowed cipher suites for etcd TLS configuration. Sensu supports TLS 1.0-1.2 cipher suites as listed in the [Go TLS documentation](https://golang.org/pkg/crypto/tls/#pkg-constants). You can use this attribute to defend your TLS servers from attacks on weak TLS ciphers. The default cipher suites are determined by Go, based on the hardware used. _NOTE: To use TLS 1.3, add the following environment variable: `GODEBUG="tls13=1"`._
recommended             | {{< highlight shell >}}
etcd-cipher-suites:
  - TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384
  - TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
  - TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256
  - TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256
  - TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305
  - TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305
{{< /highlight >}}
type                    | List
example                 | {{< highlight shell >}}# Command line examples
sensu-backend start --etcd-cipher-suites TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
sensu-backend start --etcd-cipher-suites TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256 --etcd-cipher-suites TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384

# /etc/sensu/backend.yml example
etcd-cipher-suites:
  - TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256
  - TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
{{< /highlight >}}


| etcd-client-cert-auth |      |
------------------------|------
description             | Enable client cert authentication.
type                    | Boolean
default                 | `false`
example                 | {{< highlight shell >}}# Command line example
sensu-backend start --etcd-client-cert-auth

# /etc/sensu/backend.yml example
etcd-client-cert-auth: true{{< /highlight >}}


| etcd-initial-advertise-peer-urls |      |
-----------------------------------|------
description                        | List of this member's peer URLs to advertise to the rest of the cluster.
type                               | List
default                            | `http://127.0.0.1:2380`
example                            | {{< highlight shell >}}# Command line examples
sensu-backend start --etcd-listen-peer-urls https://10.0.0.1:2380,https://10.1.0.1:2380
sensu-backend start --etcd-listen-peer-urls https://10.0.0.1:2380 --etcd-listen-peer-urls https://10.1.0.1:2380

# /etc/sensu/backend.yml example
etcd-listen-peer-urls:
  - https://10.0.0.1:2380
  - https://10.1.0.1:2380
{{< /highlight >}}


| etcd-initial-cluster |      |
-----------------------|------
description            | Initial cluster configuration for bootstrapping.
type                   | String
default                | `default=http://127.0.0.1:2380`
example                | {{< highlight shell >}}# Command line example
sensu-backend start --etcd-initial-cluster backend-0=https://10.0.0.1:2380,backend-1=https://10.1.0.1:2380,backend-2=https://10.2.0.1:2380

# /etc/sensu/backend.yml example
etcd-initial-cluster: "backend-0=https://10.0.0.1:2380,backend-1=https://10.1.0.1:2380,backend-2=https://10.2.0.1:2380"{{< /highlight >}}


| etcd-initial-cluster-state |      |
-----------------------------|------
description                  | Initial cluster state (`new` or `existing`).
type                         | String
default                      | `new`
example                      | {{< highlight shell >}}# Command line example
sensu-backend start --etcd-initial-cluster-state existing

# /etc/sensu/backend.yml example
etcd-initial-cluster-state: "existing"{{< /highlight >}}


| etcd-initial-cluster-token |      |
-----------------------------|------
description                  | Initial cluster token for the etcd cluster during bootstrap.
type                         | String
default                      | `""`
example                      | {{< highlight shell >}}# Command line example
sensu-backend start --etcd-initial-cluster-token sensu

# /etc/sensu/backend.yml example
etcd-initial-cluster-token: "sensu"{{< /highlight >}}


| etcd-key-file  |      |
-----------------|------
description      | Path to the etcd client API TLS key file. Secures communication between the embedded etcd client API and any etcd clients.
type             | String
example          | {{< highlight shell >}}# Command line example
sensu-backend start --etcd-key-file ./client-key.pem

# /etc/sensu/backend.yml example
etcd-key-file: "./client-key.pem"{{< /highlight >}}


| etcd-listen-client-urls |      |
--------------------------|------
description               | List of URLs to listen on for client traffic.
type                      | List
default                   | `http://127.0.0.1:2379`
example                   | {{< highlight shell >}}# Command line examples
sensu-backend start --etcd-listen-client-urls https://10.0.0.1:2379,https://10.1.0.1:2379
sensu-backend start --etcd-listen-client-urls https://10.0.0.1:2379 --etcd-listen-client-urls https://10.1.0.1:2379

# /etc/sensu/backend.yml example
etcd-listen-client-urls:
  - https://10.0.0.1:2379
  - https://10.1.0.1:2379
{{< /highlight >}}


| etcd-listen-peer-urls |      |
------------------------|------
description             | List of URLs to listen on for peer traffic.
type                    | List
default                 | `http://127.0.0.1:2380`
example                 | {{< highlight shell >}}# Command line examples
sensu-backend start --etcd-listen-peer-urls https://10.0.0.1:2380,https://10.1.0.1:2380
sensu-backend start --etcd-listen-peer-urls https://10.0.0.1:2380 --etcd-listen-peer-urls https://10.1.0.1:2380

# /etc/sensu/backend.yml example
etcd-listen-peer-urls:
  - https://10.0.0.1:2380
  - https://10.1.0.1:2380
{{< /highlight >}}


| etcd-name      |      |
-----------------|------
description      | Human-readable name for this member.
type             | String
default          | `default`
example          | {{< highlight shell >}}# Command line example
sensu-backend start --etcd-name backend-0

# /etc/sensu/backend.yml example
etcd-name: "backend-0"{{< /highlight >}}


| etcd-peer-cert-file |      |
----------------------|------
description           | Path to the peer server TLS cert file.
type                  | String
example               | {{< highlight shell >}}# Command line example
sensu-backend start --etcd-peer-cert-file ./backend-0.pem

# /etc/sensu/backend.yml example
etcd-peer-cert-file: "./backend-0.pem"{{< /highlight >}}


| etcd-peer-client-cert-auth |      |
-----------------------------|------
description                  | Enable peer client cert authentication.
type                         | Boolean
default                      | `false`
example                      | {{< highlight shell >}}# Command line example
sensu-backend start --etcd-peer-client-cert-auth

# /etc/sensu/backend.yml example
etcd-peer-client-cert-auth: true{{< /highlight >}}


| etcd-peer-key-file |      |
---------------------|------
description          | Path to the etcd peer API TLS key file. Secures communication between etcd cluster members.
type                 | String
example              | {{< highlight shell >}}# Command line example
sensu-backend start --etcd-peer-key-file ./backend-0-key.pem

# /etc/sensu/backend.yml example
etcd-peer-key-file: "./backend-0-key.pem"{{< /highlight >}}


| etcd-peer-trusted-ca-file |      |
----------------------------|------
description                 | Path to the etcd peer API server TLS trusted CA file. This certificate secures communication between etcd cluster members.
type                        | String
example                     | {{< highlight shell >}}# Command line example
sensu-backend start --etcd-peer-trusted-ca-file ./ca.pem

# /etc/sensu/backend.yml example
etcd-peer-trusted-ca-file: "./ca.pem"{{< /highlight >}}


| etcd-trusted-ca-file |      |
-----------------------|------
description            | Path to the client server TLS trusted CA cert file. Secures communication with the etcd client server.
type                   | String
default                | `""`
example                | {{< highlight shell >}}# Command line example
sensu-backend start --etcd-trusted-ca-file ./ca.pem

# /etc/sensu/backend.yml example
etcd-trusted-ca-file: "./ca.pem"{{< /highlight >}}


| no-embed-etcd  |      |
-----------------|------
description      | Don't embed etcd. Use external etcd instead.
type             | Boolean
default          | `false`
example          | {{< highlight shell >}}# Command line example
sensu-backend start --no-embed-etcd

# /etc/sensu/backend.yml example
no-embed-etcd: true{{< /highlight >}}


### Advanced configuration options

| eventd-buffer-size   |      |
-----------------------|------
description            | Number of incoming events that can be buffered before being processed by an eventd worker. _WARNING: Modify with caution. Increasing this value may result in higher memory usage._
type                   | Integer
default                | `100`
example                | {{< highlight shell >}}# Command line example
sensu-backend start --eventd-buffer-size 100


# /etc/sensu/backend.yml example
eventd-buffer-size: 100{{< /highlight >}}


| eventd-workers       |      |
-----------------------|------
description            | Number of workers spawned for processing incoming events that are stored in the eventd buffer. _WARNING: Modify with caution. Increasing this value may result in higher CPU usage._
type                   | Integer
default                | `100`
example                | {{< highlight shell >}}# Command line example
sensu-backend start --eventd-workers 100

# /etc/sensu/backend.yml example
eventd-workers: 100{{< /highlight >}}


| keepalived-buffer-size |      |
-----------------------|------
description            | Number of incoming keepalives that can be buffered before being processed by a keepalived worker. _WARNING: Modify with caution. Increasing this value may result in higher memory usage._
type                   | Integer
default                | `100`
example                | {{< highlight shell >}}# Command line example
sensu-backend start --keepalived-buffer-size 100

# /etc/sensu/backend.yml example
keepalived-buffer-size: 100{{< /highlight >}}


| keepalived-workers |      |
-----------------------|------
description            | Number of workers spawned for processing incoming keepalives that are stored in the keepalived buffer. _WARNING: Modify with caution. Increasing this value may result in higher CPU usage._
type                   | Integer
default                | `100`
example                | {{< highlight shell >}}# Command line example
sensu-backend start --keepalived-workers 100

# /etc/sensu/backend.yml example
keepalived-workers: 100{{< /highlight >}}


| pipelined-buffer-size |      |
-----------------------|------
description            | Number of events to handle that can be buffered before being processed by a pipelined worker. _WARNING: Modify with caution. Increasing this value may result in higher memory usage._
type                   | Integer
default                | `100`
example                | {{< highlight shell >}}# Command line example
sensu-backend start --pipelined-buffer-size 100

# /etc/sensu/backend.yml example
pipelined-buffer-size: 100{{< /highlight >}}


| pipelined-workers |      |
-----------------------|------
description            | Number of workers spawned for handling events through the event pipeline that are stored in the pipelined buffer. _WARNING: Modify with caution. Increasing this value may result in higher CPU usage._
type                   | Integer
default                | `100`
example                | {{< highlight shell >}}# Command line example
sensu-backend start --pipelined-workers 100

# /etc/sensu/backend.yml example
pipelined-workers: 100{{< /highlight >}}


| etcd-election-timeout |      |
-----------------------|------
description            | Time that a follower node will go without hearing a heartbeat before attempting to become leader itself. In milliseconds (ms). See [etcd time parameter documentation][16] for details and other considerations. _WARNING: Make sure to set the same election timeout value for all etcd members in one cluster. Setting different values for etcd members may reduce cluster stability._
type                   | Integer
default                | `1000`
example                | {{< highlight shell >}}# Command line example
sensu-backend start --etcd-election-timeout 1000

# /etc/sensu/backend.yml example
etcd-election-timeout: 1000{{< /highlight >}}


| etcd-heartbeat-interval |      |
-----------------------|------
description            | Interval at which the etcd leader will notify followers that it is still the leader. In milliseconds (ms). Best practice is to set the interval based on round-trip time between members. See [etcd time parameter documentation][16] for details and other considerations. _WARNING: Make sure to set the same heartbeat interval value for all etcd members in one cluster. Setting different values for etcd members may reduce cluster stability._
type                   | Integer
default                | `100`
example                | {{< highlight shell >}}# Command line example
sensu-backend start --etcd-heartbeat-interval 100

# /etc/sensu/backend.yml example
etcd-heartbeat-interval: 100{{< /highlight >}}


| etcd-max-request-bytes |      |
-----------------------|------
description            | Maximum etcd request size in bytes that can be sent to an etcd server by a client. Increasing this value allows etcd to process events with large outputs at the cost of overall latency. _WARNING: Use with caution. This configuration option requires familiarity with etcd. Improper use of this option can result in a non-functioning Sensu instance._
type                   | Integer
default                | `1572864`
example                | {{< highlight shell >}}# Command line example
sensu-backend start --etcd-max-request-bytes 1572864

# /etc/sensu/backend.yml example
etcd-max-request-bytes: 1572864{{< /highlight >}}


| etcd-quota-backend-bytes |      |
-----------------------|------
description            | Maximum etcd database size in bytes. Increasing this value allows for a larger etcd database at the cost of performance. _WARNING: Use with caution. This configuration option requires familiarity with etcd. Improper use of this option can result in a non-functioning Sensu instance._
type                   | Integer
default                | `4294967296`
example                | {{< highlight shell >}}# Command line example
sensu-backend start --etcd-quota-backend-bytes 4294967296

# /etc/sensu/backend.yml example
etcd-quota-backend-bytes: 4294967296{{< /highlight >}}


### Event logging

**LICENSED TIER**: Unlock event logging in Sensu Go with a Sensu license. To activate your license, see the [getting started guide][14].

All Sensu events can be optionally logged to a file in JSON format. This file can then be used as an input source for your favorite data lake solution. Using the event logging functionality provides better performance and reliability than using event handlers.


| event-log-buffer-size |      |
-----------------------|------
description            | Buffer size of the event logger. Corresponds to the maximum number of events kept in memory in case the log file is temporarily unavailable or more events have been received than can be written to the log file. 
type                   | Integer
default                | 100000
example                | {{< highlight shell >}}# Command line example
sensu-backend start --event-log-buffer-size 100000


# /etc/sensu/backend.yml example
event-log-buffer-size: 100000{{< /highlight >}}


| event-log-file |      |
-----------------------|------
description            | Path to the event log file. _WARNING: The log file should be located on a local drive. Logging directly to network drives is not supported._
type                   | String
example                | {{< highlight shell >}}# Command line example
sensu-backend start --event-log-file /var/log/sensu/events.log


# /etc/sensu/backend.yml example
event-log-file: "/var/log/sensu/events.log"{{< /highlight >}}


#### Log rotation

Event logging supports log rotation via the _SIGHUP_ signal. The current log file should first be renamed (moved). Then, this signal should be sent to the sensu-backend process so it re-creates a new log file and starts logging to it. Here are some logrotate sample configurations:

##### systemd
{{< highlight shell >}}
/var/log/sensu/events.log
{
  rotate 3
  hourly
  missingok
  notifempty
  compress
  postrotate
    /bin/systemctl reload sensu-backend.service > /dev/null 2>/dev/null || true
  endscript
}
{{< /highlight >}}

##### sysvinit
{{< highlight shell >}}
/var/log/sensu/events.log
{
  rotate 3
  hourly
  missingok
  notifempty
  compress
  postrotate
    kill -HUP `cat /var/run/sensu/sensu-backend.pid 2> /dev/null` 2> /dev/null || true
  endscript
}
{{< /highlight >}}

[1]: ../../installation/install-sensu#install-the-sensu-backend
[2]: https://github.com/etcd-io/etcd/blob/master/Documentation/docs.md
[3]: ../../guides/monitor-server-resources/
[4]: ../../guides/extract-metrics-with-checks/
[5]: ../../reference/checks
[6]: ../../dashboard/overview
[7]: ../../guides/send-slack-alerts
[8]: ../../guides/reduce-alert-fatigue
[9]: ../../reference/filters
[10]: ../../reference/mutators
[11]: ../../reference/handlers
[12]: #datastore-and-cluster-configuration-flags
[13]: ../../guides/clustering
[14]: ../../getting-started/enterprise
[15]: #general-configuration-flags
[16]: https://github.com/etcd-io/etcd/blob/master/Documentation/tuning.md#time-parameters
