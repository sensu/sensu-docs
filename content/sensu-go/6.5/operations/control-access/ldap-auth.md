---
title: "Lightweight Directory Access Protocol (LDAP) reference"
linktitle: "LDAP Reference"
reference_title: "Lightweight Directory Access Protocol (LDAP)"
type: "reference"
description: "Read this guide to learn about Sensu's single sign-on (SSO) authentication with Lightweight Directory Access Protocol (LDAP) and configure an authentication provider."
weight: 55
version: "6.5"
product: "Sensu Go"
menu:
  sensu-go-6.5:
    parent: control-access
---

{{% notice commercial %}}
**COMMERCIAL FEATURE**: Access Lightweight Directory Access Protocol (LDAP) authentication for single sign-on (SSO) in the packaged Sensu Go distribution.
For more information, read [Get started with commercial features](../../../commercial/).
{{% /notice %}}

Sensu requires username and password authentication to access the [web UI][1], [API][8], and [sensuctl][2] command line tool.

In addition to the [built-in basic authentication provider][4], Sensu offers [commercial support][6] for a standards-compliant Lightweight Directory Access Protocol (LDAP) tool for single sign-on (SSO) authentication.
The Sensu LDAP authentication provider is tested with [OpenLDAP][7].
If you're using AD, head to the [AD section][37].

For general information about configuring authentication providers, read [Configure single sign-on (SSO) authentication][12].

## LDAP configuration examples

**Example LDAP configuration: Minimum required attributes**

{{< language-toggle >}}

{{< code yml >}}
---
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
---
type: ldap
api_version: authentication/v2
metadata:
  name: openldap
spec:
  allowed_groups: []
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
    "allowed_groups": [],
    "groups_prefix": "ldap",
    "username_prefix": "ldap"
  },
  "metadata": {
    "name": "openldap"
  }
}
{{< /code >}}

{{< /language-toggle >}}

**Example LDAP configuration: Use `memberOf` attribute instead of `group_search`**

If your LDAP server is configured to return a `memberOf` attribute when you perform a query, you can use `memberOf` in your Sensu LDAP implementation instead of `group_search`.
The `memberOf` attribute contains the user's group membership, which effectively removes the requirement to look up the user's groups.

To use the `memberOf` attribute in your LDAP implementation, remove the `group_search` object from your LDAP config:

{{< language-toggle >}}

{{< code yml >}}
---
type: ldap
api_version: authentication/v2
metadata:
  name: openldap
spec:
  servers:
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

After you configure LDAP to use the `memberOf` attribute, the `debug` log level will include the following log entries:

{{< code shell >}}
{"component":"authentication/v2","level":"debug","msg":"using the \"memberOf\" attribute to determine the group membership of user \"user1\"","time":"2020-06-25T14:10:58-04:00"}
{"component":"authentication/v2","level":"debug","msg":"found 1 LDAP group(s): [\"sensu\"]","time":"2020-06-25T14:10:58-04:00"}
{{< /code >}}

## LDAP specification

### Top-level attributes

type         | 
-------------|------
description  | Top-level attribute that specifies the [`sensuctl create`][38] resource type. For LDAP definitions, the `type` should always be `ldap`.
required     | true
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
type: ldap
{{< /code >}}
{{< code json >}}
{
  "type": "ldap"
}
{{< /code >}}
{{< /language-toggle >}}

api_version  | 
-------------|------
description  | Top-level attribute that specifies the Sensu API group and version. For LDAP definitions, the `api_version` should always be `authentication/v2`.
required     | true
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
api_version: authentication/v2
{{< /code >}}
{{< code json >}}
{
  "api_version": "authentication/v2"
}
{{< /code >}}
{{< /language-toggle >}}

metadata     | 
-------------|------
description  | Top-level map that contains the LDAP definition `name`. Review the [metadata attributes][24] for details.
required     | true
type         | Map of key-value pairs
example      | {{< language-toggle >}}
{{< code yml >}}
metadata:
  name: openldap
{{< /code >}}
{{< code json >}}
{
  "metadata": {
    "name": "openldap"
  }
}
{{< /code >}}
{{< /language-toggle >}}

