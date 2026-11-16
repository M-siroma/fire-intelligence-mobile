// Conversão de `unknown` (JSON da API ou do armazenamento) para os modelos tipados.
// Se o formato não bate, lança erro em vez de deixar dado inválido chegar à tela.
import {
  FUNCOES,
  TIPOS_OBSERVACAO,
  type AreaResumo,
  type Coordenadas,
  type Diagnostico,
  type FuncaoUsuario,
  type Identificacao,
  type Indicador,
  type Observacao,
  type TipoObservacao,
} from '../types/models';

type Objeto = Record<string, unknown>;

class FormatoInvalido extends Error {
  constructor(oQue: string) {
    super(`Resposta em formato inesperado: ${oQue}.`);
  }
}

function objeto(v: unknown, oQue: string): Objeto {
  if (typeof v !== 'object' || v === null || Array.isArray(v)) throw new FormatoInvalido(oQue);
  return v as Objeto;
}
function texto(o: Objeto, campo: string): string {
  const v = o[campo];
  if (typeof v !== 'string') throw new FormatoInvalido(campo);
  return v;
}
function numero(o: Objeto, campo: string): number {
  const v = o[campo];
  if (typeof v !== 'number' || Number.isNaN(v)) throw new FormatoInvalido(campo);
  return v;
}
function numeroOuNulo(o: Objeto, campo: string): number | null {
  return o[campo] === null || o[campo] === undefined ? null : numero(o, campo);
}
function lista(v: unknown, oQue: string): unknown[] {
  if (!Array.isArray(v)) throw new FormatoInvalido(oQue);
  return v;
}
function ehUmDe<T extends string>(valores: readonly T[], v: unknown): v is T {
  return typeof v === 'string' && (valores as readonly string[]).includes(v);
}

export function lerAreas(v: unknown): AreaResumo[] {
  return lista(v, 'lista de áreas').map((item) => {
    const o = objeto(item, 'área');
    return {
      id: texto(o, 'id'),
      nome: texto(o, 'nome'),
      municipio: texto(o, 'municipio'),
      areaHa: numero(o, 'areaHa'),
      atualizadoEm: texto(o, 'atualizadoEm'),
    };
  });
}

function lerIndicador(v: unknown): Indicador {
  const o = objeto(v, 'indicador');
  const situacao = o.situacao;
  if (situacao !== 'calculado' && situacao !== 'sem_dados') throw new FormatoInvalido('situacao');
  return {
    id: texto(o, 'id'),
    nome: texto(o, 'nome'),
    situacao,
    valor: numeroOuNulo(o, 'valor'),
    unidade: texto(o, 'unidade'),
    metodo: texto(o, 'metodo'),
    fonte: texto(o, 'fonte'),
    periodo: texto(o, 'periodo'),
    limitacao: texto(o, 'limitacao'),
    motivoSemDados: typeof o.motivoSemDados === 'string' ? o.motivoSemDados : undefined,
  };
}

export function lerDiagnostico(v: unknown): Diagnostico {
  const o = objeto(v, 'diagnóstico');
  return {
    areaId: texto(o, 'areaId'),
    geradoEm: texto(o, 'geradoEm'),
    indicadores: lista(o.indicadores, 'indicadores').map(lerIndicador),
    lacunas: lista(o.lacunas, 'lacunas').filter((l): l is string => typeof l === 'string'),
  };
}

function lerCoordenadas(v: unknown): Coordenadas | null {
  if (v === null || v === undefined) return null;
  const o = objeto(v, 'coordenadas');
  return {
    latitude: numero(o, 'latitude'),
    longitude: numero(o, 'longitude'),
    precisaoM: numeroOuNulo(o, 'precisaoM'),
  };
}

export function lerObservacao(v: unknown): Observacao {
  const o = objeto(v, 'observação');
  const tipo: unknown = o.tipo;
  if (!ehUmDe<TipoObservacao>(TIPOS_OBSERVACAO, tipo)) throw new FormatoInvalido('tipo');
  return {
    id: texto(o, 'id'),
    areaId: texto(o, 'areaId'),
    tipo,
    descricao: texto(o, 'descricao'),
    autor: texto(o, 'autor'),
    coordenadas: lerCoordenadas(o.coordenadas),
    criadaEm: texto(o, 'criadaEm'),
  };
}

export function lerObservacoes(v: unknown): Observacao[] {
  return lista(v, 'lista de observações').map(lerObservacao);
}

export function lerIdentificacao(v: unknown): Identificacao {
  const o = objeto(v, 'identificação');
  const funcao: unknown = o.funcao;
  if (!ehUmDe<FuncaoUsuario>(FUNCOES, funcao)) throw new FormatoInvalido('funcao');
  return { nome: texto(o, 'nome'), funcao, equipe: texto(o, 'equipe') };
}
