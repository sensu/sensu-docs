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
Sensu allows you to define your entire monitoring workflow as declarative YAML or JSON code in configuration files, from collecting observability events and metrics and diagnosing issues through sending alerts and automatically remediating problems.

In the monitoring as code approach, when a new endpoint starts up, like a cloud compute instance or Kubernetes Pod, Sensu automatically registers itself with the platform and starts collecting monitoring and observability data according to the code in your configuration files.
If you manage your monitoring and observability workflow in the same way as the systems you're monitoring &mdash; as code, using a centralized continuous integration/continuous deployment (CI/CD) pipeline &mdash; you can align your monitoring with your product and services and improve visibility, reliability, and repeatability.

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
To get started, try [SensuFlow][5], our git-based approach to managing Sensu resources.

## Best practices for monitoring as code

The repository of resource definitions can be any manner of source control repository (git, subversion, etc.). While a specific directory structure is not required, we will be suggesting one later in this document.

- To maintain consistency, save all of your resources as only one file type: YAML or JSON.
- Include all dependencies within a resource definition.
For example, if a handler requires a dynamic runtime asset and a secret, include the asset and secret definitions with the definition for the handler itself.

## Monitoring as code with SensuFlow

[SensuFlow][5] is a git-based approach to managing Sensu resources.

The [SensuFlow GitHub Action][1] is a prescriptive monitoring-as-code workflow that uses [sensuctl][2] (including [sensuctl prune][3]) to synchronize your monitoring and observability code with your Sensu deployments.

{{% notice note %}}
**NOTE**: SensuFlow is available for technical preview, and individual components in the workflow may change.
Before you use SensuFlow in production, test it in a development environment or a dedicated test namespace in your current environment.
{{% /notice %}}

SensuFlow requires:
- A monitoring code repository of Sensu resource definitions
- A Sensu [role-based access control (RBAC)][4] service account with permission to manage all resources in your repository
- A labeling convention to designate which resources should be managed by this workflow
- Integration with your CI/CD system that runs sensuctl commands as the aforementioned Sensu user from the repository of resource definitions

ractical monitoring as code with Sensu Go and SensuFlow
Embracing monitoring as code principles and deploying an observability pipeline are great first steps towards <successful outcomes>, but without a repeatable process it may be hard to grow adoption.  Together, SensuFlow and Sensu Go provide the process and tools to ensure <successful outcomes> for any monitoring as code initiative. 

SensuFlow is the result of over 8 years of extensive research, development, integration testing, and end-user feedback collected from professional services engagements in over 50 companies ranging from SMBs to industry-leading enterprise organizations with tens of thousands of nodes under active management by Sensu. 

How it works: 

Direct integration with CI/CD providers. The Sensu Go CLI (sensuctl) provides built-in support for unattended operation, making it easy to integrate on any CI/CD platform. At the time of this writing a turn-key reference implementation is available for GitHub Actions, with support for other CI/CD platform marketplaces coming in H2'21. 


Built-in configuration pruning. The Sensu Prune API (and `sensuctl prune` command) provide built-in support for keeping the running monitoring configuration in sync with the monitoring code. 


Label-based workflow facilitates self-service access to monitoring as code. Because Sensu Go was designed from the ground-up for multi-tenancy and self-service – thanks to built-in support for Namespaces and RBAC – it becomes very simple to implement multi-tenant monitoring as code workflows on top of the Sensu platform. The SensuFlow workflow can be applied to multiple application code repositories and their corresponding CI/CD pipelines, all integrated with a shared Sensu Go deployment. Thanks to the underlying support for label selectors in the Prune API, multiple disparate teams can create, modify, and remove monitoring code without inadvertently impacting neighboring teams. 













