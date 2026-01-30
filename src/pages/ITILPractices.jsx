import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, CheckCircle, XCircle, ExternalLink, Search } from 'lucide-react';
import { ITIL_PRACTICES } from '../data/itilData';

const ITILPractices = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredPractices = ITIL_PRACTICES.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const groupedPractices = {
        'General': filteredPractices.filter(p => p.category === 'General'),
        'Service': filteredPractices.filter(p => p.category === 'Service'),
        'Technical': filteredPractices.filter(p => p.category === 'Technical')
    };

    const handleCardClick = (practice) => {
        if (practice.link) {
            navigate(practice.link);
        }
    };

    return (
        <div className="itil-page">
            <div className="page-header">
                <div>
                    <h1>Prácticas ITIL 4</h1>
                    <p>Marco de referencia para la gestión de servicios (34 Prácticas)</p>
                </div>
            </div>

            <div className="toolbar">
                <div className="search-box">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Buscar práctica..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {Object.entries(groupedPractices).map(([category, practices]) => (
                practices.length > 0 && (
                    <div key={category} className="practice-category-section">
                        <h2 className="category-title">{category} Management Practices ({practices.length})</h2>
                        <div className="practices-grid">
                            {practices.map(practice => (
                                <div
                                    key={practice.id}
                                    className={`card practice-card ${practice.status === 'Inactive' ? 'inactive' : ''} ${practice.link ? 'clickable' : ''}`}
                                    onClick={() => handleCardClick(practice)}
                                >
                                    <div className="practice-header">
                                        <span className="practice-id">{practice.id}</span>
                                        {practice.status === 'Active' ?
                                            <CheckCircle size={16} color="#39FF14" /> :
                                            <XCircle size={16} color="#666" />
                                        }
                                    </div>
                                    <h3>{practice.name}</h3>

                                    <div className="practice-details">
                                        <p><strong>Owner:</strong> {practice.owner}</p>
                                        <p><strong>KPI:</strong> {practice.kpi}</p>
                                    </div>

                                    {practice.link && (
                                        <div className="practice-link-indicator">
                                            <ExternalLink size={14} /> Ir al módulo
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )
            ))}

            <style>{`
                .itil-page {
                    max-width: 1200px;
                    margin: 0 auto;
                }
                .page-header {
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

                .practice-category-section {
                    margin-bottom: var(--spacing-xl);
                }
                .category-title {
                    font-size: 1.2rem;
                    color: var(--color-primary);
                    margin-bottom: var(--spacing-md);
                    border-bottom: 1px solid rgba(57, 255, 20, 0.2);
                    padding-bottom: 8px;
                    display: inline-block;
                }

                .practices-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: var(--spacing-md);
                }

                .practice-card {
                    background: var(--bg-panel);
                    padding: 16px;
                    border: 1px solid var(--border-color);
                    transition: all 0.2s;
                    position: relative;
                    overflow: hidden;
                }
                .practice-card.clickable {
                    cursor: pointer;
                    border-color: var(--color-primary-dim);
                }
                .practice-card.clickable:hover {
                    box-shadow: 0 0 10px rgba(57, 255, 20, 0.1);
                    transform: translateY(-2px);
                }
                .practice-card.inactive {
                    opacity: 0.6;
                    border-color: #333;
                }

                .practice-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 10px;
                }
                .practice-id {
                    font-size: 0.75rem;
                    color: var(--text-muted);
                    font-family: monospace;
                    background: rgba(255,255,255,0.05);
                    padding: 2px 6px;
                    border-radius: 4px;
                }

                .practice-card h3 {
                    font-size: 1rem;
                    margin-bottom: 12px;
                    color: #fff;
                    line-height: 1.3;
                }

                .practice-details p {
                    font-size: 0.8rem;
                    color: var(--text-muted);
                    margin-bottom: 4px;
                }
                .practice-details strong { color: #ccc; }

                .practice-link-indicator {
                    margin-top: 12px;
                    font-size: 0.8rem;
                    color: var(--color-primary);
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }
            `}</style>
        </div>
    );
};

export default ITILPractices;
