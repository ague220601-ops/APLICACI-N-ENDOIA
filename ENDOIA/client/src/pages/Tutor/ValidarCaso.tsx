import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, CheckCircle2, Loader2, AlertCircle, Stethoscope, Activity, X } from "lucide-react";
import { useAuth } from "@/auth/AuthContext";
import { OPCIONES_PULPAR, OPCIONES_APICAL, getTutorTokenFromEmail } from "@/lib/classifications";
import { enviarLabelTutor } from "@/lib/api";

function toNumber(value: number | string | null | undefined): number {
  if (value === null || value === undefined || value === '') return 0;
  if (typeof value === 'number') return value;
  const parsed = Number(value);
  return isNaN(parsed) ? 0 : parsed;
}

export default function ValidarCaso() {
  const { user } = useAuth();
  const params = useParams();
  const [, navigate] = useLocation();
  
  const case_id = params.case_id;
  const casoStored = case_id ? sessionStorage.getItem(`caso_${case_id}`) : null;
  const caso = casoStored ? JSON.parse(casoStored) : null;

  const [pulparSeleccionado, setPulparSeleccionado] = useState<string>("");
  const [apicalSeleccionado, setApicalSeleccionado] = useState<string>("");
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!caso || !case_id) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="w-4 h-4" />
          <AlertDescription>
            No se encontraron datos del caso. Vuelve a la lista de pendientes.
          </AlertDescription>
        </Alert>
        <Button onClick={() => navigate('/tutor')} className="mt-4 gap-2">
          <ArrowLeft className="w-4 h-4" />
          Volver a casos pendientes
        </Button>
      </div>
    );
  }

  async function handleEnviarValidacion() {
    if (!pulparSeleccionado || !apicalSeleccionado) {
      setError('Debes seleccionar ambas clasificaciones (pulpar y apical)');
      return;
    }

    const token = getTutorTokenFromEmail(user?.email || '');
    if (!token) {
      setError('Tu email no está autorizado como tutor');
      return;
    }

    const tutorType: 'JEN' | 'SEG' | 'INV' = token.includes('JEN') ? 'JEN' : 
                                              token.includes('SEG') ? 'SEG' : 'INV';

    setGuardando(true);
    setError(null);

    try {
      await enviarLabelTutor(
        case_id!,
        {
          pulpar: pulparSeleccionado,
          apical: apicalSeleccionado
        },
        tutorType
      );

      alert('✓ Validación registrada correctamente');
      navigate('/tutor');
    } catch (err) {
      console.error('Error enviando validación:', err);
      setError('No se pudo enviar la validación. Inténtalo de nuevo.');
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/tutor')}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Validar Caso</h1>
          <p className="text-muted-foreground mt-1">
            Caso: <span className="font-mono">{case_id}</span>
          </p>
        </div>
      </div>

      <Alert>
        <AlertCircle className="w-4 h-4" />
        <AlertDescription>
          <strong>Importante:</strong> Solo puedes ver datos clínicos sin diagnósticos IA. 
          Asigna las clasificaciones según tu criterio profesional y la clasificación AEDE/ESE 2025.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5" />
                Datos del Diente
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Diente (FDI)</p>
                <p className="text-lg font-bold">{caso.tooth_fdi}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fecha registro</p>
                <p className="text-lg font-medium">{caso.date || caso.registro_fecha || 'N/A'}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Síntomas y Signos Clínicos
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Dolor espontáneo</p>
                <p className="font-medium">{toNumber(caso.spontaneous_pain_yesno) === 1 ? '✓ Sí' : '✗ No'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Respuesta al frío</p>
                <p className="font-medium">
                  {toNumber(caso.thermal_cold_response) === 0 ? 'No responde' : 
                   toNumber(caso.thermal_cold_response) === 2 ? 'Aumentada' : 'Normal'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Dolor persistente (seg)</p>
                <p className="font-medium">{toNumber(caso.lingering_pain_seconds)} seg</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Percusión dolorosa</p>
                <p className="font-medium">{caso.percussion_pain_yesno === 'yes' ? '✓ Sí' : '✗ No'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Palpación apical dolorosa</p>
                <p className="font-medium">{caso.apical_palpation_pain === 'si' || caso.apical_palpation_pain === 'yes' ? '✓ Sí' : '✗ No'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tracto sinusal presente</p>
                <p className="font-medium">{caso.sinus_tract_present === 'si' || caso.sinus_tract_present === 'yes' ? '✓ Sí' : '✗ No'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Compromiso sistémico</p>
                <p className="font-medium">{caso.systemic_involvement === 'si' || caso.systemic_involvement === 'yes' ? '✓ Sí' : '✗ No'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tratamiento previo</p>
                <p className="font-medium">{caso.previous_treatment === 'si' || caso.previous_treatment === 'yes' ? '✓ Sí' : '✗ No'}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hallazgos Radiográficos</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Radiolucidez apical</p>
                <p className="font-medium">{toNumber(caso.radiolucency_yesno) === 1 ? '✓ Sí' : '✗ No'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">PAI (1-5)</p>
                <p className="font-medium">{caso.periapical_index_PAI_1_5 || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ensanchamiento PDL</p>
                <p className="font-medium">{caso.pdl_widening || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Profundidad de caries</p>
                <p className="font-medium capitalize">{caso.depth_of_caries || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Sondaje máximo (mm)</p>
                <p className="font-medium">{caso.probing_max_depth_mm || 'N/A'} mm</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Control de sangrado</p>
                <p className="font-medium">{caso.bleeding_control_possible === 'yes' ? '✓ Sí' : '✗ No'}</p>
              </div>
            </CardContent>
          </Card>

          {/* BLOQUE DE IA RADIOLÓGICA */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <AlertCircle className="w-5 h-5" />
                Análisis Radiográfico IA (Vision GPT)
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">PAI inicial (IA)</p>
                <p className="font-medium">{caso.vision_PAI_baseline ?? "No disponible"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">PAI seguimiento (IA)</p>
                <p className="font-medium">{caso.vision_PAI_followup ?? "No disponible"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Radiolucidez detectada</p>
                <p className="font-medium">{caso.vision_radiolucency_detected ? "Sí" : "No"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Diámetro lesión (baseline)</p>
                <p className="font-medium">{caso.vision_lesion_diam_mm_baseline ? `${caso.vision_lesion_diam_mm_baseline} mm` : "No disponible"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Diámetro lesión (follow-up)</p>
                <p className="font-medium">{caso.vision_lesion_diam_mm_followup ? `${caso.vision_lesion_diam_mm_followup} mm` : "No disponible"}</p>
              </div>
              {caso.IA_flags && caso.IA_flags.length > 0 && (
                <div className="md:col-span-2">
                  <p className="text-sm font-semibold text-blue-800 mb-2">Alertas IA</p>
                  <ul className="list-disc list-inside space-y-1">
                    {caso.IA_flags.map((flag: string, idx: number) => (
                      <li key={idx} className="text-blue-700 text-sm">{flag}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* BLOQUE DE COHERENCIA CLÍNICO – IA */}
          <Card className="bg-orange-50 border-orange-200">
            <CardHeader>
              <CardTitle className="text-orange-800">Coherencia Clínico – IA</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Radiolucidez (Clínico)</p>
                  <p className="font-medium">
                    {caso.radiolucency_yesno === "si" || caso.radiolucency_yesno === "1" || toNumber(caso.radiolucency_yesno) === 1 ? "Sí" : "No"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Radiolucidez (IA)</p>
                  <p className="font-medium">{caso.vision_radiolucency_detected ? "Sí" : "No"}</p>
                </div>
              </div>
              <div className="pt-2 border-t border-orange-200">
                <p className="text-sm text-muted-foreground">Interpretación final</p>
                <p className="font-medium">
                  {caso.vision_radiolucency_detected
                    ? "Radiolucidez presente (confirmada por IA)"
                    : (caso.radiolucency_yesno === "si" || caso.radiolucency_yesno === "1" || toNumber(caso.radiolucency_yesno) === 1)
                      ? "Radiolucidez presente (identificada por el clínico)"
                      : "No se detecta radiolucidez"}
                </p>
              </div>
              {(caso.vision_radiolucency_detected &&
                (caso.radiolucency_yesno === "no" ||
                 caso.radiolucency_yesno === "0" ||
                 toNumber(caso.radiolucency_yesno) === 0)) && (
                <div className="bg-orange-100 p-3 rounded-lg">
                  <p className="text-orange-700 text-sm">
                    <strong>Aviso:</strong> Se detecta discrepancia entre el clínico y la IA.
                    La interpretación final prioriza la detección de IA por seguridad diagnóstica.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {caso.notes && caso.notes.trim() !== '' && (
            <Card>
              <CardHeader>
                <CardTitle>Notas Clínicas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm">{caso.notes}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-6 border-2 border-primary/20">
            <CardHeader>
              <CardTitle>Diagnóstico AEDE/ESE 2025</CardTitle>
              <CardDescription>
                Asigna las clasificaciones oficiales (Gold Standard)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="pulpar" className="font-semibold">
                  Clasificación Pulpar *
                </Label>
                <Select value={pulparSeleccionado} onValueChange={setPulparSeleccionado}>
                  <SelectTrigger id="pulpar">
                    <SelectValue placeholder="Selecciona clasificación pulpar..." />
                  </SelectTrigger>
                  <SelectContent>
                    {OPCIONES_PULPAR.map((opcion) => (
                      <SelectItem key={opcion} value={opcion}>
                        {opcion}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="apical" className="font-semibold">
                  Clasificación Apical *
                </Label>
                <Select value={apicalSeleccionado} onValueChange={setApicalSeleccionado}>
                  <SelectTrigger id="apical">
                    <SelectValue placeholder="Selecciona clasificación apical..." />
                  </SelectTrigger>
                  <SelectContent>
                    {OPCIONES_APICAL.map((opcion) => (
                      <SelectItem key={opcion} value={opcion}>
                        {opcion}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {error && (
                <Alert variant="destructive">
                  <X className="w-4 h-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {pulparSeleccionado && apicalSeleccionado && (
                <div className="bg-green-50 border border-green-200 p-3 rounded-lg space-y-2">
                  <p className="text-xs font-medium text-green-700">Clasificación seleccionada:</p>
                  <div className="space-y-1">
                    <div>
                      <p className="text-xs text-muted-foreground">Pulpar:</p>
                      <Badge variant="outline" className="text-xs">{pulparSeleccionado}</Badge>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Apical:</p>
                      <Badge variant="outline" className="text-xs">{apicalSeleccionado}</Badge>
                    </div>
                  </div>
                </div>
              )}

              <Button
                onClick={handleEnviarValidacion}
                disabled={!pulparSeleccionado || !apicalSeleccionado || guardando}
                className="w-full gap-2"
              >
                {guardando ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Enviar Validación
                  </>
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                * Ambas clasificaciones son obligatorias para completar la validación
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
