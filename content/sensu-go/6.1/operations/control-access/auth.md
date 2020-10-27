---
title: "Configure basic authentication to access Sensu"
linktitle: "Configure Basic Authentication"
description: "Use Sensu's built-in basic authentication to access the Sensu web UI, API, and sensuctl command line tool. Read this guide to configure a basic authentication provider."
weight: 10
version: "6.1"
product: "Sensu Go"
menu:
  sensu-go-6.1:
    parent: control-access
---

Sensu requires username and password authentication to access the [Sensu web UI][1], [API][8], and [sensuctl][2] command line tool.
You can use Sensu's built-in basic authentication provider or configure external authentication providers to authenticate via Lightweight Directory Access Protocol (LDAP), Active Directory (AD), or OpenID Connect 1.0 protocol (OIDC).

## Use built-in basic authentication

Sensu's built-in basic authentication provider allows you to create and manage user credentials (usernames and passwords) with the [users API][53], either directly or using [sensuctl][2].
The basic authentication provider does not depend on external services and is not configurable.

Sensu records basic authentication credentials in [etcd][54].

## Use an authentication provider

**COMMERCIAL FEATURE**: Access authentication providers in the packaged Sensu Go distribution.
For more information, see [Get started with commercial features][6].

In addition to built-in authentication and RBAC, Sensu includes commercial support for authentication using external authentication providers, including [Microsoft Active Directory (AD)][37] and standards-compliant [Lightweight Directory Access Protocol (LDAP)][44] tools like OpenLDAP.

### Manage authentication providers

View and delete authentication providers with sensuctl and the [authentication providers API][27]
To set up an authentication provider for Sensu, see [Configure authentication providers][28].

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

### Configure authentication providers

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

**3. Integrate with Sensu RBAC**

Now that you've configured an authentication provider, you'll need to configure Sensu RBAC to give those users permissions within Sensu.
Sensu RBAC allows you to manage and access users and resources based on namespaces, groups, roles, and bindings.
See the [RBAC reference][4] for more information about configuring permissions in Sensu and [implementation examples][33].

- **Namespaces** partition resources within Sensu.
Sensu entities, checks, handlers, and other [namespaced resources][17] belong to a single namespace.
- **Roles** create sets of permissions (like GET and DELETE) tied to resource types.
**Cluster roles** apply permissions across namespaces and include access to [cluster-wide resources][18] like users and namespaces. 
- **Role bindings** assign a role to a set of users and groups within a namespace.
**Cluster role bindings** assign a cluster role to a set of users and groups cluster-wide.

To enable permissions for external users and groups within Sensu, create a set of [roles, cluster roles][11], [role bindings, and cluster role bindings][13] that map to the usernames and group names found in your authentication providers.

Make sure to include the [group prefix][34] and [username prefix][35] when creating Sensu role bindings and cluster role bindings.
Without an assigned role or cluster role, users can sign in to the Sensu web UI but can't access any Sensu resources.

**4. Log in to Sensu**

After you configure the correct roles and bindings, log in to [sensuctl][36] and the [Sensu web UI][1] using your single-sign-on username and password (no prefix required).


[1]: ../../../web-ui/
[2]: ../../../sensuctl/
[3]: ../rbac#default-users
[4]: ../rbac/
[5]: ../create-read-only-user/
[6]: ../../../commercial/
[7]: https://www.openldap.org/
[8]: ../../../api/
[11]: ../rbac#roles-and-cluster-roles
[13]: ../rbac#role-bindings-and-cluster-role-bindings
[17]: ../rbac#namespaced-resource-types
[18]: ../rbac#cluster-wide-resource-types
[27]: ../../../api/authproviders/
[28]: #configure-authentication-providers
[29]: #ldap-configuration-examples
[30]: #ldap-specification
[31]: #ad-configuration-examples
[32]: #ad-specification
[33]: ../rbac/#example-workflows
[34]: #groups-prefix
[35]: #username-prefix
[36]: ../../../sensuctl/#first-time-setup
[37]: #active-directory-ad-authentication
[38]: ../../../sensuctl/create-manage-resources/#create-resources
[39]: #ldap-spec-attributes
[40]: #ldap-server-attributes
[41]: https://en.wikipedia.org/wiki/Fully_qualified_domain_name
[42]: https://regex101.com/r/zo9mQU/2
[43]: #ldap-binding-attributes
[44]: #lightweight-directory-access-protocol-ldap-authentication
[45]: #ad-spec-attributes
[46]: #ad-server-attributes
[47]: #ad-group-search-attributes
[48]: #ad-user-search-attributes
[49]: #ldap-troubleshooting
[50]: #create-an-okta-application
[51]: https://www.okta.com/
[52]: https://www.pingidentity.com/en/software/pingfederate.html
[53]: ../../../api/users/
[54]: https://etcd.io/
