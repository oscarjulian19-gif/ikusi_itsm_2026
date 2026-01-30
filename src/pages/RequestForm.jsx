import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, ShoppingBag, FileText, CheckCircle } from 'lucide-react';
import useCaseStore from '../store/useCaseStore';
import { SERVICE_CATALOG } from '../data/catalogData';
import { CLIENTS, PEPS, STATUS_FLOW } from '../data/initialData';

const RequestForm = () => {
    const { serviceId } = useParams();
    const navigate = useNavigate();
    const { addCase } = useCaseStore();

    // Find the service definition
    const serviceDef = SERVICE_CATALOG.find(s => s.id === serviceId);

    const [headerData, setHeaderData] = useState({
        client: '',
        pep: ''
    });

    const [categoryFields, setCategoryFields] = useState({});

    useEffect(() => {
        if (!serviceDef) {
            navigate('/requests'); // Invalid service ID
        } else {
            // Initialize dynamic fields
            const initialFields = {};
            serviceDef.formFields.forEach(field => {
                initialFields[field] = '';
            });
            setCategoryFields(initialFields);
        }
    }, [serviceDef, navigate]);

    const handleHeaderChange = (e) => {
        const { name, value } = e.target;
        setHeaderData(prev => ({ ...prev, [name]: value }));
    };

    const handleFieldChange = (field, value) => {
        setCategoryFields(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Construct description from dynamic fields
        let description = `Solicitud de: ${serviceDef.name}\n\n`;
        Object.entries(categoryFields).forEach(([key, value]) => {
            description += `${key}: ${value}\n`;
        });

        const newRequest = {
            id: `REQ-${Math.floor(Math.random() * 20000) + 20000}`,
            type: 'request',
            title: serviceDef.name,
            client: headerData.client,
            pep: headerData.pep,
            architecture: 'N/A', // Requests might not map 1:1 to architecture
            priority: 'P3', // Default for requests, usually SLA driven
            status: 'Solicitud',
            assignedTeam: 'Mesa de Ayuda L1', // Default routing
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            description: description,
            serviceId: serviceDef.id
        };

        addCase(newRequest);
        navigate('/incidents'); // Redirect to main list (which includes requests)
    };

    if (!serviceDef) return null;

    return (
        <div className="request-form-page">
            <header className="form-header">
                <button className="back-btn" onClick={() => navigate('/requests')}>
                    <ArrowLeft size={20} />
                    Catálogo
                </button>
                <h1>{serviceDef.name}</h1>
            </header>

            <div className="form-container">
                <form onSubmit={handleSubmit} className="glass-panel">

                    <div className="service-summary">
                        <h3><ShoppingBag size={18} /> Detalles del Servicio</h3>
                        <p>{serviceDef.description}</p>
                        <span className="sla-tag">Tiempo de Entrega Estimado: {serviceDef.sla} horas</span>
                    </div>

                    <div className="form-section">
                        <h3><FileText size={18} /> Datos del Solicitante</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Cliente / Empresa</label>
                                <select name="client" value={headerData.client} onChange={handleHeaderChange} required>
                                    <option value="">Seleccionar...</option>
                                    {CLIENTS.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>PEP (Proyecto)</label>
                                <select name="pep" value={headerData.pep} onChange={handleHeaderChange} required>
                                    <option value="">Seleccionar...</option>
                                    {PEPS.map(p => <option key={p.id} value={p.id}>{p.id} - {p.name}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3><CheckCircle size={18} /> Información Específica</h3>
                        <div className="form-stack">
                            {serviceDef.formFields.map(field => (
                                <div className="form-group" key={field}>
                                    <label>{field}</label>
                                    <input
                                        type="text"
                                        value={categoryFields[field] || ''}
                                        onChange={(e) => handleFieldChange(field, e.target.value)}
                                        required
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn-secondary" onClick={() => navigate('/requests')}>Cancelar</button>
                        <button type="submit" className="btn-primary">
                            <Save size={18} />
                            Enviar Solicitud
                        </button>
                    </div>

                </form>
            </div>

            <style>{`
                .request-form-page {
                    max-width: 800px;
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

                .service-summary {
                    background: rgba(57, 255, 20, 0.05);
                    border: 1px solid var(--color-primary-dim);
                    border-radius: var(--radius-md);
                    padding: 16px;
                    margin-bottom: var(--spacing-lg);
                }
                .service-summary h3 {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: var(--color-primary);
                    margin-bottom: 8px;
                    font-size: 1.1rem;
                }
                .service-summary p { margin-bottom: 12px; color: #eee; }
                .sla-tag {
                    font-size: 0.85rem;
                    font-weight: bold;
                    color: var(--text-muted);
                }

                .form-section {
                    margin-bottom: var(--spacing-lg);
                    padding-bottom: var(--spacing-md);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                }
                .form-section h3 {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: #fff;
                    margin-bottom: var(--spacing-md);
                    font-size: 1.1rem;
                }

                .form-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: var(--spacing-md);
                }
                .form-stack {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-md);
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                label { color: var(--text-muted); font-size: 0.9rem; }
                
                input, select {
                    background: var(--bg-dark);
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-sm);
                    padding: 10px;
                    color: #fff;
                    font-family: inherit;
                    outline: none;
                }
                input:focus, select:focus {
                    border-color: var(--color-primary);
                    box-shadow: 0 0 5px rgba(57, 255, 20, 0.2);
                }

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
                .btn-secondary:hover { border-color: #fff; color: #fff; }
                .btn-primary { display: flex; align-items: center; gap: 8px; }
            `}</style>
        </div>
    );
};

export default RequestForm;
