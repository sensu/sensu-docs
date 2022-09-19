---
title: "OpenID Connect 1.0 protocol (OIDC) reference"
linkTitle: "OIDC Reference"
reference_title: "OpenID Connect 1.0 protocol (OIDC)"
type: "reference"
description: "Read this reference to configure single sign-on (SSO) authentication for Sensu using OpenID Connect 1.0 protocol (OIDC)."
weight: 60
version: "6.8"
product: "Sensu Go"
menu:
  sensu-go-6.8:
    parent: control-access
---

{{% notice commercial %}}
**COMMERCIAL FEATURE**: Access OpenID Connect 1.0 protocol (OIDC) authentication for single sign-on (SSO) in the packaged Sensu Go distribution.
For more information, read [Get started with commercial features](../../../commercial/).
{{% /notice %}}

Sensu requires username and password authentication to access the [web UI][1], [API][8], and [sensuctl][2] command line tool.

In addition to the [built-in basic authentication][7], Sensu offers [commercial support][6] for single sign-on (SSO) authentication using the OpenID Connect 1.0 protocol (OIDC) on top of the OAuth 2.0 protocol.
The Sensu OIDC provider is tested with [Okta][51] and [PingFederate][52].

{{% notice warning %}}
**WARNING**: Defining multiple OIDC providers can lead to inconsistent authentication behavior.
Use `sensuctl auth list` to verify that you have defined only one authentication provider of type `OIDC`.
If more than one OIDC auth provider configuration is listed, use `sensuctl auth delete $NAME` to remove the extra OIDC configurations by name.
{{% /notice %}}

For general information about configuring authentication providers, read [Configure single sign-on (SSO) authentication][12].

## OIDC configuration example

{{< language-toggle >}}

{{< code yml >}}
---
type: oidc
api_version: authentication/v2
metadata:
  name: oidc_name
spec:
  additional_scopes:
  - groups
  - email
  client_id: a8e43af034e7f2608780
  client_secret: b63968394be6ed2edb61c93847ee792f31bf6216
  disable_offline_access: false
  redirect_uri: http://127.0.0.1:8080/api/enterprise/authentication/v2/oidc/callback
  server: https://oidc.example.com:9031
  groups_claim: groups
  groups_prefix: 'oidc:'
  username_claim: email
  username_prefix: 'oidc:'
{{< /code >}}

{{< code json >}}
{
  "type": "oidc",
  "api_version": "authentication/v2",
  "metadata": {
    "name": "oidc_name"
  },
  "spec": {
    "additional_scopes": [
      "groups",
      "email"
    ],
    "client_id": "a8e43af034e7f2608780",
    "client_secret": "b63968394be6ed2edb61c93847ee792f31bf6216",
    "disable_offline_access": false,
    "redirect_uri": "http://sensu-backend.example.com:8080/api/enterprise/authentication/v2/oidc/callback",
    "server": "https://oidc.example.com:9031",
    "groups_claim": "groups",
    "groups_prefix": "oidc:",
    "username_claim": "email",
    "username_prefix": "oidc:"
  }
}
{{< /code >}}

{{< /language-toggle >}}

## OIDC specification

### OIDC top-level attributes

type         | 
-------------|------
description  | Top-level attribute that specifies the [`sensuctl create`][38] resource type. For OIDC configuration, the `type` should always be `oidc`.
required     | true
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
type: oidc
{{< /code >}}
{{< code json >}}
{
  "type": "oidc"
}
{{< /code >}}
{{< /language-toggle >}}

api_version  | 
-------------|------
description  | Top-level attribute that specifies the Sensu API group and version. For OIDC configuration, the `api_version` should always be `authentication/v2`.
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
description  | Top-level collection of metadata about the OIDC configuration. The `metadata` map is always at the top level of the OIDC definition. This means that in `wrapped-json` and `yaml` formats, the `metadata` scope occurs outside the `spec` scope.
required     | true
type         | Map of key-value pairs
example      | {{< language-toggle >}}
{{< code yml >}}
metadata:
  name: oidc_name
{{< /code >}}
{{< code json >}}
{
  "metadata": {
    "name": "oidc_name"
  }
}
{{< /code >}}
{{< /language-toggle >}}