spec         | 
-------------|------
description  | Top-level map that includes the LDAP [spec attributes][39].
required     | true
type         | Map of key-value pairs
example      | {{< language-toggle >}}
{{< code yml >}}
spec:
  servers:
  - host: 127.0.0.1
    port: 636
    insecure: false
    security: tls
    trusted_ca_file: "/path/to/trusted-certificate-authorities.pem"
    client_cert_file: "/path/to/ssl/cert.pem"
    client_key_file: "/path/to/ssl/key.pem"
    binding:
      user_dn: cn=binder,dc=acme,dc=org
      password: YOUR_PASSWORD
    group_search:
      base_dn: dc=acme,dc=org
      attribute: member
      name_attribute: cn
      object_class: groupOfNames
    user_search:
      base_dn: dc=acme,dc=org
      attribute: uid
      name_attribute: cn
      object_class: person
  allowed_groups: []
  groups_prefix: ldap
  username_prefix: ldap

{{< /code >}}
{{< code json >}}
{
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
    "allowed_groups": [],
    "groups_prefix": "ldap",
    "username_prefix": "ldap"
  }
}
{{< /code >}}
{{< /language-toggle >}}

### LDAP metadata attributes

| name       |      |
-------------|------
description  | A unique string used to identify the LDAP configuration. Names cannot contain special characters or spaces (validated with Go regex [`\A[\w\.\-]+\z`][42]).
required     | true
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
name: openldap
{{< /code >}}
{{< code json >}}
{
  "name": "openldap"
}
{{< /code >}}
{{< /language-toggle >}}

### LDAP spec attributes

| servers    |      |
-------------|------
description  | The list of [LDAP servers][40] to use. During the authentication process, Sensu attempts to authenticate against each LDAP server in sequence until authentication is successful or there are no more servers to try.
required     | true
type         | Array
example      | {{< language-toggle >}}
{{< code yml >}}
servers:
- host: 127.0.0.1
  port: 636
  insecure: false
  security: tls
  trusted_ca_file: "/path/to/trusted-certificate-authorities.pem"
  client_cert_file: "/path/to/ssl/cert.pem"
  client_key_file: "/path/to/ssl/key.pem"
  binding:
    user_dn: cn=binder,dc=acme,dc=org
    password: YOUR_PASSWORD
  group_search:
    base_dn: dc=acme,dc=org
    attribute: member
    name_attribute: cn
    object_class: groupOfNames
  user_search:
    base_dn: dc=acme,dc=org
    attribute: uid
    name_attribute: cn
    object_class: person
{{< /code >}}
{{< code json >}}
{
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
}
{{< /code >}}
{{< /language-toggle >}}

<a id="allowed-groups"></a>

| allowed_groups |   |
-------------|------
description  | An array of allowed LDAP group strings to include in the tokenized identity claim. Use to specify which groups to encode in the authentication provider's JSON Web Token (JWT) when the authenticated LDAP user is a member of many groups and the tokenized identity claim would be too large for correct web client operation.
required     | false
type         | Array of strings
example      | {{< language-toggle >}}
{{< code yml >}}
allowed_groups:
- sensu-viewers
- sensu-operators
{{< /code >}}
{{< code json >}}
{
  "allowed_groups": [
    "sensu-viewers",
    "sensu-operators"
  ]
}
{{< /code >}}
{{< /language-toggle >}}

<a id="groups-prefix"></a>

| groups_prefix |   |
-------------|------
description  | The prefix added to all LDAP groups. Sensu appends the groups_prefix with a colon. For example, for the groups_prefix `ldap` and the group `dev`, the resulting group name in Sensu is `ldap:dev`. Use the groups_prefix when integrating LDAP groups with Sensu RBAC [role bindings and cluster role bindings][13].
required     | false
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
groups_prefix: ldap
{{< /code >}}
{{< code json >}}
{
  "groups_prefix": "ldap"
}
{{< /code >}}
{{< /language-toggle >}}

<a id="username-prefix"></a>

| username_prefix | |
-------------|------
description  | The prefix added to all LDAP usernames. Sensu appends the username_prefix with a colon. For example, for the username_prefix `ldap` and the user `alice`, the resulting username in Sensu is `ldap:alice`. Use the username_prefix when integrating LDAP users with Sensu RBAC [role bindings and cluster role bindings][13]. Users _do not_ need to provide the username_prefix when logging in to Sensu.
required     | false
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
username_prefix: ldap
{{< /code >}}
{{< code json >}}
{
  "username_prefix": "ldap"
}
{{< /code >}}
{{< /language-toggle >}}

### LDAP server attributes

| host       |      |
-------------|------
description  | LDAP server IP address or [fully qualified domain name (FQDN)][41].
required     | true
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
host: 127.0.0.1
{{< /code >}}
{{< code json >}}
{
  "host": "127.0.0.1"
}
{{< /code >}}
{{< /language-toggle >}}

