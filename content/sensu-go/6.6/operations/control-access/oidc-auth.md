---
title: "OpenID Connect 1.0 protocol (OIDC) reference"
linktitle: "OIDC Reference"
reference_title: "OpenID Connect 1.0 protocol (OIDC)"
type: "reference"
description: "In addition to built-in basic authentication, Sensu includes commercial support for single sign-on (SSO) authentication using OpenID Connect 1.0 protocol (OIDC). Read this guide to configure an authentication provider."
weight: 60
version: "6.6"
product: "Sensu Go"
menu:
  sensu-go-6.6:
    parent: control-access
---

{{% notice commercial %}}
**COMMERCIAL FEATURE**: Access OpenID Connect 1.0 protocol (OIDC) authentication for single sign-on (SSO) in the packaged Sensu Go distribution.
For more information, read [Get started with commercial features](../../../commercial/).
{{% /notice %}}

Sensu requires username and password authentication to access the [web UI][1], [API][8], and [sensuctl][2] command line tool.

In addition to the [built-in basic authentication provider][4], Sensu offers [commercial support][6] for single sign-on (SSO) authentication using the OpenID Connect 1.0 protocol (OIDC) on top of the OAuth 2.0 protocol.
The Sensu OIDC provider is tested with [Okta][51] and [PingFederate][52].

For general information about configuring authentication providers, read [Configure single sign-on (SSO) authentication][12].

{{% notice warning %}}
**WARNING**: Defining multiple OIDC providers can lead to inconsistent authentication behavior.
Use `sensuctl auth list` to verify that only one authentication provider of type `OIDC` is defined.
If more than one OIDC auth provider configuration is listed, use `sensuctl auth delete $NAME` to remove the extra OIDC configurations by name.
{{% /notice %}}

## OIDC configuration examples

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
description  | A unique string used to identify the OIDC configuration. The `metadata.name` cannot contain special characters or spaces (validated with Go regex [`\A[\w\.\-]+\z`][42]).
required     | true
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
name: oidc_name
{{< /code >}}
{{< code json >}}
{
  "name": "oidc_name"
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
description  | The OIDC provider application `Client ID`. {{% notice note %}}
**NOTE**: Requires [registering an application in the OIDC provider](#register-an-oidc-application).
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
description  | The OIDC provider application `Client Secret`. {{% notice note %}}
**NOTE**: Requires [registering an application in the OIDC provider](#register-an-oidc-application).
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

| redirect_uri |   |
-------------|------
description  | Redirect URL to provide to the OIDC provider. Requires `/api/enterprise/authentication/v2/oidc/callback` {{% notice note %}}
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
groups_prefix: okta
{{< /code >}}
{{< code json >}}
{
  "groups_prefix": "okta"
}
{{< /code >}}
{{< /language-toggle >}}

| username_claim |   |
-------------|------
description  | The claim to use to form the final RBAC user name.
required     | false
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
username_claim: person
{{< /code >}}
{{< code json >}}
{
  "username_claim": "person"
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
username_prefix: okta
{{< /code >}}
{{< code json >}}
{
  "username_prefix": "okta"
}
{{< /code >}}
{{< /language-toggle >}}

## Register an OIDC application

To use OIDC for authentication, register Sensu Go as an OIDC application.
Use the instructions listed in this section to register an OIDC application for Sensu Go based on your OIDC provider.

- [Okta](#okta)

### Okta

#### Requirements

- Access to the Okta Administrator Dashboard
- Sensu Go with a valid commercial license

#### Create an Okta application

{{% notice note %}}
**NOTE**: These instructions are based on the Okta Classic UI.
The steps may be different if you are using the Okta Developer Console.
{{% /notice %}}

1. In the Okta Administrator Dashboard, start the wizard:<br>select `Applications` > `Add Application` > `Create New App`.
2. In the *Platform* dropdown, select `Web`.
3. In the *Sign on method* section, select `OpenID Connect`.
4. Click **Create**.
5. In the *Create OpenID Connect Integration* window:
   - *GENERAL SETTINGS* section: in the *Application name* field, enter the app name.
You can also upload a logo in the  if desired.
   - *CONFIGURE OPENID CONNECT* section: in the *Login redirect URIs* field, enter `<api_url>/api/enterprise/authentication/v2/oidc/callback`.
    Replace `<api_url>` with your API URL, including the API [port][5] 8080.
6. Click **Save**.
7. Select the *General* tab and click **Edit**.
8. In the *Allowed grant types* section, click to select the box next to **Refresh Token**.
9. Click **Save**.
10. Select the *Sign On* tab.
11. In the *OpenID Connect ID Token* section, click **Edit**.
12. In the *Groups claim filter* section:
    - In the first field, enter `groups`
    - In the dropdown menu, select `matches regex`
    - In the second field, enter `.*`
13. Click **Save**.
14. (Optional) Select the *Assignments* tab to assign people and groups to your app.

#### OIDC provider configuration

1. Add the `additional_scopes` configuration attribute in the [OIDC scope][25] and set the value to `[ "groups" ]`:
   - `"additional_scopes": [ "groups" ]`

2. Add the `groups` to the `groups_claim` string.
For example, if you have an Okta group `groups` and you set the `groups_prefix` to `okta:`, you can set up RBAC objects to mention group `okta:groups` as needed:
   - `"groups_claim": "okta:groups" `

3. Add the `redirect_uri` configuration attribute in the [OIDC scope][25] and set the value to the Redirect URI configured at step 3 of [Create an Okta application][50]:
   - `"redirect_uri": "<api_url>/api/enterprise/authentication/v2/oidc/callback"`

4. Configure [authorization][3] for your OIDC users and groups by creating [roles (or cluster roles)][4] and [role bindings (or cluster role bindings)][13] that map to the user and group names.

   {{% notice note %}}
**NOTE**: If you do not configure authorization, users will be able to log in with OIDC but will have no permissions by default.
{{% /notice %}}

#### Sensuctl login with OIDC

1. Run `sensuctl login oidc`.

    {{% notice note %}}
**NOTE**: You can also use [`sensuctl configure`](../../../sensuctl/#first-time-setup-and-authentication) and choose the OIDC authentication method to log in to sensuctl with OIDC.
{{% /notice %}}

2. If you are using a desktop, a browser will open to `OIDC provider` and allow you to authenticate and log in.
If a browser does not open, launch a browser to complete the login via your OIDC provider at:

    - https://sensu-backend.example.com:8080/api/enterprise/authentication/v2/oidc/authorize


[1]: ../../../web-ui/
[2]: ../../../sensuctl/
[4]: ../#use-built-in-basic-authentication
[3]: ../#authorization
[4]: ../rbac/#roles-and-cluster-roles
[5]: ../../deploy-sensu/install-sensu/#ports
[6]: ../../../commercial/
[8]: ../../../api/
[12]: ../sso/
[13]: ../rbac#role-bindings-and-cluster-role-bindings
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
[53]: ../../../api/users/
[54]: https://etcd.io/
