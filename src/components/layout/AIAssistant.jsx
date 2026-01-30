import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Sparkles, X, MessageSquare, Zap, Lightbulb, BarChart2, BookOpen, ToggleRight } from 'lucide-react';
import useCaseStore from '../../store/useCaseStore';
import { aiApi } from '../../services/apiClient';

const AIAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { type: 'ai', text: 'Hola, soy Ikusi Intelligence (Flash 2.0). Estoy listo para asistirte.' }
    ]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // Toggle between Mock (Client-side) and Real (Python/Gemini) AI
    const [useRealAI, setUseRealAI] = useState(true);

    const location = useLocation();
    const { cases } = useCaseStore();

    // --- Context Detection ---
    const getContext = () => {
        const path = location.pathname;
        if (path.includes('/reports')) return 'reports';
        if (path.includes('/itil')) return 'itil';

        const pathParts = path.split('/');
        if ((pathParts[1] === 'incidents' || pathParts[1] === 'requests') && pathParts[2] && pathParts[2] !== 'new') {
            return 'case';
        }
        return 'general';
    };

    const currentContext = getContext();

    // --- Actions ---
    const handleAnalyze = async () => {
        setIsAnalyzing(true);

        // Demo Mode: If Real AI is toggled on, try that first
        if (useRealAI && currentContext === 'case') {
            await analyzeCaseReal();
            return;
        }

        if (currentContext === 'case') analyzeCaseMock();
        else if (currentContext === 'reports') analyzeReports();
        else if (currentContext === 'itil') analyzeITIL();
        else {
            // General Fallback
            addMessage('user', 'Solicitar ayuda general');
            setTimeout(() => {
                addMessage('ai', 'Estoy aquí para ayudarte. Navega a un Módulo (Incidentes, Reportes) para darte insights específicos.');
                setIsAnalyzing(false);
            }, 800);
        }
    };

    // 1. REAL AI (Calls Python Backend)
    const analyzeCaseReal = async () => {
        const activeId = location.pathname.split('/')[2];
        const currentCase = cases.find(c => c.id === activeId);

        if (!currentCase) {
            addMessage('ai', 'Error: No puedo sincronizar este caso con el backend.');
            setIsAnalyzing(false);
            return;
        }

        addMessage('user', `Analizar caso ${activeId} (Gemini Pro)`);

        try {
            // Call the imported API Client
            const result = await aiApi.analyzeTicket({
                id: currentCase.id,
                title: currentCase.title,
                description: currentCase.description,
                priority: currentCase.priority,
                status: currentCase.status
            });

            addMessage('ai', result.analysis.replace(/\n/g, '<br/>'));
        } catch (error) {
            addMessage('ai', `⚠️ Error conectando con Backend Flash 2.0: ${error.message}. <br/>Revisa que el contenedor Docker esté corriendo en puerto 8000.`);
        } finally {
            setIsAnalyzing(false);
        }
    };

    // 2. MOCK AI (Heuristic)
    const analyzeCaseMock = () => {
        const pathParts = location.pathname.split('/');
        const caseId = pathParts[2];
        const currentCase = cases.find(c => c.id === caseId);

        addMessage('user', `Analizar caso ${caseId}`);

        if (!currentCase) {
            setTimeout(() => {
                addMessage('ai', 'No encuentro los datos de este caso en memoria.');
                setIsAnalyzing(false);
            }, 1000);
            return;
        }

        setTimeout(() => {
            const suggestions = generateCaseHeuristics(currentCase);
            addMessage('ai', `He analizado el caso ${currentCase.id}: "${currentCase.title}".`);
            streamResponses(suggestions);
        }, 800);
    };

    const generateCaseHeuristics = (c) => {
        const text = (c.title + ' ' + c.description).toLowerCase();
        const responses = [];

        if (text.includes('vpn') || text.includes('acceso') || text.includes('remoto')) {
            responses.push('🔐 **Seguridad**: Verificar estado del concentrador VPN. Validar certificados.');
        }
        if (text.includes('lento') || text.includes('lentitud') || text.includes('db') || text.includes('base de datos')) {
            responses.push('📉 **Rendimiento**: Se detectan patrones de latencia. Revisar métricas del servidor.');
        }
        if (c.priority === 'P1') {
            responses.push('🚨 **CRÍTICO P1**: Se sugiere iniciar "Sala de Guerra" (War Room) según protocolo.');
        }

        if (responses.length === 0) {
            responses.push('🔍 **Análisis General**: Recomiendo revisar logs de aplicación y escalar si no hay resolución en 1h.');
        }
        return responses;
    };

    // 2. Reports Analysis Logic
    const analyzeReports = () => {
        addMessage('user', 'Analizar métricas operativas');

        const total = cases.length;
        const p1Count = cases.filter(c => c.priority === 'P1').length;
        const openCount = cases.filter(c => c.status !== 'Cerrado' && c.status !== 'Resuelto').length;

        setTimeout(() => {
            const insights = [];
            insights.push(`📊 **Resumen Ejecutivo**: Tienes ${total} casos registrados en total.`);

            if (p1Count > 0) {
                insights.push(`⚠️ **Atención**: Hay ${p1Count} incidentes Críticos (P1) en el histórico. Esto impacta el SLA global.`);
            } else {
                insights.push(`✅ **Saludable**: No hay incidentes críticos masivos reportados.`);
            }

            if (openCount > 5) {
                insights.push(`🔥 **Sobrecarga**: Hay ${openCount} tickets abiertos. Se recomienda balancear cargas en el equipo "Mesa de Ayuda L1".`);
            }

            insights.push('💡 **Recomendación IA**: Enfocarse en cerrar tickets antiguos (Backlog) para mejorar el KPI de MTTR.');

            streamResponses(insights);
        }, 1000);
    };

    // 3. ITIL Analysis Logic
    const analyzeITIL = () => {
        addMessage('user', 'Recomendar roadmap de prácticas');

        setTimeout(() => {
            const tips = [
                '📚 **Estrategia ITIL 4**: Basado en tu operación actual, sugiero madurar estas prácticas:',
                '1️⃣ **Incident Management**: Ya tienes un flujo sólido. Considera automatizar la clasificación.',
                '2️⃣ **Change Control**: Es el siguiente paso lógico para reducir incidentes causados por cambios no controlados.',
                '3️⃣ **Problem Management**: Para reducir la recurrencia de tus incidentes P1 actuales.'
            ];
            streamResponses(tips);
        }, 1000);
    };


    // --- Utils ---
    const streamResponses = (msgs) => {
        msgs.forEach((msg, idx) => {
            setTimeout(() => {
                addMessage('ai', msg);
                if (idx === msgs.length - 1) setIsAnalyzing(false);
            }, (idx + 1) * 800);
        });
        if (msgs.length === 0) setIsAnalyzing(false);
    };

    const addMessage = (type, text) => {
        setMessages(prev => [...prev, { type, text }]);
    };

    // --- UI Helpers ---
    const getActionButtonLabel = () => {
        switch (currentContext) {
            case 'case': return useRealAI ? 'Analizar con Gemini' : 'Analizar Caso Actual';
            case 'reports': return 'Analizar Métricas';
            case 'itil': return 'Ver Recomendaciones';
            default: return 'Ayuda General';
        }
    };

    const getActionIcon = () => {
        switch (currentContext) {
            case 'reports': return <BarChart2 size={16} />;
            case 'itil': return <BookOpen size={16} />;
            default: return <Lightbulb size={16} />;
        }
    };

    return (
        <>
            {/* Toggle Button */}
            {!isOpen && (
                <button className="ai-fab" onClick={() => setIsOpen(true)}>
                    <Sparkles size={24} />
                    <span className="fab-label">IA Assist</span>
                </button>
            )}

            {/* Panel */}
            <div className={`ai-panel ${isOpen ? 'open' : ''}`}>
                <div className="ai-header">
                    <div className="ai-branding">
                        <Zap size={20} color="#39FF14" fill="#39FF14" />
                        <span>IKUSI <strong>{useRealAI ? 'PRO' : 'Flash 2.0'}</strong></span>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button
                            className="mode-toggle"
                            title={useRealAI ? "Cambiar a Simulador" : "Cambiar a PRO (Live Backend)"}
                            onClick={() => setUseRealAI(!useRealAI)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: useRealAI ? '#39FF14' : '#666' }}
                        >
                            <ToggleRight size={24} style={{ transform: useRealAI ? 'rotate(0)' : 'rotate(180deg)' }} />
                        </button>
                        <button className="close-btn" onClick={() => setIsOpen(false)}>
                            <X size={20} />
                        </button>
                    </div>
                </div>

                <div className="ai-chat-area">
                    {messages.map((msg, i) => (
                        <div key={i} className={`message ${msg.type}`}>
                            <div className="msg-avatar">
                                {msg.type === 'ai' ? <Sparkles size={14} /> : <div className="user-dot"></div>}
                            </div>
                            <div className="msg-content" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></div>
                        </div>
                    ))}
                    {isAnalyzing && (
                        <div className="message ai">
                            <div className="typing-indicator">
                                <span></span><span></span><span></span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="ai-actions">
                    <button className="ai-btn-primary" onClick={handleAnalyze} disabled={isAnalyzing}>
                        {getActionIcon()} {getActionButtonLabel()}
                    </button>
                </div>
            </div>

            <style>{`
                .ai-fab {
                    position: fixed;
                    bottom: 30px;
                    right: 30px;
                    background: linear-gradient(135deg, #39FF14, #2196F3);
                    border: none;
                    border-radius: 30px;
                    height: 50px;
                    padding: 0 20px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    color: #000;
                    font-weight: bold;
                    cursor: pointer;
                    box-shadow: 0 0 20px rgba(57, 255, 20, 0.4);
                    z-index: 1000;
                    transition: transform 0.2s;
                }
                .ai-fab:hover { transform: scale(1.05); }

                .ai-panel {
                    position: fixed;
                    right: -400px;
                    top: 0;
                    width: 380px;
                    height: 100vh;
                    background: rgba(10, 10, 10, 0.95);
                    backdrop-filter: blur(15px);
                    border-left: 1px solid var(--color-primary);
                    z-index: 1001;
                    transition: right 0.4s cubic-bezier(0.19, 1, 0.22, 1);
                    display: flex;
                    flex-direction: column;
                    box-shadow: -20px 0 50px rgba(0,0,0,0.5);
                }
                .ai-panel.open { right: 0; }

                .ai-header {
                    padding: 20px;
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: linear-gradient(to right, rgba(57,255,20,0.05), transparent);
                }
                .ai-branding {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    color: #fff;
                    font-size: 1.1rem;
                }
                .close-btn {
                    background: none;
                    border: none;
                    color: var(--text-muted);
                    cursor: pointer;
                }
                .close-btn:hover { color: #fff; }

                .ai-chat-area {
                    flex: 1;
                    overflow-y: auto;
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }
                .message {
                    display: flex;
                    gap: 12px;
                    font-size: 0.9rem;
                    line-height: 1.4;
                    animation: fadeIn 0.3s ease;
                }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

                .msg-avatar {
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }
                .message.ai .msg-avatar { background: rgba(57, 255, 20, 0.1); color: var(--color-primary); border: 1px solid var(--color-primary); }
                .message.user { flex-direction: row-reverse; }
                .message.user .msg-avatar { background: #333; }
                
                .msg-content {
                    background: rgba(255,255,255,0.05);
                    padding: 12px;
                    border-radius: 0 12px 12px 12px;
                    color: #eee;
                    max-width: 85%;
                }
                
                .message.ai .msg-content { border-left: 2px solid var(--color-primary); }
                .message.user .msg-content { background: var(--color-primary-dim); color: #000; border-radius: 12px 0 12px 12px; }

                .ai-actions {
                    padding: 20px;
                    border-top: 1px solid rgba(255,255,255,0.1);
                }

                .ai-btn-primary {
                    width: 100%;
                    background: linear-gradient(135deg, #39FF14, #2cb810);
                    color: #000;
                    border: none;
                    padding: 12px;
                    border-radius: 8px;
                    font-weight: bold;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    transition: all 0.2s;
                    box-shadow: 0 0 15px rgba(57, 255, 20, 0.2);
                }
                .ai-btn-primary:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 0 25px rgba(57, 255, 20, 0.4);
                }
                .ai-btn-primary:disabled {
                    opacity: 0.7;
                    cursor: wait;
                }

                .ai-hint {
                    text-align: center;
                    color: var(--text-muted);
                    font-size: 0.8rem;
                }

                .typing-indicator span {
                    display: inline-block;
                    width: 6px;
                    height: 6px;
                    background: var(--color-primary);
                    border-radius: 50%;
                    margin: 0 2px;
                    animation: pulse 1s infinite;
                }
                .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
                .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
                @keyframes pulse { 0%, 100% { opacity: 0.3; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.2); } }
            `}</style>
        </>
    );
};

export default AIAssistant;
