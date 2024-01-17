import * as core from '@actions/core'
import * as github from '@actions/github'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const token = core.getInput('repo-token')
    const octokit = github.getOctokit(token)
    // get context
    // MEMO: git contextからheadRefは取得できなそう
    const { repo, ref } = github.context

    const headRef = process.env.GITHUB_HEAD_REF
    core.debug(`headRef: ${headRef}`)

    if (headRef) {
      // Get the list of cache IDs
      // https://github.com/octokit/plugin-paginate-rest.js#octokitpaginate
      const iterator = octokit.paginate.iterator(
        octokit.rest.actions.getActionsCacheList,
        {
          ...repo,
          ref: headRef
        }
      )

      for await (const { data: cacheList } of iterator) {
        for (const { id: cacheId } of cacheList) {
          if (!cacheId) continue
          await octokit.rest.actions.deleteActionsCacheById({
            ...repo,
            cache_id: cacheId
          })
        }
      }
    }

    // Get the list of cache IDs
    // https://github.com/octokit/plugin-paginate-rest.js#octokitpaginate
    const iterator = octokit.paginate.iterator(
      octokit.rest.actions.getActionsCacheList,
      {
        ...repo,
        ref
      }
    )

    for await (const { data: cacheList } of iterator) {
      for (const { id: cacheId } of cacheList) {
        if (!cacheId) continue
        await octokit.rest.actions.deleteActionsCacheById({
          ...repo,
          cache_id: cacheId
        })
      }
    }
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
