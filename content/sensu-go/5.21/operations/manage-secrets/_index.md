---
title: "Manage Secrets"
description: "Sensu's secrets management allows you to avoid exposing secrets like usernames and passwords in your Sensu configuration."
product: "Sensu Go"
version: "5.21"
weight: 50
layout: "single"
toc: false
menu:
  sensu-go-5.21:
    parent: operations
    identifier: manage-secrets
---

Sensu's secrets management eliminates the need to expose secrets like usernames, passwords, and access keys in your Sensu configuration.
Secrets management is available for Sensu handler, mutator, and check resources.

The [Sensu Go commercial distribution][2] includes a built-in secrets provider, `Env`, that exposes secrets from environment variables on your Sensu backend nodes.
You can also use the secrets provider `VaultProvider` to authenticate via the HashiCorp Vault integration.

Secrets are configured via secrets resources.
A secret resource definition refers to the secrets provider (`Env` or `VaultProvider`) and an ID (the named secret to fetch from the secrets provider).

[Use secrets management in Sensu][1] explains how to use Sensu's built-in secrets provider (`Env`) or HashiCorp Vault as your external secrets provider and authenticate without exposing your secrets.
Follow this guide to set up your PagerDuty Integration Key as a secret and create a PagerDuty handler definition that requires the secret.
Your Sensu backend will be able to execute the handler with any check.


[1]: secrets-management/
[2]: ../../commercial/
