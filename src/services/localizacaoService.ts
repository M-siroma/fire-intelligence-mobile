// Recurso nativo: localização do aparelho (expo-location), com a permissão tratada.
import * as Location from 'expo-location';
import { Linking } from 'react-native';

import type { Coordenadas } from '../types/models';

/** Resultado possível ao pedir a localização. A tela decide o que mostrar em cada caso. */
export type ResultadoLocalizacao =
  | { tipo: 'ok'; coordenadas: Coordenadas }
  | { tipo: 'negada'; podePerguntarDeNovo: boolean }
  | { tipo: 'gps_desligado' }
  | { tipo: 'erro'; mensagem: string };

export async function obterLocalizacaoAtual(): Promise<ResultadoLocalizacao> {
  try {
    const permissao = await Location.requestForegroundPermissionsAsync();
    if (permissao.status !== 'granted') {
      return { tipo: 'negada', podePerguntarDeNovo: permissao.canAskAgain };
    }
    if (!(await Location.hasServicesEnabledAsync())) {
      return { tipo: 'gps_desligado' };
    }
    const posicao = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    return {
      tipo: 'ok',
      coordenadas: {
        latitude: posicao.coords.latitude,
        longitude: posicao.coords.longitude,
        precisaoM: posicao.coords.accuracy,
      },
    };
  } catch {
    return { tipo: 'erro', mensagem: 'Não foi possível obter a localização agora.' };
  }
}

/** Abre as configurações do app para o usuário liberar a permissão manualmente. */
export function abrirConfiguracoes(): Promise<void> {
  return Linking.openSettings();
}
