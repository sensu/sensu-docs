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

Kubernetes is a supported platform for the Sensu agent only.
The Sensu backend is compatible with Kubernetes, but Kubernetes is not a supported platform for the Sensu backend.

{{% notice protip %}}
**PRO TIP**: Join our [Kubernetes special interest group](https://discourse.sensu.io/c/sensu-go/sig-kubernetes/33) on Discourse &mdash; it's a sub-community of Sensu users who are monitoring Kubernetes or workloads running on Kubernetes.<br><br>
For a Kubernetes introduction or refresher, read our blog posts [How Kubernetes works](https://sensu.io/blog/how-kubernetes-works) and [Kubernetes 101](https://sensu.io/blog/kubernetes-101).
{{% /notice %}}

## Configure the agent in Kubernetes

To configure the Sensu agent in Kubernetes, configure the `NODE_EXPORTER_HOST` environment variable to the host IP address.

For Sensu agents running as a Kubernetes daemonset, configure the `NODE_EXPORTER_HOST` environment variable via the "ClusterFirstWithHostNet" dnsPolicy, and use the Kubernetes Downward API to expose the host IP address as an environment variable:

{{< code yml >}}
env:
- name: NODE_EXPORTER_HOST
  valueFrom:
    fieldRef:
      fieldPath: status.hostIP
{{< /code >}}

## Recommended approach for monitoring Kubernetes

We recommend deploying Sensu agents as Kubernetes sidecars, a dynamic approach with one agent per [Kubernetes pod][2], to monitor applications.
To monitor Kubernetes itself, add a Sensu agent on all Kubernetes hosts.

Kubernetes sidecars are modular, composable, and reusable.
When you use the sidecar pattern, your Kubernetes pod holds the container that runs your application alongside the container that runs the Sensu agent.
These containers share the same network space, so Sensu can collect data from your applications as if they were running in the same container or host.

Read [Monitoring Kubernetes, part 4: the Sensu native approach][3] to learn more about monitoring Kubernetes with the sidecar pattern.
Our whitepaper [Monitoring Kubernetes: the sidecar pattern][4] includes a tutorial for getting started with sidecars.

Run Sensu from outside of Kubernetes.
If you monitor from within Kubernetes and Kubernetes fails, your monitoring will fail too.

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

## Use the Sensu catalog Kubernetes monitors

### Kubelet host metrics collection

Use Sensu's Kubernetes [kubelet host metrics collection][10] monitor to collect host metrics, including for [kubelet][20] hosts, with the [Prometheus Node Exporter][11].

This monitor collects metrics but does not provide alerts and requires Prometheus Node Exporter.
Learn more about using Sensu with Prometheus to monitor Kubernetes in [Monitoring Kubernetes + Docker, part 3: Sensu + Prometheus][5].

### Kubelet monitor

The Sensu [Kubelet monitor][12] includes both health and metrics checks:
- [Kubelet health check][13]
- [Kubelet etcd health check][14]
- [Kubelet metrics][15]
- [Kubelet probe metrics][16]
- [Kubelet cAdvisor metrics][17]

The metrics checks collect metrics but do not provide alerts.

The Sensu kubelet monitor health checks and metrics collectors rely on [kubelet][20] metrics and cAdvisor as data sources.

Kubelet metrics provide data for the Kubernetes nodes and the jobs they run.
Metrics components include [kube-apiserver][19], [kube-controller-manager][22], and [kube-scheduler][21].

The built-in kubelet cAdvisor collects, aggregates, processes, and exports metrics for each running container.
cAdvisor can track resource isolation parameters and historical resource usage so Kubernetes can designate how much memory is being used.

### Kubernetes cluster metrics

The [Kubernetes cluster metrics][18] monitor collects kubelet metrics from the [metrics-server][23] API.

Kubernetes cluster metrics requires [kube-state-metrics][24], which listens to the Kubernetes API server and provides high-level information about a Kubernetes cluster.
kube-state-metrics data include which containers are running, their current state, the number of contains in a particular state, and whether any are unhealthy or at capacity.

Kubernetes cluster metrics collects metrics but does not provide alerts.

### Kubernetes cluster events

https://github.com/sensu/catalog/blob/main/monitors/kubernetes/events/sensu-kubernetes-events.yaml
https://bonsai.sensu.io/assets/sensu/sensu-kubernetes-events

This uses an alpha release of a Sensu-native integration.

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
[10]: https://github.com/sensu/catalog/blob/main/monitors/node_exporter/node_exporter.yaml
[11]: https://prometheus.io/docs/guides/node-exporter/
[12]: https://github.com/sensu/catalog/blob/main/monitors/kubernetes/kubelet.yaml
[13]: https://github.com/sensu/catalog/blob/main/monitors/kubernetes/kubelet.yaml#L37-L53
[14]: https://github.com/sensu/catalog/blob/main/monitors/kubernetes/kubelet.yaml#L55-L72
[15]: https://github.com/sensu/catalog/blob/main/monitors/kubernetes/kubelet.yaml#L74-L97
[16]: https://github.com/sensu/catalog/blob/main/monitors/kubernetes/kubelet.yaml#L99-L122
[17]: https://github.com/sensu/catalog/blob/main/monitors/kubernetes/kubelet.yaml#L124-L147
[18]: https://github.com/sensu/catalog/blob/main/monitors/kubernetes/kube-state-metrics.yaml
[19]: hhttps://kubernetes.io/docs/reference/command-line-tools-reference/kube-apiserver/
[20]: https://kubernetes.io/docs/reference/command-line-tools-reference/kubelet/
[21]: https://kubernetes.io/docs/reference/command-line-tools-reference/kube-scheduler/
[22]: https://kubernetes.io/docs/reference/command-line-tools-reference/kube-controller-manager/
[23]: https://github.com/kubernetes-sigs/metrics-server
[24]: https://github.com/kubernetes/kube-state-metrics
