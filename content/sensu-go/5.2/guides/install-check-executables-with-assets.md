---
title: "How to use Sensu assets"
linkTitle: "Using Bonsai Assets"
weight: 40
version: "5.2"
product: "Sensu Go"
platformContent: False
menu: 
  sensu-go-5.2:
    parent: guides
---

Assets are shareable, reusable packages that help you manage plugins in Sensu.
Sensu supports runtime assets for [checks][6], [filters][7], [mutators][8], and [handlers][9].
You can discover, download, and share assets using [Bonsai, the Sensu asset index][16].
See the [asset reference](../../reference/assets) more information about creating and sharing assets.

In this guide, we'll get started using the [Sensu AWS plugins][26] and [Sensu ServiceNow handler][27] assets.

## Monitoring EC2 with the Sensu AWS plugins asset

### 1. Download the asset definition from Bonsai

Visit the asset page in [Bonsai][4], and select the Download button to download the asset definition for your platform and architecture.
For example, for Linux AMD64, Bonsai provides the following asset definition.

`sensu-sensu-aws-0.0.2-linux-amd64.json`

{{< highlight json >}}
{
  "type": "Asset",
  "api_version": "core/v2",
  "metadata": {
    "name": "sensu-aws",
    "namespace": "default",
    "labels": {},
    "annotations": {}
  },
  "spec": {
    "url": "https://github.com/sensu/sensu-aws/releases/download/0.0.2/sensu-aws_0.0.2_linux_amd64.tar.gz",
    "sha512": "5d8a17324da4e0793418c144b269f4a7c3ebffb7b9f222008432b6804e243400ee9aaa09cd367ece8a9216950f314283e290995eb53bb0ebd5f8594b09e7003f",
    "filters": [
      "entity.system.os == 'linux'",
      "entity.system.arch == 'amd64'"
    ]
  }
}
{{< /highlight >}}

Once you've downloaded the asset definition, you can register the asset with Sensu using sensuctl.

{{< highlight shell >}}
sensuctl create --file sensu-sensu-aws-0.0.2-linux-amd64.json
{{< /highlight >}}

You should now have the `sensu-aws` asset ready to use with Sensu.

{{< highlight shell >}}
sensuctl asset list

            Name                                     URL                            Hash    
 ────────────────────────── ───────────────────────────────────────────────────── ───────── 
  sensu-aws                  //github.com/.../sensu-aws_0.0.2_linux_amd64.tar.gz   5d8a173  
{{< /highlight >}}

### 2. Create a Sensu check that uses the asset

Now that you've registered the AWS asset with Sensu, we'll create a Sensu service check to monitor EC2.
Asset pages in Bonsai are your best resource for learning how to create Sensu resources that use assets.

To monitor the CPU balance in EC2, we can use the following check definition.

`ec2-cpu-balance.json`

{{< highlight json >}}
{
  "type": "CheckConfig",
  "api_version": "core/v2",
  "metadata": {
    "name": "ec2-cpu-balance",
    "namespace": "default"
  },
  "spec": {
    "command": "check-ec2-cpu_balance --critical=1 --warning=5",
    "handlers": ["pagerduty"],
    "interval": 10,
    "publish": true,
    "runtime_assets": ["sensu-aws"],
    "subscriptions": [
      "ec2"
    ]
  }
}
{{< /highlight >}}

We can see that the check specifies the `sensu-aws` asset and includes the command for the EC2 CPU plugin.
See the [AWS asset in Bonsai][26] for instructions on configuring your AWS instance to connect to Sensu.

You can create the `ec2-cpu-balance` check in Sensu using sensuctl.

{{< highlight shell >}}
sensuctl create --file ec2-cpu-balance.json
{{< /highlight >}}

You should now have the `ec2-cpu-balance` check ready to use with Sensu.

{{< highlight shell >}}
sensuctl check list

       Name                            Command                       Interval   Cron   Timeout   TTL   Subscriptions   Handlers     Assets     Hooks   Publish?   Stdin?   Metric Format   Metric Handlers  
 ───────────────── ──────────────────────────────────────────────── ────────── ────── ───────── ───── ─────────────── ─────────── ─────────── ─────── ────────── ──────── ─────────────── ───────────────── 
  ec2-cpu-balance   check-ec2-cpu_balance --critical=1 --warning=5         10                0     0   ec2             pagerduty   sensu-aws           true       false                              
{{< /highlight >}}

## Creating incidents using the Sensu ServiceNow handler asset

Now we'll use the [Sensu ServiceNow handler asset][21] to automate incident management in ServiceNow.

