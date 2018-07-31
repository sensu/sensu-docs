---
title: "Licensing"
description: "Managing Sensu EE license."
weight: 10
version: "2.0"
product: "Sensu Core"
platformContent: false
menu:
  sensu-core-2.0:
    parent: enterprise
---

## How Sensu Enterprise licensing works

A Sensu Enterprise license allows customers to enable additional features in
Sensu Enterprise Edition (EE) compared to Sensu Core Edition (CE). Licenses are
cryptographically signed documents that can easily be managed with
[sensuctl][1].

## Installing and renewing your license

The license file will be provided as a JSON file, which should be saved on your
local computer. We will then use `sensuctl` to upload it to the Sensu Backend:

```
sensuctl license install -f license.json
```

The license can also be passed via the standard output (stdin):

```
cat <<EOF | sensuctl license install
{"license":"[...]", "signature":"[...]"}
EOF
```

## Viewing your license details

The details of the installed Sensu license can easily be displayed using
`sensuctl`, which will provide you with information like your current plan, the
enabled features and your license expiry date.

```
sensuctl license info
```
[1]: ../../reference/sensuctl

## Expiration of your license

Sensu Backend will start issuing regular warnings via the log messages 30 days
before the expiration of your license.

If your license expires and you do not renew it, the Sensu EE
features will no longer be available but all Sensu CE features will continue to
work seamlessly.