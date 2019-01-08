---
title: "How to monitor external resources with proxy requests and entities"
linkTitle: "Monitoring External Resources"
weight: 15
version: "5.0"
product: "Sensu Go"
platformContent: false
menu: 
  sensu-go-5.0:
    parent: guides
---

## What are Sensu proxy requests and entities?

Sensu [proxy entities][1] are **entities** dynamically created via either the
API (and **sensuctl**) or the [`proxy_entity_name` attribute][2] of a check.

Check definitions that include the `proxy_entity_name` attribute will have their
results reported under this proxy entity name instead of the agent's entity that
emitted the result. In comparison, check definitions including the
[`proxy_requests` attribute][3] will trigger a check request for each entity
matched, regardless of whether that entity is a Sensu agent’s entity or a proxy
entity, and the result of each check request will be reported under the matched
entity and not the agent's entity that emitted the result.

## Why use proxy requests and entities?

Sensu proxy requests and entities allow Sensu to monitor external resources
on systems or devices where a Sensu agent cannot be installed, like a
network switch or a website.

## Using a check to create a proxy entity

The purpose of this section is to help you monitor an external resource, more
specifically a website, by configuring a check with a **proxy entity name** so an
entity representing the website is created and the status of this website is
reported under this entity and not the agent running the actual check.
This section requires a Sensu backend, a Sensu agent and sensuctl to be configured
with the backend.

### Installing a http check script

We will use a [bash script][4], named `http_check.sh`, to perform an HTTP
request using **curl**.

{{< highlight shell >}}
sudo curl https://raw.githubusercontent.com/sensu/sensu-go/60e6a68aecb0c8e0c2dc51714e08462eb81b4413/examples/checks/http_check.sh \
-o /usr/local/bin/http_check.sh && \
sudo chmod +x /usr/local/bin/http_check.sh
{{< /highlight >}}

While this command is appropriate when running a few agents, you should consider
using a **configuration management** tool or use [Sensu assets][5] to provide
runtime dependencies to checks on bigger environments.

### Creating the check

Now that our script is installed, the second step is to create a check named
`check-sensuapp`, which runs the command `http_check.sh https://sensu.io`, at an
**interval** of 60 seconds, for all entities subscribed to the `proxy`
subscription, using the `sensu.io` proxy entity name.

{{< highlight shell >}}
sensuctl check create check-sensuapp \
--command 'http_check.sh https://sensu.io' \
--interval 60 \
--subscriptions proxy \
--proxy-entity-name sensu.io
{{< /highlight >}}

### Adding the subscription
To run the the check, you'll need an agent with the subscription `proxy`.
After [installing an agent][install], open `/etc/sensu/agent.yml`
and add the `proxy` subscription so the subscription configuration looks like:

{{< highlight yml >}}
subscriptions:
  - "proxy"
{{< /highlight >}}

Then restart the agent.

{{< highlight shell >}}
sudo systemctl restart sensu-agent
{{< /highlight >}}

_NOTE: For CentOS 6 and RHEL 6, use `sudo /etc/init.d/sensu-agent restart`._

### Validating the check

You can verify the proper behavior of this check against the proxy entity,
`sensu.io`, by using sensuctl. It might take a few moments after
the check is created for the it to be scheduled on the agent, ran for each entity
 and the results sent back to Sensu backend.

{{< highlight shell >}}
sensuctl event info sensu.io check-sensuapp
{{< /highlight >}}

## Using proxy requests to monitor a website and a network device

The purpose of this section is to help you monitor multiple external resources, more
specifically a website and network device, by configuring checks with the [`proxy_requests` attribute][3].
Entities representing our websites are then created and the status of these
websites are reported under these entities and not the agent running the actual check.
This section requires a Sensu backend, a Sensu agent and sensuctl to be configured
with the backend.

### Installing a http check script

For monitoring the website, we'll need a script to reach out to it

{{< highlight shell >}}
sudo curl https://raw.githubusercontent.com/sensu/sensu-go/60e6a68aecb0c8e0c2dc51714e08462eb81b4413/examples/checks/http_check.sh \
-o /usr/local/bin/http_check.sh && \
sudo chmod +x /usr/local/bin/http_check.sh
{{< /highlight >}}

