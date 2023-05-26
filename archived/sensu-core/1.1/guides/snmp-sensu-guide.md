---
title: "Monitoring Devices With Sensu's SNMP Receiver Extension"
linkTitle: "SNMP Receiver Extension"
description: "Set up a Sensu client as a Simple Network Management Protocol trap receiver."
product: "Sensu Core"
version: "1.1"
weight: 7
menu:
 sensu-core-1.1:
   parent: guides
---

## Objectives
- Set up a Sensu client as an SNMP trap receiver
- Send a test SNMP trap to simulate a real world circumstance
- Demonstrate the results of the SNMP trap test in Uchiwa/Sensu Enterprise Dashboard

## Prerequisites
- A working Sensu deployment including sensu-server/sensu-api (or sensu-enterprise), sensu-client, and transport/datastore components
- [Uchiwa][1], or [Sensu Enterprise Dashboard][2] installed and configured
- `snmptrap` command installed on a Linux device (we’ll use CentOS 7) 

If you don’t have Sensu spun up yet, we encourage you to go through our [5 minute install guide][3].

For installing the `snmptrap` command, you’ll want to run the following to install the command on a CentOS/RHEL device:

{{< code shell >}}
sudo yum install -y net-snmp-utils{{< /code >}}

## Additional Resources
- DigitalOcean's [Intro to SNMP][4]
- [SNMP extension Github repository][5] 

## Sensu Client Configuration
As the Sensu monitoring agent cannot be installed on most networking gear, hosts that send SNMP traps in Sensu function as [proxy clients][6]. In this example, the general flow will be as follows:

SNMP trap generated→ SNMP trap received by Sensu client → Sensu client sends result to transport/Sensu server → event is created

We’ll start by first installing the extension and enabling it on a given client that we expect to function as an SNMP trap receiver:

{{< code shell >}}
sudo sensu-install -e snmp-trap:0.0.33{{< /code >}}

Note that this only installs the extension, it does not enable it. In order for the extension to be functional, we’ll also need to edit the file `/etc/sensu/conf.d/extensions.json` to enable the file:

{{< code json >}}
{
  "extensions": {
    "snmp-trap": {
      "version": "0.0.33"
    }
  }
}{{< /code >}}

As well as change the configuration of the extension in `/etc/sensu/conf.d/snmp_trap.json`:

{{< code json >}}
{
  "snmp_trap": {
    "community": "sensutest"
  }
}{{< /code >}}

One other important piece of configuring the extension is to create the `/etc/sensu/mibs` directory:

{{< code shell >}}
sudo mkdir /etc/sensu/mibs
sudo chown sensu. /etc/sensu/mibs{{< /code >}}

This directory is where the SNMP extension will look for any MIB files used to translate the trap OIDs into something that’s readable by humans...unless you know what your OID means off the top of your head. 

You’ll need to ensure that you place the MIB provided by your device manufacturer in directory above. If you already have MIBs present in another location, you can override the default location by specifying the the `mibs_dir` or `imported_dir` attributes in your `snmp_trap.json` configuration file.

_WARNING: Before proceeding any further, you’ll need to restart your `sensu-client` process so that the configuration is loaded._

{{< code shell >}}
sudo systemctl restart sensu-client{{< /code >}}

You can confirm that the client is now listening on the correct port by performing the following command:

{{< code shell >}}
sudo netstat -plunt | grep 1062{{< /code >}}

