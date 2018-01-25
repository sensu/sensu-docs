# Sensu Docs Site

Welcome to the Sensu Documentation! This is a work in progress as we migrate from our previous project, [sensu/sensu-docs](https://github.com/sensu/sensu-docs-site).

## Status

- Pages from site are officially merged into the new docs site: https://github.com/sensu/sensu-docs-site, which is [tracked on these Milestones](https://github.com/sensu/sensu-docs-site/milestones)
- The sensuapp.org/docs pages will remain separate until the Launch milestone is hit, tracked here: https://github.com/sensu/sensu-docs-site/milestones

## Why Change?

This new site is a place for:

- Versioned documentation that's easy to navigate
- MUCH FASTER load times
- Full-text search 😍
- Easier contribution experience running Hugo locally

# Running Sensu Docs

Now that our project can be run locally with Hugo, there's some new steps to learn. Don't worry, we've documented how to do so:

### Getting Started with Hugo

#### Initial Setup - MacOS

These instructions assume you have [Homebrew](https://brew.sh/) installed. Please refer to [Hugo Docs](https://gohugo.io/getting-started/installing/) otherwise.

```
brew install hugo
```

This project uses [git submodules](https://git-scm.com/book/en/v2/Git-Tools-Submodules) to manage themes. If you have git 1.6.5 or later, you can clone this project and checkout submodules in one command:
```
git clone --recursive https://github.com/sensu/sensu-docs-site.git sensu-docs-site
```

If you cloned this repository without the `--recursive` flag, you can manually pull in the theme submodule:
```
cd sensu-docs-site ; git submodule update --init --recursive
```

#### Initial Setup - RedHat/CentOS/Fedora

Sensu Docs Site uses Hugo .30, though .31 works. Do NOT use .32 at this time, as it breaks the site. You'll need to ensure that you've downloaded either of those versions prior to cloning the repo. To install the repo, ensure that you have the yum-utils package installed:

```
sudo yum install - yum-utils
```

Then install the daftaupe repo:

CentOS:

```
sudo yum-config-manager --add-repo https://copr.fedorainfracloud.org/coprs/daftaupe/hugo/repo/epel-7/daftaupe-hugo-epel-7.repo
sudo dnf install 0.31.1-0.el7.centos
```


Fedora:

```
sudo dnf copr enable daftaupe/hugo
sudo dnf install hugo-0.31.1-0.fc26.x86_64
```

From there, proceed to clone the repo:
```
git clone --recursive https://github.com/sensu/sensu-docs-site.git sensu-docs-site
cd sensu-docs-site
```

#### Viewing locally
Now just run the Hugo server
```
hugo server
```

### Pushing to Github
This is the same as any other project. Follow Github's instructions if you're unsure. No additional steps are needed.

### Deploying to Heroku (Admin Only)
Assuming you have Heroku's cli installed and the app created, link it with the project
```
heroku git:remote -a sensu-docs-site
```

In order to deploy to Heroku, we need to set a buildpack as well. We used [this one by roperzh](https://github.com/roperzh/heroku-buildpack-hugo.git)
```
heroku buildpacks:set https://github.com/roperzh/heroku-buildpack-hugo.git
```

#### Using our Material Theme
While there is a themes folder included in Hugo, the buildpack we use for Heroku deployment needs us to link the github repo in a `.hugotheme` file in the root directory. Since we're using the Material Theme, our file will only contain:
```
https://github.com/digitalcraftsman/hugo-material-docs
```

Add this file to git and push to Github and Heroku.

#### Updating the Base URL
Update the first line in the `config.toml` file
```
baseurl = "https://sensu-docs-site.herokuapp.com/"
```

Then push it
```
git push heroku master
```

## Working with Hugo

### Adding Content
Pages are stored in the `/content/` folder. Generally you will have a folder inside `/content/` which is called a section. We've organized each project (Sensu Core, Uchiwa, etc) into a section. Each section can have it's own attributes called "front matter". You can set defaults for a section's front matter in the `/archtypes/` folder. Each project also requires configuration in the `/config.toml` file, an example is detailed [here](#variables-and-accessing-front-matter). We will talk about all of these shortly.

#### Creating a Section
This will create a folder for us in `/content/`
```
hugo new sensu-core
```

### Understanding Front Matter
Front matter is the page-level attributes that are defined in yaml at the top of each page of Markdown. You can define default front matter with archtypes, detailed in the next section. For now, I'll explain the current front matter we are using.
```
---
title: "Sensu Aggregates API"
description: "Sensu Aggregates API reference documentation."
product: "Sensu Core"
version: "1.0"
weight: 5
next: "../checks"
previous: "../clients"
menu:
  sensu-core-1.0:
    parent: api
---
```

- Title: Mandatory. Displayed at the top of the window, in the sidebar, and as the top-most header for the page.
- Description: Optional. A description of the page. Currently not being used on the site.
- Weight: Mandatory. For ordering pages in menus and lists.
- Next: Optional. A relative link to the next file in the reading order, gets used in the footer.
- Previous: Optional. A relative link to the previous file in the reaading order, gets used in the footer.
- Menu: Mandatory. The menu context the page belongs to. Currently made of the project name and version. This will likely change.
  - parent: this is a folder in the `1.0` directory that contains the file.
- Version: Optional. Only special pages will not have a version, these will likely be landing pages or pages not associated with a project.
- Product: Project that the page belongs to in a readable fashion. `.Section` gives this as well, so this field could potentially be deprecated.

Some of these attributes, such as version, are only needed because Hugo currently doesn't have a way of understanding a sub-setcion. As explained earlier, a section is the first level folder inside `/content/`. Any subsequent folders keep that folder name as their `.Section`. This means that `/sensu-core/1.0/examplePage.md` does not know that it's contained within the `1.0` folder without some parsing of it's location. For the time being it's easier to assign a front matter attribute and track it that way.

#### Setting Archtype
In the `/archtypes/` folder, name the file after the section it will be used for, not forgetting the `.md` extension.

Here's an example of pre-defined front matter for any content that will be created for Sensu Core.
```
---
title: "{{ replace .TranslationBaseName "-" " " | title }}"
date: {{ .Date }}
description: ""
weight: 10
menu: "sensu-core"
version: "1.0"
product: "Sensu Core"
---
```

Note: Date is mandatory when using archtypes.

#### Creating Pages
Now you can run:
```
hugo new sensu-core/getting-started.md
```
It will generate a new `.md` file in `/content/sensu-core/` with your pre-defined front matter at the top of the file.

#### Sub-Sections
While you can create sub-sections for versions or related sub-topics through the hugo new command, keep in mind the page's "section" attribute will remain that of it's parent.

#### Landing Pages
You can have an `index.html` page for each section or sub-section you've defined. While not manditory it can create smoother user navigation.

### Overriding the Theme
Pre-built themes have limitations. However, Hugo makes it easy to override them. You should never edit any content in the `/themes/` folder. If you wish to alter things, you may copy the corresponding files to the `/layouts/`, `/layouts/_default/`, or `/layouts/partials/` folders respectively.

The main index page for the site is `/layouts/index.html/`.

The `/layouts/_default/` directory contains `single.html` which is used as the main template for the site. We've also defined indexes for section and sub-section landing pages here.

The `/layouts/partials/` directory contains small `.html` files which are components used in the other larger templates. There are things such as the header, dropdown menus, and footers here.

### Variables and Accessing Front Matter
View the full list [here.](https://gohugo.io/variables/)

To be used with Go's templating.

A page's front matter can be accessed through the `.Params` variable.

You can also set global site variables inside the `config.toml`. Here's an example of global variables for a project:
```
[params.products.sensu_core]
    identifier = "sensu-core"
    name = "Sensu Core"
    description = "Sensu helps monitoring and does some cool things. It's neato!"
    weight = 1
    latest = "1.0"
    [params.products.sensu_core.versions]
        "1.0" = ["Ubuntu/Debian", "RHEL/CentOS"]
        "0.29" = []
```

You can gain access to all the products with `.Site.Params.Products`. You can access a product's attributes like: ` .Site.Params.sensu-core.description`.

### Search
Search was added through lunr js. The search code lives in `/static/javascripts/application.js` and the action of creating the index occurs in the `/Gruntfile`.
