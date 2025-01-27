import { createElement as create, FC } from 'react'
import { useLocalRouter, SideBar } from '@authpack/theme'
import { useSettings } from '../hooks/useSettings'
import { CreateTeam } from './CreateTeam'
import { SwitchTeam } from './SwitchTeam'
import { UpdateTeam } from './UpdateTeam'
import { RemoveTeam } from './RemoveTeam'
import { RouterMemberships } from './RouterMemberships'

export const RouterSideBarTeam: FC = () => {
  const settings = useSettings()
  const current = settings.bearer && settings.team ? settings.team : undefined
  const router = useLocalRouter({
    name: 'team',
    nomatch: current ? '/team/update' : '/team/create',
    options: current
      ? [
          { key: '/team/update', children: create(UpdateTeam) },
          {
            key: '/team/switch',
            children: create(SwitchTeam, {
              add: () => router.change('/team/create'),
            }),
          },
          {
            key: '/team/create',
            children: create(CreateTeam, {
              change: () => router.change('/team/update'),
            }),
          },
          { key: '/team/members', children: create(RouterMemberships) },
          { key: '/team/danger', children: create(RemoveTeam), nosave: true },
        ]
      : [
          {
            key: '/team/create',
            children: create(CreateTeam, {
              change: () => setTimeout(() => router.change('/team/update')),
            }),
          },
        ],
  })
  if (!settings.bearer) return null
  return create(SideBar, {
    key: 'sideBar',
    title: 'Team',
    footer: current && current.name,
    children: router.current && router.current.children,
    options: current
      ? [
          {
            icon: 'cog',
            label: 'Update',
            focused: router.current && router.current.key === '/team/update',
            click: () => router.change('/team/update'),
          },
          {
            icon: 'user-friends',
            label: 'Members',
            focused: router.current && router.current.key === '/team/members',
            click: () => router.change('/team/members'),
          },
          {
            icon: 'random',
            label: 'Switch',
            focused: router.current && router.current.key === '/team/switch',
            click: () => router.change('/team/switch'),
          },
          {
            icon: 'plus',
            label: 'Create',
            focused: router.current && router.current.key === '/team/create',
            click: () => router.change('/team/create'),
          },
          {
            icon: 'trash-alt',
            label: 'Remove',
            focused: router.current && router.current.key === '/team/danger',
            click: () => router.change('/team/danger'),
          },
        ]
      : [
          {
            icon: 'plus',
            label: 'Create',
            focused: router.current && router.current.key === '/team/create',
            click: () => router.change('/team/create'),
          },
        ],
  })
}
