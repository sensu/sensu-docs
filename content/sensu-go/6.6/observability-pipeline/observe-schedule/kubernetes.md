---
title: "Monitor Kubernetes with Sensu"
linkTitle: "Monitor Kubernetes"
guide_title: "Monitor Kubernetes with Sensu"
type: "guide"
description: "Use Sensu to monitor the applications you deploy with Kubernetes and the health of the Kubernetes containers themselves, no matter the size of your deployment. Read this guide to learn more."
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

Run Sensu from outside of Kubernetes.
If you monitor from within Kubernetes and Kubernetes fails, your monitoring will fail.

{{% notice protip %}}
**PRO TIP**: Join our [Kubernetes special interest group](https://discourse.sensu.io/c/sensu-go/sig-kubernetes/33) on Discourse &mdash; it's a sub-community of Sensu users who are monitoring Kubernetes or workloads running on Kubernetes.
{{% /notice %}}

To monitor Kubernetes with Sensu, you can run the [sensu-agent as a Kubernetes DaemonSet][5] or [deploy sensu-agent sidecars][6].

## Run sensu-agent as a Kubernetes DaemonSet

Run sensu-agent as a Kubernetes DaemonSet to automatically monitor Kubernetes nodes as they are added to clusters.

**TO DO**: Expand the information in this section.

Learn more about [Kubernetes DaemonSets][9] in the Kubernetes documentation.

## Deploy sensu-agent sidecars to monitor applications

Deploy Sensu agents as Kubernetes sidecars to monitor applications in a dynamic approach, with one agent per [Kubernetes pod][2].

Kubernetes sidecars are modular, composable, and reusable.
When you use the sidecar pattern, your Kubernetes pod holds the container that runs your application alongside the container that runs the Sensu agent.
These containers share the same network space, so Sensu can collect data from your applications as if they were running in the same container or host.

Read [Monitoring Kubernetes, part 4: the Sensu native approach][3] to learn more about monitoring Kubernetes with the sidecar pattern.
Our whitepaper [Monitoring Kubernetes: the sidecar pattern][4] includes a tutorial for getting started with sidecars.

## Elevate privileges

**TO DO**: Describe reasons for elevating privileges and our suggestions for how to elevate privileges.

In the DaemonSet definition, use the `hostPID`, `hostIPC`, `hostNetwork`, and `dnsPolicy` attributes to elevate privileges.
For example:

{{< code yml >}}
hostPID: true
hostIPC: true
hostNetwork: true
dnsPolicy: ClusterFirstWithHostNet
{{< /code >}}

Read the Kubernetes documentation for more information about [configuring security contexts for Kubernetes pods and containers][8].

## Use environment variables with Kubernetes

We suggest using the `KUBELET_HOST` environment variable to represent the host IP address.

If your Sensu agents are running as [Kubernetes DaemonSets][1], configure the `KUBELET_HOST` environment variable via the "ClusterFirstWithHostNet" dnsPolicy:

{{< code yml >}}
env:
- name: KUBELET_HOST
  valueFrom:
    fieldRef:
      fieldPath: status.hostIP
{{< /code >}}

Use the Kubernetes [Downward API][7] to expose the host IP address as the `KUBELET_HOST` environment variable and synchronize Kubernetes namespaces with Sensu namesapces.


[1]: https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/
[2]: https://kubernetes.io/docs/concepts/workloads/pods/
[3]: https://sensu.io/blog/monitoring-kubernetes-part-4-the-sensu-native-approach
[4]: https://sensu.io/resources/whitepaper/whitepaper-monitoring-kubernetes-the-sidecar-pattern
[5]: #run-sensu-agent-as-a-kubernetes-daemonset
[6]: #deploy-sensu-agent-sidecars-to-monitor-applications
[7]: https://kubernetes.io/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/
[8]: https://kubernetes.io/docs/tasks/configure-pod-container/security-context/
[9]: https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/
