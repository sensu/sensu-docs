---
title: "Sensu Plugins: A History"
date: 2017-10-26T10:58:06-07:00
description: ""
weight: 7
product: "Plugins"
version: "1.0"
menu: "plugins-1.0"
---

Creating a set of production grade gems from the [Sensu Community Plugins][2] is a huge task that will take considerable time; only with the continued effort of many people can this goal can be achieved.

The original community plugins repo has already been split in smaller [repos][3], based upon application. This means all the Windows plugins, handlers, etc are in a repo named sensu-plugins-windows, the aws ones are in sensu-plugins-aws and so on.

This is only the first step towards completing the transformation, existing tooling will need to be improved and new tooling created for managing all the repos separately but also as a whole.  A maintainer should be able to issue a single command and have a template generated and installed in all repos, manually copying a file to every repo is so 2006. :D

[1]: http://sensu-plugins.github.io/development/gir
[2]: https://github.com/sensu/sensu-community-plugins
[3]: https://github.com/sensu-plugins
[4]: https://github.com/bbatsov/ruby-style-guide
[5]: https://github.com/mattyjones
[6]: https://github.com/kalabiyau
[7]: https://github.com/sensu/sensu-plugin-spec
[8]: http://sensu-plugins.github.io/development/guidelines.html
