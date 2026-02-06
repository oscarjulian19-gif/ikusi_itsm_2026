import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, Cpu, AlertTriangle, Play,
    Pause, CheckCircle, Search, User as UserIcon,
    ChevronRight, Sparkles, ShieldCheck, Activity,
    Clock, Timer, UserCheck, Link as LinkIcon,
    Database, FileText, Bell, Zap
} from 'lucide-react';
import { addMinutes, addHours, differenceInSeconds, isPast, format } from 'date-fns';
import { es } from 'date-fns/locale';

import useIncidentStore from '../store/useIncidentStore';
import useCatalogStore from '../store/useCatalogStore';
import useCMDBStore from '../store/useCMDBStore';
import useUserStore from '../store/useUserStore';
import useContractStore from '../store/useContractStore';
import useSlaStore from '../store/useSlaStore';
import { PRIORITY_LEVELS } from '../data/slaData';
import P7M6Wizard from '../components/incidents/P7M6Wizard';

// --- SUB-COMPONENT: SLACountdown ---
const SLACountdown = ({ ticket, priority, slaType, status }) => {
    const { slas, fetchSlas } = useSlaStore();
    const [timeLeft, setTimeLeft] = useState({ seconds: 0, expired: false });
    const [slaInfo, setSlaInfo] = useState(null);

    useEffect(() => {
        if (slas.length === 0) fetchSlas();
    }, []);

    useEffect(() => {
        // Find SLA Rules based on Contract or Defaults
        let rule = slas.find(s => s.id === slaType) || slas[0]; // Default to Low
        if (!slaType && slas.length > 0) {
            // Priority based fallback if contract doesn't specify
            if (priority === 'P1') rule = slas.find(s => s.id === 'Alto');
            else if (priority === 'P2') rule = slas.find(s => s.id === 'Medio');
            else rule = slas.find(s => s.id === 'Bajo');
        }
        setSlaInfo(rule || slas[0]);
    }, [priority, slaType, slas]);

    useEffect(() => {
        if (!slaInfo || !ticket) return;

        let targetDate;
        if (status === 'En Atención') {
            targetDate = addMinutes(new Date(ticket.attention_start_at), slaInfo.attentionMin);
        } else if (status === 'En Resolución') {
            targetDate = addHours(new Date(ticket.resolution_start_at || ticket.created_at), slaInfo.solutionHours);
        } else {
            return;
        }

        const timer = setInterval(() => {
            const diff = differenceInSeconds(targetDate, new Date());
            if (diff <= 0) {
                setTimeLeft({ seconds: 0, expired: true });
                clearInterval(timer);
            } else {
                setTimeLeft({ seconds: diff, expired: false });
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [slaInfo, ticket, status]);

    const formatTime = (totalSeconds) => {
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    if (timeLeft.expired) {
        return (
            <div className="sla-alert-box bounce-in">
                <Bell size={16} />
                <span>SLA VENCIDO</span>
            </div>
        );
    }

    return (
        <div className={`sla-status-box ${timeLeft.expired ? 'expired' : (timeLeft.seconds < 300 ? 'critical' : (timeLeft.seconds < 900 ? 'warning' : 'healthy'))}`}>
            <div className="flex justify-between items-start mb-1">
                <div className="sla-label">Vencimiento {status === 'En Atención' ? 'Atención' : 'Solución'}</div>
                <div className="sla-ref-badge">{status === 'En Atención' ? slaInfo.attention : slaInfo.solution}</div>
            </div>
            <div className="sla-timer flex items-center gap-3">
                <Timer size={20} className={timeLeft.seconds < 300 && !timeLeft.expired ? 'animate-pulse text-red-500' : ''} />
                <span className="font-mono font-black text-2xl tracking-tighter">
                    {timeLeft.expired ? 'VENCIDO' : formatTime(timeLeft.seconds)}
                </span>
            </div>
            {timeLeft.seconds < 300 && !timeLeft.expired && (
                <div className="text-[10px] font-black text-red-500 mt-1 uppercase animate-bounce flex items-center gap-1">
                    <AlertTriangle size={10} /> Alerta de Vencimiento Inminente
                </div>
            )}
        </div>
    );
};

const IncidentForm = ({ type = 'incident' }) => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Stores
    const { incidents: existingTickets, createIncident, confirmClosure, loading } = useIncidentStore();
    const { services: catalogServices, fetchCatalog } = useCatalogStore();
    const { cis: cmdbItems, fetchCIs, fetchCIBySerial } = useCMDBStore();
    const { users: appUsers, fetchUsers } = useUserStore();
    const { getContract } = useContractStore();
    const { slas, fetchSlas } = useSlaStore();

    // Derived/URL State
    const isNew = !id;
    const [createdTicket, setCreatedTicket] = useState(null);
    const [incident, setIncident] = useState(null);
    const [creationStep, setCreationStep] = useState(1);

    // Selected CI Full Object & Linked Data
    const [selectedCI, setSelectedCI] = useState(null);
    const [associatedContract, setAssociatedContract] = useState(null);

    // Selection State
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedServiceId, setSelectedServiceId] = useState('');
    const [selectedServiceName, setSelectedServiceName] = useState('');
    const [selectedUserId, setSelectedUserId] = useState('');
    const [selectedSerial, setSelectedSerial] = useState('');
    const [assignedEngineer, setAssignedEngineer] = useState('');
    const [isFetchingCI, setIsFetchingCI] = useState(false);

    // Form Data State
    const [formData, setFormData] = useState({
        title: '',
        client: 'General',
        priority: 'P3',
        description: '',
        type: type,
        vendor_case_id: '',
        service_category: '',
        service_name: '',
        requester_name: '',
        serial_number: '',
        assigned_engineer: ''
    });

    useEffect(() => {
        setFormData(prev => ({ ...prev, type: type }));
        if (isNew) {
            fetchCIs(); // For the datalist
            fetchUsers();
            fetchCatalog();
            fetchSlas();
            setCreatedTicket(null); // Reset success state when coming back to "new"
        }
    }, [type, isNew]);

    // RESET SUCCESS STATE WHEN NAVIGATING TO A SPECIFIC ID
    useEffect(() => {
        if (id) {
            setCreatedTicket(null);
        }
    }, [id]);

    useEffect(() => {
        const loadIncident = async () => {
            if (isNew) {
                setIncident(null);
                return;
            }

            // 1. Try to find in store
            let found = existingTickets.find(i => i.id === id);

            if (!found) {
                const { fetchIncidents } = useIncidentStore.getState();
                await fetchIncidents();
                // After fetch, existingTickets will change and trigger re-effect
                // But for immediate response in this async call:
                const updatedTickets = useIncidentStore.getState().incidents;
                found = updatedTickets.find(i => i.id === id);
            }

            if (found) {
                setIncident(found);
                if (found.serial_number && !selectedCI) {
                    fetchCIBySerial(found.serial_number).then(ci => {
                        if (ci) {
                            setSelectedCI(ci);
                            if (ci.contractId) getContract(ci.contractId).then(setAssociatedContract);
                        }
                    });
                }
            }
        };

        loadIncident();
    }, [id, isNew, existingTickets.length]);

    // Proactive Serial Logic: Fetch metadata when serial changes and matches a known item
    useEffect(() => {
        const exactMatch = cmdbItems.find(c => c.serialNumber === selectedSerial);
        if (exactMatch) {
            handleSerialFetch(selectedSerial);
        }
    }, [selectedSerial, cmdbItems]);

    const handleSerialFetch = async (serial) => {
        if (!serial) return;
        setIsFetchingCI(true);
        const ci = await fetchCIBySerial(serial);
        if (ci) {
            setSelectedCI(ci);
            setFormData(prev => ({ ...prev, client: ci.client }));
            if (ci.contractId) {
                const contract = await getContract(ci.contractId);
                setAssociatedContract(contract);
            }
        }
        setIsFetchingCI(false);
    };

    const handleSerialBlur = () => {
        if (selectedSerial && (!selectedCI || selectedCI.serialNumber !== selectedSerial)) {
            handleSerialFetch(selectedSerial);
        }
    };

    // Derived Data
    const categories = [...new Set(catalogServices.map(s => s.category))];
    const servicesByCategory = selectedCategory ? catalogServices.filter(s => s.category === selectedCategory) : [];

    const getEstablishPriority = (category, type) => {
        if (type === 'request') return 'P3';
        if (category === 'Conectividad y Red') return 'P1';
        if (category === 'Seguridad') return 'P2';
        return 'P3';
    };

    const handleContinue = () => {
        if (selectedCategory && selectedServiceId && selectedUserId && selectedSerial) {
            const user = appUsers.find(u => u.id === parseInt(selectedUserId));
            const priority = getEstablishPriority(selectedCategory, type);

            setFormData(prev => ({
                ...prev,
                service_category: selectedCategory,
                service_name: selectedServiceName,
                requester_name: user ? user.full_name : 'Usuario Desconocido',
                serial_number: selectedSerial,
                priority: priority,
                title: `${selectedServiceName} - SN: ${selectedSerial}`,
                description: `Apertura de caso ${type}.\nUsuario: ${user?.full_name}\nSerial: ${selectedSerial}`
            }));
            setCreationStep(2);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            // Ensuring all required fields are present for the backend schema
            const payload = {
                ...formData,
                assigned_engineer: assignedEngineer,
                client: selectedCI?.client || 'General',
                type: type
            };
            const res = await createIncident(payload);
            setCreatedTicket(res);
        } catch (e) {
            console.error("Creation failed", e);
            alert(`Error al crear el ticket: ${e.message}. Verifique campos obligatorios.`);
        }
    };

    const handleConfirmClosure = async () => {
        if (window.confirm("¿Confirmar resolución del incidente?")) {
            await confirmClosure(incident.id);
        }
    };

    // --- VIEW: SUMMARY SUCCESS ---
    if (createdTicket) {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center p-20">
                <div className="bg-white rounded-3xl p-12 shadow-2xl text-center max-w-lg">
                    <CheckCircle size={80} className="text-primary mx-auto mb-6" />
                    <h1 className="text-3xl font-black mb-2">¡Caso Abierto!</h1>
                    <p className="text-slate-500 mb-8">Identificador del sistema: <span className="font-mono font-bold text-slate-800">{createdTicket.id}</span></p>
                    <div className="flex gap-4">
                        <button className="flex-1 btn-lite" onClick={() => { setCreatedTicket(null); navigate(type === 'request' ? '/requests' : '/incidents'); }}>Volver</button>
                        <button className="flex-1 btn-primary-lite" onClick={() => {
                            const targetId = createdTicket.id;
                            setCreatedTicket(null);
                            navigate(type === 'request' ? `/requests/${targetId}` : `/incidents/${targetId}`);
                        }}>Gestionar Ahora</button>
                    </div>
                </div>
            </motion.div>
        );
    }

    // --- VIEW: NEW FORM (VERTICAL DESIGN) ---
    if (isNew) {
        return (
            <div className="vertical-creation-page">
                <header className="page-head flex items-center justify-between mb-8">
                    <div className="flex items-center gap-6">
                        <button onClick={() => navigate(-1)} className="btn-icon"><ArrowLeft size={20} /></button>
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 leading-none">{type === 'request' ? 'Requerimiento' : 'Incidente'}</h1>
                            <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">Apertura Protocolar IKUSI</p>
                        </div>
                    </div>
                    <div className="creation-step-indicator">
                        <div className={`step-dot ${creationStep >= 1 ? 'active' : ''}`}>1</div>
                        <div className="line"></div>
                        <div className={`step-dot ${creationStep >= 2 ? 'active' : ''}`}>2</div>
                    </div>
                </header>

                <div className="form-layout flex gap-12">
                    {/* Left Column: Form Fields */}
                    <div className="form-column flex-1 space-y-8">
                        <AnimatePresence mode="wait">
                            {creationStep === 1 ? (
                                <motion.div key="s1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                                    <div className="input-vertical">
                                        <label><UserIcon size={14} /> Usuario Solicitante</label>
                                        <select value={selectedUserId} onChange={e => setSelectedUserId(e.target.value)}>
                                            <option value="">-- Seleccionar --</option>
                                            {appUsers.map(u => <option key={u.id} value={u.id}>{u.full_name}</option>)}
                                        </select>
                                    </div>
                                    <div className="input-vertical">
                                        <label><Cpu size={14} /> Serial del Equipo (CMDB)</label>
                                        <div className="relative">
                                            <input
                                                list="cmdb-list"
                                                value={selectedSerial}
                                                onChange={e => setSelectedSerial(e.target.value)}
                                                onBlur={handleSerialBlur}
                                                placeholder="Ej: SN123456"
                                            />
                                            {isFetchingCI && <div className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin"><Activity size={16} /></div>}
                                            <datalist id="cmdb-list">
                                                {cmdbItems.map(ci => (
                                                    <option key={ci.id} value={ci.serialNumber}>
                                                        {ci.ciNumber ? `${ci.serialNumber} [${ci.ciNumber}]` : ci.serialNumber} - {ci.description || 'Sin descripción'}
                                                    </option>
                                                ))}
                                            </datalist>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="input-vertical">
                                            <label><ShieldCheck size={14} /> Categoría</label>
                                            <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
                                                <option value="">-- Seleccione --</option>
                                                {categories.map((c, i) => <option key={i} value={c}>{c}</option>)}
                                            </select>
                                        </div>
                                        <div className="input-vertical">
                                            <label><Activity size={14} /> Servicio</label>
                                            <select
                                                value={selectedServiceId}
                                                onChange={e => {
                                                    setSelectedServiceId(e.target.value);
                                                    const s = catalogServices.find(x => x.id === e.target.value);
                                                    setSelectedServiceName(s?.name || '');
                                                }}
                                                disabled={!selectedCategory}
                                            >
                                                <option value="">-- Seleccione --</option>
                                                {servicesByCategory.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <button className="btn-primary-action w-full py-4 text-lg font-black mt-4" onClick={handleContinue} disabled={!selectedServiceId || !selectedUserId || !selectedSerial}>
                                        Continuar Detalles <ChevronRight size={20} />
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                                    <div className="input-vertical">
                                        <label><UserCheck size={14} /> Ingeniero Especialista Asignado</label>
                                        <select value={assignedEngineer} onChange={e => setAssignedEngineer(e.target.value)} required>
                                            <option value="">-- Seleccione Especialista --</option>
                                            {appUsers.map(u => <option key={u.id} value={u.full_name}>{u.full_name}</option>)}
                                        </select>
                                    </div>
                                    <div className="input-vertical">
                                        <label>Título del Incidente</label>
                                        <input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                                    </div>
                                    <div className="input-vertical">
                                        <label>Prioridad de Atención (ANS)</label>
                                        <select value={formData.priority} onChange={e => setFormData({ ...formData, priority: e.target.value })}>
                                            {PRIORITY_LEVELS.map(p => <option key={p.id} value={p.id}>{p.id} - {p.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="input-vertical">
                                        <label>Descripción y Observaciones</label>
                                        <textarea rows={6} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required />
                                    </div>
                                    <div className="flex gap-4">
                                        <button className="btn-lite flex-1" onClick={() => setCreationStep(1)}>Atrás</button>
                                        <button className="btn-primary-action flex-[2] font-black" onClick={handleCreate}>APERTURAR CASO OFICIAL</button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Right Column: CI & Contract Metadata */}
                    <div className="metadata-column w-80 space-y-6">
                        <div className="meta-section">
                            <h3 className="meta-title"><Database size={14} /> Información del CI</h3>
                            {selectedCI ? (
                                <div className="meta-content">
                                    <div className="meta-row"><label>Modelo</label><span>{selectedCI.deviceModel || 'N/A'}</span></div>
                                    <div className="meta-row"><label>Cliente</label><span>{selectedCI.client}</span></div>
                                    <div className="meta-row"><label>Referencia</label><span>{selectedCI.referenceNumber || 'N/A'}</span></div>
                                </div>
                            ) : (
                                <div className="meta-placeholder">Seleccione un serial para ver información...</div>
                            )}
                        </div>

                        <div className="meta-section">
                            <h3 className="meta-title"><FileText size={14} /> Contratos Asociados</h3>
                            {associatedContract ? (
                                <div className="meta-content">
                                    <div className="meta-row"><label>Contrato Snow</label><span>{associatedContract.snowContract || 'N/A'}</span></div>
                                    <div className="meta-row"><label>Número Contrato</label><span>{associatedContract.id}</span></div>
                                    <div className="meta-row"><label>Cisco Contract</label><span>{selectedCI?.ciscoContractNumber || 'N/A'}</span></div>
                                    <div className="meta-row"><label>Folio</label><span>{associatedContract.folio || 'N/A'}</span></div>
                                </div>
                            ) : (
                                <div className="meta-placeholder">Sin contrato detectado...</div>
                            )}
                        </div>

                        <div className="meta-section premium">
                            <h3 className="meta-title"><Zap size={14} /> Nivel de ANS (SLA)</h3>
                            {associatedContract ? (
                                <div className="meta-content">
                                    <div className="sla-badge">{associatedContract.slaType || 'Bajo'}</div>
                                    <div className="meta-row mt-2"><label>Tiempo Atención</label><span>{slas.find(s => s.id === associatedContract.slaType)?.attention_display || '60 min'}</span></div>
                                    <div className="meta-row"><label>Tiempo Solución</label><span>{slas.find(s => s.id === associatedContract.slaType)?.solution_display || '24 hrs'}</span></div>
                                </div>
                            ) : (
                                <div className="meta-placeholder">Basado en prioridad por defecto...</div>
                            )}
                        </div>
                    </div>
                </div>

                <style>{`
                    .vertical-creation-page { max-width: 1200px; margin: 0 auto; padding: 40px; }
                    .step-dot { width: 28px; height: 28px; border-radius: 50%; background: #f1f5f9; color: #94a3b8; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.8rem; }
                    .step-dot.active { background: #008F39; color: #fff; box-shadow: 0 0 10px rgba(0,143,57,0.3); }
                    .creation-step-indicator { display: flex; align-items: center; gap: 10px; }
                    .creation-step-indicator .line { height: 2px; width: 30px; background: #f1f5f9; }

                    .input-vertical { display: flex; flex-direction: column; gap: 8px; }
                    .input-vertical label { font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; display: flex; align-items: center; gap: 6px; }
                    .input-vertical input, .input-vertical select, .input-vertical textarea { 
                        background: #fff; border: 1.5px solid #f1f5f9; border-radius: 12px; padding: 14px 18px; font-size: 1rem; color: #1e293b; transition: all 0.2s;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.02);
                    }
                    .input-vertical input:focus, .input-vertical select:focus, .input-vertical textarea:focus { 
                        outline: none; border-color: #008F39; box-shadow: 0 0 10px rgba(0,143,57,0.1); 
                    }

                    .meta-section { background: #fff; border-radius: 16px; border: 1px solid #f1f5f9; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.01); }
                    .meta-section.premium { border-left: 4px solid #008F39; }
                    .meta-title { font-size: 10px; font-weight: 800; color: #64748b; text-transform: uppercase; display: flex; align-items: center; gap: 6px; margin-bottom: 16px; }
                    .meta-row { display: flex; justify-content: space-between; align-items: center; padding: 6px 0; border-bottom: 1px solid #f8fafc; }
                    .meta-row label { font-size: 11px; color: #94a3b8; font-weight: 600; }
                    .meta-row span { font-size: 11px; color: #1e293b; font-weight: 700; }
                    .meta-placeholder { font-size: 11px; color: #cbd5e1; font-style: italic; text-align: center; padding: 10px; }
                    
                    .sla-badge { background: #008F39; color: #fff; display: inline-block; padding: 2px 10px; border-radius: 6px; font-size: 10px; font-weight: 900; text-transform: uppercase; }
                    .btn-primary-action { background: #008F39; color: #fff; border: none; padding: 16px; border-radius: 12px; font-weight: 800; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 10px; }
                    .btn-primary-action:hover { transform: translateY(-1px); box-shadow: 0 10px 15px -3px rgba(0,143,57,0.3); }
                    .btn-icon { background: #fff; border: 1.5px solid #f1f5f9; border-radius: 10px; padding: 8px; cursor: pointer; color: #64748b; }
                `}</style>
            </div>
        );
    }

    // --- VIEW: MANAGEMENT DASHBOARD ---
    if (!incident) {
        return (
            <div className="flex flex-col items-center justify-center p-20 opacity-50">
                <Activity className="animate-spin text-primary mb-4" size={40} />
                <p className="font-bold text-slate-400">Cargando Entorno de Gestión...</p>
            </div>
        );
    }

    const currentStep = incident.current_step;
    const isAttention = incident.status === 'En Atención';
    const isResolution = incident.status === 'En Resolución';
    const isPendingConfirmation = incident.status === 'Pendiente Confirmación';
    const isClosed = incident.status === 'Cerrado';

    return (
        <div className="management-dashboard px-10 py-10 max-w-7xl mx-auto">
            <header className="dash-head flex justify-between items-end mb-10 border-b border-slate-100 pb-10">
                <div className="flex flex-col gap-4">
                    <button onClick={() => navigate('/incidents')} className="text-xs font-bold text-slate-400 flex items-center gap-2 hover:text-primary transition-colors">
                        <ArrowLeft size={14} /> VOLVER A LA LISTA
                    </button>
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 leading-none">{incident.id}</h1>
                        <p className="text-slate-500 font-bold mt-2">{incident.title}</p>
                    </div>
                    <div className="flex gap-2">
                        <span className={`status-pill ${incident.status.toLowerCase().replace(' ', '-')}`}>{incident.status}</span>
                        <span className="meta-pill"><UserIcon size={12} /> {incident.assigned_engineer}</span>
                        <span className="meta-pill"><LinkIcon size={12} /> {incident.serial_number}</span>
                    </div>
                </div>

                <div className="dash-sla-clocks flex gap-6">
                    <SLACountdown
                        ticket={incident}
                        priority={incident.priority}
                        slaType={associatedContract?.slaType}
                        status={incident.status}
                    />
                </div>
            </header>

            <div className="workflow-grid flex gap-10">
                <div className="workflow-steps flex-1">
                    <P7M6Wizard incident={incident} />
                </div>

                {/* Vertical Metadata Sidebar */}
                <div className="metadata-side w-80 space-y-6">
                    <div className="side-card">
                        <h4 className="card-title">Detalles del Contrato</h4>
                        {associatedContract ? (
                            <div className="space-y-3">
                                <div className="side-row"><label>SLA Nivel</label><span>{associatedContract.slaType}</span></div>
                                <div className="side-row"><label>Nro. Contrato</label><span>{associatedContract.id}</span></div>
                                <div className="side-row"><label>Contrato SNOW</label><span>{associatedContract.snowContract}</span></div>
                                <div className="side-row"><label>Folio Ikusi</label><span>{associatedContract.folio}</span></div>
                                <div className="side-row"><label>Servicio</label><span>{associatedContract.servicePackage}</span></div>
                            </div>
                        ) : <div className="text-[10px] text-slate-400">Cargando información comercial...</div>}
                    </div>

                    <div className="side-card">
                        <h4 className="card-title">Cisco Insight</h4>
                        {selectedCI ? (
                            <div className="space-y-3">
                                <div className="side-row"><label>Contract #</label><span>{selectedCI.ciscoContractNumber || 'NO ENCONTRADO'}</span></div>
                                <div className="side-row"><label>Fin Soporte</label><span>{selectedCI.ciscoSupportEndDate || 'N/A'}</span></div>
                                <div className="side-row"><label>Dispositivo</label><span>{selectedCI.deviceModel}</span></div>
                            </div>
                        ) : <div className="text-[10px] text-slate-400">Consultando bases Cisco...</div>}
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isPendingConfirmation && (
                    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="fixed bottom-10 left-10 right-10 bg-slate-900 border-t-4 border-primary p-8 rounded-3xl shadow-2xl text-white flex justify-between items-center z-50">
                        <div>
                            <h3 className="text-xl font-black">Validación Final Requerida</h3>
                            <p className="text-slate-400 font-medium text-sm">El protocolo P7M6 ha finalizado. Confirme con el cliente la resolución.</p>
                        </div>
                        <button className="btn-primary-lite py-4 px-10 text-lg shadow-xl" onClick={handleConfirmClosure}>CERRAR CASO DEFINITIVAMENTE</button>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
                .status-pill { padding: 4px 12px; border-radius: 8px; font-size: 10px; font-weight: 800; text-transform: uppercase; background: #f1f5f9; color: #475569; }
                .status-pill.en-atención { background: #fff5eb; color: #ea580c; border: 1px solid #fdba74; }
                .status-pill.en-resolución { background: #008F39; color: #fff; }
                .status-pill.pendiente-confirmación { background: #0f172a; color: #fff; }
                
                .meta-pill { display: flex; align-items: center; gap: 6px; font-size: 10px; font-weight: 700; color: #64748b; background: #f8fafc; padding: 4px 10px; border-radius: 8px; border: 1px solid #f1f5f9; }

                .dash-sla-clocks { display: flex; gap: 20px; }
                .sla-status-box { background: #fff; border: 1px solid #f1f5f9; padding: 16px 24px; border-radius: 20px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); min-width: 220px; border-bottom: 4px solid #e2e8f0; }
                .sla-status-box.healthy { border-bottom-color: #008F39; }
                .sla-status-box.warning { border-bottom-color: #f59e0b; }
                .sla-status-box.critical { border-bottom-color: #dc2626; background: #fff1f2; animation: pulse-critical 1.5s infinite; }
                .sla-status-box.expired { border-bottom-color: #000; background: #000; color: #fff; }
                .sla-status-box.expired .sla-timer, .sla-status-box.expired .sla-label { color: #fff; }
                
                .sla-ref-badge { background: #f1f5f9; color: #64748b; font-size: 9px; font-weight: 900; padding: 2px 6px; border-radius: 4px; text-transform: uppercase; }
                
                .sla-label { font-size: 9px; font-weight: 900; text-transform: uppercase; color: #94a3b8; }
                .sla-timer { font-size: 1.5rem; color: #0f172a; margin-top: 4px; }

                @keyframes pulse-critical { 0% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(220, 38, 38, 0); } 100% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0); } }

                .side-card { background: #fff; border: 1px solid #f1f5f9; border-radius: 16px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.01); }
                .card-title { font-size: 10px; font-weight: 900; text-transform: uppercase; color: #64748b; margin-bottom: 12px; border-bottom: 1px solid #f8fafc; padding-bottom: 8px; }
                .side-row { display: flex; justify-content: space-between; gap: 10px; }
                .side-row label { font-size: 10px; font-weight: 700; color: #94a3b8; }
                .side-row span { font-size: 10px; font-weight: 800; color: #1e293b; text-align: right; }

                @keyframes pulse-warning { 0% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(245, 158, 11, 0); } 100% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0); } }
                @keyframes shake { 0% { transform: translateX(0); } 25% { transform: translateX(5px); } 50% { transform: translateX(-5px); } 75% { transform: translateX(5px); } 100% { transform: translateX(0); } }
            `}</style>
        </div>
    );
};

export default IncidentForm;
