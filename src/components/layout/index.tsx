import React from 'react'
import * as moment from "moment-timezone"
import _ from 'lodash'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ToastContainer } from 'react-toastify'


import {
  Charts,
  Login,
  Home,
  Settings,
  History,
  NewSettingsView,
  DevicesView,
  AccountView,
  BroadcastingView,
  AutomationView,
  AlertsView,
  NotificationsView
} from 'views'

import { getAuthenticatedStatus, getToken } from 'redux/user/selectors'

import { Menu } from '../menu'

import './styles.scss'
import 'react-toastify/dist/ReactToastify.css'

moment.tz.setDefault('America/Sao_Paulo')

const routesList = [
  {
    path: 'login',
    Component: Login,
    public: true
  },
  {
    path: '',
    Component: (Home)
  },
  {
    path: 'configuracoes',
    Component: Settings
  },
  {
    path: 'configuracoes/dispositivos',
    Component: DevicesView
  },
  {
    path: 'configuracoes/automacao',
    Component: AutomationView
  },
  {
    path: 'configuracoes/medicoes',
    Component: BroadcastingView
  },
  {
    path: 'configuracoes/alertas',
    Component: AlertsView
  },
  {
    path: 'configuracoes/minha-conta',
    Component: AccountView
  },
  {
    path: 'historico',
    Component: History
  },
  {
    path: 'graficos',
    Component: Charts
  },
  {
    path: 'notificacoes',
    Component: NotificationsView
  }
]

export const Layout: React.FunctionComponent = () => {
  const token = useSelector(getToken)
  const authenticated = useSelector(getAuthenticatedStatus)
  const location = useLocation()

  const PageContainer = (Component: any) => {
    const isLoginRoute = location.pathname === '/login'
    if (isLoginRoute && token && authenticated) {
      return <Navigate to='/' replace={true} />
    }

    if (!authenticated) {
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
      <Routes>
        {routes}
      </Routes>
      <ToastContainer autoClose={2000}/>
    </div>
  )
}
