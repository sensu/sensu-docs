---
title: "Configure the web UI"
linkTitle: "Configure the Web UI"
description: "Web UI configuration allows you to define certain display options for the Sensu web UI. Read this guide to configure customized displays for your Sensu web UI."
weight: 30
version: "5.20"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-5.20:
    parent: dashboard
---

- [Create a web UI configuration](#create-a-web-ui-configuration)
- [Federate a web UI configuration to specific clusters](#federate-a-web-ui-configuration-to-specific-clusters)
- [Local cluster settings for debugging](#local-cluster-settings-for-debugging)

**COMMERCIAL FEATURE**: Access web UI configuration in the packaged Sensu Go distribution.
For more information, see [Get started with commercial features][1].

Web UI configuration allows you to define certain display options for the Sensu [web UI][3], such as which web UI theme to use, the number of items to list on each page, and which URLs and linked images to expand.
You can define a single custom web UI configuration to federate to all, some, or only one of your clusters.

## Create a web UI configuration

Use the [web UI configuration API][2] or [sensuctl create][5] to create a `GlobalConfig` resource.
The [web UI configuration reference][4] describes each attribute you can configure in the `GlobalConfig` resource.

{{% notice note %}}
**NOTE**: Each cluster should have only one web configuration.
If you provide more than one, Sensu will automatically use the earliest-created configuration.
{{% /notice %}}

If an individual user's settings conflict with the web UI configuration settings, Sensu will use the individual user's settings.
For example, if a user's system is set to dark mode and their web UI settings are configured to use their system settings, the user will see dark mode in Sensu's web UI, even if you set the theme to `classic` in your web UI configuration.

## Federate a web UI configuration to specific clusters

The web UI configuration in use is provided by the cluster you are connected to.
For example, if you open the web UI for https://cluster-a.sensu.my.org:3000, the web UI display will be configured according to the `GlobalConfig` resource for cluster-a.

In a federated environment, we recommend creating an [etcd replicator][6] for your `GlobalConfig` resource:

{{< language-toggle >}}

{{< highlight yml >}}
--- 
type: EtcdReplicator
api_version: federation/v1
metadata: 
  name: web_global_config
spec: 
  api_version: web/v1
  ca_cert: /path/to/ssl/trusted-certificate-authorities.pem
  cert: /path/to/ssl/cert.pem
  insecure: false
  key: /path/to/ssl/key.pem
  replication_interval_seconds: 120
  resource: GlobalConfig
  url: "http://127.0.0.1:2379"
{{< /highlight >}}

{{< highlight json >}}
{
  "type": "EtcdReplicator",
  "api_version": "federation/v1",
  "metadata": {
    "name": "web_global_config"
  },
  "spec": {
    "api_version": "web/v1",
    "ca_cert": "/path/to/ssl/trusted-certificate-authorities.pem",
    "cert": "/path/to/ssl/cert.pem",
    "insecure": false,
    "key": "/path/to/ssl/key.pem",
    "replication_interval_seconds": 120,
    "resource": "GlobalConfig",
    "url": "http://127.0.0.1:2379"
  }
}
{{< /highlight >}}

{{< /language-toggle >}}

## Local cluster settings for debugging

To help with debugging, set the [`always_show_local_cluster` attribute][7] to `true` to display the cluster you are currently connected to in the [namespace switcher][8].

For example, if you connect to the web UI on cluster-a, the namespace switcher should include a `local-cluster` heading that lists all the namespaces on cluster-a.
If cluster-a is not listed in the namespace switcher, [NEED TO EXPLAIN WHAT THIS MEANS].

If you set the `always_show_local_cluster` attribute to `false` for cluster-a, the cluster will not be listed in the namespace switcher.
You will still be able to directly connect to cluster-a, but other clusters will not be aware of it.


[1]: ../../getting-started/enterprise/
[2]: ../../api/webconfig/
[3]: ../../dashboard/overview/
[4]: ../../reference/webconfig/
[5]: ../../sensuctl/reference/#create-resources
[6]: ../../reference/etcdreplicators/
[7]: ../../reference/webconfig/#show-local-cluster
[8]: ../../dashboard/overview/#namespace-switcher
