---
title: "Chef integration"
linkTitle: "Chef"
description: "Use the Sensu Chef Handler integration to delete a Sensu entity with a failing keepalive check when the entity's corresponding Chef node no longer exists."
version: "6.4"
product: "Sensu Go"
menu: 
  sensu-go-6.4:
    parent: featured-integrations
---

The [Sensu Chef Handler plugin][4] is a Sensu [handler][1] that deletes a Sensu entity with a failing keepalive check when the entity's corresponding Chef node no longer exists.

{{% notice note %}}
**NOTE**: The Sensu Chef Handler plugin is an example of Sensu's deregistration integrations.
To find more integrations, search [Bonsai, the Sensu asset hub](https://bonsai.sensu.io/).
{{% /notice %}}

## Features

- Use Sensu annotations to override Sensu entity names with corresponding Chef node names.
- Keep your sensitive API authentication information secure with Sensu [environment variables and secrets management][6].

## Get the plugin

Add the [Sensu Chef Handler plugin][4] with a dynamic runtime asset from Bonsai, the Sensu asset hub, to build your own workflow or integrate Sensu with your existing Chef workflows.
[Dynamic runtime assets][5] are shareable, reusable packages that make it easier to deploy Sensu plugins.

## Configuration management

Use the official [Chef Cookbook for Sensu Go][3] for configuration management for your Sensu instance.


[1]: ../../../observability-pipeline/observe-process/handlers/
[2]: ../../../observability-pipeline/observe-process/handler-templates/
[3]: https://supermarket.chef.io/cookbooks/sensu-go
[4]: https://bonsai.sensu.io/assets/sensu/sensu-chef-handler
[5]: ../../assets
[6]: ../../../operations/manage-secrets/
