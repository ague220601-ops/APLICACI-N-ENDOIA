import { ClinicoCase } from './types';
import { isComplexCase } from './helpers';
import { AlertTriangle } from 'lucide-react';

interface CasosComplejosProps {
  casos: ClinicoCase[];
}

export function CasosComplejos({ casos }: CasosComplejosProps) {
  const complexCases = casos.filter(isComplexCase);
  const percentage = casos.length > 0 ? Math.round((complexCases.length / casos.length) * 100) : 0;

  return (
    <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl rounded-xl shadow-lg shadow-black/10 p-6 transition-all duration-300 hover:shadow-xl">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(245, 166, 35, 0.1)' }}>
          <AlertTriangle className="w-7 h-7" style={{ color: '#F5A623' }} />
        </div>
        <div className="flex-1 space-y-2">
          <p className="text-sm font-medium text-zinc-400 tracking-wide">Casos complejos</p>
          <p className="text-3xl font-bold tracking-tight">
            {complexCases.length}
            <span className="text-lg text-zinc-400 font-normal ml-2">de {casos.length}</span>
          </p>
          <p className="text-xs text-zinc-400">
            PAI≥3, radiolucidez, sondaje{'>'}4mm o dolor espontáneo
          </p>
          <div className="mt-3 pt-3 border-t border-zinc-200/50 dark:border-zinc-700/50">
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-zinc-200 dark:bg-zinc-800 rounded-full h-1.5">
                <div className="h-1.5 rounded-full transition-all duration-700" style={{ width: `${percentage}%`, backgroundColor: '#F5A623' }} />
              </div>
              <span className="text-sm font-semibold" style={{ color: '#F5A623' }}>{percentage}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
