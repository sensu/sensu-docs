---
title: "How to install Check Executables using Assets"
linkTitle: "Using Assets in Checks"
weight: 100
version: "2.0"
product: "Sensu Core"
platformContent: False
menu: 
  sensu-core-2.0:
    parent: guides
---

## What are assets?
Sensu assets are resources that checks can specify as dependencies. When an
agent runs a check, it will ensure that all of the check's required assets
are available to the agent during check runtime. If they aren't, the agent will
install them by consulting each of the assets' URLs.

## Why use assets?
When configuration management is unavailable, assets can help manage runtime 
dependencies such as scripts (e.g. check-haproxy.sh) and tar files (e.g. sensu-ruby-runtime.tar.gz)
entirely within sensu. 

## How to create a check that depends on an asset 

### Creating an asset
In this example, we'll create an asset from a `tar` archive, and show you how to
create a new check with that asset as a dependency, as well as apply it to an
existing check. To create an asset, we'll need a name, a URL to the asset location, 
and a `SHA-512 checksum`.
{{< highlight shell >}}
sensuctl asset create check_website.tar.gz \
  -u http://example.com/check_website.tar.gz \
  --sha512 "$(sha512sum check_website.tar.gz | cut -f1 -d ' ')"
OK
{{< /highlight >}}

### Adding an asset to a check on creation

{{< highlight shell >}}
sensuctl check create foobar \
  --command /bin/false \
  --subscriptions foobar \
  --interval 10 \
  --runtime-assets check_website.tar.gz 
{{< /highlight >}}

### Adding an asset to an existing check's dependencies

{{< highlight shell >}}
sensuctl check set-runtime-assets check_website.tar.gz 
{{< /highlight >}}

This command will set a check's assets to `check_website.tar.gz`.

## Next steps

You now know how to create an asset and add it to a check as a dependency. For
further reading, check out the [assets reference][1].

[1]: ../../reference/assets/
