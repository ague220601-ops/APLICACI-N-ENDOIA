import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from "recharts";
import { LongitudinalPAI } from "@/lib/radiographs";

interface GraficaPAIProps {
  data: LongitudinalPAI[];
}

export function GraficaPAI({ data }: GraficaPAIProps) {
  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-zinc-400">
        <p>No hay datos de PAI longitudinal disponibles</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 p-4 rounded-lg shadow">
      <h3 className="font-bold text-lg mb-4">Evolución PAI: Baseline → Follow-up</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
          <XAxis 
            dataKey="case_id" 
            tick={{ fontSize: 10, fill: '#A6A6A6' }}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis 
            domain={[0, 5]} 
            tick={{ fontSize: 11, fill: '#A6A6A6' }}
            label={{ value: 'PAI', angle: -90, position: 'insideLeft', fontSize: 12 }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.95)', 
              border: 'none',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
            formatter={(value: number, name: string) => [
              value, 
              name === 'baseline' ? 'PAI Baseline' : 'PAI Follow-up'
            ]}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="baseline" 
            stroke="#8884d8" 
            name="PAI Baseline" 
            strokeWidth={2}
            dot={{ fill: '#8884d8', r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey="followup" 
            stroke="#82ca9d" 
            name="PAI Follow-up" 
            strokeWidth={2}
            dot={{ fill: '#82ca9d', r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
      
      <div className="mt-4 grid grid-cols-3 gap-4 text-center text-sm">
        <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
          <p className="font-medium text-green-700 dark:text-green-400">Mejoría</p>
          <p className="text-2xl font-bold text-green-600">
            {data.filter(d => d.delta > 0).length}
          </p>
        </div>
        <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
          <p className="font-medium text-yellow-700 dark:text-yellow-400">Sin cambio</p>
          <p className="text-2xl font-bold text-yellow-600">
            {data.filter(d => d.delta === 0).length}
          </p>
        </div>
        <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded">
          <p className="font-medium text-red-700 dark:text-red-400">Empeoramiento</p>
          <p className="text-2xl font-bold text-red-600">
            {data.filter(d => d.delta < 0).length}
          </p>
        </div>
      </div>
    </div>
  );
}