### Creating checks and entities

Now that our script is installed, we can make checks called `website-check` and `router-check` along with two proxy entities, `
`website-check` and two proxy entities, `sensu-doc-site` and `router-1`.

Make a file called `checks_and_entities.json` with the following contents:

{{< highlight shell >}}
{
  "type": "CheckConfig",
  "api_version": "core/v2",
  "metadata": {
    "name": "website-check",
    "namespace": "default"
  },
  "spec": {
    "command": "http_check.sh {{ .labels.url }}",
    "interval": 10,
    "subscriptions": ["proxy"],
    "publish": true,
    "proxy_requests": {
      "entity_attributes": ["entity.entity_class == 'proxy'",
                            "entity.labels.proxy_type == 'website'"]
     }
  }
}
{
  "type": "CheckConfig",
  "api_version": "core/v2",
  "metadata": {
    "name": "router-check",
    "namespace": "default"
  },
  "spec": {
    "command": "ping -c 4 {{ .labels.ipaddress }}",
    "interval": 10,
    "subscriptions": ["proxy"],
    "publish": true,
    "proxy_requests": {
      "entity_attributes": ["entity.entity_class == 'proxy'",
                            "entity.labels.proxy_type == 'router'"]
     }
  }
}
{
  "type": "Entity",
  "api_version": "core/v2",
  "metadata": {
    "name": "sensu-docs",
    "namespace": "default",
    "labels": {
      "proxy_type": "website",
      "url": "https://sensu.io"
    }
  },
  "spec": {
    "entity_class": "proxy"
    }
  }
}
{
  "type": "Entity",
  "api_version": "core/v2",
  "metadata": {
    "name": "router-1",
    "namespace": "default",
    "labels": {
      "proxy_type": "router",
      "ipaddress": "127.0.0.1"
    }
  },
  "spec": {
    "entity_class": "proxy"
    }
  }
}
{{< /highlight >}}

Run the following command to create the check and entities listed in `checks_and_entities.json`

{{< highlight shell >}}
sensuctl create -f checks_and_entities.json
{{< /highlight >}}

### Adding the subscription
For the proxy checks to run, you'll need an agent with the subscription `proxy`.
After [installing an agent][install], open `/etc/sensu/agent.yml`
and add the `proxy` subscription so the subscription configuration looks like:

{{< highlight yml >}}
subscriptions:
  - "proxy"
{{< /highlight >}}

Then restart the agent.

{{< highlight shell >}}
sudo systemctl restart sensu-agent
{{< /highlight >}}

_NOTE: For CentOS 6 and RHEL 6, use `sudo /etc/init.d/sensu-agent restart`._

### Validating the check

You can verify the proper behavior of this check against the proxy entities,
`sensu-docs` and `router-1`, by using sensuctl. It might take a few moments after
the checks are created for them to be scheduled on the agent, ran for each matching entity
 and the results sent to the Sensu backend.

{{< highlight shell >}}
sensuctl event info sensu-docs website-check
sensuctl event info router-1 router-check
{{< /highlight >}}

While this command is appropriate when running a few agents, you should consider
using a **configuration management** tool or use [Sensu assets][5] to provide
runtime dependencies to checks on bigger environments.

## Next steps

You now know how to run a proxy check to verify the status of a website, as
well as using proxy_requests to run two different checks on two different proxy entities based on label evaluation using `proxy_requests`.
From this point, here are some recommended resources:

* Read the [proxy checks reference][6] for in-depth documentation on proxy checks.
* Read the guide to [providing runtime dependencies to checks with assets][5].
* Read the guide to [sending alerts to Slack with handlers][7].

[1]: ../../reference/entities/#what-is-a-proxy-entity
[2]: ../../reference/checks/#check-attributes
[3]: ../../reference/checks/#proxy-requests
[4]: https://raw.githubusercontent.com/sensu/sensu-go/dccfeb9093c21e45fd6505d3b32da354bdf8a136/examples/checks/http_check.sh
[5]: ../../reference/assets
[6]: ../../reference/checks/#proxy-requests
[7]: ../send-slack-alerts/
[install]: ../../getting-started/installation-and-configuration
[start]: ../../getting-started/installation-and-configuration/#starting-the-services
