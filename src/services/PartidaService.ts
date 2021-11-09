import { APIPartida } from "../@types/api/brasileirao";
import { Partida } from "../models/PartidaEntity";
import { TimeRepository } from "../repositories/TimeRepository";
import { TimeService } from "./TimeService";
import { getCustomRepository } from "typeorm";
import { IPartidaRepository } from "../repositories/IPartidaRepository";

interface IPartidaService {
  updateAll(partidasApi: APIPartida[]): Promise<Partida[]>;
  updateOne(partidaApi: APIPartida): Promise<Partida>;
}

export class PartidaService implements IPartidaService {
  constructor(private repository: IPartidaRepository) {}

  public async updateAll(partidasApi: APIPartida[]): Promise<Partida[]> {
    const savedPartidas = await Promise.all(
      partidasApi.map((partidaApi) => this.updateOne(partidaApi))
    );

    return savedPartidas;
  }

  public async updateOne(partidaApi: APIPartida): Promise<Partida> {
    const timeRepository = getCustomRepository(TimeRepository);
    const timeService = new TimeService(timeRepository);

    const { time_mandante, time_visitante } = partidaApi;

    const mandante = await timeService.update(time_mandante);
    const visitante = await timeService.update(time_visitante);

    const partida = this.factory({
      ...partidaApi,
      time_mandante: mandante,
      time_visitante: visitante,
    });

    return await this.repository.save(partida);
  }

  private factory(partidaApi: any): Partida {
    const partida = new Partida();

    partida.placar = partidaApi.placar;
    partida.placarMandante = partidaApi.placar_mandante;
    partida.placarVisitante = partidaApi.placar_visitante;
    partida.status = partidaApi.status;
    partida.slug = partidaApi.slug;
    partida.dataRealizacao = partidaApi.data_realizacao_iso as Date;

    return partida;
  }
}
