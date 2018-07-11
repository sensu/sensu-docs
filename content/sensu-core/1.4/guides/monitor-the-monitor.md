---
title: "Monitoring Sensu with Sensu"
description: "Strategies and best practices for monitoring Sensu with Sensu"
product: "Sensu Core"
version: "1.4"
weight: 11
menu:
  sensu-core-1.4:
    parent: guides
---

In this guide, we'll walk you through the best practices and strategies for monitoring Sensu with Sensu. By the end of the guide, you should have a thorough understanding of what is required to ensure your Sensu components are properly monitored, including:

* [How to monitor your Sensu Server instance(s)](#monitoring-sensu-server)
* [How to monitor your Sensu API instance(s)](#monitoring-sensu-api)
* [How to monitor your Uchiwa Dashboard instance(s)](#monitoring-uchiwa-dashboard)
* [How to monitor your RabbitMQ instance(s)](#monitoring-rabbitmq)
* [How to monitor your Redis instance(s)](#monitoring-redis)

In order to completely monitor a Sensu stack (Sensu server, Sensu API, Redis, RabbitMQ), you will need to have at least one other independent Sensu stack to do so. A single Sensu stack can not monitor itself completely, as if some components are down, Sensu will not be able to create events on itself properly

_NOTE: This guide assumes you are not using Sensu clustering, RabbitMQ clustering or Redis Sentinels. You can still monitor each server using the below described strategies, but note that in order to effectively monitor clustered instances, you'll need to employ a different methodology._

## Monitoring Sensu

### Monitoring Sensu Server{#monitoring-sensu-server}

The host running the `sensu-server` service should be monitored in two ways:

* Locally by a `sensu-client` process for operating system checks/metrics and Sensu services like Uchiwa that are not part of the Sensu event system.
* Remotely from an entirely independent Sensu stack to monitor pieces of the Sensu stack that if down, will make Sensu unable to create events. 

#### Monitoring Sensu Server Locally

Monitoring the host that the `sensu-server` process runs on should be done just like any other node in your infrastructure. This includes, but is not limited to, checks and metrics for [CPU][1], [memory][2], [disk][3], and [networking][4]. You can find more plugins at the [Sensu Community Homepage][5].

#### Monitoring Sensu Server Remotely

To monitor the `sensu-server` Server process, you will need to do so from an independent Sensu stack. This can be done by reaching out to Sensu's [API health endpoint][6] and using the [check-http sensu plugin][7] with the following check definition.

{{< highlight json >}}
{
  "checks": {
    "check_sensu_server_port": {
      "command": "check-http.rb -h remote-api-hostname -P 4567 -p /health?consumers=1 --response-code 204",
      "subscribers": [
        "monitor_remote_sensu_api"
      ],
      "interval": 60
    }
  }
}
{{< /highlight >}}

### Monitoring Sensu API{#monitoring-sensu-api}

To monitor the `sensu-api` API service, you will need to do so from an independent Sensu stack. This can be done by reaching out to the port that the API is listening on using the [check-port sensu plugin][8] with the following check definition.

{{< highlight json >}}
{
  "checks": {
    "check_sensu_api_port": {
      "command": "check-ports.rb -H remote-sensu-server-hostname -p 4567",
      "subscribers": [
        "monitor_remote_sensu_api"
      ],
      "interval": 60
    }
  }
}
{{< /highlight >}}

### Monitoring Uchiwa{#monitoring-uchiwa-dashboard}

*Method 1: Monitor Uchiwa with a process check*

To monitor the Uchiwa Dashboard, you will need to check for two processes named `uchiwa` using [check-process sensu plugin][9] using the following check definition. This check will return a check result with status 2 if less than 2 processes are running with the string `/opt/uchiwa/bin/uchiwa`. We look for two as the `uchiwa service` has a parent and child process.

{{< highlight json >}}
{
  "checks": {
    "check_uchiwa_process": {
      "command": "/opt/sensu/embedded/bin/check-process.rb -p /opt/uchiwa/bin/uchiwa -C 2",
      "subscribers": [
        "monitor_local_uchiwa_processes"
      ],
      "interval": 60
    }
  }
}
{{< /highlight >}}

*Method 2: Monitor Uchiwa with a remote network port check*

You can also monitor the `uchiwa` Dashboard with a remote port check using the [check-port sensu plugin][8] with the following check definition.

{{< highlight json >}}
{
  "checks": {
    "check_uchiwa_port": {
      "command": "check-ports.rb -H uchiwa-remote-hostname -p 3000",
      "subscribers": [
        "monitor_remote_uchiwa_port"
      ],
      "interval": 60
    }
  }
}
{{< /highlight >}}

_PRO TIP: Use both checks for complete monitoring of Uchiwa. This way, you are able to catch when the processes are not running and when a firewall port is not open_

## Monitoring RabbitMQ{#monitoring-rabbitmq}

RabbitMQ has a management plugin that must be enabled to allow the Sensu RabbitMQ check and metric plugins to function properly. You can find more about enabling it in RabbitMQ's [Management Plugin][14] documentation. You will also need an administrative level user that has full access to your /sensu virtualhost. Below is an example of how to create monitor user using the [rabbitmqctl][15] command line tool.

_NOTE: You can use the same RabbitMQ user that Sensu uses if you do not want to create another user, as they are role and permission equivalent. This guide will continue to use the monitor\_user in examples._

{{< highlight shell >}}
rabbitmqctl add_user monitor_user password
rabbitmqctl set_user_tags monitor_user monitoring
rabbitmqctl set_permissions -p /sensu monitor_user "" "" ".*"
{{< /highlight >}}

To monitor that your RabbitMQ instance is responding, you will need to do so from an independent Sensu stack. The [rabbitmq-alive sensu plugin][10] provides that ability using the below configuration with your RabbitMQ credentials.

{{< highlight json >}}
{
  "checks": {
    "check_rabbitmq_alive": {
      "command": "check-rabbitmq-alive.rb -w remote-rabbitmq-host -v %2Fsensu -u monitor_user -p password -P 15672",
      "subscribers": [
        "monitor_remote_rabbitmq"
      ],
      "interval": 60
    }
  }
}
{{< /highlight >}}

While Sensu does not provide benchmarks for a healthy RabbitMQ keepalives and results queue, you can use the [metrics-rabbitmq-queue sensu plugin][11] to establish a baseline for what looks normal for your environment.

{{< highlight json >}}
{
  "checks": {
    "collect_rabbitmq_queue": {
      "command": "metrics-rabbitmq-queue.rb --user monitor_user --password password --vhost /sensu --host localhost --port 15672 --filter keepalives\|results",
      "subscribers": [
        "rabbitmq_keepalive_queue"
      ],
      "interval": 60,
      "type": "metric"
    }
  }
}
{{< /highlight >}}

then use the [check-rabbitmq-check sensu plugin][12] to create checks for both the keepalives and results queue based on your benchmarks. The below check definition uses 250 as the normal depth for both queues.

{{< highlight json >}}
{
  "checks": {
    "check_rabbitmq_queue": {
      "command": "/opt/sensu/embedded/bin/check-rabbitmq-queue.rb --username monitor_user --password password --vhost /sensu --port 15672 --queue keepalives,results -w 500 -c 1000",
      "subscribers": [
        "monitor_rabbitmq_keepalive_queue"
      ],
      "interval": 60
    }
  }
}
{{< /highlight >}}

## Monitoring Redis{#monitoring-redis}

To monitor that your Redis instance is responding, you will need to do so from an independent Sensu stack. You will also need to configure Redis to bind to an interface that your independent Sensu stack can reach and open TCP port 6379. You can use the [check-redis-ping sensu plugin][13] with the following check definition.

{{< highlight json >}}
{
  "checks": {
    "redis_ping": {
      "command": "check-redis-ping.rb -h remote.redis.hostname",
      "subscribers": [
        "monitor_remote_redis"
      ],
      "interval": 60
    }
  }
}
{{< /highlight >}}

[1]: https://github.com/sensu-plugins/sensu-plugins-cpu-checks
[2]: https://github.com/sensu-plugins/sensu-plugins-memory-checks
[3]: https://github.com/sensu-plugins/sensu-plugins-disk-checks
[4]: https://github.com/sensu-plugins/sensu-plugins-network-checks
[5]: https://github.com/sensu-plugins
[6]: http://docs.sensu.io/sensu-core/1.4/api/health-and-info/#reference-documentation
[7]: https://github.com/sensu-plugins/sensu-plugins-http/blob/master/bin/check-http.rb
[8]: https://github.com/sensu-plugins/sensu-plugins-network-checks/blob/master/bin/check-ports.rb
[9]: https://github.com/sensu-plugins/sensu-plugins-process-checks/blob/master/bin/check-process.rb
[10]: https://github.com/sensu-plugins/sensu-plugins-rabbitmq/blob/master/bin/check-rabbitmq-alive.rb
[11]: https://github.com/sensu-plugins/sensu-plugins-rabbitmq/blob/master/bin/metrics-rabbitmq-queue.rb
[12]: https://github.com/sensu-plugins/sensu-plugins-rabbitmq/blob/master/bin/check-rabbitmq-queue.rb
[13]: https://github.com/sensu-plugins/sensu-plugins-redis/blob/master/bin/check-redis-ping.rb
[14]: https://www.rabbitmq.com/management.html
[15]: https://www.rabbitmq.com/rabbitmqctl.8.html
