---
title: "Hooks"
description: "The hooks reference guide."
weight: 1
version: "2.0"
product: "Sensu Core"
platformContent: true
menu:
  sensu-core-2.0:
    parent: reference
---

# Hooks

### What are hooks?

Hooks are commands run by the Sensu client in response to the result of a check, mutator, or handler execution. The Sensu client will execute the appropriate configured hook command, depending on the execution status (e.g. 1). The hook command output, status, executed timestamp, and duration are captured and published in the event result. Hook commands can optionally receive JSON serialized Sensu client data via STDIN.

### New and improved hooks!

In 2.x, we've redesigned and expanded on the concept of 1.x check hooks. Hooks are now their own resource, and can be created and managed independent of the check configuration scope. With unique and descriptive identifiers, hooks are now reusable and can respond to checks, mutators and handlers! And thats not all, you can now execute multiple hooks for any given response code.

Check out Sean's [blog post](https://blog.sensuapp.org/using-check-hooks-a739a362961f) about Sensu Core check hooks to see how you can use Sensu for auto-remediation tasks!

### Viewing

To view all the hooks that are currently configured for the cluster, enter:

{{< highlight shell >}}
sensuctl hook list
{{< /highlight >}}

If you want more details on a hook, the `info` subcommand can help you out.

> sensuctl hook info nginx-start
{{< highlight shell >}}
=== nginx-start
Name:           nginx-start
Command:        sudo /etc/init.d/nginx start
Timeout:        60
Stdin?:         false
Organization:   default
Environment:    default
{{< /highlight >}}

### Management

Hooks can be configured both interactively or by using CLI flags.

{{< highlight shell >}}
sensuctl hook create nginx-start --command "sudo /etc/init.d/nginx start" --timeout 10
{{< /highlight >}}

To delete an existing hook, simply pass the name of the hook to the `delete` command.

{{< highlight shell >}}
sensuctl hook delete nginx-start
{{< /highlight >}}

## Check hooks

### What is a check hook?

A check hook is a type of hook that lives in the check configuration scope. Check hooks associate existing hooks to a check and type. The check hook type is defined by the response code or severity of the check execution result. Valid check hook types include (in order of precedence): “1”-“255”, “ok”, “warning”, “critical”, “unknown”, and “non-zero”.

ex:
{{< highlight shell >}}
“checks”: {
    “nginx_process”: {
        “command”: “check-process.rb -p nginx”,
        “subscribers”: [“proxy”],
        “interval”: 30,
        "check_hooks": [
        {
            “critical”: [“nginx-start”, “hook-with-custom-script”],
        },
        {
            "non-zero”: [“ps-aux”],
        }],
    }
}
{{< /highlight >}}

### Managing check hooks

To add hooks to a check, use the `add-hook` subcommand.

{{< highlight shell >}}
sensuctl check add-hook nginx_process --type critical --hooks nginx-start,hook-with-custom-script
{{< /highlight >}}

To remove a hook from a check, use the `remove-hook` subcommand.

{{< highlight shell >}}
sensuctl check remove-hook nginx_process critical hook-with-custom-script
{{< /highlight >}}
