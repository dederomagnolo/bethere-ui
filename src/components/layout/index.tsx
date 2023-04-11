import React from 'react'
import { useSelector } from 'react-redux'

import { getToken } from '../../redux/user/selectors'
import { Menu } from '../menu'

import './styles.scss'

interface LayoutProps {
  children?: any
}

// const token = true // mock

export const Layout: React.FunctionComponent<LayoutProps> = ({ children }) => {
  const token = useSelector(getToken)

  return (
    <div className='appLayout'>
      {token && <Menu />}
      <div className='page-container'>
        {children}
      </div>
    </div>
  )
}