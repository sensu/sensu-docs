---
title: "Version API"
description: "The Sensu version API provides HTTP access to the Sensu and etcd versions. This reference includes examples for returning version information about your Sensu instance. Read on for the full reference."
api_title: "Version API"
type: "api"
version: "6.0"
product: "Sensu Go"
menu:
  sensu-go-6.0:
    parent: api
---

## Get the Sensu backend and etcd versions

The `/version` API endpoint provides HTTP GET access to the Sensu backend and etcd versions for the Sensu instance.

### Example {#version-get-example}

The following example demonstrates a request to the `/version` API endpoint, resulting in a JSON map that contains Sensu version data.

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8080/version

HTTP/1.1 200 OK
{
  "etcd": {
    "etcdserver": "3.3.22",
    "etcdcluster": "3.3.0"
  },
  "sensu_backend": "6.0.0"
}
{{< /code >}}

### API Specification {#version-get-specification}

/version (GET)      |      |
--------------------|------
description         | Returns the etcd server version and Sensu backend version. For clustered Sensu installations with the default embedded etcd, also returns the etcd cluster version (which may not match the etcd server version or the cluster versions of other backends in the cluster).
example url         | http://hostname:8080/version
response type       | Map
response codes      | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< code shell >}}
{
  "etcd": {
    "etcdserver": "3.3.22",
    "etcdcluster": "3.3.0"
  },
  "sensu_backend": "6.x.x"
}
{{< /code >}}
