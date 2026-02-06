import React, { useEffect } from 'react';
import { Activity, CheckCircle, Clock, AlertTriangle, Server, BookOpen, FileText, Bot } from 'lucide-react';
import useContractStore from '../store/useContractStore';
import useCMDBStore from '../store/useCMDBStore';
import useIncidentStore from '../store/useIncidentStore';
import useCatalogStore from '../store/useCatalogStore';

const DashboardCard = ({ title, value, label, icon: Icon, color }) => (
  <div className="card dashboard-card animate-fade">
    <div className="card-icon" style={{ background: `${color}15`, color: color }}>
      <Icon size={20} />
    </div>
    <div className="card-info">
      <p className="card-title">{title}</p>
      <h3 className="card-value">{value}</h3>
      <span className="card-label">{label}</span>
    </div>
    <style>{`
      .dashboard-card {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 18px 24px;
        background: #fff;
        border: 1px solid var(--border-light);
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-sm);
        transition: transform 0.2s, box-shadow 0.2s;
      }
      .dashboard-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }
      .card-icon {
        width: 44px;
        height: 44px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
      .card-info {
        display: flex;
        flex-direction: column;
      }
      .card-title {
        color: #475569 !important; /* Medium-dark slate */
        font-size: 0.85rem !important;
        font-weight: 700;
        margin-bottom: 2px;
      }
      .card-value {
        font-size: 1.5rem !important;
        margin: 0 !important;
        color: #020617; /* Deep slate */
        font-weight: 800;
        line-height: 1;
      }
      .card-label {
        font-size: 0.75rem;
        color: #64748b;
        font-weight: 500;
        margin-top: 4px;
      }
    `}</style>
  </div >
);

