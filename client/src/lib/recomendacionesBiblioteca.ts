// ══════════════════════════════════════════════════════════════════════════════
// SISTEMA DE RECOMENDACIONES AUTOMÁTICAS BASADAS EN BIBLIOTECA CLÍNICA ENDOIA
// Genera recomendaciones personalizadas según diagnósticos AAE/ESE 2025
// Noviembre 2025
// ══════════════════════════════════════════════════════════════════════════════

export interface RecomendacionesClinicas {
  analgesia: string;
  planActuacion: string;
  urgencia: 'baja' | 'media' | 'alta' | 'critica';
  antibiotico: boolean;
  notasAdicionales: string[];
}

/**
 * Genera recomendaciones clínicas automáticas basadas en diagnósticos AAE/ESE 2025
 * Integra conocimiento de la biblioteca clínica ENDOIA
 * Recibe diagnósticos en ESPAÑOL (lengua canónica del sistema)
 */
export function generarRecomendacionesBiblioteca(
  pulpalDx: string,
  apicalDx: string,
  sangradoControlable?: string
): RecomendacionesClinicas {
  
  // ─────────────────────────────────────────────────────────────────────────
  // ANALGESIA según diagnóstico pulpar
  // ─────────────────────────────────────────────────────────────────────────
  let analgesia = "No se requiere analgesia específica";
  
  if (pulpalDx === "Pulpitis leve") {
    analgesia = "Ibuprofeno 400-600 mg/8h si dolor leve. Paracetamol 1g/8h como alternativa.";
  } else if (pulpalDx === "Pulpitis severa") {
    analgesia = "Ibuprofeno 600 mg + Paracetamol 1g combinados (esquema potente AAE 2022). Reevaluar en 24-48h.";
  } else if (apicalDx.includes("sintomática") || apicalDx.includes("sistémica")) {
    analgesia = "Ibuprofeno 600 mg/8h + Paracetamol 1g alternado. Control inflamación es prioritario.";
  }

  // ─────────────────────────────────────────────────────────────────────────
  // PLAN DE ACTUACIÓN según combinación diagnóstica
  // ─────────────────────────────────────────────────────────────────────────
  let planActuacion = "";
  let urgencia: 'baja' | 'media' | 'alta' | 'critica' = 'baja';
  let antibiotico = false;
  const notasAdicionales: string[] = [];

  // CASO 1: Pulpa normal o hipersensible
  if (pulpalDx === "Pulpa normal" || pulpalDx === "Hipersensibilidad pulpar") {
    planActuacion = "Restauración o protección dentinaria. No se requiere endodoncia. Control en 1-3 meses.";
    urgencia = 'baja';
  }

  // CASO 2: Pulpitis leve
  else if (pulpalDx === "Pulpitis leve") {
    if (apicalDx === "Tejidos apicales clínicamente normales") {
      planActuacion = "Tratamiento restaurador conservador o terapia pulpar vital selectiva. Control en 2-4 semanas.";
      urgencia = 'baja';
      notasAdicionales.push("Remoción de irritantes (caries), restauración adecuada.");
      notasAdicionales.push("❌ No abrir cámara pulpar si no hay indicación.");
    } else {
      planActuacion = "Evaluar extensión de lesión. Considerar endodoncia si síntomas progresan.";
      urgencia = 'media';
    }
  }

  // CASO 3: Pulpitis severa
  else if (pulpalDx === "Pulpitis severa") {
    if (sangradoControlable === "si") {
      planActuacion = "Pulpotomía vital (parcial o completa) bajo aislamiento absoluto. Analgesia potente + bloqueo anestésico.";
      urgencia = 'alta';
      notasAdicionales.push("El sangrado controlable indica pulpa vital inflamada.");
      notasAdicionales.push("Técnica: localizar y drenar sangrado, analgesia combinada.");
    } else {
      planActuacion = "Endodoncia completa URGENTE. Apertura cameral inmediata, desinflamación, sellado provisional estanco.";
      urgencia = 'alta';
      notasAdicionales.push("❌ NUNCA dejar el diente abierto.");
    }
    
    if (apicalDx.includes("sintomática")) {
      planActuacion += " Ajuste oclusal si dolor a la percusión.";
      notasAdicionales.push("Diente puede sentirse 'largo' - ajustar oclusión.");
    }
  }

  // CASO 4: Necrosis pulpar (Pulpa necrótica)
  else if (pulpalDx === "Pulpa necrótica") {
    if (apicalDx === "Tejidos apicales clínicamente normales") {
      planActuacion = "Endodoncia completa. Desinfección del sistema radicular. No urgente si asintomático.";
      urgencia = 'media';
      notasAdicionales.push("Apertura y descompresión si hay presión, irrigación abundante.");
      notasAdicionales.push("Sellado temporal estanco obligatorio.");
    } else if (apicalDx.includes("asintomática")) {
      planActuacion = "Endodoncia programada. Tratamiento no urgente pero necesario.";
      urgencia = 'media';
      notasAdicionales.push("Absceso crónico con fístula: no antibiótico indicado.");
    } else if (apicalDx.includes("sintomática")) {
      planActuacion = "Endodoncia URGENTE + drenaje endodóntico. Desinflamación y control en 24-48h.";
      urgencia = 'alta';
      notasAdicionales.push("Dolor pulsátil, movilidad, percusión positiva → drenaje prioritario.");
    } else if (apicalDx.includes("sistémica")) {
      planActuacion = "EMERGENCIA CLÍNICA: Drenaje endodóntico o incisión + antibióticos. Derivar si celulitis difusa o compromiso vía aérea.";
      urgencia = 'critica';
      antibiotico = true;
      notasAdicionales.push("✔ ANTIBIÓTICO OBLIGATORIO: Fiebre, edema difuso, celulitis, trismus.");
      notasAdicionales.push("Primera elección: Amoxicilina 500mg/8h 5-7 días.");
      notasAdicionales.push("Alergia penicilina: Clindamicina 300mg/8h.");
    } else if (apicalDx.includes("sinusal")) {
      planActuacion = "Endodoncia completa. Fístula indica drenaje crónico - no antibiótico necesario.";
      urgencia = 'media';
      notasAdicionales.push("❌ No antibiótico: absceso crónico drena espontáneamente.");
    } else if (apicalDx.includes("inconcluso")) {
      planActuacion = "Endodoncia indicada por necrosis pulpar. Reevaluación apical en 1-2 semanas para aclarar estado periapical.";
      urgencia = 'media';
      notasAdicionales.push("Estado apical inconcluso: realizar CBCT o rx adicionales si persisten dudas.");
      notasAdicionales.push("Desinfección del sistema radicular es prioritaria independientemente del estado apical.");
    } else {
      // Rama por defecto para cualquier otro diagnóstico apical con necrosis
      planActuacion = "Endodoncia completa. Desinfección del sistema radicular. Control y reevaluación según evolución clínica.";
      urgencia = 'media';
      notasAdicionales.push("Tratamiento endodóntico indicado por necrosis pulpar.");
    }
  }

  // CASO 5: Estado inconcluso
  else if (pulpalDx === "Estado pulpar inconcluso") {
    planActuacion = "Reevaluación clínica y radiográfica en 1-2 semanas. Monitorización sin intervención inmediata.";
    urgencia = 'baja';
    notasAdicionales.push("Realizar pruebas diagnósticas adicionales antes de decidir tratamiento.");
  }

  // CASO POR DEFECTO: Si no coincide con ningún caso anterior
  else {
    planActuacion = "Evaluación clínica completa. Consultar con biblioteca clínica ENDOIA para diagnósticos específicos.";
    urgencia = 'media';
    notasAdicionales.push("Diagnóstico no reconocido en el sistema. Revisar datos clínicos ingresados.");
    notasAdicionales.push("Contactar con tutor para orientación diagnóstica si persiste incertidumbre.");
  }

  // Validación final: asegurar que planActuacion nunca esté vacío
  if (!planActuacion || planActuacion.trim() === "") {
    planActuacion = "Evaluación clínica integral requerida. Consultar protocolos AAE/ESE 2025 en Biblioteca ENDOIA.";
    urgencia = 'media';
  }

  // ─────────────────────────────────────────────────────────────────────────
  // NOTAS ADICIONALES según contexto específico
  // ─────────────────────────────────────────────────────────────────────────

  // Recomendaciones generales de manejo
  if (urgencia === 'alta' || urgencia === 'critica') {
    notasAdicionales.push("Control postoperatorio en 24-48 horas obligatorio.");
  }

  // Criterios de derivación
  if (apicalDx.includes("sistémica")) {
    notasAdicionales.push("DERIVAR SI: Celulitis difusa, compromiso vía aérea, inmunosupresión, fiebre persistente >38.5°C.");
  }

  // Antibióticos - aclaración de cuándo NO dar
  if (!antibiotico && (pulpalDx === "Pulpitis severa" || pulpalDx === "Pulpa necrótica")) {
    notasAdicionales.push("❌ NO antibiótico: Pulpitis sin signos sistémicos, necrosis sin celulitis, dolor pulpar sin fiebre.");
  }

  // Seguimiento estructurado
  if (planActuacion.includes("Endodoncia")) {
    notasAdicionales.push("Seguimiento recomendado: 1 mes (control inicial), 3 meses, 6 meses (éxito del tratamiento).");
  }

  return {
    analgesia,
    planActuacion,
    urgencia,
    antibiotico,
    notasAdicionales
  };
}

/**
 * Genera resumen textual de las recomendaciones para mostrar al clínico
 */
export function formatearRecomendaciones(rec: RecomendacionesClinicas): string {
  let texto = `📋 PLAN DE ACTUACIÓN:\n${rec.planActuacion}\n\n`;
  
  texto += `💊 ANALGESIA:\n${rec.analgesia}\n\n`;
  
  if (rec.antibiotico) {
    texto += `🦠 ANTIBIÓTICO: SÍ - Indicado según criterios ADA/AAE 2024\n\n`;
  } else {
    texto += `🦠 ANTIBIÓTICO: NO indicado\n\n`;
  }
  
  const urgenciaEmoji = {
    'baja': '🟢',
    'media': '🟡',
    'alta': '🔴',
    'critica': '🚨'
  };
  
  texto += `${urgenciaEmoji[rec.urgencia]} URGENCIA: ${rec.urgencia.toUpperCase()}\n\n`;
  
  if (rec.notasAdicionales.length > 0) {
    texto += `📌 NOTAS CLÍNICAS:\n`;
    rec.notasAdicionales.forEach(nota => {
      texto += `  • ${nota}\n`;
    });
  }
  
  return texto;
}
