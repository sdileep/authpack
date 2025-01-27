import { createElement as create, FC } from 'react'
import { css } from 'emotion'
import { useTheme } from '../hooks/useTheme'
import { Icon } from './Icon'
import { Scroller } from './Scroller'

export const Menu: FC<{
  isolated?: boolean
  options: Array<{
    label: string
    helper?: string
    icon: string
    prefix?: string
    click?: () => void
  }>
}> = ({ isolated, options }) => {
  const theme = useTheme()
  return create('div', {
    className: css({
      overflow: 'hidden',
      borderRadius: isolated ? theme.global.radius : undefined,
      border: isolated ? theme.menu.border : undefined,
      boxShadow: isolated ? theme.menu.shadow : undefined,
      borderTop: theme.menu.border,
    }),
    children: create(Scroller, {
      maxheight: 320,
      children: options.map(({ label, helper, icon, prefix, click }) => {
        return create('div', {
          key: label,
          onClick: click,
          className: css({
            all: 'unset',
            display: 'flex',
            transition: '200ms',
            cursor: 'pointer',
            padding: 15,
            flexGrow: 1,
            color: theme.menu.label,
            background: theme.menu.background,
            '&:not(:last-child)': {
              borderBottom: theme.menu.border,
            },
            '&:hover:not(:active)': {
              background: theme.menu.backgroundHover,
            },
          }),
          children: [
            create(Icon, {
              key: 'icon',
              icon,
              prefix,
            }),
            create('div', {
              key: 'text',
              className: css({
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                marginLeft: 10,
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
                      fontWeight: theme.global.thin,
                      color: theme.menu.helper,
                    }),
                  }),
              ],
            }),
          ],
        })
      }),
    }),
  })
}
