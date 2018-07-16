---
title: "Configuration Management"
date: 2017-10-26T12:53:47-07:00
description: "Configuration Management with Sensu"
weight: 16
product: "Sensu Core"
version: "0.29"
menu:
  sensu-core-0.29:
    parent: installation
---

## Overview
Configuration management (CM) is highly recommended to get Sensu deployed in production and at scale.
There are number of CM tools that have well defined modules to assist in that effort. 
Below are resources to help get you started.

### Puppet
The [Puppet][1] Sensu module can be found on the [Puppet Forge][2].
Sensu has [partnered][8] with [Learn Puppet][7] to enhance the Puppet module with new features, bug fixes, and ensure Sensu 2.0 has a supported [Puppet module][9].

### Chef
The [Chef][3] cookbook for Sensu can be found on the [Chef Supermarket][4].

### Ansible
The [Ansible][5] Playbook for Sensu can be found on [Ansible Galaxy][6].

### Saltstack
The [SaltStack][10] Formula for Sensu can be found at [SlatStack][11]


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
