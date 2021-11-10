import { Partida } from "../models/PartidaEntity";

export interface IPartidaRepository {
  save(partida: Partida): Promise<Partida>;
  findBySlug(slug: string): Promise<Partida>;
  findById(id: number): Promise<Partida>;
}
