---
title: "GSoC 15"
date: 2017-10-26T10:58:06-07:00
description: ""
weight: 7
product: "Plugins"
version: "2.3"
menu: "plugins-2.3"
---

Creating a set of production grade gems from the [Sensu Community Plugins][2] is a huge task that will take considerable time; only with the continued effort of many people can this goal can be achieved.

The original community plugins repo has already been split in smaller [repos][3], based upon application. This means all the Windows plugins, handlers, etc are in a repo named sensu-plugins-windows, the aws ones are in sensu-plugins-aws and so on.

This is only the first step towards completing the transformation, existing tooling will need to be improved and new tooling created for managing all the repos separately but also as a whole.  A maintainer should be able to issue a single command and have a template generated and installed in all repos, manually copying a file to every repo is so 2006. :D

### Task: General refactoring of community plugins code base

**Brief explanation:**

All the binaries in a repository should be broken down into libraries and any common code should be shared.  All new code should be written in Ruby and when possible existing code in other languages should be converted or its functionality should be folded into other code.

**Expected Results:**

* Minimal code duplication
* [Standard][4] Ruby coding practices
* Ephemeral data whenever needed, no traces left on a monitored system including temp files used to store state data
* Favor a pure ruby method, over a arch specific method even at the sacrifice of code complexity ie sys-filesystem gem vs `df`
* **Note** Not every repository needs to be complete, a list of high priority repos or ones of particular interest will be mutually determined

**Why Work On This:**

This would be a great project for someone who wants to improve their Ruby skills or learn about using various Open Source api's and how to integrate with them.  Much of the code is already written so the ability to examine functional code in various styles could be very beneficial.

**Knowledge prerequisite:**

* general Ruby knowledge or advanced knowledge of Perl/Python/<scripting language>
* general concepts of monitoring or willingness to learn them
* general understanding of how to define, generate, and handle exit codes and what they mean within a monitoring environment
* must believe in and understand treating infrastructure as code, ephemeral data, and why this is necessary in a cloud environment

**Skill level:**

* beginner/medium, someone with an established track record of rapid learning will do fine

**Mentor:**

[Matt Jones][5] or [Artem Chernikov][6]

**Proposal Guidelines**

When submitting your proposal please pick one or more repos, and explain why you want to work with them and any domain specific knowledge or skills you have to help you complete the task.


### Task: Automated testing framework built around Travis using standard Ruby methods, practices, and tools

**Brief explanation:**

In order to be considered production grade test coverage needs to be fairly high and not everyone has the time or ability to write tests. A framework should be designed and built to automate the process of writing and executing tests.  There is a fair amount of latitude in how this is accomplished as minimal work has been done on this. A good starting point would be the [sensu-plugins-spec][7] repo.

**Expected Results:**

We expect to have the foundation for a set of tools written in Ruby which will:

* Improve the existing set of development tools including [GIR][1] which is currently able to bootstrap a plugin development environment including gem and repo creation.
* Create an automated testing framework which will allow us to run a set of tests within virtual machines and report back the status of that process

**Why Work On This:**

This would be a great project for someone who wants to improve their Ruby skills and learn more about tool writing and writing automated test suites.  This is a ground up project so you would have the ability to contribute in a major way including helping to select the test packages, and work on the design of the tooling to help facilitate its use.

**Knowledge prerequisite:**

* general understanding of various testing tools such as rspec, rubocop, and serverspec
* basic understanding of TravisCI, Vagrant and RVM would be helpful but are not necessary
* basic understanding of Rake
* basic understanding of current infrastructure automation and tooling
* must believe in and understand treating infrastructure as code, ephemeral data, and why this is necessary in a cloud environment

**Skill Level:**

* medium

**Mentor:**

[Matt Jones][5] or [Artem Chernikov][6]

**Proposal Guidelines**

When submitting your proposal please explain your views on testing code and infrastructure along with specific knowledge or skills you have to help you complete the task.  A brief summary of your choice of tools and why you pick them should also be included.


### Task: A simple comprehensive directory of all monitors, handlers, and tools.

**Brief explanation:**

With the split of the community repo in ~150 separate repos, users may have a hard time finding a particular monitor or know that a monitor or handler for a service already exists.  There should be a directory we can point them to that will offer this functionality in a clean manner.  The directory should be updated automatically upon the release of a new gem, github tag, or repo.  Consideration will need to be given for the rate-limiting that is inherent with Github.

**Expected Results:**

We would like a solid design and poc of the code and tools necessary to build and maintain the directory. It need not be complete but substantial progress should have been made and it should be in a poc state with complete functionality.  Current technologies in consideration are Node.js, RoR, vanilla js.

**Why Work On This:**

Not much has been done on this front yet so the student would in effect have free rein with the design as long as it meets the functional requirements and the code is clean modular and stable.  This would include the ability to design the layout, pick the methods to gather the required data and select the best language and tools for the project.

Guidance is available on these topics as well as examples of the types of functionality and style we are looking for.

**Knowledge prerequisite:**

* general understanding of web application design
* general knowledge of web site template engines, any would be fine but the site currently uses Jekyll/Liquid
* good working knowledge of standard web languages such as html, css, js
* familiarity with MVC frameworks such as Django and Rails
* basic understanding of the necessary api's including Github, TravisCI, and RubyGems
* basic understanding of current infrastructure automation and tooling
* must believe in and understand treating infrastructure as code, ephemeral data, and why this is necessary in a cloud environment

