---
title: "Install Sensu"
linkTitle: "Install Sensu"
description: "Sensu Go is available for Linux, Windows (agent and CLI only), macOS (CLI only), and Docker. Read this installation guide to install the Sensu backend, Sensu agent, and sensuctl command line tool."
weight: 20
version: "5.18"
product: "Sensu Go"
menu:
  sensu-go-5.18:
    parent: deploy-sensu
---

This installation guide describes how to install the Sensu backend, Sensu agent, and sensuctl command line tool.
If you’re trying Sensu for the first time, we recommend setting up a local environment using the [Sensu sandbox][14].

{{% notice note %}}
**NOTE**: The instructions in this guide explain how to install Sensu for proof-of-concept purposes or testing in a development environment.
If you will deploy Sensu to your infrastructure, we recommend one of our supported packages, Docker images, or [configuration management integrations](../configuration-management/), as well as securing your installation with transport layer security (TLS).
Read [Generate certificates](../generate-certificates) next to get the certificates you will need for TLS.
{{% /notice %}}

Sensu downloads are provided under the [Sensu commercial license][13].

Sensu Go is packaged for Linux, Windows (agent and CLI only), macOS (CLI only), and Docker.
See [supported platforms][5] for more information.

## Architecture overview

{{< figure src="/images/go/install_sensu/basic_architecture.png" alt="Basic Sensu architecture diagram showing agents and the backend" link="/images/go/install_sensu/basic_architecture.png" target="_blank" >}}
<!-- Diagram source: https://www.lucidchart.com/documents/edit/3949dde6-1bad-4f37-aa01-00a71c47a91b/0 -->

The **Sensu backend** gives you flexible, automated workflows to route metrics and alerts.
It is powered by an an embedded transport and [etcd][16] datastore and gives you flexible, automated workflows to route metrics and alerts.
Sensu backends require persistent storage for their embedded database, disk space for local asset caching, and several exposed ports.

**Sensu agents** are lightweight clients that run on the infrastructure components you want to monitor.
Agents register automatically with Sensu as entities and are responsible for creating check and metric events to send to the backend event pipeline.
Agents that use Sensu [assets][17] require some disk space for a local cache.

For more information, see the [Secure Sensu guide][8].
See [Deploy Sensu][31] and [hardware requirements][25] for deployment recommendations.

## Ports

Sensu backends require the following ports:

Port | Protocol | Description |
---- | -------- | ----------- |
2379 | gRPC | Sensu storage client: Required for Sensu backends using an external etcd instance |
2380 | gRPC | Sensu storage peer: Required for other Sensu backends in a [cluster][22] |
3000 | HTTP/HTTPS | [Sensu web UI][3]: Required for all Sensu backends using a Sensu web UI |
8080 | HTTP/HTTPS | [Sensu API][26]: Required for all users accessing the Sensu API |
8081 | WS/WSS | Agent API: Required for all Sensu agents connecting to a Sensu backend |

The Sensu agent uses the following ports:

Port | Protocol | Description |
---- | -------- | ----------- |
3030 | TCP/UDP | Sensu agent socket: Required for Sensu agents using the agent socket |
3031 | HTTP | Sensu [agent API][27]: Required for all users accessing the agent API |
8125 | UDP | [StatsD listener][28]: Required for all Sensu agents using the StatsD listener |

The agent TCP and UDP sockets are deprecated in favor of the [agent API][27].

## Install the Sensu backend

The Sensu backend is available for Ubuntu/Debian, RHEL/CentOS, and Docker.
See [supported platforms][5] for more information.

### 1. Download

{{< language-toggle >}}

{{< code Docker >}}
# All Sensu Docker images contain a Sensu backend and a Sensu agent

# Pull the Alpine-based image
docker pull sensu/sensu

# Pull the image based on Red Hat Enterprise Linux
docker pull sensu/sensu-rhel
{{< /code >}}

{{< code shell "Ubuntu/Debian" >}}
# Add the Sensu repository
curl -s https://packagecloud.io/install/repositories/sensu/stable/script.deb.sh | sudo bash

# Install the sensu-go-backend package
sudo apt-get install sensu-go-backend
{{< /code >}}

{{< code shell "RHEL/CentOS" >}}
# Add the Sensu repository
curl -s https://packagecloud.io/install/repositories/sensu/stable/script.rpm.sh | sudo bash

# Install the sensu-go-backend package
sudo yum install sensu-go-backend
{{< /code >}}

{{< /language-toggle >}}

