import React, { useState } from 'react';
import { Bell, Search, User, LogOut, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';

const Topbar = () => {
  const [query, setQuery] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleSearch = (e) => {
    if (e.key === 'Enter' && query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setQuery('');
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <header className="topbar">
      <div className="topbar-search">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          placeholder="Buscar PEP, Folio, Activo, Ticket..."
          className="search-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleSearch}
        />
      </div>

      <div className="topbar-actions">
        <button className="action-btn">
          <Bell size={20} />
          <span className="badge">3</span>
        </button>
        <div className="relative">
          <div className="user-profile" onClick={() => setShowMenu(!showMenu)}>
            <div className="avatar" style={{ backgroundColor: user?.role === 'Admin' ? '#0D2472' : '#6DBE45' }}>
              {getInitials(user?.full_name)}
            </div>
            <div className="hidden lg:block">
              <span className="username" style={{ display: 'block' }}>{user?.full_name || 'Usuario'}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user?.role}</span>
            </div>
            <ChevronDown size={14} className={`transition-transform ${showMenu ? 'rotate-180' : ''}`} />
          </div>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-2xl py-2 z-50 animate-fade-in">
              <button
                className="w-full text-left px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-3 font-semibold"
                onClick={() => { logout(); navigate('/login'); }}
              >
                <LogOut size={16} className="text-red-500" /> Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .topbar {
          height: var(--header-height);
          background: #ffffff;
          border-bottom: 1px solid var(--border-light);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 var(--spacing-xl);
          z-index: 40;
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
          color: var(--text-dim);
          width: 14px;
          height: 14px;
        }

        .search-input {
          width: 100%;
          background: #f1f5f9;
          border: 1px solid transparent;
          border-radius: var(--radius-md);
          padding: 8px 16px 8px 36px;
          color: var(--text-main);
          outline: none;
          font-size: 0.85rem;
          transition: all 0.2s;
        }

        .search-input:focus {
          border-color: var(--color-primary);
          background: #fff;
          box-shadow: 0 0 0 2px var(--color-primary-glow);
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
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: 0.2s;
        }

        .action-btn:hover {
          background: #f1f5f9;
          color: var(--text-main);
        }

        .badge {
          position: absolute;
          top: 8px;
          right: 8px;
          background: var(--color-danger);
          color: #fff;
          font-size: 8px;
          width: 14px;
          height: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          font-weight: 700;
          border: 2px solid #fff;
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          padding: 4px;
          border-radius: var(--radius-full);
          transition: 0.2s;
        }

        .user-profile:hover {
          background: #f1f5f9;
        }

        .avatar {
          width: 32px;
          height: 32px;
          background: #2563eb;
          color: #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 700;
        }

        .username {
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--text-main);
          display: none; /* Hide text to match screenshot style */
        }
        
        @media (min-width: 1024px) {
          .username { display: block; }
        }
      `}</style>
    </header>
  );
};

export default Topbar;
