# Sensu Docs Site

Welcome to the Sensu Documentation! This repository is the new home of all Sensu-related documentation and we appreciate your help in maintaining it. View it at [docs.sensu.io](https://docs.sensu.io).

## Why this project

Contribution was too complicated when working with [sensu-docs](https://github.com/sensu/sensu-docs) build depending on the private website code. In addition, this new site gives us:

- **Much faster** rendering times
- Versioned documentation per project all in one place
- Easier contribution experience running Hugo locally
- Full-text search 😍

## Known limitations

- Uchiwa links to the existing website
- There is no Extensions documentation at this time
- Plugin documentation is very out of date. Help fix that by participating in [this issue](https://github.com/sensu-plugins/community/issues/58)
- Sensu Core 2.0 documentation will be partially missing until the Beta milestone is reached

## Project wiki

This README is focused on helping you get started with the sensu-docs project as a whole. For detail on formatting, layouts and other aspects of adding to or modifying content, please see our [project wiki](https://github.com/sensu/sensu-docs/wiki).

## Running Sensu Docs

Unlike the old sensu-docs project, this site can be run locally with Hugo. There are some new steps to learn, but don't worry, we've documented how to do so (and some common [troubleshooting](https://github.com/sensu/sensu-docs/blob/master/README.md#troubleshooting-hugo) if you need it):

### Getting Started with Hugo

#### [Cloning the project](#cloning-the-project)

This project uses [git submodules](https://git-scm.com/book/en/v2/Git-Tools-Submodules) to manage themes. If you have git 1.6.5 or later, you can clone this project and checkout submodules in one command:

```
git clone --recursive https://github.com/sensu/sensu-docs.git sensu-docs
```

If you cloned this repository without the `--recursive` flag, you can manually pull in the theme submodule:

```
cd sensu-docs ; git submodule update --init --recursive
```

#### Installing Yarn

This project uses [Yarn](https://yarnpkg.com/) to manage dependencies and the build process. For information on installing yarn, [view their documentation](https://yarnpkg.com/lang/en/docs/install/).

#### Building the site

After installing yarn we suggest that you test the build of the site in your local environment:

```
yarn
```

Yarn will install and run Hugo to render the site into the `public` directory.

This is the same build process used by TravisCI to test changes. If this command produces any errors, please open an issue.


#### Viewing locally

If the site builds successfully, you can run the Hugo server and view the site in a local web browser:

```
yarn run server
```

#### Troubleshooting Hugo
Here are some things you might try if you encounter an issue working with the site:

* Run `yarn hugo-version` to print the running version of Hugo. Version 0.34 or newer is required.
* Did you clone the repository without submodules? See the "[cloning the project](#cloning-the-project)" section for how to add submodules after the fact.
* If you are seeing stale page content, try using `yarn server --disableFastRender` to ensure all pages are rebuilt as you make changes.
* If you're still having trouble viewing the site, open an issue, and we'll be happy to help!

### Pushing to GitHub
This is the same as any other project. Follow GitHub's instructions if you're unsure. No additional steps are needed.

### Deploying to Heroku
This project uses [Travis CI Deployment support for Heroku](https://docs.travis-ci.com/user/deployment/heroku/) to automatically deploy the site once changes are merged to `master`. For additional details on Heroku configuration and deployment, see [our wiki page](https://github.com/sensu/sensu-docs/wiki/Heroku-Configuration-and-Publishing).
