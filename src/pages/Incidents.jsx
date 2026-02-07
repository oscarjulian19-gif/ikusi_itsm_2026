import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useIncidentStore from '../store/useIncidentStore';
import {
  Plus,
  ArrowUpDown,
  ChevronRight,
  Bot,
  FileText,
  Upload,
  Copy,
  Activity,
  ShieldCheck,
  Zap,
  MonitorDot,
  Filter
} from 'lucide-react';

const Incidents = ({ type = 'incident' }) => {
  const navigate = useNavigate();
  const { incidents, fetchIncidents } = useIncidentStore();

  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'desc' });
  const [filters, setFilters] = useState({});

  useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents]);

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
    let data = incidents.filter(i => i.ticket_type === type);

    // Filter logic
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        const searchLower = filters[key].toLowerCase();
        data = data.filter(item => {
          const val = item[key] ? String(item[key]).toLowerCase() : '';
          return val.includes(searchLower);
        });
      }
    });

    // Sort logic
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

  const renderHeader = (label, key) => (
    <th>
      <div className="th-inner-wrap">
        <div className="th-label" onClick={() => handleSort(key)}>
          <span>{label}</span>
          <ArrowUpDown size={12} className="opacity-40" />
        </div>
        <div className="relative mt-2">
          <input
            type="text"
            className="th-filter-input"
            placeholder="Filtrar..."
            value={filters[key] || ''}
            onChange={(e) => handleFilterChange(key, e.target.value)}
            onClick={(e) => e.stopPropagation()}
          />
          <Filter size={10} className="absolute right-2 top-1/2 -translate-y-1/2 opacity-20" />
        </div>
      </div>
    </th>
  );

  return (
    <div className="animate-fade-in" style={{ padding: '0 20px 40px' }}>

      {/* MISSION CONTROL STATS */}
      <div className="grid grid-cols-4 gap-6 mb-10 mt-6">
        <div className="enterprise-card p-6 border-t-4 border-t-[#6DBE45] flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#6DBE45]/10 flex items-center justify-center text-[#6DBE45]">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Salud Central</p>
            <h3 className="text-2xl font-black text-[#0D2472]">99.8%</h3>
          </div>
        </div>
        <div className="enterprise-card p-6 border-t-4 border-t-[#1F3C88] flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#1F3C88]/10 flex items-center justify-center text-[#1F3C88]">
            <ShieldCheck size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Seguridad</p>
            <h3 className="text-2xl font-black text-[#0D2472]">ACTIVA</h3>
          </div>
        </div>
        <div className="enterprise-card p-6 border-t-4 border-t-[#F59E0B] flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#F59E0B]/10 flex items-center justify-center text-[#F59E0B]">
            <Zap size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Casos Críticos</p>
            <h3 className="text-2xl font-black text-[#0D2472]">{incidents.filter(i => i.priority === 'P1').length}</h3>
          </div>
        </div>
        <div className="enterprise-card p-6 border-t-4 border-t-[#6DBE45] flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#6DBE45]/10 flex items-center justify-center text-[#6DBE45]">
            <Bot size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">IA OPS HUB</p>
            <h3 className="text-2xl font-black text-[#0D2472]">READY</h3>
          </div>
        </div>
      </div>

      {/* DASHBOARD HEADER */}
      <header className="enterprise-header" style={{ borderRadius: '24px', padding: '30px 40px', marginBottom: '40px' }}>
        <div className="header-titles">
          <h1>{type === 'incident' ? 'Centro de Incidentes' : 'Centro de Requerimientos'}</h1>
          <p>{processedIncidents.length} Operaciones activas en plataforma Ikusi</p>
        </div>
        <div className="flex gap-4 items-center">
          <button className="btn-icon-relief"><Copy size={18} /></button>
          <button className="btn-icon-relief"><FileText size={18} /></button>
          <button
            className="btn-primary-relief"
            onClick={() => navigate(type === 'incident' ? '/incidents/new' : '/requests/new')}
          >
            <Plus size={20} /> NUEVA ACCIÓN
          </button>
          <button className="btn-icon-relief"><Upload size={18} /></button>
        </div>
      </header>

      {/* DATA GRID */}
      <div className="table-container-modern shadow-2xl">
        <table className="modern-grid-table">
          <thead>
            <tr>
              {renderHeader('ID Operación', 'id')}
              {renderHeader('Título / Resumen', 'title')}
              {renderHeader('Solicitante', 'requester_name')}
              {renderHeader('Serial / CI', 'serial_number')}
              {renderHeader('Prioridad', 'priority')}
              {renderHeader('Estado', 'status')}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {processedIncidents.map((inc) => (
              <tr key={inc.id} onClick={() => navigate(type === 'incident' ? `/incidents/${inc.id}` : `/requests/${inc.id}`)}>
                <td className="text-mono font-black text-[11px] text-[#6DBE45]">{inc.id}</td>
                <td className="font-bold text-[#0D2472]" style={{ maxWidth: '350px' }}>{inc.title}</td>
                <td className="font-semibold text-slate-600">{inc.requester_name}</td>
                <td className="text-mono text-xs text-slate-400">{inc.serial_number}</td>
                <td>
                  <span style={{
                    padding: '6px 14px',
                    borderRadius: '8px',
                    fontSize: '0.7rem',
                    fontWeight: 900,
                    backgroundColor: (inc.priority || '').includes('P1') ? '#FEE2E2' : '#E8EDFA',
                    color: (inc.priority || '').includes('P1') ? '#DC2626' : '#1F3C88',
                    boxShadow: 'inset 0 -2px 0 rgba(0,0,0,0.05)'
                  }}>
                    {inc.priority}
                  </span>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <div style={{
                      width: 8, height: 8, borderRadius: '50%',
                      backgroundColor: inc.status === 'Cerrado' ? '#94A3B8' : '#6DBE45'
                    }}></div>
                    <span style={{ fontWeight: 800, fontSize: '0.75rem', color: inc.status === 'Cerrado' ? '#64748B' : '#6DBE45' }}>
                      {inc.status?.toUpperCase()}
                    </span>
                  </div>
                </td>
                <td style={{ textAlign: 'right' }}><ChevronRight size={18} className="opacity-20" /></td>
              </tr>
            ))}
          </tbody>
        </table>
        {processedIncidents.length === 0 && (
          <div className="p-32 text-center opacity-30">
            <MonitorDot size={60} className="mx-auto mb-4" />
            <p className="font-black uppercase tracking-widest">Base de Datos Nominal - Sin Registros Activos</p>
          </div>
        )}
      </div>

      {/* AI OPS PILL */}
      <button className="ai-ops-floating-pill">
        <Bot size={24} />
        <span>AI Ops Hub</span>
      </button>

      <style>{`
        .th-filter-input {
            width: 100%;
            background: #fff;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 8px 12px;
            font-size: 0.75rem;
            color: #1e293b;
            outline: none;
            transition: all 0.2s;
        }
        .th-filter-input:focus {
            border-color: #6DBE45;
            box-shadow: 0 0 0 3px rgba(109, 190, 69, 0.1);
        }
      `}</style>
    </div>
  );
};

export default Incidents;
