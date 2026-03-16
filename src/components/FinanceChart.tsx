import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Transaction } from '../utils/storage';
import { formatCurrency } from '../utils/currency';

// Propriedades do componente
interface FinanceChartProps {
  transactions: Transaction[];
}

// Cores para o gráfico de pizza
const COLORS = {
  ganho: '#22c55e',
  gasto: '#ef4444',
};

// Componente de gráfico de pizza animado
const FinanceChart = ({ transactions }: FinanceChartProps) => {
  // Calcular totais de ganhos e gastos
  const totalGanhos = transactions
    .filter((t) => t.type === 'ganho')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalGastos = transactions
    .filter((t) => t.type === 'gasto')
    .reduce((sum, t) => sum + t.amount, 0);

    // Preparar dados para o gráfico
    const data = [
    { name: 'Ganhos', value: totalGanhos },
    { name: 'Gastos', value: totalGastos },
  ];

  // Calcular percentuais
  const total = totalGanhos + totalGastos;
  const chartData = data.filter((item) => item.value > 0);

  // Se não houver dados, mostrar mensagem
  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-400">
        Nenhuma transação registrada ainda.
      </div>
    );
  }

  // Renderizar tooltip customizado
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const percentage = ((payload[0].value / total) * 100).toFixed(1);
      return (
        <div className="bg-slate-900 p-4 border border-yellow-400 rounded-lg shadow-2xl">
          <p className="font-semibold text-slate-100 mb-1">{payload[0].name}</p>
          <p className="text-sm text-yellow-400 font-bold">{formatCurrency(payload[0].value)}</p>
          <p className="text-sm text-slate-400">{percentage}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={100}
            paddingAngle={8}
            dataKey="value"
            stroke="none"
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.name === 'Ganhos' ? COLORS.ganho : COLORS.gasto}
                className="recharts-sector-glow" 
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value) => <span className="text-slate-300 font-medium">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FinanceChart;