---
title: "Configuration Management"
description: "Configuration Management with Sensu"
weight: 16
product: "Sensu Go"
version: "5.1"
menu:
  sensu-go-5.1:
    parent: installation
---

We highly recommend using configuration management tools to deploy Sensu in production and at scale.

* Pin versions of Sensu-related software to ensure repeatable Sensu deployments.
* Ensure consistent configuration between Sensu Servers.

The following configuration management tools have well-defined Sensu modules to help you get started.

### Puppet
The [Puppet][1] Sensu module can be found on the [GitHub][2].
Sensu has partnered with [Learn Puppet][7] to enhance the Puppet module with new features and bug fixes.

### Chef
The [Chef][3] cookbook for Sensu can be found on the [GitHub][4]. Interested in more information on Sensu + Chef? Get some helpful resources [here][12].

[1]: https://puppet.com/
[2]: https://github.com/sensu/sensu-puppet
[3]: https://www.chef.io/
[4]: https://github.com/sensu/sensu-go-chef
[7]: https://learn.puppet.com/
[12]: http://monitoringlove.sensu.io/chef
