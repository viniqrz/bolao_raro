import { EntityRepository, Repository } from "typeorm";
import { Partida } from "../models/PartidaEntity";
import { IPartidaRepository } from "./IPartidaRepository";

@EntityRepository(Partida)
export class PartidaRepository
  extends Repository<Partida>
  implements IPartidaRepository {}
