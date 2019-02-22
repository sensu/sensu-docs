---
title: "Authentication"
description: "In addition to built-in RBAC, Sensu includes enterprise-only support for authentication using a Lightweight Directory Access Protocol (LDAP) provider. Read the guide to configure a provider."
version: "5.0"
product: "Sensu Go"
---

Sensu requires username and password authentication to access the [Sensu dashboard][1], [API][8], and command line tool ([sensuctl][2]).
For Sensu's [default user credentials][3] and more information about configuring Sensu role based access control, see the [RBAC reference][4] and [guide to creating users][5].

In addition to built-in RBAC, [enterprise-only][9] support for authentication using an authentication provider is available in Sensu Go 5.2.0 and later.
See the [upgrading guide][6] to upgrade your Sensu installation, and visit the [latest documentation][7] to configure an authentication provider.

[1]: ../../dashboard/overview
[2]: ../../sensuctl/reference
[3]: ../../reference/rbac#default-user
[4]: ../../reference/rbac
[5]: ../../guides/create-read-only-user
[6]: /sensu-go/latest/installation/upgrade
[7]: /sensu-go/latest/installation/auth
[8]: ../../api/overview
[9]: /sensu-go/latest/getting-started/enterprise
