---
title: "Mutators"
description: "The mutators reference guide."
weight: 1
version: "2.0"
platformContent: False 
menu:
  sensu-core-2.0:
    parent: reference
---

# Mutators

## How do mutators work?
A handler can specify a mutator to transform event data. Mutators are are executed 
prior to the execution of a handler. If the mutator executes successfully, the modified event 
data is returned to the handler, and the handler is then executed. If the mutator 
fails to execute, an error will be logged, and the handler will not be executed.

* When Sensu server processes an event, it will check the handler for the
  presence of a mutator, and execute that mutator before executing the handler. 
* If the mutator executes successfully (it returns an exit status code of 0), modified
  event data is provided to the handler, and the handler is executed.
* If the mutator fails to execute (it returns a non-zero exit status code, or
  fails to complete within its configured timeout), an error will be logged and
  the handler will not execute.

## Mutator specification

### Naming

Each mutator definition must have a unique name within its organization and
environment.

* A unique string used to name/identify the mutator
* Cannot contain special characters or spaces
* Validated with Go regex [`\A[\w\.\-]+\z`](https://regex101.com/r/zo9mQU/2)

### Attributes
command      | 
-------------|------ 
description  | The mutator command to be executed by Sensu server. 
required     | true
type         | String
example      | {{< highlight shell >}}"command": "/etc/sensu/plugins/mutated.rb"{{</highlight>}}

timeout      | 
-------------|------ 
description  | The mutator execution duration timeout in seconds (hard stop). 
required     | false 
type         | integer 
example      | {{< highlight shell >}}"timeout": 30{{</highlight>}}


## Examples

The following Sensu mutator definition uses an imaginary Sensu plugin called `example_mutator.rb`
to modify event data prior to handling the event.

### Mutator definition
{{< highlight json >}}
{
  "name": "example-mutator",
  "command": "example_mutator.rb",
  "timeout": 60,
  "env_vars": null,
  "environment": "default",
  "organization": "default"
}
{{< /highlight >}}
