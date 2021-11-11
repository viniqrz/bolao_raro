import { APIDetalhesRodada, APIRodada } from "../@types/api/brasileirao";
import { RodadaRepository } from "../repositories/RodadaRepository";
import { APIBrasileirao } from "../clients/brasileirao";
import { serviceFactory } from "../helpers/serviceFactory";
import { Campeonato } from "../models/CampeonatoEntity";
import { Partida } from "../models/PartidaEntity";
import { Rodada } from "../models/RodadaEntity";

interface IRodadaService {
  updateOneFromApi(campeonato: Campeonato, rodada: APIRodada): Promise<Rodada>;
  updateAllFromApi(campeonato: Campeonato): Promise<Rodada[]>;
  getRodadasFromApi(campeonato: Campeonato): Promise<APIRodada[]>;
  getRodada(numero: number): Promise<Rodada>;
  getDetalhesRodadasFromApi(
    campeonato: Campeonato,
    rodadas: APIRodada[]
  ): Promise<APIDetalhesRodada[]>;
}

export class RodadaService implements IRodadaService {
  constructor(
    private repository: RodadaRepository,
    private client: APIBrasileirao
  ) {}

  public async updateAllFromApi(campeonato: Campeonato): Promise<Rodada[]> {
    const rodadasApi = await this.getRodadasFromApi(campeonato);

    const detalhesRodadas = await this.getDetalhesRodadasFromApi(
      campeonato,
      rodadasApi
    );

    const rodadasPromises = detalhesRodadas.map((rodada) =>
      this.updateOneFromApi(campeonato, rodada)
    );

    const savedRodadas = await Promise.all(rodadasPromises);

    return savedRodadas;
  }

  public async updateOneFromApi(
    campeonato: Campeonato,
    rodadaApi: APIDetalhesRodada
  ): Promise<Rodada> {
    const partidasApi = rodadaApi.partidas;
    const partidas = await serviceFactory.partida().updateAll(partidasApi);

    const rodada = this.rodadaFactory(campeonato, partidas, rodadaApi);

    const savedRodada = await this.repository.findByNumeroRodada(rodada.rodada);
    if (!savedRodada) return await this.repository.save(rodada);

    return await this.repository.save({ ...savedRodada, ...rodada });
  }

  public async getRodadasFromApi(campeonato: Campeonato): Promise<APIRodada[]> {
    return await this.client.buscarRodadas(campeonato.idCampeonatoApiExterna);
  }

  public async getDetalhesRodadasFromApi(
    campeonato: Campeonato,
    rodadas: APIRodada[]
  ): Promise<APIDetalhesRodada[]> {
    const detalhesPromises = rodadas.map(({ rodada }) =>
      this.client.buscarDetalhesRodada(
        rodada,
        campeonato.idCampeonatoApiExterna
      )
    );

    return await Promise.all(detalhesPromises);
  }

  public async getRodada(rodada: number): Promise<Rodada> {
    return await this.repository.findByNumeroRodada(rodada);
  }

  private rodadaFactory(
    campeonato: Campeonato,
    partidas: Partida[],
    rodadaApi: APIDetalhesRodada
  ): Rodada {
    const { rodada: numeroRodada, status, slug, nome } = rodadaApi;

    const rodada = new Rodada();

    rodada.nome = nome;
    rodada.slug = slug;
    rodada.rodada = numeroRodada;
    rodada.status = status;
    rodada.partidas = partidas;
    rodada.campeonato = campeonato;

    return rodada;
  }
}
