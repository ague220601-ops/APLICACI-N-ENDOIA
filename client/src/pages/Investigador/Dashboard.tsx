import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  BarChart3, Download, FileSpreadsheet, Loader2, AlertCircle, 
  TrendingUp, Users, CheckCircle2, AlertTriangle, Activity 
} from "lucide-react";
import { useAuth } from "@/auth/AuthContext";
import { obtenerDatosInvestigacion, type CasoInvestigacion } from "@/lib/api-investigador";
import { OPCIONES_PULPAR, OPCIONES_APICAL } from "@/lib/classifications";
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

type ConfusionMatrix = Record<string, Record<string, number>>;

interface AgreementMetrics {
  agreement: number;
  kappa: number;
  confusion: ConfusionMatrix;
}

interface DiscrepancyRow {
  case_id: string;
  jen_p: string;
  seg_p: string;
  inv_p: string;
  final_p: string;
  ia_p: string;
  jen_a: string;
  seg_a: string;
  inv_a: string;
  final_a: string;
  ia_a: string;
}

function computeConfusionMatrix(observed: string[], predicted: string[]): ConfusionMatrix {
  const matrix: ConfusionMatrix = {};
  const categories = Array.from(new Set([...observed, ...predicted])).filter(Boolean);
  
  categories.forEach(cat => {
    matrix[cat] = {};
    categories.forEach(cat2 => {
      matrix[cat][cat2] = 0;
    });
  });
  
  for (let i = 0; i < observed.length; i++) {
    if (observed[i] && predicted[i]) {
      matrix[observed[i]][predicted[i]]++;
    }
  }
  
  return matrix;
}

function computeKappa(observed: string[], predicted: string[]): number {
  if (observed.length !== predicted.length || observed.length === 0) return 0;
  
  const n = observed.length;
  const categories = Array.from(new Set([...observed, ...predicted])).filter(Boolean);
  
  if (categories.length === 0) return 0;
  
  let po = 0;
  for (let i = 0; i < n; i++) {
    if (observed[i] && predicted[i] && observed[i] === predicted[i]) {
      po++;
    }
  }
  po /= n;
  
  let pe = 0;
  for (const cat of categories) {
    const obsCount = observed.filter(v => v === cat).length;
    const predCount = predicted.filter(v => v === cat).length;
    pe += (obsCount / n) * (predCount / n);
  }
  
  if (pe === 1) return 0;
  return (po - pe) / (1 - pe);
}

function percentAgreement(a: string[], b: string[]): number {
  if (a.length !== b.length || a.length === 0) return 0;
  let matches = 0;
  for (let i = 0; i < a.length; i++) {
    if (a[i] && b[i] && a[i] === b[i]) matches++;
  }
  return (matches / a.length) * 100;
}

function computeAgreementMetrics(observed: string[], predicted: string[]): AgreementMetrics {
  return {
    agreement: percentAgreement(observed, predicted),
    kappa: computeKappa(observed, predicted),
    confusion: computeConfusionMatrix(observed, predicted),
  };
}

