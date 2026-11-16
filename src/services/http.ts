// Cliente HTTP mínimo: timeout, erro tipado e corpo sempre como `unknown`
// (quem chama valida o formato antes de usar).
import { config } from '../config/env';

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number | null,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function requisitar(
  caminho: string,
  opcoes: { method?: 'GET' | 'POST'; body?: object } = {},
): Promise<unknown> {
  const controle = new AbortController();
  const timer = setTimeout(() => controle.abort(), config.timeoutMs);
  try {
    const resposta = await fetch(`${config.apiUrl}${caminho}`, {
      method: opcoes.method ?? 'GET',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: opcoes.body ? JSON.stringify(opcoes.body) : undefined,
      signal: controle.signal,
    });
    if (!resposta.ok) {
      throw new ApiError(`A API respondeu com erro ${resposta.status}.`, resposta.status);
    }
    return (await resposta.json()) as unknown;
  } catch (erro: unknown) {
    if (erro instanceof ApiError) throw erro;
    if (erro instanceof Error && erro.name === 'AbortError') {
      throw new ApiError('A API demorou demais para responder.', null);
    }
    throw new ApiError('Não foi possível conectar à API. Verifique a rede.', null);
  } finally {
    clearTimeout(timer);
  }
}

/** Mensagem amigável para qualquer erro capturado. */
export function mensagemDeErro(erro: unknown): string {
  if (erro instanceof Error) return erro.message;
  return 'Ocorreu um erro inesperado.';
}

/** Simula a latência da rede no modo demonstração. */
export function aguardar(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
