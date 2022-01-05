---
title: "The Five Minute Install"
description: "Follow this five-minute installation guide for Sensu Core. This page helps you set up a development environment for testing purposes."
weight: 2
version: "1.9"
product: "Sensu Core"
menu:
  sensu-core-1.9:
    parent: quick-start
---

_IMPORTANT: [Sensu Core reached end-of-life (EOL) on December 31, 2019][17], and we [permanently removed][18] the Sensu EOL repository on February 1, 2021.<br><br>This means the repositories and https://eol-repositories.sensuapp.org URLs specified in the instructions and code examples on this page are no longer available. To migrate to Sensu Go, read the [Sensu Core migration guide][19]._

This installation guide is intended to help you install Sensu Core in
a development environment for testing purposes. To try out Sensu Enterprise,
see the [Sensu Enterprise quick install guide][12].

_WARNING: This installation guide is not meant for production systems.
To install Sensu in production, see the [complete installation guide][2]
or [install Sensu using configuration management][11]._

After completing the steps in this guide, you will have a fully functional Sensu
Core installation in a [standalone][4] configuration.

## Installation Requirements

What will you need to complete this guide?

- A virtual machine, or physical computer running 64-bit
  [CentOS 7][5] with a minimum of 2GB of memory (4GB recommended)
- Familiarity with a text editor and the Linux command-line interface
- 300 seconds (the amount of time it should take to complete this installation)

Ready? Let's get started!

## Install Sensu in five minutes or less {#install-sensu}

The following installation steps will help you get Sensu Core installed in a
[standalone][4] on a system running [CentOS 7][5], only. For installation on
other platforms, or alternative installation configurations, please consult
the [installation guide][2].

**0. Install EPEL (if not already done)**

{{< code shell >}}
sudo yum install epel-release -y{{< /code >}}

**1. Create the YUM repository configuration file for the Sensu Core repository at
`/etc/yum.repos.d/sensu.repo`**

{{< code shell >}}
echo '[sensu]
name=sensu
baseurl=https://eol-repositories.sensuapp.org/yum/$releasever/$basearch/
gpgkey=https://eol-repositories.sensuapp.org/yum/pubkey.gpg
gpgcheck=1
enabled=1' | sudo tee /etc/yum.repos.d/sensu.repo{{< /code >}}

**2. Install Redis (>= 1.3.14) from EPEL:**

{{< code shell >}}
sudo yum install redis -y{{< /code >}}

**3. Disable Redis protected mode**

When using Redis 3.2.0 or later, you will need to edit `/etc/redis.conf` in
order to disable [protected mode][redis-security].

Look for a line that reads:

{{< code shell >}}
protected-mode yes{{< /code >}}

and change it to:

{{< code shell >}}
protected-mode no{{< /code >}}

**4. Enable and start Redis:**

{{< code shell >}}
sudo systemctl enable redis
sudo systemctl start redis{{< /code >}}

**5. Install and start RabbitMQ:**

Install Erlang (required for RabbitMQ):

{{< code shell >}}
sudo yum install https://dl.bintray.com/rabbitmq/rpm/erlang/20/el/7/x86_64/erlang-20.1.7.1-1.el7.centos.x86_64.rpm
{{< /code >}}

Install RabbitMQ:

{{< code shell >}}
sudo yum install https://dl.bintray.com/rabbitmq/rabbitmq-server-rpm/rabbitmq-server-3.6.12-1.el7.noarch.rpm{{< /code >}}

Configure RabbitMQ to work with Sensu:

{{< code shell >}}
echo '{
  "rabbitmq": {
    "host": "127.0.0.1",
    "port": 5672,
    "vhost": "/sensu",
    "user": "sensu",
    "password": "secret",
    "heartbeat": 30,
    "prefetch": 50
  }
}' | sudo tee /etc/sensu/conf.d/rabbitmq.json{{< /code >}}

Start RabbitMQ:

{{< code shell >}}
sudo systemctl start rabbitmq-server
sudo systemctl enable rabbitmq-server{{< /code >}}

