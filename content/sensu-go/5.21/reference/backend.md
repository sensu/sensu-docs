---
title: "Sensu backend"
linkTitle: "Sensu Backend"
reference_title: "Backend"
type: "reference"
description: "The Sensu backend manages check requests and event data. Every Sensu backend includes an event processing pipeline that applies filters, mutators, handlers, the Sensu API, and the Sensu web UI. Read the reference doc to run the Sensu backend."
weight: 20
version: "5.21"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-5.21:
    parent: reference
---

[Example Sensu backend configuration file](../../files/backend.yml) (download)

The Sensu backend is a service that manages check requests and event data.
Every Sensu backend includes an integrated transport for scheduling checks using subscriptions, an event processing pipeline that applies filters, mutators, and handlers, an embedded [etcd][2] datastore for storing configuration and state, a Sensu API, a [Sensu web UI][6], and the `sensu-backend` command line tool.
The Sensu backend is available for Ubuntu/Debian and RHEL/CentOS distributions of Linux.
See the [installation guide][1] to install the backend.

## Backend transport

The Sensu backend listens for agent communications via [WebSocket][30] transport.
By default, this transport operates on port 8081.
The agent subscriptions are used to determine which check execution requests the backend publishes via the transport.
Sensu agents locally execute checks as requested by the backend and publish check results back to the transport to be processed.

Sensu agents authenticate to the Sensu backend via transport by either [built-in username and password][34] or [mutual transport layer security (mTLS)][31] authentication.

To secure the WebSocket transport, first [generate the certificates][32] you will need to set up transport layer security (TLS).
Then, [secure Sensu][33] by configuring either TLS or mTLS to make Sensu production-ready.

Read the [Sensu architecture overview][35] for a diagram that includes the WebSocket transport.

## Create event pipelines

The backend processes event data and executes filters, mutators, and handlers.
These pipelines are powerful tools to automate your monitoring workflows.
To learn more about filters, mutators, and handlers, see:

- [Guide to sending Slack alerts with handlers][7]
- [Guide to reducing alerting fatigue with filters][8]
- [Filters reference documentation][9]
- [Mutators reference documentation][10]
- [Handlers reference documentation][11]

## Schedule checks

The backend is responsible for storing check definitions and scheduling check requests.
Check scheduling is subscription-based: the backend sends check requests to subscriptions. where they're picked up by subscribing agents.

For information about creating and managing checks, see:

- [Monitor server resources with checks][3]
- [Collect metrics with checks][4]
- [Checks reference documentation][5]

## Initialization

For a **new** installation, the backend database must be initialized by providing a username and password for the user to be granted administrative privileges.
Although initialization is required for every new installation, the implementation differs depending on your method of installation:

- If you are using Docker, you can use environment variables to override the default admin username (`admin`) and password (`P@ssw0rd!`) during [step 2 of the backend installation process][24].
- If you are using Ubuntu/Debian or RHEL/CentOS, you must specify admin credentials during [step 3 of the backend installation process][25].
Sensu does not apply a default admin username or password for Ubuntu/Debian or RHEL/CentoOS installations.

This step bootstraps the first admin user account for your Sensu installation.
This account will be granted the cluster admin role.

{{% notice important %}}
**IMPORTANT**: If you plan to [run a Sensu cluster](../../operations/deploy-sensu/cluster-sensu/), make sure that each of your backend nodes is configured, running, and a member of the cluster before you initialize.
{{% /notice %}}

### Docker initialization

For Docker installations, set administrator credentials with environment variables when you [configure and start][24] the backend as shown below, replacing `YOUR_USERNAME` and `YOUR_PASSWORD` with the username and password you want to use:

{{< language-toggle >}}

{{< code Docker >}}
docker run -v /var/lib/sensu:/var/lib/sensu \
-d --name sensu-backend \
-p 3000:3000 -p 8080:8080 -p 8081:8081 \
-e SENSU_BACKEND_CLUSTER_ADMIN_USERNAME=YOUR_USERNAME \
-e SENSU_BACKEND_CLUSTER_ADMIN_PASSWORD=YOUR_PASSWORD \
sensu/sensu:latest \
sensu-backend start --state-dir /var/lib/sensu/sensu-backend --log-level debug
{{< /code >}}

{{< code docker "Docker Compose" >}}
---
version: "3"
services:
  sensu-backend:
    ports:
    - 3000:3000
    - 8080:8080
    - 8081:8081
    volumes:
    - "sensu-backend-data:/var/lib/sensu/sensu-backend/etcd"
    command: "sensu-backend start --state-dir /var/lib/sensu/sensu-backend --log-level debug"
    environment:
    - SENSU_BACKEND_CLUSTER_ADMIN_USERNAME=YOUR_USERNAME
    - SENSU_BACKEND_CLUSTER_ADMIN_PASSWORD=YOUR_PASSWORD
    image: sensu/sensu:latest

volumes:
  sensu-backend-data:
    driver: local
{{< /code >}}

{{< /language-toggle >}}

If you did not use environment variables to override the default admin credentials in [step 2 of the backend installation process][24], we recommend [changing your default admin password][26] as soon as you have installed sensuctl.

### Ubuntu/Debian or RHEL/CentOS initialization

For Ubuntu/Debian or RHEL/CentOS, set administrator credentials with environment variables at [initialization][25] as shown below, replacing `YOUR_USERNAME` and `YOUR_PASSWORD` with the username and password you want to use:

{{< code shell >}}
export SENSU_BACKEND_CLUSTER_ADMIN_USERNAME=YOUR_USERNAME
export SENSU_BACKEND_CLUSTER_ADMIN_PASSWORD=YOUR_PASSWORD
sensu-backend init
{{< /code >}}

{{% notice note %}}
**NOTE**: Make sure the Sensu backend is running before you run `sensu-backend init`.
{{% /notice %}}

You can also run the `sensu-backend init` command in interactive mode if you prefer to respond to prompts for your username and password:

{{< code shell >}}
sensu-backend init --interactive

Admin Username: YOUR_USERNAME
Admin Password: YOUR_PASSWORD
{{< /code >}}

{{% notice note %}}
**NOTE**: If you are already using Sensu, you do not need to initialize.
Your installation has already seeded the admin username and password you have set up.
Running `sensu-backend init` on a previously initialized cluster has no effect &mdash; it will not change the admin credentials.
{{% /notice %}}

To see available initialization flags:

{{< code shell >}}
sensu-backend init --help
{{< /code >}}

## Operation and service management {#operation}

{{% notice note %}}
**NOTE**: Commands in this section may require administrative privileges.
{{% /notice %}}

### Start the service

Use the `sensu-backend` tool to start the backend and apply configuration flags.

To start the backend with [configuration flags][15]:

{{< code shell >}}
sensu-backend start --state-dir /var/lib/sensu/sensu-backend --log-level debug
{{< /code >}}

To see available configuration flags and defaults:

{{< code shell >}}
sensu-backend start --help
{{< /code >}}

If you do not provide any configuration flags, the backend loads configuration from `/etc/sensu/backend.yml` by default.

To start the backend using a service manager:

{{< code shell >}}
service sensu-backend start
{{< /code >}}

### Stop the service

To stop the backend service using a service manager:

{{< code shell >}}
service sensu-backend stop
{{< /code >}}

### Restart the service

You must restart the backend to implement any configuration updates.

To restart the backend using a service manager:

{{< code shell >}}
service sensu-backend restart
{{< /code >}}

### Enable on boot

To enable the backend to start on system boot:

{{< code shell >}}
systemctl enable sensu-backend
{{< /code >}}

To disable the backend from starting on system boot:

{{< code shell >}}
systemctl disable sensu-backend
{{< /code >}}

{{% notice note %}}
**NOTE**: On older distributions of Linux, use `sudo chkconfig sensu-server on` to enable the backend and `sudo chkconfig sensu-server off` to disable the backend.
{{% /notice %}}

### Get service status

To see the status of the backend service using a service manager:

{{< code shell >}}
service sensu-backend status
{{< /code >}}

### Get service version

To get the current backend version using the `sensu-backend` tool:

{{< code shell >}}
sensu-backend version
{{< /code >}}

### Get help

The `sensu-backend` tool provides general and command-specific help flags:

{{< code shell >}}
# Show sensu-backend commands
sensu-backend help

# Show options for the sensu-backend start subcommand
sensu-backend start --help
{{< /code >}}

### Cluster

