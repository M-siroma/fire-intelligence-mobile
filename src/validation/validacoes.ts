// Validação PURA: só recebe dados e devolve erros. Não usa React, rede nem armazenamento,
// então pode ser testada isoladamente e reaproveitada.
import {
  FUNCOES,
  TIPOS_OBSERVACAO,
  type FuncaoUsuario,
  type Identificacao,
  type TipoObservacao,
} from '../types/models';

export type Erros<Campos extends string> = Partial<Record<Campos, string>>;

export type ResultadoValidacao<T, Campos extends string> =
  | { valido: true; dados: T }
  | { valido: false; erros: Erros<Campos> };

// ---------- Identificação ----------

export interface FormIdentificacao {
  nome: string;
  funcao: FuncaoUsuario | null;
  equipe: string;
}

export function validarIdentificacao(
  form: FormIdentificacao,
): ResultadoValidacao<Identificacao, keyof FormIdentificacao> {
  const erros: Erros<keyof FormIdentificacao> = {};
  const nome = form.nome.trim().replace(/\s+/g, ' ');
  const equipe = form.equipe.trim();

  if (nome.length < 3) erros.nome = 'Informe seu nome (mínimo 3 letras).';
  else if (nome.length > 60) erros.nome = 'Use no máximo 60 caracteres.';
  else if (!/^[\p{L} '.-]+$/u.test(nome)) erros.nome = 'Use apenas letras no nome.';

  if (form.funcao === null || !FUNCOES.includes(form.funcao)) erros.funcao = 'Escolha sua função.';

  if (equipe.length < 2) erros.equipe = 'Informe a equipe ou brigada.';
  else if (equipe.length > 60) erros.equipe = 'Use no máximo 60 caracteres.';

  if (Object.keys(erros).length > 0 || form.funcao === null) return { valido: false, erros };
  return { valido: true, dados: { nome, funcao: form.funcao, equipe } };
}

// ---------- Observação de campo ----------

export const DESCRICAO_MIN = 10;
export const DESCRICAO_MAX = 500;

export interface FormObservacao {
  tipo: TipoObservacao | null;
  descricao: string;
}

export function validarObservacao(
  form: FormObservacao,
): ResultadoValidacao<{ tipo: TipoObservacao; descricao: string }, keyof FormObservacao> {
  const erros: Erros<keyof FormObservacao> = {};
  const descricao = form.descricao.trim();

  if (form.tipo === null || !TIPOS_OBSERVACAO.includes(form.tipo)) {
    erros.tipo = 'Escolha o tipo da observação.';
  }
  if (descricao.length < DESCRICAO_MIN) {
    erros.descricao = `Descreva com pelo menos ${DESCRICAO_MIN} caracteres.`;
  } else if (descricao.length > DESCRICAO_MAX) {
    erros.descricao = `Use no máximo ${DESCRICAO_MAX} caracteres.`;
  }

  if (Object.keys(erros).length > 0 || form.tipo === null) return { valido: false, erros };
  return { valido: true, dados: { tipo: form.tipo, descricao } };
}
