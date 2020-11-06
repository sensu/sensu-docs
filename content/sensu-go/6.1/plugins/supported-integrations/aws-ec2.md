---
title: "EC2 integration"
linkTitle: "EC2"
description: "Use the Sensu EC2 Handler plugin to integrate Sensu with your existing EC2 workflows. Read about the features of Sensu's EC2 integration and learn how to get the plugin."
version: "6.1"
product: "Sensu Go"
menu: 
  sensu-go-6.1:
    parent: supported-integrations
---

The Sensu EC2 Handler plugin is a Sensu [handler][1] that checks an AWS EC2 instance and removes it from Sensu if it is not in one of the specified states.

{{% notice note %}}
**NOTE**: The Sensu EC2 Handler plugin is an example of Sensu's alerting and incident management integrations.
To find more integrations, search [Bonsai, the Sensu asset index](https://bonsai.sensu.io/).
{{% /notice %}}

## Features

**NEED TO COMPLETE** Can use environment variables and secrets management to avoid exposing your EC2 API token, username/password, and other sensitive information? Are there other features to add here?

- Tunable arguments: use Sensu annotations to set custom instance ID, instance ID labels, timeouts, and more in EC2
- [Event-based templating][2]: include observation data from event attributes to add meaningful, actionable context.

## Get the plugin

Add the [Sensu EC2 Handler plugin][4] with a dynamic runtime asset from Bonsai, the Sensu asset index, to build your own workflow or integrate Sensu with your existing EC2 workflows.
[Dynamic runtime assets][5] are shareable, reusable packages that make it easier to deploy Sensu plugins.


[1]: ../../../observability-pipeline/observe-process/handlers/
[2]: ../../../observability-pipeline/observe-process/handler-templates/
[4]: https://bonsai.sensu.io/assets/sensu/sensu-ec2-handler
[5]: ../../assets
[6]: ../../../commercial/
