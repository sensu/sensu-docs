---
title: "Integrate Sensu with Slack"
linkTitle: "Slack"
description: "Description placeholder."
version: "5.21"
product: "Sensu Go"
menu:
  sensu-go-5.21:
    parent: alerting
---

Use the [Sensu Slack Handler asset][1] to send Sensu event data to a specific Slack channel and stay up-to-date on your infrastructure within the same tool you’re already using for team collaboration.

## Requirements

To use the [Sensu Slack Handler asset][1] to route alerts to a Slack channel, you must have:

- An existing Sensu installation with at least one check running
- A Slack workspace where you have administrator access to create a webhook

## Examples

Follow [Send Slack alerts with handlers][2] to send alerts to Slack in the channel #monitoring by configuring a handler named `slack` to a check named `check-cpu`.

## Slack integration specification

Spec placeholder

## Interactive tutorial

Try the Slack integration in our [Learn Sensu in 15 minutes][3] tutorial.


[1]: https://bonsai.sensu.io/assets/sensu/sensu-slack-handler
[2]: https://docs.sensu.io/sensu-go/latest/guides/send-slack-alerts/
[3]: https://docs.sensu.io/sensu-go/latest/learn/learn-in-15/
