---
title: "Installing and configuring Sensu 2.0"
linkTitle: "Installation and Configuration"
description: "The Sensu Core installation guide."
weight: 1
version: "2.0"
product: "Sensu Core"
platformContent: true
platforms: ["Docker", "RHEL/CentOS", "Ubuntu/Debian", "Windows", "MacOS"]
menu:
  sensu-core-2.0:
    parent: getting-started
---

The Sensu 2.0 binaries are statically linked and can be deployed via packages (.deb or .rpm) or Docker image.
Select a platform from the dropdown above.

{{< platformBlock "Docker" >}}
## Docker

Sensu 2.0 can be run via [Docker](https://www.docker.com/) or [rkt](https://coreos.com/rkt) using the [sensu/sensu](https://hub.docker.com/r/sensu/sensu/) image. When running Sensu from Docker there are a couple of things to take into consideration.

The Sensu backend requires three exposed ports and persistent storage. This example uses a shared filesystem. Sensu 2.0 is backed by a distributed database, and its storage should be provisioned accordingly.  We recommend local storage or something like Throughput Optimized or Provisioned IOPS EBS if local storage is unavailable.  The three exposed ports are:

- 2380: Sensu storage peer listener (only other sensu-backends need access to this port)
- 3000: Sensu dashboard
- 8080: Sensu API (all users need access to this port)
- 8081: Agent API (all agents need access to this port)

We suggest, but do not require, persistent storage for Sensu agents. The Sensu agent will cache runtime assets locally for each check. This storage should be unique per sensu-agent process.

### How To

1. Start the sensu-backend process.
{{< highlight shell >}}
docker run -v /var/lib/sensu:/var/lib/sensu -d --name sensu-backend -p 2380:2380 \
-p 3000:3000 -p 8080:8080 -p 8081:8081 sensu/sensu:2.0.0-beta.3 sensu-backend start
{{< /highlight >}}

2. Start an agent.
In this case, we're starting an agent whose ID is the hostname with the webserver and system subscriptions. This assumes that sensu-backend is running on another host named sensu.yourdomain.com. If you are running these locally on the same system, be sure to add `--link sensu-backend` to your Docker arguments and change the backend URL `--backend-url ws://sensu-backend:8081`.
{{< highlight shell >}}
docker run -v /var/lib/sensu:/var/lib/sensu -d --name sensu-agent \
sensu/sensu:2.0.0-beta.3 sensu-agent start --backend-url ws://sensu.yourdomain.com:8081 \
--subscriptions webserver,system --cache-dir /var/lib/sensu
{{< /highlight >}}

_NOTE: You can configure the sensu-backend and sensu-agent log levels by using the `--log-level` flag on either process. Log levels include `panic`, `fatal`, `error`, `warn`, `info`, and `debug`, defaulting to `warn`._

### sensuctl and Docker

It's best to run sensuctl locally and point it at the exposed API port for your sensu-backend process. The sensuctl utility stores configuration locally, and you'll likely want to persist it across uses. While it can be run from the docker container, doing so may be problematic.
{{< platformBlockClose >}}
{{< platformBlock "RHEL/CentOS" >}}
## RHEL/CentOS

- [Install the Sensu backend](#rhel-backend)
- [Install the Sensu command line interface (sensuctl)](#rhel-cli)
- [Install the Sensu agent](#rhel-agent)

### Install the Sensu backend {#rhel-backend}

1. Add the Sensu beta repository.
{{< highlight shell >}}
curl -s https://packagecloud.io/install/repositories/sensu/beta/script.rpm.sh | sudo bash
{{< /highlight >}}

2. Install the Sensu backend.
{{< highlight shell >}}
sudo yum install sensu-backend
{{< /highlight >}}

3. Copy the example backend configuration file to the default configuration path.
{{< highlight shell >}}
sudo cp /etc/sensu/backend.yml.example /etc/sensu/backend.yml
{{< /highlight >}}

4. Start the backend.
{{< highlight shell >}}
sudo systemctl start sensu-backend
{{< /highlight >}}
_NOTE: For CentOS 6 and RHEL 6, use `sudo /etc/init.d/sensu-backend start`._
Access the Sensu dashboard at TCP port 3000, and log in as the default administrative user
(username: `admin`, password: `P@ssw0rd!`).

### Install the Sensu command line interface (sensuctl) {#rhel-cli}

1. If you haven't already, add the Sensu beta repository.
{{< highlight shell >}}
curl -s https://packagecloud.io/install/repositories/sensu/beta/script.rpm.sh | sudo bash
{{< /highlight >}}

2. Install the Sensu CLI package.
{{< highlight shell >}}
sudo yum install sensu-cli
{{< /highlight >}}

3. Configure sensuctl.
Sensuctl must be configured before it can connect to your Sensu cluster. Run the
`configure` command to get started.
{{< highlight shell >}}
$ sensuctl configure
? Sensu Backend URL: http://127.0.0.1:8080
? Username: admin
? Password: *********
? Organization: default
? Environment: default
? Preferred output format: tabular
{{< /highlight >}}
Log in as the default administrative user (username: `admin`, password: `P@ssw0rd!`).
It is **strongly** recommended that you change your password immediately using
the `change-password` command.
{{< highlight shell >}}
$ sensuctl user change-password --interactive
? Current Password:  *********
? Password:          *********
? Confirm:           *********
{{< /highlight >}}

### Install the Sensu agent {#rhel-agent}

1. If you haven't already, add the Sensu beta repository.
{{< highlight shell >}}
curl -s https://packagecloud.io/install/repositories/sensu/beta/script.rpm.sh | sudo bash
{{< /highlight >}}

2. Install the Sensu agent.
{{< highlight shell >}}
sudo yum install sensu-agent
{{< /highlight >}}

3. Copy the example agent configuration file to the default configuration path.
{{< highlight shell >}}
sudo cp /etc/sensu/agent.yml.example /etc/sensu/agent.yml
{{< /highlight >}}
Open `/etc/sensu/agent.yml` and uncomment the following lines to specify
the Sensu backend IP and port.
{{< highlight yaml >}}
backend-url:
  - "ws://127.0.0.1:8081"
{{< /highlight >}}

4. Start the agent.
{{< highlight shell >}}
sudo systemctl start sensu-agent
{{< /highlight >}}
_NOTE: For CentOS 6 and RHEL 6, use `sudo /etc/init.d/sensu-agent start`._
Verify that the agent is running using the log files.
{{< highlight shell >}}
$ sudo journalctl -u sensu-agent -f
-- Logs begin at Mon 2018-08-27 23:04:53 UTC. --
Aug 27 23:13:18 sensu2-centos systemd[1]: Started The Sensu Agent process..
Aug 27 23:13:18 sensu2-centos systemd[1]: Starting The Sensu Agent process....
{{< /highlight >}}
_NOTE: For CentOS 6 and RHEL 6, use `tail -f /var/log/sensu/sensu-agent.log`._
{{< platformBlockClose >}}
{{< platformBlock "Ubuntu/Debian" >}}

## Ubuntu/Debian

- [Install the Sensu backend](#ubuntu-backend)
- [Install the Sensu command line interface (sensuctl)](#ubuntu-cli)
- [Install the Sensu agent](#ubuntu-agent)

### Install the Sensu backend {#ubuntu-backend}

1. Add the Sensu beta repository.
{{< highlight shell >}}
curl -s https://packagecloud.io/install/repositories/sensu/beta/script.deb.sh | sudo bash
{{< /highlight >}}

2. Install the Sensu backend.
{{< highlight shell >}}
sudo apt-get install sensu-backend
{{< /highlight >}}

3. Copy the example backend configuration file to the default configuration path.
{{< highlight shell >}}
sudo cp /etc/sensu/backend.yml.example /etc/sensu/backend.yml
{{< /highlight >}}

4. Start the backend.
{{< highlight shell >}}
sudo systemctl start sensu-backend
{{< /highlight >}}
_NOTE: For Ubuntu 14.04, use `sudo /etc/init.d/sensu-backend start`._
Access the Sensu dashboard at TCP port 3000, and log in as the default administrative user
(username: `admin`, password: `P@ssw0rd!`).

### Install the Sensu command line interface (sensuctl) {#ubuntu-cli}

1. If you haven’t already, add the Sensu beta repository.
{{< highlight shell >}}
curl -s https://packagecloud.io/install/repositories/sensu/beta/script.rpm.sh | sudo bash
{{< /highlight >}}

2. Install the Sensu CLI package.
{{< highlight shell >}}
sudo apt-get install sensu-cli
{{< /highlight >}}

3. Configure sensuctl.
Sensuctl must be configured before it can connect to your Sensu cluster. Run the
`configure` command to get started.
{{< highlight shell >}}
$ sensuctl configure
? Sensu Backend URL: http://127.0.0.1:8080
? Username: admin
? Password: *********
? Organization: default
? Environment: default
? Preferred output format: tabular
{{< /highlight >}}
Log in as the default administrative user (username: `admin`, password: `P@ssw0rd!`).
It is **strongly** recommended that you change your password immediately using
the `change-password` command.
{{< highlight shell >}}
$ sensuctl user change-password --interactive
? Current Password:  *********
? Password:          *********
? Confirm:           *********
{{< /highlight >}}

### Install the Sensu agent {#ubuntu-agent}

1. If you haven’t already, add the Sensu beta repository.
You can skip this step if you already added the repository during backend installation.
{{< highlight shell >}}
curl -s https://packagecloud.io/install/repositories/sensu/beta/script.rpm.sh | sudo bash
{{< /highlight >}}

2. Install the Sensu agent.
{{< highlight shell >}}
sudo apt-get install sensu-agent
{{< /highlight >}}

3. Copy the example agent configuration file to the default configuration path.
{{< highlight shell >}}
sudo cp /etc/sensu/agent.yml.example /etc/sensu/agent.yml
{{< /highlight >}}
Open `/etc/sensu/agent.yml` and uncomment the following lines to specify the Sensu backend IP and port.
{{< highlight yaml >}}
backend-url:
  - "ws://127.0.0.1:8081"
{{< /highlight >}}

4. Start the agent.
{{< highlight shell >}}
sudo systemctl start sensu-agent
{{< /highlight >}}
_NOTE: For Ubuntu 14.04, use `sudo /etc/init.d/sensu-agent start`._
Verify that the agent is running using the log files.
{{< highlight shell >}}
journalctl -u sensu-agent -f
{{< /highlight >}}
_NOTE: For Ubuntu 14.04, use `tail -f /var/log/sensu/sensu-agent.log`._
{{< platformBlockClose >}}
{{< platformBlock "Windows" >}}

### Windows

### Install the Sensu agent {#windows-agent}

Download the [Sensu agent binary](https://storage.googleapis.com/sensu-binaries/2.0.0-beta.4-1/windows/amd64/sensu-agent).
{{< platformBlockClose >}}
{{< platformBlock "MacOS" >}}

## MacOS

### Install the Sensu command line interface (sensuctl) {#mac-cli}

1. Download the latest release.
{{< highlight shell >}}
curl -LO https://storage.googleapis.com/sensu-binaries/$(curl -s https://storage.googleapis.com/sensu-binaries/latest.txt)/darwin/amd64/sensuctl
{{< /highlight >}}
**Optionally**, if you would like to download a specific release, replace
`{VERSION}` in the command below.
{{< highlight shell >}}
curl -LO https://storage.googleapis.com/sensu-binaries/{VERSION}/darwin/amd64/sensuctl
{{< /highlight >}}

2. Make the sensuctl binary executable.
{{< highlight shell >}}
chmod +x sensuctl
{{< /highlight >}}

3. Move the executable into your PATH.
{{< highlight shell >}}
sudo mv sensuctl /usr/local/bin/
{{< /highlight >}}
{{< platformBlockClose >}}
