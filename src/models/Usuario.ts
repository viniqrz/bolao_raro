import Rodada from "./Rodada";
import Jogo from "./Jogo";
import ApostaRodada from "./ApostaRodada";
import ApostaJogo, { Palpite } from "./ApostaJogo";

/** O usuário do sistema que fará as apostas */
export default class Usuario {
  protected nome: string;
  protected readonly email: string;
  protected senha: string;

  constructor(nome: string, email: string, senha: string) {
    this.nome = nome;
    this.email = email;
    this.senha = senha;
  }

  public aposta(rodada: Rodada, palpites: Palpite[]): ApostaRodada {
    const apostas = palpites.map((palpite) => {
      const { jogoId, golsMandante, golsVisitante } = palpite;
      const listaJogos: Jogo[] = Jogo.getLista();
      const jogo: Jogo = listaJogos.find((el) => el.getId() === jogoId);

      return new ApostaJogo(this, jogo, golsMandante, golsVisitante);
    });

    return new ApostaRodada(this, rodada, apostas);
  }

  public getEmail(): string {
    return this.email;
  }

  public getSenha(): string {
    // @todo
    return this.senha;
  }
}
