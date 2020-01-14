---
title: "Entities"
description: "An entity represents anything that needs to be monitored, including the full range of infrastructure, runtime, and application types that compose a complete monitoring environment, from server hardware to serverless functions. Read this reference doc to learn about entities."
weight: 70
version: "5.17"
product: "Sensu Go"
platformContent: false 
menu:
  sensu-go-5.17:
    parent: reference
---

- [Usage limits](#usage-limits)
- [Proxy entities](#proxy-entities)
- [Manage entity labels](#manage-entity-labels): [Proxy entity labels](#proxy-entities-managed) | [Agent entity labels](#agent-entities-managed)
- [Entities specification](#entities-specification)
  - [Top-level attributes](#top-level-attributes) | [Metadata attributes](#metadata-attributes) | [Spec attributes](#spec-attributes) | [System attributes](#system-attributes) | [Network attributes](#network-attributes) | [NetworkInterface attributes](#networkinterface-attributes) | [Deregistration attributes](#deregistration-attributes)
- [Examples](#examples)

An entity represents anything that needs to be monitored, such as a server, container, or network switch, including the full range of infrastructure, runtime, and application types that compose a complete monitoring environment (from server hardware to serverless functions).
We call these monitored parts of an infrastructure "entities."

An entity provides context for event data &mdash; what and where the event is from &mdash; and an event's uniqueness is determined by the check name and the name of the entity upon which the check ran.
Entities can also contain system information like the hostname, operating system, platform, and version.

Agent entities are monitoring agents that are installed and run on every system that needs to be monitored.
The agent entity registers the system with the Sensu backend service, sends keepalive messages (the Sensu heartbeat mechanism), and executes monitoring checks.
Each entity is a member of one or more `subscriptions`: a list of roles and responsibilities assigned to the agent entity (e.g. a webserver or a database).
Sensu entities "subscribe" to (or watch for) check requests published by the Sensu backend (via the Sensu transport), execute the corresponding requests locally, and publish the results of the check back to the transport (to be processed by a Sensu backend).

[Proxy entities][16] are dynamically created entities that are added to the entity store if an entity does not already exist for a check result.
Proxy entities allow Sensu to monitor external resources on systems where a Sensu agent cannot be installed (like a network switch or website) using the defined check `ProxyEntityName` to create a proxy entity for the external resource.

## Usage limits

Sensu's free entity limit is 100 entities.
All [commercial features][9] are available for free in the packaged Sensu Go distribution up to an entity limit of 100.
If your Sensu instance includes more than 100 entities, [contact us][10] to learn how to upgrade your installation and increase your limit.
See [the announcement on our blog][11] for more information about our usage policy.

## Proxy entities

Proxy entities [formerly known as proxy clients or just-in-time (JIT) clients] are dynamically created entities that are added to the entity store if an entity does not already exist for a check result.
Proxy entities allow Sensu to monitor external resources on systems and devices where a Sensu agent cannot be installed (like a network switch or website) using the defined check `ProxyEntityName` to create a proxy entity for the external resource.

Proxy entity registration differs from keepalive-based registration because the registration event happens while processing a check result (not a keepalive message).

See [Monitor external resources][17] to learn how to use a proxy entity to monitor a website.

### Proxy entities and round robin scheduling

Proxy entities make [round robin scheduling][18] more useful.
Proxy entities allow you to combine all round robin events into a single event.
Instead of having a separate event for each agent entity, you have a single event for the entire round robin.

If you don't use a proxy entity for round robin scheduling, you could have several failures in a row, but each event will only be aware of one of the failures.

If you use a proxy entity without round robin scheduling, and several agents share the subscription, they will all execute the check for the proxy entity and you'll get duplicate results.
When you enable round robin, you'll get one agent per interval executing the proxy check, but the event will always be listed under the proxy entity.
If you don't create a proxy entity, it is created when the check is executed.
You can modify the proxy entity later if needed.

Use [proxy entity filters][19] to establish a many-to-many relationship between agent entities and proxy entities if you want even more power over the grouping.

## Manage entity labels

Labels are custom attributes that Sensu includes with event data.
You can access labels with [event filters][6] and [tokens][7].
In contrast to annotations, you can use labels to create meaningful collections that you can select with [API response filtering][14] and [sensuctl response filtering][15].

Overusing labels can affect Sensu's internal performance, so we recommend moving complex, non-identifying metadata to [annotations][20].

### Proxy entity labels {#proxy-entities-managed}

For entities with class `proxy`, you can create and manage labels with sensuctl.
For example, to create a proxy entity with a `url` label using sensuctl `create`, create a file called `example.json` with an entity definition that includes `labels`:

{{< language-toggle >}}

{{< highlight yml >}}
type: Entity
api_version: core/v2
sensu_agent_version: 1.0.0
metadata:
  labels:
    url: docs.sensu.io
  name: sensu-docs
  namespace: default
spec:
  deregister: false
  deregistration: {}
  entity_class: proxy
  last_seen: 0
  subscriptions: []
  system:
    network:
      interfaces: null
{{< /highlight >}}

{{< highlight json >}}
{
  "type": "Entity",
  "api_version": "core/v2",
  "sensu_agent_version": "1.0.0",
  "metadata": {
    "name": "sensu-docs",
    "namespace": "default",
    "labels": {
      "url": "docs.sensu.io"
    }
  },
  "spec": {
    "deregister": false,
    "deregistration": {},
    "entity_class": "proxy",
    "last_seen": 0,
    "subscriptions": [],
    "system": {
      "network": {
        "interfaces": null
      }
    }
  }
}
{{< /highlight >}}

{{< /language-toggle >}}

Then run `sensuctl create` to create the entity based on the definition:

{{< highlight shell >}}
sensuctl create --file entity.json
{{< /highlight >}}

To add a label to an existing entity, use sensuctl `edit`.
For example, run `sensuctl edit` to add a `url` label to a `sensu-docs` entity:

{{< highlight shell >}}
sensuctl edit entity sensu-docs
{{< /highlight >}}

And update the `metadata` scope to include `labels`:

{{< language-toggle >}}

{{< highlight yml >}}
type: Entity
api_version: core/v2
sensu_agent_version: 1.0.0
metadata:
  labels:
    url: docs.sensu.io
  name: sensu-docs
  namespace: default
spec:
  '...': '...'
{{< /highlight >}}

{{< highlight json >}}
{
  "type": "Entity",
  "api_version": "core/v2",
  "sensu_agent_version": "1.0.0",
  "metadata": {
    "name": "sensu-docs",
    "namespace": "default",
    "labels": {
      "url": "docs.sensu.io"
    }
  },
  "spec": {
    "...": "..."
  }
}
{{< /highlight >}}

{{< /language-toggle >}}

#### Proxy entity checks

Proxy entities allow Sensu to [monitor external resources][17] on systems or devices where a Sensu agent cannot be installed, like a network switch, website, or API endpoint.
You can configure a check with a proxy entity name to associate the check results with that proxy entity.
On the first check result, if the proxy entity does not exist, Sensu will create the entity as a proxy entity.

After you create a proxy entity check, define which agents will run the check by configuring a subscription.
See [proxy entities][16] for details about creating a proxy check for a proxy entity.

### Agent entity labels {#agent-entities-managed}

For entities with class `agent`, you can define entity attributes in the `/etc/sensu/agent.yml` configuration file.
For example, to add a `url` label, open `/etc/sensu/agent.yml` and add configuration for `labels`:

{{< highlight yml >}}
labels:
  url: sensu.docs.io
{{< /highlight >}}

Or, use `sensu-agent start` configuration flags:

{{< highlight shell >}}
sensu-agent start --labels url=sensu.docs.io
{{< /highlight >}}

## Entities specification

### Top-level attributes

type         | 
-------------|------
description  | Top-level attribute that specifies the [`sensuctl create`][12] resource type. Entities should always be type `Entity`.
required     | Required for entity definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][12].
type         | String
example      | {{< highlight shell >}}"type": "Entity"{{< /highlight >}}

api_version  | 
-------------|------
description  | Top-level attribute that specifies the Sensu API group and version. For entities in this version of Sensu, this attribute should always be `core/v2`.
required     | Required for entity definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][12].
type         | String
example      | {{< highlight shell >}}"api_version": "core/v2"{{< /highlight >}}

metadata     | 
-------------|------
description  | Top-level collection of metadata about the entity, including the `name` and `namespace` as well as custom `labels` and `annotations`. The `metadata` map is always at the top level of the entity definition. This means that in `wrapped-json` and `yaml` formats, the `metadata` scope occurs outside the `spec` scope. See [metadata attributes][8] for details.
required     | Required for entity definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][12].
type         | Map of key-value pairs
example      | {{< highlight shell >}}
"metadata": {
  "name": "webserver01",
  "namespace": "default",
  "labels": {
    "region": "us-west-1"
  },
  "annotations": {
    "slack-channel" : "#monitoring"
  }
}
{{< /highlight >}}

sensu_agent_version  | 
---------------------|------
description          | Sensu Semantic Versioning (SemVer) version of the agent entity.
required             | true
type                 | String
example              | {{< highlight shell >}}"sensu_agent_version": "1.0.0"{{< /highlight >}}

spec         | 
-------------|------
description  | Top-level map that includes the entity [spec attributes][13].
required     | Required for entity definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][12].
type         | Map of key-value pairs
example      | {{< highlight shell >}}
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
    ]
  }
{{< /highlight >}}

