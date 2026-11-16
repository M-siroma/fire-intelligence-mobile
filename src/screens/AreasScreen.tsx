// Tela 2: lista de áreas de estudo, com os estados carregando, erro e vazio.
import { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';

import AreaItem from '../components/AreaItem';
import AvisoModoDemo from '../components/AvisoModoDemo';
import { Carregando, Erro, Vazio } from '../components/EstadoTela';
import { useIdentificacao } from '../context/IdentificacaoContext';
import { listarAreas } from '../services/areasService';
import { mensagemDeErro } from '../services/http';
import { cores, espaco } from '../theme';
import { ROTULO_FUNCAO, type AreaResumo } from '../types/models';
import type { ScreenProps } from '../types/navigation';

/** Estado da lista: só um caso vale por vez, o que evita combinações impossíveis. */
type EstadoLista =
  | { status: 'carregando' }
  | { status: 'erro'; mensagem: string }
  | { status: 'pronto'; areas: AreaResumo[] };

export default function AreasScreen({ navigation }: ScreenProps<'Areas'>) {
  const { identificacao, sair } = useIdentificacao();
  const [estado, setEstado] = useState<EstadoLista>({ status: 'carregando' });
  const [atualizando, setAtualizando] = useState(false);

  const carregar = useCallback(async () => {
    try {
      const areas = await listarAreas();
      setEstado({ status: 'pronto', areas });
    } catch (erro: unknown) {
      setEstado({ status: 'erro', mensagem: mensagemDeErro(erro) });
    }
  }, []);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  function tentarDeNovo() {
    setEstado({ status: 'carregando' });
    void carregar();
  }

  async function atualizar() {
    setAtualizando(true);
    await carregar();
    setAtualizando(false);
  }

  function trocarIdentificacao() {
    Alert.alert('Trocar identificação', 'Deseja sair e informar outro usuário?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: () => void sair() },
    ]);
  }

  const cabecalho = identificacao && (
    <View style={styles.usuario}>
      <View style={styles.flex}>
        <Text style={styles.ola}>Olá, {identificacao.nome}</Text>
        <Text style={styles.detalhe}>
          {ROTULO_FUNCAO[identificacao.funcao]} · {identificacao.equipe}
        </Text>
      </View>
      <Pressable accessibilityRole="button" onPress={trocarIdentificacao} hitSlop={8}>
        <Text style={styles.trocar}>Trocar</Text>
      </Pressable>
    </View>
  );

  return (
    <View style={styles.flex}>
      <AvisoModoDemo />
      {cabecalho}
      {estado.status === 'carregando' && <Carregando mensagem="Carregando áreas de estudo..." />}
      {estado.status === 'erro' && <Erro mensagem={estado.mensagem} onTentarDeNovo={tentarDeNovo} />}
      {estado.status === 'pronto' && (
        <FlatList
          data={estado.areas}
          keyExtractor={(area) => area.id}
          renderItem={({ item }) => (
            <AreaItem
              area={item}
              onPress={(area) => navigation.navigate('AreaDetalhe', { areaId: area.id, nome: area.nome })}
            />
          )}
          contentContainerStyle={estado.areas.length === 0 ? styles.listaVazia : styles.lista}
          ItemSeparatorComponent={() => <View style={styles.separador} />}
          refreshControl={
            <RefreshControl refreshing={atualizando} onRefresh={atualizar} colors={[cores.primaria]} />
          }
          ListEmptyComponent={
            <Vazio
              titulo="Nenhuma área de estudo"
              mensagem="Ainda não há áreas cadastradas. Puxe a lista para baixo para atualizar."
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  usuario: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: espaco.lg,
    paddingVertical: espaco.md,
    backgroundColor: cores.superficie,
    borderBottomWidth: 1,
    borderBottomColor: cores.borda,
  },
  ola: { fontSize: 16, fontWeight: '700', color: cores.texto },
  detalhe: { marginTop: 2, fontSize: 13, color: cores.textoSuave },
  trocar: { color: cores.primaria, fontWeight: '600' },
  lista: { padding: espaco.lg },
  listaVazia: { flexGrow: 1 },
  separador: { height: espaco.md },
});
