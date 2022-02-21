# Contributing

[Code of conduct][4] | [Contact admins][5] | [Open an Issue][6]

Thank you for wanting to contribute to the Sensu Community!
Please read and follow our [code of conduct][4].
Reach out to administrators at [docs@sensu.io][5] if needed.

## About the Sensu docs

Sensu documentation is written in [Goldmark Markdown][16], built with [Hugo][15], and maintained on GitHub in the [sensu/sensu-docs][9] repo.

Goldmark Markdown is largely [GitHub-flavored Markdown][17].
The Sensu docs project requires Hugo version 0.72.0 or later.
You'll also need to [install Git][18] to contribute from your command line.

## Contributing instructions

These instructions will help you fork this repository, create a branch, and submit a pull request (PR) either in your browser or from your command line.

After your PR is submitted, project maintainers will review it.
If you'd like to mark your PR as work in progress, add `[WIP]` to the PR title.

If you have questions or want to ensure a PR is reviewed, please reach out in the `Sensu Docs` category of the [Sensu Community Forum on Discourse][8] or the `#documentation` channel of the [Sensu Community Slack][1].

### Browser workflow for PRs

1. From any documentation page on [docs.sensu.io][7], select `Edit this page` (look under the left-navigation menu or at the top-right corner on any page).
The corresponding Markdown file for the page will open in GitHub, create a fork of the [sensu/sensu-docs][9]repository, and create a new branch for your contribution.

2. Make your changes to the Markdown content.

3. Select "Propose changes" and follow the prompts to submit a pull request.

If you have any questions, please [open an issue][6].

### Command line workflow for PRs

1. From the main page of the [sensu/sensu-docs][9] repository, click the `Fork` button at the top-right of the page.

2. From the directory where you want to save the sensu-docs code, clone this repository and set up the upstream remote:
```
git clone https://github.com/REPLACEME/sensu-docs/
# or: git clone git@github.com:REPLACEME/sensu-docs.git

cd sensu-docs

git remote add upstream https://github.com/sensu/sensu-docs.git
# or: git remote add upstream git@github.com:sensu/sensu-docs.git
```

3. Update your local fork:
```
git fetch upstream
git checkout main
git rebase upstream/main
```

4. Create a new branch with a descriptive name to contain your change:
```
git checkout -b fix-code-samples
```

5. Build the Sensu docs site locally and test your changes.

    See the [Sensu Docs style guide][2] for formatting instructions and style conventions.

    To build the site, run [`yarn`][3].
    This builds the search index and compiles the static content.
    You can then run `yarn run server` to view the docs site in real-time as you edit.

6. Commit your changes with a descriptive commit message.

    **NOTE**: Include a [DCO Signed-off-by statement][13] (`git commit --signoff`) with your commit.
```
git commit -am "fix invalid JSON"
```

7. Repeat the commit process as often as you need and edit/test/repeat.
To add minor edits to your last commit:
```
git add -u
git commit --amend
```

    This project uses commit hooks to test the build whenever making a commit.

8. When you're ready to commit for review (or if you just want to establish an offsite backup or your work), push your branch to your fork on GitHub:
```
git push origin feature/myfeature
```

    If you recently used `commit --amend`, you may need to force push:
```
git push -f origin feature/myfeature
```

9. Create a pull request by visiting [sensu/sensu-docs on GitHub][9] and following the prompts.
We'd appreciate it if you [allow edits to your PR from Sensu docs maintainers][10].

## Guidelines

### Developer's Certificate of Origin (DCO)

To make a good-faith effort to ensure that contributions meet the criteria of the MIT License, Sensu follows the Developer's Certificate of Origin (DCO) process.

The DCO is an attestation attached to every contribution you make.
In the commit message of your contribution, add a [Signed-off-by statement][13] and thereby agree to the DCO, which is listed below and at https://developercertificate.org/:

```
Developer Certificate of Origin
Version 1.1

Copyright (C) 2004, 2006 The Linux Foundation and its contributors.

Everyone is permitted to copy and distribute verbatim copies of this
license document, but changing it is not allowed.


Developer's Certificate of Origin 1.1

By making a contribution to this project, I certify that:

(a) The contribution was created in whole or in part by me and I
    have the right to submit it under the open source license
    indicated in the file; or

(b) The contribution is based upon previous work that, to the best
    of my knowledge, is covered under an appropriate open source
    license and I have the right under that license to submit that
    work with modifications, whether created in whole or in part
    by me, under the same open source license (unless I am
    permitted to submit under a different license), as indicated
    in the file; or

(c) The contribution was provided directly to me by some other
    person who certified (a), (b) or (c) and I have not modified
    it.

(d) I understand and agree that this project and the contribution
    are public and that a record of the contribution (including all
    personal information I submit with it, including my sign-off) is
    maintained indefinitely and may be redistributed consistent with
    this project or the open source license(s) involved.
```

#### DCO sign-off

The DCO Signed-off-by statement attests that you agree to the DCO.
DCO sign-off is required for every commit to the sensu/sensu-docs repo.

Here is an example DCO Signed-off-by statement:

```
 Author: Sean Porter <sean@sensu.io>
 Committer: Greg Poirier <greg@sensu.io>
   Let's name it WizardFormat.
   Calling it the Sensu Metric Format was a mistake.
   Signed-off-by: Sean Porter <sean@sensu.io>
   Signed-off-by: Grep Poirier <greg@sensu.io>
```

### Browser workflow for DCO sign-off

If you are creating your PR directly in your browser, add your DCO Signed-off-by statement as the **last line in your commit message**.

Follow this example, but before you click `Propose changes` to create your PR, replace `Miles Dyson` and `mdyson@cyberdyne.com` with the first and last name and email address associated with your GitHub user account:

![DCO sign-off in browser](/static/images/dco-browser.png)

GitHub will include your Signed-off-by statement in your commit, so your contributions will be DCO-compliant.

### Command line workflow for DCO sign-off

You can configure your local git instance to add your DCO Signed-off-by statement to every commit.
Before you run the following code, replace `Miles Dyson` and `mdyson@cyberdyne.com` with the first and last name and email address associated with your GitHub user account.

```
git config --global user.name "Miles Dyson" 
git config --global user.email mdyson@cyberdyne.com
```

Now, every time you commit new code in git, add the `-s` flag to your commit message to include your Signed-off-by statement:

```
git commit -s -m "Your commit message goes here"
```

Git will add your Signed-off-by statement along with your commit, so your contributions will be DCO-compliant.

### Update multiple versions of the docs

Some contributions apply to multiple versions of Sensu, or other sections of the documentation.
**Please copy your edits to all applicable Sensu docs versions.** 🙏

### Contribute elsewhere

This repository is one of several that are community-supported around Sensu.
See all the ways you can get involved by [visiting the Community repository][14].

One of the most helpful ways you can benefit the Sensu community is by writing about how you use Sensu.
Write up something on [Medium][11], embed Gists for longer code samples, and let us know in [Slack][1] or on [Discourse][8]!
We'll publish it to the blog at [blog.sensu.io][12].

## Thank you!

We :heart: your participation and appreciate the unique perspective you bring to our community.
Keep sharing the #monitoringlove.


[1]: https://slack.sensu.io
[2]: https://github.com/sensu/sensu-docs/wiki/Sensu-docs-style-guide
[3]: https://yarnpkg.com/getting-started/install
[4]: https://sensu.io/conduct
[5]: mailto:docs@sensu.io
[6]: https://github.com/sensu/sensu-docs/issues/new/choose
[7]: https://docs.sensu.io
[8]: https://discourse.sensu.io/
[9]: https://github.com/sensu/sensu-docs
[10]: https://help.github.com/articles/allowing-changes-to-a-pull-request-branch-created-from-a-fork/
[11]: https://medium.com
[12]: https://blog.sensu.io/
[13]: #dco-sign-off
[14]: https://github.com/sensu-plugins/community#how-you-can-help
[15]: https://gohugo.io/documentation/
[16]: https://github.com/yuin/goldmark
[17]: https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax
[18]: https://git-scm.com/book/en/v2/Getting-Started-Installing-Git
