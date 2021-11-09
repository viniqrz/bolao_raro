import { Time } from "../models/TimeEntity";

export interface ITimeRepository {
  save(time: Time): Promise<Time>;
}
