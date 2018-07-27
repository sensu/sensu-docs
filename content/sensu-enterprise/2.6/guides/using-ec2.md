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

In this guide, we'll cover configuring and using the Sensu Enterprise Amazon Web Services (AWS) EC2 integration.

- [Prerequisites](#prerequisites)
  - [EC2 Integration Basics](#ec2-integration-basics)
    - [Integration Configuration](#integration-configuration)
    - [Client Configuration](#client-configuration)
  - [IAM Roles and Sensu](#iam-roles-and-sensu)
  - [Wrapping Up](#wrapping-up)
  - [References](#references)

# Prerequisites

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

When using the EC2 integration in this fashion, the only two required attributes are `access_key_id` and `secret_access_key`. The rest of the attributes are optional, but let's take a look over them

`region`: The `region` attribute is the region that the integration will use for queries about the instance's state. By default, this is set to `us-east-1` (the "Virginia" region).

`allowed_instance_states`: The `allowed_instance_states` attribute determines the state that an instance can be in before it is automatically deregistered. By default, this is set to "running", but you can also set it to "running", "stopping", "stopped", "shutting-down", "terminated", "rebooting", and "pending". Any instance that is in a state not specified in the configuration will be deregistered.

You can use the above example configuration and substitute your own access key and secret key in for the ones in the example. Let's continue and take a look at what is necessary at the client level for the EC2 integration to function properly.

_NOTE: Don't forget to restart the Sensu Enterprise process via `systemctl restart sensu-enterprise` for the configuration changes to take effect._

### Client Configuration

In order for the EC2 integration to work, some attributes are needed inside of your clients' configuration. Let's take a look at another example configuration:

{{< highlight json >}}
{
  "client": {
    "name": "i-424242",
    "...": "...",
    "keepalive": {
      "handlers": [
        "ec2"
      ]
    },
    "ec2": {
      "instance_id": "i-424242",
      "allowed_instance_states": [
        "running",
        "rebooting"
      ]
    }
  }
}{{< /highlight >}}

In the example above, there are several key attributes that you'll need to be aware of when configuring your own Sensu clients:

`name`: The name attribute here is important. By default, Sensu will take a look at the hostname of an instance and use that as the client's name unless it is explicitly configured. You can set the name attribute to be the same as the `instance_id` and avoid having to specify it inside of the `ec2` scope, but this can make instances difficult to identify.

`keepalive` scope: Inside of the `keepalive` scope, you must specify the `ec2` handler as in the example above.

`ec2` scope: The `ec2` scope contains a [number of attributes][5] that you'll want to be familiar with.

`instance_id`: This attribute _must_ be present if an instance's `name` attribute does not _exactly_ match the instance's EC2 instance id. If this is not set, and the attributes do not match exactly, automatic deregistration will not take place.

There are a number of other attributes that you may use in your configuration. See the [client reference documentation][5] for more information.

## IAM Roles and Sensu

It's possible to use the EC2 integration _without_ specifying the `access_key_id` and `secret_access_key` by setting an IAM role for your Sensu Enterprise servers, if you're running Sensu Enterprise on EC2 instances. Here's an example configuration that you would use to activate the EC2 integration:

{{< highlight shell >}}
{
  "ec2": {}
}{{< /highlight >}}

You're seeing that correctly--in order to use the EC2 integration, all you need to do is create `/etc/sensu/conf.d/ec2.json` with an empty hash under the `ec2` scope. We'll now take a look at what needs to be done on AWS.

1. Start by navigating to the [AWS IAM Console][7].

2. Click "Policies".

![ec2_policies][8]
3. Next, click "Create policy".

![ec2_policies_create][9]
4. Click the "JSON" tab

![ec2_policies_json][10]
5. Paste in the text below:

{{< highlight json >}}
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ec2:DescribeInstances"
            ],
            "Resource": [
                "*"
            ]
        }
    ]
}{{< /highlight >}}
6. Click "Review policy"

![ec2_policies_review][11]
7. Give the poicy a recognizable name and description, then click "Create policy".

![ec2_policies_create][12]
8. Next, we'll create the role that you'll attach to any Sensu Enterprise Instances you create. Click on "Roles" and "Create role"

![ec2_role][13]
9. Select "EC2" as the service that will use the role, and click "Next: Permissions"

![ec2_role_permissions][14]
10. In the search box, search for the policy you created step 7 and click the check box next to in, then proceed to "Next: Review"

![ec2_role_policy_attach][15]
11. Give the role a recognizable name and description, then click "Create role".

![ec2_role_create][16]

Now that we've created a policy and a role for the integration, we'll need to attach it to our Sensu Enterprise instance. You can do this during step 3 of creating any instance via the EC2 console:

![ec2_role_create][17]

Now that we have the policy and role created, and the role attached to an instance, let's see this in action on a test instance:

![ec2_test_gif][18]

## Wrapping Up

That's all for this guide on configuring and using the Sensu Enterprise AWS EC2 integration. We covered the following topics:

- Configuring the EC2 integration
- Configuring the client for use with EC2
- Using IAM roles in lieu of keys

We hope you've found this useful. For additional resources about the EC2 integration or client EC2 attributes, see the reference links below.

## References

- [EC2 Reference document][4]
- [EC2 Client attributes][5]
- [AWS Roles Reference Documentation][6]

<!-- LINKS -->

[1]: https://account.sensu.io/users/sign_up
[2]: https://portal.aws.amazon.com/gp/aws/developer/registration/index.html?nc2=h_ct
[3]: https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html#Using_CreateAccessKey
[4]: ../../integrations/ec2/#ec2-attributes
[5]: /sensu-core/latest/reference/clients/#ec2-attributes
[6]: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/iam-roles-for-amazon-ec2.html
[7]: https://console.aws.amazon.com/iam/home#/home
[8]: /images/ec2_01.PNG
[9]: /images/ec2_02.png
[10]: /images/ec2_03.png
[11]: /images/ec2_04.png
[12]: /images/ec2_05.png
[13]: /images/ec2_06.png
[14]: /images/ec2_07.png
[15]: /images/ec2_08.png
[16]: /images/ec2_09.png
[17]: /images/ec2_10.png
[18]: /images/ec2_test.gif