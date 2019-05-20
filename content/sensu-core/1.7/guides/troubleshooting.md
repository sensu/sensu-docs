---
title: "Troubleshooting Sensu"
linkTitle: "Troubleshooting"
subtitle: "Common Problems and How to Solve Them"
product: "Sensu Core"
version: "1.7"
weight: 10
menu:
 sensu-core-1.7:
   parent: guides
---

In this guide, we'll cover some of the more common issues to run into when deploying Sensu. For each section, we'll start with the behavior that's most commonly observed, and then walk through some possible solutions to solve that issue.

- [Setting Log Levels](#setting-log-levels)
- [Printing Configurations](#printing-configurations)
- [Restarting Services](#restarting-services)
- [Collecting Logs](#collecting-logs)
- [Local Client Socket](#local-client-socket)
- [RabbitMQ Authentication Failures](#authentication-failures)
- [RabbitMQ SSL Issues](#ssl)

Have an issue that isn't listed here? [Open an issue][12] with what you think should be added to this guide!

## Initial Troubleshooting

Before we dive into things like troubleshooting connectivity with RabbitMQ, or Redis, it's important to start off with some baseline troubleshooting steps you can take whenever you encounter an issue with your Sensu deployment.

### Setting Log Levels

Sensu has the ability to set log levels interactively, or by using a configuration directive in `/etc/default/sensu`. This is particularly useful when attempting to debug an issue where the current log level doesn't provide sufficient information. Let's take a look at the ways you can set your log levels.

Perhaps the quickest way to set your log level is to use the following command:

`sudo kill -TRAP $SENSUPID`

This will toggle the `debug` log level on/off for Sensu. In practice, it looks something like this:

{{< highlight shell >}}
sudo ps aux | grep [s]ensu-server
sensu     5992  1.7  0.3 177232 24352 ...
sudo kill -TRAP 5992{{< /highlight >}}

Additionally, you can set the log level to `info` or `debug` by using the configuration directive in `/etc/default/sensu`. Let's take a look at an example:

{{< highlight shell >}}
sudo cat /etc/default/sensu
LOG_LEVEL=debug{{< /highlight >}}

And after setting that directive, restarting the respective Sensu services:

{{< highlight shell >}}
sudo systemctl restart sensu-{server,api,client}{{< /highlight >}}

Keep in mind that to set log levels back to normal, you can either run `sudo kill -TRAP $SENSUPID` (if you've used that method), or revert the change in `/etc/default/sensu` and restart the Sensu processes for the change to take place.

_NOTE: By default, Sensu's logging level is set to `info`. However, there are more log levels available than just `info` and `debug`. You can find the full list of available log levels in the [configuration reference documentation][4]. It's worth noting that `debug` is the most granular log level, while `fatal` is the least granular._

### Printing Configurations

Frequently, Sensu staff or community members may ask you to print your configuration. It's fairly easy to print the configuration for your Sensu deployment:

**Sensu Core**:
{{< highlight shell >}}/opt/sensu/bin/sensu-client --print_config | tee sensu-core-config.json{{< /highlight >}}

**Sensu Enterprise**:
{{< highlight shell >}}sudo -u sensu java -jar /usr/lib/sensu-enterprise/sensu-enterprise.jar -c /etc/sensu/config.json -d /etc/sensu/conf.d --print_config | tee se-config.json{{< /highlight >}}

This command will result in output that will list the entire configuration for your Sensu deployment. This can be especially useful when comparing the configuration that Sensu is aware of, versus the configuration living on-disk. If the values of a particular file differ from what you're expecting, then see the next section for how to proceed.

### Restarting Services

It's crucial that you restart your Sensu services after each change so that the configuration changes are read. For most recent Linux distributions (CentOS/RHEL, Debian/Ubuntu) this is done using `systemd`:

{{< highlight shell >}}
sudo systemctl restart sensu-{server,api,client}{{< /highlight >}}

In the event that you're using a system where `sysvinit` is the service manager of choice, you can use:

{{< highlight shell >}}sudo service sensu-client restart
sudo service sensu-server restart
sudo service sensu-api restart{{< /highlight >}}

It's especially important to restart the `sensu-client` process if you're making use of any [standalone][5] checks, as the client will be responsible for check scheduling and execution.

### Collecting Logs

Sensu's logs provide a wealth of information when troubleshooting issues. They live at `/var/log/sensu`:

{{< highlight shell >}}# tree /var/log/sensu
/var/log/sensu
├── sensu-api.log
├── sensu-client.log
└── sensu-server.log{{< /highlight >}}

Sensu staff, or community members may ask to see your logs. You can view them at the paths above, or provide them in an archive:

{{< highlight shell >}}
tail -n 10000 /var/log/sensu/sensu-server.log > sensu-server-10k.log && gzip -9 sensu-server-10k.log{{< /highlight >}}

## Local Client Socket
By default the sensu-client process listens for check results on a local socket. There are several reasons for using the client socket to as a troubleshooting tool when deploying Sensu:

1. Less configuration overhead. I.e., you don't have to push a check via configuration management.
2. The ability to issue a check and subsequently resolve it is instantaneous. There is no waiting on a check interval to elapse before the result is published.
3. The ability to individually test handler configurations

This client socket can be disabled, but does provide a few configurable attributes. See the [client reference documentation][13] for further information.

Before we start, let’s take a look at the prerequisites for using the client socket:

* sensu package installed
* nc package installed
* jq package installed (not required, but will help when reading JSON results)
* sensu-client has minimal working configuration (client's keepalive timestamp (visible in dashboard or /clients API endpoint) is consistently being updated)
* sensu-client running (Can be verified with `systemctl status sensu-client`)
* Local socket is open (Can be verified with `netstat -tnlp | grep 3030` and `nc -vz localhost 3030`)

Once the prerequisites have been met, we can move on to troubleshooting.

### Troubleshooting steps

Consider the following scenario: Sensu has been installed, has been verified to be working correctly (alerts are seen in the dashboard), and is configured to send alerts via the [mailer handler][14]. However, mail doesn't appear to be coming through.

We'll start by crafting a test command to send to the local socket:

{{< highlight shell >}}
echo ‘{“name”: “testing”, “output”: “THIS IS AN ERROR”, “status”: 2, “refresh”: 10, “handlers”: [“mailer”]}’ | nc localhost 3030
{{< /highlight >}}

_NOTE: Successfully submitting a check result this way will be indicated by `ok` being printed on the next line -- typically this is appears ahead of the command prompt so it can be easily missed. See below for an example._

{{< highlight shell >}}
$ echo '{"name": "testing_error", "status": 2, "output": "An error event should be created", "refresh": 10, "handlers": [ "mailer"]}' | nc 127.0.0.1 3030
ok{{< /highlight >}}


_NOTE: A successfully submitted check result is also logged to the sensu-client.log (viewable while in debug logging mode)._

{{< highlight json >}}
{"timestamp":"2018-10-12T18:28:43.204565+0000","level":"info","message":"publishing check result","payload":{"client":"sensu-enterprise","check":{"name":"testing_error","output":"its just a test","status":2,"handler":"opsgenie","opsgenie":{"tags":{"this":"is wrong"}},"refresh":2,"executed":1539368923,"issued":1539368923}}}{{< /highlight >}}

Review the logs on the Sensu server to determine if the issue is making it through to the server.
Grep for the error message, specifically the check "name" attribute.

{{< highlight json >}}
{"timestamp":"2018-10-11T11:02:00.576261-0500","level":"info","message":"processing event","event":{"id":"f4a9453f-ac70-4e91-a601-a97ff31c589a","client":{"name":"sensu.test.local","address":"192.168.156.176","environment":"testing","subscriptions":["dev","linux-hosts","roundrobin:web_probe","client:sensu.test.local"],"version":"1.5.0","timestamp":1539273717},"check":{"name":"testing","output":"THIS IS AN ERROR","status":2,"refresh":10,"executed":1539273720,"issued":1539273720,"type":"standard","history":["2"],"total_state_change":0},"occurrences":1,"occurrences_watermark":1,"last_ok":null,"action":"create","timestamp":1539273720,"last_state_change":1539273720,"silenced":false,"silenced_by":[]}}{{< /highlight >}}

It's also recommended that you note the event ID, as this persists and allows you to track an event throughout its lifecycle.

{{< highlight shell >}}
"event":{"id":"f4a9453f-ac70-4e91-a601-a97ff31c589a"}{{< /highlight >}}

Ensure that the event is being handled by the mailer handler (you can do this by searching for the `event_id` and looking at additional log entries to confirm that the event is handled as expected).

### Most common issues surfaced
Troubleshooting via the local client socket typically surfaces the following types of issues:

* Misconfiguration (either of Sensu, or a handler’s/integration’s corresponding service)
* Inadvertent filtering (in the case of the community mailer, or handle_when in Sensu Enterprise Classic)

## RabbitMQ Connectivity

In this section, we'll discuss issues faced when connecting to RabbitMQ and how you can go about troubleshooting them.

### Authentication Failures

One of the more common issues that you'll encounter when having RabbitMQ connectivity difficulties is the client and/or server failing to authenticate to RabbitMQ. Let's take a look at what an example error message might look like from both Sensu and from RabbitMQ:

{{< highlight json >}}{
  "timestamp": "2018-06-25T15:34:54.222674-0500",
  "level": "warn",
  "message": "transport connection error",
  "reason": "possible authentication failure. wrong credentials?",
  "user": "sensu"
}{{< /highlight >}}

{{< highlight shell >}}
tail -f /var/log/rabbitmq/rabbit\@sensu.log
2018-06-26 01:28:00.439 [info] <0.618.0> accepting AMQP connection <0.618.0> (192.168.1.3:44788 -> 192.168.1.2:5671)
2018-06-26 01:28:00.442 [error] <0.618.0> Error on AMQP connection <0.618.0> (192.168.1.3:44788 -> 192.168.1.2:5671, state: starting):
PLAIN login refused: user 'sensu' - invalid credentials
2018-06-26 01:28:03.469 [info] <0.618.0> closing AMQP connection <0.618.0> (192.168.1.3:44788 -> 192.168.1.2:5671){{< /highlight >}}

As you can see, both RabbitMQ and Sensu will give errors if the credentials are incorrect. We'll now walk through the ways in which you can verify that the credentials are correct.

#### Troubleshooting Authenticating Failures

We'll start by going through the process of setting up RabbitMQ manually. If you've gone through our [RabbitMQ installation guide][6], these commands should be familiar.

Ensure that you've created the correct vhost:

{{< highlight shell >}}
sudo rabbitmqctl list_vhosts
{{< /highlight >}}

This should give you output that looks like:

{{< highlight shell >}}
Listing vhosts ...
/
/sensu{{< /highlight >}}

_NOTE: The `/` in front the `sensu` vhost is required. If you're missing the slash, but have configured Sensu to use the vhost `/sensu`, you will see an error._

If your vhost output doesn't look like the output above, create the vhost:

{{< highlight shell >}}
sudo rabbitmqctl add_vhost /sensu{{< /highlight >}}

- Ensure that the `sensu` user is present:

{{< highlight shell >}}
sudo rabbitmqctl list_users{{< /highlight >}}

This should give you output that looks like:

{{< highlight shell >}}
Listing users ...
sensu   []
guest   [administrator]{{< /highlight >}}

If the user isn't present, add the user and the password for the user:

{{< highlight shell >}}
sudo rabbitmqctl add_user sensu secret
{{< /highlight >}}

_NOTE: If the user is present, and the password needs to be reset, you can reset it by using `sudo rabbitmqctl change_password sensu secret`_

- Ensure that the `sensu` user has the correct permissions for the vhost:

{{< highlight shell >}}
sudo rabbitmqctl list_permissions -p /sensu{{< /highlight >}}

You should see output that looks like the following:

{{< highlight shell >}}
Listing permissions for vhost "/sensu" ...
sensu   .*      .*      .*{{< /highlight >}}

If the permissions are not correct, you can set them via:

{{< highlight shell >}}
sudo rabbitmqctl set_permissions -p /sensu sensu ".*" ".*" ".*"
{{< /highlight >}}

Once we've ensured that our credentials are correct, we can see that RabbitMQ starts showing connections being accepted again:

{{< highlight shell >}}
tail -f /var/log/rabbitmq/rabbit\@sensu.log
2018-06-26 01:28:35.191 [info] <0.642.0> accepting AMQP connection <0.642.0> (192.168.1.3:44816 -> 192.168.1.2:5671)
2018-06-26 01:28:35.194 [info] <0.642.0> connection <0.642.0> (192.168.1.3:44816 -> 192.168.1.2:5671): user 'sensu' authenticated and granted access to vhost '/sensu'{{< /highlight >}}

_WARNING: The credentials in this guide shouldn't be used in any production environment. If you're curious about how to better secure RabbitMQ, see our [Securing RabbitMQ Guide][7]._

### SSL

SSL issues are one of the more difficult ones to troubleshoot inside of Sensu. What lends to this difficulty is the way that AMQP (the protocol used by RabbitMQ) handles SSL failures, primarily in that the failure seen is indistinguishable from an actual authentication issue.

If you've already gone through the steps in the previous section to confirm that your Sensu instance is using the correct credentials to connect to your RabbitMQ instance, then you'll want to proceed through this part of the guide to rule out any issues with SSL.

_PRO TIP: For troubleshooting SSL issues, the openssl tool provides a wealth of troubleshooting capabilities. To see what is possible with the tool, take a look at this [handy cheat sheet][8]._

#### Handshake Failures

There are several layers of the proverbial onion when it comes to diagnosing handshake failures. We'll start by looking at the obvious errors that you'll see in logs, and dive deeper from there. The assumption here is that you've already configured Sensu to use SSL. If not, you'll want to refer back to our [SSL Configuration Reference material][9] before you proceed. Now, on to examining the errors you'll likely encounter in a handshake failure scenario:

**Sensu Logs**:
{{< highlight shell >}}{"timestamp":"2018-06-10T16:39:15.988000+0200","level":"warn","message":"transport connection error","reason":"tcp connection lost"}
{"timestamp":"2018-06-10T16:39:15.989000+0200","level":"warn","message":"transport connection error","reason":"possible authentication failure. wrong credentials?","user":"sensu"}{{< /highlight >}}

Much like the errors seen in the previous section, the failure to connect to RabbitMQ appears to be one related to credentials. However, we can go a bit deeper by looking at the RabbitMQ logs, which present an error similar to the following:

{{< highlight shell >}}2018-06-11 15:31:03.515 [info] <0.1540.0> TLS server: In state certify at ssl_handshake.erl:1289 generated SERVER ALERT: Fatal - Handshake Failure - {bad_cert,invalid_ext_key_usage}{{< /highlight >}}

_NOTE: We'll presume that if you've gone through our SSL guide, that you're using the [SSL tool][10] to generate the certificates used in your deployment. If not, this is not a problem, as the commands we'll use for troubleshooting this particular scenario will prove useful no matter how your cert and key pairs are generated._

Let's start off by manually verifying our certificate and key pairs. Sensu's SSL tool will place the certs/keys in the following directory:

{{< highlight shell >}}
sensu_ssl_tool
├── client
│ ├── cert.pem
│ ├── keycert.p12
│ ├── key.pem
│ └── req.pem
├── sensu_ca
│ ├── cacert.cer
│ ├── cacert.pem
│ ├── certs
│ │ ├── 01.pem
│ │ └── 02.pem
│ ├── index.txt
│ ├── index.txt.attr
│ ├── index.txt.attr.old
│ ├── index.txt.old
│ ├── openssl.cnf
│ ├── private
│ │ └── cakey.pem
│ ├── serial
│ └── serial.old
├── server
│ ├── cert.pem
│ ├── keycert.p12
│ ├── key.pem
│ └── req.pem
└── ssl_certs.sh{{< /highlight >}}

From the `sensu_ssl_tool` directory, we'll check for a match between the cert and key used inside of the RabbitMQ configuration:

{{< highlight shell >}}
openssl x509 -noout -modulus -in server/cert.pem | openssl md5
(stdin)= 32df80471e2d4e7d0453f60cfb66b2b2
openssl rsa -noout -modulus -in server/key.pem | openssl md5
(stdin)= 32df80471e2d4e7d0453f60cfb66b2b2{{< /highlight >}}

And then the same with our client cert and key (cert and key being used inside of the Sensu configuration):

{{< highlight shell >}}
openssl x509 -noout -modulus -in client/cert.pem | openssl md5
(stdin)= c2a6a5a28a629653741e7674c3b95b19
openssl rsa -noout -modulus -in client/key.pem | openssl md5
(stdin)= c2a6a5a28a629653741e7674c3b95b19{{< /highlight >}}

_WARNING: Should the values here NOT match, you'll need to regenerate your cert/key pairs._

And just to test to ensure that we can indeed connect with our cert/key pairs, we can use openssl to connect to our RabbitMQ instance directly:

{{< highlight shell >}}
openssl s_client -connect localhost:5671 -key client/key.pem{{< /highlight >}}

Which should give you output that will look similar to the following:

{{< highlight shell >}}
CONNECTED(00000003)
depth=1 CN = SensuCA
verify error:num=19:self signed certificate in certificate chain
---
Certificate chain
0 s:/CN=sensu/O=server
i:/CN=SensuCA
1 s:/CN=SensuCA
i:/CN=SensuCA
{{< /highlight >}}

Provided that the MD5 sums match and we're able to connect to RabbitMQ via openssl, we can effectively rule out any issues with the certificates.

Let's move on to looking at the certificate (in this case, the server certificate specifically) and see what we find there. You can use the following command to examine the inner details of a certificate:

{{< highlight shell >}}
openssl x509 -in server/cert.pem -text -noout{{< /highlight >}}

This will give you quite a bit, but the most important thing to note here is a specific extension:

{{< highlight shell >}}
        X509v3 extensions:
            X509v3 Basic Constraints:
                CA:FALSE
            X509v3 Key Usage:
                Key Encipherment
            X509v3 Extended Key Usage:
                TLS Web Server Authentication{{< /highlight >}}

In the output above, we're specifically interested in the `TLS Web Server Authentication` extension. In a non-working certificate, _you will not see this present._ Instead, you'll end up seeing a value that looks similar to a SNMP MIB. See the image below for an example.

<img alt="Screenshot showing the extendedKeyUsage for a non-working certificate as 1.3.6.1.6.6.7.3.2" src="/images/ssl_example.png" width="433px">

#### Unknown CA
There is a possibility that you may encounter an error inside of RabbitMQ when configuring SSL/TLS that states the following: "Unknown CA". To remedy this issue, ensure that the _full certificate chain_ is present on every system connecting to RabbitMQ (e.g., Sensu clients, Sensu Servers.)

Hopefully you've found this useful! If you find any issues or have any questions, feel free to reach out in our [Community Slack][15], or [open an issue][16] on Github.

<!-- LINKS -->
[1]: /uchiwa/latest/getting-started/installation/
[2]: ../../platforms/sensu-on-rhel-centos/#sensu-enterprise
[3]: ../../quick-start/five-minute-install/
[4]: ../../reference/configuration/#sensu-service-script-configuration-variables
[5]: ../../reference/checks/#standalone-checks
[6]: ../../installation/install-rabbitmq-on-rhel-centos/#configure-rabbitmq-access-controls
[7]: ../securing-rabbitmq/
[8]: https://medium.freecodecamp.org/openssl-command-cheatsheet-b441be1e8c4a
[9]: ../../reference/ssl/
[10]: ../../files/sensu_ssl_tool.tar
[11]: /images/ssl_example.png
[12]: https://github.com/sensu/sensu-docs/issues/new
[13]: ../../reference/clients/#socket-attributes
[14]: https://github.com/sensu-plugins/sensu-plugins-mailer
[15]: https://slack.sensu.io
[16]: https://github.com/sensu/sensu-docs/issues/new
