import { BibliotecaItem } from '@/data/bibliotecaClinica';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ItemRecursoProps {
  item: BibliotecaItem;
}

export function ItemRecurso({ item }: ItemRecursoProps) {
  if (!item.externalUrl) {
    return (
      <div className="text-sm text-zinc-500 dark:text-zinc-400 italic">
        {item.shortDescription || 'Recurso sin enlace disponible'}
      </div>
    );
  }
  
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex-1">
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          {item.shortDescription}
        </p>
      </div>
      <Button
        variant="outline"
        size="sm"
        asChild
        className="flex-shrink-0 gap-2"
      >
        <a
          href={item.externalUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <ExternalLink className="w-4 h-4" />
          Abrir recurso
        </a>
      </Button>
    </div>
  );
}
