import { Rodada } from "../models/RodadaEntity";

export interface IRodadaRepository {
  save(rodada: Rodada): Promise<Rodada>;
}
