// Adaptador para integrar el módulo AAE-ESE 2025 con el formulario existente
import { 
  diagnoseEndoAAE_ESE_2025, 
  type CaseData, 
  type PulpDiagnosis, 
  type ApicalDiagnosis 
} from "./IA_AAE_ESE_2025";
import { 
  generarRecomendacionesBiblioteca, 
  formatearRecomendaciones,
  type RecomendacionesClinicas 
} from "./recomendacionesBiblioteca";

/**
 * Mapeo de términos AAE/ESE 2025 (inglés → español)
 * El motor IA devuelve términos en inglés, pero el sistema usa español como lengua canónica
 */
const TERMINOS_PULPARES_ES: Record<PulpDiagnosis, string> = {
  "clinically_normal_pulp": "Pulpa clínicamente normal",
  "hypersensitive_pulp": "Hipersensibilidad pulpar",
  "mild_pulpitis": "Pulpitis leve",
  "severe_pulpitis": "Pulpitis severa",
  "pulp_necrosis": "Necrosis pulpar",
  "inconclusive_pulp_status": "Estado pulpar inconcluso",
  "previously_initiated_root_canal_treatment": "Tratamiento de conductos iniciado previamente",
  "previously_obturated_root_canal": "Conducto radicular previamente obturado",
  "previous_regenerative_endodontic_treatment": "Tratamiento regenerativo endodóntico previo"
};

const TERMINOS_APICALES_ES: Record<ApicalDiagnosis, string> = {
  "clinically_normal_apical_tissues": "Tejidos apicales clínicamente normales",
  "apical_hypersensitivity": "Hipersensibilidad apical",
  "localized_symptomatic_apical_periodontitis": "Periodontitis apical sintomática localizada",
  "localized_asymptomatic_apical_periodontitis": "Periodontitis apical asintomática localizada",
  "localized_apical_periodontitis_with_sinus_tract": "Periodontitis apical con tracto sinusal",
  "apical_periodontitis_with_systemic_involvement": "Periodontitis apical con afectación sistémica",
  "healing_apical_tissue": "Tejido apical en curación",
  "inconclusive_apical_condition": "Estado apical inconcluso"
};

interface DatosClinico {
  dolorEspontaneo: string;
  respuestaFrio: string;
  lingeringSeg: string;
  percusionDolor: string;
  radiolucidezApical: string;
  profundidadCaries: string;
  sangradoControlable: string;
  sinusTractPresent?: string;
  systemicInvolvement?: string;
  previousTreatment?: string;
  apicalPalpationPain?: string;
  notas?: string;
}

interface ResultadoIA {
  pulpalDxIA: string;
  apicalDxIA: string;
  ttoPropuestoIA: string;
  recomendaciones: RecomendacionesClinicas;
  recomendacionesTexto: string;
  flags: string[];
}

/**
 * Normaliza profundidad de caries del español al inglés para el motor AAE-ESE 2025
 */
function normalizeDepthOfCaries(profundidad?: string): string {
  if (!profundidad) return "none";
  const p = profundidad.toLowerCase().trim();

  // Sinónimos desde BD / formularios antiguos
  if (p.includes("dentinaria_media") || p.includes("media")) return "moderate";
  if (p.includes("dentinaria_profunda") || p.includes("profunda")) return "deep";
  if (p.includes("muy_profunda") || p.includes("extrema") || p.includes("extreme")) return "extreme";
  if (p.includes("superficial") || p.includes("esmalt") || p.includes("enamel") || p.includes("shallow")) return "shallow";

  // Ya contemplados
  if (p === "moderada" || p === "moderate") return "moderate";
  if (p === "deep") return "deep";

  return "none";
}


/**
 * Convierte datos del formulario al formato CaseData del motor AAE-ESE 2025
 */
function convertirDatosAAE_ESE(datos: DatosClinico): CaseData {
  // Mapear respuesta al frío
  let thermalColdResponse: string;
  switch (datos.respuestaFrio) {
    case "0_no_responde":
      thermalColdResponse = "none";
      break;
    case "2_aumentada":
      thermalColdResponse = "increased";
      break;
    case "1_normal":
    default:
      thermalColdResponse = "normal";
      break;
  }

  // Estimar PAI basándose en radiolucidez y percusión
  let estimatedPAI: string;
  if (datos.radiolucidezApical === "si") {
    if (datos.percusionDolor === "si") {
      estimatedPAI = "4";
    } else {
      estimatedPAI = "3";
    }
  } else if (datos.percusionDolor === "si") {
    estimatedPAI = "2";
  } else {
    estimatedPAI = "1";
  }

// PDL widening es un hallazgo radiográfico.
// No debe inferirse a partir de síntomas (percusión).
// Si no tenemos un campo específico para PDL, lo dejamos como "none".
let pdlWidening: string = "none";

// Si quieres permitirlo en el futuro, crea un campo en el formulario:
// datos.pdlWidening (none/mild/moderate/severe) y aquí lo mapeas.
// Ejemplo (solo si existe):
// if (datos.pdlWidening) pdlWidening = datos.pdlWidening;


  return {
    spontaneous_pain_yesno: datos.dolorEspontaneo === "si" ? "yes" : "no",
    thermal_cold_response: thermalColdResponse,
   const lingerClean = (datos.lingeringSeg || "0").toString().replace(/[^\d]/g, "");
...
lingering_pain_seconds: lingerClean === "" ? "0" : lingerClean,
    percussion_pain_yesno: datos.percusionDolor === "si" ? "yes" : "no",
    apical_palpation_pain: datos.apicalPalpationPain === "si" ? "yes" : "no",
    sinus_tract_present: datos.sinusTractPresent === "si" ? "yes" : "no",
    systemic_involvement: datos.systemicInvolvement === "si" ? "yes" : "no",
    depth_of_caries: normalizeDepthOfCaries(datos.profundidadCaries),
    previous_treatment: datos.previousTreatment || "none",
    periapical_index_pai_1_5: estimatedPAI,
    radiolucency_yesno: datos.radiolucidezApical === "si" ? "yes" : "no",
    pdl_widening: pdlWidening,
  };
}

/**
 * Sugiere tratamiento basado en diagnósticos AAE-ESE 2025 (en español)
 */
function sugerirTratamiento(pulpar: string, apical: string, sangradoControlable: string): string {
  // Casos de tratamiento previo
  if (pulpar === "Conducto radicular previamente obturado") {
    if (apical.includes("periodontitis")) {
      return "Retratamiento endodóntico (re-RCT) o cirugía apical";
    }
    return "Observación y control periódico";
  }

  if (pulpar === "Tratamiento de conductos iniciado previamente") {
    return "Completar tratamiento de conductos (RCT)";
  }

  if (pulpar === "Tratamiento regenerativo endodóntico previo") {
    if (apical.includes("periodontitis")) {
      return "Evaluar retratamiento o cirugía apical";
    }
    return "Control y seguimiento del tratamiento regenerativo";
  }

  // Casos de pulpa vital
  if (pulpar === "Pulpa clínicamente normal") {
    return "Restaurar o proteger estructura; no endodoncia indicada";
  }
  
  if (pulpar === "Hipersensibilidad pulpar") {
    return "Protección dentinaria / sellado y control; no endodoncia inicial";
  }
  
  if (pulpar === "Pulpitis leve") {
    return "Tratamiento restaurador o terapia pulpar vital selectiva";
  }
  
  if (pulpar === "Pulpitis severa") {
    if (sangradoControlable === "si") {
      return "Pulpotomía vital (parcial/total) bajo aislamiento";
    } else {
      return "Endodoncia completa (RCT)";
    }
  }
  
  if (pulpar === "Necrosis pulpar") {
    return "Endodoncia completa (RCT) / desinfección del sistema radicular";
  }
  
  if (pulpar === "Estado pulpar inconcluso") {
    return "Reevaluar; control clínico y radiográfico antes de intervenir";
  }
  
  return "Monitorizar / manejo restaurador conservador";
}

/**
 * Motor IA AAE-ESE 2025 - Usa el nuevo motor TypeScript
 * Incluye recomendaciones automáticas de la biblioteca clínica
 * Normaliza términos del motor IA (inglés) a español (lengua canónica del sistema)
 */
export function motorIA_AAE_ESE(datos: DatosClinico): ResultadoIA {
  // Convertir datos al formato CaseData del motor AAE-ESE 2025
  const datosConvertidos = convertirDatosAAE_ESE(datos);
  
  // Obtener diagnósticos usando el nuevo motor TypeScript AAE-ESE 2025
  const diagnostico = diagnoseEndoAAE_ESE_2025(datosConvertidos);
  
  // Normalizar términos a español (lengua canónica del sistema)
  const pulpalDxIA_ES = TERMINOS_PULPARES_ES[diagnostico.pulpal] || diagnostico.pulpal;
  const apicalDxIA_ES = TERMINOS_APICALES_ES[diagnostico.apical] || diagnostico.apical;
  
  // Sugerir tratamiento basado en diagnósticos (ahora en español)
  const tratamiento = sugerirTratamiento(
    pulpalDxIA_ES,
    apicalDxIA_ES,
    datos.sangradoControlable
  );
  
  // Generar recomendaciones clínicas automáticas desde la biblioteca (ahora en español)
  const recomendaciones = generarRecomendacionesBiblioteca(
    pulpalDxIA_ES,
    apicalDxIA_ES,
    datos.sangradoControlable
  );
  
  const recomendacionesTexto = formatearRecomendaciones(recomendaciones);
  
  return {
    pulpalDxIA: pulpalDxIA_ES,
    apicalDxIA: apicalDxIA_ES,
    ttoPropuestoIA: tratamiento,
    recomendaciones,
    recomendacionesTexto,
    flags: diagnostico.flags,
  };
}
