import { ClinicoCase } from './types';
import { toNumber, hasCompletedFollowUp } from './helpers';
import { FileText, CheckCircle2, TrendingUp, Activity } from 'lucide-react';

interface EnhancedStatsProps {
  casos: ClinicoCase[];
}

export function EnhancedStats({ casos }: EnhancedStatsProps) {
  const total = casos.length;
  
  const casosConSeguimientoCompleto = casos.filter(hasCompletedFollowUp).length;
  
  let allControls: boolean[] = [];
  casos.forEach(caso => {
    const c1m = toNumber(caso.control_1m_exito);
    const c3m = toNumber(caso.control_3m_exito);
    const c6m = toNumber(caso.control_6m_exito);
    
    if (c1m !== 0) allControls.push(c1m === 1);
    if (c3m !== 0) allControls.push(c3m === 1);
    if (c6m !== 0) allControls.push(c6m === 1);
  });
  
  const exitoGlobal = allControls.length >= 10 
    ? `${Math.round((allControls.filter(Boolean).length / allControls.length) * 100)}%`
    : 'Pendiente';
  
  const toothCounts = new Map<string, number>();
  casos.forEach(caso => {
    if (caso.tooth_fdi) {
      const fdi = String(caso.tooth_fdi);
      toothCounts.set(fdi, (toothCounts.get(fdi) || 0) + 1);
    }
  });
  
  const topTeeth = Array.from(toothCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const pendientes = casos.filter(caso => {
    return caso.fecha_tto && (
      toNumber(caso.control_1m_exito) === 0 ||
      toNumber(caso.control_3m_exito) === 0 ||
      toNumber(caso.control_6m_exito) === 0
    );
  }).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="group bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl rounded-xl shadow-lg shadow-black/10 p-6 transition-all duration-500 ease-out hover:scale-[1.02] animate-in fade-in-0 slide-in-from-bottom-4">
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <p className="text-sm text-zinc-400 font-medium tracking-wide">Total de casos</p>
            <p className="text-4xl font-bold tracking-tight" style={{ color: '#3A7AFE' }}>{total}</p>
          </div>
          <FileText className="w-10 h-10 opacity-10" style={{ color: '#3A7AFE' }} />
        </div>
      </div>

      <div className="group bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl rounded-xl shadow-lg shadow-black/10 p-6 transition-all duration-500 ease-out hover:scale-[1.02] animate-in fade-in-0 slide-in-from-bottom-4" style={{ animationDelay: '100ms' }}>
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <p className="text-sm text-zinc-400 font-medium tracking-wide">Seguimiento completo</p>
            <p className="text-4xl font-bold tracking-tight" style={{ color: '#2ECC71' }}>{casosConSeguimientoCompleto}</p>
            <p className="text-xs text-zinc-400">
              {total > 0 ? `${Math.round((casosConSeguimientoCompleto / total) * 100)}% del total` : '0%'}
            </p>
          </div>
          <CheckCircle2 className="w-10 h-10 opacity-10" style={{ color: '#2ECC71' }} />
        </div>
      </div>

      <div className="group bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl rounded-xl shadow-lg shadow-black/10 p-6 transition-all duration-500 ease-out hover:scale-[1.02] animate-in fade-in-0 slide-in-from-bottom-4" style={{ animationDelay: '200ms' }}>
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <p className="text-sm text-zinc-400 font-medium tracking-wide">Pendientes</p>
            <p className="text-4xl font-bold tracking-tight" style={{ color: '#F5A623' }}>{pendientes}</p>
            <p className="text-xs text-zinc-400">Requieren seguimiento</p>
          </div>
          <Activity className="w-10 h-10 opacity-10" style={{ color: '#F5A623' }} />
        </div>
      </div>

      <div className="group bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl rounded-xl shadow-lg shadow-black/10 p-6 transition-all duration-500 ease-out hover:scale-[1.02] animate-in fade-in-0 slide-in-from-bottom-4" style={{ animationDelay: '300ms' }}>
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <p className="text-sm text-zinc-400 font-medium tracking-wide">Éxito global</p>
            <p className="text-4xl font-bold tracking-tight" style={{ color: '#B983FF' }}>
              {exitoGlobal}
            </p>
            <p className="text-xs text-zinc-400">Controles exitosos</p>
          </div>
          <TrendingUp className="w-10 h-10 opacity-10" style={{ color: '#B983FF' }} />
        </div>
      </div>
    </div>
  );
}
