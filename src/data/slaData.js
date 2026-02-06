export const SERVICE_PACKAGES = [
    'IKUSI Básico',
    'IKUSI Go',
    'IKUSI Plus',
    'IKUSI Pro',
    'IKUSI Sum',
    'IKUSI Servicio Customizado'
];

export const PRIORITY_LEVELS = [
    { id: 'P1', name: 'Afectación total del servicio' },
    { id: 'P2', name: 'Afectación Parcial del servicio' },
    { id: 'P3', name: 'Servicio disponible con riesgo de tener afectación' },
    { id: 'P4', name: 'Consulta' }
];

export const SLA_TYPES = [
    {
        id: 'Bajo',
        name: 'SLA Bajo (P3/P4)',
        attention: '1 Hora',
        solution: '24 Horas',
        attentionMin: 60,
        solutionHours: 24
    },
    {
        id: 'Medio',
        name: 'SLA Medio (P2)',
        attention: '45 Minutos',
        solution: '12 Horas',
        attentionMin: 45,
        solutionHours: 12
    },
    {
        id: 'Alto',
        name: 'SLA Alto (P1)',
        attention: '30 Minutos',
        solution: '8 Horas',
        attentionMin: 30,
        solutionHours: 8
    },
    {
        id: 'Critico',
        name: 'SLA Crítico (24x7 P1)',
        attention: '15 Minutos',
        solution: '4 Horas',
        attentionMin: 15,
        solutionHours: 4
    },
    {
        id: 'Customizado',
        name: 'SLA Customizado',
        attention: 'X Minutos',
        solution: 'X Horas',
        attentionMin: 0,
        solutionHours: 0
    }
];
