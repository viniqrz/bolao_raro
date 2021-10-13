import Usuario from "../models/Usuario";
import UsuariosRepository from "./UsuariosRepository";
import fs from "fs";
const { readFile, writeFile } = fs.promises;

const USUARIOS_FILE_PATH = "./files/usuarios.json";

type UsuarioFile = {
  nome: string;
  email: string;
  senha: string;
};

export default class JSONUsuariosRepository implements UsuariosRepository {
  private usuariosFilePath: string;

  constructor(outrosUsuarios?: string) {
    this.usuariosFilePath = outrosUsuarios || USUARIOS_FILE_PATH;
  }

  // --- Recupera todos

  public findAll(): Promise<Usuario[]> {
    return readFile(this.usuariosFilePath, { encoding: "utf8" })
      .then((fileContent) => {
        const usuariosSemClasse = JSON.parse(fileContent) as UsuarioFile[];

        return usuariosSemClasse.map(
          ({ nome, email, senha }) => new Usuario(nome, email, senha)
        );
      })
      .catch((error: any) => {
        if (error instanceof Error) {
          throw new Error(
            `Falha a carregar os usuarios. Motivo: ${error.message}`
          );
        } else {
          throw error;
        }
      });
  }

  // --- Encontra um usuario pelo seu email

  public findByEmail(email: string): Promise<Usuario> {
    return readFile(this.usuariosFilePath, { encoding: "utf8" })
      .then((fileContent) => {
        const usuariosSemClasse = JSON.parse(fileContent) as UsuarioFile[];

        const usuario = usuariosSemClasse.find((u) => u.email === email);

        if (!usuario) throw new Error("Usuario nao existe");

        return new Usuario(usuario.nome, usuario.email, usuario.senha);
      })
      .catch((error: any) => {
        if (error instanceof Error) {
          throw new Error(
            `Falha ao encontrar usuario. Motivo: ${error.message}`
          );
        } else {
          throw error;
        }
      });
  }

  // --- Remove um usuario pelo seu email

  public remove(email: string): Promise<void> {
    const errorHandler = (error: any) => {
      if (error instanceof Error) {
        throw new Error(`Falha ao remover usuario. Motivo: ${error.message}`);
      } else {
        throw error;
      }
    };

    return readFile(this.usuariosFilePath, { encoding: "utf8" })
      .then((fileContent) => {
        const usuariosSemClasse = JSON.parse(fileContent) as UsuarioFile[];
        return usuariosSemClasse.map(
          ({ nome, email, senha }) => new Usuario(nome, email, senha)
        );
      })
      .then((usuarios) => {
        const newUsuarios = usuarios.filter((u) => u.getEmail() !== email);

        if (usuarios.length < newUsuarios.length)
          throw new Error("Usuario nao existe");

        const json = JSON.stringify(newUsuarios);

        writeFile(this.usuariosFilePath, json).catch(errorHandler);
      })
      .catch(errorHandler);
  }

  // --- Atualiza um usuario

  public update(usuario: Usuario): Promise<void> {
    const errorHandler = (error: any) => {
      if (error instanceof Error) {
        throw new Error(
          `Falha ao atualizar os usuarios. Motivo: ${error.message}`
        );
      } else {
        throw error;
      }
    };

    return readFile(this.usuariosFilePath, { encoding: "utf8" })
      .then((fileContent) => {
        const usuariosSemClasse = JSON.parse(fileContent) as UsuarioFile[];
        return usuariosSemClasse.map(
          ({ nome, email, senha }) => new Usuario(nome, email, senha)
        );
      })
      .then((usuarios) => {
        const usuarioIndex = usuarios.findIndex(
          (u) => u.getEmail() === usuario.getEmail()
        );

        if (usuarioIndex < 0) throw new Error("Usuario nao existe");

        usuarios[usuarioIndex] = usuario;

        const json = JSON.stringify(usuarios);

        writeFile(this.usuariosFilePath, json).catch(errorHandler);
      })
      .catch(errorHandler);
  }
}
