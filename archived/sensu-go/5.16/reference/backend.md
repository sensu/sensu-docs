---
title: "Sensu backend"
linkTitle: "Sensu Backend"
description: "The Sensu backend manages check requests and event data. Every Sensu backend includes an event processing pipeline that applies filters, mutators, handlers, the Sensu API, and the Sensu dashboard. Read the reference doc to run the Sensu backend."
weight: 20
version: "5.16"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-5.16:
    parent: reference
---

- [Installation][1]
- [Create event pipelines](#create-event-pipelines)
- [Schedule checks](#schedule-checks)
- [Initialization](#initialization)
- [Operation and service management](#operation)
  - [Start and stop the service](#start-the-service) | [Cluster](#cluster) | [Synchronize time](#synchronize-time)
- [Configuration](#configuration)
  - [General configuration](#general-configuration-flags) | [Agent communication configuration](#agent-communication-configuration-flags) | [Security configuration](#security-configuration-flags) | [Dashboard configuration](#dashboard-configuration-flags) | [Datastore and cluster configuration](#datastore-and-cluster-configuration-flags) | [Advanced configuration options](#advanced-configuration-options) | [Configuration via environment variables](#configuration-via-environment-variables) | [Event logging](#event-logging)
- [Example Sensu backend configuration file](../../files/backend.yml) (download)

The Sensu backend is a service that manages check requests and event data.
Every Sensu backend includes an integrated transport for scheduling checks using subscriptions, an event processing pipeline that applies filters, mutators, and handlers, an embedded [etcd][2] datastore for storing configuration and state, a Sensu API, a [Sensu dashboard][6], and the `sensu-backend` command line tool.
The Sensu backend is available for Ubuntu/Debian and RHEL/CentOS distributions of Linux.
See the [installation guide][1] to install the backend.

### Create event pipelines

The backend processes event data and executes filters, mutators, and handlers.
These pipelines are powerful tools to automate your monitoring workflows.
To learn more about filters, mutators, and handlers, see:

- [Guide to sending Slack alerts with handlers][7]
- [Guide to reducing alerting fatigue with filters][8]
- [Filters reference documentation][9]
- [Mutators reference documentation][10]
- [Handlers reference documentation][11]

### Schedule checks

The backend is responsible for storing check definitions and scheduling check requests.
Check scheduling is subscription-based: the backend sends check requests to subscriptions. where they're picked up by subscribing agents.

For information about creating and managing checks, see:

- [Monitor server resources with checks][3]
- [Collect metrics with checks][4]
- [Checks reference documentation][5]

## Initialization

For a **new** installation, you must set up an administrator username and password.
To do this, set environment variables as shown below, replacing `YOUR_USERNAME` and `YOUR_PASSWORD` with the username and password you want to use:

{{< highlight shell >}}
export SENSU_BACKEND_CLUSTER_ADMIN_USERNAME=YOUR_USERNAME
export SENSU_BACKEND_CLUSTER_ADMIN_PASSWORD=YOUR_PASSWORD
sensu-backend init
{{< /highlight >}}

_**NOTE**: Make sure the Sensu backend is running before you run `sensu-backend init`._

You can also run the `sensu-backend init` command in interactive mode if you prefer to respond to prompts for your username and password:

{{< highlight shell >}}
sensu-backend init --interactive

Admin Username: YOUR_USERNAME
Admin Password: YOUR_PASSWORD
{{< /highlight >}}

This initialization step bootstraps the first admin user account for your Sensu installation.
This account will be granted the cluster admin role.

_**NOTE**: If you are already using Sensu, you do not need to initialize. Your installation has already seeded the admin username and password you have set up._

To see available initialization flags:

{{< highlight shell >}}
sensu-backend init --help
{{< /highlight >}}

## Operation and service management {#operation}

_**NOTE**: Commands in this section may require administrative privileges._

### Start the service

Use the `sensu-backend` tool to start the backend and apply configuration flags.

To start the backend with [configuration flags][15]:

{{< highlight shell >}}
sensu-backend start --state-dir /var/lib/sensu/sensu-backend --log-level debug
{{< /highlight >}}

To see available configuration flags and defaults:

{{< highlight shell >}}
sensu-backend start --help
{{< /highlight >}}

If you do not provide any configuration flags, the backend loads configuration from `/etc/sensu/backend.yml` by default.

To start the backend using a service manager:

{{< highlight shell >}}
service sensu-backend start
{{< /highlight >}}

### Stop the service

To stop the backend service using a service manager:

{{< highlight shell >}}
service sensu-backend stop
{{< /highlight >}}

### Restart the service

You must restart the backend to implement any configuration updates.

To restart the backend using a service manager:

{{< highlight shell >}}
service sensu-backend restart
{{< /highlight >}}

### Enable on boot

To enable the backend to start on system boot:

{{< highlight shell >}}
systemctl enable sensu-backend
{{< /highlight >}}

To disable the backend from starting on system boot:

{{< highlight shell >}}
systemctl disable sensu-backend
{{< /highlight >}}

_**NOTE**: On older distributions of Linux, use `sudo chkconfig sensu-server on` to enable the backend and `sudo chkconfig sensu-server off` to disable the backend._

### Get service status

To see the status of the backend service using a service manager:

{{< highlight shell >}}
service sensu-backend status
{{< /highlight >}}

### Get service version

To get the current backend version using the `sensu-backend` tool:

{{< highlight shell >}}
sensu-backend version
{{< /highlight >}}

### Get help

The `sensu-backend` tool provides general and command-specific help flags:

{{< highlight shell >}}
# Show sensu-backend commands
sensu-backend help

# Show options for the sensu-backend start subcommand
sensu-backend start --help
{{< /highlight >}}

### Cluster

You can run the backend as a standalone service, but running a cluster of backends makes Sensu more highly available, reliable, and durable.
Sensu backend clusters build on the [etcd clustering system][2].
Clustering lets you synchronize data between backends and get the benefits of a highly available configuration.

To configure a cluster, see:

- [Datastore configuration flags][12]
- [Run a Sensu cluster][13]

### Synchronize time

System clocks between agents and the backend should be synchronized to a central NTP server. If system time is out-of-sync, it may cause issues with keepalive, metric, and check alerts.

## Configuration

You can specify the backend configuration with either a `/etc/sensu/backend.yml` file or `sensu-backend start` [configuration flags][15].
The backend requires that the `state-dir` flag is set before starting.
All other required flags have default values.
See the [example backend configuration file][17] for flags and defaults.
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
      --agent-write-timeout int             timeout in seconds for agent writes (default 15)
      --api-listen-address string           address to listen on for API traffic (default "[::]:8080")
      --api-url string                      URL of the API to connect to (default "http://localhost:8080")
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
      --jwt-private-key-file string         path to the PEM-encoded private key to use to sign JSON Web Tokens (JWTs)
      --jwt-public-key-file string          path to the PEM-encoded public key to use to verify JWT signatures
      --keepalived-buffer-size int          number of incoming keepalives that can be buffered (default 100)
      --keepalived-workers int              number of workers spawned for processing incoming keepalives (default 100)
      --key-file string                     TLS certificate key in PEM format
      --log-level string                    logging level [panic, fatal, error, warn, info, debug] (default "warn")
      --pipelined-buffer-size int           number of events to handle that can be buffered (default 100)
      --pipelined-workers int               number of workers spawned for handling events through the event pipeline (default 100)
  -d, --state-dir string                    path to sensu state storage (default "/var/lib/sensu/sensu-backend")
      --trusted-ca-file string              TLS CA certificate bundle in PEM format

Store Flags:
      --etcd-advertise-client-urls strings         list of this member's client URLs to advertise to the rest of the cluster (default [http://localhost:2379])
      --etcd-cert-file string                      path to the client server TLS cert file
      --etcd-cipher-suites strings                 list of ciphers to use for etcd TLS configuration
      --etcd-client-urls string                    client URLs to use when operating as an etcd client
      --etcd-client-cert-auth                      enable client cert authentication
      --etcd-discovery                             use the dynamic cluster configuration method etcd
discovery instead of the static `--initial-cluster method`
      --etcd-discovery-srv                         use the dynamic cluster configuration method DNS SRV
discovery instead of the static `--initial-cluster method`
      --etcd-election-timeout uint                 time in ms a follower node will go without hearing a heartbeat before attempting to become leader itself (default 1000)
      --etcd-heartbeat-interval uint               interval in ms with which the etcd leader will notify followers that it is still the leader (default 100)
      --etcd-initial-advertise-peer-urls strings   list of this member's peer URLs to advertise to the rest of the cluster (default [http://127.0.0.1:2380])
      --etcd-initial-cluster string                initial cluster configuration for bootstrapping (default "default=http://127.0.0.1:2380")
      --etcd-initial-cluster-state string          initial cluster state ("new" or "existing"; default "new")
      --etcd-initial-cluster-token string          initial cluster token for the etcd cluster during bootstrap
      --etcd-key-file string                       path to the client server TLS key file
      --etcd-listen-client-urls strings            list of URLs to listen on for client traffic (default [http://127.0.0.1:2379])
      --etcd-listen-peer-urls strings              list of URLs to listen on for peer traffic (default [http://127.0.0.1:2380])
      --etcd-max-request-bytes uint                maximum etcd request size in bytes (use with caution; default 1572864)
      --etcd-name string                           human-readable name for this member (default "default")
      --etcd-peer-cert-file string                 path to the peer server TLS cert file
      --etcd-peer-client-cert-auth                 enable peer client cert authentication
      --etcd-peer-key-file string                  path to the peer server TLS key file
      --etcd-peer-trusted-ca-file string           path to the peer server TLS trusted CA file
      --etcd-quota-backend-bytes int               maximum etcd database size in bytes (use with caution; default 4294967296)
      --etcd-trusted-ca-file string                path to the client server TLS trusted CA cert file
      --no-embed-etcd                              don't embed etcd; use external etcd instead
{{< /highlight >}}


### General configuration flags

| api-listen-address  |      |
-------------|------
description  | Address the API daemon will listen for requests on.
type         | String
default      | `[::]:8080`
environment variable | `SENSU_BACKEND_API_LISTEN_ADDRESS`
example      | {{< highlight shell >}}# Command line example
sensu-backend start --api-listen-address [::]:8080

# /etc/sensu/backend.yml example
api-listen-address: "[::]:8080"{{< /highlight >}}


| api-url  |      |
-------------|------
description  | URL used to connect to the API.
type         | String
default      | `http://localhost:8080`
environment variable | `SENSU_BACKEND_API_URL`
example      | {{< highlight shell >}}# Command line example
sensu-backend start --api-url http://localhost:8080

# /etc/sensu/backend.yml example
api-url: "http://localhost:8080"{{< /highlight >}}


| cache-dir   |      |
--------------|------
description   | Path to store cached data.
type          | String
default       | `/var/cache/sensu/sensu-backend`
environment variable | `SENSU_BACKEND_CACHE_DIR`
example       | {{< highlight shell >}}# Command line example
sensu-backend start --cache-dir /cache/sensu-backend

# /etc/sensu/backend.yml example
cache-dir: "/cache/sensu-backend"{{< /highlight >}}


| config-file |      |
--------------|------
description   | Path to Sensu backend config file.
type          | String
default       | `/etc/sensu/backend.yml`
environment variable | `SENSU_BACKEND_CONFIG_FILE`
example       | {{< highlight shell >}}# Command line example
sensu-backend start --config-file /etc/sensu/backend.yml
sensu-backend start -c /etc/sensu/backend.yml

# /etc/sensu/backend.yml example
config-file: "/etc/sensu/backend.yml"{{< /highlight >}}


| debug     |      |
------------|------
description | If `true`, enable debugging and profiling features. Otherwise, `false`.
type        | Boolean
default     | `false`
environment variable | `SENSU_BACKEND_DEBUG`
example     | {{< highlight shell >}}# Command line example
sensu-backend start --debug

# /etc/sensu/backend.yml example
debug: true{{< /highlight >}}


| deregistration-handler |      |
-------------------------|------
description              | Default event handler to use when processing agent deregistration events.
type                     | String
default                  | `""`
environment variable     | `SENSU_BACKEND_DEREGISTRATION_HANDLER`
example                  | {{< highlight shell >}}# Command line example
sensu-backend start --deregistration-handler /path/to/handler.sh

# /etc/sensu/backend.yml example
deregistration-handler: "/path/to/handler.sh"{{< /highlight >}}


| log-level  |      |
-------------|------
description  | Logging level: `panic`, `fatal`, `error`, `warn`, `info`, or `debug`.
type         | String
default      | `warn`
environment variable | `SENSU_BACKEND_LOG_LEVEL`
example      | {{< highlight shell >}}# Command line example
sensu-backend start --log-level debug

# /etc/sensu/backend.yml example
log-level: "debug"{{< /highlight >}}


| state-dir  |      |
-------------|------
description  | Path to Sensu state storage: `/var/lib/sensu/sensu-backend`.
type         | String
required     | true
environment variable | `SENSU_BACKEND_STATE_DIR`
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
environment variable | `SENSU_BACKEND_AGENT_AUTH_CERT_FILE`
example      | {{< highlight shell >}}# Command line example
sensu-backend start --agent-auth-cert-file /path/to/ssl/cert.pem

# /etc/sensu/backend.yml example
agent-auth-cert-file: /path/to/ssl/cert.pem{{< /highlight >}}


| agent-auth-crl-urls |      |
-------------|------
description  | URLs of CRLs for agent certificate authentication.
type         | String
default      | `""`
environment variable | `SENSU_BACKEND_AGENT_AUTH_CRL_URLS`
example      | {{< highlight shell >}}# Command line example
sensu-backend start --agent-auth-crl-urls http://localhost/CARoot.crl

# /etc/sensu/backend.yml example
agent-auth-crl-urls: http://localhost/CARoot.crl{{< /highlight >}}


| agent-auth-key-file |      |
-------------|------
description  | TLS certificate key in PEM format for agent certificate authentication.
type         | String
default      | `""`
environment variable | `SENSU_BACKEND_AGENT_AUTH_KEY_FILE`
example      | {{< highlight shell >}}# Command line example
sensu-backend start --agent-auth-key-file /path/to/ssl/key.pem

# /etc/sensu/backend.yml example
agent-auth-key-file: /path/to/ssl/key.pem{{< /highlight >}}


| agent-auth-trusted-ca-file |      |
-------------|------
description  | TLS CA certificate bundle in PEM format for agent certificate authentication.
type         | String
default      | `""`
environment variable | `SENSU_BACKEND_AGENT_AUTH_TRUSTED_CA_FILE`
example      | {{< highlight shell >}}# Command line example
sensu-backend start --agent-auth-trusted-ca-file /path/to/ssl/ca.pem

# /etc/sensu/backend.yml example
agent-auth-trusted-ca-file: /path/to/ssl/ca.pem{{< /highlight >}}


| agent-host   |      |
---------------|------
description    | Agent listener host. Listens on all IPv4 and IPv6 addresses by default.
type           | String
default        | `[::]`
environment variable | `SENSU_BACKEND_AGENT_HOST`
example        | {{< highlight shell >}}# Command line example
sensu-backend start --agent-host 127.0.0.1

# /etc/sensu/backend.yml example
agent-host: "127.0.0.1"{{< /highlight >}}


| agent-port |      |
-------------|------
description  | Agent listener port.
type         | Integer
default      | `8081`
environment variable | `SENSU_BACKEND_AGENT_PORT`
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
environment variable | `SENSU_BACKEND_CERT_FILE`
example      | {{< highlight shell >}}# Command line example
sensu-backend start --cert-file /path/to/ssl/cert.pem

# /etc/sensu/backend.yml example
cert-file: "/path/to/ssl/cert.pem"{{< /highlight >}}


| insecure-skip-tls-verify |      |
---------------------------|------
description                | If `true`, skip SSL verification. Otherwise, `false`. _**WARNING**: This configuration flag is intended for use in development systems only. Do not use this flag in production._
type                       | Boolean
default                    | `false`
environment variable | `SENSU_BACKEND_INSECURE_SKIP_TLS_VERIFY`
example                    | {{< highlight shell >}}# Command line example
sensu-backend start --insecure-skip-tls-verify

# /etc/sensu/backend.yml example
insecure-skip-tls-verify: true{{< /highlight >}}


<a name="jwt-attributes"></a>

| jwt-private-key-file |      |
-------------|------
description  | Path to the PEM-encoded private key to use to sign JSON Web Tokens (JWTs). _**NOTE**: The internal symmetric secret key is used by default to sign all JWTs unless a private key is specified via this attribute._
type         | String
default      | `""`
environment variable | `SENSU_BACKEND_JWT_PRIVATE_KEY_FILE`
example      | {{< highlight shell >}}# Command line example
sensu-backend start --jwt-private-key-file /path/to/key/private.pem

# /etc/sensu/backend.yml example
jwt-private-key-file: /path/to/key/private.pem{{< /highlight >}}


| jwt-public-key-file |      |
-------------|------
description  | Path to the PEM-encoded public key to use to verify JSON Web Token (JWT) signatures. _**NOTE**: JWTs signed with the internal symmetric secret key will continue to be verified with that key._
type         | String
default      | `""`
environment variable | `SENSU_BACKEND_JWT_PUBLIC_KEY_FILE`
required     | false, unless `jwt-private-key-file` is defined
example      | {{< highlight shell >}}# Command line example
sensu-backend start --jwt-public-key-file /path/to/key/public.pem

# /etc/sensu/backend.yml example
jwt-public-key-file: /path/to/key/public.pem{{< /highlight >}}


| key-file   |      |
-------------|------
description  | Path to the primary backend key file. Specifies a fallback SSL/TLS key if the flag `dashboard-key-file` is not used. This key secures communication between the Sensu dashboard and end user web browsers, as well as communication between sensuctl and the Sensu API.
type         | String
default      | `""`
environment variable | `SENSU_BACKEND_KEY_FILE`
example      | {{< highlight shell >}}# Command line example
sensu-backend start --key-file /path/to/ssl/key.pem

# /etc/sensu/backend.yml example
key-file: "/path/to/ssl/key.pem"{{< /highlight >}}


| trusted-ca-file |      |
------------------|------
description       | Path to the primary backend CA file. Specifies a fallback SSL/TLS certificate authority in PEM format used for etcd client (mutual TLS) communication if the `etcd-trusted-ca-file` is not used. This CA file is used in communication between the Sensu dashboard and end user web browsers, as well as communication between sensuctl and the Sensu API.
type              | String
default           | `""`
environment variable | `SENSU_BACKEND_TRUSTED_CA_FILE`
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
environment variable | `SENSU_BACKEND_DASHBOARD_CERT_FILE`
example      | {{< highlight shell >}}# Command line example
sensu-backend start --dashboard-cert-file /path/to/tls/cert.pem

# /etc/sensu/backend.yml example
dashboard-cert-file: "/path/to/tls/cert.pem"{{< /highlight >}}


| dashboard-host |      |
-----------------|------
description      | Dashboard listener host.
type             | String
default          | `[::]`
environment variable | `SENSU_BACKEND_DASHBOARD_HOST`
example          | {{< highlight shell >}}# Command line example
sensu-backend start --dashboard-host 127.0.0.1

# /etc/sensu/backend.yml example
dashboard-host: "127.0.0.1"{{< /highlight >}}


| dashboard-key-file | |
-------------|------
description  | Dashboard TLS certificate key in PEM format. This key secures communication with the Sensu dashboard. If the `dashboard-key-file` is not provided in the backend configuration, Sensu uses the key specified in the [`key-file` flag](#security-configuration-flags) for the dashboard.
type         | String
default      | `""`
environment variable | `SENSU_BACKEND_DASHBOARD_KEY_FILE`
example      | {{< highlight shell >}}# Command line example
sensu-backend start --dashboard-key-file /path/to/tls/key.pem

# /etc/sensu/backend.yml example
dashboard-key-file: "/path/to/tls/key.pem"{{< /highlight >}}


| dashboard-port |      |
-----------------|------
description      | Dashboard listener port.
type             | Integer
default          | `3000`
environment variable | `SENSU_BACKEND_DASHBOARD_PORT`
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
environment variable | `SENSU_BACKEND_ETCD_ADVERTISE_CLIENT_URLS`
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
description      | Path to the etcd client API TLS certificate file. Secures communication between the embedded etcd client API and any etcd clients.
type             | String
default          | `""`
environment variable | `SENSU_BACKEND_ETCD_CERT_FILE`
example          | {{< highlight shell >}}# Command line example
sensu-backend start --etcd-cert-file ./client.pem

# /etc/sensu/backend.yml example
etcd-cert-file: "./client.pem"{{< /highlight >}}


<a name="etcd-cipher-suites"></a>

| etcd-cipher-suites    |      |
------------------------|------
description             | List of allowed cipher suites for etcd TLS configuration. Sensu supports TLS 1.0-1.2 cipher suites as listed in the [Go TLS documentation][18]. You can use this attribute to defend your TLS servers from attacks on weak TLS ciphers. Go determines the default cipher suites based on the hardware used. _**NOTE**: To use TLS 1.3, add the following environment variable: `GODEBUG="tls13=1"`._
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
environment variable | `SENSU_BACKEND_ETCD_CIPHER_SUITES`
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
description             | If `true`, enable client certificate authentication. Otherwise, `false`.
type                    | Boolean
default                 | `false`
environment variable | `SENSU_BACKEND_ETCD_CLIENT_CERT_AUTH`
example                 | {{< highlight shell >}}# Command line example
sensu-backend start --etcd-client-cert-auth

# /etc/sensu/backend.yml example
etcd-client-cert-auth: true{{< /highlight >}}


| etcd-client-urls      |      |
------------------------|------
description             | List of client URLs to use when a sensu-backend is not operating as an etcd member. To configure sensu-backend for use with an external etcd instance, use this flag in conjunction with `--no-embed-etcd` when executing sensu-backend start or [sensu-backend init][22]. If you do not use this flag when using `--no-embed-etcd`, sensu-backend start and sensu-backend-init will fall back to [--etcd-listen-client-urls][23].
type                    | List
default                 | `http://127.0.0.1:2379`
environment variable | `SENSU_BACKEND_ETCD_CLIENT_URLS`
example                   | {{< highlight shell >}}# Command line examples
sensu-backend start --etcd-client-urls https://10.0.0.1:2379,https://10.1.0.1:2379
sensu-backend start --etcd-client-urls https://10.0.0.1:2379 --etcd-client-urls https://10.1.0.1:2379

# /etc/sensu/backend.yml example
etcd-client-urls:
  - https://10.0.0.1:2379
  - https://10.1.0.1:2379
{{< /highlight >}}


| etcd-discovery        |      |
------------------------|------
description             | Exposes [etcd's embedded auto-discovery features][19]. Attempts to use [etcd discovery][20] to get the cluster configuration.
type                    | String
default                 | ""
environment variable | `SENSU_BACKEND_ETCD_DISCOVERY`
example                 | {{< highlight shell >}}# Command line example
sensu-backend start --etcd-discovery https://discovery.etcd.io/3e86b59982e49066c5d813af1c2e2579cbf573de

# /etc/sensu/backend.yml example
etcd-discovery:
  - https://discovery.etcd.io/3e86b59982e49066c5d813af1c2e2579cbf573de
{{< /highlight >}}


| etcd-discovery-srv    |      |
------------------------|------
description             | Exposes [etcd's embedded auto-discovery features][17]. Attempts to use a [DNS SRV][21] record to get the cluster configuration.
type                    | String
default                 | ""
environment variable | `SENSU_BACKEND_ETCD_DISCOVERY_SRV`
example                 | {{< highlight shell >}}# Command line example
sensu-backend start --etcd-discovery-srv example.org

# /etc/sensu/backend.yml example
etcd-discovery-srv:
  - example.org
{{< /highlight >}}


| etcd-initial-advertise-peer-urls |      |
-----------------------------------|------
description                        | List of this member's peer URLs to advertise to the rest of the cluster.
type                               | List
default                            | `http://127.0.0.1:2380`
environment variable               | `SENSU_BACKEND_ETCD_INITIAL_ADVERTISE_PEER_URLS`
example                            | {{< highlight shell >}}# Command line examples
sensu-backend start --etcd-initial-advertise-peer-urls https://10.0.0.1:2380,https://10.1.0.1:2380
sensu-backend start --etcd-initial-advertise-peer-urls https://10.0.0.1:2380 --etcd-initial-advertise-peer-urls https://10.1.0.1:2380

# /etc/sensu/backend.yml example
etcd-initial-advertise-peer-urls:
  - https://10.0.0.1:2380
  - https://10.1.0.1:2380
{{< /highlight >}}


| etcd-initial-cluster |      |
-----------------------|------
description            | Initial cluster configuration for bootstrapping.
type                   | String
default                | `default=http://127.0.0.1:2380`
environment variable   | `SENSU_BACKEND_ETCD_INITIAL_CLUSTER`
example                | {{< highlight shell >}}# Command line example
sensu-backend start --etcd-initial-cluster backend-0=https://10.0.0.1:2380,backend-1=https://10.1.0.1:2380,backend-2=https://10.2.0.1:2380

# /etc/sensu/backend.yml example
etcd-initial-cluster: "backend-0=https://10.0.0.1:2380,backend-1=https://10.1.0.1:2380,backend-2=https://10.2.0.1:2380"{{< /highlight >}}


| etcd-initial-cluster-state |      |
-----------------------------|------
description                  | Initial cluster state (`new` or `existing`).
type                         | String
default                      | `new`
environment variable         | `SENSU_BACKEND_ETCD_INITIAL_CLUSTER_STATE`
example                      | {{< highlight shell >}}# Command line example
sensu-backend start --etcd-initial-cluster-state existing

# /etc/sensu/backend.yml example
etcd-initial-cluster-state: "existing"{{< /highlight >}}


| etcd-initial-cluster-token |      |
-----------------------------|------
description                  | Initial cluster token for the etcd cluster during bootstrap.
type                         | String
default                      | `""`
environment variable         | `SENSU_BACKEND_ETCD_INITIAL_CLUSTER_TOKEN`
example                      | {{< highlight shell >}}# Command line example
sensu-backend start --etcd-initial-cluster-token sensu

# /etc/sensu/backend.yml example
etcd-initial-cluster-token: "sensu"{{< /highlight >}}


| etcd-key-file  |      |
-----------------|------
description      | Path to the etcd client API TLS key file. Secures communication between the embedded etcd client API and any etcd clients.
type             | String
environment variable | `SENSU_BACKEND_ETCD_KEY_FILE`
example          | {{< highlight shell >}}# Command line example
sensu-backend start --etcd-key-file ./client-key.pem

# /etc/sensu/backend.yml example
etcd-key-file: "./client-key.pem"{{< /highlight >}}

<a name="etcd-listen-client-urls"></a>

| etcd-listen-client-urls |      |
--------------------------|------
description               | List of URLs to listen on for client traffic.
type                      | List
default                   | `http://127.0.0.1:2379`
environment variable      | `SENSU_BACKEND_ETCD_LISTEN_CLIENT_URLS`
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
environment variable    | `SENSU_BACKEND_ETCD_LISTEN_PEER_URLS`
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
environment variable | `SENSU_BACKEND_ETCD_NAME`
example          | {{< highlight shell >}}# Command line example
sensu-backend start --etcd-name backend-0

# /etc/sensu/backend.yml example
etcd-name: "backend-0"{{< /highlight >}}


| etcd-peer-cert-file |      |
----------------------|------
description           | Path to the peer server TLS certificate file.
type                  | String
environment variable  | `SENSU_BACKEND_ETCD_PEER_CERT_FILE`
example               | {{< highlight shell >}}# Command line example
sensu-backend start --etcd-peer-cert-file ./backend-0.pem

# /etc/sensu/backend.yml example
etcd-peer-cert-file: "./backend-0.pem"{{< /highlight >}}


| etcd-peer-client-cert-auth |      |
-----------------------------|------
description                  | Enable peer client certificate authentication.
type                         | Boolean
default                      | `false`
environment variable         | `SENSU_BACKEND_ETCD_PEER_CLIENT_CERT_AUTH`
example                      | {{< highlight shell >}}# Command line example
sensu-backend start --etcd-peer-client-cert-auth

# /etc/sensu/backend.yml example
etcd-peer-client-cert-auth: true{{< /highlight >}}


| etcd-peer-key-file |      |
---------------------|------
description          | Path to the etcd peer API TLS key file. Secures communication between etcd cluster members.
type                 | String
environment variable | `SENSU_BACKEND_ETCD_PEER_KEY_FILE`
example              | {{< highlight shell >}}# Command line example
sensu-backend start --etcd-peer-key-file ./backend-0-key.pem

# /etc/sensu/backend.yml example
etcd-peer-key-file: "./backend-0-key.pem"{{< /highlight >}}


| etcd-peer-trusted-ca-file |      |
----------------------------|------
description                 | Path to the etcd peer API server TLS trusted CA file. Secures communication between etcd cluster members.
type                        | String
environment variable        | `SENSU_BACKEND_ETCD_PEER_TRUSTED_CA_FILE`
example                     | {{< highlight shell >}}# Command line example
sensu-backend start --etcd-peer-trusted-ca-file ./ca.pem

# /etc/sensu/backend.yml example
etcd-peer-trusted-ca-file: "./ca.pem"{{< /highlight >}}


| etcd-trusted-ca-file |      |
-----------------------|------
description            | Path to the client server TLS trusted CA certificate file. Secures communication with the etcd client server.
type                   | String
default                | `""`
environment variable   | `SENSU_BACKEND_ETCD_TRUSTED_CA_FILE`
example                | {{< highlight shell >}}# Command line example
sensu-backend start --etcd-trusted-ca-file ./ca.pem

# /etc/sensu/backend.yml example
etcd-trusted-ca-file: "./ca.pem"{{< /highlight >}}


| no-embed-etcd  |      |
-----------------|------
description      | If `true`, do not embed etcd (use external etcd instead). Otherwise, `false`.
type             | Boolean
default          | `false`
environment variable | `SENSU_BACKEND_NO_EMBED_ETCD`
example          | {{< highlight shell >}}# Command line example
sensu-backend start --no-embed-etcd

# /etc/sensu/backend.yml example
no-embed-etcd: true{{< /highlight >}}


### Advanced configuration options

| eventd-buffer-size   |      |
-----------------------|------
description            | Number of incoming events that can be buffered before being processed by an eventd worker. _**WARNING**: Modify with caution. Increasing this value may result in greater memory usage._
type                   | Integer
default                | `100`
environment variable   | `SENSU_BACKEND_EVENTD_BUFFER_SIZE`
example                | {{< highlight shell >}}# Command line example
sensu-backend start --eventd-buffer-size 100


# /etc/sensu/backend.yml example
eventd-buffer-size: 100{{< /highlight >}}


| eventd-workers       |      |
-----------------------|------
description            | Number of workers spawned for processing incoming events that are stored in the eventd buffer. _**WARNING**: Modify with caution. Increasing this value may result in greater CPU usage._
type                   | Integer
default                | `100`
environment variable   | `SENSU_BACKEND_EVENTD_WORKERS`
example                | {{< highlight shell >}}# Command line example
sensu-backend start --eventd-workers 100

# /etc/sensu/backend.yml example
eventd-workers: 100{{< /highlight >}}


| keepalived-buffer-size |      |
-----------------------|------
description            | Number of incoming keepalives that can be buffered before being processed by a keepalived worker. _**WARNING**: Modify with caution. Increasing this value may result in greater memory usage._
type                   | Integer
default                | `100`
environment variable   | `SENSU_BACKEND_KEEPALIVED_BUFFER_SIZE`
example                | {{< highlight shell >}}# Command line example
sensu-backend start --keepalived-buffer-size 100

# /etc/sensu/backend.yml example
keepalived-buffer-size: 100{{< /highlight >}}


| keepalived-workers |      |
-----------------------|------
description            | Number of workers spawned for processing incoming keepalives that are stored in the keepalived buffer. _**WARNING**: Modify with caution. Increasing this value may result in greater CPU usage._
type                   | Integer
default                | `100`
environment variable   | `SENSU_BACKEND_KEEPALIVED_WORKERS`
example                | {{< highlight shell >}}# Command line example
sensu-backend start --keepalived-workers 100

# /etc/sensu/backend.yml example
keepalived-workers: 100{{< /highlight >}}


| pipelined-buffer-size |      |
-----------------------|------
description            | Number of events to handle that can be buffered before being processed by a pipelined worker. _**WARNING**: Modify with caution. Increasing this value may result in greater memory usage._
type                   | Integer
default                | `100`
environment variable   | `SENSU_BACKEND_PIPELINED_BUFFER_SIZE`
example                | {{< highlight shell >}}# Command line example
sensu-backend start --pipelined-buffer-size 100

# /etc/sensu/backend.yml example
pipelined-buffer-size: 100{{< /highlight >}}


| pipelined-workers |      |
-----------------------|------
description            | Number of workers spawned for handling events through the event pipeline that are stored in the pipelined buffer. _**WARNING**: Modify with caution. Increasing this value may result in greater CPU usage._
type                   | Integer
default                | `100`
environment variable   | `SENSU_BACKEND_PIPELINED_WORKERS`
example                | {{< highlight shell >}}# Command line example
sensu-backend start --pipelined-workers 100

# /etc/sensu/backend.yml example
pipelined-workers: 100{{< /highlight >}}


| etcd-election-timeout |      |
-----------------------|------
description            | Time that a follower node will go without hearing a heartbeat before attempting to become leader itself. In milliseconds (ms). See [etcd time parameter documentation][16] for details and other considerations. _**WARNING**: Make sure to set the same election timeout value for all etcd members in one cluster. Setting different values for etcd members may reduce cluster stability._
type                   | Integer
default                | `1000`
environment variable   | `SENSU_BACKEND_ETCD_ELECTION_TIMEOUT`
example                | {{< highlight shell >}}# Command line example
sensu-backend start --etcd-election-timeout 1000

# /etc/sensu/backend.yml example
etcd-election-timeout: 1000{{< /highlight >}}


| etcd-heartbeat-interval |      |
-----------------------|------
description            | Interval at which the etcd leader will notify followers that it is still the leader. In milliseconds (ms). Best practice is to set the interval based on round-trip time between members. See [etcd time parameter documentation][16] for details and other considerations. _**WARNING**: Make sure to set the same heartbeat interval value for all etcd members in one cluster. Setting different values for etcd members may reduce cluster stability._
type                   | Integer
default                | `100`
environment variable   | `SENSU_BACKEND_ETCD_HEARTBEAT_INTERVAL`
example                | {{< highlight shell >}}# Command line example
sensu-backend start --etcd-heartbeat-interval 100

# /etc/sensu/backend.yml example
etcd-heartbeat-interval: 100{{< /highlight >}}


| etcd-max-request-bytes |      |
-----------------------|------
description            | Maximum etcd request size in bytes that can be sent to an etcd server by a client. Increasing this value allows etcd to process events with large outputs at the cost of overall latency. _**WARNING**: Use with caution. This configuration option requires familiarity with etcd. Improper use of this option can result in a non-functioning Sensu instance._
type                   | Integer
default                | `1572864`
environment variable   | `SENSU_BACKEND_ETCD_MAX_REQUEST_BYTES`
example                | {{< highlight shell >}}# Command line example
sensu-backend start --etcd-max-request-bytes 1572864

# /etc/sensu/backend.yml example
etcd-max-request-bytes: 1572864{{< /highlight >}}


| etcd-quota-backend-bytes |      |
-----------------------|------
description            | Maximum etcd database size in bytes. Increasing this value allows for a larger etcd database at the cost of performance. _**WARNING**: Use with caution. This configuration option requires familiarity with etcd. Improper use of this option can result in a non-functioning Sensu instance._
type                   | Integer
default                | `4294967296`
environment variable   | `SENSU_BACKEND_ETCD_QUOTA_BACKEND_BYTES`
example                | {{< highlight shell >}}# Command line example
sensu-backend start --etcd-quota-backend-bytes 4294967296

# /etc/sensu/backend.yml example
etcd-quota-backend-bytes: 4294967296{{< /highlight >}}

### Configuration via environment variables

The `sensu-backend` service configured by our supported packages will read environment variables from `/etc/default/sensu-backend` on Debian/Ubuntu systems and `/etc/sysconfig/sensu-backend` on RHEL systems.
The installation package does not create these files, so you will need to create them.

{{< language-toggle >}}

{{< highlight "Ubuntu/Debian" >}}
$ sudo touch /etc/default/sensu-backend
{{< /highlight >}}

{{< highlight "RHEL/CentOS" >}}
$ sudo touch /etc/sysconfig/sensu-backend
{{< /highlight >}}

{{< /language-toggle >}}

For any backend configuration flag you wish to specify as an environment variable, you must prepend `SENSU_BACKEND_`, convert dashes (`-`) to underscores (`_`), and capitalize all letters.
Then, add the resulting environment variable to the appropriate environment file described above.
You must restart the service for these settings to take effect.

In this example, the `api-listen-address` flag is configured as an environment variable and set to `192.168.100.20:8080`:

{{< language-toggle >}}

{{< highlight "Ubuntu/Debian" >}}
$ echo 'SENSU_BACKEND_API_LISTEN_ADDRESS=192.168.100.20:8080' | sudo tee -a /etc/default/sensu-backend
$ sudo systemctl restart sensu-backend
{{< /highlight >}}

{{< highlight "RHEL/CentOS" >}}
$ echo 'SENSU_BACKEND_API_LISTEN_ADDRESS=192.168.100.20:8080' | sudo tee -a /etc/sysconfig/sensu-backend
$ sudo systemctl restart sensu-backend
{{< /highlight >}}

{{< /language-toggle >}}

### Event logging

**COMMERCIAL FEATURE**: Access event logging in the packaged Sensu Go distribution.
For more information, see [Get started with commercial features][14].

If you wish, you can log all Sensu events to a file in JSON format.
You can use this file as an input source for your favorite data lake solution.
The event logging functionality provides better performance and reliability than event handlers.


| event-log-buffer-size |      |
-----------------------|------
description            | Buffer size of the event logger. Corresponds to the maximum number of events kept in memory in case the log file is temporarily unavailable or more events have been received than can be written to the log file. 
type                   | Integer
default                | 100000
environment variable   | `SENSU_BACKEND_EVENT_LOG_BUFFER_SIZE`
example                | {{< highlight shell >}}# Command line example
sensu-backend start --event-log-buffer-size 100000


# /etc/sensu/backend.yml example
event-log-buffer-size: 100000{{< /highlight >}}


| event-log-file |      |
-----------------------|------
description            | Path to the event log file. _**WARNING**: The log file should be located on a local drive. Logging directly to network drives is not supported._
type                   | String
environment variable   | `SENSU_BACKEND_EVENT_LOG_FILE`
example                | {{< highlight shell >}}# Command line example
sensu-backend start --event-log-file /var/log/sensu/events.log


# /etc/sensu/backend.yml example
event-log-file: "/var/log/sensu/events.log"{{< /highlight >}}


#### Log rotation

Event logging supports log rotation via the _SIGHUP_ signal.
First, rename (move) the current log file.
Then, send the _SIGHUP_ signal to the sensu-backend process so it creates a new log file and starts logging to it.

Here are some log rotate sample configurations:

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
[5]: ../../reference/checks/
[6]: ../../dashboard/overview/
[7]: ../../guides/send-slack-alerts/
[8]: ../../guides/reduce-alert-fatigue/
[9]: ../../reference/filters/
[10]: ../../reference/mutators/
[11]: ../../reference/handlers/
[12]: #datastore-and-cluster-configuration-flags
[13]: ../../guides/clustering/
[14]: ../../getting-started/enterprise/
[15]: #general-configuration-flags
[16]: https://github.com/etcd-io/etcd/blob/master/Documentation/tuning.md#time-parameters
[17]: ../../files/backend.yml
[18]: https://golang.org/pkg/crypto/tls/#pkg-constants
[19]: https://etcd.io/docs/v3.3.12/op-guide/clustering/#discovery
[20]: https://etcd.io/docs/v3.3.12/op-guide/clustering/#etcd-discovery
[21]: https://etcd.io/docs/v3.3.12/op-guide/clustering/#dns-discovery
[22]: #initialization
[23]: #etcd-listen-client-urls
