import { createElement as create, FC } from 'react'
import { useLocalRouter, Modal, IconBar } from '@authpack/theme'
import { CreatePermission } from './CreatePermission'
import { UpdatePermission } from './UpdatePermission'
import { RemovePermission } from './RemovePermission'
import { ShowPermission } from './ShowPermission'

export const RouterManagerPermission: FC<{
  id?: string
  change?: (id?: string) => void
  visible?: boolean
  close: () => void
}> = ({ id, change, close, visible }) => {
  const router = useLocalRouter({
    nomatch: id ? '/inspect' : '/create',
    options: id
      ? [
          { key: '/inspect', children: create(ShowPermission, { id }) },
          {
            key: '/update',
            children: create(UpdatePermission, { id, change }),
          },
          {
            key: '/remove',
            children: create(RemovePermission, { id, change }),
          },
        ]
      : [{ key: '/create', children: create(CreatePermission, { change }) }],
  })
  return create(Modal, {
    close,
    visible,
    children: create(IconBar, {
      children: router.current && router.current.children,
      icons: id
        ? [
            {
              icon: 'glasses',
              label: 'Inspect',
              focused: !!router.current && router.current.key === '/inspect',
              click: () => router.change('/inspect'),
            },
            {
              icon: 'sliders-h',
              label: 'Update',
              focused: !!router.current && router.current.key === '/update',
              click: () => router.change('/update'),
            },
            {
              icon: 'trash-alt',
              label: 'Remove',
              focused: !!router.current && router.current.key === '/remove',
              click: () => router.change('/remove'),
            },
            {
              icon: 'times-circle',
              label: 'Close',
              click: close,
              prefix: 'far',
              seperated: true,
            },
          ]
        : [
            {
              icon: 'plus',
              label: 'Create',
              focused: !!router.current && router.current.key === '/create',
              click: () => router.change('/create'),
            },
            {
              icon: 'times-circle',
              label: 'Close',
              click: close,
              prefix: 'far',
              seperated: true,
            },
          ],
    }),
  })
}
