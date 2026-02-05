import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Bot, ArrowRight, CheckCircle, AlertTriangle, HelpCircle, Paperclip } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useIncidentStore from '../../store/useIncidentStore';

const P7M6_STEPS = {
    1: {
        title: "Reporte del Problema",
        help: `Recopilar información inicial que describa claramente el contexto.\nResponder:\n- ¿Existe afectación de servicio?\n- ¿Síntomas?\n- ¿Parte de la red afectada?\n- ¿Dispositivos afectados?\n- ¿Failover activo?\n- ¿Se perdió acceso?\n- ¿Falla inesperada o cambio programado?`
    },
    2: {
        title: "Recopilación de Información",
        help: `Recopilar evidencia técnica:\n- Logs (0-3)\n- Diagramas\n- Configs & Backups\n- Gráficas de monitoreo\n- Topología IP`
    },
    3: {
        title: "Examinar la Información",
        help: `Analizar indicios de causa raíz.\n- ¿Qué debería estar pasando vs Qué está pasando?\n- Comparar con línea base normal.`
    },
    4: {
        title: "Excluir Causas Potenciales",
        help: `Descartar causas no soportadas por evidencia.\n- No improvisar.\n- No suponer sin datos.`
    },
    5: {
        title: "Hipótesis de la Causa",
        help: `Formular hipótesis sustentada.\n- Evaluar factibilidad.\n- Evaluar probabilidad.`
    },
    6: {
        title: "Verificación de Hipótesis",
        help: `Validar la solución.\n- Acción inmediata o programada.\n- Plan de Rollback obligatorio.\n- Documentar cambios.`
    },
    7: {
        title: "Resolución y Cierre",
        help: `Documentar solución final.\n- Pasos ejecutados.\n- Comunicación a partes interesadas.\n- Lecciones aprendidas.`
    }
};

