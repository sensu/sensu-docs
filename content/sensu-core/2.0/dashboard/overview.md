---
title: "Dashboard Overview"
linkTitle: "Overview"
weight: 120
version: "2.0"
product: "Sensu Core"
platformContent: false
menu:
  sensu-core-2.0:
    parent: dashboard
---

The Sensu backend includes the **Sensu dashboard**:
a unified view of your events, entities, and checks with user-friendly tools to reduce alert fatigue.

![Sensu dashboard events view](/images/dashboard-events.png)

### Accessing the Dashboard
After [starting the Sensu backend][1], you can access the dashboard at http://localhost:3000.
By default, the dashboard is available at http://127.0.0.1:3000.

### Signing In
Sign in to the dashboard with your sensuctl username and password.
If you haven't [configured sensuctl][2], you can sign in as the
default read-only user (username: `sensu`, password: `sensu`).

### Themes
Use the Preferences menu to change the theme or switch to the dark theme.

[1]: ../../getting-started/installation-and-configuration/#starting-the-services
[2]: ../../getting-started/configuring-sensuctl
