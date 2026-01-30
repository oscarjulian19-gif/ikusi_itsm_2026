import React from 'react';
import { Bell, Search, User } from 'lucide-react';

const Topbar = () => {
    return (
        <header className="topbar">
            <div className="topbar-search">
                <Search size={18} className="search-icon" />
                <input type="text" placeholder="Buscar casos, CIs, soluciones..." className="search-input" />
            </div>

            <div className="topbar-actions">
                <button className="action-btn">
                    <Bell size={20} />
                    <span className="badge">3</span>
                </button>
                <div className="user-profile">
                    <div className="avatar">AO</div>
                    <span className="username">Admin Operator</span>
                </div>
            </div>

            <style>{`
        .topbar {
          height: var(--header-height);
          background-color: var(--bg-panel);
          border-bottom: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 var(--spacing-lg);
        }

        .topbar-search {
          position: relative;
          width: 400px;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }

        .search-input {
          width: 100%;
          background: var(--bg-dark);
          border: 1px solid var(--border-color);
          border-radius: 20px;
          padding: 8px 16px 8px 40px;
          color: #fff;
          outline: none;
          transition: border-color 0.3s;
        }

        .search-input:focus {
          border-color: var(--color-primary);
          box-shadow: 0 0 5px rgba(57, 255, 20, 0.2);
        }

        .topbar-actions {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
        }

        .action-btn {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          position: relative;
        }

        .action-btn:hover {
          color: #fff;
        }

        .badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background: var(--color-primary);
          color: #000;
          font-size: 10px;
          width: 16px;
          height: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          font-weight: bold;
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
        }

        .avatar {
          width: 32px;
          height: 32px;
          background: #333;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: bold;
          border: 1px solid var(--color-primary);
        }

        .username {
          font-size: 0.9rem;
          font-weight: 500;
        }
      `}</style>
        </header>
    );
};

export default Topbar;
