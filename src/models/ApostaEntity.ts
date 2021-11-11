import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Partida } from "./PartidaEntity";
import { Rodada } from "./RodadaEntity";
import { Usuario } from "./UsuarioEntity";

@Entity()
export class Aposta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  placarMandante: number;

  @Column({ nullable: false })
  placarVisitante: number;

  @ManyToOne(() => Usuario, (usuario) => usuario.apostas)
  usuario: Usuario;

  @ManyToOne(() => Rodada, (rodada) => rodada.apostas)
  rodada: Rodada;

  @ManyToOne(() => Partida, (partida) => partida.apostas)
  partida: Partida;
}
