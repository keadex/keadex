import { useModal, useQueryParams } from '@keadex/keadex-ui-kit/cross'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppDispatch } from '../../core/store/hooks'

export type ExternalDiagramsParams = {
  diagram: string
}

/* eslint-disable-next-line */
export interface ExternalDiagramsProps {}

export const ExternalDiagrams = React.memo((props: ExternalDiagramsProps) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { modal, showModal, hideModal } = useModal()

  const { diagram: diagramParam } = useParams<ExternalDiagramsParams>()
  const queryParams = useQueryParams()

  console.log('diagramParam', diagramParam)
  console.log('queryParams', queryParams)

  return (
    <div className={`relative flex h-full w-full flex-col justify-center`}>
      {modal}
      Hello
    </div>
  )
})

export default ExternalDiagrams
