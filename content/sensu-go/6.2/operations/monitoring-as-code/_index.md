---
title: "Monitoring as Code with Sensu"
linkTitle: "Monitoring as Code"
description: "Read this page to learn about following a monitoring-as-code approach with Sensu."
product: "Sensu Go"
version: "6.2"
weight: 5
layout: "single"
toc: true
menu:
  sensu-go-6.2:
    parent: operations
    identifier: monitoring-as-code
---

Sensu supports end-to-end monitoring as code so you can manage your observability and monitoring workflows the same way you build, test, and deploy your applications and infrastructure.
Through the combination of composable building blocks and robust APIs, Sensu allows you to define your entire monitoring workflow as declarative YAML or JSON code in configuration files. From collecting observability events and metrics and diagnosing issues through sending alerts and automatically remediating problems, monitoring workflows can be shared and remixed across your organization.

In the monitoring as code approach, when a new endpoint starts up, like a cloud compute instance or Kubernetes Pod, Sensu automatically registers itself with the platform and starts collecting monitoring and observability data according to the code in your configuration files.
If you manage your monitoring and observability workflow in the same way you manage the systems you're monitoring &mdash; as code, using a centralized continuous integration/continuous delivery (CI/CD) pipeline &mdash; you can align your monitoring with your product and services and improve visibility, reliability, and repeatability.

- Your entire team can share, edit, review, and version Sensu configuration files just like they would with other "as-code" solutions.
- Export your Sensu configuration from one environment and initialize another environment with the same configuration.
- Use Sensu configuration files to remove, restore, back up, and recover Sensu instances.

## Create a monitoring as code repository

You can use any source control repository for maintaining your monitoring workflow configuration files.
Your monitoring as code repository should include configuration files with the resource definitions you use in your monitoring workflow.

Use `sensuctl dump` to [export some or all of your existing Sensu resource definitions][7] to standard out (STDOUT) or to a file.

You can also use sensuctl commands to retrieve your Sensu resource definitions as you create them so you can copy them into your configuration files.
For example, to retrieve the definition for a check named `check-cpu`:

{{< language-toggle >}}

{{< code shell "YML" >}}
sensuctl check info check-cpu --format yaml
type: CheckConfig
api_version: core/v2
metadata:
  created_by: admin
  name: check-cpu
  namespace: default
spec:
  check_hooks: null
  command: check-cpu.rb -w 75 -c 90
  env_vars: null
  handlers:
  - slack
  high_flap_threshold: 0
  interval: 60
  low_flap_threshold: 0
  output_metric_format: ""
  output_metric_handlers: null
  proxy_entity_name: ""
  publish: true
  round_robin: false
  runtime_assets:
  - cpu-checks-plugins
  - sensu-ruby-runtime
  secrets: null
  stdin: false
  subdue: null
  subscriptions:
  - system
  timeout: 0
  ttl: 0
{{< /code >}}

{{< code shell "JSON" >}}
sensuctl check info check-cpu --format json
{
  "command": "check-cpu.rb -w 75 -c 90",
  "handlers": [
    "slack"
  ],
  "high_flap_threshold": 0,
  "interval": 60,
  "low_flap_threshold": 0,
  "publish": true,
  "runtime_assets": [
    "cpu-checks-plugins",
    "sensu-ruby-runtime"
  ],
  "subscriptions": [
    "system"
  ],
  "proxy_entity_name": "",
  "check_hooks": null,
  "stdin": false,
  "subdue": null,
  "ttl": 0,
  "timeout": 0,
  "round_robin": false,
  "output_metric_format": "",
  "output_metric_handlers": null,
  "env_vars": null,
  "metadata": {
    "name": "check-cpu",
    "namespace": "default",
    "created_by": "admin"
  },
  "secrets": null
}
{{< /code >}}

{{< /language-toggle >}}

Many of our [guides][6] demonstrate how to create, update, and retrieve resource definitions in this way.

## Implement a monitoring as code workflow

There's no one "correct" way to implement monitoring as code.
To get started, try [SensuFlow][5], our GitHub Action for managing Sensu resources via repository commits.

## Best practices for monitoring as code

The repository of resource definitions can be any manner of source control repository (git, subversion, etc.). While a specific directory structure is not required, we will be suggesting one later in this document.

- To maintain consistency, save all of your resources as only one file type: YAML or JSON.
- Include all dependencies within a resource definition.
For example, if a handler requires a dynamic runtime asset and a secret, include the asset and secret definitions with the definition for the handler itself.

## Monitoring as code with SensuFlow

[SensuFlow][5] is a git-based, prescriptive monitoring as code workflow that uses [sensuctl][2] (including [sensuctl prune][3]) to synchronize your monitoring and observability code with your Sensu deployments.

{{% notice note %}}
**NOTE**: SensuFlow is available for technical preview, and individual components in the workflow may change.
Before you use SensuFlow in production, test it in a development environment or a dedicated test namespace in your current environment.
{{% /notice %}}

SensuFlow requires:

- A monitoring code repository of Sensu resource definitions
- A Sensu [role-based access control (RBAC)][4] service account with permission to manage all resources in your repository
- A resource labeling convention to designate which resources the SensuFlow workflow should manage
- Integration with your CI/CD system to run sensuctl commands as the service account user from the repository of resource definitions

Use the [SensuFlow GitHub Action][1], a turnkey reference implementation, to create your own monitoring as code workflow.


[1]: https://github.com/marketplace/actions/sensuflow
[2]: ../../sensuctl/
[3]: ../../sensuctl/create-manage-resources/#sensuctl-prune
[4]: ../control-access/rbac/
[5]: #monitoring-as-code-with-sensuflow
[6]: ../../guides/
[7]: ../../sensuctl/back-up-recover/
