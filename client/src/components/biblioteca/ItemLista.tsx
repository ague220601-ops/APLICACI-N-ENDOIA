import { BibliotecaItem, ListaContent } from '@/data/bibliotecaClinica';
import { Clock, AlertTriangle } from 'lucide-react';

interface ItemListaProps {
  item: BibliotecaItem;
}

export function ItemLista({ item }: ItemListaProps) {
  const content = item.content as ListaContent;
  
  return (
    <div className="space-y-4">
      <ol className="space-y-3">
        {content.steps?.map((step: string, idx: number) => (
          <li key={idx} className="flex items-start gap-3">
            <span
              className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{ backgroundColor: '#3A7AFE' }}
            >
              {idx + 1}
            </span>
            <span className="text-sm text-zinc-600 dark:text-zinc-300 pt-0.5">
              {step}
            </span>
          </li>
        ))}
      </ol>
      
      {content.timeWindow && (
        <div className="flex items-start gap-2 p-3 rounded-lg" style={{ backgroundColor: 'rgba(245, 166, 35, 0.1)' }}>
          <Clock className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#F5A623' }} />
          <p className="text-sm font-medium" style={{ color: '#F5A623' }}>
            {content.timeWindow}
          </p>
        </div>
      )}
      
      {content.alerts && (
        <div className="space-y-2">
          {content.alerts.map((alert: string, idx: number) => (
            <div key={idx} className="flex items-start gap-2 p-3 rounded-lg" style={{ backgroundColor: 'rgba(245, 166, 35, 0.1)' }}>
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#F5A623' }} />
              <p className="text-sm" style={{ color: '#F5A623' }}>
                {alert}
              </p>
            </div>
          ))}
        </div>
      )}
      
      {content.notes && (
        <div className="pt-3 border-t border-zinc-200 dark:border-zinc-700">
          <p className="text-sm text-zinc-500 dark:text-zinc-400 italic">
            {content.notes}
          </p>
        </div>
      )}
    </div>
  );
}
