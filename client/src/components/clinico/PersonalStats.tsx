import { ClinicoCase, MonthlyStats, TreatmentStats, DiagnosisDistribution } from './types';
import { toNumber, getMonthKey, getMonthLabel } from './helpers';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { TrendingUp, Target, PieChartIcon } from 'lucide-react';

interface PersonalStatsProps {
  casos: ClinicoCase[];
}

const PULPAR_DIAGNOSES_AAE_ESE_2025: Record<string, { label: string; color: string }> = {
  'Clinically normal pulp': { label: 'Clinically normal pulp', color: '#2ECC71' },
  'Pulpa normal': { label: 'Clinically normal pulp', color: '#2ECC71' },
  'Hypersensitive pulp': { label: 'Hypersensitive pulp', color: '#3498DB' },
  'Hipersensibilidad pulpar': { label: 'Hypersensitive pulp', color: '#3498DB' },
  'Mild pulpitis': { label: 'Mild pulpitis', color: '#F5A623' },
  'Pulpitis leve': { label: 'Mild pulpitis', color: '#F5A623' },
  'Severe pulpitis': { label: 'Severe pulpitis', color: '#E74C3C' },
  'Pulpitis severa': { label: 'Severe pulpitis', color: '#E74C3C' },
  'Pulp necrosis': { label: 'Pulp necrosis', color: '#8E44AD' },
  'Pulpa necrótica': { label: 'Pulp necrosis', color: '#8E44AD' },
  'Necrosis pulpar': { label: 'Pulp necrosis', color: '#8E44AD' },
};

const LEGEND_ORDER = [
  { diagnosis: 'Clinically normal pulp', color: '#2ECC71' },
  { diagnosis: 'Hypersensitive pulp', color: '#3498DB' },
  { diagnosis: 'Mild pulpitis', color: '#F5A623' },
  { diagnosis: 'Severe pulpitis', color: '#E74C3C' },
  { diagnosis: 'Pulp necrosis', color: '#8E44AD' },
];

