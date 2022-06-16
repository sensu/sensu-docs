---
title: "Agent reference"
linkTitle: "Agent Reference"
reference_title: "Agent"
type: "reference"
description: "Read this reference to learn how Sensu's agent runs as a lightweight client on infrastructure components you want to monitor and creates observability events."
weight: 10
version: "6.6"
product: "Sensu Go"
platformContent: true
platforms: ["Linux", "Windows"]
menu:
  sensu-go-6.6:
    parent: observe-schedule
---

[Example Sensu agent configuration file](../../../files/agent.yml) (download)

The Sensu agent is a lightweight client that runs on the infrastructure components you want to monitor.
Agents register with the Sensu backend as [entities][3] with `type: "agent"`.
Agent entities are responsible for creating [check and metrics events][7] to send to the [backend event pipeline][2].

The Sensu agent is available for Linux, macOS, and Windows.
For Windows operating systems, the Sensu agent uses `cmd.exe` for the execution environment.
For all other operating systems, the Sensu agent uses the Bourne shell (sh).

Read the [installation guide][1] to install the agent.

## Agent authentication

The Sensu agent authenticates to the Sensu backend via [WebSocket][45] transport by either built-in basic authentication (username and password) or mutual transport layer security (mTLS) authentication.

### Username and password authentication

The default mechanism for agent authentication is [built-in basic authentication][59] with username and password.
The Sensu agent uses username and password authentication unless mTLS authentication has been explicitly configured.

For username and password authentication, sensu-agent joins the username and password with a colon and encodes them as a Base64 value.
Sensu provides the encoded string as the value of the `Authorization` HTTP header &mdash; for example, `Authorization: Basic YWdlbnQ6UEBzc3cwcmQh` &mdash; to authenticate to the Sensu backend.

When using username and password authentication, sensu-agent also sends the following HTTP headers in requests to the backend:

- `Sensu-User`: the username in plaintext
- `Sensu-AgentName`: the agent's configured name in plaintext
- `Sensu-Subscriptions`: the agent's subscriptions in a comma-separated plaintext list
- `Sensu-Namespace`: the agent's configured namespace in plaintext

### mTLS authentication

When mTLS is configured for both the Sensu agent and backend, the agent uses mTLS authentication instead of the default username and password authentication.

Sensu backends that are configured for mTLS authentication will no longer accept agent authentication via username and password.
Agents that are configured to use mTLS authentication cannot authenticate with the backend unless the backend is configured for mTLS.

To configure the agent and backend for mTLS authentication:

- In the backend configuration, specify valid certificate and key files as values for the `agent-auth-cert-file` and `agent-auth-key-file` parameters (e.g. `backend-1.pem` and `backend-1-key.pem`, respectively).
- In the agent configuration, specify valid certificate and key files as values for the `cert-file` and `key-file` parameters (e.g. `agent.pem` and `agent-key.pem`, respectively).

{{% notice note %}}
**NOTE**: For detailed information about the certificates and keys required for mTLS authentication, read [Generate certificates for your Sensu installation](../../../operations/deploy-sensu/generate-certificates/).
For information about using the certificates and keys to secure your configuration, read [Secure Sensu](../../../operations/deploy-sensu/secure-sensu/). 
{{% /notice %}}

The agent and backend will compare the provided certificates with the trusted CA certificate either in the system trust store or specified explicitly as the `agent-auth-trusted-ca-file` in the backend configuration and `trusted-ca-file` in the agent configuration.

When using mTLS authentication, sensu-agent sends the following HTTP headers in requests to the backend:

- `Sensu-AgentName`: the agent's configured name in plaintext
- `Sensu-Subscriptions`: the agent's subscriptions in a comma-separated, plaintext list
- `Sensu-Namespace`: the agent's configured namespace in plaintext

If the Sensu agent is configured for mTLS authentication, it will not send the `Authorization` HTTP header.

#### Certificate bundles or chains

The Sensu agent supports all types of certificate bundles (or chains) as long as the agent (or leaf) certificate is the *first* certificate in the bundle.
This is because the Go standard library assumes that the first certificate listed in the PEM file is the leaf certificate &mdash; the certificate that the program will use to show its own identity.

If you send the leaf certificate alone instead of sending the whole bundle with the leaf certificate first, you will receive a `certificate not signed by trusted authority` error.
You must present the whole chain to the remote so it can determine whether it trusts the presented certificate through the chain.

#### Certificate revocation check

The Sensu backend checks certificate revocation list (CRL) and Online Certificate Status Protocol (OCSP) endpoints for agent mTLS, etcd client, and etcd peer connections whose remote sides present X.509 certificates that provide CRL and OCSP revocation information.

## Communication between the agent and backend

The Sensu agent uses [WebSocket][45] (ws) protocol to send and receive JSON messages with the Sensu backend.
For optimal network throughput, agents will attempt to negotiate the use of [Protobuf][47] serialization when communicating with a Sensu backend that supports it.
This communication is via clear text by default.

Follow [Secure Sensu][46] to configure the backend and agent for WebSocket Secure (wss) encrypted communication.

