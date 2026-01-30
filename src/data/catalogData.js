export const SERVICE_CATALOG = [
    {
        id: 'SVC-001',
        category: 'Acceso y Seguridad',
        name: 'Solicitud de Acceso VPN',
        description: 'Solicitar acceso remoto seguro a la red corporativa.',
        icon: 'Shield',
        sla: 24, // hours
        formFields: ['Justificación', 'Fecha de Inicio', 'Fecha de Fin']
    },
    {
        id: 'SVC-002',
        category: 'Hardware',
        name: 'Renovación de Equipo',
        description: 'Solicitar reemplazo de laptop o desktop por obsolescencia.',
        icon: 'Laptop',
        sla: 72,
        formFields: ['Motivo', 'Modelo Solicitado', 'Centro de Costos']
    },
    {
        id: 'SVC-003',
        category: 'Software',
        name: 'Instalación de Software',
        description: 'Solicitar instalación de licencias (Office, Adobe, SAP).',
        icon: 'Disc',
        sla: 48,
        formFields: ['Nombre del Software', 'Versión', 'Justificación']
    },
    {
        id: 'SVC-004',
        category: 'Infraestructura',
        name: 'Aprovisionamiento de Servidor (VM)',
        description: 'Solicitar despliegue de nueva máquina virtual.',
        icon: 'Server',
        sla: 48,
        formFields: ['OS', 'CPU', 'RAM', 'Storage', 'Ambiente']
    },
    {
        id: 'SVC-005',
        category: 'Cuentas',
        name: 'Onboarding de Empleado',
        description: 'Creación de cuentas de correo, AD y accesos básicos.',
        icon: 'UserPlus',
        sla: 24,
        formFields: ['Nombre Completo', 'Cargo', 'Jefe Directo', 'Fecha de Ingreso']
    }
];
