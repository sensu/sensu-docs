---
title: "Sensu agent"
linkTitle: "Sensu Agent"
description: "The Sensu agent is a lightweight client that runs on the infrastructure components you want to monitor. Read the reference doc to get started using the agent to create monitoring events."
weight: 1
version: "5.12"
product: "Sensu Go"
platformContent: true
platforms: ["Linux", "Windows"]
menu:
  sensu-go-5.12:
    parent: reference
---

- [Installation][1]
- [Creating events using service checks](#creating-monitoring-events-using-service-checks)
- [Creating events using the agent API](#creating-monitoring-events-using-the-agent-api)
- [Creating events using the StatsD listener](#creating-monitoring-events-using-the-statsd-listener)
- [Creating events using the agent TCP and UDP sockets](#creating-monitoring-events-using-the-agent-tcp-and-udp-sockets) (deprecated)
- [Keepalive monitoring](#keepalive-monitoring)
- [Service management](#operation)
  - [Starting and stopping the service](#starting-the-service)
	- [Registration and deregistration](#registration)
	- [Clustering](#clustering)
  - [Time synchronization](#time-synchronization)
- [Configuration](#configuration)
  - [API configuration](#api-configuration-flags)
  - [Ephemeral agent configuration](#ephemeral-agent-configuration-flags)
  - [Keepalive configuration](#keepalive-configuration-flags)
  - [Security configuration](#security-configuration-flags)
  - [Socket configuration](#socket-configuration-flags)
  - [StatsD configuration](#statsd-configuration-flags)
  - [Example](../../files/agent.yml)

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
2. Fetches [assets][29] and stores them in its local cache. By default, agents cache asset data at `/var/cache/sensu/sensu-agent` (`C:\ProgramData\sensu\cache\sensu-agent` on Windows systems) or as specified by the the [`cache-dir` flag][30].
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

## Creating monitoring events using the agent API

The Sensu agent API allows external sources to send monitoring data to Sensu without needing to know anything about Sensu's internal implementation.
The agent API listens on the address and port specified by the [API configuration flags][18]; only unsecured HTTP (no HTTPS) is supported at this time.
Any requests for unknown endpoints result in a 404 Not Found response.

### `/events` (POST)

The `/events` API provides HTTP POST access to publish [monitoring events][7] to the Sensu backend pipeline via the agent API.
The agent places events created via the `/events` POST endpoint into a queue stored on disk.
In the event of a loss of connection with the backend or agent shutdown, queued event data is preserved, and the agent sends queued events to the backend once a connection is reestablished.

The `/events` API uses a configurable burst limit and rate limit for relaying events to the backend.
See the [API configuration flags](#api-configuration-flags) to configure the `events-burst-limit` and `events-rate-limit` flags.

#### Example {#events-post-example}

In the following example, an HTTP POST is submitted to the `/events` API, creating an event for a check named `check-mysql-status` with the output `could not connect to mysql` and a status of `1` (warning).
The agent responds with a 202 (Accepted) response code to indicate that the event has been added to the queue to be sent to the backend.

{{< highlight shell >}}
curl -X POST \
-H 'Content-Type: application/json' \
-d '{
  "check": {
    "metadata": {
      "name": "check-mysql-status"
    },
    "status": 1,
    "output": "could not connect to mysql"
  }
}' \
http://127.0.0.1:3031/events

HTTP/1.1 202 Accepted
{{< /highlight >}}

_PRO TIP: You can use the agent API `/events` endpoint to create proxy entities by including a `proxy_entity_name` attribute within the `check` scope._

#### Detecting silent failures

You can use the Sensu agent API in combination with the check time-to-live attribute (TTL) to detect silent failures, creating what's commonly referred to as a "dead man's switch" (source: [Wikipedia][20]).
By using check TTLs, Sensu is able to set an expectation that a Sensu agent will publish additional events for a check within the period of time specified by the TTL attribute.
If a Sensu agent fails to publish an event before the check TTL expires, the Sensu backend creates an event with a status of `1` (warning) to indicate the expected event was not received.
For more information on check TTLs, see the [the check reference][44].

A great use case for the Sensu agent API is to enable tasks which run outside of Sensu's check scheduling to emit events. Using the check TTL attribute, these events create a dead man's switch, ensuring that if the task fails for any reason, the lack of an "all clear" event from the task notifies operators of a silent failure which might otherwise be missed.
If an external source sends a Sensu event with a check TTL to the Sensu agent API, Sensu expects another event from the same external source before the TTL expires.

The following is an example of external event input via the Sensu agent API using a check TTL to create a dead man's switch for MySQL backups.
If we assume that a MySQL backup script runs periodically and that we expect the job to take a little less than 7 hours to complete, in the case where the job completes successfully, we'd like a record of it but don't need to be alerted. If the job fails for some reason, or continues running past the expected 7 hours, we'd like to be alerted. In the following example, the script sends an event which tells the Sensu backend to expect an additional event with the same name within 7 hours of the first event.

{{< highlight shell >}}
curl -X POST \
-H 'Content-Type: application/json' \
-d '{
  "check": {
    "metadata": {
      "name": "mysql-backup-job"
    },
    "status": 0,
    "output": "mysql backup initiated",
    "ttl": 25200
  }
}' \
http://127.0.0.1:3031/events
{{< /highlight >}}

With this initial event submitted to the agent API, we have recorded in the Sensu backend that our script started, and we've configured the dead man's switch so that we'll be alerted if the job fails or runs too long. Although it is possible for our script to handle errors gracefully and emit additional monitoring events, this approach allows us to worry less about handling every possible error case, as the lack of additional events before the 7 hour period elapses results in an alert.

If our backup script runs successfully, we can send an additional event without the TTL attribute, which removes the dead man's switch:

{{< highlight shell >}}
curl -X POST \
-H 'Content-Type: application/json' \
-d '{
  "check": {
    "metadata": {
      "name": "mysql-backup-job"
    },
    "status": 0,
    "output": "mysql backup ran successfully!"
  }
}' \
http://127.0.0.1:3031/events
{{< /highlight >}}

By omitting the TTL attribute from this event, the dead man's switch being monitored by the Sensu backend is also removed, effectively sounding the "all clear" for this iteration of the task.

#### API specification {#events-post-specification}

/events (POST)     | 
-------------------|------
description        | Accepts JSON [event data][7] and passes the event to the Sensu backend event pipeline for processing
example url        | http://hostname:3031/events
payload example    | {{< highlight json >}}{
  "check": {
    "metadata": {
      "name": "check-mysql-status"
    },
    "status": 1,
    "output": "could not connect to mysql"
  }
}{{< /highlight >}}
payload attributes | <ul><li>`check` (required): All check data must be within the `check` scope.</li><li>`metadata` (required): The `check` scope must contain a `metadata` scope.</li><li>`name` (required): The `metadata` scope must contain the `name` attribute with a string representing the name of the monitoring check.</li><li>Any other attributes supported by the [Sensu check specification][14] (optional)</li></ul>
response codes     | <ul><li>**Success**: 202 (Accepted)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

### `/healthz` (GET)

The `/healthz` API provides HTTP GET access to the status of the Sensu agent via the agent API.

#### Example {#healthz-get-example}

In the following example, an HTTP GET is submitted to the `/healthz` API:

{{< highlight shell >}}
curl http://127.0.0.1:3031/healthz
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
sensu-agent --statsd-event-handlers influx-db --statsd-flush-interval 1 --statsd-metrics-host 123.4.5.11 --statsd-metrics-port 8125
{{< /highlight >}}

## Creating monitoring events using the agent TCP and UDP sockets

_NOTE: The agent TCP and UDP sockets are deprecated in favor of the [agent API](#events-post)._

Sensu agents listen for external monitoring data using TCP and UDP sockets.
The agent sockets accept JSON event data and pass the event to the Sensu backend event pipeline for processing.
The TCP and UDP sockets listen on the address and port specified by the [socket configuration flags][17].

### Using the TCP socket

The following is an example demonstrating external monitoring data input via the Sensu agent TCP socket.
The example uses Bash's built-in `/dev/tcp` file to communicate with the Sensu agent socket.

{{< highlight shell >}}
echo '{"name": "check-mysql-status", "status": 1, "output": "error!"}' > /dev/tcp/localhost/3030
{{< /highlight >}}

You can also use the [Netcat][19] utility to send monitoring data to the agent socket:

{{< highlight shell >}}
echo '{"name": "check-mysql-status", "status": 1, "output": "error!"}' | nc localhost 3030
{{< /highlight >}}

### Using the UDP socket

The following is an example demonstrating external monitoring data input via the Sensu agent UDP socket.
The example uses Bash's built-in `/dev/udp` file to communicate with the Sensu agent socket.

{{< highlight shell >}}
echo '{"name": "check-mysql-status", "status": 1, "output": "error!"}' > /dev/udp/127.0.0.1/3030
{{< /highlight >}}

You can also use the [Netcat][19] utility to send monitoring data to the agent socket:

{{< highlight shell >}}
echo '{"name": "check-mysql-status", "status": 1, "output": "error!"}' | nc -u -v 127.0.0.1 3030
{{< /highlight >}}

### Socket event format

The agent TCP and UDP sockets use a special event data format designed for backwards compatibility with [Sensu 1.x check results][42].
Attributes specified in socket events appear in the resulting event data passed to the Sensu backend.

**Example socket input: Minimum required attributes**

{{< highlight json >}}
{
  "name": "check-mysql-status",
  "status": 1,
  "output": "error!"
}
{{< /highlight >}}

**Example socket input: All attributes**

{{< highlight json >}}
{
  "name": "check-http",
  "status": 1,
  "output": "404",
  "source": "sensu-docs-site",
  "executed": 1550013435,
  "duration": 1.903135228,
  "handlers": ["slack", "influxdb"]
}
{{< /highlight >}}

### Socket event specification

The Sensu agent socket ignores any attributes not included in this specification.

name         | 
-------------|------
description  | The check name
required     | true
type         | String
example      | {{< highlight shell >}}"name": "check-mysql-status"{{< /highlight >}}

status       | 
-------------|------
description  | The check execution exit status code. An exit status code of `0` (zero) indicates `OK`, `1` indicates `WARNING`, and `2` indicates `CRITICAL`; exit status codes other than `0`, `1`, or `2` indicate an `UNKNOWN` or custom status.
required     | true
type         | Integer
example      | {{< highlight shell >}}"status": 0{{< /highlight >}}

output       | 
-------------|------
description  | The output produced by the check `command`.
required     | true
type         | String
example      | {{< highlight shell >}}"output": "CheckHttp OK: 200, 78572 bytes"{{< /highlight >}}

source       | 
-------------|------
description  | The name of the Sensu entity associated with the event. Use this attribute to tie the event to a proxy entity. If no matching entity exists, Sensu creates a proxy entity with the name provided by the `source` attribute.
required     | false
default      | The agent entity receiving the event data
type         | String
example      | {{< highlight shell >}}"source": "sensu-docs-site"{{< /highlight >}}

client       | 
-------------|------
description  | _NOTE: The `client` attribute is deprecated in favor of the `source` attribute (see above)._ The name of the Sensu entity associated with the event. Use this attribute to tie the event to a proxy entity. If no matching entity exists, Sensu creates a proxy entity with the name provided by the `client` attribute.
required     | false
default      | The agent entity receiving the event data
type         | String
example      | {{< highlight shell >}}"client": "sensu-docs-site"{{< /highlight >}}

executed     | 
-------------|------
description  | The time the check was executed, in seconds since the Unix epoch.
required     | false
default      | The time the event was received by the agent
type         | Integer
example      | {{< highlight shell >}}"executed": 1458934742{{< /highlight >}}

duration     | 
-------------|------
description  | The amount of time (in seconds) it took to execute the check.
required     | false
type         | Float
example      | {{< highlight shell >}}"duration": 1.903135228{{< /highlight >}}

command      | 
-------------|------
description  | The command executed to produce the event. You can use this attribute to add context to the event data; Sensu does not execute the command included in this attribute.
required     | false
type         | String
example      | {{< highlight shell >}}"command": "check-http.rb -u https://sensuapp.org"{{< /highlight >}}

interval     | 
-------------|------
description  | The interval used to produce the event. You can use this attribute to add context to the event data; Sensu does not act on the value provided in this attribute.
required     | false
default      | `1`
type         | Integer
example      | {{< highlight shell >}}"interval": 60{{< /highlight >}}

handlers     | 
-------------|------
description  | An array of Sensu handler names to use for handling the event. Each handler name in the array must be a string.
required     | false
type         | Array
example      | {{< highlight shell >}}"handlers": ["slack", "influxdb"]{{< /highlight >}}

## Keepalive monitoring

Sensu `keepalives` are the heartbeat mechanism used to ensure that all registered agents are operational and able to reach the [Sensu backend][2].
Sensu agents publish keepalive events containing [entity][3] configuration data to the Sensu backend according to the interval specified by the [`keepalive-interval` flag][4].
If a Sensu agent fails to send keepalive events over the period specified by the [`keepalive-timeout` flag][4], the Sensu backend creates a keepalive alert in the Sensu dashboard.
You can use keepalives to identify unhealthy systems and network partitions, send notifications, trigger auto-remediation, and other useful actions.

_NOTE: Keepalive monitoring is not supported for [proxy entities][3], as they are inherently unable to run a Sensu agent._

### Handling keepalive events

You can connect keepalive events to your monitoring workflows using a keepalive handler.
Sensu looks for an [event handler][8] named `keepalive` and automatically uses it to process keepalive events.

Let's say you want to receive Slack notifications for keepalive alerts, and you already have a [Slack handler set up to process events][40].
To process keepalive events using the Slack pipeline, create a handler set named `keepalive` and add the `slack` handler to the `handlers` array.
The resulting `keepalive` handler set configuration looks like this:

{{< language-toggle >}}

{{< highlight yml >}}
type: Handler
api_version: core/v2
metadata:
  name: keepalive
  namespace: default
spec:
  handlers:
  - slack
  type: set
{{< /highlight >}}

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

{{< /language-toggle >}}

## Operation

### Starting the service
Use the `sensu-agent` tool to start the agent and apply configuration flags.

{{< platformBlock "Linux" >}}

#### Linux

To start the agent with [configuration flags][24]:

{{< highlight shell >}}
sensu-agent start --subscriptions disk-checks --log-level debug
{{< /highlight >}}

To see available configuration flags and defaults:

{{< highlight shell >}}
sensu-agent start --help
{{< /highlight >}}

To start the agent using a service manager:

{{< highlight shell >}}
sudo service sensu-agent start
{{< /highlight >}}

If no configuration flags are provided, the agent loads configuration from the location specified by the `config-file` attribute (default: `/etc/sensu/agent.yml`).

{{< platformBlockClose >}}

{{< platformBlock "Windows" >}}

#### Windows

Run the following command as an admin to install and start the agent.

{{< highlight text >}}
sensu-agent service install
{{< /highlight >}}

By default, the agent loads configuration from `%ALLUSERSPROFILE%\sensu\config\agent.yml` (for example: `C:\ProgramData\sensu\config\agent.yml`) and stores service logs to `%ALLUSERSPROFILE%\sensu\log\sensu-agent.log` (for example: `C:\ProgramData\sensu\log\sensu-agent.log`).

You can configure the configuration file and log file locations using the `config-file` and `log-file` flags.

{{< highlight text >}}
sensu-agent service install --config-file 'C:\\monitoring\\sensu\\config\\agent.yml' --log-file 'C:\\monitoring\\sensu\\log\\sensu-agent.log'
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

{{< platformBlock "Windows" >}}

**Windows**

{{< highlight text >}}
sc.exe stop SensuAgent
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

{{< platformBlock "Windows" >}}

**Windows**

{{< highlight text >}}
sc.exe stop SensuAgent
sc.exe start SensuAgent
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

{{< platformBlock "Windows" >}}

**Windows**

The service is configured to start automatically on boot by default.

{{< platformBlockClose >}}

### Getting service status

To see the status of the agent service using a service manager:

{{< platformBlock "Linux" >}}

**Linux**

{{< highlight shell >}}
service sensu-agent status
{{< /highlight >}}

{{< platformBlockClose >}}

{{< platformBlock "Windows" >}}

**Windows**

{{< highlight text >}}
sc.exe query SensuAgent
{{< /highlight >}}

{{< platformBlockClose >}}

### Getting service version

To get the current agent version using the `sensu-agent` tool:

{{< highlight shell >}}
sensu-agent version
{{< /highlight >}}

### Uninstalling the service

{{< platformBlock "Windows" >}}

**Windows**

{{< highlight text >}}
sensu-agent service uninstall
{{< /highlight >}}

{{< platformBlockClose >}}

### Getting help

The `sensu-agent` tool provides general and command-specific help flags:

{{< highlight shell >}}
# Show sensu-agent commands
sensu-agent help

# Show options for the sensu-agent start subcommand
sensu-agent start --help
{{< /highlight >}}

### Clustering

Agents can connect to a Sensu cluster by specifying any Sensu backend URL in the cluster in the [`backend-url` configuration flag][16]. For more information about clustering, see [Sensu backend datastore configuration flags][35] and the [guide to running a Sensu cluster][36].

### Time synchronization

System clocks between agents and the backend should be synchronized to a central NTP server. Out of sync system time may cause issues with keepalive, metric, and check alerts.

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

## Configuration

The agent loads configuration upon startup, so you must restart the agent for any configuration updates to take effect.

{{< platformBlock "Linux" >}}

### Linux

You can specify the agent configuration using a `.yml` file or using `sensu-agent start` command-line flags.
Configuration provided via command-line flags overrides attributes specified in a configuration file.
See the [example config file](../../files/agent.yml) for flags and defaults.

#### Configuration summary

{{< highlight text >}}
$ sensu-agent start --help
start the sensu agent

Usage:
  sensu-agent start [flags]

Flags:
      --annotations stringToString      entity annotations map (default [])
      --api-host string                 address to bind the Sensu client HTTP API to (default "127.0.0.1")
      --api-port int                    port the Sensu client HTTP API listens on (default 3031)
      --backend-url strings             ws/wss URL of Sensu backend server (to specify multiple backends use this flag multiple times) (default [ws://127.0.0.1:8081])
      --cache-dir string                path to store cached data (default "/var/cache/sensu/sensu-agent")
  -c, --config-file string              path to sensu-agent config file
      --deregister                      ephemeral agent
      --deregistration-handler string   deregistration handler that should process the entity deregistration event.
      --disable-assets                  disable check assets on this agent
      --disable-api                     disable the Agent HTTP API
      --disable-sockets                 disable the Agent TCP and UDP event sockets
      --events-burst-limit              /events api burst limit
      --events-rate-limit               maximum number of events transmitted to the backend through the /events api
  -h, --help                            help for start
      --insecure-skip-tls-verify        skip ssl verification
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
      --trusted-ca-file string          tls certificate authority
      --user string                     agent user (default "agent")
{{< /highlight >}}

{{< platformBlockClose >}}

{{< platformBlock "Windows" >}}

### Windows

You can specify the agent configuration using a `.yml` file.
See the example config file provided with Sensu packages at `%ALLUSERSPROFILE%\sensu\config\agent.yml.example` (default: `C:\ProgramData\sensu\config\agent.yml.example`) or [available here](../../files/windows/agent.yml).

{{< platformBlockClose >}}

### General configuration flags

| annotations|      |
-------------|------
description  | Non-identifying metadata to include with event data, which can be accessed using [filters][9] and [tokens][27]. You can use annotations to add data that's meaningful to people or external tools interacting with Sensu.<br><br>In contrast to labels, annotations cannot be used in [API filtering][api-filter] or [sensuctl filtering][sensuctl-filter] and do not impact Sensu's internal performance.
required     | false
type         | Map of key-value pairs. Keys and values can be any valid UTF-8 string.
default      | `null`
example      | {{< highlight shell >}}# Command line examples
sensu-agent start --annotations sensu.io/plugins/slack/config/webhook-url=https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX
sensu-agent start --annotations example-key="example value" --annotations example-key2="example value"

# /etc/sensu/agent.yml example
annotations:
  sensu.io/plugins/slack/config/webhook-url: "https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX"
{{< /highlight >}}

| backend-url |      |
--------------|------
description   | ws or wss URL of the Sensu backend server. To specify multiple backends using `sensu-agent start`, use this flag multiple times.
type          | List
default       | `ws://127.0.0.1:8081`
example       | {{< highlight shell >}}# Command line examples
sensu-agent start --backend-url ws://0.0.0.0:8081
sensu-agent start --backend-url ws://0.0.0.0:8081 --backend-url ws://0.0.0.0:8082

# /etc/sensu/agent.yml example
backend-url:
  - "ws://0.0.0.0:8081"
  - "ws://0.0.0.0:8082"
  {{< /highlight >}}

<a name="cache-dir"></a>

| cache-dir   |      |
--------------|------
description   | Path to store cached data
type          | String
default       | <ul><li>Linux: `/var/cache/sensu/sensu-agent`</li><li>Windows: `C:\ProgramData\sensu\cache\sensu-agent`</li></ul>
example       | {{< highlight shell >}}# Command line example
sensu-agent start --cache-dir /cache/sensu-agent

# /etc/sensu/agent.yml example
cache-dir: "/cache/sensu-agent"{{< /highlight >}}


| config-file |      |
--------------|------
description   | Path to Sensu agent config file
type          | String
default       | <ul><li>Linux: `/etc/sensu/agent.yml`</li><li>FreeBSD: `/usr/local/etc/sensu/agent.yml`</li><li>Windows: `C:\ProgramData\sensu\config\agent.yml`</li></ul>
example       | {{< highlight shell >}}# Command line example
sensu-agent start --config-file /sensu/agent.yml
sensu-agent start -c /sensu/agent.yml

# /etc/sensu/agent.yml example
config-file: "/sensu/agent.yml"{{< /highlight >}}

<a name="disable-assets"></a>

| disable-assets |      |
--------------|------
description   | When set to `true`, disables [assets][] for the agent. In the event that an agent
attempts to execute a check that requires an asset, the agent will respond with a status of `3`, and a message indicating that the agent could not execute the check because assets are disabled.
type          | Boolean
default       | false
example       | {{< highlight shell >}}# Command line example
sensu-agent start --disable-assets

# /etc/sensu/agent.yml example
disable-assets: true{{< /highlight >}}


| labels     |      |
-------------|------
description  | Custom attributes to include with event data, which can be accessed using [filters][9] and [tokens][27].<br><br>In contrast to annotations, you can use labels to create meaningful collections that can be selected with [API filtering][api-filter] and [sensuctl filtering][sensuctl-filter]. Overusing labels can impact Sensu's internal performance, so we recommend moving complex, non-identifying metadata to annotations.
required     | false
type         | Map of key-value pairs. Keys can contain only letters, numbers, and underscores, but must start with a letter. Values can be any valid UTF-8 string.
default      | `null`
example               | {{< highlight shell >}}# Command line examples
sensu-agent start --labels proxy_type=website
sensu-agent start --labels example_key1="example value" example_key2="example value"

# /etc/sensu/agent.yml example
labels:
  proxy_type: "website"
{{< /highlight >}}

<a name="name"></a>

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

<a name="subscriptions-flag"></a>

| subscriptions |      |
----------------|------
description     | An array of agent subscriptions which determine which monitoring checks are executed by the agent. The subscriptions array items must be strings.
type            | List
example         | {{< highlight shell >}}# Command line examples
sensu-agent start --subscriptions disk-checks,process-checks
sensu-agent start --subscriptions disk-checks --subscriptions process-checks

# /etc/sensu/agent.yml example
subscriptions:
  - disk-checks
  - process-checks{{< /highlight >}}


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


| events-burst-limit | |
--------------|------
description   | The maximum amount of burst allowed in a rate interval for the [agent events API](#events-post).
type          | Integer
default       | `10`
example       | {{< highlight shell >}}# Command line example
sensu-agent start --events-burst-limit 20

# /etc/sensu/agent.yml example
events-burst-limit: 20{{< /highlight >}}


| events-rate-limit | |
--------------|------
description   | The maximum number of events per second that can be transmitted to the backend using the [agent events API](#events-post)
type          | Float
default       | `10.0`
example       | {{< highlight shell >}}# Command line example
sensu-agent start --events-rate-limit 20.0

# /etc/sensu/agent.yml example
events-rate-limit: 20.0{{< /highlight >}}


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
description    | Agent namespace _NOTE: Agents are represented in the backend as a class of entity. Entities can only belong to a [single namespace][41]._
type           | String
default        | `default`
example        | {{< highlight shell >}}# Command line example
sensu-agent start --namespace ops

# /etc/sensu/agent.yml example
namespace: "ops"{{< /highlight >}}


| user |      |
--------------|------
description   | Sensu [RBAC](../rbac) username used by the agent. Agents require get, list, create, update, and delete permissions for events across all namespaces.
type          | String
default       | `agent`
example       | {{< highlight shell >}}# Command line example
sensu-agent start --user agent-01

# /etc/sensu/agent.yml example
user: "agent-01"{{< /highlight >}}


| password    |      |
--------------|------
description   | Sensu [RBAC](../rbac) password used by the agent
type          | String
default       | `P@ssw0rd!`
example       | {{< highlight shell >}}# Command line example
sensu-agent start --password secure-password

# /etc/sensu/agent.yml example
password: "secure-password"{{< /highlight >}}


| redact      |      |
--------------|------
description   | List of fields to redact when displaying the entity _NOTE: Redacted secrets are sent via the websocket connection and are stored in etcd. They are not logged nor displayed via the Sensu API._
type          | List
default       | By default, Sensu redacts the following fields: `password`, `passwd`, `pass`, `api_key`, `api_token`, `access_key`, `secret_key`, `private_key`, `secret`
example       | {{< highlight shell >}}# Command line example
sensu-agent start --redact secret,ec2_access_key

# /etc/sensu/agent.yml example
redact:
  - secret
  - ec2_access_key
{{< /highlight >}}

| trusted-ca-file |      |
------------------|------
description       | SSL/TLS certificate authority
type              | String
default           | `""`
example           | {{< highlight shell >}}# Command line example
sensu-agent start --trusted-ca-file /path/to/trusted-certificate-authorities.pem

# /etc/sensu/agent.yml example
trusted-ca-file: "/path/to/trusted-certificate-authorities.pem"{{< /highlight >}}


| insecure-skip-tls-verify |      |
---------------------------|------
description                | Skip SSL verification. _WARNING: This configuration flag is intended for use in development systems only. Do not use this flag in production._
type                       | Boolean
default                    | `false`
example                    | {{< highlight shell >}}# Command line example
sensu-agent start --insecure-skip-tls-verify

# /etc/sensu/agent.yml example
insecure-skip-tls-verify: true{{< /highlight >}}


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
description             | List of event handlers for StatsD metrics
type                    | List
example                 | {{< highlight shell >}}# Command line examples
sensu-agent start --statsd-event-handlers influxdb,opentsdb
sensu-agent start --statsd-event-handlers influxdb --statsd-event-handlers opentsdb

# /etc/sensu/agent.yml example
statsd-event-handlers:
  - influxdb
  - opentsdb
{{< /highlight >}}


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

[1]: ../../installation/install-sensu#install-sensu-agents
[2]: ../backend
[3]: ../entities
[4]: #keepalive-configuration-flags
[6]: ../../sensuctl/reference
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
[41]: ../rbac/#namespaced-resource-types
[42]: /sensu-core/latest/reference/checks/#check-result-specification
[43]: ../entities#proxy-entities
[api-filter]: ../../api/overview#filtering
[sensuctl-filter]: ../../sensuctl/reference#filtering
[44]: ../checks#ttl-attribute
