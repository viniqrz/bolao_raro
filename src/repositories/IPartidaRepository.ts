import { Partida } from "../models/PartidaEntity";

export interface IPartidaRepository {
  save(partida: Partida): Promise<void>;
}
