---
title: Configuration
weight: 13
product: "Uchiwa"
version: "1.0"
menu:
  uchiwa-1.0:
    parent: getting-started
---

## Configuration Load Order
Uchiwa loads configuration from these sources in the following order:

1. Uchiwa loads configuration from the configuration file (by default, this is located at `/etc/sensu/uchiwa.json` which is provided with the `-c` command line argument).
2. Uchiwa loads configuration snippets from configuration files located in one or multiple Uchiwa configuration directories (by default, this is the `/etc/sensu/dashboard.d/` directory which is provided with the `-d` command line argument).

## Minimal Configuration

{{< highlight json >}}
{
  "sensu": [
    {
      "name": "Site 1",
      "host": "api1.example.com",
      "port": 4567
    }
  ],
  "uchiwa": {
    "host": "0.0.0.0",
    "port": 3000
  }
}{{< /highlight >}}

## Datacenters Configuration (Sensu) {#datacenters-configuration-sensu}
The *sensu* array contains a hash for every Sensu API, represented as **datacenters** in Uchiwa.

Each hash can contain the following attributes:
{{< highlight json >}}
{
  "sensu": [
    {
      "name": "API Name",
      "host": "127.0.0.1",
      "port": 443,
      "ssl": true,
      "insecure": true,
      "path": "/site2",
      "timeout": 5,
      "user": "admin",
      "pass": "secret"
    }
  ]  
}{{< /highlight >}}

Key     | Required | Type | Description
--------|----------|------|------
name | false | string | Name of the Sensu API (used as datacenter name). If empty, a random one will be generated.
host | true | string | Hostname or IP address of the Sensu API.
port | false | integer | Port of the Sensu API. The default value is `4567`.
ssl | false | boolean | Determines whether or not to use the HTTPS protocol. The default value is `false`.
insecure | false | boolean | Determines whether or not to accept an insecure SSL certificate. The default value is `false`.
path | false | string | Path of the Sensu API.
timeout | false | integer | Timeout for the Sensu API, in seconds. The default value is `5`.
user | false | string | Username of the Sensu API.
pass | false | string | Password of the Sensu API.

## Uchiwa Configuration

The *uchiwa* hash can contain the following attributes:

{{< highlight json >}}
{
  "uchiwa": {
    "host": "0.0.0.0",
    "port": 3000,
    "loglevel": "info",
    "refresh": 10,
    "user": "admin",
    "pass": "secret",
    "users": {...},
    "auth": {...},
    "ssl": {...},
    "usersOptions": {...}
  }
}{{< /highlight >}}

Key     | Required | Type | Description
--------|----------|------|------
host | false | string | Address on which Uchiwa will listen. The default value is `0.0.0.0`. To use an IPv6 address, use square brackets (e.g. `[::1]`)
port | false | integer | Port on which Uchiwa will listen. The default value is `3000`.
loglevel | false | string | Level of logging to show after Uchiwa has started. The default value is `info`. Allowed values are `trace`, `debug`, `info`, `warn`, `fatal`
refresh | false | integer | Determines the interval to pull the Sensu APIs, in seconds. The default value is `10`.
user | false | string | Username of the Uchiwa dashboard. Remove to disable authentication.
pass | false | string | Password of the Uchiwa dashboard. Remove to disable authentication.
users | false | hash | [See the Mutliple Users documentation](#multiple-users). Has precedence over the **user** attribute.
auth | false | hash | [See the High Availability documentation][1].
ssl | false | hash | [See the HTTPS Encryption documentation][2].
usersOptions | false | hash | [See the Users Options documentation](#users-options).

### Multiple Users {#multiple-users}

You can define multiple users, including read-only users, within your
users attribute. The **users** attribute has precedence over the **user** attribute.

{{< highlight json >}}
{
  "uchiwa": {
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
}{{< /highlight >}}

Key     | Required | Type | Description
--------|----------|------|------
username | true | string | Username of the user.
password | true | string | Password of the user. Also see the [Encrypted Passwords documentation][3]].
accessToken | false | string | A unique and secure token to interact with the Uchiwa API as the related user. Remember to keep your access tokens secret. Must only contain friendly URL characters. See [Generating an access token](#generating-an-access-token) and [API Authentication][4]].
readonly | false | boolean | Restrict write access to the dashboard (create stashes, delete clients, etc.). The default value is `false`.

### Users Options {#users-options}

This hash can set various global users options.

{{< highlight json >}}
{
  "uchiwa": {
    "usersOptions": {
      "dateFormat": "YYYY-MM-DD HH:mm:ss",
      "defaultTheme": "uchiwa-default",
      "disableNoExpiration": false,
      "favicon": "http://127.0.0.1/favicon.png",
      "logoURL": "http://127.0.0.1/logo.png",
      "requireSilencingReason": false,
      "silenceDurations": [ 0.5, 2 ]
    }
  }
}{{< /highlight >}}

Key     | Required | Type | Description
--------|----------|------|------
dateFormat | false | string | Determines the format of dates displayed. Default value is `YYYY-MM-DD HH:mm:ss`. See http://momentjs.com/docs/#/displaying/format/ for possible values.
defaultTheme | false | string | Determines the default theme to use for new users. Can be overridden at the user level in settings view. Possible values are `uchiwa-default` (light theme) and `uchiwa-dark` (dark theme). The default value is `uchiwa-default`.
disableNoExpiration | false | boolean | Disables the `only if manually removed` option from the silencing entry creation. The default value is `false`.
favicon | false | string | URL or full path to a custom favicon. Leave empty to use the default favicon.
logoURL | false | string | URL to a custom logo. Leave empty to use the default logo.
requireSilencingReason | false | boolean | Determines whether a reason must be provided or not when creating a silence entry. The default value is `false`.
silenceDurations | false | array of decimals | Additional preset durations (**in hours**) when silencing an item. Decimal values are allowed. The default value is `[ 0.25, 1, 24 ]`, which corresponds to `15 minutes`, `an hour` and `a day`.

### Generating an access token {#generating-an-access-token}
An access token must only contain friendly URL characters. We recommend using
the following command to create a proper token:
{{< highlight shell >}}
openssl rand -base64 40 |  tr -- '+=/' '-_~'{{< /highlight >}}

[1]:  ../../guides/high-availability/#uchiwa-high-availability
[2]:  ../../guides/security/#https-encryption
[3]:  ../../guides/security/#encrypted-passwords
[4]:  ../../api/authentication/