import React from 'react'
import { Menu } from '../menu'

import './styles.scss'

interface LayoutProps {
  children?: any
}

export const Layout: React.FunctionComponent<LayoutProps> = ({
  children
}) => (
  <div className='app-layout'>
    <Menu />
    <div className='page-container'>
      {children}
    </div>
  </div>
)
