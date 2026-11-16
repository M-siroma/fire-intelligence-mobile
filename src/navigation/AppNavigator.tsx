// Navegação em pilha com rotas tipadas (RootStackParamList).
// Sem identificação salva, só a tela de Identificação existe; depois de entrar, o app abre nas Áreas.
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useIdentificacao } from '../context/IdentificacaoContext';
import AreaDetalheScreen from '../screens/AreaDetalheScreen';
import AreasScreen from '../screens/AreasScreen';
import IdentificacaoScreen from '../screens/IdentificacaoScreen';
import { cores } from '../theme';
import type { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { identificacao, carregando } = useIdentificacao();

  if (carregando) {
    return (
      <View style={styles.carregando}>
        <ActivityIndicator size="large" color={cores.primaria} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: cores.primaria },
          headerTintColor: '#FFFFFF',
          contentStyle: { backgroundColor: cores.fundo },
        }}
      >
        {identificacao === null ? (
          <Stack.Screen
            name="Identificacao"
            component={IdentificacaoScreen}
            options={{ title: 'Identificação' }}
          />
        ) : (
          <>
            <Stack.Screen name="Areas" component={AreasScreen} options={{ title: 'Áreas de estudo' }} />
            <Stack.Screen
              name="AreaDetalhe"
              component={AreaDetalheScreen}
              options={{ title: 'Diagnóstico da área' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  carregando: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: cores.fundo },
});
