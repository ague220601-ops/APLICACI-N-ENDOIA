export type ResultadoExitoRadiologico = 'si' | 'parcial' | 'no' | 'manual';

export function calcularExitoRadiologicoAuto(
  PAI_base: number | string | null | undefined,
  PAI_followup: number | string | null | undefined,
  diam_base: number | string | null | undefined,
  diam_followup: number | string | null | undefined
): ResultadoExitoRadiologico {
  if (!PAI_base || !PAI_followup) return "manual";

  const paiBase = Number(PAI_base);
  const paiFollow = Number(PAI_followup);
  const diamBase = Number(diam_base) || 0;
  const diamFollow = Number(diam_followup) || 0;

  if (paiFollow < paiBase) {
    if (paiFollow <= 2 && diamFollow <= 1) {
      return "si";
    }
    return "parcial";
  }

  if (paiFollow > paiBase) return "no";

  if (diamBase > 0 && diamFollow > 0) {
    const reduccion = (diamBase - diamFollow) / diamBase;
    if (reduccion >= 0.3) return "si";
    if (reduccion > 0) return "parcial";
    if (diamFollow > diamBase) return "no";
  }

  return "si";
}
