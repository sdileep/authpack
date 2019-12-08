import { useGQL } from '@authpack/theme'
import { useSettings } from './useSettings'
import { config } from '../config'

export const createUseServer = <T>(options: {
  operationName?: string
  query: string
}) => () => {
  return useServer<T>(options)
}

export const useServer = <T>(options: {
  operationName?: string
  query: string
}) => {
  const settings = useSettings()
  console.log(settings.client)
  return useGQL<T>({
    ...options,
    url: config.api,
    authorization: [settings.client, settings.bearer].filter(Boolean).join(','),
  })
}