spec         | 
-------------|------
description  | Top-level map that includes the OIDC [spec attributes][25].
required     | true
type         | Map of key-value pairs
example      | {{< language-toggle >}}
{{< code yml >}}
spec:
  additional_scopes:
  - groups
  - email
  client_id: a8e43af034e7f2608780
  client_secret: b63968394be6ed2edb61c93847ee792f31bf6216
  disable_offline_access: false
  redirect_uri: http://sensu-backend.example.com:8080/api/enterprise/authentication/v2/oidc/callback
  server: https://oidc.example.com:9031
  groups_claim: groups
  groups_prefix: 'oidc:'
  username_claim: email
  username_prefix: 'oidc:'
{{< /code >}}
{{< code json >}}
{
  "spec": {
    "additional_scopes": [
      "groups",
      "email"
    ],
    "client_id": "a8e43af034e7f2608780",
    "client_secret": "b63968394be6ed2edb61c93847ee792f31bf6216",
    "disable_offline_access": false,
    "redirect_uri": "http://sensu-backend.example.com:8080/api/enterprise/authentication/v2/oidc/callback",
    "server": "https://oidc.example.com:9031",
    "groups_claim": "groups",
    "groups_prefix": "oidc:",
    "username_claim": "email",
    "username_prefix": "oidc:"
  }
}
{{< /code >}}
{{< /language-toggle >}}

#### OIDC metadata attribute

| name       |      |
-------------|------
description  | A unique string used to identify the OIDC configuration. The name cannot contain special characters or spaces (validated with Go regex [`\A[\w\.\-]+\z`][42]).<br><br>The name you choose will be used in the web UI message for OIDC sign-in: `SIGN-IN WITH <name>`.
required     | true
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
name: oidc_provider
{{< /code >}}
{{< code json >}}
{
  "name": "oidc_provider"
}
{{< /code >}}
{{< /language-toggle >}}

#### OIDC spec attributes

| additional_scopes |   |
-------------|------
description  | Scopes to include in the claims, in addition to the default `openid` scope. {{% notice note %}}
**NOTE**: For most providers, you'll want to include `groups`, `email` and `username` in this list.
{{% /notice %}}
required     | false
type         | Array
example      | {{< language-toggle >}}
{{< code yml >}}
additional_scopes:
- groups
- email
- username
{{< /code >}}
{{< code json >}}
{
  "additional_scopes": [
    "groups",
    "email",
    "username"
  ]
}
{{< /code >}}
{{< /language-toggle >}}

