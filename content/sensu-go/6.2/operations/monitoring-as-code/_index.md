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

"Everything as code" is common in DevOps and site reliability engineering, and monitoring and observability have lagged behind the advancements made in application and infrastructure delivery. The term "monitoring as code" isn't new by any means, but incorporating monitoring automation as part of an infrastructure as code (IaC) initiative is not the same as a complete end-to-end solution for monitoring as code. Monitoring as code is not just automated installation and configuration of agents, plugins, and exporters – it encompasses the entire observability lifecycle, including automated diagnosis, alerting & incident management, and even automated remediation. 

Incorporating the active monitoring of the infrastructure under management results in a symbiotic relationship in which new metrics and failures are collected and detected automatically in response to code changes and new deployments. Monitoring as code is the key to this unified view of the world and management of the entire application lifecycle.

When we search the web for “monitoring as code,” we find a number of blog posts from a variety of popular monitoring tools. But as we dig deeper, what they are describing is not monitoring as code, but rather simply deploying an agent or configuring an exporter with configuration management tools like Puppet, Chef, Ansible, Terraform, or Helm — AKA, infrastructure as code for deploying monitoring. These solutions don't offer ways to configure much of the monitoring solution beyond simple data collection. This is largely a result of trying to retrofit traditional monitoring tools and workflows into the modern DevOps paradigm.

With this approach, developers are building, testing, and deploying their applications and monitoring data collection via the unified CI/CD pipeline, and then managing the rest of the monitoring solution completely out-of-band of this pipeline (e.g., configuring alerting rules and integrations by clicking buttons in a SaaS-based monitoring dashboard). Comprehensive monitoring as code includes collection, diagnosis, alerting, processing, and remediation (self-healing), all defined as code.

Adopting a monitoring-as-code approach allows you to manage your observability and monitoring workflows the same way you build, test, and deploy your applications and infrastructure.

One of the primary benefits of the "everything as code" movement is version control, which provides logical "checkpoints" representing the state of our systems at a given point in time. If the complete monitoring and observability solution is not managed in the same manner as the systems they monitor (as code, via a centralized CI/CD pipeline), it becomes decoupled in a way that makes it difficult or impossible to reason about over time. By adopting true monitoring as code, you get version control of monitoring aligned with the building, testing, and deployment of your product and services, improving visibility, reliability, and repeatability. 

Monitoring as code adds "observe" to your infrastructure as code pipeline.

With monitoring as code, every observation becomes actionable in the form of a code change and new release.

Monitoring as code encompasses the entire observability lifecycle, from instrumentation and scheduling through alerting and automated remediation.

Sensu was designed from as an observability pipeline to enable monitoring as code on any cloud.
Sensu's developer- and operator-oriented declarative configuration files facilitate sharing among team members and can be treated just like code: edited, reviewed, and versioned.


Sensu allows you to define your end-to-end monitoring solution, including collection, diagnosis, alerting, processing, and remediation, as declarative YAML or JSON code in your configuration files.
When a new endpoint starts up, like a cloud compute instance or Kubernetes Pod, Sensu automatically registers itself with the platform and starts collecting monitoring and observability data according to the code in your configuration files.
The automated diagnosis, management of alerts, and remediation of services are all defined as code in your configuration files.

With a complete monitoring as code implementation, you can remove existing deployments and restore them, repeatably and reliably. 
[SensuFlow][5] is a repeatable process you can follow to implement a monitoring as code workflow.



## Best practices for monitoring as code

The repository of resource definitions can be any manner of source control repository (git, subversion, etc.). While a specific directory structure is not required, we will be suggesting one later in this document.
- To maintain consistency, save all of your resources as only one file type: YAML or JSON.
- Include all dependencies within a resource definition.
For example, if a handler requires a dynamic runtime asset and a secret, include the asset and secret definitions with the definition for the handler itself.

   {{< language-toggle >}}

