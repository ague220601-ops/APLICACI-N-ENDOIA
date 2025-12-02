import { BibliotecaItem, getCategoriaLabel } from '@/data/bibliotecaClinica';
import { ItemTexto } from './ItemTexto';
import { ItemTabla } from './ItemTabla';
import { ItemLista } from './ItemLista';
import { ItemAlgoritmo } from './ItemAlgoritmo';
import { ItemRecurso } from './ItemRecurso';
import { ItemFAQ } from './ItemFAQ';

interface BibliotecaCardProps {
  item: BibliotecaItem;
  showCategoria?: boolean;
}

export function BibliotecaCard({ item, showCategoria = false }: BibliotecaCardProps) {
  const renderContent = () => {
    switch (item.type) {
      case 'texto':
        return <ItemTexto item={item} />;
      case 'tabla':
        return <ItemTabla item={item} />;
      case 'lista':
        return <ItemLista item={item} />;
      case 'algoritmo':
        return <ItemAlgoritmo item={item} />;
      case 'enlace':
        return <ItemRecurso item={item} />;
      default:
        return null;
    }
  };
  
  if (item.type === 'enlace') {
    return (
      <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl rounded-xl shadow-lg shadow-black/10 p-6 hover:shadow-xl transition-all duration-300">
        {showCategoria && (
          <div className="mb-3">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
              {getCategoriaLabel(item.categoria)}
            </span>
          </div>
        )}
        
        <div className="space-y-2 mb-4">
          <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 tracking-tight">
            {item.title}
          </h3>
          {item.subtitle && (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {item.subtitle}
            </p>
          )}
        </div>
        
        {renderContent()}
        
        {item.reference && (
          <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-700">
            <p className="text-xs text-zinc-400">
              Fuente: {item.reference}
            </p>
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl rounded-xl shadow-lg shadow-black/10 p-6 hover:shadow-xl transition-all duration-300">
      {showCategoria && (
        <div className="mb-3">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
            {getCategoriaLabel(item.categoria)}
          </span>
        </div>
      )}
      
      <div className="space-y-2 mb-4">
        <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 tracking-tight">
          {item.title}
        </h3>
        {item.subtitle && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {item.subtitle}
          </p>
        )}
      </div>
      
      {item.type === 'texto' && renderContent()}
      {item.type === 'tabla' && renderContent()}
      {item.type === 'lista' && renderContent()}
      {item.type === 'algoritmo' && renderContent()}
      
      {item.reference && (
        <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-700">
          <p className="text-xs text-zinc-400">
            Fuente: {item.reference}
          </p>
        </div>
      )}
      
      {item.tags && item.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="inline-block px-2 py-0.5 rounded text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
