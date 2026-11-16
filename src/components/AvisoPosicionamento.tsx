// Aviso obrigatório do projeto: a ferramenta apoia a análise, não autoriza queimadas.
import { StyleSheet, Text, View } from 'react-native';

import { cores, espaco } from '../theme';

export default function AvisoPosicionamento() {
  return (
    <View style={styles.caixa} accessibilityRole="summary">
      <Text style={styles.titulo}>Importante</Text>
      <Text style={styles.texto}>
        Este diagnóstico é descritivo e apoia o planejamento. Ele não autoriza queimadas, não indica áreas
        seguras para queima e não substitui a avaliação de campo, profissionais habilitados, licenças ou
        protocolos oficiais.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  caixa: {
    backgroundColor: cores.primariaSuave,
    borderLeftWidth: 4,
    borderLeftColor: cores.primaria,
    borderRadius: 8,
    padding: espaco.md,
  },
  titulo: { fontWeight: '700', color: cores.primaria, marginBottom: espaco.xs },
  texto: { fontSize: 13, lineHeight: 19, color: cores.texto },
});
