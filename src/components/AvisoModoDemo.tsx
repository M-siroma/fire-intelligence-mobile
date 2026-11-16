// Faixa exibida quando o app está sem API: deixa claro que os números são simulados.
import { StyleSheet, Text, View } from 'react-native';

import { config } from '../config/env';
import { cores, espaco } from '../theme';

export default function AvisoModoDemo() {
  if (config.usaApi) return null;
  return (
    <View style={styles.faixa}>
      <Text style={styles.texto}>Modo demonstração: dados simulados, sem conexão com a API.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  faixa: { backgroundColor: cores.avisoFundo, paddingVertical: espaco.sm, paddingHorizontal: espaco.lg },
  texto: { color: cores.aviso, fontSize: 13, textAlign: 'center' },
});
