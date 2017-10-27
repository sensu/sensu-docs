---
title: "Getting Started"
date: 2017-10-26T10:52:11-07:00
description: ""
weight: 5
product: "Plugins"
version: "2.3"
menu: "plugins-2.3"
---

**Table of Contents**

- [Infrastructure](#Infrastructure)
    - [Github](#github)
    - [Trello](#trello)
    - [Website](#website)
- [Policies](#policies)
    - [Organization Access](#organization-access)
    - [Organization Structure](#organization-structure)

## Sensu-Plugin Org Guidelines

### Infrastructure

#### Github

Github and the issues and milestones within it are the primary way the project is managed.  All plugin repositories are created from a standard template using a rake task to ensure that they remain consistent and manageable at an organization level.  There are currently five teams in the org:

* Owners - unrestricted access to the org and all repos
* Admins - write access to all repos except core infrastructure
* Contributors - write access to all plugin repos
* Core Infra - write access to sensu-plugin, sensu-plugin-spec, GIR, Kryten, sensu-plugin.github.io, tom_servo, and the hubots
* Documentation - write access to the documentation repo

**Note**

Members in the Owners or Core Infra team must provide a voice number.  Due to the permissions and far reaching affect of these teams security practices are heavily enforced and any compromises must be dealt with immediately.

#### Trello

There is a public Trello [board](https://trello.com/b/QjkJ8CS3/sensu-community-plugins) used for communicating various project wide items. This is still a work in progress but it works for now.  Ideas are always welcome.

#### Website

[sensu-plugins.io](http://sensu-plugins.io/)


### Policies

This is a volunteer project and as such comitters are free to come and go.  No one is required to do any amount of work to continue as a comitter, some days you may do a ton of work or you may be on vacation or doing something that pays the bills for several weeks.  No worries.

#### Organization Access

This is a public organization and as such anyone may join the only requirements are a firm belief in treating your infrastructure as code and 2FA on your github account.

#### Organization Structure

Becoming a member of each of these groups and teams is an open decision.  You may be invited by any member of the team and the majority of the other team members can approve.  There is no time limit before being invited into a team and no set amount of work that needs to be accomplished once you are in a team. You may also request to be given commit bit by openning an issue in a repo and mentioning an existing commiter. We will then be happy to start a dialogue with you.

For security purposes though if you have not made any contributions in the last 6 months, you may be removed from a team and can request access again at any time by reaching out and contacting an existing team member.

Any membership issues will be resolved by members of the Admin group after consultation with all parties in a public forumn. If either party feels the issue is not resolved then they may reach out privately or publicly to either Matt Jones or Sean Porter or another member of the Owners group for assistance. Their decisions are final.

**core committer**

A committer who has read access to all public and private repos including these specific privilages:

* Can push directly to Github and RubyGems
* Access to the sensu-plugin bot account
* Access to the slack channel
* Access to the Google Apps account
* Access to the Twitter account
 
**Any member of this group must also provide a voice number that they can be reached at.  Due to the widespread permissions, security practices are heavily enforced and any compromises must be dealt with immediately.**

**committer**

A commiter who has push access to all plugin repos. They can either be a member of a team or be granted rights to specific repos using Github's contributor org permissions.
They also have the following privilages after 6 months of continued effort or a demostrated need:

* Discount to Tower2 OSX Git Client
* Access to DO droplets for testing
* Open Source License to various Jet Brains IDE's
* The ability to have an email address `@sensu-plugins.io` (restrictions apply) 
* The ability to become a member of the Sensu-Plugins Google Apps Org
* An invitation to the Sensu Slack org  (restrictions apply) 

**contributor**

A Github user who has had one or more merges committed to any repo but does not yet have push access to a repo.
