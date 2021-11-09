import {
  Column,
  Entity,
  OneToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Rodada } from "./RodadaEntity";
import { Time } from "./TimeEntity";
import { Aposta } from "./ApostaEntity";

@Entity()
export class Partida {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, length: 80 })
  placar: string;

  @Column({ nullable: true })
  placarMandante: number;

  @Column({ nullable: true })
  placarVisitante: number;

  @Column({ nullable: false, length: 50 })
  status: string;

  @Column({ nullable: false, length: 50 })
  slug: string;

  @Column({ nullable: true })
  dataRealizacao: Date;

  @ManyToOne(() => Time, { cascade: true })
  mandante: Time;

  @ManyToOne(() => Time, { cascade: true })
  visitante: Time;

  @ManyToOne(() => Rodada, (rodada) => rodada.partidas)
  rodada: Rodada;

  @OneToMany(() => Aposta, (aposta) => aposta.partida)
  apostas: Aposta[];
}
