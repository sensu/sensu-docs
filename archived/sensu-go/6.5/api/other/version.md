---
title: "/version"
description: "Read this API documentation for information about the Sensu /version API endpoint, which provides HTTP access to Sensu and etcd versions."
other_api_title: "/version"
type: "other_api"
version: "6.5"
product: "Sensu Go"
menu:
  sensu-go-6.5:
    parent: other
---

## Get the Sensu backend and etcd versions

The `/version` API endpoint provides HTTP GET access to the Sensu backend and etcd versions for the Sensu instance.

### Example {#version-get-example}

The following example demonstrates a GET request to the `/version` API endpoint:

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8080/version
{{< /code >}}

The request results in a successful `HTTP/1.1 200 OK` response and a JSON map that contains Sensu version data:

{{< code text >}}
{
  "etcd": {
    "etcdserver": "3.5.0",
    "etcdcluster": "3.5.0"
  },
  "sensu_backend": "6.4.0"
}
{{< /code >}}

### API Specification {#version-get-specification}

/version (GET)      |      |
--------------------|------
description         | Returns the etcd server version and Sensu backend version. For clustered Sensu installations with the default embedded etcd, also returns the etcd cluster version (which may not match the etcd server version or the cluster versions of other backends in the cluster).
example url         | http://hostname:8080/version
response type       | Map
response codes      | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< code text >}}
{
  "etcd": {
    "etcdserver": "3.5.0",
    "etcdcluster": "3.5.0"
  },
  "sensu_backend": "6.4.0"
}
{{< /code >}}