Create a RabbitMQ vhost and user to allow Sensu services to connect to RabbitMQ:

{{< code shell >}}
sudo rabbitmqctl add_vhost /sensu
sudo rabbitmqctl add_user sensu secret
sudo rabbitmqctl set_permissions -p /sensu sensu ".*" ".*" ".*"
{{< /code >}}

**6. Install Sensu and the Uchiwa dashboard:**

{{< code shell >}}
sudo yum install sensu uchiwa -y{{< /code >}}

**7. Configure the Sensu client:**

Run the following to set up a minimal client config:

{{< code shell >}}
echo '{
  "client": {
    "environment": "development",
    "subscriptions": [
      "dev"
    ]
  }
}' |sudo tee /etc/sensu/conf.d/client.json{{< /code >}}

**8. Configure the Uchiwa dashboard:**

{{< code shell >}}
 echo '{
   "sensu": [
     {
       "name": "sensu",
       "host": "127.0.0.1",
       "port": 4567
     }
   ],
   "uchiwa": {
     "host": "0.0.0.0",
     "port": 3000
   }
 }' |sudo tee /etc/sensu/uchiwa.json{{< /code >}}

**9. Make sure that the `sensu` user owns all of the Sensu configuration files:**

{{< code shell >}}
sudo chown -R sensu:sensu /etc/sensu{{< /code >}}

**10. Start the Sensu services:**

{{< code shell >}}
sudo systemctl enable sensu-{server,api,client}
sudo systemctl start sensu-{server,api,client}
sudo systemctl enable uchiwa
sudo systemctl start uchiwa{{< /code >}}

Nice work! You have successfully installed and configured Sensu.

You can verify that your installation is ready to use by querying the Sensu API
using the `curl` utility (and piping the result to the [`jq` utility][10]):

{{< code shell >}}
sudo yum install jq curl -y
curl -s http://127.0.0.1:4567/clients | jq .{{< /code >}}

The Sensu API should return a JSON array of Sensu clients similar to this:

{{< code shell >}}
[
  {
    "name": "localhost.localdomain",
    "address": "10.0.2.15",
    "environment": "development",
    "subscriptions": [
      "dev",
      "client:localhost.localdomain"
    ],
    "version": "1.5.0",
    "timestamp": 1536689149
  }
]{{< /code >}}

You can also use the settings API to see Sensu's full configuration:

{{< code shell >}}
curl -s http://127.0.0.1:4567/settings | jq .{{< /code >}}

You now be able to view the Uchiwa dashboard in your browser by visiting [http://hostname:3000](http://hostname:3000) (replacing `hostname` with the hostname or IP address of the system where the dashboard is installed).

Now you're ready to start building monitoring event pipelines with Sensu!

- [Create an event pipeline with handlers][13]
- [Reduce alert fatigue with filters][14]
- [Monitor server resources with checks][15]
- [Monitor external resources with proxy clients][16]

[1]:  ../../overview/architecture/
[2]:  ../../installation/overview/
[3]:  ../../installation/installation-strategies/
[4]:  ../../installation/installation-strategies/#standalone
[5]:  https://wiki.centos.org/Manuals/ReleaseNotes/CentOS7
[9]:  ../../platforms/sensu-on-rhel-centos/#install-sensu-enterprise-repository
[10]: https://stedolan.github.io/jq/
[redis-security]: https://redis.io/topics/security
[11]: ../../installation/configuration-management
[12]: /sensu-enterprise/latest/quick-start/five-minute-install
[13]: ../../guides/intro-to-handlers
[14]: ../../guides/intro-to-mutators
[15]: ../../guides/intro-to-checks
[16]: ../../guides/adding-a-client/#add-a-remote-sensu-client
[17]: https://blog.sensu.io/eol-schedule-for-sensu-core-and-enterprise
[18]: https://discourse.sensu.io/t/updated-eol-timeline-for-sensu-core-and-sensu-enterprise-repos/2396
[19]: https://docs.sensu.io/sensu-go/latest/operations/maintain-sensu/migrate/
