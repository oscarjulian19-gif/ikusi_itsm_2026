export const SERVICE_PACKAGES = [
    'COL_BAS',
    'COL_GO',
    'COL_PLUS',
    'COL_PRO',
    'COL_SUM',
    'IKUSI Servicio Customizado'
];

export const SLA_TYPES = [
    {
        id: 'Bajo',
        name: 'SLA Bajo',
        attention: '1 Hora',
        solution: '24 Horas',
        attentionMin: 60,
        solutionHours: 24
    },
    {
        id: 'Medio',
        name: 'SLA Medio',
        attention: '45 Minutos',
        solution: '12 Horas',
        attentionMin: 45,
        solutionHours: 12
    },
    {
        id: 'Alto',
        name: 'SLA Alto',
        attention: '30 Minutos',
        solution: '8 Horas',
        attentionMin: 30,
        solutionHours: 8
    },
    {
        id: 'Critico',
        name: 'SLA Crítico',
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
