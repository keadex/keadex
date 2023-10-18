import { C4ElementType } from '../models/autogenerated/C4ElementType'
import { DiagramType } from '../models/autogenerated/DiagramType'
import { PersonType } from '../models/autogenerated/PersonType'
import { ComponentType } from '../models/autogenerated/ComponentType'
import { ContainerType } from '../models/autogenerated/ContainerType'
import { SystemType } from '../models/autogenerated/SystemType'

export const DIAGRAM_TYPES: DiagramType[] = [
  'SYSTEM_CONTEXT',
  'CONTAINER',
  'COMPONENT',
  'SYSTEM_LANDSCAPE',
  'DYNAMIC',
  'DEPLOYMENT',
]

export const C4_ELEMENTS_TYPES: C4ElementType[] = [
  'Person',
  'SoftwareSystem',
  'Container',
  'Component',
]

export const PERSON_TYPES: PersonType[] = ['Person', 'Person_Ext']

export const COMPONENT_TYPES: ComponentType[] = [
  'Component',
  'Component_Ext',
  'ComponentDb',
  'ComponentDb_Ext',
  'ComponentQueue',
  'ComponentQueue_Ext',
]

export const CONTAINER_TYPES: ContainerType[] = [
  'Container',
  'Container_Ext',
  'ContainerDb',
  'ContainerDb_Ext',
  'ContainerQueue',
  'ContainerQueue_Ext',
]

export const SYSTEM_TYPES: SystemType[] = [
  'System',
  'System_Ext',
  'SystemDb',
  'SystemDb_Ext',
  'SystemQueue',
  'SystemQueue_Ext',
]