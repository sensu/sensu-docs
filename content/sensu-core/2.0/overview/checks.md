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
