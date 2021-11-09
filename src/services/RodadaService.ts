import { getCustomRepository } from "typeorm";
import { APIDetalhesRodada, APIRodada } from "../@types/api/brasileirao";
import { APIBrasileirao } from "../clients/brasileirao";
import { Campeonato } from "../models/CampeonatoEntity";
import { Partida } from "../models/PartidaEntity";
import { Rodada } from "../models/RodadaEntity";
import { CampeonatoRepository } from "../repositories/CampeonatoRepository";
import { PartidaRepository } from "../repositories/PartidaRepository";
import { RodadaRepository } from "../repositories/RodadaRepository";
import { PartidaService } from "./PartidaService";

interface IRodadaService {
  getRodadasFromApi(idCampeonatoApiExterna: number): Promise<APIRodada[]>;
  getDetalhesRodadasFromApi(
    idCampeonatoApiExterna: number,
    rodadas: APIRodada[]
  ): Promise<APIDetalhesRodada[]>;
  updateAllFromApi(idCampeonatoApiExterna: number): Promise<Rodada[]>;
  updateOneFromApi(
    idCampeonatoApiExterna: number,
    rodada: APIRodada
  ): Promise<Rodada>;
}

export class RodadaService implements IRodadaService {
  constructor(
    private repository: RodadaRepository,
    private client: APIBrasileirao
  ) {}

  public async getRodadasFromApi(
    idCampeonatoApiExterna: number
  ): Promise<APIRodada[]> {
    return await this.client.buscarRodadas(idCampeonatoApiExterna);
  }

  public async getDetalhesRodadasFromApi(
    idCampeonatoApiExterna: number,
    rodadas: APIRodada[]
  ): Promise<APIDetalhesRodada[]> {
    const promisesArray = rodadas.map(({ rodada }) =>
      this.client.buscarDetalhesRodada(rodada, idCampeonatoApiExterna)
    );

    return await Promise.all(promisesArray);
  }

  public async updateAllFromApi(
    idCampeonatoApiExterna: number
  ): Promise<Rodada[]> {
    const rodadasApi = await this.getRodadasFromApi(idCampeonatoApiExterna);

    const detalhesRodadas = await this.getDetalhesRodadasFromApi(
      idCampeonatoApiExterna,
      rodadasApi
    );

    const savedRodadas = await Promise.all(
      detalhesRodadas.map((rodada) =>
        this.updateOneFromApi(idCampeonatoApiExterna, rodada)
      )
    );

    return savedRodadas;
  }

  public async updateOneFromApi(
    idCampeonatoApiExterna: number,
    rodadaApi: APIDetalhesRodada
  ): Promise<Rodada> {
    const { partidas: partidasApi, rodada: numeroRodada } = rodadaApi;

    const partidaRepository = getCustomRepository(PartidaRepository);
    const partidaService = new PartidaService(partidaRepository);
    const partidas = await partidaService.updateAll(partidasApi);

    const campeonatoRepository = getCustomRepository(CampeonatoRepository);
    const campeonato = await campeonatoRepository.findOne({
      idCampeonatoApiExterna,
    });

    const rodada = this.factory(campeonato, partidas, rodadaApi);

    return await this.repository.save(rodada);
  }

  private factory(
    campeonato: Campeonato,
    partidas: Partida[],
    rodadaApi: APIDetalhesRodada
  ): Rodada {
    const rodada = new Rodada();

    const { rodada: numeroRodada, status, slug } = rodadaApi;

    rodada.nome = `Rodada ${numeroRodada}`;
    rodada.slug = slug;
    rodada.rodada = numeroRodada;
    rodada.partidas = partidas;
    rodada.status = status;
    rodada.campeonato = campeonato;

    return rodada;
  }
}
