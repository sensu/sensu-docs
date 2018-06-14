---
title: "Developer Guidelines"
date: 2017-10-26T10:36:53-07:00
description: ""
weight: 4
product: "Plugins"
version: "1.0"
menu: "plugins-1.0"
---

**Table of Contents**

- [Naming Conventions](#naming-conventions)
- [Coding Style](#coding-style)
- [Copyright and Licensing](#copyright-and-licensing)
- [Documentation](#documentation)
    - [Changelog](#changelog)
- [Dependency Management](#dependency-management)
- [Issue and Pull Request Submissions](#issue-and-pull-request-submissions)
- [Gem Metadata](#gem-metadata)
- [Additional Information](#additional-information)

## Naming Conventions
- All binaries should start with either **handler**, **check**, **metrics**, or **mutator** depending on their primary function.  This is done to ensure that a user can tell from the command what the primary action of the script is.  It also makes things easier for infrastructure tools.
- The name's of scripts should use dashes to separate words and contain an extension (`.rb`, `.sh`, `.exe`, `etc).  Extensions are unfortunately necessary for Sensu to be able to directly exec plugins and handlers on Windows.  All scripts should also be made executable using `chmod +x plugin` or a similar method.  There is a rake task that is run by Travis that will automatically make all files in _/bin_ executable if this is not done.
- Any repos created need to follow the format of *sensu-plugins-app*, where *app* is the name such as windows, disk-checks, or influxdb.  The exception to the rule are repos used for the site or tooling such as GIR or sensu-plugins.github.io.  This is done so that the rake tasks and other automation tools can easily parse Github and effectively work with the 150+ repos.

## Coding Style
- When developing plugins please use the [sensu plugin class][1], this ensures all plugins have an identical run structure.
- When using options please use the following structure.  At the very least the option needs to include a description to assist the user with configuration and deployment.

{{< highlight ruby >}}
option :port,
       short: '-p PORT',
       long: '--port PORT',
       description: 'Port',
{{< /highlight >}}

- Each script should use the following standard header:

{{< highlight ruby >}}
#! /usr/bin/env ruby
#
#   <script name>
#
# DESCRIPTION:
#
# OUTPUT:
#   plain text, metric data, etc
#
# PLATFORMS:
#   Linux, Windows, BSD, Solaris, etc
#
# DEPENDENCIES:
#   gem: sensu-plugin
#
# USAGE:
#
# NOTES:
#
# LICENSE:
#   <your name>  <your email>
#   Released under the same terms as Sensu (the MIT license); see LICENSE
#   for details.
#
{{< /highlight >}}

When at all possible preference is given to pure Ruby implementations.  There should only be system or platform dependencies in the specific gems that use them such as *sensu-plugins-windows*.

## Copyright and Licensing
The preferred license for all code associated with the project is the [MIT License][15], other compatible licenses can certainly be looked at by the community as whole.

Any code that is written is owned by the developer and as such the copyright, if they desire, should be set to themselves.  This is an open source project and built upon the collective code of all who contribute, no one person or entity owns everything.  If for whatever reason they wish to not assign copyright to themselves then it can be assigned to *sensu-plugins*.

## Documentation
All documentation will be handled by [Yard][2] using the default markup at this time. A brief introduction to Yard markup can be found [here][3]. All scripts should have as much documentation coverage as possible, ideally 100%.  Coverage can be tested by installing Yard locally and running

{{< highlight bash >}}
rake yard
{{< /highlight >}}

### Changelog
The change log should follow the format listed [here][20].  Please keep this changelog up to date, if you make changes to the repo and submit a PR please update the changelog accordingly.  Please follow the guidelines below when updating the changelog with respect to which number to bump.

## Dependency Management
Dependencies (ruby gems, packages, etc) and other requirements should be declared in the header of the plugin and more importantly in the gemspec.  Try to use the standard library or the same dependencies as other plugins to keep the stack as small as possible.  Questions about using a specific gem feel can be opened as issues on Github or feel free to ask the mailing list.

## Issue and Pull Request Submissions
If you see something wrong or come across a bug please open up an issue, try to include as much data in the issue as possible.  If you feel the issue is critical than tag a team member and we will respond as soon as is feasible.

Pull requests need to follow the guidelines below for the quickest possible merge.  These not only make our lives easier, but also keep the repo and commit history as clean as possible.
- Please do a  `git pull --rebase` both before you start working on the repo and then before you commit.  This will help ensure the most up to date codebase, Rubocop rules, and documentation is available.  It will also go along way towards cutting down or eliminating(hopefully) annoying merge commits.
- The CHANGELOG follows the standard conventions laid out [here][20]. Every PR has to include an updated CHANGELOG and README (if needed), this makes our lives eaiser, increases the accuracy of the codebase, and gets your PR deployed much faster.
- When updating the version in the changelog please keep the following in mind
    - the patch version is for any **non-breaking** changes to existing scripts or the addition of minor functionality to existing scripts
    - the minor version is for the addition of **any* new scripts.  Even though this is generally non-breaking, it is a major change to the gem and should be indicitated as such
    - the major version should only be bumped by a core contributor.  This is for major breaking or non-breaking changes that affect widespreadspread functionality.  Examples of this would be a wholesale refactor of the repo or a switch away from an established method such as going from SOAP to REST across multiple checks.
- All new scripts, modules, or classes must be fully tested. There are well documented examples in the [pagerduty][21] plugin

Tracking the status of your PR or issue, or seeing all open tickets in the org regardless of repo is simple using Github [filters][16].  To get started click on the Github logo in the upper left and select either _Pull Requests_ or _Issues_.  In the search box you will see several terms predefined for you, change **author:name** to **user:sensu-plugins** to see across the entire org.

Please do not not abandon your pull request, only you can help us merge it. We will wait for feedback from you on your pull request for up to sixty days. A lack of feedback in after this may require you to re-open your pull request.

If you would like to make a pull request and the repo does not already exist then please feel free to directly contact a member of the team using our public email address or open an issue in the [Feature Request][19] repo and we will create a repo for you. As a general rule if you ask to have a repo created you will also be given write access to it by default.

## Gem Metadata
Each gem has metadata that can easily be queried and is designed to allow a user or contributor to get a good quick read on the current status of the gem and how stable it is.  This functions much like the Milestone idea that Logstash plugins are built around, thanks goes out to @hatt for suggesting this.

`s.metadata = { 'maintainer' => ''}`

The maintainer field can be anyone, feel free to reach out to the team about adding your github handle to the gem and assuming 'ownership' of it.  Many of these plugins require specialized knowledge and by their very nature many people depend upon them to be high quality.

`s.metadata               = { 'development_status' => ''}`

The development_status filed allows users know the development state of a plugin:

**active** => active development is on going by a developer or maintainer

**maintenance** => no active refactoring or development but someone is watching out for any new pr's or things to do.

**unmaintained** => the community as a whole is keeping an eye on this but no one has staked a claim to it (most plugins will end up here)

`s.metadata = { 'production_status' => ''}`

The production_status field gives a quick glance on whether the gem should be used for production grade monitoring or if some review and care should be taken.

**production grade** => near 100% rspec and yardoc coverage

**stable - review recommended** => incomplete rspec and yardoc coverage

**stable - review required** => little/no rspec and/or yardoc coverage

**unstable - testing recommended** => throw stuff at the wall and hope it sticks (currently most gems are here)

### Additional Information
[Testing](../testing) [Build and Release Tools and Pipeline](../release_process)

[1]: https://github.com/sensu/sensu-plugin
[2]: http://yardoc.org/
[3]: http://www.rubydoc.info/gems/yard/file/docs/GettingStarted.md
[4]: https://github.com/sensu-plugins/GIR/blob/master/files/templates/gem/Vagrantfile.erb
[5]: https://www.vagrantup.com/
[6]: https://github.com/sensu-plugins/GIR/blob/master/files/templates/gem/rubocop.yml.erb
[7]: https://github.com/sensu-plugins/GIR/blob/master/files/templates/gem/travis.yml.erb
[8]: https://github.com/sensu-plugins/GIR/blob/master/files/templates/gem/Rakefile.erb
[9]: https://github.com/sensu/sensu-plugin-spec
[10]: https://github.com/orgs/sensu-plugins/people
[11]: http://sensu-plugins.github.io/development/gir
[12]: https://waffle.io/sensu-plugins/sensu-plugins.github.io
[13]: https://github.com/sensu-plugins/documentation
[14]: https://github.com/sensu-plugins/documentation/blob/master/tools/gir_v2.md
[15]: http://opensource.org/licenses/MIT
[16]: https://help.github.com/articles/searching-issues/
[18]: https://travis-ci.org/
[19]: https://github.com/sensu-plugins/sensu-plugins-feature-requests
[20]: http://keepachangelog.com/
[21]: https://github.com/sensu-plugins/sensu-plugins-pagerduty
