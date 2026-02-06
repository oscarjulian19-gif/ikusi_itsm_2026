import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useIncidentStore from '../store/useIncidentStore';
import { Plus, Search, ChevronRight, ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import { differenceInMinutes } from 'date-fns';

const Incidents = ({ type = 'incident' }) => {
  const navigate = useNavigate();
  const { incidents, fetchIncidents } = useIncidentStore();

  // Advanced Table State
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [filters, setFilters] = useState({});

  useEffect(() => {
    fetchIncidents();
  }, []);

  // Filter Logic
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const processedIncidents = useMemo(() => {
    let data = incidents.filter(i => i.ticket_type === type || (type === 'incident' && !i.ticket_type));

    // Filter
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        const searchLower = filters[key].toLowerCase();
        data = data.filter(item => {
          const val = item[key] ? String(item[key]).toLowerCase() : '';
          return val.includes(searchLower);
        });
      }
    });

    // Sort
    if (sortConfig.key) {
      data.sort((a, b) => {
        const aVal = a[sortConfig.key] || '';
        const bVal = b[sortConfig.key] || '';
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return data;
  }, [incidents, type, filters, sortConfig]);


  // Helpers
  const getDuration = (start, end) => {
    if (!start) return '-';
    const endDate = end ? new Date(end) : new Date();
    const startDate = new Date(start);
    const diffMins = differenceInMinutes(endDate, startDate);
    if (diffMins < 60) return `${diffMins}m`;
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return `${hours}h ${mins}m`;
  };

  const getStatusBadge = (status) => {
    let color = '#64748b';
    let bgColor = '#f1f5f9';
    if (status === 'Abierto') { color = '#10b981'; bgColor = '#ecfdf5'; }
    if (status === 'En Resolución') { color = '#3b82f6'; bgColor = '#eff6ff'; }
    if (status === 'Pausado') { color = '#f59e0b'; bgColor = '#fffbeb'; }
    if (status === 'Cerrado') { color = '#64748b'; bgColor = '#f8fafc'; }

    return (
      <span style={{
        padding: '2px 8px',
        borderRadius: '12px',
        backgroundColor: bgColor,
        color: color,
        fontSize: '0.7rem',
        fontWeight: '700',
        textTransform: 'uppercase',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        border: `1px solid ${color}20`
      }}>
        {status}
      </span>
    );
  };

  const title = type === 'incident' ? 'Gestión de Incidentes' : 'Gestión de Requerimientos';
  const newBtnText = type === 'incident' ? 'Nuevo Incidente' : 'Nuevo Requerimiento';
  const newRoute = type === 'incident' ? '/incidents/new' : '/requests/new';
  const detailRoute = type === 'incident' ? '/incidents' : '/requests';

  const renderHeader = (label, key) => (
    <th>
      <div className="th-content">
        <div className="th-top" onClick={() => handleSort(key)}>
          <span>{label}</span>
          {sortConfig.key === key ? (
            sortConfig.direction === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />
          ) : <ArrowUpDown size={12} className="sort-icon-idle" />}
        </div>
        <input
          type="text"
          className="th-filter"
          placeholder="Filtrar..."
          value={filters[key] || ''}
          onChange={(e) => handleFilterChange(key, e.target.value)}
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </th>
  );

  return (
    <div className="incidents-page animate-fade">
      <div className="page-header-clean">
        <div className="header-title">
          <h1>{title}</h1>
          <p>Supervisión y control operativo ({processedIncidents.length})</p>
        </div>
        <button className="btn-primary" onClick={() => navigate(newRoute)}>
          <Plus size={16} />
          {newBtnText}
        </button>
      </div>

      <div className="card table-card corporate-section">
        <table className="neon-table-clean">
          <thead>
            <tr>
              {renderHeader('ID', 'id')}
              {renderHeader('Título', 'title')}
              {renderHeader('Usuario', 'requester_name')}
              {renderHeader('Serial', 'serial_number')}
              {renderHeader('Prioridad', 'priority')}
              {renderHeader('Estado', 'status')}
              {renderHeader('Cliente', 'client')}
              <th>Atención</th>
              <th>Resolución</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {processedIncidents.map((inc) => (
              <tr key={inc.id} onClick={() => navigate(`${detailRoute}/${inc.id}`)} className="table-row-clean">
                <td className="col-id-clean">{inc.id}</td>
                <td className="col-title-clean">{inc.title}</td>
                <td className="text-muted-sm">{inc.requester_name || '-'}</td>
                <td className="font-mono text-muted-sm">{inc.serial_number || '-'}</td>
                <td>
                  <span className={`priority-pill p-${inc.priority ? inc.priority.toLowerCase() : 'p3'}`}>
                    {inc.priority}
                  </span>
                </td>
                <td>{getStatusBadge(inc.status)}</td>
                <td>
                  <span className="client-text">{inc.client || 'General'}</span>
                </td>

                <td className="font-mono text-muted-sm">
                  {inc.resolution_start_at
                    ? getDuration(inc.created_at, inc.resolution_start_at)
                    : <span className="text-danger">En Curso</span>
                  }
                </td>

                <td className="font-mono text-muted-sm">
                  {inc.resolution_start_at ? (
                    inc.closed_at
                      ? getDuration(inc.resolution_start_at, inc.closed_at)
                      : <span className="text-success">{getDuration(inc.resolution_start_at, null)}</span>
                  ) : '-'}
                </td>

                <td><ChevronRight size={16} className="row-arrow" /></td>
              </tr>
            ))}
          </tbody>
        </table>
        {processedIncidents.length === 0 && (
          <div className="empty-state">No se encontraron {type === 'incident' ? 'incidentes' : 'requerimientos'}.</div>
        )}
      </div>

      <style>{`
        .page-header-clean {
          display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          padding: 24px 32px; border-radius: 12px; color: #fff; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }
        .header-title h1 { font-size: 1.6rem; color: #ffffff; margin-bottom: 4px; font-weight: 700; }
        .header-title p { color: #94a3b8; font-size: 0.9rem; font-weight: 500; }
        
        .btn-primary { background: #008F39; color: #fff; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 700; display: flex; align-items: center; gap: 8px; cursor: pointer; }

        .corporate-section {
          border-top: 4px solid #008F39 !important;
          background: #fff !important;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .neon-table-clean { width: 100%; border-collapse: collapse; min-width: 1000px; }
        .neon-table-clean th { padding: 8px 12px; background: #f8fafc; border-bottom: 2px solid #e2e8f0; vertical-align: top; height: 1px; }
        
        .th-content { display: flex; flex-direction: column; gap: 8px; justify-content: space-between; height: 100%; min-height: 90px; }
        .th-top { display: flex; align-items: flex-start; justify-content: space-between; cursor: pointer; color: #475569; font-weight: 700; text-transform: uppercase; font-size: 0.7rem; letter-spacing: 0.05em; gap: 8px; flex: 1; min-height: 40px; }
        .th-top:hover { color: #008F39; }
        
        .th-filter { width: 100%; padding: 4px 8px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 0.75rem; background: #fff; margin-top: auto; }
        .th-filter:focus { border-color: #008F39; outline: none; }

        .neon-table-clean td { padding: 12px 16px; border-bottom: 1px solid #f1f5f9; color: #0f172a; font-size: 0.85rem; font-weight: 400; vertical-align: middle; }
        .table-row-clean:hover { background: #f0fdf4; cursor: pointer; }
        .table-row-clean:hover .col-title-clean { color: #008F39; }

        .col-id-clean { color: #1e293b; font-weight: 700; font-family: 'JetBrains Mono', monospace; font-size: 0.85rem; }
        .col-title-clean { font-weight: 600; color: #020617; }
        
        .priority-pill { padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 800; display: inline-block; }
        .p-p1 { background: #fee2e2; color: #dc2626; border: 1px solid #fecaca; }
        .p-p2 { background: #fef3c7; color: #d97706; border: 1px solid #fde68a; }
        .p-p3 { background: #dcfce7; color: #16a34a; border: 1px solid #bbf7d0; }

        .client-text { font-size: 0.9rem; color: #475569; font-weight: 500; }
        .text-danger { color: #ef4444; font-weight: 600; }
        .text-success { color: #10b981; font-weight: 600; }
        .text-muted-sm { color: #64748b; font-size: 0.85rem; font-weight: 500; }
        .row-arrow { color: #cbd5e1; }
        .empty-state { padding: 80px; text-align: center; color: #64748b; font-size: 1rem; background: #fff; }
      `}</style>
    </div>
  );
};

export default Incidents;
