import React, { useMemo } from 'react';
import { BarChart2, PieChart, TrendingUp, Activity, AlertOctagon, Clock } from 'lucide-react';
import useCaseStore from '../store/useCaseStore';

const Reports = () => {
    const { cases } = useCaseStore();

    // --- Analytics Calculations ---
    const metrics = useMemo(() => {
        const total = cases.length;
        const open = cases.filter(c => c.status !== 'Cerrado' && c.status !== 'Resuelto').length;
        const resolved = cases.filter(c => c.status === 'Resuelto').length;
        const closed = cases.filter(c => c.status === 'Cerrado').length;

        const priorityCounts = { P1: 0, P2: 0, P3: 0 };
        cases.forEach(c => {
            if (priorityCounts[c.priority] !== undefined) priorityCounts[c.priority]++;
        });

        const statusCounts = {};
        cases.forEach(c => {
            statusCounts[c.status] = (statusCounts[c.status] || 0) + 1;
        });

        // Mock SLA calculation (randomized for demo if not enough data)
        const slaCompliant = Math.floor(total * 0.85);
        const slaBreached = total - slaCompliant;
        const slaPercentage = total > 0 ? ((slaCompliant / total) * 100).toFixed(1) : 100;

        return { total, open, resolved, closed, priorityCounts, statusCounts, slaPercentage };
    }, [cases]);

    const maxPriority = Math.max(...Object.values(metrics.priorityCounts), 1);

    return (
        <div className="reports-page">
            <header className="page-header">
                <div>
                    <h1>Analítica y Reportes</h1>
                    <p>Visión estratégica de la operación IT</p>
                </div>
                <div className="date-range">
                    <span>Últimos 30 Días</span>
                </div>
            </header>

            {/* KPI Cards */}
            <div className="kpi-grid">
                <div className="card kpi-card">
                    <div className="kpi-icon"><Activity size={24} color="#39FF14" /></div>
                    <div className="kpi-data">
                        <span className="kpi-value">{metrics.total}</span>
                        <span className="kpi-label">Tickets Totales</span>
                    </div>
                </div>
                <div className="card kpi-card">
                    <div className="kpi-icon"><AlertOctagon size={24} color="#ff4757" /></div>
                    <div className="kpi-data">
                        <span className="kpi-value">{metrics.priorityCounts.P1}</span>
                        <span className="kpi-label">Incidencias Críticas (P1)</span>
                    </div>
                </div>
                <div className="card kpi-card">
                    <div className="kpi-icon"><TrendingUp size={24} color="#1e90ff" /></div>
                    <div className="kpi-data">
                        <span className="kpi-value">{metrics.slaPercentage}%</span>
                        <span className="kpi-label">Cumplimiento SLA</span>
                    </div>
                </div>
                <div className="card kpi-card">
                    <div className="kpi-icon"><Clock size={24} color="#ffa502" /></div>
                    <div className="kpi-data">
                        <span className="kpi-value">4.2h</span>
                        <span className="kpi-label">MTTR Promedio</span>
                    </div>
                </div>
            </div>

            <div className="charts-container">
                {/* Priority Chart */}
                <div className="card chart-card">
                    <h3><BarChart2 size={18} /> Volumen por Prioridad</h3>
                    <div className="custom-bar-chart">
                        {Object.entries(metrics.priorityCounts).map(([key, value]) => (
                            <div key={key} className="chart-bar-group">
                                <div className="bar-track">
                                    <div
                                        className={`bar-fill ${key}`}
                                        style={{ height: `${(value / maxPriority) * 100}%` }}
                                    >
                                        <span className="bar-tooltip">{value}</span>
                                    </div>
                                </div>
                                <span className="bar-label">{key}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Status Stats */}
                <div className="card chart-card">
                    <h3><PieChart size={18} /> Distribución por Estado</h3>
                    <div className="status-list">
                        {Object.entries(metrics.statusCounts).map(([status, count]) => (
                            <div key={status} className="status-item">
                                <div className="status-info">
                                    <span className="status-name">{status}</span>
                                    <span className="status-count">{count}</span>
                                </div>
                                <div className="progress-track">
                                    <div
                                        className="progress-fill"
                                        style={{ width: `${(count / metrics.total) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Advanced Metrics Table */}
                <div className="card chart-card full-width">
                    <h3>Rendimiento por Equipo de Soporte</h3>
                    <table className="analysis-table">
                        <thead>
                            <tr>
                                <th>Equipo</th>
                                <th>Casos Asignados</th>
                                <th>Resueltos</th>
                                <th>SLA Score</th>
                                <th>Trend</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Mesa de Ayuda L1</td>
                                <td>{Math.floor(metrics.total * 0.6)}</td>
                                <td>{Math.floor(metrics.total * 0.5)}</td>
                                <td><span className="score-good">98%</span></td>
                                <td>↗️</td>
                            </tr>
                            <tr>
                                <td>Infraestructura L2</td>
                                <td>{Math.floor(metrics.total * 0.2)}</td>
                                <td>{Math.floor(metrics.total * 0.15)}</td>
                                <td><span className="score-avg">92%</span></td>
                                <td>➡️</td>
                            </tr>
                            <tr>
                                <td>Ciberseguridad</td>
                                <td>{Math.floor(metrics.total * 0.05)}</td>
                                <td>{Math.floor(metrics.total * 0.05)}</td>
                                <td><span className="score-good">100%</span></td>
                                <td>↗️</td>
                            </tr>
                            <tr>
                                <td>Desarrollo / DevOps</td>
                                <td>{Math.floor(metrics.total * 0.15)}</td>
                                <td>{Math.floor(metrics.total * 0.1)}</td>
                                <td><span className="score-bad">85%</span></td>
                                <td>↘️</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>

            <style>{`
                .reports-page {
                    max-width: 1200px;
                    margin: 0 auto;
                }
                .page-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    margin-bottom: var(--spacing-xl);
                }
                .date-range {
                    background: var(--bg-panel);
                    padding: 8px 16px;
                    border-radius: 20px;
                    border: 1px solid var(--border-color);
                    color: var(--text-muted);
                    font-size: 0.9rem;
                }

                .kpi-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
                    gap: var(--spacing-md);
                    margin-bottom: var(--spacing-lg);
                }
                .kpi-card {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    padding: 24px;
                }
                .kpi-icon {
                    width: 48px;
                    height: 48px;
                    border-radius: 12px;
                    background: rgba(255,255,255,0.05);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .kpi-data {
                    display: flex;
                    flex-direction: column;
                }
                .kpi-value {
                    font-size: 1.8rem;
                    font-weight: bold;
                    color: #fff;
                    line-height: 1.1;
                }
                .kpi-label {
                    color: var(--text-muted);
                    font-size: 0.85rem;
                }

                .charts-container {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: var(--spacing-lg);
                }
                .chart-card {
                    padding: 20px;
                }
                .chart-card.full-width { grid-column: 1 / -1; }
                .chart-card h3 {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 24px;
                    color: #fff;
                    font-size: 1.1rem;
                }

                /* Custom Bar Chart */
                .custom-bar-chart {
                    height: 200px;
                    display: flex;
                    align-items: flex-end;
                    justify-content: space-around;
                    padding-bottom: 20px;
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                }
                .chart-bar-group {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    height: 100%;
                    width: 40px;
                }
                .bar-track {
                    flex: 1;
                    width: 100%;
                    display: flex;
                    align-items: flex-end;
                    justify-content: center;
                }
                .bar-fill {
                    width: 100%;
                    border-radius: 4px 4px 0 0;
                    position: relative;
                    transition: height 1s ease-out;
                    min-height: 4px;
                }
                .bar-fill.P1 { background: #ff4757; box-shadow: 0 0 10px rgba(255, 71, 87, 0.3); }
                .bar-fill.P2 { background: #ffa502; box-shadow: 0 0 10px rgba(255, 165, 2, 0.3); }
                .bar-fill.P3 { background: #2ed573; box-shadow: 0 0 10px rgba(46, 213, 115, 0.3); }
                
                .bar-tooltip {
                    position: absolute;
                    top: -25px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: #000;
                    color: #fff;
                    padding: 2px 6px;
                    border-radius: 4px;
                    font-size: 0.75rem;
                    opacity: 0;
                    transition: opacity 0.2s;
                }
                .chart-bar-group:hover .bar-tooltip { opacity: 1; }
                
                .bar-label {
                    margin-top: 10px;
                    color: var(--text-muted);
                    font-weight: bold;
                }

                /* Status List */
                .status-list {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }
                .status-item {
                    width: 100%;
                }
                .status-info {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 4px;
                    font-size: 0.9rem;
                    color: #ddd;
                }
                .progress-track {
                    width: 100%;
                    height: 6px;
                    background: rgba(255,255,255,0.05);
                    border-radius: 3px;
                    overflow: hidden;
                }
                .progress-fill {
                    height: 100%;
                    background: var(--color-primary);
                    border-radius: 3px;
                }

                /* Analysis Table */
                .analysis-table {
                    width: 100%;
                    border-collapse: collapse;
                }
                .analysis-table th, .analysis-table td {
                    text-align: left;
                    padding: 12px;
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                }
                .analysis-table th {
                    color: var(--text-muted);
                    font-weight: normal;
                    font-size: 0.9rem;
                }
                .analysis-table td {
                    color: #fff;
                }
                .score-good { color: #2ed573; }
                .score-avg { color: #ffa502; }
                .score-bad { color: #ff4757; }

            `}</style>
        </div>
    );
};

export default Reports;
