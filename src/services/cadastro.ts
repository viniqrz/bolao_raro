import { hash, compare } from "bcrypt";

import Usuario from "../models/Usuario";
import JSONUsuariosRepository from "../repositories/JSONUsuariosRepository";
import validateEmail from "../helpers/validateEmail";

type Credentials = {
  nome: string;
  email: string;
  senha: string;
};

export default class Cadastro {
  // ---- Cria cadastro de usuario
  public async create(credentials: Credentials): Promise<Usuario> {
    try {
      const { nome, email, senha } = credentials;

      const isEmailValid = validateEmail(email);

      if (!isEmailValid) throw new Error("Email invalido");
      if (!nome.trim()) throw new Error("Nome invalido");
      if (!senha.trim()) throw new Error("Senha invalida");

      const repository = new JSONUsuariosRepository();

      const userAlreadyExists = await repository.findByEmail(email);

      if (userAlreadyExists) throw new Error("Usuario já existe");

      const passwordHash = await hash(senha, 8);

      const user = new Usuario(nome, email, passwordHash, false);

      await repository.save(user);

      console.log("Usuario cadastrado com sucesso!");

      return user;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(`Falha ao cadastrar usuario. Motivo: ${error.message}`);
      } else {
        throw error;
      }
    }
  }

  // ---- Atualiza cadastro de usuario
  public async update(credentials: Credentials): Promise<Usuario> {
    try {
      const { nome, email, senha } = credentials;

      const isEmailValid = validateEmail(email);

      if (!isEmailValid) throw new Error("Email invalido");
      if (!nome.trim()) throw new Error("Nome invalido");
      if (!senha.trim()) throw new Error("Senha invalida");

      const repository = new JSONUsuariosRepository();

      const userAlreadyExists = await repository.findByEmail(email);

      if (!userAlreadyExists) throw new Error("Email nao esta cadastrado");

      const passwordHash = await hash(senha, 8);

      const user = new Usuario(nome, email, passwordHash, false);

      await repository.update(user);

      console.log("Usuario cadastrado com sucesso!");

      return user;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(`Falha ao atualizar usuario. Motivo: ${error.message}`);
      } else {
        throw error;
      }
    }
  }

  public async inactivate(email: string, senha: string): Promise<Usuario> {
    try {
      const isEmailValid = validateEmail(email);

      if (!isEmailValid) throw new Error("Endereço de email invalido");

      const repository = new JSONUsuariosRepository();

      const userAlreadyExists = await repository.findByEmail(email);

      if (!userAlreadyExists) throw new Error("Email ou senha invalido(a)");

      const hash = userAlreadyExists.getSenha();
      const match = await compare(senha, hash);

      if (!match) throw new Error("Email ou senha invalido(a)");

      userAlreadyExists.setInativo(true);

      await repository.update(userAlreadyExists);

      console.log("Usuario inativado com sucesso!");

      console.log(userAlreadyExists);

      return userAlreadyExists;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(`Falha ao desativar usuario. Motivo: ${error.message}`);
      } else {
        throw error;
      }
    }
  }
}
