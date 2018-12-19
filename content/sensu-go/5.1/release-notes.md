---
title: "Sensu Go release notes"
linkTitle: "Release Notes"
description: "Release notes for Sensu Go"
product: "Sensu Go"
version: "5.1"
menu: "sensu-go-5.1"
---

- [5.1.0 Release Notes](#5-1-0-release-notes)
- [5.0.1 Release Notes](#5-0-1-release-notes)
- [5.0.0 Release Notes](#5-0-0-release-notes)

### Versioning
Sensu Go adheres to [semantic versioning](https://semver.org/spec/v2.0.0.html) using MAJOR.MINOR.PATCH release numbers, starting at 5.0.0. MAJOR version changes indicate incompatible API changes; MINOR versions add backwards-compatible functionality; PATCH versions include backwards-compatible bug fixes.

### Upgrading

To upgrade to the latest version of Sensu Go from version 5.0.0 or later, first [install the latest packages][8].

Then restart the services.

_NOTE: For systems using `systemd`, run `sudo systemctl daemon-reload` before restarting the services._

{{< highlight shell >}}
# Restart the Sensu agent
sudo service sensu-agent restart

# Restart the Sensu backend
sudo service sensu-backend restart
{{< /highlight >}}

You can use the `version` command to determine the installed version using the `sensu-agent`, `sensu-backend`, and `sensuctl` tools. For example: `sensu-backend version`.

---

## 5.1.0 Release Notes

**December 19, 2018** &mdash; We’re excited to announce the latest version of Sensu Go! Please read on for the detailed release goodness and peruse the changelog [here][changelog].

### Upgrading Instructions:

For 5.1.0, we made necessary breaking changes that will require upgrade instructions in some cases:

- For Sensu backend binaries, the default `state-dir` in 5.1.0 is now `/var/lib/sensu/sensu-backend` instead of `/var/lib/sensu`.
  To upgrade your Sensu backend binary to 5.1.0, first [download the latest version][23], then make sure the `/etc/sensu/backend.yml` configuration file specifies a `state-dir`.
  To continue using `/var/lib/sensu` as the `state-dir`, add the following configuration to `/etc/sensu/backend.yml`.

_NOTE: This only affects users who are not using the provided RPM or DEB packages, or who do not have an existing `state-dir` setting in their `/etc/sensu/backend.yml`."_

See the [upgrade guide][10] for more information.

### Upgrading Sensu backend binaries to 5.1.0

_NOTE: This applies only to Sensu backend binaries downloaded from `s3-us-west-2.amazonaws.com/sensu.io/sensu-go`, not to Sensu RPM or DEB packages._

For Sensu backend binaries, the default `state-dir` in 5.1.0 is now `/var/lib/sensu/sensu-backend` instead of `/var/lib/sensu`.
To upgrade your Sensu backend binary to 5.1.0, first [download the latest version][23], then make sure the `/etc/sensu/backend.yml` configuration file specifies a `state-dir`.
To continue using `/var/lib/sensu` as the `state-dir`, add the following configuration to `/etc/sensu/backend.yml`.

{{< highlight yml >}}
# /etc/sensu/backend.yml configuration to store backend data at /var/lib/sensu
state-dir: "/var/lib/sensu"
{{< /highlight >}}

Then restart the backend.

See the [upgrade guide][10] for more information.

### CHANGES {#5.1.0-changes}

**IMPROVEMENTS:**

  - Added support for Ubuntu 14.04
  - Agents have been updated to include configuration flags to give you greater flexibility with certificates when connecting to the backend over TLS. 

**FIXES:**

  - The Sensu backend now successfully connects to an external etcd cluster without creating a panic.
  - SysVinit scripts for the Sensu agent and backend now include correct run and log paths.
  - Once created, keepalive alerts and check TTL failure events now continue to occur until a successful  evrved.
  - When querying for an empty list of assets, sensuctl and the Sensu API now return an empty array instead   ofThe sensuctl `create` command now successfully creates hooks when provided with the correct definition.
  - The Sensu dashboard now renders status icons correctly in Firefox.

We love to hear from you! Please feel free to reach out to us [here][contact].

The Sensu Team #monitoringlove 

## 5.0.1 Release Notes

**December 12, 2018** &mdash; Sensu Go 5.0.1 includes our top bug fixes following last week's general availability release.

### CHANGES {#5.0.1-changes}

- **FIXED**: The Sensu backend can now successfully connect to an external etcd cluster.
- **FIXED**: The Sensu dashboard now sorts silencing entries in ascending order, correctly displays status values, and reduces shuffling in the event list.
- **FIXED**: Sensu agents on Windows now execute command arguments correctly.
- **FIXED**: Sensu agents now correctly include environment variables when executing checks.
- **FIXED**: Command arguments are no longer escaped on Windows.
- **FIXED**: Sensu backend environments now include handler and mutator execution requests.

## 5.0.0 Release Notes

**December 5, 2018** &mdash; It’s here! This marks the inaugural stable release of Sensu Go. 

We’ve got a lot of awesome functionality and new features to share. Here are a few highlights:

- Updated [Sensu UI][1] built in with the backend 
- [sensuctl][2], our new command-line tool for managing all things Sensu 
- A slick new versioned [API][3]
- True multi-tenancy with the switch to [namespaces][4] and [RBAC][5], modeled after Kubernetes 
- Enhanced [event filtering][6] with JavaScript for managing event flows 
- Object metadata, which replaces custom attributes and offers a richer way to interact with your data 
- Built-in support for [StatsD metric collection][7] 
- Embedded transport and etcd datastore to replace RabbitMQ and Redis

All this and more is included in our general availability [release changelog][changelog] and [announcement][blog].
The team has been working incredibly hard for two years, and we couldn’t be more excited to get this awesome, next-gen product into your hands! 

Happy monitoring, 

The Sensu Team 

[changelog]: https://github.com/sensu/sensu-go/blob/master/CHANGELOG.md
[contact]: https://sensu.io/contact
[blog]: https://blog.sensu.io/sensu-go-is-here
[1]: /sensu-go/5.0/dashboard/overview
[2]: /sensu-go/5.0/sensuctl/reference
[3]: /sensu-go/5.0/api/overview
[4]: /sensu-go/5.0/reference/rbac#namespaces
[5]: /sensu-go/5.0/reference/rbac
[6]: /sensu-go/5.0/reference/filters
[7]: /sensu-go/5.0/guides/aggregate-metrics-statsd
[8]: /sensu-go/5.0/installation/install-sensu
[9]: /sensu-go/5.1/reference/agent
[10]: /sensu-go/5.1/installation/upgrade#upgrading-sensu-backend-binaries-to-5-1-0
