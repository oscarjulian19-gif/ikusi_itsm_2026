import React, { useEffect, useState } from 'react';
import { Package, Shield, Clock, Edit2, Trash2, Plus, X, Check, Save } from 'lucide-react';
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
  }, []);

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

  return (
    <div className="sla-admin-container px-10 py-10 max-w-7xl mx-auto">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-900 leading-none">Configuración de ANS y Paquetes</h1>
          <p className="text-slate-500 font-bold mt-2 uppercase text-xs tracking-widest">Modelo de Gestión Ikusi 24x7</p>
        </div>
        <div className="flex gap-4">
          <button className="btn-primary-lite flex items-center gap-2" onClick={() => setIsAddingPkg(true)}>
            <Plus size={16} /> Nuevo Paquete
          </button>
        </div>
      </header>

      {/* SECTION: SERVICE PACKAGES */}
      <div className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg text-primary"><Package size={20} /></div>
          <h2 className="text-xl font-black text-slate-800">Paquetes de Servicio</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {packages.map(pkg => (
              <motion.div layout id={`pkg-${pkg.id}`} key={pkg.id} className="config-card group">
                {editingPkg?.id === pkg.id ? (
                  <div className="space-y-4">
                    <input className="edit-input font-bold" value={editingPkg.name} onChange={e => setEditingPkg({ ...editingPkg, name: e.target.value })} />
                    <textarea className="edit-input text-xs" rows={3} value={editingPkg.description} onChange={e => setEditingPkg({ ...editingPkg, description: e.target.value })} />
                    <div className="flex gap-2 justify-end">
                      <button className="btn-icon text-slate-400" onClick={() => setEditingPkg(null)}><X size={16} /></button>
                      <button className="btn-icon text-primary" onClick={handleSavePkg}><Check size={16} /></button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-primary">
                        <Shield size={20} />
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="btn-icon-lite" onClick={() => setEditingPkg(pkg)}><Edit2 size={14} /></button>
                        <button className="btn-icon-lite text-red-400" onClick={() => window.confirm('¿Eliminar paquete?') && deletePackage(pkg.id)}><Trash2 size={14} /></button>
                      </div>
                    </div>
                    <h3 className="font-black text-slate-800 mb-2">{pkg.name}</h3>
                    <p className="text-slate-500 text-xs font-medium leading-relaxed">{pkg.description}</p>
                  </>
                )}
              </motion.div>
            ))}

            {isAddingPkg && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="config-card border-dashed border-2 border-primary/30 flex flex-col justify-center">
                <div className="space-y-4">
                  <h4 className="font-bold text-primary text-sm uppercase">Nuevo Paquete</h4>
                  <input className="edit-input" placeholder="Nombre del paquete" value={newPkg.name} onChange={e => setNewPkg({ ...newPkg, name: e.target.value })} />
                  <textarea className="edit-input text-xs" placeholder="Descripción de cobertura..." value={newPkg.description} onChange={e => setNewPkg({ ...newPkg, description: e.target.value })} />
                  <div className="flex gap-2 justify-end">
                    <button className="text-xs font-bold text-slate-400" onClick={() => setIsAddingPkg(false)}>CANCELAR</button>
                    <button className="btn-primary-lite py-2 px-4 text-xs" onClick={handleAddPkg}>GUARDAR PAQUETE</button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* SECTION: SLAs */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-secondary/10 rounded-lg text-secondary"><Clock size={20} /></div>
          <h2 className="text-xl font-black text-slate-800">Niveles de ANS (Acuerdos)</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {slas.map(sla => (
            <div key={sla.id} className="config-card relative overflow-hidden">
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${sla.id === 'Critico' ? 'bg-red-500' : 'bg-secondary'}`}></div>

              {editingSla?.id === sla.id ? (
                <div className="space-y-4">
                  <input className="edit-input font-bold" value={editingSla.name} onChange={e => setEditingSla({ ...editingSla, name: e.target.value })} />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 capitalize">Atención (Minutos)</label>
                      <input type="number" className="edit-input" value={editingSla.attention_min} onChange={e => setEditingSla({ ...editingSla, attention_min: parseInt(e.target.value) })} />
                      <input className="edit-input text-[10px]" value={editingSla.attention_display} onChange={e => setEditingSla({ ...editingSla, attention_display: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 capitalize">Solución (Horas)</label>
                      <input type="number" className="edit-input" value={editingSla.solution_hours} onChange={e => setEditingSla({ ...editingSla, solution_hours: parseInt(e.target.value) })} />
                      <input className="edit-input text-[10px]" value={editingSla.solution_display} onChange={e => setEditingSla({ ...editingSla, solution_display: e.target.value })} />
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button className="btn-icon" onClick={() => setEditingSla(null)}><X size={16} /></button>
                    <button className="btn-icon text-primary" onClick={handleSaveSla}><Save size={16} /></button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-extrabold text-slate-800">{sla.name}</h3>
                    <button className="btn-icon-lite opacity-0 hover:opacity-100" onClick={() => setEditingSla(sla)}><Edit2 size={14} /></button>
                  </div>
                  <div className="flex gap-8">
                    <div className="flex-1">
                      <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase tracking-tighter">Atención</span>
                      <div className="text-2xl font-black text-slate-900 leading-none">{sla.attention_display}</div>
                      <span className="text-[9px] font-bold text-slate-400">{sla.attention_min} min reales</span>
                    </div>
                    <div className="w-px bg-slate-100"></div>
                    <div className="flex-1">
                      <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase tracking-tighter">Solución</span>
                      <div className="text-2xl font-black text-slate-900 leading-none">{sla.solution_display}</div>
                      <span className="text-[9px] font-bold text-slate-400">{sla.solution_hours} hrs reales</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <style>{`
                .config-card { background: #fff; border: 1px solid #f1f5f9; border-radius: 24px; padding: 24px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); transition: all 0.2s; }
                .config-card:hover { border-color: #cbd5e1; transform: translateY(-2px); }
                .btn-icon-lite { width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #94a3b8; transition: all 0.2s; }
                .btn-icon-lite:hover { background: #f8fafc; color: #475569; }
                .btn-icon { width: 36px; height: 36px; border-radius: 12px; display: flex; align-items: center; justify-content: center; background: #f8fafc; transition: all 0.2s; }
                .btn-icon:hover { background: #f1f5f9; }
                .edit-input { width: 100%; border: 1px solid #e2e8f0; border-radius: 10px; padding: 8px 12px; color: #1e293b; transition: all 0.2s; }
                .edit-input:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
            `}</style>
    </div>
  );
};

export default SlaPackages;
