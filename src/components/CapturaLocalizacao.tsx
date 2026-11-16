// Recurso nativo: captura a localização do aparelho e mostra cada situação da permissão.
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { abrirConfiguracoes, obterLocalizacaoAtual, type ResultadoLocalizacao } from '../services/localizacaoService';
import { cores, espaco } from '../theme';
import type { Coordenadas } from '../types/models';
import { formatarCoordenadas } from '../utils/formatacao';
import Botao from './Botao';

interface Props {
  coordenadas: Coordenadas | null;
  onChange: (coordenadas: Coordenadas | null) => void;
}

export default function CapturaLocalizacao({ coordenadas, onChange }: Props) {
  const [buscando, setBuscando] = useState(false);
  const [problema, setProblema] = useState<Exclude<ResultadoLocalizacao, { tipo: 'ok' }> | null>(null);

  async function capturar() {
    setBuscando(true);
    setProblema(null);
    const resultado = await obterLocalizacaoAtual();
    setBuscando(false);
    if (resultado.tipo === 'ok') {
      onChange(resultado.coordenadas);
    } else {
      setProblema(resultado);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.rotulo}>Localização (opcional)</Text>

      {coordenadas !== null && (
        <View style={styles.sucesso}>
          <Text style={styles.sucessoTexto}>{formatarCoordenadas(coordenadas)}</Text>
          <Text style={styles.remover} onPress={() => onChange(null)} accessibilityRole="button">
            Remover
          </Text>
        </View>
      )}

      {problema?.tipo === 'negada' && (
        <View style={styles.alerta}>
          <Text style={styles.alertaTexto}>
            Permissão de localização negada. A observação pode ser salva sem coordenadas.
          </Text>
          {!problema.podePerguntarDeNovo && (
            <Text style={styles.link} onPress={() => void abrirConfiguracoes()} accessibilityRole="link">
              Abrir configurações para liberar
            </Text>
          )}
        </View>
      )}
      {problema?.tipo === 'gps_desligado' && (
        <View style={styles.alerta}>
          <Text style={styles.alertaTexto}>O GPS do aparelho está desligado. Ative a localização e tente de novo.</Text>
        </View>
      )}
      {problema?.tipo === 'erro' && (
        <View style={styles.alerta}>
          <Text style={styles.alertaTexto}>{problema.mensagem}</Text>
        </View>
      )}

      <Botao
        titulo={coordenadas === null ? 'Usar minha localização' : 'Atualizar localização'}
        variante="secundario"
        onPress={capturar}
        carregando={buscando}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: espaco.lg, gap: espaco.sm },
  rotulo: { fontSize: 14, fontWeight: '600', color: cores.texto },
  sucesso: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: cores.superficie,
    borderWidth: 1,
    borderColor: cores.sucesso,
    borderRadius: 10,
    padding: espaco.md,
  },
  sucessoTexto: { color: cores.sucesso, fontWeight: '600', flex: 1 },
  remover: { color: cores.erro, fontWeight: '600', marginLeft: espaco.md },
  alerta: { backgroundColor: cores.avisoFundo, borderRadius: 10, padding: espaco.md, gap: espaco.xs },
  alertaTexto: { color: cores.aviso, fontSize: 13, lineHeight: 18 },
  link: { color: cores.primaria, fontWeight: '700', fontSize: 13 },
});