{{% notice note %}}
**NOTE**: For information about agent transport status, use the [/health API](../../../api/other/health/#get-health-data-for-your-agent-transport).
{{% /notice %}}

## Connection failure

Although connection failure may be due to socket errors like unexpectedly closed connections and TLS handshake failures, the Sensu agent generally keeps retrying connections to each URL in the `backend-url` list until it is successfully connected to a backend URL or you stop the process.

When you start up a Sensu agent configured with multiple `backend-url` values, the agent shuffles the `backend-url` list and attempts to connect to the first URL in the shuffled list.
If the agent cannot establish a WebSocket connection with the first URL within the number of seconds specified for the [`backend-handshake-timeout`][43], the agent abandons the connection attempt and tries the next URL in the shuffled list.

When the agent establishes a WebSocket connection with a backend URL within the `backend-handshake-timeout` period, the agent sends a heartbeat message to the backend at the specified [`backend-heartbeat-interval`][34].
For every heartbeat the agent sends, the agent expects the connected backend to send a heartbeat response within the number of seconds specified for the `backend-heartbeat-timeout`.
If the connected backend does not respond within the `backend-heartbeat-timeout` period, the agent closes the connection and attempts to connect to the next backend URL in the shuffled list.

The agent iterates through the shuffled `backend-url` list until it successfully establishes a WebSocket connection with a backend, returning to the first URL if it fails to connect with the last URL in the list.

{{% notice note %}}
**NOTE**: Sensu's WebSocket connection heartbeat message and [keepalive monitoring](#keepalive-monitoring) mechanism are different, although they have similar purposes.<br><br>
The `backend-heartbeat-interval` and `backend-heartbeat-timeout` are specifically configured for the WebSocket connection heartbeat message the agent sends when it connects to a backend URL.<br><br>
Keepalive monitoring is more fluid &mdash; it permits agents to reconnect any number of times within the configured timeout.
As long as the agent can successfully send one event to any backend within the timeout, the keepalive logic is satisfied.
{{% /notice %}}

## Synchronize time between agents and the backend

System clocks between agents and the backend should be synchronized to a central NTP server.
If system time is out of sync, it may cause issues with keepalive, metric, and check alerts.

## Agent connection to a cluster

Agents can connect to a Sensu cluster by specifying any Sensu backend URL in the cluster in the [`backend-url` configuration flag][16].

For more information about clustering, read [Backend datastore configuration flags][35] and [Run a Sensu cluster][36].

## Keepalive monitoring

Sensu keepalives are the heartbeat mechanism used to ensure that all registered agents are operational and able to reach the [Sensu backend][2].
Sensu agents publish keepalive events containing [entity][3] configuration data to the Sensu backend according to the interval specified by the [`keepalive-interval`][4] configuration flag.

If a Sensu agent fails to send keepalive events over the period specified by the [`keepalive-critical-timeout`][4] configuration flag, the Sensu backend creates a keepalive **critical** alert in the Sensu web UI.
The `keepalive-critical-timeout` is set to `0` (disabled) by default to help ensure that it will not interfere with your `keepalive-warning-timeout` setting.

If a Sensu agent fails to send keepalive events over the period specified by the [`keepalive-warning-timeout`][58] configuration flag, the Sensu backend creates a keepalive **warning** alert in the Sensu web UI.
The value you specify for `keepalive-warning-timeout` must be lower than the value you specify for `keepalive-critical-timeout`.

{{% notice note %}}
**NOTE**: If you set the [deregister flag](#ephemeral-agent-configuration-flags) to `true`, when a Sensu agent process stops, the Sensu backend will deregister the corresponding entity.<br><br>
Deregistration prevents and clears alerts for failing keepalives for agent entities &mdash; the backend does not distinguish between intentional shutdown and failure.
As a result, if you set the deregister flag to `true` and an agent process stops for any reason, you will not receive alerts for keepalive events in the web UI.<br><br>
If you want to receive alerts for failing keepalives, set the [deregister](#ephemeral-agent-configuration-flags) configuration flag to `false`.
{{% /notice %}}

You can use keepalives to identify unhealthy systems and network partitions, send notifications, and trigger auto-remediation, among other useful actions.
In addition, the agent maps [`keepalive-critical-timeout`][4] and [`keepalive-warning-timeout`][58] values to certain event check attributes, so you can [create time-based event filters][57] to reduce alert fatigue for agent keepalive events.

{{% notice note %}}
**NOTE**: Automatic keepalive monitoring is not supported for [proxy entities](../../observe-entities/#proxy-entities) because they cannot run a Sensu agent.
Use the [core/v2/events API](../../../api/core/events/) to send manual keepalive events for proxy entities.
{{% /notice %}}

### Handle keepalive events

You can use a keepalive handler to connect keepalive events to your monitoring workflows.
Sensu looks for an [event handler][8] named `keepalive` and automatically uses it to process keepalive events.

Suppose you want to receive Slack notifications for keepalive alerts, and you already have a [Slack handler set up to process events][40].
To process keepalive events using the Slack handler, create a handler set named `keepalive` and add the `slack` handler to the `handlers` array.
The resulting `keepalive` handler set configuration looks like this:

{{< language-toggle >}}

{{< code yml >}}
---
type: Handler
api_version: core/v2
metadata:
  name: keepalive
spec:
  handlers:
  - slack
  type: set
{{< /code >}}

{{< code json >}}
{
  "type": "Handler",
  "api_version": "core/v2",
  "metadata" : {
    "name": "keepalive"
  },
  "spec": {
    "type": "set",
    "handlers": [
      "slack"
    ]
  }
}
{{< /code >}}

{{< /language-toggle >}}

You can also use the [`keepalive-handlers`][53] flag to send keepalive events to any handler you have configured.
If you do not specify a keepalive handler with the `keepalive-handlers` flag, the Sensu backend will use the default `keepalive` handler and create an event in sensuctl and the Sensu web UI.

## Create observability events using service checks

The Sensu backend coordinates check execution for you by comparing the subscriptions you specify in your checks and entities to determine which entities should receive execution requests for a given check.

Sensu uses the [publish/subscribe pattern of communication][15], which allows automated registration and deregistration of ephemeral systems.
At the core of this model are Sensu [subscriptions][28], which you specify in checks and entities to determine which entities should receive execution requests for a given check.
Subscriptions often correspond with the roles and responsibilities assigned to the entity, such as `webserver` or `database`.

Subscriptions determine which [checks][14] the agent will execute.
For an agent to execute a check, at least one [entity][3] must include a subscription that matches a subscription in the check definition.
Read the [subscriptions reference][28] for more information.

After receiving a check request from the Sensu backend, the agent:

1. Applies any [tokens][27] that match attribute values in the check definition.
2. Fetches [dynamic runtime assets][29] and stores them in its local cache.

    By default, agents cache dynamic runtime asset data at `/var/cache/sensu/sensu-agent` (Linux) or `C:\ProgramData\sensu\cache\sensu-agent` (Windows).
    To specify a different cache location, use the [`cache-dir`][30] configuration attribute.

3. Executes the [check command][14].
4. Executes any [hooks][31] specified by the check based on the exit status.
5. Creates an [event][7] that contains information about the applicable entity, check, and metric.

The Sensu backend then processes the event by applying event filters, mutators, and handlers.

### Proxy entities

Proxy entities allow Sensu to monitor external resources on systems or devices where a Sensu agent cannot be installed, like a network switch.

The [Sensu backend][2] stores proxy entity definitions (unlike agent entities, which the agent stores).
When the backend requests a check that includes a [`proxy_entity_name`][32], the agent includes the provided entity information in the observation data in events in place of the agent entity data.

Read the [entity reference][3] and [Monitor external resources][33] for more information about monitoring proxy entities.

## Create observability events using the agent API

The Sensu agent API allows external sources to send monitoring data to Sensu without requiring the external sources to know anything about Sensu's internal implementation.
The agent API listens on the address and port specified with the [API configuration attributes][18].

The agent API supports only unsecured HTTP requests (no HTTPS).
Requests for unknown endpoints will result in an `HTTP 404 Not Found` response.

### `/events` (POST)

The agent API provides HTTP POST access to publish [observability events][7] to the Sensu backend via the `/events` endpoint.

The agent places events created via the agent API `/events` endpoint into a queue stored on disk.
In case of a loss of connection with the backend or agent shutdown, the agent preserves queued event data.
When the connection is reestablished, the agent sends the queued events to the backend.

The agent API `/events` endpoint uses a configurable burst limit and rate limit for relaying events to the backend.
Read [API configuration flags](#api-configuration-flags) to configure the `events-burst-limit` and `events-rate-limit` flags.

#### Example POST request to events endpoint

The following example submits an HTTP POST request to the agent API `/events` endpoint.
The request creates an event for a check named `check-mysql-status` with the output `could not connect to mysql` and a status of `1` (warning).
The agent responds with an `HTTP 202 Accepted` response to indicate that the event has been added to the queue to be sent to the backend.

In this example, the event will be processed according to an `incident_alerts` [pipeline][63].

{{% notice note %}}
**NOTE**: For HTTP POST requests to the agent API `/events` endpoint, check-specific [spec attributes](../checks/#spec-attributes) are not required.
If you do want to include spec attributes, list them as individual [top-level attributes](../checks/#top-level-attributes) within the event's `check` scope.
{{% /notice %}}

{{< code shell >}}
curl -X POST \
-H 'Content-Type: application/json' \
-d '{
  "check": {
    "metadata": {
      "name": "check-mysql-status"
    },
    "status": 1,
    "output": "could not connect to mysql"
  },
  "pipelines": [
    {
      "api_version": "core/v2",
      "type": "Pipeline",
      "name": "incident_alerts"
    }
  ]
}' \
http://127.0.0.1:3031/events
{{< /code >}}

{{% notice protip %}}
**PRO TIP**: To use the agent API `/events` endpoint to create proxy entities, include a `proxy_entity_name` attribute within the `check` scope.
{{% /notice %}}

#### Detect silent failures

You can use the Sensu agent API in combination with the check [time-to-live (TTL) attribute][44] to detect silent failures.
This creates what's commonly referred to as a ["dead man's switch"][20].

With check TTLs, Sensu can set an expectation that a Sensu agent will publish additional events for a check within the period of time specified by the TTL attribute.
If a Sensu agent fails to publish an event before the check TTL expires, the Sensu backend creates an event with a status of `1` (warning) to indicate the expected event was not received.
For more information about check TTLs, read the [checks reference][44].

If you use the check TTL attribute along with the Sensu agent API to enable tasks that run outside of Sensu's check scheduling to emit events, these events create a dead man's switch: if the task fails for any reason, the lack of an "all clear" event from the task will notify operators of the silent failure, which might otherwise be missed.
If an external source sends an event with a check TTL to the Sensu agent API, Sensu expects another event from the same external source before the TTL expires.

Here's an example of external event input via the Sensu agent API that uses a check TTL to create a dead man's switch for MySQL backups.
Assume that a MySQL backup script runs periodically, and you expect the job to take a little less than 7 hours to complete.

- If the job completes successfully, you want a record of it, but you don't need to receive an alert.
- If the job fails or continues running longer than the expected 7 hours, you do need to receive an alert.

The script can send an event that tells the Sensu backend to expect an additional event with the same name within 7 hours of the first event:

{{< code shell >}}
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
{{< /code >}}

When the script submitted this initial event to the agent API, you recorded in the Sensu backend that your script started.
You also configured the dead man's switch by including the `ttl` attribute, so you'll receive an alert if the job fails or runs for too long.
Although it is possible for your script to handle errors gracefully and emit additional observability events, this approach allows you to worry less about handling every possible error case.
A lack of additional events before the 7-hour period elapses results in an alert.

If your backup script runs successfully, it can send an additional event without the TTL attribute, which removes the dead man's switch:

{{< code shell >}}
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
{{< /code >}}

Omitting the TTL attribute from this event also removes the dead man's switch being monitored by the Sensu backend.
This effectively sounds the "all clear" for this iteration of the task.

#### API specification {#events-post-specification}

/events (POST)     | 
-------------------|------
description        | Accepts JSON [event data][7] and passes the event to the Sensu backend event pipeline for processing.
example url        | http://hostname:3031/events
payload example    | {{< code json >}}{
  "check": {
    "metadata": {
      "name": "check-mysql-status"
    },
    "status": 1,
    "output": "could not connect to mysql"
  }
}{{< /code >}}
payload attributes | <ul>Required:<li>`check`: All check data must be within the `check` scope</li><li>`metadata`: The `check` scope must contain a `metadata` scope</li><li>`name`: The `metadata` scope must contain the `name` attribute with a string that represents the name of the monitoring check</li></ul><ul>Optional:<li>Any other attributes supported by the [Sensu check specification][14]</li></ul>
response codes     | <ul><li>**Success**: 202 (Accepted)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

### `/healthz` (GET)

The agent API `/healthz` endpoint provides HTTP GET access to the status of the Sensu agent via the agent API.

#### Example {#healthz-get-example}

In the following example, an HTTP GET request is submitted to the agent API `/healthz` endpoint:

{{< code shell >}}
curl http://127.0.0.1:3031/healthz
{{< /code >}}

The request results in a healthy response:

{{< code text >}}
ok
{{< /code >}}

#### API specification {#healthz-get-specification}

/healthz (GET) | 
----------------|------
description     | Returns the agent status:<br>- `ok` if the agent is active and connected to a Sensu backend.<br>- `sensu backend unavailable` if the agent cannot connect to a backend.
example url     | http://hostname:3031/healthz

## Create observability events using the StatsD listener

Sensu agents include a listener to send [StatsD][21] metrics to the event pipeline.
By default, Sensu agents listen on UDP socket 8125 for messages that follow the [StatsD line protocol][21] and send metric events for handling by the Sensu backend.

For example, you can use the [Netcat][19] utility to send metrics to the StatsD listener:

{{< code shell >}}
echo 'abc.def.g:10|c' | nc -w1 -u localhost 8125
{{< /code >}}

Sensu does not store metrics received through the StatsD listener, so it's important to configure [event handlers][8].

### StatsD line protocol

The Sensu StatsD listener accepts messages that are formatted according to the StatsD line protocol:

{{< code shell >}}
<metricname>:<value>|<type>
{{< /code >}}

For more information about StatsD, read the [StatsD documentation][21].

### Configure the StatsD listener

To configure the StatsD listener, specify the [`statsd-event-handlers`][22] configuration flag in the [agent configuration][24] and start the agent.
For example, to start an agent that sends StatsD metrics to InfluxDB, run:

{{< code shell >}}
sensu-agent --statsd-event-handlers influx-db
{{< /code >}}

Use the [StatsD configuration flags][22] to change the default settings for the StatsD listener address, port, and [flush interval][23].
For example, to start an agent with a customized address and flush interval, run:

{{< code shell >}}
sensu-agent --statsd-event-handlers influx-db --statsd-flush-interval 1 --statsd-metrics-host 123.4.5.11 --statsd-metrics-port 8125
{{< /code >}}

## Create observability events using the agent TCP and UDP sockets

{{% notice note %}}
**NOTE**: The agent TCP and UDP sockets are deprecated in favor of the [agent API](#create-observability-events-using-the-agent-api).
{{% /notice %}}

Sensu agents listen for external monitoring data using TCP and UDP sockets.
The agent sockets accept JSON event data and pass events to the Sensu backend event pipeline for processing.
The TCP and UDP sockets listen on the address and port specified by the [socket configuration flags][17].

### Use the TCP socket

This example demonstrates external monitoring data input via the Sensu agent TCP socket.
The example uses Bash's built-in `/dev/tcp` file to communicate with the Sensu agent socket:

{{< code shell >}}
echo '{"name": "check-mysql-status", "status": 1, "output": "error!"}' > /dev/tcp/localhost/3030
{{< /code >}}

You can also use the [Netcat][19] utility to send monitoring data to the agent socket:

{{< code shell >}}
echo '{"name": "check-mysql-status", "status": 1, "output": "error!"}' | nc localhost 3030
{{< /code >}}

### Use the UDP socket

This example demonstrates external monitoring data input via the Sensu agent UDP socket.
The example uses Bash's built-in `/dev/udp` file to communicate with the Sensu agent socket:

{{< code shell >}}
echo '{"name": "check-mysql-status", "status": 1, "output": "error!"}' > /dev/udp/127.0.0.1/3030
{{< /code >}}

You can also use the [Netcat][19] utility to send monitoring data to the agent socket:

{{< code shell >}}
echo '{"name": "check-mysql-status", "status": 1, "output": "error!"}' | nc -u -v 127.0.0.1 3030
{{< /code >}}

### Socket event format

The agent TCP and UDP sockets use a special event data format designed for backward compatibility with Sensu Core 1.x check results.
Attributes specified in socket events appear in the resulting event data passed to the Sensu backend.

**Example socket input: Minimum required attributes**

{{< code json >}}
{
  "name": "check-mysql-status",
  "status": 1,
  "output": "error!"
}
{{< /code >}}

**Example socket input: All attributes**

{{< code json >}}
{
  "name": "check-http",
  "status": 1,
  "output": "404",
  "source": "sensu-docs-site",
  "executed": 1550013435,
  "duration": 1.903135228,
  "handlers": ["slack", "influxdb"]
}
{{< /code >}}

### Socket event specification

{{% notice note %}}
**NOTE**: The Sensu agent socket ignores any attributes that are not included in this specification.
{{% /notice %}}

name         | 
-------------|------
description  | Check name.
required     | true
type         | String
example      | {{< code json >}}{
  "name": "check-mysql-status"
}{{< /code >}}

status       | 
-------------|------
description  | Check execution exit status code. An exit status code of `0` (zero) indicates `OK`, `1` indicates `WARNING`, and `2` indicates `CRITICAL`. Exit status codes other than `0`, `1`, and `2` indicate an `UNKNOWN` or custom status.
required     | true
type         | Integer
example      | {{< code json >}}{
  "status": 0
}{{< /code >}}

output       | 
-------------|------
description  | Output produced by the check `command`.
required     | true
type         | String
example      | {{< code json >}}{
  "output": "CheckHttp OK: 200, 78572 bytes"
}{{< /code >}}

source       | 
-------------|------
description  | Name of the Sensu entity associated with the event. Use this attribute to tie the event to a proxy entity. If no matching entity exists, Sensu creates a proxy entity with the name provided by the `source` attribute.
required     | false
default      | The agent entity that receives the event data.
type         | String
example      | {{< code json >}}{
  "source": "sensu-docs-site"
}{{< /code >}}

client       | 
-------------|------
description  | Name of the Sensu entity associated with the event. Use this attribute to tie the event to a proxy entity. If no matching entity exists, Sensu creates a proxy entity with the name provided by the `client` attribute. {{% notice note %}}
**NOTE**: The `client` attribute is deprecated in favor of the `source` attribute.
{{% /notice %}}
required     | false
default      | The agent entity that receives the event data.
type         | String
example      | {{< code json >}}{
  "client": "sensu-docs-site"
}{{< /code >}}

executed     | 
-------------|------
description  | Time at which the check was executed. In seconds since the Unix epoch.
required     | false
default      | The time the event was received by the agent.
type         | Integer
example      | {{< code json >}}{
  "executed": 1458934742
}{{< /code >}}

duration     | 
-------------|------
description  | Amount of time it took to execute the check. In seconds.
required     | false
type         | Float
example      | {{< code json >}}{
  "duration": 1.903135228
}{{< /code >}}

command      | 
-------------|------
description  | Command executed to produce the event. Use the `command` attribute to add context to the event data. Sensu does not execute the command included in this attribute.
required     | false
type         | String
example      | {{< code json >}}{
  "command": "http-check --url https://sensu.io"
}{{< /code >}}

interval     | 
-------------|------
description  | Interval used to produce the event. Use the `interval` attribute to add context to the event data. Sensu does not act on the value provided in this attribute.
required     | false
default      | `1`
type         | Integer
example      | {{< code json >}}{
  "interval": 60
}{{< /code >}}

handlers     | 
-------------|------
description  | Array of Sensu handler names to use for handling the event. Each handler name in the array must be a string.
required     | false
type         | Array
example      | {{< code json >}}{
  "handlers": ["slack", "influxdb"]
}{{< /code >}}

## Registration, endpoint management, and service discovery

Sensu agents automatically discover and register infrastructure components and the services running on them.
When an agent process stops, the Sensu backend can automatically create and process a deregistration event for the agent entities.

In practice, agent registration happens when a Sensu backend processes an agent keepalive event for an agent that is not already registered in the Sensu agent registry (based on the configured agent `name`).
The [Sensu backend][2] stores this agent registry, and it is accessible via [`sensuctl entity list`][6].

All Sensu agent data provided in keepalive events gets stored in the agent registry and used to add context to Sensu [events][7] and detect Sensu agents in an unhealthy state.

### Registration events

If a [Sensu event handler][8] named `registration` is configured, the [Sensu backend][2] creates and processes an [event][7] for agent registration, applying any configured [filters][9] and [mutators][10] before executing the configured [handler][8].

{{% notice protip %}}
**PRO TIP**: Use a [handler set](../../observe-process/handlers#handler-sets) to execute multiple handlers in response to registration events.
{{% /notice %}}

You can use registration events to execute one-time handlers for new Sensu agents.
For example, you can use registration event handlers to update external [configuration management databases (CMDBs)][11] such as [ServiceNow][12].

The handlers reference includes an [example registration event handler][41].

{{% notice warning %}}
**WARNING**: Registration events are not stored in the event registry, so they are not accessible via the Sensu API.
However, all registration events are logged in the [Sensu backend log](../backend/#event-logging).
{{% /notice %}}

### Deregistration events

As with registration events, the Sensu backend can create and process a deregistration event when the Sensu agent process stops.
You can use deregistration events to trigger a handler that updates external CMDBs or performs an action to update ephemeral infrastructures.
To enable deregistration events, use the [`deregister` flag][13], and specify the event handler using the [`deregistration-handler` flag][13].
You can specify a deregistration handler per agent using the [`deregistration-handler` agent flag][13] or by setting a default for all agents using the [`deregistration-handler` backend configuration flag][37].

{{% notice note %}}
**NOTE**: Deregistration is supported for [agent entities](../../observe-entities/#agent-entities) that have sent at least one keepalive.
Deregistration is **not** supported for [proxy entities](../../observe-entities/#proxy-entities), which do not send keepalives, and the backend does not automatically create and process deregistration events for proxy entities.
{{% /notice %}}

## Configuration via flags

For Linux agents, customize the agent configuration with `sensu-agent start` command line flags or in a `.yml` file.
The default agent configuration file path for Linux is `/etc/sensu/agent.yml`.
Configuration via command line flags overrides attributes specified in a configuration file.
Read [Create overrides][68] to learn more.

For Windows agents, customize the agent configuration in a `.yml` file.
The default agent configuration file path for Windows is `C:\ProgramData\sensu\config\agent.yml.example`.

Review the [example Sensu agent configuration file][5] for a complete list of flags and default values.
The agent loads configuration upon startup, so you must restart the agent for any configuration updates to take effect.

### Agent configuration flag summary

{{% notice note %}}
**NOTE**: Process discovery is disabled in this version of Sensu.
The `--discover-processes` flag is not available, and new events will not include data in the `processes` attributes.
Instead, the field will be empty: `"processes": null`.
{{% /notice %}}

To view configuration information for the sensu-agent start command, run:

{{< code shell >}}
sensu-agent start --help
{{< /code >}}

The response will list command information and configuration flags for sensu-agent start:

{{< code text >}}
start the sensu agent

Usage:
  sensu-agent start [flags]

Flags:
      --agent-managed-entity                manage this entity via the agent
      --allow-list string                   path to agent execution allow list configuration file
      --annotations stringToString          entity annotations map (default [])
      --api-host string                     address to bind the Sensu client HTTP API to (default "127.0.0.1")
      --api-port int                        port the Sensu client HTTP API listens on (default 3031)
      --assets-burst-limit int              asset fetch burst limit (default 100)
      --assets-rate-limit float             maximum number of assets fetched per second
      --backend-handshake-timeout int       number of seconds the agent should wait when negotiating a new WebSocket connection (default 15)
      --backend-heartbeat-interval int      interval at which the agent should send heartbeats to the backend (default 30)
      --backend-heartbeat-timeout int       number of seconds the agent should wait for a response to a hearbeat (default 45)
      --backend-url strings                 comma-delimited list of ws/wss URLs of Sensu backend servers. This flag can also be invoked multiple times (default [ws://127.0.0.1:8081])
      --cache-dir string                    path to store cached data (default "/var/cache/sensu/sensu-agent")
      --cert-file string                    certificate for TLS authentication
  -c, --config-file string                  path to sensu-agent config file (default "/etc/sensu/agent.yml")
      --deregister                          ephemeral agent
      --deregistration-handler string       deregistration handler that should process the entity deregistration event
      --detect-cloud-provider               enable cloud provider detection
      --disable-api                         disable the Agent HTTP API
      --disable-assets                      disable check assets on this agent
      --disable-sockets                     disable the Agent TCP and UDP event sockets
      --discover-processes                  indicates whether process discovery should be enabled
      --events-burst-limit int              /events api burst limit (default 10)
      --events-rate-limit float             maximum number of events transmitted to the backend through the /events api
  -h, --help                                help for start
      --insecure-skip-tls-verify            skip TLS verification (not recommended!)
      --keepalive-critical-timeout uint32   number of seconds until agent is considered dead by backend to create a critical event
      --keepalive-handlers strings          comma-delimited list of keepalive handlers for this entity. This flag can also be invoked multiple times
      --keepalive-interval int              number of seconds to send between keepalive events (default 20)
      --keepalive-warning-timeout uint32    number of seconds until agent is considered dead by backend to create a warning event (default 120)
      --key-file string                     key for TLS authentication
      --labels stringToString               entity labels map (default [])
      --log-level string                    logging level [panic, fatal, error, warn, info, debug] (default "info")
      --name string                         agent name (defaults to hostname) (default "my_hostname")
      --namespace string                    agent namespace (default "default")
      --password string                     agent password (default "P@ssw0rd!")
      --redact strings                      comma-delimited list of fields to redact, overwrites the default fields. This flag can also be invoked multiple times (default [password,passwd,pass,api_key,api_token,access_key,secret_key,private_key,secret])
      --require-fips                        indicates whether fips support should be required in openssl
      --require-openssl                     indicates whether openssl should be required instead of go's built-in crypto
      --retry-max                           maximum amount of time to wait before retrying an agent connection to the backend
      --retry-min                           minimum amount of time to wait before retrying an agent connection to the backend
      --retry-multiplier                    value multiplied with the current retry delay to produce a longer retry delay (bounded by --retry-max)
      --socket-host string                  address to bind the Sensu client socket to (default "127.0.0.1")
      --socket-port int                     port the Sensu client socket listens on (default 3030)
      --statsd-disable                      disables the statsd listener and metrics server
      --statsd-event-handlers strings       comma-delimited list of event handlers for statsd metrics. This flag can also be invoked multiple times
      --statsd-flush-interval int           number of seconds between statsd flush (default 10)
      --statsd-metrics-host string          address used for the statsd metrics server (default "127.0.0.1")
      --statsd-metrics-port int             port used for the statsd metrics server (default 8125)
      --subscriptions strings               comma-delimited list of agent subscriptions. This flag can also be invoked multiple times
      --trusted-ca-file string              TLS CA certificate bundle in PEM format
      --user string                         agent user (default "agent")
{{< /code >}}

### General configuration flags

{{% notice note %}}
**NOTE**: Docker-only Sensu binds to the hostnames of containers, represented here as `SENSU_HOSTNAME` in Docker default values.
{{% /notice %}}

<a id="agent-managed-entity"></a>

| agent-managed-entity |      |
-------------|------
description  | Indicates whether the agent's entity solely managed by the agent rather than the backend API. Agent-managed entity definitions will include the label `sensu.io/managed_by: sensu-agent`, and you cannot update these agent-managed entities via the Sensu backend REST API.
required     | false
type         | Boolean
default      | false
environment variable | `SENSU_AGENT_MANAGED_ENTITY`
command line example   | {{< code shell >}}
sensu-agent start --agent-managed-entity{{< /code >}}
/etc/sensu/agent.yml example | {{< code shell >}}
agent-managed-entity: true{{< /code >}}

<a id="allow-list"></a>

| allow-list |      |
------------------|------
description       | Path to yaml or json file that contains the allow list of check or hook commands the agent can execute. Read [allow list configuration commands][49] and the [example allow list configuration][48] for information about building a configuration file.
type              | String
default           | `""`
environment variable | `SENSU_ALLOW_LIST`
command line example   | {{< code shell >}}
sensu-agent start --allow-list /etc/sensu/check-allow-list.yaml{{< /code >}}
/etc/sensu/agent.yml example | {{< code shell >}}
allow-list: /etc/sensu/check-allow-list.yaml{{< /code >}}

| annotations|      |
-------------|------
description  | Non-identifying metadata to include with event data that you can access with [event filters][9] and [tokens][27]. You can use annotations to add data that is meaningful to people or external tools that interact with Sensu.<br><br>In contrast to labels, you cannot use annotations in [API response filtering][25], [sensuctl response filtering][26], or [web UI view filtering][54].{{% notice note %}}
**NOTE**: For annotations that you define in agent.yml, the keys are automatically modified to use all lower-case letters. For example, if you define the annotation `webhookURL: "https://my-webhook.com"` in agent.yml, it will be listed as `webhookurl: "https://my-webhook.com"` in entity definitions.<br><br>Key cases are **not** modified for annotations you define with the `--annotations` command line flag or the `SENSU_ANNOTATIONS` environment variable.
{{% /notice %}}
required     | false
type         | Map of key-value pairs. Keys and values can be any valid UTF-8 string.
default      | `null`
environment variable | `SENSU_ANNOTATIONS`
command line example   | {{< code shell >}}
sensu-agent start --annotations sensu.io/plugins/slack/config/webhook-url=https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX
sensu-agent start --annotations example-key="example value" --annotations example-key2="example value"
{{< /code >}}
/etc/sensu/agent.yml example | {{< code shell >}}
annotations:
  sensu.io/plugins/slack/config/webhook-url: "https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX"
{{< /code >}}

| assets-burst-limit   |      |
--------------|------
description   | Maximum amount of burst allowed in a rate interval when fetching dynamic runtime assets.
type          | Integer
default       | `100`
environment variable | `SENSU_ASSETS_BURST_LIMIT`
command line example   | {{< code shell >}}
sensu-agent start --assets-burst-limit 100{{< /code >}}
/etc/sensu/agent.yml example | {{< code shell >}}
assets-burst-limit: 100{{< /code >}}

| assets-rate-limit   |      |
--------------|------
description   | Maximum number of dynamic runtime assets to fetch per second. The default value `1.39` is equivalent to approximately 5000 user-to-server requests per hour.
type          | Float
default       | `1.39`
environment variable | `SENSU_ASSETS_RATE_LIMIT`
command line example   | {{< code shell >}}
sensu-agent start --assets-rate-limit 1.39{{< /code >}}
/etc/sensu/agent.yml example | {{< code shell >}}
assets-rate-limit: 1.39{{< /code >}}

<a id="backend-handshake-timeout"></a>

| backend-handshake-timeout |      |
----------------------------|------
description   | Number of seconds the Sensu agent should wait when negotiating a new WebSocket connection.
type          | Integer
default       | `15`
environment variable | `SENSU_BACKEND_HANDSHAKE_TIMEOUT`
command line example   | {{< code shell >}}
sensu-agent start --backend-handshake-timeout 20{{< /code >}}
/etc/sensu/agent.yml example | {{< code shell >}}
backend-handshake-timeout: 20{{< /code >}}

<a id="backend-heartbeat-interval"></a>

| backend-heartbeat-interval |      |
-----------------------------|------
description   | Interval at which the agent should send heartbeats to the Sensu backend. In seconds.
type          | Integer
default       | `30`
environment variable | `SENSU_BACKEND_HEARTBEAT_INTERVAL`
command line example   | {{< code shell >}}
sensu-agent start --backend-heartbeat-interval 45{{< /code >}}
/etc/sensu/agent.yml example | {{< code shell >}}
backend-heartbeat-interval: 45{{< /code >}}

<a id="backend-heartbeat-timeout"></a>

| backend-heartbeat-timeout |      |
----------------------------|------
description   | Number of seconds the agent should wait for a response to a hearbeat from the Sensu backend.
type          | Integer
default       | `45`
environment variable | `SENSU_BACKEND_HEARTBEAT_TIMEOUT`
command line example   | {{< code shell >}}
sensu-agent start --backend-heartbeat-timeout 60{{< /code >}}
/etc/sensu/agent.yml example | {{< code shell >}}
backend-heartbeat-timeout: 60{{< /code >}}

| backend-url |      |
--------------|------
description   | ws or wss URL of the Sensu backend server. To specify multiple backends with `sensu-agent start`, use this flag multiple times. {{% notice note %}}
**NOTE**: If you do not specify a port for your backend-url values, the agent will automatically append the default backend port (8081).
{{% /notice %}}
type          | List
default       | `ws://127.0.0.1:8081`(CentOS/RHEL, Debian, and Ubuntu)<br><br>`$SENSU_HOSTNAME:8080` (Docker)
environment variable | `SENSU_BACKEND_URL`
command line example | {{< language-toggle >}}
{{< code shell "ws" >}}
sensu-agent start --backend-url ws://127.0.0.1:8081
sensu-agent start --backend-url ws://127.0.0.1:8081 --backend-url ws://127.0.0.1:8082
{{< /code >}}
{{< code shell "wss" >}}
sensu-agent start --backend-url wss://127.0.0.1:8081
sensu-agent start --backend-url wss://127.0.0.1:8081 --backend-url wss://127.0.0.1:8082
{{< /code >}}
{{< /language-toggle >}}
/etc/sensu/agent.yml example | {{< language-toggle >}}
{{< code shell "ws" >}}
backend-url:
  - "ws://127.0.0.1:8081"
  - "ws://127.0.0.1:8082"
{{< /code >}}
{{< code shell "wss" >}}
backend-url:
  - "wss://127.0.0.1:8081"
  - "wss://127.0.0.1:8082"
{{< /code >}}
{{< /language-toggle >}}

<a id="cache-dir"></a>

| cache-dir   |      |
--------------|------
description   | Path to store cached data.
type          | String
default       | <ul><li>Linux: `/var/cache/sensu/sensu-agent`</li><li>Windows: `C:\ProgramData\sensu\cache\sensu-agent`</li></ul>
environment variable | `SENSU_CACHE_DIR`
command line example   | {{< code shell >}}
sensu-agent start --cache-dir /cache/sensu-agent{{< /code >}}
/etc/sensu/agent.yml example | {{< code shell >}}
cache-dir: "/cache/sensu-agent"{{< /code >}}

<a id="config-file"></a>

| config-file |      |
--------------|------
description   | Path to Sensu agent configuration file.
type          | String
default       | <ul><li>Linux: `/etc/sensu/agent.yml`</li><li>FreeBSD: `/usr/local/etc/sensu/agent.yml`</li><li>Windows: `C:\ProgramData\sensu\config\agent.yml`</li></ul>
environment variable | `SENSU_CONFIG_FILE`
command line example   | {{< code shell >}}
sensu-agent start --config-file /sensu/agent.yml
sensu-agent start -c /sensu/agent.yml
{{< /code >}}

<a id="disable-assets"></a>

| disable-assets |      |
--------------|------
description   | When set to `true`, disables [dynamic runtime assets][29] for the agent. If an agent attempts to execute a check that requires a dynamic runtime asset, the agent will respond with a status of `3` and a message that indicates the agent could not execute the check because assets are disabled.
type          | Boolean
default       | false
environment variable | `SENSU_DISABLE_ASSETS`
command line example   | {{< code shell >}}
sensu-agent start --disable-assets{{< /code >}}
/etc/sensu/agent.yml example | {{< code shell >}}
disable-assets: true{{< /code >}}

<a id="discover-processes"></a>

| discover-processes |      |
--------------|------
description   | When set to `true`, the agent populates the `processes` field in `entity.system` and updates every 20 seconds.{{% notice commercial %}}
**COMMERCIAL FEATURE**: Access the discover-processes flag in the packaged Sensu Go distribution. For more information, read [Get started with commercial features](../../../commercial/).
{{% /notice %}}{{% notice note %}}
**NOTE**: Process discovery is disabled in this version of Sensu. The discover-processes flag is not available, and new events will not include data in the `processes` attributes. Instead, the field will be empty: `"processes": null`.
{{% /notice %}}
type          | Boolean
default       | false
environment variable | `SENSU_DISCOVER_PROCESSES`
command line example   | {{< code shell >}}
sensu-agent start --discover-processes{{< /code >}}
/etc/sensu/agent.yml example | {{< code shell >}}
discover-processes: true{{< /code >}}

| labels     |      |
-------------|------
description  | Custom attributes to include with event data that you can use for response and web UI view filtering.<br><br>If you include labels in your event data, you can filter [API responses][25], [sensuctl responses][26], and [web UI views][54] based on them. In other words, labels allow you to create meaningful groupings for your data.<br><br>Limit labels to metadata you need to use for response filtering. For complex, non-identifying metadata that you will *not* need to use in response filtering, use annotations rather than labels.{{% notice note %}}
**NOTE**: For labels that you define in agent.yml, the keys are automatically modified to use all lower-case letters. For example, if you define the label `proxyType: "website"` in agent.yml, it will be listed as `proxytype: "website"` in entity definitions.<br><br>Key cases are **not** modified for labels you define with the `--labels` command line flag or the `SENSU_LABELS` environment variable.
{{% /notice %}}
required     | false
type         | Map of key-value pairs. Keys can contain only letters, numbers, and underscores and must start with a letter. Values can be any valid UTF-8 string.
default      | `null`
environment variable | `SENSU_LABELS`
command line example   | {{< code shell >}}
sensu-agent start --labels proxy_type=website
sensu-agent start --labels example_key1="example value" example_key2="example value"
{{< /code >}}
/etc/sensu/agent.yml example | {{< code shell >}}
labels:
  proxy_type: website
{{< /code >}}

<a id="log-level"></a>

| log-level   |      |
--------------|------
description   | Logging level: `panic`, `fatal`, `error`, `warn`, `info`, or `debug`.
type          | String
default       | `warn`
environment variable | `SENSU_LOG_LEVEL`
command line example   | {{< code shell >}}
sensu-agent start --log-level debug{{< /code >}}
/etc/sensu/agent.yml example | {{< code shell >}}
log-level: debug{{< /code >}}

<a id="name-attribute"></a>

| name        |      |
--------------|------
description   | Entity name assigned to the agent entity.
type          | String
default       | Defaults to hostname (for example, `sensu-centos`).
environment variable | `SENSU_NAME`
command line example   | {{< code shell >}}
sensu-agent start --name agent-01{{< /code >}}
/etc/sensu/agent.yml example | {{< code shell >}}
name: "agent-01"{{< /code >}}

<a id="retry-max"></a>

| retry-max   |      |
--------------|------
description   | Maximum amount of time to wait before retrying an agent connection to the backend. In milliseconds (`ms`), seconds (`s`), minutes (`m`), or hours (`h`).
type          | String
default       | `120s`
environment variable | `SENSU_RETRY_MAX`
command line example   | {{< code shell >}}
sensu-agent start --retry-max 120s{{< /code >}}
/etc/sensu/agent.yml example | {{< code shell >}}
retry-max: 120s{{< /code >}}

<a id="retry-min"></a>

| retry-min   |      |
--------------|------
description   | Minimum amount of time to wait before retrying an agent connection to the backend. Multiplied with the [retry-multiplier][62] value at each retry. In milliseconds (`ms`), seconds (`s`), minutes (`m`), or hours (`h`).
type          | String
default       | `1s`
environment variable | `SENSU_RETRY_MIN`
command line example   | {{< code shell >}}
sensu-agent start --retry-min 1s{{< /code >}}
/etc/sensu/agent.yml example | {{< code shell >}}
retry-min: 1s{{< /code >}}

<a id="retry-multiplier"></a>

| retry-multiplier |      |
--------------|------
description   | Value to multiply with the current [retry-min][61] delay to produce longer delays at each retry for exponential backoff.{{% notice note %}}
**NOTE**: The maximum retry delay cannot not exceed the [retry-max](#retry-max) value.
{{% /notice %}}
type          | Float
default       | `2.0`
environment variable | `SENSU_RETRY_MULTIPLIER`
command line example   | {{< code shell >}}
sensu-agent start --retry-multiplier 2.0{{< /code >}}
/etc/sensu/agent.yml example | {{< code shell >}}
retry-multiplier: 2.0{{< /code >}}

<a id="subscriptions-flag"></a>

| subscriptions |      |
----------------|------
description     | Array of agent subscriptions that determine which monitoring checks the agent will execute. The subscriptions array items must be strings.
type            | List
environment variable | `SENSU_SUBSCRIPTIONS`
command line example   | {{< code shell >}}
sensu-agent start --subscriptions disk-checks,process-checks
sensu-agent start --subscriptions disk-checks --subscriptions process-checks
{{< /code >}}
/etc/sensu/agent.yml example | {{< code shell >}}
subscriptions:
  - disk-checks
  - process-checks
{{< /code >}}

### API configuration flags

| api-host    |      |
--------------|------
description   | Bind address for the Sensu agent HTTP API.
type          | String
default       | `127.0.0.1`
environment variable | `SENSU_API_HOST`
command line example   | {{< code shell >}}
sensu-agent start --api-host 127.0.0.1{{< /code >}}
/etc/sensu/agent.yml example | {{< code shell >}}
api-host: "127.0.0.1"{{< /code >}}

| api-port    |      |
--------------|------
description   | Listening port for the Sensu agent HTTP API.
type          | Integer
default       | `3031`
environment variable | `SENSU_API_PORT`
command line example   | {{< code shell >}}
sensu-agent start --api-port 3031{{< /code >}}
/etc/sensu/agent.yml example | {{< code shell >}}
api-port: 3031{{< /code >}}

| disable-api |      |
--------------|------
description   | `true` to disable the agent HTTP API. Otherwise, `false`.
type          | Boolean
default       | `false`
environment variable | `SENSU_DISABLE_API`
command line example   | {{< code shell >}}
sensu-agent start --disable-api{{< /code >}}
/etc/sensu/agent.yml example | {{< code shell >}}
disable-api: true{{< /code >}}

| events-burst-limit | |
--------------|------
description   | Maximum amount of burst allowed in a rate interval for the [agent events API][51].
type          | Integer
default       | `10`
environment variable | `SENSU_EVENTS_BURST_LIMIT`
command line example   | {{< code shell >}}
sensu-agent start --events-burst-limit 20{{< /code >}}
/etc/sensu/agent.yml example | {{< code shell >}}
events-burst-limit: 20{{< /code >}}

| events-rate-limit | |
--------------|------
description   | Maximum number of events per second that can be transmitted to the backend with the [agent events API][51].
type          | Float
default       | `10.0`
environment variable | `SENSU_EVENTS_RATE_LIMIT`
command line example   | {{< code shell >}}
sensu-agent start --events-rate-limit 20.0{{< /code >}}
/etc/sensu/agent.yml example | {{< code shell >}}
events-rate-limit: 20.0{{< /code >}}

### Ephemeral agent configuration flags

| deregister  |      |
--------------|------
description   | `true` if a deregistration event should be created upon Sensu agent process stop. Otherwise, `false`.<br>{{% notice note %}}
**NOTE**: To receive alerts for failing [keepalives](#keepalive-monitoring), set to `false`.
{{% /notice %}}
type          | Boolean
default       | `false`
environment variable | `SENSU_DEREGISTER`
command line example   | {{< code shell >}}
sensu-agent start --deregister{{< /code >}}
/etc/sensu/agent.yml example | {{< code shell >}}
deregister: true{{< /code >}}

| deregistration-handler |      |
-------------------------|------
description              | Name of the event handler to use when processing the agent's deregistration events. This flag overrides any handlers applied by the [`deregistration-handler` backend configuration flag][37].
type                     | String
environment variable     | `SENSU_DEREGISTRATION_HANDLER`
command line example   | {{< code shell >}}
sensu-agent start --deregistration-handler deregister{{< /code >}}
/etc/sensu/agent.yml example | {{< code shell >}}
deregistration-handler: deregister{{< /code >}}

<a id="detect-cloud-provider-flag"></a>

| detect-cloud-provider  |      |
-------------------------|------
description              | `true` to enable cloud provider detection mechanisms. Otherwise, `false`. When this flag is enabled, the agent will attempt to read files, resolve hostnames, and make HTTP requests to determine what cloud environment it is running in.
type                     | Boolean
default                  | `false`
environment variable     | `SENSU_DETECT_CLOUD_PROVIDER`
command line example   | {{< code shell >}}
sensu-agent start --detect-cloud-provider false{{< /code >}}
/etc/sensu/agent.yml example | {{< code shell >}}
detect-cloud-provider: false{{< /code >}}

### Keepalive configuration flags

| keepalive-critical-timeout |      |
--------------------|------
description         | Number of seconds after a missing keepalive event until the agent is considered unresponsive by the Sensu backend to create a critical event. Set to disabled (`0`) by default. If the value is not `0`, it must be greater than or equal to `5`.<br>{{% notice note %}}**NOTE**: The agent maps the `keepalive-critical-timeout` value to the [`event.check.ttl` attribute](../../observe-events/events/#check-attribute) when keepalive events are generated for the Sensu backend to process. The `event.check.ttl` attribute is useful for [creating time-based event filters](../../observe-filter/filters#filter-to-reduce-alert-fatigue-for-keepalive-events) to reduce alert fatigue for agent keepalive events.
{{% /notice %}}
type                | Integer
default             | `0`
environment variable   | `SENSU_KEEPALIVE_CRITICAL_TIMEOUT`
command line example   | {{< code shell >}}
sensu-agent start --keepalive-critical-timeout 300{{< /code >}}
/etc/sensu/agent.yml example | {{< code shell >}}
keepalive-critical-timeout: 300{{< /code >}}

<a id="keepalive-handlers-flag"></a>

| keepalive-handlers |      |
--------------------|------
description         | [Keepalive event handlers][52] to use for the entity, specified in a comma-delimited list. You can specify any configured handler and invoke the `keepalive-handlers` flag multiple times. If keepalive handlers are not specified, the Sensu backend will use the default `keepalive` handler and create an event in sensuctl and the Sensu web UI.
type                | List
default             | `keepalive`
environment variable   | `SENSU_KEEPALIVE_HANDLERS`
command line example   | {{< code shell >}}
sensu-agent start --keepalive-handlers slack,email{{< /code >}}
/etc/sensu/agent.yml example | {{< code shell >}}
keepalive-handlers:
- slack
- email
{{< /code >}}

| keepalive-interval |      |
---------------------|------
description          | Number of seconds between keepalive events.
type                 | Integer
default              | `20`
environment variable   | `SENSU_KEEPALIVE_INTERNAL`
command line example   | {{< code shell >}}
sensu-agent start --keepalive-interval 30{{< /code >}}
/etc/sensu/agent.yml example | {{< code shell >}}
keepalive-interval: 30{{< /code >}}

<a id="keepalive-warning-timeout-flag"></a>

| keepalive-warning-timeout |      |
--------------------|------
description         | Number of seconds after a missing keepalive event until the agent is considered unresponsive by the Sensu backend to create a warning event. Value must be lower than the `keepalive-critical-timeout` value. Minimum value is `5`.<br>{{% notice note %}}**NOTE**: The agent maps the `keepalive-warning-timeout` value to the [`event.check.timeout` attribute](../../observe-events/events/#check-attribute) when keepalive events are generated for the Sensu backend to process. The `event.check.timeout` attribute is useful for [creating time-based event filters](../../observe-filter/filters#filter-to-reduce-alert-fatigue-for-keepalive-events) to reduce alert fatigue for agent keepalive events.
{{% /notice %}}
type                | Integer
default             | `120`
environment variable   | `SENSU_KEEPALIVE_WARNING_TIMEOUT`
command line example   | {{< code shell >}}
sensu-agent start --keepalive-warning-timeout 300{{< /code >}}
/etc/sensu/agent.yml example | {{< code shell >}}
keepalive-warning-timeout: 300{{< /code >}}

### Security configuration flags

| cert-file  |      |
-------------|------
description  | Path to the agent certificate file used in mTLS authentication. Sensu supports certificate bundles (or chains) as long as the agent (or leaf) certificate is the *first* certificate in the bundle.
type         | String
default      | `""`
environment variable | `SENSU_CERT_FILE`
command line example   | {{< code shell >}}
sensu-agent start --cert-file /path/to/tls/agent.pem{{< /code >}}
/etc/sensu/agent.yml example | {{< code shell >}}
cert-file: "/path/to/tls/agent.pem"{{< /code >}}

| insecure-skip-tls-verify |      |
---------------------------|------
description                | Skip SSL verification. {{% notice warning %}}
**WARNING**: This configuration flag is intended for use in development systems only. Do not use this flag in production.
{{% /notice %}}
type                       | Boolean
default                    | `false`
environment variable       | `SENSU_INSECURE_SKIP_TLS_VERIFY`
command line example   | {{< code shell >}}
sensu-agent start --insecure-skip-tls-verify{{< /code >}}
/etc/sensu/agent.yml example | {{< code shell >}}
insecure-skip-tls-verify: true{{< /code >}}

| key-file   |      |
-------------|------
description  | Path to the agent key file used in mTLS authentication.
type         | String
default      | `""`
environment variable | `SENSU_KEY_FILE`
command line example   | {{< code shell >}}
sensu-agent start --key-file /path/to/tls/agent-key.pem{{< /code >}}
/etc/sensu/agent.yml example | {{< code shell >}}
key-file: "/path/to/tls/agent-key.pem"{{< /code >}}

| namespace |      |
---------------|------
description    | Agent namespace. {{% notice note %}}
**NOTE**: Agents are represented in the backend as a class of entity.
Entities can only belong to a [single namespace](../../../operations/control-access/rbac/#namespaced-resource-types).
{{% /notice %}}
type           | String
default        | `default`
environment variable   | `SENSU_NAMESPACE`
command line example   | {{< code shell >}}
sensu-agent start --namespace ops{{< /code >}}
/etc/sensu/agent.yml example | {{< code shell >}}
namespace: ops{{< /code >}}

| password    |      |
--------------|------
description   | [Sensu RBAC password][39] used by the agent.
type          | String
default       | `P@ssw0rd!`
environment variable   | `SENSU_PASSWORD`
command line example   | {{< code shell >}}
sensu-agent start --password secure-password{{< /code >}}
/etc/sensu/agent.yml example | {{< code shell >}}
password: secure-password{{< /code >}}

| redact      |      |
--------------|------
description   | List of fields to redact when displaying the entity. {{% notice note %}}
**NOTE**: Redacted secrets are sent via the WebSocket connection and stored in etcd.
They are not logged or displayed via the Sensu API.
{{% /notice %}}
type          | List
default       | By default, Sensu redacts the following fields: `password`, `passwd`, `pass`, `api_key`, `api_token`, `access_key`, `secret_key`, `private_key`, `secret`.
environment variable   | `SENSU_REDACT`
command line example   | {{< code shell >}}
sensu-agent start --redact secret,ec2_access_key{{< /code >}}
/etc/sensu/agent.yml example | {{< code shell >}}
redact:
  - secret
  - ec2_access_key
{{< /code >}}

<a id="fips-openssl"></a>

| require-fips |      |
------------------|------
description       | Require Federal Information Processing Standard (FIPS) support in OpenSSL. Logs an error at Sensu agent startup if `true` but OpenSSL is not running in FIPS mode. {{% notice note %}}
**NOTE**: The `--require-fips` flag is only available within the Linux amd64 OpenSSL-linked binary.
[Contact Sensu](https://sensu.io/contact) to request the builds for OpenSSL with FIPS support.
{{% /notice %}}
type              | Boolean
default           | false
environment variable | `SENSU_REQUIRE_FIPS`
command line example   | {{< code shell >}}
sensu-agent start --require-fips{{< /code >}}
/etc/sensu/agent.yml example | {{< code shell >}}
require-fips: true{{< /code >}}

| require-openssl |      |
------------------|------
description       | Use OpenSSL instead of Go's standard cryptography library. Logs an error at Sensu agent startup if `true` but Go's standard cryptography library is loaded. {{% notice note %}}
**NOTE**: The `--require-openssl` flag is only available within the Linux amd64 OpenSSL-linked binary.
[Contact Sensu](https://sensu.io/contact) to request the builds for OpenSSL with FIPS support.
{{% /notice %}}
type              | Boolean
default           | false
environment variable | `SENSU_REQUIRE_OPENSSL`
command line example   | {{< code shell >}}
sensu-agent start --require-openssl{{< /code >}}
/etc/sensu/agent.yml example | {{< code shell >}}
require-openssl: true{{< /code >}}

| trusted-ca-file |      |
------------------|------
description       | SSL/TLS certificate authority.
type              | String
default           | `""`
environment variable   | `SENSU_TRUSTED_CA_FILE`
command line example   | {{< code shell >}}
sensu-agent start --trusted-ca-file /path/to/tls/ca.pem{{< /code >}}
/etc/sensu/agent.yml example | {{< code shell >}}
trusted-ca-file: "/path/to/tls/ca.pem"{{< /code >}}

| user |      |
--------------|------
description   | [Sensu RBAC username][39] used by the agent. Agents require get, list, create, update, and delete permissions for events across all namespaces.
type          | String
default       | `agent`
environment variable   | `SENSU_USER`
command line example   | {{< code shell >}}
sensu-agent start --user agent-01{{< /code >}}
/etc/sensu/agent.yml example | {{< code shell >}}
user: "agent-01"{{< /code >}}

### Socket configuration flags

| disable-sockets |      |
------------------|------
description       | `true` to disable the agent TCP and UDP event sockets. Othewise, `false`.
type              | Boolean
default           | `false`
environment variable   | `SENSU_DISABLE_SOCKETS`
command line example   | {{< code shell >}}
sensu-agent start --disable-sockets{{< /code >}}
/etc/sensu/agent.yml example | {{< code shell >}}
disable-sockets: true{{< /code >}}

| socket-host |      |
--------------|------
description   | Address to bind the Sensu agent socket to.
type          | String
default       | `127.0.0.1`
environment variable   | `SENSU_SOCKET_HOST`
command line example   | {{< code shell >}}
sensu-agent start --socket-host 127.0.0.1{{< /code >}}
/etc/sensu/agent.yml example | {{< code shell >}}
socket-host: "127.0.0.1"{{< /code >}}

| socket-port |      |
--------------|------
description   | Port the Sensu agent socket listens on.
type          | Integer
default       | `3030`
environment variable   | `SENSU_SOCKET_PORT`
command line example   | {{< code shell >}}
sensu-agent start --socket-port 3030{{< /code >}}
/etc/sensu/agent.yml example | {{< code shell >}}
socket-port: 3030{{< /code >}}

### StatsD configuration flags

| statsd-disable |      |
-----------------|------
description      | `true` to disable the [StatsD][21] listener and metrics server. Otherwise, `false`.
type             | Boolean
default          | `false`
environment variable   | `SENSU_STATSD_DISABLE`
command line example   | {{< code shell >}}
sensu-agent start --statsd-disable{{< /code >}}
/etc/sensu/agent.yml example | {{< code shell >}}
statsd-disable: true{{< /code >}}

| statsd-event-handlers |      |
------------------------|------
description             | List of event handlers for StatsD metrics.
type                    | List
environment variable    | `SENSU_STATSD_EVENT_HANDLERS`
command line example   | {{< code shell >}}
sensu-agent start --statsd-event-handlers influxdb,opentsdb
sensu-agent start --statsd-event-handlers influxdb --statsd-event-handlers opentsdb
{{< /code >}}
/etc/sensu/agent.yml example | {{< code shell >}}
statsd-event-handlers:
  - influxdb
  - opentsdb
{{< /code >}}

| statsd-flush-interval  |      |
-------------------------|------
description              | Number of seconds between [StatsD flushes][23].
type                     | Integer
default                  | `10`
environment variable     | `SENSU_STATSD_FLUSH_INTERVAL`
command line example   | {{< code shell >}}
sensu-agent start --statsd-flush-interval 30{{< /code >}}
/etc/sensu/agent.yml example | {{< code shell >}}
statsd-flush-interval: 30{{< /code >}}

| statsd-metrics-host |      |
----------------------|------
description           | Address used for the StatsD metrics server.
type                  | String
default               | `127.0.0.1`
environment variable   | `SENSU_STATSD_METRICS_HOST`
command line example   | {{< code shell >}}
sensu-agent start --statsd-metrics-host 127.0.0.1{{< /code >}}
/etc/sensu/agent.yml example | {{< code shell >}}
statsd-metrics-host: "127.0.0.1"{{< /code >}}

| statsd-metrics-port |      |
----------------------|------
description           | Port used for the StatsD metrics server.
type                  | Integer
default               | `8125`
environment variable   | `SENSU_STATSD_METRICS_PORT`
command line example   | {{< code shell >}}
sensu-agent start --statsd-metrics-port 8125{{< /code >}}
/etc/sensu/agent.yml example | {{< code shell >}}
statsd-metrics-port: 8125{{< /code >}}

### Allow list configuration commands

The allow list includes check and hook commands the agent can execute.
Use the [allow-list flag][56] to specify the path to the yaml or json file that contains your allow list.

Use these commands to build your allow list configuration file.

| args |      |
----------------------|------
description           | Arguments for the `exec` command.
required              | true
type                  | Array
example               | {{< language-toggle >}}
{{< code yml >}}
args:
- foo
{{< /code >}}
{{< code json >}}
{
  "args": ["foo"]
}
{{< /code >}}
{{< /language-toggle >}}

| enable_env |      |
----------------------|------
description           | `true` to enable environment variables. Otherwise, `false`.
required              | false
type                  | Boolean
example               | {{< language-toggle >}}
{{< code yml >}}
enable_env: true
{{< /code >}}
{{< code json >}}
{
  "enable_env": true
}
{{< /code >}}
{{< /language-toggle >}}

| exec |      |
----------------------|------
description           | Command to allow the Sensu agent to run as a check or a hook.
required              | true
type                  | String
example               | {{< language-toggle >}}
{{< code yml >}}
exec: "/usr/local/bin/check_memory.sh"
{{< /code >}}
{{< code json >}}
{
  "exec": "/usr/local/bin/check_memory.sh"
}
{{< /code >}}
{{< /language-toggle >}}

| sha512 |      |
----------------------|------
description           | Checksum of the check or hook executable.
required              | false
type                  | String
example               | {{< language-toggle >}}
{{< code yml >}}
sha512: 4f926bf4328...
{{< /code >}}
{{< code json >}}
{
  "sha512": "4f926bf4328..."
}
{{< /code >}}
{{< /language-toggle >}}

#### Example allow list configuration

{{< language-toggle >}}

{{< code yml >}}
- exec: /usr/local/bin/check_memory.sh
  args:
  - ""
  sha512: 736ac120323772543fd3a08ee54afdd54d214e58c280707b63ce652424313ef9084ca5b247d226aa09be8f831034ff4991bfb95553291c8b3dc32cad034b4706
  enable_env: true
  foo: bar
- exec: /usr/local/bin/show_process_table.sh
  args:
  - ""
  sha512: 28d61f303136b16d20742268a896bde194cc99342e02cdffc1c2186f81c5adc53f8550635156bebeed7d87a0c19a7d4b7a690f1a337cc4737e240b62b827f78a
- exec: echo-asset.sh
  args:
  - "foo"
  sha512: cce3d16e5881ba829f271df778f9014f7c3659917f7acfd7a60a91bfcabb472eea72f9781194d310388ba046c21790364ad0308a5a897cde50022195ba90924b
{{< /code >}}

{{< code json >}}
[
  {
    "exec": "/usr/local/bin/check_memory.sh",
    "args": [
      ""
    ],
    "sha512": "736ac120323772543fd3a08ee54afdd54d214e58c280707b63ce652424313ef9084ca5b247d226aa09be8f831034ff4991bfb95553291c8b3dc32cad034b4706",
    "enable_env": true,
    "foo": "bar"
  },
  {
    "exec": "/usr/local/bin/show_process_table.sh",
    "args": [
      ""
    ],
    "sha512": "28d61f303136b16d20742268a896bde194cc99342e02cdffc1c2186f81c5adc53f8550635156bebeed7d87a0c19a7d4b7a690f1a337cc4737e240b62b827f78a"
  },
  {
    "exec": "echo-asset.sh",
    "args": [
      "foo"
    ],
    "sha512": "cce3d16e5881ba829f271df778f9014f7c3659917f7acfd7a60a91bfcabb472eea72f9781194d310388ba046c21790364ad0308a5a897cde50022195ba90924b"
  }
]
{{< /code >}}

{{< /language-toggle >}}

## Configuration via environment variables

Instead of using configuration flags, you can use environment variables to configure your Sensu agent.
Each agent configuration flag has an associated environment variable.
You can also create your own environment variables, as long as you name them correctly and save them in the correct place.
Here's how.

1. Create the files from which the `sensu-agent` service configured by our supported packages will read environment variables:

     {{< language-toggle >}}
     
{{< code shell "Ubuntu/Debian" >}}
sudo touch /etc/default/sensu-agent
{{< /code >}}

{{< code shell "RHEL/CentOS" >}}
sudo touch /etc/sysconfig/sensu-agent
{{< /code >}}

{{< code shell "Windows" >}}
# By default, the agent loads configuration from %ALLUSERSPROFILE%\sensu\config\agent.yml.
# If you did not change the location for the configuration file during installation,
# the sensu-agent configuration file path is:

C:\ProgramData\sensu\config\agent.yml
{{< /code >}}
     
     {{< /language-toggle >}}

2. Make sure the environment variable is named correctly.
All environment variables that control Sensu agent configuration begin with `SENSU_`.

     To rename a configuration flag you wish to specify as an environment variable, prepend `SENSU_`, convert dashes to underscores, and capitalize all letters.
     For example, the environment variable for the flag `api-host` is `SENSU_API_HOST`.

     For a custom environment variable, you do not have to prepend `SENSU`.
     For example, `TEST_VAR_1` is a valid custom environment variable name.

3. Add the environment variable to the environment file.

     In this example, the `api-host` flag is configured as an environment variable and set to `"0.0.0.0"`:
     
     {{< language-toggle >}}

{{< code shell "Ubuntu/Debian" >}}
echo 'SENSU_API_HOST="0.0.0.0"' | sudo tee -a /etc/default/sensu-agent
{{< /code >}}

{{< code shell "RHEL/CentOS" >}}
echo 'SENSU_API_HOST="0.0.0.0"' | sudo tee -a /etc/sysconfig/sensu-agent
{{< /code >}}

{{< code shell "Windows" >}}
# Save the following environment variable in the configuration file
# at C:\ProgramData\sensu\config\agent.yml:

SENSU_API_HOST="0.0.0.0"
{{< /code >}}

     {{< /language-toggle >}}

4. Restart the sensu-agent service so these settings can take effect:

     {{< language-toggle >}}

{{< code shell "Ubuntu/Debian" >}}
sudo systemctl restart sensu-agent
{{< /code >}}

{{< code shell "RHEL/CentOS" >}}
sudo systemctl restart sensu-agent
{{< /code >}}

{{< code shell "Windows" >}}
sc.exe start SensuAgent
{{< /code >}}

     {{< /language-toggle >}}

{{% notice note %}}
**NOTE**: Sensu includes an environment variable for each agent configuration flag.
They are listed in the [configuration flag description tables](#general-configuration-flags).
{{% /notice %}}

### Format for label and annotation environment variables

To use labels and annotations as environment variables in your check and plugin configurations, you must use a specific format when you create the environment variables.

For example, to create the labels `"region": "us-east-1"` and `"type": "website"` as an environment variable:

{{< language-toggle >}}

{{< code shell "Ubuntu/Debian" >}}
echo 'SENSU_LABELS='{"region": "us-east-1", "type": "website"}'' | sudo tee -a /etc/default/sensu-agent
{{< /code >}}

{{< code shell "RHEL/CentOS" >}}
echo 'SENSU_LABELS='{"region": "us-east-1", "type": "website"}'' | sudo tee -a /etc/sysconfig/sensu-agent
{{< /code >}}

{{< /language-toggle >}}

To create the annotations `"maintainer": "Team A"` and `"webhook-url": "https://hooks.slack.com/services/T0000/B00000/XXXXX"` as an environment variable:

{{< language-toggle >}}

{{< code shell "Ubuntu/Debian" >}}
echo 'SENSU_ANNOTATIONS='{"maintainer": "Team A", "webhook-url": "https://hooks.slack.com/services/T0000/B00000/XXXXX"}'' | sudo tee -a /etc/default/sensu-agent
{{< /code >}}

{{< code shell "RHEL/CentOS" >}}
echo 'SENSU_ANNOTATIONS='{"maintainer": "Team A", "webhook-url": "https://hooks.slack.com/services/T0000/B00000/XXXXX"}'' | sudo tee -a /etc/sysconfig/sensu-agent
{{< /code >}}

{{< /language-toggle >}}

### Use environment variables with the Sensu agent

Any environment variables you create in `/etc/default/sensu-agent` (Debian/Ubuntu) or `/etc/sysconfig/sensu-agent` (RHEL/CentOS) will be available to check and hook commands executed by the Sensu agent.
This includes your checks and plugins.

For example, if you create a custom environment variable `TEST_VARIABLE` in your sensu-agent file, it will be available to use in your check and hook configurations as `$TEST_VARIABLE`.

The following check example demonstrates how to use a `TEST_GITHUB_TOKEN` environment variable (set to the token value in the sensu-agent file) in the check command to run a script that pings the GitHub API:

{{< language-toggle >}}

{{< code yml >}}
---
type: CheckConfig
api_version: core/v2
metadata:
  name: ping-github-api
spec:
  command: ping-github-api.sh $TEST_GITHUB_TOKEN
  handlers:
  - slack
  interval: 10
  publish: true
  subscriptions:
  - system
{{< /code >}}

{{< code json >}}
{
  "type": "CheckConfig",
  "api_version": "core/v2",
  "metadata": {
    "name": "ping-github-api"
  },
  "spec": {
    "command": "ping-github-api.sh $TEST_GITHUB_TOKEN",
    "handlers": [
      "slack"
    ],
    "interval": 10,
    "publish": true,
    "subscriptions": [
      "system"
    ]
  }
}
{{< /code >}}

{{< /language-toggle >}}

### Use environment variables to specify an HTTP proxy for agent use

If an HTTP proxy is required to access the internet in your compute environment, you may need to configure the Sensu agent to successfully download dynamic runtime assets or execute commands that depend on internet access.

For Sensu agents that require a proxy server, define `HTTP_PROXY` and `HTTPS_PROXY` environment variables in your sensu-agent file.

{{< code shell >}}
HTTP_PROXY="http://YOUR_PROXY_SERVER:PORT"
HTTPS_PROXY="http://YOUR_PROXY_SERVER:PORT"
{{< /code >}}

You can use the same proxy server URL for `HTTP_PROXY` and `HTTPS_PROXY`.
The proxy server URL you specify for `HTTPS_PROXY` does not need to use `https://`.

After you add the `HTTP_PROXY` and `HTTPS_PROXY` environment variables and restart sensu-agent, they will be available to check and hook commands executed by the Sensu agent.
You can then use `HTTP_PROXY` and `HTTPS_PROXY` to add dynamic runtime assets, run checks, and complete other tasks that typically require an internet connection for your unconnected entities.

{{% notice note %}}
**NOTE**: If you define the `HTTP_PROXY` and `HTTPS_PROXY` environment variables, the agent WebSocket connection will also use the proxy URL you specify.
{{% /notice %}}

## Create overrides

Sensu has default settings and limits for certain configuration attributes, like the default log level.
Depending on your environment and preferences, you may want to create overrides for these Sensu-specific defaults and limits.

You can create overrides in several ways:

- Command line configuration flag arguments for `sensu-agent start`.
- Environment variables in `/etc/default/sensu-agent` (Debian/Ubuntu) or `/etc/sysconfig/sensu-agent` (RHEL/CentOS).
- Configuration settings in the agent.yml config file.

{{% notice note %}}
**NOTE**: We do not recommend editing the systemd unit file to create overrides.
Future package upgrades can overwrite changes in the systemd unit file.
{{% /notice %}}

Sensu applies the following precedence to override settings:

1. Arguments passed to the Sensu agent via command line configuration flags.
2. Environment variables in `/etc/default/sensu-agent` (Debian/Ubuntu) or `/etc/sysconfig/sensu-agent` (RHEL/CentOS).
3. Configuration in the agent.yml config file.

For example, if you create overrides using all three methods, the command line configuration flag values will take precedence over the values you specify in `/etc/default/sensu-agent` or `/etc/sysconfig/sensu-agent` or the agent.yml config file.

### Example override: Log level

The default [log level][60] for the Sensu agent is `warn`.

To override the default and automatically apply a different log level for the agent, add the `--log-level` command line configuration flag when you start the Sensu agent.
For example, to specify `debug` as the log level:

{{< code shell >}}
sensu-agent start --log-level debug
{{< /code >}}

To configure an environment variable for the desired agent log level:

{{< language-toggle >}}

{{< code shell "Ubuntu/Debian" >}}
echo 'SENSU_LOG_LEVEL=debug' | sudo tee -a /etc/default/sensu-agent
{{< /code >}}

{{< code shell "RHEL/CentOS" >}}
echo 'SENSU_LOG_LEVEL=debug' | sudo tee -a /etc/sysconfig/sensu-agent
{{< /code >}}

{{< /language-toggle >}}

To configure the desired log level in the config file, add this line to agent.yml:

{{< code shell >}}
log-level: debug
{{< /code >}}

## Service management

### Start the service

Use the `sensu-agent` tool to start the agent and apply configuration flags.

{{< platformBlock "Linux" >}}

**Linux**

Start the agent with [configuration flags][24]:

{{< code shell >}}
sensu-agent start --subscriptions disk-checks --log-level debug
{{< /code >}}

View available configuration flags and defaults:

{{< code shell >}}
sensu-agent start --help
{{< /code >}}

Start the agent using a service manager:

{{< code shell >}}
sudo systemctl start sensu-agent
{{< /code >}}

If you do not provide any configuration flags, the agent loads configuration from the location specified by the `config-file` attribute (default is `/etc/sensu/agent.yml`).

{{< platformBlockClose >}}

{{< platformBlock "Windows" >}}

**Windows**

Run the following command as the admin user to install and start the agent:

{{< code shell >}}
sensu-agent service install
{{< /code >}}

By default, the agent loads configuration from `%ALLUSERSPROFILE%\sensu\config\agent.yml` (for example, `C:\ProgramData\sensu\config\agent.yml`) and stores service logs to `%ALLUSERSPROFILE%\sensu\log\sensu-agent.log` (for example, `C:\ProgramData\sensu\log\sensu-agent.log`).

Configure the configuration file and log file locations using the `config-file` and `log-file` flags:

{{< code shell >}}
sensu-agent service install --config-file 'C:\\ProgramData\\sensu\\config\\agent.yml' --log-file 'C:\\ProgramData\\sensu\\log\\sensu-agent.log'
{{< /code >}}

{{< platformBlockClose >}}

### Stop the service

Stop the agent service using a service manager:

{{< language-toggle >}}

{{< code shell "Linux" >}}
sudo systemctl stop sensu-agent
{{< /code >}}

{{< code shell "Windows" >}}
sc.exe stop SensuAgent
{{< /code >}}

{{< /language-toggle >}}

### Restart the service

Restart the agent using a service manager:

{{< language-toggle >}}

{{< code shell "Linux" >}}
sudo systemctl restart sensu-agent
{{< /code >}}

{{< code shell "Windows" >}}
sc.exe start SensuAgent
{{< /code >}}

{{< /language-toggle >}}

You must restart the agent to implement any configuration updates.

### Enable on boot

Enable the agent to start on system boot:

{{< language-toggle >}}

{{< code shell "Linux" >}}
sudo systemctl enable sensu-agent
{{< /code >}}

{{< code shell "Windows" >}}
The service is configured to start automatically on boot by default.
{{< /code >}}

{{< /language-toggle >}}

{{% notice note %}}
**NOTE**: On older distributions of Linux, use `sudo chkconfig sensu-agent on` to enable the agent.
{{% /notice %}}

### Disable on boot

Disable the agent from starting on system boot:

{{< language-toggle >}}

{{< code shell "Linux" >}}
sudo systemctl disable sensu-agent
{{< /code >}}

{{< code shell "Windows" >}}
The service is configured to start automatically on boot by default.
{{< /code >}}

{{< /language-toggle >}}

{{% notice note %}}
**NOTE**: On older distributions of Linux, use `sudo chkconfig sensu-agent off` to disable the agent.
{{% /notice %}}

### Get service status

View the status of the agent service using a service manager:

{{< language-toggle >}}

{{< code shell "Linux" >}}
sudo systemctl status sensu-agent
{{< /code >}}

{{< code shell "Windows" >}}
sc.exe query SensuAgent
{{< /code >}}

{{< /language-toggle >}}

### Get service version

Get the version of the current `sensu-agent` tool:

{{< code shell >}}
sensu-agent version
{{< /code >}}

Get the version of the running `sensu-agent` service:

{{< code shell >}}
curl http://127.0.0.1:3031/version
{{< /code >}}

### Uninstall the service

Uninstall the sensu-agent service:

{{< language-toggle >}}

{{< code shell "Linux" >}}
sudo systemctl stop sensu-agent
{{< /code >}}

{{< code shell "Windows" >}}
sensu-agent service uninstall
{{< /code >}}

{{< /language-toggle >}}

### Get help

The `sensu-agent` tool provides general and command-specific help flags.

View sensu-agent commands:

{{< code shell >}}
sensu-agent help
{{< /code >}}

List options for a specific command (in this case, `sensu-agent start`): 

{{< code shell >}}
sensu-agent start --help
{{< /code >}}


[1]: ../../../operations/deploy-sensu/install-sensu#install-sensu-agents
[2]: ../backend/
[3]: ../../observe-entities/entities/
[4]: #keepalive-configuration-flags
[5]: ../../../files/windows/agent.yml
[6]: ../../../sensuctl/
[7]: ../../observe-events/events/
[8]: ../../observe-process/handlers/
[9]: ../../observe-filter/filters/
[10]: ../../observe-transform/mutators/
[11]: https://en.wikipedia.org/wiki/Configuration_management_database
[12]: https://www.servicenow.com/products/it-operations-management.html
[13]: #ephemeral-agent-configuration-flags
[14]: ../checks/
[15]: https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern
[16]: #general-configuration-flags
[17]: #socket-configuration-flags
[18]: #api-configuration-flags
[19]: https://sourceforge.net/projects/netcat/
[20]: https://en.wikipedia.org/wiki/Dead_man%27s_switch
[21]: https://github.com/etsy/statsd
[22]: #statsd-configuration-flags
[23]: https://github.com/statsd/statsd#key-concepts
[24]: #configuration-via-flags
[25]: ../../../api/#response-filtering
[26]: ../../../sensuctl/filter-responses/
[27]: ../tokens/
[28]: ../subscriptions/
[29]: ../../../plugins/assets/
[30]: #cache-dir
[31]: ../hooks/
[32]: ../checks/#proxy-entity-name-attribute
[33]: ../../observe-entities/monitor-external-resources/
[34]: #backend-heartbeat-interval
[35]: ../backend#datastore-and-cluster-configuration-flags
[36]: ../../../operations/deploy-sensu/cluster-sensu/
[37]: ../backend#general-configuration-flags
[38]: #name
[39]: ../../../operations/control-access/rbac/
[40]: ../../observe-process/send-slack-alerts/
[41]: ../../observe-process/handlers/#send-registration-events
[42]: #backend-heartbeat-timeout
[43]: #backend-handshake-timeout
[44]: ../checks#ttl-attribute
[45]: https://en.m.wikipedia.org/wiki/WebSocket
[46]: ../../../operations/deploy-sensu/secure-sensu/
[47]: https://en.m.wikipedia.org/wiki/Protocol_Buffers
[48]: #example-allow-list-configuration
[49]: #allow-list-configuration-commands
[50]: #configuration-via-environment-variables
[51]: #events-post-specification
[52]: ../../observe-process/handlers/#keepalive-event-handlers
[53]: #keepalive-handlers-flag
[54]: ../../../web-ui/search#search-for-labels
[56]: #allow-list
[57]: ../../observe-filter/filters#filter-to-reduce-alert-fatigue-for-keepalive-events
[58]: #keepalive-warning-timeout-flag
[59]: ../../../operations/control-access/#use-built-in-basic-authentication
[60]: #log-level
[61]: #retry-min
[62]: #retry-multiplier
[68]: #create-overrides
