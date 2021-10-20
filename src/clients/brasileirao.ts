import axios from "axios";

const BASE_URL =
  "https://us-central1-small-talk-3972f.cloudfunctions.net/v1/v1/campeonatos/10";

const TOKEN =
  "bearer d44db0cc0676316ee1248780ec04da734e0f06a77c30aaf9a2dcbb1899093361";

const config = {
  headers: { Authorization: TOKEN },
};

export type APITime = {
  time_id: number;
  nome_popular: string;
  sigla: string;
  escudo: string;
};

type APIPosicaoTabela = {
  time: APITime;
};

type APIRodada = {
  rodada: number;
};

type Partida = {
  partida_id: number;
  time_mandante: APITime;
  time_visitante: APITime;
  status: string;
  placar_mandante: number;
  placar_visitante: number;
  data_realizacao_iso: Date;
};

type APIDetalhesRodada = {
  rodada: number;
  partidas: Partida[];
};

export default class APIBrasileirao {
  public async buscarTabela(): Promise<APIPosicaoTabela[]> {
    try {
      const response = await axios.get(`${BASE_URL}/tabela`, config);

      return response.data as APIPosicaoTabela[];
    } catch (err) {
      console.log(err);
    }
  }

  public async buscarRodadas(): Promise<APIRodada[]> {
    try {
      const response = await axios.get(`${BASE_URL}/rodadas`, config);

      return response.data as APIRodada[];
    } catch (err) {
      console.log(err);
    }
  }

  public async buscarDetalhesRodada(
    numeroRodada: number
  ): Promise<APIDetalhesRodada> {
    try {
      const response = await axios.get(
        `${BASE_URL}/rodadas/${numeroRodada}`,
        config
      );

      return response.data as APIDetalhesRodada;
    } catch (err) {
      console.log(err);
    }
  }
}
