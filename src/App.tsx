import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom'

import { Layout } from './components/layout';
import { Charts, Home, Settings, History } from './views';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/configuracoes' element={<Settings />} />
          <Route path='/historico' element={<History />} />
          <Route path='/graficos' element={<Charts />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App;
