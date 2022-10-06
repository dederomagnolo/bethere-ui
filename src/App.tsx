import React from 'react'
import _ from 'lodash'
import { Routes, Route, BrowserRouter } from 'react-router-dom'

import { Layout } from './components/layout';
import { Charts, Home, Settings, History } from './views'

const routesList = [
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
    <BrowserRouter>
      <Layout>
        <Routes>
          {routes}
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App;
