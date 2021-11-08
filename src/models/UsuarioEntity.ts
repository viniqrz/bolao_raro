import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Aposta } from "./ApostaEntity";
import { Campeonato } from "./CampeonatoEntity";
import { Endereco } from "./EnderecoEntity";

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  nome: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  senha: string;

  @Column({ length: 500 })
  avatarUrl: string;

  @Column({ default: true })
  ativo: boolean;

  @OneToOne(() => Endereco, (endereco) => endereco.usuario, {
    cascade: true,
  })
  endereco: Endereco;

  @OneToMany(() => Aposta, (aposta) => aposta.usuario)
  apostas: Aposta[];

  @ManyToMany(() => Campeonato, (campeonato) => campeonato.usuarios)
  @JoinTable()
  campeonatos: Campeonato[];
}
