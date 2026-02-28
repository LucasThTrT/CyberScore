import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { VulnerabilitiesProvider } from './hooks/useVulnerabilities';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <VulnerabilitiesProvider>
      <HashRouter>
        <App />
      </HashRouter>
    </VulnerabilitiesProvider>
  </React.StrictMode>
);
