// client/src/lib/vision.ts

export type RadiographMoment = 'baseline' | 'control_1m' | 'control_3m' | 'control_6m';

export interface RadiographAnalysis {
  pai: number | null;                 // PAI 1–5 estimado por IA
  radiolucencyDetected: boolean;      // true/false
  lesionDiameterMm: number | null;    // diámetro máximo estimado
  laminaDuraIntact: boolean | null;   // true = íntegra, false = pérdida, null = no claro
  pdlWidening: 'none' | 'mild' | 'moderate' | 'severe' | null;
  borders: 'well-defined' | 'ill-defined' | null;
  comments: string;                   // mini-informe radiológico
}

/**
 * 🔥 Punto ÚNICO donde se habla con la IA de visión.
 * Recibe la URL pública de la radiografía y devuelve hallazgos normalizados.
 *
 * Ahora mismo te dejo un stub que NO rompe nada:
 * solo tienes que sustituir la parte marcada con TODO
 * por la llamada real a OpenAI / Gemini / Replit, etc.
 */
export async function analyzeRadiographFromUrl(
  publicUrl: string,
  options: { tipo: 'periapical' | 'cbct'; momento: RadiographMoment }
): Promise<RadiographAnalysis> {
  const { tipo, momento } = options;

  const systemPrompt = `
Eres un asistente experto en radiología endodóntica.
Analiza la imagen (${tipo}, momento clínico: ${momento}) y devuelve SOLO un JSON válido con este formato exacto:

{
  "pai": number | null,                // entero 1-5 según índice PAI, o null si no puedes estimarlo
  "radiolucencyDetected": boolean,     // true si ves lesión radiolúcida periapical
  "lesionDiameterMm": number | null,   // diámetro máximo de la lesión en mm (aproximado), o null si no hay
  "laminaDuraIntact": true | false | null,  // true = íntegra, false = pérdida/discontinuidad, null = no claro
  "pdlWidening": "none" | "mild" | "moderate" | "severe" | null,
  "borders": "well-defined" | "ill-defined" | null,
  "comments": string                   // resumen muy breve de los hallazgos principales (máx. 2 frases)
}

No añadas nada fuera del JSON.
Si no puedes valorar algo con seguridad, usa null.
`;

  // TODO: 👇 Sustituir por tu llamada real a la IA de visión.
  // Ejemplo de pseudo-código (AJÚSTALO a tu proveedor real):
  //
  // const resp = await fetch("https://TU_ENDPOINT_DE_VISION", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({
  //     prompt: systemPrompt,
  //     imageUrl: publicUrl,
  //   }),
  // });
  // const text = await resp.text();
  // const parsed = JSON.parse(text) as RadiographAnalysis;
  // return parsed;

  // Mientras tanto, devolvemos algo neutro que NO rompe nada:
  const fallback: RadiographAnalysis = {
    pai: null,
    radiolucencyDetected: false,
    lesionDiameterMm: null,
    laminaDuraIntact: null,
    pdlWidening: null,
    borders: null,
    comments: "Análisis radiográfico IA pendiente de implementación.",
  };

  return fallback;
}
