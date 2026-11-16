// Etapa 1: só a base do projeto. A navegação e as telas entram na Etapa 2.
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import { cores } from './src/theme';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Fire Intelligence</Text>
      <Text style={styles.subtitulo}>App do brigadista - em construção</Text>
      <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.fundo, alignItems: 'center', justifyContent: 'center' },
  titulo: { fontSize: 24, fontWeight: '700', color: cores.primaria },
  subtitulo: { marginTop: 8, color: cores.textoSuave },
});
