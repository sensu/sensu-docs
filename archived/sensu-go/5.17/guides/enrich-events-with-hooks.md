---
title: "Augment event data with check hooks"
linkTitle: "Augment Event Data"
description: "Check hooks allow Sensu users to automate data collection that operators would routinely perform manually to investigate monitoring alerts, which frees up precious operator time. This guide helps you create a check hook that captures the process tree in case a service check returns a critical status."
weight: 40
version: "5.17"
product: "Sensu Go"
platformContent: false
lastTested: 2018-12-04
menu:
  sensu-go-5.17:
    parent: guides
---

- [Use check hooks to gather context](#use-check-hooks-to-gather-context)
- [Next steps](#next-steps)

Check hooks are **commands** the Sensu agent runs in response to the result of **check** command execution. 
The Sensu agent executes the appropriate configured hook command based on the exit status code of the check command (e.g. `1`).

Check hooks allow Sensu users to automate data collection that operators would routinely perform to investigate monitoring alerts, which frees up precious operator time.
Although you can use check hooks for rudimentary auto-remediation tasks, they are intended to enrich monitoring event data.
This guide helps you create a check hook that captures the process tree in case a service check returns a critical status.

## Use check hooks to gather context

Follow these steps to create a check hook that captures the process tree in the event that an `nginx_process` check returns a status of `2` (critical, not running).

### 1. Create a hook

Create a new hook that runs a specific command to capture the process tree.
Set an execution **timeout** of 10 seconds for this command:

{{< highlight shell >}}
sensuctl hook create process_tree  \
--command 'ps aux' \
--timeout 10
{{< /highlight >}}

### 2. Assign the hook to a check

Now that you've created the `process_tree` hook, you can assign it to a check.
This example assumes you've already set up the `nginx_process` check.
Setting the `type` to `critical` ensures that whenever the check command returns a critical status, Sensu executes the `process_tree` hook and adds the output to the resulting event data:

{{< highlight shell >}}
sensuctl check set-hooks nginx_process  \
--type critical \
--hooks process_tree
{{< /highlight >}}

### 3. Validate the check hook

Verify that the check hook is behaving properly against a specific event with `sensuctl`.
It might take a few moments after you assign the check hook for the check to be scheduled on the entity and the result sent back to the Sensu backend.
The check hook command result is available in the `hooks` array, within the `check` scope:

{{< highlight shell >}}
sensuctl event info i-424242 nginx_process --format json

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

After you confirm that the hook is attached to your check, you can stop Nginx and observe the check hook in action on the next check execution.
This example uses sensuctl to query event info and send the response to `jq` so you can isolate the check hook output:

{{< highlight shell >}}
sensuctl event info i-424242 nginx_process --format json | jq -r '.check.hooks[0].output' 

USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
root         1  0.0  0.3  46164  6704 ?        Ss   Nov17   0:11 /usr/lib/systemd/systemd --switched-root --system --deserialize 20
root         2  0.0  0.0      0     0 ?        S    Nov17   0:00 [kthreadd]
root         3  0.0  0.0      0     0 ?        S    Nov17   0:01 [ksoftirqd/0]
root         7  0.0  0.0      0     0 ?        S    Nov17   0:01 [migration/0]
root         8  0.0  0.0      0     0 ?        S    Nov17   0:00 [rcu_bh]
root         9  0.0  0.0      0     0 ?        S    Nov17   0:34 [rcu_sched]
{{< /highlight >}}

Although this output is truncated in the interest of brevity, it reflects the output of the `ps aux` command specified in the check hook you created.
Now when you are alerted that Nginx is not running, you can review the check hook output to confirm this is true with no need to start up an SSH session to investigate.

## Next steps

To learn more about data collection with check hooks, read the [hooks reference][1].

[1]: ../../reference/hooks/
