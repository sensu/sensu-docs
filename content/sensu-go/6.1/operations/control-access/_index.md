---
title: "Control Access"
description: "Set up access control for Sensu, the flexible observability pipeline. Read these documents to authenticate to Sensu and authorize access for Sensu users."
product: "Sensu Go"
version: "6.1"
weight: 20
layout: "single"
toc: true
menu:
  sensu-go-6.1:
    parent: operations
    identifier: control-access
---

Sensu administrators control access by authentication and authorization.

Authentication means verifying user identities: confirming that users are who they say they are.
Sensu requires username and password authentication to access the web UI, API, and sensuctl command line tool.
You can use Sensu's [built-in basic authentication provider][14] or configure [external authentication providers][15].

{{% notice note %}}
**NOTE**: For API-specific authentication, see the [API overview](../../../api/#access-control) and [Use API keys to authenticate to Sensu](../use-apikeys/).
{{% /notice %}}

Authorization means managing user access and permissions: determining which users can access which Sensu resources.
Configure authorization with [role-based access control (RBAC)][2] to exercise fine-grained control over how they interact with Sensu resources.

## Authentication

Administrators can use Sensu's [built-in basic authentication provider][14] or configure [external authentication providers][15] to authenticate via Lightweight Directory Access Protocol (LDAP), Active Directory (AD), or OpenID Connect 1.0 protocol (OIDC).

### Use built-in basic authentication

Sensu's built-in basic authentication provider allows you to create and manage user credentials (usernames and passwords) with the [users API][53], either directly or using [sensuctl][2].
The basic authentication provider does not depend on external services and is not configurable.

Sensu records basic authentication credentials in [etcd][54].

### Use an authentication provider

**COMMERCIAL FEATURE**: Access authentication providers in the packaged Sensu Go distribution.
For more information, see [Get started with commercial features][6].

In addition to built-in authentication, Sensu includes commercial support for authentication using external authentication providers via [Lightweight Directory Access Protocol (LDAP)][44], [Active Directory (AD)][37], or [OpenID Connect 1.0 protocol (OIDC)][7].

#### Configure authentication providers

**1. Write an authentication provider configuration definition**

For standards-compliant LDAP tools like OpenLDAP, see the [LDAP configuration examples][29] and [specification][30].
For Microsoft AD, see the [AD configuration examples][31] and [specification][32].

**2. Apply the configuration with sensuctl**

Log in to sensuctl as the [default admin user][3] and apply the configuration to Sensu:

{{< code shell >}}
sensuctl create --file filename.json
{{< /code >}}

Use sensuctl to verify that your provider configuration was applied successfully:

{{< code shell >}}
sensuctl auth list

 Type     Name    
────── ────────── 
 ldap   openldap  
{{< /code >}}

#### Manage authentication providers

View and delete authentication providers with the [authentication providers API][27] or these sensuctl commands.

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

## Authorization

After you set up authentication, configure authorization via [role-based access control (RBAC)][4] to give those users permissions within Sensu.
Sensu RBAC allows you to manage and access users and resources based on namespaces, groups, roles, and bindings.
See [Create a read-only user][5] for an example.

- **Namespaces** partition resources within Sensu.
Sensu entities, checks, handlers, and other [namespaced resources][17] belong to a single namespace.
- **Roles** create sets of permissions (like GET and DELETE) tied to resource types.
**Cluster roles** apply permissions across namespaces and include access to [cluster-wide resources][18] like users and namespaces. 
- **Role bindings** assign a role to a set of users and groups within a namespace.
**Cluster role bindings** assign a cluster role to a set of users and groups cluster-wide.

To enable permissions for external users and groups within Sensu, you can create a set of [roles, cluster roles][11], [role bindings, and cluster role bindings][13] that map to the usernames and group names in your authentication provider.


[1]: ../../../web-ui/
[2]: ../../../sensuctl/
[3]: ../rbac#default-users
[4]: ../rbac/
[5]: ../create-read-only-user/
[6]: ../../../commercial/
[7]: ../oidc-auth/
[8]: ../../../api/
[10]: https://docs.microsoft.com/en-us/azure/active-directory-domain-services/tutorial-configure-ldaps
[11]: ../rbac#roles-and-cluster-roles
[13]: ../rbac#role-bindings-and-cluster-role-bindings
[14]: #use-built-in-basic-authentication
[15]: #use-an-authentication-provider
[17]: ../rbac#namespaced-resource-types
[18]: ../rbac#cluster-wide-resource-types
[19]: ../../maintain-sensu/troubleshoot#log-levels
[21]: ../ldap-auth/#ldap-group-search-attributes
[22]: ../ldap-auth/#ldap-user-search-attributes
[23]: ../ad-auth/#ad-metadata-attributes
[24]: ../ldap-auth/#ldap-metadata-attributes
[25]:  ../oidc-auth/#oidc-spec-attributes
[27]: ../../../api/authproviders/
[29]: ../ldap-auth/#ldap-configuration-examples
[30]: ../ldap-auth/#ldap-specification
[31]: ../ad-auth/#ad-configuration-examples
[32]: ../ad-auth/#ad-specification
[33]: ../rbac/#example-workflows
[34]: #groups-prefix
[35]: #username-prefix
[36]: ../../../sensuctl/#first-time-setup
[37]: ../ad-auth/
[38]: ../../../sensuctl/create-manage-resources/#create-resources
[40]: ../ldap-auth/#ldap-server-attributes
[44]: ../ldap-auth/
[53]: ../../../api/users/
[54]: https://etcd.io/
