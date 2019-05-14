---
title: "How to monitor external resources with proxy requests and entities"
linkTitle: "Monitoring External Resources"
description: "Proxy entities allow Sensu to monitor external resources on systems or devices where a Sensu agent cannot be installed, like a network switch or a website. Read the guide to get started monitoring a website with proxy entities."
weight: 15
version: "5.6"
product: "Sensu Go"
platformContent: false
menu: 
  sensu-go-5.6:
    parent: guides
---

- [Using a proxy entity to monitor a website](#using-a-proxy-entity-to-monitor-a-website)
- [Using proxy requests to monitor a group of websites](#using-proxy-requests-to-monitor-a-group-of-websites)

Proxy entities allow Sensu to monitor external resources
on systems or devices where a Sensu agent cannot be installed, like a
network switch or a website.
You can create [proxy entities][1] using [sensuctl][8], the [Sensu API][9], or the [`proxy_entity_name` check attribute][2]. When executing checks that include a `proxy_entity_name` or `proxy_requests` attributes, Sensu agents report the resulting event under the proxy entity instead of the agent entity.

This guide requires a running Sensu backend, a running Sensu agent, and a sensuctl instance configured to connect to the backend as a user with get, list, and create permissions for entities, checks, and events.

## Using a proxy entity to monitor a website

In this section, we'll monitor the status of [sensu.io](https://sensu.io) by configuring a check with a **proxy entity name** so that Sensu creates an entity representing the site and reports the status of the site under this entity.

### Registering assets

To power the check, we'll use the [Sensu plugins HTTP asset][16] and the [Sensu Ruby runtime asset][17].

Use the following sensuctl example to register the `sensu-plugins-http` asset for CentOS, or download the asset definition for Debian or Alpine from [Bonsai][16] and register the asset using `sensuctl create --file filename.yml`.

{{< highlight shell >}}
sensuctl asset create sensu-plugins-http --url "https://github.com/sensu-plugins/sensu-plugins-http/releases/download/5.0.0/sensu-plugins-http_5.0.0_centos_linux_amd64.tar.gz" --sha512 "31023af6e0073729eecb0f5ab834ddc467eeaa1d9b998cbf528f3302104814ec717fc746af470556c496806fa8db66e6ded75aef97d73abdfa29615a81270ee6"
{{< /highlight >}}

Then use the following sensuctl example to register the `sensu-ruby-runtime` asset for CentOS, or download the asset definition for Debian or Alpine from [Bonsai][17] and register the asset using `sensuctl create --file filename.yml`. 

{{< highlight shell >}}
sensuctl asset create sensu-ruby-runtime --url "https://github.com/sensu/sensu-ruby-runtime/releases/download/0.0.5/sensu-ruby-runtime_0.0.5_centos_linux_amd64.tar.gz" --sha512 "1c9f0aff8f7f7dfcf07eb75f48c3b7ad6709f2bd68f2287b4bd07979e6fe12c2ab69d1ecf5d4b9b9ed7b96cd4cda5e55c116ea76ce3d9db9ff74538f0ea2317a"
{{< /highlight >}}

You can use sensuctl to confirm that both the `sensu-plugins-http` and `sensu-ruby-runtime` assets are ready to use.

{{< highlight shell >}}
sensuctl asset list
          Name                                                URL                                       Hash    
────────────────────────── ─────────────────────────────────────────────────────────────────────────── ───────── 
 sensu-plugins-http         //github.com/.../sensu-plugins-http_5.0.0_centos_linux_amd64.tar.gz         31023af  
 sensu-ruby-runtime         //github.com/.../sensu-ruby-runtime_0.0.5_centos_linux_amd64.tar.gz         1c9f0af 
{{< /highlight >}}

### Creating the check

Now that the assets are registered, we'll create a check named
`check-sensu-site`, which runs the command `check-http.rb -u https://sensu.io` using the `sensu-plugins-http` and `sensu-ruby-runtime` assets, at an
interval of 60 seconds, for all agents subscribed to the `proxy`
subscription, using the `sensu-site` proxy entity name.
To avoid duplicate events, we'll add the [`round_robin` attribute](../../reference/checks#round-robin-checks) to distribute the check execution across all agents subscribed to the `proxy` subscription.

Create a file called `check.json` and add the following check definition.

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

Now we can use sensuctl to add this check to Sensu.

{{< highlight shell >}}
sensuctl create --file check.json

sensuctl check list
       Name                     Command               Interval   Cron   Timeout   TTL   Subscriptions   Handlers                     Assets                Hooks   Publish?   Stdin?  
────────────────── ────────────────────────────────── ────────── ────── ───────── ───── ─────────────── ────────── ─────────────────────────────────────── ─────── ────────── ────────
 check-sensu-site   check-http.rb -u https://sensu.io         60                0     0   proxy                      sensu-plugins-http,sensu-ruby-runtime             true     false
{{< /highlight >}}

### Adding the subscription

To run the check, we'll need a Sensu agent with the subscription `proxy`.
After [installing an agent][install], open `/etc/sensu/agent.yml`
and add the `proxy` subscription so the subscription configuration looks like:

{{< highlight yml >}}
subscriptions:
  - proxy
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

_NOTE: It might take a few moments for Sensu to execute the check and create the proxy entity._

And that Sensu is now monitoring `sensu-site` using the `check-sensu-site` check.

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

We can also see our new proxy entity in the [Sensu dashboard][10].

## Using proxy requests to monitor a group of websites

Now let's say that, instead of monitoring just sensu.io, we want to monitor multiple sites, for example: docs.sensu.io, packagecloud.io, and github.com.
In this section of the guide, we'll use the [`proxy_requests` check attribute][3], along with [entity labels][11] and [token substitution][12], to monitor three sites using the same check.
Before we get started, go ahead and [register the `sensu-plugins-http` and `sensu-ruby-runtime` assets][13] if you haven't already.

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
    "round_robin": true,
    "proxy_requests": {
      "entity_attributes": [
        "entity.entity_class == 'proxy'",
        "entity.labels.proxy_type == 'website'"
      ]
    }
  }
}
{{< /highlight >}}

