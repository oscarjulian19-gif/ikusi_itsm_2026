import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Cpu, AlertTriangle, Clock, Play, Pause, Square, CheckCircle, Search } from 'lucide-react';
import useIncidentStore from '../store/useIncidentStore';
import P7M6Wizard from '../components/incidents/P7M6Wizard';
import { differenceInMinutes } from 'date-fns';

import useCatalogStore from '../store/useCatalogStore';

const IncidentForm = ({ type = 'incident' }) => { // Accept type prop
    const { id } = useParams();
    const navigate = useNavigate();

    // Incident Store
    const { incidents: existingTickets, createIncident, startResolution, pauseIncident, resumeIncident, loading } = useIncidentStore();

    // Catalog Store (Source of Truth for Dropdowns via State)
    const { services: catalogServices, incidents: catalogIncidents, requests: catalogRequests } = useCatalogStore();

    // Local State
    const [isNew, setIsNew] = useState(!id);

    const [incident, setIncident] = useState(null);
    const [creationStep, setCreationStep] = useState(1); // 1 = Service, 2 = Details
    const [pauseModalOpen, setPauseModalOpen] = useState(false);
    const [pauseReason, setPauseReason] = useState({ type: 'Vendor', comments: '' });

    // Service Selection State
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedServiceId, setSelectedServiceId] = useState('');
    const [selectedServiceName, setSelectedServiceName] = useState('');
    const [selectedScenarioId, setSelectedScenarioId] = useState('');

    // Creation Form State
    const [formData, setFormData] = useState({
        title: '',
        client: 'General',
        priority: 'P3',
        description: '',
        type: type,
        vendor_case_id: '',
        service_category: '',
        service_name: '',
        scenario_id: '',
        scenario_name: ''
    });

    useEffect(() => {
        setFormData(prev => ({ ...prev, type: type }));
    }, [type]);

    useEffect(() => {
        if (!isNew) {
            const found = existingTickets.find(i => i.id === id);
            if (found) {
                setIncident(found);
            }
        }
    }, [id, isNew, existingTickets]);

    // Derived Data for Selectors
    const categories = [...new Set(catalogServices.map(s => s.category))];
    const servicesByCategory = selectedCategory ? catalogServices.filter(s => s.category === selectedCategory) : [];

    const availableScenarios = selectedServiceId
        ? (type === 'request' ? catalogRequests : catalogIncidents).filter(s => s.serviceId === selectedServiceId)
        : [];

    const handleCategoryChange = (e) => {
        const cat = e.target.value;
        setSelectedCategory(cat);
        setSelectedServiceId('');
        setSelectedServiceName('');
        setSelectedScenarioId('');
    };

    const handleServiceChange = (e) => {
        const svcId = e.target.value;
        setSelectedServiceId(svcId);
        const svc = catalogServices.find(s => s.id === svcId);
        setSelectedServiceName(svc ? svc.name : '');
        setSelectedScenarioId(''); // Reset scenario
    };

    const handleContinue = () => {
        // Enforce Scenario Selection
        if (selectedCategory && selectedServiceId && selectedScenarioId) {
            const scenario = (type === 'request' ? catalogRequests : catalogIncidents).find(s => s.id === selectedScenarioId);

            setFormData(prev => ({
                ...prev,
                service_category: selectedCategory,
                service_name: selectedServiceName,
                scenario_id: selectedScenarioId,
                scenario_name: scenario ? scenario.name : '',
                // Auto-fill priority/time if available from scenario
                priority: scenario?.priority || prev.priority,
                title: scenario ? scenario.name : prev.title, // Pre-fill title with scenario name
            }));
            setCreationStep(2);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await createIncident(formData);
            navigate(type === 'request' ? '/requests' : '/incidents');
        } catch (e) { alert(e.message); }
    };

    // ... rest of handlers (resolution/pause) ...
    const handleStartResolution = async () => {
        await startResolution(incident.id);
    };

    const handlePause = async () => {
        await pauseIncident(incident.id, pauseReason.type, pauseReason.comments);
        setPauseModalOpen(false);
    };

    const handleResume = async () => {
        await resumeIncident(incident.id);
    };

    if (loading && !incident && !isNew) return <div className="p-8 text-center text-white">Cargando...</div>;

    // --- VIEW: NEW INCIDENT/REQUEST ---
    if (isNew) {
        return (
            <div className="incident-form-page">
                <header className="form-header">
                    <button className="back-btn" onClick={() => navigate(type === 'request' ? '/requests' : '/incidents')}>
                        <ArrowLeft size={20} /> Volver
                    </button>
                    <h1>{type === 'request' ? 'Nuevo Requerimiento' : 'Nuevo Incidente'}</h1>
                </header>

                <div className="glass-panel p-6">
                    {creationStep === 1 ? (
                        <div className="service-selection-step">
                            <h2 className="text-xl mb-6 border-b border-white/10 pb-4">Paso 1: Clasificación del {type === 'request' ? 'Requerimiento' : 'Incidente'}</h2>

                            <div className="selection-container" style={{ maxWidth: '600px' }}>
                                <div className="form-group mb-4">
                                    <label className="text-primary font-bold">1. Categoría del Servicio</label>
                                    <select
                                        value={selectedCategory}
                                        onChange={handleCategoryChange}
                                        className="w-full"
                                    >
                                        <option value="">-- Seleccione una Categoría --</option>
                                        {categories.map((cat, idx) => (
                                            <option key={idx} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group mb-4">
                                    <label className="text-primary font-bold">2. Servicio Afectado/Solicitado</label>
                                    <select
                                        value={selectedServiceId}
                                        onChange={handleServiceChange}
                                        disabled={!selectedCategory}
                                        className="w-full"
                                    >
                                        <option value="">-- Seleccione un Servicio --</option>
                                        {servicesByCategory.map((svc) => (
                                            <option key={svc.id} value={svc.id}>{svc.name} ({svc.id})</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group mb-6">
                                    <label className="text-primary font-bold">3. Escenario de {type === 'request' ? 'Requerimiento' : 'Falla'}</label>
                                    <select
                                        value={selectedScenarioId}
                                        onChange={(e) => setSelectedScenarioId(e.target.value)}
                                        disabled={!selectedServiceId}
                                        className="w-full"
                                    >
                                        <option value="">-- Seleccione el Escenario --</option>
                                        {availableScenarios.map((sc) => (
                                            <option key={sc.id} value={sc.id}>
                                                {sc.name} ({sc.id})
                                                {sc.priority ? ` - ${sc.priority}` : ''}
                                                {sc.time ? ` - ${sc.time}` : ''}
                                            </option>
                                        ))}
                                    </select>
                                    {availableScenarios.length === 0 && selectedServiceId && (
                                        <p className="text-muted-sm mt-2">No hay escenarios predefinidos para este servicio.</p>
                                    )}
                                </div>

                                <button
                                    onClick={handleContinue}
                                    disabled={!selectedScenarioId}
                                    className={`btn-primary w-full py-3 justify-center mb-6 ${!selectedScenarioId ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    Continuar al Formulario
                                </button>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleCreate} className="creation-form">
                            <div className="selected-service-banner mb-6">
                                <span className="label">Clasificación:</span>
                                <div className="value" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <span>{formData.service_name}</span>
                                    <small style={{ opacity: 0.8 }}>{formData.scenario_name}</small>
                                </div>
                                <button type="button" className="change-btn" onClick={() => setCreationStep(1)}>Cambiar</button>
                            </div>

                            <div className="form-group mb-4">
                                <label>Título</label>
                                <input
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    required
                                    placeholder={type === 'request' ? "Resumen del requerimiento" : "Resumen de la falla"}
                                />
                            </div>
                            <div className="grid-2 mb-4">
                                <div className="form-group">
                                    <label>Cliente</label>
                                    <select value={formData.client} onChange={e => setFormData({ ...formData, client: e.target.value })}>
                                        <option value="General">General</option>
                                        <option value="Coca-Cola">Coca-Cola</option>
                                        <option value="Heineken">Heineken</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Prioridad</label>
                                    <select value={formData.priority} onChange={e => setFormData({ ...formData, priority: e.target.value })}>
                                        <option value="P3">P3 - Bajo</option>
                                        <option value="P2">P2 - Crítico</option>
                                        <option value="P1">P1 - Emergencia</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group mb-4">
                                <label>Número de Caso Fabricante (Vendor Case ID)</label>
                                <input
                                    value={formData.vendor_case_id || ''}
                                    onChange={e => setFormData({ ...formData, vendor_case_id: e.target.value })}
                                    placeholder="Ej: SR 67890 (Opcional)"
                                />
                            </div>
                            <div className="form-group mb-6">
                                <label>Descripción Detallada</label>
                                <textarea
                                    rows={5}
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn-primary full-width-btn">
                                {type === 'request' ? 'Crear Requerimiento' : 'Crear Incidente'}
                            </button>
                        </form>
                    )}
                </div>
                <style>{`
                    .incident-form-page { max-width: 800px; margin: 0 auto; padding-bottom: 40px; }
                    .form-header { display: flex; gap: 16px; margin-bottom: 24px; align-items: center; }
                    .form-header h1 { font-size: 1.6rem; color: #020617; font-weight: 800; }
                    .back-btn { background: #fff; border: 1px solid #cbd5e1; color: #1e293b; padding: 8px 16px; border-radius: var(--radius-md); display: flex; align-items: center; gap: 8px; cursor: pointer; font-weight: 600; font-size: 0.9rem; transition: all 0.2s; box-shadow: var(--shadow-sm); }
                    .back-btn:hover { background: #f1f5f9; border-color: #94a3b8; }
                    
                    .glass-panel { background: #fff; border: 1px solid #cbd5e1; border-top: 4px solid var(--color-primary); border-radius: 12px; padding: 32px; box-shadow: var(--shadow-md); }
                    
                    .form-group label { display: block; color: #1e293b; margin-bottom: 8px; font-size: 0.95rem; font-weight: 700; }
                    .form-group input, .form-group textarea, .form-group select { 
                        width: 100%; background: #fff; border: 1px solid #cbd5e1; 
                        padding: 12px; color: #0f172a; border-radius: 6px; outline: none; font-size: 1rem; transition: all 0.2s;
                    }
                    .form-group input:focus, .form-group textarea:focus, .form-group select:focus { border-color: var(--color-primary); box-shadow: 0 0 0 2px var(--color-primary-glow); }
                    
                    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
                    .mb-4 { margin-bottom: 20px; } .mb-6 { margin-bottom: 32px; }
                    .text-xl { font-size: 1.4rem; font-weight: 800; color: #020617; }
                    .text-primary { color: var(--color-primary); }
                    .font-bold { font-weight: 800; }
                    
                    .service-selection-step h2 { border-bottom: 2px solid #f1f5f9; }

                    .service-btn {
                        width: 100%; text-align: left; padding: 14px;
                        background: #f8fafc; border: 1px solid #e2e8f0;
                        color: #1e293b; border-radius: 8px; cursor: pointer; transition: all 0.2s; font-weight: 600;
                    }
                    .service-btn:hover { background: #ecfdf5; border-color: var(--color-primary); color: var(--color-primary-dim); }
                    
                    .selected-service-banner {
                        display: flex; align-items: center; gap: 12px;
                        background: #ecfdf5; border: 1px solid var(--color-primary);
                        padding: 16px; border-radius: 8px;
                    }
                    .selected-service-banner .label { font-weight: 800; color: var(--color-primary-dim); text-transform: uppercase; font-size: 0.75rem; }
                    .selected-service-banner .value { color: #065f46; font-weight: 700; flex: 1; }
                    .change-btn { background: #fff; border: 1px solid #cbd5e1; padding: 4px 10px; border-radius: 4px; color: #475569; cursor: pointer; font-size: 0.8rem; font-weight: 600; }
                    .change-btn:hover { background: #f1f5f9; color: #0f172a; border-color: #94a3b8; }
                    
                    .full-width-btn { width: 100%; justify-content: center; padding: 14px; font-size: 1rem; }
                `}</style>
            </div>
        );
    }

    // --- VIEW: EXISTING INCIDENT (Resolución) ---
    if (!incident) return <div className="p-8 text-center text-white">Incidente no encontrado</div>;

    const isResolution = incident.status === 'En Resolución';
    const isPaused = incident.status === 'Pausado';
    const isClosed = incident.status === 'Cerrado';

    return (
        <div className="resolution-page">
            <header className="res-header">
                <button className="back-btn" onClick={() => navigate('/incidents')}>
                    <ArrowLeft size={20} />
                </button>
                <div className="header-info">
                    <h1>{incident.id}: {incident.title}</h1>
                    <span className={`status-badge ${incident.status.toLowerCase().replace(' ', '-')}`}>
                        {incident.status}
                    </span>
                </div>

                {/* Actions Bar */}
                <div className="header-actions">
                    {incident.status === 'Abierto' && (
                        <button className="btn-primary" onClick={handleStartResolution}>
                            <Play size={16} /> Iniciar Resolución
                        </button>
                    )}
                    {(isResolution) && (
                        <button className="btn-secondary warning" onClick={() => setPauseModalOpen(true)}>
                            <Pause size={16} /> Pausar Reloj
                        </button>
                    )}
                    {isPaused && (
                        <button className="btn-primary flick-animate" onClick={handleResume}>
                            <Play size={16} /> Reanudar Reloj
                        </button>
                    )}
                    {isClosed && (
                        <div className="closed-info">
                            <CheckCircle size={16} color="#2ed573" /> Incidente Cerrado
                        </div>
                    )}
                </div>
            </header>

            {/* Main Content Area */}
            <div className="res-container">
                {incident.status === 'Abierto' && (
                    <div className="waiting-start">
                        <AlertTriangle size={48} color="#ffa502" />
                        <h2>Incidente en Espera de Atención</h2>
                        <p>El tiempo de atención está corriendo desde {new Date(incident.created_at).toLocaleTimeString()}.</p>
                        <p>Haga clic en <strong>Iniciar Resolución</strong> para comenzar el protocolo P7M6.</p>
                    </div>
                )}

                {(isResolution || isPaused) && (
                    <div className="wizard-wrapper" style={{ opacity: isPaused ? 0.5 : 1, pointerEvents: isPaused ? 'none' : 'auto' }}>
                        <P7M6Wizard incident={incident} />
                    </div>
                )}

                {isClosed && (
                    <P7M6Report incident={incident} />
                )}

                {isPaused && (
                    <div className="pause-overlay">
                        <div className="pause-message">
                            <Clock size={48} className="pulse" />
                            <h2>RELOJ PAUSADO</h2>
                            <p>El SLA se ha detenido temporalmente por: <strong>{incident.pauses?.slice(-1)[0]?.reason || 'Espera'}</strong></p>
                            <button className="btn-primary large" onClick={handleResume}>REANUDAR AHORA</button>
                        </div>
                    </div>
                )}
            </div>

            {/* Pause Modal */}
            {pauseModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content glass-panel">
                        <h3>Pausar Reloj (Detener SLA)</h3>
                        <p className="text-muted">Solo permitido por motivos válidos documentados.</p>

                        <div className="form-group mt-4">
                            <label>Motivo</label>
                            <select value={pauseReason.type} onChange={e => setPauseReason({ ...pauseReason, type: e.target.value })}>
                                <option value="Vendor">Escalamiento a Fabricante (Vendor)</option>
                                <option value="Client">Pendiente Cliente (Feedback)</option>
                            </select>
                        </div>
                        <div className="form-group mt-2">
                            <label>Comentarios Justificativos</label>
                            <textarea
                                value={pauseReason.comments}
                                onChange={e => setPauseReason({ ...pauseReason, comments: e.target.value })}
                                required
                            />
                        </div>
                        <div className="modal-actions">
                            <button onClick={() => setPauseModalOpen(false)} className="btn-ghost" type="button">Cancelar</button>
                            <button onClick={handlePause} className="btn-primary warning" type="button">Confirmar Pausa</button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .resolution-page { max-width: 1200px; margin: 0 auto; height: 100%; display: flex; flex-direction: column; padding-bottom: 40px; }
                .res-header { display: flex; align-items: center; gap: 24px; margin-bottom: 32px; padding: 24px; background: #fff; border: 1px solid #cbd5e1; border-radius: 12px; box-shadow: var(--shadow-sm); }
                .header-info h1 { margin: 0; font-size: 1.4rem; color: #020617; font-weight: 800; }
                .status-badge { padding: 6px 14px; border-radius: 6px; font-size: 0.75rem; text-transform: uppercase; font-weight: 800; border: 1px solid transparent; letter-spacing: 0.05em; }
                
                .status-badge.abierto { background: #dcfce7; color: #16a34a; border-color: #bbf7d0; }
                .status-badge.en-resolución { background: #dbeafe; color: #2563eb; border-color: #bfdbfe; }
                .status-badge.pausado { background: #fef3c7; color: #d97706; border-color: #fde68a; }
                .status-badge.cerrado { background: #f1f5f9; color: #475569; border-color: #e2e8f0; }
                
                .header-actions { margin-left: auto; display: flex; gap: 12px; align-items: center; }
                
                .waiting-start { text-align: center; padding: 80px; background: #fff; border: 1px solid #cbd5e1; border-radius: 12px; margin-top: 40px; box-shadow: var(--shadow-md); }
                .waiting-start h2 { margin-top: 24px; color: #020617; font-weight: 800; }
                .waiting-start p { color: #475569; font-size: 1.1rem; }
                
                .res-container { position: relative; min-height: 600px; }
                
                .pause-overlay {
                    position: absolute; inset: 0;
                    background: rgba(255, 255, 255, 0.9);
                    backdrop-filter: blur(8px);
                    display: flex; align-items: center; justify-content: center;
                    z-index: 50;
                    border-radius: 12px;
                    border: 2px dashed #f59e0b;
                }
                .pause-message { text-align: center; color: #d97706; display: flex; flex-direction: column; align-items: center; gap: 20px; }
                .pulse { animation: pulse 2s infinite; color: #f59e0b; }
                @keyframes pulse { 0% { opacity: 0.6; transform: scale(0.95); } 50% { opacity: 1; transform: scale(1.05); } 100% { opacity: 0.6; transform: scale(0.95); } }
                
                .modal-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px); z-index: 100; display: flex; align-items: center; justify-content: center; }
                .modal-content { width: 450px; background: #fff; border-radius: 12px; padding: 32px; box-shadow: var(--shadow-lg); border-top: 6px solid #f59e0b; }
                .modal-content h3 { font-weight: 800; color: #020617; font-size: 1.25rem; }
                
                .btn-secondary.warning { color: #d97706; border-color: #f59e0b; background: #fffbeb; font-weight: 700; }
                .btn-secondary.warning:hover { background: #fef3c7; border-color: #d97706; }
                
                .flick-animate { animation: flicker 2s infinite alternate; box-shadow: 0 0 20px rgba(16, 185, 129, 0.3); }
                @keyframes flicker { 0% { transform: scale(1); } 100% { transform: scale(1.03); } }
                
                .closed-info { display: flex; align-items: center; gap: 10px; color: #059669; font-weight: 800; padding: 12px 24px; background: #ecfdf5; border-radius: 8px; border: 1px solid #10b981; }

                .mt-4 { margin-top: 20px; } .mt-2 { margin-top: 10px; }
                .modal-actions { display: flex; justify-content: flex-end; gap: 16px; margin-top: 32px; }

                /* Report Styles - High Contrast Clean */
                .p7m6-report {
                    background: #fff;
                    color: #020617;
                    padding: 60px;
                    border-radius: 8px;
                    font-family: 'Inter', sans-serif;
                    box-shadow: var(--shadow-lg);
                    max-width: 1000px;
                    margin: 20px auto;
                    border: 1px solid #cbd5e1;
                }
                .report-header {
                    display: flex;
                    border: 2px solid #0f172a;
                    margin-bottom: 32px;
                }
                .logo-section { flex: 0 0 220px; border-right: 2px solid #0f172a; padding: 20px; display: flex; align-items: center; justify-content: center; background: #f8fafc; }
                .logo-placeholder { font-weight: 900; font-size: 28px; color: #009938; display: flex; flex-direction: column; align-items: center; letter-spacing: -0.05em; }
                .title-section { flex: 1; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.4rem; border-right: 2px solid #0f172a; background: #fff; text-align: center; padding: 10px; }
                .itae-section { flex: 0 0 250px; text-align: center; padding: 15px; font-size: 0.85rem; display: flex; flex-direction: column; justify-content: center; font-weight: 800; background: #0f172a; color: #fff; }
                
                .report-meta { border: 2px solid #e2e8f0; border-radius: 8px; overflow: hidden; margin-bottom: 40px; }
                .meta-row { display: flex; border-bottom: 1px solid #e2e8f0; }
                .meta-row:last-child { border-bottom: none; }
                .meta-label { flex: 0 0 220px; background: #f1f5f9; padding: 12px 20px; font-weight: 700; font-size: 0.9rem; border-right: 1px solid #e2e8f0; color: #334155; }
                .meta-value { flex: 1; padding: 12px 20px; font-size: 0.9rem; color: #0f172a; font-weight: 500; }
                
                .report-steps { display: flex; flex-direction: column; gap: 32px; }
                .report-step { border: 1px solid #e2e8f0; padding: 24px; border-radius: 8px; background: #f8fafc; }
                .report-step h4 { margin: 0 0 16px 0; color: #009938; font-size: 1.1rem; border-bottom: 3px solid #009938; display: inline-block; padding-bottom: 4px; font-weight: 800; }
                .step-content { white-space: pre-line; font-size: 0.95rem; line-height: 1.6; color: #334155; font-weight: 500; }
            `}</style>
        </div>
    );
};

// P7M6 Report Component
const P7M6Report = ({ incident }) => {
    let steps = {};
    try {
        steps = JSON.parse(incident.step_data || '{}');
    } catch (e) { }

    return (
        <div className="p7m6-report">
            <div className="report-header">
                <div className="logo-section">
                    <div className="logo-placeholder">
                        <span>IKUSI</span>
                        <span style={{ fontSize: '12px', color: '#666' }}>velatia</span>
                    </div>
                </div>
                <div className="title-section">
                    INFORME DE SOPORTE P7M6
                </div>
                <div className="itae-section">
                    ITAE<br />
                    Ikusi Technical Assistance Expert
                </div>
            </div>

            <div className="report-meta">
                <div className="meta-row">
                    <div className="meta-label">Fecha de creación:</div>
                    <div className="meta-value">{new Date(incident.created_at).toLocaleDateString()}</div>
                </div>
                <div className="meta-row">
                    <div className="meta-label">Hora inicio:</div>
                    <div className="meta-value">{new Date(incident.created_at).toLocaleTimeString()}</div>
                </div>
                <div className="meta-row">
                    <div className="meta-label">Hora finalización:</div>
                    <div className="meta-value">{incident.closed_at ? new Date(incident.closed_at).toLocaleTimeString() : '-'}</div>
                </div>
                <div className="meta-row">
                    <div className="meta-label">Problema/Actividad:</div>
                    <div className="meta-value">{incident.description}</div>
                </div>
                <div className="meta-row">
                    <div className="meta-label">Número de Caso Ikusi:</div>
                    <div className="meta-value">{incident.id}</div>
                </div>
                <div className="meta-row">
                    <div className="meta-label">Número de Caso Fabricante:</div>
                    <div className="meta-value">{incident.vendor_case_id || 'N/A'}</div>
                </div>
                <div className="meta-row">
                    <div className="meta-label">Cliente:</div>
                    <div className="meta-value">{incident.client}</div>
                </div>
            </div>

            <div className="report-steps">
                {[1, 2, 3, 4, 5, 6, 7].map(stepNum => (
                    steps[stepNum] && (
                        <div key={stepNum} className="report-step">
                            <h4>Paso {stepNum}</h4>
                            <div className="step-content">{steps[stepNum]}</div>
                        </div>
                    )
                ))}
            </div>
        </div>
    );
};

export default IncidentForm;
