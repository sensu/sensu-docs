---
title: "Securing Sensu"
description: "As with all software, it’s important to minimize any attack surface exposed by the software. Sensu is no different. In this guide, you’ll learn about the components that need to be secured (and how to do so)."
weight: 1000
version: "5.0"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-5.0:
    parent: guides
---

As with any piece of software, it is critical to minimize any attack surface exposed by the software. Sensu is no different. The following component pieces need to be secured in order for Sensu to be considered production ready:

* [etcd peer communication](#securing-etcd-peer-communication)
* [Backend API](#securing-the-api-and-the-dashboard)
* [Dashboard](#securing-the-api-and-the-dashboard)
* [Sensu agent to server communication](#securing-sensu-agent-to-server-communication)

We'll cover securing each one of those pieces, starting with etcd peer communication.

## Securing etcd peer communication

Let's start by covering how to secure etcd peer communication via the configuration at `/etc/sensu/backend.yml`. Let's look at the parameters you'll need to configure:

{{< highlight yml >}}
##
# backend store configuration
##
etcd-listen-client-urls: "https://localhost:2379"
etcd-listen-peer-urls: "https://localhost:2380"
etcd-initial-advertise-peer-urls: "https://localhost:2380"
etcd-cert-file: "/path/to/your/cert"
etcd-key-file: "/path/to/your/key"
etcd-trusted-ca-file: "/path/to/your/ca/file"
etcd-peer-cert-file: "/path/to/your/peer/cert"
etcd-peer-key-file: "/path/to/your/peer/key"
etcd-peer-client-cert-auth: "true"
etcd-peer-trusted-ca-file: "/path/to/your/peer/ca/file"
{{< /highlight >}}

## Securing the API and the dashboard

Let's go over how to secure the API and dashboard. Please note that by changing the parameters below, the server will now communicate over TLS and expect agents connecting to it to use the WebSocket secure protocol. In order for communication to continue, both this section and the [following section](#securing-sensu-agent-to-server-communication) must be completed. 

Both the Sensu Go API and the dashboard use a common stanza in `/etc/sensu/backend.yml` to provide the certificate, key, and CA file needed to provide secure communication. Let's look at the attributes you'll need to configure:

{{< highlight yml >}}
##
# backend ssl configuration
##
cert-file: "/path/to/ssl/cert.pem"
key-file: "/path/to/ssl/key.pem"
trusted-ca-file: "/path/to/trusted-certificate-authorities.pem"
insecure-skip-tls-verify: false
{{< /highlight >}}

Providing the above cert-file and key-file parameters will cause the API to serve HTTP requests over
SSL/TLS (https). As a result, you will also need to specify `https://` schema
for the `api-url` parameter:

{{< highlight yml >}}
##
# backend api configuration
##
api-url: "https://localhost:8080"
{{< /highlight >}}

In the example above, we provide the path to the cert, key and CA file. After restarting the `sensu-backend` service, the parameters are loaded and you are able to access the dashboard at https://localhost:3000. Configuring these attributes will also ensure that agents are able to communicate securely. Let's move on to securing agent to server communication.

## Securing Sensu agent to server communication

We'll now discuss securing agent to server communication. Please note: by changing the agent configuration to communicate via WebSocket Secure protocol, the agent will no longer communicate over a plaintext connection. If the server is not secured as described in the [section above](#securing-the-api-and-the-dashboard), communication between the agent and server will not function.

By default, an agent uses the insecure `ws://` transport. Let's look at the example from `/etc/sensu/agent.yml`:

{{< highlight yml >}}
---
##
# agent configuration
##
backend-url:
  - "ws://127.0.0.1:8081"
{{< /highlight >}}

In order to use WebSockets over SSL/TLS (wss), change the `backend-url` value to the `wss://` schema:

{{< highlight yml >}}
---
##
# agent configuration
##
backend-url:
  - "wss://127.0.0.1:8081"
{{< /highlight >}}

The agent will then connect Sensu servers over wss. Do note that by changing the configuration to wss, plaintext communication will not be possible.

It is also possible to provide a trusted CA as part of the agent configuration by passing `--trusted-ca-file` if starting the agent via `sensu-agent start`.

You may include it as part of the agent configuration in `/etc/sensu/agent.yml` as: 

{{< highlight yaml>}}
trusted-ca-file: "/path/to/trusted-certificate-authorities.pem"
{{< /highlight >}}

_NOTE: If creating a Sensu cluster, every cluster member needs to be present in the configuration. See the [Sensu Go clustering guide][2] for more information on how to configure agents for a clustered configuration._


Hopefully you've found this useful! If you find any issues or have any questions, feel free to reach out in our [Community Slack][3], or [open an issue][4] on Github.

<!-- LINKS -->
[1]: /sensu-core/latest/guides/securing-sensu/
[2]: ../clustering
[3]: https://slack.sensu.io
[4]: https://github.com/sensu/sensu-docs/issues/new
