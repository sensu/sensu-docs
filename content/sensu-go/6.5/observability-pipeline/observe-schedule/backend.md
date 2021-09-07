---
title: "Backend reference"
linkTitle: "Backend Reference"
reference_title: "Backend"
type: "reference"
description: "The Sensu backend manages check requests and event data. Every Sensu backend includes an event processing pipeline that applies filters, mutators, handlers, the Sensu API, and the Sensu web UI. Read the reference doc to run the Sensu backend."
weight: 20
version: "6.5"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-6.5:
    parent: observe-schedule
---

[Example Sensu backend configuration file](../../../files/backend.yml) (download)

The Sensu backend is a service that manages check requests and observability data.
Every Sensu backend includes an integrated structure for scheduling checks using [subscriptions][28], an event processing pipeline that applies [event filters][9], [mutators][10], and [handlers][11], an embedded [etcd][2] datastore for storing configuration and state, and the Sensu [API][14], Sensu [web UI][6], and [sensuctl][37] command line tool.

The Sensu backend is available for Ubuntu/Debian and RHEL/CentOS distributions of Linux.
For these operating systems, the Sensu backend uses the Bourne shell (sh) for the execution environment.

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

Sensu backend event pipelines process observation data and executes event filters, mutators, and handlers.
These pipelines are powerful tools to automate your monitoring workflows.
To learn more about event filters, mutators, and handlers, see:

- [Send Slack alerts with handlers][7]
- [Reduce alert fatigue with event filters][8]
- [Event filters reference documentation][9]
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

{{% notice warning %}}
**WARNING**: If you plan to [run a Sensu cluster](../../../operations/deploy-sensu/cluster-sensu/), make sure that each of your backend nodes is configured, running, and a member of the cluster before you initialize.
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

You can also run the `sensu-backend init` command in interactive mode:

{{< code shell >}}
sensu-backend init --interactive
{{< /code >}}

You will receive prompts for your username and password in interactive mode:

{{< code shell >}}
Admin Username: YOUR_USERNAME
Admin Password: YOUR_PASSWORD
{{< /code >}}

{{% notice note %}}
**NOTE**: If you are already using Sensu, you do not need to initialize.
Your installation has already seeded the admin username and password you have set up.
Running `sensu-backend init` on a previously initialized cluster has no effect &mdash; it will not change the admin credentials.
{{% /notice %}}

#### Initialization flags

To see available initialization flags:

{{< code shell >}}
sensu-backend init --help
{{< /code >}}

The response will list command information and configuration flags for `sensu-backend init`:

{{< code shell >}}
Usage:
  sensu-backend init [flags]

General Flags:
      --cluster-admin-api-key string    cluster admin API key
      --cluster-admin-password string   cluster admin password
      --cluster-admin-username string   cluster admin username
  -c, --config-file string              path to sensu-backend config file (default "/etc/sensu/backend.yml")
  -h, --help                            help for init
      --ignore-already-initialized      exit 0 if the cluster has already been initialized
      --interactive                     interactive mode
      --timeout string                  duration to wait before a connection attempt to etcd is considered failed (must be >= 1s) (default "5s")
      --wait                            continuously retry to establish a connection to etcd until it is successful

Store Flags:
      --etcd-advertise-client-urls strings   list of this member's client URLs to advertise to clients (default [http://localhost:2379])
      --etcd-cert-file string                path to the client server TLS cert file
      --etcd-cipher-suites strings           list of ciphers to use for etcd TLS configuration
      --etcd-client-cert-auth                enable client cert authentication
      --etcd-client-urls string              client URLs to use when operating as an etcd client
      --etcd-key-file string                 path to the client server TLS key file
      --etcd-max-request-bytes uint          maximum etcd request size in bytes (use with caution) (default 1572864)
      --etcd-trusted-ca-file string          path to the client server TLS trusted CA cert file
{{< /code >}}

##### Initialization ignore-already-initialized flag

If you run sensu-backend init on a cluster that has already been initialized, the command returns a non-zero exit status.
Add the `ignore-already-initialized` flag to sensu-backend init to suppress the "already initialized" response and return an exit code 0 if the cluster has already been initialized:

{{< code shell >}}
sensu-backend init --ignore-already-initialized
{{< /code >}}

##### Initialization timeout and wait flags

When you initialize the sensu-backend, you can specify how long the backend should wait to establish a connection to etcd.

If the backend should try to establish a connection to etcd for a certain period before timing out, use the `timeout` flag.
To specify the timeout duration, use an integer paired with a unit of time:

- `s` for seconds
- `m` for minutes
- `h` for hours

For example, to specify a 30-second timeout period:

{{< code shell >}}
sensu-backend init --timeout 30s
{{< /code >}}

To specify a 5-minute timeout period:

{{< code shell >}}
sensu-backend init --timeout 5m
{{< /code >}}

Sensu interprets timeout values less than 1 second and integer-only values as seconds.
For example, Sensu will convert both `20ms` and `20` to 20 seconds.

If the backend should repeatedly try to establish a connection to etcd until it is successful, use the `wait` flag:

{{< code shell >}}
sensu-backend init --wait
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

The `sensu-backend` tool provides general and command-specific help flags.

To see sensu-backend commands, run:

{{< code shell >}}
sensu-backend help
{{< /code >}}

To see options for a specific command (in this case, sensu-backend start), run: 

{{< code shell >}}
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

To view configuration information for the sensu-backend start command, run:

{{< code shell >}}
sensu-backend start --help
{{< /code >}}

The response will list command information and configuration flags for sensu-backend start:

{{< code text >}}
start the sensu backend

Usage:
  sensu-backend start [flags]

General Flags:
      --agent-auth-cert-file string         TLS certificate in PEM format for agent certificate authentication
      --agent-auth-crl-urls strings         URLs of CRLs for agent certificate authentication
      --agent-auth-key-file string          TLS certificate key in PEM format for agent certificate authentication
      --agent-auth-trusted-ca-file string   TLS CA certificate bundle in PEM format for agent certificate authentication
      --agent-burst-limit int               agent connections maximum burst size
      --agent-host string                   agent listener host (default "[::]")
      --agent-port int                      agent listener port (default 8081)
      --agent-rate-limit int                agent connections maximum rate limit
      --agent-write-timeout int             timeout in seconds for agent writes (default 15)
      --annotations stringToString          entity annotations map (default [])
      --api-listen-address string           address to listen on for api traffic (default "[::]:8080")
      --api-request-limit int               maximum API request body size, in bytes (default 512000)
      --api-url string                      url of the api to connect to (default "http://localhost:8080")
      --assets-burst-limit int              asset fetch burst limit (default 100)
      --assets-rate-limit float             maximum number of assets fetched per second
      --cache-dir string                    path to store cached data (default "/var/cache/sensu/sensu-backend")
      --cert-file string                    TLS certificate in PEM format
  -c, --config-file string                  path to sensu-backend config file (default "/etc/sensu/backend.yml")
      --dashboard-cert-file string          dashboard TLS certificate in PEM format
      --dashboard-host string               dashboard listener host (default "[::]")
      --dashboard-key-file string           dashboard TLS certificate key in PEM format
      --dashboard-port int                  dashboard listener port (default 3000)
      --debug                               enable debugging and profiling features
      --deregistration-handler string       default deregistration handler
      --event-log-buffer-size int           buffer size of the event logger (default 100000)
      --event-log-buffer-wait string        full buffer wait time (default "10ms")
      --event-log-file string               path to the event log file
      --event-log-parallel-encoders         used to indicate parallel encoders should be used for event logging
      --eventd-buffer-size int              number of incoming events that can be buffered (default 100)
      --eventd-workers int                  number of workers spawned for processing incoming events (default 100)
  -h, --help                                help for start
      --insecure-skip-tls-verify            skip TLS verification (not recommended!)
      --jwt-private-key-file string         path to the PEM-encoded private key to use to sign JWTs
      --jwt-public-key-file string          path to the PEM-encoded public key to use to verify JWT signatures
      --keepalived-buffer-size int          number of incoming keepalives that can be buffered (default 100)
      --keepalived-workers int              number of workers spawned for processing incoming keepalives (default 100)
      --key-file string                     TLS certificate key in PEM format
      --labels stringToString               entity labels map (default [])
      --log-level string                    logging level [panic, fatal, error, warn, info, debug, trace] (default "warn")
      --metrics-refresh-interval string     Go duration value (e.g. 1h5m30s) that governs how often metrics are refreshed. (default "1m")
      --pipelined-buffer-size int           number of events to handle that can be buffered (default 100)
      --pipelined-workers int               number of workers spawned for handling events through the event pipeline (default 100)
      --require-fips                        indicates whether fips support should be required in openssl  
      --require-openssl                     indicates whether openssl should be required instead of go's built-in crypto
  -d, --state-dir string                    path to sensu state storage (default "/var/lib/sensu/sensu-backend")
      --trusted-ca-file string              TLS CA certificate bundle in PEM format

