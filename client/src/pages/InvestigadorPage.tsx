import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FlaskConical, Database, BarChart3, Download } from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function InvestigadorPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-primary" />
                Panel de Investigación
              </CardTitle>
              <CardDescription>
                Acceso completo a datos, análisis y controles del estudio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Database className="w-4 h-4" />
                      Datos Completos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      Accede a todos los casos clínicos del estudio
                    </p>
                    <Button variant="outline" className="w-full gap-2" disabled>
                      <Download className="w-4 h-4" />
                      Descargar Dataset
                    </Button>
                    <Badge variant="secondary" className="mt-2 w-full justify-center">
                      Próximamente
                    </Badge>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" />
                      Análisis Estadístico
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      Métricas de concordancia IA vs Tutores
                    </p>
                    <Button variant="outline" className="w-full gap-2" disabled>
                      Ver Análisis
                    </Button>
                    <Badge variant="secondary" className="mt-2 w-full justify-center">
                      En desarrollo
                    </Badge>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <FlaskConical className="w-4 h-4" />
                      Control de Calidad
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      Revisión de casos con discrepancia
                    </p>
                    <Button variant="outline" className="w-full gap-2" disabled>
                      Ver Casos
                    </Button>
                    <Badge variant="secondary" className="mt-2 w-full justify-center">
                      Próximamente
                    </Badge>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2">Acceso Completo del Investigador</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>✅ Vista de Casos Clínicos (crear y enviar casos)</li>
                  <li>✅ Vista de Validación (validar como tutor)</li>
                  <li>🔜 Dashboard de investigación con métricas</li>
                  <li>🔜 Exportación de datos a CSV/Excel</li>
                  <li>🔜 Análisis de concordancia Kappa</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
