---
title: "EC2 integration"
linkTitle: "EC2"
description: "Use the Sensu EC2 Handler integration to set custom values in EC2 based on Sensu Go observability event data and protect your EC2 authentication details."
version: "6.6"
product: "Sensu Go"
menu: 
  sensu-go-6.6:
    parent: supported-integrations
---

The [Sensu EC2 Handler plugin][4] is a Sensu [handler][1] that checks an AWS EC2 instance and removes it from Sensu if it is not in one of the specified states.

{{% notice note %}}
**NOTE**: The Sensu EC2 Handler plugin is an example of Sensu's deregistration integrations.
To find more integrations, search [Bonsai, the Sensu asset hub](https://bonsai.sensu.io/).
{{% /notice %}}

## Features

- Tunable arguments: use Sensu annotations to set custom instance ID, instance ID labels, timeouts, and more in EC2.
- Specify custom values for Sensu event metric points via [metric tags][7].
- Keep your AWS EC2 API token, username, and password secure with Sensu [environment variables and secrets management][3].

## Get the plugin

For a turnkey experience with the Sensu EC2 Handler plugin, use our curated, configurable [quick-start template][8] to integrate Sensu with your existing AWS EC2 workflows.

You can also add the [Sensu EC2 Handler plugin][4] with a dynamic runtime asset from Bonsai, the Sensu asset hub, to build your own workflow or integrate Sensu with your existing EC2 workflows.
[Dynamic runtime assets][5] are shareable, reusable packages that make it easier to deploy Sensu plugins.

## More resources

Set up a [limited service account][9] with the access and permissions required to automatically remove AWS EC2 instances using the Sensu EC2 Handler integration.


[1]: ../../../observability-pipeline/observe-process/handlers/
[2]: ../../../observability-pipeline/observe-process/handler-templates/
[3]: ../../../operations/manage-secrets/
[4]: https://bonsai.sensu.io/assets/sensu/sensu-ec2-handler
[5]: ../../assets
[6]: ../../../commercial/
[7]: ../../../observability-pipeline/observe-schedule/checks/#output-metric-tags
[8]: https://github.com/sensu/catalog/blob/main/pipelines/deregistration/aws-ec2.yaml
[9]: ../../../operations/control-access/create-limited-service-accounts/
