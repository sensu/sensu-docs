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
Through the combination of composable building blocks and robust APIs, Sensu allows you to define your entire monitoring workflow as declarative YAML or JSON code in configuration files.
Teams can share and remix monitoring workflows that include Sensu resources for collecting observability events and metrics, diagnosing issues, sending alerts, and automatically remediating problems.

In the monitoring as code approach, when a new endpoint starts up, like a cloud compute instance or Kubernetes Pod, Sensu automatically registers itself with the platform and starts collecting monitoring and observability data according to the code in your configuration files.
Manage your monitoring and observability workflow as code, the same way you manage the systems you're monitoring, to improve visibility, reliability, portability, and repeatability.

- Share, edit, review, and version your Sensu workflow configuration files just like you would with other "as code" solutions, within one team or among teams across your organization.
- Maintain revision control and change history for your monitoring workflows.
- Export your Sensu configuration from one environment and initialize another environment with the same configuration.
- Remove, restore, back up, and recover Sensu instances based on Sensu workflow configuration files.
- Use `sensuctl prune` to consistently apply changes to your monitoring workflows with a single command.
- Include your monitoring workflow in your centralized continuous integration/continuous delivery (CI/CD) pipeline to keep your monitoring aligned with your product and services.

## Create a monitoring as code repository

A monitoring as code repository will include configuration files that contain the resource definitions you use in your monitoring workflow.
You can use any source control repository for maintaining your monitoring workflow configuration files.

Getting started with a monitoring as code repository requires you to make some structure and strategy decisions.
Your repository structure and configuration file strategy will depend on how you use your repository and how you approach creating Sensu resources.

### Monitoring as code repository structure

The way you will use your Sensu workflow configuration files will help you choose the best structure for your monitoring as code repository.

For example, if you want to share complete end-to-end Sensu workflows with your colleagues, you might save all of the resource definitions for each workflow in a single file.
This allows others to read through an entire workflow without interruption.

However, if you are more likely to share individual workflow components, it makes more sense to use individual files for different types of resources, like one file for all of your checks, one file for all of your handlers, and so on.
You could also save one definition per file for even more granular sharing.

[SensuFlow][5], our GitHub Action for managing Sensu resources via repository commits, requires a repository structure organized by clusters and namespaces.
All resources of each type for each namespace are saved in a single configuration file:

{{< code shell >}}
.sensu/
  cluster/
    namespaces.yml
  namespaces/
    <namespace>/
      checks/
      hooks/
      filters/
      handlers/
      handlersets/
      mutators/
{{< /code >}}

### Configuration file strategy

You can [build configuration files as you go][6], adding resource definitions as you create them, to populate your monitoring as code repository.
You can also create your entire Sensu monitoring workflow first, then [export some or all of your resource definitions][7] to standard out (STDOUT) or to a file.

When you are ready to replicate your exported resource definitions, use [`sensuctl create`][1].

