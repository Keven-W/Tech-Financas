// Utilitário para formatação de valores monetários

// Formatar número para moeda brasileira (R$)
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

// Converter string com vírgula para número
// Exemplos: "1.500,50" -> 1500.50, "100,00" -> 100.00
export const parseCurrency = (value: string): number => {
  if (!value) return 0;

  // Remove pontos de milhar e substitui vírgula por ponto
  const normalized = value
    .replace(/\./g, '')
    .replace(',', '.');

  const parsed = parseFloat(normalized);
  return isNaN(parsed) ? 0 : parsed;
};

// Validar se o valor é um número válido
export const isValidCurrency = (value: string): boolean => {
  if (!value) return false;

  // Aceita formatos: 100, 100,50, 1.000,50
  const currencyPattern = /^\d{1,3}(\.\d{3})*(,\d{2})?$/;
  return currencyPattern.test(value);
};