const P7M6Wizard = ({ incident }) => {
    const navigate = useNavigate();
    const { validateStep, submitStep, validationResult, loading, closeIncident } = useIncidentStore();
    const [content, setContent] = useState('');
    const [fileName, setFileName] = useState('');
    const [stepState, setStepState] = useState('idle'); // idle, validating, reviewed, ready_next

    // Load existing data for step if available
    useEffect(() => {
        // Reset state on step change
        setStepState('idle');
        setFileName('');

        if (incident.step_data) {
            try {
                const data = JSON.parse(incident.step_data);
                if (data[incident.current_step]) {
                    setContent(data[incident.current_step]);
                } else {
                    setContent('');
                }
            } catch (e) { setContent(''); }
        }
    }, [incident.current_step, incident.step_data]);

    const stepInfo = P7M6_STEPS[incident.current_step] || P7M6_STEPS[1];
    const isLastStep = incident.current_step === 7;

    const handleValidate = async () => {
        if (!content.trim()) return;
        setStepState('validating');
        await validateStep(incident.id, incident.current_step, content);
        setStepState('reviewed');
    };

    const handleDecision = async (accepted) => {
        // Both choices allow moving forward. 
        // We trigger submission immediately.
        await handleSubmit();
    };

    const handleSubmit = async () => {
        // Combine text + file info if step 2
        let finalContent = content;
        if (incident.current_step === 2 && fileName) {
            finalContent += `\n[Archivo Adjunto: ${fileName}]`;
        }

        if (isLastStep) {
            await closeIncident(incident.id);
            navigate('/incidents'); // Redirect to list after closing
        } else {
            await submitStep(incident.id, incident.current_step, finalContent);
            // State resets via useEffect when current_step changes in props
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            setFileName(e.target.files[0].name);
        }
    };

    return (
        <div className="p7m6-wizard glass-panel">
            <div className="wizard-header">
                <div className="header-left">
                    <div className="step-indicator">
                        <span className="step-number">{incident.current_step}</span>
                        <span className="step-total">/ 7</span>
                    </div>
                    <h2>{stepInfo.title}</h2>
                </div>

                {/* Ghost Help Icon */}
                <div className="help-container">
                    <HelpCircle className="help-icon" size={20} />
                    <div className="help-tooltip">
                        {stepInfo.help}
                    </div>
                </div>
            </div>

            {/* Input Area */}
            <div className="step-input">
                <label>Evidencia y Análisis</label>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Ingrese su análisis y evidencia aquí..."
                    rows={8}
                    className="p7m6-textarea"
                />

                {/* Step 2: File Attachment Option */}
                {incident.current_step === 2 && (
                    <div className="file-attachment mt-4">
                        <label className="file-label">
                            <Paperclip size={16} />
                            {fileName ? fileName : 'Adjuntar Documentación (Logs, Diagramas)'}
                            <input type="file" onChange={handleFileChange} style={{ display: 'none' }} />
                        </label>
                    </div>
                )}
            </div>

            {/* AI Feedback Section */}
            {(stepState === 'reviewed' || stepState === 'ready_next') && validationResult && (
                <div className={`ai-feedback ${validationResult.approved ? 'approved' : 'warning'} ai-3d-card`}>
                    <div className="ai-header">
                        <Bot size={20} /> <span>Diagnóstico IA</span>
                        <span className={`ai-score ${validationResult.score >= 7 ? 'high' : 'low'}`}>
                            {validationResult.score}/10
                        </span>
                    </div>
                    <div className="ai-body">
                        {validationResult.feedback}
                    </div>

                    {stepState === 'reviewed' && (
                        <div className="decision-actions">
                            <button className="btn-decision accept" onClick={() => handleDecision(true)}>
                                <CheckCircle size={16} /> Aceptar y Continuar
                            </button>
                            <button className="btn-decision keep" onClick={() => handleDecision(false)}>
                                Mantener y Continuar
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Wizard Actions */}
            <div className="wizard-actions">
                {/* AI Button - Always visible */}
                <button
                    className={`btn-ghost ai-trigger ${stepState === 'validating' ? 'pulsing' : ''}`}
                    onClick={handleValidate}
                    disabled={loading || !content || stepState === 'validating'}
                >
                    <Bot size={16} style={{ marginRight: 8 }} />
                    {loading ? 'Analizando...' : 'Validar con IA'}
                </button>

                {/* Continue Button - Only visible if previous data exists (skipping validation) */}
                {(stepState === 'idle' && incident.step_data && JSON.parse(incident.step_data)[incident.current_step]) && (
                    <button
                        className="btn-primary"
                        onClick={handleSubmit}
                    >
                        {isLastStep ? 'Cerrar Incidente' : 'Continuar al Siguiente Paso'}
                        <ArrowRight size={16} style={{ marginLeft: 8 }} />
                    </button>
                )}
            </div>

            <style>{`
                .p7m6-wizard {
                    padding: 24px;
                    border: 1px solid rgba(5, 196, 107, 0.1);
                    box-shadow: 0 0 20px rgba(0,0,0,0.3);
                    position: relative;
                }
                .wizard-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                    padding-bottom: 15px;
                }
                .header-left { display: flex; align-items: center; gap: 16px; }
                
                .step-indicator {
                    background: var(--color-primary);
                    color: #fff;
                    width: 42px;
                    height: 42px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    font-family: 'JetBrains Mono', monospace;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.2);
                }
                .step-number { font-size: 1.2rem; }
                .step-total { font-size: 0.75rem; opacity: 0.8; margin-left: 2px; }

                /* Ghost Help */
                .help-container {
                    position: relative;
                    cursor: help;
                }
                .help-icon {
                    color: rgba(255,255,255,0.2);
                    transition: color 0.3s;
                }
                .help-container:hover .help-icon {
                    color: rgba(255,255,255,0.8);
                }
                .help-tooltip {
                    position: absolute;
                    top: 100%;
                    right: 0;
                    width: 320px;
                    background: rgba(10, 10, 10, 0.95);
                    backdrop-filter: blur(15px);
                    border: 1px solid rgba(255,255,255,0.1);
                    color: #ccc;
                    padding: 16px;
                    border-radius: 12px;
                    font-size: 0.85rem;
                    line-height: 1.6;
                    white-space: pre-line;
                    opacity: 0;
                    visibility: hidden;
                    transform: translateY(10px);
                    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                    z-index: 50;
                    pointer-events: none;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                }
                .help-container:hover .help-tooltip {
                    opacity: 1;
                    visibility: visible;
                    transform: translateY(0);
                }

                .p7m6-textarea {
                    width: 100%;
                    background: rgba(0,0,0,0.2);
                    border: 1px solid var(--border-color);
                    color: #e0e0e0;
                    padding: 16px;
                    border-radius: 8px;
                    font-family: inherit;
                    resize: vertical;
                    min-height: 150px;
                    transition: all 0.3s;
                }
                .p7m6-textarea:focus { 
                    border-color: var(--color-primary-dim); 
                    background: rgba(0,0,0,0.3);
                    box-shadow: 0 0 0 1px var(--color-primary-dim);
                    outline: none; 
                }
                
                .file-label {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 16px;
                    background: rgba(255,255,255,0.03);
                    border: 1px dashed rgba(255,255,255,0.2);
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 0.85rem;
                    color: var(--text-muted);
                    transition: all 0.2s;
                }
                .file-label:hover {
                    background: rgba(255,255,255,0.08);
                    color: #e0e0e0;
                    border-color: #666;
                }

                /* AI 3D Card Style */
                .ai-3d-card {
                    margin-top: 24px;
                    padding: 24px;
                    border-radius: 16px;
                    background: linear-gradient(145deg, rgba(20,20,20,0.6), rgba(10,10,10,0.8));
                    border: 1px solid rgba(255,255,255,0.05);
                    box-shadow: 
                        0 10px 20px rgba(0,0,0,0.3),
                        inset 0 1px 0 rgba(255,255,255,0.05);
                    position: relative;
                    overflow: hidden;
                    animation: slideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                
                .ai-3d-card::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; width: 100%; height: 4px;
                    background: linear-gradient(90deg, var(--color-primary), transparent);
                }

                @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

                .ai-header {
                    display: flex;
                    gap: 12px;
                    align-items: center;
                    font-weight: 700;
                    margin-bottom: 16px;
                    color: var(--color-primary);
                    font-size: 1rem;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                .ai-score { 
                    margin-left: auto; 
                    padding: 4px 12px; 
                    border-radius: 20px; 
                    font-family: 'JetBrains Mono', monospace; 
                    font-weight: 800;
                    font-size: 1rem;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.2);
                }
                .ai-score.high { background: var(--color-primary); color: #fff; }
                .ai-score.low { background: #ff4757; color: #fff; }

                .ai-body {
                    color: #ccc;
                    line-height: 1.6;
                    font-size: 0.95rem;
                }

                .decision-actions {
                    display: flex;
                    gap: 16px;
                    margin-top: 24px;
                    padding-top: 20px;
                    border-top: 1px solid rgba(255,255,255,0.05);
                }
                .btn-decision {
                    flex: 1;
                    padding: 12px;
                    border-radius: 10px;
                    border: 1px solid transparent;
                    cursor: pointer;
                    font-size: 0.9rem;
                    font-weight: 600;
                    transition: all 0.2s;
                }
                .btn-decision.accept { 
                    background: rgba(5, 196, 107, 0.15); 
                    color: #05c46b; 
                    border-color: rgba(5, 196, 107, 0.3); 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    gap: 10px; 
                }
                .btn-decision.accept:hover { 
                    background: rgba(5, 196, 107, 0.25); 
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(5, 196, 107, 0.15);
                }
                .btn-decision.keep { 
                    background: rgba(255,255,255,0.05); 
                    border-color: rgba(255,255,255,0.1); 
                    color: #aaa; 
                }
                .btn-decision.keep:hover { 
                    border-color: #fff; 
                    color: #fff; 
                    background: rgba(255,255,255,0.1);
                }

                .wizard-actions {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 32px;
                    padding-top: 20px;
                    border-top: 1px solid rgba(255,255,255,0.05);
                    align-items: center;
                }
                .ai-trigger { 
                    border: 1px solid rgba(5, 196, 107, 0.3); 
                    color: var(--color-primary);
                    background: transparent;
                }
                .ai-trigger:hover {
                    background: rgba(5, 196, 107, 0.05);
                }
                .pulsing { animation: pulse 1.5s infinite; }
            `}</style>
        </div>
    );
};

export default P7M6Wizard;
