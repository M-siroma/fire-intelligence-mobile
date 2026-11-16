// Um indicador do diagnóstico, sempre com fonte, período, unidade, método e limitação.
// Quando não há dados, mostra "Sem dados suficientes" e o motivo, sem inventar valor.
import { StyleSheet, Text, View } from 'react-native';

import { cores, espaco } from '../theme';
import type { Indicador } from '../types/models';
import { formatarNumero } from '../utils/formatacao';

function Linha({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <View style={styles.linha}>
      <Text style={styles.rotulo}>{rotulo}</Text>
      <Text style={styles.valorLinha}>{valor}</Text>
    </View>
  );
}

export default function IndicadorCard({ indicador }: { indicador: Indicador }) {
  const semDados = indicador.situacao === 'sem_dados' || indicador.valor === null;
  const casas = indicador.unidade.includes('%') ? 1 : 0;

  return (
    <View style={styles.cartao}>
      <Text style={styles.nome}>{indicador.nome}</Text>

      {semDados ? (
        <View style={styles.semDados}>
          <Text style={styles.semDadosTitulo}>Sem dados suficientes</Text>
          {indicador.motivoSemDados !== undefined && (
            <Text style={styles.semDadosMotivo}>{indicador.motivoSemDados}</Text>
          )}
        </View>
      ) : (
        <Text style={styles.valor}>
          {formatarNumero(indicador.valor ?? 0, casas)} <Text style={styles.unidade}>{indicador.unidade}</Text>
        </Text>
      )}

      <Linha rotulo="Fonte" valor={indicador.fonte} />
      <Linha rotulo="Período" valor={indicador.periodo} />
      <Linha rotulo="Unidade" valor={indicador.unidade} />
      <Linha rotulo="Método" valor={indicador.metodo} />
      <Linha rotulo="Limitação" valor={indicador.limitacao} />
    </View>
  );
}

const styles = StyleSheet.create({
  cartao: {
    backgroundColor: cores.superficie,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: cores.borda,
    padding: espaco.lg,
    gap: espaco.sm,
  },
  nome: { fontSize: 16, fontWeight: '700', color: cores.texto },
  valor: { fontSize: 30, fontWeight: '800', color: cores.primaria },
  unidade: { fontSize: 15, fontWeight: '600', color: cores.textoSuave },
  semDados: { backgroundColor: cores.avisoFundo, borderRadius: 8, padding: espaco.md },
  semDadosTitulo: { fontWeight: '700', color: cores.aviso },
  semDadosMotivo: { marginTop: 2, fontSize: 13, color: cores.aviso },
  linha: { flexDirection: 'row', gap: espaco.sm },
  rotulo: { width: 72, fontSize: 13, fontWeight: '600', color: cores.textoSuave },
  valorLinha: { flex: 1, fontSize: 13, lineHeight: 18, color: cores.texto },
});
