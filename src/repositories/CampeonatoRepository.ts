import { EntityRepository, Repository } from "typeorm";
import { Campeonato } from "../models/CampeonatoEntity";
import { ICampeonatoRepository } from "./ICampeonatoRepository";

@EntityRepository(Campeonato)
export class CampeonatoRepository
  extends Repository<Campeonato>
  implements ICampeonatoRepository
{
  async findAll() {
    return await this.find();
  }
}
