import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Layers, Shield, Clock, AlertTriangle, FileText, CheckCircle } from 'lucide-react';
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
        addRequest
    } = useCatalogStore();

    const isNew = id === 'new';
    const isIncident = type === 'INC';
    const typeLabel = isIncident ? 'Incidente' : 'Requerimiento';

    const getInitialState = () => ({
        id: '',
        name: '',
        serviceId: '',
        priority: 'P3', // Default for Incident
        complexity: 'Low', // Default for Request
        time: '0h' // Default for Request
    });

    const [formData, setFormData] = useState(getInitialState());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isNew && id) {
            setLoading(true);
            try {
                const item = isIncident ? getIncident(id) : getRequest(id);
                if (item) {
                    setFormData({
                        ...getInitialState(),
                        ...item
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
    }, [id, type, isNew, isIncident, getIncident, getRequest]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            if (isNew) {
                // Generate a temp ID if needed, or backend handles it
                const newId = formData.id || `${type}-${Date.now()}`;
                const payload = { ...formData, id: newId };
                if (isIncident) addIncident(payload);
                else addRequest(payload);
            } else {
                if (isIncident) updateIncident(id, formData);
                else updateRequest(id, formData);
            }
            navigate('/catalog');
        } catch (err) {
            console.error(err);
            setError('Error al guardar');
        }
    };

    const selectedService = services.find(s => s.id === formData.serviceId);

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

                {/* 1. Información Principal */}
                <section className="form-section span-all">
                    <div className="section-header">
                        <Layers size={18} />
                        <h3>Información General</h3>
                    </div>
                    <div className="section-body grid-2">
                        <div className="input-group">
                            <label>ID del Escenario</label>
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
                            <label>Servicio Asociado</label>
                            <select
                                name="serviceId"
                                value={formData.serviceId || ''}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Seleccione un Servicio</option>
                                {services.map(s => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="input-group span-2">
                            <label>Nombre / Descripción del Escenario</label>
                            <input
                                name="name"
                                value={formData.name || ''}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        {selectedService && (
                            <div className="input-group span-2">
                                <label>Categoría (Solo Lectura)</label>
                                <input
                                    value={selectedService.category || ''}
                                    disabled
                                    className="bg-slate-100"
                                />
                            </div>
                        )}
                    </div>
                </section>

                {/* 2. Detalles Específicos */}
                <section className="form-section span-all">
                    <div className="section-header">
                        {isIncident ? <AlertTriangle size={18} /> : <FileText size={18} />}
                        <h3>Detalles de {typeLabel}</h3>
                    </div>
                    <div className="section-body grid-2">
                        {isIncident ? (
                            <div className="input-group">
                                <label>Prioridad</label>
                                <select
                                    name="priority"
                                    value={formData.priority || 'P3'}
                                    onChange={handleChange}
                                >
                                    <option value="P1">P1 - Crítico</option>
                                    <option value="P2">P2 - Alto</option>
                                    <option value="P3">P3 - Medio</option>
                                    <option value="P4">P4 - Bajo</option>
                                </select>
                            </div>
                        ) : (
                            <>
                                <div className="input-group">
                                    <label>Complejidad</label>
                                    <select
                                        name="complexity"
                                        value={formData.complexity || 'Low'}
                                        onChange={handleChange}
                                    >
                                        <option value="Low">Baja</option>
                                        <option value="Medium">Media</option>
                                        <option value="High">Alta</option>
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label>Tiempo Estimado</label>
                                    <div className="relative flex items-center">
                                        <Clock size={16} className="absolute left-3 text-slate-400" />
                                        <input
                                            name="time"
                                            value={formData.time || ''}
                                            onChange={handleChange}
                                            className="pl-10"
                                            placeholder="ej. 4h"
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </section>

                <div className="form-footer span-all">
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
                .btn-cancel { padding: 10px 24px; border-radius: 8px; border: 1px solid #cbd5e1; background: #fff; color: #64748b; font-weight: 600; cursor: pointer; transition: all 0.2s; }
                .btn-cancel:hover { background: #f1f5f9; color: #0f172a; }
                .btn-save { padding: 10px 32px; border-radius: 8px; border: none; background: #008F39; color: #fff; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 8px; box-shadow: 0 4px 6px -2px rgba(0, 143, 57, 0.3); transition: all 0.2s; }
                .btn-save:hover { background: #00702c; transform: translateY(-1px); }

                @media (max-width: 768px) {
                    .modern-form-grid { grid-template-columns: 1fr; }
                    .grid-2 { grid-template-columns: 1fr; }
                    .span-2 { grid-column: auto; }
                }
            `}</style>
        </div>
    );
};

export default CatalogForm;
