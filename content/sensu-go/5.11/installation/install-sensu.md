---
title: "Installing Sensu"
linkTitle: "Install Sensu"
description: "Sensu Go is available for Linux, Windows (agent and CLI only), macOS (CLI only), and Docker. Read the installation guide to installed the Sensu backend, agent, and sensuctl CLI tool."
weight: 1
version: "5.11"
product: "Sensu Go"
menu:
  sensu-go-5.11:
    parent: installation
---

Sensu Go is available for Linux, Windows (agent and CLI only), macOS (CLI only), and Docker.
If you’re trying out Sensu for the first time, we recommend setting up a local environment using the [Sensu sandbox][14].
If you’re deploying Sensu to your infrastructure, we recommend one of our supported packages, Docker images, or [configuration management integrations][15].
Sensu downloads are provided under the [Sensu License][13]; see the [supported platforms page][5] for more information.

- [Install sensuctl](#install-sensuctl)
- [Install the Sensu backend](#install-the-sensu-backend)
- [Install Sensu agents](#install-sensu-agents)
- [Activate licensed-tier features](#activate-licensed-tier-features)

### Architecture overview

<img src="/images/install-sensu.svg" alt="Sensu architecture diagram">

Powered by an an embedded transport and [etcd][16] datastore, the **Sensu backend** gives you flexible, automated workflows to route metrics and alerts.
Sensu backends require persistent storage for their embedded database, disk space for local asset caching, and three exposed ports:

- `3000` - Sensu [web UI][25]
- `8080` - Sensu [API][26] used by sensuctl, some plugins, and any of your custom tooling
- `8081` - WebSocket API used by Sensu agents

Sensu backends running in a [clustered configuration][22] require additional ports.
See the [deployment guide][deploy] and [hardware requirements][hardware] guide for deployment recommendations.

**Sensu agents** are lightweight clients that run on the infrastructure components you want to monitor.
Agents register automatically with Sensu as entities and are responsible for creating check and metric events to send to the backend event pipeline.
Optionally, agents can expose ports `3031` for the [agent API][27] and `8125` for the [StatsD listener][28].
Agents using Sensu [assets][17] require some disk space for a local cache.

### Install sensuctl

Sensuctl is a command line tool for managing resources within Sensu. It works by calling Sensu’s HTTP API to create, read, update, and delete resources, events, and entities. Sensuctl is available for Linux, Windows, and macOS.

To install sensuctl:

{{< language-toggle >}}

{{< highlight "Ubuntu/Debian" >}}
# Add the Sensu repository
curl -s https://packagecloud.io/install/repositories/sensu/stable/script.deb.sh | sudo bash

# Install the sensu-go-backend package
sudo apt-get install sensu-go-cli
{{< /highlight >}}

{{< highlight "RHEL/CentOS" >}}
# Add the Sensu repository
curl https://packagecloud.io/install/repositories/sensu/stable/script.rpm.sh | sudo bash

# Install the sensu-go-backend package
sudo yum install sensu-go-cli
{{< /highlight >}}

{{< highlight "Windows" >}}
# Download sensuctl for Windows amd64
Invoke-WebRequest https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.11.1/sensu-enterprise-go_5.11.1_windows_amd64.zip  -OutFile C:\Users\Administrator\sensu-enterprise-go_5.11.1_windows_amd64.zip

# Or for 386
Invoke-WebRequest https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.11.1/sensu-enterprise-go_5.11.1_windows_386.zip  -OutFile C:\Users\Administrator\sensu-enterprise-go_5.11.1_windows_386.zip
{{< /highlight >}}

{{< highlight "macOS" >}}
# Download the latest release
curl -LO https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.11.1/sensu-enterprise-go_5.11.1_darwin_amd64.tar.gz

# Extract the archive
tar -xvf sensu-enterprise-go_5.11.1_darwin_amd64.tar.gz

# Copy the executable into your PATH.
sudo cp sensuctl /usr/local/bin/
{{< /highlight >}}

{{< /language-toggle >}}

To start using sensuctl, run `sensuctl configure` and log in with your user credentials, namespace, and [Sensu backend][21] URL. To configure sensuctl using defaults:

{{< highlight "shell" >}}
sensuctl configure -n \
--username 'admin' \
--password 'P@ssw0rd!' \
--namespace default \
--url 'http://127.0.0.1:8080'
{{< /highlight >}}

Here the `-n` flag triggers non-interactive mode.
Run `sensuctl config view` to see your user profile.
We strongly recommend that you change the default admin password immediately using `sensuctl user change-password --interactive`.
For more information about using sensuctl, see the [quickstart][23] and [reference][24] docs.

### Install the Sensu backend

The Sensu backend is available for Ubuntu/Debian, RHEL/CentOS, and Docker.
See the [supported platforms page][5] for more information.

##### 1. Download

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

##### 2. Configure and start

You can configure Sensu using `sensu-backend start` flags or an `/etc/sensu/backend.yml` file, the former taking precedence.
At a minimum, the Sensu backend requires the `state-dir` flag, but here are some other useful configs and templates.

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
    - "sensu-backend-data:/var/lib/sensu/etcd"
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

For a complete list of config options, see the [backend reference][6].

##### 3. Open the web UI

The web UI provides a unified view of your monitoring events with user-friendly tools to reduce alert fatigue.
After starting the Sensu backend, open the web UI by visiting http://localhost:3000.
You may need to replace `localhost` with the
hostname or IP address where the Sensu backend is running.

To log in, enter your Sensu user credentials, or use Sensu's default admin credentials (username: `admin` and password: `P@ssw0rd!`).
Select the ☰ icon to explore the web UI.

##### 4. Make a request to the health API

To make sure the backend is up and running, we'll check the health of the backend using the Sensu API.
You should see a response that includes `"Healthy": true`.

{{< highlight shell >}}
curl http://127.0.0.1:8080/health
{{< /highlight >}}

Now that you've installed the Sensu backend, [configure sensuctl][sensuctl] to connect to your backend URL and start monitoring your infrastructure by [installing Sensu agents][agent].

### Install Sensu agents

The Sensu agent is available for Ubuntu/Debian, RHEL/CentOS, Windows, and Docker.
See the [supported platforms page][5] for more information.

##### 1. Download {#agent-download}

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

# Install the sensu-go-backend package
sudo apt-get install sensu-go-agent
{{< /highlight >}}

{{< highlight "RHEL/CentOS" >}}
# Add the Sensu repository
curl -s https://packagecloud.io/install/repositories/sensu/stable/script.deb.sh | sudo bash

# Install the sensu-go-backend package
sudo yum install sensu-go-agent
{{< /highlight >}}

{{< highlight "Windows" >}}
# Download the Sensu agent for Windows amd64
Invoke-WebRequest https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.11.1/sensu-go-agent_5.11.1.5015_en-US.x64.msi  -OutFile "$env:userprofile\sensu-go-agent_5.11.1.5015_en-US.x64.msi"
# Or for Windows 386
Invoke-WebRequest https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.11.1/sensu-go-agent_5.11.1_2380_en-US.x86.msi  -OutFile "$env:userprofile\sensu-go-agent_5.11.1.5015_en-US.x86.msi"

# Install the Sensu agent
msiexec.exe /i $env:userprofile\sensu-go-agent_5.11.1.5015_en-US.x64.msi /qn
{{< /highlight >}}

{{< /language-toggle >}}

##### 2. Configure and start {#agent-start}

You can configure the Sensu agent using `sensu-agent start` flags or an `/etc/sensu/agent.yml` file, the former taking precedence.
At a minimum, the Sensu agent requires the `--backend-url` flag, but here are some other useful configs and templates.

{{< language-toggle >}}

{{< highlight Docker >}}
# If you are running the agent locally on the same system as the Sensu backend,
# add `--link sensu-backend` to your Docker arguments and change the backend
# URL to `--backend-url ws://sensu-backend:8081`.

# Starts an agent with the system subscription
docker run -v /var/lib/sensu:/var/lib/sensu -d \
--name sensu-agent sensu/sensu:latest \
sensu-agent start --backend-url ws://sensu.yourdomain.com:8081 --log-level debug --subscriptions system --api-host 0.0.0.0 --cache-dir /var/lib/sensu
{{< /highlight >}}

{{< highlight "Docker Compose" >}}
# Starts an agent with the system subscription
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

# Start sensu-backend using a service manager
service sensu-backend start

# Change to the sensu\sensu-agent\bin directory where you've installed Sensu.
cd 'C:\Program Files\sensu\sensu-agent\bin'

# Run the sensu-agent executable.
./sensu-agent.exe

# Install and start the agent.
./sensu-agent service install

{{< /highlight >}}

{{< /language-toggle >}}

For a complete list of config options, see the [agent reference][7].

##### 3. Verify keepalive events

Sensu keepalives are the heartbeat mechanism used to ensure that all registered agents are operational and able to reach the Sensu backend.
To verify that the agent has registered with Sensu and is sending keepalive events, open the entity page in the [Sensu web UI][ui] or run `sensuctl entity list`.

### Activate licensed-tier features

Sensu Inc. offers support packages for Sensu Go as well as license-activated features designed for monitoring at scale.
To learn more about license-activated features in Sensu Go, [contact the Sensu sales team](https://sensu.io/sales).

If you already have a Sensu license, [log in to your Sensu account](https://account.sensu.io/) and download your license file, then activate your license using sensuctl.

{{< highlight shell >}}
sensuctl create --file sensu_license.json
{{< /highlight >}}

You can use sensuctl to view your license details at any time.

{{< highlight shell >}}
sensuctl license info
{{< /highlight >}}

For more information about license-activated features in Sensu Go, see the [getting started guide](../../getting-started/enterprise).

### Next steps

Now that you've installed Sensu, here are some resources to help continue your journey:

- [Send alerts to Slack](../../guides/send-slack-alerts)
- [Monitor server resources](../../guides/monitor-server-resources)
- [Collect StatsD metrics](../../guides/aggregate-metrics-statsd)
- [Create a ready-only user](../../guides/create-read-only-user/)

[1]: https://github.com/sensu/sensu-go/releases
[2]: https://github.com/sensu/sensu-go/blob/5.1.1/packaging/files/windows/agent.yml.example
[3]: ../../dashboard/overview
[4]: ../../sensuctl/reference
[5]: ../../installation/platforms
[6]: ../../reference/backend#configuration
[7]: ../../reference/agent#configuration
[8]: ../../guides/troubleshooting
[9]: ../../guides/monitor-external-resources
[10]: ../../guides/send-slack-alerts
[12]: ../verify
[13]: https://sensu.io/sensu-license
[14]: ../../getting-started/learn-sensu
[15]: ../configuration-management
[16]: https://etcd.io/
[17]: ../../reference/assets
[20]: ../verify
[21]: #install-the-sensu-backend
[22]: ../../guides/clustering
[agent]: #install-sensu-agents
[sensuctl]: #install-sensuctl
[ui]: #3-open-the-web-ui
[23]: ../../sensuctl/quickstart
[24]: ../../sensuctl/reference
[hardware]: ../recommended-hardware
[25]: ../../dashboard/overview
[26]: ../../api/overview
[27]: ../../reference/agent#creating-monitoring-events-using-the-agent-api
[28]: ../../reference/agent#creating-monitoring-events-using-the-statsd-listener
[deploy]: ../../guides/deploying
