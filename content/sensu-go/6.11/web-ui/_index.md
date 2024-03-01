---
title: "Web UI"
description: "Use the Sensu web UI to get an overview of the health of systems under observability, with detail pages for Sensu resources and user-friendly management tools."
weight: 50
product: "Sensu Go"
version: "6.11"
layout: "single"
menu:
  sensu-go-6.11:
    identifier: web-ui
---

{{% notice commercial %}}
**COMMERCIAL FEATURE**: Access the Sensu web UI in the packaged Sensu Go distribution.
For more information, read [Get started with commercial features](../commercial/).
{{% /notice %}}

The Sensu backend includes the **Sensu web UI**: a unified view of your events, entities, and checks with user-friendly tools that provide single-pane-of-glass visibility and reduce alert fatigue.

<a id="webui-homepage"></a>

The web UI homepage provides a high-level overview of the overall health of the systems under Sensu's management, with a summary of active incidents, the number of incidents by severity, the types of entities under management, and the numbers of entities and incidents per namespace.

{{< figure src="/images/go/web_ui_index/web_ui_660.png" alt="Sensu web UI homepage" link="/images/go/web_ui_index/web_ui_660.png" target="_blank" >}}

## Access the web UI

After you [start the Sensu backend][1], you can access the web UI in your browser by visiting http://localhost:3000.

{{% notice note %}}
**NOTE**: You may need to replace `localhost` with the hostname or IP address where the Sensu backend is running.
{{% /notice %}}

## Sign in to the web UI

Sign in to the web UI with the username and password you used to configure [sensuctl][2].

The web UI uses your username and password to obtain access and refresh tokens via the Sensu [/auth API][7].
The access and refresh tokens are [JSON Web Tokens (JWTs)][2] that Sensu issues to record the details of users' authenticated Sensu sessions.
The backend digitally signs these tokens, and the tokens can't be changed without invalidating the signature.
The access and refresh tokens are saved in your browser's local storage.

The web UI complies with Sensu role-based access control (RBAC), so individual users can view information according to their access configurations.
Read the [RBAC reference][3] for [default user credentials][4] and instructions for [creating new users][5].

### Backend log messages for web UI sign-in

Upon successful login, Sensu logs an INFO message in the backend log with details about the user and provider.
For unsuccessful login attempts, Sensu logs an ERROR message upon authentication failure, along with the username that was tried.

Read [Service logging][10] for more information about the backend log and log levels.

## View system information

Press `CTRL .` in the web UI to open the system information modal and view information about your Sensu backend and etcd or PostgreSQL datastore.
For users with permission to create or update licenses, the system information modal includes license expiration information.

### License expiration banner

A banner appears at the top of the web UI screen when your organization's license is expiring:

{{< figure src="/images/go/web_ui_index/license_expiration_banner.png" alt="Sensu web UI homepage" link="/images/go/web_ui_index/license_expiration_banner.png" target="_blank" >}}

The banner is only visible to [users][6] who have read access to your organization's license.

By default, the banner starts appearing when the license expiration is 30 days away.
To adjust the number of days before license expiration to begin displaying the banner, use the [license_expiry_reminder][9] web UI configuration attribute.

## Use the implicit OR operator

On the Sensu web UI homepage, you can use the search function to limit the display by cluster and namespace.
If you specify the same attribute twice with different values, Sensu automatically applies a logical OR operator to your search.

For example, suppose you enter two search expressions in the search bar on the web UI homepage: `namespace: devel_1` and `namespace: devel_2`.
In this case, the web UI homepage will display all data for both namespaces: `devel_1` and `devel_2`.

## Change web UI themes

Use the preferences menu to change the theme or switch to the dark theme.

## Troubleshoot web UI errors

Read [Troubleshoot Sensu][8] to resolve and investigate web UI errors.


[1]: ../observability-pipeline/observe-schedule/backend#start-the-service
[2]: ../sensuctl/#first-time-setup-and-authentication
[3]: ../operations/control-access/rbac/
[4]: ../operations/control-access/rbac#default-users
[5]: ../operations/control-access/rbac#create-users
[6]: ../operations/control-access/rbac/#users
[7]: ../api/other/auth/
[8]: ../operations/maintain-sensu/troubleshoot/#web-ui-errors
[9]: ../web-ui/webconfig-reference/#license_expiry_reminder
[10]: ../operations/maintain-sensu/troubleshoot/#service-logging
