import { useState } from 'react';
import { ClinicoCase } from './types';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight, Eye, Hash, ArrowRight } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface HistorialDientesProps {
  casos: ClinicoCase[];
  onVerDetalle?: (caso: ClinicoCase) => void;
}

export function HistorialDientes({ casos, onVerDetalle }: HistorialDientesProps) {
  const [expandedTeeth, setExpandedTeeth] = useState<Set<string>>(new Set());
  
  const groupedByTooth = new Map<string, ClinicoCase[]>();
  
  casos.forEach(caso => {
    if (caso.tooth_fdi) {
      const fdi = String(caso.tooth_fdi);
      if (!groupedByTooth.has(fdi)) {
        groupedByTooth.set(fdi, []);
      }
      groupedByTooth.get(fdi)!.push(caso);
    }
  });
  
  const sortedTeeth = Array.from(groupedByTooth.entries())
    .sort((a, b) => b[1].length - a[1].length);
  
  const toggleTooth = (fdi: string) => {
    const newExpanded = new Set(expandedTeeth);
    if (newExpanded.has(fdi)) {
      newExpanded.delete(fdi);
    } else {
      newExpanded.add(fdi);
    }
    setExpandedTeeth(newExpanded);
  };

  if (sortedTeeth.length === 0) {
    return (
      <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl rounded-xl shadow-lg shadow-black/10 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Hash className="w-5 h-5" style={{ color: '#3A7AFE' }} />
          <h3 className="text-lg font-semibold tracking-tight">Historial de dientes tratados</h3>
        </div>
        <p className="text-sm text-zinc-400">No hay casos con dientes registrados</p>
      </div>
    );
  }

  return (
    <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl rounded-xl shadow-lg shadow-black/10 p-6">
      <div className="flex items-center gap-2 mb-2">
        <Hash className="w-5 h-5" style={{ color: '#3A7AFE' }} />
        <h3 className="text-lg font-semibold tracking-tight">Historial de dientes tratados</h3>
      </div>
      <p className="text-sm text-zinc-400 mb-6">
        {sortedTeeth.length} {sortedTeeth.length === 1 ? 'diente tratado' : 'dientes tratados'}
      </p>
      
      <div className="space-y-3">
        {sortedTeeth.map(([fdi, casosDelDiente]) => {
          const isExpanded = expandedTeeth.has(fdi);
          return (
            <Collapsible key={fdi} open={isExpanded} onOpenChange={() => toggleTooth(fdi)}>
              <div className="bg-white/40 dark:bg-zinc-800/40 backdrop-blur-sm rounded-xl border border-zinc-200/50 dark:border-zinc-700/50 overflow-hidden transition-all duration-300 hover:shadow-md">
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between p-5 h-auto hover:bg-zinc-100/50 dark:hover:bg-zinc-700/30 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 transition-transform" style={{ color: '#3A7AFE' }} />
                      ) : (
                        <ChevronRight className="w-4 h-4 transition-transform" style={{ color: '#3A7AFE' }} />
                      )}
                      <Hash className="w-4 h-4" style={{ color: '#A6A6A6' }} />
                      <span className="font-semibold tracking-tight">Diente {fdi}</span>
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ backgroundColor: 'rgba(58, 122, 254, 0.1)', color: '#3A7AFE' }}>
                        {casosDelDiente.length} {casosDelDiente.length === 1 ? 'caso' : 'casos'}
                      </span>
                    </div>
                  </Button>
                </CollapsibleTrigger>
                
                <CollapsibleContent className="transition-all duration-300">
                  <div className="border-t border-zinc-200/50 dark:border-zinc-700/50 divide-y divide-zinc-200/30 dark:divide-zinc-700/30">
                    {casosDelDiente.map(caso => (
                      <div key={caso.case_id} className="p-4 flex items-center justify-between hover:bg-zinc-800/20 dark:hover:bg-zinc-700/20 transition-all group">
                        <div className="space-y-1.5 flex-1">
                          <p className="font-mono text-xs text-zinc-400">{caso.case_id}</p>
                          <p className="text-sm font-medium">
                            {caso.registro_fecha || caso.date || 'N/A'}
                          </p>
                          {(caso.tto_realizado || caso.tto_propuesto) && (
                            <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium" style={{ backgroundColor: 'rgba(46, 204, 113, 0.1)', color: '#2ECC71' }}>
                              {caso.tto_realizado || caso.tto_propuesto}
                            </span>
                          )}
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onVerDetalle?.(caso)}
                          className="gap-2 opacity-70 hover:opacity-100 transition-opacity"
                        >
                          <ArrowRight className="w-3 h-3" />
                          Ver detalles
                        </Button>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          );
        })}
      </div>
    </div>
  );
}
