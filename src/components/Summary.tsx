import { formatCurrency } from '../utils/currency';
import { Transaction } from '../utils/storage';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

// Propriedades do componente
interface SummaryProps {
  transactions: Transaction[];
}

// Componente que exibe o resumo financeiro
const Summary = ({ transactions }: SummaryProps) => {
  // Calcular total de ganhos (somar todas transações do tipo "ganho")
  const totalGanhos = transactions
    .filter((t) => t.type === 'ganho')
    .reduce((sum, t) => sum + t.amount, 0);

  // Calcular total de gastos (somar todas transações do tipo "gasto")
  const totalGastos = transactions
    .filter((t) => t.type === 'gasto')
    .reduce((sum, t) => sum + t.amount, 0);

  // Calcular saldo (ganhos - gastos)
  const saldo = totalGanhos - totalGastos;

  // Definir cor do saldo (verde se positivo, vermelho se negativo)
  const saldoColor = saldo >= 0 ? 'text-green-600' : 'text-red-600';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Card de Ganhos */}
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 font-medium">Total de Ganhos</p>
            <p className="text-2xl font-bold text-green-600 mt-1">
              {formatCurrency(totalGanhos)}
            </p>
          </div>
          <div className="bg-green-100 p-3 rounded-full">
            <TrendingUp className="text-green-600" size={24} />
          </div>
        </div>
      </div>

      {/* Card de Gastos */}
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 font-medium">Total de Gastos</p>
            <p className="text-2xl font-bold text-red-600 mt-1">
              {formatCurrency(totalGastos)}
            </p>
          </div>
          <div className="bg-red-100 p-3 rounded-full">
            <TrendingDown className="text-red-600" size={24} />
          </div>
        </div>
      </div>

      {/* Card de Saldo */}
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 font-medium">Saldo Final</p>
            <p className={`text-2xl font-bold mt-1 ${saldoColor}`}>
              {formatCurrency(saldo)}
            </p>
          </div>
          <div className="bg-blue-100 p-3 rounded-full">
            <DollarSign className="text-blue-600" size={24} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;
