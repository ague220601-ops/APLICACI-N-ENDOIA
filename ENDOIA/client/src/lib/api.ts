import { auth } from './firebase';
import { supabase, type CaseRecord } from './supabase';

export interface CasoClinico {
  case_id: string;
  tooth_fdi: string;
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
  notas: string;
  tratamientoRealizado: string;
  clinicoNombre: string;
  clinicoEmail: string;
  pulpalDxIA?: string;
  apicalDxIA?: string;
  ttoPropuestoIA?: string;
  AEDE_pulpar_class?: string;
}

async function getCurrentUserEmail(): Promise<string> {
  const user = auth.currentUser;
  if (!user || !user.email) {
    throw new Error('Usuario no autenticado');
  }
  return user.email;
}

function toInt(val: any): number | undefined {
  if (val === undefined || val === null || val === '') return undefined;
  const parsed = parseInt(String(val), 10);
  return isNaN(parsed) ? undefined : parsed;
}

export async function enviarCasoNuevo(datosCaso: any) {
  try {
    const email = await getCurrentUserEmail();
    
    const caseRecord: Partial<CaseRecord> = {
      case_id: datosCaso.case_id,
      date: datosCaso.date || datosCaso.fecha || new Date().toISOString().split('T')[0],
      clinicoEmail: datosCaso.clinicoEmail || email,
      tooth_fdi: toInt(datosCaso.tooth_fdi) || 0,
      spontaneous_pain_yesno: toInt(datosCaso.spontaneous_pain_yesno),
      thermal_cold_response: toInt(datosCaso.thermal_cold_response),
      lingering_pain_seconds: datosCaso.lingering_pain_seconds || '',
      periapical_index_PAI_1_5: toInt(datosCaso.periapical_index_PAI_1_5),
      radiolucency_yesno: datosCaso.radiolucency_yesno || '',
      pdl_widening: toInt(datosCaso.pdl_widening),
      probing_max_depth_mm: toInt(datosCaso.probing_max_depth_mm),
      depth_of_caries: datosCaso.depth_of_caries || '',
      percussion_pain_yesno: datosCaso.percussion_pain_yesno || '',
      bleeding_control_possible: datosCaso.bleeding_control_possible || '',
      tipo_dolor: datosCaso.tipo_dolor || null,
      sondaje_max_mm: datosCaso.sondaje_max_mm ? Number(datosCaso.sondaje_max_mm) : null,
      sangrado_controlable: datosCaso.sangrado_controlable || null,
      camara_abierta: datosCaso.camara_abierta || null,
      pulpa_expuesta: datosCaso.pulpa_expuesta || null,
      sinus_tract_present: datosCaso.sinus_tract_present || '',
      systemic_involvement: datosCaso.systemic_involvement || '',
      previous_treatment: datosCaso.previous_treatment || '',
      apical_palpation_pain: datosCaso.apical_palpation_pain || '',
      notes: datosCaso.notes || datosCaso.notas || '',
      AEDE_pulpar_IA: datosCaso.AEDE_pulpar_IA || datosCaso.pulpalDxIA || '',
      AEDE_apical_IA: datosCaso.AEDE_apical_IA || datosCaso.apicalDxIA || '',
      tto_propuesto: datosCaso.tto_propuesto || datosCaso.ttoPropuestoIA || '',
      tto_realizado: datosCaso.tto_realizado || '',
      fecha_tto: datosCaso.fecha_tto || '',
      control_1m_exito: toInt(datosCaso.control_1m_exito) || 0,
      control_3m_exito: toInt(datosCaso.control_3m_exito) || 0,
      control_6m_exito: toInt(datosCaso.control_6m_exito) || 0,
      fecha_control_1m: datosCaso.fecha_control_1m || '',
      fecha_control_3m: datosCaso.fecha_control_3m || '',
      fecha_control_6m: datosCaso.fecha_control_6m || '',
    };

    console.log("📤 Insertando caso en Supabase:", caseRecord.case_id);
    
    const { data, error } = await supabase
      .from('cases')
      .insert([caseRecord])
      .select();

    if (error) {
      console.error("❌ Error de Supabase:", error);
      return { 
        ok: false, 
        error: error.message || 'Error al guardar el caso'
      };
    }
    
    console.log("✅ Caso guardado exitosamente en Supabase");
    return { ok: true, data };
    
  } catch (err) {
    console.error("Error enviando caso:", err);
    return { 
      ok: false, 
      error: "No se pudo conectar con la base de datos. Verifica tu conexión." 
    };
  }
}

