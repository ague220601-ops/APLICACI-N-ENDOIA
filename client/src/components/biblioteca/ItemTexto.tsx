import { BibliotecaItem, TextoContent } from '@/data/bibliotecaClinica';

interface ItemTextoProps {
  item: BibliotecaItem;
}

export function ItemTexto({ item }: ItemTextoProps) {
  const content = item.content as TextoContent;
  
  return (
    <div className="space-y-3">
      <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
        {content.description}
      </p>
      
      {content.clinicalSigns && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">
            Signos clínicos:
          </h4>
          <ul className="space-y-1">
            {content.clinicalSigns.map((sign: string, idx: number) => (
              <li key={idx} className="text-sm text-zinc-600 dark:text-zinc-400 flex items-start gap-2">
                <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: '#3A7AFE' }} />
                <span>{sign}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {content.management && (
        <div className="pt-3 border-t border-zinc-200 dark:border-zinc-700">
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            <span className="font-semibold text-zinc-700 dark:text-zinc-200">Manejo: </span>
            {content.management}
          </p>
        </div>
      )}
    </div>
  );
}
