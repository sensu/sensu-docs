---
title: "Troubleshooting Sensu"
subtitle: "Common Problems and How to Solve Them"
product: "Sensu Core"
version: "0.29"
weight: 10
menu:
 sensu-core-0.29:
   parent: guides
---

In this guide, we'll cover some of the more common issues to run into when deploying Sensu. For each section, we'll start with the behavior that's most commonly observed, and then walk through some possible solutions to solve that issue. 

# Objectives

- Recognize common problems in Sensu
- Understand how to troubleshoot and resolve common problems in Sensu

## Prerequisites

- A working Sensu deployment including sensu-server/sensu-api (or sensu-enterprise), sensu-client, and transport/datastore components
- [Uchiwa][1], or [Sensu Enterprise Dashboard][2] installed and configured

If you don’t have Sensu spun up yet, we encourage you to go through our [5 minute install guide][3].

## Initial Troubleshooting

Before we dive into things like troubleshooting connectivity with RabbitMQ, or Redis, it's important to start off with some baseline troubleshooting steps you can take whenever you encounter an issue with your Sensu deployment.

### Setting Log Levels

Sensu has the ability to set log levels interactively, or by using a configuration directive in `/etc/default/sensu`. This is particularly useful when attempting to debug an issue where the current log level doesn't provide sufficient information. Let's take a look at the ways you can set your log levels. 

Perhaps the quickest way to set your log level is to use the following command:

`kill TRAP $SENSUPID`

This will toggle the `debug` log level on/off for Sensu. In practice, it looks something like this:

{{ highlight shell }}$ ps aux | grep [s]ensu-server
sensu     5992  1.7  0.3 177232 24352 ...
$ kill -TRAP 5992{{ /highght }}

Additionally, you can set the log level to `info` or `debug` by using the configuration directive in `/etc/default/sensu`. Let's take a look at an example:

{{ highlight shell }}# cat /etc/default/sensu
LOG_LEVEL=info{{ /highlight }}

And after setting that directive, restarting the respective Sensu services:

{{ highlight shell }}sudo systemctl restart sensu-{server,api,client}{{ /highlight }}