export async function obtenerPendientes(): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('cases')
      .select('*')
      .or('validado_JEN.is.null,validado_SEG.is.null,AEDE_pulpar_FINAL.is.null')
      .order('date', { ascending: false });

    if (error) {
      console.error("Error obteniendo pendientes:", error);
      return [];
    }
    
    console.log("✅ Casos pendientes obtenidos:", data?.length || 0);
    return data || [];
  } catch (err) {
    console.error("Error cargando pendientes:", err);
    return [];
  }
}

export async function obtenerMisCasos(): Promise<any[]> {
  try {
    const email = await getCurrentUserEmail();
    
    console.log("📋 Obteniendo casos del clínico:", email);
    
    const { data, error } = await supabase
      .from('cases')
      .select('*')
      .eq('clinicoEmail', email)
      .order('date', { ascending: false });

    if (error) {
      console.error("Error obteniendo mis casos:", error);
      return [];
    }
    
    console.log("✅ Casos obtenidos de Supabase:", data?.length || 0);
    return data || [];
  } catch (err) {
    console.error("Error cargando mis casos:", err);
    return [];
  }
}

export interface Clasificaciones {
  pulpar: string;
  apical: string;
}

export async function enviarLabelTutor(
  case_id: string, 
  clasificaciones: Clasificaciones,
  tutorType: 'JEN' | 'SEG' | 'INV' = 'JEN'
) {
  try {
    const email = await getCurrentUserEmail();
    const timestamp = new Date().toISOString();
    
    let updateData: any = {};
    
    if (tutorType === 'JEN') {
      updateData = {
        AEDE_pulpar_JEN: clasificaciones.pulpar,
        AEDE_apical_JEN: clasificaciones.apical,
        validado_JEN: timestamp
      };
    } else if (tutorType === 'SEG') {
      updateData = {
        AEDE_pulpar_SEG: clasificaciones.pulpar,
        AEDE_apical_SEG: clasificaciones.apical,
        validado_SEG: timestamp
      };
    } else if (tutorType === 'INV') {
      updateData = {
        AEDE_pulpar_INV: clasificaciones.pulpar,
        AEDE_apical_INV: clasificaciones.apical,
        validado_INV: timestamp
      };
    }

    console.log("🏷️ Etiquetando caso:", case_id, "por tutor:", email, "→", tutorType);
    
    const { data, error } = await supabase
      .from('cases')
      .update(updateData)
      .eq('case_id', case_id)
      .select();

    if (error) {
      console.error("Error etiquetando caso:", error);
      throw new Error(error.message || 'No se pudo etiquetar el caso');
    }
    
    console.log("✅ Caso etiquetado exitosamente");
    return { success: true, data };
  } catch (err) {
    console.error("Error etiquetando caso:", err);
    throw err;
  }
}

export async function obtenerDatosInvestigacion(): Promise<any[]> {
  try {
    console.log("🔬 Obteniendo todos los casos para investigación");
    
    const { data, error } = await supabase
      .from('cases')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error("Error obteniendo datos de investigación:", error);
      return [];
    }
    
    console.log("✅ Datos de investigación obtenidos:", data?.length || 0, "casos");
    return data || [];
  } catch (err) {
    console.error("Error cargando datos de investigación:", err);
    return [];
  }
}

