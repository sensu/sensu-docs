---
title: "Monitor and maintain multiple servers"
linkTitle: "Monitor Multiple Servers"
guide_title: "Monitor and maintain multiple servers"
type: "guide"
description: "Sensu lets you monitor multiple servers with different subscriptions and maintain them with configuration management tools like Puppet. Read this guide to learn how to set up subscriptions and configuration management to monitor servers."
weight: 45
version: "6.2"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-6.2:
    parent: observe-schedule
---

With [subscriptions][1], you can set up monitoring and observability for multiple servers with different operating systems and monitoring requirements.
You can also use a [configuration management][2] tool like Puppet, Ansible, or Chef to deploy Sensu in production and at scale.

This guide describes how to configure Sensu monitoring for multiple servers and use Puppet to manage the Sensu configuration based on the following requirements:

- 10 Linux servers:
    - Get CPU, memory, and disk status for all 10
    - Get NGINX metrics for five
    - Get PostgreSQL metrics for two
    - Email all notifications to `linuxadmin@gmail.com`
    - Email notifications for NGINX metrics to `nginx@gmail.com`
    - Email notifications for PostgreSQL metrics to `postgresql@gmail.com`
- 10 Windows servers:
    - Get CPU, memory, and disk checks for all 10
    - Get SQL Server metrics for two
    - Email all notifications to `winadmin@gmail.com`
    - Email notifications for SQL Server metrics to email address `sqlserver@gmail.com`

To follow this guide, you will need a running Sensu backend, Sensu agents running for each server, and sensuctl configured for the admin user as described in the [instructions to install Sensu][3].

## Required Sensu resources

The example monitoring scheme requires a number of checks, filters, and handlers.

The required checks are:
- CPU status
- Memory status
- Disk status
- NGINX metrics
- PostgreSQL metrics
- SQL Server metrics

The required filters are:
- Sensu query expression (SQE)-based filters ???

The required handlers are:
- Email handlers for linuxadmin@gmail.com, nginx@gmail.com, and postgresql@gmail.com
- Email handlers for winadmin@gmail.com and sqlserver@gmail.com
- Handler set for Linux that includes the handlers for linuxadmin@gmail.com, nginx@gmail.com, and postgresql@gmail.com
- Handler set for Windows that includes the handlers for winadmin@gmail.com and sqlserver@gmail.com

## Subscriptions

Use the following subscriptions to ensure that Sensu publishes checks to the correct entities:

Subscription | Entities | Checks
------------ | -------- | ------
linux | All Linux servers | CPU, memory, and disk status checks
nginx | Five Linux servers that require NGINX metrics collection | NGINX metrics check
postgresql | Two Linux servers that require PostgreSQL metrics collection | PostgreSQL metrics check
windows | All Windows servers | CPU, memory, and disk status checks
sqlserver | Two Windows servers that require SQL Server metrics collection | SQL Server metrics check

## Configuration management with Puppet

Need example configuration


[1]: ../subscriptions/
[2]: ../../../operations/deploy-sensu/configuration-management/
[3]: ../../../operations/deploy-sensu/install-sensu/
[5]: ../../observe-entities/monitor-external-resources/
[6]: ../../observe-process/send-slack-alerts/
[7]: https://bonsai.sensu.io/assets/sensu/sensu-ruby-runtime
[8]: ../subscriptions/
[9]: ../../observe-process/send-pagerduty-alerts/
[10]: ../../observe-process/handlers/
[11]: ../../../operations/monitoring-as-code/#build-as-you-go
[12]: ../../../operations/monitoring-as-code/
[13]: ../../observe-process/send-email-alerts/
[14]: https://bonsai.sensu.io/
[15]: https://bonsai.sensu.io/assets/ncr-devops-platform/nagiosfoundation
[16]: https://github.com/ncr-devops-platform/nagiosfoundation/blob/master/cmd/check_service/README.md
[17]: ../../../sensuctl/
