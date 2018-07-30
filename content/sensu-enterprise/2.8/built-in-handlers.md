---
title: "Built-in Handlers"
product: "Sensu Enterprise"
version: "2.8"
weight: 6
menu: "sensu-enterprise-2.8"
---
**ENTERPRISE: Built-in handlers are available for [Sensu Enterprise][0]
users only.**

## Reference documentation

- [What are built-in handlers?](#what-are-built-in-handlers)
- [How to use built-in handlers?](#how-to-use-built-in-handlers)
  - [Examples](#example-integration-configurations)
- [List of built-in handlers](#list-of-built-in-handlers)

## What are built-in Handlers?

Sensu Enterprise ships with several built-in third-party integrations, which
provide Sensu [event handlers][1]. These built-in handlers can be used to handle
events for any [check][2]. The Enterprise integrations use their own global
configuration namespaces in combination with [enterprise contact routing][3] to
provide granular controls over how events should be handled in a variety of
circumstances.

## How to use built-in handlers

After configuring one or more [enterprise handlers][4], you can specify which
ones are used per check or create a default handler set to specify those used by
default.

### Examples {#example-integration-configurations}

The following is an example of how to configure a Sensu check to use the
built-in `email` integration (i.e. Enterprise handler).

`/etc/sensu/conf.d/checks/load_balancer_listeners.json`

{{< highlight json >}}
{
  "checks": {
    "load_balancer_listeners": {
      "command": "check-haproxy.rb -s /var/run/haproxy.sock -A",
      "subscribers": [
        "load_balancer"
      ],
      "interval": 20,
      "handler": "email"
    }
  }
}
{{< /highlight >}}

The following is an example of how to configure the Sensu default handler in
order to specify one or more built-in enterprise handlers. The default handler
is used when a check definition does not specify one or more event handlers.
This example specifies the built-in `email` and `slack` enterprise handlers.

`/etc/sensu/conf.d/handlers/default.json`

{{< highlight json >}}
{
  "handlers": {
    "default": {
      "type": "set",
      "handlers": [
        "email",
        "slack"
      ]
    }
  }
}
{{< /highlight >}}


## List of built-in handlers

Built-in event handlers:

- [Email](../integrations/email) - send email notifications for events
- [PagerDuty](../integrations/pagerduty) - create and resolve PagerDuty incidents for events
- [Rollbar](../integrations/rollbar) - Create and resolve Rollbar messages/items for Sensu events
- [ServiceNow](../integrations/servicenow) - create ServiceNow CMDB configuration items and incidents
- [JIRA](../integrations/jira) - create and resolve JIRA issues for Sensu events
- [VictorOps](../integrations/victorops) - create and resolve VictorOps messages for events
- [OpsGenie](../integrations/opsgenie) - create and close OpsGenie alerts for events
- [Slack](../integrations/slack) - send notifications to a Slack channel for events
- [HipChat](../integrations/hipchat) - send notifications to a HipChat room for events
- [IRC](../integrations/irc) - send notifications to an IRC channel for events
- [SNMP](../integrations/snmp) - send SNMP traps to a SNMP manager
- [Graylog](../integrations/graylog) - send Sensu events to Graylog
- [Flapjack](../integrations/flapjack) - relay Sensu check results to Flapjack
- [Puppet](../integrations/puppet) - deregister Sensu clients without an associated Puppet node
- [Chef](../integrations/chef) - deregister Sensu clients without an associated Chef node
- [EC2](../integrations/ec2) - deregister Sensu clients without an allowed EC2 instance state
- [Event Stream](../integrations/event_stream) - send all Sensu events to a remote TCP socket
- [InfluxDB](../integrations/influxdb) - send metrics to InfluxDB. Learn how to easily route and translate data with InfluxDB and Sensu [here][5].
- [Graphite](../integrations/graphite) - send metrics to Graphite
- [Wavefront](../integrations/wavefront) - send metrics to Wavefront
- [Librato](../integrations/librato) - send metrics to Librato Metrics
- [OpenTSDB](../integrations/opentsdb) - send metrics to OpenTSDB
- [DataDog](../integrations/datadog) - create Datadog events

[?]:  #
[0]:  /sensu-enterprise
[1]:  /sensu-core/1.2/reference/handlers
[2]:  /sensu-core/1.2/reference/checks
[3]:  ../contact-routing
[4]:  #list-of-built-in-handlers
[5]: http://monitoringlove.sensu.io/influxdb