**ENTERPRISE ONLY**: The Sensu ServiceNow handler asset requires a [Sensu Enterprise](http://sensu.io/products/enterprsie) license. To activate your Sensu Enterprise license, see the [getting started guide][17].

### 1. Download the asset definition from Bonsai

Visit the asset page in [Bonsai][21], and select the Download button to download the asset definition for your platform and architecture.
For example, for Linux AMD64, Bonsai provides the following asset definition.

`portertech-sensu-servicenow-handler-0.0.10-linux-amd64.json`

{{< highlight json >}}
{
  "type": "Asset",
  "api_version": "core/v2",
  "metadata": {
    "name": "sensu-servicenow-handler",
    "namespace": "default",
    "labels": {},
    "annotations": {
      "bonsai.sensu.io.message": "This asset is for users with a valid Enterprise license"
    }
  },
  "spec": {
    "url": "https://bonsai.sensu.io/release_assets/portertech/sensu-servicenow-handler/0.0.10/linux/amd64/asset_file",
    "sha512": "b654682749ee985b72484cfed6da9380d723e5b2b7d4bd15b09b65bf60048392a259ada22471937e205fc45d7fa8bfb7f5cc86cd61fac346fa2ed188c0fbc20a",
    "filters": [
      "entity.system.os == linux",
      "entity.system.arch == amd64"
    ]
  }
}
{{< /highlight >}}

Once you've downloaded the asset definition, you can register the asset with Sensu using sensuctl.

{{< highlight shell >}}
sensuctl create --file portertech-sensu-servicenow-handler-0.0.10-linux-amd64.json
{{< /highlight >}}

You should now have the `sensu-servicenow-handler` asset ready to use with Sensu.

{{< highlight shell >}}
sensuctl asset list

            Name                                     URL                            Hash    
 ────────────────────────── ───────────────────────────────────────────────────── ───────── 
  sensu-servicenow-handler   //bonsai.sensu.io/.../asset_file                      b654682  
{{< /highlight >}}

### 2. Create a Sensu handler that uses the asset

Now that you've registered the ServiceNow handler asset with Sensu, you can create a Sensu event handler that installs and executes the asset to manage incidents in ServiceNow.
Asset pages in Bonsai are your best resource for learning how to create Sensu resources with assets.

To manage incidents in ServiceNow, you can use the following handler definition.

`servicenow.json`

{{< highlight json >}}
{
    "api_version": "core/v2",
    "type": "Handler",
    "metadata": {
        "namespace": "default",
        "name": "servicenow"
    },
    "spec": {
        "type": "pipe",
        "command": "sensu-servicenow-handler -H mycompany.service-now.com -u sn_user -p sn_password -c cmdb_ci_server -i incident -e em_event -t 30",
        "runtime_assets": ["sensu-servicenow-handler"],
        "timeout": 10,
        "filters": [
            "is_incident"
        ]
    }
}
{{< /highlight >}}

We can see that the handler specifies the `sensu-servicenow-handler` asset.
Edit the command to include your ServiceNow instance host, username, password, and other ServiceNow configuration attributes.
See the [Sensu ServiceNow asset in Bonsai][21] for configuration instructions.

You create the `servicenow` handler in Sensu using sensuctl.

{{< highlight shell >}}
sensuctl create --file servicenow.json
{{< /highlight >}}

You should now have the `servicenow` handler ready to use with Sensu.

{{< highlight shell >}}
sensuctl handler list

     Name      Type   Timeout     Filters     Mutator                                                                  Execute                                                                  Environment Variables            Assets           
 ──────────── ────── ───────── ───────────── ───────── ─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────── ─────────────────────── ────────────────────────── 
  servicenow   pipe        10   is_incident             RUN:  sensu-servicenow-handler -H mycompany.service-now.com -u sn_user -p sn_password -c cmdb_ci_server -i incident -e em_event -t 30                           sensu-servicenow-handler  
{{< /highlight >}}

## Next steps

You now know how to create an asset and add it to a check, handler, and mutator as a dependency.
For further reading, check out the [assets reference][1].

[1]: ../../reference/assets/
[2]: #creating-an-asset
[3]: https://bonsai.sensu.io
[4]: https://bonsai.sensu.io/assets/sensu/sensu-aws
[6]: ../checks
[7]: ../filters
[8]: ../mutators
[9]: ../handlers
[16]: https://bonsai.sensu.io
[17]: ../../getting-started/enterprise
[19]: https://bonsai.sensu.io/assets/sensu/sensu-pagerduty-handler
[20]: https://bonsai.sensu.io/assets/sensu/sensu-email-handler
[21]: https://bonsai.sensu.io/assets/portertech/sensu-servicenow-handler
[22]: https://bonsai.sensu.io/assets/portertech/sensu-jira-handler
[26]: https://bonsai.sensu.io/assets/sensu/sensu-aws
[27]: https://bonsai.sensu.io/assets/sensu/sensu-prometheus-collector