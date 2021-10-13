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

export default class JSONApostaRodadasRepository
  implements ApostaRodadasRepository
{
  private apostaRodadasFilePath: string;

  constructor(outrasRodadas?: string) {
    this.apostaRodadasFilePath = outrasRodadas || APOSTA_RODADAS_FILE_PATH;
  }

  // ---- Recupera todas as apostas rodadas

  public findAll(): Promise<ApostaRodada[]> {
    return readFile(this.apostaRodadasFilePath, { encoding: "utf8" })
      .then((fileContent) => {
        const apostaRodadasSemClasse = JSON.parse(
          fileContent
        ) as ApostaRodadaFile[];

        return apostaRodadasSemClasse.map(
          ({ usuario, rodada, apostasJogos }) =>
            new ApostaRodada(usuario, rodada, apostasJogos)
        );
      })
      .catch((error: any) => {
        if (error instanceof Error) {
          throw new Error(
            `Falha a carregar as apostas. Motivo: ${error.message}`
          );
        } else {
          throw error;
        }
      });
  }

  // ---- Recupera uma aposta rodada pelo seu numero e usuario

  public findByNumeroRodadaEUsuario(
    numeroRodada: number,
    emailUsuario: string
  ): Promise<ApostaRodada> {
    return readFile(this.apostaRodadasFilePath, { encoding: "utf8" })
      .then((fileContent) => {
        const apostaRodadasSemClasse = JSON.parse(
          fileContent
        ) as ApostaRodadaFile[];

        const apostaRodadas = apostaRodadasSemClasse.map(
          ({ usuario, rodada, apostasJogos }) =>
            new ApostaRodada(usuario, rodada, apostasJogos)
        );

        const apostaRodada = apostaRodadas.find(
          (ar) =>
            ar.getUsuario().getEmail() === emailUsuario &&
            ar.getRodada().getNumeroRodada() === numeroRodada
        );

        if (!apostaRodada) throw new Error("Rodada ou Usuario nao existe");

        return apostaRodada;
      })
      .catch((error: any) => {
        if (error instanceof Error) {
          throw new Error(
            `Falha ao encontrar apostas. Motivo: ${error.message}`
          );
        } else {
          throw error;
        }
      });
  }

  // ---- Recupera apostas rodadas pelo numero de uma rodada

  public findByNumeroRodada(numeroRodada: number): Promise<ApostaRodada[]> {
    return readFile(this.apostaRodadasFilePath, { encoding: "utf8" })
      .then((fileContent) => {
        const apostaRodadasSemClasse = JSON.parse(
          fileContent
        ) as ApostaRodadaFile[];

        const apostaRodadas = apostaRodadasSemClasse.map(
          ({ usuario, rodada, apostasJogos }) =>
            new ApostaRodada(usuario, rodada, apostasJogos)
        );

        const apostasRodada = apostaRodadas.filter(
          (ar) => ar.getRodada().getNumeroRodada() === numeroRodada
        );

        if (apostasRodada.length < 1)
          throw new Error("Rodada ou Usuario nao existe");

        return apostasRodada;
      })
      .catch((error: any) => {
        if (error instanceof Error) {
          throw new Error(
            `Falha ao encontrar apostas. Motivo: ${error.message}`
          );
        } else {
          throw error;
        }
      });
  }

  // ---- Recupera todas apostas rodadas de um usuario

  public findByUsuario(emailUsuario: string): Promise<ApostaRodada[]> {
    return readFile(this.apostaRodadasFilePath, { encoding: "utf8" })
      .then((fileContent) => {
        const apostasRodadaSemClasse = JSON.parse(
          fileContent
        ) as ApostaRodadaFile[];

        const apostasRodada = apostasRodadaSemClasse.filter(
          (ar) => ar.usuario.getEmail() === emailUsuario
        );

        if (apostasRodada.length < 1)
          throw new Error("Usuario nao possui apostas");

        return apostasRodada.map(
          (ar) => new ApostaRodada(ar.usuario, ar.rodada, ar.apostasJogos)
        );
      })
      .catch((error: any) => {
        if (error instanceof Error) {
          throw new Error(
            `Falha ao encontrar apostas. Motivo: ${error.message}`
          );
        } else {
          throw error;
        }
      });
  }

  // ---- Salva uma aposta rodada

  public save(apostaRodada: ApostaRodada): Promise<void> {
    return writeFile(
      this.apostaRodadasFilePath,
      JSON.stringify(apostaRodada)
    ).catch((error: any) => {
      if (error instanceof Error) {
        throw new Error(`Falha ao salvar os times. Motivo: ${error.message}`);
      } else {
        throw error;
      }
    });
  }
}
