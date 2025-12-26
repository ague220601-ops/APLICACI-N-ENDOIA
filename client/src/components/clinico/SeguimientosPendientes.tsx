import { ClinicoCase } from './types';
import { toNumber } from './helpers';
import { Bell, AlertCircle } from 'lucide-react';

interface SeguimientosPendientesProps {
  casos: ClinicoCase[];
  activeFilter: string | null;
  onFilterClick: (filterType: string | null) => void;
}

export function SeguimientosPendientes({ casos, activeFilter, onFilterClick }: SeguimientosPendientesProps) {
  const pendientes = {
    oneMonth: 0,
    threeMonths: 0,
    sixMonths: 0,
    sinTratamiento: 0
  };
  
  casos.forEach(caso => {
    if (!caso.fecha_tto || caso.fecha_tto.trim() === '') {
      pendientes.sinTratamiento++;
    } else {
      if (toNumber(caso.control_1m_exito) === 0) pendientes.oneMonth++;
      if (toNumber(caso.control_3m_exito) === 0) pendientes.threeMonths++;
      if (toNumber(caso.control_6m_exito) === 0) pendientes.sixMonths++;
    }
  });

  return (
    <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl rounded-xl shadow-lg shadow-black/10 p-6">
      <div className="flex items-center gap-2 mb-6">
        <Bell className="w-5 h-5" style={{ color: '#F5A623' }} />
        <h3 className="text-lg font-semibold tracking-tight">Seguimientos y tratamientos pendientes</h3>
      </div>
      
      <div className="grid grid-cols-4 gap-4 mb-4">
        <button
          onClick={() => onFilterClick(activeFilter === '1m' ? null : '1m')}
          className={`text-center p-4 rounded-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer ${
            activeFilter === '1m' ? 'ring-2 ring-orange-500' : ''
          }`}
          style={{ backgroundColor: 'rgba(245, 166, 35, 0.08)' }}
        >
          <p className="text-3xl font-bold tracking-tight" style={{ color: '#F5A623' }}>{pendientes.oneMonth}</p>
          <p className="text-xs text-zinc-400 font-medium mt-2 tracking-wide">Control 1m</p>
        </button>
        <button
          onClick={() => onFilterClick(activeFilter === '3m' ? null : '3m')}
          className={`text-center p-4 rounded-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer ${
            activeFilter === '3m' ? 'ring-2 ring-orange-500' : ''
          }`}
          style={{ backgroundColor: 'rgba(245, 166, 35, 0.08)' }}
        >
          <p className="text-3xl font-bold tracking-tight" style={{ color: '#F5A623' }}>{pendientes.threeMonths}</p>
          <p className="text-xs text-zinc-400 font-medium mt-2 tracking-wide">Control 3m</p>
        </button>
        <button
          onClick={() => onFilterClick(activeFilter === '6m' ? null : '6m')}
          className={`text-center p-4 rounded-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer ${
            activeFilter === '6m' ? 'ring-2 ring-orange-500' : ''
          }`}
          style={{ backgroundColor: 'rgba(245, 166, 35, 0.08)' }}
        >
          <p className="text-3xl font-bold tracking-tight" style={{ color: '#F5A623' }}>{pendientes.sixMonths}</p>
          <p className="text-xs text-zinc-400 font-medium mt-2 tracking-wide">Control 6m</p>
        </button>
        <button
          onClick={() => onFilterClick(activeFilter === 'sin-tratamiento' ? null : 'sin-tratamiento')}
          className={`text-center p-4 rounded-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer ${
            activeFilter === 'sin-tratamiento' ? 'ring-2 ring-red-500' : ''
          }`}
          style={{ backgroundColor: 'rgba(239, 68, 68, 0.08)' }}
        >
          <p className="text-3xl font-bold tracking-tight" style={{ color: '#EF4444' }}>{pendientes.sinTratamiento}</p>
          <p className="text-xs text-zinc-400 font-medium mt-2 tracking-wide">Sin tratamiento</p>
        </button>
      </div>
      
      {activeFilter && (
        <div className="mt-4 flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          <AlertCircle className="w-4 h-4" />
          <span>
            {activeFilter === '1m' && 'Mostrando casos con control de 1 mes pendiente'}
            {activeFilter === '3m' && 'Mostrando casos con control de 3 meses pendiente'}
            {activeFilter === '6m' && 'Mostrando casos con control de 6 meses pendiente'}
            {activeFilter === 'sin-tratamiento' && 'Mostrando casos sin tratamiento registrado'}
          </span>
        </div>
      )}
    </div>
  );
}
