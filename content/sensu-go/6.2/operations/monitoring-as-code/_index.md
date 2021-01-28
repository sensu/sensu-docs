---
title: "Monitoring as Code"
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

Executive Summary
Adopting monitoring as code means extending the cultural expectations around repeatability, reliability, and safety in application development and infrastructure automation to monitoring and observability. The way we observe and operate our systems after they are deployed should be managed the same way we build, test, and deploy those same systems: as code. 

Continuous Integration and Continuous Delivery (CI/CD) have drastically changed the way companies build and deliver products and services. With the advent of DevOps, infrastructure as code (IaC), and containerization, infrastructure and IT management have become decentralized. Now, organizations can be more agile, delivering more business and customer value faster. CI/CD, configuration management, infrastructure as code, and cloud computing all came out as tooling to facilitate that high-velocity change, but — until recently — monitoring tools were still reacting to the changes in the modern IT environment.

"Monitoring as code solves a bane for many projects whereby unexpected issues during pre-production testing or deployments go undetected. We lose hours allowing failing tests to continue, then more time troubleshooting the problem, and of course, we miss the opportunity to investigate root cause at the point of failure. With monitoring deployed alongside the application via a single, unified pipeline, we catch any issues early and avoid having to manually babysit the testing and CI/CD process.” – Seng Phung-Lu, AVP Site Reliability Engineering, DevOps Tools Engineering, and Cloud Monitoring at TD Bank

The key difference between traditional monitoring workflows and monitoring as code can be distilled down to a single concept: what we do with monitoring and observability data is just as important as how we collect it. We would never leave the instrumentation of our applications and services and collection of monitoring and observability data up to some opaque external workflow, out of band of our core application delivery pipeline. Managing the rest of the observability lifecycle, including automated diagnosis, alerting & incident management, and even automated remediation is just as critical as making our applications observable and collecting key performance metrics.

A comprehensive CI/CD initiative should include monitoring and observability. In this whitepaper, we’ll examine how monitoring as code fills that gap.

"Everything as code" has become the status quo among leading organizations adopting DevOps and SRE practices, and yet, monitoring and observability have lagged behind the advancements made in application and infrastructure delivery. The term "monitoring as code" isn't new by any means, but incorporating monitoring automation as part of an infrastructure as code (IaC) initiative is not the same as a complete end-to-end solution for monitoring as code. Monitoring as code is not just automated installation and configuration of agents, plugins, and exporters – it encompasses the entire observability lifecycle, including automated diagnosis, alerting & incident management, and even automated remediation. 

Continuous Integration and Continuous Delivery (CI/CD) drastically changed the way we build and deploy applications. With the advent of DevOps, infrastructure as code, and containerization, infrastructure and IT management have become decentralized. Now, organizations can be more agile, shipping high-quality software more quickly. CI/CD, configuration management, infrastructure as code, and cloud computing all came out as tooling to facilitate that high-velocity change, but — until recently — monitoring tools were still reacting to the changes in the modern IT environment.

A comprehensive CI/CD initiative should include monitoring and observability. In this post, I’ll examine how monitoring as code fills that gap. 

But first, a brief history of CI/CD. 
CI/CD and IaC: a brief history
The IT operations world has seen a LOT of change over the last 10-15 years. Although it’s now quite common to find a CI/CD pipeline in an organization, it’s a relatively new concept. In the beginning there was Continuous Integration, and CI was only thought of as a development tool for testing and building applications, not automating other operational concerns.

Everything changed around the time of John Allspaw’s 2009 talk, "10+ deploys per day", and Jez Humble and David Farley’s 2010 book, Continuous Delivery. We realized we could do a lot more with CI than just build and test application code – we could also automate parts of the release and deploy process… and thus, the CI/CD pipeline was born. 

Before we knew it, the term "infrastructure as code" entered the vernacular and became a major foundational element of the DevOps movement, allowing developers and operators to increase velocity while improving repeatability, reliability, and maintainability. As I’ve said previously, by codifying your infrastructure and application deployment in the same way, you establish one framework — one source of truth — for the state of configuration for everything from your infrastructure to your applications. Managing infrastructure as code meant we could integrate infrastructure into this new CI/CD pipeline.
The new new infrastructure as code, and where observability fits in
Fast forward to today: CI/CD and IaC continue to evolve, and containerization and container orchestration through platforms like Kubernetes are the new normal. The first generation of infrastructure as code was more literal in that we were spending a lot of time writing "code" using complex DSLs or actual programming languages like Ruby. With Kubernetes, we have a common packaging solution (containers) and are able to describe more of the underlying infrastructure as declarative YAML "code". This has reduced the barrier of entry and made IaC more attainable for many organizations. Now you can automate application deployment  within minutes instead of months.