export function PersonalStats({ casos }: PersonalStatsProps) {
  const last12Months = getLast12MonthsData(casos);
  const treatmentStats = getTreatmentSuccessStats(casos);
  const diagnosisDistribution = getDiagnosisDistribution(casos);

  return (
    <div className="space-y-10">
      <h2 className="text-2xl font-semibold tracking-tight">Estadísticas personales</h2>
      
      <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl rounded-xl shadow-lg shadow-black/10 p-6 transition-all duration-300 hover:shadow-xl">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-5 h-5" style={{ color: '#3A7AFE' }} />
          <h3 className="text-lg font-semibold tracking-tight">Casos por mes (últimos 12 meses)</h3>
        </div>
        {last12Months.length > 0 ? (
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={last12Months}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.3} />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 11, fill: '#A6A6A6' }}
                axisLine={{ stroke: '#E5E7EB' }}
              />
              <YAxis 
                tick={{ fontSize: 11, fill: '#A6A6A6' }}
                axisLine={{ stroke: '#E5E7EB' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#3A7AFE" 
                strokeWidth={3}
                dot={{ fill: '#3A7AFE', r: 4 }}
                activeDot={{ r: 6 }}
                animationDuration={800}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-zinc-400 text-center py-12">
            No hay datos suficientes para mostrar
          </p>
        )}
      </div>

      <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl rounded-xl shadow-lg shadow-black/10 p-6 transition-all duration-300 hover:shadow-xl">
        <div className="flex items-center gap-2 mb-6">
          <Target className="w-5 h-5" style={{ color: '#2ECC71' }} />
          <h3 className="text-lg font-semibold tracking-tight">Éxito por tipo de tratamiento</h3>
        </div>
        {treatmentStats.length > 0 ? (
          <div className="space-y-6">
            {treatmentStats.map((stat, idx) => (
              <div key={stat.treatment} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium truncate pr-2">{stat.treatment}</span>
                  <span className="text-sm font-semibold whitespace-nowrap" style={{ color: '#2ECC71' }}>
                    {stat.successRate}% ({stat.successfulCases}/{stat.casesWithControls})
                  </span>
                </div>
                <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="h-2.5 rounded-full transition-all duration-700 ease-out" 
                    style={{ 
                      width: `${stat.successRate}%`,
                      backgroundColor: '#2ECC71'
                    }}
                  />
                </div>
                <p className="text-xs text-zinc-400">
                  {stat.totalCases} {stat.totalCases === 1 ? 'caso total' : 'casos totales'}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-zinc-400 text-center py-12">
            No hay datos de tratamientos con controles
          </p>
        )}
      </div>

      <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl rounded-xl shadow-lg shadow-black/10 p-6 transition-all duration-300 hover:shadow-xl">
        <div className="flex items-center gap-2 mb-6">
          <PieChartIcon className="w-5 h-5" style={{ color: '#B983FF' }} />
          <h3 className="text-lg font-semibold tracking-tight">Distribución por diagnóstico pulpar (AAE/ESE 2025)</h3>
        </div>
        {diagnosisDistribution.length > 0 ? (
          <div className="flex flex-col lg:flex-row items-center gap-6">
            <ResponsiveContainer width="100%" height={320} className="lg:flex-1">
              <PieChart>
                <Pie
                  data={diagnosisDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={{
                    stroke: '#A6A6A6',
                    strokeWidth: 1
                  }}
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                  outerRadius={110}
                  innerRadius={55}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="diagnosis"
                  animationDuration={800}
                  strokeWidth={2}
                  stroke="#fff"
                >
                  {diagnosisDistribution.map((entry) => (
                    <Cell 
                      key={`cell-${entry.diagnosis}`} 
                      fill={PULPAR_DIAGNOSES_AAE_ESE_2025[entry.diagnosis]?.color || '#A6A6A6'} 
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number, name: string) => [`${value} casos`, name]}
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="flex flex-col gap-3 lg:w-56">
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-1">Leyenda AAE/ESE 2025</p>
              {LEGEND_ORDER.map((item) => {
                const count = diagnosisDistribution.find(d => d.diagnosis === item.diagnosis)?.count || 0;
                return (
                  <div key={item.diagnosis} className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full flex-shrink-0" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-zinc-700 dark:text-zinc-300 flex-1">
                      {item.diagnosis}
                    </span>
                    <span className="text-sm font-medium text-zinc-500">
                      {count > 0 ? count : '-'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="text-sm text-zinc-400 text-center py-12">
            No hay diagnósticos pulpares registrados
          </p>
        )}
      </div>
    </div>
  );
}

function getLast12MonthsData(casos: ClinicoCase[]): MonthlyStats[] {
  const monthCounts = new Map<string, number>();
  const now = new Date();
  
  const last12Months: string[] = [];
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    last12Months.push(key);
    monthCounts.set(key, 0);
  }
  
  casos.forEach(caso => {
    const dateStr = caso.registro_fecha || caso.date;
    if (dateStr) {
      const monthKey = getMonthKey(dateStr);
      if (monthCounts.has(monthKey)) {
        monthCounts.set(monthKey, (monthCounts.get(monthKey) || 0) + 1);
      }
    }
  });
  
  return last12Months.map(monthKey => ({
    month: getMonthLabel(monthKey),
    count: monthCounts.get(monthKey) || 0
  }));
}

function getTreatmentSuccessStats(casos: ClinicoCase[]): TreatmentStats[] {
  const treatmentMap = new Map<string, { total: number; withControls: number; successful: number }>();
  
  casos.forEach(caso => {
    const treatment = caso.tto_realizado || caso.tto_propuesto;
    if (!treatment || treatment.trim() === '') return;
    
    if (!treatmentMap.has(treatment)) {
      treatmentMap.set(treatment, { total: 0, withControls: 0, successful: 0 });
    }
    
    const stats = treatmentMap.get(treatment)!;
    stats.total++;
    
    const controls = [
      toNumber(caso.control_1m_exito),
      toNumber(caso.control_3m_exito),
      toNumber(caso.control_6m_exito)
    ].filter(c => c !== 0);
    
    if (controls.length > 0) {
      stats.withControls++;
      if (controls.every(c => c === 1)) {
        stats.successful++;
      }
    }
  });
  
  return Array.from(treatmentMap.entries())
    .map(([treatment, stats]) => ({
      treatment,
      totalCases: stats.total,
      casesWithControls: stats.withControls,
      successfulCases: stats.successful,
      successRate: stats.withControls > 0 ? Math.round((stats.successful / stats.withControls) * 100) : 0
    }))
    .filter(stat => stat.casesWithControls > 0)
    .sort((a, b) => b.totalCases - a.totalCases);
}

function getDiagnosisDistribution(casos: ClinicoCase[]): DiagnosisDistribution[] {
  const diagnosisCount = new Map<string, number>();
  
  casos.forEach(caso => {
    if (caso.AEDE_pulpar_IA && caso.AEDE_pulpar_IA.trim() !== '') {
      const rawDiagnosis = caso.AEDE_pulpar_IA.trim();
      const normalized = PULPAR_DIAGNOSES_AAE_ESE_2025[rawDiagnosis]?.label || rawDiagnosis;
      diagnosisCount.set(normalized, (diagnosisCount.get(normalized) || 0) + 1);
    }
  });
  
  const orderedDiagnoses = LEGEND_ORDER.map(item => item.diagnosis);
  
  return Array.from(diagnosisCount.entries())
    .map(([diagnosis, count]) => ({ diagnosis, count }))
    .sort((a, b) => {
      const indexA = orderedDiagnoses.indexOf(a.diagnosis);
      const indexB = orderedDiagnoses.indexOf(b.diagnosis);
      if (indexA === -1 && indexB === -1) return b.count - a.count;
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });
}
