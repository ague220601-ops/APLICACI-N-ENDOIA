import { ClinicoCase } from './types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, X } from 'lucide-react';
import { getDiagnosisColor } from './helpers';

interface CasosPorDienteModalProps {
  fdi: string | null;
  casos: ClinicoCase[];
  onClose: () => void;
  onVerDetalle?: (caso: ClinicoCase) => void;
}

export function CasosPorDienteModal({ fdi, casos, onClose, onVerDetalle }: CasosPorDienteModalProps) {
  if (!fdi) return null;

  const casosDiente = casos.filter(caso => String(caso.tooth_fdi) === fdi);

  return (
    <Dialog open={!!fdi} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl">
              Casos del diente FDI {fdi}
            </DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <DialogDescription>
            {casosDiente.length} {casosDiente.length === 1 ? 'caso registrado' : 'casos registrados'}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {casosDiente.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No hay casos registrados para este diente
            </div>
          ) : (
            <>
              {/* Vista desktop: tabla */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-3 text-sm font-semibold">ID</th>
                      <th className="text-left p-3 text-sm font-semibold">Fecha</th>
                      <th className="text-left p-3 text-sm font-semibold">Diagnóstico Pulpar IA</th>
                      <th className="text-left p-3 text-sm font-semibold">Diagnóstico Apical IA</th>
                      <th className="text-left p-3 text-sm font-semibold">Tratamiento</th>
                      <th className="text-left p-3 text-sm font-semibold">Estado</th>
                      <th className="text-center p-3 text-sm font-semibold">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {casosDiente.map((caso) => {
                      const hasTreatment = caso.tto_realizado && caso.tto_realizado.trim() !== '';
                      const hasControls = caso.fecha_control_1m || caso.fecha_control_3m || caso.fecha_control_6m;
                      
                      return (
                        <tr key={caso.case_id} className="border-b hover:bg-muted/30">
                          <td className="p-3 text-xs font-mono">{caso.case_id}</td>
                          <td className="p-3 text-sm">{caso.registro_fecha || caso.date || 'N/A'}</td>
                          <td className="p-3">
                            <Badge className={`${getDiagnosisColor(caso.AEDE_pulpar_IA)} text-xs`}>
                              {caso.AEDE_pulpar_IA || 'N/A'}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <Badge className={`${getDiagnosisColor(caso.AEDE_apical_IA)} text-xs`}>
                              {caso.AEDE_apical_IA || 'N/A'}
                            </Badge>
                          </td>
                          <td className="p-3 text-sm max-w-[200px] truncate" title={caso.tto_realizado || caso.tto_propuesto}>
                            {caso.tto_realizado || caso.tto_propuesto || 'N/A'}
                          </td>
                          <td className="p-3">
                            <Badge variant={hasTreatment ? (hasControls ? 'default' : 'secondary') : 'outline'} className="text-xs">
                              {hasTreatment ? (hasControls ? 'Con seguimiento' : 'Sin controles') : 'Sin tratamiento'}
                            </Badge>
                          </td>
                          <td className="p-3 text-center">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onVerDetalle?.(caso)}
                              className="gap-2"
                            >
                              <Eye className="w-3 h-3" />
                              Ver
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Vista mobile: cards */}
              <div className="md:hidden space-y-3">
                {casosDiente.map((caso) => {
                  const hasTreatment = caso.tto_realizado && caso.tto_realizado.trim() !== '';
                  const hasControls = caso.fecha_control_1m || caso.fecha_control_3m || caso.fecha_control_6m;
                  
                  return (
                    <div key={caso.case_id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <p className="font-mono text-xs text-muted-foreground">{caso.case_id}</p>
                          <p className="text-sm font-semibold">
                            {caso.registro_fecha || caso.date || 'N/A'}
                          </p>
                        </div>
                        <Badge variant={hasTreatment ? (hasControls ? 'default' : 'secondary') : 'outline'} className="text-xs">
                          {hasTreatment ? (hasControls ? 'Con seguimiento' : 'Sin controles') : 'Sin tratamiento'}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Diagnóstico Pulpar IA:</p>
                          <Badge className={`${getDiagnosisColor(caso.AEDE_pulpar_IA)} text-xs`}>
                            {caso.AEDE_pulpar_IA || 'N/A'}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Diagnóstico Apical IA:</p>
                          <Badge className={`${getDiagnosisColor(caso.AEDE_apical_IA)} text-xs`}>
                            {caso.AEDE_apical_IA || 'N/A'}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Tratamiento:</p>
                          <p className="text-sm">{caso.tto_realizado || caso.tto_propuesto || 'N/A'}</p>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onVerDetalle?.(caso)}
                        className="w-full gap-2"
                      >
                        <Eye className="w-3 h-3" />
                        Ver detalles
                      </Button>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
