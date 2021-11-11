import { Aposta } from "../models/ApostaEntity";

export interface IApostaRepository {
  save(aposta: Aposta): Promise<Aposta>;
  findByUserIdAndRodada(usuarioId: number, rodada: number): Promise<Aposta[]>;
}
