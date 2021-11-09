import { APITime } from "../@types/api/brasileirao";
import { Time } from "../models/TimeEntity";
import { TimeRepository } from "../repositories/TimeRepository";

interface ITimeService {
  update(api_time: APITime): Promise<Time>;
}

export class TimeService implements ITimeService {
  constructor(private timeRepository: TimeRepository) {}

  public async update(timeApi: APITime): Promise<Time> {
    const time = this.factory(timeApi);

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
