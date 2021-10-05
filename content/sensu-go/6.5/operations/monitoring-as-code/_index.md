---
title: "Monitoring as code with Sensu"
linkTitle: "Monitoring as Code"
description: "Sensu's end-to-end monitoring as code approach allows you to manage your observability configurations the same way you build, test, and deploy your applications and infrastructure, like Kubernetes and Terraform. Read this page to learn about using a monitoring as code approach with Sensu."
product: "Sensu Go"
version: "6.5"
weight: 5
layout: "single"
toc: true
menu:
  sensu-go-6.5:
    parent: operations
    identifier: monitoring-as-code
---

Sensu's end-to-end monitoring as code approach allows you to manage your observability configuration the same way you build, test, and deploy your applications and infrastructure, like Kubernetes and Terraform.
Monitoring as code combines composable building blocks with robust APIs so you can define your entire observability configuration as declarative YAML or JSON code and improve visibility, reliability, portability, and repeatability.

When a new endpoint starts up, like a cloud compute instance or Kubernetes Pod, Sensu automatically registers itself with the platform and starts collecting observability data according to the code in your configuration files.
Teams can share and remix observability configurations for collecting events and metrics, diagnosing issues, sending alerts, and automatically remediating problems.

- Share, edit, review, and version your observability configuration files just like you would with other "as code" solutions, within one team or among teams across your organization.
- Maintain revision control and change history for your observability configurations.
- Export the Sensu configuration for one environment and replicate the same configuration in other environments.
- Remove, restore, back up, and recover Sensu instances based on your Sensu configuration files.
- Include your observability configuration in your centralized continuous integration/continuous delivery (CI/CD) pipeline to keep your configuration files aligned with your product and services.

To get started with monitoring as code, you'll need a [repository][11] and [configuration files][13] that contain your resource definitions.

## Create a monitoring as code repository

Create a monitoring as code repository for the configuration files that contain the Sensu resource definitions you use for monitoring and observability.
You can use any source control repository.

The way you will use your [configuration files][13] will help you choose the best structure for your monitoring as code repository.
For example, if you are likely to share observability components or manage your configuration files as part of your CI/CD workflow, it probably makes sense to use individual configuration files for different types of resources: one file for all of your checks, one file for all of your handlers, and so on.
If you want to facilitate more granular sharing, you can save one resource definition per file.

If you want to share complete end-to-end observability configurations with your colleagues, you might save all of the resource definitions for each observability configuration in a single configuration file.
This allows others to read through an entire configuration without interruption, and it's convenient for demonstrating a complete Sensu configuration.
However, a single configuration file that includes every resource type isn't the best structure for CI/CD management or sharing resources among teams.

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

## Adopt a configuration file strategy

Configuration files contain your Sensu resource definitions.
You can [build configuration files as you go][6], adding resource definitions as you create them.
You can also create your entire observability configuration first, then [export some or all of your resource definitions][7] to a file.
Or, you can use a mix: export all of your existing resource definitions to configuration files and append new resources as you create them.

When you are ready to replicate your exported resource definitions, use [`sensuctl create`][10].

