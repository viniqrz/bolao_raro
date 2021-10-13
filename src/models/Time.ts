export default class Time {
  protected readonly id: number;
  protected readonly nome: string;
  protected readonly estado: string;

  public constructor(id: number, nome: string, estado: string) {
    this.id = id;
    this.nome = nome;
    this.estado = estado;
  }

  public getNome(): string {
    return this.nome;
  }

  public getId(): number {
    return this.id;
  }

  public getEstado(): string {
    return this.estado;
  }
}