**Skill Level:**

* medium/advanced

**Mentor:**

[Matt Jones][5] or [Artem Chernikov][6]

**Proposal Guidelines**

When submitting your proposal please give some examples of previously completed web applications or programs and/or designs you are currently working on.  You should also include some sites or applications that your find inspiring and would like to incorporate into your design.  If you have no prior projects available then explain in detail how you would go about completing this task.  Previous web experience is not critical but would be helpful.

### Task: A tool to help user setup and configure basic monitoring for their system

**Brief explanation:**

With the split of the community repo in ~150 separate repos, users may have a hard time finding a particular monitor or know that a monitor or handler for a service already exists. It would be nice for a user to be able to query a db and get back a list of gems to install to monitor their system.  For example a user wants to setup baseline monitoring but has no idea what to install for gems.  They would type in baseline and get back a list of packages whose metadata matches baseline.

**Expected Results:**

We would like a solid design and poc of the code and tools necessary to build and maintain this. It need not be complete but substantial progress should have been made and it should be in a poc state with complete functionality.  Current technologies in consideration are Node.js and RoR.

**Why Work On This:**

Not much has been done on this front yet so the student would in effect have free rein with the design as long as it meets the functional requirements and the code is clean modular and stable.  This would include the ability to design the layout, pick the methods to gather the required data and select the best language and tools for the project.

Guidance is available on these topics as well as examples of the types of functionality and style we are looking for.

**Knowledge prerequisite:**

* general understanding of web application design
* general knowledge of web site template engines, any would be fine but the site currently uses Jekyll/Liquid
* good working knowledge of standard web languages such as html, css, js
* familiarity with MVC frameworks such as Django and Rails
* basic understanding of the necessary api's including Github, TravisCI, and RubyGems
* basic understanding of current infrastructure automation and tooling
* must believe in and understand treating infrastructure as code, ephemeral data, and why this is necessary in a cloud environment

**Skill Level:**

* medium/advanced

**Mentor:**

[Matt Jones][5] or [Artem Chernikov][6]

**Proposal Guidelines**

When submitting your proposal please give some examples of previously completed web applications or programs and/or designs you are currently working on.  You should also include some sites or applications that your find inspiring and would like to incorporate into your design.  If you have no prior projects available then explain in detail how you would go about completing this task.  Previous web experience is not critical but would very be helpful.

### Task: Expand monitors for a given product, platform or api

**Brief explanation:**

There are still lots of api's, platforms, and tools out there that have minimal or non-existent monitoring.  The student with the guidance of the mentor can pick one or several of these to write monitors and handlers, or gather metrics for.  At the outset a proper scope, dependent upon the chosen type of monitoring to be implemented, would be agreed upon by both the student and the mentor.  A partial list of topics include:

* expanded monitoring of elasticsearch or other large scale data stores
* improvements upon existing monitoring for Windows Server and Windows applications
* platform specific monitors for BSD, VMS, etc
* monitors and integration with various hypervisors such as KVM, QEMU, or ESX(i)
* low level monitoring of the linux kernel using kernel probes
* monitoring of various environmental metrics found in a datacenter, including battery performance, chasis temperature, and network latency
* monitoring of various scada, fpga, or other embedded systems

**Expected Results:**

A set of completed, stable, and production grade monitors, handlers, etc that are within the scope agreed upon by the student and the mentor at the outset.  The emphsis will be on quality not quanity and all code will be written in Ruby following the [Developer Guidelines][8] for the sensu plugins.

**Why Work On This:**

Freedom to explore.  Pick a topic and figure out how it works, is commonly used, and fails, then effectively code ways to detect or possibly correct these failures.  A well defined scope will be created with the student to prevent chasing edge cases, feature creep, and black holes.

You will get a feel for how infrastructure developers and system administrators tackle a monitoring problem and how an effective monitor is written from design to code, through to testing and production use.  You will get a chance to own the problem and create a solution based upon your personal preferences while adhering to published Developer Guidelines.

**Note** Due to the nature of this task the scope will be carefully considered and may be evaluated at specific intervals taking into account the task goals and the students learning ability.

**Knowledge prerequisite:**

* general Ruby knowledge or advanced knowledge of Perl/Python/Go/C
* general concepts of monitoring or willingness to rapidly learn them
* general understanding of how to define, generate, and handle exit codes and what they mean within a monitoring environment
* must believe in and understand treating infrastructure as code, ephemeral data, and why this is necessary in a cloud environment
* necessary domain specific knowledge of the selected topic or proven experience rapidly adapting to new technologies

**Skill Level:**

* beginner.....advanced (depends on chosen topic)

**Mentor:**

[Matt Jones][5] or [Artem Chernikov][6]

**Proposal Guidelines**

When submitting your proposal please pick one or more topics, and explain why you want to work with them, a simple scope for the project, and any domain specific knowledge or skills you have to help you complete the task.


[1]: http://sensu-plugins.github.io/development/gir
[2]: https://github.com/sensu/sensu-community-plugins
[3]: https://github.com/sensu-plugins
[4]: https://github.com/bbatsov/ruby-style-guide
[5]: https://github.com/mattyjones
[6]: https://github.com/kalabiyau
[7]: https://github.com/sensu/sensu-plugin-spec
[8]: http://sensu-plugins.github.io/development/guidelines.html
