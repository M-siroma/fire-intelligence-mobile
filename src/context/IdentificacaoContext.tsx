// Guarda quem está usando o app e expõe entrar/sair para as telas.
// Ao abrir o app, lê a identificação salva no aparelho (lembrada ao reabrir).
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import {
  carregarIdentificacao,
  limparIdentificacao,
  salvarIdentificacao,
} from '../services/identificacaoService';
import type { Identificacao } from '../types/models';

interface IdentificacaoContextValor {
  identificacao: Identificacao | null;
  carregando: boolean;
  entrar: (identificacao: Identificacao) => Promise<void>;
  sair: () => Promise<void>;
}

const IdentificacaoContext = createContext<IdentificacaoContextValor | null>(null);

export function IdentificacaoProvider({ children }: { children: ReactNode }) {
  const [identificacao, setIdentificacao] = useState<Identificacao | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarIdentificacao()
      .then(setIdentificacao)
      .catch(() => setIdentificacao(null))
      .finally(() => setCarregando(false));
  }, []);

  const entrar = useCallback(async (nova: Identificacao) => {
    await salvarIdentificacao(nova);
    setIdentificacao(nova);
  }, []);

  const sair = useCallback(async () => {
    await limparIdentificacao();
    setIdentificacao(null);
  }, []);

  const valor = useMemo(
    () => ({ identificacao, carregando, entrar, sair }),
    [identificacao, carregando, entrar, sair],
  );

  return <IdentificacaoContext.Provider value={valor}>{children}</IdentificacaoContext.Provider>;
}

export function useIdentificacao(): IdentificacaoContextValor {
  const contexto = useContext(IdentificacaoContext);
  if (!contexto) throw new Error('useIdentificacao precisa estar dentro de IdentificacaoProvider.');
  return contexto;
}
