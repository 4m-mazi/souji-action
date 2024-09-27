import type { Context } from '@actions/github/lib/context.js'
import type { EventPayloadMap } from '@octokit/webhooks-types'

type WorkflowEventPayloadMap = EventPayloadMap & {
  // https://docs.github.com/en/actions/writing-workflows/choosing-when-your-workflow-runs/events-that-trigger-workflows#pull_request_target
  pull_request_target: EventPayloadMap['pull_request']
}

type PayloadAndEventName<TName extends keyof WorkflowEventPayloadMap> = Omit<
  Context,
  'payload' | 'eventName'
> & {
  payload: WorkflowEventPayloadMap[TName]
  eventName: TName
}

export type StrictContext =
  | PayloadAndEventName<'check_run'>
  | PayloadAndEventName<'check_suite'>
  | PayloadAndEventName<'create'>
  | PayloadAndEventName<'delete'>
  | PayloadAndEventName<'deployment_status'>
  | PayloadAndEventName<'issue_comment'>
  | PayloadAndEventName<'merge_group'>
  | PayloadAndEventName<'pull_request'>
  | PayloadAndEventName<'pull_request_review'>
  | PayloadAndEventName<'pull_request_review_comment'>
  | PayloadAndEventName<'pull_request_target'>
  | PayloadAndEventName<'push'>
  | PayloadAndEventName<'registry_package'>
  | PayloadAndEventName<'release'>
  | PayloadAndEventName<'workflow_dispatch'>
  | PayloadAndEventName<'workflow_run'>
