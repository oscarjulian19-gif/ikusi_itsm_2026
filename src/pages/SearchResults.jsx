import React, { useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, FileText, AlertCircle, Server, User, ArrowRight } from 'lucide-react';
import useIncidentStore from '../store/useIncidentStore';
import useContractStore from '../store/useContractStore';
import useCMDBStore from '../store/useCMDBStore';

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const navigate = useNavigate();

    const { incidents } = useIncidentStore();
    const { contracts } = useContractStore();
    const { cis } = useCMDBStore();

    const results = useMemo(() => {
        if (!query) return [];
        const q = query.toLowerCase();

        const filteredIncidents = incidents.filter(i =>
            i.id.toLowerCase().includes(q) ||
            i.title.toLowerCase().includes(q) ||
            i.description?.toLowerCase().includes(q)
        ).map(i => ({ ...i, type: 'Ticket', icon: AlertCircle, link: `/incidents/${i.id}` }));

        const filteredContracts = contracts.filter(c =>
            c.id.toLowerCase().includes(q) ||
            c.client.toLowerCase().includes(q) ||
            c.projectName?.toLowerCase().includes(q)
        ).map(c => ({ ...c, type: 'Contrato', title: `${c.client} - ${c.projectName || c.id}`, icon: FileText, link: `/contracts/${c.id}` }));

        const filteredCIs = cis.filter(ci =>
            ci.id.toLowerCase().includes(q) ||
            ci.serialNumber?.toLowerCase().includes(q) ||
            ci.description?.toLowerCase().includes(q)
        ).map(ci => ({ ...ci, type: 'Activo (CI)', title: `${ci.id} - ${ci.description || ci.serialNumber}`, icon: Server, link: '/cmdb' }));

        return [...filteredIncidents, ...filteredContracts, ...filteredCIs];
    }, [query, incidents, contracts, cis]);

    return (
        <div className="search-page animate-fade">
            <header className="page-header">
                <div>
                    <h1>Resultados para: "{query}"</h1>
                    <p>{results.length} coincidencias encontradas en toda la plataforma</p>
                </div>
            </header>

            {results.length === 0 ? (
                <div className="empty-state">
                    <Search size={48} />
                    <h3>No encontramos nada</h3>
                    <p>Intenta con otros términos de búsqueda (PEP, Folio, ID de Ticket...)</p>
                </div>
            ) : (
                <div className="results-list">
                    {results.map((res, idx) => (
                        <div key={idx} className="card result-card" onClick={() => navigate(res.link)}>
                            <div className="res-icon">
                                <res.icon size={20} />
                            </div>
                            <div className="res-content">
                                <div className="res-top">
                                    <span className="res-type">{res.type}</span>
                                    <span className="res-id">{res.id}</span>
                                </div>
                                <h3 className="res-title">{res.title}</h3>
                                {res.status && <span className="res-status-pill">{res.status}</span>}
                            </div>
                            <div className="res-action">
                                <ArrowRight size={18} />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <style>{`
                .search-page { max-width: 900px; margin: 0 auto; }
                .empty-state {
                    text-align: center;
                    padding: 80px 20px;
                    color: var(--text-dim);
                }
                .empty-state h3 { color: #fff; margin: 20px 0 10px; }
                
                .results-list {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                .result-card {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                    padding: 16px 24px;
                    cursor: pointer;
                    transition: all 0.2s;
                    border: 1px solid var(--border-glass);
                }
                .result-card:hover {
                    border-color: var(--color-primary);
                    background: rgba(255,255,255,0.03);
                    transform: translateX(5px);
                }
                .res-icon {
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                    background: rgba(255,255,255,0.05);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--color-primary);
                }
                .res-content { flex: 1; }
                .res-top {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 4px;
                }
                .res-type {
                    font-size: 0.65rem;
                    text-transform: uppercase;
                    background: var(--color-primary);
                    color: #000;
                    padding: 1px 6px;
                    border-radius: 4px;
                    font-weight: 800;
                }
                .res-id { font-size: 0.75rem; color: var(--text-muted); font-family: monospace; }
                .res-title { margin: 0; font-size: 0.95rem; color: #fff; }
                .res-status-pill {
                    display: inline-block;
                    margin-top: 6px;
                    font-size: 0.7rem;
                    color: var(--color-primary);
                    opacity: 0.8;
                }
                .res-action { color: var(--text-dim); opacity: 0; transition: 0.2s; }
                .result-card:hover .res-action { opacity: 1; transform: translateX(5px); }
            `}</style>
        </div>
    );
};

export default SearchResults;
