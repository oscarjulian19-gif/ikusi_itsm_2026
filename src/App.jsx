import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Incidents from './pages/Incidents';
import IncidentForm from './pages/IncidentForm';
import ServiceCatalog from './pages/ServiceCatalog';
import RequestForm from './pages/RequestForm';
import ITILPractices from './pages/ITILPractices';
import CMDB from './pages/CMDB';
import Reports from './pages/Reports';
import ComingSoon from './pages/ComingSoon';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />

          {/* Incident Management Routes */}
          <Route path="incidents" element={<Incidents />} />
          <Route path="incidents/new" element={<IncidentForm />} />
          <Route path="incidents/:id" element={<IncidentForm />} />

          {/* Request Management Routes */}
          <Route path="requests" element={<ServiceCatalog />} />
          <Route path="requests/new/:serviceId" element={<RequestForm />} />

          <Route path="cmdb" element={<CMDB />} />
          <Route path="itil" element={<ITILPractices />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<ComingSoon title="Configuración" />} />
          <Route path="*" element={<ComingSoon title="404 - No encontrado" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
