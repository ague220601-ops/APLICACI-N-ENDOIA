// Clasificaciones AAE/ESE 2025 - Gold Standard
export const OPCIONES_PULPAR = [
  "Clinically normal pulp",
  "Hypersensitive pulp",
  "Mild pulpitis",
  "Severe pulpitis",
  "Pulp necrosis",
  "Inconclusive pulp status",
  "Previously initiated root canal treatment",
  "Previously obturated root canal",
  "Previous regenerative endodontic treatment",
] as const;

export const OPCIONES_APICAL = [
  "Clinically normal apical tissues",
  "Apical hypersensitivity",
  "Localized symptomatic apical periodontitis",
  "Localized asymptomatic apical periodontitis",
  "Localized apical periodontitis with sinus tract",
  "Apical periodontitis with systemic involvement",
  "Healing apical tissue",
  "Inconclusive apical condition",
] as const;

export type PulpalClassification = typeof OPCIONES_PULPAR[number];
export type ApicalClassification = typeof OPCIONES_APICAL[number];

// Helper: Mapeo de email de tutor a token de n8n
const TUTOR_TOKEN_MAP: Record<string, string> = {
  "jennifer.endoia@gmail.com": "JEN_MARTIN_2025",
  "jenifer.margon@gmail.com": "JEN_MARTIN_2025",
  "segura.endoia@gmail.com": "SEGURA_2025",
  "sevillaendous@gmail.com": "SEGURA_2025",
  "ague220601@gmail.com": "JEN_MARTIN_2025",
  "investigador.endoia@gmail.com": "INVESTIGADOR_2025",
  "ague2206@gmail.com": "INVESTIGADOR_2025",
};

export function getTutorTokenFromEmail(email: string): string | null {
  return TUTOR_TOKEN_MAP[email.toLowerCase()] || null;
}
