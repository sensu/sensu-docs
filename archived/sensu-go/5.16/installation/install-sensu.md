---
title: "Install Sensu"
linkTitle: "Install Sensu"
description: "Sensu Go is available for Linux, Windows (agent and CLI only), macOS (CLI only), and Docker. Read this installation guide to install the Sensu backend, Sensu agent, and sensuctl command line tool."
weight: 10
version: "5.16"
product: "Sensu Go"
menu:
  sensu-go-5.16:
    parent: installation
---

- [Architecture overview](#architecture-overview)
- [Install the Sensu backend](#install-the-sensu-backend)
- [Install sensuctl](#install-sensuctl)
- [Install Sensu agents](#install-sensu-agents)
- [Commercial features](#commercial-features)
- [Next steps](#next-steps)

This installation guide describes how to install the Sensu backend, Sensu agent, and sensuctl command line tool.

Sensu Go is available for Linux, Windows (agent and CLI only), macOS (CLI only), and Docker.
If you’re trying Sensu for the first time, we recommend setting up a local environment using the [Sensu sandbox][14].
If you’re deploying Sensu to your infrastructure, we recommend one of our supported packages, Docker images, or [configuration management integrations][15].
Sensu downloads are provided under the [Sensu commercial license][13].
See [supported platforms][5] for more information.

## Architecture overview

{{< figure src="/images/go/install_sensu/basic_architecture.png" alt="Basic Sensu architecture diagram showing agents and the backend" link="/images/go/install_sensu/basic_architecture.png" target="_blank" >}}
<!-- Diagram source: https://www.lucidchart.com/documents/edit/3949dde6-1bad-4f37-aa01-00a71c47a91b/0 -->

The **Sensu backend** gives you flexible, automated workflows to route metrics and alerts.
It is powered by an an embedded transport and [etcd][16] datastore and 
Sensu backends require persistent storage for their embedded database, disk space for local asset caching, and three exposed ports:

- `3000` - Sensu [web UI][3]
- `8080` - Sensu [API][26] used by sensuctl, some plugins, and any of your custom tooling
- `8081` - WebSocket API used by Sensu agents

Sensu backends running in a [clustered configuration][22] require additional ports.
See [Deploy Sensu][31] and [hardware requirements][25] for deployment recommendations.

**Sensu agents** are lightweight clients that run on the infrastructure components you want to monitor.
Agents register automatically with Sensu as entities and are responsible for creating check and metric events to send to the backend event pipeline.
Agents can expose ports `3031` for the [agent API][27] and `8125` for the [StatsD listener][28].
Agents using Sensu [assets][17] require some disk space for a local cache.

## Install the Sensu backend

The Sensu backend is available for Ubuntu/Debian, RHEL/CentOS, and Docker.
See [supported platforms][5] for more information.

### 1. Download

{{< language-toggle >}}

{{< highlight Docker >}}
# All Sensu Docker images contain a Sensu backend and a Sensu agent

# Pull the Alpine-based image
docker pull sensu/sensu

# Pull the image based on Red Hat Enterprise Linux
docker pull sensu/sensu-rhel
{{< /highlight >}}

{{< highlight "Ubuntu/Debian" >}}
# Add the Sensu repository
curl -s https://packagecloud.io/install/repositories/sensu/stable/script.deb.sh | sudo bash

# Install the sensu-go-backend package
sudo apt-get install sensu-go-backend
{{< /highlight >}}

{{< highlight "RHEL/CentOS" >}}
# Add the Sensu repository
curl -s https://packagecloud.io/install/repositories/sensu/stable/script.rpm.sh | sudo bash

# Install the sensu-go-backend package
sudo yum install sensu-go-backend
{{< /highlight >}}

{{< /language-toggle >}}

### 2. Configure and start

You can configure the Sensu backend with `sensu-backend start` flags (recommended) or an `/etc/sensu/backend.yml` file.
The Sensu backend requires the `state-dir` flag at minimum, but other useful configurations and templates are available.

{{< language-toggle >}}

{{< highlight Docker >}}
docker run -v /var/lib/sensu:/var/lib/sensu \
-d --name sensu-backend \
-p 3000:3000 -p 8080:8080 -p 8081:8081 sensu/sensu:latest \
sensu-backend start --state-dir /var/lib/sensu/sensu-backend --log-level debug
{{< /highlight >}}

{{< highlight "Docker Compose" >}}
---
version: "3"
services:
  sensu-backend:
    image: sensu/sensu:latest
    ports:
    - 3000:3000
    - 8080:8080
    - 8081:8081
    volumes:
    - "sensu-backend-data:/var/lib/sensu/sensu-backend/etcd"
    command: "sensu-backend start --state-dir /var/lib/sensu/sensu-backend --log-level debug"

volumes:
  sensu-backend-data:
    driver: local
{{< /highlight >}}

{{< highlight "Ubuntu/Debian" >}}
# Copy the config template from the docs
sudo curl -L https://docs.sensu.io/sensu-go/latest/files/backend.yml -o /etc/sensu/backend.yml

# Start sensu-backend using a service manager
sudo service sensu-backend start

# Verify that the backend is running
service sensu-backend status
{{< /highlight >}}

{{< highlight "RHEL/CentOS" >}}
# Copy the config template from the docs
sudo curl -L https://docs.sensu.io/sensu-go/latest/files/backend.yml -o /etc/sensu/backend.yml

# Start sensu-backend using a service manager
sudo service sensu-backend start

# Verify that the backend is running
service sensu-backend status
{{< /highlight >}}

{{< /language-toggle >}}

For a complete list of configuration options, see the [backend reference][6].

### 3. Initialize

_**NOTE**: If you are using Docker, skip this step and continue with [4. Open the web UI][36]. The `sensu-backend init` command is not implemented for Docker._

**With the backend running**, run `sensu-backend init` to set up your Sensu administrator username and password.
In this initialization step, you only need to set environment variables with a username and password string &mdash; no need for role-based access control (RBAC).

Replace `YOUR_USERNAME` and `YOUR_PASSWORD` with the username and password you want to use:

{{< highlight shell >}}
export SENSU_BACKEND_CLUSTER_ADMIN_USERNAME=YOUR_USERNAME
export SENSU_BACKEND_CLUSTER_ADMIN_PASSWORD=YOUR_PASSWORD
sensu-backend init
{{< /highlight >}}

For details about `sensu-backend init`, see the [backend reference][30].

### 4. Open the web UI

The web UI provides a unified view of your monitoring events and user-friendly tools to reduce alert fatigue.
After starting the Sensu backend, open the web UI by visiting http://localhost:3000.
You may need to replace `localhost` with the hostname or IP address where the Sensu backend is running.

To log in to the web UI, enter your Sensu user credentials (the user ID and password you provided with `sensu-backend init`, or `admin` and `P@ssw0rd!` if you're using Docker).
Select the ☰ icon to explore the web UI.

### 5. Make a request to the health API

To make sure the backend is up and running, use the Sensu [health API][35] to check the backend's health.
You should see a response that includes `"Healthy": true`.

{{< highlight shell >}}
curl http://127.0.0.1:8080/health
{{< /highlight >}}

Now that you've installed the Sensu backend, [install and configure sensuctl][19] to connect to your backend URL.
Then you can [install a Sensu agent][18] and start monitoring your infrastructure.

## Install sensuctl

[Sensuctl][4] is a command line tool for managing resources within Sensu.
It works by calling Sensu’s HTTP API to create, read, update, and delete resources, events, and entities.
Sensuctl is available for Linux, Windows, and macOS.

To install sensuctl:

{{< language-toggle >}}

{{< highlight "Ubuntu/Debian" >}}
# Add the Sensu repository
curl -s https://packagecloud.io/install/repositories/sensu/stable/script.deb.sh | sudo bash

# Install the sensu-go-cli package
sudo apt-get install sensu-go-cli
{{< /highlight >}}

{{< highlight "RHEL/CentOS" >}}
# Add the Sensu repository
curl https://packagecloud.io/install/repositories/sensu/stable/script.rpm.sh | sudo bash

# Install the sensu-go-cli package
sudo yum install sensu-go-cli
{{< /highlight >}}

{{< highlight "Windows" >}}
# Download sensuctl for Windows amd64
Invoke-WebRequest https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.16.1/sensu-go_5.16.1_windows_amd64.zip  -OutFile C:\Users\Administrator\sensu-go_5.16.1_windows_amd64.zip

# Or for 386
Invoke-WebRequest https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.16.1/sensu-go_5.16.1_windows_386.zip  -OutFile C:\Users\Administrator\sensu-go_5.16.1_windows_386.zip
{{< /highlight >}}

{{< highlight "macOS" >}}
# Download the latest release
curl -LO https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.16.1/sensu-go_5.16.1_darwin_amd64.tar.gz

# Extract the archive
tar -xvf sensu-go_5.16.1_darwin_amd64.tar.gz

# Copy the executable into your PATH
sudo cp sensuctl /usr/local/bin/
{{< /highlight >}}

{{< /language-toggle >}}

To start using sensuctl, run `sensuctl configure` and log in with your user credentials, namespace, and [Sensu backend][21] URL.
To configure sensuctl using default values:

{{< highlight "shell" >}}
sensuctl configure -n \
--username 'YOUR_USERNAME' \
--password 'YOUR_PASSWORD' \
--namespace default \
--url 'http://127.0.0.1:8080'
{{< /highlight >}}

Here, the `-n` flag triggers non-interactive mode.
Run `sensuctl config view` to see your user profile.

We recommend that you change the default admin password immediately: `sensuctl user change-password --interactive`.

For more information about sensuctl, see the [quickstart][23] and [reference][4] docs.

## Install Sensu agents

The Sensu agent is available for Ubuntu/Debian, RHEL/CentOS, Windows, and Docker.
See [supported platforms][5] for more information.

### 1. Download {#agent-download}

{{< language-toggle >}}

{{< highlight Docker >}}
# All Sensu images contain a Sensu backend and a Sensu agent

# Pull the Alpine-based image
docker pull sensu/sensu

# Pull the RHEL-based image
docker pull sensu/sensu-rhel
{{< /highlight >}}

{{< highlight "Ubuntu/Debian" >}}
# Add the Sensu repository
curl -s https://packagecloud.io/install/repositories/sensu/stable/script.deb.sh | sudo bash

# Install the sensu-go-agent package
sudo apt-get install sensu-go-agent
{{< /highlight >}}

{{< highlight "RHEL/CentOS" >}}
# Add the Sensu repository
curl -s https://packagecloud.io/install/repositories/sensu/stable/script.rpm.sh | sudo bash

# Install the sensu-go-agent package
sudo yum install sensu-go-agent
{{< /highlight >}}

{{< highlight "Windows" >}}
# Download the Sensu agent for Windows amd64
Invoke-WebRequest https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.16.1/sensu-go-agent_5.16.1.8521_en-US.x64.msi  -OutFile "$env:userprofile\sensu-go-agent_5.16.1.8521_en-US.x64.msi"

# Or for Windows 386
Invoke-WebRequest https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.16.1/sensu-go-agent_5.16.1.8521_en-US.x86.msi  -OutFile "$env:userprofile\sensu-go-agent_5.16.1.8521_en-US.x86.msi"

# Install the Sensu agent
msiexec.exe /i $env:userprofile\sensu-go-agent_5.16.1.8521_en-US.x64.msi /qn

# Or via Chocolatey
choco install sensu-agent

{{< /highlight >}}
{{< /language-toggle >}}

### 2. Configure and start {#agent-start}

You can configure the Sensu agent with `sensu-agent start` flags (recommended) or an `/etc/sensu/agent.yml` file.
The Sensu agent requires the `--backend-url` flag at minimum, but other useful configurations and templates are available.

{{< language-toggle >}}

{{< highlight Docker >}}
# If you are running the agent locally on the same system as the Sensu backend,
# add `--link sensu-backend` to your Docker arguments and change the backend
# URL to `--backend-url ws://sensu-backend:8081`.

# Start an agent with the system subscription
docker run -v /var/lib/sensu:/var/lib/sensu -d \
--name sensu-agent sensu/sensu:latest \
sensu-agent start --backend-url ws://sensu.yourdomain.com:8081 --log-level debug --subscriptions system --api-host 0.0.0.0 --cache-dir /var/lib/sensu
{{< /highlight >}}

{{< highlight "Docker Compose" >}}
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
{{< /highlight >}}

{{< highlight "Ubuntu/Debian" >}}
# Copy the config template from the docs
sudo curl -L https://docs.sensu.io/sensu-go/latest/files/agent.yml -o /etc/sensu/agent.yml

# Start sensu-agent using a service manager
service sensu-agent start
{{< /highlight >}}

{{< highlight "RHEL/CentOS" >}}
# Copy the config template from the docs
sudo curl -L https://docs.sensu.io/sensu-go/latest/files/agent.yml -o /etc/sensu/agent.yml

# Start sensu-agent using a service manager
service sensu-agent start
{{< /highlight >}}

{{< highlight "Windows" >}}
# Copy the example agent config file from %ALLUSERSPROFILE%\sensu\config\agent.yml.example
# (default: C:\ProgramData\sensu\config\agent.yml.example) to C:\ProgramData\sensu\config\agent.yml
cp C:\ProgramData\sensu\config\agent.yml.example C:\ProgramData\sensu\config\agent.yml

# Change to the sensu\sensu-agent\bin directory where you installed Sensu
cd 'C:\Program Files\sensu\sensu-agent\bin'

# Run the sensu-agent executable
./sensu-agent.exe

# Install and start the agent
./sensu-agent service install

{{< /highlight >}}

{{< /language-toggle >}}

For a complete list of configuration options, see the [agent reference][7].

### 3. Verify keepalive events

Sensu keepalives are the heartbeat mechanism used to ensure that all registered agents are operating and can reach the Sensu backend.
To confirm that the agent is registered with Sensu and is sending keepalive events, open the entity page in the [Sensu web UI][24] or run `sensuctl entity list`.

## Commercial features

Sensu Inc. offers support packages for Sensu Go and [commercial features][20] designed for monitoring at scale.

All commercial features are [free for your first 100 entities][29].
To learn more about Sensu Go commercial licenses for more than 100 entities, [contact the Sensu sales team][11].

If you already have a Sensu commercial license, [log in to your Sensu account][34] and download your license file, then add your license using sensuctl.

{{< highlight shell >}}
sensuctl create --file sensu_license.json
{{< /highlight >}}

You can use sensuctl to view your license details at any time.

{{< highlight shell >}}
sensuctl license info
{{< /highlight >}}

## Next steps

Now that you've installed Sensu, here are some resources to help continue your journey:

- [Send Slack alerts with handlers][10]
- [Monitor server resources with checks][9]
- [Aggregate metrics with the Sensu StatsD listener][32]
- [Create a read-only user with RBAC][33]

[1]: https://github.com/sensu/sensu-go/releases/
[3]: ../../dashboard/overview/
[4]: ../../sensuctl/reference/
[5]: ../../installation/platforms
[6]: ../../reference/backend#configuration
[7]: ../../reference/agent#configuration
[9]: ../../guides/monitor-server-resources/
[10]: ../../guides/send-slack-alerts/
[11]: https://sensu.io/contact?subject=contact-sales/
[12]: ../verify/
[13]: https://sensu.io/sensu-license/
[14]: ../../getting-started/learn-sensu/
[15]: ../configuration-management/
[16]: https://etcd.io/
[17]: ../../reference/assets/
[18]: #install-sensu-agents
[19]: #install-sensuctl
[20]: ../../getting-started/enterprise/
[21]: #install-the-sensu-backend
[22]: ../../guides/clustering/
[23]: ../../sensuctl/quickstart/
[24]: #4-open-the-web-ui
[25]: ../recommended-hardware/
[26]: ../../api/overview/
[27]: ../../reference/agent#create-monitoring-events-using-the-agent-api
[28]: ../../reference/agent#create-monitoring-events-using-the-statsd-listener
[29]: https://blog.sensu.io/one-year-of-sensu-go/
[30]: ../../reference/backend#initialization
[31]: ../../guides/deploying/
[32]: ../../guides/aggregate-metrics-statsd/
[33]: ../../guides/create-read-only-user/
[34]: https://account.sensu.io/
[35]: ../../api/health/
[36]: #4-open-the-web-ui
