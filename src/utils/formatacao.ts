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

export function formatarDataHora(iso: string): string {
  const data = new Date(iso);
  if (Number.isNaN(data.getTime())) return '-';
  const hora = String(data.getHours()).padStart(2, '0');
  const minuto = String(data.getMinutes()).padStart(2, '0');
  return `${formatarData(iso)} ${hora}:${minuto}`;
}

export function formatarCoordenadas(c: { latitude: number; longitude: number; precisaoM: number | null }): string {
  const base = `${c.latitude.toFixed(5)}, ${c.longitude.toFixed(5)}`;
  return c.precisaoM === null ? base : `${base} (±${Math.round(c.precisaoM)} m)`;
}

export function formatarHectares(ha: number): string {
  return `${formatarNumero(ha)} ha`;
}
