---
title: "Rundeck integration"
linkTitle: "Rundeck"
description: "Use the Sensu Rundeck Handler plugin to integrate Sensu with your existing Rundeck workflows. Read about the features of Sensu's Rundeck integration and learn how to get the plugin."
version: "6.2"
product: "Sensu Go"
menu: 
  sensu-go-6.2:
    parent: supported-integrations
---

{{% notice commercial %}}
**COMMERCIAL FEATURE**: Access the Sensu Rundeck Handler integration in the packaged Sensu Go distribution.
For more information, read [Get started with commercial features](../../../commercial/).
{{% /notice %}}

The [Sensu Rundeck Handler plugin][4] is a Sensu [handler][1] that initiates Rundeck jobs for automated remediation based on Sensu event data.

{{% notice note %}}
**NOTE**: The Sensu Rundeck Handler plugin is an example of Sensu's auto-remediation integrations.
To find more integrations, search [Bonsai, the Sensu asset hub](https://bonsai.sensu.io/).
{{% /notice %}}

## Features

The [Sensu Rundeck Handler plugin][4] supports both Rundeck Enterprise and Rundeck Open Source and standard job invocation or webhook invocation.

- Specify Rundeck jobs and webhooks along with trigger parameters for remediation actions for a check with Sensu annotations.
- Use [event-based templating][2] to make use of event data to specify the node to target for rememdiation.
- Keep your Rundeck auth token and webhook secure with Sensu [environment variables and secrets management][8].

## Get the plugin

For a turnkey experience with the Sensu Rundeck Handler plugin, use one of our curated, configurable quick-start templates:

- [Rundeck job][7]
- [Rundeck webhook][3]

You can also add the [Sensu Rundeck Handler plugin][4] with a dynamic runtime asset from Bonsai, the Sensu asset hub, to build your own workflow or integrate Sensu with your existing Rundeck workflows.
[Dynamic runtime assets][5] are shareable, reusable packages that make it easier to deploy Sensu plugins.


[1]: ../../../observability-pipeline/observe-process/handlers/
[2]: ../../../observability-pipeline/observe-process/handler-templates/
[3]: https://github.com/sensu/catalog/blob/main/pipelines/remediation/rundeck-webhook.yaml
[4]: https://bonsai.sensu.io/assets/sensu/sensu-rundeck-handler
[5]: ../../assets/
[7]: https://github.com/sensu/catalog/blob/main/pipelines/remediation/rundeck.yaml
[8]: ../../../operations/manage-secrets/
