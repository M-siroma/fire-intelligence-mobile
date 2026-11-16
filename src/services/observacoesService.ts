// Observações de campo. Com API: GET/POST /areas/{id}/observacoes.
// No modo demonstração: guardadas no aparelho com AsyncStorage.
import AsyncStorage from '@react-native-async-storage/async-storage';

import { config } from '../config/env';
import type { NovaObservacao, Observacao } from '../types/models';
import { requisitar } from './http';
import { lerObservacao, lerObservacoes } from './parsers';

const chave = (areaId: string) => `@fire-intelligence/observacoes/${areaId}`;

async function lerLocais(areaId: string): Promise<Observacao[]> {
  const bruto = await AsyncStorage.getItem(chave(areaId));
  if (!bruto) return [];
  try {
    return lerObservacoes(JSON.parse(bruto) as unknown);
  } catch {
    // Dado corrompido no aparelho: descarta em vez de quebrar a tela.
    return [];
  }
}

export async function listarObservacoes(areaId: string): Promise<Observacao[]> {
  if (config.usaApi) {
    return lerObservacoes(await requisitar(`/areas/${encodeURIComponent(areaId)}/observacoes`));
  }
  return lerLocais(areaId);
}

export async function criarObservacao(nova: NovaObservacao): Promise<Observacao> {
  if (config.usaApi) {
    const resposta = await requisitar(`/areas/${encodeURIComponent(nova.areaId)}/observacoes`, {
      method: 'POST',
      body: nova,
    });
    return lerObservacao(resposta);
  }
  const criada: Observacao = {
    ...nova,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    criadaEm: new Date().toISOString(),
  };
  const atuais = await lerLocais(nova.areaId);
  await AsyncStorage.setItem(chave(nova.areaId), JSON.stringify([criada, ...atuais]));
  return criada;
}
