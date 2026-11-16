import { Pressable, StyleSheet, Text, View } from 'react-native';

import { cores, espaco } from '../theme';
import type { AreaResumo } from '../types/models';
import { formatarData, formatarHectares } from '../utils/formatacao';

interface Props {
  area: AreaResumo;
  onPress?: (area: AreaResumo) => void;
}

export default function AreaItem({ area, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${area.nome}, ${area.municipio}`}
      disabled={onPress === undefined}
      onPress={() => onPress?.(area)}
      style={({ pressed }) => [styles.cartao, pressed && styles.pressionado]}
    >
      <Text style={styles.nome}>{area.nome}</Text>
      <Text style={styles.municipio}>{area.municipio}</Text>
      <View style={styles.rodape}>
        <Text style={styles.meta}>{formatarHectares(area.areaHa)}</Text>
        <Text style={styles.meta}>Atualizado em {formatarData(area.atualizadoEm)}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cartao: {
    backgroundColor: cores.superficie,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: cores.borda,
    padding: espaco.lg,
  },
  pressionado: { opacity: 0.7 },
  nome: { fontSize: 17, fontWeight: '700', color: cores.texto },
  municipio: { marginTop: 2, fontSize: 14, color: cores.textoSuave },
  rodape: { marginTop: espaco.md, flexDirection: 'row', justifyContent: 'space-between' },
  meta: { fontSize: 13, color: cores.primaria, fontWeight: '600' },
});