### Metadata attributes

| name       |      |
-------------|------
description  | Unique name of the entity, validated with Go regex [`\A[\w\.\-]+\z`][21].
required     | true
type         | String
example      | {{< highlight shell >}}"name": "example-hostname"{{< /highlight >}}

| namespace  |      |
-------------|------
description  | [Sensu RBAC namespace][5] that this entity belongs to.
required     | false
type         | String
default      | `default`
example      | {{< highlight shell >}}"namespace": "production"{{< /highlight >}}

| labels     |      |
-------------|------
description  | Custom attributes to include with event data that you can access with [event filters][6] and [tokens][7].<br><br>In contrast to annotations, you can use labels to create meaningful collections that you can select with [API response filtering][14] and [sensuctl response filtering][15]. Overusing labels can affect Sensu's internal performance, so we recommend moving complex, non-identifying metadata to annotations.
required     | false
type         | Map of key-value pairs. Keys can contain only letters, numbers, and underscores and must start with a letter. Values can be any valid UTF-8 string.
default      | `null`
example      | {{< highlight shell >}}"labels": {
  "environment": "development",
  "region": "us-west-2"
}{{< /highlight >}}

| annotations |     |
-------------|------
description  | Non-identifying metadata to include with event data that you can access with [event filters][6] and [tokens][7]. You can use annotations to add data that's meaningful to people or external tools that interact with Sensu.<br><br>In contrast to labels, you cannot use annotations in [API response filtering][14] or [sensuctl response filtering][15], and annotations do not affect Sensu's internal performance.
required     | false
type         | Map of key-value pairs. Keys and values can be any valid UTF-8 string.
default      | `null`
example      | {{< highlight shell >}} "annotations": {
  "managed-by": "ops",
  "playbook": "www.example.url"
}{{< /highlight >}}

