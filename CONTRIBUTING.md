# Contributing

[Code of conduct][coc] | [Contact admins][email] | [Open an Issue][issue]

Thank you for wanting to contribute back to the Sensu Community!
Please read and follow our [code of conduct][coc].
Anyone can reach out to administrators at [docs@sensu.io][email] if needed.

## Browser workflow

From any documentation page on [docs.sensu.io][site], select "Edit this page".
This will take you to the corresponding markdown file in GitHub, create a fork of this repository, and create a new branch for your contribution.
Make your changes to the markdown content, then select "Propose file change" and follow the prompts to submit a pull request.
If you have any questions, feel free to [open an issue][issue].

## Command line workflow
These instructions will help you fork this repository, create a branch, and submit a pull request.

#### 1) Fork on GitHub

Fork the appropriate repository by clicking the Fork button (top right) on GitHub.

#### 2) Create a local fork

From whatever directory you want to have this code, clone this repository and set up the upstream remote:

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
$ git checkout master
$ git rebase upstream/master
```

Create a new, descriptively named branch to contain your change:

```
$ git checkout -b fix-code-samples
```

#### 4) Build and test
See the [project wiki][wiki] for formatting instructions and style conventions.

To build the site, run [`yarn`][yarn-install]. This builds the search index and compiles the static content.
You can then run `yarn run server` to view the site real-time as you edit.

#### 5) Commit

Commit your changes with a descriptive commit message.

```
$ git commit -am "fix invalid JSON"
```

Repeat the commit process as often as you need and then edit/test/repeat. Minor edits can be added to your last commit quite easily:

```
$ git add -u
$ git commit --amend
```

This project uses commit hooks to test the build whenever making a commit.

#### 6) Push to GitHub

When ready to review (or just to establish an offsite backup or your work), push your branch to your fork on GitHub:

```
$ git push origin feature/myfeature
```

If you recently used `commit --amend`, you may need to force push:

```
$ git push -f origin feature/myfeature
```

#### 7) Create a Pull Request

Create a pull request by visiting [sensu/sensu-docs on GitHub](https://github.com/sensu/sensu-docs) and following the prompts.

After the PR is submitted, project maintainers will review it.
If you'd like to mark your PR as work in progress, add `[WIP]` to the PR title.

If you have questions or want to ensure a PR is reviewed, reach out in the `#documentation` channel of the [Sensu Community Slack][slack].

## Guidelines

### Updating Multiple Versions of the Docs
Some contributions apply to multiple versions of Sensu, or other sections of the documentation. **We appreciate if you have a chance to copy these edits to all applicable versions.** 🙏

If you have a good idea on how to script this type of behavior, please comment on [this issue discussing ideas](https://github.com/sensu/sensu-docs/issues/95).

## Contribute Elsewhere
This repository is one of **many** that are community supported around Sensu. See all the ways you can get involved by [visiting the Community repository](https://github.com/sensu-plugins/community#how-you-can-help).

One of the most helpful ways you can benefit the Sensu community is by writing about how you use Sensu. Write up something on [Medium](https://medium.com), embed Gists for longer code samples and let us know in Slack! We'll publish it to the blog at [blog.sensu.io](https://blog.sensu.io/).

## Thank You

We :heart: your participation and appreciate the unique perspective you bring to our community. Keep sharing the #monitoringlove.

[slack]: http://slack.sensu.io
[wiki]: https://github.com/sensu/sensu-docs/wiki
[coc]: https://sensu.io/conduct
[email]: mailto:docs@sensu.io
[git]: https://git-scm.com/book/en/v2/Getting-Started-Installing-Git
[yarn]: https://yarnpkg.com/
[yarn-install]: https://yarnpkg.com/lang/en/docs/install/
[hugo]: https://gohugo.io/documentation/
[site]: https://docs.sensu.io
[issue]: https://github.com/sensu/sensu-docs/issues/new
