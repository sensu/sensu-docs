---
title: "Using the ServiceNow Integration with Sensu Enterprise"
linkTitle: "ServiceNow Integration"
product: "Sensu Enterprise"
version: "2.8"
weight: 1
menu:
 sensu-enterprise-2.8:
   parent: guides
---

In this guide, we'll cover configuring and using the Sensu Enterprise ServiceNow (SNOW) integration.

# Prerequisites

Before diving into this guide, we recommend having the following components ready:

- A working Sensu Enterprise deployment
- Working SNOW Instance (you can sign up for a test instance at [developer.servicenow.com][1])
- SNOW credentials

## ServiceNow Integration Basics

Sensu Enterprise comes with a built-in integration for handling automatic registration and deregistration Sensu clients in SNOW. The integration also allows for creating incidents and events from Sensu incidents and events. We'll start off by configuring the integration, then move on to clients and checks. We'll finish by testing our integration and creating some test incidents to ensure that we've configured everything to our liking.

_NOTE: Given SNOW's highly customizable nature, we'll only cover a small portion of what can be configured. For any in-depth discussion about the SNOW integration configuration, we encourage you to make use of the `#enterprise` channel in the [Sensu Community Slack][2]_

### Integration Configuration

Below, we have an example configuration that would typically live under `/etc/sensu/conf.d/servicenow.json`. 

{{< highlight json >}}{
  "servicenow": {
    "host": "devXXXXXX.service-now.com",
    "user": "test_user",
    "password": "XXXXXXXXXXXXXXXX",
    "create_cmdb_ci": true,
    "cmdb_ci_table": "cmdb_ci_server",
    "incident_management": true,
    "incident_table": "incident",
    "event_management": true,
    "event_table": "em_event",
    "timeout": 10
  }
}{{< /highlight >}}

Let's take a moment to walk through what we're specifying in that config file:

* We've provided three required attributes: `"host"`, `"user"`, and `"password"`
* We then provide 6 additional attributes:
  * `"create_cmdb_ci"` - this will create the configuration items automatically for Sensu clients. By default, this is `true`.
  * `"cmdb_ci_table"` - specifies which cmdb table is used for the items created above. By default, this is `cmdb_ci_server`.
  * `"incident_management"` - specifies if we want SNOW incidents created for Sensu incidents. By default, this is `true`.
  * `"incident_table"` - specifies which table will be used for creating/resolving incidents. By default, this is `incident`.
  * `"event_management"` - specifies if we want SNOW events created for Sensu events. By default, this is `false`.
  * `"event_table"` - specifies which table will be used for creating events. By default, this is `em_event`.

After reloading Sensu Enterprise with `systemctl restart sensu-enterprise`, our configuration is activated. Let's take a look at how we provide SNOW attributes at the client level.

### Client Configuration

In order for the SNOW configuration to shine, we need to set attributes for SNOW under the `"servicenow"` scope in our client definition. Let's take a look at an example:

{{< highlight json >}}{
 "client": {
   "...": "...",
   "registration": {
     "handlers": ["servicenow"]
   },
   "servicenow": {
     "configuration_item": {
       "name": "sensu-enterprise-test",
       "cost": 10,
       "asset_tag": "SENSUSE001",
       "assigned_to": "abel.tuter@example.com",
       "department": "development",
       "display_name": "Sensu Enterprise Test Server",
       "company": "3Com"
     }
   }
 }
}{{< /highlight >}}

Let's walk through some of the key items in the configuration:

* For registration, we provide `"servicenow"` inside of our `"handlers"` array
* We then provide a hash of items under `"servicenow"`

After restarting our client to pick up the configuration, we can then see it in our dashboard:

![snow_inventory][3]

_NOTE: The key/value pairs under the `"configuration_item"` scope are exposed by our SNOW instance. These are all custom attriutes. I.e., they are not Sensu-reserved key words. One method of finding the full list of the attributes available in your SNOW instance is to go to "Inventory", right click on one of the column names, and then click "Show XML"._

Let's move on to how we might use SNOW for incident management by configuring our checks to use the `"servicenow"` handler.

### Check Configuration

Like any check, we can add the `"servicenow"` integration to our array of handlers. Let's take a look at an example:

