---
title: "SaltStack integration"
linkTitle: "SaltStack"
description: "Use the Sensu SaltStack Handler integration to launch SaltStack functions for automated remediation based on Sensu observability event data."
version: "6.6"
product: "Sensu Go"
menu: 
  sensu-go-6.6:
    parent: supported-integrations
---

{{% notice commercial %}}
**COMMERCIAL FEATURE**: Access the Sensu SaltStack Handler integration in the packaged Sensu Go distribution.
For more information, read [Get started with commercial features](../../../commercial/).
{{% /notice %}}

The [Sensu SaltStack Handler plugin][4] is a Sensu [handler][1] that launches SaltStack functions for automated remediation based on Sensu event data.

{{% notice note %}}
**NOTE**: The Sensu SaltStack Handler plugin is an example of Sensu's auto-remediation integrations.
To find more integrations, search [Bonsai, the Sensu asset hub](https://bonsai.sensu.io/).
{{% /notice %}}

## Features

The [Sensu SaltStack Handler plugin][4] supports both SaltStack Enterprise and SaltStack Open Source as well as SaltStack functions such as `service`, `state`, `saltutil`, and `grains` (including `arg` and `kwarg` arguments).

- Specify SaltStack functions and trigger parameters for remediation actions for a check with Sensu annotations.
- Use [event-based templating][2] to specify the minion to target for rememdiation based on event data.
- Keep your SaltStack username and password secure with Sensu [environment variables and secrets management][7].

## Get the plugin

For a turnkey experience with the Sensu SaltStack Handler plugin, use our curated, configurable [quick-start template][3] to integrate Sensu with your existing SaltStack workflows.

You can also add the [Sensu SaltStack Handler plugin][4] with a dynamic runtime asset from Bonsai, the Sensu asset hub, to build your own workflow or integrate Sensu with your existing SaltStack workflows.
[Dynamic runtime assets][5] are shareable, reusable packages that make it easier to deploy Sensu plugins.


[1]: ../../../observability-pipeline/observe-process/handlers/
[2]: ../../../observability-pipeline/observe-process/handler-templates/
[3]: https://github.com/sensu/catalog/blob/main/pipelines/remediation/saltstack.yaml
[4]: https://bonsai.sensu.io/assets/sensu/sensu-saltstack-handler
[5]: ../../assets/
[7]: ../../../operations/manage-secrets/
