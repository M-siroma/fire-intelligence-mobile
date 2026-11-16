import type { NativeStackScreenProps } from '@react-navigation/native-stack';

/** Rotas do app e os parâmetros que cada uma recebe. */
export type RootStackParamList = {
  Identificacao: undefined;
  Areas: undefined;
  AreaDetalhe: { areaId: string; nome: string };
  NovaObservacao: { areaId: string; nomeArea: string };
};

export type ScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;
