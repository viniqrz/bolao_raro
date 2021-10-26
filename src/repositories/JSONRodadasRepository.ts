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

type FindByNumeroRodada = (numeroRodada: number) => Promise<Rodada>;
type FindAll = () => Promise<Rodada[]>;
type Save = () => Promise<void>;

export default class JSONRodadasRepository implements RodadasRepository {
  // ---- Recupera todas as rodadas
  private rodadasFilePath: string;

  constructor(outrasRodadas?: string) {
    this.rodadasFilePath = outrasRodadas || RODADAS_FILE_PATH;

    this.findAll = this.findAll.bind(this) as FindAll;
    this.save = this.save.bind(this) as Save;

    this.findByNumeroRodada = this.findByNumeroRodada.bind(
      this
    ) as FindByNumeroRodada;
  }

  public async findAll(): Promise<Rodada[]> {
    try {
      const fileContent = await readFile(this.rodadasFilePath, {
        encoding: "utf8",
      });

      const rodadasSemClasse = JSON.parse(fileContent) as RodadaFile[];

      return rodadasSemClasse.map(
        ({ jogos, numeroRodada }) => new Rodada(numeroRodada, jogos)
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(
          `Falha ao carregar as rodadas. Motivo: ${error.message}`
        );
      } else {
        throw error;
      }
    }
  }

  // ---- Recupera uma rodada pelo seu numero

  public async findByNumeroRodada(numeroRodada: number): Promise<Rodada> {
    try {
      const rodadas = await this.findAll();

      const rodada = rodadas.find(
        (rodada) => rodada.getNumeroRodada() === numeroRodada
      );

      if (!rodada) throw new Error("Rodada nao existe");

      return rodada;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Falha ao encontrar rodada. Motivo: ${error.message}`);
      } else {
        throw error;
      }
    }
  }

  // ---- Salva uma lista de rodadas

  public async save(rodadas: Rodada[]): Promise<void> {
    try {
      await writeFile(this.rodadasFilePath, JSON.stringify(rodadas));
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Falha ao salvar as rodadas. Motivo: ${error.message}`);
      } else {
        throw error;
      }
    }
  }
}
