---
title: "Ansible integration"
linkTitle: "Ansible"
description: "Use the Sensu Ansible Handler plugin to integrate Sensu with your existing Ansible workflows. Read about the features of Sensu's Ansible integration and learn how to get the plugin."
version: "6.4"
product: "Sensu Go"
menu: 
  sensu-go-6.4:
    parent: supported-integrations
---

{{% notice commercial %}}
**COMMERCIAL FEATURE**: Access the Sensu Ansible Handler integration in the packaged Sensu Go distribution.
For more information, read [Get started with commercial features](../../../commercial/).
{{% /notice %}}

The Sensu Ansible Handler plugin is a Sensu [handler][1] that launches Ansible Tower job templates for automated remediation based on Sensu event data.

{{% notice note %}}
**NOTE**: The Sensu Ansible Handler plugin is an example of Sensu's auto-remediation integrations.
To find more integrations, search [Bonsai, the Sensu asset hub](https://bonsai.sensu.io/).
{{% /notice %}}

## Features

The [Sensu Ansible Handler plugin][4] supports both Ansible Tower and Ansible AWX implementations of the Ansible Tower API, authenticating using Ansible Tower API tokens.  

- Specify a default Ansible Tower job template for remediation actions for all checks and use check annotations to override the default as needed on a check-by check-basis.
- Automatically limit Ansible jobs to the host that matches the Sensu entity name encoded in a Sensu event.
- Optional job template requests: use Sensu check annotations to specify a set of Ansible Tower job template requests to run for matching Sensu event occurrence and severity conditions.
- Keep your Ansible Tower host and auth token secure with Sensu [environment variables and secrets management][9].

## Get the plugin

For a turnkey experience with the Sensu Ansible Handler plugin, use our curated, configurable [quick-start template][3] to integrate Sensu with your existing Ansible Tower workflows.

You can also add the [Sensu Ansible Handler plugin][4] with a dynamic runtime asset from Bonsai, the Sensu asset hub, to build your own workflow or integrate Sensu with your existing Ansible workflows.
[Dynamic runtime assets][5] are shareable, reusable packages that make it easier to deploy Sensu plugins.

## Configuration management

Use the official [Sensu Go Ansible Collection][7] for configuration management for your Sensu instance.
The [documentation site][8] includes installation instructions, example playbooks, and module references


[1]: ../../../observability-pipeline/observe-process/handlers/
[2]: ../../../observability-pipeline/observe-process/handler-templates/
[3]: https://github.com/sensu/catalog/blob/main/pipelines/remediation/ansible-tower.yaml
[4]: https://bonsai.sensu.io/assets/sensu/sensu-ansible-handler
[5]: ../../assets/
[7]: https://galaxy.ansible.com/sensu/sensu_go
[8]: https://sensu.github.io/sensu-go-ansible/
[9]: ../../../operations/manage-secrets/
