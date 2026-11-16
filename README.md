# Fire Intelligence — App do Brigadista

App mobile da CitizenTech **Fire Intelligence** (FIAP Global Solution 2026.2), feito em React Native + Expo com TypeScript estrito.

> O Fire Intelligence apoia a análise. Ele **não autoriza queimadas**, não declara áreas seguras para queima e não substitui avaliação de campo, profissionais habilitados, licenças ou protocolos oficiais.

## Ficha da CitizenTech

| Campo | Conteúdo |
|---|---|
| Nome da CitizenTech | Fire Intelligence |
| Cidade e bairro | Alto Paraíso de Goiás (GO): Vila de São Jorge e entorno do Parque Nacional da Chapada dos Veadeiros |
| Cidadão beneficiado | Brigadistas comunitários e voluntários da região, representados pela persona **Carla** (descrita abaixo) |
| Problema, em uma frase | Quem planeja o manejo do fogo precisa consultar várias bases separadas para entender uma única área, e o que é visto em campo se perde em grupos de mensagem sem localização. |
| Como funciona | O usuário escolhe uma área de estudo e recebe um diagnóstico com indicadores, fontes e limitações. Em campo, registra observações com a localização do celular. |
| O que este app faz | É a porta de entrada do brigadista: lista as áreas, mostra o diagnóstico de cada uma e registra observações de campo com GPS. |
| Indicador de impacto | **Tempo para reunir as informações de uma área antes de planejar uma ação**, em minutos. Medido com a persona e com usuários de teste, cronometrando o processo manual (BDQueimadas do INPE, MapBiomas e limites de UCs) e a consulta no app. Meta: menos de 5 minutos no app. Indicador secundário: % das observações de campo registradas com coordenadas. |
| ODS conectados | ODS 13 (ação contra a mudança do clima): apoia o planejamento do manejo integrado do fogo. ODS 11 (cidades e comunidades sustentáveis): organiza informação ambiental do território para quem atua nele. |
| Repositório | https://github.com/M-siroma/fire-intelligence-mobile |

### Persona e situações de uso

> **Persona fictícia**, construída pela equipe a partir do problema descrito no Projeto-Piloto. Não representa uma pessoa real.

**Carla, 34 anos, brigadista voluntária em São Jorge.** Trabalha como condutora de turismo e, na estação seca, atua numa brigada comunitária. Usa o celular em campo, muitas vezes com sinal fraco.

**Situação 1: preparar a ronda da semana.** Antes de sair, Carla precisa saber como está a área que vai percorrer. Hoje ela abre o site do INPE, filtra os focos, tenta lembrar onde fica o limite do parque e pergunta no grupo da brigada. No app, ela abre o "Entorno da Vila de São Jorge" e vê, numa tela, os focos de calor no período, a sobreposição com a unidade de conservação e o que **não** tem dados, com o motivo.

**Situação 2: registrar o que viu.** Durante a ronda, Carla encontra um trecho de capim seco acumulado perto de uma trilha. Antes, mandaria uma foto no grupo e a informação se perderia. No app, ela registra uma observação "Vegetação seca", descreve o local e toca em "Usar minha localização". A observação fica salva com coordenadas, data e o nome dela.

**Situação 3: sem permissão de localização.** O celular de um colega está com a localização bloqueada. O app avisa, oferece abrir as configurações e deixa salvar a observação mesmo sem coordenadas, para o registro não se perder.

**Situação 4: entender o limite da ferramenta.** Um morador pergunta se pode queimar o pasto porque o app mostra "0 focos" em Cavalcante. Carla mostra o aviso do diagnóstico: um foco é uma detecção por satélite, e o app não autoriza queimadas nem indica áreas seguras para queima.

## Integrantes

| Nome | RM |
|---|---|
| Arthur Gomes | 560771 |
| Luiz Silva | 560110 |
| Matheus Siroma | 560248 |
| Pedro Estevam | 560642 |

Os mesmos nomes estão no array `authors` do `package.json`.

## Funcionalidades

| Requisito | Onde está |
|---|---|
| 3 ou mais telas com navegação | Identificação, Áreas, Diagnóstico da área e Nova observação (`src/screens`), em pilha tipada (`src/navigation`) |
| Lista com carregando, erro e vazio | Tela de Áreas (`AreasScreen.tsx`), com "Tentar de novo" e puxar para atualizar |
| Formulário validado que cria um item | Nova observação (`NovaObservacaoScreen.tsx`), validado por `src/validation/validacoes.ts` |
| Identificação lembrada ao reabrir | `IdentificacaoContext.tsx` + `identificacaoService.ts` (AsyncStorage) |
| Recurso nativo com permissão tratada | Localização com `expo-location` (`localizacaoService.ts` e `CapturaLocalizacao.tsx`): permitida, negada, negada sem poder perguntar de novo (abre as configurações), GPS desligado e erro |
| TypeScript estrito, sem `any` | `"strict": true` no `tsconfig.json`; `npx tsc --noEmit` sem erros |

## Como rodar

Pré-requisitos: Node.js 20 ou mais novo e o app **Expo Go** no celular (Android ou iOS), na mesma rede Wi-Fi do computador.

```bash
npm install
npx expo start
```

Leia o QR code com o Expo Go (Android) ou com a câmera (iOS).

Para conferir a tipagem:

```bash
npm run typecheck
```

### Modo demonstração e API

Sem configuração, o app roda em **modo demonstração**: usa áreas e diagnósticos de exemplo, marcados na tela como **simulados**, e guarda as observações no próprio aparelho.

Para ligar à API FastAPI do Fire Intelligence, copie `.env.example` para `.env` e preencha:

```
EXPO_PUBLIC_API_URL=http://IP-DO-COMPUTADOR:8000
```

Use o IP do computador na rede (não `localhost`, que no celular aponta para o próprio celular). Reinicie com `npx expo start -c`.

Para mostrar os estados da lista no vídeo, no modo demonstração:

```
EXPO_PUBLIC_CENARIO_DEMO=erro    # ou: vazio | normal
```

## Contrato esperado da API

Os services (`src/services`) esperam estas rotas. Toda resposta é validada em `parsers.ts` antes de chegar às telas.

| Método e rota | Resposta |
|---|---|
| `GET /areas` | `AreaResumo[]`: `id`, `nome`, `municipio`, `areaHa`, `atualizadoEm` |
| `GET /areas/{id}/diagnostico` | `Diagnostico`: `areaId`, `geradoEm`, `indicadores[]`, `lacunas[]` |
| `GET /areas/{id}/observacoes` | `Observacao[]` |
| `POST /areas/{id}/observacoes` | Corpo `NovaObservacao`; resposta `Observacao` criada |

Os tipos completos estão em `src/types/models.ts`.

## Estrutura

```
App.tsx                 Providers e navegação
src/
  screens/              As 4 telas
  components/           Componentes de interface reutilizáveis
  navigation/           Pilha de navegação tipada
  context/              Identificação do usuário
  services/             API, armazenamento local, localização e leitura das respostas
  validation/           Validação pura dos formulários
  types/                Modelos e rotas tipados
  data/                 Dados simulados do modo demonstração
  utils/                Formatação de datas e números
```

## Dados

Nenhum dado pessoal real é usado. No modo demonstração os números são simulados e identificados como tal. Os dados reais virão da API do piloto, a partir dos focos de calor do INPE (Programa Queimadas).

## Documentos

- [DECISOES.md](DECISOES.md): decisões técnicas e por quê.
- [prompts.md](prompts.md): registro do uso de IA, exigido pelo edital.
