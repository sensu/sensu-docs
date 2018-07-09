---
title: "Using the EC2 Integration with Sensu Enterprise"
linkTitle: "EC2 Integration"
product: "Sensu Enterprise"
version: "2.6"
weight: 1
menu:
 sensu-enterprise-2.6:
   parent: guides
---

# Objectives

In this guide, we'll cover configuring and using the Sensu Enterprise Amazon Web Services (AWS) EC2 integration.

- [EC2 Integration Basics][#ec2-integration-basics]
  - [Integration Configuration][#integration-configuration]
  - [Client Configuration][#client-configuration]
- [IAM Roles and Sensu][#iam-roles-and-sensu]

## Prerequisites

Before diving into this guide, we recommend having the following components ready:

- A working Sensu Enterprise deployment
- An AWS account
- An AWS access key and secret key

If you've not already signed up for Sensu Enterprise, you can do so via [this link][1]. The same goes for an AWS account. You can sign up for an account [here][2]. Once you've signed up for an AWS account, you'll also need to provision an access key and secret key for the user you want to use for Sensu Enterprise. AWS provides a [useful guide for provisioning those keys][3] that you can use to get started.

_NOTE: Make sure you save the CSV with your AWS access and secret key in a safe location._

## EC2 Integration Basics

Sensu Enterprise comes with a built-in integration for handling automatic deregistration of AWS clients. This is especially useful in environments where infrastructure is ephemeral. We'll start off by configuring the integration using the access key and secret key we provisioned for our AWS user.

### Integration Configuration

Our integration configuration file for EC2 will live at `/etc/sensu/conf.d/ec2.json`. Let's take a look at an example:

{{< highlight json >}}
{
  "ec2": {
    "region": "us-west-2",
    "access_key_id": "AlygD0X6Z4Xr2m3gl70J",
    "secret_access_key": "y9Jt5OqNOqdy5NCFjhcUsHMb6YqSbReLAJsy4d6obSZIWySv",
    "allowed_instance_states": ["running"],
    "timeout": 10
  }
}{{< /highlight >}}

### Client Configuration

## IAM Roles and Sensu

## Wrapping Up

That's all for this guide on configuring and using the Sensu Enterprise AWS EC2 integration. We covered the following topics:

* Configuring the integration
* Configuring the client
* Using IAM roles



<!-- LINKS -->

[1]: https://account.sensu.io/users/sign_up
[2]: https://portal.aws.amazon.com/gp/aws/developer/registration/index.html?nc2=h_ct
[3]: https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html#Using_CreateAccessKey