export interface ActualizarControlPayload {
  case_id: string;
  tipo_control: '1m' | '3m' | '6m';
  exito_clinico: boolean;
  exito_radiologico: 'si' | 'parcial' | 'no';
  notas: string;
}

export async function actualizarControl(payload: ActualizarControlPayload): Promise<any> {
  try {
    const { case_id, tipo_control, exito_clinico, exito_radiologico, notas } = payload;
    const fecha_control = new Date().toISOString().split('T')[0];
    
    let exitoValue: number;
    if (exito_clinico && exito_radiologico === 'si') {
      exitoValue = 1;
    } else if (exito_clinico && exito_radiologico === 'parcial') {
      exitoValue = 3;
    } else {
      exitoValue = 2;
    }
    
    let updateData: any = {};
    
    if (tipo_control === '1m') {
      updateData = {
        control_1m_exito: exitoValue,
        fecha_control_1m: fecha_control,
        exito_clinico_final: exito_clinico ? 'si' : 'no',
        exito_radiologico_final: exito_radiologico
      };
    } else if (tipo_control === '3m') {
      updateData = {
        control_3m_exito: exitoValue,
        fecha_control_3m: fecha_control,
        exito_clinico_final: exito_clinico ? 'si' : 'no',
        exito_radiologico_final: exito_radiologico
      };
    } else if (tipo_control === '6m') {
      updateData = {
        control_6m_exito: exitoValue,
        fecha_control_6m: fecha_control,
        exito_clinico_final: exito_clinico ? 'si' : 'no',
        exito_radiologico_final: exito_radiologico
      };
    }

    console.log("📝 Actualizando control:", tipo_control, "para caso:", case_id);
    
    const { data, error } = await supabase
      .from('cases')
      .update(updateData)
      .eq('case_id', case_id)
      .select();

    if (error) {
      console.error("Error actualizando control:", error);
      throw new Error(error.message || 'No se pudo actualizar el control');
    }
    
    console.log("✅ Control actualizado exitosamente");
    return { success: true, data };
  } catch (err) {
    console.error('Error actualizando control:', err);
    throw err;
  }
}

export interface ActualizarTratamientoPayload {
  case_id: string;
  tto_realizado?: string;
  fecha_tto?: string;
}

export async function actualizarTratamiento(payload: ActualizarTratamientoPayload): Promise<any> {
  try {
    const { case_id, tto_realizado, fecha_tto } = payload;

    console.log("💊 Actualizando tratamiento para caso:", case_id);
    
    const updateData: any = {};
    if (tto_realizado !== undefined) {
      updateData.tto_realizado = tto_realizado;
    }
    if (fecha_tto !== undefined) {
      updateData.fecha_tto = fecha_tto;
    }

    const { data, error } = await supabase
      .from('cases')
      .update(updateData)
      .eq('case_id', case_id)
      .select();

    if (error) {
      console.error("Error actualizando tratamiento:", error);
      throw new Error(error.message || 'No se pudo actualizar el tratamiento');
    }
    
    console.log("✅ Tratamiento actualizado exitosamente");
    return { success: true, data };
  } catch (err) {
    console.error('Error actualizando tratamiento:', err);
    throw err;
  }
}

export async function actualizarDiagnosticoFinal(case_id: string, pulpar: string, apical: string): Promise<any> {
  try {
    console.log("🎯 Actualizando diagnóstico FINAL para caso:", case_id);
    
    const { data, error } = await supabase
      .from('cases')
      .update({
        AEDE_pulpar_FINAL: pulpar,
        AEDE_apical_FINAL: apical
      })
      .eq('case_id', case_id)
      .select();

    if (error) {
      console.error("Error actualizando diagnóstico final:", error);
      throw new Error(error.message || 'No se pudo actualizar el diagnóstico final');
    }
    
    console.log("✅ Diagnóstico FINAL actualizado exitosamente");
    return { success: true, data };
  } catch (err) {
    console.error('Error actualizando diagnóstico final:', err);
    throw err;
  }
}
