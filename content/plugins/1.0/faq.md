---
title: "FAQ"
date: 2017-10-26T09:27:53-07:00
description: "Frequently asked questions about Sensu plugins"
weight: 2
product: "Plugins"
version: "1.0"
menu: "plugins-1.0"
---

### Why did you split the repos?

This was done to simplify the deployment and delivery process.  When working with a repo as diverse as the community-plugins it's very hard to version and deploy it in the methods that we all would like.  Splitting the repo into smaller pieces makes this much easier and more manageable in the long run.

### Why are the repos named this way?

The repos are named based up the application, product, or function they are associated with.  This means that if you use apache, you need only install the *sensu-plugins-apache* gem or clone the repo.  When it comes to handlers and mutators the same convention was used so that in the future if a check is added the repo name won't change.  *Sensu-plugins-pagerduty* is a great example, it may only contain handlers at this time but if in the future we want to add a check of an endpoint we don't need to do anything more than bump the version and update the docs.

Besides, having a standard naming convention makes automation and deployment tools very happy and we all use them, right?

### How do I know what a repo contains?

One of the conditions for dropping the prerelease or alpha tag will be a complete README that will include a list of all binaries and what each one does, [sensu-plugins-disk-checks][1] does this now.

### Why did you change the filenames and why name them this way?

One of the overriding issues is that there should be a standard naming scheme for the entire framework.  It is very hard to effectively automate something if the pieces are scattered or named differently.  As of now the current names are here to stay.

### What about tests, how do I know a plugin works as designed?

Tests are coming, that is one of the core requirements for stability and production grade.  Tests are hard to write for some of these things given the very specific nature of them and most of us have other jobs so we can only contribute so much.

### How do I use this handler, deploy this check?

The readme will contain sample configs and commands.  Many of the plugins also have a header that contains specific details.  If this is lacking ask in [Slack](https://slack.sensu.io) or on the [mailing list](https://groups.google.com/forum/#!forum/sensu-users) and someone will be able to assist you.

### Will the community-plugins repo be deleted and if so when?

No!  It will be frozen in place at a date TBD, most likely sometime Fall 2015 although that is a moving target and dependent upon a lot of things.

### How should I deploy the new plugins?

If a gem exists then that would be the best way.  Instructions for installing it can be found in the README of the repo or [here][2].  If no gem exists yet, then you can attempt to build one based upon the gemspec.  You can also install straight from source.

All repos have releases, you can just download the latest tarball or zip file, cloning the master branch is not recommended, supported and never will be.  Unless it's a breaking change, the repo will not contain feature branches, everything will be pushed to master.  You have been warned.

### Checks are invasive how do I know they haven't been tampered with?

All gems will be signed and each repo will contain the public key.  If you are really concerned you could just inspect the code yourself as well before deployment.

### Will you be targeting other pkg management systems?

Not at this time, due to the design of Sensu, gems are the best choice.  RPM's and Deb packages have not been ruled out but the manpower to create them is just not there at this time.  If you have a very strong interest in this drop us a line and we can chat some more.

### Are the gems dependent upon Rubygems?

No

### What is the policy on supporting end-of-life(EOL) Ruby versions?

We will target all non EOL Ruby versions, please check the link below the see the current EOL version.

https://www.ruby-lang.org/en/downloads/branches/

### What versions or Ruby do you test against?

We strive to test on all non-EOL versions. It can take time to add new versions to all plugins.

### What do you use for linting?

Rubocop

Details are in .rubocop.yml within the root of each repo and in the [developer guidelines][3].

### What do you use for testing?

RSpec

[1]: https://github.com/sensu-plugins/sensu-plugins-disk-checks
[2]: installation
[3]: developer-guidelines
