---
title: "Hardware requirements"
linkTitle: "Hardware Requirements"
description: "Planning a Sensu deployment? Read this guide to learn about the hardware and networking requirements for running Sensu Backends and Agents on your organization's infrastructure."
weight: 5
version: "5.5"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-5.5:
    parent: installation
---

### Backend minimum requirements

These minimum requirements are required to simply run the software, they
are not sufficient for production use.

* 64-bit Intel or AMD CPU
* 4 GB RAM
* 4 GB free disk space
* 10 mbps network link

### Backend recommended configuration

This configuration is recommended for a good user and operator
experience, a baseline for real production use. Results will vary

* 64 bit 4-core Intel or AMD CPU
* 8 GB RAM
* SSD (NVMe or SATA3)
* Gigabit ethernet

The Sensu Backend is typically CPU and storage intensive. Its use of
these resources generally scales linearly with the total number of
checks that all Sensu Agents connecting to the Backend are executing.

Sensu Backend is a massively parallel application that can scale to
any number of CPU cores. Provision roughly 1 CPU core for every 50
checks per second (including Agent keepalives).

Most installations are fine with 4 CPU cores, but larger installations
may find that additional CPU cores (8+) are necessary.

Every executed Sensu Check results in storage plane writes. When
provisioning storage, a good rule of thumb is to have twice as many
**sustained disk IOPS** as you expect to have Events per second. Don't
forget to include Agent keepalives in this calculation; each Agent
publishes a keepalive every 20 seconds. So in a cluster of 100 Agents,
you can expect those Agents to consume 10 write IOPS for keepalives.

The Sensu Backend uses a relatively modest amount of RAM under most
circumstances. Larger production deployments will use a larger amount
of RAM (8+ GB).

### Agent minimum requirements

These minimum requirements are required to simply run the software, they
are not sufficient for production use.

* 386, amd64, or ARM CPU (armv5 minimum)
* 128 MB RAM
* 10 mbps network link

### Agent recommended configuration

This configuration is recommended for a good user and operator
experience, a baseline for real production use.

* 64 bit 4-core Intel or AMD CPU
* 512 MB RAM
* Gigabit ethernet

The Sensu Agent itself is quite lightweight, and should be able to run
on all but the most modest hardware. However, since the Agent is
responsible for executing checks, factor the Agent's responsibilities
into your hardware provisioning.

### Networking recommendations

#### Agent connections

Sensu uses websockets for communication between the Agent and Backend.
All communication occurs over a single TCP socket.

It's recommended that users connect Backends and Agents via gigabit
ethernet, but any somewhat-reliable network link should work (e.g.
WiFi and 4G). If you see websocket timeouts in the Backend logs, you
may need to use a better network link between the Backend and Agents.

### Cloud recommendations

#### AWS

The recommended EC2 instance type and size for Sensu Backends running
embedded etcd is **M5d.xlarge**. The
[M5d instance](https://aws.amazon.com/ec2/instance-types/m5/) provides
4 vCPU, 16 GB of RAM, up to 10 Gbps network connectivity, and a 150
NVMe SSD directly attached to the instance host (optimal for sustained
disk IOPS).