Store Flags:
      --etcd-advertise-client-urls strings         list of this member's client URLs to advertise to clients (default [http://localhost:2379])
      --etcd-cert-file string                      path to the client server TLS cert file
      --etcd-cipher-suites strings                 list of ciphers to use for etcd TLS configuration
      --etcd-client-cert-auth                      enable client cert authentication
      --etcd-client-urls string                    client URLs to use when operating as an etcd client
      --etcd-discovery string                      discovery URL used to bootstrap the cluster
      --etcd-discovery-srv string                  DNS SRV record used to bootstrap the cluster
      --etcd-election-timeout uint                 time in ms a follower node will go without hearing a heartbeat before attempting to become leader itself (default 1000)
      --etcd-heartbeat-interval uint               interval in ms with which the etcd leader will notify followers that it is still the leader (default 100)
      --etcd-initial-advertise-peer-urls strings   list of this member's peer URLs to advertise to the rest of the cluster (default [http://127.0.0.1:2380])
      --etcd-initial-cluster string                initial cluster configuration for bootstrapping
      --etcd-initial-cluster-state string          initial cluster state ("new" or "existing") (default "new")
      --etcd-initial-cluster-token string          initial cluster token for the etcd cluster during bootstrap
      --etcd-key-file string                       path to the client server TLS key file
      --etcd-listen-client-urls strings            list of etcd client URLs to listen on (default [http://127.0.0.1:2379])
      --etcd-listen-peer-urls strings              list of URLs to listen on for peer traffic (default [http://127.0.0.1:2380])
      --etcd-log-level string                      etcd logging level [panic, fatal, error, warn, info, debug]
      --etcd-max-request-bytes uint                maximum etcd request size in bytes (use with caution) (default 1572864)
      --etcd-name string                           name for this etcd node (default "default")
      --etcd-peer-cert-file string                 path to the peer server TLS cert file
      --etcd-peer-client-cert-auth                 enable peer client cert authentication
      --etcd-peer-key-file string                  path to the peer server TLS key file
      --etcd-peer-trusted-ca-file string           path to the peer server TLS trusted CA file
      --etcd-quota-backend-bytes int               maximum etcd database size in bytes (use with caution) (default 4294967296)
      --etcd-trusted-ca-file string                path to the client server TLS trusted CA cert file
      --no-embed-etcd                              don't embed etcd, use external etcd instead
{{< /code >}}

### General configuration flags

{{% notice note %}}
**NOTE**: Docker-only Sensu binds to the hostnames of containers, represented here as `SENSU_HOSTNAME` in Docker default values.
{{% /notice %}}

| annotations|      |
-------------|------
description  | Non-identifying metadata to include with entity data for backend dynamic runtime assets (for example, handler and mutator dynamic runtime assets).{{% notice note %}}
**NOTE**: For annotations that you define in backend.yml, the keys are automatically modified to use all lower-case letters. For example, if you define the annotation `webhookURL: "https://my-webhook.com"` in backend.yml, it will be listed as `webhookurl: "https://my-webhook.com"` in entity definitions.<br><br>Key cases are **not** modified for annotations you define with the `--annotations` command line flag or the `SENSU_BACKEND_ANNOTATIONS` environment variable.
{{% /notice %}}
required     | false
type         | Map of key-value pairs. Keys and values can be any valid UTF-8 string.
default      | `null`
environment variable | `SENSU_BACKEND_ANNOTATIONS`
command line example   | {{< code shell >}}
sensu-backend start --annotations sensu.io/plugins/slack/config/webhook-url=https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX
sensu-backend start --annotations example-key="example value" --annotations example-key2="example value"
{{< /code >}}
/etc/sensu/backend.yml example | {{< code shell >}}
annotations:
  sensu.io/plugins/slack/config/webhook-url: "https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX"
{{< /code >}}

| api-listen-address  |      |
-------------|------
description  | Address the API daemon will listen for requests on.
type         | String
default      | `[::]:8080`
environment variable | `SENSU_BACKEND_API_LISTEN_ADDRESS`
command line example   | {{< code shell >}}
sensu-backend start --api-listen-address [::]:8080{{< /code >}}
/etc/sensu/backend.yml example | {{< code shell >}}
api-listen-address: "[::]:8080"{{< /code >}}

<a id="api-request-limit"></a>

| api-request-limit |      |
-------------|------
description  | Maximum size for API request bodies. In bytes.
type         | Integer
default      | `512000`
environment variable | `SENSU_BACKEND_API_REQUEST_LIMIT`
command line example   | {{< code shell >}}
sensu-backend start --api-request-limit 1024000{{< /code >}}
/etc/sensu/backend.yml example | {{< code shell >}}
api-request-limit: 1024000{{< /code >}}

| api-url  |      |
-------------|------
description  | URL used to connect to the API.
type         | String
default      | `http://localhost:8080` (CentOS/RHEL, Debian, and Ubuntu)<br><br>`http://$SENSU_HOSTNAME:8080` (Docker)
environment variable | `SENSU_BACKEND_API_URL`
command line example   | {{< code shell >}}
sensu-backend start --api-url http://localhost:8080{{< /code >}}
/etc/sensu/backend.yml example | {{< code shell >}}
api-url: "http://localhost:8080"{{< /code >}}

| assets-burst-limit   |      |
--------------|------
description   | Maximum amount of burst allowed in a rate interval when fetching dynamic runtime assets.
type          | Integer
default       | `100`
environment variable | `SENSU_BACKEND_ASSETS_BURST_LIMIT`
command line example   | {{< code shell >}}
sensu-backend start --assets-burst-limit 100{{< /code >}}
/etc/sensu/backend.yml example | {{< code shell >}}
assets-burst-limit: 100{{< /code >}}

| assets-rate-limit   |      |
--------------|------
description   | Maximum number of dynamic runtime assets to fetch per second. The default value `1.39` is equivalent to approximately 5000 user-to-server requests per hour.
type          | Float
default       | `1.39`
environment variable | `SENSU_BACKEND_ASSETS_RATE_LIMIT`
command line example   | {{< code shell >}}
sensu-backend start --assets-rate-limit 1.39{{< /code >}}
/etc/sensu/backend.yml example | {{< code shell >}}
assets-rate-limit: 1.39{{< /code >}}

| cache-dir   |      |
--------------|------
description   | Path to store cached data.
type          | String
default       | `/var/cache/sensu/sensu-backend`
environment variable | `SENSU_BACKEND_CACHE_DIR`
command line example   | {{< code shell >}}
sensu-backend start --cache-dir /var/cache/sensu-backend{{< /code >}}
/etc/sensu/backend.yml example | {{< code shell >}}
cache-dir: "/var/cache/sensu-backend"{{< /code >}}

| config-file |      |
--------------|------
description   | Path to Sensu backend config file.
type          | String
default       | `/etc/sensu/backend.yml`
environment variable | `SENSU_BACKEND_CONFIG_FILE`
command line example   | {{< code shell >}}
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
command line example   | {{< code shell >}}
sensu-backend start --debug{{< /code >}}
/etc/sensu/backend.yml example | {{< code shell >}}
debug: true{{< /code >}}

| deregistration-handler |      |
-------------------------|------
description              | Name of the default event handler to use when processing agent deregistration events.
type                     | String
default                  | `""`
environment variable     | `SENSU_BACKEND_DEREGISTRATION_HANDLER`
command line example   | {{< code shell >}}
sensu-backend start --deregistration-handler deregister{{< /code >}}
/etc/sensu/backend.yml example | {{< code shell >}}
deregistration-handler: "deregister"{{< /code >}}

| labels     |      |
-------------|------
description  | Custom attributes to include with entity data for backend dynamic runtime assets (for example, handler and mutator dynamic runtime assets).{{% notice note %}}
**NOTE**: For labels that you define in backend.yml, the keys are automatically modified to use all lower-case letters. For example, if you define the label `securityZone: "us-west-2a"` in backend.yml, it will be listed as `securityzone: "us-west-2a"` in entity definitions.<br><br>Key cases are **not** modified for labels you define with the `--labels` command line flag or the `SENSU_BACKEND_LABELS` environment variable.
{{% /notice %}}
required     | false
type         | Map of key-value pairs. Keys can contain only letters, numbers, and underscores and must start with a letter. Values can be any valid UTF-8 string.
default      | `null`
environment variable | `SENSU_BACKEND_LABELS`
command line example   | {{< code shell >}}
sensu-backend start --labels security_zone=us-west-2a
sensu-backend start --labels example_key1="example value" example_key2="example value"
{{< /code >}}
/etc/sensu/backend.yml example | {{< code shell >}}
labels:
  security_zone: "us-west-2a"
  example_key1: "example value"
  example_key2: "example value"
{{< /code >}}

<a id="backend-log-level"></a>

| log-level  |      |
-------------|------
description  | Logging level: `panic`, `fatal`, `error`, `warn`, `info`, `debug`, or `trace`.
type         | String
default      | `warn`
environment variable | `SENSU_BACKEND_LOG_LEVEL`
command line example   | {{< code shell >}}
sensu-backend start --log-level debug{{< /code >}}
/etc/sensu/backend.yml example | {{< code shell >}}
log-level: "debug"{{< /code >}}

<a id="metrics-refresh-interval"></a>

| metrics-refresh-interval |      |
-------------|------
description  | Interval at which Sensu should refresh metrics. In hours, minutes, seconds, or a combination &mdash; for example, `5m`, `1m30s`, and `1h10m30s` are all valid values.
type         | String
default      | `1m`
environment variable | `SENSU_BACKEND_METRICS_REFRESH_INTERVAL`
command line example   | {{< code shell >}}
sensu-backend start --metrics-refresh-interval 10s{{< /code >}}
/etc/sensu/backend.yml example | {{< code shell >}}
metrics-refresh-interval: "10s"{{< /code >}}

| state-dir  |      |
-------------|------
description  | Path to Sensu state storage: `/var/lib/sensu/sensu-backend`.
type         | String
required     | true
environment variable | `SENSU_BACKEND_STATE_DIR`
command line example   | {{< code shell >}}
sensu-backend start --state-dir /var/lib/sensu/sensu-backend
sensu-backend start -d /var/lib/sensu/sensu-backend
{{< /code >}}
/etc/sensu/backend.yml example | {{< code shell >}}
state-dir: "/var/lib/sensu/sensu-backend"{{< /code >}}

### Agent communication configuration flags

| agent-auth-cert-file |      |
-------------|------
description  | TLS certificate in PEM format for agent certificate authentication. Sensu supports certificate bundles (or chains) as long as the server (or leaf) certificate is the *first* certificate in the bundle.
type         | String
default      | `""`
environment variable | `SENSU_BACKEND_AGENT_AUTH_CERT_FILE`
command line example   | {{< code shell >}}
sensu-backend start --agent-auth-cert-file /path/to/tls/backend-1.pem{{< /code >}}
/etc/sensu/backend.yml example | {{< code shell >}}
agent-auth-cert-file: /path/to/tls/backend-1.pem{{< /code >}}

| agent-auth-crl-urls |      |
-------------|------
description  | URLs of CRLs for agent certificate authentication. The Sensu backend uses this list to perform a revocation check for agent mTLS.
type         | String
default      | `""`
environment variable | `SENSU_BACKEND_AGENT_AUTH_CRL_URLS`
command line example   | {{< code shell >}}
sensu-backend start --agent-auth-crl-urls http://localhost/CARoot.crl{{< /code >}}
/etc/sensu/backend.yml example | {{< code shell >}}
agent-auth-crl-urls: http://localhost/CARoot.crl{{< /code >}}

| agent-auth-key-file |      |
-------------|------
description  | TLS certificate key in PEM format for agent certificate authentication.
type         | String
default      | `""`
environment variable | `SENSU_BACKEND_AGENT_AUTH_KEY_FILE`
command line example   | {{< code shell >}}
sensu-backend start --agent-auth-key-file /path/to/tls/backend-1-key.pem{{< /code >}}
/etc/sensu/backend.yml example | {{< code shell >}}
agent-auth-key-file: /path/to/tls/backend-1-key.pem{{< /code >}}

| agent-auth-trusted-ca-file |      |
-------------|------
description  | TLS CA certificate bundle in PEM format for agent certificate authentication.
type         | String
default      | `""`
environment variable | `SENSU_BACKEND_AGENT_AUTH_TRUSTED_CA_FILE`
command line example   | {{< code shell >}}
sensu-backend start --agent-auth-trusted-ca-file /path/to/tls/ca.pem{{< /code >}}
/etc/sensu/backend.yml example | {{< code shell >}}
agent-auth-trusted-ca-file: /path/to/tls/ca.pem{{< /code >}}

<a id="agent-burst-limit"></a>

| agent-burst-limit   |      |
--------------|------
description   | Maximum amount of burst allowed in a rate interval for agent transport WebSocket connections.
type          | Integer
default       | `null`
environment variable | `SENSU_BACKEND_AGENT_BURST_LIMIT`
command line example   | {{< code shell >}}
sensu-backend start --agent-burst-limit 10{{< /code >}}
/etc/sensu/backend.yml example | {{< code shell >}}
agent-burst-limit: 10{{< /code >}}

| agent-host   |      |
---------------|------
description    | Agent listener host. Listens on all IPv4 and IPv6 addresses by default.
type           | String
default        | `[::]`
environment variable | `SENSU_BACKEND_AGENT_HOST`
command line example   | {{< code shell >}}
sensu-backend start --agent-host 127.0.0.1{{< /code >}}
/etc/sensu/backend.yml example | {{< code shell >}}
agent-host: "127.0.0.1"{{< /code >}}

| agent-port |      |
-------------|------
description  | Agent listener port.
type         | Integer
default      | `8081`
environment variable | `SENSU_BACKEND_AGENT_PORT`
command line example   | {{< code shell >}}
sensu-backend start --agent-port 8081{{< /code >}}
/etc/sensu/backend.yml example | {{< code shell >}}
agent-port: 8081{{< /code >}}

<a id="agent-rate-limit"></a>

| agent-rate-limit   |      |
--------------|------
description   | Maximum number of agent transport WebSocket connections per second.
type          | Integer
default       | `null`
environment variable | `SENSU_BACKEND_AGENT_RATE_LIMIT`
command line example   | {{< code shell >}}
sensu-backend start --agent-rate-limit 10{{< /code >}}
/etc/sensu/backend.yml example | {{< code shell >}}
agent-rate-limit: 10{{< /code >}}

### Security configuration flags

| cert-file  |      |
-------------|------
description  | Path to the primary backend certificate file. Specifies a fallback SSL/TLS certificate if the flag `dashboard-cert-file` is not used. This certificate secures communications between the Sensu web UI and end user web browsers, as well as communication between sensuctl and the Sensu API. Sensu supports certificate bundles (or chains) as long as the server (or leaf) certificate is the *first* certificate in the bundle.
type         | String
default      | `""`
environment variable | `SENSU_BACKEND_CERT_FILE`
command line example   | {{< code shell >}}
sensu-backend start --cert-file /path/to/tls/backend-1.pem{{< /code >}}
/etc/sensu/backend.yml example | {{< code shell >}}
cert-file: "/path/to/tls/backend-1.pem"{{< /code >}}

| insecure-skip-tls-verify |      |
---------------------------|------
description                | If `true`, skip SSL verification. Otherwise, `false`. {{% notice warning %}}
**WARNING**: This configuration flag is intended for use in development systems only. Do not use this flag in production.
{{% /notice %}}
type                       | Boolean
default                    | `false`
environment variable | `SENSU_BACKEND_INSECURE_SKIP_TLS_VERIFY`
command line example   | {{< code shell >}}
sensu-backend start --insecure-skip-tls-verify{{< /code >}}
/etc/sensu/backend.yml example | {{< code shell >}}
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
command line example   | {{< code shell >}}
sensu-backend start --jwt-private-key-file /path/to/key/private.pem{{< /code >}}
/etc/sensu/backend.yml example | {{< code shell >}}
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
command line example   | {{< code shell >}}
sensu-backend start --jwt-public-key-file /path/to/key/public.pem{{< /code >}}
/etc/sensu/backend.yml example | {{< code shell >}}
jwt-public-key-file: /path/to/key/public.pem{{< /code >}}

| key-file   |      |
-------------|------
description  | Path to the primary backend key file. Specifies a fallback SSL/TLS key if the flag `dashboard-key-file` is not used. This key secures communication between the Sensu web UI and end user web browsers, as well as communication between sensuctl and the Sensu API.
type         | String
default      | `""`
environment variable | `SENSU_BACKEND_KEY_FILE`
command line example   | {{< code shell >}}
sensu-backend start --key-file /path/to/tls/backend-1-key.pem{{< /code >}}
/etc/sensu/backend.yml example | {{< code shell >}}
key-file: "/path/to/tls/backend-1-key.pem"{{< /code >}}

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
command line example   | {{< code shell >}}
sensu-backend start --require-fips{{< /code >}}
/etc/sensu/backend.yml example | {{< code shell >}}
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
command line example   | {{< code shell >}}
sensu-backend start --require-openssl{{< /code >}}
/etc/sensu/backend.yml example | {{< code shell >}}
require-openssl: true{{< /code >}}

| trusted-ca-file |      |
------------------|------
description       | Path to the primary backend CA file. Specifies a fallback SSL/TLS certificate authority in PEM format used for etcd client (mutual TLS) communication if the `etcd-trusted-ca-file` is not used. This CA file is used in communication between the Sensu web UI and end user web browsers, as well as communication between sensuctl and the Sensu API.
type              | String
default           | `""`
environment variable | `SENSU_BACKEND_TRUSTED_CA_FILE`
command line example   | {{< code shell >}}
sensu-backend start --trusted-ca-file /path/to/tls/ca.pem{{< /code >}}
/etc/sensu/backend.yml example | {{< code shell >}}
trusted-ca-file: "/path/to/tls/ca.pem"{{< /code >}}

### Web UI configuration flags

| dashboard-cert-file | |
-------------|------
description  | Web UI TLS certificate in PEM format. This certificate secures communication with the Sensu web UI. If the `dashboard-cert-file` is not provided in the backend configuration, Sensu uses the certificate specified in the [`cert-file` flag](#security-configuration-flags) for the web UI. Sensu supports certificate bundles (or chains) as long as the server (or leaf) certificate is the *first* certificate in the bundle.
type         | String
default      | `""`
environment variable | `SENSU_BACKEND_DASHBOARD_CERT_FILE`
command line example   | {{< code shell >}}
sensu-backend start --dashboard-cert-file /path/to/tls/separate-webui-cert.pem{{< /code >}}
/etc/sensu/backend.yml example | {{< code shell >}}
dashboard-cert-file: "/path/to/tls/separate-webui-cert.pem"{{< /code >}}

| dashboard-host |      |
-----------------|------
description      | Web UI listener host.
type             | String
default          | `[::]`
environment variable | `SENSU_BACKEND_DASHBOARD_HOST`
command line example   | {{< code shell >}}
sensu-backend start --dashboard-host 127.0.0.1{{< /code >}}
/etc/sensu/backend.yml example | {{< code shell >}}
dashboard-host: "127.0.0.1"{{< /code >}}

| dashboard-key-file | |
-------------|------
description  | Web UI TLS certificate key in PEM format. This key secures communication with the Sensu web UI. If the `dashboard-key-file` is not provided in the backend configuration, Sensu uses the key specified in the [`key-file` flag](#security-configuration-flags) for the web UI.
type         | String
default      | `""`
environment variable | `SENSU_BACKEND_DASHBOARD_KEY_FILE`
command line example   | {{< code shell >}}
sensu-backend start --dashboard-key-file /path/to/tls/separate-webui-key.pem{{< /code >}}
/etc/sensu/backend.yml example | {{< code shell >}}
dashboard-key-file: "/path/to/tls/separate-webui-key.pem"{{< /code >}}

| dashboard-port |      |
-----------------|------
description      | Web UI listener port.
type             | Integer
default          | `3000`
environment variable | `SENSU_BACKEND_DASHBOARD_PORT`
command line example   | {{< code shell >}}
sensu-backend start --dashboard-port 3000{{< /code >}}
/etc/sensu/backend.yml example | {{< code shell >}}
dashboard-port: 3000{{< /code >}}

### Datastore and cluster configuration flags

{{% notice note %}}
**NOTE**: Docker-only Sensu binds to the hostnames of containers, represented here as `SENSU_HOSTNAME` in Docker default values.
{{% /notice %}}

| etcd-advertise-client-urls |      |
--------------|------
description   | List of this member's client URLs to advertise to the rest of the cluster.{{% notice note %}}
**NOTE**: To use Sensu with an [external etcd cluster](../../../operations/deploy-sensu/cluster-sensu/#use-an-external-etcd-cluster), follow etcd's [clustering guide](https://etcd.io/docs/latest/op-guide/clustering/).
Do not configure external etcd in Sensu via backend command line flags or the backend configuration file (`/etc/sensu/backend.yml`).
{{% /notice %}}
type          | List
default       | `http://localhost:2379` (CentOS/RHEL, Debian, and Ubuntu)<br><br>`http://$SENSU_HOSTNAME:2379` (Docker)
environment variable | `SENSU_BACKEND_ETCD_ADVERTISE_CLIENT_URLS`
command line example   | {{< code shell >}}
sensu-backend start --etcd-advertise-client-urls http://localhost:2378,http://localhost:2379
sensu-backend start --etcd-advertise-client-urls http://localhost:2378 --etcd-advertise-client-urls http://localhost:2379
{{< /code >}}
/etc/sensu/backend.yml example | {{< code shell >}}
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
command line example   | {{< code shell >}}
sensu-backend start --etcd-cert-file /path/to/tls/backend-1.pem{{< /code >}}
/etc/sensu/backend.yml example | {{< code shell >}}
etcd-cert-file: "/path/to/tls/backend-1.pem"{{< /code >}}

<a id="etcd-cipher-suites"></a>

| etcd-cipher-suites    |      |
------------------------|------
description             | List of allowed cipher suites for etcd TLS configuration. Sensu supports TLS 1.0-1.2 cipher suites as listed in the [Go TLS documentation][18]. You can use this attribute to defend your TLS servers from attacks on weak TLS ciphers. Go determines the default cipher suites based on the hardware used. {{% notice note %}}
**NOTE**: To use TLS 1.3, add the following environment variable: `GODEBUG="tls13=1"`.<br><br>To use Sensu with an [external etcd cluster](../../../operations/deploy-sensu/cluster-sensu/#use-an-external-etcd-cluster), follow etcd's [clustering guide](https://etcd.io/docs/latest/op-guide/clustering/).
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
command line example   | {{< code shell >}}
sensu-backend start --etcd-cipher-suites TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
sensu-backend start --etcd-cipher-suites TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256 --etcd-cipher-suites TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
{{< /code >}}
/etc/sensu/backend.yml example | {{< code shell >}}
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
command line example   | {{< code shell >}}
sensu-backend start --etcd-client-cert-auth{{< /code >}}
/etc/sensu/backend.yml example | {{< code shell >}}
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
command line example   | {{< code shell >}}
sensu-backend start --etcd-client-urls 'https://10.0.0.1:2379 https://10.1.0.1:2379'
sensu-backend start --etcd-client-urls https://10.0.0.1:2379 --etcd-client-urls https://10.1.0.1:2379
{{< /code >}}
/etc/sensu/backend.yml example | {{< code shell >}}
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
command line example   | {{< code shell >}}
sensu-backend start --etcd-discovery https://discovery.etcd.io/3e86b59982e49066c5d813af1c2e2579cbf573de{{< /code >}}
/etc/sensu/backend.yml example | {{< code shell >}}
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
command line example   | {{< code shell >}}
sensu-backend start --etcd-discovery-srv example.org{{< /code >}}
/etc/sensu/backend.yml example | {{< code shell >}}
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
default                            | `http://127.0.0.1:2380` (CentOS/RHEL, Debian, and Ubuntu)<br><br>`http://$SENSU_HOSTNAME:2380` (Docker)
environment variable               | `SENSU_BACKEND_ETCD_INITIAL_ADVERTISE_PEER_URLS`
command line example   | {{< code shell >}}
sensu-backend start --etcd-initial-advertise-peer-urls https://10.0.0.1:2380,https://10.1.0.1:2380
sensu-backend start --etcd-initial-advertise-peer-urls https://10.0.0.1:2380 --etcd-initial-advertise-peer-urls https://10.1.0.1:2380
{{< /code >}}
/etc/sensu/backend.yml example | {{< code shell >}}
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
default                | `default=http://127.0.0.1:2380` (CentOS/RHEL, Debian, and Ubuntu)<br><br>`default=http://$SENSU_HOSTNAME:2380` (Docker)
environment variable   | `SENSU_BACKEND_ETCD_INITIAL_CLUSTER`
command line example   | {{< code shell >}}
sensu-backend start --etcd-initial-cluster backend-0=https://10.0.0.1:2380,backend-1=https://10.1.0.1:2380,backend-2=https://10.2.0.1:2380{{< /code >}}
/etc/sensu/backend.yml example | {{< code shell >}}
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
command line example   | {{< code shell >}}
sensu-backend start --etcd-initial-cluster-state existing{{< /code >}}
/etc/sensu/backend.yml example | {{< code shell >}}
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
command line example   | {{< code shell >}}
sensu-backend start --etcd-initial-cluster-token unique_token_for_this_cluster{{< /code >}}
/etc/sensu/backend.yml example | {{< code shell >}}
etcd-initial-cluster-token: "unique_token_for_this_cluster"{{< /code >}}

| etcd-key-file  |      |
-----------------|------
description      | Path to the etcd client API TLS key file. Secures communication between the embedded etcd client API and any etcd clients.{{% notice note %}}
**NOTE**: To use Sensu with an [external etcd cluster](../../../operations/deploy-sensu/cluster-sensu/#use-an-external-etcd-cluster), follow etcd's [clustering guide](https://etcd.io/docs/latest/op-guide/clustering/).
Do not configure external etcd in Sensu via backend command line flags or the backend configuration file (`/etc/sensu/backend.yml`).
{{% /notice %}}
type             | String
environment variable | `SENSU_BACKEND_ETCD_KEY_FILE`
command line example   | {{< code shell >}}
sensu-backend start --etcd-key-file /path/to/tls/backend-1-key.pem{{< /code >}}
/etc/sensu/backend.yml example | {{< code shell >}}
etcd-key-file: "/path/to/tls/backend-1-key.pem"{{< /code >}}

<a id="etcd-listen-client-urls"></a>

| etcd-listen-client-urls |      |
--------------------------|------
description               | List of URLs to listen on for client traffic. Sensu's default embedded etcd configuration listens for unencrypted client communication on port 2379.{{% notice note %}}
**NOTE**: To use Sensu with an [external etcd cluster](../../../operations/deploy-sensu/cluster-sensu/#use-an-external-etcd-cluster), follow etcd's [clustering guide](https://etcd.io/docs/latest/op-guide/clustering/).
Do not configure external etcd in Sensu via backend command line flags or the backend configuration file (`/etc/sensu/backend.yml`).
{{% /notice %}}
type                      | List
default                   | `http://127.0.0.1:2379` (CentOS/RHEL, Debian, and Ubuntu)<br><br>`http://[::]:2379` (Docker)
environment variable      | `SENSU_BACKEND_ETCD_LISTEN_CLIENT_URLS`
command line example   | {{< code shell >}}
sensu-backend start --etcd-listen-client-urls https://10.0.0.1:2379,https://10.1.0.1:2379
sensu-backend start --etcd-listen-client-urls https://10.0.0.1:2379 --etcd-listen-client-urls https://10.1.0.1:2379
{{< /code >}}
/etc/sensu/backend.yml example | {{< code shell >}}
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
default                 | `http://127.0.0.1:2380` (CentOS/RHEL, Debian, and Ubuntu)<br><br>`http://[::]:2380` (Docker)
environment variable    | `SENSU_BACKEND_ETCD_LISTEN_PEER_URLS`
command line example   | {{< code shell >}}
sensu-backend start --etcd-listen-peer-urls https://10.0.0.1:2380,https://10.1.0.1:2380
sensu-backend start --etcd-listen-peer-urls https://10.0.0.1:2380 --etcd-listen-peer-urls https://10.1.0.1:2380
{{< /code >}}
/etc/sensu/backend.yml example | {{< code shell >}}
etcd-listen-peer-urls:
  - https://10.0.0.1:2380
  - https://10.1.0.1:2380
{{< /code >}}

<a id="etcd-log-level"></a>

| etcd-log-level  |      |
-------------|------
description  | Logging level for the embedded etcd server: `panic`, `fatal`, `error`, `warn`, `info`, or `debug`. Defaults to value provided for the [backend log level][60]. If the backend log level is set to `trace`, the etcd log level will be set to `debug` (`trace` is not a valid etcd log level).
type         | String
default      | [Backend log level][60] value (or `debug`, if the backend log level is set to `trace`)
environment variable | `SENSU_BACKEND_ETCD_LOG_LEVEL`
command line example   | {{< code shell >}}
sensu-backend start --etcd-log-level debug{{< /code >}}
/etc/sensu/backend.yml example | {{< code shell >}}
etcd-log-level: "debug"{{< /code >}}

| etcd-name      |      |
-----------------|------
description      | Human-readable name for this member.{{% notice note %}}
**NOTE**: To use Sensu with an [external etcd cluster](../../../operations/deploy-sensu/cluster-sensu/#use-an-external-etcd-cluster), follow etcd's [clustering guide](https://etcd.io/docs/latest/op-guide/clustering/).
Do not configure external etcd in Sensu via backend command line flags or the backend configuration file (`/etc/sensu/backend.yml`).
{{% /notice %}}
type             | String
default          | `default`
environment variable | `SENSU_BACKEND_ETCD_NAME`
command line example   | {{< code shell >}}
sensu-backend start --etcd-name backend-0{{< /code >}}
/etc/sensu/backend.yml example | {{< code shell >}}
etcd-name: "backend-0"{{< /code >}}

| etcd-peer-cert-file |      |
----------------------|------
description           | Path to the peer server TLS certificate file. Sensu supports certificate bundles (or chains) as long as the server (or leaf) certificate is the *first* certificate in the bundle.{{% notice note %}}
**NOTE**: To use Sensu with an [external etcd cluster](../../../operations/deploy-sensu/cluster-sensu/#use-an-external-etcd-cluster), follow etcd's [clustering guide](https://etcd.io/docs/latest/op-guide/clustering/).
Do not configure external etcd in Sensu via backend command line flags or the backend configuration file (`/etc/sensu/backend.yml`).
{{% /notice %}}
type                  | String
environment variable  | `SENSU_BACKEND_ETCD_PEER_CERT_FILE`
command line example   | {{< code shell >}}
sensu-backend start --etcd-peer-cert-file /path/to/tls/backend-1.pem{{< /code >}}
/etc/sensu/backend.yml example | {{< code shell >}}
etcd-peer-cert-file: "/path/to/tls/backend-1.pem"{{< /code >}}

| etcd-peer-client-cert-auth |      |
-----------------------------|------
description                  | Enable peer client certificate authentication.{{% notice note %}}
**NOTE**: To use Sensu with an [external etcd cluster](../../../operations/deploy-sensu/cluster-sensu/#use-an-external-etcd-cluster), follow etcd's [clustering guide](https://etcd.io/docs/latest/op-guide/clustering/).
Do not configure external etcd in Sensu via backend command line flags or the backend configuration file (`/etc/sensu/backend.yml`).
{{% /notice %}}
type                         | Boolean
default                      | `false`
environment variable         | `SENSU_BACKEND_ETCD_PEER_CLIENT_CERT_AUTH`
command line example   | {{< code shell >}}
sensu-backend start --etcd-peer-client-cert-auth{{< /code >}}
/etc/sensu/backend.yml example | {{< code shell >}}
etcd-peer-client-cert-auth: true{{< /code >}}

| etcd-peer-key-file |      |
---------------------|------
description          | Path to the etcd peer API TLS key file. Secures communication between etcd cluster members.{{% notice note %}}
**NOTE**: To use Sensu with an [external etcd cluster](../../../operations/deploy-sensu/cluster-sensu/#use-an-external-etcd-cluster), follow etcd's [clustering guide](https://etcd.io/docs/latest/op-guide/clustering/).
Do not configure external etcd in Sensu via backend command line flags or the backend configuration file (`/etc/sensu/backend.yml`).
{{% /notice %}}
type                 | String
environment variable | `SENSU_BACKEND_ETCD_PEER_KEY_FILE`
command line example   | {{< code shell >}}
sensu-backend start --etcd-peer-key-file /path/to/tls/backend-1-key.pem{{< /code >}}
/etc/sensu/backend.yml example | {{< code shell >}}
etcd-peer-key-file: "/path/to/tls/backend-1-key.pem"{{< /code >}}

| etcd-peer-trusted-ca-file |      |
----------------------------|------
description                 | Path to the etcd peer API server TLS trusted CA file. Secures communication between etcd cluster members.{{% notice note %}}
**NOTE**: To use Sensu with an [external etcd cluster](../../../operations/deploy-sensu/cluster-sensu/#use-an-external-etcd-cluster), follow etcd's [clustering guide](https://etcd.io/docs/latest/op-guide/clustering/).
Do not configure external etcd in Sensu via backend command line flags or the backend configuration file (`/etc/sensu/backend.yml`).
{{% /notice %}}
type                        | String
environment variable        | `SENSU_BACKEND_ETCD_PEER_TRUSTED_CA_FILE`
command line example   | {{< code shell >}}
sensu-backend start --etcd-peer-trusted-ca-file ./ca.pem{{< /code >}}
/etc/sensu/backend.yml example | {{< code shell >}}
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
command line example   | {{< code shell >}}
sensu-backend start --etcd-trusted-ca-file ./ca.pem{{< /code >}}
/etc/sensu/backend.yml example | {{< code shell >}}
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
command line example   | {{< code shell >}}
sensu-backend start --no-embed-etcd{{< /code >}}
/etc/sensu/backend.yml example | {{< code shell >}}
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
command line example   | {{< code shell >}}
sensu-backend start --eventd-buffer-size 100{{< /code >}}
/etc/sensu/backend.yml example | {{< code shell >}}
eventd-buffer-size: 100{{< /code >}}

| eventd-workers       |      |
-----------------------|------
description            | Number of workers spawned for processing incoming events that are stored in the eventd buffer. {{% notice warning %}}
**WARNING**: Modify with caution. Increasing this value may result in greater CPU usage.
{{% /notice %}}
type                   | Integer
default                | `100`
environment variable   | `SENSU_BACKEND_EVENTD_WORKERS`
command line example   | {{< code shell >}}
sensu-backend start --eventd-workers 100{{< /code >}}
/etc/sensu/backend.yml example | {{< code shell >}}
eventd-workers: 100{{< /code >}}

| keepalived-buffer-size |      |
-----------------------|------
description            | Number of incoming keepalives that can be buffered before being processed by a keepalived worker. {{% notice warning %}}
**WARNING**: Modify with caution. Increasing this value may result in greater memory usage.
{{% /notice %}}
type                   | Integer
default                | `100`
environment variable   | `SENSU_BACKEND_KEEPALIVED_BUFFER_SIZE`
command line example   | {{< code shell >}}
sensu-backend start --keepalived-buffer-size 100{{< /code >}}
/etc/sensu/backend.yml example | {{< code shell >}}
keepalived-buffer-size: 100{{< /code >}}

| keepalived-workers |      |
-----------------------|------
description            | Number of workers spawned for processing incoming keepalives that are stored in the keepalived buffer. {{% notice warning %}}
**WARNING**: Modify with caution. Increasing this value may result in greater CPU usage.{{% /notice %}}
type                   | Integer
default                | `100`
environment variable   | `SENSU_BACKEND_KEEPALIVED_WORKERS`
command line example   | {{< code shell >}}
sensu-backend start --keepalived-workers 100{{< /code >}}
/etc/sensu/backend.yml example | {{< code shell >}}
keepalived-workers: 100{{< /code >}}

| pipelined-buffer-size |      |
-----------------------|------
description            | Number of events to handle that can be buffered before being processed by a pipelined worker. {{% notice warning %}}
**WARNING**: Modify with caution. Increasing this value may result in greater memory usage.
{{% /notice %}}
type                   | Integer
default                | `100`
environment variable   | `SENSU_BACKEND_PIPELINED_BUFFER_SIZE`
command line example   | {{< code shell >}}
sensu-backend start --pipelined-buffer-size 100{{< /code >}}
/etc/sensu/backend.yml example | {{< code shell >}}
pipelined-buffer-size: 100{{< /code >}}

| pipelined-workers |      |
-----------------------|------
description            | Number of workers spawned for handling events through the event pipeline that are stored in the pipelined buffer. {{% notice warning %}}
**WARNING**: Modify with caution. Increasing this value may result in greater CPU usage.
{{% /notice %}}
type                   | Integer
default                | `100`
environment variable   | `SENSU_BACKEND_PIPELINED_WORKERS`
command line example   | {{< code shell >}}
sensu-backend start --pipelined-workers 100{{< /code >}}
/etc/sensu/backend.yml example | {{< code shell >}}
pipelined-workers: 100{{< /code >}}

| etcd-election-timeout |      |
-----------------------|------
description            | Time that a follower node will go without hearing a heartbeat before attempting to become leader itself. In milliseconds (ms). Set to at least 10 times the [etcd-heartbeat-interval][36]. Read the [etcd time parameter documentation][16] for details and other considerations. {{% notice warning %}}
**WARNING**: Make sure to set the same election timeout value for all etcd members in one cluster. Setting different values for etcd members may reduce cluster stability.
{{% /notice %}}{{% notice note %}}
**NOTE**: To use Sensu with an [external etcd cluster](../../../operations/deploy-sensu/cluster-sensu/#use-an-external-etcd-cluster), follow etcd's [clustering guide](https://etcd.io/docs/latest/op-guide/clustering/).
Do not configure external etcd in Sensu via backend command line flags or the backend configuration file (`/etc/sensu/backend.yml`).
{{% /notice %}}
type                   | Integer
default                | `1000`
environment variable   | `SENSU_BACKEND_ETCD_ELECTION_TIMEOUT`
command line example   | {{< code shell >}}
sensu-backend start --etcd-election-timeout 1000{{< /code >}}
/etc/sensu/backend.yml example | {{< code shell >}}
etcd-election-timeout: 1000{{< /code >}}

<a id="etcd-heartbeat-interval"></a>

| etcd-heartbeat-interval |      |
-----------------------|------
description            | Interval at which the etcd leader will notify followers that it is still the leader. In milliseconds (ms). Best practice is to set the interval based on round-trip time between members. Read the [etcd time parameter documentation][16] for details and other considerations. {{% notice warning %}}
**WARNING**: Make sure to set the same heartbeat interval value for all etcd members in one cluster. Setting different values for etcd members may reduce cluster stability.{{% /notice %}}{{% notice note %}}
**NOTE**: To use Sensu with an [external etcd cluster](../../../operations/deploy-sensu/cluster-sensu/#use-an-external-etcd-cluster), follow etcd's [clustering guide](https://etcd.io/docs/latest/op-guide/clustering/).
Do not configure external etcd in Sensu via backend command line flags or the backend configuration file (`/etc/sensu/backend.yml`).
{{% /notice %}}
type                   | Integer
default                | `100`
environment variable   | `SENSU_BACKEND_ETCD_HEARTBEAT_INTERVAL`
command line example   | {{< code shell >}}
sensu-backend start --etcd-heartbeat-interval 100{{< /code >}}
/etc/sensu/backend.yml example | {{< code shell >}}
etcd-heartbeat-interval: 100{{< /code >}}

| etcd-max-request-bytes |      |
-----------------------|------
description            | Maximum etcd request size in bytes that can be sent to an etcd server by a client. Increasing this value allows etcd to process events with large outputs at the cost of overall latency. {{% notice warning %}}
**WARNING**: Use with caution. This configuration option requires familiarity with etcd. Improper use of this option can result in a non-functioning Sensu instance.{{% /notice %}}{{% notice note %}}
**NOTE**: To use Sensu with an [external etcd cluster](../../../operations/deploy-sensu/cluster-sensu/#use-an-external-etcd-cluster), follow etcd's [clustering guide](https://etcd.io/docs/latest/op-guide/clustering/).
Do not configure external etcd in Sensu via backend command line flags or the backend configuration file (`/etc/sensu/backend.yml`).
{{% /notice %}}
type                   | Integer
default                | `1572864`
environment variable   | `SENSU_BACKEND_ETCD_MAX_REQUEST_BYTES`
command line example   | {{< code shell >}}
sensu-backend start --etcd-max-request-bytes 1572864{{< /code >}}
/etc/sensu/backend.yml example | {{< code shell >}}
etcd-max-request-bytes: 1572864{{< /code >}}

| etcd-quota-backend-bytes |      |
-----------------------|------
description            | Maximum etcd database size in bytes. Increasing this value allows for a larger etcd database at the cost of performance. {{% notice warning %}}
**WARNING**: Use with caution. This configuration option requires familiarity with etcd. Improper use of this option can result in a non-functioning Sensu instance.{{% /notice %}}{{% notice note %}}
**NOTE**: To use Sensu with an [external etcd cluster](../../../operations/deploy-sensu/cluster-sensu/#use-an-external-etcd-cluster), follow etcd's [clustering guide](https://etcd.io/docs/latest/op-guide/clustering/).
Do not configure external etcd in Sensu via backend command line flags or the backend configuration file (`/etc/sensu/backend.yml`).
{{% /notice %}}
type                   | Integer
default                | `4294967296`
environment variable   | `SENSU_BACKEND_ETCD_QUOTA_BACKEND_BYTES`
command line example   | {{< code shell >}}
sensu-backend start --etcd-quota-backend-bytes 4294967296{{< /code >}}
/etc/sensu/backend.yml example | {{< code shell >}}
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

## Create overrides

Sensu has default settings and limits for certain configuration attributes, like the default log level.
Depending on your environment and preferences, you may want to create overrides for these Sensu-specific defaults and limits.

You can create overrides in several ways:

- Command line configuration flag arguments for `sensu-backend start`.
- Environment variables in `/etc/default/sensu-backend` (Debian/Ubuntu) or `/etc/sysconfig/sensu-backend` (RHEL/CentOS).
- Configuration settings in the backend.yml config file.

{{% notice note %}}
**NOTE**: We do not recommend editing the systemd unit file to create overrides.
Future package upgrades can overwrite changes in the systemd unit file.
{{% /notice %}}

Sensu applies the following precedence to override settings:

1. Arguments passed to the Sensu backend via command line configuration flags.
2. Environment variables in `/etc/default/sensu-backend` (Debian/Ubuntu) or `/etc/sysconfig/sensu-backend` (RHEL/CentOS).
3. Configuration in the backend.yml config file.

For example, if you create overrides using all three methods, the command line configuration flag values will take precedence over the values you specify in `/etc/default/sensu-backend` or `/etc/sysconfig/sensu-backend` or the backend.yml config file.

### Example override: Log level

The default [log level][60] for the Sensu backend is `warn`.
To override the default and automatically apply a different log level for the backend, add the `--log-level` command line configuration flag when you start the Sensu backend.
For example, to specify `debug` as the log level:

{{< code shell >}}
sensu-backend start --log-level debug
{{< /code >}}

To configure an environment variable for the desired backend log level:

{{< language-toggle >}}

{{< code shell "Ubuntu/Debian" >}}
$ echo 'SENSU_BACKEND_LOG_LEVEL=debug' | sudo tee -a /etc/default/sensu-backend
{{< /code >}}

{{< code shell "RHEL/CentOS" >}}
$ echo 'SENSU_BACKEND_LOG_LEVEL=debug' | sudo tee -a /etc/sysconfig/sensu-backend
{{< /code >}}

{{< /language-toggle >}}

To configure the desired log level in the config file, add this line to backend.yml:

{{< code shell >}}
log-level: debug
{{< /code >}}

## Event logging

{{% notice commercial %}}
**COMMERCIAL FEATURE**: Access event logging in the packaged Sensu Go distribution.
For more information, read [Get started with commercial features](../../../commercial/).
{{% /notice %}}

If you wish, you can log all Sensu events to a file in JSON format.
You can use this file as an input source for your favorite data lake solution.
The event logging functionality provides better performance and reliability than event handlers.

{{% notice note %}}
**NOTE**: Event logs do not include log messages produced by sensu-backend service.
To write Sensu service logs to flat files on disk, read [Log Sensu services with systemd](../../../operations/monitor-sensu/log-sensu-systemd/).
{{% /notice %}}

| event-log-buffer-size |      |
-----------------------|------
description            | Buffer size of the event logger. Corresponds to the maximum number of events kept in memory in case the log file is temporarily unavailable or more events have been received than can be written to the log file.
type                   | Integer
default                | 100000
environment variable   | `SENSU_BACKEND_EVENT_LOG_BUFFER_SIZE`
command line example   | {{< code shell >}}
sensu-backend start --event-log-buffer-size 100000{{< /code >}}
/etc/sensu/backend.yml example | {{< code shell >}}
event-log-buffer-size: 100000{{< /code >}}

| event-log-buffer-wait |      |
-----------------------|------
description            | Buffer wait time for the event logger. When the buffer is full, the event logger will wait for the specified time for the writer to consume events from the buffer.
type                   | String
default                | 10ms
environment variable   | `SENSU_BACKEND_EVENT_LOG_BUFFER_WAIT`
command line example   | {{< code shell >}}
sensu-backend start --event-log-buffer-wait 10ms{{< /code >}}
/etc/sensu/backend.yml example | {{< code shell >}}
event-log-buffer-wait: 10ms{{< /code >}}

<a id="event-log-file"></a>

| event-log-file |      |
-----------------------|------
description            | Path to the event log file. {{% notice warning %}}
**WARNING**: The log file should be located on a local drive. Logging directly to network drives is not supported.
{{% /notice %}}
type                   | String
environment variable   | `SENSU_BACKEND_EVENT_LOG_FILE`
command line example   | {{< code shell >}}
sensu-backend start --event-log-file /var/log/sensu/events.log{{< /code >}}
/etc/sensu/backend.yml example | {{< code shell >}}
event-log-file: "/var/log/sensu/events.log"{{< /code >}}

<a id="event-log-parallel-encoders"></a>

| event-log-parallel-encoders |      |
-----------------------|------
description            | Indicates whether Sensu should use parallel JSON encoders for event logging. If `true`, Sensu sets the number of JSON encoder workers to 50% of the total number of cores, with a minimum of 2 (for example, 6 JSON encoders on a 12-core machine). Otherwise, Sensu uses the default setting, which is a single JSON encoding worker.<br><br>The `event-log-parallel-encoders` setting will not take effect unless you also specify a path to the event log file with the [`event-log-file`][61] configuration attribute.{{% notice note %}}
**NOTE**: The `event-log-parallel-encoders` configuration attribute is available in [Sensu Go 6.4.2](../../../release-notes/#642-release-notes).
{{% /notice %}}
type                   | Boolean
default                | false
environment variable   | `SENSU_BACKEND_EVENT_LOG_PARALLEL_ENCODERS`
command line example   | {{< code shell >}}
sensu-backend start --event-log-parallel-encoders true{{< /code >}}
/etc/sensu/backend.yml example | {{< code shell >}}
event-log-parallel-encoders: true{{< /code >}}

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


[1]: ../../../operations/deploy-sensu/install-sensu#install-the-sensu-backend
[2]: https://etcd.io/docs
[3]: ../monitor-server-resources/
[4]: ../collect-metrics-with-checks/
[5]: ../checks/
[6]: ../../../web-ui/
[7]: ../../observe-process/send-slack-alerts/
[8]: ../../observe-filter/reduce-alert-fatigue/
[9]: ../../observe-filter/filters/
[10]: ../../observe-transform/mutators/
[11]: ../../observe-process/handlers/
[12]: #datastore-and-cluster-configuration-flags
[13]: ../../../operations/deploy-sensu/cluster-sensu/
[14]: ../../../api/
[15]: #general-configuration-flags
[16]: https://etcd.io/docs/current/tuning/#time-parameters
[17]: ../../../files/backend.yml
[18]: https://golang.org/pkg/crypto/tls/#pkg-constants
[19]: https://etcd.io/docs/latest/op-guide/clustering/#discovery
[20]: https://etcd.io/docs/latest/op-guide/clustering/#etcd-discovery
[21]: https://etcd.io/docs/latest/op-guide/clustering/#dns-discovery
[22]: #initialization
[23]: #etcd-listen-client-urls
[24]: ../../../operations/deploy-sensu/install-sensu#2-configure-and-start
[25]: ../../../operations/deploy-sensu/install-sensu#3-initialize
[26]: ../../../sensuctl/#change-admin-users-password
[27]: https://golang.org/pkg/net/http/pprof/
[28]: ../subscriptions/
[29]: https://unix.stackexchange.com/questions/29574/how-can-i-set-up-logrotate-to-rotate-logs-hourly
[30]: https://en.m.wikipedia.org/wiki/WebSocket
[31]: ../../../operations/deploy-sensu/secure-sensu/#sensu-agent-mtls-authentication
[32]: ../../../operations/deploy-sensu/generate-certificates/
[33]: ../../../operations/deploy-sensu/secure-sensu/
[34]: ../agent/#username-and-password-authentication
[35]: ../../../operations/deploy-sensu/install-sensu/#architecture-overview
[36]: #etcd-heartbeat-interval
[37]: ../../../sensuctl/
[38]: #configuration-via-environment-variables
[60]: #backend-log-level
[61]: #event-log-file