export default function Dashboard() {
  const { user, role } = useAuth();
  const [casos, setCasos] = useState<CasoInvestigacion[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || role !== 'investigador') return;
    cargarDatos();
  }, [user, role]);

  async function cargarDatos() {
    setCargando(true);
    setError(null);
    try {
      const data = await obtenerDatosInvestigacion(user);
      setCasos(data);
    } catch (err) {
      console.error('Error cargando datos:', err);
      setError('No se pudieron cargar los datos de investigación');
    } finally {
      setCargando(false);
    }
  }

  function exportCSV() {
    if (casos.length === 0) {
      alert('No hay datos para exportar');
      return;
    }

    const headers = Object.keys(casos[0]).join(',');
    const rows = casos.map(caso => 
      Object.values(caso).map(v => 
        typeof v === 'string' && v.includes(',') ? `"${v}"` : v
      ).join(',')
    );
    
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `endoia-investigacion-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportDiscrepanciesCSV() {
    if (discrepancyTable.length === 0) {
      alert('No hay discrepancias para exportar');
      return;
    }

    const headers = 'case_id,JEN_pulpar,SEG_pulpar,INV_pulpar,FINAL_pulpar,IA_pulpar,JEN_apical,SEG_apical,INV_apical,FINAL_apical,IA_apical';
    const rows = discrepancyTable.map(row => 
      `${row.case_id},"${row.jen_p}","${row.seg_p}","${row.inv_p}","${row.final_p}","${row.ia_p}","${row.jen_a}","${row.seg_a}","${row.inv_a}","${row.final_a}","${row.ia_a}"`
    );
    
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `endoia-discrepancias-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function exportPNG() {
    const html2canvas = await import('html2canvas').then(m => m.default);
    const element = document.getElementById('dashboard-content');
    if (!element) return;

    const canvas = await html2canvas(element, { scale: 2 });
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `endoia-dashboard-${new Date().toISOString().split('T')[0]}.png`;
    a.click();
  }

  if (role !== 'investigador') {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="w-4 h-4" />
          <AlertDescription>
            Tu cuenta no tiene permisos de investigador.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (cargando) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="w-4 h-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const totalCasos = casos.length;
  const validados = casos.filter(c => c.AEDE_pulpar_FINAL && c.AEDE_apical_FINAL).length;
  const seguimientosCompletos = casos.filter(c => 
    (c.control_1m_exito === '1' || c.control_1m_exito === '0') &&
    (c.control_3m_exito === '1' || c.control_3m_exito === '0') &&
    (c.control_6m_exito === '1' || c.control_6m_exito === '0')
  ).length;

  const pulparDistribution = OPCIONES_PULPAR.map(opcion => ({
    name: opcion.replace('Clinically normal pulp', 'Normal').replace('Hypersensitive pulp', 'Hypersensitive').replace('Mild pulpitis', 'Mild').replace('Severe pulpitis', 'Severe').replace('Pulp necrosis', 'Necrosis').replace('Inconclusive pulp status', 'Inconclusive'),
    value: casos.filter(c => c.AEDE_pulpar_FINAL === opcion).length,
  }));

  const apicalDistribution = OPCIONES_APICAL.map(opcion => ({
    name: opcion.replace('Clinically normal apical tissues', 'Normal').replace('Localized symptomatic apical periodontitis', 'Symptomatic AP').replace('Localized asymptomatic apical periodontitis', 'Asymptomatic AP').replace('Apical periodontitis with sinus tract', 'Sinus tract').replace('Apical periodontitis with systemic involvement', 'Systemic').replace('Inconclusive apical condition', 'Inconclusive'),
    value: casos.filter(c => c.AEDE_apical_FINAL === opcion).length,
  }));

  // 1. Concordancia entre validadores principales (JEN vs SEG)
  const casosJENvsSEG = casos.filter(c => 
    c.AEDE_pulpar_JEN && c.AEDE_pulpar_SEG && 
    c.AEDE_apical_JEN && c.AEDE_apical_SEG
  );
  
  const validatorMainAgreement = {
    pulpar: computeAgreementMetrics(
      casosJENvsSEG.map(c => c.AEDE_pulpar_JEN || ''),
      casosJENvsSEG.map(c => c.AEDE_pulpar_SEG || '')
    ),
    apical: computeAgreementMetrics(
      casosJENvsSEG.map(c => c.AEDE_apical_JEN || ''),
      casosJENvsSEG.map(c => c.AEDE_apical_SEG || '')
    ),
  };

  // 2. Detectar discrepancias (JEN ≠ SEG)
  const discrepanciesPulpar = casosJENvsSEG.filter(c => c.AEDE_pulpar_JEN !== c.AEDE_pulpar_SEG);
  const discrepanciesApical = casosJENvsSEG.filter(c => c.AEDE_apical_JEN !== c.AEDE_apical_SEG);
  const discrepanciesBoth = casosJENvsSEG.filter(c => 
    c.AEDE_pulpar_JEN !== c.AEDE_pulpar_SEG || 
    c.AEDE_apical_JEN !== c.AEDE_apical_SEG
  );

  const discrepancyTable: DiscrepancyRow[] = discrepanciesBoth.map(c => ({
    case_id: c.case_id || '',
    jen_p: c.AEDE_pulpar_JEN || '',
    seg_p: c.AEDE_pulpar_SEG || '',
    inv_p: c.AEDE_pulpar_INV || '',
    final_p: c.AEDE_pulpar_FINAL || '',
    ia_p: c.AEDE_pulpar_IA || '',
    jen_a: c.AEDE_apical_JEN || '',
    seg_a: c.AEDE_apical_SEG || '',
    inv_a: c.AEDE_apical_INV || '',
    final_a: c.AEDE_apical_FINAL || '',
    ia_a: c.AEDE_apical_IA || '',
  }));

  // 3. Analizar INV solo en casos de discrepancia
  const invResolutionStats = {
    totalDiscrepancies: discrepanciesBoth.length,
    invPulpar: {
      alignsWithJen: discrepanciesPulpar.filter(c => c.AEDE_pulpar_INV === c.AEDE_pulpar_JEN).length,
      alignsWithSeg: discrepanciesPulpar.filter(c => c.AEDE_pulpar_INV === c.AEDE_pulpar_SEG).length,
    },
    invApical: {
      alignsWithJen: discrepanciesApical.filter(c => c.AEDE_apical_INV === c.AEDE_apical_JEN).length,
      alignsWithSeg: discrepanciesApical.filter(c => c.AEDE_apical_INV === c.AEDE_apical_SEG).length,
    },
  };

  // 4. Concordancia de cada validador vs FINAL
  const casosConFinal = casos.filter(c => c.AEDE_pulpar_FINAL && c.AEDE_apical_FINAL);
  
  const casosJENvsFinal = casosConFinal.filter(c => c.AEDE_pulpar_JEN && c.AEDE_apical_JEN);
  const casosSEGvsFinal = casosConFinal.filter(c => c.AEDE_pulpar_SEG && c.AEDE_apical_SEG);
  const casosINVvsFinal = casosConFinal.filter(c => c.AEDE_pulpar_INV && c.AEDE_apical_INV);

  const validatorVsFinal = {
    jen: {
      pulpar: computeAgreementMetrics(
        casosJENvsFinal.map(c => c.AEDE_pulpar_FINAL || ''),
        casosJENvsFinal.map(c => c.AEDE_pulpar_JEN || '')
      ),
      apical: computeAgreementMetrics(
        casosJENvsFinal.map(c => c.AEDE_apical_FINAL || ''),
        casosJENvsFinal.map(c => c.AEDE_apical_JEN || '')
      ),
    },
    seg: {
      pulpar: computeAgreementMetrics(
        casosSEGvsFinal.map(c => c.AEDE_pulpar_FINAL || ''),
        casosSEGvsFinal.map(c => c.AEDE_pulpar_SEG || '')
      ),
      apical: computeAgreementMetrics(
        casosSEGvsFinal.map(c => c.AEDE_apical_FINAL || ''),
        casosSEGvsFinal.map(c => c.AEDE_apical_SEG || '')
      ),
    },
    inv: {
      pulpar: computeAgreementMetrics(
        casosINVvsFinal.map(c => c.AEDE_pulpar_FINAL || ''),
        casosINVvsFinal.map(c => c.AEDE_pulpar_INV || '')
      ),
      apical: computeAgreementMetrics(
        casosINVvsFinal.map(c => c.AEDE_apical_FINAL || ''),
        casosINVvsFinal.map(c => c.AEDE_apical_INV || '')
      ),
    },
  };

  // 5. IA vs Validadores y vs FINAL
  const casosIAvsJEN = casos.filter(c => c.AEDE_pulpar_IA && c.AEDE_pulpar_JEN && c.AEDE_apical_IA && c.AEDE_apical_JEN);
  const casosIAvsSEG = casos.filter(c => c.AEDE_pulpar_IA && c.AEDE_pulpar_SEG && c.AEDE_apical_IA && c.AEDE_apical_SEG);
  const casosIAvsINV = casos.filter(c => c.AEDE_pulpar_IA && c.AEDE_pulpar_INV && c.AEDE_apical_IA && c.AEDE_apical_INV);
  const casosIAvsFinal = casosConFinal.filter(c => c.AEDE_pulpar_IA && c.AEDE_apical_IA);

  const iaComparisons = {
    jen: {
      pulpar: computeAgreementMetrics(
        casosIAvsJEN.map(c => c.AEDE_pulpar_JEN || ''),
        casosIAvsJEN.map(c => c.AEDE_pulpar_IA || '')
      ),
      apical: computeAgreementMetrics(
        casosIAvsJEN.map(c => c.AEDE_apical_JEN || ''),
        casosIAvsJEN.map(c => c.AEDE_apical_IA || '')
      ),
    },
    seg: {
      pulpar: computeAgreementMetrics(
        casosIAvsSEG.map(c => c.AEDE_pulpar_SEG || ''),
        casosIAvsSEG.map(c => c.AEDE_pulpar_IA || '')
      ),
      apical: computeAgreementMetrics(
        casosIAvsSEG.map(c => c.AEDE_apical_SEG || ''),
        casosIAvsSEG.map(c => c.AEDE_apical_IA || '')
      ),
    },
    inv: {
      pulpar: computeAgreementMetrics(
        casosIAvsINV.map(c => c.AEDE_pulpar_INV || ''),
        casosIAvsINV.map(c => c.AEDE_pulpar_IA || '')
      ),
      apical: computeAgreementMetrics(
        casosIAvsINV.map(c => c.AEDE_apical_INV || ''),
        casosIAvsINV.map(c => c.AEDE_apical_IA || '')
      ),
    },
    final: {
      pulpar: computeAgreementMetrics(
        casosIAvsFinal.map(c => c.AEDE_pulpar_FINAL || ''),
        casosIAvsFinal.map(c => c.AEDE_pulpar_IA || '')
      ),
      apical: computeAgreementMetrics(
        casosIAvsFinal.map(c => c.AEDE_apical_FINAL || ''),
        casosIAvsFinal.map(c => c.AEDE_apical_IA || '')
      ),
    },
  };

  const control1mCasos = casos.filter(c => c.control_1m_exito !== null && c.control_1m_exito !== undefined && c.control_1m_exito !== '');
  const control3mCasos = casos.filter(c => c.control_3m_exito !== null && c.control_3m_exito !== undefined && c.control_3m_exito !== '');
  const control6mCasos = casos.filter(c => c.control_6m_exito !== null && c.control_6m_exito !== undefined && c.control_6m_exito !== '');

  const exito1m = control1mCasos.filter(c => c.control_1m_exito === '1').length;
  const exito3m = control3mCasos.filter(c => c.control_3m_exito === '1').length;
  const exito6m = control6mCasos.filter(c => c.control_6m_exito === '1').length;

  const seguimientoData = [
    {
      periodo: '1 mes',
      exito: control1mCasos.length > 0 ? (exito1m / control1mCasos.length) * 100 : 0,
      n: control1mCasos.length,
    },
    {
      periodo: '3 meses',
      exito: control3mCasos.length > 0 ? (exito3m / control3mCasos.length) * 100 : 0,
      n: control3mCasos.length,
    },
    {
      periodo: '6 meses',
      exito: control6mCasos.length > 0 ? (exito6m / control6mCasos.length) * 100 : 0,
      n: control6mCasos.length,
    },
  ];

  const toothCounts: Record<string, number> = {};
  casos.forEach(c => {
    if (c.tooth_fdi) {
      toothCounts[c.tooth_fdi] = (toothCounts[c.tooth_fdi] || 0) + 1;
    }
  });

  const topTeeth = Object.entries(toothCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([tooth, count]) => ({ tooth, count }));

  const monthCounts: Record<string, { nuevos: number; validados: number; seguimiento: number }> = {};
  casos.forEach(c => {
    const fecha = c.date || c.registro_fecha;
    if (fecha) {
      const month = fecha.substring(0, 7);
      if (!monthCounts[month]) {
        monthCounts[month] = { nuevos: 0, validados: 0, seguimiento: 0 };
      }
      monthCounts[month].nuevos++;
      if (c.AEDE_pulpar_FINAL && c.AEDE_apical_FINAL) {
        monthCounts[month].validados++;
      }
      const tieneSeguimiento = (
        (c.control_1m_exito === '1' || c.control_1m_exito === '0') ||
        (c.control_3m_exito === '1' || c.control_3m_exito === '0') ||
        (c.control_6m_exito === '1' || c.control_6m_exito === '0')
      );
      if (tieneSeguimiento) {
        monthCounts[month].seguimiento++;
      }
    }
  });

  const tendenciaData = Object.entries(monthCounts)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-12)
    .map(([mes, data]) => ({
      mes: mes.substring(5),
      nuevos: data.nuevos,
      validados: data.validados,
      seguimiento: data.seguimiento,
    }));

  const missingFields: Record<string, number> = {};
  const fieldKeys = ['spontaneous_pain_yesno', 'thermal_cold_response', 'percussion_pain_yesno', 
    'radiolucency_yesno', 'AEDE_pulpar_FINAL', 'AEDE_apical_FINAL', 'tto_realizado'];
  
  fieldKeys.forEach(key => {
    missingFields[key] = casos.filter(c => {
      const value = c[key as keyof CasoInvestigacion];
      return value === null || value === undefined || value === '';
    }).length;
  });

  const topMissing = Object.entries(missingFields)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const casosConNotas = casos.filter(c => c.notes && c.notes.trim() !== '').length;

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <BarChart3 className="w-7 h-7" />
            Panel de Investigación
          </h1>
          <p className="text-muted-foreground mt-1">
            Análisis completo de datos ENDOIA
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportCSV} variant="outline" size="sm" className="gap-2">
            <FileSpreadsheet className="w-4 h-4" />
            Datos Completos
          </Button>
          <Button onClick={exportDiscrepanciesCSV} variant="outline" size="sm" className="gap-2">
            <FileSpreadsheet className="w-4 h-4" />
            Discrepancias
          </Button>
          <Button onClick={exportPNG} variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            PNG
          </Button>
        </div>
      </div>

      <div id="dashboard-content" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Casos</p>
                  <p className="text-3xl font-bold mt-2">{totalCasos}</p>
                </div>
                <Activity className="w-10 h-10 text-blue-500 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Validados</p>
                  <p className="text-3xl font-bold mt-2 text-green-600">{validados}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {totalCasos > 0 ? `${((validados / totalCasos) * 100).toFixed(1)}%` : '0%'}
                  </p>
                </div>
                <CheckCircle2 className="w-10 h-10 text-green-500 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Discrepancias JEN≠SEG</p>
                  <p className="text-3xl font-bold mt-2 text-orange-600">{discrepanciesBoth.length}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {casosJENvsSEG.length > 0 ? `${((discrepanciesBoth.length / casosJENvsSEG.length) * 100).toFixed(1)}%` : '0%'}
                  </p>
                </div>
                <AlertTriangle className="w-10 h-10 text-orange-500 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Seguimientos 100%</p>
                  <p className="text-3xl font-bold mt-2 text-purple-600">{seguimientosCompletos}</p>
                  <p className="text-xs text-muted-foreground mt-1">1m + 3m + 6m</p>
                </div>
                <TrendingUp className="w-10 h-10 text-purple-500 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Tendencia Temporal (últimos 12 meses)</CardTitle>
            <CardDescription>Casos nuevos, validados y con seguimiento por mes</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={tendenciaData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="nuevos" stroke="#8884d8" name="Nuevos" />
                <Line type="monotone" dataKey="validados" stroke="#82ca9d" name="Validados" />
                <Line type="monotone" dataKey="seguimiento" stroke="#ffc658" name="Seguimiento" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Distribución Diagnóstico Pulpar (AAE–ESE 2025)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={pulparDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Distribución Diagnóstico Apical (AAE–ESE 2025)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={apicalDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Concordancia JEN vs SEG (Validadores Principales)</CardTitle>
            <CardDescription>Acuerdo entre los dos validadores principales antes de INV</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-950">
                <p className="text-sm font-medium text-muted-foreground">Diagnóstico Pulpar</p>
                <p className="text-2xl font-bold mt-2">{validatorMainAgreement.pulpar.agreement.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Kappa: {validatorMainAgreement.pulpar.kappa.toFixed(3)} | N = {casosJENvsSEG.length}
                </p>
              </div>

              <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950">
                <p className="text-sm font-medium text-muted-foreground">Diagnóstico Apical</p>
                <p className="text-2xl font-bold mt-2">{validatorMainAgreement.apical.agreement.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Kappa: {validatorMainAgreement.apical.kappa.toFixed(3)} | N = {casosJENvsSEG.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Discrepancias y Resolución por INV (Tercer Validador)</CardTitle>
            <CardDescription>
              INV solo interviene cuando JEN ≠ SEG para resolver el diagnóstico final
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <p className="text-sm font-medium text-muted-foreground">Total Discrepancias</p>
                <p className="text-3xl font-bold mt-2 text-orange-600">{invResolutionStats.totalDiscrepancies}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {casosJENvsSEG.length > 0 ? `${((invResolutionStats.totalDiscrepancies / casosJENvsSEG.length) * 100).toFixed(1)}% de casos` : '0%'}
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <p className="text-sm font-medium text-muted-foreground">Discrepancias Pulpar</p>
                <p className="text-2xl font-bold mt-2">{discrepanciesPulpar.length}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  INV→JEN: {invResolutionStats.invPulpar.alignsWithJen} | 
                  INV→SEG: {invResolutionStats.invPulpar.alignsWithSeg}
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <p className="text-sm font-medium text-muted-foreground">Discrepancias Apical</p>
                <p className="text-2xl font-bold mt-2">{discrepanciesApical.length}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  INV→JEN: {invResolutionStats.invApical.alignsWithJen} | 
                  INV→SEG: {invResolutionStats.invApical.alignsWithSeg}
                </p>
              </div>
            </div>

            {discrepancyTable.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold mb-2">Tabla de Discrepancias Detallada</h3>
                <div className="overflow-x-auto border rounded-lg">
                  <table className="w-full text-xs">
                    <thead className="bg-muted">
                      <tr>
                        <th className="p-2 text-left">Caso</th>
                        <th className="p-2 text-left">JEN_P</th>
                        <th className="p-2 text-left">SEG_P</th>
                        <th className="p-2 text-left">INV_P</th>
                        <th className="p-2 text-left">FINAL_P</th>
                        <th className="p-2 text-left">JEN_A</th>
                        <th className="p-2 text-left">SEG_A</th>
                        <th className="p-2 text-left">INV_A</th>
                        <th className="p-2 text-left">FINAL_A</th>
                      </tr>
                    </thead>
                    <tbody>
                      {discrepancyTable.slice(0, 10).map((row, idx) => (
                        <tr key={idx} className="border-t">
                          <td className="p-2 font-mono">{row.case_id.substring(0, 8)}</td>
                          <td className="p-2">{row.jen_p.substring(0, 15)}</td>
                          <td className="p-2">{row.seg_p.substring(0, 15)}</td>
                          <td className="p-2">{row.inv_p.substring(0, 15)}</td>
                          <td className="p-2 font-semibold">{row.final_p.substring(0, 15)}</td>
                          <td className="p-2">{row.jen_a.substring(0, 15)}</td>
                          <td className="p-2">{row.seg_a.substring(0, 15)}</td>
                          <td className="p-2">{row.inv_a.substring(0, 15)}</td>
                          <td className="p-2 font-semibold">{row.final_a.substring(0, 15)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {discrepancyTable.length > 10 && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Mostrando 10 de {discrepancyTable.length} discrepancias. Exporta CSV para ver todas.
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Concordancia Validadores vs FINAL (Gold Standard)</CardTitle>
            <CardDescription>Comparación de cada validador contra el diagnóstico final consensuado</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-3">JEN vs FINAL</h4>
                <p className="text-sm text-muted-foreground">Pulpar: {validatorVsFinal.jen.pulpar.agreement.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">Kappa: {validatorVsFinal.jen.pulpar.kappa.toFixed(3)}</p>
                <p className="text-sm text-muted-foreground mt-2">Apical: {validatorVsFinal.jen.apical.agreement.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">Kappa: {validatorVsFinal.jen.apical.kappa.toFixed(3)}</p>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-3">SEG vs FINAL</h4>
                <p className="text-sm text-muted-foreground">Pulpar: {validatorVsFinal.seg.pulpar.agreement.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">Kappa: {validatorVsFinal.seg.pulpar.kappa.toFixed(3)}</p>
                <p className="text-sm text-muted-foreground mt-2">Apical: {validatorVsFinal.seg.apical.agreement.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">Kappa: {validatorVsFinal.seg.apical.kappa.toFixed(3)}</p>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-3">INV vs FINAL (solo en discrepancias)</h4>
                <p className="text-sm text-muted-foreground">Pulpar: {validatorVsFinal.inv.pulpar.agreement.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">Kappa: {validatorVsFinal.inv.pulpar.kappa.toFixed(3)}</p>
                <p className="text-sm text-muted-foreground mt-2">Apical: {validatorVsFinal.inv.apical.agreement.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">Kappa: {validatorVsFinal.inv.apical.kappa.toFixed(3)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>IA Comparada con Validadores y FINAL</CardTitle>
            <CardDescription>Rendimiento del sistema de IA contra cada validador y el gold standard</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 border rounded-lg bg-purple-50 dark:bg-purple-950">
                <h4 className="font-semibold mb-3">IA vs JEN</h4>
                <p className="text-sm text-muted-foreground">Pulpar: {iaComparisons.jen.pulpar.agreement.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">κ: {iaComparisons.jen.pulpar.kappa.toFixed(3)}</p>
                <p className="text-sm text-muted-foreground mt-2">Apical: {iaComparisons.jen.apical.agreement.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">κ: {iaComparisons.jen.apical.kappa.toFixed(3)}</p>
                <p className="text-xs text-muted-foreground mt-2">N = {casosIAvsJEN.length}</p>
              </div>

              <div className="p-4 border rounded-lg bg-purple-50 dark:bg-purple-950">
                <h4 className="font-semibold mb-3">IA vs SEG</h4>
                <p className="text-sm text-muted-foreground">Pulpar: {iaComparisons.seg.pulpar.agreement.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">κ: {iaComparisons.seg.pulpar.kappa.toFixed(3)}</p>
                <p className="text-sm text-muted-foreground mt-2">Apical: {iaComparisons.seg.apical.agreement.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">κ: {iaComparisons.seg.apical.kappa.toFixed(3)}</p>
                <p className="text-xs text-muted-foreground mt-2">N = {casosIAvsSEG.length}</p>
              </div>

              <div className="p-4 border rounded-lg bg-purple-50 dark:bg-purple-950">
                <h4 className="font-semibold mb-3">IA vs INV</h4>
                <p className="text-sm text-muted-foreground">Pulpar: {iaComparisons.inv.pulpar.agreement.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">κ: {iaComparisons.inv.pulpar.kappa.toFixed(3)}</p>
                <p className="text-sm text-muted-foreground mt-2">Apical: {iaComparisons.inv.apical.agreement.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">κ: {iaComparisons.inv.apical.kappa.toFixed(3)}</p>
                <p className="text-xs text-muted-foreground mt-2">N = {casosIAvsINV.length}</p>
              </div>

              <div className="p-4 border rounded-lg bg-amber-50 dark:bg-amber-950">
                <h4 className="font-semibold mb-3">IA vs FINAL ⭐</h4>
                <p className="text-sm text-muted-foreground">Pulpar: {iaComparisons.final.pulpar.agreement.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">κ: {iaComparisons.final.pulpar.kappa.toFixed(3)}</p>
                <p className="text-sm text-muted-foreground mt-2">Apical: {iaComparisons.final.apical.agreement.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">κ: {iaComparisons.final.apical.kappa.toFixed(3)}</p>
                <p className="text-xs text-muted-foreground mt-2">N = {casosIAvsFinal.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tasas de Éxito en Seguimientos</CardTitle>
            <CardDescription>Porcentaje de éxito clínico/radiológico por periodo</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={seguimientoData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="periodo" />
                <YAxis />
                <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
                <Legend />
                <Bar dataKey="exito" fill="#10b981" name="% Éxito" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              {seguimientoData.map((item) => (
                <div key={item.periodo} className="p-2 border rounded">
                  <p className="text-xs text-muted-foreground">{item.periodo}</p>
                  <p className="text-lg font-bold">{item.exito.toFixed(1)}%</p>
                  <p className="text-xs text-muted-foreground">n = {item.n}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top 10 Dientes Tratados (FDI)</CardTitle>
            <CardDescription>Frecuencia por número de diente</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topTeeth} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="tooth" type="category" />
                <Tooltip />
                <Bar dataKey="count" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Métricas de Calidad de Datos</CardTitle>
            <CardDescription>Variables con mayor porcentaje de datos faltantes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topMissing.map(([field, count]) => (
                <div key={field} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{field}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-orange-500 h-2 rounded-full"
                        style={{ width: `${(count / totalCasos) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-16 text-right">
                      {((count / totalCasos) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="p-3 border rounded-lg">
                <p className="text-xs text-muted-foreground">Casos con notas</p>
                <p className="text-xl font-bold mt-1">{casosConNotas}</p>
                <p className="text-xs text-muted-foreground">
                  {((casosConNotas / totalCasos) * 100).toFixed(1)}%
                </p>
              </div>
              <div className="p-3 border rounded-lg">
                <p className="text-xs text-muted-foreground">Completitud promedio</p>
                <p className="text-xl font-bold mt-1">
                  {(100 - (Object.values(missingFields).reduce((a, b) => a + b, 0) / 
                    (fieldKeys.length * totalCasos)) * 100).toFixed(1)}%
                </p>
                <p className="text-xs text-muted-foreground">de los campos clave</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
