import { APIDetalhesRodada, APIRodada } from "../@types/api/brasileirao";
import { APIBrasileirao } from "../clients/brasileirao";
import { Rodada } from "../models/RodadaEntity";
import { RodadaRepository } from "../repositories/RodadaRepository";
import { PartidaService } from "./PartidaService";

interface IRodadaService {
  getRodadasFromApi(idCampeonatoApiExterna: number): Promise<APIRodada[]>;
  getDetalhesRodadasFromApi(
    idCampeonatoApiExterna: number,
    rodadas: APIRodada[]
  ): Promise<APIDetalhesRodada[]>;
  updateAllFromApi(idCampeonatoApiExterna: number): Promise<Rodada[]>;
  updateOneFromApi(rodada: APIRodada): Promise<Rodada>;
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
      detalhesRodadas.map((rodada) => this.updateOneFromApi(rodada))
    );

    return savedRodadas;
  }

  public async updateOneFromApi(rodadaApi: APIRodada): Promise<Rodada> {
    const { partidas: partidasApi, rodada: numeroRodada } = rodadaApi;

    const partidaService = new PartidaService();
    const partidas = await partidaService.updateAll(partidasApi);

    // upsert rodada(numeroRodada, partida[]);
  }
}
