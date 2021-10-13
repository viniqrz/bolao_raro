import Jogo from "./Jogo";
import Usuario from "./Usuario";

export type Palpite = {
  jogoId: number;
  golsMandante: number;
  golsVisitante: number;
};

export default class ApostaJogo {
  protected readonly usuario: Usuario;
  protected readonly jogo: Jogo;
  protected readonly golsMandante: number;
  protected readonly golsVisitante: number;
  protected pontos?: number;

  public constructor(
    usuario: Usuario,
    jogo: Jogo,
    golsMandante: number,
    golsVisitante: number
  ) {
    this.usuario = usuario;
    this.jogo = jogo;
    this.golsMandante = golsMandante;
    this.golsVisitante = golsVisitante;
  }

  public getJogo(): Jogo {
    return this.jogo;
  }

  public getGolsMandante(): number {
    return this.golsMandante;
  }

  public getGolsVisitante(): number {
    return this.golsVisitante;
  }

  /**
   * Compara a aposta do usuário com o resultado do jogo e
   * atualiza a quantidade de pontos feitos.
   *
   * @return Valor dos pontos feitos pelo usuário na aposta do jogo associado.
   */

  public atualizaPontuacao(): number {
    const resultadoGolsMandante = this.jogo.getGolsMandante();
    const resultadoGolsVisitante = this.jogo.getGolsVisitante();

    const acertouMandante = this.golsMandante === resultadoGolsMandante;
    const acertouVisitante = this.golsVisitante === resultadoGolsVisitante;
    const acertouResultado = acertouMandante && acertouVisitante;

    const apostaEmpate = this.golsMandante === this.golsVisitante;
    const resultadoEmpate = resultadoGolsMandante === resultadoGolsVisitante;
    const acertouEmpate = apostaEmpate && resultadoEmpate;

    const apostaVitoriaMandante =
      this.golsMandante > this.golsVisitante && !apostaEmpate;
    const resultadoVitoriaMandante =
      resultadoGolsMandante > resultadoGolsVisitante && !resultadoEmpate;

    const acertouVitoriaMandante =
      apostaVitoriaMandante && resultadoVitoriaMandante && !apostaEmpate;
    const acertouVitoriaVisitante =
      !apostaVitoriaMandante && !resultadoVitoriaMandante && !apostaEmpate;

    let pontos = 0;

    if (acertouMandante) pontos += 3;
    if (acertouVisitante) pontos += 3;

    if (
      acertouResultado ||
      acertouEmpate ||
      acertouVitoriaMandante ||
      acertouVitoriaVisitante
    )
      pontos += 6;

    this.pontos = pontos;
    return this.pontos;
  }
}
