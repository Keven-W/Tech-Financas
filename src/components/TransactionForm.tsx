import { useState } from 'react';
import { parseCurrency } from '../utils/currency';
import { Transaction } from '../utils/storage';

interface TransactionFormProps {
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
}

const TransactionForm = ({ onAddTransaction }: TransactionFormProps) => {
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'ganho' | 'gasto'>('ganho');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!date || !category || !amount) {
      setError('Todos os campos são obrigatórios');
      return;
    }

    const numericAmount = parseCurrency(amount);

    if (numericAmount <= 0) {
      setError('O valor deve ser maior que zero');
      return;
    }

    onAddTransaction({
      date,
      category,
      amount: numericAmount,
      type,
    });

    setDate('');
    setCategory('');
    setAmount('');
    setType('ganho');
  };

  return (
    <div className="bg-slate-800 rounded-xl shadow-lg p-6 mb-8 border border-slate-700">
      <h2 className="text-2xl font-bold mb-6 text-slate-100">
        Cadastrar Transação
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Data
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-slate-100 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Categoria
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Ex: Salário, Alimentação..."
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-slate-100 placeholder-slate-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Valor (R$)
            </label>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Ex: 1.500,00"
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-slate-100 placeholder-slate-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Tipo
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as 'ganho' | 'gasto')}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-slate-100 transition-all"
            >
              <option value="ganho">Ganho</option>
              <option value="gasto">Gasto</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 py-3 px-4 rounded-lg hover:from-yellow-500 hover:to-yellow-600 hover:scale-105 transition-all duration-300 font-bold shadow-lg hover:shadow-yellow-400/50"
        >
          Adicionar Transação
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;
