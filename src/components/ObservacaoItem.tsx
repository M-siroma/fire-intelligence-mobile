import { StyleSheet, Text, View } from 'react-native';

import { cores, espaco } from '../theme';
import { ROTULO_TIPO_OBSERVACAO, type Observacao } from '../types/models';
import { formatarCoordenadas, formatarDataHora } from '../utils/formatacao';

export default function ObservacaoItem({ observacao }: { observacao: Observacao }) {
  return (
    <View style={styles.cartao}>
      <View style={styles.topo}>
        <Text style={styles.tipo}>{ROTULO_TIPO_OBSERVACAO[observacao.tipo]}</Text>
        <Text style={styles.data}>{formatarDataHora(observacao.criadaEm)}</Text>
      </View>
      <Text style={styles.descricao}>{observacao.descricao}</Text>
      <Text style={styles.meta}>Por {observacao.autor}</Text>
      <Text style={styles.meta}>
        {observacao.coordenadas ? formatarCoordenadas(observacao.coordenadas) : 'Sem localização'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  cartao: {
    backgroundColor: cores.superficie,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: cores.borda,
    padding: espaco.md,
    gap: espaco.xs,
  },
  topo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tipo: {
    color: cores.primaria,
    backgroundColor: cores.primariaSuave,
    fontWeight: '700',
    fontSize: 12,
    paddingHorizontal: espaco.sm,
    paddingVertical: 2,
    borderRadius: 999,
    overflow: 'hidden',
  },
  data: { fontSize: 12, color: cores.textoSuave },
  descricao: { fontSize: 14, lineHeight: 20, color: cores.texto },
  meta: { fontSize: 12, color: cores.textoSuave },
});
