import { createElement as create, FC, useState, Fragment } from 'react'
import { useLocalRouter, IconBar } from '@authpack/theme'
import { LoginUser } from './LoginUser'
import { SignupUser } from './SignupUser'
import { RecoverUserPassword } from './RecoverUserPassword'
import { GetStarted } from './GetStarted'

export const RouterModalUnauthed: FC<{
  close: () => void
}> = ({ close }) => {
  const [startup, startupChange] = useState<boolean>(true)
  const router = useLocalRouter({
    nomatch: '/login',
    options: [
      { key: '/login', children: create(LoginUser) },
      { key: '/signup', children: create(SignupUser) },
      { key: '/forgot', children: create(RecoverUserPassword) },
    ],
  })
  const clicker = (screen: string) => () => {
    startupChange(false)
    router.change(screen)
  }
  return create(IconBar, {
    children: startup
      ? create(GetStarted, {
          key: 'started',
          login: clicker('/login'),
          signup: clicker('/signup'),
        })
      : router.current &&
        create(Fragment, {
          key: 'children',
          children: router.current.children,
        }),
    icons: [
      {
        icon: 'unlock',
        label: 'Login',
        focused: router.current && router.current.key === '/login',
        click: clicker('/login'),
      },
      {
        icon: 'plus',
        label: 'Signup',
        focused: router.current && router.current.key === '/signup',
        click: clicker('/signup'),
      },
      {
        prefix: 'far',
        icon: 'question-circle',
        label: 'Recovery',
        focused: router.current && router.current.key === '/forgot',
        click: clicker('/forgot'),
      },
      {
        icon: 'times-circle',
        label: 'Close',
        click: close,
        prefix: 'far',
        seperated: true,
      },
    ],
  })
}
