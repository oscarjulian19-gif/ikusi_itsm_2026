import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Server, Monitor, Shield, Globe, FileSpreadsheet, FileJson, Loader, Upload, Database, ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import useCMDBStore from '../store/useCMDBStore';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const CMDB = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { cis, total, fetchCIs, uploadCIs, loading } = useCMDBStore();

    // Pagination State
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(100);
    const [uploading, setUploading] = useState(false);

    // Advanced Table State
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [filters, setFilters] = useState({});



    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const cId = params.get('contractId');

        // Prepare params for backend fetch
        const fetchParams = {
            skip: page * pageSize,
            limit: pageSize
        };

        if (cId) {
            setFilters(prev => ({ ...prev, contractId: cId }));
            fetchParams.contractId = cId; // Server-side filter
        }

        fetchCIs(fetchParams);
    }, [page, pageSize, location.search]); // React to URL changes

    // Sorting and Filtering (Client Side for loaded page)
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const processedCIs = useMemo(() => {
        let data = [...cis];

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
    }, [cis, filters, sortConfig]);


    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!confirm("Este archivo se procesará en segundo plano debido a su tamaño. ¿Desea continuar?")) return;
        setUploading(true);
        try {
            await uploadCIs(file);
            alert("Carga completada.");
            fetchCIs({ skip: page * pageSize, limit: pageSize });
        } catch (err) {
            alert("Error al subir el archivo: " + err.message);
        } finally {
            setUploading(false);
            e.target.value = null;
        }
    };

    const handleExportExcel = () => {
        const ws = XLSX.utils.json_to_sheet(processedCIs.map(c => ({
            'Número CI': c.id,
            'Serial': c.serialNumber || '-',
            'Referencia': c.referenceNumber || '-',
            'Cliente': c.client,
            'Tipo': c.type,
            'Modelo': c.deviceModel,
            'Estado': c.status,
            'Ubicación': `${c.city}, ${c.country}`,
            'Proyecto': c.projectName
        })));
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "CMDB");
        XLSX.writeFile(wb, "CMDB_Export.xlsx");
    };

    const handleExportPDF = () => {
        const doc = new jsPDF('landscape');
        doc.text("Reporte CMDB", 14, 15);
        doc.setFontSize(10);

        const tableColumn = ["ID CI", "Serial", "Cliente", "Tipo", "Modelo", "Estado", "Ubicación"];
        const tableRows = processedCIs.map(c => [
            c.id, c.serialNumber, c.client, c.type, c.deviceModel, c.status, `${c.city || ''} ${c.country || ''}`
        ]);

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 20,
            styles: { fontSize: 8 },
            headStyles: { fillColor: [5, 196, 107] },
        });

        doc.save("CMDB_Reporte.pdf");
    };

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
        <div className="cmdb-page animate-fade">
            <div className="page-header-clean">
                <div className="header-title">
                    <h1>CMDB & Activos</h1>
                    <p>Base de Datos de Gestión de Configuración ({total} Activos)</p>
                </div>
                <div className="header-actions">
                    <button className="btn-secondary" onClick={() => fetchCIs({ skip: page * pageSize, limit: pageSize })} title="Refrescar">
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
                    <button className="btn-primary" onClick={() => navigate('/cmdb/new')}>
                        <Database size={16} /> Nuevo Item
                    </button>
                </div>
            </div>

            <div className="card table-card corporate-section">
                <div className="table-wrapper">
                    {loading && <div className="loading-overlay"><Loader className="animate-spin" /></div>}
                    <table className="neon-table-clean">
                        <thead>
                            <tr>
                                {renderHeader('Número CI', 'id')}
                                {renderHeader('Serial', 'serialNumber')}
                                {renderHeader('Referencia', 'referenceNumber')}
                                {renderHeader('Cliente', 'client')}
                                {renderHeader('Descripción', 'description')}
                                {renderHeader('Estado', 'status')}
                                {renderHeader('Inicio', 'startDate')}
                                {renderHeader('Fin', 'endDate')}
                                {renderHeader('PO', 'poNumber')}
                                {renderHeader('SO', 'soNumber')}
                                {renderHeader('Fin S. Cisco', 'ciscoSupportEndDate')}
                                {renderHeader('Inicio S. Cisco', 'ciscoSupportStartDate')}
                                {renderHeader('Contrato Cisco', 'ciscoContractNumber')}
                                {renderHeader('Contrato Snow', 'snowContract')}
                                {renderHeader('No. Contrato', 'contractId')}
                                {renderHeader('Ciudad', 'city')}
                                {renderHeader('Dirección', 'address')}
                                {renderHeader('Proyecto', 'projectName')}
                                {renderHeader('PEP', 'pep')}
                                {renderHeader('País', 'country')}
                                {renderHeader('Tipo', 'type')}
                                {renderHeader('Modelo', 'deviceModel')}
                            </tr>
                        </thead>
                        <tbody>
                            {processedCIs.map(ci => (
                                <tr key={ci.id} onClick={() => navigate(`/cmdb/${ci.id}`)} className="table-row-clean">
                                    <td className="font-mono font-bold text-primary">{ci.id}</td>
                                    <td className="font-mono">{ci.serialNumber}</td>
                                    <td className="text-muted-sm">{ci.referenceNumber || '-'}</td>
                                    <td className="font-bold">{ci.client}</td>
                                    <td className="text-sm text-truncate" style={{ maxWidth: '200px' }} title={ci.description}>{ci.description || '-'}</td>
                                    <td>
                                        <span className={`status-pill ${ci.status ? ci.status.toLowerCase() : ''}`}>
                                            {ci.status}
                                        </span>
                                    </td>
                                    <td className="font-mono text-muted-sm">{ci.startDate}</td>
                                    <td className="font-mono text-muted-sm">{ci.endDate}</td>
                                    <td className="text-sm">{ci.poNumber}</td>
                                    <td className="text-sm">{ci.soNumber}</td>
                                    <td className="font-mono text-muted-sm">{ci.ciscoSupportEndDate}</td>
                                    <td className="font-mono text-muted-sm">{ci.ciscoSupportStartDate}</td>
                                    <td className="text-sm">{ci.ciscoContractNumber}</td>
                                    <td className="text-sm font-semibold text-secondary">{ci.snowContract}</td>
                                    <td className="text-sm font-semibold text-secondary">{ci.contractId}</td>
                                    <td className="text-sm">{ci.city}</td>
                                    <td className="text-sm">{ci.address}</td>
                                    <td className="text-sm">{ci.projectName}</td>
                                    <td className="font-mono text-muted-sm">{ci.pep}</td>
                                    <td className="text-sm">{ci.country}</td>
                                    <td>
                                        <span className={`badge-pill type-${ci.type ? ci.type.toLowerCase() : 'other'}`}>
                                            {ci.type}
                                        </span>
                                    </td>
                                    <td className="text-muted-sm">{ci.deviceModel}</td>
                                </tr>
                            ))}
                            {processedCIs.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="22" className="empty-state">No se encontraron CIs.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="pagination-footer">
                    <button disabled={page === 0} onClick={() => setPage(p => p - 1)}>Anterior</button>
                    <span>Página {page + 1}</span>
                    <button disabled={cis.length < pageSize} onClick={() => setPage(p => p + 1)}>Siguiente</button>
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
                .btn-secondary { background: rgba(255,255,255,0.1); color: #fff; border: 1px solid rgba(255,255,255,0.2); padding: 8px 12px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justifyContent: center; }
                .btn-secondary:hover { background: rgba(255,255,255,0.2); }

                .corporate-section { border-top: 4px solid #008F39 !important; background: #fff !important; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); position: relative; }
                
                .table-wrapper { overflow-x: auto; min-height: 400px; }
                .neon-table-clean { width: 100%; border-collapse: collapse; min-width: 1400px; }
                .neon-table-clean th { padding: 8px 12px; background: #f8fafc; border-bottom: 2px solid #e2e8f0; vertical-align: top; height: 1px; }
                
                .th-content { display: flex; flex-direction: column; gap: 8px; justify-content: space-between; height: 100%; min-height: 90px; }
                .th-top { display: flex; align-items: flex-start; justify-content: space-between; cursor: pointer; color: #475569; font-weight: 700; text-transform: uppercase; font-size: 0.7rem; letter-spacing: 0.05em; gap: 8px; flex: 1; min-height: 40px; }
                .th-top:hover { color: #008F39; }
                
                .th-filter { width: 100%; padding: 4px 8px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 0.75rem; background: #fff; margin-top: auto; }
                .th-filter:focus { border-color: #008F39; outline: none; }

                .neon-table-clean td { padding: 12px 16px; border-bottom: 1px solid #f1f5f9; color: #0f172a; font-size: 0.85rem; font-weight: 400; vertical-align: middle; }
                
                .table-row-clean:hover { background: #f0fdf4; }

                .badge-pill { padding: 2px 8px; border-radius: 12px; font-size: 0.65rem; border: 1px solid #e2e8f0; font-weight: 600; text-transform: uppercase; }
                .status-pill { padding: 2px 8px; border-radius: 12px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; display: inline-block; }
                .status-pill.active { background: #dcfce7; color: #16a34a; }
                .status-pill.inactive { background: #fee2e2; color: #dc2626; }

                .font-mono { font-family: 'JetBrains Mono', monospace; }
                .text-muted-sm { color: #64748b; font-size: 0.75rem; }
                .font-bold { font-weight: 700; }
                .text-primary { color: #008F39; }

                .loading-overlay { position: absolute; inset: 0; background: rgba(255,255,255,0.7); display: flex; align-items: center; justify-content: center; z-index: 10; }
                .empty-state { padding: 60px; text-align: center; color: #64748b; }
                
                .pagination-footer { padding: 16px; border-top: 1px solid #f1f5f9; display: flex; justify-content: flex-end; gap: 12px; align-items: center; font-size: 0.9rem; }
                .pagination-footer button { padding: 6px 12px; border: 1px solid #cbd5e1; background: #fff; border-radius: 6px; cursor: pointer; color: #475569; }
                .pagination-footer button:disabled { opacity: 0.5; cursor: not-allowed; }
            `}</style>
        </div>
    );
};

export default CMDB;
