import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Faltan variables de entorno de Supabase');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface CaseRecord {
  id?: number;
  case_id: string;
  date?: string;
  fecha?: string;
  clinicoEmail: string;
  tooth_fdi: number | string;
  tipo_dolor?: string;
  spontaneous_pain_yesno?: number | string;
  thermal_cold_response?: number | string;
  lingering_pain_seconds?: string;
  periapical_index_PAI_1_5?: number | string;
  radiolucency_yesno?: string;
  pdl_widening?: number | string;
  probing_max_depth_mm?: number | string;
  sondaje_max_mm?: number | null;
  depth_of_caries?: string;
  percussion_pain_yesno?: string;
  bleeding_control_possible?: string;
  sangrado_controlable?: string | null;
  camara_abierta?: string | null;
  pulpa_expuesta?: string | null;
  sinus_tract_present?: string;
  systemic_involvement?: string;
  previous_treatment?: string;
  apical_palpation_pain?: string;
  notes?: string;
  AEDE_pulpar_IA?: string;
  AEDE_apical_IA?: string;
  tto_propuesto?: string;
  tto_realizado?: string;
  fecha_tto?: string;
  control_1m_exito?: number | string;
  fecha_control_1m?: string;
  control_3m_exito?: number | string;
  fecha_control_3m?: string;
  control_6m_exito?: number | string;
  fecha_control_6m?: string;
  AEDE_pulpar_JEN?: string;
  AEDE_apical_JEN?: string;
  validado_JEN?: string;
  AEDE_pulpar_SEG?: string;
  AEDE_apical_SEG?: string;
  validado_SEG?: string;
  AEDE_pulpar_INV?: string;
  AEDE_apical_INV?: string;
  validado_INV?: string;
  AEDE_pulpar_FINAL?: string;
  AEDE_apical_FINAL?: string;
}
