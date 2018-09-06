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

{{< highlight json >}}
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
}{{< /highlight >}}

With this configuration, the datacenter *us-east-1* now has two APIs (*10.0.0.1* and *10.0.0.2*) and Uchiwa will balance the requests between these two APIs and failback to the second API in case of connectivity issue.



## Uchiwa High Availability {#uchiwa-high-availability}
If you are using Uchiwa built-in authentication and wish to run multiple
instances of Uchiwa together, you will need to adjust your configuration.

Uchiwa generates a temporary key during its launch, which is later destroyed once the process is stopped or restarted. This key is used for generating and validating the signatures of the JSON Web Tokens (JWT) for authentication.

This behaviour is problematic when multiple instances of Uchiwa are used behind a load balancer or if the Uchiwa process needs to be frequently restarted. To use your own keys, follow these few steps:

Generate the private key:
{{< highlight shell >}}
openssl genrsa -out uchiwa.rsa 2048{{< /highlight >}}

Extract the public key:
{{< highlight shell >}}
openssl rsa -in uchiwa.rsa -pubout > uchiwa.rsa.pub{{< /highlight >}}

Adjust the *uchiwa* object in your configuration file in order to specify the path of the keys you just generated:
{{< highlight json >}}
{
  "uchiwa": {
    "auth": {
      "privatekey": "/path/to/uchiwa.rsa",
      "publickey": "/path/to/uchiwa.rsa.pub"
    }
  }
}{{< /highlight >}}

Finally, restart Uchiwa and you should see the following entry in your log:
{{< highlight shell >}}
"message":"Provided RSA keys successfully loaded"
{{< /highlight >}}

[1]:  ../../getting-started/configuration/#datacenters-configuration-sensu