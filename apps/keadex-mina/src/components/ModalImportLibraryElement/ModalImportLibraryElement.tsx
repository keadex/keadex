import {
  C4_ELEMENTS_TYPES,
  C4ElementType,
  c4ElementTypeHumanName,
  Component,
  Container,
  DiagramElementType,
  Person,
  SoftwareSystem,
} from '@keadex/c4-model-ui-kit'
import { renderButtons, Select, TableData } from '@keadex/keadex-ui-kit/cross'
import pluralize from 'pluralize'
import type { MouseEvent } from 'react'
import { memo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import LibraryElement, {
  ElementData,
} from '../../views/LibraryElement/LibraryElement'

export interface ModalImportLibraryElementProps {
  onLibraryElementSelected: (libraryElement: DiagramElementType) => void
  hideModal: () => void
}

export const ModalImportLibraryElement = memo(
  (props: ModalImportLibraryElementProps) => {
    const { t } = useTranslation()
    const [c4ElementType, setC4ElementType] = useState<C4ElementType>('Person')

    function handleRowClick(
      e: MouseEvent<HTMLTableCellElement>,
      data: TableData<ElementData>,
    ) {
      const { menu, ...libraryElementData } = data
      let libraryElement: DiagramElementType | undefined
      switch (c4ElementType) {
        case 'Person':
          libraryElement = {
            Person: libraryElementData as Person,
          }
          break
        case 'SoftwareSystem':
          libraryElement = {
            SoftwareSystem: libraryElementData as SoftwareSystem,
          }
          break
        case 'Container':
          libraryElement = {
            Container: libraryElementData as Container,
          }
          break
        case 'Component':
          libraryElement = {
            Component: libraryElementData as Component,
          }
          break

        default:
          break
      }
      if (libraryElement) {
        props.onLibraryElementSelected(libraryElement)
        props.hideModal()
      }
    }

    return (
      <div>
        {/* Modal body */}
        <div className="modal__body flex h-[500px] flex-col">
          <Select
            id="element-type-selector"
            label={`${t('diagram_editor.select_element_type_to_import')}`}
            className="mx-3 mt-6"
            value={c4ElementType}
            options={[
              ...new Set(
                C4_ELEMENTS_TYPES.map((c4ElementType) => {
                  return {
                    label: pluralize(c4ElementTypeHumanName(c4ElementType)),
                    value: c4ElementType,
                  }
                }),
              ),
            ]}
            onChange={(e) => setC4ElementType(e.target.value as C4ElementType)}
          />
          <LibraryElement
            c4ElementType={c4ElementType}
            pageSize={5}
            embedMode
            onRowClick={handleRowClick}
          />
        </div>

        {/* Modal footer */}
        <div className="modal__footer">
          {renderButtons([
            {
              key: 'button-cancel',
              children: <span>{t('common.cancel')}</span>,
              'data-te-modal-dismiss': true,
            },
          ])}
        </div>
      </div>
    )
  },
)

export default ModalImportLibraryElement
