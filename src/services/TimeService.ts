import { APITime } from "../@types/api/brasileirao";
import { Time } from "../models/TimeEntity";
import { ITimeRepository } from "../repositories/ITimeRepository";

interface ITimeService {
  update(api_time: APITime): Promise<Time>;
}

export class TimeService implements ITimeService {
  constructor(private timeRepository: ITimeRepository) {}

  public async update(timeApi: APITime): Promise<Time> {
    const time = this.factory(timeApi);

    const savedTime = await this.timeRepository.findByName(time.nome);

    if (savedTime) return savedTime;

    return await this.timeRepository.save(time);
  }

  private factory(timeApi: APITime): Time {
    const time = new Time();

    time.nome = timeApi.nome_popular;
    time.sigla = timeApi.sigla;
    time.escudo = timeApi.escudo;

    return time;
  }
}
