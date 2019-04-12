---
title: "Dashboard overview"
linkTitle: "Overview"
description: "The Sensu backend includes the Sensu dashboard: a unified view of your events, entities, and checks with user-friendly tools to reduce alert fatigue. Read the doc to get started using the dashboard."
weight: 120
version: "5.5"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-5.5:
    parent: dashboard
---

The Sensu backend includes the **Sensu dashboard**:
a unified view of your events, entities, and checks with user-friendly tools to reduce alert fatigue.

<div style="text-align:center">
<img src="/images/homepage.png" alt="Sensu dashboard homepage" width="750">
</div>

<p style="text-align:center"><i>Sensu dashboard homepage</i></p>

### Accessing the dashboard
After [starting the Sensu backend][1], you can access the dashboard in your browser
by visiting http://localhost:3000. You may need to replace `localhost` with the
hostname or IP address where the Sensu backend is running.

### Signing in
Sign in to the dashboard with your [sensuctl][2] username and password.
See the [role-based access control reference][3] for [default user credentials][4] and instructions for [creating new users][5].

### Namespaces
The dashboard displays events, entities, checks, and silences for a single namespace at a time.
By default, the dashboard displays the `default` namespace.
To switch namespaces, select the menu icon in the upper-left corner, and choose a namespace from the dropdown.

<img src="/images/dashboard-namespace-switcher.png" alt="Screenshot of the Sensu dashboard namespace switcher">

<p style="text-align:center"><i>Sensu dashboard namespace switcher</i></p>

### Themes
Use the preferences menu to change the theme or switch to the dark theme.

[1]: ../../reference/backend#restarting-the-service
[2]: ../../sensuctl/reference/
[3]: ../../reference/rbac
[4]: ../../reference/rbac#default-user
[5]: ../../reference/rbac#creating-a-user
