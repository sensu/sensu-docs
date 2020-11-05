---
title: "Manage Secrets"
description: "Sensu's secrets management allows you to avoid exposing secrets like usernames and passwords in your Sensu configuration."
product: "Sensu Go"
version: "5.19"
weight: 50
layout: "single"
toc: false
menu:
  sensu-go-5.19:
    parent: operations
    identifier: manage-secrets
---

Use Sensu’s [secrets management][1] to obtain secrets like usernames and passwords from external secrets providers so that you can both refer to external secrets and consume secrets via backend environment variables without exposing them in your Sensu configuration.


[1]: secrets-management/
