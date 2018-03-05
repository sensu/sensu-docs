# Sensu Docs Site

Welcome to the Sensu Documentation! This is a work in progress as we migrate from our previous project, [sensu/sensu-docs](https://github.com/sensu/sensu-docs). You can view the live site at [docs-preview.sensuapp.org](https://docs-preview.sensuapp.org/).

## Status

- We're close to shifting from our previous docs these new ones! Please open issues here instead of sensu/sensu-docs
- The sensuapp.org/docs pages will remain separate until the Launch milestone is hit, tracked here: https://github.com/sensu/sensu-docs-site/milestones

## Why Change?

Contribution to documentation is too complicated with [sensu-docs](https://github.com/sensu/sensu-docs) build depending on the private website code. In addition, this new site gives us:

- **Much faster** rendering times
- Versioned documentation per project all in one place
- Easier contribution experience running Hugo locally
- Full-text search 😍

## Project wiki

This README is focused on helping you get started with the sensu-docs-site project as a whole. For detail on formatting, layouts and other aspects of adding to or modifying content, please see our [project wiki](https://github.com/sensu/sensu-docs-site/wiki).

## Running Sensu Docs

Unlike the old sensu-docs project, this site can be run locally with Hugo. There are some new steps to learn, but don't worry, we've documented how to do so (and some common [troubleshooting](https://github.com/sensu/sensu-docs-site/blob/master/README.md#troubleshooting-hugo) if you need it):

### Getting Started with Hugo

#### [Cloning the project](#cloning-the-project)

This project uses [git submodules](https://git-scm.com/book/en/v2/Git-Tools-Submodules) to manage themes. If you have git 1.6.5 or later, you can clone this project and checkout submodules in one command:

```
git clone --recursive https://github.com/sensu/sensu-docs-site.git sensu-docs-site
```

If you cloned this repository without the `--recursive` flag, you can manually pull in the theme submodule:

```
cd sensu-docs-site ; git submodule update --init --recursive
```

#### Installing Yarn

This project uses [Yarn](https://yarnpkg.com/) to manage dependencies and the build process. For installation
on installing yarn, [view their documentation](https://yarnpkg.com/lang/en/docs/install/).

#### Installing Hugo

This project requires **Hugo version 0.34 or later**.

To install Hugo, we recommend heading over to [the Hugo installation docs](http://gohugo.io/getting-started/installing/) to find the instructions for your platform of choice. If you're in doubt over whether a release exists for your platform, check out [the GitHub releases page for Hugo](https://github.com/gohugoio/hugo/releases) to see available packages.

Once you've installed Hugo, continue reading for viewing the site and working with Hugo.

#### Building the site

After installing Hugo we suggest that you test the build of the site in your local environment:

```
yarn
```

This is the same build process used by TravisCI to test changes. If this command produces any errors, please ensure you're using [the same version of Hugo documented in our wiki](https://github.com/sensu/sensu-docs-site/wiki/Hugo-version-upgrades).


#### Viewing locally
If the site builds successfully, you can run the Hugo server and view the site in a local web browser:

```
hugo server
```

#### Troubleshooting Hugo
If you encounter an issue viewing the site, this usually boils down to one of three issues:
* Hugo version is not .34+. You can check what version you have by doing `hugo version`. If you don't have .34+, head on over to [Hugo's releases page](https://github.com/gohugoio/hugo/releases) and grab the package for your OS.
* The repo was cloned without submodules. See the "[cloning the project](#cloning-the-project)" section for how to add submodules post-clone.
* The pages are cached. Try using `hugo server --disableFastRender` to start hugo locally, which should work.
* If you're still having trouble viewing the site, open an issue, and we'll be happy to help!

### Pushing to GitHub
This is the same as any other project. Follow GitHub's instructions if you're unsure. No additional steps are needed.

### Deploying to Heroku
This project uses [Travis CI Deployment support for Heroku](https://docs.travis-ci.com/user/deployment/heroku/) to automatically deploy the site once changes are merged to `master`. For additional details on Heroku configuration and deployment, see [our wiki page](https://github.com/sensu/sensu-docs-site/wiki/Heroku-Configuration-and-Publishing).
