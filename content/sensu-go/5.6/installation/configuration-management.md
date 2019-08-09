---
title: "Configuration Management"
description: "Configuration management tools can help you deploy Sensu in production and at scale. Learn more about the Sensu integrations."
weight: 16
product: "Sensu Go"
version: "5.6"
menu:
  sensu-go-5.6:
    parent: installation
---

We highly recommend using configuration management tools to deploy Sensu in production and at scale.

* Pin versions of Sensu-related software to ensure repeatable Sensu deployments.
* Ensure consistent configuration between Sensu backends.

The following configuration management tools have well-defined Sensu modules to help you get started.

### Puppet
The [Puppet][1] Sensu module can be found on the [GitHub][2].
Sensu has partnered with [Tailored Automation][7] to enhance the Puppet module with new features and bug fixes.

### Chef
The [Chef][3] cookbook for Sensu can be found on the [GitHub][4]. Interested in more information on Sensu + Chef? Get some helpful resources [here][12].

### Ansible
The [Ansible][5] role to deploy and manage Sensu Go can be found on [GitHub][6].

[1]: https://puppet.com/
[2]: https://github.com/sensu/sensu-puppet
[3]: https://www.chef.io/
[4]: https://github.com/sensu/sensu-go-chef
[5]: https://www.ansible.com/
[6]: https://github.com/jaredledvina/sensu-go-ansible
[7]: https://tailoredautomation.io/
[12]: http://monitoringlove.sensu.io/chef
