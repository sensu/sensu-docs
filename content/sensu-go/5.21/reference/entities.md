---
title: "Entities"
description: "An entity represents anything that needs to be monitored, including the full range of infrastructure, runtime, and application types that compose a complete monitoring environment, from server hardware to serverless functions. Read this reference doc to learn about entities."
weight: 70
version: "5.21"
product: "Sensu Go"
platformContent: false 
menu:
  sensu-go-5.21:
    parent: reference
---

- [Usage limits](#usage-limits)
- [Proxy entities](#proxy-entities)
- [Manage entity labels](#manage-entity-labels): [Proxy entity labels](#proxy-entities-managed) | [Agent entity labels](#agent-entities-managed)
- [Entities specification](#entities-specification)
  - [Top-level attributes](#top-level-attributes) | [Metadata attributes](#metadata-attributes) | [Spec attributes](#spec-attributes) | [System attributes](#system-attributes) | [Network attributes](#network-attributes) | [NetworkInterface attributes](#networkinterface-attributes) | [Deregistration attributes](#deregistration-attributes) | [Processes attributes](#processes-attributes)
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

Commercial licenses may include an entity limit and entity class limits:

- Entity limit: the maximum number of entities of all classes your license includes. Both agent and proxy entities count toward the overall entity limit.
- Entity class limits: the maximum number of a specific class of entities (e.g. agent or proxy) that your license includes.

For example, if your license has an entity limit of 10,000 and an agent entity class limit of 3,000, you cannot run more than 10,000 entities (agent and proxy) total.
At the same time, you cannot run more than 3,000 agents.
If you use only 1,500 agent entities, you can have 8,500 proxy entities before you reach the overall entity limit of 10,000.

Use sensuctl or the license API to [view your overall entity count and limit][29].

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

Labels are custom attributes that Sensu includes with event data that you can use for response and dashboard view filtering.
In contrast to annotations, you can use labels to filter [API responses][14], [sensuctl responses][15], and [dashboard views][23].

Limit labels to metadata you need to use for response filtering.
For complex, non-identifying metadata that you will *not* need to use in response filtering, use [annotations][20] rather than labels.

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
  subscriptions:
  - proxy
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
    "subscriptions": [
      "proxy"
    ],
    "system": {
      "network": {
        "interfaces": null
      }
    }
  }
}
{{< /highlight >}}

{{< /language-toggle >}}

{{% notice note %}}
**NOTE**: The proxy entity definition must include the same subscriptions as the sensu-agent to work with round robin scheduling **and** [proxy requests attributes](../checks#proxy-requests-attributes).
If more than one sensu-agent will execute a proxy check and you did not configure the proxy entity with the same subscriptions as the sensu-agent, the sensu-backend will log an error and the proxy check will not be scheduled for agents to run.
{{% /notice %}}

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
description  | Top-level collection of metadata about the entity, including `name`, `namespace`, and `created_by` as well as custom `labels` and `annotations`. The `metadata` map is always at the top level of the entity definition. This means that in `wrapped-json` and `yaml` formats, the `metadata` scope occurs outside the `spec` scope. See [metadata attributes][8] for details.
required     | Required for entity definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][12].
type         | Map of key-value pairs
example      | {{< highlight shell >}}
"metadata": {
  "name": "webserver01",
  "namespace": "default",
  "created_by": "admin",
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
      "arch": "amd64",
      "libc_type": "glibc",
      "vm_system": "kvm",
      "vm_role": "host",
      "cloud_provider": "",
      "processes": [
        {
          "name": "Slack",
          "pid": 1349,
          "ppid": 0,
          "status": "Ss",
          "background": true,
          "running": true,
          "created": 1582137786,
          "memory_percent": 1.09932518,
          "cpu_percent": 0.3263987595984941
        },
        {
          "name": "Slack Helper",
          "pid": 1360,
          "ppid": 1349,
          "status": "Ss",
          "background": true,
          "running": true,
          "created": 1582137786,
          "memory_percent": 0.146866455,
          "cpu_percent": 0.308976181461092553
        }
      ]
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

| created_by |      |
-------------|------
description  | Username of the Sensu user who created the entity or last updated the entity. Sensu automatically populates the `created_by` field when the entity is created or updated.
required     | false
type         | String
example      | {{< highlight shell >}}"created_by": "admin"{{< /highlight >}}

| labels     |      |
-------------|------
description  | Custom attributes to include with event data that you can use for response and dashboard view filtering.<br><br>If you include labels in your event data, you can filter [API responses][14], [sensuctl responses][15], and [dashboard views][23] based on them. In other words, labels allow you to create meaningful groupings for your data.<br><br>Limit labels to metadata you need to use for response filtering. For complex, non-identifying metadata that you will *not* need to use in response filtering, use annotations rather than labels.
required     | false
type         | Map of key-value pairs. Keys can contain only letters, numbers, and underscores and must start with a letter. Values can be any valid UTF-8 string.
default      | `null`
example      | {{< highlight shell >}}"labels": {
  "environment": "development",
  "region": "us-west-2"
}{{< /highlight >}}

<a name="annotations"></a>

| annotations |     |
-------------|------
description  | Non-identifying metadata to include with event data that you can access with [event filters][6]. You can use annotations to add data that's meaningful to people or external tools that interact with Sensu.<br><br>In contrast to labels, you cannot use annotations in [API response filtering][14], [sensuctl response filtering][15], or [dashboard views][23].
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
description  | List of subscription names for the entity. The entity by default has an entity-specific subscription, in the format of `entity:{name}` where `name` is the entity's hostname. If you are using round robin scheduling **and** [proxy requests attributes][24], the proxy entity definition must include the same subscriptions as the sensu-agent.
required     | false 
type         | Array 
default      | The entity-specific subscription.
example      | {{< highlight shell >}}"subscriptions": ["web", "prod", "entity:example-entity"]{{< /highlight >}}

system       | 
-------------|------ 
description  | System information about the entity, such as operating system and platform. See [system attributes][1] for more information.<br>{{% notice important %}}
**IMPORTANT**: Process discovery is disabled in [release 5.20.2](../../release-notes/#5-20-2-release-notes).
As of 5.20.2, new events will not include data in the `processes` attributes.
{{% /notice %}}
required     | false
type         | Map
example      | {{< language-toggle >}}

{{< highlight yml >}}
system:
  arch: amd64
  libc_type: glibc
  vm_system: kvm
  vm_role: host
  cloud_provider: null
  processes:
  - name: Slack
    pid: 1349
    ppid: 0
    status: Ss
    background: true
    running: true
    created: 1582137786
    memory_percent: 1.09932518
    cpu_percent: 0.3263987595984941
  - name: Slack Helper
    pid: 1360
    ppid: 1349
    status: Ss
    background: true
    running: true
    created: 1582137786
    memory_percent: 0.146866455
    cpu_percent: 0.30897618146109257
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
    "arch": "amd64",
    "libc_type": "glibc",
    "vm_system": "kvm",
    "vm_role": "host",
    "cloud_provider": "",
    "processes": [
      {
        "name": "Slack",
        "pid": 1349,
        "ppid": 0,
        "status": "Ss",
        "background": true,
        "running": true,
        "created": 1582137786,
        "memory_percent": 1.09932518,
        "cpu_percent": 0.3263987595984941
      },
      {
        "name": "Slack Helper",
        "pid": 1360,
        "ppid": 1349,
        "status": "Ss",
        "background": true,
        "running": true,
        "created": 1582137786,
        "memory_percent": 0.146866455,
        "cpu_percent": 0.308976181461092553
      }
    ]
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

libc_type    | 
-------------|------ 
description  | Entity's libc type. Automatically populated upon agent startup.
required     | false 
type         | String 
example      | {{< highlight shell >}}"libc_type": "glibc" {{< /highlight >}}

vm_system    | 
-------------|------ 
description  | Entity's virtual machine system. Automatically populated upon agent startup.
required     | false 
type         | String 
example      | {{< highlight shell >}}"vm_system": "kvm" {{< /highlight >}}

vm_role      | 
-------------|------ 
description  | Entity's virtual machine role. Automatically populated upon agent startup.
required     | false 
type         | String 
example      | {{< highlight shell >}}"vm_role": "host" {{< /highlight >}}

cloud_provider | 
---------------|------ 
description    | Entity's cloud provider environment. Automatically populated upon agent startup if the [`--detect-cloud-provider` flag][25] is set. Returned empty unless the agent runs on Amazon Elastic Compute Cloud (EC2), Google Cloud Platform (GCP), or Microsoft Azure. {{% notice note %}}
**NOTE**: This feature can result in several HTTP requests or DNS lookups being performed, so it may not be appropriate for all environments.
{{% /notice %}}
required       | false 
type           | String 
example        | {{< highlight shell >}}"cloud_provider": "" {{< /highlight >}}

processes    | 
-------------|------ 
description  | List of processes on the local agent. See [processes attributes][26] for more information.<br>{{% notice important %}}
**IMPORTANT**: Process discovery is disabled in [release 5.20.2](../../release-notes/#5-20-2-release-notes).
As of 5.20.2, new events will not include data in the `processes` attributes.
{{% /notice %}}
required     | false 
type         | Map
example      | {{< language-toggle >}}

{{< highlight yml >}}
processes:
- name: Slack
  pid: 1349
  ppid: 0
  status: Ss
  background: true
  running: true
  created: 1582137786
  memory_percent: 1.09932518
  cpu_percent: 0.3263987595984941
- name: Slack Helper
  pid: 1360
  ppid: 1349
  status: Ss
  background: true
  running: true
  created: 1582137786
  memory_percent: 0.146866455
  cpu_percent: 0.30897618146109257
{{< /highlight >}}

{{< highlight json >}}
{
  "processes": [
    {
      "name": "Slack",
      "pid": 1349,
      "ppid": 0,
      "status": "Ss",
      "background": true,
      "running": true,
      "created": 1582137786,
      "memory_percent": 1.09932518,
      "cpu_percent": 0.3263987595984941
    },
    {
      "name": "Slack Helper",
      "pid": 1360,
      "ppid": 1349,
      "status": "Ss",
      "background": true,
      "running": true,
      "created": 1582137786,
      "memory_percent": 0.146866455,
      "cpu_percent": 0.308976181461092553
    }
  ]
}{{< /highlight >}}

{{< /language-toggle >}}

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

### Processes attributes

{{% notice important %}}
**IMPORTANT**: Process discovery is disabled in [release 5.20.2](../../release-notes/#5-20-2-release-notes).
As of 5.20.2, new events will not include data in the `processes` attributes.
{{% /notice %}}

**COMMERCIAL FEATURE**: Access processes attributes with the [`discover-processes` flag][27] in the packaged Sensu Go distribution. For more information, see [Get started with commercial features][9].

{{% notice note %}}
**NOTE**: The `processes` field is populated in the packaged Sensu Go distributions.
In OSS builds, the field will be empty: `"processes": null`.
{{% /notice %}}

name         | 
-------------|------ 
description  | Name of the process.
required     | false
type         | String
example      | {{< highlight shell >}}"name": "Slack"{{< /highlight >}}

pid          | 
-------------|------ 
description  | Process ID of the process.
required     | false
type         | Integer
example      | {{< highlight shell >}}"pid": 1349{{< /highlight >}}

ppid         | 
-------------|------ 
description  | Parent process ID of the process.
required     | false
type         | Integer
example      | {{< highlight shell >}}"ppid": 0{{< /highlight >}}

status       | 
-------------|------ 
description  | Status of the process. See the [Linux `top` manual page][28] for examples.
required     | false
type         | String
example      | {{< highlight shell >}}"status": "Ss"{{< /highlight >}}

background   | 
-------------|------ 
description  | If `true`, the process is a background process. Otherwise, `false`.
required     | false
type         | Boolean
example      | {{< highlight shell >}}"background": true{{< /highlight >}}

running      | 
-------------|------ 
description  | If `true`, the process is running. Otherwise, `false`.
required     | false
type         | Boolean
example      | {{< highlight shell >}}"running": true{{< /highlight >}}

created      | 
-------------|------ 
description  | Timestamp when the process was created. In seconds since the Unix epoch.
required     | false
type         | Integer
example      | {{< highlight shell >}}"created": 1586138786{{< /highlight >}}

memory_percent | 
-------------|------ 
description  | Percent of memory the process is using. The value is returned as a floating-point number where 0.0 = 0% and 1.0 = 100%. For example, the memory_percent value 0.19932 equals 19.932%. {{% notice note %}}
**NOTE**: The `memory_percent` attribute is supported on Linux and macOS.
It is not supported on Windows.
{{% /notice %}}
required     | false
type         | float
example      | {{< highlight shell >}}"memory_percent": 0.19932{{< /highlight >}}

cpu_percent  | 
-------------|------ 
description  | Percent of CPU the process is using. The value is returned as a floating-point number where 0.0 = 0% and 1.0 = 100%. For example, the cpu_percent value 0.12639 equals 12.639%. {{% notice note %}}
**NOTE**: The `cpu_percent` attribute is supported on Linux and macOS.
It is not supported on Windows.
{{% /notice %}}
required     | false
type         | float
example      | {{< highlight shell >}}"cpu_percent": 0.12639{{< /highlight >}}

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
    libc_type: glibc
    vm_system: kvm
    vm_role: host
    cloud_provider: null
    processes:
    - name: Slack
      pid: 1349
      ppid: 0
      status: Ss
      background: true
      running: true
      created: 1582137786
      memory_percent: 1.09932518
      cpu_percent: 0.3263987595984941
    - name: Slack Helper
      pid: 1360
      ppid: 1349
      status: Ss
      background: true
      running: true
      created: 1582137786
      memory_percent: 0.146866455
      cpu_percent: 0.30897618146109257
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
      "arch": "amd64",
      "libc_type": "glibc",
      "vm_system": "kvm",
      "vm_role": "host",
      "cloud_provider": "",
      "processes": [
        {
          "name": "Slack",
          "pid": 1349,
          "ppid": 0,
          "status": "Ss",
          "background": true,
          "running": true,
          "created": 1582137786,
          "memory_percent": 1.09932518,
          "cpu_percent": 0.3263987595984941
        },
        {
          "name": "Slack Helper",
          "pid": 1360,
          "ppid": 1349,
          "status": "Ss",
          "background": true,
          "running": true,
          "created": 1582137786,
          "memory_percent": 0.146866455,
          "cpu_percent": 0.308976181461092553
        }
      ]
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
[15]: ../../sensuctl/reference#response-filtering
[16]: #proxy-entities
[17]: ../../guides/monitor-external-resources/
[18]: ../checks/#round-robin-checks
[19]: #proxy-entities-managed
[20]: #annotations
[21]: https://regex101.com/r/zo9mQU/2
[22]: ../rbac/
[23]: ../../dashboard/filtering#filter-with-label-selectors
[24]: ../checks#proxy-requests-attributes
[25]: ../agent/#detect-cloud-provider-flag
[26]: #processes-attributes
[27]: ../agent/#discover-processes
[28]: http://man7.org/linux/man-pages/man1/top.1.html
[29]: ../license/#view-entity-count-and-entity-limit
