---
title: "Version API"
description: "The Sensu version API provides HTTP access to the Sensu and etcd versions. This reference includes examples for returning version information about your Sensu instance. Read on for the full reference."
api_title: "Version API"
type: "api"
version: "5.21"
product: "Sensu Go"
menu:
  sensu-go-5.21:
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
    "etcdserver": "3.3.17",
    "etcdcluster": "3.3.0"
  },
  "sensu_backend": "5.x.x#yyyyyyy"
}
{{< /code >}}

### API Specification {#version-get-specification}

/version (GET)      |      |
--------------------|------
description         | Returns the Sensu backend and etcd version for the Sensu instance.
example url         | http://hostname:8080/version
response type       | Map
response codes      | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
response parameters | Required: <ul><li>`etcd.etcdserver` (string). Etcd server version.</li><li>`sensu_backend` (string). Sensu backend version in the format x.x.x#yyyyyyy where x.x.x is the Sensu version and yyyyyyy is the release SHA</li></ul><br>Optional:<ul><li>`etcd.etcdcluster` (string). Etcd cluster version for Sensu instances with the default embedded etcd. Not required to match the etcd server version or the cluster versions of other backends in the cluster.</li></ul>
output         | {{< code shell >}}
{
  "etcd": {
    "etcdserver": "3.3.17",
    "etcdcluster": "3.3.0"
  },
  "sensu_backend": "5.x.x#yyyyyyy"
}
{{< /code >}}
