import { EntityRepository, Repository } from "typeorm";
import { IApostaRepository } from "./IApostaRepository";
import { Aposta } from "../models/ApostaEntity";

@EntityRepository(Aposta)
export class apostaRepository
  extends Repository<Aposta>
  implements IApostaRepository
{
  public async findByRodadaAndUser(
    rodada: number,
    usuarioId: number
  ): Promise<Aposta[]> {
    return await this.find({ where: { rodada, usuarioId } });
  }

  public async findByUserId(usuarioId: number): Promise<Aposta[]> {
    return await this.find({
      where: { usuario: { id: usuarioId } },
      relations: ["usuario", "partida"],
    });
  }
}
