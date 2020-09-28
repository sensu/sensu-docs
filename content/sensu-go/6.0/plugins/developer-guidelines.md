---
title: "Developer guidelines"
linkTitle: "Developer Guidelines"
description: "Here are the developer guidelines for creating Sensu plugins in Sensu 1.x. In this doc, you’ll learn about naming conventions, coding style, copyright and licensing, documentation, and much more. Read on for the full list of guidelines."
weight: 30
version: "6.0"
product: "Sensu Go"
menu:
  sensu-go-6.0:
    parent: plugins
---

## Naming conventions

All binaries should start with either **handler**, **check**, **metrics**, or **mutator** depending on their primary function.
This ensures that users can tell from the command what the primary action of the script is.
It also makes things easier for infrastructure tools.

The names of scripts should use dashes to separate words and contain an extension (`.rb`, `.sh`, `.exe`, etc).
Extensions are unfortunately necessary for Sensu to be able to directly exec plugins and handlers on Windows.
All scripts should also be made executable using `chmod +x plugin` or a similar method.
A rake task run by Travis will automatically make all files in _/bin_ executable if this is not done.

Any repos you create must follow the format of *sensu-plugins-app*, where *app* is the name such as windows, disk-checks, or influxdb.
The exception to the rule are repos used for the site or tooling such as GIR or sensu-plugins.github.io.
This is done so that the rake tasks and other automation tools can easily parse Github and effectively work with the 150+ repos.

## Coding style

When developing plugins please use the [Sensu plugin class][1], this ensures all plugins have an identical run structure.

When using options please use the following structure:

{{< code ruby >}}
option :port,
       short: '-p PORT',
       long: '--port PORT',
       description: 'Port',
{{< /code >}}

Make sure the `option` includes a description to assist users with configuration and deployment.

Each script should use the following standard header:

{{< code ruby >}}
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
{{< /code >}}

When at all possible preference is given to pure Ruby implementations.
There should only be system or platform dependencies in the specific gems that use them such as *sensu-plugins-windows*.

## Copyright and licensing

The preferred license for all code associated with the project is the [MIT License][6].
Other compatible licenses can certainly be looked at by the community as whole.

Any code that is written is owned by the developer and as such the copyright, if they desire, should be set to themselves.

This is an open source project and built upon the collective code of all who contribute.
No one person or entity owns everything.
If for whatever reason you wish to not assign copyright to yourself, it can be assigned to *sensu-plugins*.

## Documentation

All documentation will be handled by [Yard][2] using the default markup at this time.
A brief introduction to Yard markup can be found [here][3].
All scripts should have as much documentation coverage as possible, ideally 100%.
Test coverage by installing Yard locally and running:

{{< code bash >}}
rake yard
{{< /code >}}

### Changelog

The changelog should follow the format listed [here][9].
Please keep the changelog up-to-date.
If you make changes to the repo and submit a PR please update the changelog accordingly.

Please follow the guidelines below when updating the changelog with respect to which number to bump.

## Dependency management

Dependencies (ruby gems, packages, etc) and other requirements should be declared in the header of the plugin and more importantly in the gemspec.
Try to use the standard library or the same dependencies as other plugins to keep the stack as small as possible.
Questions about using a specific gem feel can be opened as issues on Github or feel free to ask the mailing list.

## Issue and pull request submissions

If you see something wrong or come across a bug please open up an issue, try to include as much data in the issue as possible.
If you feel the issue is critical than tag a team member and we will respond as soon as is feasible.

Pull requests need to follow the guidelines below for the quickest possible merge.
These not only make our lives easier, but also keep the repo and commit history as clean as possible.

* Please do a  `git pull --rebase` both before you start working on the repo and then before you commit.
This will help ensure the most up to date codebase, Rubocop rules, and documentation is available.
It will also go along way towards cutting down or eliminating(hopefully) annoying merge commits.
* The CHANGELOG follows the standard conventions laid out [here][9].
Every PR has to include an updated CHANGELOG and README (if needed), this makes our lives easier, increases the accuracy of the codebase, and gets your PR deployed much faster.
* When updating the version in the changelog please keep the following in mind:
  * The patch version is for any **non-breaking** changes to existing scripts or the addition of minor functionality to existing scripts
  * The minor version is for the addition of **any* new scripts.  Even though this is generally non-breaking, it is a major change to the gem and should be indicated as such
  * The major version should only be bumped by a core contributor.  This is for major breaking or non-breaking changes that affect widespread functionality. Examples of this would be a wholesale refactor of the repo or a switch away from an established method such as going from SOAP to REST across multiple checks.
* All new scripts, modules, or classes must be fully tested. There are well documented examples in the [pagerduty][10] plugin

Tracking the status of your PR or issue, or seeing all open tickets in the org regardless of repo is simple using Github [filters][7].
To get started click on the Github logo in the upper left and select either _Pull Requests_ or _Issues_.
In the search box you will see several terms predefined for you, change **author:name** to **user:sensu-plugins** to see across the entire org.

