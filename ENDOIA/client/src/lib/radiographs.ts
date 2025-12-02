import { supabase } from "./supabase";
import { analyzeRadiographFromUrl, RadiographMoment } from "./vision";

export const BUCKET_NAME = "radiographs";

export async function uploadImageToStorage(file: File, filePath: string): Promise<void> {
  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, { upsert: true });
  
  if (error) {
    console.error("❌ Error subiendo imagen:", error);
    throw error;
  }
}

export async function getSignedUrl(filePath: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .createSignedUrl(filePath, 3600);
  
  if (error || !data?.signedUrl) {
    throw new Error("No se pudo obtener URL firmada");
  }
  
  return data.signedUrl;
}

export interface Radiograph {
  rad_id?: number;
  case_id: string;
  filepath: string;
  tipo: "periapical" | "cbct";
  momento: RadiographMoment;
  fecha: string;
  pai?: number;
  lesion_mm?: number;
  lamina_dura?: string;
  pdl_status?: string;
  borders?: string;
  notas?: string;
  healing?: string;
}

export interface ToothDetectionResult {
  detected: boolean;
  fdi: number;
  toothName?: string;
  confidence: number;
  notes: string;
}

export async function uploadRadiograph(
  file: File, 
  caseId: string, 
  momento: string, 
  tipo: string
): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const filePath = `${caseId}/${momento}-${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('radiographs')
    .upload(filePath, file);

  if (uploadError) {
    console.error("❌ Error subiendo radiografía:", uploadError);
    throw uploadError;
  }

  const { data: publicUrlData } = supabase.storage
    .from("radiographs")
    .getPublicUrl(filePath);

  const publicUrl = publicUrlData.publicUrl;

  let ai: { pai: number | null; lesion_mm: number | null } = { 
    pai: null, 
    lesion_mm: null
  };
  
  if (publicUrl) {
    try {
      const momentoMap: Record<string, RadiographMoment> = {
        'baseline': 'baseline',
        '1m': 'control_1m',
        '3m': 'control_3m',
        '6m': 'control_6m'
      };
      const resultado = await analyzeRadiographFromUrl(publicUrl, {
        tipo: tipo as 'periapical' | 'cbct',
        momento: momentoMap[momento] || 'baseline'
      });
      ai = {
        pai: resultado.pai,
        lesion_mm: resultado.lesionDiameterMm
      };
    } catch (err) {
      console.warn("⚠️ IA no disponible, continuando sin análisis");
    }
  }

  const { error } = await supabase
    .from("radiographs")
    .insert([{
      case_id: caseId,
      filepath: filePath,
      tipo,
      momento,
      fecha: new Date().toISOString().split("T")[0],
      pai: ai.pai,
      lesion_mm: ai.lesion_mm
    }]);

  if (error) {
    console.error("❌ Error guardando registro de radiografía:", error);
    throw error;
  }

  if (momento === "baseline") {
    await supabase
      .from("cases")
      .update({
        vision_PAI_baseline: ai.pai,
        vision_lesion_diam_mm_baseline: ai.lesion_mm
      })
      .eq("case_id", caseId);
  } else {
    await supabase
      .from("cases")
      .update({
        vision_PAI_followup: ai.pai,
        vision_lesion_diam_mm_followup: ai.lesion_mm
      })
      .eq("case_id", caseId);
  }

  console.log("✅ Radiografía subida y analizada:", filePath, ai);
  return publicUrl;
}

export async function getRadiographs(caseId: string): Promise<Radiograph[]> {
  const { data, error } = await supabase
    .from("radiographs")
    .select("*")
    .eq("case_id", caseId)
    .order("fecha", { ascending: false });

  if (error) {
    console.error("❌ Error obteniendo radiografías:", error);
    throw error;
  }

  return data || [];
}

export async function deleteRadiograph(radId: number, filepath: string): Promise<void> {
  const { error: storageError } = await supabase.storage
    .from('radiographs')
    .remove([filepath]);

  if (storageError) {
    console.error("❌ Error eliminando archivo:", storageError);
    throw storageError;
  }

  const { error } = await supabase
    .from("radiographs")
    .delete()
    .eq("rad_id", radId);

  if (error) {
    console.error("❌ Error eliminando registro:", error);
    throw error;
  }

  console.log("✅ Radiografía eliminada correctamente");
}

export function getRadiographPublicUrl(filepath: string): string {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  return `${supabaseUrl}/storage/v1/object/public/radiographs/${filepath}`;
}

export async function getRadiographSignedUrl(filepath: string): Promise<string> {
  const { data } = await supabase.storage
    .from("radiographs")
    .createSignedUrl(filepath, 60 * 60);

  return data?.signedUrl || '';
}

export interface LongitudinalPAI {
  case_id: string;
  baseline: number;
  followup: number;
  delta: number;
}

export async function getLongitudinalPAI(): Promise<LongitudinalPAI[]> {
  const { data, error } = await supabase
    .from("cases")
    .select("case_id, vision_PAI_baseline, vision_PAI_followup");

  if (error) throw error;

  return (data || [])
    .filter(c => c.vision_PAI_baseline && c.vision_PAI_followup)
    .map(c => ({
      case_id: c.case_id,
      baseline: Number(c.vision_PAI_baseline),
      followup: Number(c.vision_PAI_followup),
      delta: Number(c.vision_PAI_baseline) - Number(c.vision_PAI_followup)
    }));
}

export type ExitoRadiologico = 'exito' | 'parcial' | 'fracaso' | 'indeterminado';

export async function calcularExitoRadiologico(caseId: string): Promise<ExitoRadiologico> {
  const { data, error } = await supabase
    .from("cases")
    .select("vision_PAI_baseline, vision_PAI_followup, vision_lesion_diam_mm_baseline, vision_lesion_diam_mm_followup")
    .eq("case_id", caseId)
    .single();

  if (error) throw error;

  const basePAI = Number(data.vision_PAI_baseline || 0);
  const follPAI = Number(data.vision_PAI_followup || 0);
  const baseL = Number(data.vision_lesion_diam_mm_baseline || 0);
  const follL = Number(data.vision_lesion_diam_mm_followup || 0);

  let resultado: ExitoRadiologico = "indeterminado";

  if (follPAI <= 2 && follL < baseL && follL <= 1) {
    resultado = "exito";
  } else if (follPAI < basePAI && follL < baseL) {
    resultado = "parcial";
  } else if (follPAI >= basePAI || follL >= baseL) {
    resultado = "fracaso";
  }

  await supabase
    .from("cases")
    .update({ exito_radiologico_final: resultado })
    .eq("case_id", caseId);

  return resultado;
}


export async function uploadRadiographWithVision(
  file: File,
  caseId: string,
  momento: RadiographMoment,
  tipo: "periapical" | "cbct"
) {
  const timestamp = Date.now();

  /* 1) Subir archivo original */
  const ext = file.name.split(".").pop() || "jpg";
  const filePath = `${caseId}/${momento}-${timestamp}.${ext}`;

  const { error: storageError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file);

  if (storageError) throw storageError;

  /* 2) URL firmada */
  const { data: signedData } = await supabase.storage
    .from(BUCKET_NAME)
    .createSignedUrl(filePath, 3600);

  const publicUrl = signedData?.signedUrl;

  /* 3) Obtener case_pk y tooth_fdi del caso */
  const { data: caseRow } = await supabase
    .from("cases")
    .select("id, tooth_fdi")
    .eq("case_id", caseId)
    .maybeSingle();

  const targetFdi = caseRow?.tooth_fdi ? parseInt(caseRow.tooth_fdi) : null;

  /* 4) Insertar radiografía inicial */
  const { data: inserted, error: insertError } = await supabase
    .from("radiographs")
    .insert({
      case_id: caseId,
      filepath: filePath,
      tipo,
      momento,
      fecha: new Date().toISOString().slice(0, 10),
      case_pk: caseRow?.id ?? null,
      pai: null,
      lesion_mm: null,
      lamina_dura: null,
      pdl_status: null,
      borders: null,
      notas: null
    })
    .select("rad_id")
    .single();

  if (insertError) throw insertError;

  /* 5) Analizar imagen COMPLETA con Vision (sin recortes) */
  let analysis: any = null;

  if (publicUrl) {
    try {
      console.log("🔬 Analizando radiografía completa con Vision...");
      analysis = await analyzeRadiographFromUrl(publicUrl, { tipo, momento });
      console.log("✅ Análisis completado:", analysis);
    } catch (err) {
      console.error("Error IA:", err);
      return { ok: true, analyzed: false };
    }
  }

  if (!analysis) {
    return { ok: true, analyzed: false };
  }

  /* 6) Mini-informe IA */
  const notasIA = `
