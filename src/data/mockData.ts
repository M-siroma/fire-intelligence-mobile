// Dados do MODO DEMONSTRAÇÃO, usados enquanto o app não aponta para a API.
// Os valores numéricos são SIMULADOS e aparecem marcados assim na interface.
// Regra do piloto: nada aqui pode ser apresentado como dado real.
import type { AreaResumo, Diagnostico } from '../types/models';

const AVISO_SIMULADO = ' (valor simulado no modo demonstração)';

export const AREAS_DEMO: AreaResumo[] = [
  {
    id: 'chapada-norte',
    nome: 'Recorte Norte - Chapada dos Veadeiros',
    municipio: 'Alto Paraíso de Goiás (GO)',
    areaHa: 12450,
    atualizadoEm: '2026-11-13T12:00:00Z',
  },
  {
    id: 'sao-jorge',
    nome: 'Entorno da Vila de São Jorge',
    municipio: 'Alto Paraíso de Goiás (GO)',
    areaHa: 6830,
    atualizadoEm: '2026-11-13T12:00:00Z',
  },
  {
    id: 'cavalcante-sul',
    nome: 'Recorte Sul - Cavalcante',
    municipio: 'Cavalcante (GO)',
    areaHa: 9120,
    atualizadoEm: '2026-11-13T12:00:00Z',
  },
];

function diagnosticoDemo(areaId: string, focos: number, sobreposicaoPct: number | null): Diagnostico {
  return {
    areaId,
    geradoEm: '2026-11-13T12:00:00Z',
    indicadores: [
      {
        id: 'focos_periodo',
        nome: 'Focos de calor no período',
        situacao: 'calculado',
        valor: focos,
        unidade: 'focos',
        metodo: 'Contagem dos focos cuja coordenada cai dentro do polígono da área.',
        fonte: 'INPE, Programa Queimadas' + AVISO_SIMULADO,
        periodo: '01/01/2026 a 31/10/2026',
        limitacao:
          'Um foco é uma detecção por satélite, não um incêndio nem uma área queimada. A contagem depende do satélite considerado.',
      },
      {
        id: 'cobertura_terra',
        nome: 'Cobertura e uso da terra',
        situacao: 'sem_dados',
        valor: null,
        unidade: '% da área por classe',
        metodo: 'Recorte do mapa anual pelo polígono e participação de cada classe.',
        fonte: 'MapBiomas',
        periodo: '-',
        limitacao: 'Mapa anual com resolução de 30 m. Não representa a situação do dia.',
        motivoSemDados: 'O recorte do MapBiomas ainda não foi processado para esta área.',
      },
      sobreposicaoPct === null
        ? {
            id: 'sobreposicao_uc',
            nome: 'Sobreposição com unidades de conservação',
            situacao: 'sem_dados',
            valor: null,
            unidade: '% da área',
            metodo: 'Interseção entre o polígono e os limites oficiais das UCs.',
            fonte: 'Limites oficiais de UCs (fonte a confirmar)',
            periodo: '-',
            limitacao: 'Depende da versão do limite utilizado.',
            motivoSemDados: 'A fonte oficial dos limites de UCs ainda não foi definida.',
          }
        : {
            id: 'sobreposicao_uc',
            nome: 'Sobreposição com unidades de conservação',
            situacao: 'calculado',
            valor: sobreposicaoPct,
            unidade: '% da área',
            metodo: 'Área sobreposta dividida pela área do polígono.',
            fonte: 'Limites oficiais de UCs' + AVISO_SIMULADO,
            periodo: 'Limite vigente',
            limitacao: 'Depende da versão do limite utilizado.',
          },
    ],
    lacunas: [
      'Dados meteorológicos não fazem parte do piloto.',
      'Focos detectados por um único satélite de referência.',
    ],
  };
}

export const DIAGNOSTICOS_DEMO: Record<string, Diagnostico> = {
  'chapada-norte': diagnosticoDemo('chapada-norte', 37, 64.2),
  'sao-jorge': diagnosticoDemo('sao-jorge', 12, null),
  'cavalcante-sul': diagnosticoDemo('cavalcante-sul', 0, 18.5),
};
