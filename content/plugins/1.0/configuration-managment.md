---
title: "Configuration Management"
date: 2017-10-26T12:53:47-07:00
description: "Configuration Management with Sensu"
weight: 20
product: "Plugins"
version: "1.0"
menu: "plugins-1.0"
---

## Overview
Configuration management (CM) is highly recommended to get Sensu deployed at scale.
There are number of CM tools that have well defined modules to assist in that effort. 
Below are resources to help get you started.

### Puppet
[Puppet][1] uses a domain specific language to describe the state a system should be in, including packages, service state and configuration.
Sensu has [partnered][8] with [Learn Puppet][7] to enhance the [Sensu Puppet Forge module][2] with new features, bug fixes, and ensure Sensu 2.0 has a Puppet module.

### Chef
[Chef][3] uses a pure-Ruby domain specific language to desscribe system configuration, packages and service states. The Sensu Chef cookbook can be found on the [Chef Supermarket][4].

### Ansible
[Ansible][5] uses YAML and Jinja templates to enforce configuration, service state and packages onto systems. Ansible is agent-less, meaning no agent software is required on nodes to use it; only OpenSSH and Python are required. The Ansible Playbook can be found on [Ansible Galaxy][6].

[1]: https://puppet.com/
[2]: https://forge.puppet.com/sensu/sensu
[3]: https://www.chef.io/
[4]: https://supermarket.chef.io/cookbooks/sensu
[5]: https://www.ansible.com/
[6]: https://galaxy.ansible.com/sensu/sensu/
[7]: https://learn.puppet.com/
[8]: https://blog.sensuapp.org/a-better-experience-for-sensu-puppet-users-a1f9cf1ab46
