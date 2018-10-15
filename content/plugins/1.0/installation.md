---
title: "Installation"
date: 2017-10-26T11:06:32-07:00
description: "How to install Sensu plugins"
weight: 2
product: "Plugins"
version: "1.0"
menu: "plugins-1.0"
---

### Gems

Installing via the built-in `sensu-install` is the preferred method of installing a plugin.

**Standard Installation**

```
sensu-install -p disk-checks
```

For further details, please see the [plugin installation guide][1].

### Gems

If you're not able to install a plugin via `sensu-install`, you may use the `gem` command from Sensu's embedded ruby. 

For production deployments make sure you [pin your gems][2].

_NOTE: If the gem has an alpha tag then you will need to use the `--prerelease` flag or the gem will not be found._

**Using Gems**

`/opt/sensu/embedded/bin/gem install sensu-plugins-disk-checks`

#### Bundle

Add *sensu-plugins-disk-checks* to your Gemfile and run `bundle install` or `bundle update`

#### Chef

Using the Sensu **sensu_gem** LWRP

{{< highlight ruby >}}
sensu_gem 'sensu-plugins-disk-checks' do
  version '0.0.1'
end
{{< /highlight >}}

Using the Chef **package** resource

{{< highlight ruby >}}
gem_package 'sensu-plugins-disk-checks' do
  version '0.0.1'
end
{{< /highlight >}}

#### Puppet

Using the Puppet **sensu_gem** package provider

{{< highlight puppet >}}
package { 'sensu-plugins-disk-checks':
  ensure   => '0.0.1',
  provider => sensu_gem,
}
{{< /highlight >}}

#### Ansible

{{< highlight yaml >}}
- gem: 
    name: sensu-plugins-disk-checks 
    version: 0.0.1 
    state: present 
    executable: /opt/sensu/embedded/bin/gem
    user_install: no
{{< /highlight >}}

## Usage

In a proper gem environment plugins can be executed directly from the command line. If you want to check the disk usage you could use the **check-disk-usage** plugin.  This will only work for ruby scripts.  Scripts in other languages will still need to be called directly do to binstubs not being automatically created.

```
check-disk-usage.rb -w 80 -c 90
```

Depending on ruby environment you may need to call ruby directly

```
/opt/sensu/embedded/bin/ruby check-disk-usage.rb -w 80 -c 90
```

For details check the header file of a given plugin.

<!-- LINKS -->
[1]: /sensu-core/latest/installation/installing-plugins/
[2]: https://github.com/sensu-plugins/community/blob/master/best_practices/production_deployments/plugins/PINNING_VERSIONS.md