import { APIPosicaoTabela, APITime } from "../@types/api/brasileirao";
import { CampeonatoClient } from "../clients/CampeonatoClient";
import { Time } from "../models/TimeEntity";
import { ITimeRepository } from "../repositories/ITimeRepository";

interface ITimeService {
  updateAllFromApi(idCampeonatoApiExterna: number): Promise<Time[]>;
  getMandanteEVisitanteByName(
    nomeMandante: string,
    nomeVisitante: string
  ): Promise<Time[]>;
}

export class TimeService implements ITimeService {
  constructor(
    private timeRepository: ITimeRepository,
    private client: CampeonatoClient
  ) {}

  public async updateAllFromApi(
    idCampeonatoApiExterna: number
  ): Promise<Time[]> {
    const times = await this.getAllFromApi(idCampeonatoApiExterna);

    const savedTimes = await Promise.all(
      times.map((time) => this.updateOneFromApi(time))
    );

    console.log("Times gerados com sucesso!");

    return savedTimes;
  }

  public async updateOneFromApi(time: Time): Promise<Time> {
    const savedTime = await this.timeRepository.findByName(time.nome);

    if (savedTime) return savedTime;

    return await this.timeRepository.save(time);
  }

  public async getMandanteEVisitanteByName(
    nomeMandante: string,
    nomeVisitante: string
  ): Promise<Time[]> {
    const mandante = await this.timeRepository.findByName(nomeMandante);
    const visitante = await this.timeRepository.findByName(nomeVisitante);

    return [mandante, visitante];
  }

  public async getAllFromApi(idCampeonatoApiExterna: number): Promise<Time[]> {
    const tabela = await this.client.buscarTabela(idCampeonatoApiExterna);
    const times = this.getTimesFromTabela(tabela);

    return times;
  }

  private getTimesFromTabela(tabela: APIPosicaoTabela[]): Time[] {
    return tabela.map(({ time }) => this.factory(time));
  }

  private factory(timeApi: APITime): Time {
    const time = new Time();

    time.nome = timeApi.nome_popular;
    time.sigla = timeApi.sigla;
    time.escudo = timeApi.escudo;

    return time;
  }
}
