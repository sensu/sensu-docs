---
title: "Plugins"
date: 2018-05-03T10:31:16-07:00
weight: -100
menu: "plugins-1.0"
version: "1.0"
product: "Plugins"
tags: ["sensu", "plugins", "1.0", "index"]
layout: "product-platforms"
---

## Overview

The goal of the Sensu Plugins project is to provide a set of community-driven, high-quality plugins, handlers and other code to maximize the effective use of Sensu in various types of auto-scaling and traditional environments. Much of the code is written in Ruby and uses the [`sensu-plugin` framework][0]; some also depend on additional gems or packages(e.g. `mysql2` or `libopenssl-devel`). Some are shell scripts! All languages are welcome but the preference is for pure Ruby when possible to ensure the broadest range of compatibility.

TODO - how do you add a callout box? We want one explaining that plugins are maintained by volunteers and do **not** have an SLA or similar.

## What is a Sensu plugin?

A sensu plugin is a bundle of sensu artifacts typically service specific.

These artifacts typically include:
- check scripts
- metric scripts
- sensu handlers
- sensu mutators

## How do I use a plugin?

Depending on the type of artifact you wish you wish to use they have different setup/configuration. The most common are check/metric scripts. Each plugin has self contained documentation that you should refer to for more in depth information.

To install a ruby plugin see [here](installation.md) for more details and refer to the plugins self contained documentation for any external dependencies such as os libraries, compilers, etc.

To setup:
- [checks](../../sensu-core/latest/guides/intro-to-checks.md)
- [handlers](../../sensu-core/latest/guides/intro-to-handlers.md)
- [mutators](../../sensu-core/latest/guides/intro-to-handlers.md)

## How do I contribute to plugins?

TODO - overview of volunteer maintainers, opening issues/prs, volunteering to be a maintainer. Link to: https://github.com/sensu-plugins/community/blob/master/CONTRIBUTING.md


[0]: https://github.com/sensu-plugins/sensu-plugin
