---
title: "Roadmap"
date: 2017-10-26T10:31:16-07:00
description: "Sensu plugins project roadmap"
weight: 3
product: "Plugins"
version: "1.0"
menu: "plugins-1.0"
---

## Overview

<!--TODO clean this whole thing up.-->

There are big plans in store for the sensu-plugins.  Not just in terms of code but in terms of community involvement and scope.  Some of these are fairly far off, some are nearing completion.


- Migration of content
- Production readiness of plugins
- Preparation for Sensu 2.0


### Community Involvement

**Umbrella Org**

Sensu itself is a framework and the plugins are just one piece of it.  Many of the companies that use Sensu have created custom workflows, checks, and handlers, then open sourced them.  These could solve another user's problem but if the user doesn't know about them it won't do them any good.

### Website

**Plugin Directory**

With the split of the community repo in ~200 separate repos, users may have a hard time finding a particular monitor or know that a monitor or handler for a service already exists. There should be a directory we can point them to that will offer this functionality in a clean manner. The directory should be updated automatically upon the release of a new gem, GitHub tag, or repo. Consideration will need to be given for the rate-limiting that is inherent with Github.

There is still a lot of talk going on around this but Travis, GH hooks, and Sinatra are fairly high on the tool list.

**Configuration Management Tool**

With the split of the community repo in ~150 separate repos, users may have a hard time finding a particular monitor or know that a monitor or handler for a service already exists. It would be nice for a user to be able to query a db and get back a list of gems to install to monitor their system. For example a user wants to setup baseline monitoring but has no idea what to install for gems. They would type in baseline and get back a list of packages whose metadata matches baseline.

There is still a lot of talk going on around this but Travis, GH hooks, and Sinatra are fairly high on the tool list.

### Help Wanted

Grab a repo and come play.  If you have another thought on something related then by all means reach out to someone on the team. Until then,

much #monitoringlove,

sensu-plugins admins
