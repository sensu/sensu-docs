---
title: "Configure Lightweight Directory Access Protocol (LDAP) authentication to access Sensu"
linktitle: "Authenticate with LDAP"
description: "In addition to built-in basic authentication, Sensu includes commercial support for authentication using Lightweight Directory Access Protocol (LDAP). Read this guide to configure an LDAP authentication provider."
weight: 20
version: "5.20"
product: "Sensu Go"
menu:
  sensu-go-5.20:
    parent: control-access
---

**COMMERCIAL FEATURE**: Access authentication providers in the packaged Sensu Go distribution.
For more information, see [Get started with commercial features][6].

Sensu requires username and password authentication to access the [web UI][1], [API][8], and [sensuctl][2] command line tool.

In addition to the built-in basic authentication provider, Sensu offers [commercial support][6] for a standards-compliant Lightweight Directory Access Protocol (LDAP) tool for authentication.
The Sensu LDAP authentication provider is tested with [OpenLDAP][7].
If you're using AD, head to the [AD section][37].

For general information about configuring authentication providers, see [Use an authentication provider][12].

## LDAP configuration examples

**Example LDAP configuration: Minimum required attributes**

{{< language-toggle >}}

{{< code yml >}}
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
{{< /code >}}

{{< code json >}}
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
{{< /code >}}

{{< /language-toggle >}}

**Example LDAP configuration: All attributes**

{{< language-toggle >}}

{{< code yml >}}
type: ldap
api_version: authentication/v2
metadata:
  name: openldap
spec:
  groups_prefix: ldap
  servers:
  - binding:
      password: YOUR_PASSWORD
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
{{< /code >}}

{{< code json >}}
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
          "password": "YOUR_PASSWORD"
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
{{< /code >}}

{{< /language-toggle >}}

## LDAP specification

### Top-level attributes

type         | 
-------------|------
description  | Top-level attribute that specifies the [`sensuctl create`][38] resource type. For LDAP definitions, the `type` should always be `ldap`.
required     | true
type         | String
example      | {{< code shell >}}"type": "ldap"{{< /code >}}

api_version  | 
-------------|------
description  | Top-level attribute that specifies the Sensu API group and version. For LDAP definitions, the `api_version` should always be `authentication/v2`.
required     | true
type         | String
example      | {{< code shell >}}"api_version": "authentication/v2"{{< /code >}}

metadata     | 
-------------|------
description  | Top-level map that contains the LDAP definition `name`. See the [metadata attributes reference][24] for details.
required     | true
type         | Map of key-value pairs
example      | {{< code shell >}}
"metadata": {
  "name": "openldap"
}
{{< /code >}}

