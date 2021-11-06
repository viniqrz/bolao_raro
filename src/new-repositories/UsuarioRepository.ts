import { Usuario } from "../entity/UsuarioEntity";
import { EntityRepository, Repository } from "typeorm";

export interface IUsuarioRepository {
  findById(id: number): Promise<Usuario> | undefined;
  findByEmail(email: string): Promise<Usuario> | undefined;
  save(usuario: Usuario): Promise<Usuario>;
}

@EntityRepository(Usuario)
export class UsuarioRepository
  extends Repository<Usuario>
  implements IUsuarioRepository
{
  async findById(id: number): Promise<Usuario> {
    return await this.findOne(id);
  }

  async findByEmail(email: string): Promise<Usuario> {
    return await this.findOne({ where: { email } });
  }
}
