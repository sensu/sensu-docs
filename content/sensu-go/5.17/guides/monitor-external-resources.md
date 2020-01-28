---
title: "Monitor external resources with proxy requests and entities"
linkTitle: "Monitor External Resources"
description: "Proxy entities allow Sensu to monitor external resources on systems and devices where a Sensu agent cannot be installed, like a network switch or a website. Read this guide to monitor a website with proxy entities."
weight: 20
version: "5.17"
product: "Sensu Go"
platformContent: false
menu: 
  sensu-go-5.17:
    parent: guides
---

- [Use a proxy entity to monitor a website](#use-a-proxy-entity-to-monitor-a-website)
- [Use proxy requests to monitor a group of websites](#use-proxy-requests-to-monitor-a-group-of-websites)

Proxy entities allow Sensu to monitor external resources on systems and devices where a Sensu agent cannot be installed, like a network switch or a website.
You can create [proxy entities][1] with [sensuctl][8], the [Sensu API][9], and the [`proxy_entity_name` check attribute][2].
When executing checks that include a `proxy_entity_name` or `proxy_requests` attributes, Sensu agents report the resulting event under the proxy entity instead of the agent entity.

_**NOTE**: This guide requires a running Sensu backend, a running Sensu agent, and a sensuctl instance configured to connect to the backend as a user with get, list, and create permissions for entities, checks, and events._

## Use a proxy entity to monitor a website

In this section, you'll monitor the status of [sensu.io](https://sensu.io) by configuring a check with a **proxy entity name** so that Sensu creates an entity that represents the site and reports the status of the site under this entity.

### Register assets

To power the check, use the [Sensu Plugins HTTP][16] asset and the [Sensu Ruby Runtime][17] asset.

Use [`sensuctl asset add`][21] to register the `sensu-plugins-http` asset:

{{< highlight shell >}}
sensuctl asset add sensu-plugins/sensu-plugins-http:5.1.1 -r sensu-plugins-http
{{< /highlight >}}

This example uses the `-r` (rename) flag to specify a shorter name for the asset: `sensu-plugins-http`.

You can also download the asset definition for Debian or Alpine from [Bonsai][16] and register the asset with `sensuctl create --file filename.yml`.

Then, use the following sensuctl example to register the `sensu-ruby-runtime` asset:

{{< highlight shell >}}
sensuctl asset add sensu/sensu-ruby-runtime:0.0.10 -r sensu-ruby-runtime
{{< /highlight >}}

You can also download the asset definition from [Bonsai][17] and register the asset using `sensuctl create --file filename.yml`. 

Use sensuctl to confirm that both the `sensu-plugins-http` and `sensu-ruby-runtime` assets are ready to use:

{{< highlight shell >}}
sensuctl asset list
          Name                                                URL                                       Hash    
────────────────────────── ─────────────────────────────────────────────────────────────────────────── ───────── 
 sensu-plugins-http         //assets.bonsai.sensu.io/.../sensu-plugins-http_5.1.1_centos_linux_amd64.tar.gz         31023af  
 sensu-ruby-runtime         //assets.bonsai.sensu.io/.../sensu-ruby-runtime_0.0.10_ruby-2.4.4_centos_linux_amd64.tar.gz     338b88b 
{{< /highlight >}}

### Create the check

Now that the assets are registered, you can create a check named `check-sensu-site` to run the command `check-http.rb -u https://sensu.io` with the `sensu-plugins-http` and `sensu-ruby-runtime` assets, at an interval of 60 seconds, for all agents subscribed to the `proxy` subscription, using the `sensu-site` proxy entity name.
To avoid duplicate events, add the [`round_robin` attribute][18] to distribute the check execution across all agents subscribed to the `proxy` subscription.

Create a file called `check.json` and add this check definition:

{{< language-toggle >}}

{{< highlight yml >}}
type: CheckConfig
api_version: core/v2
metadata:
  name: check-sensu-site
  namespace: default
spec:
  command: check-http.rb -u https://sensu.io
  interval: 60
  proxy_entity_name: sensu-site
  publish: true
  round_robin: true
  runtime_assets:
  - sensu-plugins-http
  - sensu-ruby-runtime
  subscriptions:
  - proxy
{{< /highlight >}}

{{< highlight json >}}
{
  "type": "CheckConfig",
  "api_version": "core/v2",
  "metadata": {
    "name": "check-sensu-site",
    "namespace": "default"
  },
  "spec": {
    "command": "check-http.rb -u https://sensu.io",
    "runtime_assets": [
      "sensu-plugins-http",
      "sensu-ruby-runtime"
    ],
    "interval": 60,
    "proxy_entity_name": "sensu-site",
    "publish": true,
    "round_robin": true,
    "subscriptions": [
      "proxy"
    ]
  }
}
{{< /highlight >}}

{{< /language-toggle >}}

Now you can use sensuctl to add the check to Sensu:

{{< highlight shell >}}
sensuctl create --file check.json

sensuctl check list
       Name                     Command               Interval   Cron   Timeout   TTL   Subscriptions   Handlers                     Assets                Hooks   Publish?   Stdin?  
────────────────── ────────────────────────────────── ────────── ────── ───────── ───── ─────────────── ────────── ─────────────────────────────────────── ─────── ────────── ────────
 check-sensu-site   check-http.rb -u https://sensu.io         60                0     0   proxy                      sensu-plugins-http,sensu-ruby-runtime             true     false
{{< /highlight >}}

### Add the subscription

To run the check, you'll need a Sensu agent with the subscription `proxy`.
After you [install an agent][19], open `/etc/sensu/agent.yml` and add the `proxy` subscription so the subscription configuration looks like this:

{{< highlight yml >}}
subscriptions:
  - proxy
{{< /highlight >}}

Then, restart the agent:

{{< highlight shell >}}
sudo service sensu-agent restart
{{< /highlight >}}

### Validate the check

Use sensuctl to confirm that Sensu created the proxy entity `sensu-site`:

{{< highlight shell >}}
sensuctl entity list
      ID        Class    OS           Subscriptions                   Last Seen            
────────────── ─────── ─────── ─────────────────────────── ─────────────────────────────── 
sensu-centos   agent   linux   proxy,entity:sensu-centos   2019-01-16 21:50:03 +0000 UTC  
sensu-site     proxy           entity:sensu-site           N/A  
{{< /highlight >}}

_**NOTE**: It might take a few moments for Sensu to execute the check and create the proxy entity._

Then, use sensuctl to confirm that Sensu is monitoring `sensu-site` with the `check-sensu-site` check:

{{< highlight shell >}}
sensuctl event info sensu-site check-sensu-site
=== sensu-site - check-sensu-site
Entity:    sensu-site
Check:     check-sensu-site
Output:    
Status:    0
History:   0,0
Silenced:  false
Timestamp: 2019-01-16 21:51:53 +0000 UTC
{{< /highlight >}}

You can also see the new proxy entity in your [Sensu dashboard][10].

## Use proxy requests to monitor a group of websites

Suppose that instead of monitoring just sensu.io, you want to monitor multiple sites, like docs.sensu.io, packagecloud.io, and github.com.
In this section, you'll use the [`proxy_requests` check attribute][3] along with [entity labels][11] and [token substitution][12] to monitor three sites with the same check.
Before you start, [register the `sensu-plugins-http` and `sensu-ruby-runtime` assets][13] if you haven't already.

### Create proxy entities

Instead of creating a proxy entity using the `proxy_entity_name` check attribute, use sensuctl to create proxy entities to represent the three sites you want to monitor.
Your proxy entities need the `entity_class` attribute set to `proxy` to mark them as proxy entities as well as a few custom `labels` to identify them as a group and pass in individual URLs.

Create a file called `entities.json` and add the following entity definitions:

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

_**PRO TIP**: When you create proxy entities, you can add any custom labels that make sense for your environment. For example, when monitoring a group of routers, you may want to add `ip_address` labels._

Now you can use sensuctl to add these proxy entities to Sensu:

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

### Create a reusable HTTP check

Now that you have three proxy entities set up, each with a `proxy_type` and `url` label, you can use proxy requests and [token substitution][12] to create a single check that monitors all three sites.

Create a file called `check-proxy-requests.json` and add the following check definition:

{{< language-toggle >}}

{{< highlight yml >}}
type: CheckConfig
api_version: core/v2
metadata:
  name: check-http
  namespace: default
spec:
  command: check-http.rb -u {{ .labels.url }}
  interval: 60
  proxy_requests:
    entity_attributes:
    - entity.entity_class == 'proxy'
    - entity.labels.proxy_type == 'website'
  publish: true
  runtime_assets:
  - sensu-plugins-http
  - sensu-ruby-runtime
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
    "command": "check-http.rb -u {{ .labels.url }}",
    "runtime_assets": [
      "sensu-plugins-http",
      "sensu-ruby-runtime"
    ],
    "interval": 60,
    "subscriptions": [
      "proxy"
    ],
    "publish": true,
    "proxy_requests": {
      "entity_attributes": [
        "entity.entity_class == 'proxy'",
        "entity.labels.proxy_type == 'website'"
      ]
    }
  }
}
{{< /highlight >}}

