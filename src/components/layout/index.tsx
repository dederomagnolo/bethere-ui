import React from 'react'
import { Menu } from '../menu'

import './styles.scss'

interface LayoutProps {
  children?: any
}

export const Layout: React.FunctionComponent<LayoutProps> = ({ children }) => {
  return (
    <div className='appLayout'>
      <Menu />
      <div className='pageContainer'>
        {children}
      </div>
    </div>
  )
}