[AI RADIOLOGICAL REPORT${targetFdi ? ` - FDI ${targetFdi}` : ""}]
PAI: ${analysis.pai}
Radiolucency: ${analysis.radiolucencyDetected ? "YES" : "NO"}
Lesion (mm): ${analysis.lesionDiameterMm}
Lamina dura intact: ${
    analysis.laminaDuraIntact === null
      ? "UNSURE"
      : analysis.laminaDuraIntact
      ? "YES"
      : "NO"
  }
PDL: ${analysis.pdlWidening}
Borders: ${analysis.borders}
Comments: ${analysis.comments}
  `.trim();

  /* 7) Procesar campos IA */
  const laminaDuraLabel =
    analysis.laminaDuraIntact === null
      ? "no_claro"
      : analysis.laminaDuraIntact
      ? "intacta"
      : "perdida";

  const pdlLabel = analysis.pdlWidening ?? "no_claro";
  const bordersLabel = analysis.borders ?? "no_claro";

  /* 8) Actualizar radiographs */
  await supabase
    .from("radiographs")
    .update({
      pai: analysis.pai,
      lesion_mm: analysis.lesionDiameterMm,
      lamina_dura: laminaDuraLabel,
      pdl_status: pdlLabel,
      borders: bordersLabel,
      notas: notasIA
    })
    .eq("rad_id", inserted.rad_id);

  /* 9) Actualizar tabla CASES (baseline o followup) */
  const updateCases: Record<string, any> = {};

  if (momento === "baseline") {
    updateCases.vision_pai_baseline = String(analysis.pai);
    updateCases.vision_lesion_diam_mm_baseline = String(analysis.lesionDiameterMm);
  } else {
    updateCases.vision_pai_followup = String(analysis.pai);
    updateCases.vision_lesion_diam_mm_followup = String(analysis.lesionDiameterMm);
  }

  await supabase.from("cases").update(updateCases).eq("case_id", caseId);

  return {
    ok: true,
    analyzed: true,
    message: "Radiografía subida y analizada"
  };
}
