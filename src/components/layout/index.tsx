import React from 'react'
import { useSelector } from 'react-redux'
import _ from 'lodash'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'

import { Charts, Login, Home, Settings, History } from 'views'

import { getToken } from 'redux/user/selectors';

import { Menu } from '../menu'

import './styles.scss'

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
  const location = useLocation()

  const PageContainer = (Component: any) => {
    const isLoginRoute = location.pathname === '/login'
    if(isLoginRoute && token) {
      return <Navigate to='/' replace={true} />
    }

    if(!token) {
      return isLoginRoute ? <Component /> : <Navigate to='/login' replace={true} />
    }
    
    return <Component />;
  }

  const routes = _.map(routesList, (route: any) => {
    const { path, Component } = route
    const WrappedComponent = PageContainer(Component)
    return <Route path={path} element={WrappedComponent} key={path} />
  })

  return (
    <div className='app-layout'>
      <Menu />
      <div className='page-container'>
        <Routes>
          {routes}
        </Routes>
      </div>
    </div>
  )
}
