---
title: High Availability
weight: 21
product: "Uchiwa"
version: "1.0"
menu:
  uchiwa-1.0:
    parent: guides
---

## Datacenters High Availability
You can define multiple Sensu APIs by datacenter in order to provide **failover**
and rudimentary **load balancing** between these APIs.

To get started with this feature, you'll simply need to define at least two
[Sensu objects][1]
 with the **same name**. Here's a basic example:

{{< code json >}}
{
  "sensu": [
    {
      "name": "us-east-1",
      "host": "10.0.0.1",
      "port": 4567
    },
    {
      "name": "us-east-1",
      "host": "10.0.0.2",
      "port": 4567
    }
  ]  
}{{< /code >}}

With this configuration, the datacenter *us-east-1* now has two APIs (*10.0.0.1* and *10.0.0.2*) and Uchiwa will balance the requests between these two APIs and failback to the second API in case of connectivity issue.



## Uchiwa High Availability {#uchiwa-high-availability}
If you are using Uchiwa built-in authentication and wish to run multiple
instances of Uchiwa together, you will need to adjust your configuration.

Uchiwa generates a temporary key during its launch, which is later destroyed once the process is stopped or restarted. This key is used for generating and validating the signatures of the JSON Web Tokens (JWT) for authentication.

This behaviour is problematic when multiple instances of Uchiwa are used behind a load balancer or if the Uchiwa process needs to be frequently restarted. To use your own keys, follow these few steps:

Generate the private key:
{{< code shell >}}
openssl genrsa -out uchiwa.rsa 2048{{< /code >}}

Extract the public key:
{{< code shell >}}
openssl rsa -in uchiwa.rsa -pubout > uchiwa.rsa.pub{{< /code >}}

Adjust the *uchiwa* object in your configuration file in order to specify the path of the keys you just generated:
{{< code json >}}
{
  "uchiwa": {
    "auth": {
      "privatekey": "/path/to/uchiwa.rsa",
      "publickey": "/path/to/uchiwa.rsa.pub"
    }
  }
}{{< /code >}}

Finally, restart Uchiwa and you should see the following entry in your log:
{{< code shell >}}
"message":"Provided RSA keys successfully loaded"
{{< /code >}}

[1]:  ../../getting-started/configuration/#datacenters-configuration-sensu