{{< /language-toggle >}}

Your `check-http` check uses the `proxy_requests` attribute to specify the applicable entities.
In this case, you want to run the `check-http` check on all entities of entity class `proxy` and proxy type `website`.
Because you're using this check to monitor multiple sites, you can use token substitution to apply the correct `url` in the check `command`.

Use sensuctl to add the `check-proxy-requests` check to Sensu:

{{< highlight shell >}}
sensuctl create --file check-proxy-requests.json

sensuctl check list
       Name                      Command               Interval   Cron   Timeout   TTL   Subscriptions   Handlers                   Assets                  Hooks   Publish?   Stdin?
───────────────── ─────────────────────────────────── ────────── ────── ───────── ───── ─────────────── ────────── ─────────────────────────────────────── ─────── ────────── ────────
  check-http        check-http.rb -u {{ .labels.url }}         60                0     0   proxy                     sensu-plugins-http,sensu-ruby-runtime           true       false                                     
{{< /highlight >}}

_**PRO TIP**: To distribute check executions across multiple agents, set the `round-robin` check attribute to `true`. For more information about round robin checks, see the [check reference][18]._

### Validate the check

Before you validate the check, make sure that you've [registered the `sensu-plugins-http` and `sensu-ruby-runtime` assets][13] and [added the `proxy` subscription to a Sensu agent][14].

