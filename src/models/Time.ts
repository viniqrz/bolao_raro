export default class Time {
  protected readonly id: number;
  protected readonly nome: string;
  protected readonly sigla: string;
  protected readonly escudo: string;

  public constructor(id: number, nome: string, sigla: string, escudo: string) {
    this.id = id;
    this.nome = nome;
    this.sigla = sigla;
    this.escudo = escudo;
  }

  public getId(): number {
    return this.id;
  }

  public getNome(): string {
    return this.nome;
  }

  public getSigla(): string {
    return this.sigla;
  }

  public getEscudo(): string {
    return this.escudo;
  }
}
