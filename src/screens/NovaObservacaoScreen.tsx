// Tela 4: formulário validado que cria uma observação de campo, com localização opcional.
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text } from 'react-native';

import Botao from '../components/Botao';
import CampoTexto from '../components/CampoTexto';
import CapturaLocalizacao from '../components/CapturaLocalizacao';
import SeletorOpcoes from '../components/SeletorOpcoes';
import { useIdentificacao } from '../context/IdentificacaoContext';
import { mensagemDeErro } from '../services/http';
import { criarObservacao } from '../services/observacoesService';
import { cores, espaco } from '../theme';
import { ROTULO_TIPO_OBSERVACAO, TIPOS_OBSERVACAO, type Coordenadas, type TipoObservacao } from '../types/models';
import type { ScreenProps } from '../types/navigation';
import { DESCRICAO_MAX, validarObservacao, type Erros, type FormObservacao } from '../validation/validacoes';

export default function NovaObservacaoScreen({ route, navigation }: ScreenProps<'NovaObservacao'>) {
  const { areaId, nomeArea } = route.params;
  const { identificacao } = useIdentificacao();
  const [tipo, setTipo] = useState<TipoObservacao | null>(null);
  const [descricao, setDescricao] = useState('');
  const [coordenadas, setCoordenadas] = useState<Coordenadas | null>(null);
  const [erros, setErros] = useState<Erros<keyof FormObservacao>>({});
  const [salvando, setSalvando] = useState(false);

  async function salvar() {
    const resultado = validarObservacao({ tipo, descricao });
    if (!resultado.valido) {
      setErros(resultado.erros);
      return;
    }
    setErros({});
    setSalvando(true);
    try {
      await criarObservacao({
        areaId,
        tipo: resultado.dados.tipo,
        descricao: resultado.dados.descricao,
        autor: identificacao?.nome ?? 'Não identificado',
        coordenadas,
      });
      navigation.goBack();
    } catch (erro: unknown) {
      Alert.alert('Não foi possível salvar', mensagemDeErro(erro));
      setSalvando(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
        <Text style={styles.area}>{nomeArea}</Text>

        <SeletorOpcoes
          rotulo="Tipo de observação"
          opcoes={TIPOS_OBSERVACAO}
          rotulos={ROTULO_TIPO_OBSERVACAO}
          valor={tipo}
          onChange={setTipo}
          erro={erros.tipo}
        />
        <CampoTexto
          rotulo={`Descrição (${descricao.trim().length}/${DESCRICAO_MAX})`}
          value={descricao}
          onChangeText={setDescricao}
          placeholder="O que você observou em campo?"
          multiline
          maxLength={DESCRICAO_MAX + 50}
          erro={erros.descricao}
        />
        <CapturaLocalizacao coordenadas={coordenadas} onChange={setCoordenadas} />

        <Botao titulo="Salvar observação" onPress={salvar} carregando={salvando} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  conteudo: { padding: espaco.lg },
  area: { fontSize: 15, fontWeight: '600', color: cores.textoSuave, marginBottom: espaco.lg },
});
