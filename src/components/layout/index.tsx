import React from 'react'
import { Menu } from '../menu'

import './styles.scss'

interface LayoutProps {
  children?: any
}

const auth = true // mock

export const Layout: React.FunctionComponent<LayoutProps> = ({ children }) => {
  return (
    <div className='appLayout'>
      {auth && <Menu />}
      <div className='pageContainer'>
        {children}
      </div>
    </div>
  )
}