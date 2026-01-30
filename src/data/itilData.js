export const ITIL_PRACTICES = [
    // General Management Practices (14)
    { id: 'GP-01', name: 'Architecture Management', category: 'General', owner: 'Chief Architect', status: 'Active', kpi: 'Architecture compliance rate' },
    { id: 'GP-02', name: 'Continual Improvement', category: 'General', owner: 'Quality Manager', status: 'Active', kpi: 'Improvement initiatives implemented' },
    { id: 'GP-03', name: 'Information Security Management', category: 'General', owner: 'CISO', status: 'Active', kpi: 'Security incidents per month' },
    { id: 'GP-04', name: 'Knowledge Management', category: 'General', owner: 'KM Lead', status: 'Inactive', kpi: 'Knowledge articles created' },
    { id: 'GP-05', name: 'Measurement and Reporting', category: 'General', owner: 'Ops Manager', status: 'Active', kpi: 'Reports delivered on time' },
    { id: 'GP-06', name: 'Organizational Change Management', category: 'General', owner: 'HR Lead', status: 'Inactive', kpi: 'Change adoption rate' },
    { id: 'GP-07', name: 'Portfolio Management', category: 'General', owner: 'PMO Lead', status: 'Active', kpi: 'Portfolio ROI' },
    { id: 'GP-08', name: 'Project Management', category: 'General', owner: 'PMO Lead', status: 'Active', kpi: 'Projects delivered on time/budget' },
    { id: 'GP-09', name: 'Relationship Management', category: 'General', owner: 'Account Manager', status: 'Active', kpi: 'Customer satisfaction score' },
    { id: 'GP-10', name: 'Risk Management', category: 'General', owner: 'Risk Officer', status: 'Active', kpi: 'Risks mitigated' },
    { id: 'GP-11', name: 'Service Financial Management', category: 'General', owner: 'CFO', status: 'Active', kpi: 'Budget variance' },
    { id: 'GP-12', name: 'Strategy Management', category: 'General', owner: 'CIO', status: 'Active', kpi: 'Strategic objectives met' },
    { id: 'GP-13', name: 'Supplier Management', category: 'General', owner: 'Procurement Lead', status: 'Active', kpi: 'Supplier performance score' },
    { id: 'GP-14', name: 'Workforce and Talent Management', category: 'General', owner: 'HR Lead', status: 'Inactive', kpi: 'Employee retention rate' },

    // Service Management Practices (17)
    { id: 'SP-01', name: 'Availability Management', category: 'Service', owner: 'Ops Manager', status: 'Active', kpi: 'Service availability %' },
    { id: 'SP-02', name: 'Business Analysis', category: 'Service', owner: 'Product Owner', status: 'Inactive', kpi: 'Requirements approved' },
    { id: 'SP-03', name: 'Capacity and Performance Management', category: 'Service', owner: 'Ops Manager', status: 'Active', kpi: 'Capacity incidents' },
    { id: 'SP-04', name: 'Change Control', category: 'Service', owner: 'Change Manager', status: 'Active', kpi: 'Successful changes %' },
    { id: 'SP-05', name: 'Incident Management', category: 'Service', owner: 'Service Desk Lead', status: 'Active', kpi: 'MTTR (Mean Time to Resolve)', link: '/incidents' },
    { id: 'SP-06', name: 'IT Asset Management', category: 'Service', owner: 'Asset Manager', status: 'Active', kpi: 'Asset accuracy %', link: '/cmdb' },
    { id: 'SP-07', name: 'Monitoring and Event Management', category: 'Service', owner: 'NOC Lead', status: 'Active', kpi: 'Events correlated' },
    { id: 'SP-08', name: 'Problem Management', category: 'Service', owner: 'Problem Manager', status: 'Active', kpi: 'Problems resolved' },
    { id: 'SP-09', name: 'Release Management', category: 'Service', owner: 'Release Manager', status: 'Active', kpi: 'Release success rate' },
    { id: 'SP-10', name: 'Service Catalogue Management', category: 'Service', owner: 'Catalog Manager', status: 'Active', kpi: 'Catalog views', link: '/requests' },
    { id: 'SP-11', name: 'Service Configuration Management', category: 'Service', owner: 'CMDB Owner', status: 'Active', kpi: 'CI accuracy', link: '/cmdb' },
    { id: 'SP-12', name: 'Service Continuity Management', category: 'Service', owner: 'BCP Lead', status: 'Inactive', kpi: 'Recovery time actual' },
    { id: 'SP-13', name: 'Service Design', category: 'Service', owner: 'Architect', status: 'Inactive', kpi: 'Designs approved' },
    { id: 'SP-14', name: 'Service Desk', category: 'Service', owner: 'Service Desk Lead', status: 'Active', kpi: 'First contact resolution' },
    { id: 'SP-15', name: 'Service Level Management', category: 'Service', owner: 'SLM Manager', status: 'Active', kpi: 'SLA attributes met' },
    { id: 'SP-16', name: 'Service Request Management', category: 'Service', owner: 'Service Desk Lead', status: 'Active', kpi: 'Requests fulfilled', link: '/requests' },
    { id: 'SP-17', name: 'Service Validation and Testing', category: 'Service', owner: 'QA Lead', status: 'Active', kpi: 'Defects found in prod' },

    // Technical Management Practices (3)
    { id: 'TP-01', name: 'Deployment Management', category: 'Technical', owner: 'DevOps Lead', status: 'Active', kpi: 'Deployment frequency' },
    { id: 'TP-02', name: 'Infrastructure and Platform Management', category: 'Technical', owner: 'Cloud Lead', status: 'Active', kpi: 'Uptime %' },
    { id: 'TP-03', name: 'Software Development and Management', category: 'Technical', owner: 'Dev Lead', status: 'Active', kpi: 'Lead time for changes' }
];
