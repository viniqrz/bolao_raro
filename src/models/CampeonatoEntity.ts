import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  OneToMany,
} from "typeorm";
import { Rodada } from "./RodadaEntity";
import { Usuario } from "./UsuarioEntity";

@Entity()
export class Campeonato {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, length: 50, unique: true })
  nome: string;

  @Column({ nullable: false, length: 50, unique: true })
  slug: string;

  @Column({ nullable: false, length: 50, unique: true })
  nomePopular: string;

  @Column({ nullable: false, length: 50 })
  status: string;

  @Column({ nullable: false, length: 500 })
  logo: string;

  @Column({ nullable: false })
  idCampeonatoApiExterna: number;

  @ManyToMany(() => Usuario)
  usuarios: Usuario[];

  @OneToMany(() => Rodada, (rodada) => rodada.campeonato)
  rodadas: Rodada[];
}
