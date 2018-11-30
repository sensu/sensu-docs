---
title: "Installing Sensu"
linkTitle: "Install Sensu"
description: "The Sensu Core installation guide."
weight: 1
version: "5.0"
product: "Sensu Go"
platformContent: true
platforms: ["Ubuntu/Debian", "RHEL/CentOS", "Windows", "macOS", "Docker"]
menu:
  sensu-go-5.0:
    parent: installation
aliases:
  - /sensu-go/5.0/getting-started/installation-and-configuration/
---

The Sensu Go binaries are statically linked and can be deployed to any Linux or Windows operating system.
Select a platform from the dropdown above.

{{< platformBlock "Ubuntu/Debian RHEL/CentOS" >}}

## Install the Sensu backend
The Sensu backend (sensu-backend) is a single statically linked binary that can be deployed via packages (.deb or .rpm) or [Docker image](#docker).
Sensu backend packages are available for Ubuntu/Debian and RHEL/CentOS.

### 1. Install the package

{{< platformBlockClose >}}

{{< platformBlock "Ubuntu/Debian" >}}

#### Ubuntu/Debian
Add the Sensu repository.

{{< highlight shell >}}
curl -s https://packagecloud.io/install/repositories/sensu/stable/script.deb.sh | sudo bash
{{< /highlight >}}

Install the sensu-backend package.

{{< highlight shell >}}
sudo apt-get install sensu-backend
{{< /highlight >}}

{{< platformBlockClose >}}

{{< platformBlock "RHEL/CentOS" >}}

#### RHEL/CentOS

Add the Sensu repository.

{{< highlight shell >}}
curl -s https://packagecloud.io/install/repositories/sensu/stable/script.rpm.sh | sudo bash
{{< /highlight >}}

Install the sensu-backend package.

{{< highlight shell >}}
sudo yum install sensu-backend
{{< /highlight >}}

{{< platformBlockClose >}}

{{< platformBlock "Ubuntu/Debian RHEL/CentOS" >}}

### 2. Create the configuration file

Copy the example backend config file to the default config path.

{{< highlight shell >}}
sudo cp /etc/sensu/backend.yml.example /etc/sensu/backend.yml
{{< /highlight >}}

The backend config requires `state-dir` to be set.
The example config sets `state-dir` to `/var/lib/sensu` by default.

### 3. Start the service

Start the backend using systemd.

{{< highlight shell >}}
sudo systemctl start sensu-backend
{{< /highlight >}}

You can verify that sensu-backend is running properly using the log files.

{{< highlight shell >}}
journalctl -u sensu-backend -f
{{< /highlight >}}

_NOTE: On older distributions of Linux, use `sudo service sensu-backend start` to start the backend and `tail -f /var/log/sensu/sensu-backend.log` to verify it._

{{< platformBlockClose >}}

{{< platformBlock "Ubuntu/Debian RHEL/CentOS" >}}

### Next steps

Now that you've installed the Sensu backend:

- [Install the Sensu agent](#install-the-sensu-agent)
- [Install sensuctl](#install-sensuctl)
- [Log in to the dashboard][3]

{{< platformBlockClose >}}

{{< platformBlock "Ubuntu/Debian RHEL/CentOS Windows" >}}

## Install the Sensu agent
The Sensu agent is a single statically linked binary that can be deployed via packages (.deb or .rpm) or Docker image.
Sensu agent packages are available for Ubuntu/Debian, RHEL/CentOS, and Windows.

### 1. Install the package

{{< platformBlockClose >}}

{{< platformBlock "Ubuntu/Debian" >}}

#### Ubuntu/Debian

Add the Sensu repository.

{{< highlight shell >}}
curl -s https://packagecloud.io/install/repositories/sensu/stable/script.deb.sh | sudo bash
{{< /highlight >}}

Install the sensu-agent package.

{{< highlight shell >}}
sudo apt-get install sensu-agent
{{< /highlight >}}

{{< platformBlockClose >}}

{{< platformBlock "RHEL/CentOS" >}}
#### RHEL/CentOS

Add the Sensu repository.

{{< highlight shell >}}
curl -s https://packagecloud.io/install/repositories/sensu/stable/script.rpm.sh | sudo bash
{{< /highlight >}}

Install the sensu-agent package.

{{< highlight shell >}}
sudo yum install sensu-agent
{{< /highlight >}}

{{< platformBlockClose >}}

{{< platformBlock "Windows" >}}

#### Windows

Download the [Sensu agent binary](https://storage.googleapis.com/sensu-binaries/2.0.0-beta.4-1/windows/amd64/sensu-agent).

{{< platformBlockClose >}}

{{< platformBlock "Ubuntu/Debian RHEL/CentOS Windows" >}}

### 2. Create the configuration file

{{< platformBlockClose >}}

{{< platformBlock "Ubuntu/Debian RHEL/CentOS" >}}

#### Ubuntu/Debian/RHEL/CentOS

Copy the example agent config file to the default config path.

{{< highlight shell >}}
sudo cp /etc/sensu/agent.yml.example /etc/sensu/agent.yml
{{< /highlight >}}

In order for the agent to function, it will need to have a list of one or more backends to point to.
Open `/etc/sensu/agent.yml` and set `backend-url` to the IP and port of a Sensu backend.

{{< highlight yaml >}}
backend-url:
  - "ws://127.0.0.1:8081"
{{< /highlight >}}

{{< platformBlockClose >}}

{{< platformBlock "Windows" >}}

#### Windows

Download the [example agent configuration file][2].

{{< platformBlockClose >}}

{{< platformBlock "Ubuntu/Debian RHEL/CentOS Windows" >}}

### 3. Start the service

{{< platformBlockClose >}}

{{< platformBlock "Ubuntu/Debian RHEL/CentOS" >}}

#### Ubuntu/Debian/RHEL/CentOS

Start the agent using systemd.

{{< highlight shell >}}
sudo systemctl start sensu-agent
{{< /highlight >}}

You can verify that sensu-agent is running properly using the log files.

{{< highlight shell >}}
journalctl -u sensu-agent -f
{{< /highlight >}}

_NOTE: On older distributions of Linux, use `sudo service sensu-agent start` to start the agent and `tail -f /var/log/sensu/sensu-agent.log` to verify it._

{{< platformBlockClose >}}

{{< platformBlock "Windows" >}}

#### Windows

Coming soon.

{{< platformBlockClose >}}

{{< platformBlock "macOS RHEL/CentOS Ubuntu/Debian Windows" >}}

## Install sensuctl
Sensu Go can be configured and used with the sensuctl (pronounced “Sensu cuddle”) command line utility.
Sensu CLI (sensuctl) packages are available for macOS, Ubuntu/Debian, RHEL/CentOS, and Windows.

### 1. Install the package

{{< platformBlockClose >}}

{{< platformBlock "macOS" >}}

#### macOS

Download the latest release.

{{< highlight shell >}}
curl -LO https://storage.googleapis.com/sensu-binaries/$(curl -s https://storage.googleapis.com/sensu-binaries/latest.txt)/darwin/amd64/sensuctl
{{< /highlight >}}

**Optionally**, if you would like to download a specific [release][1], replace
`{VERSION}` in the command below.

{{< highlight shell >}}
curl -LO https://storage.googleapis.com/sensu-binaries/{VERSION}/darwin/amd64/sensuctl
{{< /highlight >}}

Make the sensuctl binary executable.

{{< highlight shell >}}
chmod +x sensuctl
{{< /highlight >}}

Move the executable into your PATH.

{{< highlight shell >}}
sudo mv sensuctl /usr/local/bin/
{{< /highlight >}}

{{< platformBlockClose >}}

{{< platformBlock "Ubuntu/Debian" >}}

#### Ubuntu/Debian

Add the Sensu repository.

{{< highlight shell >}}
curl -s https://packagecloud.io/install/repositories/sensu/stable/script.deb.sh | sudo bash
{{< /highlight >}}

Install the sensu-cli package.

{{< highlight shell >}}
sudo apt-get install sensu-cli
{{< /highlight >}}

{{< platformBlockClose >}}

{{< platformBlock "RHEL/CentOS" >}}

#### RHEL/CentOS

Add the Sensu repository.

{{< highlight shell >}}
curl -s https://packagecloud.io/install/repositories/sensu/stable/script.rpm.sh | sudo bash
{{< /highlight >}}

Install the sensu-cli package.

{{< highlight shell >}}
sudo yum install sensu-cli
{{< /highlight >}}

{{< platformBlockClose >}}

{{< platformBlock "Windows" >}}

#### Windows

Download [sensuctl for 64-bit Windows](http://storage.googleapis.com/sensu-binaries/2.0.0-beta.4-1/windows/amd64/sensuctl).

{{< platformBlockClose >}}

{{< platformBlock "macOS RHEL/CentOS Ubuntu/Debian Windows" >}}

### 2. Configure sensuctl

You must configure sensuctl before it can connect to Sensu Go.
Run `sensuctl configure` to get started.

{{< highlight shell >}}
$ sensuctl configure
? Sensu Backend URL: http://127.0.0.1:8080
? Username: admin
? Password: *********
? Namespace: default
? Preferred output format: tabular
{{< /highlight >}}

By default, your Sensu installation comes with a user named `admin` with password `P@ssw0rd!`.
We **strongly** recommended that you change the password immediately.
Once authenticated, you can change the password using the `change-password` command.

{{< highlight shell >}}
$ sensuctl user change-password --interactive
? Current Password:  *********
? Password:          *********
? Confirm:           *********
{{< /highlight >}}

You can change individual values of your sensuctl configuration with the `config` subcommand.

{{< highlight shell >}}
sensuctl config set-namespace default
{{< /highlight >}}

See the [sensuctl reference][4] for more information about using sensuctl.

{{< platformBlockClose >}}

{{< platformBlock "Docker" >}}
## Deploy Sensu with Docker

Sensu Go can be run via [Docker](https://www.docker.com/) or [rkt](https://coreos.com/rkt) using the [sensu/sensu](https://hub.docker.com/r/sensu/sensu/) image. When running Sensu from Docker there are a couple of things to take into consideration.

The backend requires four exposed ports and persistent storage. This example uses a shared filesystem. Sensu Go is backed by a distributed database, and its storage should be provisioned accordingly.  We recommend local storage or something like Throughput Optimized or Provisioned IOPS EBS if local storage is unavailable.  The exposed ports are:

- 2380: Sensu storage peer listener (only other Sensu backends need access to this port)
- 3000: Sensu dashboard
- 8080: Sensu API (all users need access to this port)
- 8081: Agent API (all agents need access to this port)

We suggest, but do not require, persistent storage for Sensu backends and Sensu agents. The Sensu agent will cache runtime assets locally for each check, and the Sensu backend will cache runtime assets locally for each handler and mutator. This storage should be unique per sensu-backend/sensu-agent process.

### Start a Sensu backend
{{< highlight shell >}}
docker run -v /var/lib/sensu:/var/lib/sensu -d --name sensu-backend -p 2380:2380 \
-p 3000:3000 -p 8080:8080 -p 8081:8081 sensu/sensu:latest sensu-backend start
{{< /highlight >}}

### Start a Sensu agent
In this case, we're starting an agent with the webserver and system subscriptions as an example.
This assumes that the Sensu backend is running on another host named sensu.yourdomain.com.
If you are running these locally on the same system, be sure to add `--link sensu-backend` to your Docker arguments and change the backend URL `--backend-url ws://sensu-backend:8081`.

{{< highlight shell >}}
docker run -v /var/lib/sensu:/var/lib/sensu -d --name sensu-agent \
sensu/sensu:latest sensu-agent start --backend-url ws://sensu.yourdomain.com:8081 \
--subscriptions webserver,system --cache-dir /var/lib/sensu
{{< /highlight >}}

_NOTE: You can configure the backend and agent log levels by using the `--log-level` flag on either process. Log levels include `panic`, `fatal`, `error`, `warn`, `info`, and `debug`, defaulting to `warn`._

### sensuctl and Docker

It's best to run sensuctl locally and point it at the exposed API port for your the Sensu backend.
The sensuctl utility stores configuration locally, and you'll likely want to persist it across uses.
While it can be run from the docker container, doing so may be problematic.

{{< platformBlockClose >}}

[1]: https://github.com/sensu/sensu-go/releases
[2]: https://github.com/sensu/sensu-go/blob/master/packaging/files/windows/agent.yml.example
[3]: ../../dashboard/overview
[4]: ../../sensuctl/reference
