---
title: "Installation Overview"
description: "Sensu Enterprise installation resources"
weight: 1
product: "Sensu Enterprise"
version: "3.1"
platformContent: true
platforms: ["RHEL/CentOS", "Ubuntu/Debian"]
menu:
  sensu-enterprise-3.1:
    parent: installation
---

- [Installing Sensu Enterprise](#installing-sensu-enterprise)
- [Upgrading from Sensu Core to Sensu Enterprise](#upgrading-from-sensu-core-to-sensu-enterprise)

## Installing Sensu Enterprise

Sensu Enterprise is supported on RHEL/CentOS and Ubuntu/Debian Linux
distributions. Please see the relevant section below for information
on installing Sensu Enterprise and its prerequisites.

Prior to working through either the installation or upgrade
instructions linked below, you'll need to obtain your Sensu Enterprise
repository credentials via the [Sensu Account Manager
portal][1]. These credentials are comprised of
a username and password which are required to access Sensu Enterprise
software packages.

_**NOTE: manual installation is recommended for pre-production environments
only.** Please note that this guide is not intended to provide instructions for
deploying Sensu Enterprise into "production" environments. Production
deployment strategies &ndash; including using automation tools like
Chef, Puppet, or Ansible to install and configure Sensu &ndash; are
be discussed [at the conclusion of the Sensu Core installation guide][2]._

{{< platformBlock "RHEL/CentOS" >}}
### Installing Sensu Enterprise and prerequisites on RHEL/Centos

Sensu Enterprise builds on the same architecture as Sensu Core.

please see to the following selected sections of the [Sensu installation guide][3]:
If you're a new Sensu user getting started with Sensu Enterprise,

1. [Install and Configure Redis](/sensu-core/latest/installation/install-redis-on-rhel-centos)
2. [Install and Configure RabbitMQ](/sensu-core/latest/installation/install-rabbitmq-on-rhel-centos)
3. [Install Sensu Enterprise](/sensu-core/latest/platforms/sensu-on-rhel-centos/#sensu-enterprise)

{{< platformBlockClose >}}

{{< platformBlock "Ubuntu/Debian" >}}
### Installing Sensu Enterprise and prerequisites on Ubuntu/Debian

Sensu Enterprise builds on the same architecture as Sensu Core.

please see to the following selected sections of the [Sensu installation guide][3]:
If you're a new Sensu user getting started with Sensu Enterprise,

1. [Install and Configure Redis](/sensu-core/latest/installation/install-redis-on-ubuntu-debian)
2. [Install and Configure RabbitMQ](/sensu-core/latest/installation/install-rabbitmq-on-ubuntu-debian)
3. [Install Sensu Enterprise](/sensu-core/latest/platforms/sensu-on-ubuntu-debian/#sensu-enterprise)

{{< platformBlockClose >}}

## Upgrading from Sensu Core to Sensu Enterprise

For those already running Sensu Core, Sensu Enterprise is designed to be a
drop-in replacement for the Sensu Core server and API. Once installed,
no configuration changes are required – simply terminate the
`sensu-server` and `sensu-api` processes, and start the `sensu-enterprise`
process to resume operation of your Sensu instance. Some configuration
changes may be required to take advantage of [built-in integrations][4]
or added-value features like [contact routing][5].

{{< platformBlock "RHEL/CentOS" >}}
### Upgrading from Sensu Core to Sensu Enterprise on RHEL/Centos

If you're already a Sensu Core user, the following steps will guide
you through a manual upgrade to Sensu Enterprise:

1. Install the `sensu-enterprise` package as described in [Install Sensu Enterprise](/sensu-core/latest/platforms/sensu-on-rhel-centos/#sensu-enterprise).
2. Stop `sensu-server` and `sensu-api` services
{{< highlight shell >}}
sudo service sensu-server stop && sudo service sensu-api stop
{{< /highlight >}}
3. Start `sensu-enterprise` service
{{< highlight shell >}}
sudo service sensu-enterprise start
{{< /highlight >}}
4. Disable `sensu-server` and `sensu-api` services to avoid starting
them at boot
{{< highlight shell >}}
sudo chkconfig sensu-server off
sudo chkconfig sensu-api off
{{< /highlight >}}
5. Enable `sensu-enterprise` to ensure it is started at boot
{{< highlight shell >}}
sudo chkconfig --add sensu-enterprise
{{< /highlight >}}

### Upgrading from Uchiwa to Sensu Enterprise Dashboard on RHEL/CentOS

Sensu Enterprise Dashboard is built on the popular Uchiwa dashboard
for Sensu Core, providing advanced features for managing one or more
Sensu Enterprise instances.

The process for upgrading from the open source Uchiwa dashboard to
Sensu Enterprise Dashboard is similar:

1. Install the `sensu-enterprise` package as described in [Install Sensu Enterprise](/sensu-core/latest/platforms/sensu-on-rhel-centos/#sensu-enterprise).
2. Stop `uchiwa` service
{{< highlight shell >}}
sudo service uchiwa stop
{{< /highlight >}}
3. Rename `/etc/sensu/uchiwa.json` to `/etc/sensu/dashboard.json`
{{< highlight shell >}}
sudo mv /etc/sensu/uchiwa.json /etc/sensu/dashboard.json
{{< /highlight >}}
4. Start `sensu-enterprise-dashboard` service
{{< highlight shell >}}
sudo service sensu-enterprise-dashboard start
{{< /highlight >}}
5. Disable `uchiwa` service to avoid starting it at boot
{{< highlight shell >}}
sudo chkconfig uchiwa off
{{< /highlight >}}
6. Enable `sensu-enterprise-dashboard` to ensure it is started at boot
{{< highlight shell >}}
sudo chkconfig --add sensu-enterprise-dashboard
{{< /highlight >}}
7. Optional: remove the Uchiwa pacakage from your system
{{< highlight shell >}}
sudo yum remove uchiwa
{{< /highlight >}}
{{< platformBlockClose >}}

{{< platformBlock "Ubuntu/Debian" >}}
### Upgrading from Sensu Core to Sensu Enterprise on Ubuntu/Debian

If you're already a Sensu Core user, the following steps will guide
you through a manual upgrade to Sensu Enterprise:

1. Install the `sensu-enterprise` package as described in [Install Sensu Enterprise](/sensu-core/latest/platforms/sensu-on-ubuntu-debian/#sensu-enterprise).
2. Stop `sensu-server` and `sensu-api` services
{{< highlight shell >}}
sudo service sensu-server stop && sudo service sensu-api stop
{{< /highlight >}}
3. Start `sensu-enterprise` service
{{< highlight shell >}}
sudo service sensu-enterprise start
{{< /highlight >}}
4. Disable `sensu-server` and `sensu-api` services to avoid starting
them at boot
{{< highlight shell >}}
sudo update-rc.d -f sensu-server remove
sudo update-rc.d -f sensu-api remove
{{< /highlight >}}
5. Enable `sensu-enterprise` to ensure it is started at boot
{{< highlight shell >}}
sudo update-rc.d sensu-enterprise defaults
{{< /highlight >}}

### Upgrading from Uchiwa to Sensu Enterprise Dashboard on Ubuntu/Debian

Sensu Enterprise Dashboard is built on the popular Uchiwa dashboard
for Sensu Core, providing advanced features for managing one or more
Sensu Enterprise instances.

Please follow these steps to manually upgrade from Uchiwa to Sensu
Enterprise Dashboard:

1. Install the `sensu-enterprise-dashboard` package as described in [Install Sensu Enterprise](/sensu-core/latest/platforms/sensu-on-ubuntu-debian/#sensu-enterprise).
2. Stop `uchiwa` service
{{< highlight shell >}}
sudo service uchiwa stop
{{< /highlight >}}
3. Rename `/etc/sensu/uchiwa.json` to `/etc/sensu/dashboard.json`
{{< highlight shell >}}
sudo mv /etc/sensu/uchiwa.json /etc/sensu/dashboard.json
{{< /highlight >}}
4. Start `sensu-enterprise-dashboard` service
{{< highlight shell >}}
sudo service sensu-enterprise-dashboard start
{{< /highlight >}}
5. Disable `uchiwa` service to avoid starting it at boot
{{< highlight shell >}}
sudo update-rc.d -f uchiwa remove
{{< /highlight >}}
6. Enable `sensu-enterprise` to ensure it is started at boot
{{< highlight shell >}}
sudo update-rc.d sensu-enterprise-dashboard defaults
{{< /highlight >}}
7. Optional: remove the Uchiwa pacakage from your system
{{< highlight shell >}}
sudo dpkg --remove uchiwa
{{< /highlight >}}
{{< platformBlockClose >}}

[1]: https://account.sensu.io/
[3]: /sensu-core/latest/installation/summary
[3]: /sensu-core/latest/installation/summary
[4]: ../../built-in-handlers
[5]: ../../contact-routing
