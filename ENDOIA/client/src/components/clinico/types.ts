export interface ClinicoCase {
  row_number: number;
  case_id: string;
  date: string;
  clinicoEmail: string;
  tooth_fdi: number | string;
  spontaneous_pain_yesno: number | string;
  thermal_cold_response: number | string;
  lingering_pain_seconds: number | string;
  periapical_index_PAI_1_5: number | string;
  radiolucency_yesno: number | string;
  pdl_widening: number | string;
  probing_max_depth_mm: number | string;
  depth_of_caries: string;
  percussion_pain_yesno: string;
  bleeding_control_possible: string;
  sinus_tract_present: string;
  systemic_involvement: string;
  previous_treatment: string;
  apical_palpation_pain: string;
  notes: string;
  AEDE_pulpar_IA: string;
  AEDE_apical_IA: string;
  tto_propuesto: string;
  tto_realizado: string;
  fecha_tto: string;
  control_1m_exito: number | string;
  fecha_control_1m: string;
  control_3m_exito: number | string;
  fecha_control_3m: string;
  control_6m_exito: number | string;
  fecha_control_6m: string;
  AEDE_pulpar_JEN: string;
  AEDE_apical_JEN: string;
  validado_JEN: string;
  AEDE_pulpar_SEG: string;
  AEDE_apical_SEG: string;
  validado_SEG: string;
  AEDE_pulpar_INV: string;
  AEDE_apical_INV: string;
  validado_INV: string;
  AEDE_pulpar_FINAL: string;
  AEDE_apical_FINAL: string;
  validado_FINAL: string;
  registro_fecha: string;
  registro_ip: string;
  token_recibido?: string;
  case_id_recibido?: string;
  discrepancia?: boolean | string;
  token?: string;
  token_normalizado?: string;
  token_valido?: boolean | string;
}

export interface ToothHistoryGroup {
  fdi: string;
  cases: ClinicoCase[];
  count: number;
}

export interface MonthlyStats {
  month: string;
  count: number;
}

export interface TreatmentStats {
  treatment: string;
  totalCases: number;
  casesWithControls: number;
  successfulCases: number;
  successRate: number;
}

export interface DiagnosisDistribution {
  diagnosis: string;
  count: number;
}

export interface ToothFailureStats {
  fdi: string;
  failures: number;
}