{{% notice note %}}
**NOTE**: You cannot replicate API key or user resources from a `sensuctl dump` export.<br><br>
API keys must be reissued, but you can use your exported configuration file as a reference for granting new API keys to replace the exported keys.<br><br>
When you export users, required password attributes are not included.
You must add a [`password_hash`](../../sensuctl/#generate-a-password-hash) or `password` to `users` resources before replicating them with the `sensuctl create` command.
{{% /notice %}}

### Build as you go

To build as you go, use sensuctl commands to retrieve your Sensu resource definitions as you create them and copy the definitions into your configuration files.

For example, if you follow [Monitor server resources][8] and create a check named `check_cpu`, you can retrieve that check definition in YAML or JSON format with sensuctl:

{{< language-toggle >}}

{{< code shell "YML" >}}
sensuctl check info check_cpu --format yaml
{{< /code >}}

{{< code shell "JSON" >}}
sensuctl check info check_cpu --format wrapped-json
{{< /code >}}

{{< /language-toggle >}}

The sensuctl response will include the complete `check_cpu` resource definition in the specified format:

{{< language-toggle >}}

{{< code yml >}}
---
type: CheckConfig
api_version: core/v2
metadata:
  created_by: admin
  name: check_cpu
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
    "name": "check_cpu",
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

If you prefer, you can also [view JSON resource definitions in the Sensu web UI][14].

You can copy these resource definitions and paste them into manually created configuration files located anywhere on your system.

Alternatively, you can view resource definitions and copy them into a new or existing configuration file with a single sensuctl command.
To use the following examples, replace `<resource>` with the resource type (like `check`) and replace `<resource_name>` with the name of the resource (like `check_cpu`).

- Copy the resource defintion to a new file (or overwrite an existing file with the same name):

  {{< language-toggle >}}

{{< code shell "YML" >}}
sensuctl <resource> info <resource_name> --format yaml > resource.yml
{{< /code >}}

{{< code shell "JSON" >}}
sensuctl <resource> info <resource_name> --format wrapped-json > resource.json
{{< /code >}}

{{< /language-toggle >}}

- Copy the resource defintion to a new file (or overwrite an existing file with the same name) and show the resource definition in STDOUT:

  {{< language-toggle >}}

{{< code shell "YML" >}}
sensuctl <resource> info <resource_name> --format yaml | tee resource.yml
{{< /code >}}

{{< code shell "JSON" >}}
sensuctl <resource> info <resource_name> --format wrapped-json | tee resource.json
{{< /code >}}

{{< /language-toggle >}}

- Append the resource defintion to an existing file:

  {{< language-toggle >}}

{{< code shell "YML" >}}
sensuctl <resource> info <resource_name> --format yaml >> resource.yml
{{< /code >}}

{{< code shell "JSON" >}}
sensuctl <resource> info <resource_name> --format wrapped-json >> resource.json
{{< /code >}}

{{< /language-toggle >}}

- Append the resource defintion to an existing file and show the resource definition in STDOUT:

  {{< language-toggle >}}

{{< code shell "YML" >}}
sensuctl <resource> info <resource_name> --format yaml | tee -a resource.yml
{{< /code >}}

{{< code shell "JSON" >}}
sensuctl <resource> info <resource_name> --format wrapped-json | tee -a resource.json
{{< /code >}}

{{< /language-toggle >}}

### Export existing resources

If you've already created observability resources, use `sensuctl dump` to create a copy of your existing resource definitions.

First, create a sensu directory:

{{< code shell >}}
mkdir sensu
{{< /code >}}
   
Then, copy your observability resource definitions according to the [repository structure][11] you are using.
For example, if you want to save resources according to type and namespace, this command will save all of your check definitions for the `production` namespace in one configuration file:

{{< language-toggle >}}

{{< code shell "YML" >}}
sensuctl dump core/v2.CheckConfig \
--namespace production \
--format yaml | > sensu/namespaces/production/checks.yml
{{< /code >}}

{{< code shell "JSON" >}}
sensuctl dump core/v2.CheckConfig \
--namespace production \
--format wrapped-json | > sensu/namespaces/production/checks.json
{{< /code >}}

{{< /language-toggle >}}

Repeat this command for each resource type in each of your namespaces.

#### Strip namespaces from resource definitions

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

## Best practices for monitoring as code

The monitoring as code approach is flexible &mdash; you can use any source control repository and choose your own directory structure &mdash; but following a few best practices will contribute to a successful implementation.

- To maintain consistency, save all of your resources as only one file type: YAML or JSON.
- Include all dependencies within a resource definition.
For example, if a handler requires a dynamic runtime asset and a secret, include the asset and secret definitions with the definition for the handler itself.
- Choose the labels you use in your resource definitions with care.
CI/CD systems like [SensuFlow][5] rely on labels to determine which resources to delete, so if all of your resources have the same labels, you could delete resources you didn't intend to be managed in a particular CI/CD workflow.
- Establish a resource-labeling schema throughout your organization to facilitate CI/CD.
Following the same method for applying labels helps keep unmanaged Sensu resources from multiplying and allows different teams to confidently deploy their own CI/CD workflows without the risk of accidentally deleting another team's resources.

## Implement CI/CD with monitoring as code

When you're ready, you can expand your monitoring as code practices to include managing your Sensu configuration files with a CI/CD workflow.
CI/CD takes the manual work out of maintaining and updating your monitoring as code repository so that any updates to the Sensu resources in your monitoring as code repository are reflected in your Sensu configuration in a timely manner.

If you’re already using CI/CD, you already have workflows for versioning, building, testing, and deploying your code.
Integrating monitoring as code means your monitoring can go through the same CI/CD workflows as your code.

There's no one "correct" way to implement CI/CD with monitoring as code, but the [SensuFlow GitHub Action][5] offers a turnkey reference implementation that helps you create your own monitoring as code workflow and start managing Sensu resources via repository commits.

### Use SensuFlow for CI/CD monitoring as code

SensuFlow is a git-based, prescriptive monitoring as code workflow that uses [sensuctl][2] (including [sensuctl prune][3]) to synchronize your monitoring and observability code with your Sensu deployments.

{{% notice note %}}
**NOTE**: SensuFlow is available for technical preview, and individual components in the workflow may change.
Before you use SensuFlow in production, test it in a development environment or a dedicated test namespace in your current environment.
{{% /notice %}}

SensuFlow requires:

- A code repository of Sensu resource definitions
- A Sensu [role-based access control (RBAC)][4] service account with permission to manage all resources in your repository
- A resource labeling convention to designate which resources the SensuFlow workflow should manage
- Integration with your CI/CD system to run sensuctl commands as the service account user from the repository of resource definitions

Read the [SensuFlow GitHub Action marketplace page][1] and [Monitoring as code with Sensu Go and SensuFlow][12] to use SensuFlow as your monitoring as code workflow.


[1]: https://github.com/marketplace/actions/sensuflow
[2]: ../../sensuctl/
[3]: ../../sensuctl/create-manage-resources/#sensuctl-prune
[4]: ../control-access/rbac/
[5]: #use-sensuflow-for-cicd-monitoring-as-code
[6]: #build-as-you-go
[7]: #export-existing-resources
[8]: ../../observability-pipeline/observe-schedule/monitor-server-resources/
[9]: ../../sensuctl/create-manage-resources/#create-resources-across-namespaces
[10]: ../../sensuctl/create-manage-resources/#create-resources
[11]: #create-a-monitoring-as-code-repository
[12]: https://sensu.io/blog/monitoring-as-code-with-sensu-flow
[13]: #adopt-a-configuration-file-strategy
[14]: ../../web-ui/view-manage-resources/#view-resource-data
