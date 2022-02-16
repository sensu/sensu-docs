---
title: "/license"
description: "Sensu /license API endpoints provide HTTP access to the active commercial license configuration. This reference includes examples for retrieving the active commercial license configuration and activating or updating a commercial license."
other_api_title: "/license"
type: "other_api"
version: "6.5"
product: "Sensu Go"
menu:
  sensu-go-6.5:
    parent: other
---

{{% notice note %}}
**NOTE**: Requests to `/license` API endpoints require you to authenticate with a Sensu [API key](../../#configure-an-environment-variable-for-api-key-authentication) or [access token](../../#authenticate-with-auth-api-endpoints).
The code examples in this document use the [environment variable](../../#configure-an-environment-variable-for-api-key-authentication) `$SENSU_API_KEY` to represent a valid API key in API requests.
{{% /notice %}}

For more information about commercial features designed for enterprises, read [Get started with commercial features][1].

## Get the active license configuration

The `/license` API endpoint provides HTTP GET access to the active license configuration.

### Example {#license-get-example}

The following example demonstrates a request to the `/license` API endpoint, resulting in a JSON array that contains the license definition.

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8080/api/enterprise/licensing/v2/license \
-H "Authorization: Key $SENSU_API_KEY" \
-H 'Content-Type: application/json'

HTTP/1.1 200 OK
{
  "type": "LicenseFile",
  "api_version": "licensing/v2",
  "metadata": {
    "labels": {
      "sensu.io/entity-count": "10",
      "sensu.io/entity-limit": "100"
    }
  },
  "spec": {
    "license": {
      "version": 1,
      "issuer": "Sensu, Inc.",
      "accountName": "my_account",
      "accountID": 1234567,
      "issued": "2019-01-01T13:40:25-08:00",
      "validUntil": "2020-01-01T13:40:25-08:00",
      "plan": "managed",
      "features": [
        "all"
      ],
      "signature": {
        "algorithm": "PSS",
        "hashAlgorithm": "SHA256",
        "saltLength": 20
      }
    },
    "signature": "XXXXXXXXXX",
    "metadata": {}
  }
}
{{< /code >}}

### API Specification {#license-get-specification}

/license (GET)  | 
---------------|------
description    | Returns the active commercial license configuration. To download your license, [log in to your Sensu account][2] or [contact the Sensu sales team for a free trial][3].
example url    | http://hostname:8080/api/enterprise/licensing/v2/license
response type  | Map
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< code shell >}}
{
  "type": "LicenseFile",
  "api_version": "licensing/v2",
  "metadata": {
    "labels": {
      "sensu.io/entity-count": "10",
      "sensu.io/entity-limit": "100"
    }
  },
  "spec": {
    "license": {
      "version": 1,
      "issuer": "Sensu, Inc.",
      "accountName": "my_account",
      "accountID": 1234567,
      "issued": "2019-01-01T13:40:25-08:00",
      "validUntil": "2020-01-01T13:40:25-08:00",
      "plan": "managed",
      "features": [
        "all"
      ],
      "signature": {
        "algorithm": "PSS",
        "hashAlgorithm": "SHA256",
        "saltLength": 20
      }
    },
    "signature": "XXXXXXXXXX",
    "metadata": {}
  }
}
{{< /code >}}

## Activate a commercial license

The `/license` API endpoint provides HTTP PUT access to activate a commercial license.

{{% notice note %}}
**NOTE**: For [clustered configurations](../../../operations/deploy-sensu/cluster-sensu), you only need to activate your license for one of the backends within the cluster.
{{% /notice %}}

### Example {#license-put-example}

In the following example, an HTTP PUT request is submitted to the `/license` API endpoint to create the license definition.
The request returns a successful HTTP `201 Created` response.

{{< code shell >}}
curl -X PUT \
-H "Authorization: Key $SENSU_API_KEY" \
-H 'Content-Type: application/json' \
-d '{
  "type": "LicenseFile",
  "api_version": "licensing/v2",
  "metadata": {
    "labels": {
      "sensu.io/entity-count": "10",
      "sensu.io/entity-limit": "100"
    }
  },
  "spec": {
    "license": {
      "version": 1,
      "issuer": "Sensu, Inc.",
      "accountName": "my_account",
      "accountID": 1234567,
      "issued": "2019-01-01T13:40:25-08:00",
      "validUntil": "2020-01-01T13:40:25-08:00",
      "plan": "managed",
      "features": [
        "all"
      ],
      "signature": {
        "algorithm": "PSS",
        "hashAlgorithm": "SHA256",
        "saltLength": 20
      }
    },
    "signature": "XXXXXXXXXX",
    "metadata": {}
  }
}' \
http://127.0.0.1:8080/api/enterprise/licensing/v2/license

HTTP/1.1 201 Created
{{< /code >}}

### API Specification {#license-put-specification}

/license (PUT)  | 
---------------|------
description    | Activates a commercial license or updates an existing license configuration. To download your license, [log in to your Sensu account][2] or [contact the Sensu sales team for a free trial][3].
example url    | http://hostname:8080/api/enterprise/licensing/v2/license
payload        | {{< code shell >}}
{
  "type": "LicenseFile",
  "api_version": "licensing/v2",
  "metadata": {
    "labels": {
      "sensu.io/entity-count": "10",
      "sensu.io/entity-limit": "100"
    }
  },
  "spec": {
    "license": {
      "version": 1,
      "issuer": "Sensu, Inc.",
      "accountName": "my_account",
      "accountID": 1234567,
      "issued": "2019-01-01T13:40:25-08:00",
      "validUntil": "2020-01-01T13:40:25-08:00",
      "plan": "managed",
      "features": [
        "all"
      ],
      "signature": {
        "algorithm": "PSS",
        "hashAlgorithm": "SHA256",
        "saltLength": 20
      }
    },
    "signature": "XXXXXXXXXX",
    "metadata": {}
  }
}
{{< /code >}}
response codes | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Delete a commercial license

The `/license` API endpoint provides HTTP DELETE access to remove a commercial license.

### Example {#license-delete-example}

The following example shows a request to the `/license` API endpoint to delete the commercial license, resulting in a successful HTTP `204 No Content` response.

{{< code shell >}}
curl -X DELETE \
http://127.0.0.1:8080/api/enterprise/licensing/v2/license \
-H "Authorization: Key $SENSU_API_KEY"

HTTP/1.1 204 No Content
{{< /code >}}

### API Specification {#license-delete-specification}

/license (DELETE)  | 
-------------------|------
description    | Removes the commercial license.
example url    | http://hostname:8080/api/enterprise/licensing/v2/license
response codes | <ul><li>**Success**: 204 (No Content)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

[1]: ../../../commercial/
[2]: https://account.sensu.io/
[3]: https://sensu.io/contact?subject=contact-sales
