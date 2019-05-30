---
title: "How to monitor external resources with proxy entities"
linkTitle: "Monitoring External Resources"
description: "Proxy entities allow Sensu to monitor external resources on systems or devices where a Sensu agent cannot be installed, like a network switch or a website. Read the guide to get started monitoring a website with proxy entities."
weight: 15
version: "5.0"
product: "Sensu Go"
platformContent: false
menu: 
  sensu-go-5.0:
    parent: guides
---

- [Using a proxy entity to monitor a website](#using-a-proxy-entity-to-monitor-a-website)
- [Using proxy requests to monitor a group of websites](#using-proxy-requests-to-monitor-a-group-of-websites)

Proxy entities allow Sensu to monitor external resources
on systems or devices where a Sensu agent cannot be installed, like a
network switch or a website.
You can create [proxy entities][1] using [sensuctl][8], the [Sensu API][9], or the [`proxy_entity_name` check attribute][2]. When executing checks that include a `proxy_entity_name`, Sensu agents report the resulting event under the proxy entity instead of the agent entity.

This guide requires a running Sensu backend, a running Sensu agent, and a sensuctl instance configured to connect to the backend as a user with read and create permissions for entities, checks, and events.

## Using a proxy entity to monitor a website

In this section, we'll monitor the status of [sensu.io](https://sensu.io) by configuring a check with a **proxy entity name** so that Sensu creates an entity representing the site and reports the status of the site under this entity.

### Installing an HTTP check script

First, we'll install a [bash script][4], named `http_check.sh`, to perform an HTTP
check using **curl**.

{{< highlight shell >}}
sudo curl https://raw.githubusercontent.com/sensu/sensu-go/5.1.0/examples/checks/http_check.sh \
-o /usr/local/bin/http_check.sh && \
sudo chmod +x /usr/local/bin/http_check.sh
{{< /highlight >}}

_PRO TIP: While this command may be appropriate when running a few agents, you should consider
using [Sensu assets][5] or a [configuration management][15] tool to provide
runtime dependencies._

### Creating the check

Now that our script is installed, we'll create a check named
`check-http`, which runs the command `http_check.sh https://sensu.io`, at an
interval of 60 seconds, for all entities subscribed to the `proxy`
subscription, using the `sensu-site` proxy entity name.

Create a file called `check.json` and add the following check definition.

{{< language-toggle >}}

{{< highlight yml >}}
type: CheckConfig
api_version: core/v2
metadata:
  name: check-http
  namespace: default
spec:
  command: http_check.sh https://sensu.io
  interval: 60
  proxy_entity_name: sensu-site
  publish: true
  subscriptions:
  - proxy
{{< /highlight >}}

{{< highlight json >}}
{
  "type": "CheckConfig",
  "api_version": "core/v2",
  "metadata": {
    "name": "check-http",
    "namespace": "default"
  },
  "spec": {
    "command": "http_check.sh https://sensu.io",
    "interval": 60,
    "proxy_entity_name": "sensu-site",
    "publish": true,
    "subscriptions": [
      "proxy"
    ]
  }
}
{{< /highlight >}}

{{< /language-toggle >}}

Now we can use sensuctl to add this check to Sensu.

{{< highlight shell >}}
sensuctl create --file check.json

sensuctl check list
    Name                 Command               Interval   Cron   Timeout   TTL   Subscriptions   Handlers   Assets   Hooks   Publish?   Stdin?   Metric Format   Metric Handlers  
──────────── ──────────────────────────────── ────────── ────── ───────── ───── ─────────────── ────────── ──────── ─────── ────────── ──────── ─────────────── ───────────────── 
 check-http   http_check.sh https://sensu.io         60                0     0   proxy                                       true       false                                     
{{< /highlight >}}

### Adding the subscription

To run the check, we'll need a Sensu agent with the subscription `proxy`.
After [installing an agent][install], open `/etc/sensu/agent.yml`
and add the `proxy` subscription so the subscription configuration looks like:

{{< highlight yml >}}
subscriptions:
  - "proxy"
{{< /highlight >}}

Then restart the agent.

{{< highlight shell >}}
sudo service sensu-agent restart
{{< /highlight >}}

### Validating the check

Now we can use sensuctl to see that Sensu has created the proxy entity `sensu-site`.

{{< highlight shell >}}
sensuctl entity list
      ID        Class    OS           Subscriptions                   Last Seen            
────────────── ─────── ─────── ─────────────────────────── ─────────────────────────────── 
sensu-centos   agent   linux   proxy,entity:sensu-centos   2019-01-16 21:50:03 +0000 UTC  
sensu-site     proxy           entity:sensu-site           N/A  
{{< /highlight >}}

And that Sensu is now monitoring `sensu-site` using the `check-http` check. 

{{< highlight shell >}}
sensuctl event info sensu-site check-http
=== sensu-site - check-http
Entity:    sensu-site
Check:     check-http
Output:    
Status:    0
History:   0,0
Silenced:  false
Timestamp: 2019-01-16 21:51:53 +0000 UTC
{{< /highlight >}}

_NOTE: It might take a few moments for Sensu to execute the check and create the proxy entity._

We can also see our new proxy entity in the [Sensu dashboard][10].

## Using proxy requests to monitor a group of websites

Now let's say that, instead of monitoring just sensu.io, we want to monitor multiple sites, for example: docs.sensu.io, packagecloud.io, and github.com.
In this section of the guide, we'll use the [`proxy_requests` check attribute][3], along with [entity labels][11] and [token substitution][12], to monitor three sites using the same check.
Before we get started, go ahead and [install the HTTP check script][13] if you haven't already.

### Installing an HTTP check script

If you haven't already, install a [bash script][4], named `http_check.sh`, to perform an HTTP
check using **curl**.

{{< highlight shell >}}
sudo curl https://raw.githubusercontent.com/sensu/sensu-go/5.1.0/examples/checks/http_check.sh \
-o /usr/local/bin/http_check.sh && \
sudo chmod +x /usr/local/bin/http_check.sh
{{< /highlight >}}

_PRO TIP: While this command may be appropriate when running a few agents, you should consider
using [Sensu assets][5] or a [configuration management][15] tool to provide
runtime dependencies._

### Creating proxy entities

Instead of creating a proxy entity using the `proxy_entity_name` check attribute, we'll be using sensuctl to create proxy entities to represent the three sites we want to monitor.
Our proxy entities need the `entity_class` attribute set to `proxy` to mark them as proxy entities as well as a few custom `labels` that we'll use to identify them as a group and pass in individual URLs.

Create a file called `entities.json` and add the following entity definitions.

{{< highlight shell >}}
{
  "type": "Entity",
  "api_version": "core/v2",
  "metadata": {
    "name": "sensu-docs",
    "namespace": "default",
    "labels": {
      "proxy_type": "website",
      "url": "https://docs.sensu.io"
    }
  },
  "spec": {
    "entity_class": "proxy"
  }
}
{
  "type": "Entity",
  "api_version": "core/v2",
  "metadata": {
    "name": "packagecloud-site",
    "namespace": "default",
    "labels": {
      "proxy_type": "website",
      "url": "https://packagecloud.io"
    }
  },
  "spec": {
    "entity_class": "proxy"
  }
}
{
  "type": "Entity",
  "api_version": "core/v2",
  "metadata": {
    "name": "github-site",
    "namespace": "default",
    "labels": {
      "proxy_type": "website",
      "url": "https://github.com"
    }
  },
  "spec": {
    "entity_class": "proxy"
  }
}
{{< /highlight >}}

_PRO TIP: When creating proxy entities, you can add whatever custom labels make sense for your environment. For example, when monitoring a group of routers, you may want to add `ip_address` labels._

Now we can use sensuctl to add these proxy entities to Sensu.

{{< highlight shell >}}
sensuctl create --file entities.json

sensuctl entity list
         ID           Class    OS           Subscriptions                   Last Seen            
 ─────────────────── ─────── ─────── ─────────────────────────── ─────────────────────────────── 
  github-site         proxy                                       N/A                            
  packagecloud-site   proxy                                       N/A                            
  sensu-centos        agent   linux   proxy,entity:sensu-centos   2019-01-16 23:05:03 +0000 UTC  
  sensu-docs          proxy                                       N/A                            
{{< /highlight >}}

### Creating a reusable HTTP check

Now that we have our three proxy entities set up, each with a `proxy_type` and `url` label, we can use proxy requests and [token substitution][12] to create a single check that monitors all three sites.

Create a file called `check-proxy-requests.json` and add the following check definition.

{{< language-toggle >}}

{{< highlight yml >}}
type: CheckConfig
api_version: core/v2
metadata:
  name: check-http-proxy-requests
  namespace: default
spec:
  command: http_check.sh {{ .labels.url }}
  interval: 60
  proxy_requests:
    entity_attributes:
    - entity.entity_class == 'proxy'
    - entity.labels.proxy_type == 'website'
    splay: true
    splay_coverage: 90
  publish: true
  subscriptions:
  - proxy
{{< /highlight >}}

{{< highlight json >}}
{
  "type": "CheckConfig",
  "api_version": "core/v2",
  "metadata": {
    "name": "check-http-proxy-requests",
    "namespace": "default"
  },
  "spec": {
    "command": "http_check.sh {{ .labels.url }}",
    "interval": 60,
    "subscriptions": [
      "proxy"
    ],
    "publish": true,
    "proxy_requests": {
      "entity_attributes": [
        "entity.entity_class == 'proxy'",
        "entity.labels.proxy_type == 'website'"
      ],
      "splay": true,
      "splay_coverage": 90
    }
  }
}
{{< /highlight >}}

{{< /language-toggle >}}

Our `check-http-proxy-requests` check uses the `proxy_requests` attribute to specify the applicable entities.
In our case, we want to run the `check-http-proxy-requests` check on all entities of entity class `proxy` and proxy type `website`.
To make sure that Sensu runs the check for all applicable entities, we need to set the splay attribute to `true` with a splay coverage percentage value of `90`.
This gives Sensu 90% of the check `interval`, 60 seconds in this case, to execute the check for all applicable entities.
Since we're using this check to monitor multiple sites, we can use token substitution to apply the correct `url` in the check `command`.

Now we can use sensuctl to add this check to Sensu.

{{< highlight shell >}}
sensuctl create --file check-proxy-requests.json

sensuctl check list
          Name                          Command               Interval   Cron   Timeout   TTL   Subscriptions   Handlers   Assets   Hooks   Publish?   Stdin?   Metric Format   Metric Handlers  
─────────────────────────── ───────────────────────────────── ────────── ────── ───────── ───── ─────────────── ────────── ──────── ─────── ────────── ──────── ─────────────── ───────────────── 
  check-http                  http_check.sh https://sensu.io          60                0     0   proxy                                       true       false                                     
  check-http-proxy-requests   http_check.sh {{ .labels.url }}         60                0     0   proxy                                       true       false                                                            true       false                                     
{{< /highlight >}}

### Validating the check

Before validating the check, make sure that you've [added the `proxy` subscription to a Sensu agent][14] if you haven't already.

Now we can use sensuctl to see that Sensu is monitoring docs.sensu.io, packagecloud.io, and github.com using the `check-http-proxy-requests`.

{{< highlight shell >}}
sensuctl event list
      Entity                   Check             Output   Status   Silenced             Timestamp            
─────────────────── ─────────────────────────── ──────── ──────── ────────── ─────────────────────────────── 
github-site         check-http-proxy-requests                 0   false      2019-01-17 17:10:31 +0000 UTC  
packagecloud-site   check-http-proxy-requests                 0   false      2019-01-17 17:10:34 +0000 UTC  
sensu-centos        keepalive                                 0   false      2019-01-17 17:10:34 +0000 UTC  
sensu-docs          check-http-proxy-requests                 0   false      2019-01-17 17:06:59 +0000 UTC  
{{< /highlight >}}

## Next steps

You now know how to run a proxy check to verify the status of a website, as
well as using proxy requests to run a check on two different proxy entities based on label evaluation.
From this point, here are some recommended resources:

* Read the [proxy checks reference][6] for in-depth documentation on proxy checks.
* Read the guide to [providing runtime dependencies to checks with assets][5].
* Read the guide to [sending alerts to Slack with handlers][7].

[1]: ../../reference/entities/#proxy-entities
[2]: ../../reference/checks/#check-attributes
[3]: ../../reference/checks/#proxy-requests
[4]: https://raw.githubusercontent.com/sensu/sensu-go/dccfeb9093c21e45fd6505d3b32da354bdf8a136/examples/checks/http_check.sh
[5]: ../../reference/assets
[6]: ../../reference/checks/#proxy-requests
[7]: ../send-slack-alerts/
[install]: ../../installation/install-sensu
[start]: ../../reference/agent#restarting-the-service
[8]: ../../sensuctl/reference
[9]: ../../api/entities
[10]: ../../dashboard/overview
[11]: ../../reference/entities#managing-entity-labels
[12]: ../../reference/tokens
[13]: #installing-an-http-check-script
[14]: #adding-the-subscription
[15]: ../../installation/configuration-management