Please do not not abandon your pull request, only you can help us merge it.
We will wait for feedback from you on your pull request for up to 60 days.
A lack of feedback in after this may require you to re-open your pull request.

If you would like to make a pull request and the repo does not already exist then please feel free to directly contact a member of the team using our public email address or open an issue in the [Feature Request][8] repo and we will create a repo for you.
As a general rule if you ask to have a repo created you will also be given write access to it by default.

## Sensu-plugin organization guidelines

### Infrastructure

Github and the issues and milestones within it are the primary way the project is managed.
All plugin repositories are created from a standard template using a rake task to ensure that they remain consistent and manageable at an organization level.

There are currently five teams in the [sensu-plugins org][13]:

- Owners: unrestricted access to the org and all repos
- Admins: write access to all repos except core infrastructure
- Contributors: write access to all plugin repos
- Core Infra: write access to sensu-plugin, sensu-plugin-spec, GIR, Kryten, sensu-plugin.github.io, tom_servo, and the hubots
- Documentation: write access to the documentation repo

Members of the Owners and Core Infra teams must provide a voice number.
Due to the widespread permissions and far-reaching effects of these teams, we enforce security practices and handle compromises immediately.

We use the [Community Github repo][14] for communicating any project-wide items.

### Policies

This is a volunteer project and as such committers are free to come and go.
No one is required to do any amount of work to continue as a committer, some days you may do a ton of work or you may be on vacation or doing something that pays the bills for several weeks.
No worries.

#### Access

This is a public organization and as such anyone may join the only requirements are a firm belief in treating your infrastructure as code and 2FA on your GitHub account.

#### Organization structure

Becoming a member of each of these groups and teams is an open decision. 
You may be invited by any member of the team and the majority of the other team members can approve.
There is no time limit before being invited into a team and no set amount of work that needs to be accomplished once you are in a team.
You may also request to be given commit bit by opening an issue in a repo and mentioning an existing committer.
We will then be happy to start a dialogue with you.

For security purposes though if you have not made any contributions in the last 6 months, you may be removed from a team and can request access again at any time by reaching out and contacting an existing team member.

Any membership issues will be resolved by members of the Admin group after consultation with all parties in a public forum.
If either party feels the issue is not resolved then they may reach out privately or publicly to either Matt Jones or Sean Porter or another member of the Owners group for assistance.
Their decisions are final.

### Role definitions

**core committer**

A committer who has read access to all public and private repos including these specific privileges:

- Can push directly to Github and RubyGems
- Access to the sensu-plugin bot account
- Access to the slack channel
- Access to the Google Apps account
- Access to the Twitter account
 
All core committers must provide a voice number where they can be reached.
Due to the widespread permissions and far-reaching effects of these teams, we enforce security practices and handle compromises immediately.

**committer**

A committer who has push access to all plugin repos.
They can either be a member of a team or be granted rights to specific repos using Github's contributor org permissions.
They also have the following privileges after 6 months of continued effort or a demonstrated need:

* Discount to Tower2 OSX Git Client
* Access to DO droplets for testing
* Open Source License to various Jet Brains IDEs
* The ability to have an email address `@sensu-plugins.io` (restrictions apply) 
* The ability to become a member of the Sensu-Plugins Google Apps Org
* An invitation to the Sensu Slack org  (restrictions apply) 

**contributor**

A GitHub user who has had one or more merges committed to any repo but does not yet have push access to a repo.

## Gem metadata

Each gem has metadata that can easily be queried and is designed to allow a user or contributor to get a good quick read on the current status of the gem and how stable it is.
This functions much like the Milestone idea that Logstash plugins are built around, thanks goes out to @hatt for suggesting this.

`s.metadata = { 'maintainer' => ''}`

The maintainer field can be anyone, feel free to reach out to the team about adding your github handle to the gem and assuming 'ownership' of it.
Many of these plugins require specialized knowledge and by their very nature many people depend upon them to be high quality.

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

## Testing

### Linting

**Only pull requests passing Rubocop will be merged.**

Rubocop is used to lint the ruby plugins.
This is done to standardize the style used within these plugins and ensure high quality code.
Most [current rules][4] are in effect.

No linting is done on Ruby code prior to version 2x.

Ruby 1.9.2 and 1.8.7 support has been dropped, the plugins may still function with these versions but no tests will be run against them nor will code, such as hashes, be specifically written or enforced to ensure backwards compatibility.

Rubocop compliance can be checked by installing the gem and running `rubocop` with the repo.
Running `rubocop -a` will attempt to autocorrect any issues, saving considerable time in large files.

If it truly makes sense for code to violate a rule, disable that rule within the code by either using

{{< code ruby >}}
# rubocop:disable <rule>, <rule>
{{< /code >}}

at the end of the line in violation or

{{< code ruby >}}
rubocop:disable <rule>, <rule>
<code block>
rubocop:enable <rule>, <rule>
{{< /code >}}

