---
title: "Configure Active Directory (AD) authentication to access Sensu"
linktitle: "Authenticate with AD"
description: "In addition to built-in basic authentication, Sensu includes commercial support for authentication using Active Directory (AD). Read this guide to configure an AD authentication provider."
weight: 10
version: "5.20"
product: "Sensu Go"
menu:
  sensu-go-5.20:
    parent: control-access
---

**COMMERCIAL FEATURE**: Access authentication providers in the packaged Sensu Go distribution.
For more information, see [Get started with commercial features][6].

Sensu requires username and password authentication to access the [web UI][1], [API][8], and [sensuctl][2] command line tool.

In addition to the built-in basic authentication provider, Sensu offers [commercial support][6] for using Microsoft Active Directory (AD) for authentication.
The AD authentication provider is based on the [LDAP authentication provider][44].

To use AD authentication for Azure, follow Microsoft's tutorial to [set up secure LDAP in your Azure account][10] and create the host and certificates you need.

For general information about configuring authentication providers, see [Use an authentication provider][12].

## AD configuration examples

**Example AD configuration: Minimum required attributes**

{{< language-toggle >}}

{{< code yml >}}
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
{{< /code >}}

{{< code json >}}
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
{{< /code >}}

{{< /language-toggle >}}

**Example AD configuration: All attributes**

{{< language-toggle >}}

{{< code yml >}}
type: ad
api_version: authentication/v2
metadata:
  name: activedirectory
spec:
  groups_prefix: ad
  servers:
  - binding:
      password: YOUR_PASSWORD
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
{{< /code >}}

{{< code json >}}
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
          "password": "YOUR_PASSWORD"
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
{{< /code >}}

{{< /language-toggle >}}

**Example AD configuration: Use `memberOf` attribute instead of `group_search`**

AD automatically returns a `memberOf` attribute in users' accounts.
The `memberOf` attribute contains the user's group membership, which effectively removes the requirement to look up the user's groups.

To use the `memberOf` attribute in your AD implementation, remove the `group_search` object from your AD config:

{{< language-toggle >}}

{{< code yml >}}
type: ad
api_version: authentication/v2
metadata:
  name: activedirectory
spec:
  servers:
    host: 127.0.0.1
    user_search:
      base_dn: dc=acme,dc=org
{{< /code >}}

