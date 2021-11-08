import { Campeonato } from "../models/CampeonatoEntity";

export interface ICampeonatoRepository {
  save(campeonato: Campeonato): Promise<Campeonato>;
  findAll(): Promise<Campeonato[]>;
}
