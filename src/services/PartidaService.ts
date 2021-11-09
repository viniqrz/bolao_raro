import { APIPartida } from "../@types/api/brasileirao";
import { Partida } from "../models/PartidaEntity";
import { TimeRepository } from "../repositories/TimeRepository";
import { TimeService } from "./TimeService";
import { getCustomRepository } from "typeorm";

interface IPartidaService {
  updateAll(partidasApi: APIPartida[]): Promise<Partida[]>;
  updateOne(partidaApi: APIPartida): Promise<Partida>;
  factory(partidaApi: APIPartida): Promise<Partida>;
}

export class PartidaService implements IPartidaService {
  // constructor(){}

  public async updateAll(partidasApi: APIPartida[]): Promise<Partida> {
    const savedPartidas = await Promise.all(
      partidasApi.map((partidaApi) => this.updateOne(partidaApi))
    );

    return savedPartidas;

    partidas.forEach((partida) => {
      return new Jogo(
        mandante,
        visitante,
        data_realizacao_iso,
        placar_mandante,
        placar_visitante,
        placar
      );
    });
  }

  public async updateOne(partidaApi: APIPartida) {
    const { time_mandante, time_visitante } = partidaApi;

    const timeRepository = new TimeRepository();
    const repository = getCustomRepository(TimeRepository)WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWDCDSDSDDSDD
    const mandante = await timeService.update(time_mandante);
    const visitante = await timeService.update(time_visitante);

    const partida = this.factory({ ...partidaApi });

    partidaRepository.save;
  }

  private factory(partidaApi: APIPartida): Partida {
    const {
      time_mandante,
      time_visitante,
      data_realizacao_iso,
      placar_mandante,
      placar_visitante,
      placar,
    } = partidaApi;
  }
}
