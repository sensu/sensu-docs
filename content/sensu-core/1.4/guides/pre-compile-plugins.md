---
title: "Pre-Compiling Plugins"
description: "Pre-Compiling Sensu Plugins for Distribution"
product: "Sensu Core"
version: "1.4"
weight: 2
next: ../intro-to-checks
previous: ../overview
menu:
  sensu-core-1.4:
    parent: guides
---

# Overview

This guide will walk you through an example on how to pre-compile Sensu Plugins for distribution among clients.
The goal of this guide is to showcase how you can quickly install plugins on ephemeral instances where time to compile can affect time to production  .
We'll be using `sensu-plugins-aws` as it requires `nokogiri`,  usually requiring a longer build time.

# Prerequist

Sources:
* [GitHub - luislavena/gem-compiler: A RubyGems plugin that generates binary gems](https://github.com/luislavena/gem-compiler)
This guide assumes the following:
* Centos 7 platform
* You have some way to store these artifacts and make them available for systems in your environment
_NOTE: Compiled gems are tied to the Ruby version they are compiled for. If Sensu upgrade Ruby 2.4 -> Ruby 2.5, packages will need to be rebuilt._
_NOTE: Compiled gems are tied to CPU architecture for which they are compiled on._

## Installing The Build Toolchain

We'll first add the Sensu yum repository definition and install Sensu

```bash
printf '[sensu]
name=sensu
baseurl=https://repositories.sensuapp.org/yum/$releasever/$basearch/
gpgcheck=0
enabled=1' | sudo tee /etc/yum.repos.d/sensu.repo && yum install -y sensu
```

And then install EPEL and Dev tools

```bash
sudo yum install -y epel-release
sudo yum groupinstall -y "Development Tools"
```

Finally we'll add Sensu's embedded bin to our path

```bash
export PATH=$PATH:/opt/sensu/embedded/bin
```

## Installing a Gem to a tmp directory

Install the gem-compiler package

```bash
gem install gem-compiler
```

We'll now install the source gems into a cache directory

```bash
mkdir /tmp/gems
gem install --no-ri --no-rdoc --install-dir /tmp/gems sensu-plugins-aws
```

Observing the `gem install` output, we can see that nokogiri and unf_ext build native extensions.
These are the gems we will compile so we can install them from our own repository.

### Compile the Gems for packaging

We'll use `gem-compiler` to rebuild the gem packages with the included native extensions:

```bash
cd /tmp/gems/cache
gem compile unf_ext-0.0.7.4.gem
gem compile nokogiri-1.8.1.gem --prune
```

_NOTE: `nokogiri` requires --prune flag per gem-compiler readme notes _

The resulting compiled gem files have a x86_64-linux in their file name denoting their system architech:

```bash
$ ls  -1 *-x86_64-linux.gem
nokogiri-1.8.1-x86_64-linux.gem
unf_ext-0.0.7.4-x86_64-linux.gem
```

## Install Pre-Compiled Gems on Targeted System and Testing

### Install compiled gem into embedded Ruby
Now we can copy these gems to another system, install them into the sensu embedded ruby. 
In a production or development enviroment, you'd want to put these in a rubygems server of your own (e.g. [Geminabox(https://github.com/geminabox/geminabox), [Artifactory](https://jfrog.com/artifactory/) or similar). You can also use a tool like `fpm` to convert the gems into a system package.

Here we've copied the compiled gems to a system with Sensu installed, but no gcc or other compile toolchain

 _NOTE: nokogiri needs libxml2 and possibly libxslt to be present on your system._


```bash
$ /opt/sensu/embedded/bin/gem install unf_ext-0.0.7.4-x86_64-linux.gem
$ /opt/sensu/embedded/bin/gem install nokogiri-1.8.1-x86_64-linux.gem
```

### Install Sensu plugins as normal
With these prerequisites in place we can install sensu-plugins-aws without a compiler. You can use `sensu-install` or `gem` commands:

```bash
$ sensu-install -p aws
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
[SENSU-INSTALL] successfully installed Sensu plugins: ["sensu-plugins-aws"]  
```

To test our pre-compiled gems we can use `check-elb-health-fog.rb` as it should exercise the nokogiri dependency:

```bash
$ export AWS_ACCESS_KEY=fatchance
$ export AWS_SECRET_KEY=noway
$ /opt/sensu/embedded/bin/check-elb-health-fog.rb -n foo -r us-east-1
ELBHealth WARNING: An issue occured while communicating with the AWS EC2 API: 
There is no ACTIVE Load Balancer named 'foo' 
```
