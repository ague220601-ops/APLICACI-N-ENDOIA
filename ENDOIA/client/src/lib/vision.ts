export type RadiographMoment = 'baseline' | 'control_1m' | 'control_3m' | 'control_6m';

export interface RadiographAnalysis {
  pai: number | null;
  radiolucencyDetected: boolean;
  lesionDiameterMm: number | null;
  laminaDuraIntact: boolean | null;
  pdlWidening: 'none' | 'normal' | 'mild' | 'moderate' | 'severe' | null;
  borders: 'well-defined' | 'ill-defined' | null;
  comments: string;
}

export async function analyzeRadiographFromUrl(
  publicUrl: string,
  options: { tipo: 'periapical' | 'cbct'; momento: RadiographMoment }
): Promise<RadiographAnalysis> {
  const res = await fetch("/api/vision-analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      imageUrl: publicUrl,
      tipo: options.tipo,
      momento: options.momento,
    }),
  });

  if (!res.ok) {
    console.error("Error en /api/vision-analyze:", res.status, await res.text());
    return {
      pai: null,
      radiolucencyDetected: false,
      lesionDiameterMm: null,
      laminaDuraIntact: null,
      pdlWidening: null,
      borders: null,
      comments: "Análisis radiográfico IA no disponible.",
    };
  }

  const data = await res.json();

  const analysis: RadiographAnalysis = {
    pai: typeof data.pai === "number" ? data.pai : null,
    radiolucencyDetected: Boolean(data.radiolucencyDetected),
    lesionDiameterMm:
      typeof data.lesionDiameterMm === "number" ? data.lesionDiameterMm : null,
    laminaDuraIntact:
      typeof data.laminaDuraIntact === "boolean" || data.laminaDuraIntact === null
        ? data.laminaDuraIntact
        : null,
    pdlWidening: data.pdlWidening ?? null,
    borders: data.borders ?? null,
    comments: typeof data.comments === "string" ? data.comments : "",
  };

  return analysis;
}
