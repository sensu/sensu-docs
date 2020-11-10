---
title: "SaltStack integration"
linkTitle: "SaltStack"
description: "Use the Sensu SaltStack Handler plugin to integrate Sensu with your existing SaltStack workflows. Read about the features of Sensu's SaltStack integration and learn how to get the plugin."
version: "6.1"
product: "Sensu Go"
menu: 
  sensu-go-6.1:
    parent: supported-integrations
---

**COMMERCIAL FEATURE**: Access the Sensu SaltStack Handler integration in the packaged Sensu Go distribution.
For more information, see [Get started with commercial features][6].

The Sensu SaltStack Handler plugin is a Sensu [handler][1] that launches SaltStack functions for automated remediation based on Sensu event data.

{{% notice note %}}
**NOTE**: The Sensu SaltStack Handler plugin is an example of Sensu's auto-remediation integrations.
To find more integrations, search [Bonsai, the Sensu asset index](https://bonsai.sensu.io/).
{{% /notice %}}

## Features

- Use Sensu annotations to specify SaltStack functions and trigger parameters for remediation actions for a check.
- Supports both SaltStack Enterprise and SaltStack Open Source.
- Supports SaltStack functions such as `service`, `state`, `saltutil`, and `grains` including `arg` and `kwarg` arguments.
- Can use [environment variables and secrets management][7] to avoid exposing your SaltStack username/password.
- [Event-based templating][2]: make use of event data to specify the minion to target for rememdiation.

## Get the plugin

For a turnkey experience with the Sensu SaltStack Handler plugin, use our curated, configurable [quick-start template][3] to integrate Sensu with your existing SaltStack workflows.

You can also add the [Sensu SaltStack Handler plugin][4] with a dynamic runtime asset from Bonsai, the Sensu asset index, to build your own workflow or integrate Sensu with your existing SaltStack workflows.
[Dynamic runtime assets][5] are shareable, reusable packages that make it easier to deploy Sensu plugins.


[1]: ../../../observability-pipeline/observe-process/handlers/
[2]: ../../../observability-pipeline/observe-process/handler-templates/
[3]: https://github.com/sensu-community/monitoring-pipelines/blob/latest/remediation/saltstack.yaml
[4]: https://bonsai.sensu.io/assets/sensu/sensu-saltstack-handler
[5]: ../../assets
[6]: ../../../commercial/
[7]: ../../../operations/manage-secrets/
