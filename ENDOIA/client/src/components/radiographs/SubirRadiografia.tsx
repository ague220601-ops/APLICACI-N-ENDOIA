import { useState } from "react";
import { uploadRadiographWithVision, uploadImageToStorage, getSignedUrl } from "@/lib/radiographs";
import type { RadiographMoment } from "@/lib/vision";

interface SubirRadiografiaProps {
  caseId: string;
  toothFdi?: number;
  defaultMomento?: RadiographMoment;
  defaultTipo?: "periapical" | "cbct";
  allowSelectMomento?: boolean;
  onUploadSuccess?: () => void;
}

interface ToothDetectionResult {
  detected: boolean;
  fdi: number;
  toothName?: string;
  confidence: number;
  notes: string;
}

export function SubirRadiografia({
  caseId,
  toothFdi,
  defaultMomento = "baseline",
  defaultTipo = "periapical",
  allowSelectMomento = true,
  onUploadSuccess,
}: SubirRadiografiaProps) {
  const [file, setFile] = useState<File | null>(null);
  const [momento, setMomento] = useState<RadiographMoment>(defaultMomento);
  const [tipo, setTipo] = useState<"periapical" | "cbct">(defaultTipo);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string>("");

  async function handleUpload() {
    if (!file) return alert("Selecciona una imagen");

    if (!toothFdi) {
      return proceedWithUpload(file);
    }

    setLoading(true);
    setStatusMsg("Verificando diente en la imagen...");

    try {
      const timestamp = Date.now();
      const tempPath = `${caseId}/temp-check-${timestamp}.jpg`;
      await uploadImageToStorage(file, tempPath);
      const tempUrl = await getSignedUrl(tempPath);

      const detection: ToothDetectionResult = await fetch("/api/vision-detect-teeth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: tempUrl,
          targetFdi: toothFdi
        }),
      }).then(r => r.json());

      console.log("🦷 Resultado detección:", detection);

      if (!detection.detected) {
        const toothName = getToothName(toothFdi);
        const userConfirm = window.confirm(
          `⚠️ El diente FDI ${toothFdi} (${toothName}) no aparece en la radiografía.\n\n` +
          `Motivo: ${detection.notes}\n\n` +
          `¿Deseas analizar igualmente la imagen completa?`
        );

        if (!userConfirm) {
          setStatusMsg("");
          setLoading(false);
          alert("Radiografía no analizada. Revisa el diente seleccionado o sube otra imagen.");
          return;
        }
      }

      if (detection.detected && detection.fdi !== toothFdi) {
        const userConfirm = window.confirm(
          `⚠️ Has seleccionado FDI ${toothFdi}, pero la IA detecta FDI ${detection.fdi}.\n\n` +
          `¿Quieres analizar la imagen igualmente?`
        );

        if (!userConfirm) {
          setStatusMsg("");
          setLoading(false);
          alert("Radiografía no analizada. Corrige el diente y vuelve a intentarlo.");
          return;
        }
      }

      await proceedWithUpload(file);

    } catch (err) {
      console.error("Error en verificación:", err);
      const userConfirm = window.confirm(
        "Error verificando el diente. ¿Deseas continuar con la subida normal?"
      );
      if (userConfirm) {
        await proceedWithUpload(file);
      } else {
        setLoading(false);
        setStatusMsg("");
      }
    }
  }

  async function proceedWithUpload(fileToUpload: File) {
    setLoading(true);
    setStatusMsg("Subiendo y analizando radiografía...");
    try {
      await uploadRadiographWithVision(fileToUpload, caseId, momento, tipo);
      setFile(null);
      onUploadSuccess?.();
    } catch (err) {
      console.error("Error subiendo radiografía:", err);
      alert("Error al subir la radiografía");
    } finally {
      setLoading(false);
      setStatusMsg("");
    }
  }

  function getToothName(fdi: number): string {
    const positions = ['', 'incisivo central', 'incisivo lateral', 'canino', '1er premolar', '2do premolar', '1er molar', '2do molar', '3er molar'];
    const quadrants = ['', 'superior derecho', 'superior izquierdo', 'inferior izquierdo', 'inferior derecho'];
    const quadrant = Math.floor(fdi / 10);
    const position = fdi % 10;
    return `${positions[position] || 'diente'} ${quadrants[quadrant] || ''}`.trim();
  }

  return (
    <div className="p-4 border rounded mt-4 bg-white dark:bg-zinc-900">
      <h3 className="font-bold mb-2">Subir radiografía</h3>

      <div className="flex flex-wrap gap-2 mb-2">
        {allowSelectMomento && (
          <select 
            value={momento} 
            onChange={(e) => setMomento(e.target.value as RadiographMoment)}
            className="border p-1 rounded dark:bg-zinc-800 dark:border-zinc-700"
          >
            <option value="baseline">Baseline</option>
            <option value="control_1m">1 mes</option>
            <option value="control_3m">3 meses</option>
            <option value="control_6m">6 meses</option>
          </select>
        )}

        <select 
          value={tipo} 
          onChange={(e) => setTipo(e.target.value as "periapical" | "cbct")}
          className="border p-1 rounded dark:bg-zinc-800 dark:border-zinc-700"
        >
          <option value="periapical">Periapical</option>
          <option value="cbct">CBCT</option>
        </select>
      </div>

      <input 
        type="file" 
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="border p-1 mt-2 w-full rounded dark:bg-zinc-800 dark:border-zinc-700"
      />

      <button 
        onClick={handleUpload}
        disabled={loading || !file}
        className="mt-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-3 py-1 rounded transition-colors"
      >
        {loading ? "Procesando..." : "Subir"}
      </button>

      {statusMsg && (
        <p className="mt-2 text-sm text-blue-600 dark:text-blue-400 animate-pulse">
          {statusMsg}
        </p>
      )}
    </div>
  );
}
