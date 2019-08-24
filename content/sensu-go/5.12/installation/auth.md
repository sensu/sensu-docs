---
title: "Authentication"
description: "In addition to built-in RBAC, Sensu includes license-activated support for authentication using a Lightweight Directory Access Protocol (LDAP) provider. Read the guide to configure a provider."
weight: 4
version: "5.12"
product: "Sensu Go"
menu:
  sensu-go-5.12:
    parent: installation
---

- [Managing authentication providers](#managing-authentication-providers)
- [Configuring authentication providers](#configuring-authentication-providers)
- [LDAP authentication](#ldap-authentication)
  - [Examples](#ldap-configuration-examples)
  - [Specification](#ldap-specification)
  - [Troubleshooting](#ldap-troubleshooting)
- [Active Directory authentication](#active-directory-authentication)
  - [Examples](#active-directory-configuration-examples)
  - [Specification](#active-directory-specification)
  - [Troubleshooting](#active-directory-troubleshooting)
- [OIDC](#oidc-authentication)
  - [OIDC configuration examples](#oidc-configuration-example)
  - [`oidc` attributes](#oidc-attributes)
  - [Oktra](#okta)
  - [PingFederate](#pingfederate)

Sensu requires username and password authentication to access the [Sensu dashboard][1], [API][8], and command line tool ([sensuctl][2]).
For Sensu's [default user credentials][3] and more information about configuring Sensu role based access control, see the [RBAC reference][4] and [guide to creating users][5].

In addition to built-in RBAC, Sensu includes [license-activated][6] support for authentication using external authentication providers.
Sensu currently supports Microsoft Active Directory and standards-compliant Lightweight Directory Access Protocol tools like OpenLDAP.

**LICENSED TIER**: Unlock authentication providers in Sensu Go with a Sensu license. To activate your license, see the [getting started guide][6].

## Managing authentication providers

You can view and delete authentication providers using sensuctl and the [authentication providers API](../../api/authproviders).
To set up an authentication provider for Sensu, see the section on [configuring authentication providers](#configuring-authentication-providers).

To view active authentication providers:

{{< highlight shell >}}
sensuctl auth list
{{< /highlight >}}

To view configuration details for an authentication provider named `openldap`:

{{< highlight shell >}}
sensuctl auth info openldap
{{< /highlight >}}

To delete an authentication provider named `openldap`:

{{< highlight shell >}}
sensuctl auth delete openldap
{{< /highlight >}}

## Configuring authentication providers

**1. Write an authentication provider configuration definition**

Write an authentication provider configuration definition.

For standards-compliant Lightweight Directory Access Protocol tools like OpenLDAP, see the [LDAP configuration examples](#ldap-configuration-examples) and [specification](#ldap-specification).
For Microsoft Active Directory, see the [AD configuration examples](#active-directory-configuration-examples) and [specification](#active-directory-authentication).

**2. Apply the configuration using sensuctl**

Log in to sensuctl as the [default admin user][3] and apply the configuration to Sensu.

{{< highlight shell >}}
sensuctl create --file filename.json
{{< /highlight >}}

You can verify that your provider configuration has been applied successfully using sensuctl.

{{< highlight shell >}}
sensuctl auth list

 Type     Name    
────── ────────── 
 ldap   openldap  
{{< /highlight >}}

**3. Integrate with Sensu RBAC**

Now that you've configured an authentication provider, you'll need to configure Sensu RBAC to give those users permissions within Sensu.
Sensu RBAC allows management and access of users and resources based on namespaces, groups, roles, and bindings.
See the [RBAC reference][4] for more information about configuring permissions in Sensu and [implementation examples](../../reference/rbac/#role-and-role-binding-examples).

- **Namespaces** partition resources within Sensu. Sensu entities, checks, handlers, and other [namespaced resources][17] belong to a single namespace.
- **Roles** create sets of permissions (get, delete, etc.) tied to resource types. **Cluster roles** apply permissions across namespaces and include access to [cluster-wide resources][18] like users and namespaces. 
- **Role bindings** assign a role to a set of users and groups within a namespace; **cluster role bindings** assign a cluster role to a set of users and groups cluster-wide.

To enable permissions for external users and groups within Sensu, create a set of [roles][10], [cluster roles][11], [role bindings][12], and [cluster role bindings][13] that map to the usernames and group names found in your authentication providers.
Make sure to include the [group prefix](#groups-prefix) and [username prefix](#username-prefix) when creating Sensu role bindings and cluster role bindings.
Without an assigned role or cluster role, users can sign in to the Sensu dashboard but can't access any Sensu resources.

**4. Log in to Sensu**

Once you've configured the correct roles and bindings, log in to [sensuctl](../../sensuctl/reference#first-time-setup) and the [Sensu dashboard](../../dashboard/overview) using your single-sign-on username and password (no prefix required).


## LDAP authentication

Sensu offers license-activated support for using a standards-compliant Lightweight Directory Access Protocol tool for authentication to the Sensu dashboard, API, and sensuctl.
The Sensu LDAP authentication provider is tested with [OpenLDAP][7].
Active Directory users should head over to the [Active Directory section](#active-directory-authentication).

### LDAP configuration examples

**Example LDAP configuration: Minimum required attributes**

{{< language-toggle >}}

{{< highlight yml >}}
type: ldap
api_version: authentication/v2
metadata:
  name: openldap
spec:
  servers:
  - group_search:
      base_dn: dc=acme,dc=org
    host: 127.0.0.1
    user_search:
      base_dn: dc=acme,dc=org
{{< /highlight >}}

{{< highlight json >}}
{
  "type": "ldap",
  "api_version": "authentication/v2",
  "spec": {
    "servers": [
      {
        "host": "127.0.0.1",
        "group_search": {
          "base_dn": "dc=acme,dc=org"
        },
        "user_search": {
          "base_dn": "dc=acme,dc=org"
        }
      }
    ]
  },
  "metadata": {
    "name": "openldap"
  }
}
{{< /highlight >}}

{{< /language-toggle >}}

**Example LDAP configuration: All attributes**

{{< language-toggle >}}

{{< highlight yml >}}
type: ldap
api_version: authentication/v2
metadata:
  name: openldap
spec:
  groups_prefix: ldap
  servers:
  - binding:
      password: P@ssw0rd!
      user_dn: cn=binder,dc=acme,dc=org
    client_cert_file: /path/to/ssl/cert.pem
    client_key_file: /path/to/ssl/key.pem
    group_search:
      attribute: member
      base_dn: dc=acme,dc=org
      name_attribute: cn
      object_class: groupOfNames
    host: 127.0.0.1
    insecure: false
    port: 636
    security: tls
    trusted_ca_file: /path/to/trusted-certificate-authorities.pem
    user_search:
      attribute: uid
      base_dn: dc=acme,dc=org
      name_attribute: cn
      object_class: person
  username_prefix: ldap
{{< /highlight >}}

{{< highlight json >}}
{
  "type": "ldap",
  "api_version": "authentication/v2",
  "spec": {
    "servers": [
      {
        "host": "127.0.0.1",
        "port": 636,
        "insecure": false,
        "security": "tls",
        "trusted_ca_file": "/path/to/trusted-certificate-authorities.pem",
        "client_cert_file": "/path/to/ssl/cert.pem",
        "client_key_file": "/path/to/ssl/key.pem",
        "binding": {
          "user_dn": "cn=binder,dc=acme,dc=org",
          "password": "P@ssw0rd!"
        },
        "group_search": {
          "base_dn": "dc=acme,dc=org",
          "attribute": "member",
          "name_attribute": "cn",
          "object_class": "groupOfNames"
        },
        "user_search": {
          "base_dn": "dc=acme,dc=org",
          "attribute": "uid",
          "name_attribute": "cn",
          "object_class": "person"
        }
      }
    ],
    "groups_prefix": "ldap",
    "username_prefix": "ldap"
  },
  "metadata": {
    "name": "openldap"
  }
}
{{< /highlight >}}

{{< /language-toggle >}}

## LDAP specification

### Top-level attributes

type         | 
-------------|------
description  | Top-level attribute specifying the [`sensuctl create`][sc] resource type. LDAP definitions should always be of type `ldap`.
required     | true
type         | String
example      | {{< highlight shell >}}"type": "ldap"{{< /highlight >}}

api_version  | 
-------------|------
description  | Top-level attribute specifying the Sensu API group and version. For LDAP definitions, this attribute should always be `authentication/v2`.
required     | true
type         | String
example      | {{< highlight shell >}}"api_version": "authentication/v2"{{< /highlight >}}

metadata     | 
-------------|------
description  | Top-level map containing the LDAP definition `name`. See the [metadata attributes reference][24] for details.
required     | true
type         | Map of key-value pairs
example      | {{< highlight shell >}}
"metadata": {
  "name": "openldap"
}
{{< /highlight >}}

spec         | 
-------------|------
description  | Top-level map that includes the LDAP [spec attributes][sp].
required     | true
type         | Map of key-value pairs
example      | {{< highlight shell >}}
"spec": {
  "servers": [
    {
      "host": "127.0.0.1",
      "port": 636,
      "insecure": false,
      "security": "tls",
      "trusted_ca_file": "/path/to/trusted-certificate-authorities.pem",
      "client_cert_file": "/path/to/ssl/cert.pem",
      "client_key_file": "/path/to/ssl/key.pem",
      "binding": {
        "user_dn": "cn=binder,dc=acme,dc=org",
        "password": "P@ssw0rd!"
      },
      "group_search": {
        "base_dn": "dc=acme,dc=org",
        "attribute": "member",
        "name_attribute": "cn",
        "object_class": "groupOfNames"
      },
      "user_search": {
        "base_dn": "dc=acme,dc=org",
        "attribute": "uid",
        "name_attribute": "cn",
        "object_class": "person"
      }
    }
  ],
  "groups_prefix": "ldap",
  "username_prefix": "ldap"
}
{{< /highlight >}}

### Spec attributes

| servers    |      |
-------------|------
description  | An array of [LDAP servers](#server-attributes) for your directory. During the authentication process, Sensu attempts to authenticate using each LDAP server in sequence.
required     | true
type         | Array
example      | {{< highlight shell >}}
"servers": [
  {
    "host": "127.0.0.1",
    "port": 636,
    "insecure": false,
    "security": "tls",
    "trusted_ca_file": "/path/to/trusted-certificate-authorities.pem",
    "client_cert_file": "/path/to/ssl/cert.pem",
    "client_key_file": "/path/to/ssl/key.pem",
    "binding": {
      "user_dn": "cn=binder,dc=acme,dc=org",
      "password": "P@ssw0rd!"
    },
    "group_search": {
      "base_dn": "dc=acme,dc=org",
      "attribute": "member",
      "name_attribute": "cn",
      "object_class": "groupOfNames"
    },
    "user_search": {
      "base_dn": "dc=acme,dc=org",
      "attribute": "uid",
      "name_attribute": "cn",
      "object_class": "person"
    }
  }
]
{{< /highlight >}}

<a name="groups-prefix"></a>

| groups_prefix |   |
-------------|------
description  | The prefix added to all LDAP groups. Sensu prepends prefixes with a colon. For example, for the groups prefix `ldap` and the group `dev`, the resulting group name in Sensu is `ldap:dev`. Use this prefix when integrating LDAP groups with Sensu RBAC [role bindings][12] and [cluster role bindings][13].
required     | false
type         | String
example      | {{< highlight shell >}}"groups_prefix": "ldap"{{< /highlight >}}

<a name="username-prefix"></a>

| username_prefix | |
-------------|------
description  | The prefix added to all LDAP usernames.  Sensu prepends prefixes with a colon. For example, for the username prefix `ldap` and the user `alice`, the resulting username in Sensu is `ldap:alice`. Use this prefix when integrating LDAP users with Sensu RBAC [role bindings][12] and [cluster role bindings][13]. Users _do not_ need to provide this prefix when logging in to Sensu.
required     | false
type         | String
example      | {{< highlight shell >}}"username_prefix": "ldap"{{< /highlight >}}

### Server attributes

| host       |      |
-------------|------
description  | LDAP server IP address or [FQDN](https://en.wikipedia.org/wiki/Fully_qualified_domain_name)
required     | true
type         | String
example      | {{< highlight shell >}}"host": "127.0.0.1"{{< /highlight >}}

| port       |      |
-------------|------
description  | LDAP server port
required     | true
type         | Integer
default      | `389` for insecure connections, `636` for TLS connections
example      | {{< highlight shell >}}"port": 636{{< /highlight >}}

| insecure   |      |
-------------|------
description  | Skips SSL certificate verification when set to `true`. _WARNING: Do not use an insecure connection in production environments._
required     | false
type         | Boolean
default      | `false`
example      | {{< highlight shell >}}"insecure": false{{< /highlight >}}

| security   |      |
-------------|------
description  | Determines the encryption type to be used for the connection to the LDAP server: `insecure` (unencrypted connection, not recommended for production), `tls` (secure encrypted connection), or `starttls` (unencrypted connection upgrades to a secure connection).
type         | String
default      | `"tls"`
example      | {{< highlight shell >}}"security": "tls"{{< /highlight >}}

| trusted_ca_file | |
-------------|------
description  | Path to an alternative CA bundle file in PEM format to be used instead of the system's default bundle. This CA bundle is used to verify the server's certificate.
required     | false
type         | String
example      | {{< highlight shell >}}"trusted_ca_file": "/path/to/trusted-certificate-authorities.pem"{{< /highlight >}}

| client_cert_file | |
-------------|------
description  | Path to the certificate that should be sent to the server if it requests it
required     | false
type         | String
example      | {{< highlight shell >}}"client_cert_file": "/path/to/ssl/cert.pem"{{< /highlight >}}

| client_key_file | |
-------------|------
description  | Path to the key file associated with the `client_cert_file`
required     | false
type         | String
example      | {{< highlight shell >}}"client_key_file": "/path/to/ssl/key.pem"{{< /highlight >}}

| binding    |      |
-------------|------
description  | The LDAP account that performs user and group lookups. If your sever supports anonymous binding, you can omit the `user_dn` or `password` attributes to query the directory without credentials.
required     | false
type         | Map
example      | {{< highlight shell >}}
"binding": {
  "user_dn": "cn=binder,dc=acme,dc=org",
  "password": "P@ssw0rd!"
}
{{< /highlight >}}

| group_search |    |
-------------|------
description  | Search configuration for groups. See the [group search attributes][21] for more information.
required     | true
type         | Map
example      | {{< highlight shell >}}
"group_search": {
  "base_dn": "dc=acme,dc=org",
  "attribute": "member",
  "name_attribute": "cn",
  "object_class": "groupOfNames"
}
{{< /highlight >}}

| user_search |     |
-------------|------
description  | Search configuration for users. See the [user search attributes][22] for more information.
required     | true
type         | Map
example      | {{< highlight shell >}}
"user_search": {
  "base_dn": "dc=acme,dc=org",
  "attribute": "uid",
  "name_attribute": "cn",
  "object_class": "person"
}
{{< /highlight >}}

### Binding attributes

| user_dn    |      |
-------------|------
description  | The LDAP account that performs user and group lookups. We recommend using a read-only account. Use the distinguished name (DN) format, such as `cn=binder,cn=users,dc=domain,dc=tld`. If your sever supports anonymous binding, you can omit this attribute to query the directory without credentials.
required     | false
type         | String
example      | {{< highlight shell >}}"user_dn": "cn=binder,dc=acme,dc=org"{{< /highlight >}}

| password   |      |
-------------|------
description  | Password for the `user_dn` account. If your sever supports anonymous binding, you can omit this attribute to query the directory without credentials.
required     | false
type         | String
example      | {{< highlight shell >}}"password": "P@ssw0rd!"{{< /highlight >}}

### Group search attributes

| base_dn    |      |
-------------|------
description  | Tells Sensu which part of the directory tree to search. For example, `dc=acme,dc=org` searches within the `acme.org` directory.
required     | true
type         | String
example      | {{< highlight shell >}}"base_dn": "dc=acme,dc=org"{{< /highlight >}}

| attribute  |      |
-------------|------
description  | Used for comparing result entries. This is combined with other filters as <br> `"(<Attribute>=<value>)"`.
required     | false
type         | String
default      | `"member"`
example      | {{< highlight shell >}}"attribute": "member"{{< /highlight >}}

| name_attribute |  |
-------------|------
description  | Represents the attribute to use as the entry name.
required     | false
type         | String
default      | `"cn"`
example      | {{< highlight shell >}}"name_attribute": "cn"{{< /highlight >}}

| object_class |   |
-------------|------
description  | Identifies the class of objects returned in the search result. This is combined with other filters as `"(objectClass=<ObjectClass>)"`.
required     | false
type         | String
default      | `"groupOfNames"`
example      | {{< highlight shell >}}"object_class": "groupOfNames"{{< /highlight >}}

### User search attributes

| base_dn    |      |
-------------|------
description  | Tells Sensu which part of the directory tree to search. For example, `dc=acme,dc=org` searches within the `acme.org` directory.
required     | true
type         | String
example      | {{< highlight shell >}}"base_dn": "dc=acme,dc=org"{{< /highlight >}}

| attribute  |      |
-------------|------
description  | Used for comparing result entries. This is combined with other filters as <br> `"(<Attribute>=<value>)"`.
required     | false
type         | String
default      | `"uid"`
example      | {{< highlight shell >}}"attribute": "uid"{{< /highlight >}}

| name_attribute |  |
-------------|------
description  | Represents the attribute to use as the entry name.
required     | false
type         | String
default      | `"cn"`
example      | {{< highlight shell >}}"name_attribute": "cn"{{< /highlight >}}

| object_class |   |
-------------|------
description  | Identifies the class of objects returned in the search result. This is combined with other filters as `"(objectClass=<ObjectClass>)"`.
required     | false
type         | String
default      | `"person"`
example      | {{< highlight shell >}}"object_class": "person"{{< /highlight >}}

### Metadata attributes

| name       |      |
-------------|------
description  | A unique string used to identify the LDAP configuration. Names cannot contain special characters or spaces (validated with Go regex [`\A[\w\.\-]+\z`](https://regex101.com/r/zo9mQU/2)).
required     | true
type         | String
example      | {{< highlight shell >}}"name": "openldap"{{< /highlight >}}

## LDAP troubleshooting

In order to troubleshoot any issue with LDAP authentication, the first step
should always be to [increase log verbosity][19] of sensu-backend to the debug
log level. Most authentication and authorization errors are only displayed on
the debug log level, in order to avoid flooding the log files.

_NOTE: If you can't locate any log entries referencing LDAP authentication, make
sure the LDAP provider was successfully installed using [sensuctl][20]_

### Authentication errors

Here are some common error messages and possible solutions:

**Error message**: `failed to connect: LDAP Result Code 200 "Network Error"`

The LDAP provider couldn't establish a TCP connection to the LDAP server. Verify
the `host` & `port` attributes. If you are not using LDAP over TLS/SSL , make
sure to set the value of the `security` attribute to `"insecure"` for plaintext
communication.

 **Error message**: `certificate signed by unknown authority`

If you are using a self-signed certificate, make sure to set the `insecure`
attribute to `true`. This will bypass verification of the certificate's signing
authority.

**Error message**: `failed to bind: ...`

The first step for authenticating a user with the LDAP provider is to bind to
the LDAP server using the service account specified in the [`binding`
object](#binding-attributes). Make sure the `user_dn` specifies a valid **DN**,
and its password is the right one.

**Error message**: `user <username> was not found`

The user search failed, no user account could be found with the given username.
Go look at the [`user_search` object][22] and make sure that:

- The specified `base_dn` contains the requested user entry DN
- The specified `attribute` contains the _username_ as its value in the user entry
- The `object_class` attribute corresponds to the user entry object class

**Error message**: `ldap search for user <username> returned x results, expected only 1`

The user search returned more than one user entry, therefore the provider could
not determine which of these entries should be used. The [`user_search`
object][22] needs to be tweaked so the provided *username* can be used to
uniquely identify a user entry. Here's few possible way of doing it:

- Adjust the `attribute` so its value (which corresponds to the *username*) is
  unique amongst the user entries
- Adjust the `base_dn` so it only includes one of the user entries

**Error message**: `ldap entry <DN> missing required attribute <name_attribute>`

The user entry returned (identified by `<DN>`) doesn't include the attribute
specified by [`name_attribute` object][22]. Therefore the LDAP provider could
not determine which attribute to use as the username in the user entry. The
`name_attribute` should be adjusted so it specifies a human friendly name for
the user. 

**Error message**: `ldap group entry <DN> missing <name_attribute> and cn attributes`

The group search returned a group entry (identified by `<DN>`) that doesn't have
the [`name_attribute` attribute][21] nor a `cn` attribute. Therefore the LDAP
provider could not determine which attribute to use as the group name in the
group entry. The `name_attribute` should be adjusted so it specifies a human
friendly name for the group.

### Authorization issues

Once authenticated, a user needs to be granted permissions via either a
`ClusterRoleBinding` or a `RoleBinding`.

The way in which LDAP users and LDAP groups can be referred as subjects of a
cluster role or role binding depends on the `groups_prefix` and
`username_prefix` configuration attributes values of the [LDAP provider][sp].
For example, for the groups prefix `ldap` and the group `dev`, the resulting
group name in Sensu is `ldap:dev`.

**Issue**: Permissions are not granted via the LDAP group(s)

During authentication, the LDAP provider will print in the logs all groups found
in LDAP, e.g. `found 1 group(s): [dev]`. Keep in mind that this group name does
not contain the `groups_prefix` at this point.

The Sensu backend logs each attempt made to authorize an RBAC request. This is
useful for determining why a specific binding didn't grant the request. For
example:

```
[...] the user is not a subject of the ClusterRoleBinding cluster-admin [...]
[...] could not authorize the request with the ClusterRoleBinding system:user [...]
[...] could not authorize the request with any ClusterRoleBindings [...]
```

## Active Directory authentication

Sensu offers license-activated support for using Microsoft Active Directory (AD) for authentication to the Sensu dashboard, API, and sensuctl. The AD authentication provider is based on the [LDAP authentication provider](#ldap-authentication).

### Active Directory configuration examples

**Example AD configuration: Minimum required attributes**

{{< language-toggle >}}

{{< highlight yml >}}
type: ad
api_version: authentication/v2
metadata:
  name: activedirectory
spec:
  servers:
  - group_search:
      base_dn: dc=acme,dc=org
    host: 127.0.0.1
    user_search:
      base_dn: dc=acme,dc=org
{{< /highlight >}}

{{< highlight json >}}
{
  "type": "ad",
  "api_version": "authentication/v2",
  "spec": {
    "servers": [
      {
        "host": "127.0.0.1",
        "group_search": {
          "base_dn": "dc=acme,dc=org"
        },
        "user_search": {
          "base_dn": "dc=acme,dc=org"
        }
      }
    ]
  },
  "metadata": {
    "name": "activedirectory"
  }
}
{{< /highlight >}}

{{< /language-toggle >}}

**Example AD configuration: All attributes**

{{< language-toggle >}}

{{< highlight yml >}}
type: ad
api_version: authentication/v2
metadata:
  name: activedirectory
spec:
  groups_prefix: ad
  servers:
  - binding:
      password: P@ssw0rd!
      user_dn: cn=binder,cn=users,dc=acme,dc=org
    client_cert_file: /path/to/ssl/cert.pem
    client_key_file: /path/to/ssl/key.pem
    default_upn_domain: example.org
    include_nested_groups: true
    group_search:
      attribute: member
      base_dn: dc=acme,dc=org
      name_attribute: cn
      object_class: group
    host: 127.0.0.1
    insecure: false
    port: 636
    security: tls
    trusted_ca_file: /path/to/trusted-certificate-authorities.pem
    user_search:
      attribute: sAMAccountName
      base_dn: dc=acme,dc=org
      name_attribute: displayName
      object_class: person
  username_prefix: ad
{{< /highlight >}}

{{< highlight json >}}
{
  "type": "ad",
  "api_version": "authentication/v2",
  "spec": {
    "servers": [
      {
        "host": "127.0.0.1",
        "port": 636,
        "insecure": false,
        "security": "tls",
        "trusted_ca_file": "/path/to/trusted-certificate-authorities.pem",
        "client_cert_file": "/path/to/ssl/cert.pem",
        "client_key_file": "/path/to/ssl/key.pem",
        "default_upn_domain": "example.org",
        "include_nested_groups": true,
        "binding": {
          "user_dn": "cn=binder,cn=users,dc=acme,dc=org",
          "password": "P@ssw0rd!"
        },
        "group_search": {
          "base_dn": "dc=acme,dc=org",
          "attribute": "member",
          "name_attribute": "cn",
          "object_class": "group"
        },
        "user_search": {
          "base_dn": "dc=acme,dc=org",
          "attribute": "sAMAccountName",
          "name_attribute": "displayName",
          "object_class": "person"
        }
      }
    ],
    "groups_prefix": "ad",
    "username_prefix": "ad"
  },
  "metadata": {
    "name": "activedirectory"
  }
}
{{< /highlight >}}

{{< /language-toggle >}}

## Active Directory specification

### Top-level attributes

type         | 
-------------|------
description  | Top-level attribute specifying the [`sensuctl create`][sc] resource type. AD definitions should always be of type `ad`.
required     | true
type         | String
example      | {{< highlight shell >}}"type": "ad"{{< /highlight >}}

api_version  | 
-------------|------
description  | Top-level attribute specifying the Sensu API group and version. For AD definitions, this attribute should always be `authentication/v2`.
required     | true
type         | String
example      | {{< highlight shell >}}"api_version": "authentication/v2"{{< /highlight >}}

metadata     | 
-------------|------
description  | Top-level map containing the AD definition `name`. See the [metadata attributes reference][23] for details.
required     | true
type         | Map of key-value pairs
example      | {{< highlight shell >}}
"metadata": {
  "name": "activedirectory"
}
{{< /highlight >}}

spec         | 
-------------|------
description  | Top-level map that includes the AD [spec attributes](#active-directory-spec-attributes).
required     | true
type         | Map of key-value pairs
example      | {{< highlight shell >}}
"spec": {
  "servers": [
    {
      "host": "127.0.0.1",
      "port": 636,
      "insecure": false,
      "security": "tls",
      "trusted_ca_file": "/path/to/trusted-certificate-authorities.pem",
      "client_cert_file": "/path/to/ssl/cert.pem",
      "client_key_file": "/path/to/ssl/key.pem",
      "default_upn_domain": "example.org",
      "include_nested_groups": true,
      "binding": {
        "user_dn": "cn=binder,cn=users,dc=acme,dc=org",
        "password": "P@ssw0rd!"
      },
      "group_search": {
        "base_dn": "dc=acme,dc=org",
        "attribute": "member",
        "name_attribute": "cn",
        "object_class": "group"
      },
      "user_search": {
        "base_dn": "dc=acme,dc=org",
        "attribute": "sAMAccountName",
        "name_attribute": "displayName",
        "object_class": "person"
      }
    }
  ],
  "groups_prefix": "ad",
  "username_prefix": "ad"
}
{{< /highlight >}}

### Active Directory spec attributes

| servers    |      |
-------------|------
description  | An array of [AD servers](#active-directory-server-attributes) for your directory. During the authentication process, Sensu attempts to authenticate using each AD server in sequence.
required     | true
type         | Array
example      | {{< highlight shell >}}
"servers": [
  {
    "host": "127.0.0.1",
    "port": 636,
    "insecure": false,
    "security": "tls",
    "trusted_ca_file": "/path/to/trusted-certificate-authorities.pem",
    "client_cert_file": "/path/to/ssl/cert.pem",
    "client_key_file": "/path/to/ssl/key.pem",
    "default_upn_domain": "example.org",
    "include_nested_groups": true,
    "binding": {
      "user_dn": "cn=binder,cn=users,dc=acme,dc=org",
      "password": "P@ssw0rd!"
    },
    "group_search": {
      "base_dn": "dc=acme,dc=org",
      "attribute": "member",
      "name_attribute": "cn",
      "object_class": "group"
    },
    "user_search": {
      "base_dn": "dc=acme,dc=org",
      "attribute": "sAMAccountName",
      "name_attribute": "displayName",
      "object_class": "person"
    }
  }
]
{{< /highlight >}}

<a name="ad-groups-prefix"></a>

| groups_prefix |   |
-------------|------
description  | The prefix added to all AD groups. Sensu prepends prefixes with a colon. For example, for the groups prefix `ad` and the group `dev`, the resulting group name in Sensu is `ad:dev`. Use this prefix when integrating AD groups with Sensu RBAC [role bindings][12] and [cluster role bindings][13].
required     | false
type         | String
example      | {{< highlight shell >}}"groups_prefix": "ad"{{< /highlight >}}

<a name="ad-username-prefix"></a>

| username_prefix | |
-------------|------
description  | The prefix added to all AD usernames.  Sensu prepends prefixes with a colon. For example, for the username prefix `ad` and the user `alice`, the resulting username in Sensu is `ad:alice`. Use this prefix when integrating AD users with Sensu RBAC [role bindings][12] and [cluster role bindings][13]. Users _do not_ need to provide this prefix when logging in to Sensu.
required     | false
type         | String
example      | {{< highlight shell >}}"username_prefix": "ad"{{< /highlight >}}

### Active Directory server attributes

| host       |      |
-------------|------
description  | AD server IP address or [FQDN](https://en.wikipedia.org/wiki/Fully_qualified_domain_name)
required     | true
type         | String
example      | {{< highlight shell >}}"host": "127.0.0.1"{{< /highlight >}}

| port       |      |
-------------|------
description  | AD server port
required     | true
type         | Integer
default      | `389` for insecure connections, `636` for TLS connections
example      | {{< highlight shell >}}"port": 636{{< /highlight >}}

| insecure   |      |
-------------|------
description  | Skips SSL certificate verification when set to `true`. _WARNING: Do not use an insecure connection in production environments._
required     | false
type         | Boolean
default      | `false`
example      | {{< highlight shell >}}"insecure": false{{< /highlight >}}

| security   |      |
-------------|------
description  | Determines the encryption type to be used for the connection to the AD server: `insecure` (unencrypted connection, not recommended for production), `tls` (secure encrypted connection), or `starttls` (unencrypted connection upgrades to a secure connection).
type         | String
default      | `"tls"`
example      | {{< highlight shell >}}"security": "tls"{{< /highlight >}}

| trusted_ca_file | |
-------------|------
description  | Path to an alternative CA bundle file in PEM format to be used instead of the system's default bundle. This CA bundle is used to verify the server's certificate.
required     | false
type         | String
example      | {{< highlight shell >}}"trusted_ca_file": "/path/to/trusted-certificate-authorities.pem"{{< /highlight >}}

| client_cert_file | |
-------------|------
description  | Path to the certificate that should be sent to the server if it requests it
required     | false
type         | String
example      | {{< highlight shell >}}"client_cert_file": "/path/to/ssl/cert.pem"{{< /highlight >}}

| client_key_file | |
-------------|------
description  | Path to the key file associated with the `client_cert_file`
required     | false
type         | String
example      | {{< highlight shell >}}"client_key_file": "/path/to/ssl/key.pem"{{< /highlight >}}

| binding    |      |
-------------|------
description  | The AD account that performs user and group lookups. If your sever supports anonymous binding, you can omit the `user_dn` or `password` attributes to query the directory without credentials. To use anonymous binding with AD, the `ANONYMOUS LOGON` object requires read permissions for users and groups.
required     | false
type         | Map
example      | {{< highlight shell >}}
"binding": {
  "user_dn": "cn=binder,cn=users,dc=acme,dc=org",
  "password": "P@ssw0rd!"
}
{{< /highlight >}}

| group_search |    |
-------------|------
description  | Search configuration for groups. See the [group search attributes](#active-directory-group-search-attributes) for more information.
required     | true
type         | Map
example      | {{< highlight shell >}}
"group_search": {
  "base_dn": "dc=acme,dc=org",
  "attribute": "member",
  "name_attribute": "cn",
  "object_class": "group"
}
{{< /highlight >}}

| user_search |     |
-------------|------
description  | Search configuration for users. See the [user search attributes](#active-directory-user-search-attributes) for more information.
required     | true
type         | Map
example      | {{< highlight shell >}}
"user_search": {
  "base_dn": "dc=acme,dc=org",
  "attribute": "sAMAccountName",
  "name_attribute": "displayName",
  "object_class": "person"
}
{{< /highlight >}}

| default_upn_domain |     |
-------------|------
description  | Enables UPN authentication when set. The default UPN suffix that will be appended to the username when a domain is not specified during login (for example: `user` becomes `user@defaultdomain.xyz`). _WARNING: When using UPN authentication, users must re-authenticate to apply any changes made to group membership on the Active Directory server since their last authentication. To ensure group membership updates are reflected without re-authentication, specify a binding account or enable anonymous binding._
required     | false
type         | String
example      | {{< highlight shell >}}
"default_upn_domain": "example.org"
{{< /highlight >}}

| include_nested_groups |     |
-------------|------
description  | When set to `true`,  group search includes any nested groups instead of just the top level groups that a user is a member of.
required     | false
type         | Boolean
example      | {{< highlight shell >}}
"include_nested_groups": true
{{< /highlight >}}

### Active Directory binding attributes

| user_dn    |      |
-------------|------
description  | The AD account that performs user and group lookups. We recommend using a read-only account. Use the distinguished name (DN) format, such as `cn=binder,cn=users,dc=domain,dc=tld`. If your sever supports anonymous binding, you can omit this attribute to query the directory without credentials.
required     | false
type         | String
example      | {{< highlight shell >}}"user_dn": "cn=binder,cn=users,dc=acme,dc=org"{{< /highlight >}}

| password   |      |
-------------|------
description  | Password for the `user_dn` account. If your sever supports anonymous binding, you can omit this attribute to query the directory without credentials.
required     | false
type         | String
example      | {{< highlight shell >}}"password": "P@ssw0rd!"{{< /highlight >}}

### Active Directory group search attributes

| base_dn    |      |
-------------|------
description  | Tells Sensu which part of the directory tree to search. For example, `dc=acme,dc=org` searches within the `acme.org` directory.
required     | true
type         | String
example      | {{< highlight shell >}}"base_dn": "dc=acme,dc=org"{{< /highlight >}}

| attribute  |      |
-------------|------
description  | Used for comparing result entries. This is combined with other filters as <br> `"(<Attribute>=<value>)"`.
required     | false
type         | String
default      | `"member"`
example      | {{< highlight shell >}}"attribute": "member"{{< /highlight >}}

| name_attribute |  |
-------------|------
description  | Represents the attribute to use as the entry name.
required     | false
type         | String
default      | `"cn"`
example      | {{< highlight shell >}}"name_attribute": "cn"{{< /highlight >}}

| object_class |   |
-------------|------
description  | Identifies the class of objects returned in the search result. This is combined with other filters as `"(objectClass=<ObjectClass>)"`.
required     | false
type         | String
default      | `"group"`
example      | {{< highlight shell >}}"object_class": "group"{{< /highlight >}}

### Active Directory user search attributes

| base_dn    |      |
-------------|------
description  | Tells Sensu which part of the directory tree to search. For example, `dc=acme,dc=org` searches within the `acme.org` directory.
required     | true
type         | String
example      | {{< highlight shell >}}"base_dn": "dc=acme,dc=org"{{< /highlight >}}

| attribute  |      |
-------------|------
description  | Used for comparing result entries. This is combined with other filters as <br> `"(<Attribute>=<value>)"`.
required     | false
type         | String
default      | `"sAMAccountName"`
example      | {{< highlight shell >}}"attribute": "sAMAccountName"{{< /highlight >}}

| name_attribute |  |
-------------|------
description  | Represents the attribute to use as the entry name.
required     | false
type         | String
default      | `"displayName"`
example      | {{< highlight shell >}}"name_attribute": "displayName"{{< /highlight >}}

| object_class |   |
-------------|------
description  | Identifies the class of objects returned in the search result. This is combined with other filters as `"(objectClass=<ObjectClass>)"`.
required     | false
type         | String
default      | `"person"`
example      | {{< highlight shell >}}"object_class": "person"{{< /highlight >}}

### Active Directory metadata attributes

| name       |      |
-------------|------
description  | A unique string used to identify the AD configuration. Names cannot contain special characters or spaces (validated with Go regex [`\A[\w\.\-]+\z`](https://regex101.com/r/zo9mQU/2)).
required     | true
type         | String
example      | {{< highlight shell >}}"name": "activedirectory"{{< /highlight >}}

## Active Directory troubleshooting

See the [LDAP troubleshooting](#ldap-troubleshooting) section.

## OIDC authentication

The Sensu offers license-activated support for OIDC driver for using the OpenID Connect 1.0 protocol (OIDC) on top of the OAuth 2.0 protocol for RBAC authentication.

### OIDC configuration examples


{{< language-toggle >}}

{{< highlight yml >}}
---
type: oidc
api_version: authentication/v2
spec:
  additional_scopes:
  - groups
  - email
  clientId: a8e43af034e7f2608780
  clientSecret: b63968394be6ed2edb61c93847ee792f31bf6216
  redirectURL: http://127.0.0.1:8080/api/enterprise/authenication/v2/oidc/callback
  server: https://localhost:9031
  groups_claim: groups
  groups_prefix: 'oidc:'
  username_claim: email
  username_prefix: 'oidc:'
{{< /highlight >}}

{{< highlight json >}}
{
   "type": "oidc",
   "api_version": "authentication/v2",
   "spec": {
      "additional_scopes": [
         "groups",
         "email"
      ],
      "clientId": "a8e43af034e7f2608780",
      "clientSecret": "b63968394be6ed2edb61c93847ee792f31bf6216",
      "redirectURL": "http://127.0.0.1:8080/api/enterprise/authenication/v2/oidc/callback",
      "server": "https://localhost:9031",
      "groups_claim": "groups",
      "groups_prefix": "oidc:",
      "username_claim": "email",
      "username_prefix": "oidc:"
   }
}
{{< /highlight >}}

{{< /language-toggle >}}

### RBAC for OIDC definition specification

#### `oidc` attributes

| client_id    |      |
-------------|------
description  | The OIDC provider application "Client ID" _NOTE: requires [registration of an application in the OIDC provider][27]._
required     | true
type         | String
example      | {{< highlight shell >}}"client_id": "1c9ae3e6f3cc79c9f1786fcb22692d1f"{{< /highlight >}}

| client_secret  |      |
-------------|------
description  | The OIDC provider application "Client Secret" _NOTE: requires [registration of an application in the OIDC provider][27]._
required     | true
type         | String
example      | {{< highlight shell >}}"client_secret": "a0f2a3c1dcd5b1cac71bf0c03f2ff1bd"{{< /highlight >}}

| server |  |
-------------|------
description  | The location of the OIDC server you wish to authenticate against. _NOTE: Configuring with http will cause the connection to  be insecure._
required     | true
type         | String
example      | {{< highlight shell >}}"name_attribute": "https://sensu.oidc.provider.example.com"{{< /highlight >}}

| redirect_uri |   |
-------------|------
description  | Redirect URL to provide to the OIDC provider. Requires `/api/enterprise/authenication/v2/oidc/callback` _NOTE: only required for certain OIDC providers, such as Okta._
required     | false
type         | String
example      | {{< highlight shell >}}"redirectURL": "http://localhost:8080/api/enterprise/authenication/v2/oidc/callback"{{< /highlight >}}

| groups_claim |   |
-------------|------
description  | The claim to use to form the associated RBAC groups. 
required     | false
type         | String
example      | {{< highlight shell >}} "groups_claim": "opsgroup" {{< /highlight >}}

| groups_prefix |   |
-------------|------
description  | A prefix to use to form the final RBAC groups if required.
required     | false
type         | String
example      | {{< highlight shell >}}"groups_prefix": "okta"{{< /highlight >}}

| username_claim |   |
-------------|------
description  | The claim to use to form the final RBAC user name.
required     | false
type         | String
example      | {{< highlight shell >}}"username_claim": "person"{{< /highlight >}}

| username_prefix |   |
-------------|------
description  | A prefix to use to form the final RBAC user name.
required     | false
type         | String
example      | {{< highlight shell >}}"username_prefix": "okta"{{< /highlight >}}

| additional_scopes |   |
-------------|------
description  | Scopes to include in the claims, in addition to the default `email`, `openid` and `profile` scopes. _NOTE: only required for certain OIDC providers, such as Okta._
required     | false
type         | Array
example      | {{< highlight shell >}}"additional_scopes": ["groups", "email", "username"]{{< /highlight >}}

## Register an OIDC Application

To use OIDC for authentication requires registration of your Sensu Enterprise
Dashboard as an "application". Please note the following instructions to
register an OIDC application for Sensu Enterprise based on your OIDC provider:

- [Okta](#okta)
- [PingFederate](#pingfederate)

### Okta

#### Requirements

- Access to the Okta Administrator Dashboard
- Sensu Enterprise Dashboard 2.9.0 or later

#### Create an Okta Application

1. From the Administrator Dashboard, select `Applications > Add Application > Create New App` to start the wizard.
2. Select the `Web` platform and `OpenID Connect` sign in method.
3. In General Settings enter an app name and (optionally) upload a logo.
4. In Configure OpenID Connect, add the following Redirect URI, without forgetting to replace DASHBOARD_URL with the URL to your dashboard: `{DASHBOARD_URL}/login/callback`
5. Click Save.
6. Head over to the Sign On page and click on the Edit button of the OpenID Connect ID Token section.
7. Enter the following information for the Groups claim attribute
  - First field: `groups`
  - Dropdown menu: `Regex`
  - Second field: `.*`
8. Click Save
9. Make sure to assign people and/or groups in the Assignments page

#### OIDC Driver Configuration

1. Add the `additionalScopes` configuration attribute in the [OIDC scope][26] and set the value to `[ "groups" ]`, just like this:

   >  `"additionalScopes": [ "groups" ]`
2. Add the `redirectURL` configuration attribute in the [OIDC scope][26] and set
  the value to the Redirect URI configured at step 4 of
  [Create an Okta Application](#create-an-okta-application), just like this:
  
  > `"redirectURL": "{DASHBOARD_URL}/login/callback"`

### PingFederate

#### Requirements

- PingFederate Server 8. This documentation was created using the version
8.3.0.1
- Access to the PingFederate administrative console
- A configured identity data store. This documentation was created using Active
Directory

#### Enable the OAuth 2.0 Authorization Server

OpenID Connect is an authentication layer on top of OAuth 2.0, which requires
the OAuth 2.0 authorization server to be enabled in PingFederate:

1. From the PingFederate administrative console, click on `Server Configuration` and within the `SYSTEM SETTINGS` section, click on `Server Settings`.
2. On the Server Settings page, click on `Roles & Protocols`.
3. Check the following items:
  - `ENABLE OAUTH 2.0 AUTHORIZATION SERVER (AS) ROLE`
  - `OPENID CONNECT`
  - `ENABLE IDENTITY PROVIDER (IDP) ROLE AND SUPPORT THE FOLLOWING:`
  - `SAML 2.0`
4. Click `Save`.

![](/images/enterprise-dashboard-oidc-pingfederate-1.png)

#### Create a Credential Validator

In order to verify the username and password, a Credential Validator must be
configured. These steps assume that Active Directory is used:

1. From the PingFederate administrative console, click on `Server Configuration` and within the `AUTHENTICATION` section, click on `Password Credential Validators`.
2. On the Manage Credential Validator Instances page, click on `Create New Instance`.
3. In the Type section, enter the following information:
  - Set **INSTANCE NAME** to `Active Directory Credential Validator`
  - Set **INSTANCE ID** to `ActiveDirectoryCV`
  - Set **TYPE** to `LDAP Username Password Credential Validator`
  - Click the `Next` button
4. In the Instance Configuration section, enter the following information:
  - Set **LDAP DATASTORE** to your configured LDAP data store
  - Set **SEARCH BASE** according to your directory, e.g. `cn=users,dc=domain,dc=tld`
  - Set **SEARCH FILTER** to:
    
    >(&(sAMAccountName=${username})(sAMAccountType=805306368)(!(userAccountControl:1.2.840.113556.1.4.803:=2)))
5. Click `Next`.
6. Click the `Next` button on the Extended Contract section.
7. Review your configuation and click the `Done` button.
8. Click `Save`.

![](/images/enterprise-dashboard-oidc-pingfederate-2.png)

#### Configure the PingFederate Authorization Server

1. From the PingFederate administrative console, click on `OAuth Settings` and within the `AUTHORIZATION SERVER` section, click on `Authorization Server Settings`.
2. Scroll down to the bottom of the page in order to find the OAuth Administrative Web Services Settings section.
3. Set **PASSWORD CREDENTIAL VALIDATOR** to `Active Directory Credential Validator`.
4. Click `Save`.

#### Configure the Scope Management

1. From the PingFederate administrative console, click on `OAuth Settings` and within the `AUTHORIZATION SERVER` section, click on `Scope Management`.
2. On the Scope Management page, enter a message in **Default Scope description** that will be presented to the user once they login, such as:
    
    > Allow access to your email address and profile information, such as your name.
3. On the same page, add the following scope values and descriptions:

    Scope Value &emsp;&emsp;&nbsp;&nbsp;&nbsp; Scope Description | 
    ------------|------------------
    `email`     | `Allow access to email address`
    `openid`    | `OpenID Connect login`
    `profile`   | `Allow access to profile information` 

4. Click `Save`.

![](/images/enterprise-dashboard-oidc-pingfederate-3.png)

#### Create the application

1. From the PingFederate administrative console, click on `OAuth Settings` and within the `CLIENTS` section, click on `Create New`.
2. On the Client page, enter the following information:
  - Set **CLIENT ID** to `SensuEnterpriseClient`
  - Check the `CLIENT SECRET` radio button
  - Click `Generate Secret` and copy the secret returned; you will need it in your Sensu Enterprise Dashboard configuration
  - Set **NAME** to `Sensu Enterprise Client`
  - Add the following **REDIRECT URI** and click `Add`: `{DASHBOARD_URL}/login/callback` _NOTE: this URL does not need to be publicly accessible - as long as a user has network access to **both** PingFederate **and** the callback URL, s/he will be able to authenticate; for example, this will allow users to authenticate to a Sensu Enterprise Dashboard service running on a private network as long as the user has access to the network (e.g. locally or via VPN)._
  - Set **ALLOWED GRANT TYPES** to `Authorization Code` and `Refresh Token`
  - Set **PERSISTENT GRANTS EXPIRATION** to `Grants Do Not Expire`
  - Set **Refresh Token Rolling Policy** to `Don't Roll`
  - Set **ID Token Signing Algorithm** to `RSA using SHA-256`
  - Check **Grant Access to Session Revocation API**
3. Click `Save`.

#### Create an Access Token Management Instance

1. From the PingFederate administrative console, click on `OAuth Settings` and within the `TOKEN & ATTRIBUTE MAPPING` section, click on `Access Token Management`.
2. On the Access Token Management page, click on `Create New Instance`.
3. In the Type section, enter the following information:
  - Set **INSTANCE NAME** to `Sensu Enterprise Client`
  - Set **INSTANCE ID** to `SensuEnterpriseClient`
  - Set **TYPE** to `Internally Managed Reference Tokens`
  - Click `Next`
4. In the Instance Configuration section, leave the default values unless you need to tweak them and click `Next`.
5. In the Session Validation section, click `Next`.
6. In the Access Token Attribute Contract section, enter `sub` into the input box and click `Add` then `Next`.
7. In the Resource URIs section, click `Next`.
8. In the Access Control section, check **RESTRICT ALLOWED CLIENTS** and select `SensuEnterpriseClient` from the dropdown, click `Add` and click `Next`.
9. Review your configuration and click the `Save` button.

#### Create an Identity Provider (IdP) Adapter Instance

1. From the PingFederate administrative console, click on `IdP Configuration`
and within the `APPLICATION INTEGRATION` section, click on `Adapters`.
2. On the Manage IdP Adapter Instances page, click on `Create New Instance`.
3. On the Create Adapter Instance page, enter the following information:
  - Set **INSTANCE NAME** to `Sensu Enterprise HTML Form`
  - Set **INSTANCE ID** to `SensuEnterpriseHTMLForm`
  - Set **TYPE** to `HTML Form IdP Adapter`
  - Click `Next`
4. In the IdP Adapter section, click on **Add a new row to 'Credential Validators'**, select `Active Directory Credential Validator` from the dropdown, then click `Update` and finally click 'Next' at the bottom of the page.
5. In the Extended Contract section, click `Next`.
6. In the Adapter Attributes section, check the `Pseudonym` checkbox next to the **username** attribute and click `Next`.
7. In the Adapter Contract Mapping section, click `Next`.
8. Review your configuration and click the `Done` button.
9. On the Manage IdP Adapter Instances page, click `Save`.

#### Create the IdP Adapter Mapping

1. From the PingFederate administrative console, click on `OAuth Settings` and within the `TOKEN & ATTRIBUTE MAPPING` section, click on `IdP Adapter Mapping`.
2. On the IdP Adapter Mappings page, select `Sensu Enterprise HTML Form` from the dropdown and click `Add Mapping`, then `Next`.
3. In the Attribute Sources & User Lookup section, click `Next`.
4. In the Contract Fulfillment section, set the **Source** to `Adapter` and **Value** to `username` for both `USER_KEY` and `USER_NAME` contracts, then click `Next`.
6. In the Issuance Criteria section, click `Next`.
7. Review your configuration and click the `Save` button.

#### Create the Access Token Mapping

1. From the PingFederate administrative console, click on `OAuth Settings` and within the `TOKEN & ATTRIBUTE MAPPING` section, click on `Access Token Mapping`.
2. On the Access Token Attribute Mapping page, select `IdP Adapter: Sensu Enterprise HTML Form` from the first dropdown and `Sensu Enterprise Client` from the second dropdown, click `Add Mapping` and then `Next`.
3. In the Attribute Sources & User Lookup section, click `Next`.
4. In the Contract Fulfillment section, select `Persistent Grant` in the **Source** dropdown and `USER_KEY` in the **Value** dropdown, then click `Next`.
5. In the Issuance Criteria section, click `Next`.
6. Review your configuration and click the `Save` button.

#### Add an OpenID Connect Policy

1. From the PingFederate administrative console, click on `OAuth Settings` and within the `TOKEN & ATTRIBUTE MAPPING` section, click on `OpenID Connect Policy Management`.
2. On the Policy Management page, click on `Add Policy`.
3. On the Manage Policy section, enter the following information:
  - Set **POLICY ID** to `SensuEnterpriseOIDCPolicy`
  - Set **POLICY NAME** to `Sensu Enterprise OpenID Connect Policy`
  - Select `Sensu Enterprise Client` from the **ACCESS TOKEN MANAGER** dropdown
  - Check the **INCLUDE SESSION IDENTIFIER IN ID TOKEN** checkbox
  - Check the **INCLUDE USER INFO IN ID TOKEN** checkbox
  - Click `Next`
4. In the Attribute Contract section, delete all attributes **except** `email` and `name`.
5. On the same page, enter `memberOf` in the input and click `Add` and then click `Next`
6. In the Attribute Sources & User Lookup section, click on `Add Attribute Source`.
7. In the Data Store section, enter the following information:
  - Set **ATTRIBUTE SOURCE ID** to `ActiveDirectory`
  - Set **ATTRIBUTE SOURCE DESCRIPTION** to `Active Directory`
  - Select your LDAP data store from the **ACTIVE DATA STORE**
  - Click `Next`
8. In the LDAP Directory Search section, enter the following information:
  - Set **BASE DN** to the base DN of your LDAP server
  - Leave **Search Scope** to `Subtree`
9. In the **ROOT OBJECT CLASS** dropdown, select `<Show All Attributes>`. In the **ATTRIBUTE** dropdown, select `displayName` and click `Add Attribute`.
10. Repeat this last step for the following attributes:
  - `mail`
  - `memberOf` (check Nested Groups or not depending on your needs)
  - `userPrincipalName`
    ![](/images/enterprise-dashboard-oidc-pingfederate-4.png)
11. Click `Next`.
12. In the LDAP Filter section, enter the following information in the **FILTER** textarea:

    > (&(sAMAccountName=${sub})(sAMAccountType=805306368)(!(userAccountControl:1.2.840.113556.1.4.803:=2)))
13. Click `Next`.
14. Review your configuration and click the `Done` button.
15. Back on the Attribute Sources & User Lookup section, click `Next`.
16. On the Contract Fulfillment section, enter the following information:

    Attribute Contract &emsp; Source &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&nbsp;&nbsp; Value|| 
    ---------|------------------------------|----------------------
    email    | &emsp;&emsp;LDAP (Active Directory LDAP) | mail
    memberOf | &emsp;&emsp;LDAP (Active Directory LDAP) | memberOf
    name     | &emsp;&emsp;LDAP (Active Directory LDAP) | displayName
    sub      | &emsp;&emsp;LDAP (Active Directory LDAP) | userPrincipalName

    ![](/images/enterprise-dashboard-oidc-pingfederate-5.png)

17. Click `Next`.
18. In the Issuance Criteria section, click `Next`.
19. Review your configuration and click the `Done` button.
20. Back on the Policy Management page, click `Save`.

[sc]: ../../sensuctl/reference#creating-resources
[sp]: #spec-attributes
[1]: ../../dashboard/overview
[2]: ../../sensuctl/reference
[3]: ../../reference/rbac#default-user
[4]: ../../reference/rbac
[5]: ../../guides/create-read-only-user
[6]: ../../getting-started/enterprise
[7]: https://www.openldap.org/
[8]: ../../api/overview
[9]: ../../api/auth
[10]: ../../reference/rbac#roles-and-cluster-roles
[11]: ../../reference/rbac#cluster-roles
[12]: ../../reference/rbac#role-bindings-and-cluster-role-bindings
[13]: ../../reference/rbac#cluster-role-bindings
[17]: ../../reference/rbac#namespaced-resource-types
[18]: ../../reference/rbac#cluster-wide-resource-types
[19]: ../../guides/troubleshooting#log-levels
[20]: #managing-authentication-providers
[21]: #group-search-attributes
[22]: #user-search-attributes
[23]: #active-directory-metadata-attributes
[24]: #metadata-attributes
[25]: #
[26]: #oidc-attributes
[27]: #register-an-oidc-application