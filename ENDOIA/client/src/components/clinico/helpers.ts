import { ClinicoCase } from './types';

export function toNumber(value: number | string | null | undefined): number {
  if (value === null || value === undefined || value === '') return 0;
  if (typeof value === 'number') return value;
  const parsed = Number(value);
  return isNaN(parsed) ? 0 : parsed;
}

export function getDiagnosisColor(diagnosis: string): string {
  if (!diagnosis) return 'bg-yellow-100 text-yellow-700 border-yellow-300';
  
  const lower = diagnosis.toLowerCase();
  
  if (lower.includes('normal') || lower.includes('healthy') || lower.includes('clinically normal')) {
    return 'bg-green-100 text-green-800 border-green-300';
  }
  
  if (lower.includes('hypersens') || lower.includes('hipersens') || lower.includes('mild')) {
    return 'bg-blue-100 text-blue-800 border-blue-300';
  }
  
  if (lower.includes('symptomatic') || lower.includes('sintomática') || lower.includes('inflam')) {
    return 'bg-orange-100 text-orange-800 border-orange-300';
  }
  
  if (lower.includes('necr') || lower.includes('necrotic') || lower.includes('abscess') || 
      lower.includes('sinus') || lower.includes('lesión apical')) {
    return 'bg-red-100 text-red-800 border-red-300';
  }
  
  return 'bg-yellow-100 text-yellow-700 border-yellow-300';
}

export function isComplexCase(caso: ClinicoCase): boolean {
  const pai = toNumber(caso.periapical_index_PAI_1_5);
  const radiolucency = toNumber(caso.radiolucency_yesno) === 1;
  const probing = toNumber(caso.probing_max_depth_mm);
  const spontaneousPain = toNumber(caso.spontaneous_pain_yesno) === 1;
  
  return pai >= 3 || radiolucency || probing > 4 || spontaneousPain;
}

export function hasCompletedFollowUp(caso: ClinicoCase): boolean {
  const control1m = toNumber(caso.control_1m_exito);
  const control3m = toNumber(caso.control_3m_exito);
  const control6m = toNumber(caso.control_6m_exito);
  
  return control1m !== 0 && control3m !== 0 && control6m !== 0;
}

export function hasPendingFollowUp(caso: ClinicoCase): boolean {
  if (!caso.fecha_tto || caso.fecha_tto.trim() === '') return false;
  
  const control1m = toNumber(caso.control_1m_exito);
  const control3m = toNumber(caso.control_3m_exito);
  const control6m = toNumber(caso.control_6m_exito);
  
  return control1m === 0 || control3m === 0 || control6m === 0;
}

export function getCaseQualityScore(caso: ClinicoCase): {
  hasNotes: boolean;
  hasKeyFields: boolean;
  hasAnyControl: boolean;
} {
  const hasNotes = Boolean(caso.notes && caso.notes.trim());
  
  const hasKeyFields = Boolean(
    caso.tooth_fdi &&
    caso.AEDE_pulpar_IA &&
    caso.AEDE_apical_IA &&
    caso.tto_propuesto
  );
  
  const hasAnyControl = toNumber(caso.control_1m_exito) !== 0 ||
                        toNumber(caso.control_3m_exito) !== 0 ||
                        toNumber(caso.control_6m_exito) !== 0;
  
  return { hasNotes, hasKeyFields, hasAnyControl };
}

export function getMonthKey(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export function getMonthLabel(monthKey: string): string {
  const [year, month] = monthKey.split('-');
  const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  return `${monthNames[parseInt(month) - 1]} ${year}`;
}
