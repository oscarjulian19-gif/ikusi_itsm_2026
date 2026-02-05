import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Download, Upload, FileSpreadsheet, FileJson, Layers, MoreVertical, ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import useCatalogStore from '../store/useCatalogStore';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Catalog = () => {
    const navigate = useNavigate();
    const { services, incidents, requests } = useCatalogStore();

    // Advanced Table State
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [filters, setFilters] = useState({});

    // Filter Logic
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

    // Flatten and Enrich Data
    const tableData = useMemo(() => {
        const enrichedIncidents = incidents.map(item => ({ ...item, type: 'Incidente', typeCode: 'INC' }));
        const enrichedRequests = requests.map(item => ({ ...item, type: 'Requerimiento', typeCode: 'REQ' }));
        const allItems = [...enrichedIncidents, ...enrichedRequests];
        return allItems.map(item => {
            const service = services.find(s => s.id === item.serviceId) || { name: 'Desconocido', category: 'Sin Categoría' };
            return {
                uniqueId: item.id,
                categoria: service.category,
                codigo_categoria_sistema: service.category.substring(0, 3).toUpperCase(),
                descripcion_categoria: service.category,
                servicio: service.name,
                codigo_sief: `SIEF-${service.id}`,
                codigo_servicio_sistema: service.id,
                descripcion_servicio: service.name,
                tipo: item.type,
                descripcion_tipo: item.name,
                codigo_sief_tipo: `SIEF-${item.id}`,
                codigo_tipo_sistema: item.id
            };
        });
    }, [services, incidents, requests]);

    const filteredData = useMemo(() => {
        let data = [...tableData];
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
    }, [tableData, filters, sortConfig]);

    // Unique Categories Count
    const uniqueCategories = new Set(tableData.map(d => d.categoria)).size;

    // Handlers
    const handleExportExcel = () => {
        const ws = XLSX.utils.json_to_sheet(filteredData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Catalogo_Servicios");
        XLSX.writeFile(wb, "Catalogo_Export.xlsx");
    };

    const handleExportPDF = () => {
        const doc = new jsPDF('landscape');
        doc.text("Catálogo de Servicios", 14, 15);
        doc.autoTable({
            head: [['Cat', 'Servicio', 'ID Serv', 'Tipo', 'Descripción', 'ID Tipo']],
            body: filteredData.map(i => [
                i.categoria, i.servicio, i.codigo_servicio_sistema,
                i.tipo, i.descripcion_tipo, i.codigo_tipo_sistema
            ]),
            startY: 20
        });
        doc.save("Catalogo_Reporte.pdf");
    };

    const handleImport = () => {
        alert("Funcionalidad de Importación Masiva (Excel/CSV) - Próximamente integrada con backend");
    };

    const handleRowClick = (item) => {
        navigate(`/catalog/edit/${item.typeCode}/${item.uniqueId}`);
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
        <div className="catalog-page animate-fade">
            <div className="page-header-clean">
                <div className="header-title">
                    <h1>Catálogo de Servicios</h1>
                    <p>{filteredData.length} Elementos en {uniqueCategories} Categorías</p>
                </div>
                <div className="header-actions">
                    <button className="btn-secondary" onClick={handleExportExcel} title="Exportar Excel">
                        <FileSpreadsheet size={16} />
                    </button>
                    <button className="btn-secondary" onClick={handleExportPDF} title="Exportar PDF">
                        <FileJson size={16} />
                    </button>
                    <button className="btn-primary" onClick={handleImport} style={{ background: '#008F39', border: 'none' }}>
                        <Upload size={16} /> Importar Masivo
                    </button>
                </div>
            </div>

            <div className="card table-card corporate-section">
                <div className="table-wrapper">
                    <table className="neon-table-clean">
                        <thead>
                            <tr>
                                {renderHeader('Categoria', 'categoria')}
                                {renderHeader('Cod. Cat. Sistema', 'codigo_categoria_sistema')}
                                {renderHeader('Desc. Categoria', 'descripcion_categoria')}
                                {renderHeader('Servicio', 'servicio')}
                                {renderHeader('Cod. SIEF', 'codigo_sief')}
                                {renderHeader('Cod. Serv. Sistema', 'codigo_servicio_sistema')}
                                {renderHeader('Desc. Servicio', 'descripcion_servicio')}
                                {renderHeader('Tipo', 'tipo')}
                                {renderHeader('Desc. Tipo', 'descripcion_tipo')}
                                {renderHeader('Cod. SIEF Tipo', 'codigo_sief_tipo')}
                                {renderHeader('Cod. Tipo Sistema', 'codigo_tipo_sistema')}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((row) => (
                                <tr key={row.uniqueId + row.tipo} className="table-row-clean" onClick={() => handleRowClick(row)}>
                                    <td className="font-bold text-muted-sm">{row.categoria}</td>
                                    <td className="font-mono text-muted-sm">{row.codigo_categoria_sistema}</td>
                                    <td className="text-sm">{row.descripcion_categoria}</td>
                                    <td className="font-bold">{row.servicio}</td>
                                    <td className="font-mono text-muted-sm">{row.codigo_sief}</td>
                                    <td className="font-mono">{row.codigo_servicio_sistema}</td>
                                    <td className="text-sm">{row.descripcion_servicio}</td>
                                    <td>
                                        <span className={`status-badge ${row.tipo === 'Incidente' ? 'incident' : 'request'}`}>
                                            {row.tipo}
                                        </span>
                                    </td>
                                    <td className="text-primary font-medium">{row.descripcion_tipo}</td>
                                    <td className="font-mono text-muted-sm">{row.codigo_sief_tipo}</td>
                                    <td className="font-mono font-bold">{row.codigo_tipo_sistema}</td>
                                </tr>
                            ))}
                            {filteredData.length === 0 && (
                                <tr>
                                    <td colSpan="11" className="empty-state">No se encontraron registros.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
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
                
                .header-actions { display: flex; gap: 12px; }
                .btn-primary { background: #008F39; color: #fff; padding: 8px 16px; border-radius: 6px; font-weight: 700; display: flex; align-items: center; gap: 8px; cursor: pointer; transition: all 0.2s; }
                .btn-primary:hover { filter: brightness(1.1); transform: translateY(-1px); }
                .btn-secondary { background: rgba(255,255,255,0.1); color: #fff; border: 1px solid rgba(255,255,255,0.2); padding: 8px 12px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
                .btn-secondary:hover { background: rgba(255,255,255,0.2); }

                .corporate-section { border-top: 4px solid #008F39 !important; background: #fff !important; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
                
                .table-wrapper { overflow-x: auto; min-height: 500px; }
                .neon-table-clean { width: 100%; border-collapse: collapse; min-width: 2000px; }
                .neon-table-clean th { padding: 8px 12px; background: #f8fafc; border-bottom: 2px solid #e2e8f0; vertical-align: top; height: 1px; }
                
                .th-content { display: flex; flex-direction: column; gap: 8px; justify-content: space-between; height: 100%; min-height: 90px; }
                .th-top { display: flex; align-items: flex-start; justify-content: space-between; cursor: pointer; color: #475569; font-weight: 700; text-transform: uppercase; font-size: 0.7rem; letter-spacing: 0.05em; gap: 8px; flex: 1; min-height: 40px; }
                .th-top:hover { color: #008F39; }
                
                .th-filter { width: 100%; padding: 4px 8px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 0.75rem; background: #fff; margin-top: auto; }
                .th-filter:focus { border-color: #008F39; outline: none; }

                .neon-table-clean td { padding: 12px 16px; border-bottom: 1px solid #f1f5f9; color: #0f172a; font-size: 0.85rem; font-weight: 400; vertical-align: middle; }
                
                .table-row-clean:hover { background: #f0fdf4; cursor: pointer; }
                
                .font-mono { font-family: 'JetBrains Mono', monospace; }
                .text-muted-sm { color: #64748b; font-size: 0.75rem; }
                .text-sm { font-size: 0.8rem; }
                .font-medium { font-weight: 500; }
                .font-bold { font-weight: 700; }
                .text-primary { color: #008F39; }
                
                .status-badge { padding: 2px 8px; border-radius: 12px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; display: inline-block; }
                .status-badge.incident { background: #fee2e2; color: #dc2626; border: 1px solid #fecaca; }
                .status-badge.request { background: #dbeafe; color: #2563eb; border: 1px solid #bfdbfe; }

                .empty-state { padding: 60px; text-align: center; color: #64748b; font-size: 0.9rem; }
            `}</style>
        </div>
    );
};

export default Catalog;
