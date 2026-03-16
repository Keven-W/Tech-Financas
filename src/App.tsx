import { useState, useEffect } from 'react';
import {
  getTransactions,
  addTransaction,
  deleteTransaction,
  clearAllTransactions,
  Transaction,
} from './utils/storage';
import TransactionForm from './components/TransactionForm';
import TransactionTable from './components/TransactionTable';
import ExportSheet from './components/ExportSheet';

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [hasFilter, setHasFilter] = useState(false);

  useEffect(() => {
    const loadedTransactions = getTransactions();
    setTransactions(loadedTransactions);
    setFilteredTransactions(loadedTransactions);
  }, []);

  useEffect(() => {
    if (selectedMonth) {
      const filtered = transactions.filter((t) => {
        const transactionMonth = t.date.substring(0, 7);
        return transactionMonth === selectedMonth;
      });
      setFilteredTransactions(filtered);
      setHasFilter(true);
    } else {
      setFilteredTransactions(transactions);
      setHasFilter(false);
    }
  }, [selectedMonth, transactions]);

  const handleAddTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = addTransaction(transaction);
    setTransactions([...transactions, newTransaction]);
  };

  const handleDeleteTransaction = (id: string) => {
    deleteTransaction(id);
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const handleClearAll = () => {
    clearAllTransactions();
    setTransactions([]);
  };

  const handleClearFilter = () => {
    setSelectedMonth('');
    setHasFilter(false);
  };

  const totalGanhos = filteredTransactions
    .filter((t) => t.type === 'ganho')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalGastos = filteredTransactions
    .filter((t) => t.type === 'gasto')
    .reduce((sum, t) => sum + t.amount, 0);

  const saldo = totalGanhos - totalGastos;
  const incomePercent =
    totalGanhos > 0 ? (totalGanhos / (totalGanhos + totalGastos)) * 100 : 50;
  const expensePercent = 100 - incomePercent;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative overflow-hidden">
      <div className="coin-animation"></div>
      <div className="coin-animation" style={{ animationDelay: '2s' }}></div>
      <div className="coin-animation" style={{ animationDelay: '4s' }}></div>
      <div className="coin-animation" style={{ animationDelay: '1s' }}></div>
      <div className="coin-animation" style={{ animationDelay: '3s' }}></div>

      <div className="container mx-auto px-4 py-8 relative z-10 max-w-7xl">
        <header className="text-center mb-12">
          <h1 className="title-3d text-6xl font-bold mb-4">
            <span className="text-gradient">Tech Finanças</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Controle suas finanças com estilo
          </p>
        </header>

        <div className="mb-8">
          <div className="bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-700">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Filtrar por Mês
            </label>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full md:w-auto px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-slate-100 transition-all"
            />
          </div>
        </div>

        <TransactionForm onAddTransaction={handleAddTransaction} />

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card-glass income-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-300">Ganhos</span>
            </div>
            <p className="text-3xl font-bold text-emerald-400">
              R$ {totalGanhos.toFixed(2).replace('.', ',')}
            </p>
          </div>

          <div className="card-glass expense-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-300">Gastos</span>
            </div>
            <p className="text-3xl font-bold text-red-400">
              R$ {totalGastos.toFixed(2).replace('.', ',')}
            </p>
          </div>

          <div className="card-glass balance-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-300">Saldo</span>
            </div>
            <p
              className={`text-3xl font-bold ${
                saldo >= 0 ? 'text-yellow-400' : 'text-red-400'
              }`}
            >
              R$ {saldo.toFixed(2).replace('.', ',')}
            </p>
          </div>
        </div>

        <div className="card-glass mb-8">
          <h2 className="text-2xl font-bold mb-6 text-yellow-400">
            Visão Geral
          </h2>
          <div className="chart-container">
            <svg viewBox="0 0 200 200" className="w-full max-w-xs mx-auto">
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke="#10b981"
                strokeWidth="40"
                strokeDasharray={`${incomePercent * 5.026} 502.6`}
                transform="rotate(-90 100 100)"
                className="chart-income"
              />
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke="#ef4444"
                strokeWidth="40"
                strokeDasharray={`${expensePercent * 5.026} 502.6`}
                strokeDashoffset={`-${incomePercent * 5.026}`}
                transform="rotate(-90 100 100)"
                className="chart-expense"
              />
              <circle cx="100" cy="100" r="60" fill="#1f2937" />
              <text
                x="100"
                y="95"
                textAnchor="middle"
                className="text-2xl font-bold fill-yellow-400"
              >
                {saldo >= 0 ? '+' : ''}
              </text>
              <text
                x="100"
                y="115"
                textAnchor="middle"
                className="text-lg font-bold fill-white"
              >
                {Math.abs(saldo).toFixed(0)}
              </text>
            </svg>
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-emerald-400 pulse-glow"></div>
                <span className="text-sm text-gray-300">
                  Ganhos {incomePercent.toFixed(0)}%
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-400 pulse-glow"></div>
                <span className="text-sm text-gray-300">
                  Gastos {expensePercent.toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <TransactionTable
          transactions={filteredTransactions}
          onDeleteTransaction={handleDeleteTransaction}
        />

        <ExportSheet
          transactions={filteredTransactions}
          onClearAll={handleClearAll}
          onClearFilter={handleClearFilter}
          hasFilter={hasFilter}
        />
      </div>
    </div>
  );
}

export default App;
