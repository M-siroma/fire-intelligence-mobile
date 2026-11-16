// Escolha única entre opções fixas (chips). Genérico no tipo do valor.
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { cores, espaco } from '../theme';

interface Props<T extends string> {
  rotulo: string;
  opcoes: readonly T[];
  rotulos: Record<T, string>;
  valor: T | null;
  onChange: (valor: T) => void;
  erro?: string;
}

export default function SeletorOpcoes<T extends string>({ rotulo, opcoes, rotulos, valor, onChange, erro }: Props<T>) {
  return (
    <View style={styles.container}>
      <Text style={styles.rotulo}>{rotulo}</Text>
      <View style={styles.linha} accessibilityRole="radiogroup">
        {opcoes.map((opcao) => {
          const selecionado = opcao === valor;
          return (
            <Pressable
              key={opcao}
              accessibilityRole="radio"
              accessibilityState={{ selected: selecionado }}
              onPress={() => onChange(opcao)}
              style={[styles.chip, selecionado && styles.chipSelecionado]}
            >
              <Text style={[styles.textoChip, selecionado && styles.textoSelecionado]}>{rotulos[opcao]}</Text>
            </Pressable>
          );
        })}
      </View>
      {erro !== undefined && <Text style={styles.erro}>{erro}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: espaco.lg },
  rotulo: { fontSize: 14, fontWeight: '600', color: cores.texto, marginBottom: espaco.sm },
  linha: { flexDirection: 'row', flexWrap: 'wrap', gap: espaco.sm },
  chip: {
    paddingHorizontal: espaco.md,
    paddingVertical: espaco.sm,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: cores.borda,
    backgroundColor: cores.superficie,
  },
  chipSelecionado: { backgroundColor: cores.primaria, borderColor: cores.primaria },
  textoChip: { color: cores.texto, fontSize: 14 },
  textoSelecionado: { color: '#FFFFFF', fontWeight: '600' },
  erro: { color: cores.erro, fontSize: 13, marginTop: espaco.xs },
});
