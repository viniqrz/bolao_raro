import axios from "axios";

import {
  APIDetalhesRodada,
  APIRodada,
  APIPosicaoTabela,
} from "../@types/api/brasileirao";

const TOKEN =
  "bearer d44db0cc0676316ee1248780ec04da734e0f06a77c30aaf9a2dcbb1899093361";

const config = {
  headers: { Authorization: TOKEN },
};

export default class APIBrasileirao {
  protected readonly baseUrl: string;

  constructor() {
    this.baseUrl =
      "https://us-central1-small-talk-3972f.cloudfunctions.net/v1/v1/campeonatos/10";
  }

  public async buscarTabela(): Promise<APIPosicaoTabela[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/tabela`, config);

      return response.data as APIPosicaoTabela[];
    } catch (err) {
      console.log(err);
    }
  }

  public async buscarRodadas(): Promise<APIRodada[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/rodadas`, config);

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
        `${this.baseUrl}/rodadas/${numeroRodada}`,
        config
      );

      return response.data as APIDetalhesRodada;
    } catch (err) {
      console.log(err);
    }
  }
}
