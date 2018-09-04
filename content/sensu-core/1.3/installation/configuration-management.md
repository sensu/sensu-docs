---
title: "Configuration Management"
description: "Configuration Management with Sensu"
weight: 16
product: "Sensu Core"
version: "1.3"
menu:
  sensu-core-1.3:
    parent: installation
---

We highly recommend using configuration management tools to deploy Sensu in production and at scale.

* Pin versions of Sensu-related software to ensure repeatable Sensu deployments.
* Scale Sensu horizontally with additional Sensu, RabbitMQ, and Redis servers.
* Ensure consistent configuration between Sensu Servers.

The following configuration management tools have well-defined Sensu modules to help you get started.

### Puppet
The [Puppet][1] Sensu module can be found on the [Puppet Forge][2].
Sensu has [partnered][8] with [Learn Puppet][7] to enhance the Puppet module with new features, bug fixes, and ensure Sensu 2.0 has a supported [Puppet module][9].

### Chef
The [Chef][3] cookbook for Sensu can be found on the [Chef Supermarket][4]. Interested in more information on Sensu + Chef? Get some helpful assets [here][12].

### Ansible
The [Ansible][5] playbook for Sensu can be found on [Ansible Galaxy][6].

### Saltstack
The [SaltStack][10] formula for Sensu can be found at [SaltStack][11]


[1]: https://puppet.com/
[2]: https://forge.puppet.com/sensu/sensu
[3]: https://www.chef.io/
[4]: https://supermarket.chef.io/cookbooks/sensu
[5]: https://www.ansible.com/
[6]: https://galaxy.ansible.com/sensu/sensu/
[7]: https://learn.puppet.com/
[8]: https://blog.sensuapp.org/a-better-experience-for-sensu-puppet-users-a1f9cf1ab46
[9]: https://github.com/sensu/sensu-puppet/issues/901
[10]: https://saltstack.com/
[11]: https://github.com/saltstack-formulas/sensu-formula
[12]: http://monitoringlove.sensu.io/chef
