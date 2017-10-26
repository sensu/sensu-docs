---
title: "Release Process"
date: 2017-10-26T10:35:03-07:00
description: ""
weight: 3
product: "Plugins"
version: "2.3"
menu: "plugins-2.3"
---

Currently we use  [Travis](https://travis-ci.org/) is used to run tests across all forks and deploying the gems.

When a Pull Request is submitted, Travis will automatically execute all default tasks defined in the `Rakefile` found in the repo root and display the results in the PR.  When a committer wishes to deploy a new release the following procedure should be followed:

1. Update CHANGELOG to reflect all of the changes that has happened between last release and now. The Unreleased link in the CHANGELOG gives you a nice diff.
1. make sure the README is updated as neccessary.
1. Update the version using [semver2](http://semver.org/spec/v2.0.0.html)
1. make a git release. Example with hub: `hub release create major.minor.patch`
1. Make sure the gem is actually uploaded to rubygems. It's rare but I've seen times when it doesn't upload for whatever reason.
1. travis will only deploy if the build is passing so make sure master is building before cutting a release.

All tag commits that pass tests in **all** supported runtimes will kick a deploy to Rubygems.
