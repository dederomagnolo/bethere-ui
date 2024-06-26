import React from 'react'
import * as moment from "moment-timezone"
import _ from 'lodash'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ToastContainer } from 'react-toastify'


import { Charts, Login, Home, Settings, History } from 'views'

import { getAuthenticatedStatus, getToken } from 'redux/user/selectors'

import { Menu } from '../menu'

// import { BiUserCircle as UserIcon } from 'react-icons/bi'
// import { VscMegaphone as NotificationIcon } from "react-icons/vsc"

import './styles.scss'
import 'react-toastify/dist/ReactToastify.css'

moment.tz.setDefault('America/Sao_Paulo')

const routesList = [
  {
    path: 'login',
    Component: Login
  },
  {
    path: '',
    Component: (Home),
    auth: true
  },
  {
    path: 'configuracoes',
    Component: Settings,
    auth: true
  },
  {
    path: 'historico',
    Component: History,
    auth: true
  },
  {
    path: 'graficos',
    Component: Charts,
    auth: true
  }
]

export const Layout: React.FunctionComponent = () => {
  const token = useSelector(getToken)
  const authenticated = useSelector(getAuthenticatedStatus)
  const location = useLocation()

  const PageContainer = (Component: any) => {
    const isLoginRoute = location.pathname === '/login'
    if(isLoginRoute && token && authenticated) {
      return <Navigate to='/' replace={true} />
    }

    if(!authenticated) {
      return isLoginRoute ? <Component /> : <Navigate to='/login' replace={true} />
    }
    
    return (
      <div className='page-container'>
        <Component />
      </div>
    )
  }

  const routes = _.map(routesList, (route: any) => {
    const { path, Component } = route
    const WrappedComponent = PageContainer(Component)
    return <Route path={path} element={WrappedComponent} key={path} />
  })

  return (
    <div className='app-layout'>
      {authenticated && <Menu />}
      {/* <div className='user-toolbar'>
        <div className='user-toolbar__icon-container'>
          <NotificationIcon />
          <UserIcon />
        </div>
      </div> */}
      <Routes>
        {routes}
      </Routes>
      <ToastContainer autoClose={2000}/>
    </div>
  )
}
