import { IPartidaRepository } from "../repositories/IPartidaRepository";
import { serviceFactory } from "../helpers/serviceFactory";
import { APIPartida } from "../@types/dtos/api/brasileirao";
import { Partida } from "../models/PartidaEntity";

interface IPartidaService {
  updateAll(partidasApi: APIPartida[]): Promise<Partida[]>;
  updateOne(partidaApi: APIPartida): Promise<Partida>;
}

export class PartidaService implements IPartidaService {
  constructor(private repository: IPartidaRepository) {}

  public async updateAll(partidasApi: APIPartida[]): Promise<Partida[]> {
    const updatePromises = partidasApi.map((p) => this.updateOne(p));

    const savedPartidas = await Promise.all(updatePromises);

    return savedPartidas;
  }

  public async updateOne(partidaApi: APIPartida): Promise<Partida> {
    const partida = await this.partidaFactory(partidaApi);

    const savedPartida = await this.repository.findBySlug(partida.slug);

    if (!savedPartida) return await this.repository.save(partida);

    return await this.repository.save({ ...savedPartida, ...partida });
  }

  public async getPartida(id): Promise<Partida> {
    return await this.repository.findById(id);
  }

  private async partidaFactory(partidaApi: APIPartida): Promise<Partida> {
    const nomeMandante = partidaApi.time_mandante.nome_popular;
    const nomeVisitante = partidaApi.time_mandante.nome_popular;

    const [mandante, visitante] = await serviceFactory
      .time()
      .getMandanteEVisitanteByName(nomeMandante, nomeVisitante);

    const partida = new Partida();

    partida.placar = partidaApi.placar;
    partida.placarMandante = partidaApi.placar_mandante;
    partida.placarVisitante = partidaApi.placar_visitante;

    partida.mandante = mandante;
    partida.visitante = visitante;

    partida.slug = partidaApi.slug;
    partida.status = partidaApi.status;
    partida.dataRealizacao = partidaApi.data_realizacao_iso as Date;

    return partida;
  }
}
