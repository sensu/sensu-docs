---
title: "Sensuctl quickstart"
linkTitle: "Quickstart"
description: "This cheat sheet has some helpful sensuctl commands for quick reference. Use this quickstart for helpful sensuctl tips."
weight: 1
version: "5.16"
product: "Sensu Go"
platformContent: false 
menu:
  sensu-go-5.16:
    parent: sensuctl
---

### Configure sensuctl and log in

{{< highlight shell >}}
sensuctl configure
? Sensu Backend URL: http://127.0.0.1:8080
? Username: admin
? Password: P@ssw0rd!
{{< /highlight >}}

### Create resources from a file that contains JSON resource definitions

{{< highlight shell >}}
sensuctl create --file filename.json
{{< /highlight >}}

### View monitored entities

{{< highlight shell >}}
sensuctl entity list
{{< /highlight >}}

### View monitoring events

{{< highlight shell >}}
sensuctl event list
{{< /highlight >}}

### Edit a check

In this example, the check name is `check-cpu`:

{{< highlight shell >}}
sensuctl edit check check-cpu
{{< /highlight >}}

### View the JSON configuration for a check

In this example, the check name is `check-cpu`:

{{< highlight shell >}}
sensuctl check info check-cpu --format wrapped-json
{{< /highlight >}}