| port       |      |
-------------|------
description  | LDAP server port.
required     | true
type         | Integer
default      | `389` for insecure connections; `636` for TLS connections
example      | {{< language-toggle >}}
{{< code yml >}}
port: 636
{{< /code >}}
{{< code json >}}
{
  "port": 636
}
{{< /code >}}
{{< /language-toggle >}}

<a id="insecure-attribute"></a>

| insecure   |      |
-------------|------
description  | Skips SSL certificate verification when set to `true`. {{% notice warning %}}
**WARNING**: Do not use an insecure connection in production environments.
{{% /notice %}}
required     | false
type         | Boolean
default      | `false`
example      | {{< language-toggle >}}
{{< code yml >}}
insecure: false
{{< /code >}}
{{< code json >}}
{
  "insecure": false
}
{{< /code >}}
{{< /language-toggle >}}

<a id="security-attribute"></a>

| security   |      |
-------------|------
description  | Determines the encryption type to be used for the connection to the LDAP server: `insecure` (unencrypted connection; not recommended for production), `tls` (secure encrypted connection), or `starttls` (unencrypted connection upgrades to a secure connection).
type         | String
default      | `tls`
example      | {{< language-toggle >}}
{{< code yml >}}
security: tls
{{< /code >}}
{{< code json >}}
{
  "security": "tls"
}
{{< /code >}}
{{< /language-toggle >}}

| trusted_ca_file | |
-------------|------
description  | Path to an alternative CA bundle file in PEM format to be used instead of the system's default bundle. This CA bundle is used to verify the server's certificate.
required     | false
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
trusted_ca_file: /path/to/trusted-certificate-authorities.pem
{{< /code >}}
{{< code json >}}
{
  "trusted_ca_file": "/path/to/trusted-certificate-authorities.pem"
}
{{< /code >}}
{{< /language-toggle >}}

| client_cert_file | |
-------------|------
description  | Path to the certificate that should be sent to the server if requested.
required     | false
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
client_cert_file: /path/to/ssl/cert.pem
{{< /code >}}
{{< code json >}}
{
  "client_cert_file": "/path/to/ssl/cert.pem"
}
{{< /code >}}
{{< /language-toggle >}}

| client_key_file | |
-------------|------
description  | Path to the key file associated with the `client_cert_file`.
required     | false
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
client_key_file: /path/to/ssl/key.pem
{{< /code >}}
{{< code json >}}
{
  "client_key_file": "/path/to/ssl/key.pem"
}
{{< /code >}}
{{< /language-toggle >}}

<a id="binding-attribute"></a>

| binding    |      |
-------------|------
description  | The LDAP account that performs user and group lookups. If your server supports anonymous binding, you can omit the `user_dn` or `password` attributes to query the directory without credentials. Review the [binding attributes][43] for details.
required     | false
type         | Map
example      | {{< language-toggle >}}
{{< code yml >}}
binding:
  user_dn: cn=binder,dc=acme,dc=org
  password: YOUR_PASSWORD
{{< /code >}}
{{< code json >}}
{
  "binding": {
    "user_dn": "cn=binder,dc=acme,dc=org",
    "password": "YOUR_PASSWORD"
  }
}
{{< /code >}}
{{< /language-toggle >}}

| group_search |    |
-------------|------
description  | Search configuration for groups. Review the [group search attributes][21] for more information. Remove the `group_search` object from your configuration to use the `memberOf` attribute instead.
required     | false
type         | Map
example      | {{< language-toggle >}}
{{< code yml >}}
group_search:
  base_dn: dc=acme,dc=org
  attribute: member
  name_attribute: cn
  object_class: groupOfNames
{{< /code >}}
{{< code json >}}
{
  "group_search": {
    "base_dn": "dc=acme,dc=org",
    "attribute": "member",
    "name_attribute": "cn",
    "object_class": "groupOfNames"
  }
}
{{< /code >}}
{{< /language-toggle >}}

<a id="user-search-attribute"></a>

| user_search |     |
-------------|------
description  | Search configuration for users. Review the [user search attributes][22] for more information.
required     | true
type         | Map
example      | {{< language-toggle >}}
{{< code yml >}}
user_search:
  base_dn: dc=acme,dc=org
  attribute: uid
  name_attribute: cn
  object_class: person
{{< /code >}}
{{< code json >}}
{
  "user_search": {
    "base_dn": "dc=acme,dc=org",
    "attribute": "uid",
    "name_attribute": "cn",
    "object_class": "person"
  }
}
{{< /code >}}
{{< /language-toggle >}}

