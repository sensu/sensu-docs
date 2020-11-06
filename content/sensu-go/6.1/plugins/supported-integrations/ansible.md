---
title: "Ansible integration"
linkTitle: "Ansible"
description: "Use the Sensu Ansible Handler plugin to integrate Sensu with your existing Ansible workflows. Read about the features of Sensu's Ansible integration and learn how to get the plugin."
version: "6.1"
product: "Sensu Go"
menu: 
  sensu-go-6.1:
    parent: supported-integrations
---

**COMMERCIAL FEATURE**: Access the Sensu Ansible Handler integration in the packaged Sensu Go distribution.
For more information, see [Get started with commercial features][6].

The Sensu Ansible Handler plugin is a Sensu [handler][1] that launches Ansible Tower job templates for automated remediation based on Sensu event data.

{{% notice note %}}
**NOTE**: The Sensu Ansible Handler plugin is an example of Sensu's auto-remediation integrations.
To find more integrations, search [Bonsai, the Sensu asset index](https://bonsai.sensu.io/).
{{% /notice %}}

## Features

**NEED TO COMPLETE** Can use environment variables and secrets management to avoid exposing your Ansible API token and other sensitive information? Does event-based templating apply for the Ansible integration? Are there other features to add here?

- Optional job template requests: use Sensu check annotations to specify a set of Ansible Tower job template requests to run for matching Sensu event occurrence and severity conditions.
- [Event-based templating][2]: include observation data from event attributes to add meaningful, actionable context.

## Get the plugin

For a turnkey experience with the Sensu Ansible Handler plugin, use our curated, configurable [quick-start template][3] to integrate Sensu with your existing Ansible Tower workflows.

You can also add the [Sensu Ansible Handler plugin][4] with a dynamic runtime asset from Bonsai, the Sensu asset index, to build your own workflow or integrate Sensu with your existing Ansible workflows.
[Dynamic runtime assets][5] are shareable, reusable packages that make it easier to deploy Sensu plugins.

## Configuration management

Use the official [Sensu Go Ansible Collection][7] for configuration management for your Sensu instance.
The [documentation site][8] includes installation instructions, example playbooks, and module references


[1]: ../../../observability-pipeline/observe-process/handlers/
[2]: ../../../observability-pipeline/observe-process/handler-templates/
[3]: https://github.com/sensu-community/monitoring-pipelines/blob/latest/remediation/ansible-tower.yaml
[4]: https://bonsai.sensu.io/assets/sensu/sensu-ansible-handler
[5]: ../../assets
[6]: ../../../commercial/
[7]: https://github.com/sensu/sensu-go-ansible
[8]: https://sensu.github.io/sensu-go-ansible/
