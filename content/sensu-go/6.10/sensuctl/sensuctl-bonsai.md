---
title: "Use sensuctl with Bonsai"
linkTitle: "Use sensuctl with Bonsai"
description: "Use sensuctl with Bonsai, the Sensu asset hub, to install dynamic runtime asset definitions and check for outdated dynamic runtime assets."
weight: 50
version: "6.10"
product: "Sensu Go"
platformContent: false 
menu:
  sensu-go-6.10:
    parent: sensuctl
---

Sensuctl supports installing dynamic runtime asset definitions directly from [Bonsai, the Sensu asset hub][1], and checking your Sensu backend for outdated dynamic runtime assets.
You can also use `sensuctl command` to install, execute, list, and delete commands from Bonsai or a URL.

## Install dynamic runtime asset definitions

To install a dynamic runtime asset definition directly from Bonsai, use `sensuctl asset add <ASSET_NAME>:<ASSET_VERSION>`.
Replace `<ASSET_NAME>` with the complete name of the dynamic runtime asset from Bonsai.
An asset's complete name includes both the part before the forward slash (sometimes called the Bonsai namespace) and the part after the forward slash.

{{< figure src="/images/go/sensuctl_bonsai/name_namespace_location_bonsai_asset.png" alt="Bonsai page for the Sensu InfluxDB handler showing the location of the asset namespace and name" link="/images/go/sensuctl_bonsai/name_namespace_location_bonsai_asset.png" target="_blank" >}}

Replace `<ASSET_VERSION>` with the asset version you want to install.
To automatically install the latest version of the plugin, you do not need to specify the version: `sensuctl asset add <ASSET_NAME>`.

{{% notice note %}}
**NOTE**: Specify the asset version you want to install to maintain the stability of your observability infrastructure.
If you do not specify a version to install, Sensu automatically installs the latest version, which may include breaking changes.
{{% /notice %}}

For example, to install version 3.7.0 of the [sensu/sensu-influxdb-handler][4] dynamic runtime asset:

{{< code shell >}}
sensuctl asset add sensu/sensu-influxdb-handler:3.7.0
{{< /code >}}

The response should be similar to this example:

{{< code text >}}
fetching bonsai asset: sensu/sensu-influxdb-handler:3.7.0
added asset: sensu/sensu-influxdb-handler:3.7.0

You have successfully added the Sensu asset resource, but the asset will not get downloaded until
it's invoked by another Sensu resource (ex. check). To add this runtime asset to the appropriate
resource, populate the "runtime_assets" field with ["sensu/sensu-influxdb-handler"].
{{< /code >}}

You can also use the `--rename` flag to rename the dynamic runtime asset on install:

{{< code shell >}}
sensuctl asset add sensu/sensu-influxdb-handler:3.7.0 --rename influxdb-handler
{{< /code >}}

