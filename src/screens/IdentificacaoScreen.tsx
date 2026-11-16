// Tela 1: identificação do usuário. Os dados ficam salvos e o app pula esta tela ao reabrir.
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import Botao from '../components/Botao';
import CampoTexto from '../components/CampoTexto';
import SeletorOpcoes from '../components/SeletorOpcoes';
import { useIdentificacao } from '../context/IdentificacaoContext';
import { cores, espaco } from '../theme';
import { FUNCOES, ROTULO_FUNCAO, type FuncaoUsuario } from '../types/models';
import type { ScreenProps } from '../types/navigation';
import { validarIdentificacao, type Erros, type FormIdentificacao } from '../validation/validacoes';

export default function IdentificacaoScreen(_props: ScreenProps<'Identificacao'>) {
  const { entrar } = useIdentificacao();
  const [nome, setNome] = useState('');
  const [funcao, setFuncao] = useState<FuncaoUsuario | null>(null);
  const [equipe, setEquipe] = useState('');
  const [erros, setErros] = useState<Erros<keyof FormIdentificacao>>({});
  const [salvando, setSalvando] = useState(false);

  async function confirmar() {
    const resultado = validarIdentificacao({ nome, funcao, equipe });
    if (!resultado.valido) {
      setErros(resultado.erros);
      return;
    }
    setErros({});
    setSalvando(true);
    try {
      await entrar(resultado.dados);
    } catch {
      Alert.alert('Não foi possível salvar', 'Tente novamente.');
      setSalvando(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
        <View style={styles.cabecalho}>
          <Text style={styles.marca}>Fire Intelligence</Text>
          <Text style={styles.descricao}>
            Diagnóstico ambiental das áreas de estudo da Chapada dos Veadeiros e registro de observações de campo.
          </Text>
        </View>

        <CampoTexto
          rotulo="Seu nome"
          value={nome}
          onChangeText={setNome}
          placeholder="Ex.: Ana Souza"
          autoCapitalize="words"
          maxLength={60}
          erro={erros.nome}
        />
        <SeletorOpcoes
          rotulo="Função"
          opcoes={FUNCOES}
          rotulos={ROTULO_FUNCAO}
          valor={funcao}
          onChange={setFuncao}
          erro={erros.funcao}
        />
        <CampoTexto
          rotulo="Equipe ou brigada"
          value={equipe}
          onChangeText={setEquipe}
          placeholder="Ex.: Brigada Alto Paraíso"
          maxLength={60}
          erro={erros.equipe}
        />

        <Botao titulo="Entrar" onPress={confirmar} carregando={salvando} />
        <Text style={styles.nota}>Seus dados ficam salvos apenas neste aparelho.</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  conteudo: { padding: espaco.xl },
  cabecalho: { marginBottom: espaco.xl },
  marca: { fontSize: 28, fontWeight: '800', color: cores.primaria },
  descricao: { marginTop: espaco.sm, fontSize: 15, lineHeight: 21, color: cores.textoSuave },
  nota: { marginTop: espaco.md, textAlign: 'center', fontSize: 13, color: cores.textoSuave },
});
