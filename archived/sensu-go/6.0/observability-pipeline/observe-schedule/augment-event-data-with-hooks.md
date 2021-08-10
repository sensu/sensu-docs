---
title: "Augment event data with check hooks"
linkTitle: "Augment Event Data"
guide_title: "Augment event data with check hooks"
type: "guide"
description: "Free up precious operator time: use Sensu check hooks to automate data collection that operators would otherwise perform manually to investigate alerts."
weight: 70
version: "6.0"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-6.0:
    parent: observe-schedule
---

Check hooks are **commands** the Sensu agent runs in response to the result of **check** command execution. 
The Sensu agent executes the appropriate configured hook command based on the exit status code of the check command (for example, `1`).

Check hooks allow Sensu users to automate data collection that operators would routinely perform to investigate observability alerts, which frees up precious operator time.
Although you can use check hooks for rudimentary auto-remediation tasks, they are intended to enrich observability data.
This guide helps you create a check hook that captures the process tree in case a service check returns a critical status.

Follow these steps to create a check hook that captures the process tree in the event that an `nginx_process` check returns a status of `2` (critical, not running).

## Create a hook

Create a new hook that runs a specific command to capture the process tree.
Set an execution **timeout** of 10 seconds for this command:

{{< code shell >}}
sensuctl hook create process_tree  \
--command 'ps aux' \
--timeout 10
{{< /code >}}

To confirm that the hook was added, run:

{{< language-toggle >}}

{{< code shell "YML" >}}
sensuctl hook info process_tree --format yaml
{{< /code >}}

{{< code shell "JSON" >}}
sensuctl hook info process_tree --format wrapped-json
{{< /code >}}

{{< /language-toggle >}}

The response will include the complete hook resource definition in the specified format:

{{< language-toggle >}}

{{< code yml >}}
---
type: HookConfig
api_version: core/v2
metadata:
  created_by: admin
  name: process_tree
  namespace: default
spec:
  command: ps aux
  runtime_assets: null
  stdin: false
  timeout: 10
{{< /code >}}

{{< code json >}}
{
  "type": "HookConfig",
  "api_version": "core/v2",
  "metadata": {
    "created_by": "admin",
    "name": "process_tree",
    "namespace": "default"
  },
  "spec": {
    "command": "ps aux",
    "runtime_assets": null,
    "stdin": false,
    "timeout": 10
  }
}
{{< /code >}}

{{< /language-toggle >}}

## Assign the hook to a check

Now that you've created the `process_tree` hook, you can assign it to a check.
This example assumes you've already set up the `nginx_process` check.
Setting the `type` to `critical` ensures that whenever the check command returns a critical status, Sensu executes the `process_tree` hook and adds the output to the resulting event data:

{{< code shell >}}
sensuctl check set-hooks nginx_process  \
--type critical \
--hooks process_tree
{{< /code >}}

## Validate the check hook

Verify that the check hook is behaving properly against a specific event with `sensuctl`.
It might take a few moments after you assign the check hook for the check to be scheduled on the entity and the result sent back to the Sensu backend.

{{< language-toggle >}}

{{< code shell "YML">}}
sensuctl event info i-424242 nginx_process --format yaml
{{< /code >}}

{{< code shell "JSON" >}}
sensuctl event info i-424242 nginx_process --format wrapped-json
{{< /code >}}

{{< /language-toggle >}}

The check hook command result is available in the `hooks` array, within the `check` scope:

{{< language-toggle >}}

{{< code yml >}}
check:
  ...
  hooks:
  - config:
      name: process_tree
      command: ps aux
      timeout: 10
      namespace: default
    duration: 0.008713605
    executed: 1521724622
    output: ''
    status: 0
    ...

{{< /code >}}

{{< code json >}}
{
  "check": {
    "...": "...",
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
    "...": "..."
  }
}
{{< /code >}}

{{< /language-toggle >}}

After you confirm that the hook is attached to your check, you can stop Nginx and observe the check hook in action on the next check execution.
This example uses sensuctl to query event info and send the response to `jq` so you can isolate the check hook output:

{{< code shell >}}
sensuctl event info i-424242 nginx_process --format json | jq -r '.check.hooks[0].output' 
{{< /code >}}

This example output is truncated for brevity, but it reflects the output of the `ps aux` command specified in the check hook you created:

{{< code shell >}}
USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
root         1  0.0  0.3  46164  6704 ?        Ss   Nov17   0:11 /usr/lib/systemd/systemd --switched-root --system --deserialize 20
root         2  0.0  0.0      0     0 ?        S    Nov17   0:00 [kthreadd]
root         3  0.0  0.0      0     0 ?        S    Nov17   0:01 [ksoftirqd/0]
root         7  0.0  0.0      0     0 ?        S    Nov17   0:01 [migration/0]
root         8  0.0  0.0      0     0 ?        S    Nov17   0:00 [rcu_bh]
root         9  0.0  0.0      0     0 ?        S    Nov17   0:34 [rcu_sched]
{{< /code >}}

Now when you are alerted that Nginx is not running, you can review the check hook output to confirm this is true with no need to start up an SSH session to investigate.

## Next steps

To learn more about data collection with check hooks, read the [hooks reference][1].


[1]: ../hooks/
