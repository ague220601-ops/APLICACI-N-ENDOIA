import { useEffect, useState } from "react";
import { getRadiographs, getRadiographSignedUrl } from "@/lib/radiographs";
import { ImageIcon, Loader2, ExternalLink, X } from "lucide-react";

interface RadiographWithUrl {
  rad_id: number;
  case_id: string;
  filepath: string;
  tipo: string;
  momento: string;
  fecha: string;
  pai?: number;
  lesion_mm?: number;
  healing?: string;
  signedUrl?: string;
}

interface ListaRadiografiasProps {
  caseId: string;
  refreshTrigger?: number;
  showComparison?: boolean;
}

export function ListaRadiografias({ caseId, refreshTrigger, showComparison = true }: ListaRadiografiasProps) {
  const [rads, setRads] = useState<RadiographWithUrl[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalUrl, setModalUrl] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getRadiographs(caseId);
        for (const r of data) {
          (r as RadiographWithUrl).signedUrl = await getRadiographSignedUrl(r.filepath);
        }
        setRads(data as RadiographWithUrl[]);
      } catch (err) {
        console.error("Error cargando radiografías:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [caseId, refreshTrigger]);

  const baseline = rads.find(r => r.momento === 'baseline');
  const followup = rads.find(r => r.momento !== 'baseline');

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
      </div>
    );
  }

  if (rads.length === 0) {
    return (
      <div className="text-center py-12 text-zinc-400">
        <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>No hay radiografías registradas</p>
      </div>
    );
  }

  return (
    <>
      {showComparison && baseline && followup && (
        <div className="mb-6 p-4 border rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
          <h4 className="font-bold text-center mb-4">Comparativa Baseline vs Control</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-center font-medium mb-2 text-sm">Baseline</p>
              <img 
                src={baseline.signedUrl} 
                className="rounded shadow cursor-pointer hover:opacity-90 transition-opacity" 
                alt="Baseline"
                onClick={() => setModalUrl(baseline.signedUrl || '')}
              />
              {baseline.pai && (
                <p className="text-center text-sm mt-2">PAI: {baseline.pai}</p>
              )}
            </div>
            <div>
              <p className="text-center font-medium mb-2 text-sm">Control ({followup.momento})</p>
              <img 
                src={followup.signedUrl} 
                className="rounded shadow cursor-pointer hover:opacity-90 transition-opacity" 
                alt="Control"
                onClick={() => setModalUrl(followup.signedUrl || '')}
              />
              {followup.pai && (
                <p className="text-center text-sm mt-2">PAI: {followup.pai}</p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mt-4">
        {rads.map((rad) => (
          <div 
            key={rad.rad_id} 
            className="border p-2 rounded shadow-sm bg-white dark:bg-zinc-900"
          >
            <img 
              src={rad.signedUrl} 
              className="w-full rounded mb-2 cursor-pointer hover:opacity-90 transition-opacity" 
              alt="Radiografía"
              onClick={() => setModalUrl(rad.signedUrl || '')}
            />

            <div className="flex gap-2 flex-wrap">
              <span className="px-2 py-1 rounded bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs">
                {rad.tipo}
              </span>

              <span className="px-2 py-1 rounded bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs">
                {rad.momento}
              </span>
            </div>

            {rad.pai !== undefined && rad.pai !== null && (
              <p className="text-sm mt-2">
                <strong>PAI IA:</strong> {rad.pai}
              </p>
            )}

            {rad.lesion_mm !== undefined && rad.lesion_mm !== null && rad.lesion_mm > 0 && (
              <p className="text-sm">
                <strong>Lesión:</strong> {rad.lesion_mm} mm
              </p>
            )}

            {rad.healing && (
              <p className="text-sm">
                <strong>Healing:</strong> {rad.healing}
              </p>
            )}

            <button
              onClick={() => window.open(rad.signedUrl, "_blank")}
              className="mt-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded flex items-center gap-1 transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              Abrir en visor
            </button>
          </div>
        ))}
      </div>

      {modalUrl && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setModalUrl("")}
        >
          <button 
            className="absolute top-4 right-4 text-white hover:text-zinc-300 transition-colors"
            onClick={() => setModalUrl("")}
          >
            <X className="w-8 h-8" />
          </button>
          <img 
            src={modalUrl} 
            className="max-h-[90vh] max-w-[90vw] rounded shadow-2xl" 
            alt="Radiografía ampliada"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
