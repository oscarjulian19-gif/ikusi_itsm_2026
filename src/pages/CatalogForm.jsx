import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Layers, Shield, Clock, AlertTriangle, FileText, CheckCircle, Trash2 } from 'lucide-react';
import useCatalogStore from '../store/useCatalogStore';

const CatalogForm = () => {
    const { type, id } = useParams(); // type: 'INC' or 'REQ'
    const navigate = useNavigate();
    const {
        services,
        getIncident,
        getRequest,
        updateIncident,
        updateRequest,
        addIncident,
        addRequest,
        updateService
    } = useCatalogStore();

    const isNew = id === 'new';
    const isIncident = type === 'INC';
    const typeLabel = isIncident ? 'Incidente' : 'Requerimiento';

    const getInitialState = () => ({
        // Scenario Fields
        id: '',
        name: '',
        serviceId: '',
        priority: 'P3', // Default for Incident
        complexity: 'Low', // Default for Request
        time: '0h', // Default for Request
        keywords: '',
        sief_code: '', // Scenario SIEF

        // Service Fields (Editable)
        service_category: '',
        service_category_code: '',
        service_category_description: '',
        service_name: '',
        service_sief_code: '',
        service_description: ''
    });

    const [formData, setFormData] = useState(getInitialState());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Initial Load
    useEffect(() => {
        if (!isNew && id) {
            setLoading(true);
            try {
                const item = isIncident ? getIncident(id) : getRequest(id);
                if (item) {
                    // Find related service to populate fields
                    const relatedService = services.find(s => s.id === item.serviceId);

                    setFormData({
                        ...getInitialState(),
                        ...item,
                        // Populate Service Fields
                        service_category: relatedService?.category || '',
                        service_category_code: relatedService?.category_code || '',
                        service_category_description: relatedService?.category_description || '',
                        service_name: relatedService?.name || '',
                        service_sief_code: relatedService?.sief_code || '',
                        service_description: relatedService?.service_description || ''
                    });
                } else {
                    setError('Elemento no encontrado');
                }
            } catch (err) {
                console.error(err);
                setError('Error al cargar el elemento');
            } finally {
                setLoading(false);
            }
        }
    }, [id, type, isNew, isIncident, getIncident, getRequest, services]); // added services dependency

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleServiceChange = (e) => {
        const serviceId = e.target.value;
        const selected = services.find(s => s.id === serviceId);
        if (selected) {
            setFormData(prev => ({
                ...prev,
                serviceId: serviceId,
                service_category: selected.category,
                service_category_code: selected.category_code,
                service_category_description: selected.category_description,
                service_name: selected.name,
                service_sief_code: selected.sief_code,
                service_description: selected.service_description
            }));
        } else {
            setFormData(prev => ({ ...prev, serviceId: serviceId })); // Reset or Keep?
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // 1. Update Service Data first (if serviceId exists)
            if (formData.serviceId) {
                const servicePayload = {
                    id: formData.serviceId,
                    category: formData.service_category,
                    category_code: formData.service_category_code,
                    category_description: formData.service_category_description,
                    name: formData.service_name,
                    sief_code: formData.service_sief_code,
                    service_description: formData.service_description
                };
                await updateService(formData.serviceId, servicePayload);
            }

            // 2. Update/Create Scenario
            if (isNew) {
                const newId = formData.id || `${type}-${Date.now()}`;
                const payload = { ...formData, id: newId };
                if (isIncident) await addIncident(payload);
                else await addRequest(payload);
            } else {
                if (isIncident) await updateIncident(id, formData);
                else await updateRequest(id, formData);
            }
            navigate('/catalog');
        } catch (err) {
            console.error(err);
            setError('Error al guardar');
        }
    };

    // const selectedService = services.find(s => s.id === formData.serviceId); // No longer needed for display, purely state based

    if (loading) return <div className="p-10 text-center text-muted">Cargando...</div>;
    if (error) return (
        <div className="p-10 text-center text-red-500">
            <p>{error}</p>
            <button className="btn-secondary mt-4" onClick={() => navigate('/catalog')}>Volver</button>
        </div>
    );

    return (
        <div className="form-page animate-fade">
            <header className="form-header">
                <button className="back-btn" onClick={() => navigate('/catalog')}>
                    <ArrowLeft size={20} />
                </button>
                <div className="header-title-clean">
                    <h1>{isNew ? `Nuevo ${typeLabel}` : `Editar ${typeLabel}`}</h1>
                    <p className="subtitle">{isNew ? 'Defina el nuevo escenario' : `ID: ${id}`}</p>
                </div>
            </header>

            <form onSubmit={handleSubmit} className="modern-form-grid">

                {/* 1. Información Principal (Scenario) */}
                <section className="form-section span-all">
                    <div className="section-header">
                        <Layers size={18} />
                        <h3>Información del Escenario (Tipo)</h3>
                    </div>
                    <div className="section-body grid-2">
                        <div className="input-group">
                            <label>Cod. Tipo Sistema (ID)</label>
                            <input
                                name="id"
                                value={formData.id || ''}
                                disabled={!isNew}
                                placeholder={isNew ? "Autogenerado si vacío" : ""}
                                className={!isNew ? "bg-slate-100" : ""}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="input-group">
                            <label>Cod. SIEF Tipo</label>
                            <input
                                name="sief_code"
                                value={formData.sief_code || ''}
                                onChange={handleChange}
                                placeholder="EJ. SIEF-INC-001"
                            />
                        </div>
                        <div className="input-group span-2">
                            <label>Desc. Tipo (Nombre Escenario)</label>
                            <input
                                name="name"
                                value={formData.name || ''}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="input-group span-all">
                            <label>Palabras Clave (Keywords)</label>
                            <textarea
                                name="keywords"
                                value={formData.keywords || ''}
                                onChange={handleChange}
                                placeholder="Separe por comas..."
                                rows={2}
                            />
                        </div>
                    </div>
                </section>

                {/* 2. Información del Servicio (Contexto - Editable) */}
                <section className="form-section span-all">
                    <div className="section-header">
                        <Shield size={18} />
                        <h3>Información del Servicio (Base)</h3>
                    </div>
                    <div className="section-body grid-2">
                        {/* Service Selection / Creation Logic could go heater but keeping simple for "Edit Line" flow */}
                        <div className="input-group span-2">
                            <label>Identificador del Servicio (Cod. Serv. Sistema)</label>
                            <div className="flex gap-2">
                                <select
                                    name="serviceId"
                                    value={formData.serviceId || ''}
                                    onChange={handleServiceChange}
                                    className="flex-1"
                                    required
                                >
                                    <option value="">-- Seleccionar Existente --</option>
                                    {services.map(s => (
                                        <option key={s.id} value={s.id}>
                                            {s.id} - {s.name}
                                        </option>
                                    ))}
                                </select>
                                {/* Optional: Input for new Service ID if needed, but risky for integrity without validation */}
                            </div>
                        </div>

                        <div className="input-group">
                            <label>Categoria</label>
                            <input
                                name="service_category"
                                value={formData.service_category || ''}
                                onChange={handleChange}
                                placeholder="Ej. Conectividad"
                            />
                        </div>
                        <div className="input-group">
                            <label>Cod. Cat. Sistema</label>
                            <input
                                name="service_category_code"
                                value={formData.service_category_code || ''}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="input-group span-2">
                            <label>Desc. Categoria</label>
                            <input
                                name="service_category_description"
                                value={formData.service_category_description || ''}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="input-group">
                            <label>Servicio</label>
                            <input
                                name="service_name"
                                value={formData.service_name || ''}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="input-group">
                            <label>Cod. SIEF Servicio</label>
                            <input
                                name="service_sief_code"
                                value={formData.service_sief_code || ''}
                                onChange={handleChange}
                            />
                        </div>
                        {/* Service ID (Readonly mostly, serving as key) */}
                        <div className="input-group">
                            <label>Cod. Serv. Sistema (ID)</label>
                            <input value={formData.serviceId || ''} disabled className="bg-slate-100" />
                        </div>
                        <div className="input-group">
                            <label>Desc. Servicio</label>
                            <input
                                name="service_description"
                                value={formData.service_description || ''}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </section>



                <div className="form-footer span-all">
                    {!isNew && (
                        <div className="mr-auto">
                            <button
                                type="button"
                                className="btn-delete"
                                onClick={() => {
                                    if (window.confirm('¿Está seguro de eliminar este elemento?')) {
                                        if (isIncident) deleteIncident(id);
                                        else deleteRequest(id);
                                        navigate('/catalog');
                                    }
                                }}
                            >
                                <Trash2 size={18} /> Eliminar
                            </button>
                        </div>
                    )}
                    <button type="button" className="btn-cancel" onClick={() => navigate('/catalog')}>Descartar</button>
                    <button type="submit" className="btn-save">
                        <Save size={18} />
                        Guardar Cambios
                    </button>
                </div>

            </form>

            <style>{`
                .form-page { max-width: 900px; margin: 0 auto; padding-bottom: 60px; }
                .form-header { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; padding: 0 8px; }
                .header-title-clean h1 { margin: 0; font-size: 1.8rem; color: #1e293b; font-weight: 800; letter-spacing: -0.02em; }
                .subtitle { color: #64748b; margin: 0; font-size: 0.9rem; }
                
                .back-btn { background: #fff; border: 1px solid #cbd5e1; width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #475569; transition: all 0.2s; }
                .back-btn:hover { background: #f1f5f9; color: #0f172a; transform: translateX(-3px); }

                .modern-form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
                .form-section { background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -4px rgba(0, 0, 0, 0.05); display: flex; flex-direction: column; }
                .span-all { grid-column: 1 / -1; }
                .span-2 { grid-column: span 2; }
                
                .section-header { background: #f8fafc; padding: 12px 20px; border-bottom: 1px solid #e2e8f0; display: flex; align-items: center; gap: 10px; color: #334155; font-weight: 700; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; }
                .section-header svg { color: #008F39; }
                
                .section-body { padding: 20px; gap: 16px; display: grid; }
                .grid-2 { grid-template-columns: 1fr 1fr; }
                
                .input-group { display: flex; flex-direction: column; gap: 6px; }
                .input-group label { font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.02em; }
                .input-group input, .input-group select, .input-group textarea {
                    padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.9rem; color: #1e293b; transition: all 0.2s; background: #fff; width: 100%;
                }
                .pl-10 { padding-left: 36px !important; }
                .input-group input:focus, .input-group select:focus, .input-group textarea:focus { border-color: #008F39; box-shadow: 0 0 0 3px rgba(0, 143, 57, 0.1); outline: none; }
                
                .form-footer { display: flex; justify-content: flex-end; gap: 12px; padding-top: 20px; border-top: 1px solid #e2e8f0; margin-top: 20px; }
                .mr-auto { margin-right: auto; }
                
                .btn-cancel { padding: 10px 24px; border-radius: 8px; border: 1px solid #cbd5e1; background: #fff; color: #64748b; font-weight: 600; cursor: pointer; transition: all 0.2s; }
                .btn-cancel:hover { background: #f1f5f9; color: #0f172a; }
                .btn-save { padding: 10px 32px; border-radius: 8px; border: none; background: #008F39; color: #fff; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 8px; box-shadow: 0 4px 6px -2px rgba(0, 143, 57, 0.3); transition: all 0.2s; }
                .btn-save:hover { background: #00702c; transform: translateY(-1px); }
                
                .btn-delete { padding: 8px 16px; border-radius: 8px; border: 1px solid #fee2e2; background: #fff; color: #dc2626; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: all 0.2s; }
                .btn-delete:hover { background: #fee2e2; }

                @media (max-width: 768px) {
                    .modern-form-grid { grid-template-columns: 1fr; }
                    .grid-2 { grid-template-columns: 1fr; }
                    .span-2 { grid-column: auto; }
                    .form-footer { flex-direction: column-reverse; gap: 16px; }
                    .mr-auto { margin-right: 0; width: 100%; }
                    .btn-delete { width: 100%; justify-content: center; }
                }
            `}</style>
        </div>
    );
};

export default CatalogForm;
