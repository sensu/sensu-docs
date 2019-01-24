---
title: "Silenced API"
product: "Sensu Core"
description: "Sensu Silenced API reference documentation."
version: "1.6"
weight: 7
menu:
  sensu-core-1.6:
    parent: api
---

## Reference documentation

- [The `/silenced` API endpoints](#the-silenced-api-endpoints)
  - [`/silenced` (GET)](#silenced-get)
  - [`/silenced` (POST)](#silenced-post)
  - [`/silenced/ids/:id` (GET)](#silencedidsid-get)
  - [`/silenced/clear` (POST)](#silenced-clear-post)
  - [`/silenced/subscriptions/:subscription` (GET)](#silenced-subscriptions-get)
  - [`/silenced/checks/:check` (GET)](#silenced-checks-get)

## The `/silenced` API endpoints

The Silence API provides endpoint HTTP POST and GET access to create, query and
clear (delete) a silence entry via the Sensu API.

### `/silenced` (GET)

#### Example: Querying for all silence entries

{{< highlight shell >}}
$ curl -s -X GET http://localhost:4567/silenced |jq .
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
example url     | http://hostname:4567/silenced
pagination      | see [pagination][1]
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
http://localhost:4567/silenced

HTTP/1.1 201 Created
Access-Control-Allow-Credentials: true
Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Origin: *
Connection: close
Content-length: 0

$ curl -s -X GET http://localhost:4567/silenced | jq .
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
example URL        | http://hostname:4567/silenced
payload            | {{< highlight json >}}{
  "subscription": "load-balancer",
  "expire": 3600,
  "reason": "load-balancer maintenance window",
  "creator": "sysop@example.com"
}
{{< /highlight >}}
payload parameters | <ul><li>`check`<ul><li>**required**: true, unless `subscription` is specified</li><li>**type**: String</li><li>**regex**: "/\A[\w\.\-\:]+\z/"</li><li>**description**: Specifies the check which the silence entry applies to.</li><li>**example**: "check_haproxy"</li></ul><li>`begin`<ul><li>**required**: false</li><li>**type**: Integer</li><li>**description**: If specified, the silence entry will only be effective after this epoch timestamp. Silence a check and/or client subscriptions at a predetermined time (e.g. maintenance window).</li><li>**example**: 1512501881</li></ul><li>`creator`<ul><li>**required**: false</li><li>**type**: String</li><li>**description**: Specifies the entity responsible for this entry.</li><li>**example**: "you@yourdomain.com" or "Your Name Here"</li></ul></li><li>`expire`<ul><li>**required**: false</li><li>**type**: Integer</li><li>**description**: If specified, the silence entry will be automatically cleared after this number of seconds. If `begin` is specified, the number of seconds until being cleared starts at that time.</li><li>**example**: 1800</li></ul></li><li>`expire_on_resolve`<ul><li>**required**: false</li><li>**type**: Boolean</li><li>**description**: If specified as true, the silence entry will be automatically cleared once the condition it is silencing is resolved.</li><li>**example**: true</li></ul></li><li>`reason`<ul><li>**required**: false</li><li>**type**: String</li><li>**description**: If specified, this free-form string is used to provide context or rationale for the reason this silence entry was created.</li><li>**example**: "pre-arranged maintenance window"</li></ul></li><li>`subscription`<ul><li>**required**: true, unless `check` is specified</li><li>**type:** String</li><li>**regex**: "/\A[\w\.\-\:]+\z/"</li><li>**description**: Specifies the subscription which the silence entry applies to.</li><ul></li></ul>
response codes     | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

### `/silenced/ids/:id` (GET) {#silencedidsid-get}

#### Example: Querying for a specific silence entry

{{< highlight shell >}}
$ curl -s -X GET http://localhost:4567/silenced/ids/load-balancer:check_haproxy |jq .
{
  "id": "load-balancer:check_haproxy",
  "subscription": "load-balancer",
  "check": "check_haproxy",
  "begin": null,
  "reason": null,
  "creator": null,
  "expire_on_resolve": false,
  "expire": 3529
}
{{< /highlight >}}

#### API specification {#silencedids-get-specification}

/silenced/ids/:id (GET) | 
------------------------|------
description             | Returns a specific silenced override by it's ID.
example url             | http://hostname:4567/silenced/webserver:check_nginx
pagination              | see [pagination][1]
response type           | Hash
response codes          | <ul><li>**Success**: 200 (OK)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output                  | {{< highlight json >}}{
  "id": "webserver:check_nginx",
  "subscription": "webserver",
  "check": "check_nginx",
  "begin": null,
  "reason": null,
  "creator": null,
  "expire_on_resolve": false,
  "expire": -1
}
{{< /highlight >}}

### `/silenced/clear` (POST)

#### Example: Clearing a silence entry

You can use the `/silenced/clear POST` endpoint to delete a single silence entry by its ID.
The following example deletes a silence entry with the ID `load-balancer:check_haproxy`, resulting in a 204 (No Content) HTTP response code:

{{< highlight shell >}}
$ curl -s -i -X POST \
-H 'Content-Type: application/json' \
-d '{ "id": "load-balancer:check_haproxy" }' \
http://localhost:4567/silenced/clear

HTTP/1.1 204 No Content
Access-Control-Allow-Credentials: true
Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Origin: *
Connection: close
Content-length: 0
{{< /highlight >}}

A silence entry can also be cleared by specifying the intersection of
subscription _and_ check to which the entry applies.
The following example deletes the silence entry applied to the `check_ntpd` check for `all` subscriptions:

{{< highlight shell >}}
$ curl -s -i -X POST \
-H 'Content-Type: application/json' \
-d '{ "subscription": "all", "check": "check_ntpd" }' \
http://localhost:4567/silenced/clear

HTTP/1.1 204 No Content
Access-Control-Allow-Credentials: true
Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Origin: *
Connection: close
Content-length: 0
{{< /highlight >}}

#### API specification {#silenced-clear-post-specification}

/silenced/clear (POST) | 
-----------------------|------
description            | Clear a single silence entry specified by its ID or by the applicable check and subscription.
example URL            | http://hostname:4567/silenced/clear
payload                | {{< highlight json >}}{
  "id": "load-balancer:ha_proxy"
}
{{< /highlight >}}
payload parameters     | <ul><li>`check`<ul><li>**required**: true, unless `id` is specified</li><li>**type**: String</li><li>**description**: Specifies the name of the check for which the silence entry should be cleared.</li><li>**example**: "check_haproxy"</li></ul></li><li>`subscription`:<ul><li>**required**: true, unless `id` is specified</li><li>**type:** String</li><li>**description**: Specifies the name of the subscription for which the silence entry should be cleared.</li></ul></li><li>`id`:<ul><li>**required**: true, unless `check` and `subscription` are specified</li><li>**type:** String</li><li>**description**: Specifies the id (intersection of subscription and check) of the silence entry to clear.</li></ul></li></ul>
response codes         | <ul><li>**Success**: 204 (No Content)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

### `/silenced/subscriptions/:subscription` (GET) {#silenced-subscriptions-get}

#### Example: Querying for silence entries via subscription name

{{< highlight shell >}}
$ curl -s -X GET http://localhost:4567/silenced/subscriptions/load-balancer | jq .
[
  {
    "expire": 3596,
    "expire_on_resolve": false,
    "begin": null,
    "creator": null,
    "reason": null,
    "check": "check_ntpd",
    "subscription": "load-balancer",
    "id": "load-balancer:check_ntpd"
  }
]
{{< /highlight >}}

#### API specification {#silenced-subscriptions-get-specification}

/silenced/subscriptions/:subscription (GET) | 
--------------------------------------------|------
description                                 | Returns a list of silence entries matching the specified subscription name.
example url                                 | http://hostname:4567/silenced/subscriptions/load-balancer
pagination                                  | see [pagination][1]
response type                               | Array
response codes                              | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

### `/silenced/checks/:check` (GET) {#silenced-checks-get}

#### Example: Querying for silence entries via check name

{{< highlight shell >}}
$ curl -s -X GET http://localhost:4567/silenced/checks/check_ntpd | jq .
[
  {
    "expire": -1,
    "expire_on_resolve": false,
    "begin": null,
    "creator": "sysop@example.com",
    "reason": "we ran out of time",
    "check": "check_ntpd",
    "subscription": "webserver",
    "id": "webserver:check_ntpd"
  },
  {
    "expire": -1,
    "expire_on_resolve": false,
    "begin": null,
    "creator": "sysop@example.com",
    "reason": "we ran out of time",
    "check": "check_ntpd",
    "subscription": "load-balancer",
    "id": "load-balancer:check_ntpd"
  }
]
{{< /highlight >}}

#### API specification {#silenced-checks-get-specification}

/silenced/checks/:check (GET) | 
------------------------------|------
desc                          | Returns a list of silence entries matching the specified check name.
example url                   | http://hostname:4567/silenced/checks/check_ntpd
pagination                    | see [pagination][1]
response type                 | Array
response codes                | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

[1]:  ../overview#pagination
