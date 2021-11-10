import { Aposta } from "../models/ApostaEntity";

export interface IApostaRepository {
  save(aposta: Aposta): Promise<Aposta>;
  findByRodadaAndUser(rodada: number, usuarioId: number): Promise<Aposta[]>;
  findByUserId(usuarioId: number): Promise<Aposta[]>;
}
