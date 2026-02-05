import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Briefcase, Calendar, User, Shield, Server } from 'lucide-react';
import useContractStore from '../store/useContractStore';
import { SERVICE_PACKAGES, SLA_TYPES } from '../data/slaData';

const ContractForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { contracts, addContract, updateContract, getContract, error } = useContractStore();
    const isNew = !id;

    // Form State - Strictly matching table columns
    const initialState = {
        id: '', // Number of Contract
        client: '',
        description: '',
        folio: '',
        slaType: 'Bajo',
        projectName: '',
        pep: '',
        status: 'Preliminar',
        startDate: '',
        endDate: '',
        pm: '', // Project Manager
        servicePackage: 'IKUSI SUB',
        packageDescription: '',
        schedule: '',
        sdm: '',
        salesRep: '', // Vendor
        snowContract: ''
    };

    const [formData, setFormData] = useState(initialState);
    const [localLoading, setLocalLoading] = useState(false);

    // Date formatter helper
    const formatDate = (d) => {
        if (!d) return '';
        if (typeof d === 'string' && d.includes('T')) return d.split('T')[0];
        return d;
    };

    useEffect(() => {
        if (!isNew) {
            const existing = contracts.find(c => c.id === id);
            if (existing) {
                setFormData({
                    ...initialState,
                    ...existing,
                    status: existing.status || 'Preliminar',
                    startDate: formatDate(existing.startDate),
                    endDate: formatDate(existing.endDate),
                });
            } else {
                setLocalLoading(true);
                getContract(id)
                    .then(data => {
                        setFormData({
                            ...initialState,
                            ...data,
                            status: data.status || 'Preliminar',
                            startDate: formatDate(data.startDate),
                            endDate: formatDate(data.endDate),
                        });
                        setLocalLoading(false);
                    })
                    .catch(err => {
                        console.error(err);
                        setLocalLoading(false);
                    });
            }
        }
    }, [id, contracts, isNew, getContract]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isNew) addContract(formData);
        else updateContract(id, formData);
        navigate('/contracts');
    };

    const isLoading = !isNew && (localLoading || (!contracts.find(c => c.id === id) && !error));

    if (isLoading) {
        if (error) {
            return (
                <div className="p-10 text-center text-red-500">
                    <p>Error cargando contrato: {error}</p>
                    <button className="btn-secondary mt-4" onClick={() => navigate('/contracts')}>Volver</button>
                </div>
            );
        }
        return <div className="p-10 text-center text-muted">Cargando contrato...</div>;
    }

    return (
        <div className="form-page animate-fade">
            <header className="form-header">
                <button className="back-btn" onClick={() => navigate('/contracts')}>
                    <ArrowLeft size={20} />
                </button>
                <div className="header-title-clean">
                    <h1>{isNew ? 'Nuevo Contrato' : 'Detalles del Contrato'}</h1>
                    <p className="subtitle">{isNew ? 'Complete la información requerida' : `Editando: ${id}`}</p>
                </div>
                <div className="header-actions-right">
                    {!isNew && (
                        <button
                            className="btn-cis-link"
                            onClick={() => navigate(`/cmdb?contractId=${formData.id || ''}`)}
                            title="Ver CIs asociados a este contrato"
                        >
                            <Server size={16} /> Ver CIs Asociados
                        </button>
                    )}
                    <span className={`status-badge-large ${(formData.status || 'preliminar').toLowerCase()}`}>
                        {formData.status || 'Preliminar'}
                    </span>
                </div>
            </header>

            <form onSubmit={handleSubmit} className="modern-form-grid">

                {/* 1. Información General y Contrato */}
                <section className="form-section span-all">
                    <div className="section-header">
                        <Briefcase size={18} />
                        <h3>Información del Contrato</h3>
                    </div>
                    <div className="section-body grid-3">
                        {/* Row 1 */}
                        <div className="input-group">
                            <label>Número de Contrato (ID)</label>
                            <input name="id" value={formData.id || ''} disabled className="bg-slate-100" placeholder="Autogenerado" />
                        </div>
                        <div className="input-group">
                            <label>Contrato Snow</label>
                            <input name="snowContract" value={formData.snowContract || ''} onChange={handleChange} />
                        </div>
                        <div className="input-group">
                            <label>Cliente</label>
                            <input name="client" value={formData.client || ''} onChange={handleChange} required />
                        </div>

                        {/* Row 2 */}
                        <div className="input-group span-2">
                            <label>Descripción Contrato</label>
                            <input name="description" value={formData.description || ''} onChange={handleChange} />
                        </div>
                        <div className="input-group">
                            <label>Folio</label>
                            <input name="folio" value={formData.folio || ''} onChange={handleChange} />
                        </div>

                        {/* Row 3 */}
                        <div className="input-group">
                            <label>Estado</label>
                            <select name="status" value={formData.status || 'Preliminar'} onChange={handleChange} className="status-select">
                                <option value="Preliminar">Preliminar</option>
                                <option value="Activo">Active</option>
                                <option value="Suspendido">Suspended</option>
                                <option value="Finalizado">Finished</option>
                            </select>
                        </div>
                        <div className="input-group">
                            <label>Nombre de Proyecto</label>
                            <input name="projectName" value={formData.projectName || ''} onChange={handleChange} />
                        </div>
                        <div className="input-group">
                            <label>PEP</label>
                            <input name="pep" value={formData.pep || ''} onChange={handleChange} />
                        </div>
                    </div>
                </section>

                {/* 2. Fechas y ANS */}
                <section className="form-section">
                    <div className="section-header">
                        <Calendar size={18} />
                        <h3>Fechas y Niveles</h3>
                    </div>
                    <div className="section-body grid-1">
                        <div className="input-group">
                            <label>Inicio Contrato</label>
                            <input type="date" name="startDate" value={formData.startDate || ''} onChange={handleChange} />
                        </div>
                        <div className="input-group">
                            <label>Fin Contrato</label>
                            <input type="date" name="endDate" value={formData.endDate || ''} onChange={handleChange} />
                        </div>
                        <div className="input-group">
                            <label>ANS ASOCIADO</label>
                            <select name="slaType" value={formData.slaType || 'Bajo'} onChange={handleChange}>
                                {(SLA_TYPES || []).map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                            </select>
                        </div>
                    </div>
                </section>

                {/* 3. Paquetes y Horarios */}
                <section className="form-section">
                    <div className="section-header">
                        <Shield size={18} />
                        <h3>Paquete de Servicio</h3>
                    </div>
                    <div className="section-body grid-1">
                        <div className="input-group">
                            <label>Paquete de Servicio</label>
                            <input name="servicePackage" value={formData.servicePackage || ''} onChange={handleChange} list="packages-list" />
                            <datalist id="packages-list">
                                {(SERVICE_PACKAGES || []).map(p => <option key={p} value={p} />)}
                            </datalist>
                        </div>
                        <div className="input-group">
                            <label>Descripción del paquete de servicio</label>
                            <textarea
                                name="packageDescription"
                                value={formData.packageDescription || ''}
                                onChange={handleChange}
                                rows={2}
                            />
                        </div>
                        <div className="input-group">
                            <label>Horario Paquete de Servicio</label>
                            <input name="schedule" value={formData.schedule || ''} onChange={handleChange} />
                        </div>
                    </div>
                </section>

                {/* 4. Responsables */}
                <section className="form-section">
                    <div className="section-header">
                        <User size={18} />
                        <h3>Equipo Responsable</h3>
                    </div>
                    <div className="section-body grid-1">
                        <div className="input-group">
                            <label>Project Manager (PM)</label>
                            <input name="pm" value={formData.pm || ''} onChange={handleChange} />
                        </div>
                        <div className="input-group">
                            <label>SDM</label>
                            <input name="sdm" value={formData.sdm || ''} onChange={handleChange} />
                        </div>
                        <div className="input-group">
                            <label>Vendor</label>
                            <input name="salesRep" value={formData.salesRep || ''} onChange={handleChange} />
                        </div>
                    </div>
                </section>

                <div className="form-footer span-all">
                    <button type="button" className="btn-cancel" onClick={() => navigate('/contracts')}>Descartar</button>
                    <button type="submit" className="btn-save">
                        <Save size={18} />
                        Guardar Cambios
                    </button>
                </div>

            </form>

            <style>{`
                .form-page { max-width: 1100px; margin: 0 auto; padding-bottom: 60px; }
                .form-header { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; padding: 0 8px; }
                .header-title-clean h1 { margin: 0; font-size: 1.8rem; color: #1e293b; font-weight: 800; letter-spacing: -0.02em; }
                .subtitle { color: #64748b; margin: 0; font-size: 0.9rem; }
                .header-actions-right { margin-left: auto; }
                
                .back-btn { background: #fff; border: 1px solid #cbd5e1; width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #475569; transition: all 0.2s; }
                .back-btn:hover { background: #f1f5f9; color: #0f172a; transform: translateX(-3px); }

                .status-badge-large { padding: 6px 16px; border-radius: 20px; font-weight: 700; text-transform: uppercase; font-size: 0.8rem; letter-spacing: 0.05em; }
                .status-badge-large.preliminar { background: #fff7ed; color: #c2410c; border: 1px solid #ffedd5; }
                .status-badge-large.activo { background: #f0fdf4; color: #15803d; border: 1px solid #dcfce7; }
                .status-badge-large.suspendido { background: #fef2f2; color: #b91c1c; border: 1px solid #fee2e2; }
                .status-badge-large.finalizado { background: #f1f5f9; color: #475569; border: 1px solid #e2e8f0; }

                .modern-form-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
                .form-section { background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -4px rgba(0, 0, 0, 0.05); display: flex; flex-direction: column; }
                .span-all { grid-column: 1 / -1; }
                .span-2 { grid-column: span 2; }
                .span-3 { grid-column: span 3; }

                .section-header { background: #f8fafc; padding: 12px 20px; border-bottom: 1px solid #e2e8f0; display: flex; align-items: center; gap: 10px; color: #334155; font-weight: 700; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; }
                .section-header svg { color: #008F39; }
                
                .section-body { padding: 20px; gap: 16px; display: grid; }
                .grid-2 { grid-template-columns: 1fr 1fr; }
                .grid-3 { grid-template-columns: 1fr 1fr 1fr; }
                .grid-1 { grid-template-columns: 1fr; }

                .input-group { display: flex; flex-direction: column; gap: 6px; }
                .input-group label { font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.02em; }
                .input-group input, .input-group select, .input-group textarea {
                    padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.9rem; color: #1e293b; transition: all 0.2s; background: #fff; width: 100%;
                }
                .input-group input:focus, .input-group select:focus, .input-group textarea:focus { border-color: #008F39; box-shadow: 0 0 0 3px rgba(0, 143, 57, 0.1); outline: none; }
                .input-group textarea { resize: vertical; min-height: 80px; font-family: inherit; }

                .pep-wrapper { position: relative; }
                .pep-wrapper input { padding-right: 60px; font-family: 'JetBrains Mono', monospace; }
                .pep-wrapper .counter { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); font-size: 0.7rem; color: #94a3b8; font-family: monospace; }
                .pep-wrapper .counter.ok { color: #22c55e; }

                .form-footer { display: flex; justify-content: flex-end; gap: 12px; padding-top: 20px; border-top: 1px solid #e2e8f0; margin-top: 20px; }
                .btn-cancel { padding: 10px 24px; border-radius: 8px; border: 1px solid #cbd5e1; background: #fff; color: #64748b; font-weight: 600; cursor: pointer; transition: all 0.2s; }
                .btn-cancel:hover { background: #f1f5f9; color: #0f172a; }
                .btn-save { padding: 10px 32px; border-radius: 8px; border: none; background: #008F39; color: #fff; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 8px; box-shadow: 0 4px 6px -2px rgba(0, 143, 57, 0.3); transition: all 0.2s; }
                .btn-save:hover { background: #00702c; transform: translateY(-1px); }

                @media (max-width: 900px) {
                    .modern-form-grid { grid-template-columns: 1fr; }
                    .grid-2, .grid-3 { grid-template-columns: 1fr; }
                    .span-2, .span-3 { grid-column: auto; }
                }
            `}</style>
        </div>
    );
};

export default ContractForm;
