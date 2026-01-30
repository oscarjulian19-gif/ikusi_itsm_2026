import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Filter, Search, ChevronRight } from 'lucide-react';
import useCaseStore from '../store/useCaseStore';

const Incidents = () => {
    const navigate = useNavigate();
    const { cases } = useCaseStore();
    const [filter, setFilter] = useState('All');

    const incidents = cases.filter(c => c.type === 'incident');

    // Simple filter logic
    const filteredIncidents = filter === 'All'
        ? incidents
        : incidents.filter(c => c.status === filter);

    const getPriorityColor = (p) => {
        if (p === 'P1') return '#ff4757';
        if (p === 'P2') return '#ffa502';
        return '#2ed573';
    };

    const getStatusBadge = (status) => {
        let color = 'var(--text-muted)';
        if (status === 'Nuevo') color = '#39FF14';
        if (status === 'En Progreso') color = '#1e90ff';
        if (status === 'Resuelto') color = '#2ed573';

        return (
            <span style={{
                padding: '4px 8px',
                borderRadius: '4px',
                border: `1px solid ${color}`,
                color: color,
                fontSize: '0.75rem',
                textTransform: 'uppercase'
            }}>
                {status}
            </span>
        );
    };

    return (
        <div className="incidents-page">
            <div className="page-header">
                <div className="header-title">
                    <h1>Gestión de Incidentes</h1>
                    <p>Supervisión y control de interrupciones del servicio</p>
                </div>
                <button className="btn-primary" onClick={() => navigate('/incidents/new')}>
                    <Plus size={18} style={{ marginRight: 8 }} />
                    Nuevo Incidente
                </button>
            </div>

            <div className="toolbar">
                <div className="search-box">
                    <Search size={18} className="search-icon" />
                    <input type="text" placeholder="Buscar por ID, título..." />
                </div>
                <div className="filter-group">
                    <Filter size={18} className="filter-icon" />
                    <select value={filter} onChange={(e) => setFilter(e.target.value)} className="filter-select">
                        <option value="All">Todos los Estados</option>
                        <option value="Nuevo">Nuevo</option>
                        <option value="En Progreso">En Progreso</option>
                        <option value="Asignado">Asignado</option>
                        <option value="Resuelto">Resuelto</option>
                        <option value="Cerrado">Cerrado</option>
                    </select>
                </div>
            </div>

            <div className="table-container card">
                <table className="neon-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Título</th>
                            <th>Prioridad</th>
                            <th>Estado</th>
                            <th>Cliente</th>
                            <th>Asignado a</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredIncidents.map((inc) => (
                            <tr key={inc.id} onClick={() => navigate(`/incidents/${inc.id}`)} className="table-row">
                                <td className="col-id">{inc.id}</td>
                                <td className="col-title">{inc.title}</td>
                                <td>
                                    <span style={{ color: getPriorityColor(inc.priority), fontWeight: 'bold' }}>
                                        {inc.priority}
                                    </span>
                                </td>
                                <td>{getStatusBadge(inc.status)}</td>
                                <td>{inc.client}</td>
                                <td>{inc.assignedTeam || '-'}</td>
                                <td><ChevronRight size={16} className="row-arrow" /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredIncidents.length === 0 && (
                    <div className="empty-state">No se encontraron incidentes.</div>
                )}
            </div>

            <style>{`
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-lg);
        }
        .header-title h1 { margin-bottom: 4px; }
        .header-title p { color: var(--text-muted); }

        .toolbar {
          display: flex;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-md);
        }

        .search-box {
          position: relative;
          flex: 1;
          max-width: 400px;
        }
        .search-box input {
          width: 100%;
          background: var(--bg-panel);
          border: 1px solid var(--border-color);
          padding: 10px 10px 10px 40px;
          border-radius: var(--radius-md);
          color: #fff;
          outline: none;
        }
        .search-box input:focus { border-color: var(--color-primary); }
        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }

        .filter-group {
          display: flex;
          align-items: center;
          background: var(--bg-panel);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 0 12px;
        }
        .filter-select {
          background: transparent;
          border: none;
          color: #fff;
          padding: 10px;
          outline: none;
          cursor: pointer;
        }
        .filter-select option { background: var(--bg-panel); }

        .table-container {
          overflow-x: auto;
          padding: 0;
        }
        .neon-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }
        .neon-table th {
          padding: 16px;
          border-bottom: 1px solid var(--border-color);
          color: var(--text-muted);
          font-weight: 500;
          text-transform: uppercase;
          font-size: 0.8rem;
        }
        .neon-table td {
          padding: 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          color: #fff;
        }
        .table-row {
          cursor: pointer;
          transition: background 0.2s;
        }
        .table-row:hover {
          background: rgba(57, 255, 20, 0.03);
        }
        .table-row:hover .col-id {
          color: var(--color-primary);
          text-shadow: 0 0 5px var(--color-primary-glow);
        }
        .col-title {
          font-weight: 500;
        }
        .row-arrow {
          color: var(--text-muted);
          opacity: 0;
          transition: opacity 0.2s;
        }
        .table-row:hover .row-arrow { opacity: 1; }

        .empty-state {
          padding: 40px;
          text-align: center;
          color: var(--text-muted);
        }
      `}</style>
        </div>
    );
};

export default Incidents;
