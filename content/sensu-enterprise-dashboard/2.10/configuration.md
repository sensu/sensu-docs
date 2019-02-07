---
title: "Configuration"
product: "Sensu Enterprise Dashboard"
version: "2.10"
description: "The Sensu Enterprise dashboard uses two configuration scopes to provide connection details for one or more Sensu API endpoints and to configure the behavior of the dashboard itself."
weight: 2
menu: "sensu-enterprise-dashboard-2.10"
---

- [Dashboard configuration](#dashboard-configuration)
	- [Example configuration](#example-dashboard-configuration)
	- [Configuring multiple users](#configuring-multiple-users)
	- [Encrypting passwords](#encrypting-passwords)
- [Dashboard definition specification](#dashboard-definition-specification)
	- [`sensu` attributes](#sensu-attributes)
	- [`dashboard` attributes](#dashboard-attributes)
	  - [`auth` attributes](#auth-attributes)
	  - [`audit` attributes](#audit-attributes)
	  - [`github` attributes](#github-attributes)
	  - [`gitlab` attributes](#gitlab-attributes)
	  - [`ldap` attributes](#ldap-attributes)
	  - [`oidc` attributes](#oidc-attributes)

## Dashboard configuration

### Example dashboard configuration

The following is the bare minimum that should be included in your Sensu
Enterprise Dashboard configuration.

{{< highlight json >}}
{
  "sensu": [
    {
      "name": "sensu-server-1",
      "host": "api1.example.com",
      "port": 4567
    }
  ],
  "dashboard": {
    "host": "0.0.0.0",
    "port": 3000
  }
}
{{< /highlight >}}

_NOTE: the Sensu Enterprise Dashboard requires two configuration scopes: `sensu`
and `dashboard` (see [Dashboard definition specification][8], below)._

For a more advanced configuration making use of RBAC and SSL, consider the example below:

{{< highlight json >}}
{
  "sensu": [
    {
      "name": "Sensu Deployment 1",
      "host": "localhost",
      "port": 4567,
      "timeout": 5
    },
    {
      "name": "Sensu Deployment 2",
      "host": "10.0.1.10",
      "port": 4567,
      "timeout": 5
    }
  ],
  "dashboard": {
    "host": "0.0.0.0",
    "port": 3000,
    "interval": 5,
    "users": [
      {
        "username": "sensu_user_1",
        "password": "{crypt}EXAMPLEPASSFORUSER1"
      },
      {
        "username": "sensu_user_1",
        "password": "{crypt}EXAMPLEPASSFORUSER2"
      }
    ],
    "ssl": {
      "certfile": "/etc/sensu/ssl/cert.pem",
      "keyfile": "/etc/sensu/ssl/key.pem",
      "ciphersuite": [
        "TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256",
        "TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384",
        "TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305",
        "TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA",
        "TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA",
        "TLS_RSA_WITH_AES_128_GCM_SHA256",
        "TLS_RSA_WITH_AES_256_GCM_SHA384",
        "TLS_RSA_WITH_AES_128_CBC_SHA",
        "TLS_RSA_WITH_AES_256_CBC_SHA"
      ],
      "tlsminversion": "tls12"
     },
    "usersOptions": {
    "dateFormat": "YYYY-MM-DD HH:mm:ss",
    "defaultTheme": "uchiwa-default",
    "disableNoExpiration": false,
    "favicon": "/etc/sensu/favicon.png",
    "logoURL": "/etc/sensu/logo.jpg",
    "requireSilencingReason": false,
    "silenceDurations": [ 0.5, 2 ]
    },
    "github": {
      "clientId": "GITHUBCLIENTID",
      "clientSecret": "GITHUBCLIENTSECRET",
      "server": "https://github.com",
      "roles": [
        {
          "name": "admin",
          "members": [
             "my-github-org/admins"
          ],
          "datacenters": [],
          "subscriptions": [],
          "readonly": false,
          "accessToken": "MYACCESSTOKEN"
        }
      ]
     }
   }
}{{< /highlight >}}

This example makes use of the following:

* Multiple Sensu datacenters
* Local users (for fallback in the event Github cannot be reached)
* SSL (a full list of supperted ciphers can be found [here][golang-ssl])
* Default options (which you can view under the [Uchiwa docmentation][uchiwa-options])
* RBAC via [Github][5]

_NOTE: Local users can only be used for fallback with Github, Gitlab, and OIDC RBAC providers. It is not possible to have a local fallback with LDAP._

### Configuring multiple users

You can define multiple users, including read-only users, within your
users attribute. The **users** attribute has precedence over the **user** attribute.


{{< highlight json >}}
{
  "sensu": [
    {
      "name": "sensu-server-1",
      "host": "api1.example.com",
      "port": 4567
    }
  ],
  "dashboard": {
    "host": "0.0.0.0",
    "port": 3000,
    "users": [
      {
        "username" : "admin",
        "password": "secret",
        "accessToken": "vFzX6rFDAn3G9ieuZ4ZhN-XrfdRow4Hd5CXXOUZ5NsTw4h3k3l4jAw__",
        "readonly": false
      },
      {
        "username" : "guest",
        "password": "secret",
        "accessToken": "hrKMW3uIt2RGxuMIoXQ-bVp-TL1MP4St5Hap3KAanMxI3OovFV48ww__",
        "readonly": true
      }
    ]
  }
}
{{< /highlight >}}

Key     | Required | Type | Description
--------|----------|------|------
username | true | string | Username of the user.
password | true | string | Password of the user. Also see the [encrypting passwords documentation](#encrypting-passwords).
accessToken | false | string | A unique and secure token to interact with the Sensu Enterprise Dashboard API as the related user. Remember to keep your access tokens secret. Must only contain friendly URL characters. See [API authentication](../api/overview).
readonly | false | boolean | Restrict write access to the dashboard (create stashes, delete clients, etc.). The default value is `false`.

### Encrypting passwords
You can place hashed passwords in the *password*
attributes, but only within the **dashboard** object, in order to obfuscate
users passwords in your configuration files.

Please note that you must **absolutely** use the `{crypt}` prefix when using an encrypted
password. For example:
{{< highlight shell >}}
"password": "{crypt}$1$MteWnoFT$yhEi8KMxO794K0TIriZcI0"{{< /highlight >}}

The following algorithms are supported (along with the commands to create the hashes):

Algorithm | Command
----------|---------
APR1 | `openssl passwd -apr1 MY_PASSWORD`
MD5 | `mkpasswd --method=MD5 MY_PASSWORD`
SHA-256 | `mkpasswd --method=SHA-256 MY_PASSWORD`
SHA-512 | `mkpasswd --method=SHA-512 MY_PASSWORD`

Alternatively, you could use the [Passlib hashing library for Python 2 & 3]
(https://passlib.readthedocs.io/en/stable/).

## Dashboard definition specification {#dashboard-definition-specification}

The Sensu Enterprise dashboard uses two [configuration scopes][9]: the
`{ "sensu": {} }` configuration scope provides connection details for one or
more Sensu API endpoints (i.e. [datacenters][1], and the `{ "dashboard": {} }`
configuration scope is used to configure the behavior of the dashboard itself.

_NOTE: by default, the Sensu Enterprise Dashboard will load configuration from
`/etc/sensu/dashboard.json` and/or from JSON configuration files located in
`/etc/sensu/dashboard.d/**.json`, with the same configuration merging behavior
as described [here][2]._

### `sensu` attributes {#sensu-attributes}

name         | 
-------------|------
description  | The name of the Sensu API (used elsewhere as the `datacenter` name).
required     | false
type         | String
default      | randomly generated
example      | {{< highlight shell >}}"name": "us-west-1"{{< /highlight >}}

host         | 
-------------|------
description  | The hostname or IP address of the Sensu API.
required     | true
type         | String
example      | {{< highlight shell >}}"host": "127.0.0.1"{{< /highlight >}}

port         | 
-------------|------
description  | The port of the Sensu API.
required     | false
type         | Integer
default      | 4567
example      | {{< highlight shell >}}"port": 4567{{< /highlight >}}

ssl          | 
-------------|------
description  | Determines whether or not to use the HTTPS protocol.
required     | false
type         | Boolean
default      | false
example      | {{< highlight shell >}}"ssl": true{{< /highlight >}}

insecure     | 
-------------|------
description  | Determines whether or not to accept an insecure SSL certificate.
required     | false
type         | Boolean
default      | false
example      | {{< highlight shell >}}"insecure": true{{< /highlight >}}

path         | 
-------------|------
description  | The path of the Sensu API. Leave empty unless your Sensu API is not mounted to `/`.
required     | false
type         | String
example      | {{< highlight shell >}}"path": "/my_api"{{< /highlight >}}

timeout      | 
-------------|------
description  | The timeout for the Sensu API, in seconds.
required     | false
type         | Integer
default      | 5
example      | {{< highlight shell >}}"timeout": 15{{< /highlight >}}

user         | 
-------------|------
description  | The username of the Sensu API. Leave empty for no authentication.
required     | false
type         | String
example      | {{< highlight shell >}}"user": "my_sensu_api_username"{{< /highlight >}}

pass         | 
-------------|------
description  | The password of the Sensu API. Leave empty for no authentication.
required     | false
type         | String
example      | {{< highlight shell >}}"pass": "my_sensu_api_password"{{< /highlight >}}

### `dashboard` attributes {#dashboard-attributes}

host         | 
-------------|------
description  | The hostname or IP address on which Sensu Enterprise Dashboard will listen on.
required     | false
type         | String
default      | "0.0.0.0"
example      | {{< highlight shell >}}"host": "1.2.3.4"{{< /highlight >}}

port         | 
-------------|------
description  | The port on which Sensu Enterprise Dashboard and Console API will listen on.
required     | false
type         | Integer
default      | 3000
example      | {{< highlight shell >}}"port": 3000{{< /highlight >}}

refresh      | 
-------------|------
description  | Determines the interval to poll the Sensu APIs, in seconds.
required     | false
type         | Integer
default      | 5
example      | {{< highlight shell >}}"refresh": 5{{< /highlight >}}

ssl          | 
-------------|------
description  | A hash of SSL configuration for native SSL support.
required     | false
type         | Hash
example      | {{< highlight shell >}}"ssl": {
  "certfile": "/path/to/dashboard.pem",
  "keyfile": "/path/to/dashboard.key",
  "ciphersuite": [
      "TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256",
      "TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305",
      "TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305",
      "TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA",
      "TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA",
      "TLS_RSA_WITH_AES_128_GCM_SHA256",
      "TLS_RSA_WITH_AES_128_CBC_SHA",
      "TLS_RSA_WITH_AES_256_CBC_SHA"
      ],
  "tlsminversion": "tls10"
}
{{< /highlight >}}

user         | 
-------------|------
description  | A username to enable simple authentication and restrict access to the dashboard. Leave blank along with `pass` to disable simple authentication. You can also configure multiple users with the [`users` attribute](#configuring-multiple-users).
required     | false
type         | String
example      | {{< highlight shell >}}"user": "admin"{{< /highlight >}}

pass         | 
-------------|------
description  | A password to enable simple authentication and restrict access to the dashboard. Leave blank along with `user` to disable simple authentication. Sensu also supports [encrypted passwords](#encrypting-passwords).
required     | false
type         | String
example      | {{< highlight shell >}}"pass": "secret"{{< /highlight >}}

auth         | 
-------------|------
description  | The [`auth` definition scope][11], used to configure JSON Web Token (JWT) authentication signatures.
required     | false
type         | Hash
example      | {{< highlight shell >}}"auth": {
  "privatekey": "/path/to/console.rsa",
  "publickey": "/path/to/console.rsa.pub"
}
{{< /highlight >}}

audit        | 
-------------|------
description  | The [`audit` definition scope][12], used to configure [Audit Logging][7] for the Sensu Enterprise Dashboard.
required     | false
type         | Hash
example      | {{< highlight shell >}}"audit": {
  "logfile": "/var/log/sensu/sensu-enterprise-dashboard-audit.log",
  "level": "default"
}
{{< /highlight >}}

requireSilencingReason | 
-------------|------
description  | Determines whether or not a reason must be provided when creating a silencing entry.
required     | false
type         | Boolean
default      | false
example      | {{< highlight shell >}}"requireSilencingReason": false{{< /highlight >}}

github       | 
-------------|------
description  | The [`github` definition scope][14], used to configure [Role Based Access Controls][3] with the [RBAC for GitHub driver][5]. Overrides simple authentication.
required     | false
type         | Hash
example      | {{< highlight shell >}}"github": {
  "clientId": "a8e43af034e7f2608780",
  "clientSecret": "b63968394be6ed2edb61c93847ee792f31bf6216",
  "server": "https://github.com",
  "roles": [
    {
      "name": "guests",
      "members": [
        "myorganization/devs"
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
        "myorganization/owners"
      ],
      "datacenters": [],
      "subscriptions": [],
      "readonly": false
    }
  ]
}
{{< /highlight >}}

gitlab       | 
-------------|------
description  | The [`gitlab` definition scope][15], used to configure [Role Based Access Controls][3] with the [RBAC for GitLab driver][6]. Overrides simple authentication.
required     | false
type         | Hash
example      | {{< highlight shell >}}"gitlab": {
  "clientId": "a8e43af034e7f2608780",
  "clientSecret": "b63968394be6ed2edb61c93847ee792f31bf6216",
  "server": "https://github.com",
  "roles": [
    {
      "name": "guests",
      "members": [
        "myorganization/devs"
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
        "myorganization/owners"
      ],
      "datacenters": [],
      "subscriptions": [],
      "readonly": false
    }
  ]
}
{{< /highlight >}}

ldap         | 
-------------|------
description  | The [`ldap` configuration scope][13], used to configure [Role Based Access Controls][3] with the [RBAC for LDAP driver][4]. Overrides simple authentication.
required     | false
type         | Hash
example      | {{< highlight shell >}}"ldap": {
  "server": "localhost",
  "port": 389,
  "basedn": "cn=users,dc=domain,dc=tld",
  "binduser": "cn=binder,cn=users,dc=domain,dc=tld",
  "bindpass": "secret",
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
  ],
  "insecure": false,
  "security": "none",
  "userattribute": "sAMAccountName"
}
{{< /highlight >}}

oidc         | 
-------------|------
description  | The [`oidc` definition scope][18], used to configure [Role Based Access Controls][3] with the [RBAC for OpenID Connect (OIDC) driver][17]. Overrides simple authentication.
required     | false
type         | Hash
example      | {{< highlight shell >}}"oidc": {
  "clientId": "a8e43af034e7f2608780",
  "clientSecret": "b63968394be6ed2edb61c93847ee792f31bf6216",
  "insecure": false,
  "server": "https://localhost:9031",
  "roles": [
    {
      "name": "guests",
      "members": [
        "myorganization/devs"
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
        "myorganization/owners"
      ],
      "datacenters": [],
      "subscriptions": [],
      "readonly": false
    }
  ]
}
{{< /highlight >}}

#### `auth` attributes

_NOTE: By default, temporary keys are generated when the Sensu Enterprise
Dashboard starts. These keys are later destroyed once the process is stopped or
restarted. These keys are used for generating and validating the signatures of
the JSON Web Tokens (JWT) for authentication. Specifying static keys is
supported and is necessary when using Sensu Enterprise Console behind a load
balancer. Static keys can be configured by using the `auth` attributes detailed
below._

privatekey   | 
-------------|------
description  | Path to a private RSA key used for generating and validating the signatures of the JSON Web Tokens (JWT) for authentication.
required     | false
type         | String
example      | {{< highlight shell >}}"auth": {
  "privatekey": "/path/to/console.rsa"
}
{{< /highlight >}}

public       | 
-------------|------
description  | Path to a public RSA key used for generating and validating the signatures of the JSON Web Tokens (JWT) for authentication.
required     | false
type         | String
example      | {{< highlight shell >}}"auth": {
  "publickey": "/path/to/console.rsa.pub"
}
{{< /highlight >}}

#### `audit` attributes

Please see the [Sensu Enterprise Dashboard Audit Logging reference
documentation][7] for information on how to configure the dashboard for audit
logging purposes.

#### `github` attributes

Please see the [RBAC for GitHub reference documentation][5] for information on
how to configure the dashboard for RBAC with GitHub.com or GitHub Enterprise.

#### `gitlab` attributes

Please see the [RBAC for GitLab reference documentation][6] for information on
how to configure the dashboard for RBAC with GitLab.

#### `ldap` attributes

Please see the [RBAC for LDAP reference documentation][4] for information on how
to configure the dashboard for RBAC with LDAP.

#### `oidc` attributes

Please see the [RBAC for OIDC reference documentation][4] for information on how
to configure the dashboard for RBAC with OpenID Connect (OIDC).

[1]:  ../#what-is-a-sensu-datacenter
[2]:  /sensu-core/latest/reference/configuration/#configuration-merging
[3]:  ../rbac/overview
[4]:  ../rbac/rbac-for-ldap
[5]:  ../rbac/rbac-for-github
[6]:  ../rbac/rbac-for-gitlab
[7]:  ../rbac/audit-logging
[8]:  #dashboard-definition-specification
[9]:  #configuration-scopes
[10]: #configuration-merging
[11]: #auth-attributes
[12]: #audit-attributes
[13]: #ldap-attributes
[14]: #github-attributes
[15]: #gitlab-attributes
[16]: ../rbac/overview/#rbac-for-the-sensu-enterprise-console-api
[17]: ../rbac/rbac-for-oidc
[18]: #oidc-attributes
[19]: https://docs.sensu.io/uchiwa/1.0/getting-started/configuration/#multiple-users
[20]: https://docs.sensu.io/uchiwa/1.0/guides/security/#encrypted-passwords

<!-- Supplemental Links -->
[golang-ssl]: https://golang.org/pkg/crypto/tls/#pkg-constants
[uchiwa-options]: /uchiwa/latest/getting-started/configuration/#users-options
