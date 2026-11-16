// Tela 3: detalhe da área com o diagnóstico (indicadores, fontes, períodos, lacunas e limitações).
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';

import AvisoModoDemo from '../components/AvisoModoDemo';
import AvisoPosicionamento from '../components/AvisoPosicionamento';
import Botao from '../components/Botao';
import { Carregando, Erro, Vazio } from '../components/EstadoTela';
import IndicadorCard from '../components/IndicadorCard';
import ObservacaoItem from '../components/ObservacaoItem';
import { buscarDiagnostico } from '../services/areasService';
import { mensagemDeErro } from '../services/http';
import { listarObservacoes } from '../services/observacoesService';
import { cores, espaco } from '../theme';
import type { Diagnostico, Observacao } from '../types/models';
import type { ScreenProps } from '../types/navigation';
import { formatarData } from '../utils/formatacao';

type EstadoDiagnostico =
  | { status: 'carregando' }
  | { status: 'erro'; mensagem: string }
  | { status: 'pronto'; diagnostico: Diagnostico };

type EstadoObservacoes =
  | { status: 'carregando' }
  | { status: 'erro'; mensagem: string }
  | { status: 'pronto'; observacoes: Observacao[] };

export default function AreaDetalheScreen({ route, navigation }: ScreenProps<'AreaDetalhe'>) {
  const { areaId, nome } = route.params;
  const [estado, setEstado] = useState<EstadoDiagnostico>({ status: 'carregando' });
  const [observacoes, setObservacoes] = useState<EstadoObservacoes>({ status: 'carregando' });
  const [atualizando, setAtualizando] = useState(false);

  const carregarObservacoes = useCallback(async () => {
    try {
      setObservacoes({ status: 'pronto', observacoes: await listarObservacoes(areaId) });
    } catch (erro: unknown) {
      setObservacoes({ status: 'erro', mensagem: mensagemDeErro(erro) });
    }
  }, [areaId]);

  // Recarrega as observações sempre que a tela volta ao foco (ex.: depois de salvar uma nova).
  useFocusEffect(
    useCallback(() => {
      void carregarObservacoes();
    }, [carregarObservacoes]),
  );

  const carregar = useCallback(async () => {
    try {
      const diagnostico = await buscarDiagnostico(areaId);
      setEstado({ status: 'pronto', diagnostico });
    } catch (erro: unknown) {
      setEstado({ status: 'erro', mensagem: mensagemDeErro(erro) });
    }
  }, [areaId]);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  function tentarDeNovo() {
    setEstado({ status: 'carregando' });
    void carregar();
  }

  async function atualizar() {
    setAtualizando(true);
    await Promise.all([carregar(), carregarObservacoes()]);
    setAtualizando(false);
  }

  if (estado.status === 'carregando') return <Carregando mensagem="Carregando diagnóstico..." />;
  if (estado.status === 'erro') return <Erro mensagem={estado.mensagem} onTentarDeNovo={tentarDeNovo} />;

  const { diagnostico } = estado;

  return (
    <View style={styles.flex}>
      <AvisoModoDemo />
      <ScrollView
        contentContainerStyle={styles.conteudo}
        refreshControl={<RefreshControl refreshing={atualizando} onRefresh={atualizar} colors={[cores.primaria]} />}
      >
        <View>
          <Text style={styles.titulo}>{nome}</Text>
          <Text style={styles.subtitulo}>Diagnóstico gerado em {formatarData(diagnostico.geradoEm)}</Text>
        </View>

        <AvisoPosicionamento />

        <Text style={styles.secao}>Indicadores</Text>
        {diagnostico.indicadores.length === 0 ? (
          <Vazio titulo="Sem indicadores" mensagem="Nenhum indicador foi calculado para esta área." />
        ) : (
          diagnostico.indicadores.map((indicador) => <IndicadorCard key={indicador.id} indicador={indicador} />)
        )}

        <Text style={styles.secao}>Lacunas e limitações dos dados</Text>
        <View style={styles.cartao}>
          {diagnostico.lacunas.length === 0 ? (
            <Text style={styles.item}>Nenhuma lacuna registrada.</Text>
          ) : (
            diagnostico.lacunas.map((lacuna) => (
              <Text key={lacuna} style={styles.item}>
                • {lacuna}
              </Text>
            ))
          )}
        </View>

        <Text style={styles.secao}>Observações de campo</Text>
        <Botao
          titulo="Registrar observação"
          onPress={() => navigation.navigate('NovaObservacao', { areaId, nomeArea: nome })}
        />
        {observacoes.status === 'carregando' && <ActivityIndicator color={cores.primaria} />}
        {observacoes.status === 'erro' && (
          <Text style={styles.erro}>Não foi possível carregar as observações: {observacoes.mensagem}</Text>
        )}
        {observacoes.status === 'pronto' &&
          (observacoes.observacoes.length === 0 ? (
            <Text style={styles.vazio}>Nenhuma observação registrada nesta área ainda.</Text>
          ) : (
            observacoes.observacoes.map((obs) => <ObservacaoItem key={obs.id} observacao={obs} />)
          ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  conteudo: { padding: espaco.lg, gap: espaco.md },
  titulo: { fontSize: 22, fontWeight: '800', color: cores.texto },
  subtitulo: { marginTop: 2, fontSize: 13, color: cores.textoSuave },
  secao: { marginTop: espaco.sm, fontSize: 17, fontWeight: '700', color: cores.texto },
  cartao: {
    backgroundColor: cores.superficie,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: cores.borda,
    padding: espaco.lg,
    gap: espaco.sm,
  },
  item: { fontSize: 14, lineHeight: 20, color: cores.texto },
  erro: { color: cores.erro, fontSize: 14 },
  vazio: { color: cores.textoSuave, fontSize: 14, textAlign: 'center', paddingVertical: espaco.md },
});
