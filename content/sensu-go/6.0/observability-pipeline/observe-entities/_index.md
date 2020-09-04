---
title: "Entities"
linkTitle: "Entities"
description: "An entity represents anything that needs to be monitored, including the full range of infrastructure, runtime, and application types that compose a complete monitoring environment, from server hardware to serverless functions. Read this doc to learn about entities."
product: "Sensu Go"
version: "6.0"
weight: 10
layout: "single"
toc: true
menu:
  sensu-go-6.0:
    parent: observability-pipeline
    identifier: observe-entities
---

<!--Source at ADD LINK IF USED-->

**<button onclick="window.location.href='../observe-events';">Next</button> or click any element in the pipeline to jump to it.**

An [entity][6] represents anything that needs to be observed or monitored, such as a server, container, or network switch, including the full range of infrastructure, runtime, and application types that compose a complete monitoring environment (from server hardware to serverless functions).
Sensu calls parts of an infrastructure "entities."

An entity provides the context for event data &mdash; what and where the event is from.
The check and entity names associated with an event determine the event's uniqueness.
Entities can also contain system information like the hostname, operating system, platform, and version.

There are two types of Sensu entities: agent entities and proxy entities.

## Agent entities

Agent entities are monitoring agents that are installed and run on every system that needs to be observed or monitored.
The agent entity registers the system with the Sensu backend service, sends keepalive messages (the Sensu heartbeat mechanism), and executes observability checks.

Each entity is a member of one or more `subscriptions`: a list of roles and responsibilities assigned to the agent entity (e.g. a webserver or a database).
Sensu entities "subscribe" to (or watch for) check requests published by the Sensu backend (via the Sensu transport), execute the corresponding requests locally, and publish the results of the check back to the transport (to be processed by a Sensu backend).

## Proxy entities

Proxy entities [formerly known as proxy clients or just-in-time (JIT) clients] are dynamically created entities that Sensu adds to the entity store if an entity does not already exist for a check result.
Proxy entities allow Sensu to monitor external resources on systems where you cannot install a Sensu agent, like a network switch or website.
Sensu uses the [defined check `proxy_entity_name`][7] to create a proxy entity for the external resource.

Proxy entity registration differs from keepalive-based registration because the registration event happens while processing a check result (not a keepalive message).

See [Monitor external resources][1] to learn how to use a proxy entity to monitor a website.

## Usage limits

Sensu's usage limits are based on entities.

The free limit is 100 entities.
All [commercial features][2] are available for free in the packaged Sensu Go distribution up to an entity limit of 100.
If your Sensu instance includes more than 100 entities, [contact us][3] to learn how to upgrade your installation and increase your limit. See [the announcement on our blog][4] for more information about our usage policy.

Commercial licenses may include an entity limit and entity class limits:

- Entity limit: the maximum number of entities of all classes your license includes. Both agent and proxy entities count toward the overall entity limit.
- Entity class limits: the maximum number of a specific class of entities (e.g. agent or proxy) that your license includes.

For example, if your license has an entity limit of 10,000 and an agent entity class limit of 3,000, you cannot run more than 10,000 entities (agent and proxy) total.
At the same time, you cannot run more than 3,000 agents.
If you use only 1,500 agent entities, you can have 8,500 proxy entities before you reach the overall entity limit of 10,000.

Use sensuctl or the license API to [view your overall entity count and limit][5].


[1]: monitor-external-resources/
[2]: ../../commercial/
[3]: https://sensu.io/contact
[4]: https://blog.sensu.io/one-year-of-sensu-go
[5]: ../../operations/maintain-sensu/license/#view-entity-count-and-entity-limit
[6]: entities/
[7]: ../observe-schedule/checks/#proxy-entity-name-attribute
