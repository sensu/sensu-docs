---
title: "Sensu agent"
linkTitle: "Sensu Agent"
description: "Sensu agent reference documentation"
weight: 1
version: "5.1"
product: "Sensu Go"
platformContent: true
platforms: ["Linux"]
menu:
  sensu-go-5.1:
    parent: reference
---

- [Installation][1]
- [Creating events using service checks](#creating-monitoring-events-using-service-checks)
- [Creating events using the agent socket](#creating-monitoring-events-using-the-agent-socket)
- [Creating events using the StatsD listener](#creating-monitoring-events-using-the-statsd-listener)
- [Keepalive monitoring](#keepalive-monitoring)
- [Service management](#operation)
  - [Starting and stopping the service](#starting-the-service)
	- [Registration and deregistration](#registration)
	- [Clustering](#clustering)
- [Configuration](#configuration)
  - [API configuration](#api-configuration-flags)
  - [Ephemeral agent configuration](#ephemeral-agent-configuration-flags)
  - [Keepalive configuration](#keepalive-configuration-flags)
  - [Security configuration](#security-configuration-flags)
  - [Socket configuration](#socket-configuration-flags)
  - [StatsD configuration](#statsd-configuration-flags)

The Sensu agent is a lightweight client that runs on the infrastructure components you want to monitor.
Agents register with the Sensu backend as [monitoring entities][3] with `type: "agent"`.
Agent entities are responsible for creating [check and metrics events][7] to send to the [backend event pipeline][2].
The Sensu agent is available for Linux, macOS, and Windows.
See the [installation guide][1] to install the agent.

## Creating monitoring events using service checks

Sensu's use of the [publish/subscribe pattern of communication][15] allows for automated registration and deregistration of ephemeral systems.
At the core of this model are Sensu agent subscriptions.

Each Sensu agent has a defined set of [`subscriptions`][28], a list of roles and responsibilities assigned to the system (for example: a webserver or database).
These subscriptions determine which [monitoring checks][14] are executed by the agent.
Agent subscriptions allow Sensu to request check executions on a group of systems at a time, instead of a traditional 1:1 mapping of configured hosts to monitoring checks.
In order for an agent to execute a service check, you must specify the same subscription in the [agent configuration][28] and the [check definition][32].

After receiving a check request from the Sensu backend, the agent:

1. Applies any [tokens][27] matching attribute values in the check definition.
2. Fetches [assets][29] and stores them in its local cache. By default, agents cache asset data at `/var/cache/sensu/sensu-agent` (`C:\\ProgramData\sensu\cache\sensu-agent` on Windows systems) or as specified by the the [`cache-dir` flag][30].
3. Executes the [check `command`][14].
4. Executes any [hooks][31] specified by the check based on the exit status.
5. Creates an [event][7] containing information about the applicable entity, check, and metric.

### Subscription configuration

To configure subscriptions for an agent, set [the `subscriptions` flag][28].
To configure subscriptions for a check, set the [check definition attribute `subscriptions`][14].

In addition to the subscriptions defined in the agent configuration, Sensu agent entities also subscribe automatically to a subscription matching their [entity `name`][38].
For example, an agent entity with the `name: "i-424242"` subscribes to check requests with the subscription `entity:i-424242`.
This makes it possible to generate ad-hoc check requests targeting specific entities via the API.

### Proxy entities

Sensu proxy entities allow Sensu to monitor external resources on systems or devices where a Sensu agent cannot be installed (such a network switch).
Unlike agent entities, proxy entity definitions are stored by the [Sensu backend][2].
When the backend requests a check that includes a [`proxy_entity_name`][14], the agent includes the provided entity information in the event data in place of the agent entity data.
See the [entity reference][3] and the [guide to monitoring external resources][33] for more information about monitoring proxy entities.

## Creating monitoring events using the agent socket

Every Sensu agent has a TCP, UDP, and HTTP socket listening for external monitoring data.
The TCP and UDP sockets listen on the address and port specified by the [socket configuration flags][17]; the HTTP socket listens on the address and port specified by the [API configuration flags][18].

These sockets expect JSON formatted [check results][14], allowing external sources to send monitoring data to Sensu without needing to know anything about Sensu's internal implementation.
An excellent agent socket use case example is a web application pushing check results to indicate database connectivity issues.

## Using the TCP socket

The following is an example demonstrating external monitoring data input via the Sensu agent TCP socket.
The example uses Bash's built-in `/dev/tcp` file to communicate with the Sensu agent socket.

{{< highlight shell >}}
echo '{"name": "web_service01", "output": "error!", "status": 1, "handlers": ["slack"]}' > /dev/tcp/localhost/3030
{{< /highlight >}}

You can also use the [Netcat][19] utility to send monitoring data to the agent socket:

{{< highlight shell >}}
echo '{"name": "web_service02", "output": "error!", "status": 1, "handlers": ["slack"]}' | nc localhost 3030
{{< /highlight >}}

At a minimum, the agent TCP socket requires the `name`, `output`, and `status` attributes to be set in the payload, but you can also add any attributes allowed in the [check definition][14], like `handlers` and `subscriptions`.

#### Socket input specification

TCP socket        | 
------------------|------
description       | Accepts a JSON [check result][14] body and passes the event to the Sensu backend event pipeline for processing
example command   | {{< highlight shell >}}# Example using /dev/tcp
echo '{"name": "web_service01", "output": "error!", "status": 1, "handlers": ["slack"]}' > /dev/tcp/localhost/3030

# Example using Netcat
echo '{"name": "web_service02", "output": "error!", "status": 1, "handlers": ["slack"]}' | nc localhost 3030
{{< /highlight >}}
payload attributes| <ul><li>`name` (required): A string representing the name of the monitoring check</li><li>`output` (required): A string representing the output of the check</li><li>`status` (required): An integer representing the status of the check result, following the [check result specification][39]. (`0`: OK, `1`: warning, `2`: critical)</li><li>Any other attributes supported by the [Sensu check specification][14] (optional)</li></ul>

## Using the HTTP socket

The HTTP socket, just like the TCP and UDP sockets, accepts check results, but it requires a well-formed HTTP request and exposes other functionality that is not possible with the raw TCP/UDP sockets.
In exchange for a bit more complexity, the HTTP socket interface has the advantage of being more expressive than a TCP/UDP socket, both in the requests that it accepts and how it responds, and so exposes more functionality.
The following endpoints are available for the HTTP socket:

### `/healthz` (GET)

The `/healthz` API provides HTTP GET access to the status of the Sensu agent via the agent API.

#### Example {#healthz-get-example}

In the following example, an HTTP GET is submitted to the `/healthz` API:

{{< highlight shell >}}
curl -s http://127.0.0.1:3031/healthz
{{< /highlight >}}

Resulting in a healthy response:

{{< highlight shell >}}
ok
{{< /highlight >}}

#### API specification {#healthz-get-specification}

/healthz (GET) | 
----------------|------
description     | Returns `ok` if the agent is active and connected to a Sensu backend; returns `sensu backend unavailable` if the agent is unable to connect to a backend.
example url     | http://hostname:3031/healthz

### `/events` (POST)

The `/events` API provides HTTP POST access to publish [monitoring events][1] to the Sensu backend pipeline via the agent API.

#### Example {#events-post-example}

In the following example, an HTTP POST is submitted to the `/events` API, creating an event for a check named `check-mysql-status` with the output `could not connect to mysql` and a status of `1` (warning), resulting in a 201 (Created) HTTP response code.

{{< highlight shell >}}
curl -s -i \
-X POST \
-H 'Content-Type: application/json' \
-d '{"check": {"name": "web_service03", "output": "error!", "status": 1, "handlers": ["slack"]}}' \
http://127.0.0.1:3031/events

HTTP/1.1 202 Accepted
{{< /highlight >}}

#### API specification {#events-post-specification}

/events (POST)     | 
-------------------|------
description        | Accepts a JSON [check result][14] body and passes the event to the Sensu backend event pipeline for processing
example url        | http://hostname:3031/events
payload example    | {{< highlight json >}}{"check": {"name": "web_service01", "output": "error!", "status": 1, "handlers": ["slack"]}}{{< /highlight >}}
payload attributes | <ul><li>`check` (required): All check data must be within the `check` scope.</li><li>`name` (required): A string representing the name of the monitoring check</li><li>Any other attributes supported by the [Sensu check specification][14] (optional)</li></ul>
response codes     | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

### `/brew` (GET)

This endpoint gets you some fresh coffee. Try it!

Any requests for unknown endpoints results in a 404 Not Found response.
Only unsecured HTTP (no HTTPS) is supported.

### Creating a "dead man's switch"

The Sensu agent socket in combination with check TTLs can be used to create what's commonly referred to as a "dead man's switch".
Outside of the software industry, a dead man's switch is a switch that is triggered automatically if a human operator becomes incapacitated (source: [Wikipedia][20]).
However, Sensu is more interested in detecting silent failures than incapacitated human operators.

By using check TTLs, Sensu is able to set an expectation that a Sensu agent continues to publish results for a check at a regular interval.
If a Sensu agent fails to publish a check result and the check TTL expires, Sensu creates an alert to indicate the silent failure.
For more information on check TTLs, please refer to [the check attributes reference][14].

A great use case for the Sensu agent socket is to create a dead man's switch to ensure that backup scripts continue to run successfully at regular intervals.
If an external source sends a Sensu check result with a check TTL to the Sensu agent socket, Sensu expects another check result from the same external source before the TTL expires.

The following is an example of external check result input via the Sensu agent TCP socket using a check TTL to create a dead man's switch for MySQL backups.
The example uses a check TTL of `25200` seconds (7 hours).
A MySQL backup script using the following code would be expected to continue to send a check
result at least once every 7 hours or Sensu creates an alert to indicate the silent failure.

{{< highlight shell >}}
echo '{"name": "backup_mysql", "ttl": 25200, "output": "backed up mysql successfully | size_mb=568", "status": 0}' | nc localhost 3030
{{< /highlight >}}

{{< highlight shell >}}
echo '{"name": "backup_mysql", "ttl": 25200, "output": "failed to backup mysql", "status": 1}' | nc localhost 3030
{{< /highlight >}}

## Creating monitoring events using the StatsD listener

Sensu agents include a listener to send [StatsD][21] metrics to the event pipeline.
By default, Sensu agents listen on UDP socket 8125 (TCP on Windows systems) for messages that follow the [StatsD line protocol][21] and send metric events for handling by the Sensu backend.

For example, you can use the Netcat utility to send metrics to the StatsD listener:

{{< highlight shell >}}
echo 'abc.def.g:10|c' | nc -w1 -u localhost 8125
{{< /highlight >}}

Metrics received through the StatsD listener are not stored by Sensu, so
it's important to configure [event handlers][8].

### StatsD line protocol

The Sensu StatsD listener accepts messages formatted according to the StatsD line protocol:

{{< highlight text >}}
<metricname>:<value>|<type>
{{< /highlight >}}

For more information, see the [StatsD documentation][21].

### Configuring the StatsD listener

To configure the StatsD listener, specify the [`statsd-event-handlers` configuration flag][22] in the [agent configuration][24], and start the agent.

{{< highlight shell >}}
# Start an agent that sends StatsD metrics to InfluxDB
sensu-agent --statsd-event-handlers influx-db
{{< /highlight >}}

You can use the [StatsD configuration flags][22] to change the default settings for the StatsD listener address, port, and [flush interval][23].

{{< highlight shell >}}
# Start an agent with a customized address and flush interval
sensu-agent --statsd-event-handlers influx-db --statsd-flush-interval 1 --statsd-metrics-host 123.4.5.6 --statsd-metrics-port 8125
{{< /highlight >}}

## Keepalive monitoring

Sensu `keepalives` are the heartbeat mechanism used to ensure that all registered agents are operational and able to reach the [Sensu backend][2].
Sensu agents publish keepalive events containing [entity][3] configuration data to the Sensu backend according to the interval specified by the [`keepalive-interval` flag][4].
If a Sensu agent fails to send keepalive events over the period specified by the [`keepalive-timeout` flag][4], the Sensu backend creates a keepalive alert in the Sensu dashboard.
You can use keepalives to identify unhealthy systems and network partitions, send notifications, trigger [auto-remediation][5], and other useful actions.

_NOTE: Keepalive monitoring is not supported for [proxy entities][3], as they are inherently unable to run a Sensu agent._

### Handling keepalive events

You can connect keepalive events to your monitoring workflows using a keepalive handler.
Sensu looks for an [event handler][8] named `keepalive` and automatically uses it to process keepalive events.

Let's say you want to receive Slack notifications for keepalive alerts, and you already have a [Slack handler set up to process events][40].
To process keepalive events using the Slack pipeline, create a handler set named `keepalive` and add the `slack` handler to the `handlers` array.
The resulting `keepalive` handler set configuration looks like this:

{{< highlight json >}}
{
  "type": "Handler",
  "api_version": "core/v2",
  "metadata" : {
    "name": "keepalive",
    "namespace": "default"
  },
  "spec": {
    "type": "set",
    "handlers": [
      "slack"
    ]
  }
}
{{< /highlight >}}

## Operation

### Starting the service
Use the `sensu-agent` tool to start the agent and apply configuration flags.

To start the agent with [configuration flags][24]:

{{< highlight shell >}}
sensu-agent start --subscriptions disk-checks --log-level debug
{{< /highlight >}}

To see available configuration flags and defaults:

{{< highlight shell >}}
sensu-agent start --help
{{< /highlight >}}

If no configuration flags are provided, the agent loads configuration from `/etc/sensu/agent.yml` by default.

To start the agent using a service manager:

{{< platformBlock "Linux" >}}

**Linux**

{{< highlight shell >}}
sudo service sensu-agent start
{{< /highlight >}}

{{< platformBlockClose >}}

### Stopping the service

To stop the agent service using a service manager:

{{< platformBlock "Linux" >}}

**Linux**

{{< highlight shell >}}
sudo service sensu-agent stop
{{< /highlight >}}

{{< platformBlockClose >}}

### Restarting the service

You must restart the agent to implement any configuration updates.

To restart the agent using a service manager:

{{< platformBlock "Linux" >}}

**Linux**

{{< highlight shell >}}
sudo service sensu-agent restart
{{< /highlight >}}

{{< platformBlockClose >}}

### Enabling on boot

To enable the agent to start on system boot:

{{< platformBlock "Linux" >}}

**Linux**

{{< highlight shell >}}
sudo systemctl enable sensu-agent
{{< /highlight >}}

To disable the agent from starting on system boot:

{{< highlight shell >}}
sudo systemctl disable sensu-agent
{{< /highlight >}}

_NOTE: On older distributions of Linux, use `sudo chkconfig sensu-server on` to enable the agent and `sudo chkconfig sensu-server off` to disable._

{{< platformBlockClose >}}

### Getting service status

To see the status of the agent service using a service manager:

{{< platformBlock "Linux" >}}

**Linux**

{{< highlight shell >}}
service sensu-agent status
{{< /highlight >}}

{{< platformBlockClose >}}

### Getting service version

To get the current agent version using the `sensu-agent` tool:

{{< highlight shell >}}
sensu-agent version
{{< /highlight >}}

### Getting help

The `sensu-agent` tool provides general and command-specific help flags:

{{< highlight shell >}}
# Show sensu-agent commands
sensu-agent help

# Show options for the sensu-agent start subcommand
sensu-agent start --help
{{< /highlight >}}

## Registration

In practice, agent registration happens when a Sensu backend processes an agent keepalive event for an agent that is not already registered in the Sensu agent registry (based on the configured agent `name`).
This agent registry is stored in the Sensu [backend][2], and is accessible via [`sensuctl entity list`][6].

All Sensu agent data provided in keepalive events gets stored in the agent registry and used to add context to Sensu [events][7] and detect Sensu agents in an unhealthy state.

### Registration events

If a [Sensu event handler][8] named `registration` is configured, the [Sensu backend][2] creates and process an [event][7] for agent registration, applying any configured [filters][9] and [mutators][10] before executing the configured [handler][8].

_PRO TIP: Use a [handler set][34] to execute multiple handlers in response to registration events._

Registration events are useful for executing one-time handlers for new Sensu agents.
For example, registration event handlers can be used to update external [configuration management databases (CMDBs)][11] such as [ServiceNow][12].

To configure a registration event handler, please refer to the [Sensu event handler documentation][8] for instructions on creating a handler named `registration`.

_WARNING: Registration events are not stored in the event registry, so they are not accessible via the Sensu API; however, all registration events are logged in the [Sensu backend][2] log._

### Deregistration events

Similarly to registration events, the Sensu backend can create and process a deregistration event when the Sensu agent process stops.
You can use deregistration events to trigger a handler that updates external CMDBs or performs an action to update ephemeral infrastructures.
To enable deregistration events, use the [`deregister` flag][13] and specify the event handler using the [`deregistration-handler` flag][13].
You can specify a deregistration handler per agent using the [`deregistration-handler` agent flag][13] or by setting a default for all agents using the [`deregistration-handler` backend configuration flag][37].

### Clustering

Agents can connect to a Sensu cluster by specifying any Sensu backend URL in the cluster in the [`backend-url` configuration flag][16]. For more information about clustering, see [Sensu backend datastore configuration flags][35] and the [guide to running a Sensu cluster][36].

## Configuration

You can specify the agent configuration using a `/etc/sensu/agent.yml` file or using `sensu-agent start` [configuration flags][24].
See the example config file provided with Sensu at `/usr/share/doc/sensu-go-agent-5.0.0/agent.yml.example`.
The agent loads configuration upon startup, so you must restart the agent for any configuration updates to take effect.

### Configuration summary

{{< highlight text >}}
$ sensu-agent start --help
start the sensu agent

Usage:
  sensu-agent start [flags]

Flags:
      --api-host string                 address to bind the Sensu client HTTP API to (default "127.0.0.1")
      --api-port int                    port the Sensu client HTTP API listens on (default 3031)
      --backend-url strings             ws/wss URL of Sensu backend server (to specify multiple backends use this flag multiple times) (default [ws://127.0.0.1:8081])
      --cache-dir string                path to store cached data (default "/var/cache/sensu/sensu-agent")
  -c, --config-file string              path to sensu-agent config file
      --deregister                      ephemeral agent
      --deregistration-handler string   deregistration handler that should process the entity deregistration event.
      --disable-api                     disable the Agent HTTP API
      --disable-sockets                 disable the Agent TCP and UDP event sockets
  -h, --help                            help for start
      --keepalive-interval int          number of seconds to send between keepalive events (default 20)
      --keepalive-timeout uint32        number of seconds until agent is considered dead by backend (default 120)
      --labels stringToString           entity labels map (default [])
      --log-level string                logging level [panic, fatal, error, warn, info, debug] (default "warn")
      --name string                     agent name (defaults to hostname) (default "sensu-go-sandbox")
      --namespace string                agent namespace (default "default")
      --password string                 agent password (default "P@ssw0rd!")
      --redact string                   comma-delimited customized list of fields to redact
      --socket-host string              address to bind the Sensu client socket to (default "127.0.0.1")
      --socket-port int                 port the Sensu client socket listens on (default 3030)
      --statsd-disable                  disables the statsd listener and metrics server
      --statsd-event-handlers strings   comma-delimited list of event handlers for statsd metrics
      --statsd-flush-interval int       number of seconds between statsd flush (default 10)
      --statsd-metrics-host string      address used for the statsd metrics server (default "127.0.0.1")
      --statsd-metrics-port int         port used for the statsd metrics server (default 8125)
      --subscriptions string            comma-delimited list of agent subscriptions
      --user string                     agent user (default "agent")
{{< /highlight >}}

### General configuration flags

| backend-url |      |
--------------|------
description   | ws or wss URL of the Sensu backend server. To specify multiple backends using `sensu-agent start`, use this flag multiple times.
type          | String
default       | `ws://127.0.0.1:8081`
example       | {{< highlight shell >}}# Command line example
sensu-agent start --backend-url ws://0.0.0.0:8081

# /etc/sensu/agent.yml example
backend-url:
  - "ws://0.0.0.0:8081"{{< /highlight >}}

<a name="cache-dir">

| cache-dir   |      |
--------------|------
description   | Path to store cached data
type          | String
default       | <ul><li>Linux: `/var/cache/sensu/sensu-agent`</li><li>Windows: `C:\\ProgramData\sensu\cache\sensu-agent`</li></ul>
example       | {{< highlight shell >}}# Command line example
sensu-agent start --cache-dir /cache/sensu-agent

# /etc/sensu/agent.yml example
cache-dir: "/cache/sensu-agent"{{< /highlight >}}


| config-file |      |
--------------|------
description   | Path to Sensu agent config file
type          | String
default       | <ul><li>Linux: `/etc/sensu/agent.yml`</li><li>FreeBSD: `/usr/local/etc/sensu/agent.yml`</li><li>Windows: `C:\\ProgramData\sensu\config\agent.yml`</li></ul>
example       | {{< highlight shell >}}# Command line example
sensu-agent start --config-file /sensu/agent.yml
sensu-agent start --c /sensu/agent.yml

# /etc/sensu/agent.yml example
config-file: "/sensu/agent.yml"{{< /highlight >}}


| labels     |      |
-------------|------
description  | Custom attributes to include with event data, which can be queried like regular attributes. You can use labels to organize entities into meaningful collections that can be selected using [filters][9] and [tokens][27].
required     | false
type         | Map of key-value pairs. Keys can contain only letters, numbers, and underscores, but must start with a letter. Values can be any valid UTF-8 string.
default      | `null`
example               | {{< highlight shell >}}# Command line example
sensu-agent start --labels region=us-west-2

# /etc/sensu/agent.yml example
labels:
  region: us-west-2
{{< /highlight >}}

<a name="name">

| name        |      |
--------------|------
description   | Entity name assigned to the agent entity
type          | String
default       | Defaults to hostname, for example: `sensu-centos`
example       | {{< highlight shell >}}# Command line example
sensu-agent start --name agent-01

# /etc/sensu/agent.yml example
name: "agent-01" {{< /highlight >}}


| log-level   |      |
--------------|------
description   | Logging level: `panic`, `fatal`, `error`, `warn`, `info`, or `debug`
type          | String
default       | `warn`
example       | {{< highlight shell >}}# Command line example
sensu-agent start --log-level debug

# /etc/sensu/agent.yml example
log-level: "debug"{{< /highlight >}}

<a name="subscriptions-flag">

| subscriptions |      |
----------------|------
description     | An array of agent subscriptions which determine which monitoring checks are executed by the agent. The subscriptions array items must be strings.
type            | Array
example         | {{< highlight shell >}}# Command line example
sensu-agent start --subscriptions disk-checks,process-checks

# /etc/sensu/agent.yml example
subscriptions:
  - "disk-checks"
  - "process-checks"{{< /highlight >}}


### API configuration flags

| api-host    |      |
--------------|------
description   | Bind address for the Sensu agent HTTP API
type          | String
default       | `127.0.0.1`
example       | {{< highlight shell >}}# Command line example
sensu-agent start --api-host 0.0.0.0

# /etc/sensu/agent.yml example
api-host: "0.0.0.0"{{< /highlight >}}


| api-port    |      |
--------------|------
description   | Listening port for the Sensu agent HTTP API
type          | Integer
default       | `3031`
example       | {{< highlight shell >}}# Command line example
sensu-agent start --api-port 4041

# /etc/sensu/agent.yml example
api-port: 4041{{< /highlight >}}


| disable-api |      |
--------------|------
description   | Disable the agent HTTP API
type          | Boolean
default       | `false`
example       | {{< highlight shell >}}# Command line example
sensu-agent start --disable-api

# /etc/sensu/agent.yml example
disable-api: true{{< /highlight >}}

### Ephemeral agent configuration flags

| deregister  |      |
--------------|------
description   | Indicates whether a deregistration event should be created upon Sensu agent process stop
type          | Boolean
default       | `false`
example       | {{< highlight shell >}}# Command line example
sensu-agent start --deregister

# /etc/sensu/agent.yml example
deregister: true{{< /highlight >}}


| deregistration-handler |      |
-------------------------|------
description              | The name of a deregistration handler that processes agent deregistration events. This flag overrides any handlers applied by the [`deregistration-handler` backend configuration flag][37].
type                     | String
example                  | {{< highlight shell >}}# Command line example
sensu-agent start --deregistration-handler deregister

# /etc/sensu/agent.yml example
deregistration-handler: "deregister"{{< /highlight >}}


### Keepalive configuration flags

| keepalive-interval |      |
---------------------|------
description          | Number of seconds between keepalive events
type                 | Integer
default              | `20`
example              | {{< highlight shell >}}# Command line example
sensu-agent start --keepalive-interval 30

# /etc/sensu/agent.yml example
keepalive-interval: 30{{< /highlight >}}


| keepalive-timeout |      |
--------------------|------
description         | Number of seconds after a missing keepalive event until the agent is considered unresponsive by the Sensu backend
type                | Integer
default             | `120`
example             | {{< highlight shell >}}# Command line example
sensu-agent start --keepalive-timeout 300

# /etc/sensu/agent.yml example
keepalive-timeout: 300{{< /highlight >}}


### Security configuration flags

| namespace |      |
---------------|------
description    | Agent namespace
type           | String
default        | `default`
example        | {{< highlight shell >}}# Command line example
sensu-agent start --namespace ops

# /etc/sensu/agent.yml example
namespace: "ops"{{< /highlight >}}


| password    |      |
--------------|------
description   | Agent password
type          | String
default       | `P@ssw0rd!`
example       | {{< highlight shell >}}# Command line example
sensu-agent start --password secure-password

# /etc/sensu/agent.yml example
password: "secure-password"{{< /highlight >}}


| redact      |      |
--------------|------
description   | Comma-separated list of fields to redact
type          | String
default       | By default, Sensu redacts the following fields: `password`, `passwd`, `pass`, `api_key`, `api_token`, `access_key`, `secret_key`, `private_key`, `secret`
example       | {{< highlight shell >}}# Command line example
sensu-agent start --redact secure-key,secure-password

# /etc/sensu/agent.yml example
redact: "secure-key,secure-password"{{< /highlight >}}


| user |      |
--------------|------
description   | Agent user
type          | String
default       | `agent`
example       | {{< highlight shell >}}# Command line example
sensu-agent start --user agent-01

# /etc/sensu/agent.yml example
user: "agent-01"{{< /highlight >}}


### Socket configuration flags

| socket-host |      |
--------------|------
description   | Address to bind the Sensu agent socket to
type          | String
default       | `127.0.0.1`
example       | {{< highlight shell >}}# Command line example
sensu-agent start --socket-host 0.0.0.0

# /etc/sensu/agent.yml example
socket-host: "0.0.0.0"{{< /highlight >}}


| socket-port |      |
--------------|------
description   | Port the Sensu agent socket listens on
type          | Integer
default       | `3030`
example       | {{< highlight shell >}}# Command line example
sensu-agent start --socket-port 4030

# /etc/sensu/agent.yml example
socket-port: 4030{{< /highlight >}}


| disable-sockets |      |
------------------|------
description       | Disable the agent TCP and UDP event sockets
type              | Boolean
default           | `false`
example           | {{< highlight shell >}}# Command line example
sensu-agent start --disable-sockets

# /etc/sensu/agent.yml example
disable-sockets: true{{< /highlight >}}


### StatsD configuration flags

| statsd-disable |      |
-----------------|------
description      | Disables the [StatsD][21] listener and metrics server
type             | Boolean
default          | `false`
example          | {{< highlight shell >}}# Command line example
sensu-agent start --statsd-disable

# /etc/sensu/agent.yml example
statsd-disable: true{{< /highlight >}}


| statsd-event-handlers |      |
------------------------|------
description             | Comma-separated list of event handlers for StatsD metrics
type                    | String
example                 | {{< highlight shell >}}# Command line example
sensu-agent start --statsd-event-handlers influxdb,opentsdb

# /etc/sensu/agent.yml example
statsd-event-handlers: "influxdb,opentsdb"{{< /highlight >}}


| statsd-flush-interval  |      |
-------------------------|------
description              | Number of seconds between [StatsD flush][23]
type                     | Integer
default                  | `10`
example                  | {{< highlight shell >}}# Command line example
sensu-agent start --statsd-flush-interval 30

# /etc/sensu/agent.yml example
statsd-flush-interval: 30{{< /highlight >}}


| statsd-metrics-host |      |
----------------------|------
description           | Address used for the StatsD metrics server
type                  | String
default               | `127.0.0.1`
example               | {{< highlight shell >}}# Command line example
sensu-agent start --statsd-metrics-host 0.0.0.0

# /etc/sensu/agent.yml example
statsd-metrics-host: "0.0.0.0"{{< /highlight >}}


| statsd-metrics-port |      |
----------------------|------
description           | Port used for the StatsD metrics server
type                  | Integer
default               | `8125`
example               | {{< highlight shell >}}# Command line example
sensu-agent start --statsd-metrics-port 6125

# /etc/sensu/agent.yml example
statsd-metrics-port: 6125{{< /highlight >}}

[1]: ../../getting-started/installation-and-configuration#install-the-sensu-agent
[2]: ../backend
[3]: ../entities
[4]: #keepalive-configuration-flags
[5]: ../../guides/run-auto-remediation
[6]: ../sensuctl
[7]: ../events
[8]: ../handlers
[9]: ../filters
[10]: ../mutators
[11]: https://en.wikipedia.org/wiki/Configuration_management_database
[12]: https://www.servicenow.com/products/it-operations-management.html
[13]: #ephemeral-agent-configuration-flags
[14]: ../checks
[15]: https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern
[16]: #general-configuration-flags
[17]: #socket-configuration-flags
[18]: #api-configuration-flags
[19]: http://nc110.sourceforge.net/
[20]: http://en.wikipedia.org/wiki/Dead_man%27s_switch
[21]: https://github.com/etsy/statsd
[22]: #statsd-configuration-flags
[23]: https://github.com/etsy/statsd#key-concepts
[24]: #configuration
[26]: #keepalives
[27]: ../tokens
[28]: #subscriptions-flag
[29]: ../assets
[30]: #cache-dir
[31]: ../hooks
[32]: ../checks/#how-do-checks-work
[33]: ../../guides/monitor-external-resources
[34]: ../handlers#handler-sets
[35]: ../backend#datastore-and-cluster-configuration-flags
[36]: ../../guides/clustering
[37]: ../backend#general-configuration-flags
[38]: #name
[39]: ../checks#check-result-specification
[40]: ../../guides/send-slack-alerts