{{< highlight json >}}{
  "checks": {
    "root_fs_check": {
      "command": "check-disk-usage.rb -i /run/user/1000/gvfs -w 90 -c 95",
      "subscribers": ["dev"] ,
      "interval": 10,
      "refresh": 10,
      "handlers": ["servicenow"]
    }
  }
}{{< /highlight >}}

In the example above, we're using the [Sensu community disk check plugin][4] to check the disk space for any `"dev"` subscribers. If we receive a warning or critical event for the disk space, an incident will appear in our Incident table inside of SNOW:

![snow_incident][5]

![snow_incident_detail][6]

## Testing the Configuration

Once you have all the requisite SNOW configurations in place, you can test the configuration using the following command:

{{< highlight shell >}} echo '{"name": "sensu-client-01","output": "THIS IS AN INCIDENT","refresh": 10, "status": 2,"handlers": ["servicenow"]}' | nc localhost 3030{{< /highlight >}}

This is a quick way to send JSON data to the local Sensu client socket to generate a mock event. If successful, you should see the following in your logs, and inside of SNOW:

{{< highlight shell >}}"timestamp":"2018-07-31T01:44:48.936181+0000","level":"info","message":"processing event","event":{"id":"b971c1ca-79a6-44fc-a5b5-0bc2b202c4a0","client":{"name":"sensu-client-01","address":"172.30.0.10","subscriptions":["dev","client:sensu-client-01"],"keepalive":{"handlers":["ec2"],"thresholds":{"warning":30,"critical":60}},"ec2":{"instance_id":"i-0b333990eabb06e35","allowed_instance_states":["running","rebooting"]},"registration":{"handlers":["servicenow"]},"deregister":true,"deregistration":{"handlers":["servicenow"]},"servicenow":{"configuration_item":{"name":"sensu-client-01","cost":"10","asset_tag":"SENSUCLIENT001","assigned_to":"abel.tuter@example.com","department":"development","display_name":"Sensu Test Client"}},"version":"1.4.2","timestamp":1533001478},"check":{"name":"sensu-client-01","output":"THIS IS AN INCIDENT","refresh":10,"status":0,"handlers":["servicenow"],"executed":1533001488,"issued":1533001488,"type":"standard","history":["2","2","2","2","2","2","2","0","2","2","2","2","2","2","2","2","0","2","0","2","0"],"total_state_change":38},"occurrences":1,"occurrences_watermark":1,"last_ok":1533001488,"action":"resolve","timestamp":1533001488,"last_state_change":1533001488,"silenced":false,"silenced_by":[]}}

{"timestamp":"2018-07-31T01:44:49.187061+0000","level":"info","message":"servicenow incident created successfully","short_description":"sensu-client-01/sensu-client-01 : THIS IS AN INCIDENT","event_id":"b971c1ca-79a6-44fc-a5b5-0bc2b202c4a0","contact_name":"default"}{"timestamp":"2018-07-31T01:44:51.021406+0000","level":"info","message":"servicenow incident resolved successfully","short_description":"sensu-client-01/sensu-client-01 : THIS IS AN INCIDENT","event_id":"b971c1ca-79a6-44fc-a5b5-0bc2b202c4a0","contact_name":"default"}{{< /highlight >}}

![snow_incident_fake][5]

## Wrapping It Up

That's all for this guide on configuring and using the Sensu Enterprise SNOW integration. We covered the following topics:

- Configuring the SNOW integration
- Configuring the client for use with SNOW
- Configuring checks to use SNOW for incident creation and handling

We hope you've found this useful. For additional resources about the SNOW integration or client SNOW attributes, see the reference links below.

## References

- [SNOW Integration Reference][7]
- [SNOW Client Attributes][8]

<!-- LINKS -->
[1]: https://developer.servicenow.com
[2]: https://slack.sensu.io
[3]: /images/snow_inventory.png
[4]: https://github.com/sensu-plugins/sensu-plugins-disk-checks
[5]: /images/snow_incident.png
[6]: /images/snow_incident_detail.png
[7]: ../../integrations/servicenow/
[8]: /sensu-core/1.3/reference/clients/#servicenow-attributes