### Spec attributes

entity_class |     |
-------------|------ 
description  | Entity type, validated with Go regex [`\A[\w\.\-]+\z`][21]. Class names have special meaning. An entity that runs an agent is class `agent` and is reserved. Setting the value of `entity_class` to `proxy` creates a proxy entity. For other types of entities, the `entity_class` attribute isn’t required, and you can use it to indicate an arbitrary type of entity (like `lambda` or `switch`).
required     | true
type         | String 
example      | {{< highlight shell >}}"entity_class": "agent"{{< /highlight >}}

subscriptions| 
-------------|------ 
description  | List of subscription names for the entity. The entity by default has an entity-specific subscription, in the format of `entity:{name}` where `name` is the entity's hostname.
required     | false 
type         | Array 
default      | The entity-specific subscription.
example      | {{< highlight shell >}}"subscriptions": ["web", "prod", "entity:example-entity"]{{< /highlight >}}

system       | 
-------------|------ 
description  | System information about the entity, such as operating system and platform. See [system attributes][1] for more information.
required     | false
type         | Map
example      | {{< language-toggle >}}

{{< highlight yml >}}
system:
  arch: amd64
  hostname: example-hostname
  network:
    interfaces:
    - addresses:
      - 127.0.0.1/8
      - ::1/128
      name: lo
    - addresses:
      - 93.184.216.34/24
      - 2606:2800:220:1:248:1893:25c8:1946/10
      mac: 52:54:00:20:1b:3c
      name: eth0
  os: linux
  platform: ubuntu
  platform_family: debian
  platform_version: "16.04"
{{< /highlight >}}

