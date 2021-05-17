---
title: "Monitor external resources with proxy entities"
linkTitle: "Monitor External Resources"
description: "Proxy entities allow Sensu to monitor external resources on systems and devices where a Sensu agent cannot be installed, like a network switch or a website. Read this guide to monitor a website with proxy entities."
weight: 20
version: "5.21"
product: "Sensu Go"
platformContent: false
menu: 
  sensu-go-5.21:
    parent: guides
---

Proxy entities allow Sensu to monitor external resources on systems and devices where a Sensu agent cannot be installed, like a network switch or a website.
You can create [proxy entities][1] with [sensuctl][8], the [Sensu API][9], and the [`proxy_entity_name` check attribute][2].
When executing checks that include a `proxy_entity_name` or `proxy_requests` attributes, Sensu agents report the resulting event under the proxy entity instead of the agent entity.

{{% notice note %}}
**NOTE**: This guide requires a running Sensu backend, a running Sensu agent, and a sensuctl instance configured to connect to the backend as a user with get, list, and create permissions for entities, checks, and events.
{{% /notice %}}

## Use a proxy entity to monitor a website

In this section, you'll monitor the status of [sensu.io](https://sensu.io) by configuring a check with a **proxy entity name** so that Sensu creates an entity that represents the site and reports the status of the site under this entity.

### Register assets

To power the check, you'll use the [Sensu Plugins HTTP][16] asset.
The Sensu Plugins HTTP asset includes `check-http.rb`, which [your check][15] will rely on.

The Sensu assets packaged from Sensu Plugins HTTP are built against the Sensu Ruby runtime environment, so you also need to add the [Sensu Ruby Runtime][7] asset.
Sensu Ruby Runtime delivers the Ruby executable and supporting libraries the check will need to run the `check-http.rb` plugin.

Use [`sensuctl asset add`][21] to register the Sensu Plugins HTTP asset, `sensu-plugins/sensu-plugins-http:5.1.1`:

{{< code shell >}}
sensuctl asset add sensu-plugins/sensu-plugins-http:5.1.1 -r sensu-plugins-http
{{< /code >}}

This example uses the `-r` (rename) flag to specify a shorter name for the asset: `sensu-plugins-http`.

You can also download the asset definition for Debian or Alpine from [Bonsai][16] and register the asset with `sensuctl create --file filename.yml` or `sensuctl create --file filename.json`.

Then, use the following sensuctl example to register the Sensu Ruby Runtime asset, `sensu/sensu-ruby-runtime:0.0.10`:

{{< code shell >}}
sensuctl asset add sensu/sensu-ruby-runtime:0.0.10 -r sensu-ruby-runtime
{{< /code >}}

You can also download the asset definition from [Bonsai][17] and register the asset with `sensuctl create --file filename.yml` or `sensuctl create --file filename.json`.

Use sensuctl to confirm that both the `sensu-plugins-http` and `sensu-ruby-runtime` assets are ready to use:

{{< code shell >}}
sensuctl asset list
          Name                                                URL                                       Hash    
────────────────────────── ─────────────────────────────────────────────────────────────────────────── ───────── 
 sensu-plugins-http         //assets.bonsai.sensu.io/.../sensu-plugins-http_5.1.1_centos_linux_amd64.tar.gz         31023af  
 sensu-ruby-runtime         //assets.bonsai.sensu.io/.../sensu-ruby-runtime_0.0.10_ruby-2.4.4_centos_linux_amd64.tar.gz     338b88b 
{{< /code >}}

