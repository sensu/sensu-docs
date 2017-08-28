# Sensu Docs Site

1. [Project Setup](#project-setup)

    - [Getting Started with Hugo](#getting-started-with-hugo)
    
    - [Deploying to Heroku](#deploying-to-heroku)
    
2. [Working With Hugo](#working-with-hugo)

    - [Adding Content](#adding-content)
    
    - [Overriding the Theme](#overriding-the-theme)
    
    - [Variables and Accessing Front Matter](#variables-and-accessing-front-matter)
    
    - [Search](#search)
    
## Project Setup

### Getting Started with Hugo
[Hugo Docs](https://gohugo.io/getting-started/installing/)

#### Initial Setup
These instructions assume you have [Homebrew](https://brew.sh/) installed. Please refer to Hugo docs otherwise.
```
brew install hugo
```

Create your new site:
```
hugo new site sensu-docs-site
```

Initialize Git:
```
git init
```

#### Adding a Theme
We're starting out with the [Material Theme](https://themes.gohugo.io/material-docs/). For testing locally, we'll need to clone their repo into our `/themes` folder.
```
git clone https://github.com/digitalcraftsman/hugo-material-docs.git themes/hugo-material-docs
```
Next, we'll copy the `config.toml` file into our project's root directory.

#### Viewing locally
Now just run the Hugo server
```
hugo server
```

### Deploying to Heroku
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
Pages are stored in the `/content/` folder. Generally you will have a folder inside content which is called a section. We've organized each project (Sensu Core, Uchiwa, etc) into a section. Each section can have it's own attributes called "front matter". You can set defaults for a section's front matter in the `/archtypes/` folder.

#### Creating a Section
This will create a folder for us in `/content/`
```
hugo new sensu-core
```

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

#### Creating Pages
Now you can run:
```
hugo new sensu-core/getting-started
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

You can also set global site variables inside the `config.toml`. Here's an example:
```
[params.products.sensu_core]
         identifier = "sensu-core"
         name = "Sensu Core"
         description = "Sensu helps monitoring and does some cool things. It's neato!"
         weight = 1
         latest = "1.0"
```

You can gain access to all the products with `.Site.Params.Products`. You can access a product's attributes like: ` .Site.Params.sensu-core.description`.

### Search
Search was added through [this workflow by sebz](https://gist.github.com/sebz/efddfc8fdcb6b480f567) with a few modifications.
