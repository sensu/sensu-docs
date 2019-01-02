---
title: "How to install executables using assets"
linkTitle: "Installing Plugins with Assets"
weight: 100
version: "5.1"
product: "Sensu Go"
platformContent: False
menu: 
  sensu-go-5.1:
    parent: guides
---

- [How to create a check that depends on an asset](#how-to-create-a-check-that-depends-on-an-asset)
- [How to create a handler that depends on an asset](#how-to-create-a-handler-that-depends-on-an-asset)
- [How to create a mutator that depends on an asset](#how-to-create-a-mutator-that-depends-on-an-asset)
- [Next steps](#next-steps)

## What are assets?
Assets are executables that checks, handlers, and mutators can specify as dependencies.
When an agent runs a check or when a backend runs a handler or mutator, it ensures that all of the required assets
are available during runtime.
If they aren't, Sensu installs them by consulting each of the assets' URLs.

## Why use assets?
When configuration management is unavailable, assets can help manage runtime 
dependencies such as scripts (ex: check-haproxy.sh) and tar files (ex: sensu-ruby-runtime.tar.gz)
entirely within Sensu. 

## How to create a check that depends on an asset 

### Creating an asset
In this example, we'll create an asset from a tar archive, and show you how to
create a new check with that asset as a dependency, as well as apply it to an
existing check.

Sensu expects that an asset is a tar archive that may optionally be gzipped.
Any scripts or executables should be within a bin/ folder within the archive.
For more information about the expected format of assets, see the [assets reference][1].

To create an asset, we'll need a name, a URL to the asset location,
and a `SHA-512 checksum`.

{{< highlight shell >}}
sensuctl asset create check_website.tar.gz \
-u http://example.com/check_website.tar.gz \
--sha512 "$(sha512sum check_website.tar.gz | cut -f1 -d ' ')"
{{< /highlight >}}

If you're using macOS, you'll need to use `$(shasum -a 512 check_website.tar.gz | cut -f1 -d ' ')` to generate a checksum.

If you're using Windows, you'll need to use the `CertFile` utility to generate the checksum:
{{< highlight shell >}}
CertUtil -hashfile check_website.tar.gz SHA512
{{< /highlight >}}

and extract the checksum from the output manually, before adding it to the sensuctl command.


### Adding an asset to a check on creation

{{< highlight shell >}}
sensuctl check create check_website \
--command "check_website -a www.example.com -C 3000 -w 1500" \
--subscriptions web \
--interval 10 \
--runtime-assets check_website.tar.gz 
{{< /highlight >}}

### Adding an asset to an existing check's dependencies

{{< highlight shell >}}
sensuctl check set-runtime-assets check_website.tar.gz 
{{< /highlight >}}

This command will set a check's assets to `check_website.tar.gz`.

### Validating the check asset

Once the check is setup, it should only take a few moments for it to be
scheduled and start emitting events. When the check has been scheduled, you should 
see a log entry for that check's execution.
{{< highlight shell >}}
{"component":"agent","level":"info","msg":"scheduling check execution: check_website","time":"2018-04-06T20:46:32Z"}
{{< /highlight >}}

You can verify that the asset is working by using `sensuctl` to list the most recent events:
{{< highlight shell >}}
sensuctl event list
  Entity           Check                     Output               Status   Silenced             Timestamp
───────────── ────────────────── ──────────────────────────────── ──────── ────────── ───────────────────────────────
sensu-agent    check_website      CheckHttpResponseTime OK: 345      0       false    2018-04-06 20:38:34 +0000 UTC
{{< /highlight >}}

## How to create a handler that depends on an asset 

### Adding an asset to a handler on creation

[Create an asset][2] (ex.`sensu-influxdb-handler`), and create a handler (ex. `influx-db`).

{{< highlight shell >}}
sensuctl handler create influx-db \
--command "sensu-influxdb-handler --addr 'http://123.4.5.6:8086' --username 'foo' --password 'bar' --db-name 'myDB'" \
--runtime-assets sensu-influxdb-handler
{{< /highlight >}}

### Validating the handler asset

Once the handler is setup, it must be attached to a check to handle the event output (ex. `collect-metrics`).

{{< highlight shell >}}
$ sensuctl check set-handlers collect-metrics influx-db
{{< /highlight >}}

You can verify that the handler has fetched/installed the asset, and executed the dependency by checking the
backend logs.

{{< highlight json >}}
{"assets":["sensu-influxdb-handler"],"component":"pipelined","namespace":"default","handler":"influx-db","level":"debug","msg":"fetching assets for handler","time":"2018-10-16T13:17:33-07:00"}
{{< /highlight >}}
{{< highlight json >}}
{"component":"pipelined","namespace":"default","handler":"influx-db","level":"info","msg":"event pipe handler executed","output":"metric sent to influx-db","status":0,"time":"2018-10-16T13:17:33-07:00"}
{{< /highlight >}}

## How to create a mutator that depends on an asset 

### Adding an asset to a mutator on creation

[Create an asset][2] (ex. `transformer`), and create a mutator (ex. `transform-metrics`).

{{< highlight shell >}}
sensuctl mutator create transform-metrics \
--command "transform --type metrics" \
--runtime-assets transformer
{{< /highlight >}}

### Validating the mutator asset

Once the mutator is setup, it must be attached to a handler to mutate the event output (ex. `influx-db`).

{{< highlight shell >}}
sensuctl handler update influx-db
{{< /highlight >}}

You can verify that the mutator has fetched/installed the asset, and executed the dependency by checking the
backend logs.

{{< highlight json >}}
{"assets":["transformer"],"component":"pipelined","namespace":"default","mutator":"transform-metrics","level":"debug","msg":"fetching assets for mutator","time":"2018-10-16T13:17:33-07:00"}
{{< /highlight >}}
{{< highlight json >}}
{"component":"pipelined","namespace":"default","mutator":"transform-metrics","level":"info","msg":"event pipe mutator executed","output":"metric transformed","status":0,"time":"2018-10-16T13:17:33-07:00"}
{{< /highlight >}}

## Next steps

You now know how to create an asset and add it to a check, handler, and mutator as a dependency.
For further reading, check out the [assets reference][1].

[1]: ../../reference/assets/
[2]: #creating-an-asset