The overwhelming success of CI/CD has created an insatiable demand for "everything as code" solutions. Although there's still more work to be done, tools and platforms like containers and Kubernetes have continued to mature and bring infrastructure as code principles to the masses. But where does that leave monitoring and observability?
Integrate observability into the CI/CD pipeline with monitoring as code
The most advanced organizations have already reached a conclusion that we think the rest of the industry will arrive at over the next decade of CI/CD: it's imperative to incorporate more ongoing operational functions into our delivery pipelines, with monitoring and observability primary among them. 

Anyone building and deploying applications in the modern era needs to incorporate monitoring the same way they’re defining and deploying infrastructure: as code, via a centralized pipeline. This becomes even more critical to operational safety as the number of software components increases (e.g., microservices) or the number of organizational units increases. 



Incorporating the active monitoring of the infrastructure under management results in a symbiotic relationship in which new metrics and failures are collected and detected automatically in response to code changes and new deployments. Monitoring as code is the key to this unified view of the world and management of the entire application lifecycle.
Infrastructure as code for monitoring is NOT the same as monitoring as code
When we search the web for “monitoring as code,” we find a number of blog posts from a variety of popular monitoring tools. But as we dig deeper, what they are describing is not monitoring as code, but rather simply deploying an agent or configuring an exporter with configuration management tools like Puppet, Chef, Ansible, Terraform, or Helm — AKA, infrastructure as code for deploying monitoring. These solutions don't offer ways to configure much of the monitoring solution beyond simple data collection. This is largely a result of trying to retrofit traditional monitoring tools and workflows into the modern DevOps paradigm.

With this approach, developers are building, testing, and deploying their applications and monitoring data collection via the unified CI/CD pipeline, and then managing the rest of the monitoring solution completely out-of-band of this pipeline (e.g., configuring alerting rules and integrations by clicking buttons in a SaaS-based monitoring dashboard). Comprehensive monitoring as code includes collection, diagnosis, alerting, processing, and remediation (self-healing), all defined as code.

End-to-end monitoring as code should include: 


Instrumentation. Installation and configuration of plugins and exporters. 
Scheduling & orchestration. Management of monitoring jobs (e.g. collect, scrape).
Diagnosis. Collection of additional context (e.g. automated triage, including validating configuration, examining log files, etc).
Detection. Codified evaluation, filtering, deduplication, and correlation of observability events. 
Notification. Codified workflows for alerts and incident management, including automatically creating and resolving incidents. 
Processing. Routing of metrics and events to data platforms like Elasticsearch, Splunk, InfluxDB, and TimescaleDB for storage and analysis.
Automation. Codifying remediation actions, including integrations with runbook automation platforms like Ansible Tower, Rundeck, and Saltstack.

One of the primary benefits of the "everything as code" movement is version control, which provides logical "checkpoints" representing the state of our systems at a given point in time. If the complete monitoring and observability solution is not managed in the same manner as the systems they monitor (as code, via a centralized CI/CD pipeline), it becomes decoupled in a way that makes it difficult or impossible to reason about over time. By adopting true monitoring as code, you get version control of monitoring aligned with the building, testing, and deployment of your product and services, improving visibility, reliability, and repeatability. 

"Monitoring as code solves a bane for many projects whereby unexpected issues during pre-production testing or deployments go undetected. We lose hours allowing failing tests to continue, then more time troubleshooting the problem, and of course, we miss the opportunity to investigate root cause at the point of failure. With monitoring deployed alongside the application via a single, unified pipeline, we catch any issues early and avoid having to manually babysit the testing and CI/CD process.” – Seng Phung-Lu, AVP Site Reliability Engineering, DevOps Tools Engineering, and Cloud Monitoring at TD Bank

