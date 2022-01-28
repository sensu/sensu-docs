---
title: "enterprise/prune/v1alpha"
description: "Sensu enterprise/prune/v1alpha API endpoints provide HTTP access to create pruning commands to delete resources that do not appear in a given set of Sensu objects from a file, URL, or STDIN. This reference includes an example for creating a prune command for your Sensu instance."
enterprise_api_title: "enterprise/prune/v1alpha"
type: "enterprise_api"
version: "6.3"
product: "Sensu Go"
menu:
  sensu-go-6.3:
    parent: enterprise
---

{{% notice commercial %}}
**COMMERCIAL FEATURE**: Access pruning via `enterprise/prune/v1alpha` API endpoints in the packaged Sensu Go distribution.
For more information, read [Get started with commercial features](../../../commercial/).
{{% /notice %}}

{{% notice note %}}
**NOTE**: The `enterprise/prune/v1alpha` API endpoints are an alpha feature and may include breaking changes.<br><br>
The pruning operation follows the role-based access control (RBAC) permissions of the current user.
For example, to prune resources in the `dev` namespace, the current user who sends the prune command must have delete access to the `dev` namespace.<br><br>
Requests to `enterprise/prune/v1alpha` API endpoints require you to authenticate with a Sensu [API key](../../#configure-an-environment-variable-for-api-key-authentication) or [access token](../../#authenticate-with-the-authentication-api).
The code examples in this document use the [environment variable](../../#configure-an-environment-variable-for-api-key-authentication) `$SENSU_API_KEY` to represent a valid API key in API requests.
{{% /notice %}}

## Create a new pruning command

The `/prune/v1alpha` API endpoint provides HTTP POST access to create a pruning command to delete resources that are not specified in the request body.

### Example {#prune-v1alpha-post-example}

In the following example, an HTTP POST request is submitted to the `/prune/v1alpha` API endpoint to create a pruning command for the checks specified in the request body in the `dev` namespace created by any user.

The request returns a successful HTTP `201 Created` response and a list of the resources that were pruned.

{{< code shell >}}
curl -X POST \
http://127.0.0.1:8080/api/enterprise/prune/v1alpha\?types\=core/v2.CheckConfig\&allUsers\=true\&namespaces\=dev \
-H "Authorization: Key $SENSU_API_KEY" \
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
{{< /code >}}

### API Specification {#prune-v1alpha-specification}

/prune/v1alpha (POST) | 
----------------------|------
description           | Creates a pruning command to delete the specified resources.
example URL           | http://hostname:8080/api/enterprise/prune/v1alpha
example payload       | {{< code shell >}}
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
{{< /code >}}
query parameters      | <ul><li>`type`: The [fully-qualified name][2] of the resource you want to prune. Example: `?type=core/v2.CheckConfig`.</li><li>`allUsers`: Prune resources created by all users. Mutually exclusive with the `users` parameter. Defaults to false. Example: `?allUsers=true`.</li><li>`clusterWide`: Prune any cluster-wide (non-namespaced) resources that are not defined in the configuration. Defaults to false. Example: `?clusterWide=true`.</li><li>`dryRun`: Print the resources that will be pruned but does not actually delete them. Defaults to false. Example: `?dryRun=true`.</li><li>`labelSelector`: Prune only resources that match the specified labels (accepts multiple values). Labels are a [commercial feature][1]. Example: `?labelSelector=[...]`.</li><li>`namespaces`: The namespace where you want to apply pruning. Example: `?namespaces=dev`.</li><li>`users`: Prune only resources that were created by the specified users (accepts multiple values). Defaults to the currently configured sensuctl user. Example: `?users=admin`.</li></ul> To use multiple values for the parameters that allow them, you must specify the parameter multiple times (for example, `?users=admin&users=dev`) rather than using a comma-separated list.
payload               | {{< code shell >}}
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
{{< /code >}}
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>


[1]: ../../../commercial/
[2]: ../../../sensuctl/create-manage-resources/#supported-resource-types
