import {
  C4ElementType,
  Component,
  Container,
  Person,
  SoftwareSystem,
} from '@keadex/c4-model-ui-kit'
import { AccessorFn } from '@tanstack/react-table'
import { capitalCase, noCase, snakeCase } from 'change-case'
import { TFunction } from 'i18next'
import ModalCRUPerson from '../../components/ModalCRULibraryElement/ModalCRUPerson/ModalCRUPerson'
import ModalCRUSoftwareSystem from '../../components/ModalCRULibraryElement/ModalCRUSoftwareSystem/ModalCRUSoftwareSystem'
import { ElementData } from './LibraryElement'
import ModalCRUContainer from '../../components/ModalCRULibraryElement/ModalCRUContainer/ModalCRUContainer'
import ModalCRUComponent from '../../components/ModalCRULibraryElement/ModalCRUComponent/ModalCRUComponent'

type AccessorType = 'persons' | 'containers' | 'components' | 'software_systems'
type i18nKeyType = 'person' | 'container' | 'component' | 'system'
type TypeAccessorType =
  | 'person_type'
  | 'container_type'
  | 'component_type'
  | 'system_type'

export type LibraryElementConfigs = {
  accessor: AccessorType
  i18nKey: i18nKeyType
  typeColumnId: string
  typeAccessorFn: AccessorFn<ElementData, unknown>
  modal: typeof ModalCRUPerson | typeof ModalCRUSoftwareSystem
}

export function buildLibraryElementConfigs(
  c4ElementType: C4ElementType,
  t: TFunction,
): LibraryElementConfigs {
  // i18n key
  const i18nKey = `${snakeCase(c4ElementType).toLowerCase()}` as i18nKeyType

  // Accessor
  const accessor = `${i18nKey}s` as AccessorType

  // Type Column Id
  // (in case of the Software System, you need to remove the "software_" substring since
  // the property of the object is "system_type").
  const typeColumnId = `${i18nKey.replace(
    'software_',
    '',
  )}_type` as TypeAccessorType

  // Type Accessor Fn
  const typeAccessorFn: AccessorFn<ElementData, unknown> = (row) => {
    let type = ''
    switch (c4ElementType) {
      case 'Person':
        type = (row as Person).person_type?.toString() ?? ''
        break
      case 'Container':
        type = (row as Container).container_type?.toString() ?? ''
        break
      case 'Component':
        type = (row as Component).component_type?.toString() ?? ''
        break
      case 'SoftwareSystem':
        type = (row as SoftwareSystem).system_type?.toString() ?? ''
        break
    }
    return capitalCase(noCase(type))
  }

  // Modal
  let modal = ModalCRUPerson
  switch (c4ElementType) {
    case 'Person':
      modal = ModalCRUPerson
      break
    case 'Container':
      modal = ModalCRUContainer
      break
    case 'Component':
      modal = ModalCRUComponent
      break
    case 'SoftwareSystem':
      modal = ModalCRUSoftwareSystem
      break
  }

  return {
    accessor,
    i18nKey,
    typeColumnId,
    typeAccessorFn,
    modal,
  }
}

export default buildLibraryElementConfigs