{{< highlight json >}}
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

{{< /language-toggle >}}

last_seen    | 
-------------|------ 
description  | Timestamp the entity was last seen. In seconds since the Unix epoch. 
required     | false 
type         | Integer 
example      | {{< highlight shell >}}"last_seen": 1522798317 {{< /highlight >}}


deregister   | 
-------------|------ 
description  | `true` if the entity should be removed when it stops sending keepalive messages. Otherwise, `false`.
required     | false 
type         | Boolean 
default      | `false`
example      | {{< highlight shell >}}"deregister": false {{< /highlight >}}

deregistration  | 
-------------|------ 
description  | Map that contains a handler name to use when an entity is deregistered. See [deregistration attributes][2] for more information.
required     | false
type         | Map
example      | {{< language-toggle >}}

{{< highlight yml >}}
deregistration:
  handler: email-handler
{{< /highlight >}}

{{< highlight json >}}
{
  "deregistration": {
    "handler": "email-handler"
  }
}{{< /highlight >}}

{{< /language-toggle >}}

redact       | 
-------------|------ 
description  | List of items to redact from log messages. If a value is provided, it overwrites the default list of items to be redacted.
required     | false 
type         | Array 
default      | ["password", "passwd", "pass", "api_key", "api_token", "access_key", "secret_key", "private_key", "secret"]
example      | {{< language-toggle >}}

{{< highlight yml >}}
redact:
- extra_secret_tokens
{{< /highlight >}}

{{< highlight json >}}
{
  "redact": [
    "extra_secret_tokens"
  ]
}{{< /highlight >}}

{{< /language-toggle >}}

| user |      |
--------------|------
description   | [Sensu RBAC username][22] used by the entity. Agent entities require get, list, create, update, and delete permissions for events across all namespaces.
type          | String
default       | `agent`
example       | {{< highlight shell >}}
"user": "agent"
{{< /highlight >}}

### System attributes

hostname     | 
-------------|------ 
description  | Hostname of the entity. 
required     | false 
type         | String 
example      | {{< highlight shell >}}"hostname": "example-hostname" {{< /highlight >}}

os           | 
-------------|------ 
description  | Entity's operating system. 
required     | false 
type         | String 
example      | {{< highlight shell >}}"os": "linux" {{< /highlight >}}

platform     | 
-------------|------ 
description  | Entity's operating system distribution. 
required     | false 
type         | String 
example      | {{< highlight shell >}}"platform": "ubuntu" {{< /highlight >}}

platform_family     | 
-------------|------ 
description  | Entity's operating system family. 
required     | false 
type         | String 
example      | {{< highlight shell >}}"platform_family": "debian" {{< /highlight >}}

platform_version     | 
-------------|------ 
description  | Entity's operating system version. 
required     | false 
type         | String 
example      | {{< highlight shell >}}"platform_version": "16.04" {{< /highlight >}}

network     | 
-------------|------ 
description  | Entity's network interface list. See [network attributes][3] for more information.
required     | false
type         | Map
example      | {{< language-toggle >}}

{{< highlight yml >}}
network:
  interfaces:
  - addresses:
    - 127.0.0.1/8
    - ::1/128
    name: lo
  - addresses:
    - 93.184.216.34/24
    - 2606:2800:220:1:248:1893:25c8:1946/10
    mac: 52:54:00:20:1b:3c
    name: eth0
{{< /highlight >}}

{{< highlight json >}}
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

{{< /language-toggle >}}

