---
title: "Securing Sensu"
description: "Strategies and best practices for securing Sensu"
version: "0.29"
weight: 5
menu:
  sensu-core-0.29:
    parent: guides
---
# Securing Sensu
In this guide, we'll walk you through the best practices and strategies for securing Sensu and its various components. By the end of the guide, you should have a thorough understanding of what goes into securing all of the pieces that make up a Sensu deployment. 

## Objectives
We'll cover the following in this guide:

- [Securing Sensu](#securing-sensu)
  - [Objectives](#objectives)
  - [Sensu {#securing-sensu}](#sensu-securing-sensu)
    - [The `client_signature` Attribute](#the-clientsignature-attribute)
    - [The `redact` Attribute](#the-redact-attribute)
  - [Dashboards {#securing-dashboards}](#dashboards-securing-dashboards)
    - [Securing Uchiwa](#securing-uchiwa)
    - [Securing Sensu Enterprise Dashboards](#securing-sensu-enterprise-dashboards)
  - [RabbitMQ {#securing-rabbitmq}](#rabbitmq-securing-rabbitmq)
    - [Minimum Viable Permissions](#minimum-viable-permissions)
  - [Redis {#securing-redis}](#redis-securing-redis)

## Sensu {#securing-sensu}
### The `client_signature` Attribute

### The `redact` Attribute

## Dashboards {#securing-dashboards}
### Securing Uchiwa 
Uchiwa provides two primary mechanisms for securing the dashboard:
* Encrypted passwords
* HTTPS Encryption
For more details on how to secure your Uchiwa instance using these two features, see [Uchiwa's site](https://docs.uchiwa.io/guides/security/).

### Securing Sensu Enterprise Dashboards

## RabbitMQ {#securing-rabbitmq}
As the supported transport mechanism for any Sensu deployment, RabbitMQ 
### Minimum Viable Permissions

### SSL/TLS Configuration



## Redis {#securing-redis}


[1]:
[2]:
[3]:
[4]:
[5]:
[6]:
[7]:
[8]:
[9]:
[10]: