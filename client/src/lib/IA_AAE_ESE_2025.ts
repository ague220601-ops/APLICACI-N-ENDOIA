// IA_AAE_ESE_2025.ts
// Motor diagnóstico corregido según tablas AAE–ESE 2025
// Adaptado a campos reales de tu tabla `cases`

// -------------------- Tipos básicos --------------------

export type PreviousTreatmentType =
  | "none"
  | "small_restoration"
  | "deep_restoration"
  | "vital_indirect_cap"
  | "vital_direct_cap"
  | "partial_pulpotomy"
  | "full_pulpotomy"
  | "previous_regenerative"
  | "previously_initiated_rct"
  | "previously_obturated_rct";

export type PulpDiagnosis =
  | "clinically_normal_pulp"
  | "hypersensitive_pulp"
  | "mild_pulpitis"
  | "severe_pulpitis"
  | "pulp_necrosis"
  | "inconclusive_pulp_status"
  | "previously_initiated_root_canal_treatment"
  | "previously_obturated_root_canal"
  | "previous_regenerative_endodontic_treatment";

export type ApicalDiagnosis =
  | "clinically_normal_apical_tissues"
  | "apical_hypersensitivity"
  | "localized_symptomatic_apical_periodontitis"
  | "localized_asymptomatic_apical_periodontitis"
  | "localized_apical_periodontitis_with_sinus_tract"
  | "apical_periodontitis_with_systemic_involvement"
  | "healing_apical_tissue"
  | "inconclusive_apical_condition";

export interface CaseData {
  // Clínico
  spontaneous_pain_yesno?: string | null;          // "yes"/"no" o "1"/"0"
  thermal_cold_response?: string | null;          // "0","1","2" o texto
  lingering_pain_seconds?: string | number | null;
  pain_to_heat?: string | null;
  percussion_pain_yesno?: string | null;
  apical_palpation_pain?: string | null;
  sinus_tract_present?: string | null;
  systemic_involvement?: string | null;
  depth_of_caries?: string | null;                // "no_aplica","no_refiere","superficial","media","profunda",...
  tipo_dolor?: string | null;                     // "sin_dolor","dolor_provocado_corto","dolor_provocado_largo","dolor_espontaneo",...
  previous_treatment?: string | null;
  trauma_history?: string | null;

  // Radiografía (clínico / IA)
  periapical_index_pai_1_5?: string | number | null;
  radiolucency_yesno?: string | null;             // "1"/"0","si"/"no"
  pdl_widening?: string | null;                   // "none","mild","moderate","severe","1-5"
  vision_pai_baseline?: string | number | null;
  vision_pai_followup?: string | number | null;
  vision_lesion_diam_mm_baseline?: string | number | null;
  vision_lesion_diam_mm_followup?: string | number | null;
}

export interface EndoDiagnosis {
  pulpal: PulpDiagnosis;
  apical: ApicalDiagnosis;
  flags: string[];
}

// -------------------- Helpers --------------------

function isYes(v?: string | null): boolean {
  if (!v) return false;
  const t = v.toString().toLowerCase().trim();
  return (
    t === "yes" ||
    t === "si" ||
    t === "sí" ||
    t === "true" ||
    t === "1"
  );
}

function toNumber(v?: string | number | null): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : null;
}

function normalizePreviousTreatment(raw?: string | null): PreviousTreatmentType {
  if (!raw) return "none";
  const t = raw.toString().toLowerCase().trim();

  if (t.includes("obtur") || t === "previously_obturated_rct") {
    return "previously_obturated_rct";
  }
  if (t.includes("inici") || t === "previously_initiated_rct") {
    return "previously_initiated_rct";
  }
  if (t.includes("regener") || t === "previous_regenerative") {
    return "previous_regenerative";
  }
  if (t.includes("indirect")) {
    return "vital_indirect_cap";
  }
  if (t.includes("direct")) {
    return "vital_direct_cap";
  }
  if (t.includes("parcial") || t.includes("partial")) {
    return "partial_pulpotomy";
  }
  if (t.includes("pulpotomía completa") || t.includes("full_pulpotomy") || t.includes("pulpotomia_completa")) {
    return "full_pulpotomy";
  }
  if (t.includes("deep") || t.includes("profunda") || t.includes("deep_rest")) {
    return "deep_restoration";
  }
  if (t.includes("small") || t.includes("peque") || t.includes("small_rest")) {
    return "small_restoration";
  }

  return "none";
}

