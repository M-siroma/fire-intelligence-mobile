// Estados de tela reutilizáveis: carregando, erro (com tentar de novo) e vazio.
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { cores, espaco } from '../theme';
import Botao from './Botao';

export function Carregando({ mensagem = 'Carregando...' }: { mensagem?: string }) {
  return (
    <View style={styles.centro} accessibilityRole="progressbar" accessibilityLabel={mensagem}>
      <ActivityIndicator size="large" color={cores.primaria} />
      <Text style={styles.texto}>{mensagem}</Text>
    </View>
  );
}

export function Erro({ mensagem, onTentarDeNovo }: { mensagem: string; onTentarDeNovo: () => void }) {
  return (
    <View style={styles.centro} accessibilityRole="alert">
      <Text style={styles.titulo}>Algo deu errado</Text>
      <Text style={styles.texto}>{mensagem}</Text>
      <View style={styles.acao}>
        <Botao titulo="Tentar de novo" onPress={onTentarDeNovo} />
      </View>
    </View>
  );
}

export function Vazio({ titulo, mensagem }: { titulo: string; mensagem: string }) {
  return (
    <View style={styles.centro}>
      <Text style={styles.titulo}>{titulo}</Text>
      <Text style={styles.texto}>{mensagem}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: espaco.xl, gap: espaco.sm },
  titulo: { fontSize: 18, fontWeight: '700', color: cores.texto, textAlign: 'center' },
  texto: { fontSize: 15, color: cores.textoSuave, textAlign: 'center', lineHeight: 21 },
  acao: { marginTop: espaco.md, alignSelf: 'stretch' },
});
