---
title: "Hardware requirements"
linkTitle: "Hardware Requirements"
description: "Planning a Sensu deployment? Read this guide to learn about the hardware and networking requirements for running Sensu backends and agents on your organization's infrastructure."
weight: 5
version: "5.4"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-5.4:
    parent: installation
---

- [Sensu backend requirements](#sensu-backend)
- [Sensu agent requirements](#sensu-agent)
- [Networking recommendations](#networking-recommendations)
- [Cloud recommendations](#cloud-recommendations)

## Sensu backend

### Backend minimum requirements

The following configuration is the minimum required to run the Sensu backend, however it is insufficient for production use.
See the [recommended configuration](#backend-recommended-configuration) for production recommendations.

* 64-bit Intel or AMD CPU
* 4 GB RAM
* 4 GB free disk space
* 10 mbps network link

### Backend recommended configuration

The following configuration is recommended as a baseline for production use to ensure a good user and operator
experience. Using additional
resources (even over-provisioning) further improves stability and
scalability.

* 64 bit 4-core Intel or AMD CPU
* 8 GB RAM
* SSD (NVMe or SATA3)
* Gigabit ethernet

The Sensu backend is typically CPU and storage intensive. In general, its use of
these resources scales linearly with the total number of
checks executed by all Sensu agents connecting to the backend.

The Sensu backend is a massively parallel application that can scale to
any number of CPU cores. Provision roughly 1 CPU core for every 50
checks per second (including agent keepalives).
Most installations are fine with 4 CPU cores, but larger installations
may find that additional CPU cores (8+) are necessary.

Every executed Sensu check results in storage writes. When
provisioning storage, a good guideline is to have twice as many
**sustained disk IOPS** as you expect to have events per second. Don't
forget to include agent keepalives in this calculation; each agent
publishes a keepalive every 20 seconds. For example, in a cluster of 100 agents,
you can expect those agents to consume 10 write IOPS for keepalives.

The Sensu backend uses a relatively modest amount of RAM under most
circumstances. Larger production deployments use a larger amount
of RAM (8+ GB).

## Sensu agent

### Agent minimum requirements

The following configuration is the minimum required to run the Sensu agent, however it is insufficient for production use.
See the [recommended configuration](#agent-recommended-configuration) for production recommendations.

* 386, amd64, or ARM CPU (armv5 minimum)
* 128 MB RAM
* 10 mbps network link

### Agent recommended configuration

The following configuration is recommended as a baseline for production use to ensure a good user and operator experience.

* 64 bit 4-core Intel or AMD CPU
* 512 MB RAM
* Gigabit ethernet

The Sensu agent itself is quite lightweight, and should be able to run
on all but the most modest hardware. However, since the agent is
responsible for executing checks, factor the agent's responsibilities
into your hardware provisioning.

## Networking recommendations

### Agent connections

Sensu uses WebSockets for communication between the agent and backend.
All communication occurs over a single TCP socket.

It's recommended that users connect backends and agents via gigabit
ethernet, but any somewhat-reliable network link should work (e.g.
WiFi and 4G). If you see WebSocket timeouts in the backend logs, you
may need to use a better network link between the backend and agents.

## Cloud recommendations

### AWS

The recommended EC2 instance type and size for Sensu backends running
embedded etcd is **M5d.xlarge**. The
[M5d instance](https://aws.amazon.com/ec2/instance-types/m5/) provides
4 vCPU, 16 GB of RAM, up to 10 Gbps network connectivity, and a 150
NVMe SSD directly attached to the instance host (optimal for sustained
disk IOPS).
