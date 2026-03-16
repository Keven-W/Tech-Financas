import * as XLSX from 'xlsx';
import { Transaction } from '../utils/storage';
import { Download, Trash } from 'lucide-react';

// Propriedades do componente
interface ExportSheetProps {
  transactions: Transaction[];
  onClearAll: () => void;
  onClearFilter: () => void;
  hasFilter: boolean;
}

// Componente para exportar planilha e gerenciar dados
const ExportSheet = ({
  transactions,
  onClearAll,
  onClearFilter,
  hasFilter,
}: ExportSheetProps) => {
  // Função para gerar e baixar a planilha
  const handleExport = () => {
    if (transactions.length === 0) {
      alert('Não há transações para exportar');
      return;
    }

    // Formatar dados para a planilha
    const exportData = transactions.map((t) => ({
      Data: t.date,
      Categoria: t.category,
      Tipo: t.type === 'ganho' ? 'Ganho' : 'Gasto',
      Valor: t.amount,
    }));

    // Criar worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // Criar workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Transações');

    // Gerar arquivo e fazer download
    XLSX.writeFile(workbook, 'tech-financas-relatorio.xlsx');
  };

  // Função para limpar todo histórico com confirmação
  const handleClearAll = () => {
    if (transactions.length === 0) {
      alert('Não há transações para apagar');
      return;
    }

    const confirmed = window.confirm(
      'Tem certeza que deseja apagar todo o histórico? Esta ação não pode ser desfeita.'
    );

    if (confirmed) {
      onClearAll();
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl shadow-lg p-6 mb-6 border border-slate-700">
      <h2 className="text-2xl font-bold mb-4 text-slate-100">
        Gerenciar Dados
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={handleExport}
          className="flex items-center justify-center gap-2 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 hover:scale-105 transition-all duration-300 font-medium shadow-lg hover:shadow-green-400/50"
        >
          <Download size={20} />
          Gerar Planilha
        </button>

        <button
          onClick={onClearFilter}
          disabled={!hasFilter}
          className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-all duration-300 font-medium ${
            hasFilter
              ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 hover:from-yellow-500 hover:to-yellow-600 hover:scale-105 shadow-lg hover:shadow-yellow-400/50'
              : 'bg-slate-700 text-slate-500 cursor-not-allowed'
          }`}
        >
          Limpar Filtro
        </button>

        <button
          onClick={handleClearAll}
          className="flex items-center justify-center gap-2 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 hover:scale-105 transition-all duration-300 font-medium shadow-lg hover:shadow-red-400/50"
        >
          <Trash size={20} />
          Apagar Histórico
        </button>
      </div>
    </div>
  );
};

export default ExportSheet;
