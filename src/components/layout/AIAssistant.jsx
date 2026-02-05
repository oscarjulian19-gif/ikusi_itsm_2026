import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Sparkles, X, MessageSquare, Zap, Lightbulb, BarChart2, BookOpen, ToggleRight, Bot } from 'lucide-react';
import useCaseStore from '../../store/useCaseStore';
import { aiApi } from '../../services/apiClient';

const AIAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { type: 'ai', text: 'Hola, soy tu Asistente de Operaciones. Estoy conectado en tiempo real. ¿En qué puedo ayudarte hoy?' }
    ]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [inputText, setInputText] = useState('');

    // Default to Real AI
    const [useRealAI, setUseRealAI] = useState(true);

    const location = useLocation();
    const { cases } = useCaseStore();

    const [animation, setAnimation] = useState('');

    useEffect(() => {
        const triggerRandomAnimation = () => {
            const animations = ['anim-wink', 'anim-laugh', 'anim-move'];
            const randomAnim = animations[Math.floor(Math.random() * animations.length)];
            setAnimation(randomAnim);

            // Clear animation after it finishes
            setTimeout(() => setAnimation(''), 2000);
        };

        const interval = setInterval(() => {
            // Random chance to animate every 5s
            if (Math.random() > 0.6) triggerRandomAnimation();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    // ... Actions ... (keep existing)
    const handleSend = async (e) => {
        if (e) e.preventDefault();
        if (!inputText.trim()) return;

        const text = inputText;
        setInputText('');
        addMessage('user', text);
        setIsAnalyzing(true);

        try {
            if (useRealAI) {
                const response = await aiApi.chat(text);
                addMessage('ai', response.reply.replace(/\n/g, '<br/>'));
            } else {
                setTimeout(() => {
                    addMessage('ai', `Modo Simulado: Recibí "${text}". Configura la API Key para respuestas reales.`);
                }, 1000);
            }
        } catch (error) {
            addMessage('ai', 'Lo siento, tuve un problema procesando tu solicitud.');
            console.error(error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleAnalyzeContext = async () => {
        setIsAnalyzing(true);
        const activeId = location.pathname.split('/')[2];
        if (activeId && useRealAI) {
            const currentCase = cases.find(c => c.id === activeId);
            if (currentCase) {
                try {
                    const result = await aiApi.analyzeTicket({
                        id: currentCase.id,
                        title: currentCase.title,
                        description: currentCase.description,
                        priority: currentCase.priority,
                        status: currentCase.status
                    });
                    addMessage('ai', result.analysis.replace(/\n/g, '<br/>'));
                } catch (err) {
                    addMessage('ai', 'Error conectando con el cerebro de IA.');
                }
            }
        } else {
            setTimeout(() => {
                addMessage('ai', 'Analizando el contexto actual de la página... Todo parece nominal.');
            }, 1000);
        }
        setIsAnalyzing(false);
    };

    const addMessage = (type, text) => {
        setMessages(prev => [...prev, { type, text }]);
    };

    return (
        <>
            {/* Toggle Button */}
            {!isOpen && (
                <button className="ai-fab" onClick={() => setIsOpen(true)}>
                    <div className={`anim-wrapper ${animation}`}>
                        <Bot size={24} color="#fff" />
                    </div>
                    <span className="fab-label">AI Ops</span>
                </button>
            )}

            {/* Panel */}
            <div className={`ai-panel ${isOpen ? 'open' : ''}`}>
                <div className="ai-header">
                    <div className="ai-branding">
                        <div className={`anim-wrapper ${animation}`}>
                            <Bot size={24} color="#008F39" />
                        </div>
                        <span>IKUSI <strong>OPS AI</strong></span>
                    </div>
                    <button className="close-btn" onClick={() => setIsOpen(false)}>
                        <X size={20} />
                    </button>
                </div>

                <div className="ai-chat-area">
                    {messages.map((msg, i) => (
                        <div key={i} className={`message ${msg.type}`}>
                            <div className="msg-avatar">
                                {msg.type === 'ai'
                                    ? <Bot size={16} color="#fff" fill="#008F39" />
                                    : <div className="user-dot"></div>}
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

                <div className="ai-input-area">
                    <form onSubmit={handleSend}>
                        <input
                            type="text"
                            placeholder="Escribe tu consulta..."
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                        />
                        <button type="submit" disabled={isAnalyzing || !inputText.trim()}>
                            <Zap size={16} />
                        </button>
                    </form>
                    <button className="context-action-link" onClick={handleAnalyzeContext}>
                        <Lightbulb size={12} /> Analizar esta página
                    </button>
                </div>
            </div>

            <style>{`
                .ai-fab {
                    position: fixed;
                    bottom: 30px;
                    right: 30px;
                    background: #008F39;
                    border: none;
                    border-radius: 30px;
                    height: 50px;
                    padding: 0 20px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    color: #fff;
                    font-weight: bold;
                    cursor: pointer;
                    box-shadow: 0 0 20px rgba(0, 143, 57, 0.6);
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
                    background: rgba(15, 23, 42, 0.95);
                    backdrop-filter: blur(15px);
                    border-left: 1px solid #008F39;
                    z-index: 1001;
                    transition: right 0.4s cubic-bezier(0.19, 1, 0.22, 1);
                    display: flex;
                    flex-direction: column;
                    box-shadow: -20px 0 50px rgba(0,0,0,0.5);
                }
                .ai-panel.open { right: 0; }

                .ai-header {
                    padding: 20px;
                    border-bottom: 1px solid rgba(0, 143, 57, 0.2);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: linear-gradient(to right, rgba(0, 143, 57,0.05), transparent);
                }
                .ai-branding {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    color: #fff;
                    font-size: 1.1rem;
                    font-family: 'Orbitron', sans-serif;
                }
                .close-btn {
                    background: none;
                    border: none;
                    color: #94a3b8;
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
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    background: rgba(0,0,0,0.5);
                    border: 1px solid #333;
                }
                .message.ai .msg-avatar { border-color: #008F39; }
                .message.user { flex-direction: row-reverse; }
                
                .msg-content {
                    background: rgba(255,255,255,0.05);
                    padding: 12px;
                    border-radius: 0 12px 12px 12px;
                    color: #e2e8f0;
                    max-width: 85%;
                    border: 1px solid rgba(255,255,255,0.1);
                }
                
                .message.ai .msg-content { border-left: 2px solid #008F39; }
                .message.user .msg-content { background: #008F39; color: #fff; border-radius: 12px 0 12px 12px; border: none; font-weight: 500; }

                .ai-input-area {
                    padding: 20px;
                    background: rgba(0,0,0,0.2);
                    border-top: 1px solid rgba(255,255,255,0.1);
                }
                .ai-input-area form {
                    display: flex;
                    gap: 10px;
                    margin-bottom: 10px;
                }
                .ai-input-area input {
                    flex: 1;
                    background: rgba(255,255,255,0.1);
                    border: 1px solid rgba(255,255,255,0.2);
                    color: #fff;
                    padding: 10px 14px;
                    border-radius: 8px;
                    outline: none;
                }
                .ai-input-area input:focus {
                    border-color: #008F39;
                    background: rgba(0,0,0,0.3);
                }
                .ai-input-area button[type="submit"] {
                    background: #008F39;
                    color: #fff;
                    border: none;
                    border-radius: 8px;
                    width: 40px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .ai-input-area button:disabled { opacity: 0.5; cursor: not-allowed; }

                .context-action-link {
                    background: none;
                    border: 1px dashed #475569;
                    color: #94a3b8;
                    width: 100%;
                    padding: 8px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 0.75rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                }
                .context-action-link:hover { border-color: #008F39; color: #008F39; }

                .typing-indicator span {
                    display: inline-block;
                    width: 6px;
                    height: 6px;
                    background: #008F39;
                    border-radius: 50%;
                    margin: 0 2px;
                    animation: pulse 1s infinite;
                }
                .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
                .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
                @keyframes pulse { 0%, 100% { opacity: 0.3; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.2); } }

                /* Animations */
                .anim-wrapper { display: inline-block; transition: all 0.2s; }
                
                .anim-wink {
                    animation: wink 0.3s ease-in-out;
                }
                @keyframes wink {
                    0% { transform: scaleY(1); }
                    50% { transform: scaleY(0.1); }
                    100% { transform: scaleY(1); }
                }

                .anim-laugh {
                    animation: laugh 0.5s ease-in-out;
                }
                @keyframes laugh {
                    0% { transform: translateY(0); }
                    25% { transform: translateY(-3px) rotate(-5deg); }
                    50% { transform: translateY(3px) rotate(5deg); }
                    75% { transform: translateY(-3px) rotate(-5deg); }
                    100% { transform: translateY(0); }
                }

                .anim-move {
                    animation: float 2s ease-in-out;
                }
                @keyframes float {
                    0% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                    100% { transform: translateY(0); }
                }
            `}</style>
        </>
    );
};

export default AIAssistant;
