---
title: "Assets"
description: "The assets reference guide."
weight: 1
version: "2.0"
product: "Sensu Core"
platformContent: true
menu:
  sensu-core-2.0:
    parent: reference
---

# Assets

## What are assets?

Sensu **assets** are resources that checks can specify as dependencies. When an
Agent runs a check, it will ensure that all of the check's required assets
are available to the Agent. If they aren't, the Agent will install them by
consulting each of the assets' URLs.

## Asset management

Assets are created through the `sensuctl` CLI.

### Creating an asset

In this example, we'll create an asset from a README.md file. To create an
asset, we'll need a name, a URL to the asset location, and a SHA-512 checksum.
{{< highlight shell >}}
sensuctl asset create readme \
  -u http://example.com/README.md \
  --sha512 "$(sha512sum README.md | cut -f1 -d ' ')"
OK
{{< /highlight >}}

### Getting information about an asset

Getting information about an asset is easy - you just need the name.

{{< highlight shell >}}
sensuctl asset info readme
=== readme
Name:             readme
Organization:     default
URL:              http://example.com/README.md
SHA-512 Checksum: 84998adb7e1ced02b092347eb050018c3abe8c0055797ac149a1c3cf9efe6cfc7e9666ffba748729ed0273265aeacfe61b295e1ebfd739e33a124883f7703f0b
Filters:          
Metadata:         
{{< /highlight >}}

### Listing all available assets

{{< highlight shell >}}
sensuctl asset list
   Name                 URL                Hash    
 ───────── ───────────────────────────── ───────── 
  foo/bar   //example.com/.../            asldkjf  
  foobar    //example.com/.../            0ea6f27  
  readme    //example.com/.../README.md   84998ad  
{{< /highlight >}}

### Updating an existing asset

{{< highlight shell >}}
sensuctl asset update readme
{{< /highlight >}}

This will result in an interactive prompt, which will ask you which of the
asset's field that you wish to change.

## Using assets in checks

Assets can be associated with checks when they are created, or afterwards.

### Adding an asset to a check on creation

{{< highlight shell >}}
sensuctl check create foobar \
  --command /bin/false \
  --subscriptions foobar \
  --interval 10 \
  --runtime-assets readme,foobar
{{< /highlight >}}

### Adding an asset to an existing check's dependencies

{{< highlight shell >}}
sensuctl check set-runtime-assets check1 readme,foobar
{{< /highlight >}}

This command will set a check's assets to `readme` and `foobar`.
