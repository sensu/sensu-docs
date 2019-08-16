![Sensu<sDocs](static/images/sensu-docs.png)

Welcome to the Sensu Docs project! This repository is the home of [docs.sensu.io][site].

[Read the docs][site] | [Contributing guide](CONTRIBUTING.md) | [Style guide][wiki] | [Code of conduct][coc] | [Contact admins][email] | [Open an issue][issue]

[![Travis build status](https://travis-ci.com/sensu/sensu-docs.svg?branch=master)](https://travis-ci.com/sensu/sensu-docs)

---

**We welcome all contributions!
Read the [contributing guide](CONTRIBUTING.md) to get started.**

For details on formatting and style, see the [Sensu Docs style guide][wiki].
If you have any questions, please [submit an issue][issue], or feel free to reach out in #documentation in the [Sensu Community Slack][slack].

### Contributing quick start

From the docs site, select "Edit this page" to go to the corresponding markdown file in GitHub.
From there, GitHub will prompt you to create a fork and submit a pull request.
You can also submit documentation feedback by [opening an issue][issue].

### Running the site locally

The Sensu Docs site is a static site built with [Hugo][hugo] and markdown.
These instructions will help you get the site running locally.
To contribute to the Sensu Docs, please read the [contributing guide](CONTRIBUTING.md).

#### 1. Download

[Download from GitHub](https://github.com/sensu/sensu-docs/archive/master.zip) or clone the repository:

```
git clone git@github.com:sensu/sensu-docs.git && cd sensu-docs
```

#### 2. Install packages

This project uses [Yarn][yarn] to manage dependencies and the build process.
For information on installing Yarn, [view their documentation][yarn-install].

After installing yarn, run:

```
yarn
```

This will install Hugo and build the site into the `public` directory.

#### 3. Run the site locally

If the site builds successfully, you can run the Hugo server and view the site in a local web browser:

```
yarn run server
```

Then visit http://localhost:1313/ in the browser of your choice.

### Troubleshooting
Here are some things you might try if you encounter an issue working with the site:

* Run `yarn hugo-version` to print the running version of Hugo. Version 0.34 or newer is required.
* If you're still having trouble viewing the site, [open an issue][issue], and we'll be happy to help!

### Theme
This project uses a [fork](themes/hugo-material-docs/) of the wonderful [hugo-material-docs](https://github.com/digitalcraftsman/hugo-material-docs) theme.

### Deploying the site
Whenever changes are merged to the `master` branch, this project is automatically deployed to [docs.sensu.io][site]. For additional details on Heroku configuration and deployment, see [our wiki page](https://github.com/sensu/sensu-docs/wiki/Heroku-Configuration-and-Publishing).

[slack]: http://slack.sensu.io
[wiki]: https://github.com/sensu/sensu-docs/wiki/Sensu-docs-style-guide
[coc]: https://sensu.io/conduct
[email]: mailto:docs@sensu.io
[git]: https://git-scm.com/book/en/v2/Getting-Started-Installing-Git
[yarn]: https://yarnpkg.com/
[yarn-install]: https://yarnpkg.com/lang/en/docs/install/
[hugo]: https://gohugo.io/documentation/
[site]: https://docs.sensu.io
[issue]: https://github.com/sensu/sensu-docs/issues/new

