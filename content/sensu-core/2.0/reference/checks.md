---
title: "Checks"
description: "The checks reference guide."
weight: 1
version: "2.0"
product: "Sensu Core"
platformContent: false
menu:
  sensu-core-2.0:
    parent: reference
---

## How do checks work?

### Check commands

Each Sensu check definition defines a **command** and the **interval** at which
it should be executed. Check commands are literally executable commands which
will be executed on the Sensu agent.

A command may include command line arguments for controlling the behavior of the
command executable. Most Sensu check plugins provide support for command line
arguments for reusability.

#### How and where are check commands executed?

All check commands are executed by Sensu agents as the `sensu` user. Commands
must be executable files that are discoverable on the Sensu agent system (i.e.
installed in a system `$PATH` directory).

### Check scheduling

Checks are exclusively scheduled by the Sensu backend, which schedules and
publishes check execution requests to entities via a [Publish/Subscribe
model][2] (i.e., **subscription checks**).

Subscription checks have a defined set of subscribers, a list of transport
topics that check requests will be published to. Sensu entities become
subscribers to these topics (i.e., subscriptions) via their individual
subscriptions attribute. In practice, subscriptions will typically correspond to
a specific role and/or responsibility (e.g., a webserver, database, etc).

Subscriptions are a powerful primitives in the monitoring context because they
allow you to effectively monitor for specific behaviors or characteristics
corresponding to the function being provided by a particular system. For
example, disk capacity thresholds might be more important (or at least
different) on a database server as opposed to a webserver; conversely, CPU
and/or memory usage thresholds might be more important on a caching system than
on a file server. Subscriptions also allow you to configure check requests for
an entire group or subgroup of systems rather than require a traditional 1:1
mapping.

### Check result specification

Although the Sensu agent will attempt to execute any
command defined for a check, successful processing of check results requires
adherence to a simple specification.

- Result data is output to [STDOUT or STDERR][3]
    - For standard checks this output is typically a human-readable message
    - For metrics checks this output contains the measurements gathered by the
      check
- Exit status code indicates state
    - `0` indicates “OK”
    - `1` indicates “WARNING”
    - `2` indicates “CRITICAL”
    - exit status codes other than `0`, `1`, or `2` indicate an “UNKNOWN” or
      custom status

{{< note title="PRO TIP" >}}
Those familiar with the **Nagios** monitoring
system may recognize this specification, as it is the same one used by Nagios
plugins. As a result, Nagios plugins can be used with Sensu without any
modification.
{{< /note >}}

At every execution of a check command – regardless of success or failure – the
Sensu client publishes the check’s result for eventual handling by the **event
processor** (i.e. the Sensu backend.)

### Check token substitution

Sensu check definitions may include attributes that you may wish to override on
an entity-by-entity basis. For example, [check commands][4] – which may include
command line arguments for controlling the behavior of the check command – may
benefit from entity-specific thresholds, etc. Sensu check tokens are check
definition placeholders that will be replaced by the Sensu agent with the
corresponding entity definition attribute values (including custom attributes).

Learn how to use check tokens with the [Sensu tokens reference
documentation][5].

{{< note title="Note" >}}
Check tokens are processed before check execution, therefore token substitution
will not apply to check data delivered via the local agent socket input.
{{< /note >}}

### Check hooks

Check hooks are commands run by the Sensu agent in response to the result of
check command execution. The Sensu agent will execute the appropriate configured
hook command, depending on the check execution status (e.g. 1).

Learn how to use check hooks with the [Sensu hooks reference
documentation][6].

### Proxy requests

Sensu supports running checks where the results are considered to be for an
entity that isn’t actually the one executing the check- regardless of whether
that entity is a Sensu agent's entity or simply a **proxy entity**. There are a
number of reasons for this use case, but fundamentally, Sensu handles it the
same.

Checks are scheduled normally, but by specifying a [Proxy Request][10] in your
check, entities that match certain definitions (their `entity_attributes`) cause
the check to run for each one. The attributes supplied must normally match
exactly as stated- no variables or directives have any special meaning, but you
can still use [Sensu query expressions][11] to perform more complicated
filtering on the available value, such as finding entities with particular
subscriptions.

## New and improved checks

Here is some useful information for Sensu 1 users around modifications made to
checks in Sensu 2.

### Standalone checks

Standalone checks, which are checks scheduled and executed by the monitoring
agent in [Sensu 1][7], are effectively replaced by the [Role-base access control
(RBAC)][8], [agent's entity subscription][9] and [Sensu assets][9] features.

### Reusable check hooks

[Sensu check hooks][6] are now a distinct resource and are create and managed
independently of the check configuration.

### Round-robin checks

Round-robin checks, which allow checks to be executed on a single entity within
a subscription in a round-robin fashion, were configured via the client
subscriptions in [Sensu 1][12]. Prepending `roundrobin:` in front of
subscriptions is no longer required in Sensu 2 since round-robin can now be
enabled directly with the [roundrobin][13] attribute in the check configuration.

## Check Specification

### Check naming

Each check definition must have a unique name within its organization and
+environment.

* A unique string used to name/identify the check
* Cannot contain special characters or spaces
* Validated with Go regex [`\A[\w\.\-]+\z`](https://regex101.com/r/zo9mQU/2)

### Check attributes

command      | 
-------------|------
description  | The check command to be executed.
required     | true
type         | String
example      | {{< highlight shell >}}"command": "/etc/sensu/plugins/check-chef-client.rb"{{< /highlight >}}

handlers     | 
-------------|------
description  | An array of Sensu event handlers (names) to use for events created by the check. Each array item must be a string.
required     | true
type         | Array
example      | {{< highlight shell >}}"handlers": ["pagerduty", "email"]{{< /highlight >}}

interval     | 
-------------|------
description  | The frequency in seconds the check is executed.
required     | true (unless `publish` is false or `cron` is configured)
type         | Array
example      | {{< highlight shell >}}"handlers": ["pagerduty", "email"]{{< /highlight >}}

## Check examples









**SCHEDULING:** A check can be scheduled according to an interval integer (in seconds) or a cron string (see [GoDoc Cron](https://godoc.org/github.com/robfig/cron)). In the presence of both, the cron schedule will take precedence over the interval schedule. In addition to traditional [Cron](https://en.wikipedia.org/wiki/Cron) strings, Go also accepts many forms of human readable strings for the cron schedule, ex. `@midnight`, `@daily`, and `@every 1h30m`. Please feel free to use these human readable strings, with one caveat. If the schedule can be described using either the interval or cron field, ex. `interval: 10` or `cron: @every 10s`, we suggest you default to the interval. This is because Sensu splays interval schedules to ensure a distributed load of checks.

**STDIN:** set this to true when creating a check interactively, or by passing
--stdin to tell the agent to pass the event to your check via STDIN at runtime. 


[1]: #subscription-checks
[2]: https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern
[3]: https://en.wikipedia.org/wiki/Standard_streams
[4]: #check-commands
[5]: #
[6]: ../hooks/
[7]: ../../../1.2/reference/checks/#standalone-checks
[8]: #
[9]: #
[10]: #
[11]: #
[12]: ../../../1.2/reference/clients/#round-robin-client-subscriptions
[13]: #