// Radiolucidez combinando clínico + IA (PAI)
function hasApicalRadiolucency(data: CaseData, flags: string[]): boolean {
  const clinico = isYes(data.radiolucency_yesno);
  const paiClinico = toNumber(data.periapical_index_pai_1_5);
  const paiVision = toNumber(data.vision_pai_baseline);

  const iaDicePatologia = paiVision !== null && paiVision >= 3;
  const clinicoDicePatologia = paiClinico !== null && paiClinico >= 3;

  // Si clínico dice NO pero IA ve PAI alto → priorizamos IA y avisamos
  if (!clinico && iaDicePatologia) {
    flags.push(
      "IA radiográfica detecta PAI ≥ 3 aunque clínicamente está marcado sin radiolucidez. Se ha considerado patología apical."
    );
    return true;
  }

  if (clinico) return true;
  if (clinicoDicePatologia) return true;
  if (iaDicePatologia) return true;

  return false;
}

function pdlIsWidened(data: CaseData): boolean {
  const raw = (data.pdl_widening || "").toString().toLowerCase().trim();
  if (!raw) return false;

  if (["mild", "moderate", "severe"].includes(raw)) return true;
  if (["2", "3", "4", "5"].includes(raw)) return true;

  return false;
}

// -------------------- Diagnóstico pulpar --------------------

