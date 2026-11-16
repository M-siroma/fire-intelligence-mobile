// Configuração lida das variáveis EXPO_PUBLIC_* (arquivo .env na raiz do app).

export type CenarioDemo = 'normal' | 'erro' | 'vazio';

function lerCenario(valor: string | undefined): CenarioDemo {
  return valor === 'erro' || valor === 'vazio' ? valor : 'normal';
}

const apiUrl = process.env.EXPO_PUBLIC_API_URL?.trim() ?? '';

export const config = {
  /** URL da API FastAPI. Vazia = modo demonstração com dados locais simulados. */
  apiUrl: apiUrl.replace(/\/+$/, ''),
  usaApi: apiUrl.length > 0,
  /** Só vale no modo demonstração: força os estados de erro ou vazio da lista. */
  cenarioDemo: lerCenario(process.env.EXPO_PUBLIC_CENARIO_DEMO),
  timeoutMs: 8000,
} as const;