{{% notice note %}}
**NOTE**: Sensu does not download and install asset builds onto the system until they are needed for command execution.
Read [the asset reference](../../reference/assets#asset-builds) for more information about asset builds.
{{% /notice %}}

### Create the check

Now that the assets are registered, you can create a check named `check-sensu-site` to run the command `check-http.rb -u https://sensu.io` with the `sensu-plugins-http` and `sensu-ruby-runtime` assets, at an interval of 60 seconds, for all agents subscribed to the `proxy` subscription, using the `sensu-site` proxy entity name.
To avoid duplicate events, add the [`round_robin` attribute][18] to distribute the check execution across all agents subscribed to the `proxy` subscription.

Create a file called `check.yml` or `check.json` and add this check definition:

{{< language-toggle >}}

{{< code yml >}}
---
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
{{< /code >}}

{{< code json >}}
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
{{< /code >}}

{{< /language-toggle >}}

Now you can use sensuctl to add the check to Sensu:

{{< language-toggle >}}

{{< code shell "YML" >}}
sensuctl create --file check.yml
{{< /code >}}

{{< code shell "JSON" >}}
sensuctl create --file check.json
{{< /code >}}

{{< /language-toggle >}}

Use sensuctl to confirm that Sensu added the check:

{{< code shell >}}
sensuctl check list
       Name                     Command               Interval   Cron   Timeout   TTL   Subscriptions   Handlers                     Assets                Hooks   Publish?   Stdin?  
────────────────── ────────────────────────────────── ────────── ────── ───────── ───── ─────────────── ────────── ─────────────────────────────────────── ─────── ────────── ────────
 check-sensu-site   check-http.rb -u https://sensu.io         60                0     0   proxy                      sensu-plugins-http,sensu-ruby-runtime             true     false
{{< /code >}}

### Add the subscription

To run the check, you'll need a Sensu agent with the subscription `proxy`.
After you [install an agent][19], open `/etc/sensu/agent.yml` and add the `proxy` subscription so the subscription configuration looks like this:

{{< code yml >}}
subscriptions:
  - proxy
{{< /code >}}

Then, restart the agent:

{{< code shell >}}
sudo service sensu-agent restart
{{< /code >}}

### Validate the check

Use sensuctl to confirm that Sensu created the proxy entity `sensu-site`:

{{< code shell >}}
sensuctl entity list
      ID        Class    OS           Subscriptions                   Last Seen            
────────────── ─────── ─────── ─────────────────────────── ─────────────────────────────── 
sensu-centos   agent   linux   proxy,entity:sensu-centos   2019-01-16 21:50:03 +0000 UTC  
sensu-site     proxy           entity:sensu-site           N/A  
{{< /code >}}

{{% notice note %}}
**NOTE**: It might take a few moments for Sensu to execute the check and create the proxy entity.
{{% /notice %}}

Then, use sensuctl to confirm that Sensu is monitoring `sensu-site` with the `check-sensu-site` check:

{{< code shell >}}
sensuctl event info sensu-site check-sensu-site
=== sensu-site - check-sensu-site
Entity:    sensu-site
Check:     check-sensu-site
Output:    CheckHttp OK: 200, 72024 bytes
Status:    0
History:   0,0
Silenced:  false
Timestamp: 2019-01-16 21:51:53 +0000 UTC
{{< /code >}}

You can also see the new proxy entity in your [Sensu web UI][10].

## Use proxy requests to monitor a group of websites

Suppose that instead of monitoring just sensu.io, you want to monitor multiple sites, like docs.sensu.io, packagecloud.io, and github.com.
In this section, you'll use the [`proxy_requests` check attribute][3] along with [entity labels][11] and [token substitution][12] to monitor three sites with the same check.
Before you start, [register the `sensu-plugins-http` and `sensu-ruby-runtime` dynamic runtime assets][13] if you haven't already.

### Create proxy entities

Instead of creating a proxy entity using the `proxy_entity_name` check attribute, use sensuctl to create proxy entities to represent the three sites you want to monitor.
Your proxy entities need the `entity_class` attribute set to `proxy` to mark them as proxy entities as well as a few custom `labels` to identify them as a group and pass in individual URLs.

Create a file called `entities.yml` or `entities.json` and add the following entity definitions:

{{< language-toggle >}}
{{< code yml >}}
---
type: Entity
api_version: core/v2
metadata:
  name: sensu-docs
  namespace: default
  labels:
    proxy_type: website
    url: https://docs.sensu.io
spec:
  entity_class: proxy
{{< /code >}}
{{< code json >}}
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
{{< /code >}}
{{< /language-toggle >}}

{{< language-toggle >}}
{{< code yml >}}
---
type: Entity
api_version: core/v2
metadata:
  name: packagecloud-site
  namespace: default
  labels:
    proxy_type: website
    url: https://packagecloud.io
spec:
  entity_class: proxy
{{< /code >}}
{{< code json >}}
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
{{< /code >}}
{{< /language-toggle >}}

{{< language-toggle >}}
{{< code yml >}}
---
type: Entity
api_version: core/v2
metadata:
  name: github-site
  namespace: default
  labels:
    proxy_type: website
    url: https://github.com
spec:
  entity_class: proxy
{{< /code >}}
{{< code json >}}
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
{{< /code >}}
{{< /language-toggle >}}

{{% notice protip %}}
**PRO TIP**: When you create proxy entities, you can add any custom labels that make sense for your environment.
For example, when monitoring a group of routers, you may want to add `ip_address` labels.
{{% /notice %}}

Now you can use sensuctl to add these proxy entities to Sensu:

{{< language-toggle >}}

{{< code shell "YML" >}}
sensuctl create --file entities.yml
{{< /code >}}

{{< code shell "JSON" >}}
sensuctl create --file entities.json
{{< /code >}}

{{< /language-toggle >}}

Use sensuctl to confirm that the entities were added:

{{< code shell >}}
sensuctl entity list
        ID           Class    OS           Subscriptions                   Last Seen            
─────────────────── ─────── ─────── ─────────────────────────── ─────────────────────────────── 
 github-site         proxy                                       N/A                            
 packagecloud-site   proxy                                       N/A                            
 sensu-centos        agent   linux   proxy,entity:sensu-centos   2019-01-16 23:05:03 +0000 UTC  
 sensu-docs          proxy                                       N/A                            
{{< /code >}}

### Create a reusable HTTP check

Now that you have three proxy entities set up, each with a `proxy_type` and `url` label, you can use proxy requests and [token substitution][12] to create a single check that monitors all three sites.

Create a file called `check-http.yml` or `check-http.json` and add the following check definition:

{{< language-toggle >}}

{{< code yml >}}
---
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
{{< /code >}}

{{< code json >}}
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
{{< /code >}}

{{< /language-toggle >}}

Your `check-http` check uses the `proxy_requests` attribute to specify the applicable entities.
In this case, you want to run the `check-http` check on all entities of entity class `proxy` and proxy type `website`.
Because you're using this check to monitor multiple sites, you can use token substitution to apply the correct `url` in the check `command`.

Use sensuctl to add the `check-http` check to Sensu:

{{< language-toggle >}}

{{< code shell "YML" >}}
sensuctl create --file check-http.yml
{{< /code >}}

{{< code shell "JSON" >}}
sensuctl create --file check-http.json
{{< /code >}}

{{< /language-toggle >}}

Use sensuctl to confirm that Sensu created the check:

{{< code shell >}}
sensuctl check list
       Name                      Command               Interval   Cron   Timeout   TTL   Subscriptions   Handlers                   Assets                  Hooks   Publish?   Stdin?
───────────────── ─────────────────────────────────── ────────── ────── ───────── ───── ─────────────── ────────── ─────────────────────────────────────── ─────── ────────── ────────
  check-http        check-http.rb -u {{ .labels.url }}         60                0     0   proxy                     sensu-plugins-http,sensu-ruby-runtime           true       false                                     
{{< /code >}}

{{% notice protip %}}
**PRO TIP**: To distribute check executions across multiple agents, set the `round-robin` check attribute to `true`.
For more information about round robin checks, see the [check reference](../../reference/checks#round-robin-checks).
{{% /notice %}}

### Validate the check

Before you validate the check, make sure that you've [registered the `sensu-plugins-http` and `sensu-ruby-runtime` assets][13] and [added the `proxy` subscription to a Sensu agent][14].

Use sensuctl to confirm that Sensu is monitoring docs.sensu.io, packagecloud.io, and github.com with the `check-http`, returning a status of `0` (OK):

{{< code shell >}}
sensuctl event list
      Entity                Check          Output   Status   Silenced             Timestamp            
─────────────────── ───────────────────── ──────── ──────── ────────── ─────────────────────────────── 
github-site         check-http                           0   false      2019-01-17 17:10:31 +0000 UTC  
packagecloud-site   check-http                           0   false      2019-01-17 17:10:34 +0000 UTC  
sensu-centos        keepalive               ...          0   false      2019-01-17 17:10:34 +0000 UTC  
sensu-docs          check-http                           0   false      2019-01-17 17:06:59 +0000 UTC  
{{< /code >}}

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
[8]: ../../sensuctl/
[9]: ../../api/entities/
[10]: ../../web-ui/
[11]: ../../reference/entities#manage-entity-labels
[12]: ../../reference/tokens/
[13]: #register-assets
[14]: #add-the-subscription
[15]: #create-the-check
[16]: https://bonsai.sensu.io/assets/sensu-plugins/sensu-plugins-http
[17]: https://bonsai.sensu.io/assets/sensu/sensu-ruby-runtime
[18]: ../../reference/checks#round-robin-checks
[19]: ../../operations/deploy-sensu/install-sensu/
[20]: ../../reference/agent#restart-the-service
[21]: ../../sensuctl/sensuctl-bonsai/#install-asset-definitions
