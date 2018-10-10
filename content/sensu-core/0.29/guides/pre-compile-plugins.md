---
title: "Pre-Compiling Plugins"
description: "Pre-Compiling Sensu Plugins for Distribution"
product: "Sensu Core"
version: "0.29"
weight: 2
next: ../intro-to-checks
previous: ../overview
menu:
  sensu-core-0.29:
    parent: guides
---
# Overview
This guide will walk you through an example on how to pre-compile Sensu Plugins for distribution among clients.
The goal of this guide is to showcase how you can quickly install plugins on ephemeral instances where time to compile can affect time to production.
We'll be using `sensu-plugins-aws` as it requires `nokogiri`,  usually requiring a longer build time.

# Prerequist

Sources:

* [GitHub - luislavena/gem-compiler: A RubyGems plugin that generates binary gems](https://github.com/luislavena/gem-compiler)

This guide assumes the following:

* Centos 7 platform
* You have some way to store these artifacts and make them available for systems in your environment

_NOTE: Compiled gems are tied to the Ruby version they are compiled for. If Sensu upgrades Ruby 2.4 -> Ruby 2.5, packages will need to be rebuilt._
_NOTE: Compiled gems are tied to CPU architecture for which they are compiled on._

## Installing The Build Toolchain

We'll first add the Sensu yum repository definition and install Sensu

{{< highlight shell >}}
printf '[sensu]
name=sensu
baseurl=https://repositories.sensuapp.org/yum/$releasever/$basearch/
gpgcheck=0
enabled=1' | sudo tee /etc/yum.repos.d/sensu.repo && sudo yum install -y sensu{{< /highlight >}}

And then install EPEL, Dev tools and libs required for the next steps

{{< highlight shell >}}
sudo yum install -y epel-release
sudo yum groupinstall -y "Development Tools"
# installing dependencies for nokogiri
sudo yum install -y libxml2 libxslt libxslt-devel libxml2-devel gcc ruby-devel zlib-devel{{< /highlight >}}



## Installing a Gem to a tmp directory

Install the gem-compiler package

{{< highlight shell >}}
sudo /opt/sensu/embedded/bin/gem install gem-compiler{{< /highlight >}}

We'll now install the source gems into a cache directory

{{< highlight shell >}}
mkdir /tmp/gems
sudo /opt/sensu/embedded/bin/gem install --no-ri --no-rdoc --install-dir /tmp/gems sensu-plugins-aws --version '=12.3.0'
sudo /opt/sensu/embedded/bin/gem install --no-ri --no-rdoc --install-dir /tmp/gems mini_portile2 --version '=2.3.0'{{< /highlight >}}

Observing the `gem install` output, we can see that nokogiri and unf_ext both build native extensions.
These are the gems we will compile so we can install them from our own repository.

### Compile the Gems for packaging

We'll use `gem-compiler` to rebuild the gem packages with the included native extensions:

{{< highlight shell >}}
cd /tmp/gems/cache
sudo /opt/sensu/embedded/bin/gem compile unf_ext-0.0.7.5.gem
sudo /opt/sensu/embedded/bin/gem compile nokogiri-1.8.5.gem --prune -- --use-system-libraries{{< /highlight >}}

_NOTE: `nokogiri` requires --prune flag per gem-compiler readme notes_
_NOTE: For `nokogiri` we also use `-- --use-system-libraries` so `gem compile` uses the system gcc and lib's installed earlier_


The resulting compiled gem files have a x86_64-linux in their file name denoting their system architech:

{{< highlight shell >}}
# ls  -1 *-x86_64-linux.gem
nokogiri-1.8.5-x86_64-linux.gem
unf_ext-0.0.7.5-x86_64-linux.gem{{< /highlight >}}

## Install Pre-Compiled Gems on Targeted System and Testing

### Install compiled gem into embedded Ruby
Now we can copy these gems to another system, install them into the sensu embedded ruby. 
In a production or development enviroment, you'd want to put these in a rubygems server of your own (e.g. [Geminabox(https://github.com/geminabox/geminabox), [Artifactory](https://jfrog.com/artifactory/) or similar). You can also use a tool like `fpm` to convert the gems into a system package.

Here we've copied the compiled gems to a system with Sensu installed, but no gcc or other compile toolchain

 _NOTE: nokogiri needs libxml2 and libxslt to be present on your system._

{{< highlight shell >}}
# /opt/sensu/embedded/bin/gem install unf_ext-0.0.7.5-x86_64-linux.gem
# /opt/sensu/embedded/bin/gem install nokogiri-1.8.5-x86_64-linux.gem{{< /highlight >}}

### Install pre-complied Sensu plugins
With these prerequisites in place we can install sensu-plugins-aws without a compiler. You can use `sensu-install` or `gem` commands:

{{< highlight shell >}}
sudo /op/sensu/embedded/bin/sensu-install -p aws
[SENSU-INSTALL] installing Sensu plugins ...
[SENSU-INSTALL] determining if Sensu gem 'sensu-plugins-aws' is already installed ...
false
[SENSU-INSTALL] Sensu plugin gems to be installed: ["sensu-plugins-aws"]
[SENSU-INSTALL] installing Sensu gem 'sensu-plugins-aws'
Fetching: unf-0.1.4.gem (100%)
Successfully installed unf-0.1.4
Fetching: domain_name-0.5.20170404.gem (100%)
Successfully installed domain_name-0.5.20170404
Fetching: http-cookie-1.0.3.gem (100%)
Successfully installed http-cookie-1.0.3
Fetching: mime-types-2.99.3.gem (100%)
Successfully installed mime-types-2.99.3
Fetching: netrc-0.11.0.gem (100%)
Successfully installed netrc-0.11.0
Fetching: rest-client-1.8.0.gem (100%)
Successfully installed rest-client-1.8.0
Fetching: sensu-plugins-aws-10.0.3.gem (100%)
You can use the embedded Ruby by setting EMBEDDED_RUBY=true in /etc/default/sensu
Successfully installed sensu-plugins-aws-10.0.3
7 gems installed
[SENSU-INSTALL] successfully installed Sensu plugins: ["sensu-plugins-aws"]{{< /highlight >}}

To test our pre-compiled gems we can use `check-elb-health-fog.rb` as it should exercise the nokogiri dependency:

{{< highlight shell >}}
# export AWS_ACCESS_KEY=fatchance
# export AWS_SECRET_KEY=noway
# /opt/sensu/embedded/bin/check-elb-health-fog.rb -n foo -r us-east-1
ELBHealth WARNING: An issue occured while communicating with the AWS EC2 API:
There is no ACTIVE Load Balancer named 'foo'{{< /highlight >}}

_NOTE: This is to demostrate that there are no errors while executing the plugin._

## Recap