### LDAP binding attributes

| user_dn    |      |
-------------|------
description  | The LDAP account that performs user and group lookups. We recommend using a read-only account. Use the distinguished name (DN) format, such as `cn=binder,cn=users,dc=domain,dc=tld`. If your server supports anonymous binding, you can omit this attribute to query the directory without credentials.
required     | false
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
user_dn: cn=binder,dc=acme,dc=org
{{< /code >}}
{{< code json >}}
{
  "user_dn": "cn=binder,dc=acme,dc=org"
}
{{< /code >}}
{{< /language-toggle >}}

| password   |      |
-------------|------
description  | Password for the `user_dn` account. If your server supports anonymous binding, you can omit this attribute to query the directory without credentials.
required     | false
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
password: YOUR_PASSWORD
{{< /code >}}
{{< code json >}}
{
  "password": "YOUR_PASSWORD"
}
{{< /code >}}
{{< /language-toggle >}}

### LDAP group search attributes

| base_dn    |      |
-------------|------
description  | Tells Sensu which part of the directory tree to search. For example, `dc=acme,dc=org` searches within the `acme.org` directory.
required     | true
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
base_dn: dc=acme,dc=org
{{< /code >}}
{{< code json >}}
{
  "base_dn": "dc=acme,dc=org"
}
{{< /code >}}
{{< /language-toggle >}}

| attribute  |      |
-------------|------
description  | Used for comparing result entries. Combined with other filters as <br> `"(<Attribute>=<value>)"`.
required     | false
type         | String
default      | `member`
example      | {{< language-toggle >}}
{{< code yml >}}
attribute: member
{{< /code >}}
{{< code json >}}
{
  "attribute": "member"
}
{{< /code >}}
{{< /language-toggle >}}

<a id="name-attribute-attribute"></a>

| name_attribute |  |
-------------|------
description  | Represents the attribute to use as the entry name.
required     | false
type         | String
default      | `cn`
example      | {{< language-toggle >}}
{{< code yml >}}
name_attribute: cn
{{< /code >}}
{{< code json >}}
{
  "name_attribute": "cn"
}
{{< /code >}}
{{< /language-toggle >}}

| object_class |   |
-------------|------
description  | Identifies the class of objects returned in the search result. Combined with other filters as `"(objectClass=<ObjectClass>)"`.
required     | false
type         | String
default      | `groupOfNames`
example      | {{< language-toggle >}}
{{< code yml >}}
object_class: groupOfNames
{{< /code >}}
{{< code json >}}
{
  "object_class": "groupOfNames"
}
{{< /code >}}
{{< /language-toggle >}}

### LDAP user search attributes

| base_dn    |      |
-------------|------
description  | Tells Sensu which part of the directory tree to search. For example, `dc=acme,dc=org` searches within the `acme.org` directory.
required     | true
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
base_dn: dc=acme,dc=org
{{< /code >}}
{{< code json >}}
{
  "base_dn": "dc=acme,dc=org"
}
{{< /code >}}
{{< /language-toggle >}}

| attribute  |      |
-------------|------
description  | Used for comparing result entries. Combined with other filters as <br> `"(<Attribute>=<value>)"`.
required     | false
type         | String
default      | `uid`
example      | {{< language-toggle >}}
{{< code yml >}}
attribute: uid
{{< /code >}}
{{< code json >}}
{
  "attribute": "uid"
}
{{< /code >}}
{{< /language-toggle >}}

| name_attribute |  |
-------------|------
description  | Represents the attribute to use as the entry name
required     | false
type         | String
default      | `cn`
example      | {{< language-toggle >}}
{{< code yml >}}
name_attribute: cn
{{< /code >}}
{{< code json >}}
{
  "name_attribute": "cn"
}
{{< /code >}}
{{< /language-toggle >}}

| object_class |   |
-------------|------
description  | Identifies the class of objects returned in the search result. Combined with other filters as `"(objectClass=<ObjectClass>)"`.
required     | false
type         | String
default      | `person`
example      | {{< language-toggle >}}
{{< code yml >}}
object_class: person
{{< /code >}}
{{< code json >}}
{
  "object_class": "person"
}
{{< /code >}}
{{< /language-toggle >}}

