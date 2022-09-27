---
title: "Glossary of Sensu concepts and terminology"
linkTitle: "Concepts and Terminology"
description: "Use this glossary to get familiar with Sensu concepts and terminology. Each summary includes a link to more in-depth information."
weight: 10
version: "6.7"
product: "Sensu Go"
menu:
  sensu-go-6.7:
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
Dynamic runtime assets must be a tar archive (optionally gzipped) with scripts or executables within a bin folder.
At runtime, the backend or agent installs required assets using the specified URL.
Dynamic runtime assets let you manage runtime dependencies without using configuration management tools.
[Read more about dynamic runtime assets][4].

## Backend
A flexible, scalable observability pipeline.
The Sensu backend processes observation data (events) using filters, mutators, and handlers.
It maintains configuration files, stores recent observation data, and schedules monitoring checks.
You can interact with the backend using the API, command line, and web UI interfaces.
[Read more about the Sensu backend][2].

## Business service monitoring (BSM)
A feature that provides high-level visibility into the current health of your business services.
An example business service is a company website, which might require several individual elements to have OK status for the website to function (e.g. webservers, an inventory database, and a shopping cart).
With business service monitoring (BSM), you could create a current status page for the company website that displays the website’s overall status at a glance.

BSM requires two resources that work together to achieve top-down monitoring: service components and rule templates.
Service components are the elements that make up your business services.
Rule templates define the monitoring rules that produce events for service components based on customized evaluation expressions.

[Read more about BSM][19], [rule templates][20], and [service components][21].

## Catalog
The Sensu Catalog is an element of the Sensu web UI where you can find and install monitoring and observability integrations.
An integration combines a Sensu plugin with a dynamic runtime asset and the Sensu resource definitions that use the plugin.
The Sensu Catalog includes integrations for standard system checks and metrics collection as well as pipelines for sending Sensu data to third-party logging, remediation, and incident management services.
[Read more about the Sensu Catalog][24].

## Check
A recurring check the agent runs to determine the state of a system component or collect metrics.
The backend is responsible for storing check definitions, scheduling checks, and processing observation data (events).
Check definitions specify the command to be executed, an interval for execution, one or more subscriptions, and one or more handlers to process the resulting event data.
[Read more about checks][3].

## Entity
Infrastructure components that you want to monitor.
Each entity runs an agent that executes checks and creates events.
Events can be tied to the entity where the agent runs or a proxy entity that the agent checks remotely.
[Read more about entities][7].

## Event
A representation of the state of an infrastructure component at a point in time.
The Sensu backend uses events to power the observability pipeline.
Observation data in events include the result of a check or metric (or both), the executing agent, and a timestamp.
[Read more about events][8].

## Event filter
Logical expressions that handlers evaluate before processing observability events.
Event filters can instruct handlers to allow or deny matching events based on day, time, namespace, or any attribute in the observation data (event).
[Read more about event filters][9].

## Handler
A component of the observability pipeline that acts on events.
Handlers can send observability data to an executable (or handler plugin), a TCP socket, or a UDP socket.
[Read more about handlers][10].

## Hook
A command the agent executes in response to a check result *before* creating an observability event.
Hooks create context-rich events by gathering relevant information based on check status.
[Read more about hooks][5].

## Mutator
An executable the backend runs prior to a handler to transform observation data (events).
[Read more about mutators][11].

## Pipeline
Resources composed of observation event processing workflows made up of filters, mutators, and handlers.
Instead of specifying filters and mutators in handler definitions, you can specify all three in a single pipeline workflow.
[Read more about pipelines][23].

## Plugin
Executables designed to work with Sensu observation data (events) either as a check, mutator, or handler plugin. 
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

## Subscriptions
Attributes used to indicate which entities will execute which checks.
For Sensu to execute a check, the check definition must include a subscription that matches the subscription of at least one Sensu entity.
Subscriptions allow you to configure check requests in a one-to-many model for entire groups or subgroups of entities rather than a traditional one-to-one mapping of configured hosts or observability checks.
[Read more about subscriptions][22].

## Token
A placeholder in a check definition that the agent replaces with local information before executing the check.
Tokens let you fine-tune check attributes (like thresholds) on a per-entity level while reusing the check definition.
[Read more about tokens][16].


[1]: ../../observability-pipeline/observe-schedule/agent/
[2]: ../../observability-pipeline/observe-schedule/backend/
[3]: ../../observability-pipeline/observe-schedule/checks/
[4]: ../../plugins/assets/
[5]: ../../observability-pipeline/observe-schedule/hooks/
[6]: ../../plugins/install-plugins/
[7]: ../../observability-pipeline/observe-entities/entities/
[8]: ../../observability-pipeline/observe-events/events/
[9]: ../../observability-pipeline/observe-filter/filters/
[10]: ../../observability-pipeline/observe-process/handlers/
[11]: ../../observability-pipeline/observe-transform/mutators/
[12]: ../../observability-pipeline/observe-entities/#proxy-entities
[13]: ../../operations/control-access/rbac/
[14]: ../../sensuctl/
[15]: ../../observability-pipeline/observe-schedule/checks/#subdue-attributes
[16]: ../../observability-pipeline/observe-schedule/tokens/
[17]: ../../observability-pipeline/observe-process/silencing/
[18]: ../../operations/control-access/rbac#resources
[19]: ../../observability-pipeline/observe-schedule/business-service-monitoring/
[20]: ../../observability-pipeline/observe-schedule/rule-templates/
[21]: ../../observability-pipeline/observe-schedule/service-components/
[22]: ../../observability-pipeline/observe-schedule/subscriptions/
[23]: ../../observability-pipeline/observe-process/pipelines/
[24]: ../../web-ui/sensu-catalog/
