import React from 'react';

const ComingSoon = ({ title }) => {
    return (
        <div className="coming-soon">
            <div className="card glass-panel">
                <h1>{title}</h1>
                <p>Este módulo está en construcción para el MVP.</p>
                <div className="progress-bar">
                    <div className="progress-fill"></div>
                </div>
            </div>
            <style>{`
        .coming-soon {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
        }
        .glass-panel {
          padding: 40px;
          text-align: center;
          max-width: 500px;
        }
        h1 {
          margin-bottom: 16px;
          color: var(--color-primary);
          text-shadow: 0 0 10px var(--color-primary-glow);
        }
        p {
          color: var(--text-muted);
          margin-bottom: 24px;
        }
        .progress-bar {
          width: 100%;
          height: 4px;
          background: #333;
          border-radius: 2px;
          overflow: hidden;
        }
        .progress-fill {
          width: 30%;
          height: 100%;
          background: var(--color-primary);
          box-shadow: 0 0 10px var(--color-primary);
          animation: loading 2s infinite ease-in-out;
        }
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
        </div>
    );
};

export default ComingSoon;
