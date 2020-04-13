---
title: "Prune API"
description: "The Sensu prune API provides HTTP access to create pruning commands to delete resources that do not appear in a given set of Sensu objects from a file, URL, or STDIN. This reference includes an example for creating a prune command for your Sensu instance. Read on for the full reference."
version: "5.20"
product: "Sensu Go"
menu:
  sensu-go-5.20:
    parent: api
---

## The `/prune/v1alpha` API endpoint

{{% notice important %}}
**IMPORTANT**: The prune API is an alpha feature in release 5.19.0 and may include breaking changes.
{{% /notice %}}

**COMMERCIAL FEATURE**: Access sensuctl pruning in the packaged Sensu Go distribution. For more information, see [Get started with commercial features][1].

### `/prune/v1alpha` (POST)

The `/prune/v1alpha` API endpoint provides HTTP POST access to create a pruning command to delete resources that are not specified in the request body.

#### EXAMPLE {#prune-v1alpha-post-example}

In the following example, an HTTP POST request is submitted to the `/prune/v1alpha` API endpoint to create a pruning command for the checks specified in the request body in the `dev` namespace created by any user.

The request returns a successful HTTP `201 Created` response and a list of the resources that were pruned.

{{< highlight shell >}}
curl -X POST \
http://127.0.0.1:8080/api/enterprise/prune/v1alpha\?types\=core/v2.CheckConfig\&allUsers\=true\&namespaces\=dev \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN" \
-H 'Content-Type: application/json' \
-d '{
  "type": "CheckConfig",
  "api_version": "core/v2",
  "name": "check-echo",
  "namespace": "dev",
  "labels": {
    "region": "us-west-2",
    "sensu.io/managed_by": "sensuctl"
  },
  "created_by": "admin"
}'


HTTP/1.1 201 Created

[
  {
    "type": "CheckConfig",
    "api_version": "core/v2",
    "name": "check-echo",
    "namespace": "dev",
    "labels": {
      "region": "us-west-2",
      "sensu.io/managed_by": "sensuctl"
    },
    "created_by": "admin"
  }
]
{{< /highlight >}}

#### API Specification {#prune-v1alpha-specification}

/prune/v1alpha (POST) | 
----------------------|------
description           | Creates a pruning command to delete the specified resources.
example URL           | http://hostname:8080/api/enterprise/prune/v1alpha
example payload       | {{< highlight shell >}}
{
  "type": "CheckConfig",
  "api_version": "core/v2",
  "name": "check-echo",
  "namespace": "dev",
  "labels": {
    "region": "us-west-2",
    "sensu.io/managed_by": "sensuctl"
  },
  "created_by": "admin"
}
{{< /highlight >}}
query parameters      | <ul><li>`type`: The [fully-qualified name][2] of the resource you want to prune. Example: `?type=core/v2.CheckConfig`.</li><li>`allUsers`: Prune resources created by all users. Mutually exclusive with the `users` parameter. Defaults to false. Example: `?allUsers=true`.</li><li>`clusterWide`: Prune any cluster-wide (non-namespaced) resources that are not defined in the configuration. Defaults to false. Example: `?clusterWide=true`.</li><li>`dryRun`: Print the resources that will be pruned but does not actually delete them. Defaults to false. Example: `?dryRun=true`.</li><li>`labelSelector`: Prune only resources that match the specified labels (accepts multiple values). Labels are a [commercial feature][1]. Example: `?labelSelector=[...]`.</li><li>`namespaces`: The namespace where you want to apply pruning. Example: `?namespaces=dev`.</li><li>`users`: Prune only resources that were created by the specified users (accepts multiple values). Defaults to the currently configured sensuctl user. Example: `?users=admin`.</li></ul> To use multiple values for the parameters that allow them, you must specify the parameter multiple times (for example, `?users=admin&users=dev`) rather than using a comma-separated list.
payload               | {{< highlight shell >}}
[
  {
    "type": "CheckConfig",
    "api_version": "core/v2",
    "name": "check-echo",
    "namespace": "dev",
    "labels": {
      "region": "us-west-2",
      "sensu.io/managed_by": "sensuctl"
    },
    "created_by": "admin"
  }
]
{{< /highlight >}}
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>


[1]: ../../getting-started/enterprise/
[2]: ../../sensuctl/reference/#sensuctl-prune-resource-types
