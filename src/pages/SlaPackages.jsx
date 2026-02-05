import React from 'react';
import { Package, Shield, Clock, Info } from 'lucide-react';
import { SERVICE_PACKAGES, SLA_TYPES } from '../data/slaData';

const SlaPackages = () => {
    return (
        <div className="sla-packages animate-fade">
            <header className="page-header">
                <div>
                    <h1>Paquetes de Servicios y ANSs</h1>
                    <p>Definiciones estándar del modelo de servicios IKUSI</p>
                </div>
            </header>

            <div className="packages-section">
                <h2 className="section-title"><Package size={20} /> Paquetes Disponibles</h2>
                <div className="packages-grid">
                    {SERVICE_PACKAGES.map(pkg => (
                        <div key={pkg} className="card package-card">
                            <h3>{pkg}</h3>
                            <div className="package-icon">
                                <Shield size={32} color="var(--color-primary)" />
                            </div>
                            <p>Cobertura estándar para servicios {pkg.replace('IKUSI ', '')}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="slas-section">
                <h2 className="section-title"><Clock size={20} /> Acuerdos de Nivel de Servicio (ANS)</h2>
                <div className="slas-grid">
                    {SLA_TYPES.map(sla => (
                        <div key={sla.id} className={`card sla-card ${sla.id === 'Critico' ? 'critical' : ''}`}>
                            <div className="sla-header">
                                <h3>{sla.name}</h3>
                                {sla.id === 'Critico' && <span className="badge-critical">Prioridad Máxima</span>}
                            </div>
                            <div className="sla-body">
                                <div className="sla-metric">
                                    <span className="label">Atención</span>
                                    <span className="value">{sla.attention}</span>
                                </div>
                                <div className="sla-divider"></div>
                                <div className="sla-metric">
                                    <span className="label">Solución</span>
                                    <span className="value">{sla.solution}</span>
                                </div>
                            </div>
                            {sla.id === 'Customizado' && (
                                <p className="sla-note"><Info size={14} /> Definido según requerimientos específicos del contrato.</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
        .sla-packages {
          max-width: 1200px;
          margin: 0 auto;
        }
        .section-title {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 1.15rem;
          margin: 40px 0 20px 0;
          color: var(--text-main);
          font-weight: 700;
        }
        .packages-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 24px;
        }
        .package-card {
          text-align: center;
          padding: 32px;
          transition: all 0.2s ease-in-out;
          background: #fff;
          border-top: 3px solid var(--color-primary);
        }
        .package-card:hover {
          box-shadow: var(--shadow-md);
          transform: translateY(-4px);
        }
        .package-card h3 { margin-bottom: 20px; color: var(--text-main); font-weight: 700; font-size: 1rem; }
        .package-icon {
          margin-bottom: 20px;
          display: flex;
          justify-content: center;
        }
        .package-card p {
          font-size: 0.85rem;
          color: var(--text-muted);
          line-height: 1.5;
        }

        .slas-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
        }
        .sla-card {
          padding: 24px;
          background: #fff;
          border-top: 3px solid var(--color-secondary);
        }
        .sla-card.critical {
          border-top-color: var(--color-danger);
        }
        .sla-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        .sla-header h3 { font-size: 0.95rem; color: var(--text-main); margin: 0; font-weight: 700; }
        .badge-critical {
          font-size: 0.65rem;
          background: #fee2e2;
          color: var(--color-danger);
          padding: 3px 8px;
          border-radius: 4px;
          text-transform: uppercase;
          font-weight: 800;
        }
        .sla-body {
          display: flex;
          align-items: center;
        }
        .sla-metric {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .sla-metric .label {
          font-size: 0.7rem;
          color: var(--text-dim);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .sla-metric .value {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--color-secondary);
        }
        .sla-divider {
          width: 1px;
          height: 32px;
          background: var(--border-light);
          margin: 0 24px;
        }
        .sla-note {
          margin-top: 16px;
          font-size: 0.8rem;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 8px;
          font-style: italic;
        }
      `}</style>
        </div>
    );
};

export default SlaPackages;
