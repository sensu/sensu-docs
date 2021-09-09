---
title: "Maintain Sensu"
description: "Read about how to maintain and troubleshoot your Sensu installation, including upgrading to the latest Sensu version."
product: "Sensu Go"
version: "6.5"
weight: 30
layout: "single"
toc: true
menu:
  sensu-go-6.5:
    parent: operations
    identifier: maintain-sensu
---

The Maintain Sensu category includes information to keep your Sensu installation up-to-date and running smoothly.

## Upgrade or migrate

Follow the [upgrade guide][1] for step-by-step instructions to upgrade to the latest version of Sensu from any earlier version.
The upgrade instructions include details about important changes between versions that could affect your upgrade and any special requirements to make sure your upgrade is successful.

If you are still using Sensu Core or Sensu Enterprise, follow [Migrate from Sensu Core and Sensu Enterprise to Sensu Go][2] to upgrade to Sensu Go.
The migrate guide includes links to Sensu's migration resources and Core and Enterprise configuration translation tools, as well as instructions for [installing Sensu Go alongside your existing Sensu Core or Enterprise instance][3].

## Troubleshoot

Use the Sensu [troubleshooting guide][4] to diagnose and resolve common problems, and read about [tuning options][11] for specific performance issues.
Learn how to read, configure, and find the [logs produced by Sensu services][6].
Sensu log messages can help you identify and solve [backend startup errors][7] and [permissions issues][8].

The troubleshooting guide also describes how to [use Sensu handlers and filters to test and debug your observability pipeline][9] and diagnose problems related to [dynamic runtime assets][10].

## Manage license

Read the [license reference][5] to learn how to activate your commercial license.
The license reference also explains how to view your license details and expiration date and find your current entity count and limits.


[1]: upgrade/
[2]: migrate/
[3]: migrate/#step-by-step-migration-instructions
[4]: troubleshoot/
[5]: license/
[6]: troubleshoot/#service-logging
[7]: troubleshoot/#sensu-backend-startup-errors
[8]: troubleshoot/#permission-issues
[9]: troubleshoot/#handlers-and-event-filters
[10]: troubleshoot/#dynamic-runtime-assets
[11]: tune/
