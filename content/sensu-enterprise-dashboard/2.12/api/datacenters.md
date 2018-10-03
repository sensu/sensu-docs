---
title: "Datacenters API"
description: "Sensu Datacenters API reference documentation."
product: "Sensu Enterprise Dashboard"
version: "2.12"
menu:
  sensu-enterprise-dashboard-2.12:
    parent: api
---

- [The `/datacenters` API endpoint](#the-datacenters-api-endpoint)
  - [`/datacenters` (GET)](#datacenters-get)
- [The `/datacenters/:datacenter` API endpoint(s)](#the-datacentersdatacenter-api-endpoints)
  - [`/datacenters/:datacenter` (GET)](#datacentersdatacenter-get)

## The `/datacenters` API endpoint

### `/datacenters` (GET)

The `/datacenters` API endpoint provides HTTP GET access to [subscription datacenter][1]
data.

#### EXAMPLE {#datacenters-get-example}

The following example demonstrates a request to the `/datacenters` API, resulting in
a JSON Array of JSON Hashes containing [datacenter definitions][2].

{{< highlight shell >}}
$ curl -s http://127.0.0.1:3000/datacenters | jq .
???
{{< /highlight >}}

#### API Specification {#datacenters-get-specification}

/datacenters (GET)  | 
---------------|------
description    | Returns the list of datacenters.
example url    | http://hostname:3000/datacenters
response type  | Array
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< highlight shell >}}???
{{< /highlight >}}

## The `/datacenters/:datacenter` API endpoint(s) {#the-datacentersdatacenter-api-endpoints}

### `/datacenters/:datacenter` (GET) {#datacentersdatacenter-get}

The `/datacenters/:datacenter` API endpoints provide HTTP GET access to
[datacenter data][1] for specific `:datacenter` definitions, by datacenter `name`.

#### EXAMPLE {#datacentersdatacenter-get-example}

In the following example, querying the `/datacenters/:datacenter` API returns a JSON Hash
containing the requested [`:datacenter` definition][2] (i.e. for the `:datacenter` named
`???`).

{{< highlight shell >}}
$ curl -s http://127.0.0.1:3000/datacenters/sensu_website | jq .
???
{{< /highlight >}}

The following example demonstrates a request for datacenter data for a non-existent
`:datacenter` named `non_existent_datacenter`, which results in a [404 (Not Found) HTTP
response code][3] (i.e. `HTTP/1.1 404 Not Found`).

{{< highlight shell >}}
$ curl -s -i http://127.0.0.1:3000/datacenters/non_existent_datacenter

???
{{< /highlight >}}

#### API Specification {#datacentersdatacenter-get-specification}

/datacenters/:datacenter (GET) | 
---------------------|------
description          | Returns a datacenter.
example url          | http://hostname:3000/datacenters/sensu_website
response type        | Hash
response codes       | <ul><li>**Success**: 200 (OK)</li><li> **Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output               | {{< highlight json >}}???
{{< /highlight >}}
