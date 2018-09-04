---
title: "How to schedule a check with check subdues"
linkTitle: "Scheduling Checks"
weight: 110
version: "2.0"
product: "Sensu Core"
platformContent: false
menu: 
  sensu-core-2.0:
    parent: guides
---

## What are Sensu check subdues?

Sensu check subdues represent one or more **time windows** in which a check is
not scheduled to be executed.

## Why use check subdues

Check subdues are commonly used to prevent the execution of checks outside
business hours for agents on non-critical or ephemeral systems.

This contrast with filters time windows, which allow the check to be executed
but prevents its result from being handled.

## Using check subdues to schedule checks during office hours

The purpose of this guide is to help you schedule a check, named `check-cpu`, so
it's only executed during office hours, from 09:00AM to 05:00PM. If you
don’t already have a check in place, [this guide][1] is a great place to start.

### Defining the time windows

The first step is to create a JSON file, named `nine-to-fiver.json`, which
define our desired time windows. As a reminder, we only want our check to be
running between 09:00AM and 05:00PM and exclusively on weekdays. Here's the
content of that file:

{{< highlight json >}}
{  
   "days":{  
      "all":[  
         {  
            "begin":"17:00 America/Vancouver",
            "end":"09:00 America/Vancouver"
         }
      ],
      "saturday":[  
         {  
            "begin":"00:00 America/Vancouver",
            "end":"23:50 America/Vancouver"
         }
      ],
      "sunday":[  
         {  
            "begin":"00:00 America/Vancouver",
            "end":"23:50 America/Vancouver"
         }
      ]
   }
}
{{< /highlight >}}

See the [sensuctl documentation][4] for the supported time formats.

### Subduing the check

Now that our time windows are defined, we can use them to subdue our check
`check-cpu`, using **sensuctl**.

{{< highlight shell >}}
sensuctl check set-subdue check-cpu -f nine-to-fiver.json
{{< /highlight >}}

### Validating the check

You can verify the proper behavior of this check subdue against a specific
entity, here named `i-424242`, by using `sensuctl` since check results should be
received during business hours.

{{< highlight shell >}}
sensuctl event info i-424242 check-cpu
{{< /highlight >}}

However, if we are outside the defined business hours, the [`sensu-backend`
logs][2] will have entries similar to this:

{{< highlight json >}}
{"component":"schedulerd","level":"debug","msg":"check is not scheduled to be executed","name":"check-cpu","etc": ["..."]}
{{< /highlight >}}

## Next steps

You now know how to subdue checks using time windows. From this point, here
are some recommended resources:

* Read the [checks reference][3] for in-depth
  documentation on checks. 

[1]: ../monitor-server-resources/
[2]: ../../getting-started/installation-and-configuration/#validating-the-services
[3]: ../../reference/handlers
[4]: ../../reference/sensuctl/#time-windows