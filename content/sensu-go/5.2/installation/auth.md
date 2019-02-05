---
title: "Authentication"
description: ""
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

Sensu requires username and password authentication to access the [Sensu dashboard][1], [API][8], and command line tool ([sensuctl][2]).
For Sensu's [default user credentials][3] and more information about configuring Sensu role based access control, see the [RBAC reference][4] and [guide to creating users][5].

In addition to built-in RBAC, [Sensu Enterprise][6] supports authentication using a Lightweight Directory Access Protocol (LDAP) provider.
This guide describes the configuration process for enabling LDAP authentication with Sensu.

## Managing authentication providers

You can view and delete authentication providers using sensuctl.
To set up LDAP authentication for Sensu, see the section on [configuring LDAP authentication](#configuring-ldap-authentication).

**ENTERPRISE ONLY**: Authentication providers in Sensu Go require a Sensu Enterprise license. To activate your Sensu Enterprise license, see the [getting started guide][6].

To view active authentication providers:

{{< highlight shell >}}
sensuctl auth list
{{< /highlight >}}

To view configuration details for an LDAP authentication named `default`:

{{< highlight shell >}}
sensuctl auth info default
{{< /highlight >}}

To delete an LDAP authentication provider named `default`:

{{< highlight shell >}}
sensuctl auth delete default
{{< /highlight >}}

## LDAP authentication

Sensu Enterprise offers support for using a standards-compliant Lightweight Directory Access Protocol tool (like [OpenLDAP][7]) for authentication to the Sensu dashboard, API, and sensuctl.
Sensu does not yet support Active Directory for LDAP authentication or other authentication providers.

**ENTERPRISE ONLY**: LDAP authentication in Sensu Go requires a Sensu Enterprise license. To activate your Sensu Enterprise license, see the [getting started guide][6].

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

Once you've configured the correct roles and bindings, your users can log in to sensuctl and the Sensu dashboard using their single-sign-on username and password (no prefix required).

### Configuration examples

_NOTE: These examples are in `wrapped-json` format for use with [`sensuctl create`][sc]. The [authentication API][9] also use `wrapped-json` format as shown in the [API docs][9]._

**Example LDAP configuration: Minimum required attributes**

{{< highlight json >}}
{
  "Type": "ldap",
  "api_version": "authproviders/v2",
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
  "api_version": "authproviders/v2",
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
required     | Required for LDAP definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][sc].
type         | String
example      | {{< highlight shell >}}"type": "ldap"{{< /highlight >}}

api_version  | 
-------------|------
description  | Top-level attribute specifying the Sensu API group and version. For LDAP definitions, this attribute should always be `authproviders/v2`.
required     | Required for LDAP definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][sc].
type         | String
example      | {{< highlight shell >}}"api_version": "authproviders/v2"{{< /highlight >}}

metadata     | 
-------------|------
description  | Top-level map containing the LDAP definition `name`, usually `ldap`. See the [metadata attributes reference][8] for details.
required     | Required for LDAP definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][sc].
type         | Map of key-value pairs
example      | {{< highlight shell >}}
"metadata": {
  "name": "default"
}
{{< /highlight >}}

spec         | 
-------------|------
description  | Top-level map that includes the LDAP [spec attributes][sp].
required     | Required for LDAP definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][sc].
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

<a name="groups-prefix">

| groups_prefix |   |
-------------|------
description  | The prefix added to all LDAP groups. Use this prefix when integrating LDAP groups with Sensu RBAC [role bindings][12] and [cluster role bindings][13].
required     | false
type         | String
example      | {{< highlight shell >}}"groups_prefix": "ldap"{{< /highlight >}}

<a name="username-prefix">

| username_prefix | |
-------------|------
description  | The prefix added to all LDAP usernames. Use this prefix when integrating LDAP users with Sensu RBAC [role bindings][12] and [cluster role bindings][13]. Users _do not_ need to provide this prefix when logging in to Sensu.
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
description  | Search configuration for groups. See the [group search attributes](#group-search-attributes) for more information.
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
description  | Search configuration for users. See the [user search attributes](#user-search-attributes) for more information.
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
example      | {{< highlight shell >}}"name": "default"{{< /highlight >}}

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
