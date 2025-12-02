import { ClinicoCase } from './types';
import { getDiagnosisColor } from './helpers';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';

interface DiagnosisBadgesProps {
  caso: ClinicoCase;
}

export function EnhancedDiagnosisBadges({ caso }: DiagnosisBadgesProps) {
  const pulparColor = getDiagnosisColor(caso.AEDE_pulpar_IA);
  const apicalColor = getDiagnosisColor(caso.AEDE_apical_IA);

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div>
          <p className="text-sm font-medium mb-2">Diagnóstico Pulpar IA:</p>
          <Badge className={`${pulparColor} border text-base px-4 py-2 font-semibold`}>
            {caso.AEDE_pulpar_IA || 'Sin diagnóstico'}
          </Badge>
        </div>
        
        <div>
          <p className="text-sm font-medium mb-2">Diagnóstico Apical IA:</p>
          <Badge className={`${apicalColor} border text-base px-4 py-2 font-semibold`}>
            {caso.AEDE_apical_IA || 'Sin diagnóstico'}
          </Badge>
        </div>
      </div>

      {caso.tto_propuesto && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-4 space-y-2">
            <div className="flex items-center gap-2 text-blue-900">
              <Lightbulb className="w-5 h-5" />
              <h4 className="font-semibold">Orientación terapéutica sugerida</h4>
            </div>
            <p className="text-sm text-blue-800">{caso.tto_propuesto}</p>
            <p className="text-xs text-blue-600 italic pt-2 border-t border-blue-200">
              Recomendación basada en reglas objetivas ENDOIA (AAE/ESE 2025).
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