You can run the backend as a standalone service, but running a cluster of backends makes Sensu more highly available, reliable, and durable.
Sensu backend clusters build on the [etcd clustering system][2].
Clustering lets you synchronize data between backends and get the benefits of a highly available configuration.

To configure a cluster, see:

- [Datastore configuration flags][12]
- [Run a Sensu cluster][13]

### Synchronize time

System clocks between agents and the backend should be synchronized to a central NTP server.
If system time is out-of-sync, it may cause issues with keepalive, metric, and check alerts.

## Configuration via flags

You can specify the backend configuration with either a `/etc/sensu/backend.yml` file or `sensu-backend start` [configuration flags][15].
The backend requires that the `state-dir` flag is set before starting.
All other required flags have default values.
See the [example backend configuration file][17] for flags and defaults.
The backend loads configuration upon startup, so you must restart the backend for any configuration updates to take effect.

### Certificate bundles or chains

The Sensu backend supports all types of certificate bundles (or chains) as long as the server (or leaf) certificate is the *first* certificate in the bundle.
This is because the Go standard library assumes that the first certificate listed in the PEM file is the server certificate &mdash; the certificate that the program will use to show its own identity.

If you send the server certificate alone instead of sending the whole bundle with the server certificate first, you will see a `certificate not signed by trusted authority` error.
You must present the whole chain to the remote so it can determine whether it trusts the server certificate through the chain.

### Certificate revocation check

The Sensu backend checks certificate revocation list (CRL) and Online Certificate Status Protocol (OCSP) endpoints for mutual transport layer security (mTLS), etcd client, and etcd peer connections whose remote sides present X.509 certificates that provide CRL and OCSP revocation information.

### Configuration summary

{{< code text >}}
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
      --annotations stringToString          entity annotations map (default [])
      --api-listen-address string           address to listen on for API traffic (default "[::]:8080")
      --api-url string                      URL of the API to connect to (default "http://localhost:8080")
      --assets-burst-limit int              asset fetch burst limit (default 100)
      --assets-rate-limit float             maximum number of assets fetched per second
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
      --labels stringToString               entity labels map (default [])
      --log-level string                    logging level [panic, fatal, error, warn, info, debug] (default "warn")
      --pipelined-buffer-size int           number of events to handle that can be buffered (default 100)
      --pipelined-workers int               number of workers spawned for handling events through the event pipeline (default 100)
      --require-fips                        indicates whether fips support should be required in openssl
      --require-openssl                     indicates whether openssl should be required instead of go's built-in crypto
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
{{< /code >}}


### General configuration flags

| annotations|      |
-------------|------
description  | Non-identifying metadata to include with entity data for backend assets (for example, handler and mutator assets).{{% notice note %}}
**NOTE**: For annotations that you define in backend.yml, the keys are automatically modified to use all lower-case letters. For example, if you define the annotation `webhookURL: "https://my-webhook.com"` in backend.yml, it will be listed as `webhookurl: "https://my-webhook.com"` in entity definitions.<br><br>Key cases are **not** modified for annotations you define with the `--annotations` command line flag or the `SENSU_BACKEND_ANNOTATIONS` environment variable.
{{% /notice %}}
required     | false
type         | Map of key-value pairs. Keys and values can be any valid UTF-8 string.
default      | `null`
environment variable | `SENSU_BACKEND_ANNOTATIONS`
example      | {{< code shell >}}# Command line examples
sensu-backend start --annotations sensu.io/plugins/slack/config/webhook-url=https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX
sensu-backend start --annotations example-key="example value" --annotations example-key2="example value"

# /etc/sensu/backend.yml example
annotations:
  sensu.io/plugins/slack/config/webhook-url: "https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX"
{{< /code >}}


| api-listen-address  |      |
-------------|------
description  | Address the API daemon will listen for requests on.
type         | String
default      | `[::]:8080`
environment variable | `SENSU_BACKEND_API_LISTEN_ADDRESS`
example      | {{< code shell >}}# Command line example
sensu-backend start --api-listen-address [::]:8080

# /etc/sensu/backend.yml example
api-listen-address: "[::]:8080"{{< /code >}}


| api-url  |      |
-------------|------
description  | URL used to connect to the API.
type         | String
default      | `http://localhost:8080`
environment variable | `SENSU_BACKEND_API_URL`
example      | {{< code shell >}}# Command line example
sensu-backend start --api-url http://localhost:8080

# /etc/sensu/backend.yml example
api-url: "http://localhost:8080"{{< /code >}}


| assets-burst-limit   |      |
--------------|------
description   | Maximum amount of burst allowed in a rate interval when fetching assets.
type          | Integer
default       | `100`
environment variable | `SENSU_BACKEND_ASSETS_BURST_LIMIT`
example       | {{< code shell >}}# Command line example
sensu-backend start --assets-burst-limit 100

# /etc/sensu/backend.yml example
assets-burst-limit: 100{{< /code >}}


| assets-rate-limit   |      |
--------------|------
description   | Maximum number of assets to fetch per second. The default value `1.39` is equivalent to approximately 5000 user-to-server requests per hour.
type          | Float
default       | `1.39`
environment variable | `SENSU_BACKEND_ASSETS_RATE_LIMIT`
example       | {{< code shell >}}# Command line example
sensu-backend start --assets-rate-limit 1.39

# /etc/sensu/backend.yml example
assets-rate-limit: 1.39{{< /code >}}


| cache-dir   |      |
--------------|------
description   | Path to store cached data.
type          | String
default       | `/var/cache/sensu/sensu-backend`
environment variable | `SENSU_BACKEND_CACHE_DIR`
example       | {{< code shell >}}# Command line example
sensu-backend start --cache-dir /cache/sensu-backend

# /etc/sensu/backend.yml example
cache-dir: "/cache/sensu-backend"{{< /code >}}


| config-file |      |
--------------|------
description   | Path to Sensu backend config file.
type          | String
default       | `/etc/sensu/backend.yml`
environment variable | The config file path cannot be set by an environment variable.
example       | {{< code shell >}}# Command line example
sensu-backend start --config-file /etc/sensu/backend.yml
sensu-backend start -c /etc/sensu/backend.yml
{{< /code >}}

<a id="debug-attribute"></a>

| debug     |      |
------------|------
description | If `true`, enable debugging and profiling features for use with the [Go pprof package][27]. Otherwise, `false`.
type        | Boolean
default     | `false`
environment variable | `SENSU_BACKEND_DEBUG`
example     | {{< code shell >}}# Command line example
sensu-backend start --debug

# /etc/sensu/backend.yml example
debug: true{{< /code >}}


| deregistration-handler |      |
-------------------------|------
description              | Name of the default event handler to use when processing agent deregistration events.
type                     | String
default                  | `""`
environment variable     | `SENSU_BACKEND_DEREGISTRATION_HANDLER`
example                  | {{< code shell >}}# Command line example
sensu-backend start --deregistration-handler deregister

# /etc/sensu/backend.yml example
deregistration-handler: "deregister"{{< /code >}}


| labels     |      |
-------------|------
description  | Custom attributes to include with entity data for backend assets (for example, handler and mutator assets).{{% notice note %}}
**NOTE**: For labels that you define in backend.yml, the keys are automatically modified to use all lower-case letters. For example, if you define the label `securityZone: "us-west-2a"` in backend.yml, it will be listed as `securityzone: "us-west-2a"` in entity definitions.<br><br>Key cases are **not** modified for labels you define with the `--labels` command line flag or the `SENSU_BACKEND_LABELS` environment variable.
{{% /notice %}}
required     | false
type         | Map of key-value pairs. Keys can contain only letters, numbers, and underscores and must start with a letter. Values can be any valid UTF-8 string.
default      | `null`
environment variable | `SENSU_BACKEND_LABELS`
example               | {{< code shell >}}# Command line examples
sensu-backend start --labels security_zone=us-west-2a
sensu-backend start --labels example_key1="example value" example_key2="example value"

# /etc/sensu/backend.yml example
labels:
  security_zone: "us-west-2a"
{{< /code >}}


| log-level  |      |
-------------|------
description  | Logging level: `panic`, `fatal`, `error`, `warn`, `info`, or `debug`.
type         | String
default      | `warn`
environment variable | `SENSU_BACKEND_LOG_LEVEL`
example      | {{< code shell >}}# Command line example
sensu-backend start --log-level debug

# /etc/sensu/backend.yml example
log-level: "debug"{{< /code >}}


