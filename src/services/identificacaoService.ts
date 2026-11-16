// Identificação do usuário, lembrada ao reabrir o app (AsyncStorage).
import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Identificacao } from '../types/models';
import { lerIdentificacao } from './parsers';

const CHAVE = '@fire-intelligence/identificacao';

export async function carregarIdentificacao(): Promise<Identificacao | null> {
  const bruto = await AsyncStorage.getItem(CHAVE);
  if (!bruto) return null;
  try {
    return lerIdentificacao(JSON.parse(bruto) as unknown);
  } catch {
    await AsyncStorage.removeItem(CHAVE);
    return null;
  }
}

export async function salvarIdentificacao(identificacao: Identificacao): Promise<void> {
  await AsyncStorage.setItem(CHAVE, JSON.stringify(identificacao));
}

export async function limparIdentificacao(): Promise<void> {
  await AsyncStorage.removeItem(CHAVE);
}
