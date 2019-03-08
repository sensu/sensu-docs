---
title: "The Five Minute Install"
description: "The Sensu Enterprise five minute installation guide"
weight: 2
version: "2.7"
product: "Sensu Enterprise"
menu:
  sensu-enterprise-2.7:
    parent: quick-start
---

This installation guide is intended to help you install Sensu Enterprise in
a development environment for testing purposes.

_WARNING: This installation guide is not meant for production systems.
To install Sensu in production, see the [complete installation guide][2]
or [install Sensu using configuration management][11]._

After completing the steps in this guide, you will have a fully functional Sensu
Enterprise installation in a [standalone][4] configuration.

## Installation Requirements

What will you need to complete this guide?

- A virtual machine, or physical computer running 64-bit
  [CentOS 7][5] with a minimum of 2GB of memory (4GB recommended)
- [A free trial of Sensu Enterprise](https://account.sensu.io/users/sign_up?plan=platinum) and access credentials from the [Sensu account manager](https://account.sensu.io/)
- Familiarity with a text editor and the Linux command-line interface
- 300 seconds (the amount of time it should take to complete this installation)

Ready? Let's get started!

## Install Sensu Enterprise in five minutes or less {#install-sensu}

The following installation steps will help you get Sensu Enterprise installed in a
[standalone][4] on a system running [CentOS 7][5], only. For installation on
other platforms, or alternative installation configurations, please consult
the [installation guide][2].

**0. Install EPEL (if not already done)**

{{< highlight shell >}}
sudo yum install epel-release -y{{< /highlight >}}

**1. Set up your Sensu Enterprise credentials**

If you haven't done so already, [sign up for a free trial of Sensu Enterprise](https://account.sensu.io/users/sign_up?plan=platinum), and get your access credentials from the [Sensu account manager](https://account.sensu.io/).

Replace `1234567890` and `PASSWORD` with your access credentials from the [Sensu account manager](https://account.sensu.io/), and run the following command to set your access credentials as environment variables:

{{< highlight shell >}}
SE_USER=1234567890
SE_PASS=PASSWORD{{< /highlight >}}

Confirm that you have correctly set your access credentials as environment variables with:

{{< highlight shell >}}
$ echo $SE_USER:$SE_PASS
1234567890:PASSWORD{{< /highlight >}}

**2. Create the YUM repository configuration files for Sensu Enterprise, Sensu Enterprise Dashboard, and Sensu Core:**

Add the Sensu Enterprise repository:

{{< highlight shell >}}
echo "[sensu-enterprise]
name=sensu-enterprise
baseurl=https://$SE_USER:$SE_PASS@enterprise.sensuapp.com/yum/noarch/
gpgkey=https://repositories.sensuapp.org/yum/pubkey.gpg
gpgcheck=1
enabled=1" | sudo tee /etc/yum.repos.d/sensu-enterprise.repo{{< /highlight >}}

Add the Sensu Enterprise Dashboard repository:

{{< highlight shell >}}
echo "[sensu-enterprise-dashboard]
name=sensu-enterprise-dashboard
baseurl=https://$SE_USER:$SE_PASS@enterprise.sensuapp.com/yum/\$basearch/
gpgkey=https://repositories.sensuapp.org/yum/pubkey.gpg
gpgcheck=1
enabled=1" | sudo tee /etc/yum.repos.d/sensu-enterprise-dashboard.repo{{< /highlight >}}

Add the Sensu Core repository (required for Sensu Enterprise to use the Sensu client):

{{< highlight shell >}}
echo '[sensu]
name=sensu
baseurl=https://sensu.global.ssl.fastly.net/yum/$releasever/$basearch/
gpgkey=https://repositories.sensuapp.org/yum/pubkey.gpg
gpgcheck=1
enabled=1' | sudo tee /etc/yum.repos.d/sensu.repo{{< /highlight >}}

**3. Install Redis (>= 1.3.14) from EPEL:**

{{< highlight shell >}}
sudo yum install redis -y{{< /highlight >}}

**4. Disable Redis protected mode**

When using Redis 3.2.0 or later, you will need to edit `/etc/redis.conf` in
order to disable [protected mode][redis-security].

Look for a line that reads:

{{< highlight shell >}}
protected-mode yes{{< /highlight >}}

and change it to:

{{< highlight shell >}}
protected-mode no{{< /highlight >}}

**5. Enable and start Redis:**

{{< highlight shell >}}
sudo systemctl enable redis
sudo systemctl start redis{{< /highlight >}}

**6. Install and start RabbitMQ:**

Install Erlang (required for RabbitMQ):

{{< highlight shell >}}
sudo yum install https://dl.bintray.com/rabbitmq/rpm/erlang/20/el/7/x86_64/erlang-20.1.7.1-1.el7.centos.x86_64.rpm{{< /highlight >}}

Install RabbitMQ:

{{< highlight shell >}}
sudo yum install https://dl.bintray.com/rabbitmq/rabbitmq-server-rpm/rabbitmq-server-3.6.12-1.el7.noarch.rpm{{< /highlight >}}

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

**7. Install Sensu Enterprise and the Sensu Enterprise Dashboard:**

{{< highlight shell >}}
sudo yum install sensu sensu-enterprise sensu-enterprise-dashboard -y{{< /highlight >}}

**8. Configure the Sensu client:**

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

**9. Configure the Sensu Enterprise Dashboard:**

{{< highlight shell >}}
echo '{
  "sensu": [
    {
      "name": "sensu",
      "host": "127.0.0.1",
      "port": 4567
    }
  ],
  "dashboard": {
    "host": "0.0.0.0",
    "port": 3000
  }
}' |sudo tee /etc/sensu/dashboard.json{{< /highlight >}}

**10. Make sure that the `sensu` user owns all of the Sensu configuration files:**

{{< highlight shell >}}
sudo chown -R sensu:sensu /etc/sensu{{< /highlight >}}

**11. Start Sensu Enterprise, the Sensu Enterprise Dashboard, and the Sensu client:**

{{< highlight shell >}}
sudo systemctl enable sensu-{enterprise,enterprise-dashboard,client}
sudo systemctl start sensu-{enterprise,enterprise-dashboard,client}
{{< /highlight >}}

Nice work! You have successfully installed and configured Sensu.

You can verify that your installation is ready to use by querying the Sensu API
using the `curl` utility (and piping the result to the [`jq` utility][10]):

{{< highlight shell >}}
sudo yum install jq curl -y
curl -s http://127.0.0.1:4567/clients | jq .{{< /highlight >}}

The Sensu Enterprise API should return a JSON array of Sensu clients similar to this:

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
    "timestamp": 1536689795
  }
]{{< /highlight >}}

