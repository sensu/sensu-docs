---
title: "Use sensuctl with Bonsai"
linkTitle: "Use sensuctl with Bonsai"
description: "Sensuctl is a command line tool for managing resources within Sensu. It works by calling Sensu’s underlying API to create, read, update, and delete resources, events, and entities. Read this reference doc to learn about sensuctl."
weight: 60
version: "5.19"
product: "Sensu Go"
platformContent: false 
menu:
  sensu-go-5.19:
    parent: sensuctl-access
---

- [Install asset definitions](#install-asset-definitions)
- [Check your Sensu backend for outdated assets](#check-your-sensu-backend-for-outdated-assets)
- [Extend sensuctl with commands](#extend-sensuctl-with-commands)


Sensuctl supports installing asset definitions directly from [Bonsai, the Sensu asset index][34], and checking your Sensu backend for outdated assets.
You can also use `sensuctl command` to install, execute, list, and delete commands from Bonsai or a URL.

## Install asset definitions

To install an asset definition directly from Bonsai, use `sensuctl asset add [NAMESPACE/NAME][:VERSION]`.
`[:VERSION]` is only required if you require a specific version or are pinning to a specific version.

Replace `[NAMESPACE/NAME]` with the namespace and name of the asset from Bonsai:

![Bonsai page for InfluxDB handler showing namespace and name][36]

{{< highlight shell >}}
sensuctl asset add sensu/sensu-influxdb-handler:3.1.1
fetching bonsai asset: sensu/sensu-influxdb-handler:3.1.1
added asset: sensu/sensu-influxdb-handler:3.1.1
{{< /highlight >}}

You can also use the `--rename` flag to rename the asset on install:

{{< highlight shell >}}
sensuctl asset add sensu/sensu-slack-handler --rename slack-handler
no version specified, using latest: 1.0.3
fetching bonsai asset: sensu/sensu-slack-handler:1.0.3
added asset: sensu/sensu-slack-handler:1.0.3
{{< /highlight >}}

## Check your Sensu backend for outdated assets

To check your Sensu backend for assets that have newer versions available on Bonsai, use `sensuctl asset outdated`.
This will print a list of assets installed in the backend whose version is older than the newest version available on Bonsai:

{{< highlight shell >}}
sensuctl asset outdated
          Asset Name                  Bonsai Asset          Current Version  Latest Version
----------------------------  ----------------------------  ---------------  --------------
sensu/sensu-influxdb-handler  sensu/sensu-influxdb-handler       3.1.1            3.1.2
{{< /highlight >}}

## Extend sensuctl with commands

Use `sensuctl command` to install, execute, list, and delete commands from Bonsai or a URL.

### Install commands

To install a sensuctl command from Bonsai or a URL:

{{< highlight shell >}}
sensuctl command install [ALIAS] ([NAMESPACE/NAME]:[VERSION] | --url [ARCHIVE_URL] --checksum [ARCHIVE_CHECKSUM]) [flags]
{{< /highlight >}}

To install a command plugin, use the Bonsai asset name or specify a URL and SHA512 checksum.

**To install a command using the Bonsai asset name**, replace `[NAMESPACE/NAME]` with the name of the asset from Bonsai.
`[:VERSION]` is only required if you require a specific version or are pinning to a specific version.
If you do not specify a version, sensuctl will fetch the latest version from Bonsai.

Replace `[ALIAS]` with a unique name for the command.
For example, for the [Sensu EC2 Discovery Plugin][37], you might use the alias `sensu-ec2-discovery`. 
`[ALIAS]` is required.

Replace `[flags]` with the flags you want to use.
Run `sensuctl command install -h` to view flags.
Flags are optional and apply only to the `install` command &mdash; they are not saved as part of the command you are installing.

To install a command from the [Sensu EC2 Discovery Plugin][37] with no flags:

{{< highlight shell >}}
sensuctl command install sensu-ec2-discovery portertech/sensu-ec2-discovery:0.3.0
{{< /highlight >}}

**To install a command from a URL**, replace `[ARCHIVE_URL]` with a command URL that points to a tarball (e.g. https://path/to/asset.tar.gz).
Replace `[ARCHIVE_CHECKSUM]` with the checksum you want to use.
Replace `[ALIAS]` with a unique name for the command.

Replace `[flags]` with the flags you want to use.
Run `sensuctl command install -h` to view flags.
Flags are optional and apply only to the `install` command &mdash; they are not saved as part of the command you are installing.

For example, to install a command-test asset via URL with no flags:

{{< highlight shell >}}
sensuctl command install command-test --url https://github.com/amdprophet/command-test/releases/download/v0.0.4/command-test_0.0.4_darwin_amd64.tar.gz --checksum 8b15a170e091dab42256fe64ca7c4a050ed49a9dbfd6c8129c95506a8a9a91f2762ac1a6d24f4fc545430613fd45abc91d3e5d3605fcfffb270dcf01996caa7f
{{< /highlight >}}

{{% notice note %}}
**NOTE**: Asset definitions with multiple asset builds are only supported via Bonsai.
{{% /notice %}}

### Execute commands

To execute a sensuctl command plugin via its asset's bin/entrypoint executable:

{{< highlight shell >}}
sensuctl command exec [ALIAS] [args] [flags]
{{< /highlight >}}

Replace `[ALIAS]` with a unique name for the command.
For example, for the [Sensu EC2 Discovery Plugin][37], you might use the alias `sensu-ec2-discovery`. 
`[ALIAS]` is required.

Replace `[flags]` with the flags you want to use.
Run `sensuctl command exec -h` to view flags.
Flags are optional and apply only to the `exec` command &mdash; they are not saved as part of the command you are executing.

Replace `[args]` with the globlal flags you want to use.
Run `sensuctl command exec -h` to view global flags.
To pass `[args]` flags to the bin/entrypoint executable, make sure to specify them after a double dash surrounded by spaces.

{{% notice note %}}
**NOTE**: When you use `sensuctl command exec`, the [environment variables](#environment-variables) are passed to the command.
{{% /notice %}}

For example:

{{< highlight shell >}}
sensuctl command exec mycommand arg1 arg2 --cache-dir /tmp -- --flag1 --flag2=value
{{< /highlight >}}

Sensuctl will parse the --cache-dir flag, but bin/entrypoint will parse all flags after the ` -- `.

In this example, the full command run by sensuctl exec would be:

{{< highlight shell >}}
bin/entrypoint arg1 arg2 --flag1 --flag2=value
{{< /highlight >}}

### List commands

To list installed sensuctl commands: 

{{< highlight shell >}}
sensuctl command list [flags]
{{< /highlight >}}

Replace `[flags]` with the flags you want to use.
Run `sensuctl command list -h` to view flags.
Flags are optional and apply only to the `list` command.

### Delete commands

To delete sensuctl commands:

{{< highlight shell >}}
sensuctl command delete [ALIAS] [flags]
{{< /highlight >}}

Replace `[ALIAS]` with a unique name for the command.
For example, for the [Sensu EC2 Discovery Plugin][37], you might use the alias `sensu-ec2-discovery`. 
`[ALIAS]` is required.

Replace `[flags]` with the flags you want to use.
Run `sensuctl command delete -h` to view flags.
Flags are optional and apply only to the `delete` command.

[1]: ../../reference/rbac/
[2]: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
[3]: #sensuctl-create-resource-types
[4]: ../../installation/install-sensu/#install-sensuctl
[5]: ../../reference/agent/#general-configuration-flags
[6]: ../../reference/
[7]: ../../guides/clustering/
[8]: #create-resources
[9]: #sensu-backend-url
[10]: #preferred-output-format
[11]: #username-password-and-namespace
[12]: ../../reference/assets/
[13]: ../../reference/checks/
[14]: ../../reference/entities/
[15]: ../../reference/events/
[16]: ../../reference/filters/
[17]: ../../reference/handlers/
[18]: ../../reference/hooks/
[19]: ../../reference/mutators/
[20]: ../../reference/silencing/
[21]: ../../reference/rbac#namespaces
[22]: ../../reference/rbac#users
[23]: #subcommands
[24]: #sensuctl-edit-resource-types
[25]: ../../api/overview/
[26]: ../../installation/auth/#ldap-authentication
[27]: ../../reference/tessen/
[28]: ../../api/overview#response-filtering
[29]: ../../api/overview#field-selector
[30]: ../../getting-started/enterprise/
[31]: #manage-sensuctl
[32]: ../../reference/datastore/
[33]: #create-resources-across-namespaces
[34]: https://bonsai.sensu.io/
[35]: ../../reference/etcdreplicators/
[36]: /images/sensu-influxdb-handler-namespace.png
[37]: https://bonsai.sensu.io/assets/portertech/sensu-ec2-discovery
[39]: #wrapped-json-format
[40]: ../../installation/install-sensu/#install-the-sensu-backend
[41]: ../../reference/secrets/
[42]: ../../installation/auth/#ad-authentication
[43]: ../../reference/secrets-providers/
[44]: ../../installation/auth#use-built-in-basic-authentication
[45]: ../../installation/install-sensu/#2-configure-and-start
[46]: #first-time-setup
[47]: ../../api/overview/#operators
[48]: #sensuctl-prune-resource-types
