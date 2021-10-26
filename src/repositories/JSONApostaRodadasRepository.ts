import fs from "fs";
const { readFile, writeFile } = fs.promises;

import Usuario from "../models/Usuario";
import ApostaJogo from "../models/ApostaJogo";
import ApostaRodada from "../models/ApostaRodada";
import Rodada from "../models/Rodada";

import ApostaRodadasRepository from "./ApostaRodadasRepository";

const APOSTA_RODADAS_FILE_PATH = "./files/aposta-rodadas.json";

type ApostaRodadaFile = {
  usuario: Usuario;
  rodada: Rodada;
  apostasJogos: ApostaJogo[];
};

type FindAll = () => Promise<ApostaRodada[]>;
type Save = () => Promise<void>;

type FindByNumeroRodada = (numeroRodada: number) => Promise<ApostaRodada[]>;
type FindByUsuario = (emailUsuario: string) => Promise<ApostaRodada[]>;

type FindByNumeroRodadaEUsuario = (
  numeroRodada: number,
  emailUsuario: string
) => Promise<ApostaRodada>;

export default class JSONApostaRodadasRepository
  implements ApostaRodadasRepository
{
  private apostaRodadasFilePath: string;

  constructor(outrasRodadas?: string) {
    this.apostaRodadasFilePath = outrasRodadas || APOSTA_RODADAS_FILE_PATH;

    this.findByUsuario = this.findByUsuario.bind(this) as FindByUsuario;
    this.findAll = this.findAll.bind(this) as FindAll;
    this.save = this.save.bind(this) as Save;

    this.findByNumeroRodadaEUsuario = this.findByNumeroRodadaEUsuario.bind(
      this
    ) as FindByNumeroRodadaEUsuario;

    this.findByNumeroRodada = this.findByNumeroRodada.bind(
      this
    ) as FindByNumeroRodada;
  }

  // ---- Recupera todas as apostas rodadas

  public async findAll(): Promise<ApostaRodada[]> {
    try {
      const fileContent = await readFile(this.apostaRodadasFilePath, {
        encoding: "utf8",
      });

      const apostaRodadasSemClasse = JSON.parse(
        fileContent
      ) as ApostaRodadaFile[];

      return apostaRodadasSemClasse.map(
        ({ usuario, rodada, apostasJogos }) =>
          new ApostaRodada(usuario, rodada, apostasJogos)
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(
          `Falha a carregar as apostas. Motivo: ${error.message}`
        );
      } else {
        throw error;
      }
    }
  }

  // ---- Recupera uma aposta rodada pelo seu numero e usuario

  public async findByNumeroRodadaEUsuario(
    numeroRodada: number,
    emailUsuario: string
  ): Promise<ApostaRodada> {
    try {
      const apostaRodadas = await this.findAll();

      const apostaRodada = apostaRodadas.find(
        (ar) =>
          ar.getUsuario().getEmail() === emailUsuario &&
          ar.getRodada().getNumeroRodada() === numeroRodada
      );

      if (!apostaRodada) throw new Error("Rodada ou Usuario nao existe");

      return apostaRodada;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Falha ao encontrar apostas. Motivo: ${error.message}`);
      } else {
        throw error;
      }
    }
  }

  // ---- Recupera apostas rodadas pelo numero de uma rodada

  public async findByNumeroRodada(
    numeroRodada: number
  ): Promise<ApostaRodada[]> {
    try {
      const apostaRodadas = await this.findAll();

      const apostasRodada = apostaRodadas.filter(
        (ar) => ar.getRodada().getNumeroRodada() === numeroRodada
      );

      if (apostasRodada.length < 1)
        throw new Error("Rodada ou Usuario nao existe");

      return apostasRodada;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Falha ao encontrar apostas. Motivo: ${error.message}`);
      } else {
        throw error;
      }
    }
  }

  // ---- Recupera todas apostas rodadas de um usuario

  public async findByUsuario(emailUsuario: string): Promise<ApostaRodada[]> {
    try {
      const apostasRodadas = await this.findAll();

      const apostasUsuario = apostasRodadas.filter(
        (ar) => ar.getUsuario().getEmail() === emailUsuario
      );

      if (apostasUsuario.length < 1)
        throw new Error("Usuario nao possui apostas");

      return apostasUsuario;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Falha ao encontrar apostas. Motivo: ${error.message}`);
      } else {
        throw error;
      }
    }
  }

  // ---- Salva uma aposta rodada

  public async save(apostaRodada: ApostaRodada): Promise<void> {
    try {
      await writeFile(this.apostaRodadasFilePath, JSON.stringify(apostaRodada));

      console.log("Apostas salvas com sucesso");
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Falha ao salvar as apostas. Motivo: ${error.message}`);
      } else {
        throw error;
      }
    }
  }
}
