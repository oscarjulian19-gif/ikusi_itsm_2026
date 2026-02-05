import React, { useState, useEffect } from 'react';
import { Users, Plus, Search, Filter, Shield, Briefcase, Trash2, Edit } from 'lucide-react';
import useUserStore from '../store/useUserStore';

const UsersList = () => {
    const { users, fetchUsers, addUser, updateUser, deleteUser, loading } = useUserStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    // Form Stats
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        role: 'Agente',
        job_title: 'Helpdesk',
        is_active: true
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const ROLES = [
        'Administrador',
        'Resolutor',
        'Agente',
        'Supervisor'
    ];

    const JOBS = [
        'Ingeniero soporte nivel 1',
        'Ingeniero soporte nivel 2',
        'Ingeniero soporte nivel 2.5',
        'Ingeniero delivery',
        'Helpdesk',
        'Coordinador de soporte',
        'Gerente de Ingeniería',
        'Director de Operaciones'
    ];

    const [isPermsModalOpen, setIsPermsModalOpen] = useState(false);
    const [selectedRoleForPerms, setSelectedRoleForPerms] = useState('Agente');

    // Permissions Definition
    const PERMISSIONS_DATA = {
        'Agente': [
            'Aperturar incidentes',
            'Aperturar requerimientos',
            'Generar reportes',
            'Subir un nuevo contrato',
            'Subir un nuevo CI'
        ],
        'Resolutor': [
            'Aperturar incidentes',
            'Aperturar requerimientos',
            'Generar reportes',
            'Subir un nuevo contrato',
            'Subir un nuevo CI',
            'Cerrar casos'
        ],
        'Supervisor': [
            'Aperturar incidentes',
            'Aperturar requerimientos',
            'Generar reportes',
            'Subir un nuevo contrato',
            'Subir un nuevo CI',
            'Cerrar casos',
            'Crear/modificar/borrar ANSs',
            'Crear/modificar/borrar Paquetes de servicio',
            'Crear/modificar/borrar Catalogos de servicio',
            'Gestionar Contratos (Full)',
            'Gestionar CIs (Full)'
        ],
        'Administrador': [
            'Aperturar incidentes',
            'Aperturar requerimientos',
            'Generar reportes',
            'Subir un nuevo contrato',
            'Subir un nuevo CI',
            'Cerrar casos',
            'Crear/modificar/borrar ANSs',
            'Crear/modificar/borrar Paquetes de servicio',
            'Crear/modificar/borrar Catalogos de servicio',
            'Gestionar Contratos (Full)',
            'Gestionar CIs (Full)',
            'Crear/modificar/borrar usuarios'
        ]
    };

    const ALL_POSSIBLE_PERMISSIONS = [
        'Aperturar incidentes', 'Aperturar requerimientos', 'Generar reportes',
        'Subir un nuevo contrato', 'Subir un nuevo CI', 'Cerrar casos',
        'Crear/modificar/borrar ANSs', 'Crear/modificar/borrar Paquetes de servicio',
        'Crear/modificar/borrar Catalogos de servicio',
        'Gestionar Contratos (Full)', 'Gestionar CIs (Full)',
        'Crear/modificar/borrar usuarios'
    ];

    const getRoleAvatar = (role) => {
        const style = { width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: '12px' };
        if (role === 'Administrador') return <div style={{ ...style, background: '#ef4444' }}>AD</div>;
        if (role === 'Supervisor') return <div style={{ ...style, background: '#f59e0b' }}>SV</div>;
        if (role === 'Resolutor') return <div style={{ ...style, background: '#3b82f6' }}>RS</div>;
        return <div style={{ ...style, background: '#10b981' }}>AG</div>;
    };

    const handleOpenModal = (user = null) => {
        if (user) {
            setEditingUser(user);
            setFormData(user);
        } else {
            setEditingUser(null);
            setFormData({
                full_name: '',
                email: '',
                role: 'Agente',
                job_title: 'Helpdesk',
                is_active: true
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingUser) {
                await updateUser(editingUser.id, formData);
            } else {
                await addUser(formData);
            }
            setIsModalOpen(false);
        } catch (error) {
            alert("Error al guardar usuario: " + error.message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Seguro que deseas eliminar este usuario?')) {
            await deleteUser(id);
        }
    };

    const filteredUsers = users.filter(u =>
        u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.job_title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="users-page">
            <header className="page-header compact-header">
                <div className="header-titles">
                    <h1><Users size={24} style={{ marginBottom: -4 }} /> Gestión de Usuarios</h1>
                    <p>Administración de roles y accesos del equipo</p>
                </div>
                <div className="header-actions" style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn-primary" onClick={() => setIsPermsModalOpen(true)}>
                        <Shield size={16} /> Permisos
                    </button>
                    <button className="btn-primary" onClick={() => handleOpenModal()}>
                        <Plus size={16} /> Nuevo Usuario
                    </button>
                </div>
            </header>

            <div className="panel data-panel">
                <div className="panel-toolbar">
                    <div className="search-group">
                        <Search size={14} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Buscar por Nombre, Email o Cargo..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="data-table modern-table">
                        <thead>
                            <tr>
                                <th>Nombre Completo</th>
                                <th>Email</th>
                                <th>Rol & Avatar</th>
                                <th>Cargo</th>
                                <th>Estado</th>
                                <th style={{ textAlign: 'right' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map(user => (
                                <tr key={user.id} className="hover-glow">
                                    <td className="font-bold">{user.full_name}</td>
                                    <td className="text-muted-sm">{user.email}</td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            {getRoleAvatar(user.role)}
                                            <span className={`badge-pill role ${user.role.toLowerCase()}`}>
                                                {user.role}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="text-accent">
                                        <Briefcase size={12} style={{ marginRight: 6, verticalAlign: 'text-bottom' }} />
                                        {user.job_title}
                                    </td>
                                    <td>
                                        <span className={`status-dot ${user.is_active ? 'activo' : 'suspendido'}`}></span>
                                        {user.is_active ? 'Activo' : 'Inactivo'}
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <button className="btn-icon" onClick={() => handleOpenModal(user)}><Edit size={14} /></button>
                                        <button className="btn-icon danger" onClick={() => handleDelete(user.id)}><Trash2 size={14} /></button>
                                    </td>
                                </tr>
                            ))}
                            {filteredUsers.length === 0 && (
                                <tr><td colSpan="6" className="empty-state">No hay usuarios registrados</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* User Modal */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content card">
                        <div className="modal-header">
                            <h3>{editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}</h3>
                            <button className="close-btn" onClick={() => setIsModalOpen(false)}>×</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            {/* Form fields existing ... */}
                            <div className="form-group">
                                <label>Nombre Completo</label>
                                <input value={formData.full_name} onChange={e => setFormData({ ...formData, full_name: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Email Corporativo</label>
                                <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
                            </div>
                            <div className="grid-2">
                                <div className="form-group">
                                    <label>Rol de Sistema</label>
                                    <select value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}>
                                        {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Cargo</label>
                                    <select value={formData.job_title} onChange={e => setFormData({ ...formData, job_title: e.target.value })}>
                                        {JOBS.map(j => <option key={j} value={j}>{j}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-ghost" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                                <button type="submit" className="btn-primary">{editingUser ? 'Actualizar' : 'Crear'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Permissions Modal */}
            {isPermsModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content card" style={{ maxWidth: '600px' }}>
                        <div className="modal-header">
                            <h3>Gestión de Permisos y Roles</h3>
                            <button className="close-btn" onClick={() => setIsPermsModalOpen(false)}>×</button>
                        </div>
                        <div className="perms-body">
                            <div className="form-group mb-4">
                                <label>Seleccione Rol para ver Permisos:</label>
                                <select
                                    className="role-selector"
                                    value={selectedRoleForPerms}
                                    onChange={(e) => setSelectedRoleForPerms(e.target.value)}
                                >
                                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                            </div>

                            <div className="permissions-checklist">
                                <h4>Lista de Accesos Habilitados:</h4>
                                <div className="checklist-grid">
                                    {ALL_POSSIBLE_PERMISSIONS.map(perm => {
                                        const isEnabled = PERMISSIONS_DATA[selectedRoleForPerms]?.includes(perm);
                                        return (
                                            <label key={perm} className={`checklist-item ${isEnabled ? 'enabled' : 'disabled'}`}>
                                                <input type="checkbox" checked={isEnabled} readOnly />
                                                <span className="perm-label">{perm}</span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                        <div className="modal-actions">
                            <button className="btn-primary" onClick={() => setIsPermsModalOpen(false)}>Cerrar</button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .users-page { max-width: 1200px; margin: 0 auto; padding-bottom: 40px; }
                
                .badge-pill.role { background: rgba(0,0,0,0.05); border: 1px solid #cbd5e1; display: inline-flex; align-items: center; padding: 4px 10px; border-radius: 12px; font-weight: 700; font-size: 0.75rem; color: #334155; }
                
                .btn-icon { background: transparent; border: none; color: #64748b; cursor: pointer; padding: 6px; border-radius: 4px; transition: all 0.2s; }
                .btn-icon:hover { color: #020617; background: #e2e8f0; }
                .btn-icon.danger:hover { color: #ef4444; background: #fee2e2; }

                /* Modal Styles */
                .modal-overlay {
                    position: fixed; inset: 0; background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px);
                    display: flex; align-items: center; justify-content: center; z-index: 1000;
                }
                .modal-content {
                    width: 100%; max-width: 500px; padding: 32px;
                    /* Card styles inherited from global, ensuring relief */
                }
                .modal-header { display: flex; justify-content: space-between; margin-bottom: 24px; align-items: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; }
                .modal-header h3 { margin: 0; color: #020617; font-size: 1.25rem; font-weight: 800; }
                .close-btn { background: none; border: none; color: #64748b; font-size: 1.8rem; cursor: pointer; }
                
                .form-group { margin-bottom: 20px; }
                .form-group label { display: block; color: #334155; font-size: 0.85rem; font-weight: 700; margin-bottom: 8px; }
                
                .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
                .modal-actions { display: flex; justify-content: flex-end; gap: 16px; margin-top: 32px; border-top: 1px solid #e2e8f0; padding-top: 16px; }
                
                /* Permissions Checklist Relief Styles */
                .permissions-checklist {
                    background: #f8fafc;
                    border: 1px solid #cbd5e1;
                    /* Inset relief for container */
                    box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);
                    border-radius: 8px;
                    padding: 16px;
                    max-height: 300px;
                    overflow-y: auto;
                }
                .permissions-checklist h4 { margin-top: 0; font-size: 0.9rem; color: #475569; margin-bottom: 12px; }
                .checklist-grid { display: grid; grid-template-columns: 1fr; gap: 8px; }
                
                .checklist-item {
                    display: flex; align-items: center; gap: 10px;
                    padding: 8px 12px;
                    border-radius: 6px;
                    transition: all 0.1s;
                    border: 1px solid transparent;
                }
                .checklist-item.enabled {
                    background: #fff;
                    border-color: #cbd5e1;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.05); /* Relief for items */
                }
                .checklist-item.disabled {
                    opacity: 0.5;
                }
                .perm-label { font-size: 0.85rem; font-weight: 500; color: #1e293b; }
                /* Table Grid Lines */
                .data-table th, .data-table td {
                    border-bottom: 1px solid #e2e8f0;
                    border-right: 1px solid #e2e8f0;
                }
                .data-table th:last-child, .data-table td:last-child {
                    border-right: none;
                }
                .data-table {
                    border: 1px solid #e2e8f0;
                }
            `}</style>
        </div>
    );
};

export default UsersList;
