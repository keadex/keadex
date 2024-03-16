import { DiagramType } from '@keadex/c4-model-ui-kit'
import { Autocomplete } from '@keadex/keadex-ui-kit/cross'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { diagramToLinkString, listDiagrams } from '../../core/tauri-rust-bridge'

export interface DiagramPickerProps {
  value?: string
  disabled?: boolean
  limit?: number
  onDiagramSelected: (diagram?: string) => void
  className?: string
}

export const DiagramPicker = React.memo((props: DiagramPickerProps) => {
  let { limit } = props

  if (limit === undefined) {
    limit = 4
  }

  const { t } = useTranslation()
  const [options, setOptions] = useState([{ label: '', value: '' }])
  const [diagrams, setDiagrams] = useState<string[]>()

  useEffect(() => {
    listDiagrams().then(async (diagrams) => {
      let diagramStrings: string[] = []
      for (const key in diagrams) {
        const typedKey = key as DiagramType
        diagramStrings = diagramStrings.concat(
          await Promise.all(
            diagrams[typedKey].map(async (diagramName) => {
              return await diagramToLinkString(diagramName, typedKey)
            }),
          ),
        )
      }
      setDiagrams(diagramStrings)
      handleOnTyping(
        !props.value || props.value === '',
        props.value ?? '',
        diagramStrings,
      )
    })
  }, [])

  function handleOnTyping(
    addDefaultOption: boolean,
    value: string,
    inputDiagrams?: string[],
  ) {
    const _diagrams = diagrams ?? inputDiagrams

    // Default option
    let options = addDefaultOption
      ? [
          {
            label: value,
            value: `${value !== '' ? `${value}_input` : ''}`,
          },
        ]
      : []

    // Options for each diagram
    if (_diagrams) {
      const filteredDiagrams = _diagrams.filter(
        (diagram) =>
          value === '' || diagram.toLowerCase().includes(value.toLowerCase()),
      )
      options = options.concat(
        filteredDiagrams.map((diagram) => {
          return {
            label: diagram,
            value: diagram,
          }
        }),
      )
    }

    // Set top x results
    if (options.length >= limit!) {
      options = options.slice(0, limit)
    }

    setOptions(options)
  }

  function handleOnDiagramSelected(selectedDiagram: string) {
    if (diagrams && diagrams.includes(selectedDiagram)) {
      props.onDiagramSelected(selectedDiagram)
    } else {
      props.onDiagramSelected()
    }
  }

  return (
    <Autocomplete
      disabled={props.disabled}
      id="diagram-picker"
      label={`${t('common.action.link_existing_diagram')}`}
      className={`${props.className ?? ''} mt-6`}
      value={props.value}
      options={options}
      onTyping={(value) => {
        handleOnTyping(true, value)
      }}
      onChange={(e) => {
        handleOnDiagramSelected(e.target.value)
      }}
      onDefaultOptionSelected={(value) => {
        handleOnDiagramSelected(value)
      }}
    />
  )
})

export default DiagramPicker
