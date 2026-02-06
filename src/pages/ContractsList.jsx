import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Plus, Search, Filter, Upload, FileSpreadsheet, Briefcase, Loader, FileJson, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import useContractStore from '../store/useContractStore';
import useSlaStore from '../store/useSlaStore';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ContractsList = () => {
    const navigate = useNavigate();
    const { contracts, total, uploadContracts, fetchContracts, loading, error } = useContractStore();
    const { slas, fetchSlas } = useSlaStore();
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(100);
    const [uploading, setUploading] = useState(false);

    // Advanced Table State
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [filters, setFilters] = useState({});

    useEffect(() => {
        fetchContracts();
        fetchSlas();
    }, []);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!confirm("Este archivo se cargará en el servidor para procesamiento masivo. ¿Continuar?")) return;
        setUploading(true);
        try {
            await uploadContracts(file);
            alert("Carga completada.");
            fetchContracts();
        } catch (err) {
            alert("Error: " + err.message);
        } finally {
            setUploading(false);
            e.target.value = null;
        }
    };

    const handleExportExcel = () => {
        const ws = XLSX.utils.json_to_sheet(processedContracts);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Contratos");
        XLSX.writeFile(wb, "Contratos_Export.xlsx");
    };

    const handleExportPDF = () => {
        const doc = new jsPDF('landscape');
        doc.text("Reporte de Contratos", 14, 15);
        doc.autoTable({
            head: [['ID', 'Cliente', 'ANS', 'Proyecto', 'Estado', 'Inicio', 'Fin', 'SDM']],
            body: processedContracts.map(c => [c.id, c.client, c.ans || 'N/A', c.projectName, c.status, c.startDate, c.endDate, c.sdm]),
            startY: 20
        });
        doc.save("Contratos_Reporte.pdf");
    };

    // Sort & Filter Logic
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPage(0);
    };

    const processedContracts = useMemo(() => {
        let data = [...contracts];

        // Filter
        Object.keys(filters).forEach(key => {
            if (filters[key]) {
                const searchLower = filters[key].toLowerCase();
                data = data.filter(item => {
                    const val = item[key] ? String(item[key]).toLowerCase() : '';
                    return val.includes(searchLower);
                });
            }
        });

        // Sort
        if (sortConfig.key) {
            data.sort((a, b) => {
                const aVal = a[sortConfig.key] || '';
                const bVal = b[sortConfig.key] || '';
                if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return data;
    }, [contracts, filters, sortConfig]);

    // Pagination (Client Side for now as per previous logic, but ideally server)
    const paginatedContracts = processedContracts.slice(page * pageSize, (page + 1) * pageSize);

    const renderHeader = (label, key) => (
        <th>
            <div className="th-content">
                <div className="th-top" onClick={() => handleSort(key)}>
                    <span>{label}</span>
                    {sortConfig.key === key ? (
                        sortConfig.direction === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />
                    ) : <ArrowUpDown size={12} className="sort-icon-idle" />}
                </div>
                <input
                    type="text"
                    className="th-filter"
                    placeholder="Filtrar..."
                    value={filters[key] || ''}
                    onChange={(e) => handleFilterChange(key, e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                />
            </div>
        </th>
    );

    return (
        <div className="contracts-page animate-fade">
            <div className="page-header-clean">
                <div className="header-title">
                    <h1>Gestión de Contratos</h1>
                    <p>Base instalada y acuerdos de servicio ({total})</p>
                </div>
                <div className="header-actions">
                    <button className="btn-secondary" onClick={() => fetchContracts()} title="Refrescar">
                        <Loader size={16} className={loading ? "animate-spin" : ""} />
                    </button>
                    <button className="btn-secondary" onClick={handleExportExcel} title="Exportar Excel">
                        <FileSpreadsheet size={16} />
                    </button>
                    <button className="btn-secondary" onClick={handleExportPDF} title="Exportar PDF">
                        <FileJson size={16} />
                    </button>
                    <label className={`btn-secondary ${uploading ? 'opacity-50' : ''}`} style={{ cursor: 'pointer' }}>
                        <Upload size={16} /> {uploading ? '...' : 'Importar'}
                        <input type="file" hidden accept=".csv, .xlsx" onChange={handleFileUpload} disabled={uploading} />
                    </label>
                    <button className="btn-primary" onClick={() => navigate('/contracts/new')}>
                        <Plus size={16} /> Nuevo Contrato
                    </button>
                </div>
            </div>

            <div className="card table-card corporate-section">
                <div className="table-wrapper">
                    {loading && <div className="loading-overlay"><Loader className="animate-spin" /></div>}
                    <table className="neon-table-clean">
                        <thead>
                            <tr>
                                {renderHeader('Número de Contrato', 'id')}
                                {renderHeader('Contrato Snow', 'snowContract')}
                                {renderHeader('Cliente', 'client')}
                                {renderHeader('Descripción Contrato', 'description')}
                                {renderHeader('Folio', 'folio')}
                                {renderHeader('ANS ASOCIADO', 'slaType')}
                                {renderHeader('Nombre de Proyecto', 'projectName')}
                                {renderHeader('PEP', 'pep')}
                                {renderHeader('Estado', 'status')}
                                {renderHeader('Inicio Contrato', 'startDate')}
                                {renderHeader('Fin Contrato', 'endDate')}
                                {renderHeader('Project Manager', 'pm')}
                                {renderHeader('Paquete de Servicio', 'servicePackage')}
                                {renderHeader('Descripción del paquete de servicio', 'packageDescription')}
                                {renderHeader('Horario Paquete de Servicio', 'schedule')}
                                {renderHeader('SDM', 'sdm')}
                                {renderHeader('Vendor', 'salesRep')}
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedContracts.map(contract => (
                                <tr key={contract.id} onClick={() => navigate(`/contracts/${contract.id}`)} className="table-row-clean">
                                    <td className="font-mono font-bold text-primary">{contract.id}</td>
                                    <td className="text-sm font-semibold text-secondary">{contract.snowContract || '-'}</td>
                                    <td className="font-bold">{contract.client}</td>
                                    <td className="text-sm text-truncate" style={{ maxWidth: '200px' }} title={contract.description}>{contract.description || '-'}</td>
                                    <td className="text-sm">{contract.folio || '-'}</td>
                                    <td className="text-sm font-semibold text-secondary">
                                        {slas.find(s => s.id === contract.slaType)?.name || contract.slaType || '-'}
                                    </td>
                                    <td className="text-sm">{contract.projectName || '-'}</td>
                                    <td className="font-mono text-muted-sm">{contract.pep}</td>
                                    <td>
                                        <span className={`status-pill ${contract.status?.toLowerCase()}`}>
                                            {contract.status}
                                        </span>
                                    </td>
                                    <td className="font-mono text-muted-sm">{contract.startDate ? contract.startDate.split('T')[0] : '-'}</td>
                                    <td className="font-mono text-muted-sm">{contract.endDate ? contract.endDate.split('T')[0] : '-'}</td>

                                    <td className="text-sm">{contract.pm || '-'}</td>
                                    <td className="text-sm">{contract.servicePackage || '-'}</td>
                                    <td className="text-sm text-truncate" style={{ maxWidth: '200px' }} title={contract.packageDescription}>{contract.packageDescription || '-'}</td>
                                    <td className="text-sm">{contract.schedule || '-'}</td>

                                    <td className="text-sm font-medium">{contract.sdm || '-'}</td>
                                    <td className="text-sm">{contract.salesRep || '-'}</td>
                                </tr>
                            ))}
                            {processedContracts.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="17" className="empty-state">No se encontraron contratos.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="pagination-footer">
                    <button disabled={page === 0} onClick={() => setPage(p => p - 1)}>Anterior</button>
                    <span>Página {page + 1} de {Math.max(1, Math.ceil(processedContracts.length / pageSize))} ({processedContracts.length} items)</span>
                    <button disabled={(page + 1) * pageSize >= processedContracts.length} onClick={() => setPage(p => p + 1)}>Siguiente</button>
                </div>
            </div>

            <style>{`
                .page-header-clean {
                    display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;
                    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
                    padding: 24px 32px; border-radius: 12px; color: #fff; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                }
                .header-title h1 { font-size: 1.6rem; color: #ffffff; margin-bottom: 4px; font-weight: 700; }
                .header-title p { color: #94a3b8; font-size: 0.9rem; font-weight: 500; }
                
                .header-actions { display: flex; gap: 10px; }
                .btn-primary { background: #008F39; color: #fff; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 700; display: flex; align-items: center; gap: 8px; cursor: pointer; text-shadow: 0 1px 2px rgba(0,0,0,0.2); }
                .btn-secondary { background: rgba(255,255,255,0.1); color: #fff; border: 1px solid rgba(255,255,255,0.2); padding: 8px 12px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; }
                .btn-secondary:hover { background: rgba(255,255,255,0.2); }

                .corporate-section { border-top: 4px solid #008F39 !important; background: #fff !important; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); position: relative; }
                
                .table-wrapper { overflow-x: auto; min-height: 400px; }
                .neon-table-clean { width: 100%; border-collapse: collapse; min-width: 2200px; }
                .neon-table-clean th { padding: 8px 12px; background: #f8fafc; border-bottom: 2px solid #e2e8f0; vertical-align: top; height: 1px; }
                
                .th-content { display: flex; flex-direction: column; gap: 8px; justify-content: space-between; height: 100%; min-height: 90px; }
                .th-top { display: flex; align-items: flex-start; justify-content: space-between; cursor: pointer; color: #475569; font-weight: 700; text-transform: uppercase; font-size: 0.7rem; letter-spacing: 0.05em; gap: 8px; flex: 1; min-height: 40px; }
                .th-top:hover { color: #008F39; }
                
                .th-filter { width: 100%; padding: 4px 8px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 0.75rem; background: #fff; margin-top: auto; }
                .th-filter:focus { border-color: #008F39; outline: none; }

                .neon-table-clean td { padding: 12px 16px; border-bottom: 1px solid #f1f5f9; color: #0f172a; font-size: 0.85rem; font-weight: 400; vertical-align: middle; }
                
                .table-row-clean:hover { background: #f0fdf4; cursor: pointer; }
                .text-truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

                .status-pill { padding: 2px 10px; border-radius: 12px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; }
                .status-pill.activo { background: #dcfce7; color: #16a34a; }
                .status-pill.preliminar { background: #fef3c7; color: #d97706; }
                .status-pill.suspendido { background: #fee2e2; color: #dc2626; }
                
                .font-mono { font-family: 'JetBrains Mono', monospace; }
                .text-muted-sm { color: #64748b; font-size: 0.75rem; }
                .text-sm { font-size: 0.8rem; }
                .font-bold { font-weight: 700; }
                .text-primary { color: #008F39; }
                .text-secondary { color: #005bb7; }

                .loading-overlay { position: absolute; inset: 0; background: rgba(255,255,255,0.7); display: flex; align-items: center; justify-content: center; z-index: 10; }
                .empty-state { padding: 60px; text-align: center; color: #64748b; }

                .pagination-footer { padding: 16px; border-top: 1px solid #f1f5f9; display: flex; justify-content: flex-end; gap: 12px; align-items: center; font-size: 0.9rem; }
                .pagination-footer button { padding: 6px 12px; border: 1px solid #cbd5e1; background: #fff; border-radius: 6px; cursor: pointer; color: #475569; }
                .pagination-footer button:disabled { opacity: 0.5; cursor: not-allowed; }
                .pagination-footer button:not(:disabled):hover { border-color: #008F39; color: #008F39; }
            `}</style>
        </div>
    );
};

export default ContractsList;