At this point, it’s worth noting that the configuration provided here is a basic, bare-minimum configuration. There are additional options you can add to your SNMP extension configuration to suit your needs. We cover those [here](#additional-snmp-extension-options). But to get a general sense of how SNMP traps function with Sensu, continue reading below.

## Testing the SNMP Extension
So far, we’ve done the following:
- Installed the SNMP trap extension
- Configured the extension
- Configured the SNMP trap receiver
- Confirmed that the SNMP trap receiver is listening on our host

Now comes the fun part: testing the extension to make sure that our trap receiver is working as expected. If you’ve met the prerequisites, you should already have the `net-snmp-utils` package installed on your host, which has the `snmptrap` command that we’ll be using in our tests. 

Let’s start by generating a test trap:

{{< code shell >}}
sudo snmptrap -v 2c -c sensutest localhost:1062 '' IF-MIB::linkDown ifIndex i 2{{< /code >}}

Here’s a quick explanation for those of you who are curious about what we’re doing. From the `snmptrap` man pages, this is the syntax of the command:

{{< code shell >}}
 snmptrap -v [2c|3] [COMMON OPTIONS] [-Ci] AGENT uptime trap-oid [OID TYPE VALUE]...{{< /code >}}

So our command does the following:
Sets the version (`-v`) to 2c
Sets the community string (`-c`) to “sensutest”
Specifies the host to send the trap to (`localhost:1062`)
Sets the uptime ( ‘’ in our case, as it’s not necessary that we have the uptime for the test)
Provides a shortened MIB (`IF-MIB::linkDown`)
Provides the `ifIndex` type with an integer value of `2` (i.e., the 2nd port on a device)

That’s it. That’s all we need to generate a trap. Running the command will give you no confirmation via the command line, but you should see something similar to the following in your Sensu Enterprise Dashboard:

{{< figure src="/images/core/snmp_sensu_guide/snmp_link_down.png" alt="Sensu Enterprise Dashboard confirmation of SNMP link down" link="/images/core/snmp_sensu_guide/snmp_link_down.png" target="_blank" >}}

And in detail:

{{< figure src="/images/core/snmp_sensu_guide/snmp_link_down_detail.png" alt="Sensu Enterprise Dashboard confirmation of SNMP link down, in detail" link="/images/core/snmp_sensu_guide/snmp_link_down_detail.png" target="_blank" >}}

To resolve the alert, we pass a similar trap command:

{{< code shell >}}
sudo snmptrap -v 2c -c sensutest localhost:1062 '' IF-MIB::linkUp ifIndex i 2{{< /code >}}

Which yields:

{{< figure src="/images/core/snmp_sensu_guide/snmp_link_up.png" alt="Sensu Enterprise Dashboard confirmation of SNMP link up" link="/images/core/snmp_sensu_guide/snmp_link_up.png" target="_blank" >}}

You can then delete the result from the dashboard. 

## Additional SNMP Extension Options{#additional-snmp-extension-options}
Earlier in the guide, we mentioned that there are some additional options you can configure for the SNMP trap listener. Let's take a look starting with some of the more basic ones:

bind         | 
-------------|------
description  | The SNMP receiver host address.
required     | false
type         | String
default      | `0.0.0.0`
example      | {{< code shell >}}"host": "8.8.8.8"{{< /code >}}

port         | 
-------------|------
description  | The SNMP receiver trap port (UDP).
required     | false
type         | Integer
default      | `1062`
example      | {{< code shell >}}"port": 1062{{< /code >}} _NOTE: By default, SNMP uses :162 UDP. When configuring a network device, you'll need to ensure that traps are sent to the Sensu client over :1062 UDP._

Filters, severities, handlers are also able to be applied on the SNMP trap receiver configuration:

filters        | 
---------------|------
description    | An array of Sensu event filters (names) to use when filtering events for the handler. Each array item must be a string. Specified filters are merged with default values.
required       | false
type           | Array
default        | {{< code shell >}}["handle_when", "check_dependencies"]{{< /code >}}
example        | {{< code shell >}}"filters": ["recurrence", "production"]{{< /code >}}

severities     | 
---------------|------
description    | An array of check result severities the handler will handle. _NOTE: event resolution bypasses this filtering._
required       | false
type           | Array
allowed values | `ok`, `warning`, `critical`, `unknown`
example        | {{< code shell >}} "severities": ["critical", "unknown"]{{< /code >}}

handlers     | 
-------------|------
description  | An array of Sensu event handlers (names) to use for events created by the check. Each array item must be a string.
required     | false
type         | Array
example      | {{< code shell >}}"handlers": ["pagerduty", "email"]{{< /code >}}

There are also some more advanced options available:

varbind_trim | 
-------------|------
description  | The SNMP trap varbind value trim length. The network(s) UDP MTU dictates how large the trap payloads can be, trimming varbind values keeps the payloads within limits.
required     | false
type         | Integer
default      | `100`
example      | {{< code shell >}}"varbind_trim": 300{{< /code >}}

mibs_dir     | 
-------------|------
description  | MIBs directory to import and load MIBs from.
required     | false
type         | string
default      | `/etc/sensu/mibs`

imported_dir | 
-------------|------
description  | Directory to store imported MIB data in.
required     | false
type         | string
default      | `$TMPDIR/sensu_snmp_imported_mibs`

result_map	 | 
-------------|------
description  | SNMP trap varbind to Sensu check result translation mappings.
required     | false
type         | array
default      | `[]`

result_status_map	 | 
-------------|------
description  | SNMP trap varbind to Sensu check result status mappings.
required     | false
type         | array
default      | `[]`

To get better understand how the `result_map` and `result_status_map` attributes work, continue reading below.

### Result Map Examples

The configurable result map allows you to define SNMP trap varbind to Sensu check result attribute mappings. A mapping is comprised of a varbind name regular expression and a check attribute. For example, if you expect SNMP traps with a varbind name that contains "AlertDescription" and you would like to use its value as the Sensu check result output:

{{< code json >}}
{
  "snmp_trap": {
    "...": "...",
    "result_map": [
      ["/description/i", "output"]
    ]
  }
}{{< /code >}}

Configuring a result map does not replace the built-in mappings, the configured mappings take precedence over them.

### Result Status Map Examples

The configurable result status map allows you to define SNMP trap varbind to numeric Sensu check result status value mappings. A mapping is comprised of a varbind name regular expression and an check exit status (e.g. 1-255). For example, if you expect SNMP traps with a varbind name that contains "CriticalError" and you would like to set the Sensu check result status to `2` (critical):

{{< code json >}}
{
  "snmp_trap": {
    "...": "...",
    "result_status_map": [
      ["/critical/i", 2]
    ]
  }
}
{{< /code >}}

Configuring a result status map does not replace the built-in mappings, the configured mappings take precedence over them.

# Wrapping Up
Congratulations! You've successfully set up Sensu to act as an SNMP trap receiver. To recap, we covered the following:

- Setting up a Sensu client as an SNMP trap receiver
- Sending a test SNMP trap to simulate a real world circumstance
- Demonstrating the results of the SNMP trap test in Uchiwa/Sensu Enterprise Dashboard

While in this guide we're relying on Sensu to act as a receiver with hosts sending traps to it, there is also the [Sensu SNMP check plugin][7], which allows Sensu to poll a device for some basic metrics and checks. This allows for some flexibility in how you choose to use Sensu to monitor devices using SNMP.  

Hopefully you've found this useful! If you find any issues or question, feel free to reach out in our [Community Slack][8], or [open an issue][9] on Github.

[1]: https://docs.uchiwa.io/
[2]: /sensu-core/latest/platforms/sensu-on-rhel-centos/#sensu-on-rhel-centos
[3]: /sensu-core/latest/quick-start/five-minute-install/
[4]: https://www.digitalocean.com/community/tutorials/an-introduction-to-snmp-simple-network-management-protocol
[5]: https://github.com/sensu-extensions/sensu-extensions-snmp-trap
[6]: /sensu-core/latest/reference/clients/#reference-documentation
[7]: https://github.com/sensu-plugins/sensu-plugins-snmp
[8]: https://slack.sensu.io
[9]: https://github.com/sensu/sensu-docs/issues/new
