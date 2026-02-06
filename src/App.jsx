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
import CMDBForm from './pages/CMDBForm';
import Reports from './pages/Reports';
import ContractsList from './pages/ContractsList';
import ContractForm from './pages/ContractForm';
import UsersList from './pages/UsersList';
import ComingSoon from './pages/ComingSoon';
import Catalog from './pages/Catalog';
import CatalogForm from './pages/CatalogForm';
import SlaPackages from './pages/SlaPackages';
import SearchResults from './pages/SearchResults';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="search" element={<SearchResults />} />

          {/* Incident Management Routes */}
          <Route path="incidents" element={<Incidents type="incident" />} />
          <Route path="incidents/new" element={<IncidentForm key="incident-new" type="incident" />} />
          <Route path="incidents/:id" element={<IncidentForm key="incident-edit" type="incident" />} />

          <Route path="requests" element={<Incidents type="request" />} />
          <Route path="requests/new" element={<IncidentForm key="request-new" type="request" />} />
          <Route path="requests/:id" element={<IncidentForm key="request-edit" type="request" />} />


          {/* Contracts Management Routes */}
          <Route path="contracts" element={<ContractsList />} />
          <Route path="contracts/new" element={<ContractForm />} />
          <Route path="contracts/:id" element={<ContractForm />} />

          <Route path="sla-packages" element={<SlaPackages />} />

          <Route path="cmdb" element={<CMDB />} />
          <Route path="cmdb/new" element={<CMDBForm />} />
          <Route path="cmdb/:id" element={<CMDBForm />} />

          <Route path="itil" element={<ITILPractices />} />
          <Route path="reports" element={<Reports />} />
          <Route path="users" element={<UsersList />} />
          <Route path="settings" element={<ComingSoon title="Configuración" />} />
          <Route path="/analysis" element={<ComingSoon title="Análisis de Tendencias" />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/catalog/edit/:type/:id" element={<CatalogForm />} />
          <Route path="*" element={<ComingSoon title="404 - No encontrado" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
