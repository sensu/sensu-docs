---
title: "Hardware requirements"
linkTitle: "Hardware Requirements"
description: "Plan your Sensu deployment with information about hardware and networking requirements for running Sensu backends and agents on your infrastructure."
weight: 10
version: "6.12"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-6.12:
    parent: deploy-sensu
---

## Sensu backend requirements

### Backend minimum requirements

This configuration is the minimum required to run the Sensu [backend][9] (although it is insufficient for production use):

- 64-bit Intel or AMD CPU
- 4 GB RAM
- 4 GB free disk space
- 10 mbps network link

Review the [backend recommended configuration][2] for production recommendations.

### Backend recommended configuration

This backend configuration is recommended as a baseline for production use to ensure a good user and operator experience:

- 64-bit four-core Intel or AMD CPU
- 8 GB RAM
- SSD [non-volatile memory express (NVMe) or serial advanced technology attachment 3 (SATA3)]
- Gigabit ethernet

Using additional resources (and even over-provisioning) further improves stability and scalability.

The Sensu backend is typically CPU- and storage-intensive.
In general, the backend's use of these resources scales linearly with the total number of checks executed by all Sensu agents connecting to the backend.

The Sensu backend is a massively parallel application that can scale to any number of CPU cores.
Provision approximately one CPU core for every 50 checks per second (including agent keepalives).
For most installations, four CPU cores are sufficient.
Larger installations may find that more CPU cores (8+) are necessary.

Every executed Sensu check results in storage writes.
When provisioning storage, a good guideline is to have twice as many **sustained disk input/output operations per second (IOPS)** as you expect to have events per second.

Don't forget to include agent keepalives in your calculation.
Each agent publishes a keepalive every 20 seconds.
For example, in a cluster of 100 agents, you can expect the agents to consume 10 write IOPS for keepalives.

The Sensu backend uses a relatively modest amount of RAM in most circumstances.
Larger production deployments use more RAM (8+ GB).

## Sensu agent requirements

### Agent minimum requirements

This configuration is the minimum required to run the Sensu [agent][10] (although it is insufficient for production use):

- 386, amd64, ARMv5, or MIPS CPU
- 128 MB RAM
- 10 mbps network link

Review the [agent recommended configuration][3] for production recommendations.

### Agent recommended configuration

This agent configuration is recommended as a baseline for production use to ensure a good user and operator experience:

- 64-bit four-core Intel or AMD CPU
- 512 MB RAM
- Gigabit ethernet

The Sensu agent itself is lightweight and should be able to run on all but the most modest hardware.
However, because the agent is responsible for executing checks, you should factor the agent's responsibilities into your hardware provisioning.

## Networking recommendations

Sensu uses WebSockets for communication between the agent and backend.
All communication occurs over a single TCP socket.

We recommend that you connect backends and agents via gigabit ethernet, but any reliable network link should work (for example, WiFi and 4G).
If the backend logs include WebSocket timeouts, you may need to use a more reliable network link between the backend and agents.

## Cloud recommendations

For all cloud providers, we recommend using local NVMe SSDs for storage and deploying all Sensu backends and etcd instances in the same region.

Sensu is compatible with all cloud provider database instances.
We recommend using PostgreSQL with high availability for the event store.

{{% notice note %}}
**NOTE**: Sensu does not require a particular CPU manufacturer for cloud storage.
{{% /notice %}}

### Amazon EC2

For Sensu backends or etcd nodes, the recommended Amazon EC2 instance type and size is **M5d.xlarge**.
The [M5d.xlarge instance][1] provides four vCPU, 16 GB of RAM, up to 10 gbps network connectivity, and a 150-GB NVMe SSD directly attached to the instance host, which is optimal for sustained disk IOPS.

### Microsoft Azure

Use the **D4ds v4** Microsoft Azure virtual machine for Sensu backends or etcd nodes.
The [D4ds v4 virtual machine][6] provides four vCPU, 16 GB of RAM, and a 150-GB SSD directly attached to the instance host (optimal for sustained disk IOPS).

### Digital Ocean

Use Digital Ocean [Storage-Optimized Droplets][5] for Sensu backends or etcd.
The minimum [Storage-Optimized Droplet plan][4] provides two vCPU, 16 GB of RAM, and a 300-GB NVMe SSD.
Storage is directly attached to the hypervisor rather than connected via network.

### Google Cloud

For Sensu backends or etcd nodes, the recommended Google Cloud Compute Engine type and size is **n2-standard-4**, with SSD provisioned space.
The [n2-standard-4][7] compute engine provides four vCPU, 16 GB of RAM, and up to 10 gbps network connectivity.

Google Cloud offers disk space separately, and we recommend at least 150 GB of [SSD provisioned space][8] for Sensu backends running embedded etcd.

You can use Google Cloud's regional managed instance groups (MIGs) to deploy Sensu backends and etcd instances.


[1]: https://aws.amazon.com/ec2/instance-types/m5/
[2]: #backend-recommended-configuration
[3]: #agent-recommended-configuration
[4]: https://www.digitalocean.com/pricing
[5]: https://docs.digitalocean.com/products/droplets/resources/choose-plan/#dedicated-cpu-storage-optimized-droplet
[6]: https://docs.microsoft.com/en-us/azure/virtual-machines/ddv4-ddsv4-series
[7]: https://cloud.google.com/compute/docs/general-purpose-machines#n2_machines
[8]: https://cloud.google.com/compute/disks-image-pricing#disk
[9]: ../../../observability-pipeline/observe-schedule/backend/
[10]: ../../../observability-pipeline/observe-schedule/agent/
