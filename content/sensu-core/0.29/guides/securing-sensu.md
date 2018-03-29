---
title: "Securing Sensu"
description: "Strategies and best practices for securing Sensu"
version: "0.29"
weight: 5
menu:
  sensu-core-0.29:
    parent: guides
---

In this guide, we'll walk you through the best practices and strategies for securing Sensu and its various components. By the end of the guide, you should have a thorough understanding of what goes into securing all of the pieces that make up a Sensu deployment, including:

* How to secure your Sensu clients
* How to secure your Sensu Server/API/Enterprise instance(s)
* How to secure Uchiwa/the Sensu Enterprise Dashboard
* How to secure RabbitMQ
* How to Secure Redis

## Objectives
We'll cover the following in this guide:

  - [Securing Sensu](#securing-sensu)
    - [The `client_signature` Attribute](#the-clientsignature-attribute)
    - [The `redact` Attribute](#the-redact-attribute)
  - [Securing Dashboards](#securing-dashboards)
    - [Securing Uchiwa](#securing-uchiwa)
    - [Securing Sensu Enterprise Dashboards](#securing-sensu-enterprise-dashboards)
  - [Securing RabbitMQ](#securing-rabbitmq)
    - [Minimum Viable Permissions](#minimum-viable-permissions)
    - [SSL/TLS Configuration](#ssltls-configuration)
  - [Securing Redis](#securing-redis)

## Securing Sensu
### The `client_signature` Attribute{#the-clientsignature-attribute}


### The `redact` Attribute

## Securing Dashboards 
We'll cover some strategies for how you can secure your dashboard with Sensu, whether you're using Uchiwa or Sensu Enterprise. 
### Securing Uchiwa 
Uchiwa provides two primary mechanisms for securing the dashboard:

* Encrypted passwords
* SSL/TLS

For more details on how to secure your Uchiwa instance using these two features, see [Uchiwa's site](https://docs.uchiwa.io/guides/security/).

### Securing Sensu Enterprise Dashboards
The Sensu Enterprise Dashboard provides the same mechanisms for securing it as Uchiwa, but adds the more "enterprise-y" feature of role based access control (RBAC)

* SSL/TLS
* RBAC

#### SSL/TLS Configuration

#### RBAC


## Securing RabbitMQ
As the supported transport mechanism for any Sensu deployment, RabbitMQ has its own set of security concerns, from ensuring that VHOST permissions are set correctly, to adding SSL/TLS encryption between clients, consumers, and queues. 
### Minimum Viable Permissions

### SSL/TLS Configuration


## Securing Redis
Similar to RabbitMQ, securing Redis is a concern in any environment. Let's take a look at what is needed to ensure that we have Redis locked down tight. 

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