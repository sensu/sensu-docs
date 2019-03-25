---
title: "Silenced API"
product: "Sensu Enterprise Dashboard"
description: "Sensu Silenced API reference documentation."
version: "2.15"
menu:
  sensu-enterprise-dashboard-2.15:
    parent: api
---

- [The `/silenced` API endpoints](#the-silenced-api-endpoints)
  - [`/silenced` (GET)](#silenced-get)
  - [`/silenced` (POST)](#silenced-post)
  - [`/silenced/clear` (POST)](#silenced-clear-post)

## The `/silenced` API endpoints

The Silenced API provides HTTP POST and GET access to create, query, and
clear (delete) a silencing entry.

### `/silenced` (GET)

The `/silenced` endpoint provides HTTP GET access to [silencing entry specifications][1].

#### EXAMPLES

The following example demonstrates a `/silenced` API query which returns a JSON
Array of JSON Hashes containing all silencing entry specifications.

{{< highlight shell >}}
$ curl -s -X GET http://127.0.0.1:3000/silenced |jq .
[
  {
    "_id": "us_west1:load-balancer:check_haproxy",
    "expire": 3530,
    "expire_on_resolve": false,
    "begin": null,
    "creator": null,
    "dc": "us_west1",
    "reason": null,
    "check": "check_haproxy",
    "subscription": "load-balancer",
    "id": "load-balancer:check_haproxy",
    "timestamp": 1538599295
  },
  {
    "_id": "us_west1:all:check_ntpd",
    "expire": -1,
    "expire_on_resolve": true,
    "begin": null,
    "creator": "sysop@example.com",
    "dc": "us_west1",
    "reason": "we ran out of time",
    "check": "check_ntpd",
    "subscription": "all",
    "id": "all:check_ntpd",
    "timestamp": 1538599297
  }
]
{{< /highlight >}}

#### API specification {#silenced-get-specification}

/silenced (GET) | 
----------------|------
description     | Returns a list of silencing entries.
example url     | http://hostname:3000/silenced
response type   | Array
response codes  | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output          | {{< highlight json >}}[
  {
    "_id": "us_west1:load-balancer:check_haproxy",
    "expire": 3530,
    "expire_on_resolve": false,
    "begin": null,
    "creator": null,
    "dc": "us_west1",
    "reason": null,
    "check": "check_haproxy",
    "subscription": "load-balancer",
    "id": "load-balancer:check_haproxy",
    "timestamp": 1538599295
  },
  {
    "_id": "us_west1:all:check_ntpd",
    "expire": -1,
    "expire_on_resolve": true,
    "begin": null,
    "creator": "sysop@example.com",
    "dc": "us_west1",
    "reason": "we ran out of time",
    "check": "check_ntpd",
    "subscription": "all",
    "id": "all:check_ntpd",
    "timestamp": 1538599297
  }
]
{{< /highlight >}}

### `/silenced` (POST)

The `/silenced` API provides HTTP POST access to create [a silencing entry][1].

#### EXAMPLE {#request-post-example}

The following example demonstrates a `/silenced` query that creates a silencing
entry with an expiration of 3600 seconds for the check `check_haproxy` on
clients with the `load-balancer` subscription within the `us_west1` datacenter.

{{< highlight shell >}}
$ curl -s -i -X POST \
-H 'Content-Type: application/json' \
-d '{ "dc": "us_west1", "subscription": "load-balancer", "check": "check_haproxy", "expire": 3600 }' \
http://127.0.0.1:3000/silenced

HTTP/1.1 200 OK
Access-Control-Allow-Credentials: true
Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Origin: *
Connection: close
Content-length: 0

$ curl -s -X GET http://127.0.0.1:3000/silenced | jq .
[
  {
    "_id": "us_west1:load-balancer:check_haproxy",
    "expire": 3594,
    "expire_on_resolve": false,
    "begin": null,
    "creator": null,
    "dc": "us_west1",
    "reason": null,
    "check": "check_haproxy",
    "subscription": "load-balancer",
    "id": "load-balancer:check_haproxy",
    "timestamp": 1538599295
  }
]
{{< /highlight >}}

#### API specification {#silenced-post-specification}

/silenced (POST)   | 
-------------------|------
description        | Create a silencing entry.
example URL        | http://hostname:3000/silenced
payload            | {{< highlight json >}}{
  "dc": "us_west1",
  "subscription": "load-balancer",
  "expire": 3600,
  "reason": "load-balancer maintenance window",
  "creator": "sysop@example.com"
}
{{< /highlight >}}
payload parameters | <ul><li>`dc`<ul><li>**required**: true</li><li>**type**: String</li><li>**description**: Specifies the name of the datacenter where the silence entry applies.</li><li>**example**: `"us_west1"`</li></ul><li>`check`<ul><li>**required**: true, unless `subscription` is specified</li><li>**type**: String</li><li>**description**: Specifies the check which the silence entry applies to.</li><li>**example**: `"check_haproxy"`</li></ul><li>`begin`<ul><li>**required**: false</li><li>**type**: Integer</li><li>**description**: If specified, the silence entry is only effective after this epoch timestamp. Silence a check and/or client subscriptions at a predetermined time (e.g. maintenance window).</li><li>**example**: `1512501881`</li></ul><li>`creator`<ul><li>**required**: false</li><li>**type**: String</li><li>**description**: Specifies the entity responsible for this entry.</li><li>**example**: `"you@yourdomain.com"` or `"Your Name Here"`</li></ul></li><li>`expire`<ul><li>**required**: false</li><li>**type**: Integer</li><li>**description**: If specified, the silence entry automatically clears after this number of seconds. If `begin` is specified, the number of seconds until being cleared starts at that time.</li><li>**example**: `1800`</li></ul></li><li>`expire_on_resolve`<ul><li>**required**: false</li><li>**type**: Boolean</li><li>**description**: If specified as true, the silence entry automatically clears once the condition it is silencing is resolved.</li><li>**example**: `true`</li></ul></li><li>`reason`<ul><li>**required**: false</li><li>**type**: String</li><li>**description**: If specified, this free-form string is used to provide context or rationale for the reason this silence entry was created.</li><li>**example**: `"pre-arranged maintenance window"`</li></ul></li><li>`subscription`<ul><li>**required**: true, unless `check` is specified</li><li>**type:** String</li><li>**description**: Specifies the subscription which the silence entry applies to.</li><ul></li></ul>
response codes     | <ul><li>**Success**: 200 (OK)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

### `/silenced/clear` (POST)

The `/silenced` API provides HTTP POST access to delete [a silencing entry][1].

#### EXAMPLE {#request-post-example-clear}

The following example demonstrates a `/silenced` query that deletes a silencing
entry with the id `load-balancer:check_haproxy` within the `us_west1` datacenter.

{{< highlight shell >}}
$ curl -s -i -X POST \
-H 'Content-Type: application/json' \
-d '{ "dc": "us_west1", "id": "load-balancer:check_haproxy" }' \
http://127.0.0.1:3000/silenced/clear

HTTP/1.1 200 OK
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
description            | Clear a silencing entry.
example URL            | http://hostname:3000/silenced/clear
payload                | {{< highlight json >}}{
  "dc": "us_west1",
  "id": "load-balancer:ha_proxy"
}
{{< /highlight >}}
payload parameters     | <ul><li>`dc`<ul><li>**required**: true</li><li>**type**: String</li><li>**description**: Specifies the name of the datacenter where the silence entry applies.</li><li>**example**: `"us_west1"`</li></ul><li>`check`<ul><li>**required**: true, unless `subscription` or `id` is specified</li><li>**type**: String</li><li>**description**: Specifies the name of the check for which the silence entry should be cleared.</li><li>**example**: "check_haproxy"</li></ul></li><li>`subscription`:<ul><li>**required**: true, unless `client` is specified</li><li>**type:** String</li><li>**description**: Specifies the name of the subscription for which the silence entry should be cleared.</li></ul></li><li>`id`:<ul><li>**required**: true, unless `client` or is specified</li><li>**type:** String</li><li>**description**: Specifies the id (intersection of subscription and check) of the subscription for which the silence entry should be cleared.</li></ul></li></ul>
response codes         | <ul><li>**Success**: 200 (OK)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

[1]: /sensu-core/latest/reference/silencing/
