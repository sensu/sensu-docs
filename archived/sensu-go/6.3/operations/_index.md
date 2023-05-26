---
title: "Operations"
description: "Read Sensu's Operations documentation to install, deploy, and operate Sensu, from local installation through a large-scale deployment with secrets management."
product: "Sensu Go"
version: "6.3"
weight: 20
layout: "single"
toc: true
menu:
  sensu-go-6.3:
    identifier: operations
---

The Operations category will help you get Sensu up and running, from your first installation in your local development environment through a large-scale Sensu deployment using secrets management.
You'll also learn how to keep your Sensu implementation running, with guides for upgrading, monitoring, and troubleshooting.

## Monitoring as code

[Monitoring as code with Sensu][31] explains how to use Sensu’s end-to-end monitoring as code approach to manage your observability configuration the same way you build, test, and deploy your applications and infrastructure.

## Deploy Sensu

[Deploy Sensu][1] describes how to plan, install, configure, and deploy Sensu’s flexible monitoring and observability pipeline.

To plan your Sensu deployment, read the [hardware requirements][6] and [deployment architecture][7] pages.
To start using Sensu locally or in development environments, follow the steps in the [Install Sensu][8] guide.

When you're ready to deploy Sensu in production, learn to [generate certificates][9], [secure your Sensu installation][10], [run a Sensu cluster][11], and [reach multi-cluster visibility][12].
You'll also find guides for scaling your implementation with Sensu's [Enterprise datastore][13] and using [configuration management tools][14] to ensure repeatable Sensu deployments and consistent configuration.

## Control Access

[Control Access][2] explains how Sensu administrators control access by authentication (verifying user identities) and authorization (establishing and managing user permissions for Sensu resources).

Sensu requires username and password authentication to access the web UI, API, and sensuctl command line tool.
Use Sensu’s [built-in basic authentication][15] or configure external authentication providers via [Lightweight Directory Access Protocol (LDAP)][16], [Active Directory (AD)][17], or [OpenID Connect 1.0 protocol (OIDC)][18] to authenticate your Sensu users.

Next, learn to configure authorization for your authenticated Sensu users with [role-based access control (RBAC)][19] and set up user permissions for interacting with Sensu resources.

## Maintain Sensu

[Maintain Sensu][3] includes upgrade, migration, troubleshooting, and license management information to keep your Sensu implementation running smoothly.

Follow our step-by-step instructions to [upgrade to the latest version of Sensu][20] from any earlier version.
If you're still using Sensu Core or Sensu Enterprise, read [Migrate from Sensu Core and Sensu Enterprise to Sensu Go][21].
You can also learn how to activate and and view your commercial [Sensu license][23] or [troubleshoot][22] to identify and resolve problems with your Sensu implementation, from reading and configuring Sensu service logs to using Sensu handlers and filters to test and debug your implementation.

## Monitor Sensu

[Monitor Sensu][4] covers how to [log Sensu services][24], [monitor your Sensu backend][25] with a secondary instance, and [retrieve and process health data][26] for your Sensu cluster.
You can also learn about [Tessen][27], the Sensu call-home service, which helps us understand how Sensu is being used and make informed decisions about product improvements.

## Manage Secrets

[Manage Secrets][5] explains how to [use Sensu’s secrets management][28] to eliminate the need to expose secrets like usernames, passwords, and access keys in your Sensu configuration.
Learn to configure [secrets][29] and [secrets providers][30] resources to obtain secrets from one or more external secrets providers, refer to external secrets, and consume secrets via backend environment variables.


[1]: deploy-sensu/
[2]: control-access/
[3]: maintain-sensu/
[4]: monitor-sensu/
[5]: manage-secrets/
[6]: deploy-sensu/hardware-requirements/
[7]: deploy-sensu/deployment-architecture/
[8]: deploy-sensu/install-sensu/
[9]: deploy-sensu/generate-certificates/
[10]: deploy-sensu/secure-sensu/
[11]: deploy-sensu/cluster-sensu/
[12]: deploy-sensu/use-federation/
[13]: deploy-sensu/scale-event-storage/
[14]: deploy-sensu/configuration-management/
[15]: control-access/#use-built-in-basic-authentication
[16]: control-access/ldap-auth/
[17]: control-access/ad-auth/
[18]: control-access/oidc-auth/
[19]: control-access/create-read-only-user/
[20]: maintain-sensu/upgrade/
[21]: maintain-sensu/migrate/
[22]: maintain-sensu/troubleshoot/
[23]: maintain-sensu/license/
[24]: monitor-sensu/log-sensu-systemd/
[25]: monitor-sensu/monitor-sensu-with-sensu/
[26]: monitor-sensu/health/
[27]: monitor-sensu/tessen/
[28]: manage-secrets/secrets-management/
[29]: manage-secrets/secrets/
[30]: manage-secrets/secrets-providers/
[31]: monitoring-as-code/
