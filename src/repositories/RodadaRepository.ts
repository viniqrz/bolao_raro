import { EntityRepository, Repository } from "typeorm";
import { Rodada } from "../models/RodadaEntity";
import { IRodadaRepository } from "./IRodadaRepository";

@EntityRepository(Rodada)
export class RodadaRepository
  extends Repository<Rodada>
  implements IRodadaRepository
{
  public async findByNumeroRodada(rodada: number): Promise<Rodada> {
    return await this.findOne({ where: { rodada }, relations: ["partidas"] });
  }
}
