import JSONRodadasRepository from "../repositories/JSONRodadasRepository";

export default class Placar {
  public async update(): Promise<void> {
    const repository = new JSONRodadasRepository();
    const rodadas = await repository.findAll();
  }
}
