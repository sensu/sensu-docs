---
title: "Entities"
description: "The entities reference guide."
weight: 1
version: "2.0"
product: "Sensu Core"
platformContent: true
menu:
  sensu-core-2.0:
    parent: reference
---

# Entities

### Why "Entities"?

Sensu 2.0 uses an updated data model to address the latest paradigm shift in infrastructure and software delivery like containers and "serverless". Sensu is no longer confined to the concept of a client, we have "entities" that can can represent anything.

### What is a Sensu entity?

Entities, formally known as clients in Sensu 1.x, are monitoring agents (e.g. server, container, etc) that need to be monitored. They contain system information such as the hostname, OS, platform, and version. Entities not only provide context to event data but an event's uniqueness is determined by the check name and the ID of the entity upon which the check ran.

## Agent entities

### What is an agent entity?

An agent entity is a Sensu entity which falls under the "agent" class. Agent entities are monitoring agents, which are installed and run on every system (e.g. server, container, etc) that needs to be monitored. The entity is responsible for registering the system with Sensu, sending keepalive messages (the Sensu heartbeat mechanism), and executing monitoring checks. Each entity is a member of one or more subscriptions – a list of roles and/or responsibilities assigned to the system (e.g. a webserver, database, etc). Sensu entities will "subscribe" to (or watch for) check requests published by the Sensu server (via the Sensu Transport), execute the corresponding requests locally, and publish the results of the check back to the transport (to be processed by a Sensu server).

### Creating an agent entity

To create an agent entity, Sensu 2 must be installed. Upon spinning up the sensu-agent, you can use several flags to customize the properties of the entity. In the example below, the optional flags are used to describe the default values of the agent entity that gets created upon starting sensu-agent. Other flags/properties you can set for your agent entity include: --deregister, --subscriptions, --deregistration-handler, and --redact.

{{< highlight shell >}}
sensu-agent start --id hostname --environment default --organization default --keepalive-timeout 120 --user agent
{{< /highlight >}}

## Proxy Entities

### What is a proxy entity?

A proxy entity is a Sensu entity which falls under the "proxy" class. Proxy entities (formerly known as proxy clients, "Just-in-time" or "JIT" clients) are dynamically created entities, added to the entity registry if an entity does not already exist for a check result. Proxy entity registration differs from keepalive-based registration because the registration event happens while processing a check result (not a keepalive message). Sensu proxy entities allow Sensu to monitor external resources (e.g. on systems and/or devices where a sensu-agent cannot be installed, such a network switches), using the defined check ProxyEntityID to create a proxy entity for the external resource. Once created, proxy entities work much in the same way as any other Sensu entity.

### Creating a proxy entity

To create a proxy entity, a check's ProxyEntityID (formerly `source`) can be provided in the check definition or published as a check result to the TCP/UDP socket. If a check result includes a ProxyEntityID attribute, a proxy entity will be created, and the check result will be stored under the newly created entity.

### Viewing

To view all the entities that are currently configured for the cluster, enter:

{{< highlight shell >}}
sensuctl entity list
{{< /highlight >}}

If you want more details on an entity, the `info` subcommand can help you out.

> sensuctl entity info entity.localhost
{{< highlight shell >}}
=== entity.localhost
ID:                     entity.localhost
Class:                  agent
Subscriptions:          system
Last Seen:              2018-02-21 14:32:16 -0600 CST
Hostname:               entity.localhost
OS:                     darwin
Platform:               darwin
Platform Family:        
Platform Version:       10.13.3
Auto-Deregistration:    false
Deregistration Handler:
{{< /highlight >}}

### Management

Entities can be updated interactively through the CLI.

{{< highlight shell >}}
sensuctl entity update entity.localhost
{{< /highlight >}}

To delete an existing entity, simply pass the name of the entity to the `delete` command.

{{< highlight shell >}}
sensuctl entity delete entity.localhost
{{< /highlight >}}