{{% notice note %}}
**NOTE**: Sensu does not download and install dynamic runtime asset builds onto the system until they are needed for command execution.
Read the [asset reference](../../plugins/assets#dynamic-runtime-asset-builds) for more information about dynamic runtime asset builds.
{{% /notice %}}

## Check your Sensu backend for outdated dynamic runtime assets

To check your Sensu backend for dynamic runtime assets that have newer versions available on Bonsai, use `sensuctl asset outdated`.
This will print a list of dynamic runtime assets installed in the backend whose version is older than the newest version available on Bonsai:

{{< code shell >}}
sensuctl asset outdated
{{< /code >}}

If outdated assets are installed on the backend, the response will be similar to this example:

{{< code text >}}
          Asset Name                  Bonsai Asset          Current Version  Latest Version
----------------------------  ----------------------------  ---------------  --------------
sensu/sensu-influxdb-handler  sensu/sensu-influxdb-handler       3.6.1            3.7.0
{{< /code >}}

## Extend sensuctl with commands

Use `sensuctl command` to install, execute, list, and delete commands from Bonsai or a URL.

### Install commands

To install a sensuctl command from Bonsai or a URL:

{{< code shell >}}
sensuctl command install <ALIAS> (<ASSET_NAME>:<ASSET_VERSION> | --url <ARCHIVE_URL> --checksum <ARCHIVE_CHECKSUM>) <FLAGS>
{{< /code >}}

To install a command plugin, use the Bonsai asset name or specify a URL and SHA512 checksum.

**To install a command using the Bonsai asset name**, replace `<ASSET_NAME>` with the complete name of the asset from Bonsai.
`:<ASSET_VERSION>` is only required if you require a specific version or are pinning to a specific version.
If you do not specify a version, sensuctl will fetch the latest version from Bonsai.

Replace `<ALIAS>` with a unique name for the command.
For example, for the [Sensu EC2 Discovery Plugin][3], you might use the alias `sensu-ec2-discovery`. 
`<ALIAS>` is required.

Replace `<FLAGS>` with the flags you want to use.
Run `sensuctl command install -h` to view flags.
Flags are optional and apply only to the `install` command &mdash; they are not saved as part of the command you are installing.

To install a command from the [Sensu EC2 Discovery Plugin][3] with no flags:

{{< code shell >}}
sensuctl command install sensu-ec2-discovery portertech/sensu-ec2-discovery:0.3.0
{{< /code >}}

**To install a command from a URL**, replace `<ARCHIVE_URL>` with a command URL that points to a tarball (for example, https://path/to/asset.tar.gz).
Replace `<ARCHIVE_CHECKSUM>` with the checksum you want to use.
Replace `<ALIAS>` with a unique name for the command.

Replace `<FLAGS>` with the flags you want to use.
Run `sensuctl command install -h` to view flags.
Flags are optional and apply only to the `install` command &mdash; they are not saved as part of the command you are installing.

For example, to install a command-test dynamic runtime asset via URL with no flags:

{{< code shell >}}
sensuctl command install command-test --url https://github.com/amdprophet/command-test/releases/download/v0.0.4/command-test_0.0.4_darwin_amd64.tar.gz --checksum 8b15a170e091dab42256fe64ca7c4a050ed49a9dbfd6c8129c95506a8a9a91f2762ac1a6d24f4fc545430613fd45abc91d3e5d3605fcfffb270dcf01996caa7f
{{< /code >}}

{{% notice note %}}
**NOTE**: Dynamic runtime asset definitions with multiple asset builds are only supported via Bonsai.
{{% /notice %}}

### Execute commands

To execute a sensuctl command plugin via its dynamic runtime asset's bin/entrypoint executable:

{{< code shell >}}
sensuctl command exec <ALIAS> <GLOBAL_FLAGS> <FLAGS>
{{< /code >}}

Replace `<ALIAS>` with a unique name for the command.
For example, for the [Sensu EC2 Discovery Plugin][3], you might use the alias `sensu-ec2-discovery`. 
`<ALIAS>` is required.

Replace `<GLOBAL_FLAGS>` with the globlal flags you want to use.
Run `sensuctl command exec -h` to view global flags.
To pass `<GLOBAL_FLAGS>` flags to the bin/entrypoint executable, make sure to specify them after a double dash surrounded by spaces.

Replace `<FLAGS>` with the flags you want to use.
Run `sensuctl command exec -h` to view flags.
Flags are optional and apply only to the `exec` command &mdash; they are not saved as part of the command you are executing.

{{% notice note %}}
**NOTE**: When you use `sensuctl command exec`, the [environment variables](../environment-variables) are passed to the command.
{{% /notice %}}

For example:

{{< code shell >}}
sensuctl command exec <COMMAND> <GLOBAL_FLAG_1> <GLOBAL_FLAG_2> --cache-dir /tmp -- --<FLAG_1> --<FLAG_2>=<value>
{{< /code >}}

Sensuctl will parse the --cache-dir flag, but bin/entrypoint will parse all flags after the ` -- `.

In this example, the full command run by sensuctl exec would be:

{{< code shell >}}
bin/entrypoint <GLOBAL_FLAG_1> <GLOBAL_FLAG_2> --<FLAG_1> --<FLAG_2>=<value>
{{< /code >}}

### List commands

To list installed sensuctl commands: 

{{< code shell >}}
sensuctl command list <FLAGS>
{{< /code >}}

Replace `<FLAGS>` with the flags you want to use.
Run `sensuctl command list -h` to view flags.
Flags are optional and apply only to the `list` command.

### Delete commands

To delete sensuctl commands:

{{< code shell >}}
sensuctl command delete <ALIAS> <FLAGS>
{{< /code >}}

Replace `<ALIAS>` with a unique name for the command.
For example, for the [sensu/sensu-ec2-handler][3], you might use the alias `sensu-ec2-handler`. 
`<ALIAS>` is required.

Replace `<FLAGS>` with the flags you want to use.
Run `sensuctl command delete -h` to view flags.
Flags are optional and apply only to the `delete` command.


[1]: https://bonsai.sensu.io/
[3]: https://bonsai.sensu.io/assets/sensu/sensu-ec2-handler
[4]: https://bonsai.sensu.io/assets/sensu/sensu-influxdb-handler
