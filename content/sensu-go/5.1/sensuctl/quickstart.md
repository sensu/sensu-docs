---
title: "Sensuctl quick reference"
linkTitle: "Quickstart"
description: "The sensuctl quick reference guide"
weight: 1
version: "5.1"
product: "Sensu Go"
platformContent: false 
menu:
  sensu-go-5.1:
    parent: sensuctl
---

### Quick reference

{{< highlight shell >}}
# Configure and log in with defaults
sensuctl configure
? Sensu Backend URL: http://127.0.0.1:8080
? Username: admin
? Password: P@ssw0rd!

# Create resources from a file containing JSON resource definitions
sensuctl create --file filename.json

# See monitored entities
sensuctl entity list

# See monitoring events
sensuctl event list

# Edit a check named check-cpu
sensuctl edit check check-cpu

# See the JSON configuration for a check named check-cpu
sensuctl check info check-cpu --format wrapped-json
{{< /highlight >}}
