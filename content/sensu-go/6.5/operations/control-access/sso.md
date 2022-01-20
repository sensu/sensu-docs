---
title: "Configure single sign-on (SSO) authentication"
linktitle: "Configure SSO Authentication"
description: "In addition to built-in basic authentication, Sensu includes commercial support for single sign-on (SSO) authentication using Lightweight Directory Access Protocol (LDAP), Active Directory (AD), or OpenID Connect 1.0 protocol (OIDC). Read this guide to configure an SSO authentication provider."
weight: 10
version: "6.5"
product: "Sensu Go"
menu:
  sensu-go-6.5:
    parent: control-access
---

{{% notice commercial %}}
**COMMERCIAL FEATURE**: Access authentication providers for single sign-on (SSO) in the packaged Sensu Go distribution.
For more information, read [Get started with commercial features](../../../commercial/).
{{% /notice %}}

Sensu requires username and password authentication to access the [web UI][1], [API][3], and [sensuctl][2] command line tool.

In addition to the [built-in basic authentication provider][4], Sensu offers [commercial support][5] for using Lightweight Directory Access Protocol (LDAP), Active Directory (AD), or OpenID Connect 1.0 protocol (OIDC) for single sign-on (SSO) authentication.

This guide describes general information for configuring an authentication provider for SSO.
Read the [LDAP][8], [AD][6], or [OIDC][7] reference documentation for provider-specific examples and specifications.

## Configure authentication providers

To configure an external authentication provider for SSO, first write an authentication provider configuration definition.
Follow the examples and specifications for your provider:

- **Lightweight Directory Access Protocol (LDAP)**, including standards-compliant tools like OpenLDAP ([configuration examples][11] and [specification][13])
- **Microsoft Active Directory (AD)**, including Azure AD ([configuration examples][14] and [specification][15])
- **OpenID Connect 1.0 protocol (OIDC)**, including tools like Okta and PingFederate ([configuration examples][9] and [specification][12])

Save your configuration definition to a file, such as `authconfig.yaml` or `authconfig.json`.

After you have a saved configuration definition, you can apply the configuration with sensuctl.
Log in to sensuctl as the [default admin user][3] and use sensuctl to apply your authentication provider configuration to Sensu:

{{< language-toggle >}}

{{< code shell "YML" >}}
sensuctl create --file authconfig.yml
{{< /code >}}

{{< code shell "JSON" >}}
sensuctl create --file authconfig.json
{{< /code >}}

{{< /language-toggle >}}

Use sensuctl to verify that your provider configuration was applied successfully:

{{< code shell >}}
sensuctl auth list
{{< /code >}}

The response will list your authentication provider types and names:

{{< code shell >}}
 Type     Name    
────── ────────── 
 ldap   openldap  
{{< /code >}}

## Manage authentication providers

View and delete authentication providers with [enterprise/authentication/v2 API endpoints][10] or these sensuctl commands.

To view active authentication providers:

{{< code shell >}}
sensuctl auth list
{{< /code >}}

To view configuration details for an authentication provider named `openldap`:

{{< code shell >}}
sensuctl auth info openldap
{{< /code >}}

To delete an authentication provider named `openldap`:

{{< code shell >}}
sensuctl auth delete openldap
{{< /code >}}


[1]: ../../../web-ui/
[2]: ../../../sensuctl/
[3]: ../../../api/
[4]: ../#use-built-in-basic-authentication
[5]: ../../../commercial/
[6]: ../ad-auth/
[7]: ../oidc-auth/
[8]: ../ldap-auth/
[9]: ../oidc-auth/#oidc-configuration-examples
[10]: ../../../api/enterprise/authproviders/
[11]: ../ldap-auth/#ldap-configuration-examples
[12]: ../oidc-auth/#oidc-specification
[13]: ../ldap-auth/#ldap-specification
[14]: ../ad-auth/#ad-configuration-examples
[15]: ../ad-auth/#ad-specification