With Sensu, for example, you have the ability to define your entire end-to-end monitoring solution including collection, diagnosis, alerting, processing, and remediation (self-healing) as declarative JSON or YAML code. When a new endpoint spins up (such as a cloud compute instance or Kubernetes Pod), Sensu automatically registers itself with the platform and starts collecting monitoring and observability data; the automated diagnosis, management of alerts, and remediation of services are all defined as code. With a complete monitoring as code implementation you can blow away your existing deployments and bring them back in a repeatable and reliable manner; this also provides additional benefits in pre-production environments as Seng commented on above. 

If you're already investing in CI/CD and IaC, you already have pipelines for versioning, building, testing, and deploying your software. It only makes sense that you would have your monitoring go through the same lifecycle — it’s all part of the same workflow. It’s all integrated. 
Looking ahead
As code workflows are the norm, and the next logical step in the progression following Continuous Integration, Continuous Deployment, and infrastructure as code is monitoring as code – automated monitoring of our systems, as code, coupled to the applications and infrastructure under management. 

Over the last 10+ years, CI/CD became the foundation for how we build, test, and deploy our infrastructure and applications. Over the next 10 years, we'll see the rest of the application lifecycle (including monitoring and observability) managed as code and integrated into this same pipeline. In that near future, you’ll have true point-in-time context for complete visibility into your critical infrastructure, with version control that aligns with the building, testing, and deploying of your applications. 

Monitoring as code with Sensu Go and SensuFlow
Author: Todd Campbell & Jef Spaleta
Category: Use cases
Tags: CI/CD, sensuctl, sensuctl prune, monitoring as code
Slug: monitoring-as-code-with-sensu-flow 

