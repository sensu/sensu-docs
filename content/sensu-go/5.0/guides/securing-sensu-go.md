---
title: "How to Secure Sensu Go"
linkTitle: "Securing Sensu Go"
weight: 12
version: "5.0"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-5.0:
    parent: guides
---

As with any piece of software, it is critical to minimize any attack surface exposed by the software. Sensu is no different. If you have ever operated Sensu, you are already aware of the [component pieces that need to be secured][1]. Sensu Go, while different its deployment architecture, still contains component pieces that will need to be secured in order to be considered "production ready". 

* Sensu agent to server communication
* etcd peer communication
* Backend API
* Agent API
* Dashboard

We'll cover securing each one of those pieces, starting with Sensu agent to server communication.

## Securing Sensu agent to server communication

The Sensu agent uses WebSockets for communication between the agent and the server. By default, an agent will use the insecure `ws://` transport:

{{< highlight shell >}}
---
##
# agent configuration
##
...
backend-url:
  - "ws://127.0.0.1:8081"
{{< /highlight >}}

In order to use WebSockets over SSL/TLS (wss), change the `backend-url` value to the `wss://` schema:

{{< highlight shell >}}
---
##
# agent configuration
##
...
backend-url:
  - "wss://127.0.0.1:8081"
{{< /highlight >}}

The agent will then connect Sensu servers over wss. Let's move on to securing etcd peer communication.

_NOTE: If creating a Sensu Go cluster, every cluster member will need to be present in the configuration. See the [Sensu Go clustering guide][5] for more information on how to configure agents for a clustered configuration._

## Securing etcd peer communication

While enabling secure agent-to-server communication involves the change of one line, securing etcd peer communication is more involved and modifying several attributes inside of the configuration at `/etc/sensu/backend.yml`. Let's start by configuring the SSL parameters:

{{< highlight shell >}}
##
# ssl configuration
##
cert-file: "/path/to/ssl/cert.pem"
key-file: "/path/to/ssl/key.pem"
trusted-ca-file: "/path/to/trusted-certificate-authorities.pem"
insecure-skip-tls-verify: false
{{< /highlight >}}

Here, we provide the respective paths to our certificate, our key, and our CA file.

We then need to ensure that our backend is configured to use TLS/SSL:

{{< highlight shell >}}
##
# store configuration
##
#etcd-listen-client-urls: ""
#etcd-listen-peer-urls: ""
#etcd-initial-cluster: ""
#etcd-initial-advertise-peer-urls: ""
#etcd-initial-cluster-state: ""
#etcd-initial-cluster-token: ""
#etcd-name: ""
{{< /highlight >}}

## Securing the backend API

## Securing the agent API

## Securing the dashboard



<!-- LINKS -->
[1]: /sensu-core/latest/guides/securing-sensu/
[2]: https://redis.io/topics/security
[3]: /images/architecture-classic.png
[4]: /images/architecture-ce.png
[5]: ../clustering.md