Our `check-http` check uses the `proxy_requests` attribute to specify the applicable entities.
In our case, we want to run the `check-http` check on all entities of entity class `proxy` and proxy type `website`.
Since we're using this check to monitor multiple sites, we can use token substitution to apply the correct `url` in the check `command`, and we can use the `round_robin` attribute to distribute the executions evenly across agents with the `proxy` subscription.

Now we can use sensuctl to add this check to Sensu.

{{< highlight shell >}}
sensuctl create --file check-proxy-requests.json

sensuctl check list
       Name                      Command               Interval   Cron   Timeout   TTL   Subscriptions   Handlers                   Assets                  Hooks   Publish?   Stdin?
───────────────── ─────────────────────────────────── ────────── ────── ───────── ───── ─────────────── ────────── ─────────────────────────────────────── ─────── ────────── ────────
  check-http        check-http.rb -u {{ .labels.url }}         60                0     0   proxy                     sensu-plugins-http,sensu-ruby-runtime           true       false                                     
{{< /highlight >}}

### Validating the check

Before validating the check, make sure that you've [registered the `sensu-plugins-http` and `sensu-ruby-runtime` assets][13] and [added the `proxy` subscription to a Sensu agent][14] if you haven't already.

Now we can use sensuctl to see that Sensu is monitoring docs.sensu.io, packagecloud.io, and github.com using the `check-http`, returning a status of `0` (OK).

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

You now know how to run a proxy check to verify the status of a website, as
well as using proxy requests to run a check on two different proxy entities based on label evaluation.
From this point, here are some recommended resources:

* Read the [proxy checks reference][6] for in-depth documentation on proxy checks.
* Read the guide to [providing runtime dependencies to checks with assets][5].
* Read the guide to [sending alerts to Slack with handlers][7].

[1]: ../../reference/entities/#proxy-entities
[2]: ../../reference/checks/#check-attributes
[3]: ../../reference/checks/#proxy-requests
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
[13]: #registering-the-assets
[14]: #adding-the-subscription
[15]: ../../installation/configuration-management
[16]: https://bonsai.sensu.io/assets/sensu-plugins/sensu-plugins-http
[17]: https://bonsai.sensu.io/assets/sensu/sensu-ruby-runtime
