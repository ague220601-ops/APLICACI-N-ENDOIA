import { ClinicoCase, ToothFailureStats } from './types';
import { toNumber } from './helpers';
import { TrendingDown, Hash } from 'lucide-react';

interface FailedTeethRankingProps {
  casos: ClinicoCase[];
}

export function FailedTeethRanking({ casos }: FailedTeethRankingProps) {
  const failuresByTooth = new Map<string, number>();
  
  casos.forEach(caso => {
    if (!caso.tooth_fdi) return;
    
    const hasFailure = 
      toNumber(caso.control_1m_exito) === -1 ||
      toNumber(caso.control_3m_exito) === -1 ||
      toNumber(caso.control_6m_exito) === -1;
    
    if (hasFailure) {
      const fdi = String(caso.tooth_fdi);
      failuresByTooth.set(fdi, (failuresByTooth.get(fdi) || 0) + 1);
    }
  });
  
  const ranking: ToothFailureStats[] = Array.from(failuresByTooth.entries())
    .map(([fdi, failures]) => ({ fdi, failures }))
    .sort((a, b) => b.failures - a.failures)
    .slice(0, 5);

  return (
    <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl rounded-xl shadow-lg shadow-black/10 p-6 transition-all duration-300 hover:shadow-xl">
      <div className="flex items-center gap-2 mb-6">
        <TrendingDown className="w-5 h-5" style={{ color: '#F5A623' }} />
        <h3 className="text-lg font-semibold tracking-tight">Dientes con más fracasos</h3>
      </div>
      
      {ranking.length === 0 ? (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-3" style={{ backgroundColor: 'rgba(46, 204, 113, 0.1)' }}>
            <TrendingDown className="w-6 h-6" style={{ color: '#2ECC71' }} />
          </div>
          <p className="text-sm font-medium" style={{ color: '#2ECC71' }}>
            Aún no se han registrado fracasos
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {ranking.map(({ fdi, failures }, index) => (
            <div key={fdi} className="flex items-center gap-4">
              <div className="flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold" style={{ backgroundColor: 'rgba(245, 166, 35, 0.1)', color: '#F5A623' }}>
                {index + 1}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Hash className="w-3.5 h-3.5 text-zinc-400" />
                    <span className="font-semibold tracking-tight">Diente {fdi}</span>
                  </div>
                  <span className="text-sm font-semibold" style={{ color: '#F5A623' }}>
                    {failures} {failures === 1 ? 'fracaso' : 'fracasos'}
                  </span>
                </div>
                <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="h-1.5 rounded-full transition-all duration-700" 
                    style={{ width: `${(failures / ranking[0].failures) * 100}%`, backgroundColor: '#F5A623' }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
