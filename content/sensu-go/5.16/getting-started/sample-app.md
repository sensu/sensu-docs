---
title: "Monitor containers and applications with Sensu"
description: "The Sensu sample app is a great way to learn Sensu. With this hands-on tutorial, you’ll deploy a sample app with Kubernetes and monitor it with Sensu."
version: "5.16"
product: "Sensu Go"
platformContent: true
platforms: ["Linux/macOS", "Windows"]
---

- [Prerequisites](#prerequisites)
- [Set up](#set-up)
- [Multitenancy](#multitenancy)
- [Deploy Sensu agents and InfluxDB](#deploy-sensu-agents-and-influxdb)
- [Monitor the app](#monitor-the-app)
	- [Create a Sensu pipeline to Slack](#create-a-sensu-pipeline-to-slack)
	- [Create a Sensu service check](#create-a-sensu-service-check-to-monitor-the-status-of-the-dummy-app)
- [Collect app metrics](#collect-app-metrics)
	- [Create a Sensu metric check to collect Prometheus metrics](#create-a-sensu-metric-check-to-collect-prometheus-metrics)
	- [Visualize metrics with Grafana](#visualize-metrics-with-grafana)
- [Collect Kubernetes metrics](#collect-kubernetes-metrics)
- [Next steps](#next-steps)

In this tutorial, you'll deploy a sample app with Kubernetes and monitor it with Sensu.
In the sample app, `/` returns the local hostname.
The sample app has three endpoints: `/metrics` returns Prometheus metric data, `/healthz` returns the Boolean health state, and `POST /healthz` toggles the health state.

## Prerequisites

The sample app requires Kubernetes and a Kubernetes ingress controller.
Most hosted Kubernetes offerings (like GKE) include a Kubernetes ingress controller.

This tutorial uses [Minikube][1], a cross-platform application for running a local single-node Kubernetes cluster.
After you install and start Minikube, proceed through the rest of this tutorial.

## Set up

**1. Clone the sample app.**

{{< highlight shell >}}
git clone https://github.com/sensu/sensu-kube-demo && cd sensu-kube-demo
{{< /highlight >}}

**2. Create the Kubernetes ingress resources.**

{{< highlight shell >}}
minikube start

kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/master/deploy/static/mandatory.yaml

minikube addons enable ingress

kubectl create -f go/ingress-nginx/ingress/sensu-go.yaml
{{< /highlight >}}

**3. Deploy kube-state-metrics.**

{{< highlight shell >}}
git clone https://github.com/kubernetes/kube-state-metrics

kubectl apply -f kube-state-metrics/kubernetes
{{< /highlight >}}

**4. Open your `/etc/hosts` file and add the hostnames.**

_**NOTE**: You'll use the IP address for the Minikube VM in the hosts file. To view the address, use the command `minikube ip`._

{{< highlight shell >}}
192.168.99.100       sensu.local webui.sensu.local sensu-enterprise.local dashboard.sensu-enterprise.local
192.168.99.100       influxdb.local grafana.local dummy.local
{{< /highlight >}}

**5. Install sensuctl.**

Follow the [sensuctl installation guide][2] instructions to install sensuctl on Linux, macOS, or Windows.

**6. Deploy two instances of the sample app (dummy) behind a load balancer.**

{{< highlight shell >}}
kubectl apply -f go/deploy/dummy.yaml
{{< /highlight >}}

You can test the dummy app using the API.

{{< platformBlock "Linux/macOS" >}}

{{< highlight shell >}}
# Linux/macOS
curl -i http://dummy.local
{{< /highlight >}}

{{< platformBlockClose >}}

{{< platformBlock "Windows" >}}

{{< highlight shell >}}
# Windows
Invoke-WebRequest -Uri http://dummy.local -Method GET
{{< /highlight >}}

{{< platformBlockClose >}}

A `200` response indicates that the dummy app is working correctly.

**7. Deploy the Sensu backend**

{{< highlight shell >}}
kubectl create -f go/deploy/sensu-backend.yaml
{{< /highlight >}}

## Multitenancy

Use Sensu role-based access control (RBAC) to create a `demo` namespace and a `demo` user.

**1. Configure sensuctl to use the admin user.**

When you installed the Sensu backend, during the [initialization step][14], you created an admin username and password for a `default` namespace. Use that username and password to configure sensuctl in this step.

_**NOTE**: If you're using Docker, the username is `admin` and the password is `P@ssw0rd!`._

{{< highlight shell >}}
sensuctl configure
? Sensu Backend URL: http://sensu.local
? Username: YOUR_USERNAME
? Password: YOUR_PASSWORD
? Namespace: default
? Preferred output format: tabular
{{< /highlight >}}

**2. Create a `demo` namespace.**

{{< highlight shell >}}
sensuctl namespace create demo
{{< /highlight >}}

Use sensuctl to confirm that the namespace was created successfully and set the `demo` namespace as the default for your sensuctl session:

{{< highlight shell >}}
sensuctl namespace list

sensuctl config set-namespace demo
{{< /highlight >}}

**3. Create a `dev` user role with full access to the `demo` namespace.**

{{< highlight shell >}}
sensuctl role create dev \
--verb get,list,create,update,delete \
--resource \* --namespace demo
{{< /highlight >}}

**4. Create a `dev` role binding for the `dev` group.**

{{< highlight shell >}}
sensuctl role-binding create dev --role dev --group dev
{{< /highlight >}}

**5. Create a `demo` user that is a member of the `dev` group.**

{{< highlight shell >}}
sensuctl user create demo --interactive
? Username: demo
? Password: DEMO_PASSWORD
? Groups: dev
{{< /highlight >}}

**6. Reconfigure sensuctl to use the `demo` user and `demo` namespace.**

{{< highlight shell >}}
sensuctl configure
? Sensu Backend URL: http://sensu.local
? Username: demo
? Password: password
? Namespace: demo
? Preferred output format: tabular
{{< /highlight >}}

## Deploy Sensu agents and InfluxDB

**1. Deploy InfluxDB with a Sensu agent sidecar**

Create a Kubernetes ConfigMap for InfluxDB configuration.

{{< highlight shell >}}
kubectl create configmap influxdb-config --from-file go/configmaps/influxdb.conf
{{< /highlight >}}

Deploy InfluxDB with a Sensu agent sidecar.

{{< highlight shell >}}
kubectl create -f go/deploy/influxdb.sensu.yaml
{{< /highlight >}}

**2. Create a Sensu pipeline to store metrics with InfluxDB.**

Use the files provided with the sample app to create a Sensu asset for the [Sensu InfluxDB handler][3] and create an `influxdb` event handler.

{{< highlight shell >}}
sensuctl create --file go/config/assets/influxdb-handler.yaml

sensuctl create --file go/config/handlers/influxdb.yaml
{{< /highlight >}}

**3. Deploy Sensu agent sidecars for the dummy app instances.**

{{< highlight shell >}}
kubectl apply -f go/deploy/dummy.sensu.yaml
{{< /highlight >}}

## Monitor the app

Let's take a look at what you're monitoring.
You can see the Sensu agents installed on your two dummy app instances with their last-seen timestamps, as well as the Sensu agent monitoring your InfluxDB instance. 

{{< highlight shell >}}
sensuctl entity list

            ID               Class    OS                   Subscriptions                           Last Seen            
─────────────────────────── ─────── ─────── ─────────────────────────────────────────── ─────────────────────────────── 
dummy-76d8fb7bdf-967q7      agent   linux   dummy,entity:dummy-76d8fb7bdf-967q7         2019-01-18 10:56:56 -0800 PST  
dummy-76d8fb7bdf-knh7r      agent   linux   dummy,entity:dummy-76d8fb7bdf-knh7r         2019-01-18 10:56:56 -0800 PST  
influxdb-64b7d5f884-f9ptg   agent   linux   influxdb,entity:influxdb-64b7d5f884-f9ptg   2019-01-18 10:56:59 -0800 PST  
{{< /highlight >}}

### Create a Sensu pipeline to Slack

Suppose you want to receive a Slack alert if the dummy app returns an unhealthy response.
You can create a Sensu pipeline to send events to Slack using the [Sensu Slack handler][4] (one of many open-source collections of Sensu building blocks shared by the Sensu community).

**1. Create an asset to help agents find and install the [Sensu Slack handler][4].**

{{< highlight shell >}}
sensuctl create --file go/config/assets/slack-handler.yaml
{{< /highlight >}}

**2. Get your Slack webhook URL and add it to `go/config/handlers/slack.yaml`.**

If you're already an admin of a Slack, visit `https://YOUR WORKSPACE NAME HERE.slack.com/services/new/incoming-webhook` and follow the steps to add the Incoming WebHooks integration and save the settings.
If you're not yet a Slack admin, [start here][5] to create a new workspace.
After saving, you'll see your webhook URL under Integration Settings.

Open `go/config/handlers/slack.yaml`. In the following line, replace `SECRET` with your Slack workspace webhook URL and `#demo` with the Slack channel of your choice:

{{< highlight shell >}}
"command": "slack-handler --channel '#demo' --timeout 20 --username 'sensu' --webhook-url 'SECRET'",
{{< /highlight >}}

So it looks something like:

{{< highlight shell >}}
"command": "slack-handler --channel '#my-channel' --timeout 20 --username 'sensu' --webhook-url 'https://hooks.slack.com/services/XXXXXXXXXXXXXXXX'",
{{< /highlight >}}

**3. Create a handler to send events to Slack using the `slack-handler` asset.**

{{< highlight shell >}}
sensuctl create --file go/config/handlers/slack.yaml
{{< /highlight >}}

### Create a Sensu service check to monitor the status of the dummy app

To automatically monitor the status of the dummy app, create an asset that lets the Sensu agent use a [Sensu HTTP plugin][6].

**1. Create the `check-plugins` asset.**

{{< highlight shell >}}
sensuctl create --file go/config/assets/check-plugins.yaml
{{< /highlight >}}

**2. Create a check to monitor the status of the dummy app that uses the `check-plugins` asset and the Slack pipeline.**

{{< highlight shell >}}
sensuctl create --file go/config/checks/dummy-app-healthz.yaml
{{< /highlight >}}

With the automated alert workflow in place, you can see the resulting events in the Sensu dashboard.

**3. Sign in to the Sensu dashboard.**

Sign in to the [Sensu dashboard][7] with your sensuctl username (`demo`) and password (`password`).
Since you're working within the `demo` namespace, select the `demo` namespace in the Sensu dashboard menu.

**4. Toggle the health of the dummy app to simulate a failure.**

{{< platformBlock "Linux/macOS" >}}

{{< highlight shell >}}
# Linux/macOS
curl -iXPOST http://dummy.local/healthz
{{< /highlight >}}

{{< platformBlockClose >}}

{{< platformBlock "Windows" >}}

{{< highlight shell >}}
# Windows
Invoke-WebRequest -Uri http://dummy.local/healthz -Method POST
{{< /highlight >}}

{{< platformBlockClose >}}

You should now be able to see a critical alert in the [Sensu dashboard][8] as well as by using sensuctl:

{{< highlight shell >}}
sensuctl event list
{{< /highlight >}}

You should also see an alert in Slack.

Continue to post to `/healthz` until all Sensu entities return to a healthy state.

{{< platformBlock "Linux/macOS" >}}

{{< highlight shell >}}
# Linux/macOS
curl -iXPOST http://dummy.local/healthz
{{< /highlight >}}

{{< platformBlockClose >}}

{{< platformBlock "Windows" >}}

{{< highlight shell >}}
# Windows
Invoke-WebRequest -Uri http://dummy.local/healthz -Method POST
{{< /highlight >}}

{{< platformBlockClose >}}

## Collect app metrics

### Create a Sensu metric check to collect Prometheus metrics

To automatically collect Prometheus metrics from the dummy app, create an asset that lets the Sensu agents use the [Sensu Prometheus Collector][9].

**1. Create the `prometheus-collector` asset.**

{{< highlight shell >}}
sensuctl create --file go/config/assets/prometheus-collector.yaml
{{< /highlight >}}

**2. Create a check to collect Prometheus metrics that uses the `prometheus-collector` asset.**

{{< highlight shell >}}
sensuctl create --file go/config/checks/dummy-app-prometheus.yaml
{{< /highlight >}}

### Visualize metrics with Grafana

**1. Deploy Grafana with a Sensu agent sidecar.**

Create Kubernetes ConfigMaps for Grafana configuration:

{{< highlight shell >}}
kubectl create configmap grafana-provisioning-datasources --from-file=./go/configmaps/grafana-provisioning-datasources.yaml

kubectl create configmap grafana-provisioning-dashboards --from-file=./go/configmaps/grafana-provisioning-dashboards.yaml
{{< /highlight >}}

Deploy Grafana with a Sensu agent sidecar:

{{< highlight shell >}}
kubectl apply -f go/deploy/grafana.sensu.yaml
{{< /highlight >}}

After a few minutes, you can see the Sensu agents you installed on the dummy app, InfluxDB, and Grafana pods.

{{< highlight shell >}}
sensuctl entity list
            ID               Class    OS                   Subscriptions                           Last Seen            
─────────────────────────── ─────── ─────── ─────────────────────────────────────────── ─────────────────────────────── 
dummy-6c57b8f868-ft5dz      agent   linux   dummy,entity:dummy-6c57b8f868-ft5dz         2018-11-20 18:43:15 -0800 PST  
dummy-6c57b8f868-m24hw      agent   linux   dummy,entity:dummy-6c57b8f868-m24hw         2018-11-20 18:43:15 -0800 PST  
grafana-5b88f8df8d-vgjtm    agent   linux   grafana,entity:grafana-5b88f8df8d-vgjtm     2018-11-20 18:43:14 -0800 PST  
influxdb-78d64bcfd9-8km56   agent   linux   influxdb,entity:influxdb-78d64bcfd9-8km56   2018-11-20 18:43:12 -0800 PST  
{{< /highlight >}}

**2. Log in to Grafana.**

To see the metrics you're collecting from the dummy app, log into [Grafana](http://grafana.local/login) with the username `admin` and password `password`.

**3. Create a dashboard.**

Create a new dashboard using the InfluxDB datasource to see live metrics from the dummy app.

## Collect Kubernetes metrics

Now that you have a pipeline set up to send metrics, you can create a check that collects Prometheus metrics from Kubernetes and connect it to the pipeline.

Deploy a Sensu agent as a DameonSet on your Kubernetes node:

{{< highlight shell >}}
kubectl apply -f go/deploy/sensu-agent-daemonset.yaml
{{< /highlight >}}

Create a check to collect Prometheus metrics from Kubernetes using the `prometheus-collector` asset and `influxdb` handler:

{{< highlight shell >}}
sensuctl create --file go/config/checks/kube-state-prometheus.yaml
{{< /highlight >}}

You should now be able to access Kubernetes metrics data in [Grafana][10] and see metric events in the [Sensu dashboard][8].

## Next steps

To stop or delete the sample app, use `minikube stop` or `minikube delete`, respectively.

For more information about monitoring with Sensu, check out these resources:

- [Reduce alert fatigue with Sensu filters][11]
- [Aggregate metrics with the Sensu StatsD listener][12]
- [Collect metrics with Sensu checks][13]

[1]: https://kubernetes.io/docs/tasks/tools/install-minikube/
[2]: ../../installation/install-sensu/#install-sensuctl
[3]: https://github.com/sensu/sensu-influxdb-handler/
[4]: https://bonsai.sensu.io/assets/sensu/sensu-slack-handler/
[5]: https://slack.com/get-started#create
[6]: https://github.com/portertech/sensu-plugins-go/
[7]: http://webui.sensu.local/signin/
[8]: http://webui.sensu.local/events/
[9]: https://bonsai.sensu.io/assets/sensu/sensu-prometheus-collector/
[10]: http://grafana.local/
[11]: ../../guides/reduce-alert-fatigue/
[12]: ../../guides/aggregate-metrics-statsd/
[13]: ../../guides/extract-metrics-with-checks/
[14]: ../../installation/install-sensu/#3-initialize