export function diagnosePulp(data: CaseData): { diagnosis: PulpDiagnosis; flags: string[] } {
  const flags: string[] = [];

  const prev = normalizePreviousTreatment(data.previous_treatment);
  const hasApicalRad = hasApicalRadiolucency(data, flags);

  const spontPain =
    isYes(data.spontaneous_pain_yesno) ||
    data.tipo_dolor === "dolor_espontaneo";

  const coldResp = (data.thermal_cold_response || "")
    .toString()
    .toLowerCase()
    .trim();

  const linger = toNumber(data.lingering_pain_seconds);
  const heatPain = isYes(data.pain_to_heat);
  const percPain = isYes(data.percussion_pain_yesno);
  const sinusTract = isYes(data.sinus_tract_present);

  const depth = (data.depth_of_caries || "").toString().toLowerCase();

  const cariesProfunda =
    depth.includes("profunda") ||
    depth.includes("media") ||
    depth.includes("deep") ||
    depth.includes("moderate");

  const cariesEsmalte =
    depth.includes("superficial") ||
    depth.includes("esmalt") ||
    depth.includes("enamel");

  const noColdResponse =
    coldResp === "0" ||
    coldResp === "no_responde" ||
    coldResp === "none" ||
    coldResp === "ausente" ||
    coldResp === "no";

  const increasedCold =
    coldResp === "2" ||
    coldResp === "2_aumentada" ||
    coldResp === "increased";

  const hasVPT = [
    "vital_indirect_cap",
    "vital_direct_cap",
    "partial_pulpotomy",
    "full_pulpotomy",
  ].includes(prev);

  const trauma = (data.trauma_history || "").toString().trim() !== "";

  // ---------------- 1. Tratamientos previos "especiales" ----------------

  if (prev === "previously_obturated_rct") {
    return { diagnosis: "previously_obturated_root_canal", flags };
  }
  if (prev === "previously_initiated_rct") {
    return { diagnosis: "previously_initiated_root_canal_treatment", flags };
  }
  if (prev === "previous_regenerative") {
    return { diagnosis: "previous_regenerative_endodontic_treatment", flags };
  }

  // ---------------- 2. Pulp Necrosis ----------------

  const signsOfInfection =
    hasApicalRad || sinusTract || isYes(data.systemic_involvement);

  if (noColdResponse) {
    if (signsOfInfection) {
      return { diagnosis: "pulp_necrosis", flags };
    }
    if (percPain || isYes(data.apical_palpation_pain)) {
      return { diagnosis: "pulp_necrosis", flags };
    }

    // Ausencia de respuesta al frío sin síntomas y sin caries profunda / VPT → inconcluso
    if (!spontPain && !cariesProfunda && !hasVPT) {
      flags.push(
        "Ausencia de respuesta al frío sin signos claros de infección ni caries profunda: estado pulpar inconcluso (posible calcificación o necrosis estéril)."
      );
      return { diagnosis: "inconclusive_pulp_status", flags };
    }

    // Por defecto, si no responde y hay historia previa (caries/VPT), inclinamos a necrosis
    return { diagnosis: "pulp_necrosis", flags };
  }

  // ---------------- 3. Severe Pulpitis ----------------

  const prolongedPain =
    (linger !== null && linger > 5) ||
    data.tipo_dolor === "dolor_provocado_largo";

  if (spontPain || prolongedPain || heatPain) {
    return { diagnosis: "severe_pulpitis", flags };
  }

  // ---------------- 4. Mild Pulpitis ----------------

  if (
    (cariesProfunda || prev === "deep_restoration") &&
    (increasedCold || (linger !== null && linger > 0 && linger <= 5))
  ) {
    return { diagnosis: "mild_pulpitis", flags };
  }

  // ---------------- 5. Hypersensitive Pulp ----------------

  if (increasedCold || (linger !== null && linger > 0 && linger <= 5)) {
    if (!cariesProfunda) {
      // Sin caries profunda → hipersensibilidad (cuellos, recesión, etc.)
      return { diagnosis: "hypersensitive_pulp", flags };
    }
    // Si hay caries profunda + sensibilidad corta → mild_pulpitis
    return { diagnosis: "mild_pulpitis", flags };
  }

  // ---------------- 6. Clinically Normal Pulp ----------------

  if (!spontPain && !percPain && !hasApicalRad && !sinusTract) {
    return { diagnosis: "clinically_normal_pulp", flags };
  }

  flags.push("Diagnóstico pulpar incierto con los datos disponibles.");
  return { diagnosis: "inconclusive_pulp_status", flags };
}

// -------------------- Diagnóstico apical --------------------

