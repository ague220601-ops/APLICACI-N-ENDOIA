import { useEffect, useState } from 'react';
import { useAuth } from '@/auth/AuthContext';
import { obtenerMisCasos, actualizarControl, actualizarTratamiento } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Loader2, 
  FileText, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  TrendingUp,
  Eye,
  Calendar,
  Pill,
  Activity,
  AlertCircle,
  Stethoscope,
  Edit,
  Save,
  Image
} from 'lucide-react';
import { SubirRadiografia, ListaRadiografias } from '@/components/radiographs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  EnhancedStats,
  SeguimientosPendientes,
  HistorialDientes,
  CasosComplejos,
  CalidadRegistros,
  FailedTeethRanking,
  PersonalStats,
  EnhancedDiagnosisBadges,
  FDIHeatmap,
  CasosPorDienteModal,
  ClinicoCase
} from '@/components/clinico';

interface CasoData {
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
  vision_PAI_baseline?: number | string;
  vision_PAI_followup?: number | string;
  vision_lesion_diam_mm_baseline?: number | string;
  vision_lesion_diam_mm_followup?: number | string;
  vision_radiolucency_detected?: boolean;
  IA_flags?: string[];
}

function toNumber(value: number | string | null | undefined): number {
  if (value === null || value === undefined || value === '') return 0;
  if (typeof value === 'number') return value;
  const parsed = Number(value);
  return isNaN(parsed) ? 0 : parsed;
}

function calcularDiasHastaControl(caso: CasoData): { dias: number; controlTipo: string; vencido: boolean } | null {
  if (!caso.fecha_tto || caso.fecha_tto.trim() === '') {
    return null;
  }

  const fechaTratamiento = new Date(caso.fecha_tto);
  const ahora = new Date();
  
  const control1mRealizado = toNumber(caso.control_1m_exito) === 1 || (caso.fecha_control_1m && caso.fecha_control_1m.trim() !== '');
  const control3mRealizado = toNumber(caso.control_3m_exito) === 1 || (caso.fecha_control_3m && caso.fecha_control_3m.trim() !== '');
  const control6mRealizado = toNumber(caso.control_6m_exito) === 1 || (caso.fecha_control_6m && caso.fecha_control_6m.trim() !== '');

  if (!control1mRealizado) {
    const fecha1m = new Date(fechaTratamiento);
    fecha1m.setMonth(fecha1m.getMonth() + 1);
    const dias = Math.ceil((fecha1m.getTime() - ahora.getTime()) / (1000 * 60 * 60 * 24));
    return { dias, controlTipo: '1 mes', vencido: dias < 0 };
  }
  
  if (!control3mRealizado) {
    const fecha3m = new Date(fechaTratamiento);
    fecha3m.setMonth(fecha3m.getMonth() + 3);
    const dias = Math.ceil((fecha3m.getTime() - ahora.getTime()) / (1000 * 60 * 60 * 24));
    return { dias, controlTipo: '3 meses', vencido: dias < 0 };
  }
  
  if (!control6mRealizado) {
    const fecha6m = new Date(fechaTratamiento);
    fecha6m.setMonth(fecha6m.getMonth() + 6);
    const dias = Math.ceil((fecha6m.getTime() - ahora.getTime()) / (1000 * 60 * 60 * 24));
    return { dias, controlTipo: '6 meses', vencido: dias < 0 };
  }
  
  return null;
}

function ordenarCasosPorProximidad(casos: CasoData[]): CasoData[] {
  return [...casos].sort((a, b) => {
    const proximidadA = calcularDiasHastaControl(a);
    const proximidadB = calcularDiasHastaControl(b);
    
    if (!proximidadA && !proximidadB) return 0;
    if (!proximidadA) return 1;
    if (!proximidadB) return -1;
    
    if (proximidadA.vencido && !proximidadB.vencido) return -1;
    if (!proximidadA.vencido && proximidadB.vencido) return 1;
    
    return proximidadA.dias - proximidadB.dias;
  });
}

function getPulparColor(diagnosis: string): string {
  if (!diagnosis) return 'bg-gray-100 text-gray-700 border-gray-300';
  const lower = diagnosis.toLowerCase();
  
  if (lower.includes('normal') || lower.includes('clinically normal')) {
    return 'bg-green-100 text-green-800 border-green-300';
  }
  if (lower.includes('reversible') || lower.includes('mild') || lower.includes('hypersensitive')) {
    return 'bg-blue-100 text-blue-800 border-blue-300';
  }
  if (lower.includes('sintomática') || lower.includes('symptomatic') || lower.includes('severe')) {
    return 'bg-orange-100 text-orange-800 border-orange-300';
  }
  if (lower.includes('necrótica') || lower.includes('necrosis') || lower.includes('pulp necrosis')) {
    return 'bg-red-100 text-red-800 border-red-300';
  }
  return 'bg-gray-100 text-gray-700 border-gray-300';
}

