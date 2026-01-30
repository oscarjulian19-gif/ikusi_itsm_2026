import React from 'react';
import { Activity, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import useCaseStore from '../store/useCaseStore';

const DashboardCard = ({ title, value, label, icon: Icon, color }) => (
  <div className="card dashboard-card">
    <div className="card-icon" style={{ backgroundColor: `${color}20`, color: color }}>
      <Icon size={24} />
    </div>
    <div className="card-info">
      <h3>{value}</h3>
      <p>{title}</p>
      <span className="card-label">{label}</span>
    </div>
    <style>{`
      .dashboard-card {
        display: flex;
        align-items: center;
        gap: 16px;
      }
      .card-icon {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .card-info h3 {
        font-size: 1.5rem;
        margin-bottom: 4px;
        color: #fff;
      }
      .card-info p {
        color: var(--text-muted);
        font-size: 0.9rem;
        margin-bottom: 4px;
      }
      .card-label {
        font-size: 0.8rem;
        color: var(--color-primary);
      }
    `}</style>
  </div >
);

const Dashboard = () => {
  const { cases } = useCaseStore();

  // Metrics Logic
  const openCases = cases.filter(c => !['Cerrado', 'Resuelto'].includes(c.status));
  const closedToday = cases.filter(c => c.status === 'Cerrado' /* In real app check date */).length;
  const p1Cases = cases.filter(c => c.priority === 'P1' && c.status !== 'Cerrado');
  const total = cases.length;

  // Recent 5
  const recentCases = [...cases].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 5);

  const getStatusColor = (priority) => {
    switch (priority) {
      case 'P1': return 'red';
      case 'P2': return 'orange';
      default: return 'green';
    }
  };

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1>Dashboard Operativo</h1>
        <p>Visión general del estado del servicio</p>
      </div>

      <div className="metrics-grid">
        <DashboardCard
          title="Casos Abiertos"
          value={openCases.length}
          label="Pendientes de atención"
          icon={AlertTriangle}
          color="#ff4757"
        />
        <DashboardCard
          title="Críticos (P1)"
          value={p1Cases.length}
          label="SLA en riesgo"
          icon={Clock}
          color="#ffa502"
        />
        <DashboardCard
          title="Cerrados (Demo)"
          value={closedToday}
          label="Cumplimiento alto"
          icon={CheckCircle}
          color="#39FF14"
        />
        <DashboardCard
          title="Total Histórico"
          value={total}
          label="Base de conocimiento"
          icon={Activity}
          color="#2ed573"
        />
      </div>

      <div className="content-grid">
        <div className="card main-chart">
          <h2>Tendencia de Incidentes</h2>
          <div className="chart-placeholder">
            [Gráfico de Área: Incidentes vs Requerimientos]
          </div>
        </div>
        <div className="card side-list">
          <h2>Últimos Casos</h2>
          <ul className="recent-list">
            {recentCases.map(c => (
              <li className="recent-item" key={c.id}>
                <span className={`status-dot ${getStatusColor(c.priority)}`}></span>
                <div>
                  <strong>{c.id}</strong>
                  <p>{c.title}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <style>{`
        .page-header {
          margin-bottom: var(--spacing-lg);
        }
        .page-header h1 {
          font-size: 1.8rem;
          margin-bottom: 8px;
        }
        .page-header p {
          color: var(--text-muted);
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-lg);
        }

        .content-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: var(--spacing-md);
        }

        .chart-placeholder {
          height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.02);
          border-radius: var(--radius-md);
          margin-top: 16px;
          color: var(--text-muted);
          border: 1px dashed var(--border-color);
        }

        .recent-list {
          list-style: none;
          margin-top: 16px;
        }

        .recent-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 12px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .recent-item:last-child {
          border-bottom: none;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin-top: 6px;
          flex-shrink: 0;
        }
        .status-dot.red { background-color: #ff4757; box-shadow: 0 0 5px #ff4757; }
        .status-dot.green { background-color: #39FF14; box-shadow: 0 0 5px #39FF14; }
        .status-dot.orange { background-color: #ffa502; box-shadow: 0 0 5px #ffa502; }

        .recent-item strong {
          display: block;
          color: #fff;
          font-size: 0.9rem;
        }
        .recent-item p {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        @media (max-width: 1024px) {
          .content-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
