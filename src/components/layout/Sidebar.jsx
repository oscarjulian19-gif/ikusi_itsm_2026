import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  AlertCircle,
  FileText,
  Server,
  BookOpen,
  BarChart2,
  Package,
  Settings,
  Users
} from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Incidentes', path: '/incidents', icon: AlertCircle },
    { name: 'Requerimientos', path: '/requests', icon: FileText },
    { name: 'Catálogo', path: '/catalog', icon: BookOpen },
    { name: 'CMDB', path: '/cmdb', icon: Server },
    { name: 'ITIL Practices', path: '/itil', icon: BookOpen },
    { name: 'Reportes', path: '/reports', icon: BarChart2 },
    { name: 'Contratos', path: '/contracts', icon: FileText },
    { name: 'Paquetes y ANS', path: '/sla-packages', icon: Package },
    { name: 'Usuarios', path: '/users', icon: Users },
    { name: 'Configuración', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="sidebar">
      <div className="branding">
        <img src="/ikusi-logo.png" alt="Ikusi Logo" className="brand-logo" />
      </div>

      <nav className="nav-menu">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <item.icon size={20} className="nav-icon" />
            <span className="nav-label">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <p>MVP v0.1</p>
      </div>

      <style>{`
        .sidebar {
          width: var(--sidebar-width);
          background: #ffffff;
          border-right: 1px solid var(--border-light);
          display: flex;
          flex-direction: column;
          height: 100vh;
          box-shadow: 2px 0 8px rgba(0,0,0,0.02);
        }

        .branding {
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--spacing-md);
          background: #fff;
          border-bottom: 2px solid var(--border-light);
          margin-bottom: var(--spacing-xs);
        }

        .brand-logo {
          height: 40px;
          width: auto;
          object-fit: contain;
        }

        .nav-menu {
          flex: 1;
          padding: var(--spacing-md) var(--spacing-sm);
          overflow-y: auto;
        }

        .nav-item {
          display: flex;
          align-items: center;
          padding: 10px 14px;
          color: #1e293b;
          transition: all 0.2s;
          border-radius: var(--radius-md);
          margin-bottom: 4px;
          font-size: 0.95rem;
          font-weight: 600;
          text-decoration: none;
        }

        .nav-item:hover {
          color: var(--color-primary);
          background: #f8fafc;
        }

        .nav-item.active {
          color: var(--color-primary);
          background: #ecfdf5;
          font-weight: 700;
          box-shadow: inset 3px 0 0 var(--color-primary);
        }

        .nav-icon {
          margin-right: 12px;
          width: 18px;
          height: 18px;
          opacity: 0.8;
        }

        .active .nav-icon {
          opacity: 1;
          color: var(--color-primary);
        }

        .sidebar-footer {
          padding: var(--spacing-md);
          border-top: 1px solid var(--border-light);
          text-align: center;
          font-size: 0.7rem;
          color: var(--text-dim);
          background: #fcfcfc;
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;
