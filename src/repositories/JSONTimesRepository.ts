import Time from "../models/Time";
import TimesRepository from "./TimesRepository";
import * as fs from "fs";
const { readFile, writeFile } = fs.promises;

const TIMES_FILE_PATH = "./files/times.json";

type TimeFile = {
  id: number;
  nome: string;
  sigla: string;
  escudo: string;
};

type FindAll = () => Promise<Time[]>;
type Save = () => Promise<void>;

type FindById = (id: number) => Promise<Time>;
type Update = (time: Time) => Promise<void>;

export default class JSONTimesRepository implements TimesRepository {
  private timesFilePath: string;

  constructor(outrosTimes?: string) {
    this.timesFilePath = outrosTimes || TIMES_FILE_PATH;

    this.findById = this.findById.bind(this) as FindById;
    this.findAll = this.findAll.bind(this) as FindAll;
    this.update = this.update.bind(this) as Update;
    this.save = this.save.bind(this) as Save;
  }

  // --- Recupera todos

  public async findAll(): Promise<Time[]> {
    try {
      const fileContent = await readFile(this.timesFilePath);

      const timesSemClasse = JSON.parse(fileContent.toString()) as TimeFile[];

      return timesSemClasse.map(
        ({ id, nome, sigla, escudo }) => new Time(id, nome, sigla, escudo)
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Falha a carregar os times. Motivo: ${error.message}`);
      } else {
        throw error;
      }
    }
  }

  // --- Recupera um pelo seu id

  public async findById(id: number): Promise<Time> {
    try {
      const times = await this.findAll();

      const time = times.find((time) => time.getId() === id);

      if (!time) throw new Error("Time nao existe");

      return time;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Falha ao encontrar time. Motivo: ${error.message}`);
      } else {
        throw error;
      }
    }
  }

  // --- Atualiza um time

  public async update(time: Time): Promise<void> {
    try {
      const times = await this.findAll();
      const timeIndex = times.findIndex((t) => t.getId() === time.getId());

      if (timeIndex < 0) throw new Error("Time nao existe");

      times[timeIndex] = time;

      await this.save(times);

      console.log("Time atualizado com sucesso");
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(
          `Falha ao atualizar os times. Motivo: ${error.message}`
        );
      } else {
        throw error;
      }
    }
  }

  // --- Salva um time

  public async save(times: Time[]): Promise<void> {
    try {
      const json = JSON.stringify(times);

      await writeFile(this.timesFilePath, json);

      console.log("Times salvos com sucesso");
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Falha ao salvar os times. Motivo: ${error.message}`);
      } else {
        throw error;
      }
    }
  }
}
