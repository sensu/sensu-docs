---
title: "RBAC for OpenID Connect (OIDC)"
linkTitle: "RBAC for OpenID Connect"
description: "Reference documentation for the Sensu Enterprise Dashboard Role Based Access Controls (RBAC) for OpenID Connect (OIDC)"
product: "Sensu Enterprise Dashboard"
version: "2.12"
weight: 3
menu:
  sensu-enterprise-dashboard-2.12:
    parent: rbac
---
**ENTERPRISE: Role based access controls are available for [Sensu Enterprise][3]
users only.**

## Reference Documentation

- [What is RBAC for OIDC?](#what-is-rbac-for-oidc)
- [RBAC for OIDC configuration](#rbac-for-oidc-configuration)
  - [Example RBAC for OIDC definition](#example-rbac-for-oidc-definition)
  - [RBAC for OIDC definition specification](#rbac-for-oidc-definition-specification)
    - [`oidc` attributes](#oidc-attributes)
    - [`roles` attributes](#roles-attributes)
- [Register an OIDC Application](#register-an-oidc-application)
  - [Okta](#okta)
  - [PingFederate](#pingfederate)

## What is RBAC for OIDC?

The Sensu Enterprise Dashboard offers support for built-in [Role Based Access
Controls (RBAC)][0], which depends on using some external source of truth for
authentication. The Sensu Enterprise Dashboard RBAC for OIDC driver provides
support for using the OpenID Connect 1.0 protocol (OIDC) on top of the OAuth 2.0
protocol for RBAC authentication.

## RBAC for OIDC configuration

### Example RBAC for OIDC definition

{{< highlight json >}}
{
  "dashboard": {
    "host": "0.0.0.0",
    "port": 3000,
    "...": "",
    "oidc": {
      "additionalScopes": [ "groups" ],
      "clientId": "a8e43af034e7f2608780",
      "clientSecret": "b63968394be6ed2edb61c93847ee792f31bf6216",
      "insecure": false,
      "redirectURL": "http://127.0.0.1:4000/login/callback",
      "server": "https://localhost:9031",
      "roles": [
        {
          "name": "guests",
          "members": [
            "myorganization/guests"
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
            "myorganization/operators"
          ],
          "datacenters": [],
          "subscriptions": [],
          "readonly": false
        }
      ]
    }    
  }
}
{{< /highlight >}}

### RBAC for OIDC definition specification

#### `oidc` attributes

additionalScopes | 
-----------------|------
description      | Scopes to include in the claims, in addition to the default `email`, `openid` and `profile` scopes. _NOTE: only required for certain OIDC providers, such as Okta._
required         | false
type             | Array
example          | {{< highlight shell >}}"additionalScopes": [ "groups" ]{{< /highlight >}}

clientId     | 
-------------|------
description  | The OIDC provider application "Client ID" _NOTE: requires [registration of an application in the OIDC provider][4]._
required     | true
type         | String
example      | {{< highlight shell >}}"clientId": "a8e43af034e7f2608780"{{< /highlight >}}

clientSecret | 
-------------|------
description  | The OIDC provider application "Client Secret" _NOTE: requires [registration of an application in the OIDC provider][4]._
required     | true
type         | String
example      | {{< highlight shell >}}"clientSecret": "b63968394be6ed2edb61c93847ee792f31bf6216"{{< /highlight >}}

insecure     | 
-------------|------
description  | Determines whether or not to skip SSL certificate verification (e.g. for self-signed certificates).
required     | false
type         | Boolean
default      | false
example      | {{< highlight shell >}}"insecure": true{{< /highlight >}}

redirectURL  | 
-------------|------
description  | Redirect URL to provide to the OIDC provider. _NOTE: only required for certain OIDC providers, such as Okta._
required     | false
type         | String
example      | {{< highlight shell >}}"redirectURL": "http://localhost:4000/login/callback"{{< /highlight >}}

server       | 
-------------|------
description  | The location of the OIDC server you wish to authenticate against.
required     | true
type         | String
example      | {{< highlight shell >}}"server": "https://localhost:9031"{{< /highlight >}}

roles        | 
-------------|------
description  | An array of [`roles` definitions][1].
required     | true
type         | Array
example      | {{< highlight shell >}}"roles": [
  {
    "name": "guests",
    "members": [
      "myorganization/guests"
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
      "myorganization/operators"
    ],
    "datacenters": [],
    "subscriptions": [],
    "readonly": false
  }
]
{{< /highlight >}}

#### `roles` attributes

Please see the [RBAC definition specification][2] for information on how to
configure RBAC roles.

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

1. Add the `additionalScopes` configuration attribute in the [OIDC scope][5] and set the value to `[ "groups" ]`, just like this:

   >  `"additionalScopes": [ "groups" ]`
2. Add the `redirectURL` configuration attribute in the [OIDC scope][5] and set
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

#### Configure the Sensu Enterprise Dashboard

From this point, the PingFederate configuration is completed the only thing
left is to configure the [OIDC attributes][5] in Sensu Enterprise. For
reference, if you followed this guide, the `clientId` should be
`SensuEnterpriseClient` and the `clientSecret` has been provided when you
[generated a secret][6] earlier.

[?]:  #
[0]:  ../overview
[1]:  #roles-attributes
[2]:  ../overview#roles-attributes
[3]:  /sensu-enterprise
[4]:  #register-an-oidc-application
[5]:  #oidc-attributes
[6]:  #create-the-application
