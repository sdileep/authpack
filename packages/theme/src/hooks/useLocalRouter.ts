import { useMemo, ReactNode, useEffect, useState } from 'react'
import { useMounted } from './useMounted'

export const useLocalRouter = ({
  name,
  nomatch,
  options,
}: {
  name?: string
  nomatch?: string
  options: Array<{
    key: string
    children: ReactNode
    nosave?: boolean
  }>
}) => {
  const mounted = useMounted()
  const local = name && localStorage.getItem(`authpack.router.${name}`)
  const parsedOptions = options.filter(Boolean)
  const index = parsedOptions.findIndex(option => {
    return option.key === (local || nomatch)
  })
  const start =
    index >= 0
      ? parsedOptions[index].key
      : parsedOptions[0] && parsedOptions[0].key
  const [key, keyChange] = useState<undefined | string>(start)
  const [current] = parsedOptions.filter(option => key && key === option.key)
  const change = (next: string) => {
    if (!mounted.current) return
    const matching = parsedOptions.filter(option => option.key === next)
    keyChange(matching.length ? matching[0].key : undefined)
  }
  useEffect(() => {
    if (!mounted.current) return
    if (!current) return start ? keyChange(start) : undefined
    if (!current.nosave && name)
      localStorage.setItem(`authpack.router.${name}`, current.key)
  }, [key, parsedOptions.map(option => option.key).join()])
  return useMemo(() => {
    return {
      current,
      change,
    }
  }, [key])
}
