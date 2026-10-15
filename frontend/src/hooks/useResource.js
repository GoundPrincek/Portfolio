import { useEffect, useState } from 'react'

export function useResource(loader, fallback = []) {
  const [data, setData] = useState(fallback)
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let active = true
    loader().then((items) => {
      if (!active) return
      const value = items ?? []
      setData(value)
      setError('')
      setStatus((Array.isArray(value) ? value.length > 0 : Boolean(value)) ? 'success' : 'empty')
    }).catch((reason) => {
      if (!active) return
      setError(reason.message || 'Unable to load this content.')
      setStatus('error')
    })
    return () => { active = false }
  }, [loader, attempt])

  const retry = () => {
    setStatus('loading')
    setAttempt((value) => value + 1)
  }
  return { data, status, error, retry }
}
