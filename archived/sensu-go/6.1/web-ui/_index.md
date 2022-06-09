---
title: "Web UI"
description: "The Sensu backend includes the Sensu web UI: a unified view of your Sensu resources with user-friendly tools to reduce alert fatigue. Read this guide to start using the Sensu web UI."
weight: 50
product: "Sensu Go"
version: "6.1"
layout: "single"
menu:
  sensu-go-6.1:
    identifier: web-ui
---

The Sensu backend includes the **Sensu web UI**: a unified view of your events, entities, and checks with user-friendly tools to reduce alert fatigue.

<a id="webui-homepage"></a>

{{% notice commercial %}}
**COMMERCIAL FEATURE**: Access the Sensu web UI homepage (shown below) in the packaged Sensu Go distribution.
For more information, read [Get started with commercial features](../commercial/).
{{% /notice %}}

The web UI homepage provides a high-level overview of the overall health of the systems under Sensu's management, with a summary of active incidents, the number of incidents by severity, the types of entities under management, and the numbers of entities and incidents per namespace.

{{< figure src="/images/go/web_ui_index/old_web_ui.png" alt="Sensu web UI homepage" link="/images/go/web_ui_index/old_web_ui.png" target="_blank" >}}

## Access the web UI

After you [start the Sensu backend][1], you can access the web UI in your browser by visiting http://localhost:3000.

{{% notice note %}}
**NOTE**: You may need to replace `localhost` with the hostname or IP address where the Sensu backend is running.
{{% /notice %}}

## Sign in to the web UI

Sign in to the web UI with the username and password you used to configure [sensuctl][2].

The web UI uses your username and password to obtain access and refresh tokens via the [Sensu authentication API][7].
The access and refresh tokens are [JSON Web Tokens (JWTs)][2] that Sensu issues to record the details of users' authenticated Sensu sessions.
The backend digitally signs these tokens, and the tokens can't be changed without invalidating the signature.
The access and refresh tokens are saved in your browser's local storage.

The web UI complies with Sensu role-based access control (RBAC), so individual users can view information according to their access configurations.
Read the [RBAC reference][3] for [default user credentials][4] and instructions for [creating new users][5].

## Change web UI themes

Use the preferences menu to change the theme or switch to the dark theme.


[1]: ../observability-pipeline/observe-schedule/backend#start-the-service
[2]: ../sensuctl/#first-time-setup-and-authentication
[3]: ../operations/control-access/rbac/
[4]: ../operations/control-access/rbac#default-users
[5]: ../operations/control-access/rbac#create-users
[7]: ../api/auth/
