---
title: "Results API"
description: "Sensu Results API reference documentation."
product: "Sensu Enterprise Dashboard"
version: "2.12"
menu:
  sensu-enterprise-dashboard-2.12:
    parent: api
---

- [The `/results/:client/:check` API endpoints](#the-resultsclientcheck-api-endpoints)
  - [`/results/:client/:check` (DELETE)](#resultsclientcheck-delete)

## The `/results/:client/:check` API endpoints {#the-resultsclientcheck-api-endpoints}

The `/results/:client/:check` API endpoint provides HTTP DELETE
access to [check result data][1] for a named `:client` and `:check`.

### `/results/:client/:check` (DELETE) {#resultsclientcheck-delete}

#### EXAMPLES {#resultsclientcheck-delete-examples}

The following example demonstrates a `/results/:client/:check` request to delete
check result data for a `:client` named `client-01` and a `:check` named
`sensu_website`, resulting in a [204 (No Content) HTTP response code][2] (i.e.
`HTTP/1.1 204 No Content`), indicating that the result was successful, but that
no content is provided as output.

{{< highlight shell >}}
curl -s -i -X DELETE http://localhost:3000/results/client-01/sensu_website
HTTP/1.1 204 No Content
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
response type                    | [HTTP-header][3] only (No Content)
response codes                   | <ul><li>**Success**: 204 (No Content)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output                           | {{< highlight shell >}}HTTP/1.1 204 No Content
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Credentials: true
Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization
Connection: close
Server: thin
{{< /highlight >}}

[?]:  #
[1]:  ../../reference/checks#check-results
[2]:  https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
[3]:  https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html
[4]:  ../../reference/clients#proxy-clients
[5]:  ../../reference/checks#check-definition-specification
