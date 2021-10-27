import Time from "./Time";

export default class Jogo {
  protected static lista: Jogo[] = [];
  protected readonly id: number;
  protected readonly dataHora: Date;
  protected readonly mandante: Time;
  protected readonly visitante: Time;
  protected golsMandante: number;
  protected golsVisitante: number;
  // Criar um mecanismo que crie um id a
  // cada novo jogo sem que eu passe o id no construtor.
  // vai ser necessário uma variável estática para isso. // static.

  public constructor(
    mandante: Time,
    visitante: Time,
    dataHora: Date,
    golsMandante: number,
    golsVisitante: number
  ) {
    this.id = Jogo.lista.length;
    this.mandante = mandante;
    this.visitante = visitante;
    this.dataHora = dataHora;
    this.golsMandante = golsMandante;
    this.golsVisitante = golsVisitante;

    Jogo.lista = [...Jogo.lista, this];
  }

  public getMandante(): Time {
    return this.mandante;
  }

  public getVisitante(): Time {
    return this.visitante;
  }

  public getId(): number {
    return this.id;
  }

  public getGolsMandante(): number {
    return this.golsMandante;
  }

  public getGolsVisitante(): number {
    return this.golsVisitante;
  }

  public getDataHora(): Date {
    return this.dataHora;
  }

  public static getLista(): Jogo[] {
    return Jogo.lista;
  }

  public atualizaResultado(golsMandante: number, golsVisitante: number): void {
    this.golsMandante = golsMandante;
    this.golsVisitante = golsVisitante;
  }
}
