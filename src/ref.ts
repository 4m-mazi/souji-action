import { WebhookPayload } from '@actions/github/lib/interfaces'
import {
  optionalStringParser,
  nullableStringParser,
  stringParser
} from './parser'
import { convertRef } from './internal/utils'

export const getRef = ({
  eventName,
  payload
}: {
  eventName: string
  payload: WebhookPayload
}): string | null => {
  switch (eventName) {
    case 'check_run':
      return convertRef(
        nullableStringParser(payload.check_run.check_suite.head_branch),
        { refType: 'branch' }
      )
    case 'check_suite':
      return convertRef(nullableStringParser(payload.check_suite.head_branch), {
        refType: 'branch'
      })
    case 'create':
    case 'delete':
      return convertRef(nullableStringParser(payload.ref), {
        refType: payload.ref_type
      })
    case 'deployment_status':
      return convertRef(
        optionalStringParser(payload.workflow_run?.head_branch),
        {
          refType: 'branch'
        }
      )
    case 'issue_comment':
      return convertRef(stringParser(payload.issue?.number.toString()), {
        refType: 'pull'
      })
    case 'merge_group':
      return stringParser(payload.merge_group.head_ref)
    case 'pull_request':
    case 'pull_request_review':
    case 'pull_request_review_comment':
    case 'pull_request_target':
      return convertRef(payload.pull_request?.number.toString(), {
        refType: 'pull'
      })
    case 'push':
      return stringParser(payload.ref)
    case 'registry_package':
      return convertRef(
        optionalStringParser(
          payload.registry_package?.package_version?.release?.tag_name
        ),
        {
          refType: 'tag'
        }
      )
    case 'release':
      return convertRef(stringParser(payload.release.tag_name), {
        refType: 'tag'
      })
    case 'workflow_dispatch':
      return stringParser(payload.ref)
    case 'workflow_run':
      return convertRef(
        nullableStringParser(payload.workflow_run.head_branch),
        {
          refType: 'branch'
        }
      )
    default:
      throw new Error(`${eventName} event is not supported.`)
  }
}
