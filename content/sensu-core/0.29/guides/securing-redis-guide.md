---
title: "Securing Redis"
description: "Strategies and best practices for security Redis"
version: "0.29"
weight: 9
next: ../securing-rabbitmq-guide
previous: ../securing-sensu-guide
menu:
  sensu-core-0.29:
    parent: guides
---

Redis is a key-value database, which describes itself as “an open source, BSD licensed, advanced key-value cache and store”. Sensu uses Redis for storing persistent data. Two Sensu services, the server and API, require access to the same instance of Redis to function.

This guide will discuss best practices to use with Redis for use with Sensu.

# Objectives

This guide will discuss the following:

* [Redis General Security Model](#redis-general-security-model)
* [Securing Redis with a Local Install](#securing-redis-with-a-local-install)
* [Securing Redis via Localhost Security](#securing-redis-localhost-security)
* Securing Redis via Network Base Security
* TLS Connection (1.3.0 and above)

## Redis General Security Model{redis-general-security-model}

Redis was designed to be accessed by trusted clients inside a closed network environment. As such it is recommended that Redis instances not be directly exposed to the internet or have access in general to untrusted clients that can directly connect to the Redis TCP port or UNIX socket.

Best practices from [Redis Security Documentation][1] suggest blocking port level access to all hosts except trusted hosts, in our case your Sensu-Server, Sensu-API and/or Sensu-Enterprise-Server.

_NOTE: As of [Sensu 1.3.0][2], TLS is now supported, allowing you to encrypt your traffic between Sensu and Redis when being used as a Transport or Datastore


## Securing Redis with a Local Installation of Sensu{securing-redis-with-a-local-install}

For instances where you will be running Redis on the same host that you will be running Sensu, you can configure Redis to listen to the localhost only on the host loopback IP address.

To accomplish this you would need to edit `/etc/redis/redis.conf` with following line:

{{< highlight shell >}}
bind 127.0.0.1
{{< /highlight >}}

After making the above change, you will need to restart the Redis service.

## Securing Redis via Localhost Security{securing-redis-localhost-security} 

### Redis Configuration

Redis documentation recommends limiting access to the TCP port Redis uses. By default Redis uses the following ports:

* 6379 For standalone Redis instances
* 16379 For clustered Redis instances
* 26379 For Sential instances

We recommend first binding to the host IP address intead of binding to all IP's on the host. This can be accomplished by configuring `bind` to the IP address in `/etc/redis/redis.conf`:

{{< highlight shell >}}
bind 192.168.50.41
{{< /highlight >}}

After making the change you will need to restart the Redis service so the changes take affect.

### Host Configuration

Once Redis is bind to the IP address you can then configure local firewall rules to deny all access EXCEPT host we trust. Bellow you'll find examples on how to do this for Ubuntu 16.04 and Centos 7. Other distros will require similar configuration depending on the firewall being used.

#### Ubuntu Firewall

For [Ubuntu 16.04][3] and later you will need to have `ufw` installed. You can install `ufw` with `apt`

{{< highlight shell >}}
sudo apt install -y ufw
{{< /highlight >}}

Assuming your security requirements require full access to the system and you intend to only deny access to Redis. We will first need to allow all access incoming and outgoing through `ufw`:

{{< highlight shell >}}
sudo ufw default allow incoming
sudo ufw default allow outgoing
{{< /highlight >}}

We will then deny all access to port `6379` from all hosts. Port `16379` and `26379` will also need to be deny if you are clustering redis or using sentials.

{{< highlight shell >}}
sudo ufw deny 6379
{{< /highlight >}}

Next we will allow a specific host access to port `6379`. In our example, the host we're allowing is `192.168.100.30` and the IP address Redis is bind to is `192.168.50.41`.

{{< highlight shell >}}
sudo ufw allow from 192.168.100.30 to 192.168.50.41 port 6379
{{< /highlight >}}

After applying the above changes we can verify that they work by checking `ufw status numbered`:

{{< highlight shell >}}
$ sudo ufw status numbered
Status: active

     To                         Action      From
     --                         ------      ----
[ 1] 6379                       DENY IN     Anywhere
[ 2] 192.168.50.41 6379         ALLOW IN    192.168.100.30
{{< /highlight >}}

-
centos firewall
-
https://redislabs.com/redis-enterprise-documentation/administering/installing-upgrading/configuring/centos-rhel-7-firewall/

CentOS / RHEL7 distributions have, by default, a restrictive firewall mechanism based on firewalld (which in turn configures the standard iptables system). The default configuration assigns the network interfaces to the public zone and blocks all ports, except 22 (SSH).

Redis Enterprise Software (RES) installation on CentOS / RHEL 7 automatically creates two firewalld system services:

A service named redislabs, which includes all ports and protocols needed for communications between cluster nodes.
A service named redislabs-clients, which includes the ports and protocols needed for communications external to the cluster.

These services are defined but not allowed through the firewall by default. As part of the installation process, the installer prompts you to confirm auto-configuration of a default (public) zone to allow the redislabs service.


sudo firewall-cmd --permanent --new-zone=redis

sudo firewall-cmd --permanent --zone=redis --add-port=6379/tcp

sudo firewall-cmd --permanent --zone=redis --add-source=client_server_private_IP

sudo firewall-cmd --reload


---
iptables:

sudo iptables -A INPUT -i lo -j ACCEPT
sudo iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT
sudo iptables -A INPUT -p tcp -s client_servers_private_IP/32 --dport 6397 -m conntrack --ctstate NEW,ESTABLISHED -j ACCEPT
sudo iptables -P INPUT DROP

-
Using Network Router/Firewall 
--
Using a network device such as a firewall or router to manage traffic to your redis instances will allow you to better secure your redis instances. Traffic would need to be limited from specific host (in our case sensu-server's, sensu-api's and/or sensu-enterprises) to your redis instance. 
-




# 1 - issolated network
# 2 - configuring endpoints

[1] https://redis.io/topics/security
[2] TODO: LINK TO SENSU 1.3 DOCUMENTATION FOR SECURING-REDIS-GUIDE
[3] https://help.ubuntu.com/lts/serverguide/firewall.html