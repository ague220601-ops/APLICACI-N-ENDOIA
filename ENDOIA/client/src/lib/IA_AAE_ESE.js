// AEDE-IA Objective Model – AAE–ESE 2025
// Usa datos clínicos para devolver diagnósticos oficiales de las tablas AAE–ESE 2025
// Sin términos obsoletos, solo terminología 2025 pulpar y apical

export function getDiagnosisAAE_ESE(data) {
  const {
    spontaneous_pain_yesno,      // "0" = no, "1" = sí
    thermal_cold_response,       // "0" = no responde, "1" = normal, "2" = aumentada
    lingering_pain_seconds,      // número en segundos
    bleeding_control_possible,   // "yes" / "no"
    depth_of_caries,             // (reservado para futuras versiones)
    periapical_index_PAI_1_5,    // "1"–"5"
    radiolucency_yesno,          // "0" / "1"
    pdl_widening,                // "1"–"5"
    percussion_pain_yesno,       // "yes" / "no"
    notes,                       // texto libre
  } = data;

  // Valores normalizados
  const linger = Number(lingering_pain_seconds) || 0;
  const cold = String(thermal_cold_response ?? "");
  const hasSpontPain = String(spontaneous_pain_yesno) === "1";
  const PAI = Number(periapical_index_PAI_1_5) || 1;
  const hasRadiolucency = Number(radiolucency_yesno) === 1;
  const hasPercussionPain = percussion_pain_yesno === "yes";
  const pdl = Number(pdl_widening) || 1;
  const bleedingControl = String(bleeding_control_possible || "yes");
  const notesLower = (notes || "").toLowerCase();

  let pulpar = "Clinically normal pulp";
  let apical = "Clinically normal apical tissues";

  // --------------------------------------
  // PULPAL – AAE–ESE 2025 (reglas clínicas)
  // --------------------------------------

  // 1) Traumatismos recientes: si no responde al frío pero hay trauma → estado inconcluso
  const hasTraumaKeywords =
    notesLower.includes("trauma") ||
    notesLower.includes("luxacion") ||
    notesLower.includes("luxación") ||
    notesLower.includes("intrusion") ||
    notesLower.includes("intrusión") ||
    notesLower.includes("avulsion") ||
    notesLower.includes("avulsión");

  if (cold === "0" && hasTraumaKeywords) {
    pulpar = "Inconclusive pulp status";
  } else if (cold === "0") {
    // 2) No respuesta al frío sin trauma → necrosis
    pulpar = "Pulp necrosis";
  } else {
    // 3) Pulpitis severa: dolor espontáneo o lingering muy prolongado
    if (hasSpontPain || linger > 15) {
      pulpar = "Severe pulpitis";
    } else if (linger >= 5 && cold === "2") {
      pulpar = "Severe pulpitis";
    } else {
      // 4) Diferenciar hipersensibilidad / pulpitis leve / normal
      if (cold === "2") {
        if (linger < 2) {
          // Respuesta aumentada, no prolongada → hipersensibilidad
          pulpar = "Hypersensitive pulp";
        } else if (linger >= 2 && linger <= 10) {
          // Respuesta aumentada, algo prolongada → pulpitis leve
          pulpar = "Mild pulpitis";
        } else {
          pulpar = "Severe pulpitis";
        }
      } else if (cold === "1") {
        if (linger >= 2 && linger <= 10) {
          pulpar = "Mild pulpitis";
        } else {
          pulpar = "Clinically normal pulp";
        }
      } else {
        pulpar = "Inconclusive pulp status";
      }
    }
  }

  // 5) Sangrado no controlable refuerza pulpitis severa (no necrosis)
  if (bleedingControl === "no" && pulpar !== "Pulp necrosis") {
    pulpar = "Severe pulpitis";
  }

  // --------------------------------------
  // APICAL – AAE–ESE 2025
  // --------------------------------------

  // Signos sistémicos
  const hasSystemicSigns =
    notesLower.includes("edema") ||
    notesLower.includes("hinchazón") ||
    notesLower.includes("hinchazon") ||
    notesLower.includes("swelling") ||
    notesLower.includes("fiebre") ||
    notesLower.includes("fever") ||
    notesLower.includes("malestar") ||
    notesLower.includes("linfadenopatia") ||
    notesLower.includes("lymphadenopathy");

  // Fístula / tracto sinusal
  const hasSinusTract =
    notesLower.includes("fistula") ||
    notesLower.includes("fístula") ||
    notesLower.includes("sinus tract") ||
    notesLower.includes("tracto sinusal") ||
    notesLower.includes("tracto fistuloso") ||
    notesLower.includes("parulis");

  if (hasSystemicSigns) {
    apical = "Apical periodontitis with systemic involvement";
  } else if (hasSinusTract) {
    apical = "Apical periodontitis with sinus tract";
  } else if (hasRadiolucency && hasPercussionPain) {
    // Lesión + dolor → periodontitis apical sintomática localizada
    apical = "Localized symptomatic apical periodontitis";
  } else if (hasRadiolucency && !hasPercussionPain) {
    // Lesión sin dolor → periodontitis apical asintomática localizada
    apical = "Localized asymptomatic apical periodontitis";
  } else if (!hasRadiolucency && hasPercussionPain && PAI <= 2 && pdl <= 2) {
    // Dolor a percusión sin radiolucidez clara → hipersensibilidad apical
    apical = "Apical hyper-sensitivity";
  } else if (PAI === 3 && !hasPercussionPain) {
    // Imagen dudosa sin clínica → estado apical inconcluso
    apical = "Inconclusive apical condition";
  } else {
    apical = "Clinically normal apical tissues";
  }

  return {
    AEDE_pulpar_IA: pulpar,
    AEDE_apical_IA: apical,
  };
}
