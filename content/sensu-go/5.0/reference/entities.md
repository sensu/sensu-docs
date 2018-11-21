---
title: "Entities"
description: "The entities reference guide."
weight: 1
version: "5.0"
product: "Sensu Go"
platformContent: false 
menu:
  sensu-go-5.0:
    parent: reference
---

- [Entities specification](#entities-specification)
	- [Entity Attributes](#entity-attributes)
	- [System Attributes](#system-attributes)
	- [Network Attributes](#network-attributes)
	- [NetworkInterface Attributes](#networkinterface-attributes)
	- [Deregistration Attributes](#deregistration-attributes)
- [Examples](#examples)

## How do entities work?

Agent entities are monitoring agents, which are installed and run on every system that needs to be monitored. The entity is responsible for registering the system with the Sensu backend service, sending keepalive messages (the Sensu heartbeat mechanism), and executing monitoring checks. Each entity is a member of one or more `subscriptions` – a list of roles and/or responsibilities assigned to the agent entity (ex: a webserver or a database). Sensu entities will "subscribe" to (or watch for) check requests published by the Sensu server (via the Sensu Transport), execute the corresponding requests locally, and publish the results of the check back to the transport (to be processed by a Sensu server).

## Proxy Entities

Proxy entities (formerly known as proxy clients, "Just-in-time" or "JIT" clients) are dynamically created entities, added to the entity store if an entity does not already exist for a check result. Proxy entity registration differs from keepalive-based registration because the registration event happens while processing a check result (not a keepalive message). Sensu proxy entities allow Sensu to monitor external resources on systems and/or devices where a sensu-agent cannot be installed (such a network switch) using the defined check ProxyEntityName to create a proxy entity for the external resource. Once created, proxy entities work much in the same way as any other Sensu entity.

## New and improved entities

An `entity`, formally known as a `client` in Sensu 1.x, represents anything (ex: server, container, network switch) that needs to be monitored. Sensu Go uses an updated data model that allows for it to acknowledge the full range of infrastructure, runtime and application types that compose a complete monitoring environment (from server hardware to "serverless" functions). Sensu no longer focuses on the object doing the monitoring and instead focuses on the object it monitors. We call these monitored parts of an infrastructure "entities." An entity not only provides context to event data (what/where the event is from) but an event's uniqueness is determined by the check name and the ID of the entity upon which the check ran. In addition, an entity can contain system information such as the hostname, OS, platform, and version. 

## Entities specification

### Entity Attributes

|metadata    |      |
-------------|------
description  | Collection of metadata about the entity, including the `name` and `namespace` as well as custom `labels` and `annotations`. See the [metadata attributes reference][8] for details.
required     | true
type         | Map of key-value pairs
example      | {{< highlight shell >}}"metadata": {
  "name": "webserver01",
  "namespace": "default",
  "labels": {
    "region": "us-west-1"
  },
  "annotations": {
    "slack-channel" : "#monitoring"
  }
}{{< /highlight >}}

entity_class |     |
-------------|------ 
description  | The entity type, validated with go regex [`\A[\w\.\-]+\z`](https://regex101.com/r/zo9mQU/2). This value is not user configurable; it is set directly by the agent. An entity that runs an agent will be of `agent`, while a proxy entity will have class `proxy`.
required     | true
type         | string 
example      | {{< highlight shell >}}"entity_class": "agent"{{< /highlight >}}

subscriptions| 
-------------|------ 
description  | A list of subscription names for the entity. The entity by default has an entity-specific subscription, in the format of `entity:{name}` where `name` is the entity's hostname.
required     | false 
type         | array 
default      | The entity-specific subscription.
example      | {{< highlight shell >}}"subscriptions": ["web", "prod", "entity:example-entity"]{{< /highlight >}}

system       | 
-------------|------ 
description  | System information about the entity, such as operating system and platform.
required     | false 
type         | [System][1] 
example      | {{< highlight json >}}
{
  "system": {
    "hostname": "example-hostname",
    "os": "linux",
    "platform": "ubuntu",
    "platform_family": "debian",
    "platform_version": "16.04",
    "network": {
      "interfaces": [
        {
          "name": "lo",
          "addresses": [
            "127.0.0.1/8",
            "::1/128"
          ]
        },
        {
          "name": "eth0",
          "mac": "52:54:00:20:1b:3c",
          "addresses": [
            "93.184.216.34/24",
            "2606:2800:220:1:248:1893:25c8:1946/10"
          ]
        }
      ]
    },
    "arch": "amd64"
  }
}{{< /highlight >}}

last_seen    | 
-------------|------ 
description  | Timestamp the entity was last seen, in epoch time. 
required     | false 
type         | integer 
example      | {{< highlight shell >}}"last_seen": 1522798317 {{< /highlight >}}


deregister   | 
-------------|------ 
description  | If the entity should be removed when it stops sending keepalive messages. 
required     | false 
type         | boolean 
default      | false
example      | {{< highlight shell >}}"deregister": false {{< /highlight >}}

deregistration  | 
-------------|------ 
description  | A map containing a handler name, for use when an entity is deregistered. 
required     | false 
type         | [Deregistration][2] 
example      | {{< highlight json >}}
{
  "deregistration": {
    "handler": "email-handler"
  }
}{{< /highlight >}}

keepalive_timeout  | 
-------------|------ 
description  | The time in seconds until an entity keepalive is considered stale. 
required     | false 
type         | integer 
default      | 120
example      | {{< highlight shell >}}"keepalive_timeout": 120 {{< /highlight >}}

redact       | 
-------------|------ 
description  | List of items to redact from log messages. If a value is provided, it overwrites the default list of items to be redacted.
required     | false 
type         | array 
default      | ["password", "passwd", "pass", "api_key", "api_token", "access_key", "secret_key", "private_key", "secret"]
example      | {{< highlight json >}}
{
  "redact": [
    "extra_secret_tokens"
  ]
}{{< /highlight >}}

### Metadata attributes

| name       |      |
-------------|------
description  | The unique name of the entity, validated with Go regex `\A[\w\.\-]+\z`.
required     | true
type         | String
example      | {{< highlight shell >}}"name": "example-hostname"{{< /highlight >}}

| namespace  |      |
-------------|------
description  | The [Sensu RBAC namespace][5] that this entity belongs to.
required     | false
type         | String
default      | `default`
example      | {{< highlight shell >}}"namespace": "production"{{< /highlight >}}

| labels     |      |
-------------|------
description  | Custom attributes to include with event data, which can be queried like regular attributes. You can use labels to organize entities into meaningful collections that can be selected using [filters][6] and [tokens][7].
required     | false
type         | Map of key-value pairs. Keys and values can be any valid UTF-8 string.
default      | `null`
example      | {{< highlight shell >}}"labels": {
  "environment": "development",
  "region": "us-west-2"
}{{< /highlight >}}

| annotations |     |
-------------|------
description  | Arbitrary, non-identifying metadata to include with event data. In contrast to labels, annotations are _not_ used internally by Sensu and cannot be used to identify entities. You can use annotations to add data that helps people or external tools interacting with Sensu.
required     | false
type         | Map of key-value pairs. Keys and values can be any valid UTF-8 string.
default      | `null`
example      | {{< highlight shell >}} "annotations": {
  "managed-by": "ops",
  "slack-channel": "#monitoring",
  "playbook": "www.example.url"
}{{< /highlight >}}

### System Attributes

hostname     | 
-------------|------ 
description  | The hostname of the entity. 
required     | false 
type         | string 
example      | {{< highlight shell >}}"hostname": "example-hostname" {{< /highlight >}}

os           | 
-------------|------ 
description  | The entity's operating system. 
required     | false 
type         | string 
example      | {{< highlight shell >}}"os": "linux" {{< /highlight >}}

platform     | 
-------------|------ 
description  | The entity's operating system distribution. 
required     | false 
type         | string 
example      | {{< highlight shell >}}"platform": "ubuntu" {{< /highlight >}}

platform_family     | 
-------------|------ 
description  | The entity's operating system family. 
required     | false 
type         | string 
example      | {{< highlight shell >}}"platform_family": "debian" {{< /highlight >}}

platform_version     | 
-------------|------ 
description  | The entity's operating system version. 
required     | false 
type         | string 
example      | {{< highlight shell >}}"platform_version": "16.04" {{< /highlight >}}

network     | 
-------------|------ 
description  | The entity's network interface list. 
required     | false 
type         | [Network][3] 
example      | {{< highlight json >}}
{
  "network": {
    "interfaces": [
      {
        "name": "lo",
        "addresses": [
          "127.0.0.1/8",
          "::1/128"
        ]
      },
      {
        "name": "eth0",
        "mac": "52:54:00:20:1b:3c",
        "addresses": [
          "93.184.216.34/24",
          "2606:2800:220:1:248:1893:25c8:1946/10"
        ]
      }
    ]
  }
}{{< /highlight >}}

arch         | 
-------------|------ 
description  | The entity's system architecture. This value is determined by the Go binary architecture, as a function of runtime.GOARCH. An `amd` system running a `386` binary will report the arch as `386`.
required     | false 
type         | string 
example      | {{< highlight shell >}}"arch": "amd64" {{< /highlight >}}

### Network Attributes

network_interface         | 
-------------|------ 
description  | The list of network interfaces available on the entity, with their associated MAC and IP addresses. 
required     | false 
type         | array [NetworkInterface][4] 
example      | {{< highlight json >}}
{
  "interfaces": [
    {
      "name": "lo",
      "addresses": [
        "127.0.0.1/8",
        "::1/128"
      ]
    },
    {
      "name": "eth0",
      "mac": "52:54:00:20:1b:3c",
      "addresses": [
        "93.184.216.34/24",
        "2606:2800:220:1:248:1893:25c8:1946/10"
      ]
    }
  ]
}{{< /highlight >}}

### NetworkInterface Attributes

name         | 
-------------|------ 
description  | The network interface name.
required     | false 
type         | string 
example      | {{< highlight shell >}}"name": "eth0"{{< /highlight >}}

mac          | 
-------------|------ 
description  | The network interface's MAC address.
required     | false 
type         | string 
example      | {{< highlight shell >}}"mac": "52:54:00:20:1b:3c"{{< /highlight >}}

addresses    | 
-------------|------ 
description  | The list of IP addresses for the interface.
required     | false 
type         | array 
example      | {{< highlight shell >}} "addresses": ["93.184.216.34/24", "2606:2800:220:1:248:1893:25c8:1946/10"]{{< /highlight >}}

### Deregistration Attributes

handler      | 
-------------|------ 
description  | The name of the handler to be called when an entity is deregistered.
required     | false 
type         | string 
example      | {{< highlight shell >}}"handler": "email-handler"{{< /highlight >}}

## Examples

### Entity definition

{{< highlight json >}}
{
  "type": "Entity",
  "spec": {
    "entity_class": "agent",
    "system": {
      "hostname": "sensu2-centos",
      "os": "linux",
      "platform": "centos",
      "platform_family": "rhel",
      "platform_version": "7.4.1708",
      "network": {
        "interfaces": [
          {
            "name": "lo",
            "addresses": [
              "127.0.0.1/8",
              "::1/128"
            ]
          },
          {
            "name": "enp0s3",
            "mac": "08:00:27:11:ad:d2",
            "addresses": [
              "10.0.2.15/24",
              "fe80::26a5:54ec:cf0d:9704/64"
            ]
          },
          {
            "name": "enp0s8",
            "mac": "08:00:27:bc:be:60",
            "addresses": [
              "172.28.128.3/24",
              "fe80::a00:27ff:febc:be60/64"
            ]
          }
        ]
      },
      "arch": "amd64"
    },
    "subscriptions": [
      "entity:webserver01"
    ],
    "last_seen": 1542667231,
    "deregister": false,
    "deregistration": {},
    "user": "agent",
    "redact": [
      "password",
      "passwd",
      "pass",
      "api_key",
      "api_token",
      "access_key",
      "secret_key",
      "private_key",
      "secret"
    ],
    "metadata": {
      "name": "webserver01",
      "namespace": "default",
      "labels": null,
      "annotations": null
    }
  }
}
{{< /highlight >}}

[1]: #system-attributes
[2]: #deregistration-attributes
[3]: #network-attributes
[4]: #networkinterface-attributes
[5]: ../rbac#namespaces
[6]: ../filters
[7]: ../tokens
[8]: #metadata-attributes
