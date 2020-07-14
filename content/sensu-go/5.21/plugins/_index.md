---
title: "Plugins"
description: "Sensu plugins provide executables that extend Sensu's functionality. Use Sensu plugins to perform status or metric checks, change data to a desired format, and route Sensu events."
product: "Sensu Go"
version: "5.21"
weight: 120
layout: "single"
menu:
  sensu-go-5.21:
    identifier: plugins
---

The goal of the Sensu Plugins project is to provide a set of community-driven, high-quality plugins, handlers and other code to maximize the effective use of Sensu in various types of auto-scaling and traditional environments. Much of the code is written in Ruby and uses the [`sensu-plugin` framework][1]; some also depend on additional gems or packages(e.g. `mysql2` or `libopenssl-devel`). Some are shell scripts! All languages are welcome but the preference is for pure Ruby when possible to ensure the broadest range of compatibility.

Plugins are maintained by volunteers and do **not** have an SLA or similar.
Visit the [contributing guide][2] to learn more about contributing to the Sensu plugins project.

## Plugins vs Assets

Sensu plugins provide executable scripts or other programs that can be used as [Sensu checks][1] (i.e. to monitor server resources, services, and application health, or collect & analyze metrics), [Sensu handlers][2] (i.e. to send notifications or perform other actions based on [Sensu events][3]), or [Sensu mutators][3] (i.e. to modify [event data][4] prior to handling).

Assets are shareable, reusable packages that make it easier to deploy Sensu plugins.
You can use assets to provide the plugins, libraries, and runtimes you need to automate your monitoring workflows.

You don't need an asset to use a plugin, but you do need a plugin to create an asset.

## Nagios plugins and the Nagios Exchange

The [Sensu Plugin specification][16] is 100% compatible with the [Nagios plugin specification][17]; as a result, **Nagios plugins may be used with Sensu without any modification**. Sensu allows you to bring new life to the 50+ plugins in the official [Nagios Plugins project][18] (which [began life in 1999][19], making it a very mature source for monitoring plugins), and
over 4000 plugins available in the [Nagios Exchange][20].

## Plugin execution

All plugins are executed by the Sensu agent or backend as the `sensu` user.
Plugins must be executable files that are discoverable on the Sensu system (i.e. installed in a
system `$PATH` directory), or they must be referenced with an absolute path
(e.g. `/opt/path/to/my/plugin`).

{{% notice note %}}
**NOTE**: By default, the Sensu installer packages will modify the system `$PATH`
for the Sensu processes to include `/etc/sensu/plugins`. As a result, executable
scripts (e.g. plugins) located in `/etc/sensu/plugins` will be valid commands.
This allows command attributes to use "relative paths" for Sensu plugin
commands;<br><br>e.g.: `"command": "check-http.rb -u https://sensuapp.org"`.
{{% /notice %}}

## Asset execution

The directory path of each asset defined in `runtime_assets` is appended to the `PATH` before the handler, filter, mutator, or check `command` is executed.
Subsequent handler, filter, mutator, or check executions look for the asset in the local cache and ensure that the contents match the configured checksum.

See the [example asset with a check][31] for a use case with a Sensu resource (a check) and an asset.

### Asset builds

An asset build is the combination of an artifact URL, SHA512 checksum, and optional [Sensu query expression][1] filters.
Each asset definition may describe one or more builds.

{{% notice note %}}
**NOTE**: Assets that provide `url` and `sha512` attributes at the top level of the `spec` scope are [single-build assets](#asset-definition-single-build-deprecated), and this form of asset defintion is deprecated.
We recommend using [multiple-build asset defintions](#asset-definition-multiple-builds), which specify one or more `builds` under the `spec` scope.
{{% /notice %}}

### Asset build evaluation

For each build provided in an asset, Sensu will evaluate any defined filters to determine whether any build matches the agent or backend service's environment.
If all filters specified on a build evaluate to `true`, that build is considered a match.
For assets with multiple builds, only the first build which matches will be downloaded and installed.

### Asset build download

Sensu downloads the asset build on the host system where the asset contents are needed to execute the requested command.
For example, if a check definition references an asset, the Sensu agent that executes the check will download the asset the first time it executes the check.
The asset build the agent downloads will depend on the filter rules associated with each build defined for the asset.

Sensu backends follow a similar process when pipeline elements (filters, mutators, and handlers) request runtime asset installation as part of operation.

{{% notice note %}}
**NOTE**: Asset builds are not downloaded until they are needed for command execution.
{{% /notice %}}

When Sensu finds a matching build, it downloads the build artifact from the specified URL.
If the asset definition includes headers, they are passed along as part of the HTTP request.
If the downloaded artifact's SHA512 checksum matches the checksum provided by the build, it is unpacked into the Sensu service's local cache directory.

Set the backend or agent's local cache path with the `--cache-dir` flag.
Disable assets for an agent with the agent `--disable-assets` [configuration flag][30].

{{% notice note %}}
**NOTE**: Asset builds are unpacked into the cache directory that is configured with the `--cache-dir` flag.
{{% /notice %}}

Use the `--assets-rate-limit` and `--assets-burst-limit` flags for the [agent][40] and [backend][41] to configure a global rate limit for fetching assets.


[1]: https://github.com/sensu-plugins/sensu-plugin
[2]: https://github.com/sensu-plugins/community/blob/master/CONTRIBUTING.md
[3]: install-plugins/
