# Fire Intelligence — App do Brigadista

App mobile da CitizenTech **Fire Intelligence** (FIAP Global Solution 2026.2), feito em React Native + Expo com TypeScript estrito.

> O Fire Intelligence apoia a análise. Ele **não autoriza queimadas**, não declara áreas seguras para queima e não substitui avaliação de campo, profissionais habilitados, licenças ou protocolos oficiais.

## Ficha da CitizenTech

| Campo | Conteúdo |
|---|---|
| Nome da CitizenTech | Fire Intelligence |
| Cidade e bairro | Alto Paraíso de Goiás (GO), Chapada dos Veadeiros e entorno **[CONFIRMAR]** |
| Cidadão beneficiado | **[PREENCHER: brigadista, gestor ou pesquisador entrevistado pela equipe]** |
| Problema, em uma frase | Quem planeja o manejo do fogo precisa consultar várias bases separadas para entender uma única área. |
| Como funciona | O usuário escolhe uma área de estudo e recebe um diagnóstico com indicadores, fontes e limitações. Em campo, registra observações com a localização do celular. |
| O que este app faz | É a porta de entrada do brigadista: lista as áreas, mostra o diagnóstico de cada uma e registra observações de campo com GPS. |
| Indicador de impacto | **[PREENCHER: ex. tempo para reunir as informações de uma área, antes e depois]** |
| ODS conectados | ODS 13 (ação contra a mudança do clima): apoia o planejamento do manejo integrado do fogo. ODS 11 (cidades e comunidades sustentáveis): organiza informação ambiental do território para quem atua nele. |
| Repositório | **[PREENCHER: link do GitHub]** |

## Integrantes

| Nome | RM |
|---|---|
| **[PREENCHER]** | **[RM]** |
| **[PREENCHER]** | **[RM]** |
| **[PREENCHER]** | **[RM]** |
| **[PREENCHER]** | **[RM]** |

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
