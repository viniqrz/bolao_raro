import { PartidaRepository } from "../src/repositories/PartidaRepository";
import { RodadaRepository } from "../src/repositories/RodadaRepository";
import { CampeonatoClient } from "../src/clients/CampeonatoClient";
import { PartidaService } from "../src/services/PartidaService";
import { serviceFactory } from "../src/helpers/serviceFactory";
import { RodadaService } from "../src/services/RodadaService";
import { APIRodada } from "../src/@types/dtos/api/brasileirao";

import { DUMMY_DATA, DUMMY_RODADA } from "./data/rodada";
import { DUMMY_CAMPEONATO } from "./data/campeonato";
import { DUMMY_PARTIDA } from "./data/partida";

describe("RodadaService", () => {
  describe("1.0 - Atualização de rodadas com dados da API", () => {
    test("1.1 - Atualiza dados da Rodada a partir da API", async () => {
      const partidaRepository = new PartidaRepository();
      const partidaService = new PartidaService(partidaRepository);
      const DUMMY_PARTIDAS = [DUMMY_PARTIDA];

      jest.spyOn(serviceFactory, "partida").mockReturnValue(partidaService);

      jest
        .spyOn(CampeonatoClient.prototype, "buscarDetalhesRodada")
        .mockResolvedValue(DUMMY_DATA);
      jest
        .spyOn(RodadaRepository.prototype, "findByNumeroRodada")
        .mockResolvedValue(DUMMY_RODADA);
      jest
        .spyOn(CampeonatoClient.prototype, "buscarRodadas")
        .mockResolvedValue([{ rodada: 1 }] as APIRodada[]);
      jest
        .spyOn(PartidaService.prototype, "updateAll")
        .mockResolvedValue(DUMMY_PARTIDAS);
      jest
        .spyOn(RodadaRepository.prototype, "save")
        .mockResolvedValue(DUMMY_RODADA);

      const client = new CampeonatoClient();
      const repository = new RodadaRepository();
      const service = new RodadaService(repository, client);

      const result = await service.updateAllFromApi(DUMMY_CAMPEONATO);

      expect(result).toMatchObject([DUMMY_RODADA]);
    });
  });
});
