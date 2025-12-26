import { useState } from 'react';
import { ClinicoCase } from './types';
import { Grid3x3 } from 'lucide-react';

interface FDIHeatmapProps {
  casos: ClinicoCase[];
  onFilterByTooth?: (fdi: string | null) => void;
  onSelectFDI?: (fdi: string) => void;
}

export function FDIHeatmap({ casos, onFilterByTooth, onSelectFDI }: FDIHeatmapProps) {
  const [selectedTooth, setSelectedTooth] = useState<string | null>(null);
  
  const toothCounts = new Map<string, number>();
  casos.forEach(caso => {
    if (caso.tooth_fdi) {
      const fdi = String(caso.tooth_fdi);
      toothCounts.set(fdi, (toothCounts.get(fdi) || 0) + 1);
    }
  });
  
  const getToothColor = (count: number): { bg: string; text: string } => {
    if (count === 0) return { bg: 'rgba(166, 166, 166, 0.2)', text: '#A6A6A6' };
    if (count <= 2) return { bg: 'rgba(58, 122, 254, 0.3)', text: '#3A7AFE' };
    if (count <= 5) return { bg: 'rgba(58, 122, 254, 0.6)', text: '#3A7AFE' };
    return { bg: '#3A7AFE', text: '#ffffff' };
  };
  
  const handleToothClick = (fdi: string) => {
    if (onSelectFDI) {
      onSelectFDI(fdi);
    } else if (onFilterByTooth) {
      if (selectedTooth === fdi) {
        setSelectedTooth(null);
        onFilterByTooth(null);
      } else {
        setSelectedTooth(fdi);
        onFilterByTooth(fdi);
      }
    }
  };
  
  const upperRight = [18, 17, 16, 15, 14, 13, 12, 11];
  const upperLeft = [21, 22, 23, 24, 25, 26, 27, 28];
  const lowerLeft = [31, 32, 33, 34, 35, 36, 37, 38];
  const lowerRight = [48, 47, 46, 45, 44, 43, 42, 41];

  return (
    <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl rounded-xl shadow-lg shadow-black/10 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Grid3x3 className="w-5 h-5" style={{ color: '#3A7AFE' }} />
            <h3 className="text-lg font-semibold tracking-tight">Mapa de dientes FDI</h3>
          </div>
          <p className="text-sm text-zinc-400">
            Haz clic en un diente para ver sus casos
          </p>
        </div>
      </div>
      <div>
        <div className="space-y-6">
          <div className="grid grid-cols-8 gap-1">
            {upperRight.map(fdi => {
              const count = toothCounts.get(String(fdi)) || 0;
              const colors = getToothColor(count);
              return (
                <button
                  key={fdi}
                  onClick={() => handleToothClick(String(fdi))}
                  className="aspect-square rounded-lg flex flex-col items-center justify-center text-xs font-semibold transition-all hover:scale-105"
                  style={{ 
                    backgroundColor: colors.bg, 
                    color: colors.text,
                    ...(selectedTooth === String(fdi) ? { boxShadow: '0 0 0 2px #3A7AFE', transform: 'scale(1.05)' } : {})
                  }}
                >
                  <span>{fdi}</span>
                  <span className="text-[10px]">{count}</span>
                </button>
              );
            })}
            {upperLeft.map(fdi => {
              const count = toothCounts.get(String(fdi)) || 0;
              const colors = getToothColor(count);
              return (
                <button
                  key={fdi}
                  onClick={() => handleToothClick(String(fdi))}
                  className="aspect-square rounded-lg flex flex-col items-center justify-center text-xs font-semibold transition-all hover:scale-105"
                  style={{ 
                    backgroundColor: colors.bg, 
                    color: colors.text,
                    ...(selectedTooth === String(fdi) ? { boxShadow: '0 0 0 2px #3A7AFE', transform: 'scale(1.05)' } : {})
                  }}
                >
                  <span>{fdi}</span>
                  <span className="text-[10px]">{count}</span>
                </button>
              );
            })}
          </div>
          
          <div className="border-t border-dashed pt-6"></div>
          
          <div className="grid grid-cols-8 gap-1">
            {lowerLeft.map(fdi => {
              const count = toothCounts.get(String(fdi)) || 0;
              const colors = getToothColor(count);
              return (
                <button
                  key={fdi}
                  onClick={() => handleToothClick(String(fdi))}
                  className="aspect-square rounded-lg flex flex-col items-center justify-center text-xs font-semibold transition-all hover:scale-105"
                  style={{ 
                    backgroundColor: colors.bg, 
                    color: colors.text,
                    ...(selectedTooth === String(fdi) ? { boxShadow: '0 0 0 2px #3A7AFE', transform: 'scale(1.05)' } : {})
                  }}
                >
                  <span>{fdi}</span>
                  <span className="text-[10px]">{count}</span>
                </button>
              );
            })}
            {lowerRight.map(fdi => {
              const count = toothCounts.get(String(fdi)) || 0;
              const colors = getToothColor(count);
              return (
                <button
                  key={fdi}
                  onClick={() => handleToothClick(String(fdi))}
                  className="aspect-square rounded-lg flex flex-col items-center justify-center text-xs font-semibold transition-all hover:scale-105"
                  style={{ 
                    backgroundColor: colors.bg, 
                    color: colors.text,
                    ...(selectedTooth === String(fdi) ? { boxShadow: '0 0 0 2px #3A7AFE', transform: 'scale(1.05)' } : {})
                  }}
                >
                  <span>{fdi}</span>
                  <span className="text-[10px]">{count}</span>
                </button>
              );
            })}
          </div>
        </div>
        
        <div className="flex items-center gap-6 mt-8 pt-6 border-t border-zinc-200/50 dark:border-zinc-700/50 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
            <span className="text-zinc-500">0 casos</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgba(58, 122, 254, 0.3)' }}></div>
            <span className="text-zinc-500">1-2</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgba(58, 122, 254, 0.6)' }}></div>
            <span className="text-zinc-500">3-5</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#3A7AFE' }}></div>
            <span className="text-zinc-500">{'>'}5</span>
          </div>
        </div>
      </div>
    </div>
  );
}
