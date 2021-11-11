import { EntityRepository, Repository } from "typeorm";
import { IApostaRepository } from "./IApostaRepository";
import { Aposta } from "../models/ApostaEntity";

@EntityRepository(Aposta)
export class ApostaRepository
  extends Repository<Aposta>
  implements IApostaRepository
{
  public async findByUserIdAndRodada(
    usuarioId: number, rodada: number
  ): Promise<Aposta[]> {
    return await this.find({
      where: { usuario: { id: usuarioId }, rodada: { rodada } },
      relations: ["usuario", "partida", "rodada"],
    });
  }
}