Keep in mind that to set log levels back to normal, you can either run `kill TRAP $SENSUPID` (if you've used that method), or revert the change in `/etc/default/sensu` and restart the Sensu processes for the change to take place.

### Printing Configurations

Frequently, Sensu staff or community members may ask you to print your configuration. It's fairly easy to print the configuration for your Sensu deployment:

**Sensu Core**:
`/opt/sensu/bin/sensu-client --print_config | tee sensu-core-config.json`

**Sensu Enterprise**
`sudo -u sensu java -jar /usr/lib/sensu-enterprise/sensu-enterprise.jar -c /etc/sensu/config.json -d /etc/sensu/conf.d --print_config | tee se-config.json`

This command will result in output that will list the entire configuration for your Sensu deployment. This can be especially useful when comparing the configuration that Sensu is aware of, versus the configuration living on-disk. If the values of a particular file differ from what you're expecting, then see the next section for how to proceed.

### Restarting Services

It's crucial that you restart your Sensu services after each change so that the configuration changes are read. For most modern Linux distributions, this is done using `systemd`:

{{ highlight shell }}sudo systemctl restart sensu-{server,api,client}{{ /highlight }}

In the event that you're using a system where `sysvinit` is the service manager of choice, you can use:

{{ highlight }}sudo service sensu-client restart
sudo service sensu-server restart
sudo service sensu-api restart{{ /highlight }}

It's especially important to restart the `sensu-client` process if you're making use of any [standalone][] checks, as the client will be responsible for check scheduling and execution.

### Collecting Logs

Sensu's logs provide a wealth of information when troubleshooting issues. They live at `/var/log/sensu`:

{{{highlight shell }}# tree /var/log/sensu
/var/log/sensu
├── sensu-api.log
├── sensu-client.log
└── sensu-server.log{{ /highlight }}

Sensu staff, or community members may ask to see your logs. You can view them at the paths above, or provide them in an archive:

{{ highlight shell }}tail -n 10000 /var/log/sensu/sensu-server.log > sensu-server-10k.log && gzip -9 sensu-server-10k.log`{{ /highlight}}

## RabbitMQ Connectivity

In this section, we'll discuss issues faced when connecting to RabbitMQ and how you can go about troubleshooting them.

### Authentication Failures

One of the more common issues that you'll encounter when having RabbitMQ connectivity difficulties is the client and/or server failing to authenticate to RabbitMQ. Let's take a look at what an example error message might look like from both Sensu and from RabbitMQ:

{{ highlight json }}{
  "timestamp": "2018-06-25T15:34:54.222674-0500",
  "level": "warn",
  "message": "transport connection error",
  "reason": "possible authentication failure. wrong credentials?",
  "user": "sensu"
}{ /highlight }}

{{ highlight shell }}tail -f /var/log/rabbitmq/rabbit\@sensu.log
2018-06-26 01:28:00.439 [info] <0.618.0> accepting AMQP connection <0.618.0> (192.168.1.3:44788 -> 192.168.1.2:5671)
2018-06-26 01:28:00.442 [error] <0.618.0> Error on AMQP connection <0.618.0> (192.168.1.3:44788 -> 192.168.1.2:5671, state: starting):
PLAIN login refused: user 'sensu' - invalid credentials
2018-06-26 01:28:03.469 [info] <0.618.0> closing AMQP connection <0.618.0> (192.168.1.3:44788 -> 192.168.1.2:5671){{ /highlight }}

As you can see, both RabbitMQ and Sensu will give errors if the credentials are incorrect. We'll now walk through the ways in which you can verify that the credentials are correct.

#### Troubleshooting Authenticating Failures

We'll start by going through the process of setting up RabbitMQ manually. If you've gone through our [SSL configuration reference guide][], these commands should be familiar.

- Ensure that you've created the correct vhost:

{{ highlight shell }}sudo rabbitmqctl list_vhosts
{{ /highlight }}

This should give you output that looks like:

{{ highlight shell }}Listing vhosts ...
/
/sensu{{ /highlight }}

_NOTE: The `/` in front the `sensu` vhost is required. If you're missing the slash, but have configured Sensu to use the vhost `/sensu`, you will see an error._

If your vhost output doesn't look like the output above, create the vhost:

{{ highlight shell }}sudo rabbitmqctl add_vhost /sensu
{{ /highlight }}

- Ensure that the `sensu` user is present:

{{ highlight shell }}sudo rabbitmqctl list_users{{ /highlight }}

This should give you output that looks like:

{{ highlight shell }}Listing users ...
Listing users ...
sensu   []
guest   [administrator]{{ /highlight }}

If the user isn't present, add the user and the password for the user:

{{ highlight}}sudo rabbitmqctl add_user sensu secret
{{ /highlight }}

_NOTE: If the user is present, and the password needs to be reset, you can reset it by using `sudo rabbitmqctl change_password sensu secret`_

- Ensure that the `sensu` user has the correct permissions for the vhost:

{{ highlight shell }}sudo rabbitmqctl list_permissions -p /sensu{{ /highlight }}

You should see output that looks like the following:

{{ highlight shell }}Listing permissions for vhost "/sensu" ...
sensu   .*      .*      .*{{ /highlight }}

If the permissions are not correct, you can set them via:

{{ highlight shell }}sudo rabbitmqctl set_permissions -p /sensu sensu ".*" ".*" ".*"
{{ /highlight }}

Once we've ensured that our credentials are correct, we can see that RabbitMQ starts showing connections being accepted again:

{{ highlight shell }}tail -f /var/log/rabbitmq/rabbit\@sensu.log
2018-06-26 01:28:35.191 [info] <0.642.0> accepting AMQP connection <0.642.0> (192.168.1.3:44816 -> 192.168.1.2:5671)
2018-06-26 01:28:35.194 [info] <0.642.0> connection <0.642.0> (192.168.1.3:44816 -> 192.168.1.2:5671): user 'sensu' authenticated and granted access to vhost '/sensu'{{ /highlight }}

_WARNING: The credentials in this guide shouldn't be used in any production environment. If you're curious about how to better secure RabbitMQ, see our [Securing RabbitMQ Guide][]._

### SSL

SSL issues are one of the more difficult ones to troubleshoot inside of Sensu. What lends to this difficulty is the way that AMQP (the protocol used by RabbitMQ) handles SSL failures, primarily in that the failure seen something like an unsupported Erlang/RabbitMQ combination is indistinguishable from an actual authentication issue.

If you've already gone through the steps in the previous section to confirm that your Sensu instance is using the correct credentials to connect to your RabbitMQ instance, then you'll want to proceed through this part of the guide to rule out any issues with SSL.

##### Handshake Failures

## Redis Connectivity

### Behavior


## Renaming checks/clients


[1]: https://docs.uchiwa.io/
[2]: /sensu-core/latest/platforms/sensu-on-rhel-centos/#sensu-on-rhel-centos
[3]: /sensu-core/latest/quick-start/five-minute-install/
[4]: https://www.digitalocean.com/community/tutorials/an-introduction-to-snmp-simple-network-management-protocol
[5]: https://github.com/sensu-extensions/sensu-extensions-snmp-trap
[6]: /sensu-core/latest/reference/clients/#reference-documentation
[7]: https://github.com/sensu-plugins/sensu-plugins-snmp
[8]: https://slack.sensu.io
[9]: https://github.com/sensu/sensu-docs/issues/new
[10]: 
