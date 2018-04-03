---
title: "How to send alerts to Slack with handlers"
linkTitle: "Sending Slack Alerts"
weight: 20
version: "2.0"
product: "Sensu Core"
platformContent: false
menu: 
  sensu-core-2.0:
    parent: guides
---

## What are Sensu handlers?

Sensu event handlers are actions executed by the Sensu server on [events][1].

## Why use a handler?

Handlers can be used for sending email alert, creating or resolving an incident
(e.g., in PagerDuty, ServiceNow, etc), or storing metrics in a time-series
database (e.g., Graphite).

## Using a handler to send alerts to Slack

The purpose of this guide is to help you send alerts to Slack, on the channel
`monitoring`, by configuring a handler named `slack` to a check named
`check-cpu`. If you don't already have a check in place, [this guide][2] is a
great place to start.

### Installing the handler command

The first step is to create an executable script named `handler-slack`, which is
responsible for sending the event data to Slack. The source code of this script
is available on [GitHub][3] and can easily be compiled or [cross compiled][10]
using the [Go tools][4]. The generated binary will be placed into one of the
Sensu backend [`$PATH` directories][5], more precisely `/usr/local/bin`.

{{< highlight shell >}}
# From the local path of the sensu-go repository
go build -o /usr/local/bin/handler-slack handlers/slack/main.go
{{< /highlight >}}

### Creating the handler

Now that our handler command is installed, the second step is to create a
handler that we will call `slack`, which is a **pipe** handler that pipes event
data into our previous script named `handler-slack`. We will also pass the
[Slack webhook URL][6] and the Slack channel name to this script.

{{< highlight shell >}}
sensuctl handler create slack \
--type pipe \
--command 'handler-slack \
  --webhook-url https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX \
  --channel monitoring'
{{< /highlight >}}

### Assigning the handler to a check

With the `slack` handler now created, it can be assigned to a check. Here, since
we want to receive Slack alerts whenever the CPU usage of our systems reach some
specific thresholds, we will apply our handler to the check `check-cpu`.

{{< highlight shell >}}
sensuctl check set-handlers check-cpu slack
{{< /highlight >}}

### Validating the handler

It might take a few moments, once the handler is assigned to the check, for the
check to be scheduled on the entites and the result sent back to Sensu backend,
but once an event is handled, you should see the following message in
Slack.

<div style="width:500px">
   <img class="html" src="/images/handler-slack.png"/>
</div>

Otherwise, you can verify the proper behavior of this handler by using
`sensu-backend` logs. The default location of these logs varies based on the
platform used, but the [installation and configuration][7] documentation
provides this information.

Whenever an event is being handled, a log entry is added with the message
`"handler":"slack","level":"debug","msg":"sending event to handler"`, followed
by a second one with the message `"msg":"pipelined executed event pipe
handler","output":"","status":0`.

## Next steps

You now know how to apply a handler to a check and take action on events. From
this point, here are some recommended resources:

* Read the [handlers reference][8] for in-depth
  documentation on handlers. 
* Read our guide on [reducing alert fatigue][9] with filters.

[1]: ../../reference/events/
[2]: ../monitor-server-resources/
[3]: https://github.com/sensu/sensu-go/blob/e52f6e06c9983a804e4f1ea369f9ab3bd265d07a/handlers/slack/main.go
[4]: https://golang.org/doc/install
[5]: https://en.wikipedia.org/wiki/PATH_(variable)
[6]: https://api.slack.com/incoming-webhooks
[7]: ../../getting-started/installation-and-configuration/#validating-the-services
[8]: #
[9]: ../reduce-alert-fatigue/
[10]: https://rakyll.org/cross-compilation/