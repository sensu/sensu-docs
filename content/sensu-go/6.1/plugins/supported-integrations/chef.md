---
title: "Chef integration"
linkTitle: "Chef"
description: "Use the Sensu Chef Handler plugin to integrate Sensu with your existing Chef workflows. Read about the features of Sensu's Chef integration and learn how to get the plugin."
version: "6.1"
product: "Sensu Go"
menu: 
  sensu-go-6.1:
    parent: supported-integrations
---

The Sensu Chef Handler plugin is a Sensu [handler][1] that deletes a Sensu entity with a failing keepalive check when the entity's corresponding Chef node no longer exists.

{{% notice note %}}
**NOTE**: The Sensu Chef Handler plugin is an example of Sensu's deregistration integrations.
To find more integrations, search [Bonsai, the Sensu asset index](https://bonsai.sensu.io/).
{{% /notice %}}

## Features

**NEED TO COMPLETE** Does the Chef integration allow users to use environment variables and secrets management to avoid exposing sensitive information? Does event-based templating apply for the Chef integration? Are there other features to add here?

- [Event-based templating][2]: include observation data from event attributes to add meaningful, actionable context.

## Get the plugin

Add the [Sensu Chef Handler plugin][4] with a dynamic runtime asset from Bonsai, the Sensu asset index, to build your own workflow or integrate Sensu with your existing Chef workflows.
[Dynamic runtime assets][5] are shareable, reusable packages that make it easier to deploy Sensu plugins.

## Configuration management

Use the official [Chef Cookbook for Sensu Go][3] for configuration management for your Sensu instance.


[1]: ../../../observability-pipeline/observe-process/handlers/
[2]: ../../../observability-pipeline/observe-process/handler-templates/
[3]: https://github.com/sensu/sensu-go-chef
[4]: https://bonsai.sensu.io/assets/sensu/sensu-chef-handler
[5]: ../../assets
