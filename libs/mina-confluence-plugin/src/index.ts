import Resolver from '@forge/resolver'

const resolver = new Resolver()

resolver.define('getText', (req) => {
  return 'Hello, world!'
})

export const handler = resolver.getDefinitions()

export { config, type MinaMacroConfig } from './Config'
