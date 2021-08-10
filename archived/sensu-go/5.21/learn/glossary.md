---
title: "Glossary of Sensu terms"
linkTitle: "Glossary"
description: "Get familiar with Sensu terminology. Read our glossary to learn the definitions of common Sensu terms, including agent, asset, backend, check, event, and many more. Bonus: each term links to a corresponding guide!"
weight: 10
version: "5.21"
product: "Sensu Go"
menu:
  sensu-go-5.21:
    parent: learn-sensu
---

## Agent
A lightweight client that runs on the infrastructure components you want to monitor.
Agents self-register with the backend, send keepalive messages, and execute monitoring checks.
Each agent belongs to one or more subscriptions that determine which checks the agent runs.
An agent can run checks on the entity it’s installed on or connect to a remote proxy entity.
[Read more about the Sensu agent][1].

## Asset
An executable that a check, handler, or mutator can specify as a dependency.
Assets must be a tar archive (optionally gzipped) with scripts or executables within a bin folder.
At runtime, the backend or agent installs required assets using the specified URL.
Assets let you manage runtime dependencies without using configuration management tools.
[Read more about assets][4].

## Backend
A flexible, scalable monitoring event pipeline.
The Sensu backend processes event data using filters, mutators, and handlers.
It maintains configuration files, stores recent event data, and schedules monitoring checks.
You can interact with the backend using the API, command line, and web UI interfaces.
[Read more about the Sensu backend][2].

## Check
A recurring check the agent runs to determine the state of a system component or collect metrics.
The backend is responsible for storing check definitions, scheduling checks, and processing event data.
Check definitions specify the command to be executed, an interval for execution, one or more subscriptions, and one or more handlers to process the resulting event data.
[Read more about checks][3].

## Entity
Infrastructure components that you want to monitor.
Each entity runs an agent that executes checks and creates events.
Events can be tied to the entity where the agent runs or a proxy entity that the agent checks remotely.
[Read more about entities][7].

## Event
A representation of the state of an infrastructure component at a point in time.
The Sensu backend uses events to power the monitoring event pipeline.
Event data includes the result of a check or metric (or both), the executing agent, and a timestamp.
[Read more about events][8].

## Event filter
Logical expressions that handlers evaluate before processing monitoring events.
Event filters can instruct handlers to allow or deny matching events based on day, time, namespace, or any attribute in the event data.
[Read more about event filters][9].

## Handler
A component of the monitoring event pipeline that acts on events.
Handlers can send monitoring event data to an executable (or handler plugin), a TCP socket, or a UDP socket.
[Read more about handlers][10].

## Hook
A command the agent executes in response to a check result *before* creating a monitoring event.
Hooks create context-rich events by gathering relevant information based on check status.
[Read more about hooks][5].

## Mutator
An executable the backend runs prior to a handler to transform event data.
[Read more about mutators][11].

## Plugin
Executables designed to work with Sensu event data either as a check, mutator, or handler plugin. 
You can write your own check executables in Go, Ruby, Python, and more, or use one of more than 200 plugins shared by the Sensu community.
[Read more about plugins][6].

## Proxy entities
Components of your infrastructure that can’t run the agent locally (like a network switch or a website) but still need to be monitored.
Agents create events with information about the proxy entity in place of the local entity when running checks with a specified proxy entity ID.
[Read more about proxy entities][12].

## Role-based access control (RBAC)
Sensu’s local user management system.
RBAC lets you manage users and permissions with namespaces, users, roles, and role bindings.
[Read more about RBAC][13].

## Resources
Objects within Sensu that you can use to specify access permissions in Sensu roles and cluster roles.
Resources can be specific to a namespace (like checks and handlers) or cluster-wide (like users and cluster roles).
[Read more about resources][18].

## Sensuctl
The Sensu command line tool that lets you interact with the backend.
You can use sensuctl to create checks, view events, create users, manage clusters, and more.
[Read more about sensuctl][14].

## Silencing
Entries that allow you to suppress execution of event handlers on an ad-hoc basis.
Use silencing to schedule maintenance without being overloaded with alerts.
[Read more about silencing][17].

## Token
A placeholder in a check definition that the agent replaces with local information before executing the check.
Tokens let you fine-tune check attributes (like thresholds) on a per-entity level while reusing the check definition.
[Read more about tokens][16].

[1]: ../../reference/agent/
[2]: ../../reference/backend/
[3]: ../../reference/checks/
[4]: ../../reference/assets/
[5]: ../../reference/hooks/
[6]: ../../reference/checks/
[7]: ../../reference/entities/
[8]: ../../reference/events/
[9]: ../../reference/filters/
[10]: ../../reference/handlers/
[11]: ../../reference/mutators/
[12]: ../../reference/entities#proxy-entities
[13]: ../../reference/rbac/
[14]: ../../sensuctl/
[15]: ../../reference/checks/#subdue-attributes
[16]: ../../reference/tokens/
[17]: ../../reference/silencing/
[18]: ../../reference/rbac#resources
