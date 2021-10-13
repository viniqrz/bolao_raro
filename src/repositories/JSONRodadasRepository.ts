import Rodada from "../models/Rodada";
import Jogo from "../models/Jogo";
import RodadasRepository from "./RodadasRepository";
import fs from "fs";
const { readFile, writeFile } = fs.promises;

const RODADAS_FILE_PATH = "./files/rodadas.json";

type RodadaFile = {
  jogos: Jogo[];
  numeroRodada: number;
};

export default class JSONRodadasRepository implements RodadasRepository {
  // ---- Recupera todas as rodadas
  private rodadasFilePath: string;

  constructor(outrasRodadas?: string) {
    this.rodadasFilePath = outrasRodadas || RODADAS_FILE_PATH;
  }

  public findAll(): Promise<Rodada[]> {
    return readFile(this.rodadasFilePath, { encoding: "utf8" })
      .then((fileContent) => {
        const rodadasSemClasse = JSON.parse(fileContent) as RodadaFile[];
        return rodadasSemClasse.map(
          ({ jogos, numeroRodada }) => new Rodada(numeroRodada, jogos)
        );
      })
      .catch((error: any) => {
        if (error instanceof Error) {
          throw new Error(
            `Falha ao carregar as rodadas. Motivo: ${error.message}`
          );
        } else {
          throw error;
        }
      });
  }

  // ---- Recupera uma rodada pelo seu numero

  public findByNumeroRodada(numeroRodada: number): Promise<Rodada> {
    return readFile(this.rodadasFilePath, { encoding: "utf8" })
      .then((fileContent) => {
        const rodadasSemClasse = JSON.parse(fileContent) as RodadaFile[];
        const rodada = rodadasSemClasse.find(
          (rodada) => rodada.numeroRodada === numeroRodada
        );

        if (!rodada) throw new Error("Rodada nao existe");

        return new Rodada(rodada.numeroRodada, rodada.jogos);
      })
      .catch((error: any) => {
        if (error instanceof Error) {
          throw new Error(
            `Falha ao encontrar rodada. Motivo: ${error.message}`
          );
        } else {
          throw error;
        }
      });
  }

  // ---- Salva uma lista de rodadas

  public save(rodadas: Rodada[]): Promise<void> {
    return writeFile(this.rodadasFilePath, JSON.stringify(rodadas)).catch(
      (error: any) => {
        if (error instanceof Error) {
          throw new Error(
            `Falha ao salvar as rodadas. Motivo: ${error.message}`
          );
        } else {
          throw error;
        }
      }
    );
  }
}
