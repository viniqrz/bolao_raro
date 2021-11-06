import {
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  Column,
  OneToOne,
} from "typeorm";
import { Usuario } from "./UsuarioEntity";

@Entity()
export class Endereco {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, length: 50 })
  cep: string;

  @Column({ nullable: false, length: 50 })
  logradouro: string;

  @Column({ nullable: false, length: 50 })
  complemento: string;

  @Column({ nullable: false, length: 50 })
  numero: string;

  @Column({ nullable: false, length: 50 })
  bairro: string;

  @Column({ nullable: false, length: 50 })
  estado: string;

  @OneToOne(() => Usuario, (usuario) => usuario.endereco)
  @JoinColumn()
  usuario: Usuario;
}
