import { BibliotecaItem, TextoContent } from '@/data/bibliotecaClinica';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface ItemFAQProps {
  item: BibliotecaItem;
  defaultOpen?: boolean;
}

export function ItemFAQ({ item, defaultOpen = false }: ItemFAQProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const content = item.content as TextoContent;
  
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="w-full flex items-center justify-between gap-4 py-1 hover:opacity-80 transition-opacity">
        <h3 className="text-left font-medium text-zinc-800 dark:text-zinc-100">
          {content.question || item.title}
        </h3>
        <ChevronDown
          className={`w-5 h-5 text-zinc-400 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
        />
      </CollapsibleTrigger>
      
      <CollapsibleContent className="pt-3 space-y-3">
        <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
          {content.answer}
        </p>
        
        {content.management && (
          <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
            <p className="text-sm text-zinc-600 dark:text-zinc-300">
              <span className="font-semibold text-zinc-700 dark:text-zinc-200">Manejo: </span>
              {content.management}
            </p>
          </div>
        )}
        
        {content.alternatives && (
          <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
            <p className="text-sm text-zinc-600 dark:text-zinc-300">
              <span className="font-semibold text-zinc-700 dark:text-zinc-200">Alternativas: </span>
              {content.alternatives}
            </p>
          </div>
        )}
        
        {content.note && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400 italic">
            {content.note}
          </p>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
