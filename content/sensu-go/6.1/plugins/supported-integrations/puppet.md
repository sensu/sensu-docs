---
title: "Puppet integration"
linkTitle: "Puppet"
description: "Use the Sensu Puppet Keepalive Handler plugin to integrate Sensu with your existing Puppet workflows. Read about the features of Sensu's Puppet integration and learn how to get the plugin."
version: "6.1"
product: "Sensu Go"
menu: 
  sensu-go-6.1:
    parent: supported-integrations
---

The Sensu Puppet Keepalive Handler plugin is a Sensu [handler][1] that deletes a Sensu entity with a failing keepalive check when the entity's corresponding Puppet node no longer exists or is deregistered.

{{% notice note %}}
**NOTE**: The Sensu Puppet Keepalive Handler plugin is an example of Sensu's deregistration integrations.
To find more integrations, search [Bonsai, the Sensu asset index](https://bonsai.sensu.io/).
{{% /notice %}}

## Features

**NEED TO COMPLETE** Does the Puppet integration allow users to use environment variables and secrets management to avoid exposing sensitive information? Does event-based templating apply for the Puppet integration? Are there other features to add here?

- Use Sensu annotations to override corresponding Puppet node names with Sensu event names.
- [Event-based templating][2]: include observation data from event attributes to add meaningful, actionable context.

## Get the plugin

Add the [Sensu Puppet Keepalive Handler plugin][4] with a dynamic runtime asset from Bonsai, the Sensu asset index, to build your own workflow or integrate Sensu with your existing Puppet workflows.
[Dynamic runtime assets][5] are shareable, reusable packages that make it easier to deploy Sensu plugins.

## Configuration management

Use the partner-supported [Sensu Puppet module][3] for configuration management for your Sensu instance.


[1]: ../../../observability-pipeline/observe-process/handlers/
[2]: ../../../observability-pipeline/observe-process/handler-templates/
[3]: https://github.com/sensu/sensu-puppet
[4]: https://bonsai.sensu.io/assets/sensu/sensu-Puppet-handler
[5]: ../../assets
