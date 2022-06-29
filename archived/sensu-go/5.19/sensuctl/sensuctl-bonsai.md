---
title: "Use sensuctl with Bonsai"
linkTitle: "Use sensuctl with Bonsai"
description: "Sensuctl supports installing asset definitions directly from Bonsai, the Sensu asset index, and checking for outdated assets. Read this page to learn about using sensuctl with Bonsai."
weight: 50
version: "5.19"
product: "Sensu Go"
platformContent: false 
menu:
  sensu-go-5.19:
    parent: sensuctl
---

Sensuctl supports installing asset definitions directly from [Bonsai, the Sensu asset index][1], and checking your Sensu backend for outdated assets.
You can also use `sensuctl command` to install, execute, list, and delete commands from Bonsai or a URL.

## Install asset definitions

To install an asset definition directly from Bonsai, use `sensuctl asset add [NAMESPACE/NAME][:VERSION]`.
`[:VERSION]` is only required if you require a specific version or are pinning to a specific version.

Replace `[NAMESPACE/NAME]` with the namespace and name of the asset from Bonsai:

{{< figure src="/images/go/sensuctl_bonsai/name_namespace_location_bonsai_asset.png" alt="Bonsai page for the Sensu InfluxDB handler showing the location of the asset namespace and name" link="/images/go/sensuctl_bonsai/name_namespace_location_bonsai_asset.png" target="_blank" >}}

{{< code shell >}}
sensuctl asset add sensu/sensu-influxdb-handler:3.1.1
fetching bonsai asset: sensu/sensu-influxdb-handler:3.1.1
added asset: sensu/sensu-influxdb-handler:3.1.1
{{< /code >}}

You can also use the `--rename` flag to rename the asset on install:

{{< code shell >}}
sensuctl asset add sensu/sensu-slack-handler --rename slack-handler
no version specified, using latest: 1.0.3
fetching bonsai asset: sensu/sensu-slack-handler:1.0.3
added asset: sensu/sensu-slack-handler:1.0.3
{{< /code >}}

{{% notice note %}}
**NOTE**: Sensu does not download and install asset builds onto the system until they are needed for command execution.
Read [the asset reference](../../reference/assets#asset-builds) for more information about asset builds.
{{% /notice %}}

## Check your Sensu backend for outdated assets

To check your Sensu backend for assets that have newer versions available on Bonsai, use `sensuctl asset outdated`.
This will print a list of assets installed in the backend whose version is older than the newest version available on Bonsai:

{{< code shell >}}
sensuctl asset outdated
          Asset Name                  Bonsai Asset          Current Version  Latest Version
----------------------------  ----------------------------  ---------------  --------------
sensu/sensu-influxdb-handler  sensu/sensu-influxdb-handler       3.1.1            3.1.2
{{< /code >}}

## Extend sensuctl with commands

Use `sensuctl command` to install, execute, list, and delete commands from Bonsai or a URL.

### Install commands

To install a sensuctl command from Bonsai or a URL:

{{< code shell >}}
sensuctl command install [ALIAS] ([NAMESPACE/NAME]:[VERSION] | --url [ARCHIVE_URL] --checksum [ARCHIVE_CHECKSUM]) [flags]
{{< /code >}}

To install a command plugin, use the Bonsai asset name or specify a URL and SHA512 checksum.

**To install a command using the Bonsai asset name**, replace `[NAMESPACE/NAME]` with the name of the asset from Bonsai.
`[:VERSION]` is only required if you require a specific version or are pinning to a specific version.
If you do not specify a version, sensuctl will fetch the latest version from Bonsai.

Replace `[ALIAS]` with a unique name for the command.
For example, for the [Sensu EC2 Discovery Plugin][3], you might use the alias `sensu-ec2-discovery`. 
`[ALIAS]` is required.

Replace `[flags]` with the flags you want to use.
Run `sensuctl command install -h` to view flags.
Flags are optional and apply only to the `install` command &mdash; they are not saved as part of the command you are installing.

To install a command from the [Sensu EC2 Discovery Plugin][3] with no flags:

{{< code shell >}}
sensuctl command install sensu-ec2-discovery portertech/sensu-ec2-discovery:0.3.0
{{< /code >}}

**To install a command from a URL**, replace `[ARCHIVE_URL]` with a command URL that points to a tarball (e.g. https://path/to/asset.tar.gz).
Replace `[ARCHIVE_CHECKSUM]` with the checksum you want to use.
Replace `[ALIAS]` with a unique name for the command.

Replace `[flags]` with the flags you want to use.
Run `sensuctl command install -h` to view flags.
Flags are optional and apply only to the `install` command &mdash; they are not saved as part of the command you are installing.

For example, to install a command-test asset via URL with no flags:

{{< code shell >}}
sensuctl command install command-test --url https://github.com/amdprophet/command-test/releases/download/v0.0.4/command-test_0.0.4_darwin_amd64.tar.gz --checksum 8b15a170e091dab42256fe64ca7c4a050ed49a9dbfd6c8129c95506a8a9a91f2762ac1a6d24f4fc545430613fd45abc91d3e5d3605fcfffb270dcf01996caa7f
{{< /code >}}

{{% notice note %}}
**NOTE**: Asset definitions with multiple asset builds are only supported via Bonsai.
{{% /notice %}}

### Execute commands

To execute a sensuctl command plugin via its asset's bin/entrypoint executable:

{{< code shell >}}
sensuctl command exec [ALIAS] [args] [flags]
{{< /code >}}

Replace `[ALIAS]` with a unique name for the command.
For example, for the [Sensu EC2 Discovery Plugin][3], you might use the alias `sensu-ec2-discovery`. 
`[ALIAS]` is required.

Replace `[flags]` with the flags you want to use.
Run `sensuctl command exec -h` to view flags.
Flags are optional and apply only to the `exec` command &mdash; they are not saved as part of the command you are executing.

Replace `[args]` with the globlal flags you want to use.
Run `sensuctl command exec -h` to view global flags.
To pass `[args]` flags to the bin/entrypoint executable, make sure to specify them after a double dash surrounded by spaces.

{{% notice note %}}
**NOTE**: When you use `sensuctl command exec`, the [environment variables](../environment-variables) are passed to the command.
{{% /notice %}}

For example:

{{< code shell >}}
sensuctl command exec mycommand arg1 arg2 --cache-dir /tmp -- --flag1 --flag2=value
{{< /code >}}

Sensuctl will parse the --cache-dir flag, but bin/entrypoint will parse all flags after the ` -- `.

In this example, the full command run by sensuctl exec would be:

{{< code shell >}}
bin/entrypoint arg1 arg2 --flag1 --flag2=value
{{< /code >}}

### List commands

To list installed sensuctl commands: 

{{< code shell >}}
sensuctl command list [flags]
{{< /code >}}

Replace `[flags]` with the flags you want to use.
Run `sensuctl command list -h` to view flags.
Flags are optional and apply only to the `list` command.

### Delete commands

To delete sensuctl commands:

{{< code shell >}}
sensuctl command delete [ALIAS] [flags]
{{< /code >}}

Replace `[ALIAS]` with a unique name for the command.
For example, for the [Sensu EC2 Discovery Plugin][3], you might use the alias `sensu-ec2-discovery`. 
`[ALIAS]` is required.

Replace `[flags]` with the flags you want to use.
Run `sensuctl command delete -h` to view flags.
Flags are optional and apply only to the `delete` command.


[1]: https://bonsai.sensu.io/
[2]: /images/sensu-influxdb-handler-namespace.png
[3]: https://bonsai.sensu.io/assets/portertech/sensu-ec2-discovery
