import Usuario from "./Usuario";
import ApostaJogo from "./ApostaJogo";
import Rodada from "./Rodada";

export default class ApostaRodada {
  protected readonly usuario: Usuario;
  protected readonly rodada: Rodada;
  protected readonly apostasJogos: ApostaJogo[];

  public constructor(
    usuario: Usuario,
    rodada: Rodada,
    apostasJogos: ApostaJogo[]
  ) {
    this.usuario = usuario;
    this.rodada = rodada;
    this.apostasJogos = apostasJogos;
  }

  /**
   * Atualiza a pontução de cada jogo na Rodada e retorna a pontuacão total do usuario.
   *
   * @return a pontuação do usuário na rodada
   */
  public atualizaPontuacao(): number {
    return this.apostasJogos.reduce((a, b) => a + b.atualizaPontuacao(), 0);
  }

  public getUsuario(): Usuario {
    return this.usuario;
  }

  public getRodada(): Rodada {
    return this.rodada;
  }

  public getApostasJogos(): ApostaJogo[] {
    return this.apostasJogos;
  }
}
