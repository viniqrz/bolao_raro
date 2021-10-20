export type APITime = {
  time_id: number;
  nome_popular: string;
  sigla: string;
  escudo: string;
};

export type APIPosicaoTabela = {
  time: APITime;
};

export type APIRodada = {
  rodada: number;
};

export type APIPartida = {
  partida_id: number;
  time_mandante: APITime;
  time_visitante: APITime;
  status: string;
  placar_mandante: number;
  placar_visitante: number;
  data_realizacao_iso: Date;
};

export type APIDetalhesRodada = {
  rodada: number;
  partidas: APIPartida[];
};
