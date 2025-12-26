import { BibliotecaItem, AlgoritmoContent, AlgoritmoStep } from '@/data/bibliotecaClinica';
import { ArrowDown } from 'lucide-react';

interface ItemAlgoritmoProps {
  item: BibliotecaItem;
}

export function ItemAlgoritmo({ item }: ItemAlgoritmoProps) {
  const content = item.content as AlgoritmoContent;
  
  return (
    <div className="space-y-3">
      {content.steps?.map((step: AlgoritmoStep, idx: number) => (
        <div key={step.num}>
          <div className="bg-white/40 dark:bg-zinc-800/40 backdrop-blur-sm rounded-xl p-4 shadow-sm">
            <div className="flex items-start gap-4">
              <div
                className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-base font-bold text-white shadow-md"
                style={{ backgroundColor: '#3A7AFE' }}
              >
                {step.num}
              </div>
              <div className="flex-1 space-y-1">
                <h4 className="font-semibold text-zinc-800 dark:text-zinc-100">
                  {step.title}
                </h4>
                <p className="text-sm text-zinc-600 dark:text-zinc-300">
                  {step.description}
                </p>
              </div>
            </div>
          </div>
          
          {idx < content.steps.length - 1 && (
            <div className="flex justify-center py-2">
              <ArrowDown className="w-5 h-5 text-zinc-400" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