spec         | 
-------------|------
description  | Top-level map that includes the LDAP [spec attributes][39].
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
      "binding": {
        "user_dn": "cn=binder,dc=acme,dc=org",
        "password": "YOUR_PASSWORD"
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
{{< /code >}}

### LDAP spec attributes

| servers    |      |
-------------|------
description  | An array of [LDAP servers][40] for your directory. During the authentication process, Sensu attempts to authenticate using each LDAP server in sequence.
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
    "binding": {
      "user_dn": "cn=binder,dc=acme,dc=org",
      "password": "YOUR_PASSWORD"
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
{{< /code >}}

<a name="groups-prefix"></a>

| groups_prefix |   |
-------------|------
description  | The prefix added to all LDAP groups. Sensu appends the groups_prefix with a colon. For example, for the groups_prefix `ldap` and the group `dev`, the resulting group name in Sensu is `ldap:dev`. Use the groups_prefix when integrating LDAP groups with Sensu RBAC [role bindings and cluster role bindings][13].
required     | false
type         | String
example      | {{< code shell >}}"groups_prefix": "ldap"{{< /code >}}

<a name="username-prefix"></a>

| username_prefix | |
-------------|------
description  | The prefix added to all LDAP usernames. Sensu appends the username_prefix with a colon. For example, for the username_prefix `ldap` and the user `alice`, the resulting username in Sensu is `ldap:alice`. Use the username_prefix when integrating LDAP users with Sensu RBAC [role bindings and cluster role bindings][13]. Users _do not_ need to provide the username_prefix when logging in to Sensu.
required     | false
type         | String
example      | {{< code shell >}}"username_prefix": "ldap"{{< /code >}}

### LDAP server attributes

| host       |      |
-------------|------
description  | LDAP server IP address or [FQDN][41].
required     | true
type         | String
example      | {{< code shell >}}"host": "127.0.0.1"{{< /code >}}

| port       |      |
-------------|------
description  | LDAP server port.
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
description  | Determines the encryption type to be used for the connection to the LDAP server: `insecure` (unencrypted connection; not recommended for production), `tls` (secure encrypted connection), or `starttls` (unencrypted connection upgrades to a secure connection).
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
description  | The LDAP account that performs user and group lookups. If your sever supports anonymous binding, you can omit the `user_dn` or `password` attributes to query the directory without credentials.
required     | false
type         | Map
example      | {{< code shell >}}
"binding": {
  "user_dn": "cn=binder,dc=acme,dc=org",
  "password": "YOUR_PASSWORD"
}
{{< /code >}}

| group_search |    |
-------------|------
description  | Search configuration for groups. See the [group search attributes][21] for more information.
required     | true
type         | Map
example      | {{< code shell >}}
"group_search": {
  "base_dn": "dc=acme,dc=org",
  "attribute": "member",
  "name_attribute": "cn",
  "object_class": "groupOfNames"
}
{{< /code >}}

| user_search |     |
-------------|------
description  | Search configuration for users. See the [user search attributes][22] for more information.
required     | true
type         | Map
example      | {{< code shell >}}
"user_search": {
  "base_dn": "dc=acme,dc=org",
  "attribute": "uid",
  "name_attribute": "cn",
  "object_class": "person"
}
{{< /code >}}

### LDAP binding attributes

| user_dn    |      |
-------------|------
description  | The LDAP account that performs user and group lookups. We recommend using a read-only account. Use the distinguished name (DN) format, such as `cn=binder,cn=users,dc=domain,dc=tld`. If your sever supports anonymous binding, you can omit this attribute to query the directory without credentials.
required     | false
type         | String
example      | {{< code shell >}}"user_dn": "cn=binder,dc=acme,dc=org"{{< /code >}}

| password   |      |
-------------|------
description  | Password for the `user_dn` account. If your sever supports anonymous binding, you can omit this attribute to query the directory without credentials.
required     | false
type         | String
example      | {{< code shell >}}"password": "YOUR_PASSWORD"{{< /code >}}

### LDAP group search attributes

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
default      | `"groupOfNames"`
example      | {{< code shell >}}"object_class": "groupOfNames"{{< /code >}}

### LDAP user search attributes

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
default      | `"uid"`
example      | {{< code shell >}}"attribute": "uid"{{< /code >}}

| name_attribute |  |
-------------|------
description  | Represents the attribute to use as the entry name
required     | false
type         | String
default      | `"cn"`
example      | {{< code shell >}}"name_attribute": "cn"{{< /code >}}

| object_class |   |
-------------|------
description  | Identifies the class of objects returned in the search result. Combined with other filters as `"(objectClass=<ObjectClass>)"`.
required     | false
type         | String
default      | `"person"`
example      | {{< code shell >}}"object_class": "person"{{< /code >}}

### LDAP metadata attributes

| name       |      |
-------------|------
description  | A unique string used to identify the LDAP configuration. Names cannot contain special characters or spaces (validated with Go regex [`\A[\w\.\-]+\z`][42]).
required     | true
type         | String
example      | {{< code shell >}}"name": "openldap"{{< /code >}}

## LDAP troubleshooting

To troubleshoot any issue with LDAP authentication, start by [increasing the log verbosity][19] of sensu-backend to the debug log level.
Most authentication and authorization errors are only displayed on the debug log level to avoid flooding the log files.

{{% notice note %}}
**NOTE**: If you can't locate any log entries referencing LDAP authentication, make sure the LDAP provider was successfully installed using [sensuctl](../#manage-authentication-providers).
{{% /notice %}}

### Authentication errors

This section lists common error messages and possible solutions.

**Error message**: `failed to connect: LDAP Result Code 200 "Network Error"`

The LDAP provider couldn't establish a TCP connection to the LDAP server.
Verify the `host` and `port` attributes.
If you are not using LDAP over TLS/SSL, make sure to set the value of the `security` attribute to `"insecure"` for plaintext communication.

**Error message**: `certificate signed by unknown authority`

If you are using a self-signed certificate, make sure to set the `insecure` attribute to `true`.
This will bypass verification of the certificate's signing authority.

**Error message**: `failed to bind: ...`

The first step for authenticating a user with the LDAP provider is to bind to the LDAP server using the service account specified in the [`binding` object][43].
Make sure the `user_dn` specifies a valid **DN** and that its password is correct.

**Error message**: `user <username> was not found`

The user search failed.
No user account could be found with the given username.
Check the [`user_search` object][22] and make sure that:

- The specified `base_dn` contains the requested user entry DN
- The specified `attribute` contains the _username_ as its value in the user entry
- The `object_class` attribute corresponds to the user entry object class

**Error message**: `ldap search for user <username> returned x results, expected only 1`

The user search returned more than one user entry, so the provider could not determine which of these entries to use.
Change the [`user_search` object][22] so the provided `username` can be used to uniquely identify a user entry.
Here are two methods to try:

- Adjust the `attribute` so its value (which corresponds to the `username`) is unique among the user entries
- Adjust the `base_dn` so it only includes one of the user entries

**Error message**: `ldap entry <DN> missing required attribute <name_attribute>`

The user entry returned (identified by `<DN>`) doesn't include the attribute specified by [`name_attribute` object][22], so the LDAP provider could not determine which attribute to use as the username in the user entry.
Adjust the `name_attribute` so it specifies a human-readable name for the user. 

**Error message**: `ldap group entry <DN> missing <name_attribute> and cn attributes`

The group search returned a group entry (identified by `<DN>`) that doesn't have the [`name_attribute` attribute][21] or a `cn` attribute, so the LDAP provider could not determine which attribute to use as the group name in the group entry.
Adjust the `name_attribute` so it specifies a human-readable name for the group.

### Authorization issues

Once authenticated, each user needs to be granted permissions via either a `ClusterRoleBinding` or a `RoleBinding`.

The way LDAP users and LDAP groups can be referred as subjects of a cluster role or role binding depends on the `groups_prefix` and `username_prefix` configuration attributes values of the [LDAP provider][39].
For example, for the groups_prefix `ldap` and the group `dev`, the resulting group name in Sensu is `ldap:dev`.

**Issue**: Permissions are not granted via the LDAP group(s)

During authentication, the LDAP provider will print in the logs all groups found in LDAP (for example, `found 1 group(s): [dev]`.
Keep in mind that this group name does not contain the `groups_prefix` at this point.

The Sensu backend logs each attempt made to authorize an RBAC request.
This is useful for determining why a specific binding didn't grant the request.
For example:

```
[...] the user is not a subject of the ClusterRoleBinding cluster-admin [...]
[...] could not authorize the request with the ClusterRoleBinding system:user [...]
[...] could not authorize the request with any ClusterRoleBindings [...]
```


[1]: ../../../web-ui/
[2]: ../../../sensuctl/
[6]: ../../../commercial/
[7]: https://www.openldap.org/
[8]: ../../../api/
[10]: https://docs.microsoft.com/en-us/azure/active-directory-domain-services/tutorial-configure-ldaps
[12]: ../#use-an-authentication-provider
[13]: ../../../reference/rbac#role-bindings-and-cluster-role-bindings
[21]: #ldap-group-search-attributes
[22]: #ldap-user-search-attributes
[24]: #ldap-metadata-attributes
[37]: ../ad-auth/
[38]: ../../../sensuctl/create-manage-resources/#create-resources
[39]: #ldap-spec-attributes
[40]: #ldap-server-attributes
[41]: https://en.wikipedia.org/wiki/Fully_qualified_domain_name
[42]: https://regex101.com/r/zo9mQU/2
[43]: #ldap-binding-attributes
