import React, { useMemo, useState } from 'react';
import { BarChart2, PieChart, TrendingUp, Activity, AlertOctagon, Clock, FileText, Server, Users, Layers } from 'lucide-react';
import useCaseStore from '../store/useCaseStore';
import useContractStore from '../store/useContractStore';
import useCMDBStore from '../store/useCMDBStore';

const Reports = () => {
    const { cases } = useCaseStore();
    const { contracts } = useContractStore();
    const { cis } = useCMDBStore();

    const [activeTab, setActiveTab] = useState('general');

    // --- Analytics ---
    const incidentMetrics = useMemo(() => {
        const total = cases.length;
        const open = cases.filter(c => ['Abierto', 'En Curso', 'En Resolución', 'Pausado'].includes(c.status)).length;
        const resolved = cases.filter(c => c.status === 'Resuelto' || c.status === 'Cerrado').length;
        const slaBreached = cases.filter(c => Math.random() > 0.8).length; // Mock
        return { total, open, resolved, slaBreached };
    }, [cases]);

    const contractMetrics = useMemo(() => {
        const total = contracts.length;
        const active = contracts.filter(c => c.status === 'Activo').length;
        const totalValue = contracts.length * 15000; // Mock Value
        return { total, active, totalValue };
    }, [contracts]);

    const cmdbMetrics = useMemo(() => {
        const total = cis.length;
        const active = cis.filter(ci => ci.status === 'Activo').length;
        return { total, active };
    }, [cis]);

    const renderKPICard = (title, value, subtext, Icon, colorClass) => (
        <div className="kpi-card-clean">
            <div className={`kpi-icon-wrapper ${colorClass}`}>
                <Icon size={24} />
            </div>
            <div className="kpi-content">
                <span className="kpi-value">{value}</span>
                <span className="kpi-title">{title}</span>
                <span className="kpi-subtext">{subtext}</span>
            </div>
        </div>
    );

    return (
        <div className="reports-page animate-fade">
            <div className="page-header-clean">
                <div className="header-title">
                    <h1>Reportes Integrales</h1>
                    <p>Inteligencia de Negocio y Operativa 360°</p>
                </div>
                <div className="header-actions">
                    <div className="tab-group">
                        <button className={activeTab === 'general' ? 'active' : ''} onClick={() => setActiveTab('general')}>General</button>
                        <button className={activeTab === 'incidents' ? 'active' : ''} onClick={() => setActiveTab('incidents')}>Incidentes</button>
                        <button className={activeTab === 'contracts' ? 'active' : ''} onClick={() => setActiveTab('contracts')}>Contratos</button>
                        <button className={activeTab === 'cmdb' ? 'active' : ''} onClick={() => setActiveTab('cmdb')}>Infraestructura</button>
                    </div>
                </div>
            </div>

            {/* General Dashboard */}
            {activeTab === 'general' && (
                <div className="dashboard-grid">
                    <div className="metrics-row">
                        {renderKPICard('Tickets Totales', incidentMetrics.total, `${incidentMetrics.open} Abiertos`, Activity, 'blue')}
                        {renderKPICard('Contratos Vigentes', contractMetrics.active, `$${contractMetrics.totalValue.toLocaleString()} MRR Est.`, FileText, 'green')}
                        {renderKPICard('Activos CI', cmdbMetrics.active, `${cmdbMetrics.total} Total Inventario`, Server, 'purple')}
                        {renderKPICard('Salud SLA', '98.5%', 'Objetivo Mensual Cumplido', TrendingUp, 'orange')}
                    </div>

                    <div className="corporate-section chart-section">
                        <h3><PieChart size={20} /> Distribución Global de Cargas</h3>
                        <div className="chart-placeholder">
                            <div className="bar" style={{ height: '60%' }}><span>Inc</span></div>
                            <div className="bar" style={{ height: '80%' }}><span>Req</span></div>
                            <div className="bar" style={{ height: '40%' }}><span>Chg</span></div>
                            <div className="bar" style={{ height: '90%' }}><span>Prob</span></div>
                        </div>
                        <p className="chart-legend">Volumen de operaciones por tipo procesado</p>
                    </div>
                </div>
            )}

            {/* Contracts Reports */}
            {activeTab === 'contracts' && (
                <div className="corporate-section">
                    <div className="section-header">
                        <h3>Análisis de Cartera de Contratos</h3>
                    </div>
                    <table className="neon-table-clean">
                        <thead>
                            <tr>
                                <th>Cliente</th>
                                <th>Contratos Activos</th>
                                <th>Volumen Tickets</th>
                                <th>Salud Cuenta</th>
                                <th>Renovación</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contracts.slice(0, 5).map(c => (
                                <tr key={c.id}>
                                    <td className="font-bold">{c.client}</td>
                                    <td>{Math.floor(Math.random() * 3) + 1}</td>
                                    <td>{Math.floor(Math.random() * 50)} / mes</td>
                                    <td><span className="status-pill activo">Saludable</span></td>
                                    <td>{c.endDate}</td>
                                </tr>
                            ))}
                            {contracts.length === 0 && <tr><td colSpan="5" className="empty-state">No hay contratos para analizar</td></tr>}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Incidents Report Mock */}
            {activeTab === 'incidents' && (
                <div className="corporate-section">
                    <div className="section-header">
                        <h3>Métricas de Operación y SLA</h3>
                    </div>
                    <div className="metrics-row">
                        {renderKPICard('SLA Medio', '98%', '-2% vs Mes Pasado', Clock, 'orange')}
                        {renderKPICard('MTTR', '4h 15m', 'Tiempo Resolución Promedio', TrendingUp, 'blue')}
                    </div>
                    <div style={{ padding: '20px' }}>
                        <p style={{ color: '#666' }}>Detalle exhaustivo de incidentes disponible en módulo de gestión.</p>
                    </div>
                </div>
            )}

            {/* CMDB Report Mock */}
            {activeTab === 'cmdb' && (
                <div className="corporate-section">
                    <div className="section-header">
                        <h3>Estado del Inventario</h3>
                    </div>
                    <table className="neon-table-clean">
                        <thead>
                            <tr>
                                <th>Tipo</th>
                                <th>Cantidad</th>
                                <th>Estado Operativo</th>
                                <th>Riesgos Detectados</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Servidores</td>
                                <td>{cis.filter(c => c.type === 'Servidor').length + 12}</td>
                                <td>99.9% Uptime</td>
                                <td>0 Críticos</td>
                            </tr>
                            <tr>
                                <td>Routers / Switches</td>
                                <td>{cis.filter(c => c.type === 'Red').length + 24}</td>
                                <td>98.5% Uptime</td>
                                <td>1 Advertencia</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}


            <style>{`
                .page-header-clean {
                    display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;
                    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
                    padding: 24px 32px; border-radius: 12px; color: #fff; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                }
                .header-title h1 { font-size: 1.6rem; color: #ffffff; margin-bottom: 4px; font-weight: 700; }
                .header-title p { color: #94a3b8; font-size: 0.9rem; font-weight: 500; }
                
                .tab-group { display: flex; background: rgba(255,255,255,0.1); padding: 4px; border-radius: 8px; gap: 4px; }
                .tab-group button { 
                    background: transparent; color: #cbd5e1; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 0.9rem; transition: all 0.2s;
                }
                .tab-group button.active { background: #008F39; color: #fff; shadow: 0 2px 4px rgba(0,0,0,0.2); }
                .tab-group button:hover:not(.active) { color: #fff; background: rgba(255,255,255,0.05); }

                .dashboard-grid { display: flex; flex-direction: column; gap: 24px; }
                
                .metrics-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; margin-bottom: 24px; }
                
                .kpi-card-clean { 
                    background: #fff; border-radius: 12px; padding: 24px; display: flex; align-items: center; gap: 16px;
                    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;
                }
                .kpi-icon-wrapper { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #fff; }
                .kpi-icon-wrapper.blue { background: #3b82f6; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3); }
                .kpi-icon-wrapper.green { background: #008F39; box-shadow: 0 4px 12px rgba(0, 143, 57, 0.3); }
                .kpi-icon-wrapper.purple { background: #8b5cf6; box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3); }
                .kpi-icon-wrapper.orange { background: #f59e0b; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3); }

                .kpi-content { display: flex; flex-direction: column; }
                .kpi-value { font-size: 1.5rem; font-weight: 800; color: #0f172a; line-height: 1.1; }
                .kpi-title { font-size: 0.85rem; color: #64748b; font-weight: 600; margin-top: 4px; }
                .kpi-subtext { font-size: 0.75rem; color: #94a3b8; }

                .corporate-section { 
                    border-top: 4px solid #008F39; background: #fff; border-radius: 12px; overflow: hidden; 
                    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); padding: 24px;
                }
                .section-header h3 { font-size: 1.1rem; color: #0f172a; font-weight: 700; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }

                .neon-table-clean { width: 100%; border-collapse: collapse; }
                .neon-table-clean th { padding: 12px; background: #f8fafc; border-bottom: 2px solid #e2e8f0; color: #475569; font-weight: 700; font-size: 0.8rem; text-align: left; }
                .neon-table-clean td { padding: 12px; border-bottom: 1px solid #f1f5f9; color: #334155; font-size: 0.9rem; }
                .font-bold { font-weight: 600; }
                
                .chart-placeholder { height: 200px; display: flex; align-items: flex-end; justify-content: space-around; background: #f8fafc; border-radius: 8px; padding: 20px; border: 1px dashed #cbd5e1; }
                .bar { width: 40px; background: #008F39; border-radius: 4px 4px 0 0; position: relative; opacity: 0.8; transition: height 0.5s; }
                .bar span { position: absolute; bottom: -25px; left: 50%; transform: translateX(-50%); font-size: 0.8rem; color: #64748b; font-weight: 600; }
                .chart-legend { text-align: center; font-size: 0.8rem; color: #94a3b8; margin-top: 30px; }
                
                .status-pill { padding: 4px 8px; border-radius: 12px; font-size: 0.75rem; font-weight: bold; }
                .status-pill.activo { background: #dcfce7; color: #16a34a; }
            `}</style>
        </div>
    );
};

export default Reports;
