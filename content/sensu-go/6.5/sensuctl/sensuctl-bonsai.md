---
title: "Use sensuctl with Bonsai"
linkTitle: "Use sensuctl with Bonsai"
description: "Sensuctl supports installing dynamic runtime asset definitions directly from Bonsai, the Sensu asset hub, and checking for outdated dynamic runtime assets. Read this page to learn about using sensuctl with Bonsai."
weight: 50
version: "6.5"
product: "Sensu Go"
platformContent: false 
menu:
  sensu-go-6.5:
    parent: sensuctl
---

Sensuctl supports installing dynamic runtime asset definitions directly from [Bonsai, the Sensu asset hub][1], and checking your Sensu backend for outdated dynamic runtime assets.
You can also use `sensuctl command` to install, execute, list, and delete commands from Bonsai or a URL.

## Install dynamic runtime asset definitions

To install a dynamic runtime asset definition directly from Bonsai, use `sensuctl asset add <namespace/name>:<version>`.
Replace `<namespace/name>` with the namespace and name of the dynamic runtime asset from Bonsai and `<version>` with the asset version you want to install.

To automatically install the latest version of the plugin, you do not need to specify the version: `sensuctl asset add <namespace/name>`.

{{% notice note %}}
**NOTE**: We recommend specifying the asset version you want to install to maintain the stability of your observability infrastructure.
If you do not specify a version to install, Sensu automatically installs the latest version, which may include breaking changes.
{{% /notice %}}

![Bonsai page for InfluxDB handler showing namespace and name][2]

For example, to install version 3.7.0 of the [Sensu InfluxDB Handler][4] dynamic runtime asset:

{{< code shell >}}
sensuctl asset add sensu/sensu-influxdb-handler:3.7.0
{{< /code >}}

The response should be similar to this example:

{{< code shell >}}
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
Read [the asset reference](../../plugins/assets#dynamic-runtime-asset-builds) for more information about dynamic runtime asset builds.
{{% /notice %}}

## Check your Sensu backend for outdated dynamic runtime assets

To check your Sensu backend for dynamic runtime assets that have newer versions available on Bonsai, use `sensuctl asset outdated`.
This will print a list of dynamic runtime assets installed in the backend whose version is older than the newest version available on Bonsai:

{{< code shell >}}
sensuctl asset outdated
{{< /code >}}

If outdated assets are installed on the backend, the response will be similar to this example:

{{< code shell >}}
          Asset Name                  Bonsai Asset          Current Version  Latest Version
----------------------------  ----------------------------  ---------------  --------------
sensu/sensu-influxdb-handler  sensu/sensu-influxdb-handler       3.6.1            3.7.0
{{< /code >}}

## Extend sensuctl with commands

Use `sensuctl command` to install, execute, list, and delete commands from Bonsai or a URL.

### Install commands

To install a sensuctl command from Bonsai or a URL:

{{< code shell >}}
sensuctl command install <alias> (<namespace/name>:<version> | --url <archive_url> --checksum <archive_checksum>) <flags>
{{< /code >}}

To install a command plugin, use the Bonsai asset name or specify a URL and SHA512 checksum.

**To install a command using the Bonsai asset name**, replace `<namespace/name>` with the name of the asset from Bonsai.
`:<version>` is only required if you require a specific version or are pinning to a specific version.
If you do not specify a version, sensuctl will fetch the latest version from Bonsai.

Replace `<alias>` with a unique name for the command.
For example, for the [Sensu EC2 Discovery Plugin][3], you might use the alias `sensu-ec2-discovery`. 
`<alias>` is required.

Replace `<flags>` with the flags you want to use.
Run `sensuctl command install -h` to view flags.
Flags are optional and apply only to the `install` command &mdash; they are not saved as part of the command you are installing.

To install a command from the [Sensu EC2 Discovery Plugin][3] with no flags:

{{< code shell >}}
sensuctl command install sensu-ec2-discovery portertech/sensu-ec2-discovery:0.3.0
{{< /code >}}

**To install a command from a URL**, replace `<archive_url>` with a command URL that points to a tarball (for example, https://path/to/asset.tar.gz).
Replace `<archive_checksum>` with the checksum you want to use.
Replace `<alias>` with a unique name for the command.

Replace `<flags>` with the flags you want to use.
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
sensuctl command exec <alias> <args> <flags>
{{< /code >}}

Replace `<alias>` with a unique name for the command.
For example, for the [Sensu EC2 Discovery Plugin][3], you might use the alias `sensu-ec2-discovery`. 
`<alias>` is required.

Replace `<flags>` with the flags you want to use.
Run `sensuctl command exec -h` to view flags.
Flags are optional and apply only to the `exec` command &mdash; they are not saved as part of the command you are executing.

Replace `<args>` with the globlal flags you want to use.
Run `sensuctl command exec -h` to view global flags.
To pass `<args>` flags to the bin/entrypoint executable, make sure to specify them after a double dash surrounded by spaces.

{{% notice note %}}
**NOTE**: When you use `sensuctl command exec`, the [environment variables](../environment-variables) are passed to the command.
{{% /notice %}}

For example:

{{< code shell >}}
sensuctl command exec <command> <arg1> <arg2> --cache-dir /tmp -- --<flag1> --<flag2>=<value>
{{< /code >}}

Sensuctl will parse the --cache-dir flag, but bin/entrypoint will parse all flags after the ` -- `.

In this example, the full command run by sensuctl exec would be:

{{< code shell >}}
bin/entrypoint <arg1> <arg2> --<flag1> --<flag2>=<value>
{{< /code >}}

### List commands

To list installed sensuctl commands: 

{{< code shell >}}
sensuctl command list <flags>
{{< /code >}}

Replace `<flags>` with the flags you want to use.
Run `sensuctl command list -h` to view flags.
Flags are optional and apply only to the `list` command.

### Delete commands

To delete sensuctl commands:

{{< code shell >}}
sensuctl command delete <alias> <flags>
{{< /code >}}

Replace `<alias>` with a unique name for the command.
For example, for the [Sensu EC2 Discovery Plugin][3], you might use the alias `sensu-ec2-discovery`. 
`<alias>` is required.

Replace `<flags>` with the flags you want to use.
Run `sensuctl command delete -h` to view flags.
Flags are optional and apply only to the `delete` command.


[1]: https://bonsai.sensu.io/
[2]: /images/sensu-influxdb-handler-namespace.png
[3]: https://bonsai.sensu.io/assets/portertech/sensu-ec2-discovery
[4]: https://bonsai.sensu.io/assets/sensu/sensu-influxdb-handler
