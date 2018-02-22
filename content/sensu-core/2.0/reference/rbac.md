---
title: "Role-Based Access Control (RBAC)"
description: "The rbac reference guide."
weight: 1
version: "2.0"
product: "Sensu Core"
platformContent: true
menu:
  sensu-core-2.0:
    parent: reference
---

# Role-Based Access Control (RBAC) and Multitenancy in Sensu 2.0

Sensu's **Role-Based Access Control** (RBAC) allows you to exercise fine-grained
control over how Sensu users interact with Sensu resources. Using RBAC
rules, you can easily achieve **multitenancy** so users only have access to
resources within their own organization and environment.

## Overview

### Authentication

Sensu 2.0 offers local users management. Users can be managed with `sensuctl`.
Support for external directories (such as LDAP) is coming.

### Terminology

#### User

A user represents a person or an agent which interacts with Sensu.

#### Group

Not available yet!

#### Role

A role contains a set of rules, which represent permissions to Sensu resources.

Roles can be assigned to one or multiple users. Each user can be a member of one
or multiple roles. Users inherit all of the permissions from each role they are
in.

#### Rule

A rule is an explicit statement which grants a particular permission to a
particular resource.

#### Organization

An organization is the top-level resource for RBAC. Each organization can
contain one or multiple environments.

#### Environment

An environment contains a set of resources and represent a logical division,
such as `development`, `staging` and `production`. An environment belongs to a
single organization.

## Resource Hierarchy

* Each **environment** belongs to only one organization.
* Each **resource** belongs to only one environment.

![RBAC](assets/rbac.png)

## Organizations

The initial installation of Sensu includes a `default` organization.

You can create additional organizations to easily achieve multitenancy within
a single Sensu cluster.

### Viewing Organizations
To view all the organizations currently configured in your Sensu installation,
run the following:

{{< highlight shell >}}
sensuctl organization list
{{< /highlight >}}

### Managing Organizations

To add a new organization, simply call the `sensuctl` organization create
command with it's intended name.

{{< highlight shell >}}
sensuctl organization create acme
{{< /highlight >}}

To remove an organization from the system, run the `delete` subcommand.

{{< highlight shell >}}
sensuctl organization delete acme
{{< /highlight >}}

## Environments

The initial installation of Sensu includes a `default` environment,
included in the `default` organization.

You can create additional environments to map your development workflow.

### Viewing Environments
To view all the environments currently configured in your Sensu installation,
run the following:

{{< highlight shell >}}
sensuctl environment list
{{< /highlight >}}

### Managing Environments

To add a new environment, simply call the `sensuctl` environment create
command with it's intended name.

{{< highlight shell >}}
sensuctl environment create dev
{{< /highlight >}}

To remove an environment from the system, run the `delete` subcommand.

{{< highlight shell >}}
sensuctl environment delete dev
{{< /highlight >}}
