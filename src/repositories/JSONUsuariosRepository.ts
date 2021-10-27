import Usuario from "../models/Usuario";
import UsuariosRepository from "./UsuariosRepository";
import fs from "fs";
const { readFile, writeFile } = fs.promises;

const USUARIOS_FILE_PATH = "./files/usuarios.json";

type UsuarioFile = {
  nome: string;
  email: string;
  senha: string;
  inativo: boolean;
};

type FindAll = () => Promise<Usuario[]>;
type Remove = (email: string) => Promise<void>;
type Save = () => Promise<void>;

type FindByEmail = (email: string) => Promise<Usuario>;
type Update = (usuario: Usuario) => Promise<void>;

export default class JSONUsuariosRepository implements UsuariosRepository {
  private usuariosFilePath: string;

  constructor(outrosUsuarios?: string) {
    this.usuariosFilePath = outrosUsuarios || USUARIOS_FILE_PATH;

    this.findByEmail = this.findByEmail.bind(this) as FindByEmail;
    this.findAll = this.findAll.bind(this) as FindAll;
    this.remove = this.remove.bind(this) as Remove;
    this.update = this.update.bind(this) as Update;
    this.save = this.save.bind(this) as Save;
  }

  // --- Recupera todos

  public async findAll(): Promise<Usuario[]> {
    try {
      const fileContent = await readFile(this.usuariosFilePath, {
        encoding: "utf8",
      });

      const usuariosSemClasse = JSON.parse(fileContent) as UsuarioFile[];

      return usuariosSemClasse.map(
        ({ nome, email, senha, inativo }) =>
          new Usuario(nome, email, senha, inativo)
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(
          `Falha a carregar os usuarios. Motivo: ${error.message}`
        );
      } else {
        throw error;
      }
    }
  }

  // --- Encontra um usuario pelo seu email

  public async findByEmail(email: string): Promise<Usuario> {
    try {
      const usuarios = await this.findAll();

      const usuario = usuarios.find((u) => u.getEmail() === email);

      return usuario;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Falha ao encontrar usuario. Motivo: ${error.message}`);
      } else {
        throw error;
      }
    }
  }

  // --- Remove um usuario pelo seu email

  public async remove(email: string): Promise<void> {
    try {
      const usuarios = await this.findAll();

      const newUsuarios = usuarios.filter((u) => u.getEmail() !== email);

      if (usuarios.length < newUsuarios.length)
        throw new Error("Usuario nao existe");

      const json = JSON.stringify(newUsuarios);

      await writeFile(this.usuariosFilePath, json);

      console.log("Removido com sucesso");
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Falha ao remover usuario. Motivo: ${error.message}`);
      } else {
        throw error;
      }
    }
  }

  // --- Atualiza um usuario

  public async update(usuario: Usuario): Promise<void> {
    try {
      const usuarios = await this.findAll();

      const usuarioIndex = usuarios.findIndex(
        (u) => u.getEmail() === usuario.getEmail()
      );

      if (usuarioIndex < 0) throw new Error("Usuario nao existe");

      usuarios[usuarioIndex] = usuario;

      const json = JSON.stringify(usuarios);

      await writeFile(this.usuariosFilePath, json);

      console.log("Usuario atualizado com sucesso");
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(
          `Falha ao atualizar os usuarios. Motivo: ${error.message}`
        );
      } else {
        throw error;
      }
    }
  }

  // ---- Cria um usuario

  public async save(usuario: Usuario): Promise<void> {
    try {
      const usuarios = await this.findAll();

      const json = JSON.stringify([...usuarios, usuario]);

      await writeFile(this.usuariosFilePath, json);

      console.log("Usuário salvo com sucesso!");
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Falha ao salvar as rodadas. Motivo: ${error.message}`);
      } else {
        throw error;
      }
    }
  }
}
