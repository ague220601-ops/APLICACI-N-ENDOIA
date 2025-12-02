import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, Loader2, AlertCircle, FileCheck } from "lucide-react";
import { obtenerPendientes, enviarLabelTutor, type CasoClinico } from "@/lib/api";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/auth/AuthContext";
import { OPCIONES_PULPAR, OPCIONES_APICAL } from "@/lib/classifications";

interface Clasificaciones {
  pulpar: string;
  apical: string;
}

export default function TutorView() {
  const { user, role } = useAuth();
  
  const [pendientes, setPendientes] = useState<CasoClinico[]>([]);
  const [seleccion, setSeleccion] = useState<Record<string, Clasificaciones>>({});
  const [guardando, setGuardando] = useState<Record<string, boolean>>({});
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (!user || (role !== 'tutor' && role !== 'investigador')) return;
    
    (async () => {
      setCargando(true);
      const data = await obtenerPendientes();
      setPendientes(data);
      setCargando(false);
    })();
  }, [user, role]);

  function handleChangePulpar(case_id: string, value: string) {
    setSeleccion(s => ({ 
      ...s, 
      [case_id]: { 
        pulpar: value, 
        apical: s[case_id]?.apical || "" 
      } 
    }));
  }

  function handleChangeApical(case_id: string, value: string) {
    setSeleccion(s => ({ 
      ...s, 
      [case_id]: { 
        pulpar: s[case_id]?.pulpar || "", 
        apical: value 
      } 
    }));
  }

  async function guardar(case_id: string) {
    const clasificaciones = seleccion[case_id];
    if (!clasificaciones?.pulpar || !clasificaciones?.apical) return;
    
    setGuardando(g => ({ ...g, [case_id]: true }));
    await enviarLabelTutor(case_id, clasificaciones);
    setGuardando(g => ({ ...g, [case_id]: false }));
    setPendientes(prev => prev.filter(c => c.case_id !== case_id));
  }

  if (role !== 'tutor' && role !== 'investigador') {
    return (
      <Alert variant="destructive">
        <AlertCircle className="w-4 h-4" />
        <AlertDescription>
          Tu cuenta no tiene permisos de tutor. Contacta al administrador.
        </AlertDescription>
      </Alert>
    );
  }

  // Vista principal de validación
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-primary" />
                Validador Tutor
              </CardTitle>
              <CardDescription>
                Asigna la clasificación pulpar y apical oficial AEDE/AAE (Gold Standard)
              </CardDescription>
            </div>
            <Badge variant="secondary" className="gap-1">
              {user?.email}
            </Badge>
          </div>
          <Alert className="mt-3">
            <AlertCircle className="w-4 h-4" />
            <AlertDescription className="text-xs">
              <strong>Importante:</strong> Debes asignar AMBAS clasificaciones (pulpar y apical) según criterios AEDE/AAE 2025 para completar la validación del caso.
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent>
          {cargando ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : pendientes.length === 0 ? (
            <Alert>
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>
                No hay casos pendientes de validar para tu perfil en este momento
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              {pendientes.map((caso) => (
                <Card key={caso.case_id} className="border-2" data-testid={`card-case-${caso.case_id}`}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">
                      {caso.case_id}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Diente {caso.tooth_fdi}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                      <div>
                        <p className="text-muted-foreground text-xs">Dolor espontáneo</p>
                        <p className="font-medium">{caso.dolorEspontaneo === "si" ? "Sí" : "No"}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Respuesta frío</p>
                        <p className="font-medium">
                          {caso.respuestaFrio === "0_no_responde" ? "No responde" :
                           caso.respuestaFrio === "1_normal" ? "Normal" : "Aumentada"}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Lingering (seg)</p>
                        <p className="font-medium">{caso.lingeringSeg || "0"}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Percusión</p>
                        <p className="font-medium">{caso.percusionDolor === "si" ? "Sí" : "No"}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Radiolucidez</p>
                        <p className="font-medium">{caso.radiolucidezApical === "si" ? "Sí" : "No"}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Profundidad</p>
                        <p className="font-medium capitalize">{caso.profundidadCaries}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Tracto sinusal</p>
                        <p className="font-medium">{caso.sinusTractPresent === "si" ? "Sí" : "No"}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Compromiso sistémico</p>
                        <p className="font-medium">{caso.systemicInvolvement === "si" ? "Sí" : "No"}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Tratamiento previo</p>
                        <p className="font-medium">{caso.previousTreatment === "si" ? "Sí" : "No"}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Palpación apical</p>
                        <p className="font-medium">{caso.apicalPalpationPain === "si" ? "Sí" : "No"}</p>
                      </div>
                    </div>

                    {caso.notas && (
                      <div className="bg-muted p-3 rounded-md">
                        <p className="text-xs text-muted-foreground mb-1">Notas clínicas</p>
                        <p className="text-sm">{caso.notas}</p>
                      </div>
                    )}

                    <div className="space-y-4 pt-3 border-t">
                      {/* Clasificación Pulpar */}
                      <div className="space-y-2">
                        <Label htmlFor={`pulpar-${caso.case_id}`} className="text-sm font-semibold">
                          Clasificación Pulpar AEDE/AAE (Gold Standard)
                        </Label>
                        <Select
                          value={seleccion[caso.case_id]?.pulpar || ""}
                          onValueChange={(value) => handleChangePulpar(caso.case_id, value)}
                        >
                          <SelectTrigger
                            id={`pulpar-${caso.case_id}`}
                            data-testid={`select-pulpar-${caso.case_id}`}
                          >
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

                      {/* Clasificación Apical */}
                      <div className="space-y-2">
                        <Label htmlFor={`apical-${caso.case_id}`} className="text-sm font-semibold">
                          Clasificación Apical AEDE/AAE (Gold Standard)
                        </Label>
                        <Select
                          value={seleccion[caso.case_id]?.apical || ""}
                          onValueChange={(value) => handleChangeApical(caso.case_id, value)}
                        >
                          <SelectTrigger
                            id={`apical-${caso.case_id}`}
                            data-testid={`select-apical-${caso.case_id}`}
                          >
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

                      <Button
                        onClick={() => guardar(caso.case_id)}
                        disabled={
                          !seleccion[caso.case_id]?.pulpar || 
                          !seleccion[caso.case_id]?.apical || 
                          guardando[caso.case_id]
                        }
                        className="w-full gap-2"
                        data-testid={`button-validate-${caso.case_id}`}
                      >
                        {guardando[caso.case_id] ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Guardando...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            Validar y guardar
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
