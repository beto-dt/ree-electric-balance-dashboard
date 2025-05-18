import { ApolloProvider } from '@apollo/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import apolloClient from './services/api/graphql';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Sidebar from './components/layout/Sidebar';

import Dashboard from './pages/Dashboard';
import HistoricalData from './pages/HistoricalData';
import About from './pages/About';

import './styles/global.css';
import LatestBalance from "./pages/LatestBalance";

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
                  <Route path="/latest" element={<LatestBalance />} />
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
