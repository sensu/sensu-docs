---
title: "Installing and configuring Sensu 2.0"
linkTitle: "Installation and Configuration"
description: "The Sensu Core installation guide."
weight: 1
version: "2.0"
product: "Sensu Core"
platformContent: true
menu:
  sensu-core-2.0:
    parent: getting-started
---

The Sensu 2.0 binaries are statically linked and can be deployed to any Linux or Windows operating system.

### Backend

The Sensu Backend (sensu-backend) is a single statically linked binary that can be deployed via packages (.deb or .rpm) or Docker image.

### Agent

The Sensu Agent (sensu-agent) is a single statically linked binary that can be deployed via packages (.deb or .rpm) or Docker image.

## Installation

{{< platformBlock "Ubuntu/Debian" >}}
### Ubuntu/Debian

Add the Sensu nightly repository.

{{< highlight shell >}}
curl -s https://packagecloud.io/install/repositories/sensu/nightly/script.deb.sh | sudo bash
{{< /highlight >}}

Install the packages from the Sensu nightly repository.

{{< highlight shell >}}
sudo apt-get install sensu-backend sensu-agent
{{< /highlight >}}

{{< platformBlockClose >}}

{{< platformBlock "RHEL/CentOS" >}}
### RHEL/CentOS

Add the Sensu nightly repository.

{{< highlight shell >}}
curl -s https://packagecloud.io/install/repositories/sensu/nightly/script.rpm.sh | sudo bash
{{< /highlight >}}

Install the Sensu backend and agent packages.

{{< highlight shell >}}
sudo yum install sensu-backend sensu-agent
{{< /highlight >}}
{{< platformBlockClose >}}

{{< platformBlock "Windows" >}}
### Windows

Coming soon.
{{< platformBlockClose >}}

## Configuration

The example config files list all of the configurable options for each service.

{{< platformBlock "Ubuntu/Debian RHEL/CentOS" >}}
### Linux

#### Sensu Backend

Copy the example backend config file to the default config path.

{{< highlight shell >}}
sudo cp /etc/sensu/backend.yml.example /etc/sensu/backend.yml
{{< /highlight >}}

The backend config requires `state-dir` to be set. The example config sets `state-dir` to `/var/lib/sensu` by
default.

#### Sensu Agent

Copy the example agent config file to the default config path.

{{< highlight shell >}}
sudo cp /etc/sensu/agent.yml.example /etc/sensu/agent.yml
{{< /highlight >}}

In order for the agent to function it will need to have a list of one or more backends to point to. This can be set
by setting `backend-url`.

{{< highlight yaml >}}
backend-url:
  - "ws://127.0.0.1:8081"
{{< /highlight >}}
{{< platformBlockClose >}}

{{< platformBlock "Windows" >}}
### Windows

Coming soon.
{{< platformBlockClose >}}

## Starting the services

{{< platformBlock "Ubuntu/Debian RHEL/CentOS" >}}
### Ubuntu 14.04 / CentOS 6 / RHEL 6

Start the services using the sysvinit scripts.

{{< highlight shell >}}
sudo /etc/init.d/sensu-backend start
sudo /etc/init.d/sensu-agent start
{{< /highlight >}}

### Ubuntu 16.04 / CentOS 7 / RHEL 7

Start the services using systemd.

{{< highlight shell >}}
sudo systemctl start sensu-backend
sudo systemctl start sensu-agent
{{< /highlight >}}
{{< platformBlockClose >}}

{{< platformBlock "Windows" >}}
### Windows

Coming soon.
{{< platformBlockClose >}}

## Validating the services

{{< platformBlock "Ubuntu/Debian RHEL/CentOS" >}}
### Ubuntu 14.04 / CentOS 6 / RHEL 6

Verify that the services are properly running using `journalctl`.

{{< highlight shell >}}
journalctl -u sensu-backend -f
journalctl -u sensu-agent -f
{{< /highlight >}}

### Ubuntu 16.04 / CentOS 7 / RHEL 7

Verify that the services are properly running using the log files.

{{< highlight shell >}}
tail -f /var/log/sensu/sensu-backend.log
tail -f /var/log/sensu-agent.log
{{< /highlight >}}
{{< platformBlockClose >}}

{{< platformBlock "Windows" >}}
### Windows

Coming soon.
{{< platformBlockClose >}}

## Docker

Sensu 2.0 can be run via [Docker](https://www.docker.com/) or [rkt](https://coreos.com/rkt) using the [sensuapp/sensu](https://hub.docker.com/r/sensuapp/sensu-go/) image. When running Sensu from Docker there are a couple of things to take into consideration.

The backend requires 3 exposed ports and persistent storage. This example uses a shared filesystem. Sensu 2.0 is backed by a distributed database, and its storage should be provisioned accordingly.  We recommend local storage or something like Throughtput Optimized or Provisioned IOPS EBS if local storage is unavailable.  The 3 exposed ports are:

- 2380: Sensu storage peer listener (only other sensu-backends need access to this port)
- 3000: Sensu dashboard (not yet complete)
- 8080: Sensu API (all users need access to this port)
- 8081: Agent API (all agents need access to this port)

We suggest, but do not require, persistent storage for sensu-agents. The Sensu Agent will cache runtime assets locally for each check. This storage should be unique per sensu-agent process.

### How To

1. Start the sensu-backend process

{{< highlight shell >}}
docker run -v /var/lib/sensu:/var/lib/sensu -d --name sensu-backend -p 2380:2380 \
-p 3000:3000 -p 8080:8080 -p 8081:8081 sensuapp/sensu-go:2.0.0-alpha sensu-backend start
{{< /highlight >}}
2. Start an agent

In this case, we're starting an agent whose ID is the hostname with the webserver and system subscriptions. This assumes that sensu-backend is running on another host named sensu.yourdomain.com. If you are running these locally on the same system, be sure to add `--link sensu-backend` to your Docker arguments and change the backend URL `--backend-url ws://sensu-backend:8081`.

{{< highlight shell >}}
docker run -v /var/lib/sensu:/var/lib/sensu -d --name sensu-agent \ 
sensuapp/sensu-go:2.0.0-alpha sensu-agent start --backend-url ws://sensu.yourdomain.com:8081 \
--subscriptions webserver,system --cache-dir /var/lib/sensu
{{< /highlight >}}

A note about sensuctl and Docker:

It's best to run sensuctl locally and point it at the exposed API port for your sensu-backend process. The sensuctl utility stores configuration locally, and you'll likely want to persist it across uses. While it can be run from the docker container, doing so may be problematic.
