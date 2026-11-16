# Decisões técnicas — Fire Intelligence Mobile

Este documento registra as principais escolhas do app e o motivo de cada uma.

## 1. Público e escopo do app

O app é a porta de entrada do **brigadista em campo**. Ele não tenta repetir a plataforma web (mapa, recorte de polígonos, processamento geoespacial). Faz três coisas: mostrar as áreas de estudo, apresentar o diagnóstico de cada uma e registrar observações de campo com a localização do celular. Assim o app usa a mesma CitizenTech das outras disciplinas sem virar um projeto paralelo.

## 2. Expo Go + React Navigation (native stack)

Usamos Expo (SDK 58) para rodar direto no Expo Go, sem build nativo. Para a navegação escolhemos `@react-navigation/native-stack` em vez do Expo Router porque a lista de rotas e seus parâmetros fica explícita em um único tipo (`RootStackParamList`). Navegar para `AreaDetalhe` sem `areaId` é erro de compilação. WebView não é usado em nenhuma tela.

## 3. Identificação lembrada com Context + AsyncStorage

A identificação (nome, função e equipe) é salva com AsyncStorage e carregada quando o app abre. Um Context distribui esse dado para as telas. O navegador mostra só a tela de Identificação quando não há ninguém salvo; depois de entrar, essa tela deixa de existir na pilha, então o botão voltar não leva de volta a ela. Os dados ficam só no aparelho: não há senha, porque o objetivo é saber quem registrou a observação, não autenticar.

## 4. Camada de services com modo demonstração

As telas nunca chamam `fetch` nem AsyncStorage diretamente. Tudo passa por `src/services`. Cada service decide a origem dos dados:

- com `EXPO_PUBLIC_API_URL` definida, chama a API FastAPI do piloto;
- sem ela, usa dados de exemplo (modo demonstração) e salva as observações no aparelho.

Motivo: o backend é desenvolvido em paralelo pela equipe, e a apresentação não pode depender de um serviço externo (regra do próprio piloto). Trocar de modo não muda nenhuma tela.

## 5. Tipagem sem `any`: respostas tratadas como `unknown`

O cliente HTTP devolve `unknown`. Funções em `parsers.ts` conferem cada campo e só então devolvem o tipo do modelo (`AreaResumo`, `Diagnostico`, `Observacao`). Se a API mudar o formato, o erro aparece na tela de erro com uma mensagem clara, em vez de quebrar a interface mais adiante. O mesmo vale para os dados lidos do AsyncStorage, que podem estar corrompidos.

## 6. Estados de tela como união discriminada

Listas e diagnóstico usam um único estado com `status: 'carregando' | 'erro' | 'pronto'`. Assim é impossível ter "carregando" e "erro" ao mesmo tempo, e o TypeScript só deixa acessar os dados quando o status é `pronto`. A lista vazia é tratada dentro de `pronto`, com o `ListEmptyComponent` do FlatList.

## 7. Validação pura

`src/validation/validacoes.ts` recebe os valores do formulário e devolve `{ valido: true, dados }` ou `{ valido: false, erros }`. Não importa React, rede nem armazenamento. Isso separa a regra da tela, permite testar a função sozinha e garante que o service só recebe dados já limpos (texto aparado, tipo garantido).

## 8. Recurso nativo: localização

Escolhemos a localização (`expo-location`) em vez da câmera porque a coordenada é o que dá valor à observação: indica onde o brigadista viu vegetação seca, fumaça ou área queimada, e é o mesmo tipo de dado (ponto geográfico) que o backend já cruza com os polígonos. A permissão é pedida só quando o usuário toca em "Usar minha localização", e cada resposta tem tratamento próprio:

- concedida: mostra coordenadas e precisão;
- negada: avisa que a observação pode ser salva sem coordenadas;
- negada sem poder perguntar de novo: oferece abrir as configurações do aparelho;
- GPS desligado e erro inesperado: mensagem específica.

A localização é **opcional** de propósito: uma permissão negada não pode impedir o registro em campo.

## 9. Nada de dados inventados

Seguindo a regra do piloto, nenhum indicador classifica risco. Cada um mostra fonte, período, unidade, método e limitação. Quando falta dado, aparece "Sem dados suficientes" com o motivo. No modo demonstração os números são simulados e isso está escrito na tela (faixa amarela e texto da fonte). O aviso de posicionamento ("não autoriza queimadas") aparece em todo diagnóstico.

## 10. O que ficou de fora

- **Mapa:** exigiria `react-native-maps` e chave de mapa; o mapa já existe na versão web. O app mostra as coordenadas em texto.
- **Câmera e fotos:** upload de imagem aumentaria o escopo do backend no prazo de nove dias.
- **Envio offline com sincronização:** no modo API, a observação só é salva com conexão.
