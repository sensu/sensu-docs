---
title: "Authentication"
description: "In addition to built-in RBAC, Sensu includes enterprise-only support for authentication using a Lightweight Directory Access Protocol (LDAP) provider. Read the guide to configure a provider."
weight: 4
version: "5.2"
product: "Sensu Go"
menu:
  sensu-go-5.2:
    parent: installation
---

- [Managing authentication providers](#managing-authentication-providers) (enterprise-only)
- [LDAP authentication](#ldap-authentication) (enterprise-only)
  - [Configuration](#configuring-ldap-authentication)
  - [Examples](#configuration-examples)
  - [Specification](#ldap-specification)
  - [Troubleshooting](#ldap-troubleshooting)

Sensu requires username and password authentication to access the [Sensu dashboard][1], [API][8], and command line tool ([sensuctl][2]).
For Sensu's [default user credentials][3] and more information about configuring Sensu role based access control, see the [RBAC reference][4] and [guide to creating users][5].

In addition to built-in RBAC, Sensu includes [enterprise-only][6] support for authentication using a Lightweight Directory Access Protocol (LDAP) provider.

## Managing authentication providers

You can view and delete authentication providers using sensuctl.
To set up LDAP authentication for Sensu, see the section on [configuring LDAP authentication](#configuring-ldap-authentication).

**ENTERPRISE ONLY**: Authentication providers in Sensu Go require an enterprise license. To activate your enterprise license, see the [getting started guide][6].

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

## LDAP authentication

Sensu offers enterprise-only support for using a standards-compliant Lightweight Directory Access Protocol tool for authentication to the Sensu dashboard, API, and sensuctl.
The Sensu LDAP authentication provider is tested with [OpenLDAP][7].
Sensu does not yet support Active Directory for LDAP authentication or other authentication providers.

**ENTERPRISE ONLY**: LDAP authentication in Sensu Go requires an enterprise license. To activate your enterprise license, see the [getting started guide][6].

### Configuring LDAP authentication

**1. Write an LDAP configuration definition**

Write an LDAP configuration definition using the [examples](#configuration-examples) and [specification](#ldap-specification) in this guide.

**2. Apply the configuration using sensuctl**

Log in to sensuctl as the [default admin user][3] and apply the configuration to Sensu.

{{< highlight shell >}}
sensuctl create --file filename.json
{{< /highlight >}}

You can verify that your LDAP configuration has been applied successfully using sensuctl.

{{< highlight shell >}}
sensuctl auth list
{{< /highlight >}}

**3. Integrate with Sensu RBAC**

Now that you've configured LDAP authentication, you'll need to configure Sensu RBAC to give those users permissions within Sensu.
Sensu RBAC allows management and access of users and resources based on namespaces, groups, roles, and bindings.

- **Namespaces** partition resources within Sensu. Sensu entities, checks, handlers, and other [namespaced resources][17] belong to a single namespace.
- **Roles** create sets of permissions (get, delete, etc.) tied to resource types. **Cluster roles** apply permissions across namespaces and include access to [cluster-wide resources][18] like users and namespaces. 
- **Role bindings** assign a role to a set of users and groups within a namespace; **cluster role bindings** assign a cluster role to a set of users and groups cluster-wide.

To enable permissions for LDAP users and groups within Sensu, create a set of [roles][10], [cluster roles][11], [role bindings][12], and [cluster role bindings][13] that map to the usernames or group names in your LDAP directory.
Make sure to include the [group prefix](#groups-prefix) and [username prefix](#username-prefix) when creating Sensu role bindings and cluster role bindings.
See the [RBAC reference][4] for a complete guide to creating permissions with Sensu.

For example, the following role and role binding gives a `dev` group access to create Sensu workflows within the `development` namespace.

{{< highlight text >}}
{
  "type": "Role",
  "api_version": "core/v2",
  "metadata": {
    "name": "workflow-creator",
    "namespace": "development"
  },
  "spec": {
    "rules": [
      {
        "resource_names": [],
        "resources": [
          "checks",
          "hooks",
          "filters",
          "events",
          "filters",
          "mutators",
          "handlers"
        ],
        "verbs": [
          "get",
          "list",
          "create",
          "update",
          "delete"
        ]
      }
    ]
  }
}
{
  "type": "RoleBinding",
  "api_version": "core/v2",
  "metadata": {
    "name": "dev-binding",
    "namespace": "development"
  },
  "spec": {
    "role_ref": {
      "name": "workflow-creator",
      "type": "Role"
    },
    "subjects": [
      {
        "name": "dev",
        "type": "Group"
      }
    ]
  }
}
{{< /highlight >}}

Once you've configured the correct roles and bindings, your users can log in to sensuctl and the Sensu dashboard using their single-sign-on username and password (no prefix required).

### Configuration examples

**Example LDAP configuration: Minimum required attributes**

{{< highlight json >}}
{
  "Type": "ldap",
  "api_version": "authentication/v2",
  "spec": {
    "servers": [
      {
        "host": "127.0.0.1",
        "binding": {
          "user_dn": "cn=binder,dc=acme,dc=org",
          "password": "P@ssw0rd!"
        },
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

**Example LDAP configuration: All attributes**

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
description  | Top-level map containing the LDAP definition `name`. See the [metadata attributes reference][8] for details.
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
      "binding": {
        "user_dn": "cn=binder,dc=acme,dc=org",
        "password": "P@ssw0rd!"
      },
      "group_search": {
        "base_dn": "dc=acme,dc=org"
      },
      "user_search": {
        "base_dn": "dc=acme,dc=org"
      }
    }
  ]
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
    "binding": {
      "user_dn": "cn=binder,dc=acme,dc=org",
      "password": "P@ssw0rd!"
    },
    "group_search": {
      "base_dn": "dc=acme,dc=org"
    },
    "user_search": {
      "base_dn": "dc=acme,dc=org"
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

| binding    |      |
-------------|------
description  | The LDAP account that performs user and group lookups.
required     | true
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
description  | The LDAP account that performs user and group lookups. We recommend using a read-only account. Use the distinguished name (DN) format, such as `cn=binder,cn=users,dc=domain,dc=tld`.
required     | true
type         | String
example      | {{< highlight shell >}}"user_dn": "cn=binder,dc=acme,dc=org"{{< /highlight >}}

| password   |      |
-------------|------
description  | Password for the `user_dn` account.
required     | true
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