If either of these methods are used please mention in the PR as this should be kept to an absolute minimum, at times this can be necessary though, especially concerning method length and complexity.

### Rspec test framework

We use the RSpec3 [test framework][5].
Please add coverage for your check.
Checks will not be considered production grade and stable until they have coverage.
Tests are **not** required though to submit a check, merely encouraged for the benefit of all.

You can run all tests locally using

{{< code bash >}}
rake default
{{< /code >}}

to run all specs and rubocop tests.
RSpec tests are currently run against 2.0, and 2.1.
There are currently no plans to support 1.8.x or test against 1.9.2 and 1.9.3.

This is little bit hard, almost impossible for non-ruby checks.
Let someone from the [team][10] know and maybe can can help.

### Codeship testing pipeline

This pipeline is run upon any commits to the master branch including Pull Request merge commits.
Due to limitations with Codeship, tests are not run across forks and the build logs are not publicly available, just the build status.
If you wish to work on the build pipeline please speak to a team member about necessary access.

**Setup**
{{< code bash >}}
# Deploy the needed keys
cd /tmp
git clone --depth 1 git@github.com:sensu-plugins/tom_servo.git
cd tom_servo
rake setup:setup_env
cd ~/clone
#
# Setup the desired Ruby environments
# Ruby 1.9.3
rvm use 1.9.3 --install
gem install bundler
bundle install
#
# Ruby 2.0
rvm use 2.0 --install
gem install bundler
bundle install
#
# Ruby 2.1
rvm use 2.1 --install
gem install bundler
bundle install
#
# Ruby 2.2
rvm use 2.2 --install
gem install bundler
bundle install
{{< /code >}}

**Test Commands**
{{< code bash>}}
# Ruby 1.9.3
rvm use 1.9.3
bundle exec rake default
gem build *.gemspec
gem install *.gem
#
# Ruby 2.0
rvm use 2.0
bundle exec rake default
gem build *.gemspec
gem install *.gem
#
# Ruby 2.1
rvm use 2.1
bundle exec rake default
gem build *.gemspec
gem install *.gem
#
# Ruby 2.2
rvm use 2.2
bundle exec rake default
gem build *.gemspec
gem install *.gem
{{< /code >}}

For each supported Ruby version we ensure the following are met.

* Rubocop passes
* Yardocs build
* RSpec tests pass
* Ensure all plugins in *bin/* are executable
* The gem is built without errors
* The gem can be installed without errors

Currently this is only automated to run in Ubuntu.
Many repos are run tested manually against CentOS and FreeBSD as well.
Currently we don't have an automated way to test against them but that is forthcoming.

### Travis test pipeline

This pipeline is run against every commit to a repo, including commits across forks, and deployment commits by Tom Servo.

{{< code yaml >}}
language: ruby
cache:
  - bundler
install:
  - bundle install
rvm:
  - 1.9.3
  - 2.0
  - 2.1
  - 2.2
notifications:
  email:
    recipients:
      - sensu-plugin@sensu-plugins.io
    on_success: change
    on_failure: always

script:
  - 'bundle exec rake default'
{{< /code >}}

For each supported Ruby version we ensure the following are met.

* Rubocop passes
* Yardocs build
* RSpec tests pass
* Ensure all plugins in *bin/* are executable

## Release process

We use [Travis][12] is used to run tests across all forks and deploying the gems.

When a Pull Request is submitted, Travis will automatically execute all default tasks defined in the `Rakefile` found in the repo root and display the results in the PR.  When a committer wishes to deploy a new release the following procedure should be followed:

1. Update CHANGELOG to reflect all of the changes that has happened between last release and now. The Unreleased link in the CHANGELOG gives you a nice diff.
1. make sure the README is updated as neccessary.
1. Update the version using [semver2][11]
1. make a git release. Example with hub: `hub release create major.minor.patch`
1. Make sure the gem is actually uploaded to rubygems. It's rare but I've seen times when it doesn't upload for whatever reason.
1. travis will only deploy if the build is passing so make sure master is building before cutting a release.

All tag commits that pass tests in **all** supported runtimes will kick a deploy to Rubygems.


[1]: https://github.com/sensu/sensu-plugin
[2]: http://yardoc.org/
[3]: http://www.rubydoc.info/gems/yard/file/docs/GettingStarted.md
[4]: https://github.com/sensu-plugins/GIR/blob/master/files/templates/gem/rubocop.yml.erb
[5]: https://github.com/orgs/sensu-plugins/people
[6]: http://opensource.org/licenses/MIT
[7]: https://help.github.com/articles/searching-issues/
[8]: https://github.com/sensu-plugins/sensu-plugins-feature-requests
[9]: http://keepachangelog.com/
[10]: https://github.com/sensu-plugins/sensu-plugins-pagerduty
[11]: http://semver.org/spec/v2.0.0.html
[12]: https://travis-ci.org/
[13]: https://github.com/sensu-plugins/
[14]: https://github.com/sensu-plugins/community
