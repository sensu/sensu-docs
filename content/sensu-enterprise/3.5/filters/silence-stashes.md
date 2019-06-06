---
title: "silence_stashes"
description: "The silence_stashes Enterprise filter is used to filter events when specific Sensu API stashes exist."
product: "Sensu Enterprise"
version: "3.5"
weight: 1
menu:
  sensu-enterprise-3.5:
    parent: filters
---
**ENTERPRISE: Built-in filters are available for [Sensu Enterprise][0]
users only.**

## Reference documentation

- [Overview](#overview)
- [Configuration](#configuration)
  - [Example(s)](#examples)
  - [Filter specification](#filter-specification)

--------------------------------------------------------------------------------

## Overview

The `silence_stashes` Enterprise filter is used to filter events when specific
[Sensu API stashes][1] exist. The Sensu Enterprise Dashboard and many community
tools make use of "silence stashes" to indicate Sensu clients and/or their
checks that are "silenced" or under maintenance. Events will be filtered if a
silence stash exists for the client and/or its check specified in the event
data.

## Configuration

### Example(s) {#examples}

The following is an example of how to apply the `silence_stashes` enterprise
filter to a standard Sensu `pipe` handler.

{{< highlight json >}}
{
  "handlers": {
    "custom_mailer": {
      "type": "pipe",
      "command": "custom_mailer.rb",
      "filter": "silence_stashes"
    }
  }
}
{{< /highlight >}}

### Filter specification

This built-in filter requires no configuration.




[?]:  #
[0]:  /sensu-enterprise
[1]:  /sensu-core/1.2/reference/stashes
