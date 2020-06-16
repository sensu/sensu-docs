---
title: "Sensuctl quickstart"
linkTitle: "Quickstart"
description: "This cheat sheet has some helpful sensuctl commands for quick reference. Use this quickstart for helpful sensuctl tips."
weight: 1
version: "5.20"
product: "Sensu Go"
platformContent: false 
menu:
  sensu-go-5.20:
    parent: sensuctl
---

## Configure sensuctl and log in

{{< code shell >}}
sensuctl configure
? Sensu Backend URL: http://127.0.0.1:8080
? Username: YOUR_USERNAME
? Password: YOUR_PASSWORD
{{< /code >}}

## Create resources from a file that contains JSON resource definitions

{{< code shell >}}
sensuctl create --file filename.json
{{< /code >}}

## View monitored entities

{{< code shell >}}
sensuctl entity list
{{< /code >}}

## View monitoring events

{{< code shell >}}
sensuctl event list
{{< /code >}}

## Edit a check

In this example, the check name is `check-cpu`:

{{< code shell >}}
sensuctl edit check check-cpu
{{< /code >}}

## View the JSON configuration for a check

In this example, the check name is `check-cpu`:

{{< code shell >}}
sensuctl check info check-cpu --format wrapped-json
{{< /code >}}
