import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { cores, espaco } from '../theme';

interface Props {
  titulo: string;
  onPress: () => void;
  variante?: 'primario' | 'secundario';
  carregando?: boolean;
  desabilitado?: boolean;
}

export default function Botao({ titulo, onPress, variante = 'primario', carregando = false, desabilitado = false }: Props) {
  const primario = variante === 'primario';
  const inativo = desabilitado || carregando;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: inativo, busy: carregando }}
      onPress={onPress}
      disabled={inativo}
      style={({ pressed }) => [
        styles.base,
        primario ? styles.primario : styles.secundario,
        (pressed || inativo) && styles.apagado,
      ]}
    >
      {carregando ? (
        <ActivityIndicator color={primario ? '#FFFFFF' : cores.primaria} />
      ) : (
        <Text style={[styles.texto, !primario && styles.textoSecundario]}>{titulo}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    borderRadius: 10,
    paddingHorizontal: espaco.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primario: { backgroundColor: cores.primaria },
  secundario: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: cores.primaria },
  apagado: { opacity: 0.6 },
  texto: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  textoSecundario: { color: cores.primaria },
});