| state-dir  |      |
-------------|------
description  | Path to Sensu state storage: `/var/lib/sensu/sensu-backend`.
type         | String
required     | true
environment variable | `SENSU_BACKEND_STATE_DIR`
example      | {{< code shell >}}# Command line example
sensu-backend start --state-dir /var/lib/sensu/sensu-backend
sensu-backend start -d /var/lib/sensu/sensu-backend

# /etc/sensu/backend.yml example
state-dir: "/var/lib/sensu/sensu-backend"{{< /code >}}


### Agent communication configuration flags

| agent-auth-cert-file |      |
-------------|------
description  | TLS certificate in PEM format for agent certificate authentication. Sensu supports certificate bundles (or chains) as long as the server (or leaf) certificate is the *first* certificate in the bundle.
type         | String
default      | `""`
environment variable | `SENSU_BACKEND_AGENT_AUTH_CERT_FILE`
example      | {{< code shell >}}# Command line example
sensu-backend start --agent-auth-cert-file /path/to/ssl/cert.pem

# /etc/sensu/backend.yml example
agent-auth-cert-file: /path/to/ssl/cert.pem{{< /code >}}


| agent-auth-crl-urls |      |
-------------|------
description  | URLs of CRLs for agent certificate authentication. The Sensu backend uses this list to perform a revocation check for agent mTLS.
type         | String
default      | `""`
environment variable | `SENSU_BACKEND_AGENT_AUTH_CRL_URLS`
example      | {{< code shell >}}# Command line example
sensu-backend start --agent-auth-crl-urls http://localhost/CARoot.crl

# /etc/sensu/backend.yml example
agent-auth-crl-urls: http://localhost/CARoot.crl{{< /code >}}


| agent-auth-key-file |      |
-------------|------
description  | TLS certificate key in PEM format for agent certificate authentication.
type         | String
default      | `""`
environment variable | `SENSU_BACKEND_AGENT_AUTH_KEY_FILE`
example      | {{< code shell >}}# Command line example
sensu-backend start --agent-auth-key-file /path/to/ssl/key.pem

# /etc/sensu/backend.yml example
agent-auth-key-file: /path/to/ssl/key.pem{{< /code >}}


| agent-auth-trusted-ca-file |      |
-------------|------
description  | TLS CA certificate bundle in PEM format for agent certificate authentication.
type         | String
default      | `""`
environment variable | `SENSU_BACKEND_AGENT_AUTH_TRUSTED_CA_FILE`
example      | {{< code shell >}}# Command line example
sensu-backend start --agent-auth-trusted-ca-file /path/to/ssl/ca.pem

# /etc/sensu/backend.yml example
agent-auth-trusted-ca-file: /path/to/ssl/ca.pem{{< /code >}}


| agent-host   |      |
---------------|------
description    | Agent listener host. Listens on all IPv4 and IPv6 addresses by default.
type           | String
default        | `[::]`
environment variable | `SENSU_BACKEND_AGENT_HOST`
example        | {{< code shell >}}# Command line example
sensu-backend start --agent-host 127.0.0.1

# /etc/sensu/backend.yml example
agent-host: "127.0.0.1"{{< /code >}}


| agent-port |      |
-------------|------
description  | Agent listener port.
type         | Integer
default      | `8081`
environment variable | `SENSU_BACKEND_AGENT_PORT`
example      | {{< code shell >}}# Command line example
sensu-backend start --agent-port 8081

# /etc/sensu/backend.yml example
agent-port: 8081{{< /code >}}


### Security configuration flags

| cert-file  |      |
-------------|------
description  | Path to the primary backend certificate file. Specifies a fallback SSL/TLS certificate if the flag `dashboard-cert-file` is not used. This certificate secures communications between the Sensu web UI and end user web browsers, as well as communication between sensuctl and the Sensu API. Sensu supports certificate bundles (or chains) as long as the server (or leaf) certificate is the *first* certificate in the bundle.
type         | String
default      | `""`
environment variable | `SENSU_BACKEND_CERT_FILE`
example      | {{< code shell >}}# Command line example
sensu-backend start --cert-file /path/to/ssl/cert.pem

# /etc/sensu/backend.yml example
cert-file: "/path/to/ssl/cert.pem"{{< /code >}}


| insecure-skip-tls-verify |      |
---------------------------|------
description                | If `true`, skip SSL verification. Otherwise, `false`. {{% notice warning %}}
**WARNING**: This configuration flag is intended for use in development systems only. Do not use this flag in production.
{{% /notice %}}
type                       | Boolean
default                    | `false`
environment variable | `SENSU_BACKEND_INSECURE_SKIP_TLS_VERIFY`
example                    | {{< code shell >}}# Command line example
sensu-backend start --insecure-skip-tls-verify

# /etc/sensu/backend.yml example
insecure-skip-tls-verify: true{{< /code >}}


<a id="jwt-attributes"></a>

| jwt-private-key-file |      |
-------------|------
description  | Path to the PEM-encoded private key to use to sign JSON Web Tokens (JWTs). {{% notice note %}}
**NOTE**: The internal symmetric secret key is used by default to sign all JWTs unless a private key is specified via this attribute.
{{% /notice %}}
type         | String
default      | `""`
environment variable | `SENSU_BACKEND_JWT_PRIVATE_KEY_FILE`
example      | {{< code shell >}}# Command line example
sensu-backend start --jwt-private-key-file /path/to/key/private.pem

# /etc/sensu/backend.yml example
jwt-private-key-file: /path/to/key/private.pem{{< /code >}}


| jwt-public-key-file |      |
-------------|------
description  | Path to the PEM-encoded public key to use to verify JSON Web Token (JWT) signatures. {{% notice note %}}
**NOTE**: JWTs signed with the internal symmetric secret key will continue to be verified with that key.
{{% /notice %}}
type         | String
default      | `""`
environment variable | `SENSU_BACKEND_JWT_PUBLIC_KEY_FILE`
required     | false, unless `jwt-private-key-file` is defined
example      | {{< code shell >}}# Command line example
sensu-backend start --jwt-public-key-file /path/to/key/public.pem

# /etc/sensu/backend.yml example
jwt-public-key-file: /path/to/key/public.pem{{< /code >}}


| key-file   |      |
-------------|------
description  | Path to the primary backend key file. Specifies a fallback SSL/TLS key if the flag `dashboard-key-file` is not used. This key secures communication between the Sensu web UI and end user web browsers, as well as communication between sensuctl and the Sensu API.
type         | String
default      | `""`
environment variable | `SENSU_BACKEND_KEY_FILE`
example      | {{< code shell >}}# Command line example
sensu-backend start --key-file /path/to/ssl/key.pem

# /etc/sensu/backend.yml example
key-file: "/path/to/ssl/key.pem"{{< /code >}}

<a id="fips-openssl"></a>

