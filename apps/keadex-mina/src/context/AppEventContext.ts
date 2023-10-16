import { createEventContext } from '@keadex/keadex-ui-kit/cross'

export enum AppEventType {
  OpenDiagram,
  OpenSearch,
}

export type AppEvent = {
  type: AppEventType
  data?: unknown
}

export default createEventContext<AppEvent>(null)
