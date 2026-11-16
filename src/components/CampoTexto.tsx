import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { cores, espaco } from '../theme';

interface Props extends Omit<TextInputProps, 'style'> {
  rotulo: string;
  erro?: string;
}

export default function CampoTexto({ rotulo, erro, multiline, ...props }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.rotulo}>{rotulo}</Text>
      <TextInput
        accessibilityLabel={rotulo}
        placeholderTextColor={cores.textoSuave}
        multiline={multiline}
        style={[styles.input, multiline && styles.multilinha, erro !== undefined && styles.inputErro]}
        {...props}
      />
      {erro !== undefined && <Text style={styles.erro}>{erro}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: espaco.lg },
  rotulo: { fontSize: 14, fontWeight: '600', color: cores.texto, marginBottom: espaco.xs },
  input: {
    backgroundColor: cores.superficie,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 10,
    paddingHorizontal: espaco.md,
    paddingVertical: espaco.md,
    fontSize: 16,
    color: cores.texto,
  },
  multilinha: { minHeight: 110, textAlignVertical: 'top' },
  inputErro: { borderColor: cores.erro },
  erro: { color: cores.erro, fontSize: 13, marginTop: espaco.xs },
});
