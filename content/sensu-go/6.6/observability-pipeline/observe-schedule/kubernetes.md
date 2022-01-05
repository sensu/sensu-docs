---
title: "Monitor Kubernetes with Sensu"
linkTitle: "Monitor Kubernetes"
guide_title: "Monitor Kubernetes with Sensu"
type: "guide"
description: "Monitor your Kubernetes containers with Sensu. Read this guide to learn how."
weight: 53
version: "6.6"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-6.6:
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

Run Sensu from outside of Kubernetes.
If you monitor from within Kubernetes and Kubernetes fails, your monitoring will fail too.

Kubernetes sidecars are modular, composable, and reusable.
When you use the sidecar pattern, your Kubernetes pod holds the container that runs your application alongside the container that runs the Sensu agent.
These containers share the same network space, so Sensu can collect data from your applications as if they were running in the same container or host.

Read [Monitoring Kubernetes, part 4: the Sensu native approach][3] to learn more about monitoring Kubernetes with the sidecar pattern.
Our whitepaper [Monitoring Kubernetes: the sidecar pattern][4] includes a tutorial for getting started with sidecars.

## Use the Sensu catalog of Kubernetes health and metrics checks

### Kubelet host metrics collection

Prometheus can collect and analyze data on your Kubernetes deployment, but the data model is constrained: data must be represented as a measurement and can lack context as a result, and exporters provide only summarized data and scrape only periodically.
Use Sensu with Prometheus to get a complete picture of your Kubernetes deployment.

Sensu's [kubelet host metrics collection][10] monitor allows you to collect host metrics, including for [kubelet][20] hosts, with the [Prometheus Node Exporter][11].
The Sensu kubelet host metrics collection collects metrics but does not provide alerts and requires Prometheus Node Exporter.

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

### Sensu Kubernetes Events Check

{{% notice note %}}
**NOTE**: The Sensu Kubernetes Events Check is an alpha release of a Sensu-native integration and may include breaking changes.
{{% /notice %}}

The [Sensu Kubernetes Events Check][25] is an  Sensu Check that uses the [Kubernetes Event API][26] to identify events that should generate corresponding Sensu events.
The check itself returns an OK status (exit code `0`) unless it encounters a problem like failing to authenticate with Kubernetes for API access.
For each matching event type the check finds, it creates separate events with the Sensu [agent API][7].

Use our curated, configurable [quick-start template][27] to get started with the Sensu Kubernetes Events Check plugin and integrate Sensu with your existing workflows.

Read [Filling gaps in Kubernetes observability with the Sensu Kubernetes Events integration][8] for more information about the Kubernetes Events API and the Sensu Kubernetes Events Check integration.


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
[25]: https://bonsai.sensu.io/assets/sensu/sensu-kubernetes-events
[26]: https://v1-18.docs.kubernetes.io/docs/reference/generated/kubernetes-api/v1.18/#event-v1-core
[27]: https://github.com/sensu/catalog/blob/main/monitors/kubernetes/events/sensu-kubernetes-events.yaml
