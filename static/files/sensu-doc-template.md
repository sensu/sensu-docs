---
title: "Title of Your Doc/Guide"
description: "Short Description of Your Doc/Guide"
product: <!-- Sensu product here, e.g., "Sensu Core", "Sensu Enterprise", "Plugins" -->
version: <!-- Sensu product version here, e.g., 1.0, 1.1, 2.3, 2.8, etc -->
weight: 4 <!-- Change this to wherever you feel like the doc should live in the nav sidebar -->
menu:
  <!-- Full Sensu version here, e.g., sensu-core-1.0, sensu-enterprise-2.9 -->:
    parent: api
---    
# Header 1
When you write a doc and link to a site, it should look like this: `[sensuapp.org][1]`, so functionally: [sensuapp.org][1]

# Header 2
If you create code that needs highlighting, it should look like this:

```
 {{< highlight shell >}}
 /usr/bin/whoami{{< /highlight >}}
```
Optionally, you can change this to ` {{< highlight json >}}` for highlighting json text.

# Header 3
If you are documenting an API endpoint, use the following format:
```
/aggregates/:name (GET) | 
------------------------|------
description             | Returns the list of aggregates for a given check.
example url             | http://hostname:4567/aggregates/elasticsearch
parameters              | <ul><li>`max_age`:<ul><li>**required**: false</li><li>**type**: Integer</li><li>**description**: the maximum age of results to include, in seconds.</li></ul></li></ul>
response type           | Array
response codes          | <ul><li>**Success**: 200 (OK)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output                  | {{< highlight json >}}{
  "clients": 15,
  "checks": 2,
  "results": {
    "ok": 18,
    "warning": 0,
    "critical": 1,
    "unknown": 0,
    "total": 19,
    "stale": 0
  }
}{{< /highlight >}}
```

<!-- Your links should go here. If -->
[1]: http://sensuapp.org
[2]:
[3]: