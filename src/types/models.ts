// Modelos de domínio do app. Espelham as respostas da API do Fire Intelligence (FastAPI).

/** Identificação do usuário, lembrada entre aberturas do app. */
export interface Identificacao {
  nome: string;
  funcao: FuncaoUsuario;
  equipe: string;
}

export type FuncaoUsuario = 'brigadista' | 'gestor' | 'pesquisador';

export const FUNCOES: readonly FuncaoUsuario[] = ['brigadista', 'gestor', 'pesquisador'];

export const ROTULO_FUNCAO: Record<FuncaoUsuario, string> = {
  brigadista: 'Brigadista',
  gestor: 'Gestor ambiental',
  pesquisador: 'Pesquisador',
};

/** Item da lista de áreas de estudo (GET /areas). */
export interface AreaResumo {
  id: string;
  nome: string;
  municipio: string;
  areaHa: number;
  atualizadoEm: string; // ISO 8601
}

/** Situação de um indicador: calculado ou sem dados suficientes. */
export type SituacaoIndicador = 'calculado' | 'sem_dados';

/** Indicador descritivo do diagnóstico. Nunca classifica risco. */
export interface Indicador {
  id: string;
  nome: string;
  situacao: SituacaoIndicador;
  valor: number | null;
  unidade: string;
  metodo: string;
  fonte: string;
  periodo: string;
  limitacao: string;
  /** Preenchido quando situacao === 'sem_dados'. */
  motivoSemDados?: string;
}

/** Diagnóstico completo de uma área (GET /areas/{id}/diagnostico). */
export interface Diagnostico {
  areaId: string;
  geradoEm: string;
  indicadores: Indicador[];
  lacunas: string[];
}

export type TipoObservacao =
  | 'vegetacao_seca'
  | 'fumaca_avistada'
  | 'area_queimada'
  | 'aceiro_acesso'
  | 'outro';

export const TIPOS_OBSERVACAO: readonly TipoObservacao[] = [
  'vegetacao_seca',
  'fumaca_avistada',
  'area_queimada',
  'aceiro_acesso',
  'outro',
];

export const ROTULO_TIPO_OBSERVACAO: Record<TipoObservacao, string> = {
  vegetacao_seca: 'Vegetação seca',
  fumaca_avistada: 'Fumaça avistada',
  area_queimada: 'Área queimada',
  aceiro_acesso: 'Aceiro / acesso',
  outro: 'Outro',
};

export interface Coordenadas {
  latitude: number;
  longitude: number;
  precisaoM: number | null;
}

/** Observação de campo registrada pelo brigadista. */
export interface Observacao {
  id: string;
  areaId: string;
  tipo: TipoObservacao;
  descricao: string;
  autor: string;
  coordenadas: Coordenadas | null;
  criadaEm: string;
}

/** Dados enviados para criar uma observação (POST /areas/{id}/observacoes). */
export type NovaObservacao = Omit<Observacao, 'id' | 'criadaEm'>;
