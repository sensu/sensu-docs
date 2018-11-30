---
title: "Glossary of Terms"
linkTitle: "Glossary"
description: "Introduction to Sensu terms and concepts"
weight: 10
version: "5.0"
product: "Sensu Go"
menu:
  sensu-go-5.0:
    parent: getting-started
---

#### Agent
A lightweight client that runs on the infrastructure components you want to monitor.
Agents self-register with the backend, send keepalive messages, and execute monitoring checks.
Each agent belongs to one or more subscriptions that determine which checks the agent runs.
An agent can run checks on the entity it’s installed on or by connecting to a remote proxy entity.
[Read more.][1]

#### Asset
An asset is an executable that a check, handler, or mutator can specify as a dependency.
Assets must be a tar archive (optionally gzipped) with scripts or executables within a bin folder.
At runtime, the backend or agent installs required assets using the specified URL.
Assets let you manage runtime dependencies without using configuration management tools.
[Read more.][4]

#### Backend
A flexible, scalable monitoring event pipeline.
The backend processes event data using filters, mutators, and handlers.
It maintains configuration files, stores recent event data, and schedules monitoring checks.
You can interact with the backend using the API, command line, and dashboard interfaces.
[Read more.][2]

#### Check
A recurring check run by the agent to determine the state of a system component or collect metrics.
The backend is responsible for storing check definitions, scheduling checks, and processing event data.
Check definitions specify the command to be executed, an interval for execution, one or more subscriptions, and one or more handlers that will process the resulting event data.
[Read more.][3]

#### Check hook
A command executed by the agent in response to a check result, before creating a monitoring event.
Hooks create context-rich events by gathering related information based on the check status.
[Read more.][5]

#### Check plugin
Checks require an executable that the agent runs on the corresponding entity when executing the check.
You can write your own check executables in Go, Ruby, Python, and more, or use one of over 100 check plugins shared by the Sensu community.
[Read more.][6]

#### Check token
A placeholder used in a check definition that the agent replaces with local information before executing the check.
Tokens let you fine-tune check attributes (like thresholds) on a per-entity level while re-using the check definition.
[Read more.][16]

#### Entity
Infrastructure components that you want to monitor.
Each entity runs an agent that executes checks and creates events.
Events can be tied to the entity where the agent runs or a proxy entity that the agent checks remotely.
[Read more.][7]

#### Event
A representation of the state of an infrastructure component at a point in time, used by the backend to power the monitoring event pipeline.
Event data includes the result of the check or metric (or both), the executing agent, and a timestamp.
[Read more.][8]

#### Filter
Logical statements that handlers evaluate before processing monitoring events.
Filters can instruct handlers to allow or deny matching events based on day, time, namespace, or any attribute in the event data.
[Read more.][9]

#### Handler
A component of the monitoring event pipeline that acts on events.
Handlers can send monitoring event data to an executable (or handler plugin), a TCP socket, or a UDP socket.
[Read more.][10]

#### Mutator
An executable run by the backend prior to the handler to transform event data.
[Read more.][11]

#### Proxy Entity
Components of your infrastructure that can’t run the agent locally (like a network switch or a website) but still need to be monitored.
Agents create events with information about the proxy entity in place of the local entity when running checks with a specified proxy entity id.
[Read more.][12]

#### RBAC
Role-based access control (RBAC) is Sensu’s local user management system.
RBAC lets you manage users and permissions with namespaces, users, roles, and role bindings.
[Read more.][13]

#### Resources
Objects within Sensu that can be used to specify access permissions in Sensu roles and cluster roles.
Resources can be specific to a namespace (like checks and handlers) or cluster-wide (like users and cluster roles).
[Read more.][18]

#### Sensuctl
Command line tool that lets you interact with the backend.
You can use sensuctl to create checks, view events, create users, manage cluster, and more.
[Read more.][14]

#### Silencing
Silencing entries allow you to suppress execution of event handlers on an ad-hoc basis.
You can use silencing to schedule maintenances without being overloaded with alerts.
[Read more.][17]

[1]: ../../getting-started/installation-and-configuration/
[2]: ../../getting-started/installation-and-configuration/
[3]: ../../reference/checks
[4]: ../../reference/assets
[5]: ../../reference/hooks
[6]: ../../reference/checks
[7]: ../../reference/entities
[8]: ../../reference/events
[9]: ../../reference/filters
[10]: ../../reference/handlers
[11]: ../../reference/mutators
[12]: ../../reference/entities#proxy-entities
[13]: ../../reference/rbac
[14]: ../../reference/sensuctl
[15]: ../../reference/checks/#subdue-attributes
[16]: ../../reference/tokens
[17]: ../../reference/silencing
[18]: ../../reference/rbac#resources