The use of sensuctl requires a Sensu user account with which to run commands. This user will need the appropriate RBAC permissions to manage the resources defined in your repository. If you are planning to manage namespaces using this workflow, these permissions need to be granted at the cluster level (cluster-role and cluster-role-binding). If the resources are confined to a single namespace, then the permissions can be granted within that namespace using a role and role-binding. This configuration (using a role and role-binding for namespace-specific resource management) requires Sensu Go 6.2.0 or newer — [download the latest version](http://sensu.io/downloads).

The workflow makes use of the `sensuctl prune` command for removing resources that are no longer defined in your repository. The `prune` command supports removing resources either by username of the resource creator or by a defined label. We will be making use of labels in this workflow as they are more readily visible in the resource definitions themselves. They also ensure that `prune` is working in an explicitly defined manner.

Finally, you need a CI/CD system to pull this all together such that any updates to the resources in your repository are reflected in your Sensu configuration in a timely manner. This tooling can be anything of your choosing (e.g., GitHub Actions, Jenkins, GitLab CI, etc.), it simply needs to be able to check for changes in your repository and to run a shell script containing the necessary commands. Our example later will be based on a GitHub Action.

Now, let’s start to put these pieces together.

## Setup
*The following instructions represent our opinionated setup — your configurations will reflect your individual environment.*

### RBAC

To use SensuFlow, the first step is to create a user with an appropriate cluster-role and cluster-role-binding. This is the user that will be used to manage your Sensu resources using this workflow. Following the principle of least privilege, you will want to limit this user’s access to only those resources that you will manage with this workflow.

In our example configuration, the following resources will be managed using SensuFlow:

Namespaces
Roles
Role-bindings
Assets
Handlers
Checks
Hooks
Filters
Mutators
Secrets

This list may not work for every environment. If you are working in a larger environment with multiple teams managing resources in disparate namespaces, your list may be limited to the more operational resources such as assets, checks, handlers, filters, mutators, and secrets.  Your organization’s security policies may also affect the rights granted to any automated workflow.

For any resource to be managed with this workflow the user will need to have get, create, update, and delete access to the listed resources.

The user created will need a password assigned and this password will be needed by your CI/CD system to configure sensuctl to run as this user. Create the password hash for the `password_hash` attribute in the RBAC definition below using the following command:

sensuctl user has-password <password string>

Create a file with the following contents (including the substitution of the `password_hash` created above):
```
---
type: ClusterRole
api_version: core/v2
metadata:
  name: sensu_flow
spec:
  rules:
  - resources:
    - namespaces
    - roles
    - rolebindings
    - assets
    - handlers
    - checks
    - hooks
    - filters
    - mutators
    - secrets
    verbs:
    - get
    - create
    - update
    - delete
---
type: ClusterRoleBinding
api_version: core/v2
metadata:
  name: sensu_flow
spec:
  role_ref:
    type: ClusterRole
    name: sensu_flow
  subjects:
  - type: Group
    name: sensu_flow
---
type: User
api_version: core/v2
metadata:
  name: sensu_flow
spec:
  disabled: false
  username: sensu_flow
  password_hash: $2a$10$fOZaPTkZhEPVbwbXHY4LV.M8mv8yskRjL9zAtqVaLR8ppFb5vJHZq
  groups:
  - sensu_flow
```

Run the following command to create the above RBAC configuration:

`sensuctl create -f </path/to/rbac-file.yaml>`

### Directory structure
The main driver behind using a prescribed directory structure is for maintainability and readability. You and your team need to find the solution that works best for your environment.

The directory structure we’ll use in our soon-to-be discussed GitHub Action (shown below) includes a top-level `namespaces.yaml` file containing the definitions for the namespaces we will manage with the workflow. Alongside that we have a namespaces directory that contains all of the resources for each namespace.

```
namespaces.yaml
namespaces/<namespace>/checks/<checkname>.yaml
namespaces/<namespace>/handlers/<setname>/set.yaml
namespaces/<namespace>/handlers/<setname>/<handlername>.yaml
namespaces/<namespace>/filters
namespaces/<namespace>/mutators
```

Some things to note from the above structure:

Handlers are defined according to [handler sets](https://docs.sensu.io/sensu-go/latest/reference/handlers/#handler-sets) so within each handler set directory, a definition for the set is contained in the set.yaml file.
You will see we do not have directories for assets, hooks, or secrets. This is because as part of our structure, any resource that requires an asset, hook, or secret will include those dependent definitions in their file.
### Resource labeling
As mentioned above, we advocate the use of labels in your resource definitions. The following snippet of a Slack handler definition shows the label that will be used in our GitHub Action.

---
type: Handler
api_version: core/v2
metadata:
  name: slack
  labels:
    sensu.io/workflow: sensu_flow
[...]

### Namespace specification
One final note on the resource definitions prior to discussing our GitHub Action: Since our Action can manage multiple namespaces, our sensuctl commands reference those namespaces explicitly. This means that the resource definitions in our repository should __not__ contain namespace attributes. If they do, they could potentially be created outside of the intended namespace. One side benefit of not including namespaces in the definitions and allowing the workflow to specify them is that it allows for easily replicating configurations by copying files between namespace directories.

## The SensuFlow GitHub Action

[git-based][1]

We put together a [GitHub Action](https://github.com/marketplace/actions/sensu-flow) reference implementation of the practices outlined above that you can use or modify for your own needs. The SensuFlow GitHub Action is implemented as a bash shell script run from inside a Docker container, but you will be able to take the script the action is based on and run it locally or adapt it for your preferred CI/CD pipeline.

Before using this GitHub Action, you’ll need to manually configure the RBAC policy for the Sensu user meant to operate the sensuflow action. The Action README provides reference RBAC and user account resources to help get you started.

A quick note for adapting the GitHub Action for other CI/CD platforms: The script driving the GitHub Action requires just three additional executable dependencies: jq, yq, and sensuctl. When you are adapting the script for use outside of GitHub Actions, make sure you install those additional executables before running the script.

The Action makes use of several environment variables to customize how the script interacts with your environment. The minimum required variables for the Action are the Sensu backend URL, user, and password. All other environment variables are optional settings to help you tailor the SensuFlow experience.
   
The SensuFlow GitHub Action also provides some additional linting logic to ensure your resource definitions are self-consistent with respect to your chosen namespace directory structure and label matching regime used by SensuFlow. Beyond the basic sanity checking that the Action provides, you’ll also want to make sure your resources conforms to the following general rules:

Avoid using explicitly namespaced resources, as this will conflict with sensuctl’s global namespace argument taken from the directory naming structure of SensuFlow


Ensure all resources have the needed label and value used by `sensuctl prune` label matching.





[1]: https://github.com/sensu/sensu-flow
[2]: ../../sensuctl/
[3]: ../../sensuctl/create-manage-resources/#sensuctl-prune
[4]: ../control-access/rbac/
[5]: #monitoring-as-code-with-sensuflow
[6]: ../../guides/
[7]: ../../sensuctl/back-up-recover/

