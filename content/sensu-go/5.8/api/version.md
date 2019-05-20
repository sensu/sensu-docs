---
title: "Version API"
description: "The version API provides HTTP access to the Sensu and etcd versions. Here’s a reference for the version API in Sensu Go, including examples for returning version information about your Sensu instance. Read on for the full reference."
version: "5.8"
product: "Sensu Go"
menu:
  sensu-go-5.8:
    parent: api
---

## The `/version` API endpoint

### `/version` (GET)

The `/version` API endpoint provides HTTP GET access to the Sensu backend and etcd versions for your Sensu instance.

#### EXAMPLE {#version-get-example}

The following example demonstrates a request to the `/version` API, resulting in
a JSON map containing Sensu version data.

{{< highlight shell >}}
curl http://127.0.0.1:8080/version

HTTP/1.1 200 OK
{
  "Etcd": {
    "etcdserver": "3.3.2",
    "etcdcluster": "3.3.0"
  },
  "SensuBackend": "5.8.0#xxxxxxx"
}
{{< /highlight >}}

#### API Specification {#version-get-specification}

/version (GET)      |      |
--------------------|------
description         | Returns the Sensu backend and etcd version for your Sensu instance
example url         | http://hostname:8080/version
response type       | Map
response codes      | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
response parameters | <li>`Etcd.etcdserver` (string, required): etcd server version</li><li>`Etcd.etcdcluster` (string, optional): etcd cluster version for Sensu instances with the default embedded etcd; not required to match the etcd server version or the cluster versions of other backends in the cluster</li><li>`SensuBackend` (string, required): Sensu backend version in the format x.x.x#yyyyyyy where x.x.x is the Sensu version and yyyyyyy is the release SHA</li></ul>
output         | {{< highlight shell >}}
{
  "Etcd": {
    "etcdserver": "3.3.2",
    "etcdcluster": "3.3.0"
  },
  "SensuBackend": "5.8.0#xxxxxxx"
}
{{< /highlight >}}
