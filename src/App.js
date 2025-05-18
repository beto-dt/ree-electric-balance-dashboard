import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import apolloClient from './services/api/graphql';

// Importamos los componentes de layout
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Sidebar from './components/layout/Sidebar';

// Importamos las páginas
import Dashboard from './pages/Dashboard';
import HistoricalData from './pages/HistoricalData';
import About from './pages/About';

// Importamos los estilos globales
import './styles/global.css';

function App() {
  return (
      <ApolloProvider client={apolloClient}>
        <Router>
          <div className="app">
            <Header />
            <div className="app-container">
              <Sidebar />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/historical" element={<HistoricalData />} />
                  <Route path="/about" element={<About />} />
                </Routes>
              </main>
            </div>
            <Footer />
          </div>
        </Router>
      </ApolloProvider>
  );
}

export default App;
