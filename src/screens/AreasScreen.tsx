// Tela 2: lista de áreas de estudo. Nesta etapa só mostra quem está identificado;
// a lista com carregando/erro/vazio entra na Etapa 3.
import { Alert, StyleSheet, Text, View } from 'react-native';

import Botao from '../components/Botao';
import { useIdentificacao } from '../context/IdentificacaoContext';
import { cores, espaco } from '../theme';
import { ROTULO_FUNCAO } from '../types/models';
import type { ScreenProps } from '../types/navigation';

export default function AreasScreen(_props: ScreenProps<'Areas'>) {
  const { identificacao, sair } = useIdentificacao();

  function trocarIdentificacao() {
    Alert.alert('Trocar identificação', 'Deseja sair e informar outro usuário?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: () => void sair() },
    ]);
  }

  return (
    <View style={styles.container}>
      {identificacao && (
        <View style={styles.cartao}>
          <Text style={styles.ola}>Olá, {identificacao.nome}</Text>
          <Text style={styles.detalhe}>
            {ROTULO_FUNCAO[identificacao.funcao]} · {identificacao.equipe}
          </Text>
        </View>
      )}
      <Text style={styles.emBreve}>A lista de áreas entra na próxima etapa.</Text>
      <Botao titulo="Trocar identificação" variante="secundario" onPress={trocarIdentificacao} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: espaco.xl, gap: espaco.lg },
  cartao: { backgroundColor: cores.superficie, borderRadius: 12, padding: espaco.lg, borderWidth: 1, borderColor: cores.borda },
  ola: { fontSize: 20, fontWeight: '700', color: cores.texto },
  detalhe: { marginTop: espaco.xs, color: cores.textoSuave },
  emBreve: { color: cores.textoSuave },
});
