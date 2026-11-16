// Áreas de estudo e diagnósticos. Usa a API quando EXPO_PUBLIC_API_URL está definida;
// senão, usa os dados simulados do modo demonstração.
import { config } from '../config/env';
import { AREAS_DEMO, DIAGNOSTICOS_DEMO } from '../data/mockData';
import type { AreaResumo, Diagnostico } from '../types/models';
import { aguardar, ApiError, requisitar } from './http';
import { lerAreas, lerDiagnostico } from './parsers';

export async function listarAreas(): Promise<AreaResumo[]> {
  if (config.usaApi) {
    return lerAreas(await requisitar('/areas'));
  }
  await aguardar(800);
  if (config.cenarioDemo === 'erro') {
    throw new ApiError('Não foi possível conectar à API. Verifique a rede.', null);
  }
  if (config.cenarioDemo === 'vazio') return [];
  return AREAS_DEMO;
}

export async function buscarDiagnostico(areaId: string): Promise<Diagnostico> {
  if (config.usaApi) {
    return lerDiagnostico(await requisitar(`/areas/${encodeURIComponent(areaId)}/diagnostico`));
  }
  await aguardar(600);
  const diagnostico = DIAGNOSTICOS_DEMO[areaId];
  if (!diagnostico) throw new ApiError('Diagnóstico não encontrado para esta área.', 404);
  return diagnostico;
}
