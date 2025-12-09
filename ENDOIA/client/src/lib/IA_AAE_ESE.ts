// IA_AAE_ESE.ts
// Wrapper que conecta con el motor diagnóstico AAE-ESE 2025
// Este archivo mantiene compatibilidad con componentes que usan getDiagnosisAAE_ESE()

import { diagnoseEndoAAE_ESE_2025, CaseData } from "./IA_AAE_ESE_2025";

// Normalizar respuesta al frío a formato esperado por el motor
function normalizeColdResponse(val: any): string {
  if (!val) return "normal";
  const s = String(val).toLowerCase().trim();
  
  if (s === "0_no_responde" || s === "0" || s === "no_responde" || s === "none" || s === "ausente" || s === "no") return "none";
  if (s === "2_aumentada" || s === "2" || s === "aumentada" || s === "increased") return "increased";
  if (s === "1_normal" || s === "1" || s === "normal") return "normal";
  
  return "normal";
}

// Normalizar sí/no a "yes"/"no"
function normalizeYesNo(val: any): string {
  if (!val) return "no";
  const s = String(val).toLowerCase().trim();
  if (s === "1" || s === "yes" || s === "si" || s === "sí" || s === "true") return "yes";
  return "no";
}

// Normalizar profundidad de caries
function normalizeDepthOfCaries(profundidad?: string): string {
  if (!profundidad) return "none";
  const p = profundidad.toLowerCase().trim();
  
  if (p === "extrema" || p === "extreme" || p === "dentinaria_profunda" || p === "profunda" || p === "deep") return "deep";
  if (p === "moderada" || p === "moderate" || p === "dentinaria_media" || p === "media") return "moderate";
  if (p === "superficial" || p === "shallow" || p === "esmaltaria") return "shallow";
  if (p === "no_aplica" || p === "no_refiere") return "none";
  
  return "none";
}

// Normalizar tratamiento previo
function normalizePreviousTreatment(val: any): string {
  if (!val) return "none";
  const s = String(val).toLowerCase().trim();
  
  if (s.includes("obtur") || s === "previously_obturated_rct" || s === "rct_completa") return "previously_obturated_rct";
  if (s.includes("inici") || s === "previously_initiated_rct") return "previously_initiated_rct";
  if (s.includes("regener") || s === "previous_regenerative") return "previous_regenerative";
  if (s.includes("indirect") || s === "vital_indirect_cap") return "vital_indirect_cap";
  if (s.includes("direct") || s === "vital_direct_cap") return "vital_direct_cap";
  if (s.includes("parcial") || s.includes("partial") || s === "partial_pulpotomy") return "partial_pulpotomy";
  if (s.includes("pulpotomía completa") || s.includes("full_pulpotomy") || s.includes("pulpotomia_completa")) return "full_pulpotomy";
  if (s.includes("deep") || s.includes("profunda") || s === "deep_restoration") return "deep_restoration";
  if (s.includes("small") || s.includes("peque") || s === "small_restoration") return "small_restoration";
  
  return "none";
}

// Normalizar historial de trauma
function normalizeTraumaHistory(val: any): string {
  if (!val) return "";
  const s = String(val).toLowerCase().trim();
  if (s === "si" || s === "sí" || s === "yes" || s === "1" || s === "true" || s.includes("trauma")) return "yes";
  return "";
}

// Coerción numérica
function toNumberString(val: any): string | null {
  if (val === null || val === undefined || val === "") return null;
  const n = Number(val);
  return Number.isFinite(n) ? String(n) : null;
}

// Estimar PAI basándose en radiolucidez y percusión
function estimatePAI(radiolucidez: string, percusion: string): string {
  const hasRadiolucency = normalizeYesNo(radiolucidez) === "yes";
  const hasPercussion = normalizeYesNo(percusion) === "yes";
  
  if (hasRadiolucency) return hasPercussion ? "4" : "3";
  if (hasPercussion) return "2";
  return "1";
}

// Estimar ensanchamiento PDL
function estimatePDLWidening(radiolucidez: string, percusion: string): string {
  const hasRadiolucency = normalizeYesNo(radiolucidez) === "yes";
  const hasPercussion = normalizeYesNo(percusion) === "yes";
  
  if (hasRadiolucency) return "moderate";
  if (hasPercussion) return "mild";
  return "none";
}

export function getDiagnosisAAE_ESE(data: any) {
  // Normalizar radiolucidez y percusión para estimaciones
  const radiolucidez = data.radiolucency_yesno || data.radiolucidezApical || "";
  const percusion = data.percussion_pain_yesno || data.percusionDolor || "";
  
  // Convertir y normalizar datos del formulario al formato CaseData
  const caseData: CaseData = {
    spontaneous_pain_yesno: normalizeYesNo(data.spontaneous_pain_yesno || data.dolorEspontaneo),
    thermal_cold_response: normalizeColdResponse(data.thermal_cold_response || data.respuestaFrio),
    lingering_pain_seconds: toNumberString(data.lingering_pain_seconds || data.lingeringSeg) || "0",
    pain_to_heat: normalizeYesNo(data.pain_to_heat),
    percussion_pain_yesno: normalizeYesNo(percusion),
    apical_palpation_pain: normalizeYesNo(data.apical_palpation_pain || data.apicalPalpationPain),
    sinus_tract_present: normalizeYesNo(data.sinus_tract_present || data.sinusTractPresent),
    systemic_involvement: normalizeYesNo(data.systemic_involvement || data.systemicInvolvement),
    depth_of_caries: normalizeDepthOfCaries(data.depth_of_caries || data.profundidadCaries),
    tipo_dolor: data.tipo_dolor || "sin_dolor",
    previous_treatment: normalizePreviousTreatment(data.previous_treatment || data.previousTreatment),
    trauma_history: normalizeTraumaHistory(data.trauma_history),
    periapical_index_pai_1_5: toNumberString(data.periapical_index_PAI_1_5 || data.periapical_index_pai_1_5) || estimatePAI(radiolucidez, percusion),
    radiolucency_yesno: normalizeYesNo(radiolucidez),
    pdl_widening: data.pdl_widening || estimatePDLWidening(radiolucidez, percusion),
    vision_pai_baseline: toNumberString(data.vision_pai_baseline),
    vision_pai_followup: toNumberString(data.vision_pai_followup),
    vision_lesion_diam_mm_baseline: toNumberString(data.vision_lesion_diam_mm_baseline),
    vision_lesion_diam_mm_followup: toNumberString(data.vision_lesion_diam_mm_followup),
  };

  // Llamar al motor nuevo AAE-ESE 2025
  const result = diagnoseEndoAAE_ESE_2025(caseData);

  // Devolver en el formato esperado por los componentes
  return {
    AEDE_pulpar_IA: result.pulpal,
    AEDE_apical_IA: result.apical,
    IA_flags: result.flags || [],
  };
}
