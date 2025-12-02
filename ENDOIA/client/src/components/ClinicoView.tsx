import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Save, AlertCircle, CheckCircle2, Upload, X, Image } from "lucide-react";
import { motorIA_AAE_ESE } from "@/lib/IA_AAE_ESE_adapter";
import { enviarCasoNuevo, type CasoClinico } from "@/lib/api";
import { uploadRadiographWithVision } from "@/lib/radiographs";
import { useAuth } from "@/auth/AuthContext";

// Generador de ID pseudonimizado AEDE-IA
function generarCaseID(identificadorLocal = "") {
  const fecha = new Date().toISOString().slice(2,10).replace(/-/g,''); // YYMMDD
  const primeraLetra = identificadorLocal
    ? identificadorLocal.trim().charAt(0).toUpperCase()
    : String.fromCharCode(65 + Math.floor(Math.random() * 26)); // Letra aleatoria A-Z
  const aleatorio = Math.random().toString(36).substring(2,6).toUpperCase();
  return `ENDOIA-${fecha}-${primeraLetra}${aleatorio}`;
}

export default function ClinicoView() {
  const { user } = useAuth();
  
  const [form, setForm] = useState<CasoClinico>({
    case_id: "",
    tooth_fdi: "",
    dolorEspontaneo: "no",
    respuestaFrio: "1_normal",
    lingeringSeg: "",
    percusionDolor: "no",
    radiolucidezApical: "no",
    profundidadCaries: "moderada",
    sangradoControlable: "si",
    sinusTractPresent: "no",
    systemicInvolvement: "no",
    previousTreatment: "none",
    apicalPalpationPain: "no",
    notas: "",
    tratamientoRealizado: "no_realizado",
    clinicoNombre: "",
    clinicoEmail: "",
  });

  useEffect(() => {
    if (user?.email) {
      setForm(f => ({ 
        ...f, 
        clinicoEmail: user.email || "",
        clinicoNombre: user.displayName || user.email?.split('@')[0] || ""
      }));
    }
  }, [user]);

  const [identificadorLocal, setIdentificadorLocal] = useState("");
  
  const [radiografiaFile, setRadiografiaFile] = useState<File | null>(null);
  const [radiografiaPreview, setRadiografiaPreview] = useState<string | null>(null);
  const [tipoRadiografia, setTipoRadiografia] = useState<'periapical' | 'cbct'>('periapical');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [iaResult, setIaResult] = useState<{
    pulpalDxIA: string;
    apicalDxIA: string;
    ttoPropuestoIA: string;
    recomendaciones: {
      analgesia: string;
      planActuacion: string;
      urgencia: 'baja' | 'media' | 'alta' | 'critica';
      antibiotico: boolean;
      notasAdicionales: string[];
    };
    recomendacionesTexto: string;
    flags?: string[];
  } | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [estadoEnvio, setEstadoEnvio] = useState<{ tipo: "success" | "error"; mensaje: string } | null>(null);

  function handleChange(name: string, value: string) {
    setForm(f => ({ ...f, [name]: value }));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setRadiografiaFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setRadiografiaPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  function removeRadiografia() {
    setRadiografiaFile(null);
    setRadiografiaPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setEstadoEnvio(null);

    const ia = motorIA_AAE_ESE(form);
    setIaResult(ia);

    // Generar ID pseudonimizado automáticamente
    const caseIdGenerado = generarCaseID(identificadorLocal);

    // Convertir datos del formulario al formato que espera n8n/Google Sheets
    const payload = {
      case_id: caseIdGenerado,
      fecha: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      clinicoEmail: form.clinicoEmail,
      tooth_fdi: form.tooth_fdi,
      
      // Campos clínicos convertidos al formato esperado
      spontaneous_pain_yesno: form.dolorEspontaneo === "si" ? "1" : "0",
      thermal_cold_response: form.respuestaFrio === "0_no_responde" ? "0" 
        : form.respuestaFrio === "2_aumentada" ? "2" : "1",
      lingering_pain_seconds: form.lingeringSeg || "0",
      depth_of_caries: form.profundidadCaries,
      bleeding_control_possible: form.sangradoControlable === "si" ? "sí" : "no",
      
      // Campos radiográficos (estimados por el adaptador)
      periapical_index_PAI_1_5: form.radiolucidezApical === "si" 
        ? (form.percusionDolor === "si" ? "4" : "3") 
        : (form.percusionDolor === "si" ? "2" : "1"),
      radiolucency_yesno: form.radiolucidezApical === "si" ? "1" : "0",
      pdl_widening: form.radiolucidezApical === "si" ? "3" 
        : (form.percusionDolor === "si" ? "2" : "1"),
      percussion_pain_yesno: form.percusionDolor === "si" ? "sí" : "no",
      probing_max_depth_mm: "0", // No está en formulario actual
      
      // Campos clínicos adicionales
      sinus_tract_present: form.sinusTractPresent === "si" ? "sí" : "no",
      systemic_involvement: form.systemicInvolvement === "si" ? "sí" : "no",
      previous_treatment: form.previousTreatment,
      apical_palpation_pain: form.apicalPalpationPain === "si" ? "sí" : "no",
      
      notes: form.notas,
      
      // Diagnósticos IA generados
      AEDE_pulpar_IA: ia.pulpalDxIA,
      AEDE_apical_IA: ia.apicalDxIA,
      tto_propuesto: ia.ttoPropuestoIA,
      
      // Campos de tratamiento (vacíos inicialmente)
      tto_realizado: "",
      fecha_tto: "",
      
      // Campos de control/seguimiento (inicializados en 0)
      control_1m_exito: "0",
      control_3m_exito: "0",
      control_6m_exito: "0",
      fecha_control_1m: "",
      fecha_control_3m: "",
      fecha_control_6m: "",
    };

    const r = await enviarCasoNuevo(payload);
    if (r.ok) {
      let mensajeExito = `Caso guardado correctamente. ID generado: ${caseIdGenerado}`;
      
      if (radiografiaFile) {
        try {
          await uploadRadiographWithVision(radiografiaFile, caseIdGenerado, 'baseline', tipoRadiografia);
          mensajeExito += ` Radiografía baseline subida y analizada por IA.`;
          removeRadiografia();
        } catch (err) {
          console.error("Error subiendo radiografía:", err);
          mensajeExito += ` (Error al subir radiografía)`;
        }
      }
      
      setEstadoEnvio({ 
        tipo: "success", 
        mensaje: mensajeExito
      });
    } else {
      setEstadoEnvio({ 
        tipo: "error", 
        mensaje: r.error || "Error al guardar el caso. Verifica tu conexión y la configuración de n8n." 
      });
    }

    setEnviando(false);
  }

  return (
    <div className="space-y-6">
      <Card data-testid="card-clinical-form">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Formulario Clínico
          </CardTitle>
          <CardDescription>
            Registro del caso con análisis de apoyo por IA
          </CardDescription>
          <Alert className="mt-3">
            <AlertCircle className="w-4 h-4" />
            <AlertDescription className="text-xs">
              <strong>Importante:</strong> Esta herramienta proporciona apoyo al diagnóstico y NO sustituye el juicio clínico del profesional. La decisión final siempre debe basarse en la evaluación clínica completa.
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="identificador_local">Código interno del clínico (opcional)</Label>
                <Input
                  id="identificador_local"
                  data-testid="input-identificador-local"
                  value={identificadorLocal}
                  onChange={(e) => setIdentificadorLocal(e.target.value)}
                  placeholder="Ej: P123, ABC, etc."
                />
                <p className="text-xs text-muted-foreground">
                  Se generará un ID pseudonimizado automáticamente
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tooth_fdi">Diente (FDI) *</Label>
                <Input
                  id="tooth_fdi"
                  data-testid="input-tooth-fdi"
                  value={form.tooth_fdi}
                  onChange={(e) => handleChange("tooth_fdi", e.target.value)}
                  placeholder="36"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dolorEspontaneo">Dolor espontáneo</Label>
                <Select
                  value={form.dolorEspontaneo}
                  onValueChange={(value) => handleChange("dolorEspontaneo", value)}
                >
                  <SelectTrigger id="dolorEspontaneo" data-testid="select-dolor-espontaneo">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="si">Sí</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="respuestaFrio">Respuesta al frío</Label>
                <Select
                  value={form.respuestaFrio}
                  onValueChange={(value) => handleChange("respuestaFrio", value)}
                >
                  <SelectTrigger id="respuestaFrio" data-testid="select-respuesta-frio">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0_no_responde">No responde</SelectItem>
                    <SelectItem value="1_normal">Normal / leve</SelectItem>
                    <SelectItem value="2_aumentada">Muy aumentada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lingeringSeg">Duración dolor tras frío (seg)</Label>
                <Input
                  id="lingeringSeg"
                  data-testid="input-lingering"
                  type="number"
                  min="0"
                  value={form.lingeringSeg}
                  onChange={(e) => handleChange("lingeringSeg", e.target.value)}
                  placeholder="0-60"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="percusionDolor">Dolor a percusión</Label>
                <Select
                  value={form.percusionDolor}
                  onValueChange={(value) => handleChange("percusionDolor", value)}
                >
                  <SelectTrigger id="percusionDolor" data-testid="select-percusion">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="si">Sí</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="radiolucidezApical">Radiolucidez apical</Label>
                <Select
                  value={form.radiolucidezApical}
                  onValueChange={(value) => handleChange("radiolucidezApical", value)}
                >
                  <SelectTrigger id="radiolucidezApical" data-testid="select-radiolucidez">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no">No visible</SelectItem>
                    <SelectItem value="si">Sí visible</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="profundidadCaries">Profundidad caries</Label>
                <Select
                  value={form.profundidadCaries}
                  onValueChange={(value) => handleChange("profundidadCaries", value)}
                >
                  <SelectTrigger id="profundidadCaries" data-testid="select-profundidad">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="superficial">Superficial</SelectItem>
                    <SelectItem value="moderada">Moderada</SelectItem>
                    <SelectItem value="profunda">Profunda</SelectItem>
                    <SelectItem value="extrema">Extrema / Exposición pulpar</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sangradoControlable">Sangrado controlable</Label>
                <Select
                  value={form.sangradoControlable}
                  onValueChange={(value) => handleChange("sangradoControlable", value)}
                >
                  <SelectTrigger id="sangradoControlable" data-testid="select-sangrado">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="si">Sí</SelectItem>
                    <SelectItem value="no">No / difícil</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sinusTractPresent">Tracto sinusal / fístula</Label>
                <Select
                  value={form.sinusTractPresent}
                  onValueChange={(value) => handleChange("sinusTractPresent", value)}
                >
                  <SelectTrigger id="sinusTractPresent" data-testid="select-sinus-tract">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="si">Sí</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="systemicInvolvement">Compromiso sistémico</Label>
                <Select
                  value={form.systemicInvolvement}
                  onValueChange={(value) => handleChange("systemicInvolvement", value)}
                >
                  <SelectTrigger id="systemicInvolvement" data-testid="select-systemic">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="si">Sí (fiebre, malestar)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="previousTreatment">Tratamiento previo</Label>
                <Select
                  value={form.previousTreatment}
                  onValueChange={(value) => handleChange("previousTreatment", value)}
                >
                  <SelectTrigger id="previousTreatment" data-testid="select-previous-treatment">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Ninguno</SelectItem>
                    <SelectItem value="small_restoration">Restauración pequeña</SelectItem>
                    <SelectItem value="deep_restoration">Restauración profunda</SelectItem>
                    <SelectItem value="vital_indirect_cap">Recubrimiento pulpar indirecto</SelectItem>
                    <SelectItem value="vital_direct_cap">Recubrimiento pulpar directo</SelectItem>
                    <SelectItem value="partial_pulpotomy">Pulpotomía parcial</SelectItem>
                    <SelectItem value="full_pulpotomy">Pulpotomía completa</SelectItem>
                    <SelectItem value="previous_regenerative">Endodoncia regenerativa previa</SelectItem>
                    <SelectItem value="previously_initiated_rct">Endodoncia iniciada (no completada)</SelectItem>
                    <SelectItem value="previously_obturated_rct">Endodoncia completa previa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="apicalPalpationPain">Dolor a palpación apical</Label>
                <Select
                  value={form.apicalPalpationPain}
                  onValueChange={(value) => handleChange("apicalPalpationPain", value)}
                >
                  <SelectTrigger id="apicalPalpationPain" data-testid="select-apical-palpation">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="si">Sí</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tratamientoRealizado">Tratamiento realizado</Label>
                <Select
                  value={form.tratamientoRealizado}
                  onValueChange={(value) => handleChange("tratamientoRealizado", value)}
                >
                  <SelectTrigger id="tratamientoRealizado" data-testid="select-tratamiento">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no_realizado">(Aún no realizado)</SelectItem>
                    <SelectItem value="recubrimiento">Recubrimiento / Protección pulpar</SelectItem>
                    <SelectItem value="pulpotomia_vital">Pulpotomía vital</SelectItem>
                    <SelectItem value="rct">Endodoncia completa (RCT)</SelectItem>
                    <SelectItem value="otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="notas">Notas clínicas</Label>
                <Textarea
                  id="notas"
                  data-testid="input-notas"
                  value={form.notas}
                  onChange={(e) => handleChange("notas", e.target.value)}
                  placeholder="Ej. molestia nocturna, analgésicos previos, restauración previa..."
                  rows={3}
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label className="flex items-center gap-2">
                  <Image className="w-4 h-4" />
                  Radiografía Baseline (opcional)
                </Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 hover:border-primary/50 transition-colors">
                  {radiografiaPreview ? (
                    <div className="relative">
                      <img 
                        src={radiografiaPreview} 
                        alt="Preview radiografía" 
                        className="max-h-48 mx-auto rounded-lg object-contain"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8"
                        onClick={removeRadiografia}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <div className="mt-3 flex items-center justify-center gap-2">
                        <Label className="text-sm">Tipo:</Label>
                        <Select
                          value={tipoRadiografia}
                          onValueChange={(value: 'periapical' | 'cbct') => setTipoRadiografia(value)}
                        >
                          <SelectTrigger className="w-32 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="periapical">Periapical</SelectItem>
                            <SelectItem value="cbct">CBCT</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ) : (
                    <div 
                      className="flex flex-col items-center justify-center cursor-pointer py-4"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground text-center">
                        Haz clic para subir radiografía periapical o CBCT
                      </p>
                      <p className="text-xs text-muted-foreground/70 mt-1">
                        La IA analizará automáticamente PAI y lesión
                      </p>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="clinicoNombre">Clínico responsable</Label>
                <Input
                  id="clinicoNombre"
                  data-testid="input-clinico-nombre"
                  value={form.clinicoNombre}
                  readOnly
                  className="bg-muted"
                  placeholder="Dr./Dra. Apellido"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clinicoEmail">Email clínico</Label>
                <Input
                  id="clinicoEmail"
                  data-testid="input-clinico-email"
                  type="email"
                  value={form.clinicoEmail}
                  readOnly
                  className="bg-muted"
                  placeholder="nombre@hospital.es"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={enviando}
              className="w-full gap-2"
              data-testid="button-submit"
            >
              {enviando ? (
                <>Guardando...</>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Guardar y calcular IA
                </>
              )}
            </Button>
          </form>

          {estadoEnvio && (
            <Alert className="mt-4" data-testid="alert-status">
              {estadoEnvio.tipo === "success" ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              <AlertDescription>{estadoEnvio.mensaje}</AlertDescription>
            </Alert>
          )}

          {iaResult && (
            <div className="mt-6 space-y-4">
              <Card className="border-l-4 border-l-primary" data-testid="card-ia-result">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    Sugerencia de Apoyo por IA
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Sugerencia preliminar basada en los datos clínicos ingresados
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Clasificación pulpar sugerida</p>
                    <Badge variant="secondary" className="mt-1">
                      {iaResult.pulpalDxIA}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Estado apical sugerido</p>
                    <Badge variant="secondary" className="mt-1">
                      {iaResult.apicalDxIA}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Orientación terapéutica</p>
                    <p className="text-sm mt-1">{iaResult.ttoPropuestoIA}</p>
                  </div>
                  <Alert variant="default" className="border-amber-500 bg-amber-50 dark:bg-amber-950">
                    <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <AlertDescription className="text-xs text-amber-800 dark:text-amber-200">
                      <strong>Recordatorio:</strong> Esta es una sugerencia de apoyo. La decisión diagnóstica y terapéutica final debe basarse en su criterio clínico profesional, exploración completa del paciente y será validada por el tutor.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-blue-500" data-testid="card-recomendaciones">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    📚 Recomendaciones Clínicas (Biblioteca ENDOIA)
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Guía basada en protocolos AAE/ESE 2025, IADT y ADA/AAE 2024
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Nivel de urgencia */}
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">
                      {iaResult.recomendaciones.urgencia === 'baja' && '🟢'}
                      {iaResult.recomendaciones.urgencia === 'media' && '🟡'}
                      {iaResult.recomendaciones.urgencia === 'alta' && '🔴'}
                      {iaResult.recomendaciones.urgencia === 'critica' && '🚨'}
                    </span>
                    <div>
                      <p className="text-sm font-medium">Nivel de urgencia</p>
                      <Badge variant={
                        iaResult.recomendaciones.urgencia === 'critica' ? 'destructive' :
                        iaResult.recomendaciones.urgencia === 'alta' ? 'destructive' :
                        iaResult.recomendaciones.urgencia === 'media' ? 'default' : 'secondary'
                      }>
                        {iaResult.recomendaciones.urgencia.toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  {/* Plan de actuación */}
                  <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-md border border-blue-200 dark:border-blue-800">
                    <p className="text-sm font-medium mb-1 flex items-center gap-1">
                      📋 Plan de actuación
                    </p>
                    <p className="text-sm text-muted-foreground">{iaResult.recomendaciones.planActuacion}</p>
                  </div>

                  {/* Analgesia */}
                  <div className="p-3 bg-green-50 dark:bg-green-950 rounded-md border border-green-200 dark:border-green-800">
                    <p className="text-sm font-medium mb-1 flex items-center gap-1">
                      💊 Manejo analgésico
                    </p>
                    <p className="text-sm text-muted-foreground">{iaResult.recomendaciones.analgesia}</p>
                  </div>

                  {/* Antibiótico */}
                  <div className={`p-3 rounded-md border ${
                    iaResult.recomendaciones.antibiotico 
                      ? 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800'
                      : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800'
                  }`}>
                    <p className="text-sm font-medium mb-1 flex items-center gap-1">
                      🦠 Antibiótico
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {iaResult.recomendaciones.antibiotico 
                        ? '✔ SÍ indicado según criterios ADA/AAE 2024' 
                        : '❌ NO indicado'}
                    </p>
                  </div>

                  {/* Notas adicionales */}
                  {iaResult.recomendaciones.notasAdicionales.length > 0 && (
                    <div className="p-3 bg-amber-50 dark:bg-amber-950 rounded-md border border-amber-200 dark:border-amber-800">
                      <p className="text-sm font-medium mb-2 flex items-center gap-1">
                        📌 Notas clínicas importantes
                      </p>
                      <ul className="space-y-1 text-xs text-muted-foreground">
                        {iaResult.recomendaciones.notasAdicionales.map((nota, idx) => (
                          <li key={idx} className="flex gap-2">
                            <span className="text-amber-600 dark:text-amber-400">•</span>
                            <span>{nota}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <Alert className="border-blue-500 bg-blue-50 dark:bg-blue-950">
                    <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <AlertDescription className="text-xs text-blue-800 dark:text-blue-200">
                      Estas recomendaciones están basadas en protocolos oficiales (AAE/ESE 2025, IADT, ADA) de la Biblioteca Clínica ENDOIA y sirven como guía de apoyo al profesional.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
