---
title: "How to enrich check results using check hooks"
linkTitle: "Enrich check result data with check hooks"
weight: 40
version: "5.0"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-5.0:
    parent: guides
---

## What are check hooks?

Check hooks are **commands** run by the Sensu agent in response to the result of
**check** command execution. The Sensu agent will execute the appropriate
configured hook, depending on the exit status code (e.g., `1`).

## Why use check hooks?

Check hooks allow Sensu users to automate data collection  routinely performed by
operators investigating monitoring alerts, freeing precious operator time! While 
check hooks can be used for rudimentary auto-remediation tasks, they are intended
for enrichment of monitoring event data.

## Using check hooks to gather context

The purpose of this guide is to help you put in place a check hook which captures
the process tree if our check `nginx_process` returns a status of `2` (critical,
not running).

### Creating the hook

The first step is to create a new hook that will run a specific command to
capture the process tree. We will set an execution **timeout** of 10 seconds
for this command.

{{< highlight shell >}}
sensuctl hook create process_tree  \
--command 'ps aux' \
--timeout 10
{{< /highlight >}}

### Assigning the hook to a check

Now that the `process_tree` hook has been created, it can be assigned to a
check. Here we will apply our hook to an already existing check that verifies
this nginx process, named `nginx_process`, whenever the check command returns
a critical status.

{{< highlight shell >}}
sensuctl check set-hooks nginx_process  \
--type critical \
--hooks process_tree
{{< /highlight >}}

### Validating the check hook

You can verify the proper behavior of the check hook against a specific event by
using `sensuctl`. It might take a few moments, once the check hook is assigned,
for the check to be scheduled on the entity and the result sent back to Sensu
backend. The check hook command result will be available in the `hooks` array,
within the `check` hash.

{{< highlight shell >}}
$ sensuctl event info i-424242 nginx_process --format json
{
  [...]
  "check": {
    [...]
    "hooks": [
      {
        "config": {
          "name": "process_tree",
          "command": "ps aux",
          "timeout": 10,
          "namespace": "default"
        },
        "duration": 0.008713605,
        "executed": 1521724622,
        "output": "",
        "status": 0
      }
    ],
    [...]
  }
}
{{< /highlight >}}

Having confirmed that the hook is attached to our check, we can stop
nginx and observe the check hook in action on the next check
execution. Here we use sensuctl to query event info and send the
response to `jq` so we can isolate the check hook output:

{{< highlight shell >}}
$ sensuctl event info i-424242 nginx_process --format json | jq -r '.check.hooks[0].output' 
USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
root         1  0.0  0.3  46164  6704 ?        Ss   Nov17   0:11 /usr/lib/systemd/systemd --switched-root --system --deserialize 20
root         2  0.0  0.0      0     0 ?        S    Nov17   0:00 [kthreadd]
root         3  0.0  0.0      0     0 ?        S    Nov17   0:01 [ksoftirqd/0]
root         7  0.0  0.0      0     0 ?        S    Nov17   0:01 [migration/0]
root         8  0.0  0.0      0     0 ?        S    Nov17   0:00 [rcu_bh]
root         9  0.0  0.0      0     0 ?        S    Nov17   0:34 [rcu_sched]
{{< /highlight >}}

Note that the above output, although truncated in the interest of
brevity, reflects the output of the `ps aux` command specified in the
check hook we created. Now when we are alerted that nginx is not
running, we can review the check hook output to confirm this was the
case, without ever firing up an SSH session to investigate!

## Next steps

You now know how to run data collection tasks using check hooks. From this point, 
here are some recommended resources:

* Read the [hooks reference][1] for in-depth documentation on hooks.

[1]: ../../reference/hooks/