You can also use the settings API to see Sensu Enterprise's full configuration:

{{< highlight shell >}}
curl -s http://127.0.0.1:4567/settings | jq .{{< /highlight >}}

You now be able to view the Sensu Enterprise Dashboard in your browser by visiting [http://hostname:3000](http://hostname:3000) (replacing `hostname` with the hostname or IP address of the system where the dashboard is installed).

![five-minute-dashboard-1](/images/five-minute-dashboard-1.png)
![five-minute-dashboard-2](/images/five-minute-dashboard-2.png)

Now you're ready to start building monitoring event pipelines with Sensu!

- [Send alerts to Slack with Sensu Enterprise's built-in Slack integration][13]
- [Reduce alert fatigue with Sensu Enterprise's built-in filters][14]
- [Store metrics in InfluxDB with Sensu Enterprise's built-in InfluxDB integration][15]
- [Add role-based access control for the Sensu Enterprise Dashboard][16]

[1]:  /sensu-core/latest/overview/architecture/
[2]:  /sensu-core/latest/installation/overview/
[3]:  /sensu-core/latest/installation/installation-strategies/
[4]:  /sensu-core/latest/installation/installation-strategies/#standalone
[5]:  https://wiki.centos.org/Manuals/ReleaseNotes/CentOS7
[9]:  /sensu-core/latest/platforms/sensu-on-rhel-centos/#install-sensu-enterprise-repository
[10]: https://stedolan.github.io/jq/
[redis-security]: https://redis.io/topics/security
[11]: /sensu-core/latest/installation/configuration-management
[13]: ../../integrations/slack
[14]: ../../built-in-filters
[15]: ../../integrations/influxdb
[16]: /sensu-enterprise-dashboard/latest/rbac/overview/
