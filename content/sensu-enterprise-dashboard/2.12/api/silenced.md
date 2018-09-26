---
title: "Silenced API"
product: "Sensu Enterprise"
description: "Sensu Silenced API reference documentation."
version: "2.12"
weight: 7
menu:
  sensu-enterprise-2.12:
    parent: api
---

- [The `/silenced` API endpoints](#the-silenced-api-endpoints)
  - [`/silenced` (GET)](#silenced-get)
  - [`/silenced` (POST)](#silenced-post)
  - [`/silenced/clear` (POST)](#silenced-clear-post)

## The `/silenced` API endpoints

The Silence API provides endpoint HTTP POST and GET access to create, query and
clear (delete) a silence entry via the Sensu API.

### `/silenced` (GET)

#### Example: Querying for all silence entries

{{< highlight shell >}}
$ curl -s -X GET http://localhost:3000/silenced |jq .
[
  {
    "expire": 3530,
    "expire_on_resolve": false,
    "begin": null,
    "creator": null,
    "reason": null,
    "check": "check_haproxy",
    "subscription": "load-balancer",
    "id": "load-balancer:check_haproxy"
  },
  {
    "expire": -1,
    "expire_on_resolve": true,
    "begin": null,
    "creator": "sysop@example.com",
    "reason": "we ran out of time",
    "check": "check_ntpd",
    "subscription": "all",
    "id": "all:check_ntpd"
  }
]
{{< /highlight >}}

#### API specification {#silenced-get-specification}

/silenced (GET) | 
----------------|------
description     | Returns a list of silence entries.
example url     | http://hostname:3000/silenced
parameters      | <ul><li>`limit`:<ul><li>**required**: false</li><li>**type**: Integer</li><li>**description**: The number of silence entries to return.</li></ul><li>`offset`:<ul><li>**required**: false</li><li>**type**: Integer</li><li>**depends**: `limit`</li><li>**description**: The number of silence entries to offset before returning items.</li></ul></li></ul>
response type   | Array
response codes  | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output          | {{< highlight json >}}[
  {
    "expire": 3530,
    "expire_on_resolve": false,
    "begin": null,
    "creator": null,
    "reason": null,
    "check": "check_haproxy",
    "subscription": "load-balancer",
    "id": "load-balancer:check_haproxy"
  },
  {
    "expire": -1,
    "expire_on_resolve": true,
    "creator": "sysop@example.com",
    "reason": "we ran out of time",
    "check": "check_ntpd",
    "subscription": "all",
    "id": "all:check_ntpd"
  }
]
{{< /highlight >}}

### `/silenced` (POST)

#### Example: Creating a silence entry {#silence-post-examples}

The following example demonstrates a `/silenced` query, which creates a
silence entry for the check "check_haproxy" on clients with the
"load-balancer" subscription, with an expiration of 3600 seconds:

{{< highlight shell >}}
$ curl -s -i -X POST \
-H 'Content-Type: application/json' \
-d '{"subscription": "load-balancer", "check": "check_haproxy", "expire": 3600 }' \
http://localhost:3000/silenced

HTTP/1.1 201 Created
Access-Control-Allow-Credentials: true
Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Origin: *
Connection: close
Content-length: 0

$ curl -s -X GET http://localhost:3000/silenced | jq .
[
  {
    "expire": 3594,
    "expire_on_resolve": false,
    "begin": null,
    "creator": null,
    "reason": null,
    "check": "check_haproxy",
    "subscription": "load-balancer",
    "id": "load-balancer:check_haproxy"
  }
]
{{< /highlight >}}

#### API specification {#silenced-post-specification}

/silenced (POST)   | 
-------------------|------
description        | Create a silence entry.
example URL        | http://hostname:3000/silenced
payload            | {{< highlight json >}}{
  "subscription": "load-balancer",
  "expire": 3600,
  "reason": "load-balancer maintenance window",
  "creator": "sysop@example.com"
}
{{< /highlight >}}
payload parameters | <ul><li>`check`<ul><li>**required**: true, unless `subscription` is specified</li><li>**type**: String</li><li>**description**: Specifies the check which the silence entry applies to.</li><li>**example**: "check_haproxy"</li></ul><li>`begin`<ul><li>**required**: false</li><li>**type**: Integer</li><li>**description**: If specified, the silence entry will only be effective after this epoch timestamp. Silence a check and/or client subscriptions at a predetermined time (e.g. maintenance window).</li><li>**example**: 1512501881</li></ul><li>`creator`<ul><li>**required**: false</li><li>**type**: String</li><li>**description**: Specifies the entity responsible for this entry.</li><li>**example**: "you@yourdomain.com" or "Your Name Here"</li></ul></li><li>`expire`<ul><li>**required**: false</li><li>**type**: Integer</li><li>**description**: If specified, the silence entry will be automatically cleared after this number of seconds. If `begin` is specified, the number of seconds until being cleared starts at that time.</li><li>**example**: 1800</li></ul></li><li>`expire_on_resolve`<ul><li>**required**: false</li><li>**type**: Boolean</li><li>**description**: If specified as true, the silence entry will be automatically cleared once the condition it is silencing is resolved.</li><li>**example**: true</li></ul></li><li>`reason`<ul><li>**required**: false</li><li>**type**: String</li><li>**description**: If specified, this free-form string is used to provide context or rationale for the reason this silence entry was created.</li><li>**example**: "pre-arranged maintenance window"</li></ul></li><li>`subscription`<ul><li>**required**: true, unless `check` is specified</li><li>**type:** String</li><li>**description**: Specifies the subscription which the silence entry applies to.</li><ul></li></ul>
response codes     | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

### `/silenced/clear` (POST)

#### Example: Clearing a silence entry

A silence entry can be cleared (deleted) by its ID:

{{< highlight shell >}}
$ curl -s -X GET http://localhost:3000/silenced | jq .
[
  {
    "expire": 3594,
    "expire_on_resolve": false,
    "begin": null,
    "creator": null,
    "reason": null,
    "check": "check_haproxy",
    "subscription": "load-balancer",
    "id": "load-balancer:check_haproxy"
  }
]

$ curl -s -i -X POST \
-H 'Content-Type: application/json' \
-d '{ "id": "load-balancer:check_haproxy" }' \
http://localhost:3000/silenced/clear

HTTP/1.1 204 No Content
Access-Control-Allow-Credentials: true
Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Origin: *
Connection: close
Content-length: 0

$ curl -s -X GET http://localhost:3000/silenced | jq .
[]
{{< /highlight >}}

A silence entry can also be cleared by specifying the intersection of
subscription and/or handler to which the entry applies:

{{< highlight shell >}}
$ curl -s -X GET http://localhost:3000/silenced | jq .
[
  {
    "expire": null,
    "expire_on_resolve": false,
    "begin": null,
    "creator": null,
    "reason": null,
    "check": "check_ntpd",
    "subscription": "all",
    "id": "all:check_ntpd"
  }
]

$ curl -s -i -X POST \
-H 'Content-Type: application/json' \
-d '{ "subscription": "all", "check": "check_ntpd" }' \
http://localhost:3000/silenced/clear

HTTP/1.1 204 No Content
Access-Control-Allow-Credentials: true
Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Origin: *
Connection: close
Content-length: 0

$ curl -s -X GET http://localhost:3000/silenced | jq .
[]
{{< /highlight >}}

#### API specification {#silenced-clear-post-specification}

/silenced/clear (POST) | 
-----------------------|------
description            | Clear a silence entry.
example URL            | http://hostname:3000/silenced/clear
payload                | {{< highlight json >}}{
  "id": "load-balancer:ha_proxy"
}
{{< /highlight >}}
payload parameters     | <ul><li>`check`<ul><li>**required**: true, unless `subscription` or `id` is specified</li><li>**type**: String</li><li>**description**: Specifies the name of the check for which the silence entry should be cleared.</li><li>**example**: "check_haproxy"</li></ul></li><li>`subscription`:<ul><li>**required**: true, unless `client` is specified</li><li>**type:** String</li><li>**description**: Specifies the name of the subscription for which the silence entry should be cleared.</li></ul></li><li>`id`:<ul><li>**required**: true, unless `client` or is specified</li><li>**type:** String</li><li>**description**: Specifies the id (intersection of subscription and check) of the subscription for which the silence entry should be cleared.</li></ul></li></ul>
response codes         | <ul><li>**Success**: 204 (No Content)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
