export const CLIENTS = [
    { id: 'C001', name: 'Banco Futuro' },
    { id: 'C002', name: 'Retail Global S.A.' },
    { id: 'C003', name: 'Logística Express' }
];

export const PEPS = [
    { id: 'PEP-001', name: 'Migración Cloud 2025' },
    { id: 'PEP-002', name: 'Soporte Operativo Q1' },
    { id: 'PEP-003', name: 'Ciberseguridad Audit' },
    { id: 'PEP-004', name: 'Implementación SAP' },
    { id: 'PEP-005', name: 'Redes SD-WAN' },
    { id: 'PEP-006', name: 'Renovación Licencias' },
    { id: 'PEP-007', name: 'Desarrollo App Móvil' },
    { id: 'PEP-008', name: 'Mantenimiento DataCenter' },
    { id: 'PEP-009', name: 'Consultoría DevOps' },
    { id: 'PEP-010', name: 'Capacitación Personal' }
];

export const ARCHITECTURES = [
    'Cloud AWS', 'Cloud Azure', 'On-Premise', 'Híbrida', 'Redes Corporativas', 'Seguridad Perimetral'
];

export const TEAMS = [
    'Mesa de Ayuda L1', 'Soporte Servidores L2', 'Redes y Comms L2', 'Ciberseguridad L3', 'Arquitectura'
];

export const PRIORITIES = [
    { id: 'P1', name: 'Crítica', sla: 4 }, // Hours
    { id: 'P2', name: 'Alta', sla: 8 },
    { id: 'P3', name: 'Media', sla: 24 },
    { id: 'P4', name: 'Baja', sla: 48 }
];

export const STATUS_FLOW = {
    incident: ['Nuevo', 'Asignado', 'En Progreso', 'En Espera', 'Resuelto', 'Cerrado'],
    request: ['Solicitud', 'Aprobación', 'En Cumplimiento', 'Cerrado']
};

export const INITIAL_CIS = [
    { id: 'CI-1001', name: 'Svr-Prod-DB-01', type: 'Server', vendor: 'Dell', model: 'PowerEdge', environment: 'Production', criticality: 'High' },
    { id: 'CI-1002', name: 'FW-Perimeter-01', type: 'Firewall', vendor: 'Fortinet', model: 'Gate 200F', environment: 'Production', criticality: 'High' },
    { id: 'CI-1003', name: 'Sw-Core-01', type: 'Switch', vendor: 'Cisco', model: 'Catalyst 9300', environment: 'Production', criticality: 'High' },
    { id: 'CI-1004', name: 'VM-App-CRM', type: 'Virtual Machine', vendor: 'VMware', model: 'vSphere 7', environment: 'Staging', criticality: 'Medium' },
    { id: 'CI-1005', name: 'Router-Edge-01', type: 'Router', vendor: 'Cisco', model: 'ISR 4000', environment: 'Production', criticality: 'High' }
];

// Mock subset of 200 cases
export const INITIAL_CASES = [
    {
        id: 'INC-10001',
        type: 'incident',
        title: 'Caída de base de datos principal',
        client: 'Banco Futuro',
        pep: 'PEP-002',
        architecture: 'On-Premise',
        priority: 'P1',
        status: 'Cerrado',
        assignedTeam: 'Soporte Servidores L2',
        createdAt: '2025-10-01T08:00:00Z',
        updatedAt: '2025-10-01T11:30:00Z',
        description: 'La base de datos de producción no responde a ping.'
    },
    {
        id: 'REQ-20001',
        type: 'request',
        title: 'Nuevo usuario VPN',
        client: 'Retail Global S.A.',
        pep: 'PEP-005',
        architecture: 'Seguridad Perimetral',
        priority: 'P3',
        status: 'Cerrado',
        assignedTeam: 'Redes y Comms L2',
        createdAt: '2025-10-02T09:00:00Z',
        updatedAt: '2025-10-02T16:00:00Z',
        description: 'Crear acceso VPN para empleado temporal.'
    },
    {
        id: 'INC-10002',
        type: 'incident',
        title: 'Lentitud en CRM',
        client: 'Logística Express',
        pep: 'PEP-004',
        architecture: 'Cloud Azure',
        priority: 'P2',
        status: 'En Progreso',
        assignedTeam: 'Mesa de Ayuda L1',
        createdAt: '2026-01-29T14:00:00Z',
        updatedAt: '2026-01-30T08:00:00Z',
        description: 'Usuarios reportan lentitud al cargar fichas de clientes.'
    },
    {
        id: 'INC-10003',
        type: 'incident',
        title: 'Fallo en backup nocturno',
        client: 'Banco Futuro',
        pep: 'PEP-008',
        architecture: 'On-Premise',
        priority: 'P3',
        status: 'Nuevo',
        assignedTeam: 'Soporte Servidores L2',
        createdAt: '2026-01-30T06:00:00Z',
        updatedAt: '2026-01-30T06:00:00Z',
        description: 'El job de backup falló con código de error 55.'
    }
];
