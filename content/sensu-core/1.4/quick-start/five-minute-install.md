---
title: "The Five Minute Install"
description: "The Sensu Core five minute installation guide."
weight: 2
version: "1.4"
product: "Sensu Core"
platformContent: true
menu:
  sensu-core-1.4:
    parent: quick-start
---
# The Five Minute Install

## Objective

Although Sensu’s [architecture][1] is one of its most compelling features, and
the [complete installation guide][2] can help you get Sensu installed and
configured for [a variety of operating environments][3], you might not actually
care about any of that until you can get Sensu up and running in a development
environment for testing purposes. This installation guide is intended to help
you to **install Sensu Core in five minutes or less, <abbr title='all $0 of it
you paid for that "free as in beer" open source software :)'>or we'll give you
your money back</abbr>, guaranteed**.

After completing the steps in this guide, you will have a fully functional Sensu
Core installation in a [standalone][4] configuration.

## Installation Requirements

What will you need to complete this guide?

- A virtual machine, or physical computer running 64-bit
  [CentOS 7][5] with a minimum of 2GB of memory (4GB recommended)
- Familiarity with a <abbr title='do you even pipe to grep?!'>command-line
  interface</abbr>
- Willingness to run a [shell script downloaded from the internet][6]
  ([or not][7])
- The commitment to count to [ten][8] (the number of steps in this guide)
- 300 seconds (the amount of time it should take to complete this installation)

Ready? Let's get started!

## Install Sensu in 5-minutes or less {#install-sensu}

The following installation steps will help you get Sensu Core installed in a
[standalone][4] on a system running [CentOS 7][5], only. For installation on
other platforms, and/or alternative installation configurations, please consult
the [installation guide](2).

**0. Install EPEL (if not already done)**

{{< highlight shell >}}
sudo yum install epel-release -y{{< /highlight >}}

**1. Create the YUM repository configuration file for the Sensu Core repository at
`/etc/yum.repos.d/sensu.repo` or see [Sensu Enterprise repository instructions][9]:**

{{< highlight shell >}}
echo '[sensu]
name=sensu
baseurl=https://sensu.global.ssl.fastly.net/yum/$releasever/$basearch/
gpgcheck=0
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

**5. Install Sensu:**

{{< highlight shell >}}
sudo yum install sensu -y{{< /highlight >}}

...and if you're using [Sensu Enterprise][9], let's go ahead and install
Sensu Enterprise as well:

{{< highlight shell >}}
sudo yum install sensu-enterprise sensu-enterprise-dashboard -y{{< /highlight >}}

**6. Configure Sensu server**

Run the following to set up a minimal client config:

{{< highlight shell >}}
echo '{
  "transport": {
    "name": "redis"
  },
  "api": {
    "host": "127.0.0.1",
    "port": 4567
  }
}' | sudo tee /etc/sensu/config.json{{< /highlight >}}

**7. Configure the Sensu client**

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

**8. Configure a Sensu dashboard**

Sensu Core users:

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

Sensu Enterprise users:

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

**9. Make sure that the `sensu` user owns all of the Sensu configuration files:**

{{< highlight shell >}}
sudo chown -R sensu:sensu /etc/sensu{{< /highlight >}}

**10. Start the Sensu services**

Sensu Core users:

{{< highlight shell >}}
sudo systemctl enable sensu-{server,api,client}
sudo systemctl start sensu-{server,api,client}{{< /highlight >}}

Sensu Enterprise users:

{{< highlight shell >}}
sudo systemctl enable sensu-{enterprise,enterprise-dashboard,client}
sudo systemctl start sensu-{enterprise,enterprise-dashboard,client}{{< /highlight >}}

**11. Verify that your installation is ready to use by querying the Sensu API
    using the `curl` utility (and piping the result to the [`jq` utility][10]):**

{{< highlight shell >}}
sudo yum install jq curl -y
curl -s http://127.0.0.1:4567/clients | jq .{{< /highlight >}}

If the Sensu API returns a JSON array of Sensu clients similar to this:

{{< highlight shell >}}
$ curl -s http://127.0.0.1:4567/clients | jq .
[
  {
    "timestamp": 1458625739,
    "version": "0.28.0",
    "socket": {
      "port": 3030,
      "bind": "127.0.0.1"
    },
    "subscriptions": [
      "dev"
    ],
    "environment": "development",
    "address": "127.0.0.1",
    "name": "client-01"
  }
]{{< /highlight >}}

...you have successfully installed and configured Sensu!

If you you're using Sensu Enterprise, you should also be able to load the
Sensu Enterprise Dashboard in your browser by visiting
[http://hostname:3000](http://hostname:3000) (replacing `hostname` with the
hostname or IP address of the system where the dashboard is installed).

![five-minute-dashboard-1](/images/five-minute-dashboard-1.png)
![five-minute-dashboard-2](/images/five-minute-dashboard-2.png)

[1]:  ../../overview/architecture/
[2]:  ../../installation/overview/
[3]:  ../../installation/installation-strategies/
[4]:  ../../installation/installation-strategies/#standalone
[5]:  https://wiki.centos.org/Manuals/ReleaseNotes/CentOS7
[6]:  http://github.com/sensu/sensu-bash
[7]:  ../../platforms/sensu-on-rhel-centos/#install-sensu-core-repository
[8]:  https://www.youtube.com/watch?v=J2D1XF40-ok
[9]:  ../../platforms/sensu-on-rhel-centos/#install-sensu-enterprise-repository
[10]: https://stedolan.github.io/jq/
[redis-security]: https://redis.io/topics/security
