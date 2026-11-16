// Formatação de valores para exibição (funções puras).

export function formatarData(iso: string): string {
  const data = new Date(iso);
  if (Number.isNaN(data.getTime())) return '-';
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  return `${dia}/${mes}/${data.getFullYear()}`;
}

export function formatarHectares(ha: number): string {
  // Separador de milhar com ponto, sem depender do suporte a Intl no aparelho.
  const inteiro = Math.round(ha).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${inteiro} ha`;
}
