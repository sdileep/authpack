import { createElement as create, FC } from 'react'
import { Gadgets } from 'wga-theme'
import { createUseServer } from '../hooks/useServer'
import { ConfirmRemove } from '../templates/ConfirmRemove'
import { useUniversal } from '../hooks/useUniversal'

export const RemovePermission: FC<{
  id: string
  change?: (id?: string) => void
}> = ({ id, change }) => {
  const universal = useUniversal()
  const gqlRemovePermission = useRemovePermission()
  return create(Gadgets, {
    title: 'Remove Permission',
    subtitle: universal.app_name,
    children: create(ConfirmRemove, {
      helper: 'Remove this permission',
      alert: 'Please confirm the removal of this permission',
      change: () =>
        gqlRemovePermission.fetch({ id }).then(() => change && change()),
    }),
  })
}

const useRemovePermission = createUseServer<{
  permission: {
    id: string
  }
}>({
  query: `
    mutation apiRemovePermission($id: String!) {
      permission: apiRemovePermission(id: $id) {
        id
      }
    }
  `,
})