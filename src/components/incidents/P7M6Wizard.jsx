import React, { useState, useEffect } from 'react';
import { Bot, ArrowRight, CheckCircle, HelpCircle, Paperclip } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useIncidentStore from '../../store/useIncidentStore';
import { motion, AnimatePresence } from 'framer-motion';

const P7M6_STEPS = {
    1: {
        title: "Atención del Caso (Afectación)",
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
        title: "Resolución y Cierre (Lecciones)",
        help: `Documentar solución final.\n- Pasos ejecutados.\n- Comunicación a partes interesadas.\n- Lecciones aprendidas.`
    }
};

const P7M6Wizard = ({ incident }) => {
    const navigate = useNavigate();
    const { validateStep, submitStep, validationResult, loading } = useIncidentStore();
    const [content, setContent] = useState('');
    const [fileName, setFileName] = useState('');
    const [stepState, setStepState] = useState('idle'); // idle, validating, reviewed, ready_next

    useEffect(() => {
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

    const handleDecision = async () => {
        await handleSubmit();
    };

    const handleSubmit = async () => {
        let finalContent = content;
        if (incident.current_step === 2 && fileName) {
            finalContent += `\n[Archivo Adjunto: ${fileName}]`;
        }

        await submitStep(incident.id, incident.current_step, finalContent);
    };

    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            setFileName(e.target.files[0].name);
        }
    };

    return (
        <div className="p7m6-wizard-lite">
            <header className="wiz-header">
                <div className="step-badge">{incident.current_step}</div>
                <div>
                    <h2>{stepInfo.title}</h2>
                    <p className="step-context">Fase: {incident.current_step === 1 ? 'Atención Técncia' : 'Resolución Experta'}</p>
                </div>
                <div className="help-bubble">
                    <HelpCircle size={18} />
                    <div className="tooltip">{stepInfo.help}</div>
                </div>
            </header>

            <div className="input-zone">
                <label>Documentación Obligatoria</label>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Escriba los detalles técnicos del paso..."
                    rows={10}
                />

                {incident.current_step === 2 && (
                    <div className="file-box">
                        <label className="file-input-wrapper">
                            <Paperclip size={14} />
                            {fileName || "Adjuntar Evidencia Técnica (Zip/Logs/Img)"}
                            <input type="file" onChange={handleFileChange} />
                        </label>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {validationResult && stepState === 'reviewed' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="ai-report">
                        <div className="report-top">
                            <Bot size={18} />
                            <span>Validación de Calidad Técnica</span>
                            <div className={`score ${validationResult.score >= 7 ? 'good' : 'bad'}`}>{validationResult.score}/10</div>
                        </div>
                        <p>{validationResult.feedback}</p>
                        <div className="report-actions">
                            <button className="btn-go" onClick={handleDecision}>
                                <CheckCircle size={14} /> {isLastStep ? 'Finalizar y Pedir Confirmación' : 'Avanzar al Siguiente Paso'}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="wiz-footer">
                <button
                    className={`btn-validate ${loading ? 'loading' : ''}`}
                    onClick={handleValidate}
                    disabled={loading || !content.trim()}
                >
                    <Bot size={16} /> {loading ? 'Validando...' : 'Validar con IA (P7M6)'}
                </button>

                {/* Optional Jump Button if data already exists */}
                {incident.step_data && JSON.parse(incident.step_data)[incident.current_step] && stepState === 'idle' && (
                    <button className="btn-jump" onClick={handleSubmit}>Continuar <ArrowRight size={14} /></button>
                )}
            </div>

            <style>{`
                .p7m6-wizard-lite { background: #fff; border-radius: 20px; border: 1px solid #f1f5f9; padding: 32px; }
                .wiz-header { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; position: relative; }
                .step-badge { background: #008F39; color: #fff; width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 1.25rem; }
                .wiz-header h2 { font-size: 1.1rem; font-weight: 800; color: #1e293b; margin: 0; }
                .step-context { font-size: 0.75rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; margin-top: 2px; }
                
                .help-bubble { margin-left: auto; color: #cbd5e1; cursor: help; }
                .help-bubble:hover { color: #008F39; }
                .tooltip { position: absolute; right: 0; top: 100%; width: 280px; background: #0f172a; color: #f1f5f9; padding: 16px; border-radius: 12px; font-size: 0.8rem; line-height: 1.5; z-index: 100; opacity: 0; visibility: hidden; transition: 0.2s; white-space: pre-line; }
                .help-bubble:hover .tooltip { opacity: 1; visibility: visible; transform: translateY(8px); }

                .input-zone label { display: block; font-size: 0.7rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; margin-bottom: 8px; }
                .input-zone textarea { width: 100%; background: #f8fafc; border: 1.5px solid #f1f5f9; border-radius: 12px; padding: 16px; font-size: 0.95rem; font-weight: 500; color: #1e293b; transition: all 0.2s; resize: none; overflow-y: auto; }
                .input-zone textarea:focus { background: #fff; border-color: #008F39; outline: none; }
                
                .file-box { margin-top: 12px; }
                .file-input-wrapper { display: inline-flex; align-items: center; gap: 8px; font-size: 0.8rem; font-weight: 700; color: #64748b; background: #f1f5f9; padding: 8px 16px; border-radius: 8px; cursor: pointer; border: 1px dashed #cbd5e1; }
                .file-input-wrapper input { display: none; }

                .ai-report { background: #f8fafc; border: 1.5px solid #008F39; border-radius: 16px; padding: 20px; margin-top: 24px; }
                .report-top { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; color: #008F39; font-weight: 800; font-size: 0.85rem; }
                .score { margin-left: auto; font-family: monospace; padding: 2px 8px; border-radius: 6px; }
                .score.good { background: #dcfce7; color: #15803d; }
                .score.bad { background: #fee2e2; color: #dc2626; }
                .ai-report p { font-size: 0.9rem; color: #475569; line-height: 1.6; margin-bottom: 16px; }
                .btn-go { background: #008F39; color: #fff; border: none; padding: 10px 16px; border-radius: 8px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 8px; font-size: 0.85rem; }

                .wiz-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 24px; padding-top: 16px; border-top: 1px solid #f1f5f9; }
                .btn-validate { background: #fff; border: 1.5px solid #008F39; color: #008F39; padding: 10px 20px; border-radius: 10px; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 8px; font-size: 0.9rem; }
                .btn-validate:disabled { opacity: 0.5; cursor: not-allowed; }
                .btn-jump { background: #f1f5f9; border: none; padding: 10px 20px; border-radius: 10px; font-weight: 700; color: #64748b; cursor: pointer; display: flex; align-items: center; gap: 8px; }
            `}</style>
        </div>
    );
};

export default P7M6Wizard;
