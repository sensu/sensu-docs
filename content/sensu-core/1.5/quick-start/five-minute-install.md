---
title: "The Five Minute Install"
description: "The Sensu Core five minute installation guide"
weight: 2
version: "1.5"
product: "Sensu Core"
menu:
  sensu-core-1.5:
    parent: quick-start
---

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

{{< highlight shell >}}
sudo yum install epel-release -y{{< /highlight >}}

**1. Create the YUM repository configuration file for the Sensu Core repository at
`/etc/yum.repos.d/sensu.repo`**

{{< highlight shell >}}
echo '[sensu]
name=sensu
baseurl=https://sensu.global.ssl.fastly.net/yum/$releasever/$basearch/
gpgkey=https://repositories.sensuapp.org/yum/pubkey.gpg
gpgcheck=1
enabled=1' | sudo tee /etc/yum.repos.d/sensu.repo{{< /highlight >}}

**2. Install Redis (>= 1.3.14) from EPEL:**

{{< highlight shell >}}
sudo yum install redis -y{{< /highlight >}}

**3. Disable Redis protected mode**

When using Redis 3.2.0 or later, you will need to edit `/etc/redis.conf` in
order to disable [protected mode][redis-security].

Look for a line that reads:

{{< highlight shell >}}
protected-mode yes{{< /highlight >}}

and change it to:

{{< highlight shell >}}
protected-mode no{{< /highlight >}}

**4. Enable and start Redis:**

{{< highlight shell >}}
sudo systemctl enable redis
sudo systemctl start redis{{< /highlight >}}

**5. Install and start RabbitMQ:**

Add the RabbitMQ Erlang repository (required for RabbitMQ):

{{< highlight shell >}}
echo ' [rabbitmq-erlang]
name=rabbitmq-erlang
baseurl=https://dl.bintray.com/rabbitmq/rpm/erlang/20/el/7
gpgcheck=1
gpgkey=https://www.rabbitmq.com/rabbitmq-release-signing-key.asc
repo_gpgcheck=0
enabled=1' | sudo tee /etc/yum.repos.d/rabbitmq-erlang.repo{{< /highlight >}}

Install Erlang (required for RabbitMQ):

{{< highlight shell >}}
sudo yum install erlang -y{{< /highlight >}}

Install RabbitMQ:

{{< highlight shell >}}
sudo yum install https://dl.bintray.com/rabbitmq/rabbitmq-server-rpm/rabbitmq-server-3.6.12-1.el7.noarch.rpm -y{{< /highlight >}}

Configure RabbitMQ to work with Sensu:

{{< highlight shell >}}
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
}' | sudo tee /etc/sensu/conf.d/rabbitmq.json{{< /highlight >}}

Start RabbitMQ:

{{< highlight shell >}}
sudo systemctl start rabbitmq-server
sudo systemctl enable rabbitmq-server{{< /highlight >}}

Create a RabbitMQ vhost and user to allow Sensu services to connect to RabbitMQ:

{{< highlight shell >}}
sudo rabbitmqctl add_vhost /sensu
sudo rabbitmqctl add_user sensu secret
sudo rabbitmqctl set_permissions -p /sensu sensu ".*" ".*" ".*"
{{< /highlight >}}

**6. Install Sensu and the Uchiwa dashboard:**

{{< highlight shell >}}
sudo yum install sensu uchiwa -y{{< /highlight >}}

**7. Configure the Sensu client:**

Run the following to set up a minimal client config:

{{< highlight shell >}}
echo '{
  "client": {
    "environment": "development",
    "subscriptions": [
      "dev"
    ]
  }
}' |sudo tee /etc/sensu/conf.d/client.json{{< /highlight >}}

**8. Configure the Uchiwa dashboard:**

{{< highlight shell >}}
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
 }' |sudo tee /etc/sensu/uchiwa.json{{< /highlight >}}

**9. Make sure that the `sensu` user owns all of the Sensu configuration files:**

{{< highlight shell >}}
sudo chown -R sensu:sensu /etc/sensu{{< /highlight >}}

**10. Start the Sensu services:**

{{< highlight shell >}}
sudo systemctl enable sensu-{server,api,client}
sudo systemctl start sensu-{server,api,client}
sudo systemctl enable uchiwa
sudo systemctl start uchiwa{{< /highlight >}}

Nice work! You have successfully installed and configured Sensu.

You can verify that your installation is ready to use by querying the Sensu API
using the `curl` utility (and piping the result to the [`jq` utility][10]):

{{< highlight shell >}}
sudo yum install jq curl -y
curl -s http://127.0.0.1:4567/clients | jq .{{< /highlight >}}

The Sensu API should return a JSON array of Sensu clients similar to this:

{{< highlight shell >}}
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
]{{< /highlight >}}

You can also use the settings API to see Sensu's full configuration:

{{< highlight shell >}}
curl -s http://127.0.0.1:4567/settings | jq .{{< /highlight >}}

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
