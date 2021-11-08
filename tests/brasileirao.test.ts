describe.skip("Brasileirao API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // test("Busca detalhes de uma rodada", async () => {
  //   const NUMERO_RODADA = 2;

  //   jest.spyOn(Brasileirao.prototype, "gerarRodadas").mockResolvedValue(null);

  //   jest
  //     .spyOn(JSONRodadasRepository.prototype, "findByNumeroRodada")
  //     .mockImplementation(
  //       async (numeroRodada) => await Promise.resolve(new Rodada(numeroRodada))
  //     );

  //   const brasileiraoService = new Brasileirao();

  //   const result = await brasileiraoService.getRodada(NUMERO_RODADA);

  //   expect(result).toBeInstanceOf(Rodada);
  //   expect(result.getNumeroRodada()).toBe(NUMERO_RODADA);
  // });
});
