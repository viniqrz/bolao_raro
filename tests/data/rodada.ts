import { APIDetalhesRodada } from "../../src/@types/dtos/api/brasileirao";
import { DUMMY_PARTIDA_DATA, DUMMY_PARTIDA } from "./partida";
import { Rodada } from "../../src/models/RodadaEntity";

const DUMMY_NAME = "Rodada 1";
const DUMMY_SLUG = "rodada-1";
const DUMMY_RODADA_STATUS = "encerrada";
const DUMMY_RODADA_RODADA = 1;
const DUMMY_MATCHES = [DUMMY_PARTIDA_DATA];

export const DUMMY_DATA: APIDetalhesRodada = {
  nome: DUMMY_NAME,
  slug: DUMMY_SLUG,
  rodada: DUMMY_RODADA_RODADA,
  status: DUMMY_RODADA_STATUS,
  partidas: DUMMY_MATCHES,
};

const rodadaKeys = Object.keys(DUMMY_DATA);

export const DUMMY_RODADA = new Rodada();

rodadaKeys.forEach((k) => {
  DUMMY_RODADA[k] = DUMMY_DATA[k] as Array<keyof typeof DUMMY_DATA>;
});

DUMMY_RODADA.partidas = [DUMMY_PARTIDA];
