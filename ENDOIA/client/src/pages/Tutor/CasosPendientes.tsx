import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileCheck, Loader2, AlertCircle, CheckCircle2, Clock, Calendar } from "lucide-react";
import { useAuth } from "@/auth/AuthContext";
import { obtenerPendientes } from "@/lib/api";

export default function CasosPendientes() {
  const { user, role } = useAuth();
  const [, navigate] = useLocation();
  const [pendientes, setPendientes] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || (role !== 'tutor' && role !== 'investigador')) return;
    cargarPendientes();
  }, [user, role]);

  async function cargarPendientes() {
    setCargando(true);
    setError(null);
    try {
      const casos = await obtenerPendientes();
      
      if (casos.length > 0) {
        console.log('📋 Estructura de casos pendientes:', casos[0]);
        console.log('📋 Total de casos:', casos.length);
      }
      
      setPendientes(casos);
    } catch (err) {
      console.error('Error cargando pendientes:', err);
      setError('No se pudieron cargar los casos pendientes');
    } finally {
      setCargando(false);
    }
  }

  function handleValidar(caso: any) {
    if (!caso || !caso.case_id) {
      console.error('Error: caso sin case_id', caso);
      setError('Error: El caso no tiene un ID válido');
      return;
    }
    
    const { 
      pulpalDxIA, 
      apicalDxIA, 
      AEDE_pulpar_IA, 
      AEDE_apical_IA, 
      tto_propuesto,
      recomendacion_analgesia,
      recomendacion_plan,
      recomendacion_urgencia,
      recomendacion_antibiotico,
      recomendacion_notas,
      ...clinicalData 
    } = caso;
    sessionStorage.setItem(`caso_${caso.case_id}`, JSON.stringify(clinicalData));
    navigate(`/tutor/validar/${caso.case_id}`);
  }

  if (role !== 'tutor' && role !== 'investigador') {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="w-4 h-4" />
          <AlertDescription>
            Tu cuenta no tiene permisos de tutor. Contacta al administrador.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const total = pendientes.length;
  const ultimos7Dias = pendientes.filter(c => {
    if (!c.date && !c.registro_fecha) return false;
    const fecha = new Date(c.date || c.registro_fecha);
    const hace7Dias = new Date();
    hace7Dias.setDate(hace7Dias.getDate() - 7);
    return fecha >= hace7Dias;
  }).length;
  const conNotas = pendientes.filter(c => c.notes && c.notes.trim() !== '').length;

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <FileCheck className="w-7 h-7" />
            Casos Pendientes
          </h1>
          <p className="text-muted-foreground mt-1">
            Valida diagnósticos según AEDE/ESE 2025
          </p>
        </div>
        <Badge variant="secondary" className="gap-1">
          {user?.email}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Pendientes</p>
                <p className="text-3xl font-bold mt-2">{total}</p>
              </div>
              <Clock className="w-10 h-10 text-orange-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Últimos 7 días</p>
                <p className="text-3xl font-bold mt-2 text-blue-600">{ultimos7Dias}</p>
              </div>
              <Calendar className="w-10 h-10 text-blue-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Con Notas</p>
                <p className="text-3xl font-bold mt-2 text-green-600">{conNotas}</p>
              </div>
              <CheckCircle2 className="w-10 h-10 text-green-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {cargando ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      ) : error ? (
        <Alert variant="destructive">
          <AlertCircle className="w-4 h-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : pendientes.length === 0 ? (
        <Alert>
          <AlertCircle className="w-4 h-4" />
          <AlertDescription>
            No hay casos pendientes de validar en este momento
          </AlertDescription>
        </Alert>
      ) : (
        <>
          <div className="hidden md:block">
            <Card>
              <CardHeader>
                <CardTitle>Casos a Validar ({total})</CardTitle>
                <CardDescription>
                  Haz clic en "Validar" para revisar los datos clínicos y asignar clasificación AEDE/ESE
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">ID de Caso</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Diente (FDI)</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Fecha</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Notas</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {pendientes.map((caso) => (
                        <tr key={caso.case_id} className="hover:bg-muted/50">
                          <td className="px-4 py-3 font-mono text-xs">{caso.case_id}</td>
                          <td className="px-4 py-3 font-semibold">{caso.tooth_fdi}</td>
                          <td className="px-4 py-3 text-sm">
                            {caso.date || caso.registro_fecha || 'N/A'}
                          </td>
                          <td className="px-4 py-3">
                            {caso.notes && caso.notes.trim() !== '' ? (
                              <Badge variant="outline" className="text-xs">Sí</Badge>
                            ) : (
                              <span className="text-xs text-muted-foreground">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <Button
                              size="sm"
                              onClick={() => handleValidar(caso)}
                              className="gap-2"
                            >
                              <FileCheck className="w-3 h-3" />
                              Validar
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:hidden space-y-4">
            <h2 className="text-xl font-bold">Casos a Validar ({total})</h2>
            {pendientes.map((caso) => (
              <Card key={caso.case_id}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="font-mono text-xs text-muted-foreground">{caso.case_id}</p>
                      <p className="text-lg font-bold">Diente {caso.tooth_fdi}</p>
                    </div>
                    {caso.notes && caso.notes.trim() !== '' && (
                      <Badge variant="outline" className="text-xs">Con notas</Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {caso.date || caso.registro_fecha || 'Fecha no disponible'}
                  </div>
                  <Button
                    onClick={() => handleValidar(caso)}
                    className="w-full gap-2"
                  >
                    <FileCheck className="w-4 h-4" />
                    Validar caso
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
