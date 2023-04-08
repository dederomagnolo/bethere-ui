import React from 'react'
import _ from 'lodash'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react';

import { Layout } from './components/layout';
import { Charts, Login, Home, Settings, History } from './views'
import { store, persistor } from './redux/store'

const routesList = [
  {
    path: 'login',
    Component: Login
  },
  {
    path: '',
    Component: Home
  },
  {
    path: 'configuracoes',
    Component: Settings
  },
  {
    path: 'historico',
    Component: History
  },
  {
    path: 'graficos',
    Component: Charts
  }
]

const App: React.FC = () => {
  const routes = _.map(routesList, (route: any) => {
    const { path, Component } = route
    return <Route path={path} element={<Component />} key={path} />
  })

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <Layout>
            <Routes>
              {routes}
            </Routes>
          </Layout>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  )
}

export default App;
