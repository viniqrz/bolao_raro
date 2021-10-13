import Time from "../models/Time";
import TimesRepository from "./TimesRepository";
import * as fs from "fs";
const { readFile, writeFile } = fs.promises;

const TIMES_FILE_PATH = "./files/times.json";

type TimeFile = {
  id: number;
  nome: string;
  estado: string;
};

export default class JSONTimesRepository implements TimesRepository {
  private timesFilePath: string;

  constructor(outrosTimes?: string) {
    this.timesFilePath = outrosTimes || TIMES_FILE_PATH;
  }

  // --- Recupera todos

  public findAll(): Promise<Time[]> {
    return readFile(this.timesFilePath)
      .then((fileContent: Buffer) => {
        const timesSemClasse = JSON.parse(fileContent.toString()) as TimeFile[];
        return timesSemClasse.map(
          ({ id, nome, estado }) => new Time(id, nome, estado)
        );
      })
      .catch((error: any) => {
        if (error instanceof Error) {
          throw new Error(
            `Falha a carregar os times. Motivo: ${error.message}`
          );
        } else {
          throw error;
        }
      });
  }

  // --- Recupera um pelo seu id

  public findById(id: number): Promise<Time> {
    return readFile(this.timesFilePath)
      .then((fileContent: Buffer) => {
        const timesSemClasse = JSON.parse(fileContent.toString()) as TimeFile[];
        const time = timesSemClasse.find((time) => time.id === id);

        if (!time) throw new Error("Time nao existe");

        return new Time(time.id, time.nome, time.estado);
      })
      .catch((error: any) => {
        if (error instanceof Error) {
          throw new Error(`Falha ao encontrar time. Motivo: ${error.message}`);
        } else {
          throw error;
        }
      });
  }

  // --- Atualiza um time

  public update(time: Time): Promise<void> {
    const errorHandler = (error: any) => {
      if (error instanceof Error) {
        throw new Error(
          `Falha ao atualizar os times. Motivo: ${error.message}`
        );
      } else {
        throw error;
      }
    };

    return readFile(this.timesFilePath)
      .then((fileContent: Buffer) => {
        const timesSemClasse = JSON.parse(fileContent.toString()) as TimeFile[];
        return timesSemClasse.map(
          ({ id, nome, estado }) => new Time(id, nome, estado)
        );
      })
      .then((times) => {
        const timeIndex = times.findIndex((t) => t.getId() === time.getId());

        if (timeIndex < 0) throw new Error("Time nao existe");

        times[timeIndex] = time;

        const json = JSON.stringify(times);

        writeFile(this.timesFilePath, json).catch(errorHandler);
      })
      .catch(errorHandler);
  }

  // --- Salva um time

  public save(times: Time[]): Promise<void> {
    const errorHandler = (error: any) => {
      if (error instanceof Error) {
        throw new Error(`Falha ao salvar os times. Motivo: ${error.message}`);
      } else {
        throw error;
      }
    };

    return readFile(this.timesFilePath, { encoding: "utf8" })
      .then((fileContent) => {
        const timesSemClasse = JSON.parse(fileContent) as TimeFile[];
        return timesSemClasse.map(
          ({ id, nome, estado }) => new Time(id, nome, estado)
        );
      })
      .then((repoTimes) => {
        let newTimes;

        if (Array.isArray(times)) [...times, ...repoTimes];
        else newTimes = [times, ...repoTimes];

        const json = JSON.stringify(newTimes);

        writeFile(this.timesFilePath, json).catch(errorHandler);
      })
      .catch(errorHandler);
  }
}
