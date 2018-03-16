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

To elaborate: `{{< highlight >}}` is the opening tag for highlighting text. `{{< /highlight >}}` is a closing highlight tag. You can add specific highlighting to a tag. It should look something like:
` {{< highlight json >}}`

One note here, the `{{< /highlight >}}` tag should come _immediately_ after the text you wish to highlight, else there will be a weird space rendered in the highlighted text.

Since the Hugo platform uses [Chroma](https://github.com/alecthomas/chroma) (based on Pygments), there are a number of styles you can add after `highlight`. For a full  list, click [here](https://github.com/alecthomas/chroma/tree/master/lexers)

# Header 3
You'll rarely want or need to do this, but here's a very complex example of syntax highlighting that we've standardized across the project:
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

<!-- Your links should go here. -->
[1]: http://sensuapp.org
[2]:
[3]: