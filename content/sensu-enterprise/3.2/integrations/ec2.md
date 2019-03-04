---
title: "EC2"
product: "Sensu Enterprise"
version: "3.2"
weight: 14
menu:
  sensu-enterprise-3.2:
    parent: integrations
---
**ENTERPRISE: Built-in integrations are available for [Sensu Enterprise][1]
users only.**

- [Overview](#overview)
- [Configuration](#configuration)
  - [Example(s)](#examples)
  - [Integration Specification](#integration-specification)
    - [`ec2` attributes](#ec2-attributes)
- [Cross-Account Access](#cross-account-access)
	- [Client Configuration](#client-configuration)
	- [Integration Configuration](#integration-configuration)

## Overview

Deregister Sensu clients from the client registry, if they no longer have an
associated [Amazon Web Services (AWS)][2] EC2 instance in the allowed state(s).
This enterprise handler (integration) will only work if Sensu clients are named
using the EC2 instance ID, for the instance on which they reside. The `ec2`
enterprise handler requires valid [AWS IAM user credentials][3] with the EC2
describe instances action in a policy, e.g. `ec2:DescribeInstances`.

## Configuration

### Example(s) {#examples}

The following is an example global configuration for the `ec2` enterprise
handler (integration).

{{< highlight json >}}
{
  "ec2": {
    "region": "us-west-2",
    "access_key_id": "xxxxxxxxxxxxx",
    "secret_access_key": "xxxxxxxxxxxxxxxxxxxxxxxxx",
    "allowed_instance_states": ["running"],
    "timeout": 10
  }
}
{{< /highlight >}}

### Integration Specification

_NOTE: the following integration definition attributes may be overwritten by
the corresponding Sensu [client definition `ec2` attributes][4], which are
included in [event data][5]._

#### `ec2` attributes

The following attributes are configured within the `{"ec2": {} }` [configuration
scope][6].

region       | 
-------------|------
description  | The AWS EC2 region to query for EC2 instance state(s).
required     | false
type         | String
default      | `us-east-1`
example      | {{< highlight shell >}}"region": "us-west-1"{{< /highlight >}}

access_key_id | 
--------------|------
description   | The AWS IAM user access key ID to use when querying the EC2 API.
required      | true
type          | String
example       | {{< highlight shell >}}"access_key_id": "xxxxxxxxxxxxx"{{< /highlight >}}

secret_access_key | 
------------------|------
description       | The AWS IAM user secret access key to use when querying the EC2 API.
required          | true
type              | String
example           | {{< highlight shell >}}"secret_access_key": "xxxxxxxxxxxxxxxxxxxxxxxxx"{{< /highlight >}}

allowed_instance_states | 
------------------------|------
description             | An array of allowed EC2 instance states. Each array item must each be a string. Any other state(s) will cause the Sensu client to be deregistered.
required                | false
type                    | Array
allowed values          | `running`, `stopping`, `stopped`, `shutting-down`, `terminated`, `rebooting`, `pending`
default                 | `["running"]`
example                 | {{< highlight shell >}}"allowed_instance_states": ["running", "rebooting"]{{< /highlight >}}

filters        | 
---------------|------
description    | An array of Sensu event filters (names) to use when filtering events for the handler. Each array item must be a string. Specified filters are merged with default values.
required       | false
type           | Array
default        | {{< highlight shell >}}["handle_when", "check_dependencies"]{{< /highlight >}}
example        | {{< highlight shell >}}"filters": ["recurrence", "production"]{{< /highlight >}}

severities     | 
---------------|------
description    | An array of check result severities the handler will handle. _NOTE: event resolution bypasses this filtering._
required       | false
type           | Array
allowed values | `ok`, `warning`, `critical`, `unknown`
default        | {{< highlight shell >}}["warning", "critical", "unknown"]{{< /highlight >}}
example        | {{< highlight shell >}} "severities": ["critical", "unknown"]{{< /highlight >}}

timeout      | 
-------------|------
description  | The handler execution duration timeout in seconds (hard stop).
required     | false
type         | Integer
default      | `10`
example      | {{< highlight shell >}}"timeout": 30{{< /highlight >}}

## Cross-Account Access
Cross-account access lets you use IAM-defined trust relationships to access a Sensu Enterprise instance from EC2 clients across multiple AWS accounts.

### Client Configuration
The EC2 integration supports account access configuration at the client level.
To configure account access, add the `account` attribute to the Sensu client configuration within the `ec2` scope.

#### Client Configuration Example

{{< highlight json >}}{
    "client": {
      "name": "i-424242",
      "subscriptions": ["production"],
      "ec2": {
          "account": "sensuapp"
      }
    }
}{{< /highlight >}}

For additional EC2 attributes possible at the client scope, see the [client EC2 attributes][4].

### Integration Configuration
To enable cross-account support in the EC2 integration, add the `accounts` attributes, `name` and `role_arn`, to the EC2 integration configuration in Sensu.
When processing events from clients with an `ec2.account` attribute, Sensu Enterprise applies the matching Amazon resource name (`role_arn`) stored in the integration configuration to access EC2.

#### Integration Configuration Example

{{< highlight json >}}
{
  "ec2": {
    "region": "us-west-2",
    "access_key_id": "xxxxxxxxxxxxx",
    "secret_access_key": "xxxxxxxxxxxxxxxxxxxxxxxxx",
    "allowed_instance_states": ["running"],
    "timeout": 10,
    "accounts": [
      {
        "name": "sensuapp",
        "role_arn": "arn:aws:iam::xxxxxxxxxx:role/CrossAccountSignin"
      }
    ]
  }
}
{{< /highlight >}}

#### `accounts` attributes
accounts     | 
-------------|------
description  | Amazon resource names to use to access EC2
required     | false
type         | Array of hashes
example      | {{< highlight shell >}}"accounts": [
  {
    "name": "sensuapp",
    "role_arn": "arn:aws:iam::xxxxxxxxxx:role/CrossAccountSignin"
  }
]{{< /highlight >}}

name         | 
-------------|------
description  | Account name configured in the Sensu client
required     | false
type         | String
example      | {{< highlight shell >}}"name": "sensuapp"{{< /highlight >}}

role_arn     | 
-------------|------
description  | Amazon resource name for the account
required     | false
type         | String
example      | {{< highlight shell >}}"role_arn": "arn:aws:iam::xxxxxxxxxx:role/CrossAccountSignin"{{< /highlight >}}

[?]:  #
[1]:  /sensu-enterprise
[2]:  http://aws.amazon.com?ref=sensu-enterprise
[3]:  http://aws.amazon.com/iam/
[4]:  /sensu-core/latest/reference/clients#ec2-attributes
[5]:  /sensu-core/latest/reference/events#event-data
[6]:  /sensu-core/latest/reference/configuration#configuration-scopes
