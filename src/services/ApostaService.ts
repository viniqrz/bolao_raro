import { IApostaRepository } from "../repositories/IApostaRepository";
import { PalpiteDTO } from "../@types/dtos/palpiteDto";
import { Aposta } from "../models/ApostaEntity";
import { serviceFactory } from "../helpers/serviceFactory";
import { Usuario } from "../models/UsuarioEntity";
import { Partida } from "../models/PartidaEntity";
import { Rodada } from "../models/RodadaEntity";

interface IApostaService {
  createMany(
    usuarioId: number,
    rodada: number,
    palpites: PalpiteDTO[]
  ): Promise<Aposta[]>;
}

export class ApostaService implements IApostaService {
  constructor(private apostaRepository: IApostaRepository) {}

  public async createMany(
    usuarioId: number,
    rodada: number,
    palpites: PalpiteDTO[]
  ): Promise<Aposta[]> {
    try {
      const hasDuplicate = this.checkForDuplicate(palpites);
      if (hasDuplicate) throw new Error("Possui mais de um palpite por partida");

      const apostas = await this
        .apostaRepository
        .findByUserIdAndRodada(usuarioId, rodada);

      const hasAlreadyBet = this.checkIfUserAlreadyBet(palpites, apostas);
      if (hasAlreadyBet) throw new Error("Usuário já apostou em partida");
      
      const dbRodada = await serviceFactory.rodada().getRodada(rodada);
      if (dbRodada.status === "encerrada") throw new Error("Rodada encerrada");

      const matchesBelongsToRodada = this
        .checkIfMatchesBelongToRodada(dbRodada, palpites);

      if (!matchesBelongsToRodada) throw new Error("Partida não pertence a rodada");

      const usuario = await serviceFactory.usuario().getUser(usuarioId);

      const apostaPromises = palpites.map((p) => this.createOne(usuario, dbRodada, p));

      return await Promise.all(apostaPromises);
    } catch(error) {
      throw new Error(`Falha ao criar apostas: ${error.message}.`)
    }
  }

  private async createOne(
    usuario: Usuario,
    rodada: Rodada,
    palpite: PalpiteDTO
  ): Promise<Aposta> {
    const savedPartida = await serviceFactory
      .partida()
      .getPartida(palpite.partidaId);

    const rodadaPartida = savedPartida.rodada.rodada;
    if (rodadaPartida !== rodada.rodada)
      throw new Error("Partida não pertence a rodada");

    const aposta = this.apostaFactory(savedPartida, usuario, rodada, palpite);

    return await this.apostaRepository.save(aposta);
  }

  private apostaFactory(
    partida: Partida,
    usuario: Usuario,
    rodada: Rodada,
    palpite: PalpiteDTO
  ): Aposta {
    const aposta = new Aposta();

    aposta.usuario = usuario;
    aposta.placarMandante = palpite.placarMandante;
    aposta.placarVisitante = palpite.placarVisitante;
    aposta.rodada = rodada;
    aposta.partida = partida;

    return aposta;
  }

  private checkIfMatchesBelongToRodada(
    rodada: Rodada, palpites: PalpiteDTO[],
  ): boolean {
    const { partidas } = rodada;
    return palpites.every((palpite) => {
      const hasBet = partidas.every((p) => p.id === palpite.partidaId);

      return hasBet;
    });
  }

  private checkIfUserAlreadyBet(
    palpites: PalpiteDTO[],
    apostas: Aposta[]
  ): boolean {
    return palpites.some((palpite) => {
      const hasBet = apostas.some((a) => a.partida.id === palpite.partidaId);

      return hasBet;
    });
  }

  private checkForDuplicate(palpites: PalpiteDTO[]): boolean {
    return palpites.some((palpite, index) => {
      const hasTwoBetsInOneMatch = palpites.some(
        (p, i) => p.partidaId === palpite.partidaId && index !== i
      );

      return hasTwoBetsInOneMatch;
    });
  }
}
