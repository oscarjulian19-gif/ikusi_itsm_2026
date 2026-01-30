import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    AlertCircle,
    FileText,
    Server,
    BookOpen,
    BarChart2,
    Settings
} from 'lucide-react';

const Sidebar = () => {
    const menuItems = [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard },
        { name: 'Incidentes', path: '/incidents', icon: AlertCircle },
        { name: 'Requerimientos', path: '/requests', icon: FileText },
        { name: 'CMDB', path: '/cmdb', icon: Server },
        { name: 'ITIL Practices', path: '/itil', icon: BookOpen },
        { name: 'Reportes', path: '/reports', icon: BarChart2 },
        { name: 'Configuración', path: '/settings', icon: Settings },
    ];

    return (
        <aside className="sidebar">
            <div className="branding">
                <div className="logo-placeholder">I</div>
                <span className="brand-name">IKUSI <span>Service</span></span>
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
          background-color: var(--bg-panel);
          border-right: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          height: 100vh;
        }

        .branding {
          height: var(--header-height);
          display: flex;
          align-items: center;
          padding: 0 var(--spacing-md);
          border-bottom: 1px solid var(--border-color);
        }

        .logo-placeholder {
          width: 32px;
          height: 32px;
          background: var(--color-primary);
          color: #000;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          margin-right: 12px;
          box-shadow: 0 0 10px var(--color-primary-glow);
        }

        .brand-name {
          font-size: 1.2rem;
          font-weight: 700;
          color: #fff;
          letter-spacing: 1px;
        }

        .brand-name span {
          color: var(--color-primary);
        }

        .nav-menu {
          flex: 1;
          padding: var(--spacing-md) 0;
          overflow-y: auto;
        }

        .nav-item {
          display: flex;
          align-items: center;
          padding: 12px var(--spacing-md);
          color: var(--text-muted);
          transition: all 0.2s;
          border-left: 3px solid transparent;
        }

        .nav-item:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.03);
        }

        .nav-item.active {
          color: var(--color-primary);
          background: rgba(57, 255, 20, 0.05);
          border-left-color: var(--color-primary);
        }

        .nav-icon {
          margin-right: 12px;
        }

        .sidebar-footer {
          padding: var(--spacing-md);
          border-top: 1px solid var(--border-color);
          text-align: center;
          font-size: 0.8rem;
          color: var(--text-muted);
        }
      `}</style>
        </aside>
    );
};

export default Sidebar;
