---
title: ""
linkTitle: "Using Check Aggregates"
description: ""
weight: 350
version: "5.16"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-5.16:
    parent: guides
---

Sensu provides the capability to monitor groups of checks or entities via aggregates. In Sensu Go, this is done through the use of labels. In this tutorial, we'll walk through configuring both an entity aggregate and a check aggregate.

# Entity Aggregate

Let's start with configuring an entity.

The first thing we'll need to do is add a label to our agent.

```yaml
---
# Sensu agent configuration

##
# agent overview
##

labels:
  server_type: "webservers"

```

In this example, we've added the label `server_type` with the value `"webservers"`--it's useful to know if a number of agents on our webservers stop reporting in rather than just a single node. Let's add a similar label to a check.

# Check Aggregate

The check we'll use for our aggregate is an http metric check for a ficticious app site 

```yaml
---
type: CheckConfig
api_version: core/v2
metadata:
  name: cpu-check
  namespace: default
  labels:
    app_group: "identity_servers"
spec:
  command: "check-http.rb -u https://identity.{{ .entity.name }}.example.com"
  interval: 10
  publish: true
  handlers:
  - slack
  runtime_assets:
  - sensu-plugins/sensu-plugins-http
  - sensu/sensu-ruby-runtime
  subscriptions:
  - linux

```

While Sensu is capable of monitoring singular entities, it is also capable of monitoring groups of entities (and checks) through the use of aggregates. _______________ . Let's get started.

===

## Entity Aggregates

In order for a check or entity to be considered as part of an aggregate it must have a label, or set of labels assigned to it. We'll start by setting up a fictional scenario in which we have 20 webservers serving a number of applications. In this scenario, we might not care if a singular server stops responding, but we might care if say, 15 of the 20 stop responding. 

To make an entity part of an aggregate, we would need to add a label in our `/etc/sensu/agent.yml`. For example:

```yaml
---
# Sensu agent configuration

##
# agent overview
##
name: "webserver01.example.com"
namespace: "default"
subscriptions:
  - webservers
labels:
  server_role: "webserver"
```

After adding the label, we'll make sure to restart our agent to pick up the change in configuration:

`systemctl restart sensu-agent`

We'll need to set up a check that will look at events with the label we've assigned to the entity and ensure that these events are in an OK status. Let's look at an example check:

```yaml
---
api_version: core/v2
type: CheckConfig
metadata:
  namespace: default
  name: webservers-aggregate-check
spec:
  runtime_assets:
  - sensu/sensu-aggregate-check
  command: sensu-aggregate-check --api-user=foo --api-pass=bar --entity-labels='server_role:webserver' --warn-percent=75 --crit-percent=50
  subscriptions:
  - backend
  publish: true
  interval: 30
  handlers:
  - slack
  - pagerduty
  - email
```

The check command uses a username/password combination to access the API and then matches events with the label "server_role: webserver". In this case, the check will create an event if 75 percent of the aggregate events are in a `warning` state and will also create an event if 50 percent of the aggregate events are in a critical state.

## Check Aggregates

In addition to having entities comprise aggregates, checks can also comprise aggregates. Continuing with our scenario, let's suppose that our webservers are serving various applications on different ports: 80, 8080, 9000. A standard check grouping might look like:

```yaml
---
type: CheckConfig
metadata:
  name: check-webapp-80
  namespace: default
spec:
  command: "check-http.rb -u http://webserver01.example.com"
  handlers: 
  - slack
  high_flap_threshold: 0
  interval: 10
  low_flap_threshold: 0
  publish: true
  runtime_assets:
  - sensu-plugins/sensu-plugins-http
  - sensu/sensu-ruby-runtime
  subscriptions:
  - linux
```

```yaml
---
type: CheckConfig
metadata:
  name: check-webapp-8080
  namespace: default
spec:
  command: "check-http.rb -u --port 8080 http://webserver01.example.com"
  handlers: 
  - slack
  high_flap_threshold: 0
  interval: 10
  low_flap_threshold: 0
  publish: true
  runtime_assets:
  - sensu-plugins/sensu-plugins-http
  - sensu/sensu-ruby-runtime
  subscriptions:
  - linux
```

```yaml
---
type: CheckConfig
metadata:
  name: check-webapp-9000
  namespace: default
spec:
  command: "check-http.rb -u --port 9000 http://webserver01.example.com"
  handlers: 
  - slack
  high_flap_threshold: 0
  interval: 10
  low_flap_threshold: 0
  publish: true
  runtime_assets:
  - sensu-plugins/sensu-plugins-http
  - sensu/sensu-ruby-runtime
  subscriptions:
  - linux
```

So we have three separate checks that are monitoring our web application. However, if we wanted to view the webapp's health these three checks don't do the best job providing that insight. The checks are isolated from each other and each check alerts individually. 

Instead, it makes more sense to have this group of checks be part of an aggregate--we might not care if a check on an individual host fails, but we certainly care if a large percentage of the checks are in a warning or critical state across a number of hosts.We can do this by adding a label to the checks:

```yaml
---
type: CheckConfig
metadata:
  name: check-webapp-80
  namespace: default
  labels:
    service_type: webapp
spec:
  command: "check-http.rb -u http://webserver01.example.com"
  high_flap_threshold: 0
  interval: 10
  low_flap_threshold: 0
  publish: true
  runtime_assets:
  - sensu-plugins/sensu-plugins-http
  - sensu/sensu-ruby-runtime
  subscriptions:
  - linux
```

```yaml
---
type: CheckConfig
metadata:
  name: check-webapp-8080
  namespace: default
  labels:
    service_type: webapp
spec:
  command: "check-http.rb -u --port 8080 http://webserver01.example.com"
  high_flap_threshold: 0
  interval: 10
  low_flap_threshold: 0
  publish: true
  runtime_assets:
  - sensu-plugins/sensu-plugins-http
  - sensu/sensu-ruby-runtime
  subscriptions:
  - linux
```

```yaml
---
type: CheckConfig
metadata:
  name: check-webapp-9000
  namespace: default
  labels:
    service_type: webapp
spec:
  command: "check-http.rb -u --port 9000 http://webserver01.example.com"
  high_flap_threshold: 0
  interval: 10
  low_flap_threshold: 0
  publish: true
  runtime_assets:
  - sensu-plugins/sensu-plugins-http
  - sensu/sensu-ruby-runtime
  subscriptions:
  - linux
```

Each check now has a label that we can use as part of an aggregate that gives us more visibility into the health of our webapp. You'll also notice that we removed handlers from the check--if we want to alert on an aggregate, we're better served having the aggregate handled versus having each individual check handled.

So to check these services as part of a combined aggregate, we'll use a check that looks like this:

```yaml
---
api_version: core/v2
type: CheckConfig
metadata:
  namespace: default
  name: webapp-aggregate-check
spec:
  runtime_assets:
  - sensu/sensu-aggregate-check
  command: sensu-aggregate-check --api-user=foo --api-pass=bar --entity-labels='service_type:webapp' --warn-percent=75 --crit-percent=50
  subscriptions:
  - backend
  publish: true
  interval: 30
  handlers:
  - slack
  - pagerduty
  - email
```
Now that we've got our aggregate in place, let's take a look at what this might look like in the Sensu UI:

![TO DO INSERT DASHBOARD PIC HERE][]

<!--LINKS-->
[1]:
[2]:
[3]:
[4]:
[5]: