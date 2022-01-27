# Contributing

[Code of conduct][coc] | [Contact admins][email] | [Open an Issue][issue]

Thank you for wanting to contribute to the Sensu Community!
Please read and follow our [code of conduct][coc].
Reach out to administrators at [docs@sensu.io][email] if needed.

## Browser workflow

From any documentation page on [docs.sensu.io][site], select "Edit this page".
This will take you to the corresponding markdown file in GitHub, create a fork of this repository, and create a new branch for your contribution.
Make your changes to the markdown content, then select "Propose changes" and follow the prompts to submit a pull request.
If you have any questions, feel free to [open an issue][issue].

## Command line workflow
These instructions will help you fork this repository, create a branch, and submit a pull request.

#### 1) Fork on GitHub

Fork the appropriate repository by clicking the Fork button (top right) on GitHub.

#### 2) Create a local fork

From the directory where you want to save this code, clone this repository and set up the upstream remote:

```
$ git clone https://github.com/REPLACEME/sensu-docs/
# or: git clone git@github.com:REPLACEME/sensu-docs.git

$ cd sensu-docs

$ git remote add upstream https://github.com/sensu/sensu-docs.git
# or: git remote add upstream git@github.com:sensu/sensu-docs.git
```

#### 3) Create a branch for your contribution

Begin by updating your local fork:

```
$ git fetch upstream
$ git checkout main
$ git rebase upstream/main
```

Create a new branch with a descriptive name to contain your change:

```
$ git checkout -b fix-code-samples
```

#### 4) Build and test
See the [Sensu Docs style guide][wiki] for formatting instructions and style conventions.

To build the site, run [`yarn`][yarn-install]. This builds the search index and compiles the static content.
You can then run `yarn run server` to view the site real-time as you edit.

#### 5) Commit

Commit your changes with a descriptive commit message.

```
$ git commit -am "fix invalid JSON"
```

Repeat the commit process as often as you need and edit/test/repeat. To add minor edits to your last commit:

```
$ git add -u
$ git commit --amend
```

This project uses commit hooks to test the build whenever making a commit.

#### 6) Push to GitHub

When your're ready to commit for review (or if you just want to establish an offsite backup or your work), push your branch to your fork on GitHub:

```
$ git push origin feature/myfeature
```

If you recently used `commit --amend`, you may need to force push:

```
$ git push -f origin feature/myfeature
```

#### 7) Create a pull request

Create a pull request by visiting [sensu/sensu-docs on GitHub](https://github.com/sensu/sensu-docs) and following the prompts.
We'd appreciate it if you could [allow edits to your PR from Sensu docs maintainers](https://help.github.com/articles/allowing-changes-to-a-pull-request-branch-created-from-a-fork/).

After the PR is submitted, project maintainers will review it.
If you'd like to mark your PR as work in progress, add `[WIP]` to the PR title.

If you have questions or want to ensure a PR is reviewed, reach out in the `Sensu Docs` category of the [Sensu Community Forum on Discourse][discourse] or the `#documentation` channel of the [Sensu Community Slack][slack].

## Guidelines

### Updating multiple versions of the docs
Some contributions apply to multiple versions of Sensu, or other sections of the documentation. **We appreciate if you have a chance to copy these edits to all applicable versions.** 🙏

If you have a good idea on how to script this type of behavior, please comment on [this issue discussing ideas](https://github.com/sensu/sensu-docs/issues/95).

## Contribute elsewhere
This repository is one of **many** that are community supported around Sensu. See all the ways you can get involved by [visiting the Community repository](https://github.com/sensu-plugins/community#how-you-can-help).

One of the most helpful ways you can benefit the Sensu community is by writing about how you use Sensu. Write up something on [Medium](https://medium.com), embed Gists for longer code samples and let us know in Slack! We'll publish it to the blog at [blog.sensu.io](https://blog.sensu.io/).

## Thank you!

We :heart: your participation and appreciate the unique perspective you bring to our community. Keep sharing the #monitoringlove.

[slack]: https://slack.sensu.io
[wiki]: https://github.com/sensu/sensu-docs/wiki/Sensu-docs-style-guide
[coc]: https://sensu.io/conduct
[email]: mailto:docs@sensu.io
[git]: https://git-scm.com/book/en/v2/Getting-Started-Installing-Git
[yarn]: https://yarnpkg.com/
[yarn-install]: https://yarnpkg.com/lang/en/docs/install/
[hugo]: https://gohugo.io/documentation/
[site]: https://docs.sensu.io
[issue]: https://github.com/sensu/sensu-docs/issues/new/choose
[discourse]: https://discourse.sensu.io/
