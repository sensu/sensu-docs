---
title: "Live demonstration of Sensu"
linkTitle: "Live demo"
description: "Explore the Sensu web UI and sensuctl command line tool with a live demo that monitors the Sensu docs site. See entities, observability events, and active service and metric checks."
version: "6.0"
weight: 30
toc: false
product: "Sensu Go"
menu:
  sensu-go-6.0:
    parent: learn-sensu
---

<a href="https://caviar.tf.sensu.io:3000" onclick="ga('send', 'event', 'Demo', 'Click', 'Main demo link');">See a live demo of the Sensu web UI</a>.
Log in with username `guest` and password `i<3sensu`.

Explore the <a href="https://caviar.tf.sensu.io:3000/default/entities" onclick="ga('send', 'event', 'Demo', 'Click', 'Entities page');">Entities page</a> to see what Sensu is monitoring, the <a href="https://caviar.tf.sensu.io:3000/default/events" onclick="ga('send', 'event', 'Demo', 'Click', 'Events page');">Events page</a> to see the latest observability events, and the <a href="https://caviar.tf.sensu.io:3000/default/checks" onclick="ga('send', 'event', 'Demo', 'Click', 'Checks page');">Checks page</a> to see active service and metric checks.

You can also use the demo to try out sensuctl, the Sensu command line tool.
First, [install sensuctl][1] on your workstation.
Then, configure sensuctl to connect to the demo.

Run `sensuctl configure` and enter the following information:

{{< code shell >}}
? Authentication method: username/password
? Sensu Backend URL: https://caviar.tf.sensu.io:8080
? Namespace: default
? Preferred output format: tabular
? Username: guest
? Password: i<3sensu
{{< /code >}}

With sensuctl configured, to see the latest observability events, run:

{{< code shell >}}
sensuctl event list
{{< /code >}}

See the [sensuctl quickstart][2] to get started using sensuctl.

## About the demo

The Caviar project shown in the demo monitors the [Sensu docs site][3] using a licensed Sensu cluster of three backends.

[1]: ../../operations/deploy-sensu/install-sensu#install-sensuctl
[2]: ../../sensuctl/
[3]: https://docs.sensu.io/
