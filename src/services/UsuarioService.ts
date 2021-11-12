import { hash, compare } from "bcrypt";
import { sign } from "jsonwebtoken";

import "dotenv/config";

import {
  AlterarUsuarioDTO,
  UsuarioCriadoDTO,
  UsuarioDTO,
  UsuarioLogadoDTO,
} from "../@types/dtos/usuarioDto";
import { Usuario } from "../models/UsuarioEntity";

import { IUsuarioRepository } from "../repositories/IUsuarioRepository";

import validateEmail from "../helpers/validateEmail";

interface IUsuarioService {
  create(data: UsuarioDTO): Promise<UsuarioCriadoDTO>;
  authenticate(email: string, senha: string): Promise<UsuarioLogadoDTO>;
  update(email: string, data: AlterarUsuarioDTO): Promise<UsuarioCriadoDTO>;
  delete(email: string, senha: string): Promise<UsuarioCriadoDTO>;
}

export class UsuarioService implements IUsuarioService {
  constructor(private usuarioRepository: IUsuarioRepository) {}

  public async create(data: UsuarioDTO): Promise<UsuarioCriadoDTO> {
    try {
      const { email, senha } = data;

      this.validateData(data);

      const userAlreadyExists = await this.usuarioRepository.findByEmail(email);

      if (userAlreadyExists) throw new Error("Email já está cadastrado");

      const passwordHash = await hash(senha, 8);
      const user = this.factory(data, passwordHash);
      const savedUser = await this.usuarioRepository.save(user);

      const userWithoutPassword = this.omitSenha(savedUser);

      console.log("Usuario cadastrado com sucesso!");

      return userWithoutPassword;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Falha ao cadastrar usuario. Motivo: ${error.message}`);
      } else {
        throw error;
      }
    }
  }

  public async authenticate(
    email: string,
    senha: string
  ): Promise<UsuarioLogadoDTO> {
    try {
      const user = await this.usuarioRepository.findByEmail(email);

      if (!user) throw new Error("Email ou senha invalido(a)");

      const hash = user.senha;
      const match = await compare(senha, hash);
      if (!match) throw new Error("Email ou senha invalido(a)");

      console.log("Usuario logado com sucesso!");

      const userWithoutPassword = this.omitSenha(user);

      const token = sign(
        {
          data: userWithoutPassword,
        },
        process.env.JWT_TOKEN,
        { expiresIn: "6h" }
      );

      return { user: userWithoutPassword, token };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Falha ao executar Login. Motivo: ${error.message}`);
      } else {
        throw error;
      }
    }
  }

  public async getUser(id: number): Promise<Usuario> {
    return await this.usuarioRepository.findById(id);
  }

  // Updates user (can also inativate by updating ativo column)
  public async update(
    email: string,
    data: AlterarUsuarioDTO
  ): Promise<UsuarioCriadoDTO> {
    try {
      const user = await this.usuarioRepository.findByEmail(email);

      if (!user) throw new Error("Email incorreto");

      const newUser = { ...user, ...data };
      const { senha } = newUser;

      if (data.hasOwnProperty("senha")) newUser.senha = await hash(senha, 8);

      const saved = await this.usuarioRepository.save(newUser);
      const userWithoutPassword = this.omitSenha(saved);

      console.log("Usuario atualizado com sucesso!");

      return userWithoutPassword;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Falha ao atualizar usuario. Motivo: ${error.message}`);
      } else {
        throw error;
      }
    }
  }

  public async delete(email: string): Promise<UsuarioCriadoDTO> {
    try {
      const user = await this.usuarioRepository.findByEmail(email);

      const deletedUser = await this.usuarioRepository.remove(user);

      console.log("Usuario removido com sucesso!");

      const userWithoutPassword = this.omitSenha(deletedUser);

      return userWithoutPassword;
    } catch (error) {
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