## LDAP troubleshooting

To troubleshoot any issue with LDAP authentication, start by [increasing the log verbosity][3] of sensu-backend to the [debug log level][5].
Most authentication and authorization errors are only displayed on the debug log level to avoid flooding the log files.

{{% notice note %}}
**NOTE**: If you can't locate any log entries referencing LDAP authentication, run [sensuctl auth list](../sso/#manage-authentication-providers) to make sure that you successfully installed the LDAP provider.
{{% /notice %}}

### Authentication

This section lists common authentication error messages and describes possible solutions for each of them.

#### `failed to connect: LDAP Result Code 200 "Network Error"`

The LDAP provider couldn't establish a TCP connection to the LDAP server.
Verify the `host` and `port` attributes.
If you are not using LDAP over TLS/SSL, make sure to set the value of the [`security` attribute][10] to `insecure` for plaintext communication.

#### `certificate signed by unknown authority`

If you are using a self-signed certificate, make sure to set the [`insecure` attribute][11] to `true`.
This will bypass verification of the certificate's signing authority.

#### `failed to bind: ...`

The first step for authenticating a user with the LDAP provider is to bind to the LDAP server using the service account specified in the [`binding` object][14].
Make sure the [`user_dn` attribute][43] specifies a valid **DN** and that its password is correct.

#### `user <username> was not found`

The user search failed.
No user account could be found with the given username.
Check the [`user_search` object][15] and make sure that:

- The specified `base_dn` contains the requested user entry DN
- The specified `attribute` contains the _username_ as its value in the user entry
- The `object_class` attribute corresponds to the user entry object class

#### `ldap search for user <username> returned x results, expected only 1`

The user search returned more than one user entry, so the provider could not determine which of these entries to use.
Change the [`user_search` object][15] so the provided `username` can be used to uniquely identify a user entry.
Here are two methods to try:

- Adjust the `attribute` so its value (which corresponds to the `username`) is unique among the user entries
- Adjust the `base_dn` so it only includes one of the user entries

#### `ldap entry <DN> missing required attribute <name_attribute>`

The user entry returned (identified by `<DN>`) doesn't include the attribute specified by [`name_attribute` object][9], so the LDAP provider could not determine which attribute to use as the username in the user entry.
Adjust the `name_attribute` so it specifies a human-readable name for the user. 

#### `ldap group entry <DN> missing <name_attribute> and cn attributes`

The group search returned a group entry (identified by `<DN>`) that doesn't have the [`name_attribute` object][9] or a `cn` attribute, so the LDAP provider could not determine which attribute to use as the group name in the group entry.
Adjust the `name_attribute` so it specifies a human-readable name for the group.

### Authorization

Once authenticated, each user needs to be granted permissions via either a `ClusterRoleBinding` or a `RoleBinding`.

The way LDAP users and LDAP groups can be referred as subjects of a cluster role or role binding depends on the [`groups_prefix`][16] and [`username_prefix`][17] configuration attributes values of the LDAP provider.
For example, for the groups_prefix `ldap` and the group `dev`, the resulting group name in Sensu is `ldap:dev`.

#### Permissions are not granted via the LDAP group(s)

During authentication, the LDAP provider will print all groups found in LDAP (for example, `found 1 group(s): [dev]`) in the logs.
Keep in mind that this group name does not contain the [`groups_prefix`][16] at this point.

The Sensu backend logs each attempt made to authorize an RBAC request.
This is useful for determining why a specific binding didn't grant the request.
For example:

{{< code shell >}}
[...] the user is not a subject of the ClusterRoleBinding cluster-admin [...]
[...] could not authorize the request with the ClusterRoleBinding system:user [...]
[...] could not authorize the request with any ClusterRoleBindings [...]
{{< /code >}}


[1]: ../../../web-ui/
[2]: ../../../sensuctl/
[3]: ../../maintain-sensu/troubleshoot/#increment-log-level-verbosity
[4]: ../#use-built-in-basic-authentication
[5]: ../../maintain-sensu/troubleshoot/#log-levels
[6]: ../../../commercial/
[7]: https://www.openldap.org/
[8]: ../../../api/
[9]: #name-attribute-attribute
[10]: #security-attribute
[11]: #insecure-attribute
[12]: ../sso/
[13]: ../rbac#role-bindings-and-cluster-role-bindings
[14]: #binding-attribute
[15]: #user-search-attribute
[16]: #groups-prefix
[17]: #username-prefix
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
