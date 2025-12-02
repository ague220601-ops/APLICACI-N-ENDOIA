import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  bibliotecaData,
  BibliotecaCategoria,
  getCategoriaLabel,
  getCategoriaIcon,
} from '@/data/bibliotecaClinica';
import { BibliotecaList } from '@/components/biblioteca/BibliotecaList';
import {
  Search,
  Layers,
  Activity,
  AlertCircle,
  GitBranch,
  GitMerge,
  ExternalLink,
  HelpCircle,
  BookOpen,
  Pill,
  LucideIcon,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  layers: Layers,
  activity: Activity,
  'alert-circle': AlertCircle,
  'git-branch': GitBranch,
  'git-merge': GitMerge,
  'external-link': ExternalLink,
  'help-circle': HelpCircle,
  pill: Pill,
};

const categorias: BibliotecaCategoria[] = [
  'clasificacion',
  'reabsorciones',
  'farmacologia',
  'trauma',
  'urgencias',
  'algoritmos_dx',
  'algoritmos_tx',
  'recursos',
  'faq',
];

export default function BibliotecaPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<BibliotecaCategoria>('clasificacion');

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) {
      return null;
    }

    const query = searchQuery.toLowerCase();
    return bibliotecaData.filter((item) => {
      const matchTitle = item.title.toLowerCase().includes(query);
      const matchSubtitle = item.subtitle?.toLowerCase().includes(query);
      const matchDescription = item.shortDescription?.toLowerCase().includes(query);
      const matchTags = item.tags?.some((tag) => tag.toLowerCase().includes(query));
      
      return matchTitle || matchSubtitle || matchDescription || matchTags;
    });
  }, [searchQuery]);

  const currentCategoryItems = useMemo(() => {
    return bibliotecaData.filter((item) => item.categoria === activeTab);
  }, [activeTab]);

  const displayItems = filteredItems !== null ? filteredItems : currentCategoryItems;
  const showingSearchResults = filteredItems !== null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div
              className="p-4 rounded-2xl shadow-lg"
              style={{ backgroundColor: 'rgba(58, 122, 254, 0.1)' }}
            >
              <BookOpen className="w-8 h-8" style={{ color: '#3A7AFE' }} />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100">
                Biblioteca Clínica ENDOIA
              </h1>
              <p className="text-zinc-500 dark:text-zinc-400 mt-2">
                Referencia rápida basada en guías oficiales (AAE/ESE 2025, IADT, etc.)
              </p>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <Input
              type="text"
              placeholder="Buscar en la biblioteca..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 text-base bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border-zinc-200 dark:border-zinc-700 focus:ring-2"
              style={{
                '--tw-ring-color': '#3A7AFE',
              } as React.CSSProperties}
            />
          </div>
        </div>

        {showingSearchResults ? (
          <div className="space-y-6 animate-in fade-in-0 duration-500">
            <div className="flex items-center gap-3">
              <div
                className="px-4 py-2 rounded-full text-sm font-medium"
                style={{ backgroundColor: 'rgba(58, 122, 254, 0.1)', color: '#3A7AFE' }}
              >
                {displayItems.length} {displayItems.length === 1 ? 'resultado' : 'resultados'}
              </div>
              <button
                onClick={() => setSearchQuery('')}
                className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 underline"
              >
                Limpiar búsqueda
              </button>
            </div>
            
            <BibliotecaList items={displayItems} showCategoria={true} />
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as BibliotecaCategoria)}>
            <div className="overflow-x-auto">
              <TabsList className="inline-flex w-auto h-auto p-1 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl rounded-xl shadow-lg">
                {categorias.map((cat) => {
                  const iconName = getCategoriaIcon(cat);
                  const IconComponent = iconMap[iconName];
                  
                  return (
                    <TabsTrigger
                      key={cat}
                      value={cat}
                      className="gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:shadow-md px-4 py-2.5 rounded-lg transition-all"
                    >
                      {IconComponent && <IconComponent className="w-4 h-4" />}
                      <span className="hidden sm:inline text-sm font-medium">
                        {getCategoriaLabel(cat).replace(/\s*\(.*?\)\s*/g, '')}
                      </span>
                      <span className="sm:hidden text-sm font-medium">
                        {getCategoriaLabel(cat).split(' ')[0]}
                      </span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>

            {categorias.map((cat) => (
              <TabsContent
                key={cat}
                value={cat}
                className="mt-6 animate-in fade-in-0 duration-500"
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold tracking-tight text-zinc-800 dark:text-zinc-100">
                    {getCategoriaLabel(cat)}
                  </h2>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                    {getCategoryDescription(cat)}
                  </p>
                </div>
                
                <BibliotecaList items={currentCategoryItems} />
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </div>
  );
}

function getCategoryDescription(categoria: BibliotecaCategoria): string {
  const descriptions: Record<BibliotecaCategoria, string> = {
    clasificacion: 'Sistema de diagnóstico pulpar y apical según consenso AAE/ESE 2025',
    reabsorciones: 'Clasificación, diagnóstico y manejo de reabsorciones radiculares post-trauma según IADT 2024',
    farmacologia: 'Protocolos farmacológicos basados en evidencia ADA/AAE 2024: analgesia, antibióticos y drenaje',
    trauma: 'Protocolos de manejo de traumatismos dentoalveolares basados en IADT 2020',
    urgencias: 'Guía de manejo de urgencias endodónticas y situaciones agudas',
    algoritmos_dx: 'Algoritmos paso a paso para diagnóstico endodóntico sistemático',
    algoritmos_tx: 'Árboles de decisión terapéutica según diagnóstico y factores clínicos',
    recursos: 'Enlaces a guías oficiales y recursos de sociedades científicas',
    faq: 'Preguntas frecuentes sobre práctica clínica endodóntica',
  };
  return descriptions[categoria];
}