| client_id  |      |
-------------|------
description  | The OIDC provider application client ID. {{% notice note %}}
**NOTE**: Register an application in the OIDC provider to generate a client ID. Read [register an Okta application](#register-an-okta-application) for an example.
{{% /notice %}}
required     | true
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
client_id: 1c9ae3e6f3cc79c9f1786fcb22692d1f
{{< /code >}}
{{< code json >}}
{
  "client_id": "1c9ae3e6f3cc79c9f1786fcb22692d1f"
}
{{< /code >}}
{{< /language-toggle >}}

| client_secret  |      |
-------------|------
description  | The OIDC provider application client secret. {{% notice note %}}
**NOTE**: Register an application in the OIDC provider to generate a client ID. Read [register an Okta application](#register-an-okta-application) for an example.
{{% /notice %}}
required     | true
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
client_secret: a0f2a3c1dcd5b1cac71bf0c03f2ff1bd
{{< /code >}}
{{< code json >}}
{
  "client_secret": "a0f2a3c1dcd5b1cac71bf0c03f2ff1bd"
}
{{< /code >}}
{{< /language-toggle >}}

| disable_offline_access |      |
-------------|------
description  | If `true`, the OIDC provider cannot include the `offline_access` scope in the authentication request. Otherwise, `false`.<br><br>We recommend setting `disable_offline_access` to `false`. If set to `true`, OIDC providers cannot return a refresh token that allows users to refresh their access tokens, and users will be logged out after 5 minutes.
required     | true
default      | false
type         | Boolean
example      | {{< language-toggle >}}
{{< code yml >}}
disable_offline_access: false
{{< /code >}}
{{< code json >}}
{
  "disable_offline_access": false
}
{{< /code >}}
{{< /language-toggle >}}

<a id="redirect-uri-attribute"></a>

| redirect_uri |   |
-------------|------
description  | Redirect URL to provide to the OIDC provider. Requires `/api/enterprise/authentication/v2/oidc/callback`. {{% notice note %}}
**NOTE**: Only required for certain OIDC providers, such as Okta.
{{% /notice %}}
required     | false
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
redirect_uri: http://sensu-backend.example.com:8080/api/enterprise/authentication/v2/oidc/callback
{{< /code >}}
{{< code json >}}
{
  "redirect_uri": "http://sensu-backend.example.com:8080/api/enterprise/authentication/v2/oidc/callback"
}
{{< /code >}}
{{< /language-toggle >}}

| server |  |
-------------|------
description  | The location of the OIDC server you wish to authenticate against. {{% notice note %}}
**NOTE**: If you configure with http, the connection will be insecure.
{{% /notice %}}
required     | true
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
server: https://sensu.oidc.provider.example.com
{{< /code >}}
{{< code json >}}
{
  "server": "https://sensu.oidc.provider.example.com"
}
{{< /code >}}
{{< /language-toggle >}}

<a id="groups-claim-attribute"></a>

| groups_claim |   |
-------------|------
description  | The claim to use to form the associated RBAC groups. {{% notice note %}}
**NOTE**: The value held by the claim must be an array of strings.
{{% /notice %}}
required     | false
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
groups_claim: groups
{{< /code >}}
{{< code json >}}
{
  "groups_claim": "groups"
}
{{< /code >}}
{{< /language-toggle >}}

| groups_prefix |   |
-------------|------
description  | The prefix added to all OIDC groups. Sensu appends the groups_prefix with a colon. For example, for the groups_prefix `okta` and the group `dev`, the resulting group name in Sensu is `okta:dev`. Use the groups_prefix when integrating OIDC groups with Sensu RBAC [role bindings and cluster role bindings][13].
required     | false
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
groups_prefix: 'okta:'
{{< /code >}}
{{< code json >}}
{
  "groups_prefix": "okta:"
}
{{< /code >}}
{{< /language-toggle >}}

| username_claim |   |
-------------|------
description  | The claim to use to form the final RBAC user name.
required     | true
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
username_claim: email
{{< /code >}}
{{< code json >}}
{
  "username_claim": "email"
}
{{< /code >}}
{{< /language-toggle >}}

| username_prefix |   |
-------------|------
description  | The prefix added to all OIDC usernames. Sensu appends the username_prefix with a colon. For example, for the username_prefix `okta` and the user `alice`, the resulting username in Sensu is `okta:alice`. Use the username_prefix when integrating OIDC users with Sensu RBAC [role bindings and cluster role bindings][13]. Users _do not_ need to provide the username_prefix when logging in to Sensu.
required     | false
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
username_prefix: 'okta:'
{{< /code >}}
{{< code json >}}
{
  "username_prefix": "okta:"
}
{{< /code >}}
{{< /language-toggle >}}

## Register an Okta application

To use Okta for authentication, register Sensu Go as an OIDC web application.
Before you start, install Sensu Go with a valid commercial license and make sure you have access to the Okta Administrator Dashboard.

Follow the steps in this section to create an Okta application and configure an Okta OIDC provider in Sensu.

### Create an Okta application

{{% notice note %}}
**NOTE**: These instructions are based on the Okta Developer Console.
The steps may be different if you are using the Okta Classic UI.
{{% /notice %}}

1. In the Okta Admin Console, navigate to *Applications*: click `Applications` > `Applications`.
2. Click **Create App Integration**.
3. In the *Create a new app integration* modal window:
    - Select the sign-in method `OIDC - OpenID Connect`.
    - Select the application type `Web Application`.
4. Click **Next**.
5. In the *New Web App Integration* dialog:
    - In the *App integration name* field, enter the app name.
You can also upload a logo if desired.
    - Under *Grant type*, click to select `Refresh Token` in the *Client acting on behalf of a user* list.
    - In the *Sign-in redirect URIs* field, enter `<api_url>/api/enterprise/authentication/v2/oidc/callback`.
    Replace `<api_url>` with your API URL, including the API [port][5] 8080.
    - Under *Assignments*, click to select `Skip group assignment for now`.
6. Click **Save**.
7. Select the *Sign On* tab, scroll to the *OpenID Connect ID Token* section, and click **Edit**.
8. In the *Groups claim filter* section:
    - In the first field, enter `groups`
    - In the dropdown menu, select `Matches regex`
    - In the second field, enter `.*`
9. Click **Save**.
10. Select the *Assignments* tab and assign people and groups to your app.

### Configure an Okta OIDC provider

To create your `okta` OIDC provider in Sensu:

1. For the `additional_scopes` configuration attribute, include `groups` and `email`.

2. For the `client_id` and `client_secret` values, use the *Client ID* and *Client secret*, respectively, listed under *General > Client Credentials* for your Okta application.

3. For the `redirect_uri` attribute, use the *Sign-in redirect URIs* value you entered in step 5 of [Create an Okta application][50].

4. For the `server` value, use the *Okta domain* listed under *General > General Settings* in your Okta application.

5. Set the `disable_offline_access` attribute to your desired value (we recommend `false`).

6. Add your Okta groups to the `groups_claim` string.
For example, if you have an Okta group `groups` and you set the `groups_prefix` to `okta:`, you can set up RBAC objects to mention group `okta:groups` as needed.

7. Set the `username_claim` value to `email`. 

8. Specify `groups_prefix` and `username_prefix` values if desired.

Your Okta OIDC provider configuration should be similar to this example:

{{< language-toggle >}}

{{< code yml >}}
---
type: oidc
api_version: authentication/v2
metadata:
  name: okta
spec:
  additional_scopes:
  - groups
  - email
  client_id: 4sd5jxiwxfvg82PoZ5d7
  client_secret: r78316494besnNCmtmEBnS47ee792f31bf6216
  redirect_uri: http://127.0.0.1:8080/api/enterprise/authentication/v2/oidc/callback
  server: https://dev-459543913.okta.com
  disable_offline_access: false
  groups_claim: groups
  username_claim: email
  groups_prefix: 'oidc:'
  username_prefix: 'oidc:'
{{< /code >}}

{{< code json >}}
{
  "type": "oidc",
  "api_version": "authentication/v2",
  "metadata": {
    "name": "okta"
  },
  "spec": {
    "additional_scopes": [
      "groups",
      "email"
    ],
    "client_id": "4sd5jxiwxfvg82PoZ5d7",
    "client_secret": "r78316494besnNCmtmEBnS47ee792f31bf6216",
    "redirect_uri": "http://127.0.0.1:8080/api/enterprise/authentication/v2/oidc/callback",
    "server": "https://dev-459543913.okta.com",
    "disable_offline_access": false,
    "groups_claim": "groups",
    "username_claim": "email",
    "groups_prefix": "oidc:",
    "username_prefix": "oidc:"
  }
}
{{< /code >}}

{{< /language-toggle >}}

## Configure authorization for OIDC users

Configure [authorization][3] via role-based access control (RBAC) for your OIDC users and groups by creating [roles (or cluster roles)][4] and [role bindings (or cluster role bindings)][13] that map to the user and group names.

   {{% notice note %}}
**NOTE**: If you do not configure authorization, users will be able to log in with OIDC but will have no permissions by default.
{{% /notice %}}

## Use sensuctl to login with OIDC

1. Run `sensuctl login oidc`.

    {{% notice note %}}
**NOTE**: You can also use [`sensuctl configure`](../../../sensuctl/#first-time-setup-and-authentication) and choose the OIDC authentication method to log in to sensuctl with OIDC.
{{% /notice %}}

2. If you are using a desktop, a browser will open to allow you to authenticate and log in.
If a browser does not open, launch a browser to complete the login via your OIDC provider at:

    `https://<api_url>:8080/api/enterprise/authentication/v2/oidc/authorize`

## OIDC troubleshooting

This section lists common OIDC errors and describes possible solutions for each of them.

To troubleshoot any issue with OIDC authentication, start by [increasing the log verbosity][3] of sensu-backend to the [debug log level][5].
Most authentication and authorization errors are only displayed on the debug log level to avoid flooding the log files.

{{% notice note %}}
**NOTE**: If you can't locate any log entries referencing OIDC authentication, run [sensuctl auth list](../sso/#manage-authentication-providers) to make sure that you successfully installed the OIDC provider.
{{% /notice %}}

For provider-specific troubleshooting, read the [Okta][14] or [PingFederate][15] documentation.

### `bad request`

After configuring OIDC access, if you receive a `bad request` error when you open the web UI, you may be using an incorrect port in the redirect URI.

Make sure the redirect URI uses the API port, `8080`.
Confirm that the redirect URI specified in your OIDC provider as well as in the [`redirect_uri` attribute][9] in your Sensu OIDC definition both use port `8080`.
For example, the URL `http://127.0.0.1:8080/api/enterprise/authentication/v2/oidc/callback` uses the correct port.

### `could not find the groups claim in the user's claims`

If you see the following error when you open the web UI, the [`groups_claim`][10] value in your Sensu OIDC definition is incorrect:

{{< code text >}}
{"message":"could not find the groups claim \"okta:groups\" in the user's claims: [\"sub\" \"email\" \"email_verified\"]","code":0}
{{< /code >}}

Update your OIDC definition to specify `groups` as the value for the [`groups_claim` attribute][10].

### No namespaces or resources in the web UI after OIDC sign-in

You must configure [RBAC authorization][3] for your OIDC users and groups by creating [roles (or cluster roles)][4] and [role bindings (or cluster role bindings)][13] that map to the user and group names.

If you do not configure authorization, users will be able to log in with OIDC but will have no permissions, so they will not see any namespaces or resources in the web UI.

### Inconsistent authentication

If you experience inconsistent authentication with OIDC sign-in, such as being unable to sign in after previously signing in successfully, you may have configured more than one OIDC authentication provider.

Run [sensuctl auth list](../sso/#manage-authentication-providers) to make sure that you have only one authentication provider listed for type `OIDC`.
If more than one OIDC authentication provider is listed, use `sensuctl auth delete $NAME` to remove the extra OIDC configuration by name.


[1]: ../../../web-ui/
[2]: ../../../sensuctl/
[3]: ../#authorization
[4]: ../rbac/#roles-and-cluster-roles
[5]: ../../deploy-sensu/install-sensu/#ports
[6]: ../../../commercial/
[7]: ../#use-built-in-basic-authentication
[8]: ../../../api/
[9]: #redirect-uri-attribute
[10]: #groups-claim-attribute
[12]: ../sso/
[13]: ../rbac#role-bindings-and-cluster-role-bindings
[14]: https://help.okta.com/oag/en-us/Content/Topics/Access-Gateway/trouble-shooting-guide.htm
[15]: https://docs.pingidentity.com/bundle/pingfederate-110/page/age1564003028292.html
[17]: ../rbac#namespaced-resource-types
[18]: ../rbac#cluster-wide-resource-types
[19]: ../../maintain-sensu/troubleshoot#log-levels
[25]: #oidc-spec-attributes
[36]: ../../../sensuctl/#first-time-setup-and-authentication
[38]: ../../../sensuctl/create-manage-resources/#create-resources
[41]: https://en.wikipedia.org/wiki/Fully_qualified_domain_name
[42]: https://regex101.com/r/zo9mQU/2
[50]: #create-an-okta-application
[51]: https://www.okta.com/
[52]: https://www.pingidentity.com/en/software/pingfederate.html
[53]: ../../../api/core/users/
[54]: https://etcd.io/
