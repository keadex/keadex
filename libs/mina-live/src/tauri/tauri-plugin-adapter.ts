import type { InvokeArgs } from '@tauri-apps/api/core'

type PluginDescriptor = {
  id: string
  commands: Record<string, string>
}

//------- Plugin Clipboard Manager
type WriteTextArgs = {
  text: string
  opts?: {
    label?: string
  }
}
const PLUGIN_CLIPBOARD_MANAGER: PluginDescriptor = {
  id: 'plugin:clipboard-manager',
  commands: {},
}
PLUGIN_CLIPBOARD_MANAGER.commands = {
  writeText: `${PLUGIN_CLIPBOARD_MANAGER.id}|write_text`,
}

//------- Plugin Shell
type OpenArgs = {
  path: string
}
const PLUGIN_SHELL: PluginDescriptor = {
  id: 'plugin:shell',
  commands: {},
}
PLUGIN_SHELL.commands = {
  open: `${PLUGIN_SHELL.id}|open`,
}

export async function invokeTauriPlugin<T>(
  plugin: string,
  args?: InvokeArgs,
): Promise<T> {
  switch (plugin) {
    case PLUGIN_CLIPBOARD_MANAGER.commands.writeText: {
      const typedArgs = args as WriteTextArgs | undefined
      if (typedArgs) navigator.clipboard.writeText(typedArgs.text)
      break
    }
    case PLUGIN_SHELL.commands.open: {
      const typedArgs = args as OpenArgs | undefined
      if (typedArgs) window.open(typedArgs.path, '_blank')
      break
    }
  }
  return Promise.resolve({} as T)
}