function getApicalColor(diagnosis: string): string {
  if (!diagnosis) return 'bg-gray-100 text-gray-700 border-gray-300';
  const lower = diagnosis.toLowerCase();
  
  if (lower.includes('normal') || lower.includes('sin alteración') || lower.includes('clinically normal')) {
    return 'bg-green-100 text-green-800 border-green-300';
  }
  if (lower.includes('sintomática') || lower.includes('symptomatic')) {
    return 'bg-red-100 text-red-800 border-red-300';
  }
  if (lower.includes('asintomática') || lower.includes('asymptomatic') || lower.includes('localized')) {
    return 'bg-orange-100 text-orange-800 border-orange-300';
  }
  if (lower.includes('sinus') || lower.includes('tract') || lower.includes('fístula')) {
    return 'bg-purple-100 text-purple-800 border-purple-300';
  }
  if (lower.includes('systemic') || lower.includes('sistémico')) {
    return 'bg-red-200 text-red-900 border-red-400';
  }
  return 'bg-blue-100 text-blue-700 border-blue-300';
}


interface CaseModalProps {
  caso: CasoData | null;
  onClose: () => void;
  onActualizar: () => void;
}

function CaseModal({ caso, onClose, onActualizar }: CaseModalProps) {
  const [guardando, setGuardando] = useState(false);
  const [tipoControl, setTipoControl] = useState<'1m' | '3m' | '6m'>('1m');
  const [exitoClinico, setExitoClinico] = useState<'si' | 'no'>('si');
  const [exitoRadiologico, setExitoRadiologico] = useState<'si' | 'parcial' | 'no'>('si');
  const [radiologicoBloqueado, setRadiologicoBloqueado] = useState(false);
  const [notas, setNotas] = useState('');
  const [refreshRx, setRefreshRx] = useState(0);
  
  // Estados para actualizar tratamiento
  const [ttoRealizado, setTtoRealizado] = useState('');
  const [fechaTto, setFechaTto] = useState('');

  // Sincronizar estados del tratamiento cuando cambia el caso
  useEffect(() => {
    if (caso) {
      setTtoRealizado(caso.tto_realizado || '');
      setFechaTto(caso.fecha_tto || '');
      
      // Calcular automáticamente éxito radiológico si hay RX baseline y followup
      const hayRxControl = caso.vision_PAI_baseline && caso.vision_PAI_followup;
      
      if (hayRxControl) {
        const paiBase = Number(caso.vision_PAI_baseline);
        const paiFollow = Number(caso.vision_PAI_followup);
        const diamBase = Number(caso.vision_lesion_diam_mm_baseline) || 0;
        const diamFollow = Number(caso.vision_lesion_diam_mm_followup) || 0;
        
        let resultado: 'si' | 'parcial' | 'no' = 'si';
        
        if (paiFollow < paiBase) {
          resultado = (paiFollow <= 2 && diamFollow <= 1) ? 'si' : 'parcial';
        } else if (paiFollow > paiBase) {
          resultado = 'no';
        } else if (diamBase > 0 && diamFollow > 0) {
          const reduccion = (diamBase - diamFollow) / diamBase;
          if (reduccion >= 0.3) resultado = 'si';
          else if (reduccion > 0) resultado = 'parcial';
          else if (diamFollow > diamBase) resultado = 'no';
        }
        
        setExitoRadiologico(resultado);
        setRadiologicoBloqueado(true);
      } else {
        setRadiologicoBloqueado(false);
      }
    }
  }, [caso]);

  if (!caso) return null;

  const handleActualizarTratamiento = async () => {
    if (!caso.case_id) return;

    if (!ttoRealizado.trim() && !fechaTto.trim()) {
      alert('⚠️ Debes completar al menos uno de los campos (tratamiento o fecha).');
      return;
    }

    setGuardando(true);
    try {
      await actualizarTratamiento({
        case_id: caso.case_id,
        tto_realizado: ttoRealizado.trim(),
        fecha_tto: fechaTto.trim()
      });
      
      onActualizar();
      alert('✓ Tratamiento actualizado exitosamente');
    } catch (error) {
      console.error('Error al actualizar tratamiento:', error);
      alert('Error al actualizar el tratamiento. Inténtalo de nuevo.');
    } finally {
      setGuardando(false);
    }
  };

  const handleActualizarControl = async () => {
    if (!caso.case_id) return;
    
    if (!caso.fecha_tto || caso.fecha_tto.trim() === '') {
      alert('⚠️ No se puede actualizar el control: este caso no tiene un tratamiento registrado.');
      return;
    }

    setGuardando(true);
    try {
      await actualizarControl({
        case_id: caso.case_id,
        tipo_control: tipoControl,
        exito_clinico: exitoClinico === 'si',
        exito_radiologico: exitoRadiologico,
        notas: notas.trim()
      });
      
      setNotas('');
      setExitoClinico('si');
      setExitoRadiologico('si');
      onActualizar();
      alert('✓ Control actualizado exitosamente');
    } catch (error) {
      console.error('Error al actualizar control:', error);
      alert('Error al actualizar el control. Inténtalo de nuevo.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Dialog open={!!caso} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Stethoscope className="w-5 h-5" />
            Caso: {caso.case_id}
          </DialogTitle>
          <DialogDescription>
            Ver detalles y actualizar controles de seguimiento
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="detalles" className="mt-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="detalles">
              <Eye className="w-4 h-4 mr-2" />
              Detalles
            </TabsTrigger>
            <TabsTrigger value="radiografias">
              <Image className="w-4 h-4 mr-2" />
              Radiografías
            </TabsTrigger>
            <TabsTrigger value="tratamiento">
              <Pill className="w-4 h-4 mr-2" />
              Tratamiento
            </TabsTrigger>
            <TabsTrigger value="actualizar" disabled={!caso.fecha_tto || caso.fecha_tto.trim() === ''}>
              <Edit className="w-4 h-4 mr-2" />
              Controles
            </TabsTrigger>
          </TabsList>

          <TabsContent value="detalles" className="space-y-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-sm text-muted-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Información General
              </h3>
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <p className="text-sm"><span className="font-medium">ID:</span> {caso.case_id}</p>
                <p className="text-sm"><span className="font-medium">Diente FDI:</span> {caso.tooth_fdi}</p>
                <p className="text-sm"><span className="font-medium">Fecha registro:</span> {caso.registro_fecha || caso.date || 'N/A'}</p>
                <p className="text-sm"><span className="font-medium">Email clínico:</span> {caso.clinicoEmail}</p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-sm text-muted-foreground flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Signos Clínicos
              </h3>
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Dolor espontáneo:</span> {toNumber(caso.spontaneous_pain_yesno) === 1 ? '✓ Sí' : '✗ No'}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Respuesta al frío:</span> {
                    toNumber(caso.thermal_cold_response) === 0 ? 'No responde' : 
                    toNumber(caso.thermal_cold_response) === 2 ? 'Aumentada' : 'Normal'
                  }
                </p>
                <p className="text-sm">
                  <span className="font-medium">Dolor persistente:</span> {toNumber(caso.lingering_pain_seconds)} seg
                </p>
                <p className="text-sm">
                  <span className="font-medium">Percusión dolorosa:</span> {caso.percussion_pain_yesno || 'N/A'}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Palpación apical:</span> {caso.apical_palpation_pain || 'N/A'}
                </p>
                {caso.sinus_tract_present && (
                  <p className="text-sm">
                    <span className="font-medium">Tracto sinusal:</span> {caso.sinus_tract_present}
                  </p>
                )}
                {caso.systemic_involvement && (
                  <p className="text-sm">
                    <span className="font-medium">Compromiso sistémico:</span> {caso.systemic_involvement}
                  </p>
                )}
                {caso.previous_treatment && (
                  <p className="text-sm">
                    <span className="font-medium">Tratamiento previo:</span> {caso.previous_treatment}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-sm text-muted-foreground flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Hallazgos Radiográficos
              </h3>
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <p className="text-sm">
                  <span className="font-medium">PAI (1-5):</span> {caso.periapical_index_PAI_1_5}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Radiolucidez:</span> {toNumber(caso.radiolucency_yesno) === 1 ? '✓ Sí' : '✗ No'}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Ensanchamiento PDL:</span> {caso.pdl_widening}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Profundidad caries:</span> {caso.depth_of_caries || 'N/A'}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Sondaje (mm):</span> {caso.probing_max_depth_mm || 'N/A'}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Control de sangrado:</span> {caso.bleeding_control_possible || 'N/A'}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-sm text-muted-foreground flex items-center gap-2">
                <Pill className="w-4 h-4" />
                Diagnóstico IA (AAE/ESE 2025)
              </h3>
              <EnhancedDiagnosisBadges caso={caso} />
            </div>
          </div>

          {/* BLOQUE DE IA RADIOLÓGICA */}
          <div className="bg-blue-50 p-4 rounded-lg mt-6 border border-blue-200">
            <h3 className="text-blue-900 font-semibold mb-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Análisis Radiográfico IA (Vision GPT)
            </h3>
            <div className="space-y-2 text-sm">
              <p><strong>PAI inicial (IA):</strong> {caso.vision_PAI_baseline ?? "No disponible"}</p>
              <p><strong>PAI seguimiento (IA):</strong> {caso.vision_PAI_followup ?? "No disponible"}</p>
              <p><strong>Radiolucidez detectada:</strong> {caso.vision_radiolucency_detected ? "Sí" : "No"}</p>
              <p>
                <strong>Diámetro lesión (baseline):</strong>{" "}
                {caso.vision_lesion_diam_mm_baseline ? `${caso.vision_lesion_diam_mm_baseline} mm` : "No disponible"}
              </p>
              <p>
                <strong>Diámetro lesión (follow-up):</strong>{" "}
                {caso.vision_lesion_diam_mm_followup ? `${caso.vision_lesion_diam_mm_followup} mm` : "No disponible"}
              </p>
              {caso.IA_flags && caso.IA_flags.length > 0 && (
                <div className="mt-3 pt-3 border-t border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">Alertas IA</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {caso.IA_flags.map((flag, idx) => (
                      <li key={idx} className="text-blue-700">{flag}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* BLOQUE DE COHERENCIA CLÍNICO – IA */}
          <div className="bg-orange-50 p-4 rounded-lg mt-5 border border-orange-200">
            <h3 className="text-orange-800 font-semibold mb-3">
              Coherencia Clínico – IA
            </h3>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Radiolucidez (Clínico):</strong>{" "}
                {caso.radiolucency_yesno === "si" || caso.radiolucency_yesno === "1" || toNumber(caso.radiolucency_yesno) === 1 ? "Sí" : "No"}
              </p>
              <p>
                <strong>Radiolucidez (IA):</strong>{" "}
                {caso.vision_radiolucency_detected ? "Sí" : "No"}
              </p>
              <p className="mt-2 pt-2 border-t border-orange-200">
                <strong>Interpretación final:</strong>{" "}
                {caso.vision_radiolucency_detected
                  ? "Radiolucidez presente (confirmada por IA)"
                  : (caso.radiolucency_yesno === "si" || caso.radiolucency_yesno === "1" || toNumber(caso.radiolucency_yesno) === 1)
                    ? "Radiolucidez presente (identificada por el clínico)"
                    : "No se detecta radiolucidez"}
              </p>
              {(caso.vision_radiolucency_detected &&
                (caso.radiolucency_yesno === "no" ||
                 caso.radiolucency_yesno === "0" ||
                 toNumber(caso.radiolucency_yesno) === 0)) && (
                <p className="text-orange-700 mt-3 p-2 bg-orange-100 rounded">
                  <strong>Aviso:</strong> Se detecta discrepancia entre el clínico y la IA.
                  La interpretación final prioriza la detección de IA por seguridad diagnóstica.
                </p>
              )}
            </div>
          </div>

          {caso.notes && (
            <div className="space-y-2">
              <h3 className="font-semibold text-sm text-muted-foreground">Notas Clínicas</h3>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm">{caso.notes}</p>
              </div>
            </div>
          )}

          {caso.tto_realizado && (
            <div className="space-y-2">
              <h3 className="font-semibold text-sm text-muted-foreground">Tratamiento Realizado</h3>
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <p className="text-sm font-medium">{caso.tto_realizado}</p>
                {caso.fecha_tto && (
                  <p className="text-xs text-muted-foreground mt-1">Fecha: {caso.fecha_tto}</p>
                )}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-muted-foreground">Controles de Seguimiento</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className={`p-3 rounded-lg border ${toNumber(caso.control_1m_exito) === 1 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                <p className="text-xs font-medium">Control 1 mes</p>
                <p className="text-lg font-bold">{toNumber(caso.control_1m_exito) === 1 ? '✓ Éxito' : '—'}</p>
                {caso.fecha_control_1m && <p className="text-xs text-muted-foreground">{caso.fecha_control_1m}</p>}
              </div>
              <div className={`p-3 rounded-lg border ${toNumber(caso.control_3m_exito) === 1 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                <p className="text-xs font-medium">Control 3 meses</p>
                <p className="text-lg font-bold">{toNumber(caso.control_3m_exito) === 1 ? '✓ Éxito' : '—'}</p>
                {caso.fecha_control_3m && <p className="text-xs text-muted-foreground">{caso.fecha_control_3m}</p>}
              </div>
              <div className={`p-3 rounded-lg border ${toNumber(caso.control_6m_exito) === 1 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                <p className="text-xs font-medium">Control 6 meses</p>
                <p className="text-lg font-bold">{toNumber(caso.control_6m_exito) === 1 ? '✓ Éxito' : '—'}</p>
                {caso.fecha_control_6m && <p className="text-xs text-muted-foreground">{caso.fecha_control_6m}</p>}
              </div>
            </div>
          </div>

          {(caso.AEDE_pulpar_FINAL || caso.AEDE_pulpar_JEN || caso.AEDE_pulpar_SEG || caso.AEDE_pulpar_INV) && (
            <div className="space-y-2">
              <h3 className="font-semibold text-sm text-muted-foreground">Validación por Expertos</h3>
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg space-y-3">
                {caso.AEDE_pulpar_FINAL && (
                  <div>
                    <p className="text-xs font-medium text-green-700 mb-2">✓ Diagnóstico Final Validado</p>
                    <div className="space-y-1">
                      <div>
                        <span className="text-xs text-muted-foreground">Pulpar:</span>
                        <Badge className={`ml-2 ${getPulparColor(caso.AEDE_pulpar_FINAL)} border text-xs`}>
                          {caso.AEDE_pulpar_FINAL}
                        </Badge>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Apical:</span>
                        <Badge className={`ml-2 ${getApicalColor(caso.AEDE_apical_FINAL)} border text-xs`}>
                          {caso.AEDE_apical_FINAL}
                        </Badge>
                      </div>
                    </div>
                    {caso.validado_FINAL && (
                      <p className="text-xs text-green-600 mt-2">Fecha: {caso.validado_FINAL}</p>
                    )}
                  </div>
                )}
                
                {(caso.AEDE_pulpar_JEN || caso.AEDE_pulpar_SEG || caso.AEDE_pulpar_INV) && (
                  <div className="pt-3 border-t border-green-200">
                    <p className="text-xs font-medium text-green-700 mb-2">Validaciones Individuales:</p>
                    <div className="space-y-2">
                      {caso.AEDE_pulpar_JEN && (
                        <div className="text-xs">
                          <p className="font-medium">Validador JEN:</p>
                          <p className="text-muted-foreground">Pulpar: {caso.AEDE_pulpar_JEN} | Apical: {caso.AEDE_apical_JEN}</p>
                          {caso.validado_JEN && <p className="text-green-600">✓ {caso.validado_JEN}</p>}
                        </div>
                      )}
                      {caso.AEDE_pulpar_SEG && (
                        <div className="text-xs">
                          <p className="font-medium">Validador SEG:</p>
                          <p className="text-muted-foreground">Pulpar: {caso.AEDE_pulpar_SEG} | Apical: {caso.AEDE_apical_SEG}</p>
                          {caso.validado_SEG && <p className="text-green-600">✓ {caso.validado_SEG}</p>}
                        </div>
                      )}
                      {caso.AEDE_pulpar_INV && (
                        <div className="text-xs">
                          <p className="font-medium">Validador INV:</p>
                          <p className="text-muted-foreground">Pulpar: {caso.AEDE_pulpar_INV} | Apical: {caso.AEDE_apical_INV}</p>
                          {caso.validado_INV && <p className="text-green-600">✓ {caso.validado_INV}</p>}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          </TabsContent>

          <TabsContent value="radiografias" className="space-y-4 mt-4">
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <p className="text-sm font-medium text-blue-900 mb-1">Gestión de Radiografías</p>
              <p className="text-xs text-blue-700">
                Sube radiografías periapicales o CBCT. La IA analizará automáticamente el índice PAI y el diámetro de lesión.
              </p>
            </div>

            <SubirRadiografia 
              caseId={caso.case_id} 
              onUploadSuccess={() => {
                setRefreshRx(prev => prev + 1);
                onActualizar();
              }}
            />

            <div className="mt-6">
              <h3 className="font-semibold mb-3">Galería de radiografías</h3>
              <ListaRadiografias 
                caseId={caso.case_id} 
                refreshTrigger={refreshRx}
                showComparison={true}
              />
            </div>
          </TabsContent>

          <TabsContent value="tratamiento" className="space-y-4 mt-4">
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <p className="text-sm font-medium text-blue-900 mb-2">📝 Registrar o actualizar tratamiento realizado</p>
              <p className="text-xs text-blue-700">
                Completa la información del tratamiento endodóntico realizado. Esta información es necesaria para poder registrar controles de seguimiento.
              </p>
            </div>

            <div className="space-y-4 border rounded-lg p-4">
              <div className="space-y-2">
                <Label htmlFor="tto-realizado" className="font-semibold">
                  Tratamiento Realizado <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="tto-realizado"
                  placeholder="Ej: Endodoncia completa en diente 47. Obturación con gutapercha mediante técnica de condensación lateral. Sellado con resina compuesta..."
                  value={ttoRealizado}
                  onChange={(e) => setTtoRealizado(e.target.value)}
                  rows={6}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  Describe el procedimiento endodóntico realizado, técnicas utilizadas y materiales empleados.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fecha-tto" className="font-semibold">
                  Fecha del Tratamiento <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="fecha-tto"
                  type="date"
                  value={fechaTto}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFechaTto(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                />
                <p className="text-xs text-muted-foreground">
                  Fecha en que se completó el tratamiento endodóntico
                </p>
              </div>

              <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg">
                <p className="text-xs text-amber-800">
                  <strong>Importante:</strong> Una vez registrada la fecha de tratamiento, podrás actualizar los controles de seguimiento en 1m, 3m y 6m.
                </p>
              </div>

              <Button 
                onClick={handleActualizarTratamiento} 
                disabled={guardando}
                className="w-full"
              >
                {guardando ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Guardar Tratamiento
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="actualizar" className="space-y-4 mt-4">
            {!caso.fecha_tto ? (
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <p className="text-sm text-yellow-800">
                  ⚠️ Este caso aún no tiene un tratamiento registrado. Completa el tratamiento antes de registrar controles de seguimiento.
                </p>
              </div>
            ) : (
              <>
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg space-y-2">
                  <p className="text-sm font-medium text-blue-900">Tratamiento realizado:</p>
                  <p className="text-sm text-blue-800">{caso.tto_realizado}</p>
                  <p className="text-xs text-blue-600">Fecha: {caso.fecha_tto}</p>
                </div>

                <div className="space-y-4 border rounded-lg p-4">
                  <div className="space-y-2">
                    <Label htmlFor="tipo-control" className="font-semibold">
                      Tipo de control a registrar
                    </Label>
                    <Select value={tipoControl} onValueChange={(v) => setTipoControl(v as '1m' | '3m' | '6m')}>
                      <SelectTrigger id="tipo-control">
                        <SelectValue placeholder="Selecciona el control" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1m">Control 1 mes {toNumber(caso.control_1m_exito) === 1 && '(✓ Ya registrado)'}</SelectItem>
                        <SelectItem value="3m">Control 3 meses {toNumber(caso.control_3m_exito) === 1 && '(✓ Ya registrado)'}</SelectItem>
                        <SelectItem value="6m">Control 6 meses {toNumber(caso.control_6m_exito) === 1 && '(✓ Ya registrado)'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="exito-clinico" className="font-semibold">
                        Éxito Clínico
                      </Label>
                      <Select value={exitoClinico} onValueChange={(v) => setExitoClinico(v as 'si' | 'no')}>
                        <SelectTrigger id="exito-clinico">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="si">✔ Sí – Sin síntomas</SelectItem>
                          <SelectItem value="no">✖ No – Síntomas presentes</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-gray-500 mt-1">
                        Paciente sin dolor, sin sensibilidad, sin fístula ni inflamación.
                        Ausencia total de signos o síntomas clínicos periapicales.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="exito-radiologico" className="font-semibold flex items-center gap-2">
                        Éxito Radiológico
                        {radiologicoBloqueado && (
                          <span className="text-xs font-normal bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                            Calculado por IA
                          </span>
                        )}
                      </Label>
                      <Select 
                        value={exitoRadiologico} 
                        onValueChange={(v) => setExitoRadiologico(v as 'si' | 'parcial' | 'no')}
                        disabled={radiologicoBloqueado}
                      >
                        <SelectTrigger id="exito-radiologico" className={radiologicoBloqueado ? 'opacity-70' : ''}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="si">✔ Sí – Curación / reducción</SelectItem>
                          <SelectItem value="parcial">☆ Parcial – Mejoría incompleta</SelectItem>
                          <SelectItem value="no">✖ No – Persistencia / empeoramiento</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-gray-500 mt-1">
                        Éxito radiográfico = reducción de lesión o PAI.<br />
                        Fracaso = lesión igual o mayor.
                      </p>
                      {radiologicoBloqueado && (
                        <p className="text-xs text-blue-600 mt-1">
                          Valor calculado automáticamente según PAI baseline ({caso.vision_PAI_baseline}) → followup ({caso.vision_PAI_followup})
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notas-control" className="font-semibold">
                      Notas del control (opcional)
                    </Label>
                    <Textarea
                      id="notas-control"
                      placeholder="Observaciones clínicas o radiológicas adicionales..."
                      value={notas}
                      onChange={(e) => setNotas(e.target.value)}
                      rows={4}
                      className="resize-none"
                    />
                  </div>

                  <Button 
                    onClick={handleActualizarControl} 
                    disabled={guardando || !caso.fecha_tto || caso.fecha_tto.trim() === ''}
                    className="w-full gap-2"
                  >
                    {guardando ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Guardar Control de Seguimiento
                      </>
                    )}
                  </Button>
                </div>

                <div className="space-y-2 bg-muted p-4 rounded-lg">
                  <h4 className="text-sm font-semibold">Estado actual de controles:</h4>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className={toNumber(caso.control_1m_exito) === 1 ? 'text-green-600' : 'text-gray-500'}>
                      1m: {toNumber(caso.control_1m_exito) === 1 ? '✓' : '—'} {caso.fecha_control_1m && `(${caso.fecha_control_1m})`}
                    </div>
                    <div className={toNumber(caso.control_3m_exito) === 1 ? 'text-green-600' : 'text-gray-500'}>
                      3m: {toNumber(caso.control_3m_exito) === 1 ? '✓' : '—'} {caso.fecha_control_3m && `(${caso.fecha_control_3m})`}
                    </div>
                    <div className={toNumber(caso.control_6m_exito) === 1 ? 'text-green-600' : 'text-gray-500'}>
                      6m: {toNumber(caso.control_6m_exito) === 1 ? '✓' : '—'} {caso.fecha_control_6m && `(${caso.fecha_control_6m})`}
                    </div>
                  </div>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

interface TablaProps {
  casos: CasoData[];
  onVerDetalle: (caso: CasoData) => void;
}

function ClinicoTabla({ casos, onVerDetalle }: TablaProps) {
  if (casos.length === 0) {
    return (
      <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl rounded-xl shadow-lg shadow-black/10 p-12 text-center">
        <FileText className="w-16 h-16 mx-auto mb-4" style={{ color: '#A6A6A6' }} />
        <h3 className="text-xl font-semibold tracking-tight mb-2">No hay casos registrados</h3>
        <p className="text-zinc-400 max-w-sm mx-auto">
          Aún no has registrado ningún caso clínico. Ve a "Registrar caso" para comenzar.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="hidden md:block">
        <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl rounded-xl shadow-lg shadow-black/10 overflow-hidden">
          <div className="p-6 pb-4">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-5 h-5" style={{ color: '#3A7AFE' }} />
              <h3 className="text-lg font-semibold tracking-tight">Casos Registrados ({casos.length})</h3>
            </div>
            <p className="text-sm text-zinc-400">
              Listado completo de tus casos con diagnósticos IA
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-t border-b border-zinc-200/50 dark:border-zinc-700/50 bg-zinc-50/50 dark:bg-zinc-800/50">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-500 tracking-wide">ID de Caso</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-500 tracking-wide">Diente</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-500 tracking-wide">Diagnóstico Pulpar IA</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-500 tracking-wide">Diagnóstico Apical IA</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-500 tracking-wide">Tto. Propuesto</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-500 tracking-wide">Estado</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-500 tracking-wide">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {casos.map((caso, idx) => (
                  <tr 
                    key={`${caso.case_id}-${caso.row_number}`} 
                    className="border-b border-zinc-200/30 dark:border-zinc-700/30 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors"
                    style={{ backgroundColor: idx % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.015)' }}
                  >
                    <td className="px-6 py-5 font-mono text-xs text-zinc-500">{caso.case_id}</td>
                    <td className="px-6 py-5 font-semibold tracking-tight">{caso.tooth_fdi}</td>
                    <td className="px-6 py-5">
                      <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium" style={{ backgroundColor: 'rgba(58, 122, 254, 0.1)', color: '#3A7AFE' }}>
                        {caso.AEDE_pulpar_IA || 'Sin dx'}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium" style={{ backgroundColor: 'rgba(245, 166, 35, 0.1)', color: '#F5A623' }}>
                        {caso.AEDE_apical_IA || 'Sin dx'}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm max-w-[200px] truncate text-zinc-600 dark:text-zinc-400">
                      {caso.tto_propuesto || 'N/A'}
                    </td>
                    <td className="px-6 py-5">
                      {caso.AEDE_pulpar_FINAL ? (
                        <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium" style={{ backgroundColor: 'rgba(46, 204, 113, 0.1)', color: '#2ECC71' }}>
                          Validado
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium" style={{ backgroundColor: 'rgba(166, 166, 166, 0.1)', color: '#A6A6A6' }}>
                          Pendiente
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => onVerDetalle(caso)}
                        className="gap-2 text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      >
                        <Eye className="w-3 h-3" />
                        Ver
                      </Button>
                    </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      <div className="md:hidden space-y-4">
        <h3 className="text-lg font-semibold tracking-tight mb-4">Casos Registrados ({casos.length})</h3>
        {casos.map((caso) => (
          <div key={`${caso.case_id}-${caso.row_number}`} className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl rounded-xl shadow-lg shadow-black/10 p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="font-mono text-xs text-muted-foreground">{caso.case_id}</p>
                  <p className="text-lg font-bold">Diente {caso.tooth_fdi}</p>
                </div>
                {caso.AEDE_pulpar_FINAL ? (
                  <Badge variant="default" className="bg-green-600 text-white text-xs">
                    Validado
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-xs">
                    Pendiente
                  </Badge>
                )}
              </div>

              <div className="space-y-2">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Diagnóstico Pulpar:</p>
                  <Badge className={`${getPulparColor(caso.AEDE_pulpar_IA)} border text-xs`}>
                    {caso.AEDE_pulpar_IA || 'Sin diagnóstico'}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Diagnóstico Apical:</p>
                  <Badge className={`${getApicalColor(caso.AEDE_apical_IA)} border text-xs`}>
                    {caso.AEDE_apical_IA || 'Sin diagnóstico'}
                  </Badge>
                </div>
                {caso.tto_propuesto && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Tratamiento propuesto:</p>
                    <p className="text-sm">{caso.tto_propuesto}</p>
                  </div>
                )}
              </div>

            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onVerDetalle(caso)}
              className="w-full gap-2"
            >
              <Eye className="w-4 h-4" />
              Ver detalles completos
            </Button>
          </div>
        ))}
      </div>
    </>
  );
}

export default function MisCasos() {
  const { user } = useAuth();
  const [casos, setCasos] = useState<CasoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCase, setSelectedCase] = useState<CasoData | null>(null);
  const [followUpFilter, setFollowUpFilter] = useState<'1m' | '3m' | '6m' | null>(null);
  const [toothFilter, setToothFilter] = useState<string | null>(null);
  const [selectedFDI, setSelectedFDI] = useState<string | null>(null);
  const [pendientesFilter, setPendientesFilter] = useState<string | null>(null);

  async function cargarCasos() {
    if (!user) return;
    
    setRefreshing(true);
    const data = await obtenerMisCasos();
    const casosOrdenados = ordenarCasosPorProximidad(data);
    setCasos(casosOrdenados);
    setLoading(false);
    setRefreshing(false);
  }

  useEffect(() => {
    cargarCasos();
  }, [user]);

  const casosParaMostrar = casos.filter(caso => {
    // Filtro por diente específico
    if (toothFilter && String(caso.tooth_fdi) !== toothFilter) return false;
    
    // Filtro antiguo de follow-up (mantener compatibilidad)
    if (followUpFilter) {
      if (followUpFilter === '1m' && toNumber(caso.control_1m_exito) !== 0) return false;
      if (followUpFilter === '3m' && toNumber(caso.control_3m_exito) !== 0) return false;
      if (followUpFilter === '6m' && toNumber(caso.control_6m_exito) !== 0) return false;
    }
    
    // Nuevo filtro de pendientes (tarjetas clicables)
    if (pendientesFilter) {
      if (pendientesFilter === 'sin-tratamiento') {
        // Mostrar solo casos SIN tratamiento
        return !caso.fecha_tto || caso.fecha_tto.trim() === '';
      }
      
      if (pendientesFilter === '1m') {
        // Mostrar solo casos CON tratamiento Y control 1m pendiente
        return caso.fecha_tto && caso.fecha_tto.trim() !== '' && toNumber(caso.control_1m_exito) === 0;
      }
      
      if (pendientesFilter === '3m') {
        // Mostrar solo casos CON tratamiento Y control 3m pendiente
        return caso.fecha_tto && caso.fecha_tto.trim() !== '' && toNumber(caso.control_3m_exito) === 0;
      }
      
      if (pendientesFilter === '6m') {
        // Mostrar solo casos CON tratamiento Y control 6m pendiente
        return caso.fecha_tto && caso.fecha_tto.trim() !== '' && toNumber(caso.control_6m_exito) === 0;
      }
    }
    
    return true;
  });

  const handleFollowUpFilter = (tipo: '1m' | '3m' | '6m' | null) => {
    setFollowUpFilter(tipo);
    setToothFilter(null);
    setPendientesFilter(null);
  };

  const handleToothFilter = (fdi: string | null) => {
    setToothFilter(fdi);
    setFollowUpFilter(null);
    setPendientesFilter(null);
  };

  const handlePendientesFilter = (filterType: string | null) => {
    setPendientesFilter(filterType);
    setFollowUpFilter(null);
    setToothFilter(null);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-10 animate-in fade-in-0 duration-700">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Panel del Clínico</h1>
          <p className="text-zinc-400 mt-2 text-sm md:text-base">
            Dashboard de casos para {user?.email}
          </p>
        </div>
        <Button 
          onClick={cargarCasos} 
          disabled={refreshing}
          variant="outline"
          size="sm"
          className="gap-2 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border-zinc-200 dark:border-zinc-700 hover:bg-white dark:hover:bg-zinc-800 transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Actualizar
        </Button>
      </div>

      <EnhancedStats casos={casos as ClinicoCase[]} />

      <SeguimientosPendientes 
        casos={casos as ClinicoCase[]}
        activeFilter={pendientesFilter}
        onFilterClick={handlePendientesFilter}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CasosComplejos casos={casos as ClinicoCase[]} />
        <CalidadRegistros casos={casos as ClinicoCase[]} />
      </div>

      {(followUpFilter || toothFilter || pendientesFilter) && (
        <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl rounded-xl shadow-lg shadow-black/10 p-4 border-l-4" style={{ borderLeftColor: '#3A7AFE' }}>
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium" style={{ color: '#3A7AFE' }}>
              {followUpFilter && `Mostrando solo casos pendientes de control ${followUpFilter}`}
              {toothFilter && `Mostrando solo casos del diente FDI ${toothFilter}`}
              {pendientesFilter === 'sin-tratamiento' && 'Mostrando solo casos sin tratamiento registrado'}
              {pendientesFilter === '1m' && 'Mostrando solo casos con control de 1 mes pendiente'}
              {pendientesFilter === '3m' && 'Mostrando solo casos con control de 3 meses pendiente'}
              {pendientesFilter === '6m' && 'Mostrando solo casos con control de 6 meses pendiente'}
              {' '} ({casosParaMostrar.length} {casosParaMostrar.length === 1 ? 'caso' : 'casos'})
            </p>
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => {
                setFollowUpFilter(null);
                setToothFilter(null);
                setPendientesFilter(null);
              }}
              className="hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              Limpiar filtro
            </Button>
          </div>
        </div>
      )}
      
      <ClinicoTabla casos={casosParaMostrar} onVerDetalle={setSelectedCase} />

      <HistorialDientes 
        casos={casos as ClinicoCase[]} 
        onVerDetalle={setSelectedCase}
      />

      <PersonalStats casos={casos as ClinicoCase[]} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FailedTeethRanking casos={casos as ClinicoCase[]} />
        <div></div>
      </div>

      <FDIHeatmap 
        casos={casos as ClinicoCase[]} 
        onSelectFDI={setSelectedFDI}
      />
      
      <CaseModal 
        caso={selectedCase} 
        onClose={() => setSelectedCase(null)} 
        onActualizar={cargarCasos}
      />
      
      <CasosPorDienteModal
        fdi={selectedFDI}
        casos={casos as ClinicoCase[]}
        onClose={() => setSelectedFDI(null)}
        onVerDetalle={setSelectedCase}
      />
    </div>
  );
}
