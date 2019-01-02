---
title: "Sensu Go release notes"
linkTitle: "Release Notes"
description: "Release notes for Sensu Go"
product: "Sensu Go"
version: "5.0"
menu: "sensu-go-5.0"
aliases:
  - /sensu-go/5.0/changelog
---

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
[blog]: https://blog.sensu.io/sensu-go-is-here
[1]: /sensu-go/5.0/dashboard/overview
[2]: /sensu-go/5.0/sensuctl/reference
[3]: /sensu-go/5.0/api/overview
[4]: /sensu-go/5.0/reference/rbac#namespaces
[5]: /sensu-go/5.0/reference/rbac
[6]: /sensu-go/5.0/reference/filters
[7]: /sensu-go/5.0/guides/aggregate-metrics-statsd
[8]: /sensu-go/5.0/installation/install-sensu
