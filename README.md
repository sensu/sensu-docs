# Sensu Docs Site

## Getting Started with Hugo
[Hugo Docs](https://gohugo.io/getting-started/installing/)

### Initial Setup
These instructions assume you have [Homebrew](https://brew.sh/) installed. Please refer to Hugo docs otherwise.
```
brew install hugo
```

Create your new site
```
hugo new site sensu-docs-site
```

Initialize Git
```
git init
```

### Adding a Theme
We're starting out with the [Material Theme](https://themes.gohugo.io/material-docs/). For testing locally, we'll need to clone their repo into our themes folder.
```
git clone https://github.com/digitalcraftsman/hugo-material-docs.git themes/hugo-material-docs
```
Next, we'll copy the config.toml file into our project's root directory.

### Keeping the Example Site
I wanted to keep the Material Theme example site on their Github as an example while I worked. I created a folder named example in the content folder. I copied the contents of themes/hugo-material-docs/exampleSite to the newly created example folder.

I updated the config.toml file so that all the menu.main urls would include the full path: example/content/

### Updating the base url
Update the first line in the config.toml file
```
baseurl = "https://sensu-docs-site.herokuapp.com/"
```

### Viewing locally
Now just run the Hugo server
```
hugo server
```

## Attaching to Github Repo
Assuming the repo has been setup on Github already:
```
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/sensu/sensu-docs-site
git push -u origin master
```

## Deploying to Heroku
Assuming you have Heroku's cli installed and the app created, link it with the project
```
heroku git:remote -a sensu-docs-site 
```

In order to deploy to Heroku, we need to set a buildpack as well. We used [this one by roperzh](https://github.com/roperzh/heroku-buildpack-hugo.git)
```
heroku buildpacks:set https://github.com/roperzh/heroku-buildpack-hugo.git
```

Then push it
```
git push heroku master
```

It'll probably look a bit funky until we do the next step. Our theme won't be working as expected.

### Using our Material Theme
While there is a themes folder included in Hugo, the buildpack we use for Heroku deployment needs us to link the github repo in a .hugotheme file in the root directory. Since we're using the Material Theme, our file will contain:
```
https://github.com/digitalcraftsman/hugo-material-docs
```

Add this file to git and push to Github and Heroku again.

**Note**: There might be a way to clean this up, it seems silly both linking to the repoi for Heroku and having the files locally for localhost. I'll need to look into this at a later date.


