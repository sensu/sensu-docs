---
title: "Control Access"
description: "Set up access control for Sensu, the flexible observability pipeline. Read these documents to authenticate to Sensu and authorize access for Sensu users."
product: "Sensu Go"
version: "5.18"
weight: 20
layout: "single"
toc: false
menu:
  sensu-go-5.18:
    parent: operations
    identifier: control-access
---

The Control Access section describes how to authenticate identities and authorize access for your Sensu users.

[Configure authentication][1] to use Sensu's built-in basic authentication provider or external authentication providers to authenticate via Lightweight Directory Access Protocol (LDAP), Active Directory (AD), or OpenID Connect.
Then, use [role-based access control (RBAC)][2] to exercise fine-grained control over how Sensu users interact with Sensu resources.


[1]: auth/
[2]: create-read-only-user/
