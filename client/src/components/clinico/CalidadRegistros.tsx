import { ClinicoCase } from './types';
import { getCaseQualityScore } from './helpers';
import { ClipboardCheck } from 'lucide-react';

interface CalidadRegistrosProps {
  casos: ClinicoCase[];
}

export function CalidadRegistros({ casos }: CalidadRegistrosProps) {
  if (casos.length === 0) return null;
  
  let withNotes = 0;
  let withKeyFields = 0;
  let withAnyControl = 0;
  
  casos.forEach(caso => {
    const quality = getCaseQualityScore(caso);
    if (quality.hasNotes) withNotes++;
    if (quality.hasKeyFields) withKeyFields++;
    if (quality.hasAnyControl) withAnyControl++;
  });
  
  const notesPercent = Math.round((withNotes / casos.length) * 100);
  const keyFieldsPercent = Math.round((withKeyFields / casos.length) * 100);
  const controlPercent = Math.round((withAnyControl / casos.length) * 100);

  return (
    <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl rounded-xl shadow-lg shadow-black/10 p-6 transition-all duration-300 hover:shadow-xl">
      <div className="flex items-center gap-2 mb-6">
        <ClipboardCheck className="w-5 h-5" style={{ color: '#2ECC71' }} />
        <h3 className="text-lg font-semibold tracking-tight">Calidad de registros</h3>
      </div>
      
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Casos con notas</span>
            <span className="text-sm font-semibold" style={{ color: '#3A7AFE' }}>{notesPercent}%</span>
          </div>
          <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-2.5 overflow-hidden">
            <div 
              className="h-2.5 rounded-full transition-all duration-700 ease-out" 
              style={{ width: `${notesPercent}%`, backgroundColor: '#3A7AFE' }}
            />
          </div>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Campos clave completos</span>
            <span className="text-sm font-semibold" style={{ color: '#2ECC71' }}>{keyFieldsPercent}%</span>
          </div>
          <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-2.5 overflow-hidden">
            <div 
              className="h-2.5 rounded-full transition-all duration-700 ease-out" 
              style={{ width: `${keyFieldsPercent}%`, backgroundColor: '#2ECC71' }}
            />
          </div>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Con al menos un control</span>
            <span className="text-sm font-semibold" style={{ color: '#B983FF' }}>{controlPercent}%</span>
          </div>
          <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-2.5 overflow-hidden">
            <div 
              className="h-2.5 rounded-full transition-all duration-700 ease-out" 
              style={{ width: `${controlPercent}%`, backgroundColor: '#B983FF' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
