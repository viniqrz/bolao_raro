import { Rodada } from "../models/RodadaEntity";

export interface IRodadaRepository {
  findByNumeroRodada(rodada: number): Promise<Rodada>;
}
