import { Usuario } from "../models/UsuarioEntity";
import { EntityRepository, Repository, UpdateResult } from "typeorm";
import { IUsuarioRepository } from "./IUsuarioRepository";
import { AlterarUsuarioDTO } from "../@types/dtos/usuarioDto";

@EntityRepository(Usuario)
export class UsuarioRepository
  extends Repository<Usuario>
  implements IUsuarioRepository
{
  async findByEmail(email: string): Promise<Usuario> {
    return await this.findOne({ where: { email } });
  }

  async findById(id: number) {
    return await this.findOne(id);
  }
}