[Sensu creator and CTO Sean Porter recently wrote about "monitoring as code"](https://thenewstack.io/monitoring-as-code-what-it-is-and-why-you-need-it/) and his perspectives on where he sees the next generation of monitoring and observability workflows are headed. [TL;DR he did a good job of outlining the concepts; this blog post will demonstrate how to apply those concepts in practice with Sensu Go 6.]

In a previous post, we shared how to [integrate Sensu into your CI/CD pipeline with `sensuctl prune`](https://sensu.io/blog/integrating-sensu-go-into-your-ci-cd-pipeline-with-sensuctl-prune). SensuFlow (a technical preview feature available as of Sensu Go 5.19) takes it a step further — SensuFlow is a prescriptive "monitoring as code" workflow that uses the sensuctl CLI (including `sensuctl prune`) to synchronize your monitoring code with your Sensu deployments.

> __Note:__ SensuFlow is now generally available in technical preview.  The individual components are subject to change, but the overall workflow is here to stay. We recommend you start by testing it in a dev environment or in a test namespace in your current environment before using it in production.

Read on to learn more about SensuFlow, including how to get started.
## Intro to Senu Flow
SensuFlow is an collection of operational best practices and tools, including the following components:

A Sensu RBAC profile (service account) with sufficient privileges to manage all resources in your repository
A monitoring code repository of Sensu resource definitions
A labeling convention to designate which resources should be managed by this workflow
Integration with your CI/CD system that runs sensuctl commands as the aforementioned Sensu user from the repository of resource definitions

Let’s take a look at each of these components individually.

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
We put together a [GitHub Action](https://github.com/marketplace/actions/sensu-flow) reference implementation of the practices outlined above that you can use or modify for your own needs. The SensuFlow GitHub Action is implemented as a bash shell script run from inside a Docker container, but you will be able to take the script the action is based on and run it locally or adapt it for your preferred CI/CD pipeline.

Before using this GitHub Action, you’ll need to manually configure the RBAC policy for the Sensu user meant to operate the sensuflow action. The Action README provides reference RBAC and user account resources to help get you started.

A quick note for adapting the GitHub Action for other CI/CD platforms: The script driving the GitHub Action requires just three additional executable dependencies: jq, yq, and sensuctl. When you are adapting the script for use outside of GitHub Actions, make sure you install those additional executables before running the script.

The Action makes use of several environment variables to customize how the script interacts with your environment. The minimum required variables for the Action are the Sensu backend URL, user, and password. All other environment variables are optional settings to help you tailor the SensuFlow experience.
   
The SensuFlow GitHub Action also provides some additional linting logic to ensure your resource definitions are self-consistent with respect to your chosen namespace directory structure and label matching regime used by SensuFlow. Beyond the basic sanity checking that the Action provides, you’ll also want to make sure your resources conforms to the following general rules:

Avoid using explicitly namespaced resources, as this will conflict with sensuctl’s global namespace argument taken from the directory naming structure of SensuFlow


Ensure all resources have the needed label and value used by `sensuctl prune` label matching.

## We want your feedback!
We’re really excited about this new workflow for managing your Sensu monitoring resources, but it's still a new concept and we need your feedback to further enhance it. In particular, the SensuFlow GitHub Action makes use of the `sensuctl prune` command — also a technical preview — and could use some feedback from real world users. For those users interested in testing SensuFlow, but do not want to use it in production right away, the best thing you can do is to start with a dedicated Sensu namespace for SensuFlow automation to maintain. You can modify the reference RBAC and limit access for your SensuFlow user to just the testing namespace you’ve pre-defined. If you run into any problems or have ideas to further enhance the SensuFlow concept, please file issues against the Github Action.  



[CTA button] Get the SensuFlow GitHub Action  

## Watch our webinar: Practical monitoring as code
[Sign up to receive the recording](https://sensu.io/webinar-practical-monitoring-as-code) of our on-demand webinar when it becomes available on February 25, 2021. You’ll learn:

What monitoring as code means, and why it matters.
How to get started with your own monitoring as code workflows.
How the SensuFlow GitHub Action works.
How to apply monitoring as code to your own CI/CD pipeline.

[CTA button] Sign Up


Adopting "everything as code" is an organizational initiative
"Everything as code" strategies are being adopted by industry leading organizations as a key element of Digital Transformation initiatives. In most of these organizations, "as code" practices were already commonplace in Engineering. Adopting them in IT and beyond is often where both the greatest challenges and rewards are encountered. 

The IT operations world has seen a LOT of change over the last 10-15 years. Although it’s now quite common to find Continuous Integration and Continuous Delivery (CI/CD) pipelines in most organizations, they are still a relatively new concept. Continuous Integration has only been around since the 1990's, and for over a decade CI was only thought of as a development tool for testing and building applications, not as a framework for automating other operational concerns.

Everything changed around the time of John Allspaw’s 2009 talk, "10+ deploys per day", and Jez Humble and David Farley’s 2010 book, Continuous Delivery. We realized we could do a lot more with CI than just build and test application code – we could also automate parts of the release and deploy process… and thus, the CI/CD pipeline was born. 

Before we knew it, the term "infrastructure as code" entered the vernacular and became a major foundational element of the DevOps movement, allowing developers and operators to increase velocity while improving repeatability, reliability, and maintainability. As Sensu CTO Sean Porter has said previously, by codifying your infrastructure and application deployment in the same way, you establish one framework — one source of truth — for the state of configuration for everything from your infrastructure to your applications. Managing infrastructure as code meant we could integrate infrastructure into this new CI/CD pipeline.

Although "everything as code" has become the status quo among leading organizations adopting DevOps and SRE practices, many operational concerns  have lagged behind the advancements made in application and infrastructure delivery – monitoring and observability primary among them. The challenge facing these enterprises is how to close the growing gap between the parts of the application lifecycle that are being managed "as code" and the ongoing management of these same applications. 

further complications: by failing or delaying everything as code adoption, IT teams have accumulated more traditional monitoring tools in an effort to keep up with high-velocity engineering teams  - increasing the overall complexity and management surface area

How can enterprise IT teams catch up? 

Monitoring as code concepts & implications

At its core, monitoring as code is about one thing: closing the loop in the application lifecycle, and aligning development and operations around a single unified workflow. When everything is code, there's no such thing as a bad alert – every observation becomes actionable in the form of a code change and new release. Monitoring as code shifts your focus from fewer alerts (an anti-pattern) to getting better alerts. 


The term "monitoring as code" isn't new by any means, but incorporating monitoring automation as part of an infrastructure as code (IaC) initiative – automated installation and configuration of agents, plugins, and exporters – is not the same as a complete end-to-end solution for monitoring as code. Monitoring as code encompasses the entire observability lifecycle, including automated diagnosis, alerting & incident management, and even automated remediation. 

“Most of the existing options for monitoring as code are limited to data collection configuration; they lack the ability to codify the reactive logic and automation that you get from tools like Sensu.” 
— Principal Software Engineer @ Fortune 1000 fintech organization

A comprehensive monitoring as code strategy should encompass the following: 

Instrumentation: installation of plugins and exporters. 
Scheduler: orchestration of monitoring jobs (e.g. collecting metrics).
Diagnosis: collection of additional operational context in the event of failures (e.g. event enrichment)
Detection: evaluation of observability data and identification of anomalies. 
Notification: alert and incident management policies. 
Processing: historical data storage and analysis.
Automation: self-healing. 


<TBD illustration; maybe comparing traditional monitoring vs MaC (workflow)?>
With MaC you get "Declarative configuration files that can be shared amongst team members, treated as code, edited, reviewed, and versioned."

Traditional monitoring rollout: 
- Team 1 (Step 1-5)
- Team 2 (Steps 1-5)
- Team 3 (Steps 1-5)


Monitoring as code rollout: 
- Team 1 (Steps 1-5)
- Team 2 (Step 3-5)
- Team 3 (Step 3-5)




TODO: implications of MaC do not imply a holistic replacement of existing tools and workflows - you can adopt MaC over time. The same benefits of other "as code" workflows are true for monitoring as code, including "versioned" monitoring, so you can start with one use case ("version 0.1"), and expand to others over time. Monitoring as code should also start off as a relatively "low code" solution, where an initial implementation is possible by reusing existing skills (familiarity with existing Nagios plugins, TSDB, etc), bootstrapping the solution by copying example templates and modifying some simple configuration. 

Unlocking monitoring as code, a practical guide
Everything as code initiatives as we know them are built on top of pipelines that enable organizations to codify complex business requirements as repeatable steps. The CI pipeline (build+test) paved the way for Continuous Delivery (CD). Together as the CI/CD pipeline (build+test, deploy), they provided the foundation for infrastructure as code (build+test, provision+test, deploy). Like IaC, monitoring as code also hooks into this CI/CD pipeline, but also requires a dedicated pipeline for ongoing observation of our systems (build+test, provision+test, deploy, observe). We call this missing link the observability pipeline. 

Continuous Integration (CI)
Build (+Test)
CI/CD
Build (+Test), Deploy
Infrastructure as Code
Build (+Test), Provision (+Test), Deploy
Monitoring as Code
Build (+Test), Provision (+Test), Deploy, Observe

Practical monitoring as code: the observability pipeline 

Sensu was designed from the ground up as an observability pipeline to enable monitoring as code on any cloud. 

The Sensu Go observability pipeline provides a turn-key solution for monitoring as code, including the following benefits:

Developer- and operator-oriented interfaces. <APIs, CLIs, declarative config files>


Designed for self-service workflows. <Namespaces and RBAC; as an as-code platform, Sensu solutions can be shared amongst team members, treated as code, edited, reviewed, and versioned> 


End-to-end solution. <Feature complete MaC solution, including:> 


Instrumentation. Installation and configuration of plugins and exporters. 
Scheduling & orchestration. Management of monitoring jobs (e.g. collect, scrape).
Diagnosis. Collection of additional context (e.g. automated triage, including validating configuration, examining log files, etc).
Detection. Codified evaluation, filtering, deduplication, and correlation of observability events. 
Notification. Codified workflows for alerts and incident management, including automatically creating and resolving incidents. 
Processing. Routing of metrics and events to data platforms like Elasticsearch, Splunk, InfluxDB, and TimescaleDB for storage and analysis.
Automation. Codifying remediation actions, including integrations with runbook automation platforms like Ansible Tower, Rundeck, and Saltstack.

Practical monitoring as code: the journey

The typical journey to monitoring as code for most organization follows four major milestones: 

Integration. The observability pipeline provides an integration layer between the existing "as code" tooling and services (e.g. CI/CD pipeline, multi-cloud compute APIs, secrets management providers, certificate management systems, etc), and existing systems of record. Sensu's built-in integrations make this milestone a matter of simple configuration. Once the required integrations are connected to Sensu, the organization can immediately begin iterating on versioned monitoring code, unifying the development, IT, and security teams around a shared workflow and automating deployment of improved visibility at scale. 


Standardization. Identify existing instrumentation interfaces used by the various monitoring and observability tools which can be consolidated into the unified pipeline. This includes Nagios-style monitoring scripts, applications instrumented with StatsD/DogStatsD, /healthz API endpoints, Prometheus exporters, Telegraf metrics, and many more.


Acceleration. Packaging of common monitoring and observability business requirements as declarative monitoring templates enables accelerated adoption across additional business units. 


Innovation. By closing the everything as code loop in the application lifecycle, development, IT, and security teams can collaborate on core business improvements via a unified workflow. 

With Sensu, for example, you have the ability to define your entire end-to-end monitoring solution including collection, diagnosis, alerting, processing, and remediation (self-healing) as declarative JSON or YAML code. When a new endpoint spins up (such as a cloud compute instance or Kubernetes Pod), Sensu automatically registers itself with the platform and starts collecting monitoring and observability data; the automated diagnosis, management of alerts, and remediation of services are all defined as code. With a complete monitoring as code implementation you can blow away your existing deployments and bring them back in a repeatable and reliable manner; this also provides additional benefits in pre-production environments as Seng commented on above. 


Practical monitoring as code with Sensu Go and SensuFlow
Embracing monitoring as code principles and deploying an observability pipeline are great first steps towards successful outcomes, but without a repeatable process it may be hard to grow adoption. Although there's no one "correct" workflow for implementing monitoring as code at every company, an "over the counter" reference is available to help you get started, and we call it "SensuFlow". Together, SensuFlow and Sensu Go provide the process and tools to ensure successful outcomes for any monitoring as code initiative. 

"I need a [monitoring] strategy that I can rally people around and deliver against."
— CIO at a Fortune 100 tech company

SensuFlow is the result of over 8 years of extensive research, development, integration testing, and end-user feedback collected from professional services engagements in over 50 companies ranging from SMBs to industry-leading enterprise organizations with tens of thousands of nodes under active management by Sensu. 

How it works: 

Direct integration with CI/CD providers. The Sensu Go CLI (sensuctl) provides built-in support for unattended operation, making it easy to integrate on any CI/CD platform. At the time of this writing a turn-key reference implementation is available for GitHub Actions, with support for other CI/CD platform marketplaces coming in H2'21. 


Built-in configuration pruning. The Sensu Prune API (and `sensuctl prune` command) provide built-in support for keeping the running monitoring configuration in sync with the monitoring code. 


Label-based workflow facilitates self-service access to monitoring as code. Because Sensu Go was designed from the ground-up for multi-tenancy and self-service – thanks to built-in support for Namespaces and RBAC – it becomes very simple to implement multi-tenant monitoring as code workflows on top of the Sensu platform. The SensuFlow workflow can be applied to multiple application code repositories and their corresponding CI/CD pipelines, all integrated with a shared Sensu Go deployment. Thanks to the underlying support for label selectors in the Prune API, multiple disparate teams can create, modify, and remove monitoring code without inadvertently impacting neighboring teams. 

To learn more about SensuFlow, contact our Developer Advocacy team at https://sensu.io/contact 
Conclusion
Over the last 10+ years, CI/CD became the foundation for how we build, test, and deploy our infrastructure and applications. Over the next 10 years, we'll see the rest of the application lifecycle – specifically including monitoring and observability – managed as code and integrated into this same pipeline. In that near future, you’ll have true point-in-time context for complete visibility into your critical infrastructure, with version control that aligns with the building, testing, and deploying of your applications. 

Classic people/process/tools solution 
People: Start with one use case, expand over time (multi-tenant)
Reuse existing skills and instrumentation 
Process: Unified pipeline 
Get better alerts, not fewer alerts (morning market)
No need to reinvent the wheel, prescriptive workflows are available (SensuFlow)
Tools: product should support the complete end-to-end solution as code 
Enumerate functions 
Contact Sensu to learn more 


Ready to get started with monitoring as code? Contact us today for a free 30-day trial: sensu.io/contact.  







[1]: ../../web-ui/#sign-in-to-the-web-ui
[2]: ../../sensuctl/
[3]: rbac#default-users
[4]: rbac/
[5]: create-read-only-user/
[6]: ../../commercial/
[7]: oidc-auth/
[8]: ../../api/
[9]: oidc-auth/#oidc-configuration-examples
[10]: https://docs.microsoft.com/en-us/azure/active-directory-domain-services/tutorial-configure-ldaps
