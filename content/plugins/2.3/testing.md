---
title: "Testing"
date: 2017-10-26T12:53:47-07:00
description: ""
weight: 9
product: "Plugins"
version: "2.3"
menu: "plugins-2.3"
---


### Linting

**Only pull requests passing Rubocop will be merged.**

Rubocop is used to lint the ruby plugins. This is done to standardize the style used within these plugins and ensure high quality code.  Most [current rules][6] are in effect.  
No linting is done on Ruby code prior to version 2x.

Ruby 1.9.2 and 1.8.7 support has been dropped, the plugins may still function with these versions but no tests will be run against them nor will code, such as hashes, be specifically written or enforced to ensure backwards compatibility.

Rubocop compliance can be checked by installing the gem and running `rubocop` with the repo.  Running `rubocop -a` will attempt to autocorrect any issues, saving considerable time in large files.

If it truly makes sense for code to violate a rule, disable that rule within the code by either using

{{< highlight ruby >}}
# rubocop:disable <rule>, <rule>
{{< /highlight >}}

at the end of the line in violation or

{{< highlight ruby >}}
rubocop:disable <rule>, <rule>
<code block>
rubocop:enable <rule>, <rule>
{{< /highlight >}}

If either of these methods are used please mention in the PR as this should be kept to an absolute minimum, at times this can be necessary though, especially concerning method length and complexity.

### Rspec

Currently RSpec3 is the [test framework][9] of choice. Please add coverage for your check.  Checks will not be considered production grade and stable until they have coverage.  Tests are **not** required though to submit a check, merely encouraged for the benefit of all.

You can run all tests locally using

{{< highlight bash >}}
rake default
{{< /highlight >}}

to run all specs and rubocop tests.  RSpec tests are currently run against 2.0, and 2.1.  There are currently no plans to support 1.8.x or test against 1.9.2 and 1.9.3.

This is little bit hard, almost impossible for non-ruby checks. Let someone from the [team][10] know and maybe can can help.

### Codeship Testing Pipeline

This pipeline is run upon any commits to the master branch including Pull Request merge commits.  Due to limitations with Codeship, tests are not run across forks and the build logs are not publicly available, jut the build status.  If you wish to work on the build pipeline please speak to a team member about necessary access.

**Setup**
{{< highlight bash >}}
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
{{< /highlight >}}

**Test Commands**
{{< highlight bash>}}
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
{{< /highlight >}}

For each supported Ruby version we ensure the following are met.

* Rubocop passes
* Yardocs build
* RSpec tests pass
* Ensure all plugins in *bin/* are executable
* The gem is built without errors
* The gem can be installed without errors

Currently this is only automated to run in Ubuntu.  Many repos are run tested manually against CentOS and FreeBSD as well.  Currently we don't have an automated way to test against them but that is forthcoming.

### Travis Test Pipeline

This pipeline is run against every commit to a repo, including commits across forks, and deployment commits by Tom Servo.

{{< highlight yaml >}}
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
{{< /highlight >}}

For each supported Ruby version we ensure the following are met.

* Rubocop passes
* Yardocs build
* RSpec tests pass
* Ensure all plugins in *bin/* are executable

[6]: https://github.com/sensu-plugins/GIR/blob/master/files/templates/gem/rubocop.yml.erb
[7]: https://github.com/sensu-plugins/GIR/blob/master/files/templates/gem/travis.yml.erb
[8]: https://github.com/sensu-plugins/GIR/blob/master/files/templates/gem/Rakefile.erb
[9]: https://github.com/sensu/sensu-plugin-spec
[10]: https://github.com/orgs/sensu-plugins/people
