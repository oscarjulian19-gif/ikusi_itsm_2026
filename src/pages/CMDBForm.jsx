import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Server, Calendar, Hash, User, MapPin, Globe, Shield, Tag } from 'lucide-react';
import useCMDBStore from '../store/useCMDBStore';

const CMDBForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { cis, addCI, updateCI, fetchCIs } = useCMDBStore();
    const isNew = !id;

    const initialState = {
        id: '',
        serialNumber: '',
        referenceNumber: '',
        client: '',
        description: '',
        status: 'Activo',
        startDate: '',
        endDate: '',
        poNumber: '',
        soNumber: '',
        ciscoSupportEndDate: '',
        ciscoSupportStartDate: '',
        ciscoContractNumber: '',
        contractId: '',
        snowContract: '',
        city: '',
        address: '',
        projectName: '',
        pep: '',
        country: 'Colombia',
        type: 'Server',
        deviceModel: ''
    };

    const [formData, setFormData] = useState(initialState);
    const [loadingData, setLoadingData] = useState(false);

    useEffect(() => {
        if (cis.length === 0) fetchCIs();
    }, [cis.length, fetchCIs]);

    useEffect(() => {
        if (!isNew) {
            const existing = cis.find(c => c.id === id);
            if (existing) {
                const formatDate = (d) => {
                    if (!d) return '';
                    if (d.includes('T')) return d.split('T')[0];
                    return d;
                };

                setFormData({
                    ...initialState,
                    ...existing,
                    startDate: formatDate(existing.startDate),
                    endDate: formatDate(existing.endDate),
                    ciscoSupportEndDate: formatDate(existing.ciscoSupportEndDate),
                    ciscoSupportStartDate: formatDate(existing.ciscoSupportStartDate),
                });
            } else {
                setLoadingData(true);
            }
        }
    }, [id, cis, isNew]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isNew) await addCI(formData);
            else await updateCI(id, formData);
            navigate('/cmdb');
        } catch (error) {
            alert("Error guardando CI: " + error.message);
        }
    };

    if (loadingData && !isNew) return <div className="p-10 text-center">Cargando...</div>;

    return (
        <div className="form-page animate-fade">
            <header className="form-header">
                <button className="back-btn" onClick={() => navigate('/cmdb')}>
                    <ArrowLeft size={20} />
                </button>
                <div className="header-title-clean">
                    <h1>{isNew ? 'Nuevo CI' : 'Detalles del CI'}</h1>
                    <p className="subtitle">{isNew ? 'Registrar nuevo activo' : `Editando: ${id}`}</p>
                </div>
                <div className="header-actions-right">
                    <span className={`status-badge-large ${formData.status?.toLowerCase()}`}>
                        {formData.status}
                    </span>
                </div>
            </header>

            <form onSubmit={handleSubmit} className="modern-form-grid">

                {/* 1. Core Identity */}
                <section className="form-section span-all">
                    <div className="section-header">
                        <Server size={18} />
                        <h3>Identificación del Activo</h3>
                    </div>
                    <div className="section-body grid-3">
                        <div className="input-group">
                            <label>Número CI (ID)</label>
                            <input name="id" value={formData.id} onChange={handleChange} required disabled={!isNew && !!formData.id} className={!isNew ? "bg-slate-100" : ""} />
                        </div>
                        <div className="input-group">
                            <label>Número Serial</label>
                            <input name="serialNumber" value={formData.serialNumber} onChange={handleChange} />
                        </div>
                        <div className="input-group">
                            <label>Número Referencia</label>
                            <input name="referenceNumber" value={formData.referenceNumber} onChange={handleChange} />
                        </div>

                        <div className="input-group">
                            <label>Cliente</label>
                            <input name="client" value={formData.client} onChange={handleChange} required />
                        </div>
                        <div className="input-group">
                            <label>Tipo</label>
                            <input name="type" value={formData.type} onChange={handleChange} list="types-list" />
                            <datalist id="types-list">
                                <option value="Server" />
                                <option value="Switch" />
                                <option value="Router" />
                                <option value="Firewall" />
                                <option value="Storage" />
                                <option value="Access Point" />
                            </datalist>
                        </div>
                        <div className="input-group">
                            <label>Modelo Equipo</label>
                            <input name="deviceModel" value={formData.deviceModel} onChange={handleChange} />
                        </div>

                        <div className="input-group span-3">
                            <label>Descripción</label>
                            <input name="description" value={formData.description} onChange={handleChange} />
                        </div>
                    </div>
                </section>

                {/* 2. Fechas y Soporte */}
                <section className="form-section">
                    <div className="section-header">
                        <Shield size={18} />
                        <h3>Contratos y Soporte</h3>
                    </div>
                    <div className="section-body grid-1">
                        <div className="input-group">
                            <label>Estado</label>
                            <select name="status" value={formData.status} onChange={handleChange}>
                                <option value="Activo">Activo</option>
                                <option value="Inactivo">Inactivo</option>
                                <option value="Retirado">Retirado</option>
                                <option value="En Mantenimiento">En Mantenimiento</option>
                            </select>
                        </div>
                        <div className="input-group">
                            <label>Inicio Operación</label>
                            <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} />
                        </div>
                        <div className="input-group">
                            <label>Fin Operación</label>
                            <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} />
                        </div>

                        <h4 className="mt-4 text-sm font-bold text-gray-500 uppercase">Soporte Cisco</h4>
                        <div className="input-group">
                            <label>Inicio Soporte Cisco</label>
                            <input type="date" name="ciscoSupportStartDate" value={formData.ciscoSupportStartDate} onChange={handleChange} />
                        </div>
                        <div className="input-group">
                            <label>Fin Soporte Cisco</label>
                            <input type="date" name="ciscoSupportEndDate" value={formData.ciscoSupportEndDate} onChange={handleChange} />
                        </div>
                        <div className="input-group">
                            <label>Contrato Cisco</label>
                            <input name="ciscoContractNumber" value={formData.ciscoContractNumber} onChange={handleChange} />
                        </div>
                    </div>
                </section>

                {/* 3. Comercial y Contratos */}
                <section className="form-section">
                    <div className="section-header">
                        <Tag size={18} />
                        <h3>Información Comercial</h3>
                    </div>
                    <div className="section-body grid-1">
                        <div className="input-group">
                            <label>Número de Contrato</label>
                            <input name="contractId" value={formData.contractId} onChange={handleChange} />
                        </div>
                        <div className="input-group">
                            <label>Contrato Snow</label>
                            <input name="snowContract" value={formData.snowContract} onChange={handleChange} />
                        </div>
                        <div className="input-group">
                            <label>Número de PO</label>
                            <input name="poNumber" value={formData.poNumber} onChange={handleChange} />
                        </div>
                        <div className="input-group">
                            <label>Número de SO</label>
                            <input name="soNumber" value={formData.soNumber} onChange={handleChange} />
                        </div>
                        <div className="input-group">
                            <label>PEP</label>
                            <input name="pep" value={formData.pep} onChange={handleChange} />
                        </div>
                    </div>
                </section>

                {/* 4. Ubicación */}
                <section className="form-section">
                    <div className="section-header">
                        <MapPin size={18} />
                        <h3>Ubicación y Proyecto</h3>
                    </div>
                    <div className="section-body grid-1">
                        <div className="input-group">
                            <label>País</label>
                            <input name="country" value={formData.country} onChange={handleChange} />
                        </div>
                        <div className="input-group">
                            <label>Ciudad</label>
                            <input name="city" value={formData.city} onChange={handleChange} />
                        </div>
                        <div className="input-group">
                            <label>Dirección</label>
                            <input name="address" value={formData.address} onChange={handleChange} />
                        </div>
                        <div className="input-group">
                            <label>Nombre Proyecto</label>
                            <input name="projectName" value={formData.projectName} onChange={handleChange} />
                        </div>
                    </div>
                </section>

                <div className="form-footer span-all">
                    <button type="button" className="btn-cancel" onClick={() => navigate('/cmdb')}>Descartar</button>
                    <button type="submit" className="btn-save">
                        <Save size={18} />
                        Guardar Cambios
                    </button>
                </div>

            </form>

            <style>{`
                .form-page { max-width: 1200px; margin: 0 auto; padding-bottom: 60px; }
                .form-header { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; padding: 0 8px; }
                .header-title-clean h1 { margin: 0; font-size: 1.8rem; color: #1e293b; font-weight: 800; letter-spacing: -0.02em; }
                .subtitle { color: #64748b; margin: 0; font-size: 0.9rem; }
                .header-actions-right { margin-left: auto; }
                
                .back-btn { background: #fff; border: 1px solid #cbd5e1; width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #475569; transition: all 0.2s; }
                .back-btn:hover { background: #f1f5f9; color: #0f172a; transform: translateX(-3px); }

                .status-badge-large { padding: 6px 16px; border-radius: 20px; font-weight: 700; text-transform: uppercase; font-size: 0.8rem; letter-spacing: 0.05em; background: #f1f5f9; color: #475569; border: 1px solid #e2e8f0; }
                .status-badge-large.activo { background: #f0fdf4; color: #15803d; border: 1px solid #dcfce7; }
                
                .modern-form-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
                .form-section { background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -4px rgba(0, 0, 0, 0.05); display: flex; flex-direction: column; }
                .span-all { grid-column: 1 / -1; }
                .span-3 { grid-column: span 3; }
                
                .section-header { background: #f8fafc; padding: 12px 20px; border-bottom: 1px solid #e2e8f0; display: flex; align-items: center; gap: 10px; color: #334155; font-weight: 700; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; }
                .section-header svg { color: #008F39; }
                
                .section-body { padding: 20px; gap: 16px; display: grid; }
                .grid-3 { grid-template-columns: 1fr 1fr 1fr; }
                .grid-1 { grid-template-columns: 1fr; }

                .input-group { display: flex; flex-direction: column; gap: 6px; }
                .input-group label { font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.02em; }
                .input-group input, .input-group select, .input-group textarea {
                    padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.9rem; color: #1e293b; transition: all 0.2s; background: #fff; width: 100%;
                }
                .input-group input:focus, .input-group select:focus { border-color: #008F39; box-shadow: 0 0 0 3px rgba(0, 143, 57, 0.1); outline: none; }
                
                .form-footer { display: flex; justify-content: flex-end; gap: 12px; padding-top: 20px; border-top: 1px solid #e2e8f0; margin-top: 20px; }
                .btn-cancel { padding: 10px 24px; border-radius: 8px; border: 1px solid #cbd5e1; background: #fff; color: #64748b; font-weight: 600; cursor: pointer; transition: all 0.2s; }
                .btn-save { padding: 10px 32px; border-radius: 8px; border: none; background: #008F39; color: #fff; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 8px; box-shadow: 0 4px 6px -2px rgba(0, 143, 57, 0.3); transition: all 0.2s; }
                .btn-save:hover { background: #00702c; transform: translateY(-1px); }

                @media (max-width: 900px) {
                    .modern-form-grid { grid-template-columns: 1fr; }
                    .grid-3 { grid-template-columns: 1fr; }
                    .span-3 { grid-column: auto; }
                }
            `}</style>
        </div>
    );
};

export default CMDBForm;
