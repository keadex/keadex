import { createEventContext } from '@keadex/keadex-ui-kit/core'

export enum AppEventType {
  OpenDiagram,
  OpenSearch,
  GitHubTokenChanged,
}

export type AppEvent = {
  type: AppEventType
  data?: unknown
}

export default createEventContext<AppEvent>(null)
