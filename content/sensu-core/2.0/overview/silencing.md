---
title: "Intro to Silencing"
description: "The guide to setting up silencing entries."
weight: 
menu: 
  sensu-core-2.0:
    parent: overview 
version: 
product: "Sensu Core"
---

# Silencing

Silenced entries are used to suppress event handler execution, effectively muting
notifications for an event. Check events can be silenced by subscription, check
name, a combination of the two, or by entity via check or subscription. 

## Viewing

To view all current silenced entries, enter:

{{< highlight shell >}}
sensuctl silenced list
{{< /highlight >}}

### Managing Silenced Entries

Create a silenced entry interactively:

> sensuctl silenced create
{{< highlight shell >}}
? Organization: default
? Environment: default
? Subscription: webserver
? Check: check-status
? Begin time: 1515526463
? Expiry in Seconds: 3600
? Expire on Resolve: No
? Reason: "rebooting the world"
{{< /highlight >}}

Or with CLI flags:
{{< highlight shell >}}
sensuctl silenced create -e 3600 -c "check-status" -s "webserver" -r "rebooting the world"
{{< /highlight >}}

You must provide either a check name or subscription name in order to create a 
silenced entry. If either value is not provided, it is substituted with a wildcard. 
To update, delete, or get more info on a silenced entry, you will need to provide 
the ID, which is the combination of the subscription name and the check name in 
the form `subscription:checkname`.

{{< highlight shell >}}
$ sensuctl silenced update webserver:check-status
? Expiry in Seconds: 1500
? Expire on Resolve: No
? Reason: rebooting the world
{{< /highlight >}}

A silenced entry expiration time will default to -1, meaning the entry will persist 
in the store unless manually removed. Setting an expiry time will create a TTL
on the entry so that it is deleted when the TTL runs out. To remove an entry
manually, you must provide the silenced entry ID.

To schedule a silenced entry for a later time, provide a Begin time with a unix
timestamp. A `begin` provided with an `expiry` starts the TTL at the begin time,
and removes the silenced entry after the TTL expires.

> sensuctl silenced delete webserver:check-status
{{< highlight shell >}}
Are you sure you would like to delete resource 'webserver:check-status'?

Enter 'WEBSERVER:CHECK-STATUS' to confirm.
> WEBSERVER:CHECK-STATUS
OK
{{< /highlight >}}

