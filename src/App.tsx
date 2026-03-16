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
import FinanceChart from './components/FinanceChart';

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
      const filtered = transactions.filter((t) => t.date.substring(0, 7) === selectedMonth);
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

  // Cálculos básicos para os cards de cima
  const totalGanhos = filteredTransactions.filter(t => t.type === 'ganho').reduce((s, t) => s + t.amount, 0);
  const totalGastos = filteredTransactions.filter(t => t.type === 'gasto').reduce((s, t) => s + t.amount, 0);
  const saldo = totalGanhos - totalGastos;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative overflow-hidden">
      {/* Moedas animadas ao fundo */}
      {[...Array(5)].map((_, i) => (
        <div key={i} className="coin-animation" style={{ animationDelay: `${i * 1.5}s` }}></div>
      ))}

      <div className="container mx-auto px-4 py-8 relative z-10 max-w-7xl">
        <header className="text-center mb-12">
          <h1 className="title-3d text-6xl font-bold mb-4">
            <span className="text-gradient">Tech Finanças</span>
          </h1>
          <p className="text-gray-400 text-lg">Controle suas finanças com estilo</p>
        </header>

        {/* Filtro mensal */}
        <div className="mb-8">
          <div className="bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-700">
            <label className="block text-sm font-medium text-slate-300 mb-2">Filtrar por mês</label>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full md:w-auto px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-yellow-400 text-slate-100"
            />
          </div>
        </div>

        <TransactionForm onAddTransaction={handleAddTransaction} />

        {/* Cards de resumo */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card-glass border-l-4 border-emerald-500">
            <span className="text-gray-300 block mb-2">Ganhos</span>
            <p className="text-3xl font-bold text-emerald-400">R$ {totalGanhos.toLocaleString('pt-BR')}</p>
          </div>
          <div className="card-glass border-l-4 border-red-500">
            <span className="text-gray-300 block mb-2">Gastos</span>
            <p className="text-3xl font-bold text-red-400">R$ {totalGastos.toLocaleString('pt-BR')}</p>
          </div>
          <div className="card-glass border-l-4 border-yellow-500">
            <span className="text-gray-300 block mb-2">Saldo</span>
            <p className={`text-3xl font-bold ${saldo >= 0 ? 'text-yellow-400' : 'text-red-400'}`}>
              R$ {saldo.toLocaleString('pt-BR')}
            </p>
          </div>
        </div>

        {/* Gráfico da visão geral */}
        <div className="card-glass mb-8">
          <h2 className="text-2xl font-bold mb-6 text-yellow-400">Visão geral</h2>
          <FinanceChart transactions={filteredTransactions} />
        </div>

        <TransactionTable transactions={filteredTransactions} onDeleteTransaction={handleDeleteTransaction} />
        <ExportSheet transactions={filteredTransactions} onClearAll={handleClearAll} onClearFilter={handleClearFilter} hasFilter={hasFilter} />
      </div>
    </div>
  );
}

export default App;