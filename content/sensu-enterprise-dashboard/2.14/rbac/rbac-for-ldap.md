---
title: "RBAC for LDAP"
description: "Reference documentation for the Sensu Enterprise Dashboard Role Based Access Controls (RBAC) for LDAP"
product: "Sensu Enterprise Dashboard"
version: "2.14"
weight: 2
menu:
  sensu-enterprise-dashboard-2.14:
    parent: rbac
---
**ENTERPRISE: Role based access controls are available for [Sensu Enterprise][5]
users only.**

## Reference Documentation

- [What is RBAC for LDAP?](#what-is-rbac-for-ldap)
- [LDAP provider compatibility](#ldap-provider-compatibility)
- [RBAC for LDAP configuration](#rbac-for-ldap-configuration)
  - [Example RBAC for LDAP definition](#example-rbac-for-ldap-definition)
  - [RBAC for LDAP definition specification](#rbac-for-ldap-definition-specification)
    - [`ldap` attributes](#ldap-attributes)
    - [`servers` attributes](#servers-attributes)
    - [`roles` attributes](#roles-attributes)

## What is RBAC for LDAP?

The Sensu Enterprise Dashboard offers support for built-in [Role Based Access
Controls (RBAC)][0], which depends on using some external source of truth for
authentication. The Sensu Enterprise Dashboard RBAC for LDAP driver provides
support for using a **Lightweight Directory Access Protocol (LDAP)** provider
(e.g. [Microsoft Active Directory][1], [OpenLDAP][2], etc) for RBAC
authentication.

## LDAP provider compatibility

This driver is tested with **Microsoft Active Directory** (AD) and should be
compatible with any standards-compliant LDAP provider.

## RBAC for LDAP configuration

### Example RBAC for LDAP definition

{{< highlight json >}}
{
  "dashboard": {
    "host": "0.0.0.0",
    "port": 3000,
    "...": "",
    "ldap": {
      "debug": false,
      "servers": [
        {
          "server": "localhost",
          "port": 389,
          "basedn": "cn=users,dc=domain,dc=tld",
          "binduser": "cn=binder,cn=users,dc=domain,dc=tld",
          "bindpass": "secret",
          "insecure": false,
          "security": "starttls",
          "userattribute": "sAMAccountName"
        }
      ],
      "roles": [
        {
          "name": "guests",
          "members": [
            "guests_group"
          ],
          "datacenters": [
            "us-west-1"
          ],
          "subscriptions": [
            "webserver"
          ],
          "readonly": true
        },
        {
          "name": "operators",
          "members": [
            "operators_group"
          ],
          "datacenters": [],
          "subscriptions": [],
          "readonly": false
        }
      ]
    }
  }
}
{{< /highlight >}}

_NOTE: You'll notice in the example there are no attributes defined in dashboard.users. When using this provider, there will not be an option to have local users as a fallback option._

### RBAC for LDAP definition specification

#### `ldap` attributes

debug        | |
-------------|------
description  | Determines whether or not to output debug information about the LDAP connection. _WARNING: not recommended for production use. Sensitive information including usernames and passwords may be sent to the log files when enabled._
required     | false
type         | Boolean
default      | false
example      | {{< highlight shell >}}"debug": true{{< /highlight >}}

servers      | |
-------------|------
description  | An array of [LDAP servers][6] that each represent a LDAP directory or a Microsoft Active Directory domain controller. _NOTE: each LDAP server will be tried in sequence until one of them authenticates the username and password provided or the end of the array._
required     | true
type         | Array
example      | {{< highlight shell >}}"servers": [
  {
    "server": "localhost",
    "port": 389,
    "basedn": "cn=users,dc=domain,dc=tld",
    "binduser": "cn=binder,cn=users,dc=domain,dc=tld",
    "bindpass": "secret",
    "insecure": false,
    "security": "starttls",
    "userattribute": "sAMAccountName"
  }
]
{{< /highlight >}}

roles        | |
-------------|------
description  | An array of [Role definitions][3] for LDAP groups.
required     | true
type         | Array
example      | {{< highlight shell >}}"roles": [
  {
    "name": "guests",
    "members": [
      "guests_group"
    ],
    "datacenters": [
      "us-west-1"
    ],
    "subscriptions": [
      "webserver"
    ],
    "readonly": true
  },
  {
    "name": "operators",
    "members": [
      "operators_group"
    ],
    "datacenters": [],
    "subscriptions": [],
    "readonly": false
  }
]
{{< /highlight >}}

#### `servers` attributes

server       | |
-------------|------
description  | **IP address** or **FQDN** of the LDAP directory or the Microsoft Active Directory domain controller.
required     | true
type         | String
example      | {{< highlight shell >}}"server": "localhost"{{< /highlight >}}

port         | |
-------------|------
description  | Port of the LDAP/AD service (usually `389` or `636`)
required     | true
type         | Integer
example      | {{< highlight shell >}}"port": 389{{< /highlight >}}

dialect        | |
---------------|------
description    | Which LDAP dialect to use (Microsoft Active Directory, or OpenLDAP).
required       | false
type           | String
allowed values | `ad`, `openldap`
example        | {{< highlight shell >}}"dialect": "ad"{{< /highlight >}}

basedn       | |
-------------|------
description  | Tells which part of the directory tree to search. For example, `cn=users,dc=domain,dc=tld` will search into all `users` of the `domain.tld` directory.
required     | true
type         | String
example      | {{< highlight shell >}}"basedn": "cn=users,dc=domain,dc=tld"{{< /highlight >}}

groupbasedn  | |
-------------|------
description  | Overrides the `basedn` attribute for the group lookups.
required     | false
type         | String
example      | {{< highlight shell >}}"groupbasedn": "cn=groups,dc=domain,dc=tld"{{< /highlight >}}

userbasedn   | |
-------------|------
description  | Overrides the `basedn` attribute for the user lookups.
required     | false
type         | String
example      | {{< highlight shell >}}"userbasedn": "cn=admins,dc=domain,dc=tld"{{< /highlight >}}

binduser     | |
-------------|------
description  | The LDAP account that performs user lookups. We recommend to use a read-only account. Use the distinguished name (DN) format, such as `cn=binder,cn=users,dc=domain,dc=tld`. _NOTE: using a binder account is not required with Active Directory, although it is highly recommended._
required     | true
type         | String
example      | {{< highlight shell >}}"binduser": "cn=binder,cn=users,dc=domain,dc=tld"{{< /highlight >}}

bindpass     | |
-------------|------
description  | The password for the binduser.
required     | true
type         | String
example      | {{< highlight shell >}}"bindpass": "secret"{{< /highlight >}}

insecure     | |
-------------|------
description  | Determines whether or not to skip SSL certificate verification (e.g. for self-signed certificates).
required     | false
type         | Boolean
default      | false
example      | {{< highlight shell >}}"insecure": true{{< /highlight >}}

security       | |
---------------|------
description    | Determines the encryption type to be used for the connection to the LDAP server.
required       | true
type           | String
allowed values | `none`, `starttls`, or `tls`
example        | {{< highlight shell >}}"security": "none"{{< /highlight >}}

userattribute | |
--------------|------
description   | The LDAP attribute used to identify an account. You should typically use `sAMAccountName` for Active Directory and `uid` for other LDAP softwares, such as OpenLDAP, but it may vary.
required      | false
type          | String
default       | `sAMAccountName`
example       | {{< highlight shell >}}"userattribute": "uid"{{< /highlight >}}

groupmemberattribute | |
---------------------|------
description          | The LDAP attribute used to identify the group memberships.
required             | false
type                 | String
default              | `member`
example              | {{< highlight shell >}}"groupmemberattribute": "uniqueMember"{{< /highlight >}}

userobjectclass | |
----------------|------
description     | The LDAP object class used for the user accounts.
required        | false
type            | String
default         | `person`
example         | {{< highlight shell >}}"userobjectclass": "inetOrgPerson"{{< /highlight >}}

groupobjectclass | |
-----------------|------
description      | The LDAP object class used for the groups.
required         | false
type             | String
default          | `groupOfNames`
example          | {{< highlight shell >}}"groupobjectclass": "posixGroup"{{< /highlight >}}

#### `roles` attributes

Please see the [RBAC definition specification][4] for information on how to
configure RBAC roles.

[?]:  #
[0]:  ../overview
[1]:  https://msdn.microsoft.com/en-us/library/aa362244(v=vs.85).aspx
[2]:  http://www.openldap.org/
[3]:  #roles-attributes
[4]:  ../overview#roles-attributes
[5]:  /sensu-enterprise
[6]:  #servers-attributes
