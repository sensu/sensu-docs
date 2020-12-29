---
title: "Puppet integration"
linkTitle: "Puppet"
description: "Use the Sensu Puppet Keepalive Handler plugin to integrate Sensu with your existing Puppet workflows. Read about the features of Sensu's Puppet integration and learn how to get the plugin."
version: "6.0"
product: "Sensu Go"
menu: 
  sensu-go-6.0:
    parent: supported-integrations
---

The [Sensu Puppet Keepalive Handler plugin][4] is a Sensu [handler][1] that deletes a Sensu entity with a failing keepalive check when the entity's corresponding Puppet node no longer exists or is deregistered.

{{% notice note %}}
**NOTE**: The Sensu Puppet Keepalive Handler plugin is an example of Sensu's deregistration integrations.
To find more integrations, search [Bonsai, the Sensu asset hub](https://bonsai.sensu.io/).
{{% /notice %}}

## Features

- Use Sensu annotations to override Sensu entity names with corresponding Puppet node names.
- Keep sensitive API authentication information secure with Sensu [environment variables and secrets management][6].

## Get the plugin

Add the [Sensu Puppet Keepalive Handler plugin][4] with a dynamic runtime asset from Bonsai, the Sensu asset hub, to build your own workflow or integrate Sensu with your existing Puppet workflows.
[Dynamic runtime assets][5] are shareable, reusable packages that make it easier to deploy Sensu plugins.

## Configuration management

Use the partner-supported [Sensu Puppet module][3] for configuration management for your Sensu instance.


[1]: ../../../observability-pipeline/observe-process/handlers/
[2]: ../../../observability-pipeline/observe-process/handler-templates/
[3]: https://forge.puppet.com/modules/sensu/sensu
[4]: https://bonsai.sensu.io/assets/sensu/sensu-puppet-handler
[5]: ../../assets
[6]: ../../../operations/manage-secrets/
