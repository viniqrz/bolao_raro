import { compare } from "bcrypt";

import Usuario from "../models/Usuario";
import JSONUsuariosRepository from "../repositories/JSONUsuariosRepository";
import validateEmail from "../helpers/validateEmail";

export default class Login {
  public async execute(email: string, senha: string): Promise<Usuario> {
    try {
      const isEmailValid = validateEmail(email);

      if (!isEmailValid) throw new Error("Endereço de email invalido");

      const repository = new JSONUsuariosRepository();

      const userAlreadyExists = await repository.findByEmail(email);

      if (!userAlreadyExists) throw new Error("Email ou senha invalido(a)");

      const hash = userAlreadyExists.getSenha();
      const match = await compare(senha, hash);

      if (!match) throw new Error("Email ou senha invalido(a)");

      console.log("Usuario logado com sucesso!");

      return userAlreadyExists;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(`Falha ao executar Login. Motivo: ${error.message}`);
      } else {
        throw error;
      }
    }
  }
}

void new Login().execute("chico@gmail.com", "1234");
