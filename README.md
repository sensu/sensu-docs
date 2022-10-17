![Sensu<sDocs](static/images/sensu-docs.png)

Welcome to the Sensu Docs project! This repository is the home of [docs.sensu.io][site].

[Read the docs][site] | [Contributing guide](CONTRIBUTING.md) | [Style guide][wiki] | [Code of conduct][coc] | [Contact admins][email] | [Open an issue][issue]

[![Travis build status](https://travis-ci.com/sensu/sensu-docs.svg?branch=main)](https://travis-ci.com/sensu/sensu-docs)

---

**We welcome all contributions!
Read the [contributing guide](CONTRIBUTING.md) to get started.**

For details on formatting and style, see the [Sensu Docs style guide][wiki].
If you have any questions, please [submit an issue][issue], or feel free to reach out in #documentation in the [Sensu Community Slack][slack].

### Contributing quick start

From the docs site, select "Edit this page" to go to the corresponding markdown file in GitHub.
From there, GitHub will prompt you to create a fork and submit a pull request.
You can also submit documentation feedback by [opening an issue][issue].

### Run the Sensu Docs site locally

The Sensu Docs site is a static site built with [Hugo][hugo] and markdown. These instructions will help you get the site running locally.

To contribute to the Sensu Docs, please read the [contributing guide](CONTRIBUTING.md).

#### 1. Install Git and Yarn

* [Install Git](https://help.github.com/en/articles/set-up-git#setting-up-git) on your computer and [authenticate](https://help.github.com/en/articles/set-up-git#next-steps-authenticating-with-github-from-git) using HTTPS or SSH. Skip this step if you already have Git set up and authenticated on your computer.

* [Install Yarn][yarn-install] on your computer. Sensu Docs uses [Yarn][yarn] to manage dependencies and the build process.

#### 2. Clone the Sensu Docs repo

You can clone the repo using either HTTPS or SSH.

Clone using HTTPS:

```
git clone https://github.com/sensu/sensu-docs.git && cd sensu-docs
```

Clone using SSH:

```
git clone git@github.com:sensu/sensu-docs.git && cd sensu-docs
```

If you prefer, [download the repo from GitHub](https://github.com/sensu/sensu-docs/archive/main.zip).

#### 3. Run `yarn`

Run:

```
yarn
```

This will install Hugo and build the site into the `public` directory.

**NOTE**: If you're using a Mac with an M1 chip, add the following steps. If you're not using an M1 Mac, proceed to step 4.

*Additional steps for M1 Macs only*
a. In your local copy of `sensu-docs`, open `node_modules` > `hugo-cli` > `index.js`.
b. Change line 76 to read `arch_exec = 'arm64';`.
c. Change line 77 to read `arch_dl = '-ARM64';`.
d. Save your changes to `index.js`.
e. Run `yarn` again.

#### 4. Run the site locally

If the site builds successfully, run:

```
yarn run server
```

This builds the Hugo server so you can view the site in your local web browser at http://localhost:1313/.

### Troubleshooting

Here are some things to try if you encounter an issue working with the site:

* Run `yarn hugo-version` to print the running version of Hugo. Version 0.101.0 or newer is required.
* If you're still having trouble viewing the site, [open an issue][issue], and we'll be happy to help!

#### Internet Explorer Users

The docs site displays incorrectly in Internet Explorer.
If you cannot use a different browser, you can access a PDF copy of the Sensu documentation on our [supported versions][supp-vers] page.

### Developing Offline Docs

Offline documentation uses a set of layouts located in the `offline` directory. To preview them:

```
yarn run server --layoutDir=offline
```

To exclude content from the offline documentation, add this line to a markdown file's front matter:

```
offline: false
```

### Deploying the site

Whenever changes are merged to the `main` branch, this project is automatically deployed to [docs.sensu.io][site]. For additional details on Heroku configuration and deployment, see [our wiki page](https://github.com/sensu/sensu-docs/wiki/Heroku-Configuration-and-Publishing).

[slack]: https://slack.sensu.io
[wiki]: https://github.com/sensu/sensu-docs/wiki/Sensu-docs-style-guide
[coc]: https://sensu.io/conduct
[email]: mailto:docs@sensu.io
[git]: https://git-scm.com/book/en/v2/Getting-Started-Installing-Git
[yarn]: https://yarnpkg.com/
[yarn-install]: https://yarnpkg.com/lang/en/docs/install/
[hugo]: https://gohugo.io/documentation/
[site]: https://docs.sensu.io
[issue]: https://github.com/sensu/sensu-docs/issues/new
[supp-vers]: https://docs.sensu.io/sensu-go/latest/getting-started/versions/

