import { convertRef } from './internal/utils.js'
import type { StrictContext } from './types.js'

export const getRef = ({
  eventName,
  payload
}: StrictContext): string | null => {
  switch (eventName) {
    case 'check_run':
      return convertRef(payload.check_run.check_suite.head_branch, {
        refType: 'branch'
      })
    case 'check_suite':
      return convertRef(payload.check_suite.head_branch, {
        refType: 'branch'
      })
    case 'create':
    case 'delete':
      return convertRef(payload.ref, {
        refType: payload.ref_type
      })
    case 'deployment_status':
      return convertRef(payload.workflow_run?.head_branch, {
        refType: 'branch'
      })
    case 'issue_comment':
      return convertRef(payload.issue.number.toString(), {
        refType: 'pull'
      })
    case 'merge_group':
      return payload.merge_group.head_ref
    case 'pull_request':
    case 'pull_request_review':
    case 'pull_request_review_comment':
    case 'pull_request_target':
      return convertRef(payload.pull_request.number.toString(), {
        refType: 'pull'
      })
    case 'push':
      return payload.ref
    case 'registry_package':
      return convertRef(
        payload.registry_package.package_version?.release?.tag_name,
        {
          refType: 'tag'
        }
      )
    case 'release':
      return convertRef(payload.release.tag_name, {
        refType: 'tag'
      })
    case 'workflow_dispatch':
      return payload.ref
    case 'workflow_run':
      return convertRef(payload.workflow_run.head_branch, {
        refType: 'branch'
      })
    default:
      throw new Error(`${eventName} event is not supported.`)
  }
}
