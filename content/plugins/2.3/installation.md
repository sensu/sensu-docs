---
title: "Installation"
date: 2017-10-26T11:06:32-07:00
description: ""
weight: 7
product: "Plugins"
version: "2.3"
menu: "plugins-2.3"
---

### Gems

Installing via gem is the preferred method if one exists.

**Standard Installation**

`gem install sensu-plugins-disk-checks`

**Secure Installation**

Add the public key (if you haven’t already) as a trusted certificate

{{< highlight bash >}}
gem cert --add <(curl -Ls https://raw.githubusercontent.com/sensu-plugins/sensu-plugins.github.io/master/certs/sensu-plugins.pem)
gem install sensu-plugins-disk-checks -P MediumSecurity
{{< /highlight >}}

You can also download the key from certs/ within each repository.

**Note:**
If the gem has an alpha tag then you will need to use the *--prerelease* flag or the gem will not be found.

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
- gem: name=sensu-plugins-disk-checks version=0.0.1 state=present executable=/opt/sensu/embedded/bin/gem
{{< /highlight >}}

## Usage

In a proper gem environment plugins can be executed directly from the command line. If you want to check the disk usage you could use the **check-disk-usage** plugin.  This will only work for ruby scripts.  Scripts in other langauges will still need to be called directly do to binstubs not being automatically created.

`check-disk-usage.rb -w 80 -c 90`

Depending on ruby environment you may need to call ruby directly

`/opt/sensu/embedded/bin/ruby check-disk-usage.rb -w 80 -c 90`

For details check the header file of a given plugin.
