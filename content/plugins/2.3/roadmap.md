---
title: "Roadmap"
date: 2017-10-26T10:31:16-07:00
description: ""
weight: 3
product: "Plugins"
version: "2.3"
menu: "plugins-2.3"
---

## Overview

There are big plans in store for the sensu-plugins.  Not just in terms of code but in terms of community involvement and scope.  Some of these are fairly far off, some are nearing completion.

### Community Involvement

**Umbrella Org**

Sensu itself is a framework and the plugins are just one piece of it.  Many of the companies that use Sensu have created custom workflows, checks, and handlers, then open sourced them.  These could solve another user's problem but if the user doesn't know about them it won't do them any good.

The thought here is to have a central location where other companies and individuals can list their code for all to use.  There would be few conditions surrounding this and it will give people a chance to see how others have implemented or modified existing solutions.  These companies wouldn't have to go through the PR process as they would be considered unoffical, externally maintained projects, and they would retain full control of the code, yet be able to share it and get greater feedback.  There are are lot of things to still work out and think about but its on the table.

### Planned Features

**Arch Independent Code**

One of the big pushes will be for arch independent code.  A short coming of other major monitoring solutions is the lack of real platform independence.  This is a high priority and is something that is always in consideration.  Many of the disk and process checks have already been refactored to achieve this and more are in progress.

There will always be platform dependent checks such as linux kernel monitors or Windows event monitors but the more the number of these that can be reduced the better.

**Wider Platform Testing**

Due to constraints with Travis we are only able to run automated tests against OSX10.9 and Ubuntu LTS.  We are working on a workflow that will allow use to run automated tests against multiple OS's and platforms including

* OSX10.8
* OSX10.9
* OSX10.10
* FreeBSD (latest LTS and N-1)
* Ubuntu (latest LTS and N-1)
* RHEL/CentOs 5.x
* RHEL/CentOs 6.x
* RHEL/CentOs 7.x
* Debian (latest stable and N-1)
* Suse (latest stable and N-1)
* Solaris (maybe)
* Windows 2k8
* Windows 2k12

Due to the scope of this and the resources necessary, it will be a long time coming but talks around this are slowly becoming action.

**Official BSD Support**

Ruby is just ruby, is should not matter the platform.  With that being said support for sensu-plugins on FreeBSD9.2 and 10.1 is coming shortly.  Several of the repo' have Vagrantboxes for these platforms, so one could test functionality on their own before installing the gem in their environment.

### Website

**Plugin Directory**

With the split of the community repo in ~150 separate repos, users may have a hard time finding a particular monitor or know that a monitor or handler for a service already exists. There should be a directory we can point them to that will offer this functionality in a clean manner. The directory should be updated automatically upon the release of a new gem, github tag, or repo. Consideration will need to be given for the rate-limiting that is inherent with Github.

There is still a lot of talk going on around this but Travis, GH hooks, and sinatra and fairly high on the tool list.

**Configuration Mgmt Tool**

With the split of the community repo in ~150 separate repos, users may have a hard time finding a particular monitor or know that a monitor or handler for a service already exists. It would be nice for a user to be able to query a db and get back a list of gems to install to monitor their system. For example a user wants to setup baseline monitoring but has no idea what to install for gems. They would type in baseline and get back a list of packages whose metadata matches baseline.

There is still a lot of talk going on around this but Travis, GH hooks, and sinatra and fairly high on the tool list. I, @mattyjones, would love to use golang for this and the directory but that may be extreme overkill.

Note:  I personally, @mattjones, **hate** gui configuration management tools and this almost falls in the realm of it but if done properly and effectively it could avoid becoming a beast of burden that needs to be put to sleep.  I leave it up to the community to figure out what they want.  I just know there has to be a better way.

### Help Wanted

Grab a repo and come play.  If you have another thought on something related then by all means reach out to someone on the team. Until then

much #monitoringlove,

sensu-plugins admins
