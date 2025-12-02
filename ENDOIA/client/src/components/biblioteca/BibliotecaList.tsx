import { BibliotecaItem } from '@/data/bibliotecaClinica';
import { BibliotecaCard } from './BibliotecaCard';
import { ItemFAQ } from './ItemFAQ';

interface BibliotecaListProps {
  items: BibliotecaItem[];
  showCategoria?: boolean;
}

export function BibliotecaList({ items, showCategoria = false }: BibliotecaListProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-400">No se encontraron resultados</p>
      </div>
    );
  }
  
  const faqItems = items.filter(item => item.categoria === 'faq');
  const otherItems = items.filter(item => item.categoria !== 'faq');
  
  return (
    <div className="space-y-6">
      {otherItems.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {otherItems.map((item) => (
            <BibliotecaCard key={item.id} item={item} showCategoria={showCategoria} />
          ))}
        </div>
      )}
      
      {faqItems.length > 0 && (
        <div className="space-y-4">
          {faqItems.map((item) => (
            <div
              key={item.id}
              className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl rounded-xl shadow-lg shadow-black/10 p-6 hover:shadow-xl transition-all duration-300"
            >
              {showCategoria && (
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                    FAQ Clínica
                  </span>
                </div>
              )}
              <ItemFAQ item={item} />
              {item.reference && (
                <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-700">
                  <p className="text-xs text-zinc-400">
                    Fuente: {item.reference}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
