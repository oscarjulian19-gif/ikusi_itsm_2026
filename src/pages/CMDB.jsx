import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Server, Monitor, Shield, Globe } from 'lucide-react';
import useCMDBStore from '../store/useCMDBStore';

const CMDB = () => {
    const navigate = useNavigate();
    const { cis } = useCMDBStore();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCIs = cis.filter(ci =>
        ci.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ci.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ci.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getIcon = (type) => {
        switch (type) {
            case 'Server': return <Server size={18} color="#39FF14" />;
            case 'Firewall': return <Shield size={18} color="#ff4757" />;
            case 'Switch':
            case 'Router': return <Globe size={18} color="#1e90ff" />;
            default: return <Monitor size={18} color="#ffa502" />;
        }
    };

    return (
        <div className="cmdb-page">
            <div className="page-header">
                <div>
                    <h1>CMDB & Activos</h1>
                    <p>Base de Datos de Gestión de Configuración</p>
                </div>
                {/* Future: Add CI functionality */}
                <button className="btn-primary" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                    <Plus size={18} style={{ marginRight: 8 }} />
                    Nuevo CI (Pronto)
                </button>
            </div>

            <div className="toolbar">
                <div className="search-box">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Buscar dispositivo, ID, tipo..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid-container">
                {filteredCIs.map(ci => (
                    <div key={ci.id} className="card ci-card">
                        <div className="ci-header">
                            <div className="ci-icon-box">
                                {getIcon(ci.type)}
                            </div>
                            <div className="ci-status-dot"></div>
                        </div>
                        <div className="ci-body">
                            <h3>{ci.name}</h3>
                            <span className="ci-id">{ci.id}</span>
                            <div className="ci-details">
                                <p><strong>Tipo:</strong> {ci.type}</p>
                                <p><strong>Vendor:</strong> {ci.vendor}</p>
                                <p><strong>Env:</strong> {ci.environment}</p>
                            </div>
                        </div>
                        <div className="ci-footer">
                            <span className={`criticality-badge ${ci.criticality}`}>
                                {ci.criticality}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
                .page-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: var(--spacing-lg);
                }
                .toolbar { margin-bottom: var(--spacing-lg); }
                
                .search-box {
                    position: relative;
                    max-width: 400px;
                }
                .search-box input {
                    width: 100%;
                    background: var(--bg-panel);
                    border: 1px solid var(--border-color);
                    padding: 10px 10px 10px 40px;
                    border-radius: var(--radius-md);
                    color: #fff;
                    outline: none;
                }
                .search-box input:focus { border-color: var(--color-primary); }
                .search-icon {
                    position: absolute;
                    left: 12px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: var(--text-muted);
                }

                .grid-container {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                    gap: var(--spacing-md);
                }

                .ci-card {
                    display: flex;
                    flex-direction: column;
                    transition: transform 0.2s, box-shadow 0.2s;
                }
                .ci-card:hover {
                    transform: translateY(-5px);
                    border-color: var(--color-primary);
                    box-shadow: 0 5px 15px rgba(57, 255, 20, 0.1);
                }

                .ci-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 12px;
                }

                .ci-icon-box {
                    width: 40px;
                    height: 40px;
                    border-radius: 8px;
                    background: rgba(255,255,255,0.05);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .ci-status-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: #39FF14;
                    box-shadow: 0 0 5px #39FF14;
                }

                .ci-body h3 {
                    font-size: 1.1rem;
                    margin-bottom: 4px;
                    color: #fff;
                }

                .ci-id {
                    font-size: 0.8rem;
                    color: var(--color-primary);
                    display: block;
                    margin-bottom: 12px;
                }

                .ci-details p {
                    font-size: 0.85rem;
                    color: var(--text-muted);
                    margin-bottom: 4px;
                }
                .ci-details strong { color: #ccc; }

                .ci-footer {
                    margin-top: auto;
                    padding-top: 12px;
                    border-top: 1px solid rgba(255,255,255,0.05);
                }

                .criticality-badge {
                    font-size: 0.75rem;
                    padding: 2px 8px;
                    border-radius: 4px;
                    text-transform: uppercase;
                    font-weight: bold;
                }
                .criticality-badge.High { background: rgba(255, 71, 87, 0.2); color: #ff4757; }
                .criticality-badge.Medium { background: rgba(255, 165, 2, 0.2); color: #ffa502; }
                .criticality-badge.Low { background: rgba(46, 213, 115, 0.2); color: #2ed573; }
            `}</style>
        </div>
    );
};

export default CMDB;
