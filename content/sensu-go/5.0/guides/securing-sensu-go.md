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

As with any piece of software, it is critical to minimize any attack surface exposed by the software. Sensu is no different. If you have ever operated Sensu Classic, you are already aware of the [component pieces that need to be secured][1]. Sensu Go, while different its deployment architecture, still contains component pieces that will need to be secured in order to be considered "production ready". Let's start with a brief overview of the differences between Sensu Classic, and Sensu Go.

## Architecural Overview
In Sensu Classic, there are a number of components that require securing. To review, these components are:

* Sensu client to RabbitMQ communication
* Sensu server to RabbitMQ communication
* Uchiwa/Sensu Enterprise Dashboard
* Sensu API
* Redis*

_NOTE: With Redis, TLS communication is not possible (see the [Redis documentation][2]). Securing Redis typically requires deploying additional software, which is covered in the aforementioned documentation._

For a visual reference, see the diagram below:

![sensu classic architecture diagram][3]

Sensu Go, similar to Sensu Classic, has its own components that need to be secured. These are:

* Sensu agent to server communication
* Etcd peer communication
* Backend API
* Agent API
* Dashboard

Let's take a look at an architectural diagram for Sensu Go:

![sensu go architecture diagram][4]

Now we'll cover securing each one of those pieces, starting with Sensu agent to server communication.

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

The agent will then connect Sensu servers over wss. Let's move on to securing Etcd peer communication.

## Securing etcd peer communication



## Securing the backend API
The backend API is impleme


## Securing the agent API
The agent API

## Securing the dashboard

The Sensu dashboard makes use of the stanza mentioned


<!-- LINKS -->
[1]: /sensu-core/latest/guides/securing-sensu/
[2]: https://redis.io/topics/security
[3]:
[4]:
