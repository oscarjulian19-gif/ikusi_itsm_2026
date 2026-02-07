import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
    Activity,
    Bot,
    CheckCircle,
    FileText,
    ShieldCheck,
    Zap,
    ChevronRight,
    ArrowLeft,
    Save,
    Copy,
    Upload,
    Cpu,
    User as UserIcon,
    Settings,
    LayoutDashboard,
    Server,
    Globe,
    AlertTriangle
} from 'lucide-react';

import useIncidentStore from '../store/useIncidentStore';
import useUserStore from '../store/useUserStore';
import useCatalogStore from '../store/useCatalogStore';
import useCMDBStore from '../store/useCMDBStore';
import useSlaStore from '../store/useSlaStore';

import './IncidentDetail.css';

const IncidentDetail = ({ type = 'incident' }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const isNew = location.pathname.includes('/new') || !id;

    // Stores
    const { incidents, createIncident, fetchIncidents } = useIncidentStore();
    const { users, fetchUsers } = useUserStore();
    const { services, categories, fetchCatalog } = useCatalogStore();
    const { slas, fetchSlas } = useSlaStore();
    const { cis, fetchCIs } = useCMDBStore();

    // Form local state
    const [formData, setFormData] = useState({
        title: '',
        requester_name: '',
        priority: type === 'incident' ? 'P3' : 'REQ_MEDIA',
        description: '',
        service_category: '',
        service_name: '',
        serial_number: '',
        client: 'IKUSI'
    });

    const [createdTicket, setCreatedTicket] = useState(null);

    useEffect(() => {
        fetchUsers();
        fetchCatalog();
        fetchSlas();
        fetchCIs();
        if (!isNew) {
            fetchIncidents();
        }
    }, [isNew, type, id, fetchUsers, fetchCatalog, fetchSlas, fetchCIs, fetchIncidents]);

    // Derived Data
    const safeSlas = (slas || []).filter(s => type === 'incident' ? s.id.startsWith('P') : s.id.startsWith('REQ_'));
    const activeIncident = !isNew ? incidents.find(i => String(i.id) === String(id)) : null;

    const handleSave = async () => {
        if (!formData.title || !formData.requester_name || !formData.service_category || !formData.service_name || !formData.serial_number) {
            alert('VALIDACIÓN REQUERIDA: Los campos Solicitante, Serial, Categoría, Servicio y Título son obligatorios.');
            return;
        }
        try {
            const result = await createIncident({ ...formData, type });
            setCreatedTicket(result);
        } catch (e) {
            alert('Error al crear registro: ' + e.message);
        }
    };

    return (
        <div className="animate-fade-in" style={{ background: isNew ? '#f8fafc' : '#0B0E11', minHeight: '100vh' }}>
            {/* SUCCESS MODAL */}
            {createdTicket && (
                <div className="premium-modal-overlay">
                    <div className="premium-summary-card">
                        <div style={{ height: '10px', background: '#6DBE45' }}></div>
                        <div style={{ padding: '50px', textAlign: 'center' }}>
                            <CheckCircle size={80} className="ik-green mx-auto mb-6" />
                            <h2 style={{ fontFamily: 'Outfit', fontSize: '1.5rem', fontWeight: 900, color: '#0D2472' }}>
                                REGISTRO EN PLATAFORMA EXITOSO
                            </h2>
                            <p className="summary-id-hero">{createdTicket.id}</p>
                            <button className="btn-primary-relief w-full justify-center py-5 text-lg" onClick={() => {
                                navigate(type === 'incident' ? `/incidents/${createdTicket.id}` : `/requests/${createdTicket.id}`);
                                setCreatedTicket(null);
                            }}>
                                INICIAR FLUJO OPERATIVO <ChevronRight size={24} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MISSION CONTROL HEADER */}
            <header className="enterprise-header" style={{ margin: '0 20px 40px', borderRadius: isNew ? '30px' : '0 0 30px 30px' }}>
                <div className="header-titles">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-[#6DBE45]/20 flex items-center justify-center text-[#6DBE45]">
                            {isNew ? <Plus size={18} /> : <Activity size={18} />}
                        </div>
                        <h1>{isNew ? (type === 'incident' ? 'Nuevo Incidente' : 'Nuevo Requerimiento') : `Operación Hubble: ${id}`}</h1>
                    </div>
                    <p style={{ marginLeft: '45px' }}>{isNew ? 'Registro mandatorio para el control de operaciones' : activeIncident?.title}</p>
                </div>
                <div className="flex gap-4 items-center">
                    <button className="btn-icon-relief" onClick={() => navigate(-1)}><ArrowLeft size={20} /></button>
                    {isNew ? (
                        <button className="btn-primary-relief" onClick={handleSave}>
                            <Save size={20} /> GUARDAR REGISTRO
                        </button>
                    ) : (
                        <button className="btn-primary-relief">
                            <Save size={20} /> ACTUALIZAR CASO
                        </button>
                    )}
                </div>
            </header>

            <div className="ik-detail-container">
                <div className="detail-grid-layout">
                    {/* MAIN PANE */}
                    <div className="flex flex-col gap-10">
                        <div className={`enterprise-card ${!isNew ? 'nasa-dark-theme' : ''}`} style={{ borderTop: isNew ? '6px solid #6DBE45' : '1px solid rgba(255,255,255,0.05)' }}>
                            <div className="enterprise-card-header">
                                <h3 className="card-title-main">
                                    <LayoutDashboard size={20} />
                                    DETALLES DE LA OPERACIÓN
                                </h3>
                            </div>

                            <div className="enterprise-card-body">
                                {isNew ? (
                                    <div className="advanced-form-grid">
                                        <div className="form-group-premium col-span-2">
                                            <label>Título / Resumen Breve</label>
                                            <input
                                                type="text"
                                                placeholder="Ej: Caída de enlace principal en Nodo..."
                                                value={formData.title}
                                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                            />
                                        </div>
                                        <div className="form-group-premium">
                                            <label><UserIcon size={12} className="inline mr-1" /> 1. Solicitante</label>
                                            <select value={formData.requester_name} onChange={e => setFormData({ ...formData, requester_name: e.target.value })}>
                                                <option value="">Seleccionar Solicitante...</option>
                                                {(users || []).map(u => <option key={u.id} value={u.full_name}>{u.full_name}</option>)}
                                            </select>
                                        </div>
                                        <div className="form-group-premium">
                                            <label><Cpu size={12} className="inline mr-1" /> 2. Serial / CI (CMDB)</label>
                                            <select value={formData.serial_number} onChange={e => setFormData({ ...formData, serial_number: e.target.value })}>
                                                <option value="">Seleccionar Serial...</option>
                                                {(cis || []).map(c => <option key={c.id} value={c.serial_number}>{c.serial_number} - {c.name}</option>)}
                                            </select>
                                        </div>
                                        <div className="form-group-premium">
                                            <label><Settings size={12} className="inline mr-1" /> 3. Categoría</label>
                                            <select value={formData.service_category} onChange={e => setFormData({ ...formData, service_category: e.target.value, service_name: '' })}>
                                                <option value="">Categoría...</option>
                                                {(categories || []).map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        </div>
                                        <div className="form-group-premium">
                                            <label><Zap size={12} className="inline mr-1" /> 4. Prioridad (SLA)</label>
                                            <select value={formData.priority} onChange={e => setFormData({ ...formData, priority: e.target.value })}>
                                                {safeSlas.map(s => <option key={s.id} value={s.id}>{s.id} - {s.name}</option>)}
                                            </select>
                                        </div>
                                        <div className="form-group-premium col-span-2">
                                            <label>Descripción Técnica Detallada</label>
                                            <textarea
                                                value={formData.description}
                                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                                style={{ height: '140px' }}
                                                placeholder="Describa el impacto, síntomas y pasos iniciales..."
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-8">
                                        <div className="grid grid-cols-2 gap-10 text-white">
                                            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '16px' }}>
                                                <p className="text-[10px] font-black uppercase opacity-40">Usuario Solicitante</p>
                                                <p className="text-xl font-bold mt-1">{activeIncident?.requester_name}</p>
                                            </div>
                                            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '16px' }}>
                                                <p className="text-[10px] font-black uppercase opacity-40">Prioridad Ejecutiva</p>
                                                <p className="text-xl font-bold mt-1 text-[#6DBE45]">{activeIncident?.priority}</p>
                                            </div>
                                        </div>
                                        <div style={{ borderLeft: '4px solid #6DBE45', paddingLeft: '30px', margin: '20px 0' }}>
                                            <p className="text-lg text-slate-300 leading-relaxed font-medium">{activeIncident?.description}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {!isNew && (
                            <div className="enterprise-card nasa-dark-theme" style={{ borderTop: '4px solid #6DBE45' }}>
                                <div className="enterprise-card-header" style={{ background: 'rgba(109,190,69,0.05)' }}>
                                    <h3 className="card-title-main" style={{ color: '#6DBE45' }}>
                                        <Bot size={24} className="animate-pulse" />
                                        MÓDULO DE ANÁLISIS IA & OPERACIONES
                                    </h3>
                                </div>
                                <div className="enterprise-card-body">
                                    <div className="p-10 bg-black/40 rounded-3xl border border-white/5">
                                        <p className="text-[#6DBE45] font-mono text-lg mb-4">[SISTEMA NOMINAL] &gt; Analizando registros de auditoría...</p>
                                        <p className="text-slate-500 font-mono text-sm leading-relaxed">
                                            IA Ops ha detectado patrones similares en incidentes previos del Nodo Regional.
                                            Se recomienda verificar la latencia en el segmento de red 10.0.5.x.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* SIDEBAR */}
                    <div className="sidebar-sticky-wrap">
                        <div className={`enterprise-card ${!isNew ? 'nasa-dark-theme' : ''}`} style={{ borderTop: '4px solid #0D2472' }}>
                            <div className="enterprise-card-header">
                                <h4 className="text-[11px] font-black uppercase tracking-widest text-[#64748B]">Contexto Operativo</h4>
                            </div>
                            <div className="enterprise-card-body">
                                <div className="flex flex-col gap-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                                            <ShieldCheck size={24} />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black uppercase opacity-40">Status Nodo</p>
                                            <p className={`font-black ${isNew ? 'text-[#0D2472]' : 'text-white'}`}>T4 - ESTABLE</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-[#6DBE45]/10 flex items-center justify-center text-[#6DBE45]">
                                            <Zap size={24} />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black uppercase opacity-40">SLA Asignado</p>
                                            <p className={`font-black ${isNew ? 'text-[#0D2472]' : 'text-white'}`}>PLATINUM 24x7</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {!isNew && (
                            <div className="enterprise-card nasa-dark-theme p-8">
                                <p className="text-[10px] font-black uppercase opacity-40 mb-4 tracking-tighter">Eventos de Consola</p>
                                <div className="flex flex-col gap-3 font-mono text-[10px]">
                                    <div className="flex gap-2">
                                        <span className="text-[#6DBE45]">[OK]</span>
                                        <span className="opacity-50">Auth connection success...</span>
                                    </div>
                                    <div className="flex gap-2 text-red-400">
                                        <span className="">[WRN]</span>
                                        <span className="opacity-80">Latency detected (+12ms)</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* AI OPS PILL */}
            <button className="ai-ops-floating-pill">
                <Bot size={24} />
                <span>AI OPS HUB</span>
            </button>
        </div>
    );
};

export default IncidentDetail;
