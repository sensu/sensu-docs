---
title: "Configuration management"
linkTitle: "Configuration Management"
description: "Configuration management tools can help you deploy Sensu in production and at scale. Learn more about Sensu integrations."
weight: 70
product: "Sensu Go"
version: "5.16"
menu:
  sensu-go-5.16:
    parent: installation
---

We recommend using configuration management tools to deploy Sensu in production and at scale.

- Pin versions of Sensu-related software to ensure repeatable Sensu deployments.
- Ensure consistent configuration between Sensu backends.

The configuration management tools listed here have well-defined Sensu modules to help you get started.

## Ansible

The [Ansible][5] role to deploy and manage Sensu Go is available in the [Sensu-Go-Ansible GitHub repo][6].

## Chef

The [Chef][3] cookbook for Sensu is available in the [Sensu-Go-Chef GitHub repo][4].

[Contact us][12] for more information about Sensu + Chef.

## Puppet

The [Puppet][1] Sensu module is available in the [Sensu-Puppet GitHub repo][2].

Sensu partnered with [Tailored Automation][7] to enhance the Puppet module with new features and bug fixes.


[1]: https://puppet.com/
[2]: https://github.com/sensu/sensu-puppet
[3]: https://www.chef.io/
[4]: https://github.com/sensu/sensu-go-chef
[5]: https://www.ansible.com/
[6]: https://github.com/jaredledvina/sensu-go-ansible
[7]: https://tailoredautomation.io/
[12]: http://monitoringlove.sensu.io/chef
