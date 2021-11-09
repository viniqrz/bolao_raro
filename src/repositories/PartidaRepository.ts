import { EntityRepository, Repository } from "typeorm";
import { Partida } from "../models/PartidaEntity";
import { IPartidaRepository } from "./IPartidaRepository";

@EntityRepository(Partida)
export class partidaRepository
  extends Repository<Partida>
  implements IPartidaRepository {}
