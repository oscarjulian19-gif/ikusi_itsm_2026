import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ChevronRight, Shield, Laptop, Disc, Server, UserPlus, Search } from 'lucide-react';
import { SERVICE_CATALOG } from '../data/catalogData';

const ServiceCatalog = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');

    const categories = ['All', ...new Set(SERVICE_CATALOG.map(s => s.category))];

    const filteredServices = SERVICE_CATALOG.filter(service => {
        const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            service.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'All' || service.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const getIcon = (iconName) => {
        switch (iconName) {
            case 'Shield': return <Shield size={24} color="#39FF14" />;
            case 'Laptop': return <Laptop size={24} color="#1e90ff" />;
            case 'Disc': return <Disc size={24} color="#ffa502" />;
            case 'Server': return <Server size={24} color="#ff4757" />;
            case 'UserPlus': return <UserPlus size={24} color="#a29bfe" />;
            default: return <ShoppingBag size={24} color="#fff" />;
        }
    };

    return (
        <div className="catalog-page">
            <div className="page-header">
                <div className="header-content">
                    <h1>Catálogo de Servicios</h1>
                    <p>Solicite nuevos servicios, accesos o recursos IT</p>
                </div>
            </div>

            <div className="search-section">
                <div className="search-box huge">
                    <Search size={20} className="search-icon" />
                    <input
                        type="text"
                        placeholder="¿Qué servicio necesitas hoy?"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="category-tabs">
                {categories.map(cat => (
                    <button
                        key={cat}
                        className={`tab-btn ${categoryFilter === cat ? 'active' : ''}`}
                        onClick={() => setCategoryFilter(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="catalog-grid">
                {filteredServices.map(service => (
                    <div key={service.id} className="card service-card" onClick={() => navigate(`/requests/new/${service.id}`)}>
                        <div className="service-icon">
                            {getIcon(service.icon)}
                        </div>
                        <div className="service-info">
                            <h3>{service.name}</h3>
                            <p>{service.description}</p>
                            <span className="sla-badge">SLA: {service.sla}h</span>
                        </div>
                        <div className="action-arrow">
                            <ChevronRight size={20} />
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
                .catalog-page {
                    max-width: 1000px;
                    margin: 0 auto;
                }

                .page-header {
                    margin-bottom: var(--spacing-lg);
                    text-align: center;
                }
                .page-header h1 { font-size: 2rem; margin-bottom: 8px; }
                .page-header p { color: var(--text-muted); font-size: 1.1rem; }

                .search-section {
                    display: flex;
                    justify-content: center;
                    margin-bottom: var(--spacing-xl);
                }
                .search-box.huge {
                    width: 100%;
                    max-width: 600px;
                    position: relative;
                }
                .search-box.huge input {
                    width: 100%;
                    padding: 16px 16px 16px 50px;
                    border-radius: 30px;
                    font-size: 1.1rem;
                    background: var(--bg-panel);
                    border: 1px solid var(--border-color);
                    color: #fff;
                    outline: none;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                    transition: border-color 0.3s;
                }
                .search-box.huge input:focus {
                    border-color: var(--color-primary);
                    box-shadow: 0 0 15px rgba(57, 255, 20, 0.2);
                }
                .search-box.huge .search-icon {
                    position: absolute;
                    left: 20px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: var(--text-muted);
                }

                .category-tabs {
                    display: flex;
                    justify-content: center;
                    gap: 12px;
                    margin-bottom: var(--spacing-lg);
                    flex-wrap: wrap;
                }
                .tab-btn {
                    background: transparent;
                    border: 1px solid var(--border-color);
                    color: var(--text-muted);
                    padding: 8px 16px;
                    border-radius: 20px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .tab-btn:hover { border-color: #fff; color: #fff; }
                .tab-btn.active {
                    background: var(--color-primary);
                    color: #000;
                    border-color: var(--color-primary);
                    font-weight: bold;
                }

                .catalog-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: var(--spacing-md);
                }

                .service-card {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    padding: 20px;
                    cursor: pointer;
                    border: 1px solid var(--border-color);
                    background: var(--bg-panel);
                    transition: transform 0.2s, background 0.2s;
                }
                .service-card:hover {
                    transform: translateY(-4px);
                    background: rgba(255,255,255,0.03);
                    border-color: var(--color-primary-dim);
                }

                .service-icon {
                    width: 50px;
                    height: 50px;
                    border-radius: 12px;
                    background: rgba(255,255,255,0.05);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }

                .service-info {
                    flex: 1;
                }
                .service-info h3 {
                    font-size: 1.1rem;
                    margin-bottom: 4px;
                    color: #fff;
                }
                .service-info p {
                    font-size: 0.85rem;
                    color: var(--text-muted);
                    margin-bottom: 8px;
                    line-height: 1.4;
                }
                .sla-badge {
                    font-size: 0.75rem;
                    color: var(--color-primary);
                    background: rgba(57, 255, 20, 0.1);
                    padding: 2px 6px;
                    border-radius: 4px;
                }

                .action-arrow {
                    color: var(--text-muted);
                    opacity: 0.5;
                }
                .service-card:hover .action-arrow {
                    color: #fff;
                    opacity: 1;
                }
            `}</style>
        </div>
    );
};

export default ServiceCatalog;