Use sensuctl to confirm that Sensu is monitoring docs.sensu.io, packagecloud.io, and github.com with the `check-http`, returning a status of `0` (OK):

{{< highlight shell >}}
sensuctl event list
      Entity                Check          Output   Status   Silenced             Timestamp            
─────────────────── ───────────────────── ──────── ──────── ────────── ─────────────────────────────── 
github-site         check-http                           0   false      2019-01-17 17:10:31 +0000 UTC  
packagecloud-site   check-http                           0   false      2019-01-17 17:10:34 +0000 UTC  
sensu-centos        keepalive               ...          0   false      2019-01-17 17:10:34 +0000 UTC  
sensu-docs          check-http                           0   false      2019-01-17 17:06:59 +0000 UTC  
{{< /highlight >}}

## Next steps

Now that you know how to run a proxy check to verify the status of a website and use proxy requests to run a check on two different proxy entities based on label evaluation, read these recommended resources:

* [Proxy checks][2]
* [Assets reference][5]
* [Send Slack alerts with handlers][7]

[1]: ../../reference/entities/#proxy-entities
[2]: ../../reference/checks/#proxy-entity-name-attribute
[3]: ../../reference/checks/#proxy-checks
[5]: ../../reference/assets/
[7]: ../send-slack-alerts/
[8]: ../../sensuctl/reference/
[9]: ../../api/entities/
[10]: ../../dashboard/overview/
[11]: ../../reference/entities#manage-entity-labels
[12]: ../../reference/tokens/
[13]: #register-assets
[14]: #add-the-subscription
[16]: https://bonsai.sensu.io/assets/sensu-plugins/sensu-plugins-http
[17]: https://bonsai.sensu.io/assets/sensu/sensu-ruby-runtime
[18]: ../../reference/checks#round-robin-checks
[19]: ../../installation/install-sensu/
[20]: ../../reference/agent#restart-the-service
[21]: ../../sensuctl/reference/#install-asset-definitions
