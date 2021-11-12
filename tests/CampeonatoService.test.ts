import { CampeonatoRepository } from "../src/repositories/CampeonatoRepository";
import { CampeonatoService } from "../src/services/CampeonatoService";

import { DUMMY_CAMPEONATO, DUMMY_DATA } from "./data/campeonato";

describe("CampeonatoService", () => {
  describe("01 - Cadastro de campeonato", () => {
    test("Cadastra campeonato com sucesso", async () => {
      jest
        .spyOn(CampeonatoRepository.prototype, "save")
        .mockResolvedValue(DUMMY_CAMPEONATO);

      const repository = new CampeonatoRepository();
      const service = new CampeonatoService(repository);
      const result = await service.create(DUMMY_DATA);

      expect(result).toMatchObject(DUMMY_CAMPEONATO);
    });
  });
});
