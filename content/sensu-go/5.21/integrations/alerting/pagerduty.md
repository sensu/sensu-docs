---
title: "Integrate Sensu with PagerDuty"
linkTitle: "PagerDuty"
description: "Description placeholder."
version: "5.21"
product: "Sensu Go"
menu:
  sensu-go-5.21:
    parent: alerting
---

Sensu integrates with PagerDuty via the [Sensu PagerDuty Handler asset][1] so that Sensu events can trigger and resolve PagerDuty incidents.

## Requirements

To use the [Sensu PagerDuty Handler asset][1], you will need an existing Sensu Go instance and a [PagerDuty][3] account.

## Example

Example placeholder

## PagerDuty integration specification

Spec placeholder

## Interactive tutorial: Send Sensu Go alerts to PagerDuty

Our interactive tutorial demonstrates how to configure your Sensu Go backend with the Sensu PagerDuty Handler asset and send critical alerts to your PagerDuty account.

In the [Send Sensu Go alerts to PagerDuty][2] tutorial, you will:

- Add a Sensu Nagios Foundation asset.
- Add the PagerDuty asset and create a handler that uses your PagerDuty API key.
- Send an alert for a Sensu Go event to PagerDuty.


[1]: https://bonsai.sensu.io/assets/sensu/sensu-pagerduty-handler
[2]: https://docs.sensu.io/sensu-go/latest/learn/sensu-pagerduty
[3]: https://www.pagerduty.com/
