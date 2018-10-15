---
title: "Results API"
description: "Sensu Results API reference documentation."
product: "Sensu Enterprise Dashboard"
version: "2.11"
menu:
  sensu-enterprise-dashboard-2.11:
    parent: api
---

- [The `/results/:client/:check` API endpoint](#the-resultsclientcheck-api-endpoint)
  - [`/results/:client/:check` (DELETE)](#resultsclientcheck-delete)

## The `/results/:client/:check` API endpoint {#the-resultsclientcheck-api-endpoint}

The `/results/:client/:check` API endpoint provides HTTP DELETE
access to [check result data][1] for a named client and check.

### `/results/:client/:check` (DELETE) {#resultsclientcheck-delete}

#### EXAMPLES {#resultsclientcheck-delete-examples}

The following example demonstrates a `/results/:client/:check` request to delete
check result data for a client named `client-01` and a check named
`sensu_website`, resulting in a [202 (Accepted) HTTP response code][2]
indicating that the result was successful, but that no content is provided as output.

{{< highlight shell >}}
curl -s -i -X DELETE http://127.0.0.1:3000/results/client-01/sensu_website
HTTP/1.1 202 Accepted
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Credentials: true
Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization
Connection: close
Server: thin
{{< /highlight >}}

#### API specification {#resultsclientcheck-delete-specification}

/results/:client/:check (DELETE) | 
---------------------------------|------
description                      | Delete a check result for a given client & check name.
example url                      | http://hostname:3000/results/i-424242/chef_client_process
parameters                       | <ul><li>`dc`:<ul><li>**required**: false</li><li>**type**: String</li><li>**description**: If the check name is present in multiple datacenters, specifying the `dc` parameter accesses only the check found in that datacenter.</li><li>**example**: `http://hostname:3000/results/i-424242/chef_client_process?dc=us_west1`</li></ul></li></ul>
response type                    | [HTTP-header][3] only (No Content)
response codes                   | <ul><li>**Success**: 202 (Accepted)</li><li>**Found in multiple datacenters**: 300 (Multiple Choices)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output                           | {{< highlight shell >}}HTTP/1.1 202 Accepted
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Credentials: true
Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization
Connection: close
Server: thin
{{< /highlight >}}

[?]:  #
[1]:  /sensu-core/latest/reference/checks#check-results
[2]:  https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
[3]:  https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html
[4]:  /sensu-core/latest/reference/clients#proxy-clients
[5]:  /sensu-core/latest/reference/checks#check-definition-specification