export function diagnoseApical(
  data: CaseData,
  pulpDiag: PulpDiagnosis
): { diagnosis: ApicalDiagnosis; flags: string[] } {
  const flags: string[] = [];

  const percPain = isYes(data.percussion_pain_yesno);
  const apicalPalp = isYes(data.apical_palpation_pain);
  const sinusTract = isYes(data.sinus_tract_present);
  const systemic = isYes(data.systemic_involvement);
  const hasApicalRad = hasApicalRadiolucency(data, flags);
  const pdlWidened = pdlIsWidened(data);

  const prev = normalizePreviousTreatment(data.previous_treatment);
  const isPreviouslyTreated =
    prev === "previously_obturated_rct" || prev === "previous_regenerative";

  const paiBase = toNumber(data.vision_pai_baseline);
  const paiFollow = toNumber(data.vision_pai_followup);
  const diamBase = toNumber(data.vision_lesion_diam_mm_baseline);
  const diamFollow = toNumber(data.vision_lesion_diam_mm_followup);

  // 1. Systemic involvement
  if (systemic) {
    return {
      diagnosis: "apical_periodontitis_with_systemic_involvement",
      flags,
    };
  }

  // 2. Sinus tract
  if (sinusTract) {
    return {
      diagnosis: "localized_apical_periodontitis_with_sinus_tract",
      flags,
    };
  }

  // 3. Symptomatic Apical Periodontitis (SAP)
  // CLAVE 2025: si hay dolor a la percusión y la pulpa está enferma (necrosis/severe/mild avanzada),
  // es SAP aunque todavía no se vea radiolucidez clara.
  const pulpDiseased = [
    "pulp_necrosis",
    "severe_pulpitis",
    "mild_pulpitis",
    "previously_initiated_root_canal_treatment",
    "previously_obturated_root_canal",
  ].includes(pulpDiag);

  if (percPain || apicalPalp) {
    if (hasApicalRad) {
      return {
        diagnosis: "localized_symptomatic_apical_periodontitis",
        flags,
      };
    }

    if (pulpDiseased) {
      return {
        diagnosis: "localized_symptomatic_apical_periodontitis",
        flags,
      };
    }

    // Pulpa clínicamente sana/hipersensible + dolor percusión → Apical Hypersensitivity (origen no endodóntico)
    flags.push(
      "Dolor a la percusión con pulpa sana/hipersensible: posible origen no endodóntico (trauma oclusal, sinusitis, etc.)."
    );
    return {
      diagnosis: "apical_hypersensitivity",
      flags,
    };
  }

  // 4. Asymptomatic Apical Periodontitis
  if (!percPain && !apicalPalp && hasApicalRad) {
    return {
      diagnosis: "localized_asymptomatic_apical_periodontitis",
      flags,
    };
  }

  // 5. Healing (disminución de PAI o tamaño de lesión en dientes ya tratados)
  if (
    isPreviouslyTreated &&
    paiBase !== null &&
    paiFollow !== null &&
    paiFollow < paiBase
  ) {
    return {
      diagnosis: "healing_apical_tissue",
      flags,
    };
  }

  if (
    isPreviouslyTreated &&
    diamBase !== null &&
    diamFollow !== null &&
    diamFollow < diamBase
  ) {
    return {
      diagnosis: "healing_apical_tissue",
      flags,
    };
  }

  // 6. Clinically normal apical tissues
  if (!percPain && !apicalPalp && !hasApicalRad && !pdlWidened && !sinusTract && !systemic) {
    return {
      diagnosis: "clinically_normal_apical_tissues",
      flags,
    };
  }

  // 7. Inconclusive
  return {
    diagnosis: "inconclusive_apical_condition",
    flags,
  };
}

// -------------------- Diagnóstico combinado --------------------

export function diagnoseEndoAAE_ESE_2025(data: CaseData): EndoDiagnosis {
  const pulp = diagnosePulp(data);
  const apical = diagnoseApical(data, pulp.diagnosis);

  const flags: string[] = [...pulp.flags, ...apical.flags];

  // Coherencia pulpa–ápice
  if (
    (pulp.diagnosis === "clinically_normal_pulp" ||
      pulp.diagnosis === "hypersensitive_pulp") &&
    (apical.diagnosis === "localized_symptomatic_apical_periodontitis" ||
      apical.diagnosis === "localized_asymptomatic_apical_periodontitis" ||
      apical.diagnosis === "localized_apical_periodontitis_with_sinus_tract")
  ) {
    flags.push(
      "Alerta: Tejidos apicales patológicos con pulpa clínicamente normal/hipersensible. Revisar prueba de vitalidad y posibles causas no endodónticas."
    );
  }

  if (
    pulp.diagnosis === "previously_obturated_root_canal" &&
    (apical.diagnosis === "clinically_normal_apical_tissues" ||
      apical.diagnosis === "inconclusive_apical_condition")
  ) {
    flags.push(
      "Diente con endodoncia previa: valorar evolución a largo plazo (control radiográfico)."
    );
  }

  return {
    pulpal: pulp.diagnosis,
    apical: apical.diagnosis,
    flags: Array.from(new Set(flags)), // sin duplicados
  };
}
