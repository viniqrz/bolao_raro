import { CampeonatoClient } from "../src/clients/CampeonatoClient";

import { TimeRepository } from "../src/repositories/TimeRepository";
import { TimeService } from "../src/services/TimeService";

import {
  DUMMY_API_POSICAO_1,
  DUMMY_API_POSICAO_2,
  DUMMY_TEAM_1,
  DUMMY_TEAM_2,
} from "./data/time";

const DUMMY_TEAMS = [DUMMY_TEAM_1, DUMMY_TEAM_2];

describe("TimeService", () => {
  const mockFindByName = async (nome) => {
    return Promise.resolve(DUMMY_TEAMS.find((t) => t.nome === nome));
  };

  describe("01 - Atualização dos times", () => {
    test("Atualiza times", async () => {
      jest
        .spyOn(CampeonatoClient.prototype, "buscarTabela")
        .mockResolvedValue([DUMMY_API_POSICAO_1, DUMMY_API_POSICAO_2]);

      jest
        .spyOn(TimeRepository.prototype, "findByName")
        .mockImplementation(mockFindByName);

      const client = new CampeonatoClient();
      const repository = new TimeRepository();
      const service = new TimeService(repository, client);

      const result = await service.updateAllFromApi(999);

      expect(result).toMatchObject(DUMMY_TEAMS);
    });
  });
});
