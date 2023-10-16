import equal from 'fast-deep-equal/es6/react'
import loCloneDeep from 'lodash.clonedeep'

export const objectsAreEqual = <T>(objA: T, objB: T): boolean => {
  return equal(objA, objB)
}

export const cloneDeep = <T>(obj: T): T => {
  return loCloneDeep(obj)
}