const Dashboard = () => {
  const { fetchContracts, total: totalContracts } = useContractStore();
  const { fetchCIs, total: totalCIs } = useCMDBStore();
  const { incidents, fetchIncidents } = useIncidentStore();
  const { services, fetchCatalog } = useCatalogStore(); // Adding catalog store

  useEffect(() => {
    fetchContracts({ limit: 1 });
    fetchCIs({ limit: 1 });
    fetchIncidents();
    fetchCatalog();
  }, [fetchContracts, fetchCIs, fetchIncidents, fetchCatalog]);

  // Metric Calculations
  const activeIncidents = incidents.filter(i => i.ticket_type === 'incident' && !['Cerrado', 'Resuelto'].includes(i.status)).length;
  const activeRequests = incidents.filter(i => i.ticket_type === 'request' && !['Cerrado', 'Resuelto'].includes(i.status)).length;
  const activeCatalog = services.length;

  // Critical Cases (P1/P2 Active)
  const criticalCases = incidents
    .filter(i => ['P1', 'P2'].includes(i.priority) && !['Cerrado', 'Resuelto'].includes(i.status))
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  // AI Analytics State
  const [aiAnalysis, setAiAnalysis] = React.useState({
    summary: "Conectando con Neural Core para análisis en tiempo real...",
    trend: "...",
    prediction: "Calculando...",
    lastUpdate: null,
    loading: true
  });

  // Fetch Real AI Analysis
  useEffect(() => {
    const fetchAIAnalysis = async () => {
      // Don't fetch if no data yet
      if (incidents.length === 0 && totalCIs === 0) return;

      try {
        const prompt = `
        Analiza el estado operativo actual:
        - Incidentes Activos: ${activeIncidents}
        - Requerimientos Activos: ${activeRequests}
        - Activos en CMDB: ${totalCIs}
        - Casos Críticos (P1/P2): ${criticalCases.length}
        - Último incidente crítico: ${criticalCases[0]?.title || 'Ninguno'}

        Genera un Resumen Ejecutivo breve (max 2 líneas), determina la Tendencia (Estable/Degradada/Mejorando) y haz una Predicción de riesgo a 1 hora.
        Formato de respuesta: Resumen|Tendencia|Predicción
        `;

        const response = await aiApi.analyzeTicket({
          id: 'OPS-SNAPSHOT',
          title: 'Snapshot Operativo en Tiempo Real',
          description: prompt,
          priority: 'Info',
          status: 'Analysis'
        });

        // Parse "Fake" structured response from the text analysis
        // If the AI just returns text, we handle it gracefully
        const parts = response.analysis.split('|');
        const summary = parts[0] || response.analysis;
        const trend = parts[1] || 'Analizando';
        const prediction = parts[2] || 'Monitoreando...';

        setAiAnalysis({
          summary: summary.trim(),
          trend: trend.trim(),
          prediction: prediction.trim(),
          lastUpdate: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          loading: false
        });

      } catch (error) {
        console.error("AI Dash Error:", error);
        setAiAnalysis(prev => ({
          ...prev,
          summary: "Sin conexión con el motor de IA. Mostrando datos cacheados.",
          trend: "Desconocido",
          prediction: "N/A",
          loading: false
        }));
      }
    };

    const timer = setTimeout(fetchAIAnalysis, 1000); // Debounce slightly
    return () => clearTimeout(timer);
  }, [activeIncidents, activeRequests, totalCIs, criticalCases.length]); // Re-run when key metrics change

  return (
    <div className="dashboard animate-fade">
      <div className="page-header-minimal">
        <h1 className="text-gradient">Dashboard Operativo</h1>
        <p>Visión estratégica del estado del servicio</p>
      </div>

      <div className="metrics-grid">
        <DashboardCard
          title="Incidentes en Curso"
          value={activeIncidents}
          label="Tickets activos"
          icon={AlertTriangle}
          color="#ef4444"
        />
        <DashboardCard
          title="Requerimientos en Curso"
          value={activeRequests}
          label="Solicitudes activas"
          icon={FileText}
          color="#f59e0b"
        />
        <DashboardCard
          title="Activos (CMDB)"
          value={totalCIs}
          label="Total registrados"
          icon={Server}
          color="#3b82f6"
        />
        <DashboardCard
          title="Catálogo de Servicios"
          value={activeCatalog}
          label="Activos disponibles"
          icon={BookOpen}
          color="#8b5cf6"
        />
        <DashboardCard
          title="Contratos"
          value={totalContracts}
          label="Vigentes"
          icon={Activity}
          color="#10b981"
        />
      </div>

      <div className="content-grid">
        {/* Left Col: AI Analytics (Replacing Trend Chart) */}
        <div className="card main-chart corporate-section ai-section">
          <div className="flex-between section-header">
            <h3 className="flex-center-gap">
              <Bot size={20} color="#39FF14" />
              Analítica Operativa (AI)
            </h3>
            <span className="badge-light">
              {aiAnalysis.loading ? 'Sincronizando...' : `Actualizado: ${aiAnalysis.lastUpdate || '--:--'}`}
            </span>
          </div>
          <div className="ai-content">
            <div className="ai-summary-box">
              <h4>Resumen Ejecutivo</h4>
              <p>
                {aiAnalysis.loading ? (
                  <span className="blink">Procesando datos del entorno...</span>
                ) : aiAnalysis.summary}
              </p>
            </div>
            <div className="ai-stats-row">
              <div className="ai-stat">
                <span className="label">Tendencia</span>
                <strong className={`value ${aiAnalysis.trend.includes('Degrad') ? 'text-danger' : 'text-success'}`}>
                  {aiAnalysis.trend}
                </strong>
              </div>
              <div className="ai-stat">
                <span className="label">Predicción (1h)</span>
                <strong className="value">{aiAnalysis.prediction}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Critical Cases (Replacing Recent Activity) */}
        <div className="card side-list corporate-section">
          <div className="section-header">
            <h3 className="text-danger">Casos Críticos Activos</h3>
          </div>
          <ul className="recent-list">
            {criticalCases.map(c => (
              <li className="recent-item critical" key={c.id}>
                <div className="priority-tag P1">{c.priority}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="flex-between">
                    <strong className="item-id">{c.id}</strong>
                    <span className="item-timer text-danger">En curso</span>
                  </div>
                  <p className="item-title">{c.title}</p>
                </div>
              </li>
            ))}
            {criticalCases.length === 0 && (
              <div className="empty-state-small">
                <CheckCircle size={24} color="#10b981" />
                <p>Sin casos críticos activos</p>
              </div>
            )}
          </ul>
        </div>
      </div>

      <style>{`
        .dashboard {
          padding-bottom: 30px;
        }
        .page-header-minimal {
          margin-bottom: 32px;
          border-bottom: 2px solid #e2e8f0;
          padding-bottom: 16px;
        }
        .page-header-minimal h1 {
          font-size: 1.8rem;
          font-weight: 800;
          color: #020617;
          margin-bottom: 4px;
        }
        .page-header-minimal p {
          color: #475569;
          font-size: 1rem;
          font-weight: 500;
        }
        
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 32px;
        }

        .content-grid {
          display: grid;
          grid-template-columns: 2.2fr 1fr;
          gap: 24px;
        }

        .flex-between {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .chart-placeholder {
          height: 350px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #475569;
          padding: 20px;
          background: #f8fafc;
          border-radius: var(--radius-lg);
          margin-top: 20px;
          font-weight: 600;
        }

        .recent-list {
          list-style: none;
          padding: 0 20px;
        }

        .recent-item {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 18px 0;
          border-bottom: 1px solid #f1f5f9;
          transition: background 0.2s;
        }

        .recent-item:last-child {
          border-bottom: none;
        }

        .item-indicator {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          margin-top: 6px;
          flex-shrink: 0;
        }

        .item-id {
          font-size: 0.85rem;
          color: var(--color-secondary);
          font-weight: 700;
          font-family: monospace;
        }

        .item-date {
          font-size: 0.75rem;
          color: #64748b;
          font-weight: 600;
        }

        .item-title {
          font-size: 0.95rem;
          color: #1e293b;
          font-weight: 600;
          margin-top: 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .badge-light {
          background: #e2e8f0;
          color: #334155;
          padding: 3px 10px;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: 800;
        }

        @media (max-width: 1024px) {
          .content-grid {
            grid-template-columns: 1fr;
          }
        }

        /* AI Analytics Styles */
        .ai-section { border: 1px solid #c7d2fe; box-shadow: 0 4px 15px rgba(99, 102, 241, 0.1); }
        .flex-center-gap { display: flex; align-items: center; gap: 8px; }
        .text-primary { color: var(--color-primary); }
        .ai-content { padding: 8px 16px 16px 16px; display: flex; flex-direction: column; gap: 20px; flex: 1; }
        .ai-summary-box { background: #f8fafc; padding: 16px; border-radius: 8px; border-left: 4px solid var(--color-primary); }
        .ai-summary-box h4 { margin: 0 0 8px 0; color: #334155; font-size: 0.9rem; }
        .ai-summary-box p { margin: 0; color: #475569; font-size: 0.95rem; line-height: 1.5; }
        .ai-stats-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .ai-stat { background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .ai-stat .label { font-size: 0.75rem; color: #64748b; font-weight: 600; text-transform: uppercase; margin-bottom: 4px; }
        .ai-stat .value { font-size: 1.1rem; color: #1e293b; font-weight: 800; }
        .text-success { color: #10b981 !important; }

        /* Critical Cases Styles */
        .recent-item.critical { align-items: center; border-bottom: 1px solid #fee2e2; background: #fffbff; }
        .recent-item.critical:last-child { border-bottom: none; }
        .priority-tag.P1 { background: #ef4444; color: #fff; padding: 4px 8px; border-radius: 6px; font-weight: 800; font-size: 0.8rem; margin-right: 12px; min-width: 32px; text-align: center; box-shadow: 0 2px 4px rgba(239, 68, 68, 0.3); }
        .item-timer { font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; }
        .text-danger { color: #ef4444; }
        .empty-state-small { padding: 40px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #94a3b8; gap: 10px; text-align: center; }
      `}</style>
    </div>
  );
};

export default Dashboard;
