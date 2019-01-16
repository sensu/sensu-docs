---
title: "Troubleshooting Sensu Enterprise"
linkTitle: "Troubleshooting"
product: "Sensu Enterprise"
version: "2.8"
weight: 10
menu:
 sensu-enterprise-2.8:
   parent: guides
---

This guide provides an introduction to troubleshooting Sensu Enterprise.
For information about troubleshooting the Sensu client and RabbitMQ connection, see the [Sensu Core troubleshooting guide][1].

- [Reloading Configuration](#reloading-configuration)
- [Collecting Logs](#collecting-logs)
- [Settings Log Levels](#setting-log-levels)
- [Printing Configurations](#printing-configurations)
- [Resolving Private Key Errors](#resolving-private-key-errors)

### Reloading Configuration

Following any changes to the Sensu Enterprise configuration, you must reload Sensu Enterprise in order for the changes to take effect.

Reload Sensu Enterprise on Linux distributions using `systemd`:

{{< highlight shell >}}
sudo systemctl reload sensu-enterprise{{< /highlight >}}

Reload Sensu Enterprise on Linux distributions using `sysvinit`:

{{< highlight shell >}}
sudo service sensu-enterprise reload{{< /highlight >}}

When making changes to the Sensu client configuration, restart the client using the process described in the [Sensu Core troubleshooting guide][2].

### Collecting Logs

Sensu's logs provide a wealth of information when troubleshooting issues. They live at `/var/log/sensu`:

{{< highlight shell >}}
/var/log/sensu
├── sensu-enterprise.log
└── sensu-enterprise-dashboard.log{{< /highlight >}}

You can view the Sensu Enterprise logs at the paths above, or provide the last 10,000 lines in an archive:

{{< highlight shell >}}
tail -n 10000 /var/log/sensu/sensu-enterprise.log > sensu-enterprise-10k.log && gzip -9 sensu-enterprise-10k.log{{< /highlight >}}

### Setting Log Levels

Sensu has the ability to set log levels interactively, or by using a configuration directive in `/etc/default/sensu-enterprise`. This is particularly useful when attempting to debug an issue where the current log level doesn't provide sufficient information. Let's take a look at the ways you can set your log levels.

The quickest way to toggle the `debug` log level on/off for Sensu Enterprise is to use `sudo kill -TRAP $SENSUPID`:

{{< highlight shell >}}
sudo ps aux | grep [s]ensu-enterprise
sensu     5992  1.7  0.3 177232 24352 ...
sudo kill -TRAP 5992{{< /highlight >}}

Additionally, you can set the log level to `info` or `debug` by using the configuration directive in `/etc/default/sensu-enterprise`. Let's take a look at an example:

{{< highlight shell >}}
sudo cat /etc/default/sensu-enterprise
LOG_LEVEL=debug{{< /highlight >}}

And after setting that directive, [reload Sensu Enterprise](#reloading-configuration):

{{< highlight shell >}}
sudo systemctl reload sensu-enterprise{{< /highlight >}}

Keep in mind that to set log levels back to normal, you can either run `sudo kill -TRAP $SENSUPID` (if you've used that method), or revert the change in `/etc/default/sensu-enterprise` and reload Sensu Enterprise for the change to take place.

_NOTE: By default, Sensu's logging level is set to `info`. However, there are more log levels available than just `info` and `debug`. You can find the full list of available log levels in the [configuration reference documentation][4]. It's worth noting that `debug` is the most granular log level, while `fatal` is the least granular._

### Printing Configurations

Frequently, Sensu staff or community members may ask you to print your configuration.
To print the configuration for Sensu Enterprise:

{{< highlight shell >}}sudo -u sensu java -jar /usr/lib/sensu-enterprise/sensu-enterprise.jar -c /etc/sensu/config.json -d /etc/sensu/conf.d --print_config | tee /tmp/se-config.json{{< /highlight >}}

This command will create a file (`/tmp/se-config.json`) containing the entire configuration for your Sensu deployment.
This can be especially useful when comparing the configuration that Sensu is aware of, versus the configuration living on-disk.
If the values of a particular file differ from what you're expecting, then see the next section for how to proceed.

### Resolving Private Key Errors

Sensu Enterprise can use PEM-formatted TLS/SSL certificates and private keys to secure communication with Redis and RabbitMQ.
(See the [securing Sensu guide][3] for more information.)
These keys must be in a plaintext, unencrypted format, otherwise you may see an error containing the following:

{{< highlight text >}}
Unexpected exception: undefined method `get_private_key_info' for #
{{< /highlight >}}

If you see the word `ENCRYPTED` in the first few lines of the PEM private key, the key is in an unsupported, encrypted format.
You can resolve this issue by converting the key to a plaintext format using the OpenSSL RSA key processing tool:

{{< highlight shell >}}
openssl rsa -in [encrypted.pem] -out [plaintext.pem]
{{< /highlight >}}

[1]: /sensu-core/latest/guides/troubleshooting
[2]: /sensu-core/latest/guides/troubleshooting#restarting-services
[3]: /sensu-core/latest/guides/securing-sensu
[4]: /sensu-core/latest/reference/configuration/#sensu-service-script-configuration-variables
