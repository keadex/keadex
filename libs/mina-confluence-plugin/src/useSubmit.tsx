import { view } from '@forge/bridge'
import { useState } from 'react'

import { MinaMacroConfig } from './Config'

export const useSubmit = () => {
  const [error, setError] = useState(false)
  const [message, setMessage] = useState('')

  const submit = async (fields: MinaMacroConfig) => {
    const payload = { config: fields }

    try {
      await view.submit(payload)
      setError(false)
      setMessage(`Submitted successfully.`)
    } catch (error: any) {
      setError(true)
      setMessage(`${error.code}: ${error.message}`)
    }
  }

  return {
    error,
    message,
    submit,
  }
}
