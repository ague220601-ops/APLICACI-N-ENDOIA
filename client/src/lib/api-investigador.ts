import type { User } from 'firebase/auth';
import { supabase } from './supabase';

export interface CasoInvestigacion {
  case_id: string;
  clinico_email: string;
  clinicoEmail?: string;
  tooth_fdi: string;
  date?: string;
  registro_fecha?: string;
  
  spontaneous_pain_yesno?: number;
  thermal_cold_response?: number;
  lingering_pain_seconds?: number;
  percussion_pain_yesno?: string;
  apical_palpation_pain?: string;
  sinus_tract_present?: string;
  systemic_involvement?: string;
  previous_treatment?: string;
  
  radiolucency_yesno?: number;
  periapical_index_PAI_1_5?: string;
  pdl_widening?: string;
  depth_of_caries?: string;
  probing_max_depth_mm?: string;
  bleeding_control_possible?: string;
  
  AEDE_pulpar_IA?: string;
  AEDE_apical_IA?: string;
  AEDE_pulpar_JEN?: string;
  AEDE_apical_JEN?: string;
  AEDE_pulpar_SEG?: string;
  AEDE_apical_SEG?: string;
  AEDE_pulpar_INV?: string;
  AEDE_apical_INV?: string;
  AEDE_pulpar_FINAL?: string;
  AEDE_apical_FINAL?: string;
  
  discrepancia?: boolean | string;
  
  tto_realizado?: string;
  fecha_tto?: string;
  
  control_1m_exito?: string;
  control_3m_exito?: string;
  control_6m_exito?: string;
  
  notes?: string;
}

export async function obtenerDatosInvestigacion(user: User | null): Promise<CasoInvestigacion[]> {
  if (!user) {
    throw new Error('Usuario no autenticado');
  }

  console.log("🔬 Obteniendo todos los casos para investigación desde Supabase");

  const { data, error } = await supabase
    .from('cases')
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    console.error("Error obteniendo datos de investigación:", error);
    throw new Error('Error al obtener datos de investigación');
  }
  
  console.log("✅ Datos de investigación obtenidos:", data?.length || 0, "casos");
  
  return (data || []).map(caso => ({
    ...caso,
    clinico_email: caso.clinicoEmail || caso.clinico_email
  }));
}
