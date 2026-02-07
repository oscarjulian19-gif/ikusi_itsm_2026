import React, { useEffect, useState } from 'react';
import {
  Package,
  Shield,
  Clock,
  Edit2,
  Trash2,
  Plus,
  X,
  Check,
  Save,
  ChevronRight,
  Zap,
  ShieldCheck,
  AlertCircle,
  FileText
} from 'lucide-react';
import useSlaStore from '../store/useSlaStore';
import { motion, AnimatePresence } from 'framer-motion';

const SlaPackages = () => {
  const { slas, packages, loading, fetchSlas, fetchPackages, updateSla, updatePackage, createPackage, deletePackage } = useSlaStore();

  const [editingSla, setEditingSla] = useState(null);
  const [editingPkg, setEditingPkg] = useState(null);
  const [isAddingPkg, setIsAddingPkg] = useState(false);
  const [newPkg, setNewPkg] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchSlas();
    fetchPackages();
  }, [fetchSlas, fetchPackages]);

  const handleSaveSla = async () => {
    await updateSla(editingSla.id, editingSla);
    setEditingSla(null);
  };

  const handleSavePkg = async () => {
    await updatePackage(editingPkg.id, editingPkg);
    setEditingPkg(null);
  };

  const handleAddPkg = async () => {
    if (!newPkg.name) return;
    await createPackage(newPkg);
    setNewPkg({ name: '', description: '' });
    setIsAddingPkg(false);
  };

  const getPriorityColor = (id) => {
    if (id === 'P1') return '#DC2626';
    if (id === 'P2') return '#F59E0B';
    if (id === 'REQ_ALTA') return '#6DBE45';
    return '#1F3C88';
  };

  return (
    <div className="animate-fade-in p-8">
      {/* ENTERPRISE HEADER */}
      <header className="enterprise-header" style={{ borderRadius: '24px', padding: '40px' }}>
        <div className="header-titles">
          <h1>ANS y Paquetes de Servicio</h1>
          <p>Definición estratégica de niveles de compromiso y cobertura operativa</p>
        </div>
        <div className="flex gap-4 items-center">
          <button className="btn-icon-relief"><Shield size={18} /></button>
          <button
            className="btn-primary-relief"
            onClick={() => setIsAddingPkg(true)}
          >
            <Plus size={20} /> NUEVO PAQUETE
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-10">

        {/* LEFT PANE: PACKAGES */}
        <div className="lg:col-span-4 space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#6DBE45]/10 flex items-center justify-center text-[#6DBE45]">
              <Package size={20} />
            </div>
            <h2 className="text-xl font-black text-[#0D2472] uppercase tracking-tight">Catálogo de Paquetes</h2>
          </div>

          <AnimatePresence>
            {packages.map(pkg => (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                key={pkg.id}
                className="enterprise-card p-6 border-l-8 border-l-[#6DBE45] group hover:shadow-xl transition-all"
              >
                {editingPkg?.id === pkg.id ? (
                  <div className="space-y-4">
                    <input className="edit-input-modern font-bold" value={editingPkg.name} onChange={e => setEditingPkg({ ...editingPkg, name: e.target.value })} />
                    <textarea className="edit-input-modern text-xs" rows={2} value={editingPkg.description} onChange={e => setEditingPkg({ ...editingPkg, description: e.target.value })} />
                    <div className="flex gap-2 justify-end">
                      <button className="p-2 text-slate-400" onClick={() => setEditingPkg(null)}><X size={16} /></button>
                      <button className="p-2 text-[#6DBE45] font-black" onClick={handleSavePkg}>GUARDAR</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-black text-[#0D2472] text-lg leading-tight mb-2">{pkg.name}</h3>
                      <p className="text-xs font-semibold text-slate-500 leading-relaxed uppercase tracking-wide opacity-80">{pkg.description}</p>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="btn-icon-relief-small" onClick={() => setEditingPkg(pkg)}><Edit2 size={12} /></button>
                      <button className="btn-icon-relief-small text-red-500" onClick={() => window.confirm('¿Borrar?') && deletePackage(pkg.id)}><Trash2 size={12} /></button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}

            {isAddingPkg && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="enterprise-card p-6 border-dashed border-2 border-[#6DBE45]/30">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-[#6DBE45] uppercase tracking-widest text-center">Nuevo Registro Operativo</h4>
                  <input className="edit-input-modern" placeholder="Nombre (ej. IKUSI Elite)" value={newPkg.name} onChange={e => setNewPkg({ ...newPkg, name: e.target.value })} />
                  <textarea className="edit-input-modern" placeholder="Descripción de la cobertura..." value={newPkg.description} onChange={e => setNewPkg({ ...newPkg, description: e.target.value })} />
                  <div className="flex justify-between items-center pt-2">
                    <button className="text-[10px] font-black text-slate-400" onClick={() => setIsAddingPkg(false)}>DESCARTAR</button>
                    <button className="btn-primary-relief py-2 px-4 text-[10px]" onClick={handleAddPkg}>FINALIZAR</button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT PANE: SLAs */}
        <div className="lg:col-span-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-[#1F3C88]/10 flex items-center justify-center text-[#1F3C88]">
              <Zap size={20} />
            </div>
            <h2 className="text-xl font-black text-[#0D2472] uppercase tracking-tight">Matriz de Tiempos y Prioridades (ANS)</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {slas.map(sla => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                key={sla.id}
                className="enterprise-card overflow-hidden"
              >
                <div className="h-1.5 w-full" style={{ backgroundColor: getPriorityColor(sla.id) }}></div>
                <div className="p-8">
                  {editingSla?.id === sla.id ? (
                    <div className="space-y-6">
                      <input className="edit-input-modern text-lg font-black" value={editingSla.name} onChange={e => setEditingSla({ ...editingSla, name: e.target.value })} />
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-slate-400 uppercase">Atención (Display)</label>
                          <input className="edit-input-modern" value={editingSla.attention_display} onChange={e => setEditingSla({ ...editingSla, attention_display: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-slate-400 uppercase">Solución (Display)</label>
                          <input className="edit-input-modern" value={editingSla.solution_display} onChange={e => setEditingSla({ ...editingSla, solution_display: e.target.value })} />
                        </div>
                      </div>
                      <div className="flex justify-end gap-3">
                        <button className="btn-icon-relief" onClick={() => setEditingSla(null)}><X size={16} /></button>
                        <button className="btn-primary-relief py-2" onClick={handleSaveSla}><Check size={16} /> GUARDAR</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-black px-2 py-0.5 rounded bg-slate-100 text-[#0D2472]">{sla.id}</span>
                            {sla.id.startsWith('P') ? <AlertCircle size={12} className="text-red-500" /> : <FileText size={12} className="text-[#6DBE45]" />}
                          </div>
                          <h3 className="text-lg font-black text-[#0D2472] leading-tight-none">{sla.name}</h3>
                        </div>
                        <button className="btn-icon-relief-small" onClick={() => setEditingSla(sla)}><Edit2 size={12} /></button>
                      </div>

                      <div className="flex justify-between items-end">
                        <div className="space-y-1">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Atención</span>
                          <div className="text-2xl font-black text-[#1F3C88]">{sla.attention_display}</div>
                          <p className="text-[9px] font-bold text-slate-400">NOMINAL: {sla.attention_min} MIN</p>
                        </div>
                        <div className="h-10 w-px bg-slate-100"></div>
                        <div className="space-y-1 text-right">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Solución</span>
                          <div className="text-2xl font-black text-[#191D23]">{sla.solution_display}</div>
                          <p className="text-[9px] font-bold text-slate-400">LIMITE: {sla.solution_hours} HORAS</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .edit-input-modern {
            width: 100%;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 12px 16px;
            font-size: 0.85rem;
            color: #0D2472;
            outline: none;
            transition: all 0.2s;
        }
        .edit-input-modern:focus {
            background: #fff;
            border-color: #6DBE45;
            box-shadow: 0 0 0 4px rgba(109, 190, 69, 0.1);
        }
        .btn-icon-relief-small {
            width: 32px;
            height: 32px;
            background: #fff;
            border: 1px solid #e2e8f0;
            border-bottom: 3px solid #e2e8f0;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.1s;
        }
        .btn-icon-relief-small:active {
            transform: translateY(2px);
            border-bottom-width: 1px;
        }
      `}</style>
    </div>
  );
};

export default SlaPackages;
