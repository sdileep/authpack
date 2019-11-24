import { createElement as create, FC, Fragment } from 'react'
import { useLocalRouter, Modal, Layout, IconBar } from 'wga-theme'
import { CreateTeam } from './CreateTeam'
import { UpdateTeam } from './UpdateTeam'
import { RemoveTeam } from './RemoveTeam'
import { ShowTeam } from './ShowTeam'

export const RouterManagerTeam: FC<{
  id?: string
  change?: (id?: string) => void
  visible?: boolean
  close: () => void
}> = ({ id, change, close, visible }) => {
  const router = useLocalRouter({
    nomatch: id ? '/inspect' : '/create',
    options: id
      ? [
          { key: '/inspect', children: create(ShowTeam, { id }) },
          { key: '/update', children: create(UpdateTeam, { id, change }) },
          { key: '/remove', children: create(RemoveTeam, { id, change }) },
        ]
      : [{ key: '/create', children: create(CreateTeam, { change }) }],
  })
  return create(Modal, {
    close,
    visible,
    children: create(Layout, {
      grow: true,
      children: [
        create(IconBar, {
          key: 'iconBar',
          icons: id
            ? [
                {
                  icon: 'glasses',
                  label: 'Inspect',
                  focused:
                    !!router.current && router.current.key === '/inspect',
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
        router.current &&
          create(Fragment, {
            key: 'children',
            children: router.current.children,
          }),
      ],
    }),
  })
}