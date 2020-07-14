---
title: "License management API"
linkTitle: "License API"
description: "The Sensu license API provides HTTP access to the active commercial license configuration. This reference includes examples for returning the active commercial license configuration and activating or updating a commercial license. Read on for the full reference."
version: "5.17"
product: "Sensu Go"
menu:
  sensu-go-5.17:
    parent: api
---

- [The `/license` API endpoints](#the-license-api-endpoints)
  - [`/license` (GET)](#license-get)
  - [`/license` (PUT)](#license-put)
  - [`/license` (DELETE)](#license-delete)

## The `/license` API endpoints

For more information about commercial features designed for enterprises, see [Get started with commercial features][1].

### `/license` (GET)

The `/license` API endpoint provides HTTP GET access to the active license configuration.

#### EXAMPLE {#license-get-example}

The following example demonstrates a request to the `/license` API endpoint, resulting in a JSON array that contains the license definition.

{{< highlight shell >}}
curl -X GET \
http://127.0.0.1:8080/api/core/v2/namespaces/default/license \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN" \
-H 'Content-Type: application/json'

HTTP/1.1 200 OK
{
  "type": "LicenseFile",
  "api_version": "licensing/v2",
  "metadata": {},
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
{{< /highlight >}}

#### API Specification {#license-get-specification}

/license (GET)  | 
---------------|------
description    | Returns the active commercial license configuration. To download your license, [log in to your Sensu account][2] or [contact the Sensu sales team for a free trial][3].
example url    | http://hostname:8080/api/enterprise/licensing/v2/license
response type  | Map
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< highlight shell >}}
{
  "type": "LicenseFile",
  "api_version": "licensing/v2",
  "metadata": {},
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
{{< /highlight >}}

### `/license` (PUT)

The `/license` API endpoint provides HTTP PUT access to activate a commercial license.

#### EXAMPLE {#license-put-example}

In the following example, an HTTP PUT request is submitted to the `/license` API endpoint to create the license definition.
The request returns a successful HTTP `201 Created` response.

{{< highlight shell >}}
curl -X PUT \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN" \
-H 'Content-Type: application/json' \
-d '{
  "type": "LicenseFile",
  "api_version": "licensing/v2",
  "metadata": {},
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
http://127.0.0.1:8080/api/core/v2/namespaces/default/license

HTTP/1.1 201 Created
{{< /highlight >}}

#### API Specification {#license-put-specification}

/license (PUT)  | 
---------------|------
description    | Activates a commercial license or updates an existing license configuration. To download your license, [log in to your Sensu account][2] or [contact the Sensu sales team for a free trial][3].
example url    | http://hostname:8080/api/enterprise/licensing/v2/license
payload        | {{< highlight shell >}}
{
  "type": "LicenseFile",
  "api_version": "licensing/v2",
  "metadata": {},
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
{{< /highlight >}}
response codes | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

### `/license` (DELETE)

The `/license` API endpoint provides HTTP DELETE access to remove a commercial license.

#### EXAMPLE {#license-delete-example}

The following example shows a request to the `/license` API endpoint to delete the commercial license, resulting in a successful HTTP `204 No Content` response.

{{< highlight shell >}}
curl -X DELETE \
http://127.0.0.1:8080/api/enterprise/licensing/v2/license \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN"

HTTP/1.1 204 No Content
{{< /highlight >}}

#### API Specification {#license-delete-specification}

/license (DELETE)  | 
-------------------|------
description    | Removes the commercial license.
example url    | http://hostname:8080/api/enterprise/licensing/v2/license
response codes | <ul><li>**Success**: 204 (No Content)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

[1]: ../../commercial/
[2]: https://account.sensu.io/
[3]: https://sensu.io/contact?subject=contact-sales
