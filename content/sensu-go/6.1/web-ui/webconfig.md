---
title: "Configure the web UI"
linkTitle: "Configure the Web UI"
description: "Web UI configuration allows you to define certain display options for the Sensu web UI. Read this guide to configure customized displays for your Sensu web UI."
weight: 40
version: "6.1"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-6.1:
    parent: web-ui
---

{{% notice commercial %}}
**COMMERCIAL FEATURE**: Access web UI configuration in the packaged Sensu Go distribution.
For more information, read [Get started with commercial features](../../commercial/).
{{% /notice %}}

Web UI configuration allows you to define certain display options for the Sensu [web UI][3], such as which web UI theme to use, the number of items to list on each page, and which URLs and linked images to expand.
You can define a single custom web UI configuration to federate to all, some, or only one of your clusters.

## Create a web UI configuration

Use the [web UI configuration API][2] or [sensuctl create][5] to create a `GlobalConfig` resource.
The [web UI configuration reference][4] describes each attribute you can configure in the `GlobalConfig` resource.

{{% notice note %}}
**NOTE**: Each cluster should have only one web configuration.
{{% /notice %}}

If an individual user's settings conflict with the web UI configuration settings, Sensu will use the individual user's settings.
For example, if a user's system is set to dark mode and their web UI settings are configured to use their system settings, the user will see dark mode in Sensu's web UI, even if you set the theme to `classic` in your web UI configuration.

## Federate a web UI configuration to specific clusters

The web UI configuration in use is provided by the cluster you are connected to.
For example, if you open the web UI for https://cluster-a.sensu.my.org:3000, the web UI display will be configured according to the `GlobalConfig` resource for cluster-a.

In a federated environment, you can create an [etcd replicator][6] for your `GlobalConfig` resource so you can use it for different clusters:

{{< language-toggle >}}

{{< code yml >}}
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
{{< /code >}}

{{< code json >}}
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
{{< /code >}}

{{< /language-toggle >}}

## Debugging in federated environments

In a federated environment, a problem like incorrect configuration, an error, or a network issue could prevent a cluster from appearing in the web UI [namespace switcher][8].

If you set the [`always_show_local_cluster` attribute][7] to `true` in your web UI configuration, the namespace switcher will display a heading for each federated cluster, along with the local-cluster heading to indicate the cluster you are currently connected to.
With `always_show_local_cluster` set to `true`, the cluster administrator can directly connect to the local cluster even if there is a problem that would otherwise prevent the cluster from being listed in the namespace switcher.

{{% notice note %}}
**NOTE**: Use the `always_show_local_cluster` attribute only in federated environments.
In a single-cluster environment, the namespace switcher will only list a local-cluster heading and the namespaces for that cluster.
{{% /notice %}}


[2]: ../../api/webconfig/
[3]: ../
[4]: ../webconfig-reference/
[5]: ../../sensuctl/create-manage-resources/#create-resources
[6]: ../../operations/deploy-sensu/etcdreplicators/
[7]: ../webconfig-reference/#show-local-cluster
[8]: ../view-manage-resources/#use-the-namespace-switcher