### 2. Configure and start

You can configure the Sensu backend with `sensu-backend start` flags (recommended) or an `/etc/sensu/backend.yml` file.
The Sensu backend requires the `state-dir` flag at minimum, but other useful configurations and templates are available.

{{% notice note %}}
**NOTE**: If you are using Docker, intitialization is included in this step when you start the backend rather than in [3. Initialize](#3-initialize).
For details about intialization in Docker, see the [backend reference](../../../reference/backend#docker-initialization).
{{% /notice %}}

{{< language-toggle >}}

{{< code Docker >}}
# Replace `YOUR_USERNAME` and `YOUR_PASSWORD` with the username and password
# you want to use for your admin user credentials.
docker run -v /var/lib/sensu:/var/lib/sensu \
-d --name sensu-backend \
-p 3000:3000 -p 8080:8080 -p 8081:8081 \
-e SENSU_BACKEND_CLUSTER_ADMIN_USERNAME=YOUR_USERNAME \
-e SENSU_BACKEND_CLUSTER_ADMIN_PASSWORD=YOUR_PASSWORD \
sensu/sensu:latest \
sensu-backend start --state-dir /var/lib/sensu/sensu-backend --log-level debug
{{< /code >}}

{{< code docker "Docker Compose" >}}
# Replace `YOUR_USERNAME` and `YOUR_PASSWORD` with the username and password
# you want to use for your admin user credentials.
---
version: "3"
services:
  sensu-backend:
    ports:
    - 3000:3000
    - 8080:8080
    - 8081:8081
    volumes:
    - "sensu-backend-data:/var/lib/sensu/sensu-backend/etcd"
    command: "sensu-backend start --state-dir /var/lib/sensu/sensu-backend --log-level debug"
    environment:
    - SENSU_BACKEND_CLUSTER_ADMIN_USERNAME=YOUR_USERNAME
    - SENSU_BACKEND_CLUSTER_ADMIN_PASSWORD=YOUR_PASSWORD
    image: sensu/sensu:latest

volumes:
  sensu-backend-data:
    driver: local

{{< /code >}}

{{< code shell "Ubuntu/Debian" >}}
# Copy the config template from the docs
sudo curl -L https://docs.sensu.io/sensu-go/latest/files/backend.yml -o /etc/sensu/backend.yml

# Start sensu-backend using a service manager
sudo service sensu-backend start

# Verify that the backend is running
service sensu-backend status
{{< /code >}}

{{< code shell "RHEL/CentOS" >}}
# Copy the config template from the docs
sudo curl -L https://docs.sensu.io/sensu-go/latest/files/backend.yml -o /etc/sensu/backend.yml

# Start sensu-backend using a service manager
sudo service sensu-backend start

# Verify that the backend is running
service sensu-backend status
{{< /code >}}

{{< /language-toggle >}}

For a complete list of configuration options, see the [backend reference][6].

{{% notice important %}}
**IMPORTANT**: If you plan to [run a Sensu cluster](../cluster-sensu/), make sure that each of your backend nodes is configured, running, and a member of the cluster before you continue the installation process.
{{% /notice %}}

### 3. Initialize

{{% notice note %}}
**NOTE**: If you are using Docker, you already completed intitialization in [2. Configure and start](#2-configure-and-start).
Skip ahead to [4. Open the web UI](#4-open-the-web-ui) to continue the backend installation process.
If you did not use environment variables to override the default admin credentials in step 2, skip ahead to [Install sensuctl](#install-sensuctl) so you can change your default admin password immediately.
{{% /notice %}}

**With the backend running**, run `sensu-backend init` to set up your Sensu administrator username and password.
In this initialization step, you only need to set environment variables with a username and password string &mdash; no need for role-based access control (RBAC).

Replace `YOUR_USERNAME` and `YOUR_PASSWORD` with the username and password you want to use.

{{< language-toggle >}}

{{< code shell "Ubuntu/Debian" >}}
export SENSU_BACKEND_CLUSTER_ADMIN_USERNAME=YOUR_USERNAME
export SENSU_BACKEND_CLUSTER_ADMIN_PASSWORD=YOUR_PASSWORD
sensu-backend init
{{< /code >}}

{{< code shell "RHEL/CentOS" >}}
export SENSU_BACKEND_CLUSTER_ADMIN_USERNAME=YOUR_USERNAME
export SENSU_BACKEND_CLUSTER_ADMIN_PASSWORD=YOUR_PASSWORD
sensu-backend init
{{< /code >}}

{{< /language-toggle >}}

For details about `sensu-backend init`, see the [backend reference][30].

### 4. Open the web UI

The web UI provides a unified view of your monitoring events and user-friendly tools to reduce alert fatigue.
After starting the Sensu backend, open the web UI by visiting http://localhost:3000.
You may need to replace `localhost` with the hostname or IP address where the Sensu backend is running.

To log in to the web UI, enter your Sensu user credentials.
If you are using Docker and you did not specify environment variables to override the default admin credentials, your user credentials are username `admin` and password `P@ssw0rd!`.
Otherwise, your user credentials are the username and password you provided with the `SENSU_BACKEND_CLUSTER_ADMIN_USERNAME` and `SENSU_BACKEND_CLUSTER_ADMIN_PASSWORD` environment variables.

Select the ☰ icon to explore the web UI.

### 5. Make a request to the health API

To make sure the backend is up and running, use the Sensu [health API][35] to check the backend's health.
You should see a response that includes `"Healthy": true`.

{{< code shell >}}
curl http://127.0.0.1:8080/health
{{< /code >}}

Now that you've installed the Sensu backend, [install and configure sensuctl][19] to connect to your backend URL.
Then you can [install a Sensu agent][18] and start monitoring your infrastructure.

## Install sensuctl

[Sensuctl][4] is a command line tool for managing resources within Sensu.
It works by calling Sensu’s HTTP API to create, read, update, and delete resources, events, and entities.
Sensuctl is available for Linux, Windows, and macOS.

To install sensuctl:

{{< language-toggle >}}

{{< code shell "Ubuntu/Debian" >}}
# Add the Sensu repository
curl -s https://packagecloud.io/install/repositories/sensu/stable/script.deb.sh | sudo bash

# Install the sensu-go-cli package
sudo apt-get install sensu-go-cli
{{< /code >}}

{{< code shell "RHEL/CentOS" >}}
# Add the Sensu repository
curl https://packagecloud.io/install/repositories/sensu/stable/script.rpm.sh | sudo bash

# Install the sensu-go-cli package
sudo yum install sensu-go-cli
{{< /code >}}

{{< code powershell "Windows" >}}
# Download sensuctl for Windows amd64
Invoke-WebRequest https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.18.1/sensu-go_5.18.1_windows_amd64.zip  -OutFile C:\Users\Administrator\sensu-go_5.18.1_windows_amd64.zip

# Or for 386
Invoke-WebRequest https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.18.1/sensu-go_5.18.1_windows_386.zip  -OutFile C:\Users\Administrator\sensu-go_5.18.1_windows_386.zip
{{< /code >}}

{{< code shell "macOS" >}}
# Download the latest release
curl -LO https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.18.1/sensu-go_5.18.1_darwin_amd64.tar.gz

# Extract the archive
tar -xvf sensu-go_5.18.1_darwin_amd64.tar.gz

# Copy the executable into your PATH
sudo cp sensuctl /usr/local/bin/
{{< /code >}}

{{< /language-toggle >}}

To start using sensuctl, run `sensuctl configure` and log in with your user credentials, namespace, and [Sensu backend][21] URL.
To configure sensuctl using default values:

{{< code shell >}}
sensuctl configure -n \
--username 'YOUR_USERNAME' \
--password 'YOUR_PASSWORD' \
--namespace default \
--url 'http://127.0.0.1:8080'
{{< /code >}}

Here, the `-n` flag triggers non-interactive mode.
Run `sensuctl config view` to see your user profile.

For more information about sensuctl, see the [quickstart][23] and [reference][4] docs.

### Change default admin password

If you are using Docker and you did not use environment variables to override the default admin credentials in [step 2 of the backend installation process](#2-configure-and-start), we recommend that you change the default admin password as soon as you have [installed sensuctl][19].
Run:

{{< code shell >}}
sensuctl user change-password --interactive
{{< /code >}}

## Install Sensu agents

The Sensu agent is available for Ubuntu/Debian, RHEL/CentOS, Windows, and Docker.
See [supported platforms][5] for more information.

### 1. Download {#agent-download}

{{< language-toggle >}}

{{< code Docker >}}
# All Sensu images contain a Sensu backend and a Sensu agent

# Pull the Alpine-based image
docker pull sensu/sensu

# Pull the RHEL-based image
docker pull sensu/sensu-rhel
{{< /code >}}

{{< code shell "Ubuntu/Debian" >}}
# Add the Sensu repository
curl -s https://packagecloud.io/install/repositories/sensu/stable/script.deb.sh | sudo bash

# Install the sensu-go-agent package
sudo apt-get install sensu-go-agent
{{< /code >}}

{{< code shell "RHEL/CentOS" >}}
# Add the Sensu repository
curl -s https://packagecloud.io/install/repositories/sensu/stable/script.rpm.sh | sudo bash

# Install the sensu-go-agent package
sudo yum install sensu-go-agent
{{< /code >}}

{{< code powershell "Windows" >}}
# Download the Sensu agent for Windows amd64
Invoke-WebRequest https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.18.1/sensu-go-agent_5.18.1.9930_en-US.x64.msi  -OutFile "$env:userprofile\sensu-go-agent_5.18.1.9930_en-US.x64.msi"

# Or for Windows 386
Invoke-WebRequest https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.18.1/sensu-go-agent_5.18.1.9930_en-US.x86.msi  -OutFile "$env:userprofile\sensu-go-agent_5.18.1.9930_en-US.x86.msi"

# Install the Sensu agent
msiexec.exe /i $env:userprofile\sensu-go-agent_5.18.1.9930_en-US.x64.msi /qn

# Or via Chocolatey
choco install sensu-agent

{{< /code >}}
{{< /language-toggle >}}

### 2. Configure and start {#agent-start}

You can configure the Sensu agent with `sensu-agent start` flags (recommended) or an `/etc/sensu/agent.yml` file.
The Sensu agent requires the `--backend-url` flag at minimum, but other useful configurations and templates are available.

{{< language-toggle >}}

{{< code Docker >}}
# If you are running the agent locally on the same system as the Sensu backend,
# add `--link sensu-backend` to your Docker arguments and change the backend
# URL to `--backend-url ws://sensu-backend:8081`.

# Start an agent with the system subscription
docker run -v /var/lib/sensu:/var/lib/sensu -d \
--name sensu-agent sensu/sensu:latest \
sensu-agent start --backend-url ws://sensu.yourdomain.com:8081 --log-level debug --subscriptions system --api-host 0.0.0.0 --cache-dir /var/lib/sensu
{{< /code >}}

{{< code docker "Docker Compose" >}}
# Start an agent with the system subscription
---
version: "3"
services:
  sensu-agent:
    image: sensu/sensu:latest
    ports:
    - 3031:3031
    volumes:
    - "sensu-agent-data:/var/lib/sensu"
    command: "sensu-agent start --backend-url ws://sensu-backend:8081 --log-level debug --subscriptions system --api-host 0.0.0.0 --cache-dir /var/lib/sensu"

volumes:
  sensu-agent-data:
    driver: local
{{< /code >}}

{{< code shell "Ubuntu/Debian" >}}
# Copy the config template from the docs
sudo curl -L https://docs.sensu.io/sensu-go/latest/files/agent.yml -o /etc/sensu/agent.yml

# Start sensu-agent using a service manager
service sensu-agent start
{{< /code >}}

{{< code shell "RHEL/CentOS" >}}
# Copy the config template from the docs
sudo curl -L https://docs.sensu.io/sensu-go/latest/files/agent.yml -o /etc/sensu/agent.yml

# Start sensu-agent using a service manager
service sensu-agent start
{{< /code >}}

{{< code powershell "Windows" >}}
# Copy the example agent config file from %ALLUSERSPROFILE%\sensu\config\agent.yml.example
# (default: C:\ProgramData\sensu\config\agent.yml.example) to C:\ProgramData\sensu\config\agent.yml
cp C:\ProgramData\sensu\config\agent.yml.example C:\ProgramData\sensu\config\agent.yml

# Change to the sensu\sensu-agent\bin directory where you installed Sensu
cd 'C:\Program Files\sensu\sensu-agent\bin'

# Run the sensu-agent executable
./sensu-agent.exe

# Install and start the agent
./sensu-agent service install

{{< /code >}}

{{< /language-toggle >}}

For a complete list of configuration options, see the [agent reference][7].

### 3. Verify keepalive events

Sensu keepalives are the heartbeat mechanism used to ensure that all registered agents are operating and can reach the Sensu backend.
To confirm that the agent is registered with Sensu and is sending keepalive events, open the entity page in the [Sensu web UI][24] or run `sensuctl entity list`.

### 4. Verify an example event

With your backend and agent still running, send this request to the Sensu events API:

{{< code shell >}}
curl -X POST \
-H 'Content-Type: application/json' \
-d '{
  "check": {
    "metadata": {
      "name": "check-mysql-status"
    },
    "status": 1,
    "output": "could not connect to mysql"
  }
}' \
http://127.0.0.1:3031/events
{{< /code >}}

This request creates a `warning` event that you can [view in your web UI Events page][32].

To create an `OK` event, change the `status` to `0` and resend.
You can change the `output` value to `connected to mysql` to see a different message for the `OK` event.

## Next steps

Now that you have installed Sensu, you’re ready to build your observability pipelines!
Here are some ideas for next steps.

### Do something new with Sensu

If you're ready to see what Sensu can do, one of these pathways can get you started:

- Manually trigger an event that [sends alerts to your email inbox][12].
- [Create a check to monitor CPU usage][9] and [send Slack alerts based on your check][10].
- [Collect metrics][33] with a Sensu check and use a handler to [populate metrics in InfluxDB][37].
- Use the [sensuctl dump][38] command to export all of your events and resources as a backup &mdash; then use [sensuctl create][39] to restore if needed.

### Deploy Sensu outside your local development environment

To deploy Sensu for use outside of a local development environment, first decide whether you want to [run a Sensu cluster][22].
A Sensu cluster is a group of three or more sensu-backend nodes, each connected to a shared database provided either by Sensu’s embedded etcd or an external etcd cluster.

Clustering allows you to absorb the loss of a backend node, prevent data loss, and distribute the network load of agents.
However, scaling a single backend to a cluster or migrating a cluster from cleartext HTTP to encrypted HTTPS without downtime can require [a number of tedious steps][40].
For this reason, we recommend that you decide whether your deployment will require clustering as part of your initial planning effort.

No matter whether you deploy a single backend or a clustered configuration, begin by securing Sensu with transport layer security (TLS).
The first step in setting up TLS is to [generate the certificates you need][2].
Then, follow our [Secure Sensu][8] guide to make Sensu production-ready.

After you've secured Sensu, read [Run a Sensu cluster][22] if you are setting up a clustered configuration.

## Commercial features

Sensu Inc. offers support packages for Sensu Go and [commercial features][20] designed for monitoring at scale.

All commercial features are [free for your first 100 entities][29].
To learn more about Sensu Go commercial licenses for more than 100 entities, [contact the Sensu sales team][11].

If you already have a Sensu commercial license, [log in to your Sensu account][34] and download your license file, then add your license using sensuctl.

{{< code shell >}}
sensuctl create --file sensu_license.json
{{< /code >}}

You can use sensuctl to view your license details at any time.

{{< code shell >}}
sensuctl license info
{{< /code >}}


[1]: https://github.com/sensu/sensu-go/releases/
[2]: ../generate-certificates/
[3]: ../../web-ui/
[4]: ../../../sensuctl/
[5]: ../../../platforms/
[6]: ../../../reference/backend#configuration
[7]: ../../../reference/agent#configuration-via-flags
[8]: ../secure-sensu/
[9]: ../../../guides/monitor-server-resources/
[10]: ../../../guides/send-slack-alerts/
[11]: https://sensu.io/contact?subject=contact-sales/
[12]: ../../../guides/email-handler/
[13]: https://sensu.io/sensu-license/
[14]: ../../../learn/learn-sensu-sandbox/
[15]: ../../../reference/agent/#events-post-example
[16]: https://etcd.io/
[17]: ../../../reference/assets/
[18]: #install-sensu-agents
[19]: #install-sensuctl
[20]: ../../../commercial/
[21]: #install-the-sensu-backend
[22]: ../cluster-sensu/
[23]: ../../../sensuctl/
[24]: #4-open-the-web-ui
[25]: ../hardware-requirements/
[26]: ../../../api/
[27]: ../../../reference/agent#create-monitoring-events-using-the-agent-api
[28]: ../../../reference/agent#create-monitoring-events-using-the-statsd-listener
[29]: https://blog.sensu.io/one-year-of-sensu-go/
[30]: ../../../reference/backend#initialization
[31]: ../deployment-architecture/
[32]: http://localhost:3000/
[33]: ../../../guides/extract-metrics-with-checks/
[34]: https://account.sensu.io/
[35]: ../../../api/health/
[36]: #4-open-the-web-ui
[37]: ../../../guides/influx-db-metric-handler/
[38]: ../../../sensuctl/create-manage-resources/#export-resources
[39]: ../../../sensuctl/create-manage-resources/#create-resources
[40]: https://etcd.io/docs/v3.3.13/op-guide/runtime-configuration/
