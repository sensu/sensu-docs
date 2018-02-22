---
title: "Intro to Checks"
weight: 1
version: "2.0"
product: "Sensu Core"
platformContent: True
menu: 
  sensu-core-2.0:
    parent: overview
---

## Checks

Sensu checks are commands executed by the Sensu agent which monitor a condition
(e.g. is Nginx running?) or collect measurements (e.g. how much disk space do I
have left?). Although the Sensu agent will attempt to execute any command
defined for a check, successful processing of check results requires adherence
to a simple specification.

### Specification

- Result data is output to STDOUT or STDERR
    - For standard checks this output is typically a human-readable message
    - For metrics checks this output contains the measurements gathered by the check
- Exit status code indicates state
    - 0 indicates “OK”
    - 1 indicates “WARNING”
    - 2 indicates “CRITICAL”
    - exit status codes other than 0, 1, or 2 indicate an “UNKNOWN” or custom status
### Viewing

To view all the checks that are currently configured for the cluster, enter:

{{< highlight shell >}}
sensuctl check list
{{< /highlight >}}

If you want more details on a check, the `info` subcommand can help you out.

{{< highlight shell >}}
> sensuctl check info my-cool-check
=== marketing-site
Name:           check-http
Interval:       10
Cron:           0 30 \* \* \* \*
Command:        check-http.rb -u https://dean-learner.book
Subscriptions:  web
Handlers:       slack
Runtime Assets: ruby42
Publish?:       true
Stdin?:         true
Source:
Organization:   default
Environment:    default
{{< /highlight >}}

### Management

Checks can be configured both interactively:

![alt text](/static/images/sensuctl-check-create.gif "create check")
<img src="/static/images/sensuctl-check-create.gif" alt="create check" width="500px" />

...or by using CLI flags.

{{< highlight shell >}}
sensuctl check create check-disk -c "./check-disk.sh" --handlers slack -i 5 --subscriptions unix
ensuctl check create check-nginx -c "./nginx-status.sh" --handlers pagerduty,slack -i 15 --subscriptions unix,www
{{< /highlight >}}

To delete an existing check, simply pass the name of the check to the `delete`
command.

{{< highlight shell >}}
sensuctl check delete check-disk
{{< /highlight >}}

**SCHEDULING:** A check can be scheduled according to an interval integer (in seconds) or a cron string (see [GoDoc Cron](https://godoc.org/github.com/robfig/cron)). In the presence of both, the cron schedule will take precedence over the interval schedule. In addition to traditional [Cron](https://en.wikipedia.org/wiki/Cron) strings, Go also accepts many forms of human readable strings for the cron schedule, ex. `@midnight`, `@daily`, and `@every 1h30m`. Please feel free to use these human readable strings, with one caveat. If the schedule can be described using either the interval or cron field, ex. `interval: 10` or `cron: @every 10s`, we suggest you default to the interval. This is because Sensu splays interval schedules to ensure a distributed load of checks.

**STDIN:** set this to true when creating a check interactively, or by passing
--stdin to tell the agent to pass the event to your check via STDIN at runtime. 

**NOTE:** Due to Etcd performance limitations (see [FAQ](https://github.com/sensu/sensu-alpha-documentation/blob/master/97-FAQ.md "FAQ")) and general security features, the maximum http request body size is 512K bytes.

## Assets

Assets are a way to provide your checks with runtime dependencies they require
to execute. These can be anything from scripts (e.g. check-haproxy.sh) to
full runtimes (ruby, python, etc.) Most helpful in environments without a
configuration management system, where your systems, images, containers, might
not have everything required to run a execute a check.

At runtime the agent sequentially fetches assets and stores them in its local
cache. On subsequent check executions it checks for the presence of the asset in
its cache and ensures that the contents matches its checksum.

### Asset Structure

The agent expects that an asset is a TAR archive that may optionally be GZip'd.
Any scripts or executables should be within a `bin/` folder within in the
archive.

Further when the check is executed, the following are injected into the
execution context.

- `{PATH_TO_ASSET}/bin` is injected into the `PATH` environment variable.
- `{PATH_TO_ASSET}/lib` is injected into the `LD_LIBRARY_PATH` environment variable.
- `{PATH_TO_ASSET}/include` is injected into the `CPATH` environment variable.

### Storage

At this time the Sensu's backend does not provide any storage capabilities for
assets. The assets are expected to be retrieved over HTTP or HTTPS.

### Basics

To view all assets currently available in your configured Sensu instance. Run:

{{< highlight shell >}}
sensuctl asset list
{{< /highlight >}}

If you want more in depth details on an asset, you can use the `info`
subcommand.

{{< highlight shell >}}
sensu asset info my-great-check-sh
{{< /highlight >}}

Assets can be created both interactively..

<img src="assets/sensuctl-asset-create.gif" alt="create asset" width="500px" />

or by using CLI flags.

{{< highlight shell >}}
sensuctl asset create curl --url "https://acme.s3.amazonaws.com/curl-7.52.1.tar" --sha512 d940d3975051f7cb70c28bbf4b45cf4805b5113d44c96ed120e4a8a6206e55ed3fcdabb37158e3989d24267d9e185896e872ab7b10571edc90b62c0a20512346
{{< /highlight >}}

### Filters

Filters are used to specify conditions in-which your asset should be installed
on an agent. For example you have a check that's assets have to differ for each
platform.

eg.

- You create an asset name `curl/linux`; the filter associated with this
  asset are System.OS=='linux'
- Next, you create an asset for freebsd named `curl/freebsd`; the filter would
  look like `System.OS=='freebsd'`
- Finally to associate the assets with a check, you can refer the group by its
  prefix. Eg. a check named `check-website` with assets `['curl'].`

### Sensu Query Language

**TODO**

### Managing Asset Filters

Creating a new asset with filters is as simple as:

{{< highlight shell >}}
sensuctl asset create curl/linux64 --url "http://acme.s3.amazonaws.com/curl-7-linux.tar" --sha512 XXX --filter "System.OS=='linux'" --filter "System.Arch == 'amd64'"
{{< /highlight >}}

**NOTE:** At the moment there is no way to edit the filters associated with an
existing asset. However, you can re-create the asset with the same name and the
existing entity will be overwritten.

To create a new check associated with an asset, run:

{{< highlight shell >}}
sensuctl create check check-my-website --command "curl http://something" --runtime-asset ruby24,python31
{{< /highlight >}}

Example using the assets prefix:

{{< highlight shell >}}
sensuctl asset create curl/linux --url "http://acme.s3.amazonaws.com/curl-7-linux.tar" --sha512 XXX --filter "System.OS=='linux'" --filter "System.Arch == 'amd64'"
sensuctl asset create curl/macos --url "http://acme.s3.amazonaws.com/curl-7-macos.tar" --sha512 XXX --filter "System.OS=='macos'" --filter "System.Arch == 'amd64'"
sensuctl create check check-my-website --command "curl http://something" --runtime-asset curl # by using prefix captures both assets
{{< /highlight >}}

