import { CampeonatoClient } from "../src/clients/CampeonatoClient";
import { serviceFactory } from "../src/helpers/serviceFactory";
import { Aposta } from "../src/models/ApostaEntity";
import { DeepPartial, SaveOptions } from "typeorm";

import { UsuarioRepository } from "../src/repositories/UsuarioRepository";
import { PartidaRepository } from "../src/repositories/PartidaRepository";
import { RodadaRepository } from "../src/repositories/RodadaRepository";
import { ApostaRepository } from "../src/repositories/ApostaRepository";
import { UsuarioService } from "../src/services/UsuarioService";
import { PartidaService } from "../src/services/PartidaService";
import { RodadaService } from "../src/services/RodadaService";
import { ApostaService } from "../src/services/ApostaService";

import { DUMMY_PALPITE, DUMMY_APOSTA } from "./data/aposta";
import { DUMMY_PARTIDA } from "./data/partida";
import { DUMMY_RODADA } from "./data/rodada";
import { DUMMY_USER } from "./data/usuario";

describe("ApostaService", () => {
  const repository = new ApostaRepository();
  const service = new ApostaService(repository);

  const client = new CampeonatoClient();
  const rodadaRepository = new RodadaRepository();
  const rodadaService = new RodadaService(rodadaRepository, client);

  const usuarioRepository = new UsuarioRepository();
  const usuarioService = new UsuarioService(usuarioRepository);

  const partidaRepository = new PartidaRepository();
  const partidaService = new PartidaService(partidaRepository);

  jest.spyOn(serviceFactory, "rodada").mockReturnValue(rodadaService);
  jest.spyOn(serviceFactory, "usuario").mockReturnValue(usuarioService);
  jest.spyOn(serviceFactory, "partida").mockReturnValue(partidaService);

  describe("1.0 - Criação de Apostas", () => {
    test("1.1 - Rejeita aposta com mais de um palpite por partida", async () => {
      await expect(async () => {
        await service.createMany(1, 1, [DUMMY_PALPITE, DUMMY_PALPITE]);
      }).rejects.toThrow(
        "Falha ao criar apostas: Possui mais de um palpite por partida."
      );
    });

    test("1.2 - Rejeita aposta em partida que o usuário já apostou", async () => {
      jest
        .spyOn(ApostaRepository.prototype, "findByUserIdAndRodada")
        .mockResolvedValueOnce([DUMMY_APOSTA]);

      const palpiteWithDuplicate = {
        ...DUMMY_PALPITE,
        partidaId: DUMMY_PARTIDA.id,
      };

      await expect(async () => {
        await service.createMany(1, DUMMY_RODADA.rodada, [
          palpiteWithDuplicate,
        ]);
      }).rejects.toThrow(
        "Falha ao criar apostas: Usuário já apostou em partida."
      );
    });

    test("1.3 - Rejeita aposta em rodada encerrada", async () => {
      jest
        .spyOn(ApostaRepository.prototype, "findByUserIdAndRodada")
        .mockResolvedValueOnce([DUMMY_APOSTA]);

      jest
        .spyOn(RodadaService.prototype, "getRodada")
        .mockResolvedValueOnce(DUMMY_RODADA);

      await expect(async () => {
        await service.createMany(1, 1, [DUMMY_PALPITE]);
      }).rejects.toThrow("Falha ao criar apostas: Rodada encerrada.");
    });

    test("1.4 - Rejeita aposta em partida que não pertence a rodada", async () => {
      const rodadaAgendada = { ...DUMMY_RODADA, status: "agendada" };

      jest
        .spyOn(ApostaRepository.prototype, "findByUserIdAndRodada")
        .mockResolvedValueOnce([DUMMY_APOSTA]);

      jest
        .spyOn(RodadaService.prototype, "getRodada")
        .mockResolvedValueOnce(rodadaAgendada);

      await expect(async () => {
        await service.createMany(1, 1, [DUMMY_PALPITE]);
      }).rejects.toThrow(
        "Falha ao criar apostas: Partida não pertence a rodada."
      );
    });

    test("1.5 - Cria aposta com sucesso", async () => {
      const rodadaAgendada = { ...DUMMY_RODADA, status: "agendada" };
      const palpiteWithCorrectId = {
        ...DUMMY_PALPITE,
        partidaId: DUMMY_PARTIDA.id,
      };

      jest
        .spyOn(ApostaRepository.prototype, "findByUserIdAndRodada")
        .mockResolvedValueOnce([]);

      jest
        .spyOn(RodadaService.prototype, "getRodada")
        .mockResolvedValueOnce(rodadaAgendada);

      jest
        .spyOn(UsuarioService.prototype, "getUser")
        .mockResolvedValue(DUMMY_USER);

      jest
        .spyOn(PartidaService.prototype, "getPartida")
        .mockResolvedValue(DUMMY_PARTIDA);

      jest
        .spyOn(ApostaRepository.prototype, "save")
        .mockImplementation(async (entity: Aposta, options?: SaveOptions) => {
          return await Promise.resolve(entity as DeepPartial<Aposta> & Aposta);
        });

      const result = await service.createMany(DUMMY_USER.id, 1, [
        palpiteWithCorrectId,
      ]);

      const [r1] = result;

      expect(result.length).toBe(1);

      expect(r1.rodada.rodada).toBe(1);
      expect(r1.placarMandante).toBe(DUMMY_PALPITE.placarMandante);
      expect(r1.placarVisitante).toBe(DUMMY_PALPITE.placarVisitante);
    });
  });
});
