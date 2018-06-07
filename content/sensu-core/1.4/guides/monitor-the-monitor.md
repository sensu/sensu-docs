---
title: "Monitoring Sensu with Sensu"
description: "Strategies and best practices for monitoring Sensu with Sensu"
version: "1.4"
weight: 10
next: ../securing-rabbitmq-guide
menu:
  sensu-core-1.4:
    parent: guides
---

In this guide, we'll walk you through the best practices and strategies for monitoring Sensu with Sensu. By the end of the guide, you should have a thorough understanding of what is required to ensure your Sensu components are properly monitored, including:

* How to monitor your Sensu server/API/Enterprise/Dashboard instance(s)
* How to monitor your RabbitMQ instance(s)
* How to monitor your Redis instance(s)

## Objectives

We'll cover the following in this guide:

* [Monitoring Sensu](#monitoring-sensu)
  * [Monitoring Sensu Server](#monitoring-sensu-server)
  * [Monitoring Sensu API](#monitoring-sensu-api)
  * [Monitoring Sensu Enterprise](#monitoring-sensu-enterprise)
  * [Monitoring Sensu Enterprise Dashboard](#monitoring-sensu-enterprise-dashboard)
  * [Monitoring Uchiwa](#monitoring-sensu-uchiwa)
* [Monitoring RabbitMQ](#monitoring-RabbitMQ)
* [Monitoring Redis](#monitoring-redis)

## Monitoring Sensu

### Monitoring Sensu Server{#monitoring-sensu-server}

The server running the sensu-server process will need to be monitored in two general ways:

* Locally by a sensu-client process (OS metrics, OS checks, etc)
* Remotely from an entirely independent Sensu stack (due to if the sensu-server process is down, it won't be able to alert)

#### Monitoring Sensu Server Locally

Monitoring the server that the sensu-server process runs on should be monitored just like any other node in your infastructure. This includes, but not limited to, checks and metrics for CPU, memory, disk, and networking.

#### Monitoring Sensu Server Remotely

To monitor the Sensu Server process, you will need another independent Sensu stack that can reach in. This can be done using a network port check or reaching out to an API endpoint (TODO: need to confirm)

Show example check that hits the /health API endpoint:

http://localhost:1313/sensu-core/1.4/api/health-and-info/#reference-documentation

### Monitoring Sensu API{#monitoring-sensu-api}

Standard port

{{< highlight json >}}
{
  "checks": {
    "check_sensu_server_port": {
      "command": "check-ports.rb -p 4567",
      "subscribers": [
        "proxy"
      ],
      "interval": 60
    }
  }
}
{{< /highlight >}}


### Monitoring Sensu Enterprise{#monitoring-sensu-enterprise}

Unsecure port

{{< highlight json >}}
{
  "checks": {
    "check_sensu_api_port": {
      "command": "check-ports.rb -p 4567",
      "subscribers": [
        "proxy"
      ],
      "interval": 60
    }
  }
}
{{< /highlight >}}

Secure port (Sensu Enterprise only?)

{{< highlight json >}}
{
  "checks": {
    "check_sensu_secure_api_port": {
      "command": "check-ports.rb -p 4568",
      "subscribers": [
        "proxy"
      ],
      "interval": 60
    }
  }
}
{{< /highlight >}}


Secure API keystore

https://github.com/sensu-plugins/sensu-plugins-ssl/blob/master/bin/check-java-keystore-cert.rb

### Monitoring Sensu Enterprise Dashboard{#monitoring-sensu-enterprise-dashboard}

https://github.com/sensu-plugins/sensu-plugins-network-checks
https://github.com/sensu-plugins/sensu-plugins-process-checks

### Monitoring Uchiwa{#monitoring-sensu-uchiwa}

https://github.com/sensu-plugins/sensu-plugins-network-checks
https://github.com/sensu-plugins/sensu-plugins-process-checks

## Monitoring RabbitMQ

https://github.com/sensu-plugins/sensu-plugins-rabbitmq

## Monitoring Redis

https://github.com/sensu-plugins/sensu-plugins-redis
