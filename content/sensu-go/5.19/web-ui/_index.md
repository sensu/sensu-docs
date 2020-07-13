---
title: "Web UI"
description: "The Sensu backend includes the Sensu web UI: a unified view of your Sensu resources with user-friendly tools to reduce alert fatigue. Read this guide to start using the Sensu web UI."
weight: 50
product: "Sensu Go"
version: "5.19"
layout: "single"
menu:
  sensu-go-5.19:
    identifier: web-ui
---

<a name="federated-webui"></a>

The Sensu backend includes the **Sensu web UI**: a unified view of your events, entities, and checks with user-friendly tools to reduce alert fatigue.

**COMMERCIAL FEATURE**: Access the Sensu web UI homepage (shown below) in the packaged Sensu Go distribution. For more information, see [Get started with commercial features][6].

<div style="text-align:center">
<img src="/images/homepage.png" alt="Sensu web UI homepage" width="750">
</div>

<p style="text-align:center"><i>Sensu web UI homepage</i></p>

## Access the web UI

After you [start the Sensu backend][1], you can access the web UI in your browser by visiting http://localhost:3000.

{{% notice note %}}
**NOTE**: You may need to replace `localhost` with the hostname or IP address where the Sensu backend is running.
{{% /notice %}}

## Sign in to the web UI

Sign in to the web UI with your [sensuctl][2] username and password.
See the [role-based access control reference][3] for [default user credentials][4] and instructions for [creating new users][5].

## Change web UI themes

Use the preferences menu to change the theme or switch to the dark theme.


[1]: ../reference/backend#restart-the-service
[2]: ../sensuctl/
[3]: ../reference/rbac/
[4]: ../reference/rbac#default-users
[5]: ../reference/rbac#create-users
[6]: ../commercial/