{{% notice note %}}
**NOTE**: You cannot replicate API key or user resources from a `sensuctl dump` export.<br><br>
API keys must be reissued, but you can use your exported configuration file as a reference for granting new API keys to replace the exported keys.<br><br>
When you export users, required password attributes are not included.
You must add a [`password_hash`](../sensuctl/#generate-a-password-hash) or `password` to `users` resources before replicating them with the `sensuctl create` command.
{{% /notice %}}

#### Build as you go

To build as you go, use sensuctl commands to retrieve your Sensu resource definitions as you create them and copy the definitions into your configuration files.

For example, if you followed [Monitor server resources][8] and created a check named `check-cpu`, you can retrieve that check definition in YAML or JSON format:

{{< language-toggle >}}

{{< code shell "YML" >}}
sensuctl check info check-cpu --format yaml
{{< /code >}}

{{< code shell "JSON" >}}
sensuctl check info check-cpu --format wrapped-json
{{< /code >}}

{{< /language-toggle >}}

The sensuctl response will include the complete `check-cpu` resource definition in the specified format:

{{< language-toggle >}}

{{< code yml >}}
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

{{< code json >}}
{
  "type": "CheckConfig",
  "api_version": "core/v2",
  "metadata": {
    "created_by": "admin",
    "name": "check-cpu",
    "namespace": "default"
  },
  "spec": {
    "check_hooks": null,
    "command": "check-cpu.rb -w 75 -c 90",
    "env_vars": null,
    "handlers": [
      "slack"
    ],
    "high_flap_threshold": 0,
    "interval": 60,
    "low_flap_threshold": 0,
    "output_metric_format": "",
    "output_metric_handlers": null,
    "proxy_entity_name": "",
    "publish": true,
    "round_robin": false,
    "runtime_assets": [
      "cpu-checks-plugins",
      "sensu-ruby-runtime"
    ],
    "secrets": null,
    "stdin": false,
    "subdue": null,
    "subscriptions": [
      "system"
    ],
    "timeout": 0,
    "ttl": 0
  }
}
{{< /code >}}

{{< /language-toggle >}}

You can copy these resource definitions and paste them into manually created configuration files located anywhere on your system.

Alternatively, you can view resource definitions and copy them into a new or existing configuration file with a single sensuctl command.
To use the following examples, replace `RESOURCE` with the resource type (like `check`) and replace `RESOURCE_NAME` with the name of the resource (like `check-cpu`).

- Copy the resource defintion to a new file (or overwrite an existing file with the same name):

  {{< language-toggle >}}

{{< code shell "YML" >}}
sensuctl RESOURCE info RESOURCE_NAME --format yaml > resource.yml
{{< /code >}}

{{< code shell "JSON" >}}
sensuctl RESOURCE info RESOURCE_NAME --format wrapped-json > resource.json
{{< /code >}}

{{< /language-toggle >}}

- Copy the resource defintion to a new file (or overwrite an existing file with the same name) and show the resource definition in STDOUT:

  {{< language-toggle >}}

{{< code shell "YML" >}}
sensuctl RESOURCE info RESOURCE_NAME --format yaml | tee resource.yml
{{< /code >}}

{{< code shell "JSON" >}}
sensuctl RESOURCE info RESOURCE_NAME --format wrapped-json | tee resource.json
{{< /code >}}

{{< /language-toggle >}}

- Append the resource defintion to an existing file:

  {{< language-toggle >}}

{{< code shell "YML" >}}
sensuctl RESOURCE info RESOURCE_NAME --format yaml >> resource.yml
{{< /code >}}

{{< code shell "JSON" >}}
sensuctl RESOURCE info RESOURCE_NAME --format wrapped-json >> resource.json
{{< /code >}}

{{< /language-toggle >}}

- Append the resource defintion to an existing file and show the resource definition in STDOUT:

  {{< language-toggle >}}

{{< code shell "YML" >}}
sensuctl RESOURCE info RESOURCE_NAME --format yaml | tee -a resource.yml
{{< /code >}}

{{< code shell "JSON" >}}
sensuctl RESOURCE info RESOURCE_NAME --format wrapped-json | tee -a resource.json
{{< /code >}}

{{< /language-toggle >}}

#### Export existing resources

If you've already created a monitoring workflow, use `sensuctl dump` to create a copy of your existing resource definitions.

First, create a sensu directory:

{{< code shell >}}
mkdir sensu
{{< /code >}}
   
Then, copy your workflow resource definitions according to the [repository structure][11] you are using.
For example, if you want to save resources according to type and namespace, this command will save all of your check definitions for the `dev` namespace in one configuration file:

{{< language-toggle >}}

{{< code shell "YML" >}}
sensuctl dump core/v2.CheckConfig \
--namespace dev \
--format yaml | > sensu/namespaces/dev/checks.yml
{{< /code >}}

{{< code shell "JSON" >}}
sensuctl dump core/v2.CheckConfig \
--namespace dev \
--format wrapped-json | > sensu/namespaces/dev/checks.json
{{< /code >}}

{{< /language-toggle >}}

Repeat this command for each resource type in each of your namespaces.

##### Strip namespaces from resource definitions

To [replicate and reuse resources][5] in any namespace without manual editing, create a copy of your existing resources with the namespaces stripped from their definitions:

{{< language-toggle >}}

{{< code shell "YML" >}}
sensuctl dump all \
--all-namespaces \
--format yaml | grep -v "^\s*namespace:" > sensu/resources.yml
{{< /code >}}

{{< code shell "JSON" >}}
sensuctl dump all \
--all-namespaces \
--format wrapped-json | grep -v "^\s*namespace:" > sensu/resources.json
{{< /code >}}

{{< /language-toggle >}}

## Implement monitoring as code with SensuFlow

There's no one "correct" way to implement monitoring as code, but the [SensuFlow GitHub Action][1] offers a turnkey reference implementation that helps you create your own monitoring as code workflow and start managing Sensu resources via repository commits.

SensuFlow is a git-based, prescriptive monitoring as code workflow that uses [sensuctl][2] (including [sensuctl prune][3]) to synchronize your monitoring and observability code with your Sensu deployments.

{{% notice note %}}
**NOTE**: SensuFlow is available for technical preview, and individual components in the workflow may change.
Before you use SensuFlow in production, test it in a development environment or a dedicated test namespace in your current environment.
{{% /notice %}}

SensuFlow requires:

- A monitoring code repository of Sensu resource definitions
- A Sensu [role-based access control (RBAC)][4] service account with permission to manage all resources in your repository
- A resource labeling convention to designate which resources the SensuFlow workflow should manage
- Integration with your CI/CD system to run sensuctl commands as the service account user from the repository of resource definitions

Read the [SensuFlow GitHub Action marketplace page][1] and [Monitoring as code with Sensu Go and SensuFlow][12] for more information.

## Use CI/CD with monitoring as code

When you're ready to expand your monitoring as code practices to involve CI/CD and multiple Sensu clusters, you can bootstrap your Sensu clusters with service accounts that are granted permissions for managing Sensu configuration.

For example, the following role and role binding configuriations allow subjects to manage all configuration in a given namespace:

TODO: add role and role binding examples

## Best practices for monitoring as code

The monitoring as code approach is flexible &mdash; it allows you to use any source control repository and does not require a specific directory structure &mdash; following a few best practices will contribute to a successful implementation.

- To maintain consistency, save all of your resources as only one file type: YAML or JSON.
- Include all dependencies within a resource definition.
For example, if a handler requires a dynamic runtime asset and a secret, include the asset and secret definitions with the definition for the handler itself.
- Add a workflow label in your resource definitions to designate which resources are part of which monitoring as code workflows. These labels will be helpful if you decide to use a CI/CD pipeline to manage your monitoring as code repository.


[1]: https://github.com/marketplace/actions/sensuflow
[2]: ../../sensuctl/
[3]: ../../sensuctl/create-manage-resources/#sensuctl-prune
[4]: ../control-access/rbac/
[5]: #implement-monitoring-as-code-with-sensuflow
[6]: #build-as-you-go
[7]: #export-existing-resources
[8]: ../../observability-pipeline/observe-schedule/monitor-server-resources/
[9]: ../../sensuctl/create-manage-resources/#create-resources-across-namespaces
[10]: ../sensuctl/create-manage-resources/#create-resources
[11]: #choose-a-monitoring-as-code-repository-structure
[12]: https://sensu.io/blog/monitoring-as-code-with-sensu-flow
