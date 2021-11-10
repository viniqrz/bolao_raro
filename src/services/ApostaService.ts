import { IApostaRepository } from "../repositories/IApostaRepository";
import { PalpiteDTO } from "../@types/dtos/palpiteDto";
import { Aposta } from "../models/ApostaEntity";
import { serviceFactory } from "../helpers/serviceFactory";
import { Usuario } from "../models/UsuarioEntity";
import { Partida } from "../models/PartidaEntity";

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
    const hasDuplicate = this.checkForDuplicate(palpites);
    if (hasDuplicate) throw new Error("Possui mais de um palpite por partida");

    const apostas = await this.apostaRepository.findByUserId(usuarioId);

    const hasAlreadyBet = this.checkIfUserAlreadyBet(palpites, apostas);
    if (hasAlreadyBet) throw new Error("Usuário já apostou em partida");

    const usuario = await serviceFactory.usuario().getUser(usuarioId);

    const apostaPromises = palpites.map((p) => this.createOne(usuario, p));

    return await Promise.all(apostaPromises);
  }

  private async createOne(
    usuario: Usuario,
    palpite: PalpiteDTO
  ): Promise<Aposta> {
    const savedBartida = await serviceFactory
      .partida()
      .getPartida(palpite.partidaId);

    const aposta = this.apostaFactory(usuario, savedBartida, palpite);

    return await this.apostaRepository.save(aposta);
  }

  private apostaFactory(
    usuario: Usuario,
    partida: Partida,
    palpite: PalpiteDTO
  ): Aposta {
    const aposta = new Aposta();

    aposta.usuario = usuario;
    aposta.placarMandante = palpite.placarMandante;
    aposta.placarVisitante = palpite.placarVisitante;

    return aposta;
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
