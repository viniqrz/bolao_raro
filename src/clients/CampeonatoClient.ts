import axios from "axios";
import "dotenv/config";

import {
  APIDetalhesRodada,
  APIRodada,
  APIPosicaoTabela,
} from "../@types/dtos/api/brasileirao";

const config = {
  headers: {
    Authorization: `bearer ${process.env.API_BRASILEIRAO_TOKEN}`,
  },
};

export class CampeonatoClient {
  protected readonly baseUrl: string;

  constructor() {
    this.baseUrl = process.env.API_BRASILEIRAO_URL;
  }

  public async buscarTabela(campeonatoId = 10): Promise<APIPosicaoTabela[]> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/campeonatos/${campeonatoId}/tabela`,
        config
      );

      return response.data as APIPosicaoTabela[];
    } catch (err) {
      console.log(err);
    }
  }

  public async buscarRodadas(campeonatoId = 10): Promise<APIRodada[]> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/campeonatos/${campeonatoId}/rodadas`,
        config
      );

      return response.data as APIRodada[];
    } catch (err) {
      console.log(err);
    }
  }

  public async buscarDetalhesRodada(
    numeroRodada: number,
    campeonatoId: number
  ): Promise<APIDetalhesRodada> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/campeonatos/${campeonatoId}/rodadas/${numeroRodada}`,
        config
      );

      return response.data as APIDetalhesRodada;
    } catch (err) {
      console.log(err);
    }
  }
}
