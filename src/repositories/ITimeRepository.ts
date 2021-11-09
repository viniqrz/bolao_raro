import { Time } from "../models/TimeEntity";

export interface ITimeRepository {
  save(time: Time): Promise<Time>;
  findOne(time: Time): Promise<Time>;
  findByName(nome: string): Promise<Time>;
}
