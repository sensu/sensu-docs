# Sensu Documentation

Welcome to Sensu Docs! This repository is the new home of all Sensu-related documentation and we appreciate your help in maintaining it. You can view the live site at [docs.sensu.io](https://docs.sensu.io).

## Why this project

Contribution was too complicated when working with the now-deprecated [sensu-docs-legacy](https://github.com/sensu/sensu-docs-legacy) project. Building it depended on proprietary website code. In addition to making the build independent of our marketing website, this new project gives us:

- **Much faster** rendering times
- Versioned documentation per project all in one place
- Easier contribution experience running Hugo locally
- Full-text search 😍

## Known limitations

- There is no Extensions documentation at this time

## Project wiki

This README is focused on helping you get started with the sensu-docs project as a whole. For detail on formatting, layouts and other aspects of adding to or modifying content, please see our [project wiki](https://github.com/sensu/sensu-docs/wiki).

## Running Sensu Docs

Unlike the old sensu-docs project, this site can be run locally with Hugo. There are some new steps to learn, but don't worry, we've documented how to do so (and some common [troubleshooting](https://github.com/sensu/sensu-docs/blob/master/README.md#troubleshooting-hugo) if you need it):

### Getting Started with Hugo

#### [Cloning the project](#cloning-the-project)

To view the Sensu docs locally, clone this repository with:

```
git clone https://github.com/sensu/sensu-docs.git
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
* If you are seeing stale page content, try using `yarn server --disableFastRender` to ensure all pages are rebuilt as you make changes.
* If you're still having trouble viewing the site, open an issue, and we'll be happy to help!

### Pushing to GitHub
This is the same as any other project. Follow GitHub's instructions if you're unsure. No additional steps are needed.

### Deploying to Heroku
This project uses [Travis CI Deployment support for Heroku](https://docs.travis-ci.com/user/deployment/heroku/) to automatically deploy the site once changes are merged to `master`. For additional details on Heroku configuration and deployment, see [our wiki page](https://github.com/sensu/sensu-docs/wiki/Heroku-Configuration-and-Publishing).
