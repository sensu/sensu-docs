---
title: "Sensu live demo"
linkTitle: "Live Demo"
description: "Explore the Sensu dashboard and sensuctl command line tool with a live demo that monitors the Sensu docs site. See entities, monitoring events, and active service and metric checks."
version: "5.10"
weight: 2
product: "Sensu Go"
menu:
  sensu-go-5.10:
    parent: getting-started
---

<a href="http://caviar.tf.sensu.io:3000" onclick="ga('send', 'event', 'Demo', 'Click', 'Main demo link');">See a live demo of the Sensu dashboard</a> (log in with username `guest` and password `i<3sensu`).

Explore the <a href="http://caviar.tf.sensu.io:3000/default/entities" onclick="ga('send', 'event', 'Demo', 'Click', 'Entities page');">entities page</a> to see what Sensu is monitoring, the <a href="http://caviar.tf.sensu.io:3000/default/events" onclick="ga('send', 'event', 'Demo', 'Click', 'Events page');">events page</a> to see the latest monitoring events, and the <a href="http://caviar.tf.sensu.io:3000/default/checks" onclick="ga('send', 'event', 'Demo', 'Click', 'Checks page');">checks page</a> to see active service and metric checks.

You can also use the demo to try out sensuctl, the Sensu command line tool.
First, [install sensuctl][1] on your workstation, then configure sensuctl to connect to the demo.

{{< highlight shell >}}
sensuctl configure
? Sensu Backend URL: http://caviar.tf.sensu.io:8080
? Username: guest
? Password: i<3sensu
? Namespace: default
? Preferred output format: tabular
{{< /highlight >}}

You should now be able to see the latest monitoring events.

{{< highlight shell >}}
sensuctl event list
{{< /highlight >}}

See the [sensuctl quickstart][2] to get started using sensuctl.

### About the demo

The Caviar project shown in the demo monitors the Sensu docs site using a licensed Sensu cluster of three backends.

[1]: ../../installation/install-sensu#install-sensuctl
[2]: ../../sensuctl/quickstart
