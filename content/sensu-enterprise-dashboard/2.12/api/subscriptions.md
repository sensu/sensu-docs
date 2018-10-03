---
title: "Subscriptions API"
description: "Sensu Subscriptions API reference documentation."
product: "Sensu Enterprise Dashboard"
version: "2.12"
menu:
  sensu-enterprise-dashboard-2.12:
    parent: api
---

- [The `/subscriptions` API endpoint](#the-subscriptions-api-endpoint)
  - [`/subscriptions` (GET)](#subscriptions-get)
- [The `/subscriptions/:subscription` API endpoint(s)](#the-subscriptionssubscription-api-endpoints)
  - [`/subscriptions/:subscription` (GET)](#subscriptionssubscription-get)

## The `/subscriptions` API endpoint

### `/subscriptions` (GET)

The `/subscriptions` API endpoint provides HTTP GET access to [subscription][1]
data.

#### EXAMPLE {#subscriptions-get-example}

The following example demonstrates a request to the `/subscriptions` API, resulting in
a JSON Array of JSON Hashes containing [subscription definitions][2].

{{< highlight shell >}}
$ curl -s http://127.0.0.1:3000/subscriptions | jq .
???
{{< /highlight >}}

#### API Specification {#subscriptions-get-specification}

/subscriptions (GET)  | 
---------------|------
description    | Returns the list of subscriptions.
example url    | http://hostname:3000/subscriptions
response type  | Array
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< highlight shell >}}???
{{< /highlight >}}

## The `/subscriptions/:subscription` API endpoint(s) {#the-subscriptionssubscription-api-endpoints}

### `/subscriptions/:subscription` (GET) {#subscriptionssubscription-get}

The `/subscriptions/:subscription` API endpoints provide HTTP GET access to
[subscription data][1] for specific `:subscription` definitions, by subscription `name`.

#### EXAMPLE {#subscriptionssubscription-get-example}

In the following example, querying the `/subscriptions/:subscription` API returns a JSON Hash
containing the requested [`:subscription` definition][2] (i.e. for the `:subscription` named
`???`).

{{< highlight shell >}}
$ curl -s http://127.0.0.1:3000/subscriptions/sensu_website | jq .
???
{{< /highlight >}}

The following example demonstrates a request for subscription data for a non-existent
`:subscription` named `non_existent_subscription`, which results in a [404 (Not Found) HTTP
response code][3] (i.e. `HTTP/1.1 404 Not Found`).

{{< highlight shell >}}
$ curl -s -i http://127.0.0.1:3000/subscriptions/non_existent_subscription

???
{{< /highlight >}}

#### API Specification {#subscriptionssubscription-get-specification}

/subscriptions/:subscription (GET) | 
---------------------|------
description          | Returns a subscription.
example url          | http://hostname:3000/subscriptions/sensu_website
response type        | Hash
response codes       | <ul><li>**Success**: 200 (OK)</li><li> **Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output               | {{< highlight json >}}???
{{< /highlight >}}
