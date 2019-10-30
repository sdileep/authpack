import { createElement as create, FC, ReactNode } from 'react'
import { css } from 'emotion'

export const Layout: FC<{
  children: ReactNode
}> = ({ children }) => {
  return create('div', {
    children,
    className: css({
      all: 'unset',
      display: 'flex',
      justifyContent: 'stretch',
      alignItems: 'stretch',
      overflow: 'hidden',
      flexGrow: 1,
    }),
  })
}
