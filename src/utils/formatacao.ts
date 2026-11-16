// Formatação de valores para exibição (funções puras).

export function formatarData(iso: string): string {
  const data = new Date(iso);
  if (Number.isNaN(data.getTime())) return '-';
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  return `${dia}/${mes}/${data.getFullYear()}`;
}

/**
 * Número no padrão brasileiro: milhar com ponto, decimal com vírgula.
 * Feito à mão para não depender do suporte a Intl no aparelho.
 */
export function formatarNumero(valor: number, casasDecimais = 0): string {
  const [inteiro, decimal] = valor.toFixed(casasDecimais).split('.');
  const comMilhar = inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return decimal ? `${comMilhar},${decimal}` : comMilhar;
}

export function formatarHectares(ha: number): string {
  return `${formatarNumero(ha)} ha`;
}
