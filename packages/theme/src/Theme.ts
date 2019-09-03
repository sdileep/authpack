import { createContext } from 'react'

export interface ITheme {
  global: {
    radius: string
    fonts: string
  }
  gadgets: {
    background: string
    border: string
  }
  iconbar: {
    background: string
    color: string
    colorHover: string
  }
  sidebar: {
    background: string
  }
  inputs: {
    background: string
    border: string
    color: string
  }
  buttons: {
    background: string
    border: string
    color: string
  }
  pointers: {
    background: string
    border: string
    color: string
  }
  header: {
    background: string
    color: string
    brand: string
  }
}

export const Theme = createContext<ITheme>({
  global: {
    fonts: '15px',
    radius: '3px',
  },
  gadgets: {
    background: '#3B3B3B',
    border: '1px solid #222222',
  },
  iconbar: {
    background: '#2C2C2C',
    color: '#777777',
    colorHover: '#999999',
  },
  sidebar: {
    background: '#383838',
  },
  inputs: {
    background: '#272727',
    border: 'none',
    color: '#FFFFFF',
  },
  buttons: {
    background: '#505050',
    border: 'none',
    color: '#FFFFFF',
  },
  pointers: {
    background: '#505050',
    border: 'none',
    color: '#FFFFFF',
  },
  header: {
    background: '#333333',
    color: '#ADADAD',
    brand: '#777777',
  },
})