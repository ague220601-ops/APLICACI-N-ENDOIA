import { useState } from "react";
import { calcularExitoRadiologico, type ExitoRadiologico } from "@/lib/radiographs";
import { Calculator, Loader2, CheckCircle, AlertCircle, XCircle, HelpCircle } from "lucide-react";

interface BotonExitoRadiologicoProps {
  caseId: string;
  onCalculated?: (resultado: ExitoRadiologico) => void;
}

const RESULTADO_CONFIG: Record<ExitoRadiologico, { 
  label: string; 
  color: string; 
  bgColor: string;
  icon: typeof CheckCircle;
}> = {
  exito: { 
    label: 'Éxito', 
    color: 'text-green-700', 
    bgColor: 'bg-green-100 dark:bg-green-900/30',
    icon: CheckCircle
  },
  parcial: { 
    label: 'Curación parcial', 
    color: 'text-yellow-700', 
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
    icon: AlertCircle
  },
  fracaso: { 
    label: 'Fracaso', 
    color: 'text-red-700', 
    bgColor: 'bg-red-100 dark:bg-red-900/30',
    icon: XCircle
  },
  indeterminado: { 
    label: 'Indeterminado', 
    color: 'text-zinc-500', 
    bgColor: 'bg-zinc-100 dark:bg-zinc-800',
    icon: HelpCircle
  },
};

export function BotonExitoRadiologico({ caseId, onCalculated }: BotonExitoRadiologicoProps) {
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<ExitoRadiologico | null>(null);

  async function handleCalcular() {
    setLoading(true);
    try {
      const res = await calcularExitoRadiologico(caseId);
      setResultado(res);
      onCalculated?.(res);
    } catch (err) {
      console.error("Error calculando éxito radiológico:", err);
      alert("Error al calcular. Verifica que existan radiografías baseline y followup.");
    } finally {
      setLoading(false);
    }
  }

  if (resultado) {
    const config = RESULTADO_CONFIG[resultado];
    const Icon = config.icon;
    
    return (
      <div className={`p-3 rounded-lg ${config.bgColor} flex items-center gap-2`}>
        <Icon className={`w-5 h-5 ${config.color}`} />
        <div>
          <p className="text-xs text-zinc-500">Éxito radiológico</p>
          <p className={`font-bold ${config.color}`}>{config.label}</p>
        </div>
        <button 
          onClick={handleCalcular}
          className="ml-auto text-xs text-zinc-500 hover:text-zinc-700 underline"
        >
          Recalcular
        </button>
      </div>
    );
  }

  return (
    <button 
      onClick={handleCalcular}
      disabled={loading}
      className="w-full mt-3 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Calculando...
        </>
      ) : (
        <>
          <Calculator className="w-4 h-4" />
          Calcular éxito radiológico
        </>
      )}
    </button>
  );
}
