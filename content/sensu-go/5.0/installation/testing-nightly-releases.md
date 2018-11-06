---
title: "Testing Nightly Releases"
linkTitle: "Testing Nightly Releases"
description: "The Sensu Core installation guide."
weight: 4
version: "5.0"
product: "Sensu Go"
menu:
  sensu-go-5.0:
    parent: installation
aliases:
  - /sensu-go/5.0/getting-started/testing-nightly-releases/
---

_WARNING: Sensu nightly releases are your first chance to try out new
features and bug fixes. Please be aware that you may be the first to
discover an issue. Therefore we don't recommend using a nightly release in
production._

Testing and using a Sensu nightly release involves using a different package repository.
You should only be using nightly releases if you already have experience installing and
managing a Sensu installation.

_NOTE: The Sensu nightly repository instructions replace the
existing Sensu repository configuration files, you will need to revert
these changes in order to return to using stable releases._

Please uninstall and purge any previous Sensu 2.x packages before
switching to the nightly repositories.

### Ubuntu/Debian

Add the Sensu nightly repository.

{{< highlight shell >}}
curl -s https://packagecloud.io/install/repositories/sensu/nightly/script.deb.sh | sudo bash
{{< /highlight >}}

Continue with the instructions to [install the backend][1], [install the agent][2], and [install sensuctl][3].

### RHEL/CentOS

Add the Sensu nightly repository.

{{< highlight shell >}}
curl -s https://packagecloud.io/install/repositories/sensu/nightly/script.rpm.sh | sudo bash
{{< /highlight >}}

Continue with the instructions to [install the backend][1], [install the agent][2], and [install sensuctl][3].

### Docker

To deploy nightly releases of Sensu using Docker, follow the instructions to [deploy Sensu with Docker][4], and replace `sensu/sensu:latest` with `sensu/sensu:nightly`.

[1]: ../installation-and-configuration/#install-the-sensu-backend 
[2]: ../installation-and-configuration/#install-the-sensu-agent
[3]: ../installation-and-configuration/#install-sensuctl
[4]: ../installation-and-configuration/#deploy-sensu-with-docker
