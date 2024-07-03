# Souji Action 🧹 [![OpenSSF Scorecard](https://api.scorecard.dev/projects/github.com/4m-mazi/souji-action/badge)](https://scorecard.dev/viewer/?uri=github.com/4m-mazi/souji-action)

[![GitHub Super-Linter](https://github.com/4m-mazi/souji-action/actions/workflows/linter.yml/badge.svg)](https://github.com/super-linter/super-linter)
![CI](https://github.com/4m-mazi/souji-action/actions/workflows/ci.yml/badge.svg)
[![Check dist/](https://github.com/4m-mazi/souji-action/actions/workflows/check-dist.yml/badge.svg)](https://github.com/actions/4m-mazi/souji-action/actions/workflows/check-dist.yml)
[![CodeQL](https://github.com/4m-mazi/souji-action/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/4m-mazi/souji-action/actions/workflows/codeql-analysis.yml)

Souji Action is a GitHub Action that deletes all GitHub Actions Caches related
to the context of the triggered workflow event, without any configuration
required.

## Why

GitHub Actions Caches have
[branch scope restriction](https://docs.github.com/en/actions/using-workflows/caching-dependencies-to-speed-up-workflows#restrictions-for-accessing-a-cache)
in place. This means that there are caches that will never be restored in the
future. This action allows you to easily delete such caches.

## Usage

`actions:write` permission is
[required to delete caches](https://docs.github.com/en/rest/actions/cache?apiVersion=2022-11-28#delete-a-github-actions-cache-for-a-repository-using-a-cache-id).

<!-- x-release-please-start-version -->

```yml
name: cleanup caches by a branch
on:
  pull_request_target:
    types:
      - closed
  delete:
  workflow_dispatch:
    inputs:
      branchNames:
        description: 'List of branch(ref) names with caches to be deleted'
        required: false
        type: string

jobs:
  cleanup:
    runs-on: ubuntu-latest
    permissions:
      actions: write
    steps:
      - name: Cleanup
        uses: 4m-mazi/souji-action@v1.3.0
        with:
          branch-names: ${{ inputs.branchNames }}
```

<!-- x-release-please-end -->

This workflow cleans up caches for branches when they are merged(closed) or
deleted. \
This will clear the following cache:

- merge ref `refs/pull/<number>/merge`
  - When a pull request is merged or closed, this workflow removes cached data
    associated with the merge ref.
- branch `<branch name>`
  - When a branch is deleted, this workflow deletes the cached data associated
    with the branch.

## Inputs

> [!NOTE]\
> `List` type is a string of characters separated by newlines or spaces.
>
> ```yaml
> branch-names: |
>   main
>   refs/pull/123/merge
>   refs/tags/1.0.0
> ```
>
> ```yaml
> branch-names: main refs/pull/123/merge refs/tags/1.0.0
> ```

All inputs are optional.

| Name           | Description                                                                                            | Type    | Default                                                      |
| :------------- | :----------------------------------------------------------------------------------------------------- | :------ | :----------------------------------------------------------- |
| `dry-run`      | If `true`, dry-run caches deletion.                                                                    | Boolean | `false`                                                      |
| `branch-names` | List of branch(ref) names with caches to be deleted (e.g., `main refs/pull/123/merge refs/tags/1.0.0`) | List    | [#branch-names-default-values](#branch-names-default-values) |

### `branch-names` default values

If `branch-names` is not specified, the value derived from the context of the
event is used as the default value.

> [!IMPORTANT]\
> The branch(ref) to be deleted is determined by the context of the event.\
> Please note that this is not the same as `$GITHUB_REF`(`github.ref`).

| event                         | branch name format of caches to be deleted | concrete example                                                         |
| :---------------------------- | :----------------------------------------- | :----------------------------------------------------------------------- |
| `check_run`                   | `<branch name>`                            | `main`                                                                   |
| `check_suite`                 | `<branch name>`                            | `main`                                                                   |
| `create` (branch)             | `<branch name>`                            | `test`                                                                   |
| `create` (tag)                | `refs/tags/<tag name>`                     | `refs/tags/v2.3.4`                                                       |
| `delete` (branch)             | `<branch name>`                            | `gh-readonly-queue/main/pr-813-bef2983ddf2ae45fbf6ef6c788732c6bc7797cae` |
| `delete` (tag)                | `refs/tags/<tag name>`                     | `refs/tags/v2.3.4`                                                       |
| `deployment_status`           | `<branch name>`                            | `test`                                                                   |
| `issue_comment` [^1]          | `refs/pull/<number>/merge`                 | `refs/pull/123/merge`                                                    |
| `merge_group`                 | `<branch name>`                            | `gh-readonly-queue/main/pr-746-48d2a411fc179d6938d5c57a5040d1b38f3eb198` |
| `pull_request` [^2]           | `refs/pull/<number>/merge`                 | `refs/pull/123/merge`                                                    |
| `pull_request_review`         | `refs/pull/<number>/merge`                 | `refs/pull/123/merge`                                                    |
| `pull_request_review_comment` | `refs/pull/<number>/merge`                 | `refs/pull/123/merge`                                                    |
| `pull_request_target`         | `refs/pull/<number>/merge`                 | `refs/pull/123/merge`                                                    |
| `push` (branch)               | `<branch name>`                            | `test`                                                                   |
| `push` (tag)                  | `refs/tags/<tag name>`                     | `refs/tags/v2.3.4`                                                       |
| `registry_package`            | `refs/tags/<tag name>`                     | `refs/tags/v2.3.4`                                                       |
| `release`                     | `refs/tags/<tag name>`                     | `refs/tags/v2.3.4`                                                       |
| `workflow_dispatch` (branch)  | `<branch name>`                            | `test`                                                                   |
| `workflow_dispatch` (tag)     | `refs/tags/<tag name>`                     | `refs/tags/v2.3.4`                                                       |
| `workflow_run`                | `<branch name>`                            | `main`                                                                   |

[^1]: Only works with pull request comments.

[^2]:
    This action doesn't work when triggered by a `pull_request` event if the
    pull request is a cross-repository pull request.\
    Therefore, it is recommended to use the `pull_request_target` event instead.
