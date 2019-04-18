---
title: "Sensu live demo"
linkTitle: "Live Demo"
description: "Explore the Sensu dashboard and sensuctl command line tool with a live demo that monitors the Sensu docs site. See entities, monitoring events, and active service and metric checks."
version: "5.5"
weight: 1
product: "Sensu Go"
menu:
  sensu-go-5.5:
    parent: getting-started
---

[See a live demo of the Sensu dashboard](http://caviar.tf.sensu.io:3000) (log in with username `guest` and password `i<3sensu`).

Explore the [entities page][1] to see what Sensu is monitoring, the [events page][2] to see the latest monitoring events, and the [checks page][3] to see active service and metric checks.

You can also use the demo to try out sensuctl, the Sensu command line tool.
First, [install sensuctl][4] on your workstation, then configure sensuctl to connect to the demo.

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

See the [sensuctl quickstart][5] to get started using sensuctl.

### About the demo

The Caviar project shown in the demo monitors the Sensu docs site using a Sensu cluster of three backends and one agent.

[1]: http://caviar.tf.sensu.io:3000/default/entities
[2]: http://caviar.tf.sensu.io:3000/default/events
[3]: http://caviar.tf.sensu.io:3000/default/checks
[4]: ../../installation/install-sensu#install-sensuctl
[5]: ../../sensuctl/quickstart
