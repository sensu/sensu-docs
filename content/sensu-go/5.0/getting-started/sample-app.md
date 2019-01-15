---
title: "Get started with the Sensu sample app"
linkTitle: "Sample app"
description: "Container and application monitoring with Sensu"
weight: 3
version: "5.0"
product: "Sensu Go"
menu:
  sensu-go-5.0:
    parent: getting-started
---

In this tutorial, we'll deploy a dummy app with Kubernetes and monitor it with Sensu.

The dummy app has three endpoints: `/` returns the local hostname, `/metrics` returns app Prometheus metric data, `/healthz` returns the boolean app health state, and `POST /healthz` toggles the app health state.

- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Multitenancy](#multitenancy)
- [Deploying Sensu agents and InfluxDB](#deploying-sensu-agents-and-influxdb)
- [Monitoring an app](#monitoring-an-app)
	- [Create a Sensu pipeline to Slack](#create-a-sensu-pipeline-to-slack)
	- [Create a Sensu service check to monitor the status of the dummy app](#create-a-sensu-service-check-to-monitor-the-status-of-the-dummy-app)
- [Collecting app metrics](#collecting-app-metrics)
	- [Create a Sensu pipeline to InfluxDB](#create-a-sensu-pipeline-to-influxdb)
	- [Create a Sensu service check to collect Prometheus metrics](#create-a-sensu-service-check-to-collect-prometheus-metrics)
	- [Use Grafana to visualize metrics](#use-grafana-to-visualize-metrics)
- [Collecting Kubernetes metrics](#collecting-kubernetes-metrics)
- [Next steps](#next-steps)

## Prerequisites

The sample app requires Kubernetes and a Kubernetes Ingress controller.
Most hosted Kubernetes offerings, such as GKE, include a Kubernetes Ingress controller.

For the purpose of this guide, we'll be using [Minikube](https://kubernetes.io/docs/tasks/tools/install-minikube/), a cross-platform application for running a local single-node Kubernetes cluster. After you've installed Minikube, proceed through the rest of the guide.

## Setup

**1. Clone the sample app.**

{{< highlight shell >}}
git clone git@github.com:sensu/sensu-kube-demo.git

cd sensu-kube-demo
{{< /highlight >}}

**2. Create the Kubernetes ingress resources.**

{{< highlight shell >}}
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/master/deploy/mandatory.yaml

minikube addons enable ingress

kubectl create -f go/ingress-nginx/ingress/sensu-go.yaml
{{< /highlight >}}

**3. Deploy kube-state-metrics.**

{{< highlight shell >}}
git clone git@github.com:kubernetes/kube-state-metrics.git

kubectl apply -f kube-state-metrics/kubernetes
{{< /highlight >}}

**4. Open your `/etc/hosts` file and add the following hostnames.**

{{< highlight shell >}}
192.168.99.100       sensu.local webui.sensu.local sensu-enterprise.local dashboard.sensu-enterprise.local
192.168.99.100       influxdb.local grafana.local dummy.local
{{< /highlight >}}

**5. Install sensuctl.**

Jump over to the [sensuctl installation guide](https://docs.sensu.io/sensu-go/latest/installation/install-sensu/#install-sensuctl), and follow the instructions to install sensuctl on Windows, macOS, or Linux.

**6. Deploy two instances of a dummy app behind a load balancer.**

{{< highlight shell >}}
kubectl apply -f go/deploy/dummy.yaml
{{< /highlight >}}

We can test the dummy app using the API.

{{< highlight shell >}}
curl -i http://dummy.local
{{< /highlight >}}

A `200` response indicates that the dummy app is working correctly.

**7. Deploy the Sensu backend**

{{< highlight shell >}}
kubectl create -f go/deploy/sensu-backend.yaml
{{< /highlight >}}

## Multitenancy

Use Sensu role-based access control to create a `demo` namespace and a `demo` user.

**1. Configure sensuctl to use the built-in `admin` user.**

{{< highlight shell >}}
sensuctl configure
? Sensu Backend URL: http://sensu.local
? Username: admin
? Password: P@ssw0rd!
? Namespace: default
? Preferred output format: tabular
{{< /highlight >}}

**2. Create `demo` namespace.**

{{< highlight shell >}}
sensuctl namespace create demo

sensuctl namespace list

sensuctl config set-namespace demo
{{< /highlight >}}

**3. Create `dev` user role with full-access to the `demo` namespace.**

{{< highlight shell >}}
sensuctl role create dev \
--verb get,list,create,update,delete \
--resource \* --namespace demo
{{< /highlight >}}

**4. Create `dev` role binding for `dev` group.**

{{< highlight shell >}}
sensuctl role-binding create dev --role dev --group dev
{{< /highlight >}}

**5. Create `demo` user that is a member of the `dev` group.**

{{< highlight shell >}}
sensuctl user create demo --interactive
? Username: demo
? Password: ********
? Groups: dev
{{< /highlight >}}

**6. Reconfigure sensuctl to use the `demo` user and `demo` namespace.**

{{< highlight shell >}}
sensuctl configure
? Sensu Backend URL: http://sensu.local
? Username: demo
? Password: ********
? Namespace: demo
? Preferred output format: tabular
{{< /highlight >}}

**7. Log in to the Sensu dashboard.**

At http://webui.sensu.local/signin, sign in with your sensuctl username (`demo`) and password.

## Deploying Sensu agents and InfluxDB

**1. Deploy InfluxDB with a Sensu Agent sidecar**

Create a Kubernetes ConfigMap for InfluxDB configuration

{{< highlight shell >}}
kubectl create configmap influxdb-config --from-file go/configmaps/influxdb.conf
{{< /highlight >}}

Deploy InfluxDB with a Sensu Agent sidecar

{{< highlight shell >}}
kubectl create -f go/deploy/influxdb.sensu.yaml
{{< /highlight >}}

**2. Create a Sensu pipeline to store metrics with InfluxDB.**

Register a Sensu asset for the [Sensu InfluxDB handler][], and create an `influxdb` event handler.

{{< highlight shell >}}
sensuctl create -f go/config/assets/influxdb-handler.yaml

sensuctl create -f go/config/handlers/influxdb.yaml
{{< /highlight >}}

**3. Deploy Sensu agent sidecars for the dummy app instances.**

{{< highlight shell >}}
kubectl apply -f go/deploy/dummy.sensu.yaml
{{< /highlight >}}

## Monitoring an app

Let's take a look at what we're monitoring.

{{< highlight shell >}}
sensuctl entity list
{{< /highlight >}}

We can see the Sensu agents we have installed on the dummy app with their last seen timestamp.

{{< highlight shell >}}
ID               Class    OS                   Subscriptions                           Last Seen            
─────────────────────────── ─────── ─────── ─────────────────────────────────────────── ─────────────────────────────── 
dummy-6c57b8f868-ft5dz      agent   linux   dummy,entity:dummy-6c57b8f868-ft5dz         2018-11-20 18:43:15 -0800 PST  
dummy-6c57b8f868-m24hw      agent   linux   dummy,entity:dummy-6c57b8f868-m24hw         2018-11-20 18:43:15 -0800 PST   
{{< /highlight >}}

### Create a Sensu pipeline to Slack
Let’s say we want to receive a Slack alert if the dummy app returns an unhealthy response.
We can create a Sensu pipeline to send alerts to a #demo channel in Slack using the [Sensu Slack plugin](https://github.com/sensu/sensu-slack-handler).
Sensu Plugins are open-source collections of Sensu building blocks shared by the Sensu Community.

**1. Create an asset to help agents find and install the [Sensu Slack handler](https://github.com/sensu/sensu-slack-handler)**

{{< highlight shell >}}
sensuctl create -f go/config/assets/slack-handler.yaml
{{< /highlight >}}

**2. Get your Slack webhook URL and add it to `go/config/handlers/slack.json`.**

If you're already an admin of a Slack, visit `https://YOUR WORKSPACE NAME HERE.slack.com/services/new/incoming-webhook` and follow the steps to add the Incoming WebHooks integration and save the settings.
(If you're not yet a Slack admin, start [here](https://slack.com/get-started#create) to create a new workspace.)
After saving, you'll see your webhook URL under Integration Settings.

Open `go/config/handlers/slack.yaml` and replace `SECRET` in the following line with your Slack workspace webhook URL:

{{< highlight shell >}}
"command": "slack-handler --channel '#demo' --timeout 20 --username 'sensu' --webhook-url 'SECRET'",
{{< /highlight >}}

So it looks something like:

{{< highlight shell >}}
"command": "slack-handler --channel '#demo' --timeout 20 --username 'sensu' --webhook-url 'https://hooks.slack.com/services/XXXXXXXXXXXXXXXX'",
{{< /highlight >}}

**3. Create a handler to send alert events to Slack that uses the `slack-handler` asset.**

{{< highlight shell >}}
sensuctl create -f go/config/handlers/slack.yaml
{{< /highlight >}}

### Create a Sensu service check to monitor the status of the dummy app

To automatically monitor the status of the dummy app, we'll create an asset that lets the Sensu agents use a [Sensu HTTP plugin](https://github.com/portertech/sensu-plugins-go).

**1. Create the `check-plugins` asset.**

{{< highlight shell >}}
sensuctl create -f go/config/assets/check-plugins.yaml
{{< /highlight >}}

**2. Now we can create a check to monitor the status of the dummy app that uses the `check-plugins` asset and the Slack pipeline.**

{{< highlight shell >}}
sensuctl create -f go/config/checks/dummy-app-healthz.yaml
{{< /highlight >}}

**3. With the automated alert workflow in place, we can see the resulting events in the Sensu dashboard.**

At http://webui.sensu.local/signin, sign in with your sensuctl username (`demo`) and password.

**4. Toggle the health of the dummy app to simulate a failure.**

{{< highlight shell >}}
curl -iXPOST http://dummy.local/healthz
{{< /highlight >}}

We should now be able to see a critical alert in the [Sensu dashboard](http://webui.sensu.local/events) as well as by using sensuctl:

{{< highlight shell >}}
sensuctl event list
{{< /highlight >}}

You should also see an alert in Slack.

Continue to post to `/healthz` until all Sensu entities return to a healthy state.

{{< highlight shell >}}
curl -iXPOST http://dummy.local/healthz
{{< /highlight >}}

## Collecting app metrics

### Create a Sensu service check to collect Prometheus metrics

To automatically collect the Prometheus metrics from the dummy app, we'll create an asset that lets the Sensu agents use the [Sensu Prometheus plugin](https://github.com/sensu/sensu-prometheus-collector).

**1. Create the `prometheus-collector` asset.**

{{< highlight shell >}}
sensuctl create -f go/config/assets/prometheus-collector.yaml
{{< /highlight >}}

**2. Now we can create a check to collect Prometheus metrics that uses the `prometheus-collector` asset.**

{{< highlight shell >}}
sensuctl create -f go/config/checks/dummy-app-prometheus.yaml
{{< /highlight >}}

### Use Grafana to visualize metrics

**1. Deploy Grafana with a Sensu agent sidecar.**

Create Kubernetes ConfigMaps for Grafana configuration.

{{< highlight shell >}}
kubectl create configmap grafana-provisioning-datasources --from-file=./go/configmaps/grafana-provisioning-datasources.yaml

kubectl create configmap grafana-provisioning-dashboards --from-file=./go/configmaps/grafana-provisioning-dashboards.yaml
{{< /highlight >}}

Deploy Grafana with a Sensu Agent sidecar.

{{< highlight shell >}}
kubectl apply -f go/deploy/grafana.sensu.yaml

kubectl get pods

sensuctl entity list
{{< /highlight >}}

Now we can see the Sensu agents we have installed on the dummy app, InfluxDB, and Grafana pods.

{{< highlight shell >}}
ID               Class    OS                   Subscriptions                           Last Seen            
─────────────────────────── ─────── ─────── ─────────────────────────────────────────── ─────────────────────────────── 
dummy-6c57b8f868-ft5dz      agent   linux   dummy,entity:dummy-6c57b8f868-ft5dz         2018-11-20 18:43:15 -0800 PST  
dummy-6c57b8f868-m24hw      agent   linux   dummy,entity:dummy-6c57b8f868-m24hw         2018-11-20 18:43:15 -0800 PST  
grafana-5b88f8df8d-vgjtm    agent   linux   grafana,entity:grafana-5b88f8df8d-vgjtm     2018-11-20 18:43:14 -0800 PST  
influxdb-78d64bcfd9-8km56   agent   linux   influxdb,entity:influxdb-78d64bcfd9-8km56   2018-11-20 18:43:12 -0800 PST  
{{< /highlight >}}

**2. Log in to Grafana.**

To see the metrics we're collecting from the dummy app, log into [Grafana](http://grafana.local/login) with the username `admin` and password `password`.

**3. Create a dashboard.**

Create a new dashboard using the InfluxDB datasource to live metrics from the dummy app.

## Collecting Kubernetes metrics
Now that we have a pipeline set up to send metrics, we can easily create a check that collects Prometheus metrics from Kubernetes and connect it to the pipeline.

Create a check to collect Prometheus metrics from Kubernetes that uses the `prometheus-collector` asset and the `influxdb` handler.

{{< highlight shell >}}
sensuctl create -f go/config/checks/kube-state-prometheus.yaml
{{< /highlight >}}

You should now be able to access Kubernetes metric data in [Grafana](http://grafana.local) and see metric events in the [Sensu dashboard](http://webui.sensu.local/events).

## Next steps

For more information about monitoring with Sensu, check out the following resources:

- [Reducing alert fatigue with Sensu filters](https://docs.sensu.io/sensu-go/latest/guides/reduce-alert-fatigue/)
- [Aggregating StatD metrics with Sensu](https://docs.sensu.io/sensu-go/latest/guides/aggregate-metrics-statsd/)
- [Aggregating Nagios metrics with Sensu](https://docs.sensu.io/sensu-go/latest/guides/extract-metrics-with-checks/)


















