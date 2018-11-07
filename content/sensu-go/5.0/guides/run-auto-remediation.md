---
title: "How to run auto-remediation tasks with check hooks"
linkTitle: "Running Auto-Remediation"
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

Check hooks allow Sensu users to automate actions routinely performed by
operators in response to monitoring alerts, freeing precious operators time to
be used elsewhere and to greater effect! They can be used for rudimentary
auto-remediation tasks, such as (re)starting a process, and providing additional
context.

## Using check hooks to run auto-remediation tasks

The purpose of this guide is to help you put in place a rudimentary
auto-remediation task, more specifically restarting the `nginx` service if our
check `nginx_process` returns a status of `2` (critical, not running).

### Creating the hook

The first step is to create a new hook that will run a specific command to
restart the `nginx` service. We will set an execution **timeout** of 10 seconds
for this command.

{{< highlight shell >}}
sensuctl hook create nginx-restart  \
--command 'sudo systemctl restart nginx' \
--timeout 10
{{< /highlight >}}

**NOTE** - If running hook commands as sudo you may need to update your /etc/sudoers to allow the sensu user to run the commands without a password, otherwise you may get a '**_sudo: no tty present and no askpass program specified_**' error.

### Assigning the hook to a check

Now that the `nginx-restart` hook has been created, it can be assigned to a
check. Here, since we want to restart the `nginx` service, we will apply our
hook to an already existing check that verifies this nginx process, named
`nginx_process`, whenever the check command returns a critical status.

{{< highlight shell >}}
sensuctl check set-hooks nginx_process  \
--type critical \
--hooks nginx-restart
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
          "name": "nginx-restart",
          "command": "sudo systemctl restart nginx",
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

## Next steps

You now know how to run auto-remediation tasks. From this point, here are some
recommended resources:

* Read the [hooks reference][1] for in-depth documentation on hooks.

[1]: ../../reference/hooks/