{{< code json >}}
{
  "type": "ad",
  "api_version": "authentication/v2",
  "spec": {
    "servers": [
      {
        "host": "127.0.0.1",
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
{{< /code >}}

{{< /language-toggle >}}

After you configure AD to use the `memberOf` attribute, the `debug` log level will include the following log entries:

{{< code shell >}}
{"component":"authentication/v2","level":"debug","msg":"using the \"memberOf\" attribute to determine the group membership of user \"user1\"","time":"2020-06-25T14:10:58-04:00"}
{"component":"authentication/v2","level":"debug","msg":"found 1 LDAP group(s): [\"sensu\"]","time":"2020-06-25T14:10:58-04:00"}
{{< /code >}}

## AD specification

### AD top-level attributes

type         | 
-------------|------
description  | Top-level attribute that specifies the [`sensuctl create`][38] resource type. For AD definitions, the `type` should always be `ad`.
required     | true
type         | String
example      | {{< code shell >}}"type": "ad"{{< /code >}}

api_version  | 
-------------|------
description  | Top-level attribute that specifies the Sensu API group and version. For AD definitions, the `api_version` should always be `authentication/v2`.
required     | true
type         | String
example      | {{< code shell >}}"api_version": "authentication/v2"{{< /code >}}

metadata     | 
-------------|------
description  | Top-level map that contains the AD definition `name`. See the [metadata attributes reference][23] for details.
required     | true
type         | Map of key-value pairs
example      | {{< code shell >}}
"metadata": {
  "name": "activedirectory"
}
{{< /code >}}

spec         | 
-------------|------
description  | Top-level map that includes the AD [spec attributes][45].
required     | true
type         | Map of key-value pairs
example      | {{< code shell >}}
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
        "password": "YOUR_PASSWORD"
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
{{< /code >}}

### AD spec attributes

| servers    |      |
-------------|------
description  | An array of [AD servers][46] for your directory. During the authentication process, Sensu attempts to authenticate using each AD server in sequence.
required     | true
type         | Array
example      | {{< code shell >}}
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
      "password": "YOUR_PASSWORD"
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
{{< /code >}}

<a name="ad-groups-prefix"></a>

| groups_prefix |   |
-------------|------
description  | The prefix added to all AD groups. Sensu appends the groups_prefix with a colon. For example, for the groups_prefix `ad` and the group `dev`, the resulting group name in Sensu is `ad:dev`. Use the groups_prefix when integrating AD groups with Sensu RBAC [role bindings and cluster role bindings][13].
required     | false
type         | String
example      | {{< code shell >}}"groups_prefix": "ad"{{< /code >}}

<a name="ad-username-prefix"></a>

| username_prefix | |
-------------|------
description  | The prefix added to all AD usernames. Sensu appends the username_prefix with a colon. For example, for the username_prefix `ad` and the user `alice`, the resulting username in Sensu is `ad:alice`. Use the username_prefix when integrating AD users with Sensu RBAC [role bindings and cluster role bindings][13]. Users _do not_ need to provide the username_prefix when logging in to Sensu.
required     | false
type         | String
example      | {{< code shell >}}"username_prefix": "ad"{{< /code >}}

### AD server attributes

| host       |      |
-------------|------
description  | AD server IP address or [FQDN][41].
required     | true
type         | String
example      | {{< code shell >}}"host": "127.0.0.1"{{< /code >}}

| port       |      |
-------------|------
description  | AD server port.
required     | true
type         | Integer
default      | `389` for insecure connections; `636` for TLS connections
example      | {{< code shell >}}"port": 636{{< /code >}}

| insecure   |      |
-------------|------
description  | Skips SSL certificate verification when set to `true`. {{% notice warning %}}
**WARNING**: Do not use an insecure connection in production environments.
{{% /notice %}}
required     | false
type         | Boolean
default      | `false`
example      | {{< code shell >}}"insecure": false{{< /code >}}

| security   |      |
-------------|------
description  | Determines the encryption type to be used for the connection to the AD server: `insecure` (unencrypted connection; not recommended for production), `tls` (secure encrypted connection), or `starttls` (unencrypted connection upgrades to a secure connection).
type         | String
default      | `"tls"`
example      | {{< code shell >}}"security": "tls"{{< /code >}}

| trusted_ca_file | |
-------------|------
description  | Path to an alternative CA bundle file in PEM format to be used instead of the system's default bundle. This CA bundle is used to verify the server's certificate.
required     | false
type         | String
example      | {{< code shell >}}"trusted_ca_file": "/path/to/trusted-certificate-authorities.pem"{{< /code >}}

| client_cert_file | |
-------------|------
description  | Path to the certificate that should be sent to the server if requested.
required     | false
type         | String
example      | {{< code shell >}}"client_cert_file": "/path/to/ssl/cert.pem"{{< /code >}}

| client_key_file | |
-------------|------
description  | Path to the key file associated with the `client_cert_file`.
required     | false
type         | String
example      | {{< code shell >}}"client_key_file": "/path/to/ssl/key.pem"{{< /code >}}

| binding    |      |
-------------|------
description  | The AD account that performs user and group lookups. If your sever supports anonymous binding, you can omit the `user_dn` or `password` attributes to query the directory without credentials. To use anonymous binding with AD, the `ANONYMOUS LOGON` object requires read permissions for users and groups.
required     | false
type         | Map
example      | {{< code shell >}}
"binding": {
  "user_dn": "cn=binder,cn=users,dc=acme,dc=org",
  "password": "YOUR_PASSWORD"
}
{{< /code >}}

| group_search |    |
-------------|------
description  | Search configuration for groups. See the [group search attributes][47] for more information. Remove the `group_search` object from your configuration to use the `memberOf` attribute instead.
required     | false
type         | Map
example      | {{< code shell >}}
"group_search": {
  "base_dn": "dc=acme,dc=org",
  "attribute": "member",
  "name_attribute": "cn",
  "object_class": "group"
}
{{< /code >}}

| user_search |     |
-------------|------
description  | Search configuration for users. See the [user search attributes][48] for more information.
required     | true
type         | Map
example      | {{< code shell >}}
"user_search": {
  "base_dn": "dc=acme,dc=org",
  "attribute": "sAMAccountName",
  "name_attribute": "displayName",
  "object_class": "person"
}
{{< /code >}}

| default_upn_domain |     |
-------------|------
description  | Enables UPN authentication when set. The default UPN suffix that will be appended to the username when a domain is not specified during login (for example, `user` becomes `user@defaultdomain.xyz`). {{% notice warning %}}
**WARNING**: When using UPN authentication, users must re-authenticate to apply any changes to group membership on the AD server since their last authentication. For example, if you remove a user from a group with administrator permissions for the current session (such as a terminated employee), Sensu will not apply the change until the user logs out and tries to start a new session. Likewise, under UPN, users cannot be forced to log out of Sensu. To apply group membership updates without re-authentication, specify a binding account or enable anonymous binding.
{{% /notice %}}
required     | false
type         | String
example      | {{< code shell >}}
"default_upn_domain": "example.org"
{{< /code >}}

| include_nested_groups |     |
-------------|------
description  | If `true`, the group search includes any nested groups a user is a member of. If `false`, the group search includes only the top-level groups a user is a member of.
required     | false
type         | Boolean
example      | {{< code shell >}}
"include_nested_groups": true
{{< /code >}}

### AD binding attributes

| user_dn    |      |
-------------|------
description  | The AD account that performs user and group lookups. We recommend using a read-only account. Use the distinguished name (DN) format, such as `cn=binder,cn=users,dc=domain,dc=tld`. If your sever supports anonymous binding, you can omit this attribute to query the directory without credentials.
required     | false
type         | String
example      | {{< code shell >}}"user_dn": "cn=binder,cn=users,dc=acme,dc=org"{{< /code >}}

| password   |      |
-------------|------
description  | Password for the `user_dn` account. If your sever supports anonymous binding, you can omit this attribute to query the directory without credentials.
required     | false
type         | String
example      | {{< code shell >}}"password": "YOUR_PASSWORD"{{< /code >}}

### AD group search attributes

| base_dn    |      |
-------------|------
description  | Tells Sensu which part of the directory tree to search. For example, `dc=acme,dc=org` searches within the `acme.org` directory.
required     | true
type         | String
example      | {{< code shell >}}"base_dn": "dc=acme,dc=org"{{< /code >}}

| attribute  |      |
-------------|------
description  | Used for comparing result entries. Combined with other filters as <br> `"(<Attribute>=<value>)"`.
required     | false
type         | String
default      | `"member"`
example      | {{< code shell >}}"attribute": "member"{{< /code >}}

| name_attribute |  |
-------------|------
description  | Represents the attribute to use as the entry name.
required     | false
type         | String
default      | `"cn"`
example      | {{< code shell >}}"name_attribute": "cn"{{< /code >}}

| object_class |   |
-------------|------
description  | Identifies the class of objects returned in the search result. Combined with other filters as `"(objectClass=<ObjectClass>)"`.
required     | false
type         | String
default      | `"group"`
example      | {{< code shell >}}"object_class": "group"{{< /code >}}

### AD user search attributes

| base_dn    |      |
-------------|------
description  | Tells Sensu which part of the directory tree to search. For example, `dc=acme,dc=org` searches within the `acme.org` directory.
required     | true
type         | String
example      | {{< code shell >}}"base_dn": "dc=acme,dc=org"{{< /code >}}

| attribute  |      |
-------------|------
description  | Used for comparing result entries. Combined with other filters as <br> `"(<Attribute>=<value>)"`.
required     | false
type         | String
default      | `"sAMAccountName"`
example      | {{< code shell >}}"attribute": "sAMAccountName"{{< /code >}}

| name_attribute |  |
-------------|------
description  | Represents the attribute to use as the entry name.
required     | false
type         | String
default      | `"displayName"`
example      | {{< code shell >}}"name_attribute": "displayName"{{< /code >}}

| object_class |   |
-------------|------
description  | Identifies the class of objects returned in the search result. Combined with other filters as `"(objectClass=<ObjectClass>)"`.
required     | false
type         | String
default      | `"person"`
example      | {{< code shell >}}"object_class": "person"{{< /code >}}

### AD metadata attributes

| name       |      |
-------------|------
description  | A unique string used to identify the AD configuration. Names cannot contain special characters or spaces (validated with Go regex [`\A[\w\.\-]+\z`][42]).
required     | true
type         | String
example      | {{< code shell >}}"name": "activedirectory"{{< /code >}}

## AD troubleshooting

The troubleshooting steps in the [LDAP troubleshooting][49] section also apply for AD troubleshooting.


[1]: ../../../web-ui/
[2]: ../../../sensuctl/
[6]: ../../../commercial/
[8]: ../../../api/
[10]: https://docs.microsoft.com/en-us/azure/active-directory-domain-services/tutorial-configure-ldaps
[12]: ../#use-an-authentication-provider
[13]: ../../../reference/rbac#role-bindings-and-cluster-role-bindings
[23]: #ad-metadata-attributes
[38]: ../../../sensuctl/create-manage-resources/#create-resources
[41]: https://en.wikipedia.org/wiki/Fully_qualified_domain_name
[42]: https://regex101.com/r/zo9mQU/2
[44]: ../ldap-auth/
[45]: #ad-spec-attributes
[46]: #ad-server-attributes
[47]: #ad-group-search-attributes
[48]: #ad-user-search-attributes
[49]: ../ldap-auth/#ldap-troubleshooting
