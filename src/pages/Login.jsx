import React, { useState } from 'react';
import useAuthStore from '../store/useAuthStore';
import { LogIn, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [localError, setLocalError] = useState('');
    const { login, loading } = useAuthStore();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError('');
        try {
            await login(email, password);
        } catch (err) {
            setLocalError(err.message || 'Credenciales inválidas');
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-card animate-slide-up">
                    <div className="login-header">
                        <div className="logo-section">
                            <span className="logo-ikusi">IKUSI</span>
                            <span className="logo-portal">SERVICE PORTAL</span>
                        </div>
                        <p className="login-subtitle">Centro de Operaciones Digitales</p>
                    </div>

                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group">
                            <label><Mail size={14} /> Correo Electrónico</label>
                            <input
                                type="email"
                                placeholder="oscar.gomez@ikusi.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label><Lock size={14} /> Contraseña</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {localError && (
                            <div className="login-error animate-fade-in">
                                <AlertCircle size={16} />
                                <span>{localError}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn-login-relief"
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <LogIn size={18} />}
                            {loading ? 'AUTENTICANDO...' : 'INICIAR SESIÓN'}
                        </button>
                    </form>

                    <div className="login-footer">
                        <p>© 2026 Ikusi - Tecnología para la Gestión de Operaciones</p>
                    </div>
                </div>
            </div>

            <style>{`
                .login-page {
                    min-height: 100vh;
                    background: #0B0E11;
                    background-image: 
                        radial-gradient(circle at 2px 2px, rgba(109, 190, 69, 0.05) 1px, transparent 0);
                    background-size: 40px 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                }

                .login-container {
                    width: 100%;
                    max-width: 420px;
                }

                .login-card {
                    background: white;
                    border-radius: 32px;
                    padding: 50px 40px;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                    border: 1px solid rgba(109, 190, 69, 0.1);
                    position: relative;
                    overflow: hidden;
                }

                .login-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 8px;
                    background: #6DBE45;
                }

                .login-header {
                    text-align: center;
                    margin-bottom: 40px;
                }

                .logo-section {
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                    margin-bottom: 12px;
                }

                .logo-ikusi {
                    font-size: 2.2rem;
                    font-weight: 900;
                    color: #0D2472;
                    letter-spacing: -1px;
                    line-height: 1;
                }

                .logo-portal {
                    font-size: 0.75rem;
                    font-weight: 800;
                    color: #6DBE45;
                    letter-spacing: 2px;
                    text-transform: uppercase;
                }

                .login-subtitle {
                    color: #64748B;
                    font-size: 0.85rem;
                    font-weight: 600;
                }

                .login-form {
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .form-group label {
                    font-size: 0.75rem;
                    font-weight: 800;
                    color: #1F3C88;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .form-group input {
                    background: #F8FAFC;
                    border: 1px solid #E2E8F0;
                    border-radius: 14px;
                    padding: 14px 18px;
                    font-size: 0.95rem;
                    color: #0D2472;
                    font-weight: 600;
                    outline: none;
                    transition: all 0.2s;
                }

                .form-group input:focus {
                    background: white;
                    border-color: #6DBE45;
                    box-shadow: 0 0 0 4px rgba(109, 190, 69, 0.1);
                }

                .login-error {
                    background: #FEE2E2;
                    color: #DC2626;
                    padding: 12px 16px;
                    border-radius: 12px;
                    font-size: 0.8rem;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    border: 1px solid rgba(220, 38, 38, 0.1);
                }

                .btn-login-relief {
                    background: #6DBE45;
                    color: white;
                    border: none;
                    border-radius: 16px;
                    padding: 16px;
                    font-weight: 900;
                    font-size: 0.95rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    cursor: pointer;
                    box-shadow: 0 4px 0 #4E8F2E;
                    transition: all 0.1s;
                    margin-top: 10px;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .btn-login-relief:active {
                    transform: translateY(2px);
                    box-shadow: 0 2px 0 #4E8F2E;
                }

                .btn-login-relief:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }

                .login-footer {
                    margin-top: 40px;
                    text-align: center;
                    opacity: 0.4;
                    font-size: 0.65rem;
                    font-weight: 600;
                    color: #0D2472;
                }
            `}</style>
        </div>
    );
};

export default Login;
