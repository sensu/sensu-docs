---
title: "Monitor Kubernetes with Sensu"
linkTitle: "Monitor Kubernetes"
guide_title: "Monitor Kubernetes with Sensu"
type: "guide"
description: "Monitor your Kubernetes containers with Sensu. Read this guide to learn how."
weight: 53
version: "6.4"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-6.4:
    parent: observe-schedule
---

The dynamic nature of Kubernetes container orchestration requires a dynamic approach to monitoring.
Sensu allows you to monitor the applications you deploy with Kubernetes and the health of the Kubernetes containers themselves, no matter the size of your deployment.

{{% notice note %}}
**NOTE**: If you need a Kubernetes introduction or refresher, read our blog posts [How Kubernetes works](https://sensu.io/blog/how-kubernetes-works) and [Kubernetes 101](https://sensu.io/blog/kubernetes-101) or head to the [Kubernetes docs](https://kubernetes.io/docs/home/).
{{% /notice %}}

{{% notice protip %}}
**PRO TIP**: Join our [Kubernetes special interest group](https://discourse.sensu.io/c/sensu-go/sig-kubernetes/33) on Discourse &mdash; it's a sub-community of Sensu users who are monitoring Kubernetes or workloads running on Kubernetes.
{{% /notice %}}

## Data sources for monitoring Kubernetes

Common Kubernetes data sources include Kubernetes hosts, Kubelet metrics, Kubelet cAdvisor, and `kube-state-metrics`.

### Kubernetes hosts

Kubernetes hosts are especially important to monitor because they have limited resources.
A common method for collecting Kubernetes host data is using the [Prometheus node exporter][1] to scrape the host data and expose system resource telemetry data on an HTTP endpoint.

### Kubelete metrics

Kubelet metrics, also called Kubernetes processes, include apiserver, kube-scheduler, and kube-controller-manager, which provide data on Kubernetes nodes and the jobs they run.

### Kubelet cAdvisor

The built-in Kubelet cAdvisor collects, aggregates, processes, and exports metrics for each running container.
cAdvisor can keep track of resource isolation parameters and historical resource usage so Kubernetes can designate how much memory is being used.

### kube-state-metrics

`kube-state-metrics` listens to the Kubernetes API server and provides high-level information about your Kubernetes cluster.
`kube-state-metrics` data includes which containers are running, their current state, the number of contains in a particular state, and whether any are unhealthy or at capacity.

## Use Sensu with Prometheus to monitor Kubernetes

Prometheus can collect and analyze data on your Kubernetes deployment, but the data model is constrained: data must be represented as a measurement and can lack context as a result, and exporters provide only summarized data and scrape only periodically.
Use Sensu with Prometheus to get a complete picture of your Kubernetes deployment.

Advantages of using Sensu along with Prometheus to monitor Kubernetes include:

- Comprehensive service health monitoring with Sensu checks in addition to the Prometheus telemetry-based metrics.
- Workflow automation that allows you to take action and helps eliminate repetitive work in response to monitoring alerts.
Sensu’s observability event pipeline provides powerful and extensible solutions for automating workflows, including context collection, automated remediation, and automated node or endpoint registration.
- Flexible options for data collection.
Sensu allows you to collect monitoring data in many ways, including Prometheus endpoint scraping, service checks, and first-class APIs.
- Secure data transport.
Sensu's standard cryptography model allows a single agent to collect and securely transmit data over complex networks without compromising firewalls.

Here's how it works:

- The Sensu agent performs service health checks, which generate observability event data, and collects telemetry data from sources that include Prometheus endpoints.
- The Sensu agent provides a secure pub-sub transport to transmit event and telemetry data to the Sensu backend, traversing complex network topologies without compromising firewalls.
- The Sensu backend provides a horizontally scalable observability data processing solution that extends beyond alerts to processing data via event handlers, routing metrics to your preferred datastore, triggering automated remediation actions, and creating and resolving tickets.

Learn more about using Sensu with Prometheus to monitor Kubernetes in [Monitoring Kubernetes + Docker, part 3: Sensu + Prometheus][5].

## Recommended approach for monitoring Kubernetes

We recommend deploying Sensu agents as Kubernetes sidecars, a dynamic approach with one agent per [Kubernetes pod][2], to monitor applications.
To monitor Kubernetes itself, add a Sensu agent on all Kubernetes hosts.

Kubernetes sidecars are modular, composable, and reusable.
Sidecar examples include service mesh, logging platforms with agents that run as sidecars, and observability solutions like Sensu, with an agent that runs as a sidecar and provides a 1:1 pairing of a monitoring agent per collection of services.

When you use the sidecar pattern, your Kubernetes pod holds the container that runs your application alongside the container that runs the Sensu agent.
These containers share the same network space, so Sensu can collect data from your applications as if they were running in the same container or host.

Read [Monitoring Kubernetes, part 4: the Sensu native approach][3] to learn more about monitoring Kubernetes with the sidecar pattern.
Our whitepaper [Monitoring Kubernetes: the sidecar pattern][4] includes a tutorial for getting started with sidecars.

Run Sensu from outside of Kubernetes.
If you monitor from within Kubernetes and Kubernetes fails, your monitoring will fail too.

## Sensu integrations for Kubernetes

### Sensu Kubernetes Events Check

The [Sensu Kubernetes Events Check][6] is a Sensu check that uses the Kubernetes Events API to identify events that should generate corresponding Sensu events.
The check itself returns an OK status (exit code 0), but the check creates separate events for each matching event type it finds using the [agent API][7].

Read [Filling gaps in Kubernetes observability with the Sensu Kubernetes Events integration][8] for more information about the Kubernetes Events API and the Sensu Kubernetes Events Check integration.

### Sensu Plugins Kubernetes

The [Sensu Plugins Kubernetes][9] plugin allows you to check node and pod status as well as API and service availability.


[1]: https://github.com/prometheus/node_exporter
[2]: https://kubernetes.io/docs/concepts/workloads/pods/
[3]: https://sensu.io/blog/monitoring-kubernetes-part-4-the-sensu-native-approach
[4]: https://sensu.io/resources/whitepaper/whitepaper-monitoring-kubernetes-the-sidecar-pattern
[5]: https://sensu.io/blog/monitoring-kubernetes-docker-part-3-sensu-prometheus
[6]: https://bonsai.sensu.io/assets/sensu/sensu-kubernetes-events
[7]: ../agent/#create-observability-events-using-the-agent-api
[8]: https://sensu.io/blog/filling-gaps-in-kubernetes-observability-with-the-sensu-kubernetes-events-integration
[9]: https://bonsai.sensu.io/assets/sensu-plugins/sensu-plugins-kubernetes
