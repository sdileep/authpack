import { createElement as create, FC } from 'react'
import { useTheme } from '../contexts/Theme'
import { css } from 'emotion'
import { Icon } from './Icon'
import { useToaster } from '../hooks/useToaster'

export const Toaster: FC<{
  width?: number
}> = ({ width = 300 }) => {
  const theme = useTheme()
  const toaster = useToaster()
  return create('div', {
    className: css({
      all: 'unset',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      position: 'absolute',
      right: 0,
      bottom: 0,
      zIndex: 250,
      padding: 25,
    }),
    children: toaster.map(({ id, icon, solid, label, helper, close }) => {
      return create('div', {
        key: id,
        className: css({
          all: 'unset',
          display: 'flex',
          alignItems: 'flex-start',
          overflow: 'hidden',
          padding: 15,
          marginTop: 15,
          borderRadius: theme.global.radius,
          width,
          boxShadow: theme.toaster.shadow,
          background: theme.toaster.background,
          border: theme.toaster.border,
          color: theme.toaster.label,
        }),
        children: [
          create(Icon, {
            key: 'icon',
            icon: icon || 'bell',
            solid,
          }),
          create('div', {
            key: 'text',
            className: css({
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1,
              marginLeft: 10,
              marginRight: 10,
            }),
            children: [
              create('div', {
                key: 'label',
                children: label,
              }),
              helper &&
                create('div', {
                  key: 'helper',
                  children: helper,
                  className: css({
                    marginTop: 5,
                    color: theme.toaster.helper,
                  }),
                }),
            ],
          }),
          create('div', {
            key: 'close',
            onClick: close,
            className: css({
              all: 'unset',
              display: 'flex',
              cursor: 'pointer',
              transition: '200ms',
              padding: 5,
              margin: -5,
              borderRadius: theme.global.radius,
              '&:hover': {
                background: theme.toaster.backgroundHover,
              },
            }),
            children: create(Icon, {
              icon: 'times-circle',
              solid: false,
            }),
          }),
        ],
      })
    }),
  })
}
