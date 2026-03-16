import { formatCurrency } from '../utils/currency';
import { Transaction } from '../utils/storage';
import { Trash2 } from 'lucide-react';

interface TransactionTableProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
}

const TransactionTable = ({
  transactions,
  onDeleteTransaction,
}: TransactionTableProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('pt-BR');
  };

  const sortedTransactions = [...transactions].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  if (sortedTransactions.length === 0) {
    return (
      <div className="bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-700 mb-8">
        <h2 className="text-2xl font-bold mb-4 text-slate-100">
          Histórico de transações
        </h2>
        <p className="text-slate-400 text-center py-8">
          Nenhuma transação registrada ainda.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-xl shadow-lg p-6 overflow-x-auto border border-slate-700 mb-8">
      <h2 className="text-2xl font-bold mb-6 text-slate-100">
        Histórico de transações
      </h2>

      <table className="w-full">
        <thead>
          <tr className="border-b-2 border-slate-700">
            <th className="text-left py-4 px-4 text-slate-300 font-semibold">
              Data
            </th>
            <th className="text-left py-4 px-4 text-slate-300 font-semibold">
              Categoria
            </th>
            <th className="text-left py-4 px-4 text-slate-300 font-semibold">
              Tipo
            </th>
            <th className="text-right py-4 px-4 text-slate-300 font-semibold">
              Valor
            </th>
            <th className="text-center py-4 px-4 text-slate-300 font-semibold">
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedTransactions.map((transaction, index) => (
            <tr
              key={transaction.id}
              className={`border-b border-slate-700 hover:bg-slate-700/50 transition-all duration-200 ${
                index % 2 === 0 ? 'bg-slate-900/30' : ''
              }`}
            >
              <td className="py-4 px-4 text-slate-300">
                {formatDate(transaction.date)}
              </td>

              <td className="py-4 px-4 text-slate-200 font-medium">
                {transaction.category}
              </td>

              <td className="py-4 px-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    transaction.type === 'ganho'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {transaction.type === 'ganho' ? 'Ganho' : 'Gasto'}
                </span>
              </td>

              <td
                className={`py-4 px-4 text-right font-bold text-lg ${
                  transaction.type === 'ganho'
                    ? 'text-green-400'
                    : 'text-red-400'
                }`}
              >
                {formatCurrency(transaction.amount)}
              </td>

              <td className="py-4 px-4 text-center">
                <button
                  onClick={() => onDeleteTransaction(transaction.id)}
                  className="text-red-400 hover:text-red-300 transition-all duration-200 p-2 hover:bg-red-500/20 rounded-lg hover:scale-110"
                  title="Excluir transação"
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
