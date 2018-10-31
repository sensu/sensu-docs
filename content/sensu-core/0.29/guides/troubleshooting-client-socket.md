---
title: "Troubleshooting Configuration"
description: "Using the client local socket to test configurations"
product: "Sensu Core"
version: "0.29"
weight: 13
menu:
  sensu-core-0.29:
    parent: guides
---

# Troubleshooting via the Local Client Socket
This checklist is intended to be a step-by-step walkthrough of how to troubleshoot Sensu via the local client socket. There will be various examples for you to use and build on as you troubleshoot. 

## Local Client Socket
By default the sensu-client process listens for check results on a TCP socket. This allows you to submit ad-hoc check results, a capability which is very useful in  troubleshooting issues with Sensu, as well as testing and verifying that a particular configuration works as expected.

This client socket can be disabled, but does provide a few configurable attributes. See the [client reference documentation][] for further information. 

Before we start, let’s take a look at the prerequisites for using the client socket:

* sensu package installed
* nc package installed 
* jq package installed (not required, but will help when reading JSON results)
* sensu-client has minimal working configuration (client's keepalive timestamp (visible in dashboard or /clients API endpoint) is consistently being updated)
* sensu-client running (Can be verified with `systemctl status sensu-client`)
* Local socket is open (Can be verified with `netstat -tnlp | grep 3030` and `nc -vz localhost 3030`)

Once the prerequisites have been met, we can move to troubleshooting.

## Troubleshooting steps

Consider the following scenario: Sensu has been installed, has been verified to be working correctly, and is configured to send alerts via the [mailer handler][2]. However, mail doesn't appear to be coming through.

We'll start by crafting a test command to send to the local socket. Why? There are several reasons for using the client socket to troubleshoot:

1. Less configuration overhead. I.e., you don't have to push a check via configuration management.
2. The ability to issue a check and subsequently resolve it is instantaneous. There is no waiting on a check interval to elapse before the result is published.
3. The ability to customize what sort

echo ‘{“name”: “testing”, “output”: “THIS IS AN ERROR”, “status”: 2, “refresh”: 10, “handlers”: [“mailer”]}’ | nc localhost 3030

_WARNING: Successfully submitting a check result this way will be indicated by `ok` being printed on the next line -- typically this is appears ahead of the command prompt so it can be easily missed. See below for an example._

{{< highlight shell >}}
[root@sensu ~]# echo '{"name": "testing_error", "status": 2, "output": "An error event should be created", "refresh": 10, "handlers": [ "mailer"]}' | nc 127.0.0.1 3030
ok{{< /highlight >}}


_NOTE: a successfully submitted check result will also be logged to the sensu-client.log (viewable while in debug logging mode)._

{{< highlight shell >}}
{"timestamp":"2018-10-12T18:28:43.204565+0000","level":"info","message":"publishing check result","payload":{"client":"sensu-enterprise","check":{"name":"testing_error","output":"its just a test","status":2,"handler":"opsgenie","opsgenie":{"tags":{"this":"is wrong"}},"refresh":2,"executed":1539368923,"issued":1539368923}}}{{< /highlight >}}

Review the logs on the Sensu server to determine if the issue is making it through to the server
Grep for the error message, specifically the check “name” attribute.

{"timestamp":"2018-10-11T11:02:00.576261-0500","level":"info","message":"processing event","event":{"id":"f4a9453f-ac70-4e91-a601-a97ff31c589a","client":{"name":"sensu.sachshaus.local","address":"192.168.156.176","environment":"testing","subscriptions":["dev","blynk-api-poller","linux-hosts","roundrobin:web_probe","client:sensu.sachshaus.local"],"version":"1.5.0","timestamp":1539273717},"check":{"name":"testing","output":"THIS IS AN ERROR","status":2,"refresh":10,"executed":1539273720,"issued":1539273720,"type":"standard","history":["2"],"total_state_change":0},"occurrences":1,"occurrences_watermark":1,"last_ok":null,"action":"create","timestamp":1539273720,"last_state_change":1539273720,"silenced":false,"silenced_by":[]}}


Note the id of the event

"event":{"id":"f4a9453f-ac70-4e91-a601-a97ff31c589a"

Ensure that the event is being handled by the mailer handler (you can do this by searching for the event_id and looking at additional log entries to confirm that the event is handled as expected)
Identify the error 
In the mailer example, the issue that is typically seen will be due to the handler doing its own event filtering. The solution is to set a low refresh value in the check configuration. 
Use Cases
Some example use cases for using the local socket include:
Email alerts not being sent
Contact routing not functioning
Customer suspects an event is being filtered
General testing to ensure that a handler or integration is configured properly
Most Common Issues Surfaced
Troubleshooting via the local client socket typically surfaces the following types of issues:
Misconfiguration (either of Sensu, or a handler’s/integration’s corresponding service)
Inadvertent filtering (in the case of the community mailer, or handle_when in Sensu Enterprise Classic)

<!-- LINKS -->
[1]: ../../reference/clients/#socket-attributes
[2]:
