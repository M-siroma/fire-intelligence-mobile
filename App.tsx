import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { IdentificacaoProvider } from './src/context/IdentificacaoContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <IdentificacaoProvider>
        <AppNavigator />
        <StatusBar style="light" />
      </IdentificacaoProvider>
    </SafeAreaProvider>
  );
}