{{< code yml >}}
---
type: PostgresConfig
api_version: store/v1
metadata:
  name: my-postgres
spec:
  batch_buffer: 0
  batch_size: 1
  batch_workers: 0
  dsn: "postgresql://user:secret@host:port/dbname"
  max_conn_lifetime: 5m
  max_idle_conns: 2
  pool_size: 20
  strict: true
  enable_round_robin: true
{{< /code >}}

{{< code json >}}
{
  "type": "PostgresConfig",
  "api_version": "store/v1",
  "metadata": {
    "name": "my-postgres"
  },
  "spec": {
    "batch_buffer": 0,
    "batch_size": 1,
    "batch_workers": 0,
    "dsn": "postgresql://user:secret@host:port/dbname",
    "max_conn_lifetime": "5m",
    "max_idle_conns": 2,
    "pool_size": 20,
    "strict": true,
    "enable_round_robin": true
  }
}
{{< /code >}}

{{< /language-toggle >}}


## Monitoring as code with SensuFlow


Practical monitoring as code with Sensu Go and SensuFlow
Embracing monitoring as code principles and deploying an observability pipeline are great first steps towards <successful outcomes>, but without a repeatable process it may be hard to grow adoption. Although there's no one "correct" workflow for implementing monitoring as code at every company, an "over the counter" reference is available to help you get started, and we call it "SensuFlow". Together, SensuFlow and Sensu Go provide the process and tools to ensure <successful outcomes> for any monitoring as code initiative. 

SensuFlow is the result of over 8 years of extensive research, development, integration testing, and end-user feedback collected from professional services engagements in over 50 companies ranging from SMBs to industry-leading enterprise organizations with tens of thousands of nodes under active management by Sensu. 

How it works: 

Direct integration with CI/CD providers. The Sensu Go CLI (sensuctl) provides built-in support for unattended operation, making it easy to integrate on any CI/CD platform. At the time of this writing a turn-key reference implementation is available for GitHub Actions, with support for other CI/CD platform marketplaces coming in H2'21. 


Built-in configuration pruning. The Sensu Prune API (and `sensuctl prune` command) provide built-in support for keeping the running monitoring configuration in sync with the monitoring code. 


Label-based workflow facilitates self-service access to monitoring as code. Because Sensu Go was designed from the ground-up for multi-tenancy and self-service – thanks to built-in support for Namespaces and RBAC – it becomes very simple to implement multi-tenant monitoring as code workflows on top of the Sensu platform. The SensuFlow workflow can be applied to multiple application code repositories and their corresponding CI/CD pipelines, all integrated with a shared Sensu Go deployment. Thanks to the underlying support for label selectors in the Prune API, multiple disparate teams can create, modify, and remove monitoring code without inadvertently impacting neighboring teams. 







SensuFlow is a prescriptive monitoring-as-code workflow that uses [sensuctl][2] (including [sensuctl prune][3]) to synchronize your monitoring and observability code with your Sensu deployments.

{{% notice note %}}
**NOTE**: SensuFlow is available for technical preview, and individual components in the workflow may change.
Before you use SensuFlow in production, test it in a development environment or a dedicated test namespace in your current environment.
{{% /notice %}}

SensuFlow requires:
- A monitoring code repository of Sensu resource definitions
- A Sensu [role-based access control (RBAC)][4] service account with permission to manage all resources in your repository
- A labeling convention to designate which resources should be managed by this workflow
- Integration with your CI/CD system that runs sensuctl commands as the aforementioned Sensu user from the repository of resource definitions

The repository of resource definitions can be any manner of source control repository (git, subversion, etc.). While a specific directory structure is not required, we will be suggesting one later in this document. Since sensuctl supports both JSON and YAML files, either can be used, but it is suggested that you use only one file type for consistency. For formatting and readability reasons, our examples will use YAML. We also suggest you include all dependencies within a resource definition. For example, if you have a handler that requires a runtime asset as well as a secret, the definitions for both should be included with the definition for the handler itself.

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

