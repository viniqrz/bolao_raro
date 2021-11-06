import { hash, compare } from "bcrypt";
import {
  AlterarUsuarioDTO,
  UsuarioCriadoDTO,
  UsuarioDTO,
} from "../@types/dtos/usuarioDto";
import { Usuario } from "../entity/UsuarioEntity";

import {
  IUsuarioRepository,
  UsuarioRepository,
} from "../new-repositories/UsuarioRepository";

import validateEmail from "../helpers/validateEmail";

interface IUsuarioService {
  create(data: UsuarioDTO): Promise<UsuarioCriadoDTO>;
  login(email: string, senha: string): Promise<UsuarioCriadoDTO>;
  update(data: AlterarUsuarioDTO): Promise<UsuarioCriadoDTO>;
  delete(email: string, senha: string): Promise<UsuarioCriadoDTO>;
}

class UsuarioService implements IUsuarioService {
  constructor(private usuarioRepository: IUsuarioRepository) {}

  public async create(data: UsuarioDTO): Promise<UsuarioCriadoDTO> {
    try {
      const { email, senha } = data;

      this.validateData(data);

      const repository = new UsuarioRepository();
      const userAlreadyExists = await repository.findByEmail(email);

      if (userAlreadyExists) throw new Error("Usuario já existe");

      const passwordHash = await hash(senha, 8);
      const user = this.factory(data, passwordHash);
      const savedUser = await repository.save(user);

      console.log("Usuario cadastrado com sucesso!");

      const userWithoutPassword = this.omitSenha(savedUser);

      return userWithoutPassword;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Falha ao cadastrar usuario. Motivo: ${error.message}`);
      } else {
        throw error;
      }
    }
  }

  public async login(email: string, senha: string): Promise<UsuarioCriadoDTO> {
    try {
      const repository = new UsuarioRepository();
      const user = await repository.findByEmail(email);

      if (!user) throw new Error("Email ou senha invalido(a)");

      const hash = user.senha;
      const match = await compare(senha, hash);
      if (!match) throw new Error("Email ou senha invalido(a)");

      console.log("Usuario logado com sucesso!");

      const userWithoutPassword = this.omitSenha(user);

      return userWithoutPassword;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Falha ao executar Login. Motivo: ${error.message}`);
      } else {
        throw error;
      }
    }
  }

  public async update(data: AlterarUsuarioDTO): Promise<UsuarioCriadoDTO> {
    try {
      const { email } = data;

      const updateFields = Object.keys(data);
      const repository = new UsuarioRepository();

      const userAlreadyExists = await repository.findByEmail(email);
      if (!userAlreadyExists) throw new Error("Email nao esta cadastrado");

      if (data.hasOwnProperty("senha")) {
        data.senha = await hash(data.senha, 8);
      }

      updateFields.forEach((prop) => (userAlreadyExists[prop] = data[prop]));

      const savedUser = await repository.save(userAlreadyExists);

      console.log("Usuario atualizado com sucesso!");

      const userWithoutPassword = this.omitSenha(savedUser);

      return userWithoutPassword;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Falha ao atualizar usuario. Motivo: ${error.message}`);
      } else {
        throw error;
      }
    }
  }

  public async delete(email: string, senha: string): Promise<UsuarioCriadoDTO> {
    try {
      const repository = new UsuarioRepository();
      const user = await repository.findByEmail(email);

      if (!user) throw new Error("Email ou senha invalido(a)");

      const hash = user.senha;
      const match = await compare(senha, hash);
      if (!match) throw new Error("Email ou senha invalido(a)");

      const deletedUser = await repository.remove(user);

      console.log("Usuario removido com sucesso!");

      const userWithoutPassword = this.omitSenha(deletedUser);

      return userWithoutPassword;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Falha ao remover usuario. Motivo: ${error.message}`);
      } else {
        throw error;
      }
    }
  }

  private omitSenha(data: UsuarioDTO): UsuarioCriadoDTO {
    const { senha, ...UsuarioCriadoDTO } = data;

    return UsuarioCriadoDTO;
  }

  private validateData(data: AlterarUsuarioDTO): void {
    const { nome, email, senha } = data;

    const isEmailValid = validateEmail(email);

    if (!isEmailValid) throw new Error("Email invalido");
    if (!nome.trim()) throw new Error("Nome invalido");
    if (!senha.trim()) throw new Error("Senha invalida");
  }

  private factory(data: UsuarioDTO, passwordHash?: string): Usuario {
    const user = new Usuario();

    user.nome = data.nome;
    user.email = data.email;
    user.senha = passwordHash ? passwordHash : data.senha;
    user.avatarUrl = data.avatarUrl;

    if (data.hasOwnProperty("ativo")) user.ativo = data.ativo;

    return user;
  }
}

// void new UsuarioService().create({
//   nome: "awodkaow",
//   email: "awokdaw",
//   senha: "aowkdaw",
//   avatarUrl: "aodkawodk",
// });
