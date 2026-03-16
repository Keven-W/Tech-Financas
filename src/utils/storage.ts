// Utilitário para gerenciar o localStorage
// Armazena e recupera transações financeiras

const STORAGE_KEY = 'tech-financas-transactions';

// Interface da transação
export interface Transaction {
  id: string;
  date: string;
  category: string;
  amount: number;
  type: 'ganho' | 'gasto';
}

// Buscar todas as transações do localStorage
export const getTransactions = (): Transaction[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Erro ao buscar transações:', error);
    return [];
  }
};

// Salvar transações no localStorage
export const saveTransactions = (transactions: Transaction[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch (error) {
    console.error('Erro ao salvar transações:', error);
  }
};

// Adicionar nova transação
export const addTransaction = (transaction: Omit<Transaction, 'id'>): Transaction => {
  const transactions = getTransactions();
  const newTransaction: Transaction = {
    ...transaction,
    id: Date.now().toString(),
  };
  transactions.push(newTransaction);
  saveTransactions(transactions);
  return newTransaction;
};

// Deletar transação por ID
export const deleteTransaction = (id: string): void => {
  const transactions = getTransactions();
  const filtered = transactions.filter((t) => t.id !== id);
  saveTransactions(filtered);
};

// Limpar todo histórico
export const clearAllTransactions = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
