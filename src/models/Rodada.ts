import Jogo from "./Jogo";

export default class Rodada {
  protected jogos: Jogo[];
  protected readonly numeroRodada: number;

  public constructor(numeroRodada: number, jogos?: Jogo[]) {
    this.numeroRodada = numeroRodada;
    this.jogos = jogos || [];
  }

  public addJogo(jogo: Jogo): void {
    this.jogos = [...this.jogos, jogo];
  }

  public getJogos(): Jogo[] {
    return this.jogos;
  }

  public getJogoById(jogoId: number): Jogo {
    return this.jogos.find((jogo) => jogo.getId() === jogoId);
  }

  public getHorarioLimiteAposta(): Date {
    return this.jogos.reduce((acc, cur) => {
      const dataHora = cur.getDataHora();
      if (dataHora <= acc) return dataHora;
      return acc;
    }, new Date());
  }

  getNumeroRodada(): number {
    return this.numeroRodada;
  }
}
