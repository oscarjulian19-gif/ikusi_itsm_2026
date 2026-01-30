import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Cpu, AlertTriangle, Clock } from 'lucide-react';
import useCaseStore from '../store/useCaseStore';
import useCMDBStore from '../store/useCMDBStore';
import { CLIENTS, PEPS, ARCHITECTURES, TEAMS, STATUS_FLOW } from '../data/initialData';

const IncidentForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addCase, updateCase, getCaseById } = useCaseStore();
    const { cis } = useCMDBStore();
    const isNew = !id;

    const [formData, setFormData] = useState({
        title: '',
        client: '',
        pep: '',
        architecture: '',
        ciId: '', // New field for CI Linkage
        priority: 'P3',
        status: 'Nuevo',
        assignedTeam: '',
        description: '',
        solution: '',
        impact: 'Medium', // For auto-calculation simulation
        urgency: 'Medium'
    });

    useEffect(() => {
        if (!isNew) {
            const existing = getCaseById(id);
            if (existing) {
                setFormData(existing);
            } else {
                navigate('/incidents'); // Not found
            }
        }
    }, [id, isNew, getCaseById, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Simple Priority Calculation Simulation
    useEffect(() => {
        if (isNew) {
            if (formData.impact === 'High' && formData.urgency === 'High') {
                setFormData(prev => ({ ...prev, priority: 'P1' }));
            } else if (formData.impact === 'High' || formData.urgency === 'High') {
                setFormData(prev => ({ ...prev, priority: 'P2' }));
            } else {
                setFormData(prev => ({ ...prev, priority: 'P3' }));
            }
        }
    }, [formData.impact, formData.urgency, isNew]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isNew) {
            const newCase = {
                ...formData,
                id: `INC-${Math.floor(Math.random() * 10000) + 10000}`,
                type: 'incident',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            addCase(newCase);
        } else {
            updateCase(id, formData);
        }
        navigate('/incidents');
    };

    const statusOptions = STATUS_FLOW['incident'];

    return (
        <div className="incident-form-page">
            <header className="form-header">
                <button className="back-btn" onClick={() => navigate('/incidents')}>
                    <ArrowLeft size={20} />
                    Volver
                </button>
                <h1>{isNew ? 'Nuevo Incidente' : `Editar ${id}`}</h1>
            </header>

            <div className="form-container">
                <form onSubmit={handleSubmit} className="glass-panel">

                    {/* Section 1: Core Info */}
                    <div className="form-section">
                        <h3><AlertTriangle size={18} /> Información General</h3>
                        <div className="form-grid">
                            <div className="form-group full-width">
                                <label>Título del Incidente</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    placeholder="Ej: Falla en servidor de base de datos..."
                                />
                            </div>

                            <div className="form-group">
                                <label>Cliente</label>
                                <select name="client" value={formData.client} onChange={handleChange} required>
                                    <option value="">Seleccionar...</option>
                                    {CLIENTS.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>PEP (Proyecto)</label>
                                <select name="pep" value={formData.pep} onChange={handleChange} required>
                                    <option value="">Seleccionar...</option>
                                    {PEPS.map(p => <option key={p.id} value={p.id}>{p.id} - {p.name}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Technical & Classification */}
                    <div className="form-section">
                        <h3><Cpu size={18} /> Clasificación Técnica</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Arquitectura</label>
                                <select name="architecture" value={formData.architecture} onChange={handleChange} required>
                                    <option value="">Seleccionar...</option>
                                    {ARCHITECTURES.map(a => <option key={a} value={a}>{a}</option>)}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Elemento de Configuración (CI)</label>
                                <select name="ciId" value={formData.ciId || ''} onChange={handleChange}>
                                    <option value="">Seleccionar CI (Opcional)...</option>
                                    {cis.map(ci => <option key={ci.id} value={ci.name}>{ci.name} ({ci.type})</option>)}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Asignado a (Grupo)</label>
                                <select name="assignedTeam" value={formData.assignedTeam} onChange={handleChange}>
                                    <option value="">Sin asignar</option>
                                    {TEAMS.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>

                            {!isNew && (
                                <div className="form-group">
                                    <label>Estado</label>
                                    <select name="status" value={formData.status} onChange={handleChange}>
                                        {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Section 3: Priority Calculation */}
                    <div className="form-section">
                        <h3><Clock size={18} /> Prioridad & SLA</h3>
                        <div className="priority-calculator">
                            <div className="form-group">
                                <label>Impacto</label>
                                <select name="impact" value={formData.impact} onChange={handleChange} disabled={!isNew}>
                                    <option value="Low">Bajo</option>
                                    <option value="Medium">Medio</option>
                                    <option value="High">Alto</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Urgencia</label>
                                <select name="urgency" value={formData.urgency} onChange={handleChange} disabled={!isNew}>
                                    <option value="Low">Bajo</option>
                                    <option value="Medium">Medio</option>
                                    <option value="High">Alto</option>
                                </select>
                            </div>
                            <div className="calculated-priority">
                                <label>Prioridad Calculada</label>
                                <div className={`priority-badge ${formData.priority}`}>
                                    {formData.priority}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 4: Details */}
                    <div className="form-section full-width">
                        <div className="form-group">
                            <label>Descripción Detallada</label>
                            <textarea
                                name="description"
                                rows="4"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Describa el incidente con detalle..."
                            ></textarea>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn-secondary" onClick={() => navigate('/incidents')}>Cancelar</button>
                        <button type="submit" className="btn-primary">
                            <Save size={18} />
                            {isNew ? 'Crear Incidente' : 'Guardar Cambios'}
                        </button>
                    </div>

                </form>
            </div>

            <style>{`
        .incident-form-page {
          max-width: 900px;
          margin: 0 auto;
        }

        .form-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: var(--spacing-lg);
        }

        .back-btn {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 1rem;
        }
        .back-btn:hover { color: #fff; }

        .form-section {
          margin-bottom: var(--spacing-lg);
          padding-bottom: var(--spacing-md);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        .form-section:last-child { border-bottom: none; }

        .form-section h3 {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--color-primary);
          margin-bottom: var(--spacing-md);
          font-size: 1.1rem;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-md);
        }

        .full-width {
          grid-column: 1 / -1;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        label {
          color: var(--text-muted);
          font-size: 0.9rem;
        }

        input, select, textarea {
          background: var(--bg-dark);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          padding: 10px;
          color: #fff;
          font-family: inherit;
          outline: none;
        }

        input:focus, select:focus, textarea:focus {
          border-color: var(--color-primary);
          box-shadow: 0 0 5px rgba(57, 255, 20, 0.2);
        }

        .priority-calculator {
          display: flex;
          gap: var(--spacing-md);
          align-items: flex-end;
          background: rgba(255, 255, 255, 0.02);
          padding: 16px;
          border-radius: var(--radius-md);
        }

        .priority-badge {
          padding: 8px 16px;
          border-radius: 4px;
          font-weight: bold;
          text-align: center;
          min-width: 60px;
        }
        .priority-badge.P1 { background: #ff4757; color: #fff; box-shadow: 0 0 10px #ff4757; }
        .priority-badge.P2 { background: #ffa502; color: #000; }
        .priority-badge.P3 { background: #2ed573; color: #000; }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 16px;
          margin-top: var(--spacing-lg);
        }

        .btn-secondary {
          background: transparent;
          border: 1px solid var(--border-color);
          color: var(--text-muted);
          padding: 10px 20px;
          border-radius: var(--radius-md);
          cursor: pointer;
        }
        .btn-secondary:hover {
          border-color: #fff;
          color: #fff;
        }
        
        .btn-primary {
            display: flex;
            align-items: center;
            gap: 8px;
        }

      `}</style>
        </div>
    );
};

export default IncidentForm;