| require-fips |      |
------------------|------
description       | Require Federal Information Processing Standard (FIPS) support in OpenSSL. Logs an error at Sensu backend startup if `true` but OpenSSL is not running in FIPS mode. {{% notice note %}}
**NOTE**: The `--require-fips` flag is only available within the Linux amd64 OpenSSL-linked binary.
[Contact Sensu](https://sensu.io/contact) to request the builds for OpenSSL with FIPS support.
{{% /notice %}}
type              | Boolean
default           | false
environment variable | `SENSU_BACKEND_REQUIRE_FIPS`
example           | {{< code shell >}}# Command line example
sensu-backend start --require-fips

# /etc/sensu/backend.yml example
require-fips: true{{< /code >}}

| require-openssl |      |
------------------|------
description       | Use OpenSSL instead of Go's standard cryptography library. Logs an error at Sensu backend startup if `true` but Go's standard cryptography library is loaded. {{% notice note %}}
**NOTE**: The `--require-openssl` flag is only available within the Linux amd64 OpenSSL-linked binary.
[Contact Sensu](https://sensu.io/contact) to request the builds for OpenSSL with FIPS support.
{{% /notice %}}
type              | Boolean
default           | false
environment variable | `SENSU_BACKEND_REQUIRE_OPENSSL`
example           | {{< code shell >}}# Command line example
sensu-backend start --require-openssl

# /etc/sensu/backend.yml example
require-openssl: true{{< /code >}}

| trusted-ca-file |      |
------------------|------
description       | Path to the primary backend CA file. Specifies a fallback SSL/TLS certificate authority in PEM format used for etcd client (mutual TLS) communication if the `etcd-trusted-ca-file` is not used. This CA file is used in communication between the Sensu web UI and end user web browsers, as well as communication between sensuctl and the Sensu API.
type              | String
default           | `""`
environment variable | `SENSU_BACKEND_TRUSTED_CA_FILE`
example           | {{< code shell >}}# Command line example
sensu-backend start --trusted-ca-file /path/to/trusted-certificate-authorities.pem

# /etc/sensu/backend.yml example
trusted-ca-file: "/path/to/trusted-certificate-authorities.pem"{{< /code >}}


### Web UI configuration flags

| dashboard-cert-file | |
-------------|------
description  | Web UI TLS certificate in PEM format. This certificate secures communication with the Sensu web UI. If the `dashboard-cert-file` is not provided in the backend configuration, Sensu uses the certificate specified in the [`cert-file` flag](#security-configuration-flags) for the web UI. Sensu supports certificate bundles (or chains) as long as the server (or leaf) certificate is the *first* certificate in the bundle.
type         | String
default      | `""`
environment variable | `SENSU_BACKEND_DASHBOARD_CERT_FILE`
example      | {{< code shell >}}# Command line example
sensu-backend start --dashboard-cert-file /path/to/tls/cert.pem

# /etc/sensu/backend.yml example
dashboard-cert-file: "/path/to/tls/cert.pem"{{< /code >}}


| dashboard-host |      |
-----------------|------
description      | Web UI listener host.
type             | String
default          | `[::]`
environment variable | `SENSU_BACKEND_DASHBOARD_HOST`
example          | {{< code shell >}}# Command line example
sensu-backend start --dashboard-host 127.0.0.1

# /etc/sensu/backend.yml example
dashboard-host: "127.0.0.1"{{< /code >}}


| dashboard-key-file | |
-------------|------
description  | Web UI TLS certificate key in PEM format. This key secures communication with the Sensu web UI. If the `dashboard-key-file` is not provided in the backend configuration, Sensu uses the key specified in the [`key-file` flag](#security-configuration-flags) for the web UI.
type         | String
default      | `""`
environment variable | `SENSU_BACKEND_DASHBOARD_KEY_FILE`
example      | {{< code shell >}}# Command line example
sensu-backend start --dashboard-key-file /path/to/tls/key.pem

# /etc/sensu/backend.yml example
dashboard-key-file: "/path/to/tls/key.pem"{{< /code >}}


| dashboard-port |      |
-----------------|------
description      | Web UI listener port.
type             | Integer
default          | `3000`
environment variable | `SENSU_BACKEND_DASHBOARD_PORT`
example          | {{< code shell >}}# Command line example
sensu-backend start --dashboard-port 4000

# /etc/sensu/backend.yml example
dashboard-port: 4000{{< /code >}}


### Datastore and cluster configuration flags

| etcd-advertise-client-urls |      |
--------------|------
description   | List of this member's client URLs to advertise to the rest of the cluster.{{% notice note %}}
**NOTE**: To use Sensu with an [external etcd cluster](../../../operations/deploy-sensu/cluster-sensu/#use-an-external-etcd-cluster), follow etcd's [clustering guide](https://etcd.io/docs/latest/op-guide/clustering/).
Do not configure external etcd in Sensu via backend command line flags or the backend configuration file (`/etc/sensu/backend.yml`).
{{% /notice %}}
type          | List
default       | `http://localhost:2379`
environment variable | `SENSU_BACKEND_ETCD_ADVERTISE_CLIENT_URLS`
example       | {{< code shell >}}# Command line examples
sensu-backend start --etcd-advertise-client-urls http://localhost:2378,http://localhost:2379
sensu-backend start --etcd-advertise-client-urls http://localhost:2378 --etcd-advertise-client-urls http://localhost:2379

# /etc/sensu/backend.yml example
etcd-advertise-client-urls:
  - http://localhost:2378
  - http://localhost:2379
{{< /code >}}


| etcd-cert-file |      |
-----------------|------
description      | Path to the etcd client API TLS certificate file. Secures communication between the embedded etcd client API and any etcd clients. Sensu supports certificate bundles (or chains) as long as the server (or leaf) certificate is the *first* certificate in the bundle.{{% notice note %}}
**NOTE**: To use Sensu with an [external etcd cluster](../../../operations/deploy-sensu/cluster-sensu/#use-an-external-etcd-cluster), follow etcd's [clustering guide](https://etcd.io/docs/latest/op-guide/clustering/).
Do not configure external etcd in Sensu via backend command line flags or the backend configuration file (`/etc/sensu/backend.yml`).
{{% /notice %}}
type             | String
default          | `""`
environment variable | `SENSU_BACKEND_ETCD_CERT_FILE`
example          | {{< code shell >}}# Command line example
sensu-backend start --etcd-cert-file ./client.pem

# /etc/sensu/backend.yml example
etcd-cert-file: "./client.pem"{{< /code >}}


<a id="etcd-cipher-suites"></a>

| etcd-cipher-suites    |      |
------------------------|------
description             | List of allowed cipher suites for etcd TLS configuration. Sensu supports TLS 1.0-1.2 cipher suites as listed in the [Go TLS documentation][18]. You can use this attribute to defend your TLS servers from attacks on weak TLS ciphers. Go determines the default cipher suites based on the hardware used. {{% notice note %}}
**NOTE**: To use TLS 1.3, add the following environment variable: `GODEBUG="tls13=1"`.<br><br><To use Sensu with an [external etcd cluster](../../../operations/deploy-sensu/cluster-sensu/#use-an-external-etcd-cluster), follow etcd's [clustering guide](https://etcd.io/docs/latest/op-guide/clustering/).
Do not configure external etcd in Sensu via backend command line flags or the backend configuration file (`/etc/sensu/backend.yml`).
{{% /notice %}}
recommended             | {{< code shell >}}
etcd-cipher-suites:
  - TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384
  - TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
  - TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256
  - TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256
  - TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305
  - TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305
{{< /code >}}
type                    | List
environment variable | `SENSU_BACKEND_ETCD_CIPHER_SUITES`
example                 | {{< code shell >}}# Command line examples
sensu-backend start --etcd-cipher-suites TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
sensu-backend start --etcd-cipher-suites TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256 --etcd-cipher-suites TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384

# /etc/sensu/backend.yml example
etcd-cipher-suites:
  - TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256
  - TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
{{< /code >}}


| etcd-client-cert-auth |      |
------------------------|------
description             | If `true`, enable client certificate authentication. Otherwise, `false`.{{% notice note %}}
**NOTE**: To use Sensu with an [external etcd cluster](../../../operations/deploy-sensu/cluster-sensu/#use-an-external-etcd-cluster), follow etcd's [clustering guide](https://etcd.io/docs/latest/op-guide/clustering/).
Do not configure external etcd in Sensu via backend command line flags or the backend configuration file (`/etc/sensu/backend.yml`).
{{% /notice %}}
type                    | Boolean
default                 | `false`
environment variable | `SENSU_BACKEND_ETCD_CLIENT_CERT_AUTH`
example                 | {{< code shell >}}# Command line example
sensu-backend start --etcd-client-cert-auth

# /etc/sensu/backend.yml example
etcd-client-cert-auth: true{{< /code >}}


| etcd-client-urls      |      |
------------------------|------
description             | List of client URLs to use when a sensu-backend is not operating as an etcd member. To configure sensu-backend for use with an external etcd instance, use this flag in conjunction with `--no-embed-etcd` when executing sensu-backend start or [sensu-backend init][22]. If you do not use this flag when using `--no-embed-etcd`, sensu-backend start and sensu-backend-init will fall back to [--etcd-listen-client-urls][23].{{% notice note %}}
**NOTE**: To use Sensu with an [external etcd cluster](../../../operations/deploy-sensu/cluster-sensu/#use-an-external-etcd-cluster), follow etcd's [clustering guide](https://etcd.io/docs/latest/op-guide/clustering/).
Do not configure external etcd in Sensu via backend command line flags or the backend configuration file (`/etc/sensu/backend.yml`).
{{% /notice %}}
type                    | List
default                 | `http://127.0.0.1:2379`
environment variable | `SENSU_BACKEND_ETCD_CLIENT_URLS`
example                   | {{< code shell >}}# Command line examples
sensu-backend start --etcd-client-urls https://10.0.0.1:2379,https://10.1.0.1:2379
sensu-backend start --etcd-client-urls https://10.0.0.1:2379 --etcd-client-urls https://10.1.0.1:2379

# /etc/sensu/backend.yml example
etcd-client-urls:
  - https://10.0.0.1:2379
  - https://10.1.0.1:2379
{{< /code >}}


| etcd-discovery        |      |
------------------------|------
description             | Exposes [etcd's embedded auto-discovery features][19]. Attempts to use [etcd discovery][20] to get the cluster configuration.{{% notice note %}}
**NOTE**: To use Sensu with an [external etcd cluster](../../../operations/deploy-sensu/cluster-sensu/#use-an-external-etcd-cluster), follow etcd's [clustering guide](https://etcd.io/docs/latest/op-guide/clustering/).
Do not configure external etcd in Sensu via backend command line flags or the backend configuration file (`/etc/sensu/backend.yml`).
{{% /notice %}}
type                    | String
default                 | ""
environment variable | `SENSU_BACKEND_ETCD_DISCOVERY`
example                 | {{< code shell >}}# Command line example
sensu-backend start --etcd-discovery https://discovery.etcd.io/3e86b59982e49066c5d813af1c2e2579cbf573de

# /etc/sensu/backend.yml example
etcd-discovery:
  - https://discovery.etcd.io/3e86b59982e49066c5d813af1c2e2579cbf573de
{{< /code >}}


| etcd-discovery-srv    |      |
------------------------|------
description             | Exposes [etcd's embedded auto-discovery features][17]. Attempts to use a [DNS SRV][21] record to get the cluster configuration.{{% notice note %}}
**NOTE**: To use Sensu with an [external etcd cluster](../../../operations/deploy-sensu/cluster-sensu/#use-an-external-etcd-cluster), follow etcd's [clustering guide](https://etcd.io/docs/latest/op-guide/clustering/).
Do not configure external etcd in Sensu via backend command line flags or the backend configuration file (`/etc/sensu/backend.yml`).
{{% /notice %}}
type                    | String
default                 | ""
environment variable | `SENSU_BACKEND_ETCD_DISCOVERY_SRV`
example                 | {{< code shell >}}# Command line example
sensu-backend start --etcd-discovery-srv example.org

# /etc/sensu/backend.yml example
etcd-discovery-srv:
  - example.org
{{< /code >}}


| etcd-initial-advertise-peer-urls |      |
-----------------------------------|------
description                        | List of this member's peer URLs to advertise to the rest of the cluster.{{% notice note %}}
**NOTE**: To use Sensu with an [external etcd cluster](../../../operations/deploy-sensu/cluster-sensu/#use-an-external-etcd-cluster), follow etcd's [clustering guide](https://etcd.io/docs/latest/op-guide/clustering/).
Do not configure external etcd in Sensu via backend command line flags or the backend configuration file (`/etc/sensu/backend.yml`).
{{% /notice %}}
type                               | List
default                            | `http://127.0.0.1:2380`
environment variable               | `SENSU_BACKEND_ETCD_INITIAL_ADVERTISE_PEER_URLS`
example                            | {{< code shell >}}# Command line examples
sensu-backend start --etcd-initial-advertise-peer-urls https://10.0.0.1:2380,https://10.1.0.1:2380
sensu-backend start --etcd-initial-advertise-peer-urls https://10.0.0.1:2380 --etcd-initial-advertise-peer-urls https://10.1.0.1:2380

# /etc/sensu/backend.yml example
etcd-initial-advertise-peer-urls:
  - https://10.0.0.1:2380
  - https://10.1.0.1:2380
{{< /code >}}


| etcd-initial-cluster |      |
-----------------------|------
description            | Initial cluster configuration for bootstrapping.{{% notice note %}}
**NOTE**: To use Sensu with an [external etcd cluster](../../../operations/deploy-sensu/cluster-sensu/#use-an-external-etcd-cluster), follow etcd's [clustering guide](https://etcd.io/docs/latest/op-guide/clustering/).
Do not configure external etcd in Sensu via backend command line flags or the backend configuration file (`/etc/sensu/backend.yml`).
{{% /notice %}}
type                   | String
default                | `default=http://127.0.0.1:2380`
environment variable   | `SENSU_BACKEND_ETCD_INITIAL_CLUSTER`
example                | {{< code shell >}}# Command line example
sensu-backend start --etcd-initial-cluster backend-0=https://10.0.0.1:2380,backend-1=https://10.1.0.1:2380,backend-2=https://10.2.0.1:2380

# /etc/sensu/backend.yml example
etcd-initial-cluster: "backend-0=https://10.0.0.1:2380,backend-1=https://10.1.0.1:2380,backend-2=https://10.2.0.1:2380"{{< /code >}}


| etcd-initial-cluster-state |      |
-----------------------------|------
description                  | Initial cluster state (`new` or `existing`).{{% notice note %}}
**NOTE**: To use Sensu with an [external etcd cluster](../../../operations/deploy-sensu/cluster-sensu/#use-an-external-etcd-cluster), follow etcd's [clustering guide](https://etcd.io/docs/latest/op-guide/clustering/).
Do not configure external etcd in Sensu via backend command line flags or the backend configuration file (`/etc/sensu/backend.yml`).
{{% /notice %}}
type                         | String
default                      | `new`
environment variable         | `SENSU_BACKEND_ETCD_INITIAL_CLUSTER_STATE`
example                      | {{< code shell >}}# Command line example
sensu-backend start --etcd-initial-cluster-state existing

# /etc/sensu/backend.yml example
etcd-initial-cluster-state: "existing"{{< /code >}}


| etcd-initial-cluster-token |      |
-----------------------------|------
description                  | Unique token for the etcd cluster. Provide the same `etcd-initial-cluster-token` value for each cluster member. The `etcd-initial-cluster-token` allows etcd to generate unique cluster IDs and member IDs even for clusters with otherwise identical configurations, which prevents cross-cluster-interaction and potential cluster corruption.{{% notice note %}}
**NOTE**: To use Sensu with an [external etcd cluster](../../../operations/deploy-sensu/cluster-sensu/#use-an-external-etcd-cluster), follow etcd's [clustering guide](https://etcd.io/docs/latest/op-guide/clustering/).
Do not configure external etcd in Sensu via backend command line flags or the backend configuration file (`/etc/sensu/backend.yml`).
{{% /notice %}}
type                         | String
default                      | `""`
environment variable         | `SENSU_BACKEND_ETCD_INITIAL_CLUSTER_TOKEN`
example                      | {{< code shell >}}# Command line example
sensu-backend start --etcd-initial-cluster-token unique_token_for_this_cluster

# /etc/sensu/backend.yml example
etcd-initial-cluster-token: "unique_token_for_this_cluster"{{< /code >}}


| etcd-key-file  |      |
-----------------|------
description      | Path to the etcd client API TLS key file. Secures communication between the embedded etcd client API and any etcd clients.{{% notice note %}}
**NOTE**: To use Sensu with an [external etcd cluster](../../../operations/deploy-sensu/cluster-sensu/#use-an-external-etcd-cluster), follow etcd's [clustering guide](https://etcd.io/docs/latest/op-guide/clustering/).
Do not configure external etcd in Sensu via backend command line flags or the backend configuration file (`/etc/sensu/backend.yml`).
{{% /notice %}}
type             | String
environment variable | `SENSU_BACKEND_ETCD_KEY_FILE`
example          | {{< code shell >}}# Command line example
sensu-backend start --etcd-key-file ./client-key.pem

# /etc/sensu/backend.yml example
etcd-key-file: "./client-key.pem"{{< /code >}}

<a id="etcd-listen-client-urls"></a>

| etcd-listen-client-urls |      |
--------------------------|------
description               | List of URLs to listen on for client traffic. Sensu's default embedded etcd configuration listens for unencrypted client communication on port 2379.{{% notice note %}}
**NOTE**: To use Sensu with an [external etcd cluster](../../../operations/deploy-sensu/cluster-sensu/#use-an-external-etcd-cluster), follow etcd's [clustering guide](https://etcd.io/docs/latest/op-guide/clustering/).
Do not configure external etcd in Sensu via backend command line flags or the backend configuration file (`/etc/sensu/backend.yml`).
{{% /notice %}}
type                      | List
default                   | `http://127.0.0.1:2379`
environment variable      | `SENSU_BACKEND_ETCD_LISTEN_CLIENT_URLS`
example                   | {{< code shell >}}# Command line examples
sensu-backend start --etcd-listen-client-urls https://10.0.0.1:2379,https://10.1.0.1:2379
sensu-backend start --etcd-listen-client-urls https://10.0.0.1:2379 --etcd-listen-client-urls https://10.1.0.1:2379

# /etc/sensu/backend.yml example
etcd-listen-client-urls:
  - https://10.0.0.1:2379
  - https://10.1.0.1:2379
{{< /code >}}


| etcd-listen-peer-urls |      |
------------------------|------
description             | List of URLs to listen on for peer traffic. Sensu's default embedded etcd configuration listens for unencrypted peer communication on port 2380.{{% notice note %}}
**NOTE**: To use Sensu with an [external etcd cluster](../../../operations/deploy-sensu/cluster-sensu/#use-an-external-etcd-cluster), follow etcd's [clustering guide](https://etcd.io/docs/latest/op-guide/clustering/).
Do not configure external etcd in Sensu via backend command line flags or the backend configuration file (`/etc/sensu/backend.yml`).
{{% /notice %}}
type                    | List
default                 | `http://127.0.0.1:2380`
environment variable    | `SENSU_BACKEND_ETCD_LISTEN_PEER_URLS`
example                 | {{< code shell >}}# Command line examples
sensu-backend start --etcd-listen-peer-urls https://10.0.0.1:2380,https://10.1.0.1:2380
sensu-backend start --etcd-listen-peer-urls https://10.0.0.1:2380 --etcd-listen-peer-urls https://10.1.0.1:2380

# /etc/sensu/backend.yml example
etcd-listen-peer-urls:
  - https://10.0.0.1:2380
  - https://10.1.0.1:2380
{{< /code >}}


| etcd-name      |      |
-----------------|------
description      | Human-readable name for this member.{{% notice note %}}
**NOTE**: To use Sensu with an [external etcd cluster](../../../operations/deploy-sensu/cluster-sensu/#use-an-external-etcd-cluster), follow etcd's [clustering guide](https://etcd.io/docs/latest/op-guide/clustering/).
Do not configure external etcd in Sensu via backend command line flags or the backend configuration file (`/etc/sensu/backend.yml`).
{{% /notice %}}
type             | String
default          | `default`
environment variable | `SENSU_BACKEND_ETCD_NAME`
example          | {{< code shell >}}# Command line example
sensu-backend start --etcd-name backend-0

# /etc/sensu/backend.yml example
etcd-name: "backend-0"{{< /code >}}


| etcd-peer-cert-file |      |
----------------------|------
description           | Path to the peer server TLS certificate file. Sensu supports certificate bundles (or chains) as long as the server (or leaf) certificate is the *first* certificate in the bundle.{{% notice note %}}
**NOTE**: To use Sensu with an [external etcd cluster](../../../operations/deploy-sensu/cluster-sensu/#use-an-external-etcd-cluster), follow etcd's [clustering guide](https://etcd.io/docs/latest/op-guide/clustering/).
Do not configure external etcd in Sensu via backend command line flags or the backend configuration file (`/etc/sensu/backend.yml`).
{{% /notice %}}
type                  | String
environment variable  | `SENSU_BACKEND_ETCD_PEER_CERT_FILE`
example               | {{< code shell >}}# Command line example
sensu-backend start --etcd-peer-cert-file ./backend-0.pem

# /etc/sensu/backend.yml example
etcd-peer-cert-file: "./backend-0.pem"{{< /code >}}


| etcd-peer-client-cert-auth |      |
-----------------------------|------
description                  | Enable peer client certificate authentication.{{% notice note %}}
**NOTE**: To use Sensu with an [external etcd cluster](../../../operations/deploy-sensu/cluster-sensu/#use-an-external-etcd-cluster), follow etcd's [clustering guide](https://etcd.io/docs/latest/op-guide/clustering/).
Do not configure external etcd in Sensu via backend command line flags or the backend configuration file (`/etc/sensu/backend.yml`).
{{% /notice %}}
type                         | Boolean
default                      | `false`
environment variable         | `SENSU_BACKEND_ETCD_PEER_CLIENT_CERT_AUTH`
example                      | {{< code shell >}}# Command line example
sensu-backend start --etcd-peer-client-cert-auth

# /etc/sensu/backend.yml example
etcd-peer-client-cert-auth: true{{< /code >}}


| etcd-peer-key-file |      |
---------------------|------
description          | Path to the etcd peer API TLS key file. Secures communication between etcd cluster members.{{% notice note %}}
**NOTE**: To use Sensu with an [external etcd cluster](../../../operations/deploy-sensu/cluster-sensu/#use-an-external-etcd-cluster), follow etcd's [clustering guide](https://etcd.io/docs/latest/op-guide/clustering/).
Do not configure external etcd in Sensu via backend command line flags or the backend configuration file (`/etc/sensu/backend.yml`).
{{% /notice %}}
type                 | String
environment variable | `SENSU_BACKEND_ETCD_PEER_KEY_FILE`
example              | {{< code shell >}}# Command line example
sensu-backend start --etcd-peer-key-file ./backend-0-key.pem

# /etc/sensu/backend.yml example
etcd-peer-key-file: "./backend-0-key.pem"{{< /code >}}


| etcd-peer-trusted-ca-file |      |
----------------------------|------
description                 | Path to the etcd peer API server TLS trusted CA file. Secures communication between etcd cluster members.{{% notice note %}}
**NOTE**: To use Sensu with an [external etcd cluster](../../../operations/deploy-sensu/cluster-sensu/#use-an-external-etcd-cluster), follow etcd's [clustering guide](https://etcd.io/docs/latest/op-guide/clustering/).
Do not configure external etcd in Sensu via backend command line flags or the backend configuration file (`/etc/sensu/backend.yml`).
{{% /notice %}}
type                        | String
environment variable        | `SENSU_BACKEND_ETCD_PEER_TRUSTED_CA_FILE`
example                     | {{< code shell >}}# Command line example
sensu-backend start --etcd-peer-trusted-ca-file ./ca.pem

# /etc/sensu/backend.yml example
etcd-peer-trusted-ca-file: "./ca.pem"{{< /code >}}


| etcd-trusted-ca-file |      |
-----------------------|------
description            | Path to the client server TLS trusted CA certificate file. Secures communication with the etcd client server.{{% notice note %}}
**NOTE**: To use Sensu with an [external etcd cluster](../../../operations/deploy-sensu/cluster-sensu/#use-an-external-etcd-cluster), follow etcd's [clustering guide](https://etcd.io/docs/latest/op-guide/clustering/).
Do not configure external etcd in Sensu via backend command line flags or the backend configuration file (`/etc/sensu/backend.yml`).
{{% /notice %}}
type                   | String
default                | `""`
environment variable   | `SENSU_BACKEND_ETCD_TRUSTED_CA_FILE`
example                | {{< code shell >}}# Command line example
sensu-backend start --etcd-trusted-ca-file ./ca.pem

# /etc/sensu/backend.yml example
etcd-trusted-ca-file: "./ca.pem"{{< /code >}}


| no-embed-etcd  |      |
-----------------|------
description      | If `true`, do not embed etcd (use external etcd instead). Otherwise, `false`.{{% notice note %}}
**NOTE**: To use Sensu with an [external etcd cluster](../../../operations/deploy-sensu/cluster-sensu/#use-an-external-etcd-cluster), follow etcd's [clustering guide](https://etcd.io/docs/latest/op-guide/clustering/).
Do not configure external etcd in Sensu via backend command line flags or the backend configuration file (`/etc/sensu/backend.yml`).
{{% /notice %}}
type             | Boolean
default          | `false`
environment variable | `SENSU_BACKEND_NO_EMBED_ETCD`
example          | {{< code shell >}}# Command line example
sensu-backend start --no-embed-etcd

# /etc/sensu/backend.yml example
no-embed-etcd: true{{< /code >}}


### Advanced configuration options

| eventd-buffer-size   |      |
-----------------------|------
description            | Number of incoming events that can be buffered before being processed by an eventd worker. {{% notice warning %}}
**WARNING**: Modify with caution. Increasing this value may result in greater memory usage.
{{% /notice %}}
type                   | Integer
default                | `100`
environment variable   | `SENSU_BACKEND_EVENTD_BUFFER_SIZE`
example                | {{< code shell >}}# Command line example
sensu-backend start --eventd-buffer-size 100


# /etc/sensu/backend.yml example
eventd-buffer-size: 100{{< /code >}}


| eventd-workers       |      |
-----------------------|------
description            | Number of workers spawned for processing incoming events that are stored in the eventd buffer. {{% notice warning %}}
**WARNING**: Modify with caution. Increasing this value may result in greater CPU usage.
{{% /notice %}}
type                   | Integer
default                | `100`
environment variable   | `SENSU_BACKEND_EVENTD_WORKERS`
example                | {{< code shell >}}# Command line example
sensu-backend start --eventd-workers 100

# /etc/sensu/backend.yml example
eventd-workers: 100{{< /code >}}


| keepalived-buffer-size |      |
-----------------------|------
description            | Number of incoming keepalives that can be buffered before being processed by a keepalived worker. {{% notice warning %}}
**WARNING**: Modify with caution. Increasing this value may result in greater memory usage.
{{% /notice %}}
type                   | Integer
default                | `100`
environment variable   | `SENSU_BACKEND_KEEPALIVED_BUFFER_SIZE`
example                | {{< code shell >}}# Command line example
sensu-backend start --keepalived-buffer-size 100

# /etc/sensu/backend.yml example
keepalived-buffer-size: 100{{< /code >}}


| keepalived-workers |      |
-----------------------|------
description            | Number of workers spawned for processing incoming keepalives that are stored in the keepalived buffer. {{% notice warning %}}
**WARNING**: Modify with caution. Increasing this value may result in greater CPU usage.{{% /notice %}}
type                   | Integer
default                | `100`
environment variable   | `SENSU_BACKEND_KEEPALIVED_WORKERS`
example                | {{< code shell >}}# Command line example
sensu-backend start --keepalived-workers 100

# /etc/sensu/backend.yml example
keepalived-workers: 100{{< /code >}}


| pipelined-buffer-size |      |
-----------------------|------
description            | Number of events to handle that can be buffered before being processed by a pipelined worker. {{% notice warning %}}
**WARNING**: Modify with caution. Increasing this value may result in greater memory usage.
{{% /notice %}}
type                   | Integer
default                | `100`
environment variable   | `SENSU_BACKEND_PIPELINED_BUFFER_SIZE`
example                | {{< code shell >}}# Command line example
sensu-backend start --pipelined-buffer-size 100

# /etc/sensu/backend.yml example
pipelined-buffer-size: 100{{< /code >}}


| pipelined-workers |      |
-----------------------|------
description            | Number of workers spawned for handling events through the event pipeline that are stored in the pipelined buffer. {{% notice warning %}}
**WARNING**: Modify with caution. Increasing this value may result in greater CPU usage.
{{% /notice %}}
type                   | Integer
default                | `100`
environment variable   | `SENSU_BACKEND_PIPELINED_WORKERS`
example                | {{< code shell >}}# Command line example
sensu-backend start --pipelined-workers 100

# /etc/sensu/backend.yml example
pipelined-workers: 100{{< /code >}}


| etcd-election-timeout |      |
-----------------------|------
description            | Time that a follower node will go without hearing a heartbeat before attempting to become leader itself. In milliseconds (ms). Set to at least 10 times the [etcd-heartbeat-interval][36]. See [etcd time parameter documentation][16] for details and other considerations. {{% notice warning %}}
**WARNING**: Make sure to set the same election timeout value for all etcd members in one cluster. Setting different values for etcd members may reduce cluster stability.
{{% /notice %}}{{% notice note %}}
**NOTE**: To use Sensu with an [external etcd cluster](../../../operations/deploy-sensu/cluster-sensu/#use-an-external-etcd-cluster), follow etcd's [clustering guide](https://etcd.io/docs/latest/op-guide/clustering/).
Do not configure external etcd in Sensu via backend command line flags or the backend configuration file (`/etc/sensu/backend.yml`).
{{% /notice %}}
type                   | Integer
default                | `1000`
environment variable   | `SENSU_BACKEND_ETCD_ELECTION_TIMEOUT`
example                | {{< code shell >}}# Command line example
sensu-backend start --etcd-election-timeout 1000

# /etc/sensu/backend.yml example
etcd-election-timeout: 1000{{< /code >}}

<a id="etcd-heartbeat-interval"></a>

| etcd-heartbeat-interval |      |
-----------------------|------
description            | Interval at which the etcd leader will notify followers that it is still the leader. In milliseconds (ms). Best practice is to set the interval based on round-trip time between members. See [etcd time parameter documentation][16] for details and other considerations. {{% notice warning %}}
**WARNING**: Make sure to set the same heartbeat interval value for all etcd members in one cluster. Setting different values for etcd members may reduce cluster stability.{{% /notice %}}{{% notice note %}}
**NOTE**: To use Sensu with an [external etcd cluster](../../../operations/deploy-sensu/cluster-sensu/#use-an-external-etcd-cluster), follow etcd's [clustering guide](https://etcd.io/docs/latest/op-guide/clustering/).
Do not configure external etcd in Sensu via backend command line flags or the backend configuration file (`/etc/sensu/backend.yml`).
{{% /notice %}}
type                   | Integer
default                | `100`
environment variable   | `SENSU_BACKEND_ETCD_HEARTBEAT_INTERVAL`
example                | {{< code shell >}}# Command line example
sensu-backend start --etcd-heartbeat-interval 100

# /etc/sensu/backend.yml example
etcd-heartbeat-interval: 100{{< /code >}}


| etcd-max-request-bytes |      |
-----------------------|------
description            | Maximum etcd request size in bytes that can be sent to an etcd server by a client. Increasing this value allows etcd to process events with large outputs at the cost of overall latency. {{% notice warning %}}
**WARNING**: Use with caution. This configuration option requires familiarity with etcd. Improper use of this option can result in a non-functioning Sensu instance.
{{% /notice %}}{{% notice note %}}
**NOTE**: To use Sensu with an [external etcd cluster](../../../operations/deploy-sensu/cluster-sensu/#use-an-external-etcd-cluster), follow etcd's [clustering guide](https://etcd.io/docs/latest/op-guide/clustering/).
Do not configure external etcd in Sensu via backend command line flags or the backend configuration file (`/etc/sensu/backend.yml`).
{{% /notice %}}
type                   | Integer
default                | `1572864`
environment variable   | `SENSU_BACKEND_ETCD_MAX_REQUEST_BYTES`
example                | {{< code shell >}}# Command line example
sensu-backend start --etcd-max-request-bytes 1572864

# /etc/sensu/backend.yml example
etcd-max-request-bytes: 1572864{{< /code >}}


| etcd-quota-backend-bytes |      |
-----------------------|------
description            | Maximum etcd database size in bytes. Increasing this value allows for a larger etcd database at the cost of performance. {{% notice warning %}}
**WARNING**: Use with caution. This configuration option requires familiarity with etcd. Improper use of this option can result in a non-functioning Sensu instance.
{{% /notice %}}{{% notice note %}}
**NOTE**: To use Sensu with an [external etcd cluster](../../../operations/deploy-sensu/cluster-sensu/#use-an-external-etcd-cluster), follow etcd's [clustering guide](https://etcd.io/docs/latest/op-guide/clustering/).
Do not configure external etcd in Sensu via backend command line flags or the backend configuration file (`/etc/sensu/backend.yml`).
{{% /notice %}}
type                   | Integer
default                | `4294967296`
environment variable   | `SENSU_BACKEND_ETCD_QUOTA_BACKEND_BYTES`
example                | {{< code shell >}}# Command line example
sensu-backend start --etcd-quota-backend-bytes 4294967296

# /etc/sensu/backend.yml example
etcd-quota-backend-bytes: 4294967296{{< /code >}}

## Configuration via environment variables

Instead of using configuration flags, you can use environment variables to configure your Sensu backend.
Each backend configuration flag has an associated environment variable.
You can also create your own environment variables, as long as you name them correctly and save them in the correct place.
Here's how.

1. Create the files from which the `sensu-backend` service configured by our supported packages will read environment variables: `/etc/default/sensu-backend` for Debian/Ubuntu systems or `/etc/sysconfig/sensu-backend` for RHEL/CentOS systems.

     {{< language-toggle >}}
     
{{< code shell "Ubuntu/Debian" >}}
$ sudo touch /etc/default/sensu-backend
{{< /code >}}

{{< code shell "RHEL/CentOS" >}}
$ sudo touch /etc/sysconfig/sensu-backend
{{< /code >}}
     
     {{< /language-toggle >}}

2. Make sure the environment variable is named correctly.
All environment variables controlling Sensu backend configuration begin with `SENSU_BACKEND_`.

     To rename a configuration flag you wish to specify as an environment variable, prepend `SENSU_BACKEND_`, convert dashes to underscores, and capitalize all letters.
     For example, the environment variable for the flag `api-listen-address` is `SENSU_BACKEND_API_LISTEN_ADDRESS`.

     For a custom test variable, the environment variable name might be `SENSU_BACKEND_TEST_VAR`.

3. Add the environment variable to the environment file (`/etc/default/sensu-backend` for Debian/Ubuntu systems or `/etc/sysconfig/sensu-backend` for RHEL/CentOS systems).

     For example, to create `api-listen-address` as an environment variable and set it to `192.168.100.20:8080`:
     
     {{< language-toggle >}}

{{< code shell "Ubuntu/Debian" >}}
$ echo 'SENSU_BACKEND_API_LISTEN_ADDRESS=192.168.100.20:8080' | sudo tee -a /etc/default/sensu-backend
{{< /code >}}

{{< code shell "RHEL/CentOS" >}}
$ echo 'SENSU_BACKEND_API_LISTEN_ADDRESS=192.168.100.20:8080' | sudo tee -a /etc/sysconfig/sensu-backend
{{< /code >}}

     {{< /language-toggle >}}

4. Restart the sensu-backend service so these settings can take effect.

     {{< language-toggle >}}

{{< code shell "Ubuntu/Debian" >}}
$ sudo systemctl restart sensu-backend
{{< /code >}}

{{< code shell "RHEL/CentOS" >}}
$ sudo systemctl restart sensu-backend
{{< /code >}}

     {{< /language-toggle >}}

{{% notice note %}}
**NOTE**: Sensu includes an environment variable for each backend configuration flag.
They are listed in the [configuration flag description tables](#general-configuration-flags).
{{% /notice %}}

### Format for label and annotation environment variables

To use labels and annotations as environment variables in your handler configurations, you must use a specific format when you create the `SENSU_BACKEND_LABELS` and `SENSU_BACKEND_ANNOTATIONS` environment variables.

For example, to create the labels `"region": "us-east-1"` and `"type": "website"` as an environment variable:

{{< language-toggle >}}

{{< code shell "Ubuntu/Debian" >}}
$ echo 'SENSU_BACKEND_LABELS='{"region": "us-east-1", "type": "website"}'' | sudo tee -a /etc/default/sensu-backend
{{< /code >}}

{{< code shell "RHEL/CentOS" >}}
$ echo 'SENSU_BACKEND_LABELS='{"region": "us-east-1", "type": "website"}'' | sudo tee -a /etc/sysconfig/sensu-backend
{{< /code >}}

{{< /language-toggle >}}

To create the annotations `"maintainer": "Team A"` and `"webhook-url": "https://hooks.slack.com/services/T0000/B00000/XXXXX"` as an environment variable:

{{< language-toggle >}}

{{< code shell "Ubuntu/Debian" >}}
$ echo 'SENSU_BACKEND_ANNOTATIONS='{"maintainer": "Team A", "webhook-url": "https://hooks.slack.com/services/T0000/B00000/XXXXX"}'' | sudo tee -a /etc/default/sensu-backend
{{< /code >}}

{{< code shell "RHEL/CentOS" >}}
$ echo 'SENSU_BACKEND_ANNOTATIONS='{"maintainer": "Team A", "webhook-url": "https://hooks.slack.com/services/T0000/B00000/XXXXX"}'' | sudo tee -a /etc/sysconfig/sensu-backend
{{< /code >}}

{{< /language-toggle >}}

### Use environment variables with the Sensu backend

Any environment variables you create in `/etc/default/sensu-backend` (Debian/Ubuntu) or `/etc/sysconfig/sensu-backend` (RHEL/CentOS) will be available to handlers executed by the Sensu backend.

For example, if you create a `SENSU_BACKEND_TEST_VAR` variable in your sensu-backend file, it will be available to use in your handler configurations as `$SENSU_BACKEND_TEST_VAR`.

## Event logging

**COMMERCIAL FEATURE**: Access event logging in the packaged Sensu Go distribution.
For more information, see [Get started with commercial features][14].

If you wish, you can log all Sensu events to a file in JSON format.
You can use this file as an input source for your favorite data lake solution.
The event logging functionality provides better performance and reliability than event handlers.

{{% notice note %}}
**NOTE**: Event logs do not include log messages produced by sensu-backend service.
To write Sensu service logs to flat files on disk, read [Log Sensu services with systemd](../../operations/monitor-sensu/log-sensu-systemd/).
{{% /notice %}}

| event-log-buffer-size |      |
-----------------------|------
description            | Buffer size of the event logger. Corresponds to the maximum number of events kept in memory in case the log file is temporarily unavailable or more events have been received than can be written to the log file. 
type                   | Integer
default                | 100000
environment variable   | `SENSU_BACKEND_EVENT_LOG_BUFFER_SIZE`
example                | {{< code shell >}}# Command line example
sensu-backend start --event-log-buffer-size 100000


# /etc/sensu/backend.yml example
event-log-buffer-size: 100000{{< /code >}}


| event-log-file |      |
-----------------------|------
description            | Path to the event log file. {{% notice warning %}}
**WARNING**: The log file should be located on a local drive. Logging directly to network drives is not supported.
{{% /notice %}}
type                   | String
environment variable   | `SENSU_BACKEND_EVENT_LOG_FILE`
example                | {{< code shell >}}# Command line example
sensu-backend start --event-log-file /var/log/sensu/events.log


# /etc/sensu/backend.yml example
event-log-file: "/var/log/sensu/events.log"{{< /code >}}

### Log rotation

To manually rotate event logs, first rename (move) the current log file.
Then, send the *SIGHUP* signal to the sensu-backend process so it creates a new log file and starts logging to it.
Most Linux distributions include `logrotate` to automatically rotate log files as a standard utility, configured to run once per day by default.

Because event log files can grow quickly for larger Sensu installations, we recommend using `logrotate` to automatically rotate log files more frequently.
To use the example log rotation configurations listed below, you may need to [configure `logrotate` to run once per hour][29].

#### Log rotation for systemd

In this example, the `postrotate` script will reload the backend after log rotate is complete.
{{< code shell >}}
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
{{< /code >}}

Without the `postrotate` script, the backend will not reload.
This will cause sensu-backend (and sensu-agent, if translated for the Sensu agent) to no longer write to the log file, even if logrotate recreates the log file.

{{% notice note %}}
**NOTE**: In Sensu 5.21.0 through 5.21.3, `systemctl reload` sends a *SIGHUP* signal to the sensu-backend process.
The *SIGHUP* signal causes the `backend` component to restart.<br><br>
[Upgrade to Sensu 5.21.4 or later](../../operations/maintain-sensu/upgrade/) to avoid this issue.
{{% /notice %}}

#### Log rotation for sysvinit

{{< code shell >}}
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
{{< /code >}}


[1]: ../../operations/deploy-sensu/install-sensu#install-the-sensu-backend
[2]: https://etcd.io/docs
[3]: ../../guides/monitor-server-resources/
[4]: ../../guides/extract-metrics-with-checks/
[5]: ../../reference/checks/
[6]: ../../web-ui/
[7]: ../../guides/send-slack-alerts/
[8]: ../../guides/reduce-alert-fatigue/
[9]: ../../reference/filters/
[10]: ../../reference/mutators/
[11]: ../../reference/handlers/
[12]: #datastore-and-cluster-configuration-flags
[13]: ../../operations/deploy-sensu/cluster-sensu/
[14]: ../../commercial/
[15]: #general-configuration-flags
[16]: https://etcd.io/docs/current/tuning/#time-parameters
[17]: ../../files/backend.yml
[18]: https://golang.org/pkg/crypto/tls/#pkg-constants
[19]: https://etcd.io/docs/latest/op-guide/clustering/#discovery
[20]: https://etcd.io/docs/latest/op-guide/clustering/#etcd-discovery
[21]: https://etcd.io/docs/latest/op-guide/clustering/#dns-discovery
[22]: #initialization
[23]: #etcd-listen-client-urls
[24]: ../../operations/deploy-sensu/install-sensu#2-configure-and-start
[25]: ../../operations/deploy-sensu/install-sensu#3-initialize
[26]: ../../sensuctl/#change-admin-users-password
[27]: https://golang.org/pkg/net/http/pprof/
[29]: https://unix.stackexchange.com/questions/29574/how-can-i-set-up-logrotate-to-rotate-logs-hourly
[30]: https://en.m.wikipedia.org/wiki/WebSocket
[31]: ../../operations/deploy-sensu/secure-sensu/#sensu-agent-mtls-authentication
[32]: ../../operations/deploy-sensu/generate-certificates/
[33]: ../../operations/deploy-sensu/secure-sensu/
[34]: ../agent/#username-and-password-authentication
[35]: ../../operations/deploy-sensu/install-sensu/#architecture-overview
[36]: #etcd-heartbeat-interval
