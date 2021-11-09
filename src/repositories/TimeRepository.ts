import { EntityRepository, Repository } from "typeorm";
import { Time } from "../models/TimeEntity";
import { ITimeRepository } from "./ITimeRepository";

@EntityRepository(Time)
export class TimeRepository
  extends Repository<Time>
  implements ITimeRepository {}