arch         | 
-------------|------ 
description  | Entity's system architecture. This value is determined by the Go binary architecture as a function of runtime.GOARCH. An `amd` system running a `386` binary will report the `arch` as `386`.
required     | false 
type         | String 
example      | {{< highlight shell >}}"arch": "amd64" {{< /highlight >}}

### Network attributes

network_interface         | 
-------------|------ 
description  | List of network interfaces available on the entity, with their associated MAC and IP addresses. 
required     | false 
type         | Array [NetworkInterface][4] 
example      | {{< language-toggle >}}

{{< highlight yml >}}
interfaces:
- addresses:
  - 127.0.0.1/8
  - ::1/128
  name: lo
- addresses:
  - 93.184.216.34/24
  - 2606:2800:220:1:248:1893:25c8:1946/10
  mac: 52:54:00:20:1b:3c
  name: eth0
{{< /highlight >}}

{{< highlight json >}}
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

{{< /language-toggle >}}

### NetworkInterface attributes

name         | 
-------------|------ 
description  | Network interface name.
required     | false 
type         | String 
example      | {{< highlight shell >}}"name": "eth0"{{< /highlight >}}

mac          | 
-------------|------ 
description  | Network interface's MAC address.
required     | false 
type         | string 
example      | {{< highlight shell >}}"mac": "52:54:00:20:1b:3c"{{< /highlight >}}

addresses    | 
-------------|------ 
description  | List of IP addresses for the network interface.
required     | false 
type         | Array 
example      | {{< highlight shell >}} "addresses": ["93.184.216.34/24", "2606:2800:220:1:248:1893:25c8:1946/10"]{{< /highlight >}}

### Deregistration attributes

handler      | 
-------------|------ 
description  | Name of the handler to call when an entity is deregistered.
required     | false 
type         | String 
example      | {{< highlight shell >}}"handler": "email-handler"{{< /highlight >}}

## Examples

### Entity definition

{{< language-toggle >}}

{{< highlight yml >}}
type: Entity
api_version: core/v2
sensu_agent_version: 1.0.0
metadata:
  annotations: null
  labels: null
  name: webserver01
  namespace: default
spec:
  deregister: false
  deregistration: {}
  entity_class: agent
  last_seen: 1542667231
  redact:
  - password
  - passwd
  - pass
  - api_key
  - api_token
  - access_key
  - secret_key
  - private_key
  - secret
  subscriptions:
  - entity:webserver01
  system:
    arch: amd64
    hostname: sensu2-centos
    network:
      interfaces:
      - addresses:
        - 127.0.0.1/8
        - ::1/128
        name: lo
      - addresses:
        - 10.0.2.15/24
        - fe80::26a5:54ec:cf0d:9704/64
        mac: 08:00:27:11:ad:d2
        name: enp0s3
      - addresses:
        - 172.28.128.3/24
        - fe80::a00:27ff:febc:be60/64
        mac: 08:00:27:bc:be:60
        name: enp0s8
    os: linux
    platform: centos
    platform_family: rhel
    platform_version: 7.4.1708
  user: agent
{{< /highlight >}}

{{< highlight json >}}
{
  "type": "Entity",
  "api_version": "core/v2",
  "sensu_agent_version": "1.0.0",
  "metadata": {
    "name": "webserver01",
    "namespace": "default",
    "labels": null,
    "annotations": null
  },
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
    ]
  }
}
{{< /highlight >}}

{{< /language-toggle >}}

[1]: #system-attributes
[2]: #deregistration-attributes
[3]: #network-attributes
[4]: #networkinterface-attributes
[5]: ../rbac#namespaces
[6]: ../filters/
[7]: ../tokens/
[8]: #metadata-attributes
[9]: ../../getting-started/enterprise/
[10]: https://sensu.io/contact
[11]: https://blog.sensu.io/one-year-of-sensu-go
[12]: ../../sensuctl/reference#create-resources
[13]: #spec-attributes
[14]: ../../api/overview#response-filtering
[15]: ../../sensuctl/reference#response-filters
[16]: #proxy-entities
[17]: ../../guides/monitor-external-resources/
[18]: ../checks/#round-robin-checks
[19]: #proxy-entities-managed
[20]: #metadata-attributes
[21]: https://regex101.com/r/zo9mQU/2
[22]: ../rbac/
