import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
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
    { name: 'Ganhos', value: totalGanhos, percentage: 0 },
    { name: 'Gastos', value: totalGastos, percentage: 0 },
  ];

  // Calcular percentuais
  const total = totalGanhos + totalGastos;
  if (total > 0) {
    data[0].percentage = (totalGanhos / total) * 100;
    data[1].percentage = (totalGastos / total) * 100;
  }

  // Filtrar apenas dados com valor maior que zero
  const chartData = data.filter((item) => item.value > 0);

  // Se não houver dados, mostrar mensagem
  if (chartData.length === 0) {
    return (
      <div className="bg-slate-800 rounded-xl shadow-lg p-6 mb-8 border border-slate-700">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
          Tech-Finanças
        </h2>
        <div className="h-64 flex items-center justify-center text-slate-400">
          Nenhuma transação registrada ainda
        </div>
      </div>
    );
  }

  // Renderizar label customizado
  const renderLabel = (entry: any) => {
    return `${entry.percentage.toFixed(1)}%`;
  };

  // Renderizar tooltip customizado
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 p-4 border border-yellow-400 rounded-lg shadow-2xl">
          <p className="font-semibold text-slate-100 mb-1">{payload[0].name}</p>
          <p className="text-sm text-yellow-400 font-bold">{formatCurrency(payload[0].value)}</p>
          <p className="text-sm text-slate-400">
            {payload[0].payload.percentage.toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-800 rounded-xl shadow-lg p-6 mb-8 border border-slate-700">
      <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent animate-pulse">
        Tech-Finanças
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderLabel}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            animationBegin={0}
            animationDuration={800}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.name === 'Ganhos' ? COLORS.ganho : COLORS.gasto}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            wrapperStyle={{ color: '#cbd5e1' }}
            formatter={(value, entry: any) => {
              return `${value}: ${formatCurrency(entry.payload.value)}`;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FinanceChart;
